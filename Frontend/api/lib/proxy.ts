import type { VercelRequest, VercelResponse } from '@vercel/node';

export async function proxyRequest(req: VercelRequest, res: VercelResponse, targetPath: string) {
  const backendUrl = process.env.BACKEND_URL;
  if (!backendUrl) {
    return res.status(500).json({ error: 'BACKEND_URL environment variable is not defined.' });
  }

  // Build the target URL
  const targetUrl = `${backendUrl.replace(/\/$/, '')}/${targetPath.replace(/^\//, '')}`;

  // Forward headers, excluding host
  const headers: Record<string, string> = {};
  for (const [key, value] of Object.entries(req.headers)) {
    if (value && key.toLowerCase() !== 'host') {
      headers[key] = Array.isArray(value) ? value.join(', ') : value;
    }
  }

  // Handle body
  let body: any = undefined;
  if (req.method !== 'GET' && req.method !== 'HEAD' && req.body !== undefined) {
    const contentType = req.headers['content-type'] || '';
    if (contentType.includes('application/json')) {
      body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
    } else if (contentType.includes('application/x-www-form-urlencoded')) {
      if (typeof req.body === 'string') {
        body = req.body;
      } else {
        const params = new URLSearchParams();
        for (const [key, val] of Object.entries(req.body)) {
          params.append(key, String(val));
        }
        body = params.toString();
      }
    } else {
      // Fallback/raw body (e.g. text/plain, buffer, etc.)
      body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
    }
  }

  try {
    const controller = new AbortController();
    // 55s timeout — stays within Vercel's 60s maxDuration window for LLM-heavy endpoints
    const timeoutId = setTimeout(() => controller.abort(), 55000);

    const response = await fetch(targetUrl, {
      method: req.method,
      headers,
      body,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // Get response headers, forward them (especially content-type)
    const resHeaders: Record<string, string> = {};
    response.headers.forEach((value, key) => {
      resHeaders[key] = value;
    });

    // Copy headers to the response
    for (const [key, value] of Object.entries(resHeaders)) {
      res.setHeader(key, value);
    }

    // Set status
    res.status(response.status);

    // Read body based on content type
    const contentType = resHeaders['content-type'] || '';
    if (contentType.includes('application/json')) {
      // Guard against the backend sending Content-Type: application/json
      // but returning a non-JSON body (e.g. NaN, Python repr strings, malformed output).
      const rawText = await response.text();
      try {
        const json = JSON.parse(rawText);
        return res.json(json);
      } catch (parseError) {
        console.error(
          `Proxy JSON parse error for ${targetUrl}. ` +
          `Backend returned Content-Type: application/json but body was not valid JSON.\n` +
          `Raw body (first 500 chars): ${rawText.slice(0, 500)}`
        );
        return res.status(502).json({
          error: 'Bad Gateway: Backend returned invalid JSON.',
          rawBody: rawText.slice(0, 500),
        });
      }
    } else {
      const text = await response.text();
      return res.send(text);
    }
  } catch (error: any) {
    console.error(`Proxy error for ${targetUrl}:`, error);
    if (error.name === 'AbortError') {
      return res.status(504).json({ error: 'Gateway Timeout: Backend did not respond in time.' });
    }
    return res.status(502).json({ error: 'Bad Gateway: Failed to reach backend.', details: error.message });
  }
}
