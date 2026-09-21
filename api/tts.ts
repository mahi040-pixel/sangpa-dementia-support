import type { IncomingMessage, ServerResponse } from 'http';

// Sangpa Mascot Voice Configuration (Voice ID: 5f1FjpWl2X8UqTlgo9Ov)
const DEFAULT_VOICE_ID = '5f1FjpWl2X8UqTlgo9Ov';
const MODEL_ID = 'eleven_multilingual_v2';

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
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, xi-api-key');

  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    res.end();
    return;
  }

  const voiceId = (
    process.env.ELEVENLABS_VOICE_ID ||
    process.env.VITE_ELEVENLABS_VOICE_ID ||
    DEFAULT_VOICE_ID
  ).trim();

  // 2. GET Request: Configuration diagnostic (never exposes secret values)
  if (req.method === 'GET') {
    const rawKey = (
      process.env.ELEVENLABS_API_KEY ||
      process.env.VITE_ELEVENLABS_API_KEY ||
      process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY ||
      process.env.ELEVEN_API_KEY ||
      ''
    ).trim();

    const hasKey = rawKey.length > 5;
    const result = {
      status: 'ok',
      configured: hasKey,
      voiceId,
      modelId: MODEL_ID,
      message: hasKey 
        ? `Server ElevenLabs TTS endpoint is configured with Voice ID ${voiceId}.`
        : 'Server ElevenLabs API key is not configured in Vercel environment variables (expected ELEVENLABS_API_KEY).'
    };

    if (res.status && res.json) {
      return res.status(200).json(result);
    }
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(result));
    return;
  }

  // 3. POST Request: Synthesize Speech
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

  // Only read stream if body was not already parsed and stream hasn't ended
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

  const text = body?.text;
  const clientApiKey = body?.apiKey;
  const requestedVoiceId = body?.voiceId;

  if (!text || typeof text !== 'string' || !text.trim()) {
    const err = { error: 'Missing or empty text parameter' };
    if (res.status && res.json) return res.status(400).json(err);
    res.statusCode = 400;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(err));
    return;
  }

  // Support all common environment variable names for maximum deployment reliability
  const apiKey = (
    process.env.ELEVENLABS_API_KEY ||
    process.env.VITE_ELEVENLABS_API_KEY ||
    process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY ||
    process.env.ELEVEN_API_KEY ||
    clientApiKey ||
    ''
  ).trim();

  if (!apiKey || apiKey.length < 5) {
    const err = {
      error: 'ElevenLabs TTS request failed',
      category: 'MISSING_API_KEY',
      details: 'ELEVENLABS_API_KEY is not configured in Vercel environment variables.'
    };
    console.error('[ElevenLabs TTS Server Error] Missing API Key in Vercel environment variables (checked ELEVENLABS_API_KEY, VITE_ELEVENLABS_API_KEY, ELEVEN_API_KEY)');
    if (res.status && res.json) return res.status(500).json(err);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(err));
    return;
  }

  const targetVoiceId = (
    process.env.ELEVENLABS_VOICE_ID ||
    process.env.VITE_ELEVENLABS_VOICE_ID ||
    requestedVoiceId ||
    DEFAULT_VOICE_ID
  ).trim();

  try {
    const elevenLabsUrl = `https://api.elevenlabs.io/v1/text-to-speech/${targetVoiceId}?output_format=mp3_44100_128`;
    
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000); // 20s timeout to allow cold start + multi-lingual generation

    const response = await fetch(elevenLabsUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': apiKey,
        'Accept': 'audio/mpeg'
      },
      body: JSON.stringify({
        text: text.trim(),
        model_id: MODEL_ID,
        voice_settings: {
          stability: 0.55,
          similarity_boost: 0.85,
          use_speaker_boost: true
        }
      }),
      signal: controller.signal
    });
    clearTimeout(timeout);

    if (!response.ok) {
      const errorText = await response.text();
      let category = 'UPSTREAM_API_ERROR';
      let message = 'ElevenLabs TTS request failed';
      if (response.status === 401) {
        category = 'UNAUTHORIZED_INVALID_KEY';
        message = 'ElevenLabs API key is invalid or unauthorized (HTTP 401).';
      } else if (response.status === 400 || response.status === 404) {
        category = 'VOICE_NOT_FOUND_IN_VOICELAB';
        message = `ElevenLabs Voice ID ${targetVoiceId} not found or inaccessible (HTTP ${response.status}).`;
      } else if (response.status === 402) {
        category = 'PAYMENT_REQUIRED_CREDIT_LIMIT';
        message = 'ElevenLabs account payment required or quota/credit limit exceeded (HTTP 402). Changing voice ID does not resolve account credit/plan limitations.';
      } else if (response.status === 429) {
        category = 'RATE_LIMIT_EXCEEDED';
        message = 'ElevenLabs rate limit exceeded (HTTP 429).';
      }

      console.error(`[ElevenLabs TTS Server Error] HTTP ${response.status} (${category}):`, errorText);

      const err = {
        error: message,
        status: response.status,
        category,
        details: errorText
      };
      if (res.status && res.json) return res.status(response.status).json(err);
      res.statusCode = response.status;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(err));
      return;
    }

    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = Buffer.from(arrayBuffer);

    res.statusCode = 200;
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Length', audioBuffer.length);
    res.setHeader('Cache-Control', 'public, max-age=86400');
    res.end(audioBuffer);
  } catch (err: any) {
    const isAbort = err?.name === 'AbortError';
    console.error('[ElevenLabs TTS Server Error]', isAbort ? 'Upstream request timed out after 20s' : err?.message);
    const errObj = {
      error: 'ElevenLabs TTS request failed',
      category: isAbort ? 'TIMEOUT' : 'SERVER_FETCH_EXCEPTION',
      message: isAbort ? 'Request timed out waiting for ElevenLabs' : err?.message
    };
    if (res.status && res.json) return res.status(500).json(errObj);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(errObj));
  }
}
