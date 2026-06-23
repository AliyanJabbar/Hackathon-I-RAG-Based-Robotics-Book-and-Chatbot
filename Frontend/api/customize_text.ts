import type { VercelRequest, VercelResponse } from '@vercel/node';
import { proxyRequest } from './lib/proxy';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  return proxyRequest(req, res, '/customize_text');
}
