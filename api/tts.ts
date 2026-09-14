import type { IncomingMessage, ServerResponse } from 'http';

// Sangpa Mascot Voice Configuration (Voice ID: 9vP6R7VVxNwGIGLnpl17)
const DEFAULT_VOICE_ID = '9vP6R7VVxNwGIGLnpl17';
const MODEL_ID = 'eleven_multilingual_v2';

interface RequestWithBody extends IncomingMessage {
  body?: any;
  method?: string;
  query?: Record<string, string>;
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
    if (res.status) {
      res.status(200).end();
    } else {
      res.statusCode = 200;
      res.end();
    }
    return;
  }

  const voiceId = (process.env.ELEVENLABS_VOICE_ID || DEFAULT_VOICE_ID).trim();

  // 2. GET Request: Configuration diagnostic (does NOT leak the secret key)
  if (req.method === 'GET') {
    const hasKey = Boolean(process.env.ELEVENLABS_API_KEY && process.env.ELEVENLABS_API_KEY.trim().length > 5);
    const result = {
      configured: hasKey,
      voiceId,
      modelId: MODEL_ID,
      message: hasKey 
        ? `Server ElevenLabs TTS is configured with Voice ID ${voiceId}.`
        : 'Server ELEVENLABS_API_KEY is not configured in Vercel environment variables.'
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
    if (res.status && res.json) {
      return res.status(405).json({ error: 'Method Not Allowed' });
    }
    res.statusCode = 405;
    res.end('Method Not Allowed');
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

  if (!body && typeof (req as any).on === 'function') {
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
    if (res.status && res.json) {
      return res.status(400).json(err);
    }
    res.statusCode = 400;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(err));
    return;
  }

  // Server-only ELEVENLABS_API_KEY takes priority, with fallback to client-supplied key if custom
  const apiKey = (process.env.ELEVENLABS_API_KEY || clientApiKey || '').trim();

  if (!apiKey || apiKey.length < 5) {
    const err = {
      error: 'ELEVENLABS_API_KEY is not configured on the server. Please add ELEVENLABS_API_KEY in Vercel Environment Variables.'
    };
    if (res.status && res.json) {
      return res.status(500).json(err);
    }
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(err));
    return;
  }

  const targetVoiceId = (requestedVoiceId || voiceId).trim();

  try {
    const elevenLabsUrl = `https://api.elevenlabs.io/v1/text-to-speech/${targetVoiceId}?output_format=mp3_44100_128`;
    
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
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.warn(`[ElevenLabs API Status ${response.status}]`, errorText);
      const err = { error: `ElevenLabs returned HTTP ${response.status}`, details: errorText };
      if (res.status && res.json) {
        return res.status(response.status).json(err);
      }
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
    
    if (res.send) {
      return res.send(audioBuffer);
    }
    res.end(audioBuffer);
  } catch (err: any) {
    console.error('[TTS Server Error]', err);
    const errObj = { error: 'Speech synthesis failed', message: err?.message };
    if (res.status && res.json) {
      return res.status(500).json(errObj);
    }
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(errObj));
  }
}
