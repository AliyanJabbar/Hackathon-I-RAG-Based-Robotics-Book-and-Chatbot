import type { VercelRequest, VercelResponse } from '@vercel/node';

export async function proxyRequest(
  req: VercelRequest,
  res: VercelResponse,
  targetPath: string
) {
  const backendUrl = process.env.BACKEND_URL;

  if (!backendUrl) {
    return res
      .status(500)
      .json({ error: 'BACKEND_URL environment variable is not defined.' });
  }

  const targetUrl = `${backendUrl.replace(/\/$/, '')}/${targetPath.replace(/^\//, '')}`;

  // ----------------------------
  // HEADERS FORWARDING (SAFE)
  // ----------------------------
  const headers: Record<string, string> = {};

  for (const [key, value] of Object.entries(req.headers)) {
    if (!value) continue;

    const k = key.toLowerCase();

    // skip host (important)
    if (k === 'host') continue;

    // preserve auth explicitly
    if (k === 'authorization') {
      headers['authorization'] = Array.isArray(value)
        ? value.join(', ')
        : value;
      continue;
    }

    headers[k] = Array.isArray(value) ? value.join(', ') : value;
  }

  // ----------------------------
  // BODY HANDLING (SAFE)
  // ----------------------------
  let body: any = undefined;

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    const contentType = req.headers['content-type'] || '';

    if (contentType.includes('application/json')) {
      body =
        typeof req.body === 'string'
          ? req.body
          : JSON.stringify(req.body ?? {});
    } else if (contentType.includes('application/x-www-form-urlencoded')) {
      const params = new URLSearchParams();
      const data = typeof req.body === 'object' ? req.body : {};

      for (const [key, val] of Object.entries(data)) {
        params.append(key, String(val));
      }

      body = params.toString();
    } else {
      body = typeof req.body === 'string'
        ? req.body
        : JSON.stringify(req.body ?? {});
    }
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 55000);

    const response = await fetch(targetUrl, {
      method: req.method,
      headers,
      body,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const contentType = response.headers.get('content-type') || '';
    const status = response.status;

    // ----------------------------
    // READ RAW RESPONSE ALWAYS
    // ----------------------------
    const rawText = await response.text();

    console.log(`[PROXY] ${targetUrl}`);
    console.log(`[PROXY] STATUS: ${status}`);
    console.log(`[PROXY] CONTENT-TYPE: ${contentType}`);
    console.log(`[PROXY] RESPONSE SAMPLE:`, rawText.slice(0, 200));

    // ----------------------------
    // TRY PARSE JSON SAFELY
    // ----------------------------
    const isJson =
      contentType.includes('application/json') ||
      rawText.trim().startsWith('{') ||
      rawText.trim().startsWith('[');

    if (isJson) {
      try {
        const json = JSON.parse(rawText);

        res.setHeader('content-type', 'application/json');
        return res.status(status).json(json);
      } catch (err) {
        console.error(`[PROXY] JSON PARSE FAILED:`, rawText.slice(0, 500));

        return res.status(502).json({
          error: 'Backend returned invalid JSON',
          rawBody: rawText.slice(0, 500),
        });
      }
    }

    // fallback plain text
    res.setHeader('content-type', 'text/plain');
    return res.status(status).send(rawText);

  } catch (error: any) {
    console.error(`[PROXY ERROR] ${targetUrl}`, error);

    if (error.name === 'AbortError') {
      return res
        .status(504)
        .json({ error: 'Gateway Timeout: Backend did not respond in time.' });
    }

    return res.status(502).json({
      error: 'Bad Gateway: Failed to reach backend.',
      details: error.message,
    });
  }
}