import type { IncomingMessage, ServerResponse } from 'http';

interface RequestWithBody extends IncomingMessage {
  body?: any;
  method?: string;
  query?: Record<string, string>;
  readableEnded?: boolean;
}

interface ResponseWithHelpers extends ServerResponse {
  status: (code: number) => ResponseWithHelpers;
  json: (data: any) => void;
  send: (body: any) => void;
}

export default async function handler(req: RequestWithBody, res: ResponseWithHelpers) {
  // 1. CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    res.end();
    return;
  }

  // 2. Resolve OpenAI API Key from server environment variables
  const apiKey = (
    process.env.OPENAI_API_KEY ||
    process.env.VITE_OPENAI_API_KEY ||
    process.env.NEXT_PUBLIC_OPENAI_API_KEY ||
    ''
  ).trim();

  // 3. GET Request: Diagnostic check
  if (req.method === 'GET') {
    const hasKey = apiKey.length > 10;
    const result = {
      status: 'ok',
      configured: hasKey,
      model: 'gpt-4o-mini',
      message: hasKey
        ? 'Server OpenAI Chat endpoint is configured and active.'
        : 'OPENAI_API_KEY is not configured in Vercel environment variables. Please add OPENAI_API_KEY to your Vercel Project Settings.'
    };

    if (res.status && res.json) return res.status(200).json(result);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(result));
    return;
  }

  // 4. POST Request: Chat Completion
  if (req.method !== 'POST') {
    const err = { error: 'Method Not Allowed' };
    if (res.status && res.json) return res.status(405).json(err);
    res.statusCode = 405;
    res.end(JSON.stringify(err));
    return;
  }

  // Parse Body safely
  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      body = {};
    }
  }

  if (!body && !req.readableEnded && typeof (req as any).on === 'function') {
    try {
      const chunks: Buffer[] = [];
      for await (const chunk of req) {
        chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
      }
      const raw = Buffer.concat(chunks).toString('utf-8');
      body = JSON.parse(raw || '{}');
    } catch {
      body = {};
    }
  }

  const clientApiKey = body?.apiKey;
  const effectiveKey = (apiKey || clientApiKey || '').trim();

  if (!effectiveKey || effectiveKey.length < 10) {
    const err = {
      error: 'OpenAI API key missing',
      category: 'MISSING_API_KEY',
      details: 'OPENAI_API_KEY is not configured in Vercel environment variables. Add OPENAI_API_KEY in Vercel Project Settings.'
    };
    console.error('[OpenAI Chat Server Error] Missing OPENAI_API_KEY in server environment variables.');
    if (res.status && res.json) return res.status(500).json(err);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(err));
    return;
  }

  const messages = body?.messages;
  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    const err = { error: 'Missing or empty messages array in request body' };
    if (res.status && res.json) return res.status(400).json(err);
    res.statusCode = 400;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(err));
    return;
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000); // 20s timeout

    const openAiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${effectiveKey}`
      },
      body: JSON.stringify({
        model: body?.model || 'gpt-4o-mini',
        messages,
        max_tokens: body?.max_tokens || 140,
        temperature: body?.temperature ?? 0.7
      }),
      signal: controller.signal
    });
    clearTimeout(timeout);

    if (!openAiRes.ok) {
      const errorText = await openAiRes.text();
      let category = 'OPENAI_API_ERROR';
      if (openAiRes.status === 401) category = 'INVALID_API_KEY';
      if (openAiRes.status === 429) category = 'RATE_LIMIT_OR_QUOTA_EXCEEDED';

      console.error(`[OpenAI Chat Server Error] HTTP ${openAiRes.status} (${category}):`, errorText);

      const errObj = {
        error: `OpenAI API returned HTTP ${openAiRes.status}`,
        status: openAiRes.status,
        category,
        details: errorText
      };
      if (res.status && res.json) return res.status(openAiRes.status).json(errObj);
      res.statusCode = openAiRes.status;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(errObj));
      return;
    }

    const data = await openAiRes.json();
    const rawReply = data?.choices?.[0]?.message?.content?.trim() || '';

    // Clean text of stage directions, asterisks, or parentheses for spoken TTS compatibility
    const cleanReply = rawReply
      .replace(/\*.*?\*/g, '')
      .replace(/\(.*?\)/g, (match: string) => {
        if (/smile|laugh|giggle|hug|pause|whisper|nod|gentle|sweetly|warmly/i.test(match)) return '';
        return match;
      })
      .replace(/[*_#`~]/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    const responsePayload = {
      text: cleanReply || rawReply,
      raw: rawReply,
      model: data?.model || 'gpt-4o-mini',
      usage: data?.usage
    };

    if (res.status && res.json) return res.status(200).json(responsePayload);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(responsePayload));
  } catch (err: any) {
    const isAbort = err?.name === 'AbortError';
    console.error('[OpenAI Chat Server Error]', isAbort ? 'Upstream request timed out after 20s' : err?.message);
    const errObj = {
      error: 'Chat request failed',
      category: isAbort ? 'TIMEOUT' : 'SERVER_FETCH_EXCEPTION',
      message: isAbort ? 'Request timed out waiting for OpenAI' : err?.message
    };
    if (res.status && res.json) return res.status(500).json(errObj);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(errObj));
  }
}
