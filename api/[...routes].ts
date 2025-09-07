import type { VercelRequest, VercelResponse } from '@vercel/node';
import app from '../src/app';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // Convert Vercel request to standard request
    const url = `https://${req.headers.host}${req.url}`;
    const method = req.method || 'GET';

    let body: string | undefined;
    if (method !== 'GET' && method !== 'HEAD' && req.body) {
      body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
    }

    const request = new Request(url, {
      method,
      headers: req.headers as HeadersInit,
      body,
    });

    // Handle with hono app
    const response = await app.fetch(request);

    // Convert response back to vercel format
    res.status(response.status);

    // Copy headers
    response.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });

    // Send body
    const responseBody = await response.text();
    res.send(responseBody);
  } catch (error) {
    console.error('Handler error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
