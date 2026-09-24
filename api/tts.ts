import type { IncomingMessage, ServerResponse } from 'http';

// Sangpa Mascot Voice Configuration: Suhana J (Voice ID: 5f1FjpWl2X8UqTlgo9Ov)
export const SANGPA_MASCOT_VOICE_ID = '5f1FjpWl2X8UqTlgo9Ov';
export const ELEVENLABS_MODEL_ID = 'eleven_multilingual_v2';

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
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization, xi-api-key');

  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    res.end();
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

  // Resolve ElevenLabs API Key across all potential environment variable naming conventions
  const elevenLabsApiKey = (
    process.env.ELEVENLABS_API_KEY ||
    process.env.ELEVEN_LABS_API_KEY ||
    process.env.VITE_ELEVENLABS_API_KEY ||
    process.env.VITE_ELEVEN_LABS_API_KEY ||
    process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY ||
    process.env.NEXT_PUBLIC_ELEVEN_LABS_API_KEY ||
    process.env.ELEVENLABS_KEY ||
    process.env.ELEVEN_KEY ||
    process.env.ELEVEN_API_KEY ||
    process.env.XI_API_KEY ||
    process.env.VITE_XI_API_KEY ||
    (typeof clientApiKey === 'string' && !clientApiKey.startsWith('sk-') ? clientApiKey : '') ||
    ''
  ).trim().replace(/^["']|["']$/g, '');

  // Resolve Sangpa Mascot Voice ID (strictly enforcing 5f1FjpWl2X8UqTlgo9Ov everywhere)
  const targetVoiceId = (
    process.env.ELEVENLABS_VOICE_ID ||
    process.env.ELEVEN_LABS_VOICE_ID ||
    process.env.VITE_ELEVENLABS_VOICE_ID ||
    process.env.VITE_ELEVEN_LABS_VOICE_ID ||
    process.env.NEXT_PUBLIC_ELEVENLABS_VOICE_ID ||
    process.env.NEXT_PUBLIC_ELEVEN_LABS_VOICE_ID ||
    process.env.ELEVEN_VOICE_ID ||
    process.env.VITE_ELEVEN_VOICE_ID ||
    process.env.XI_VOICE_ID ||
    process.env.VOICE_ID ||
    process.env.VITE_VOICE_ID ||
    process.env.SANGPA_VOICE_ID ||
    process.env.MASCOT_VOICE_ID ||
    body?.voiceId ||
    SANGPA_MASCOT_VOICE_ID
  ).trim().replace(/^["']|["']$/g, '') || SANGPA_MASCOT_VOICE_ID;

  // 2. GET Request: Configuration diagnostic (does NOT leak secret key)
  if (req.method === 'GET') {
    const hasElevenLabs = elevenLabsApiKey.length > 5;

    const result = {
      status: 'ok',
      configured: hasElevenLabs,
      engine: 'elevenlabs',
      voiceId: targetVoiceId,
      elevenLabsVoiceId: targetVoiceId,
      elevenLabsModel: ELEVENLABS_MODEL_ID,
      elevenLabsConfigured: hasElevenLabs,
      message: hasElevenLabs
        ? `Server ElevenLabs TTS endpoint is active with Sangpa Mascot Voice ID "${targetVoiceId}" using ${ELEVENLABS_MODEL_ID}.`
        : `Server ELEVENLABS_API_KEY is not configured in Vercel environment variables. Voice ID is locked to "${targetVoiceId}".`
    };

    if (res.status && res.json) return res.status(200).json(result);
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

  const text = body?.text;
  if (!text || typeof text !== 'string' || !text.trim()) {
    const err = { error: 'Missing or empty text parameter' };
    if (res.status && res.json) return res.status(400).json(err);
    res.statusCode = 400;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(err));
    return;
  }

  // Clean text: strip markdown characters (*, _, #, `, etc.) so speech doesn't read formatting symbols
  const cleanText = text
    .replace(/[*_#`~[\]()<>]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  // 4. Synthesize speech using ElevenLabs Multilingual v2 with Voice ID 5f1FjpWl2X8UqTlgo9Ov
  if (elevenLabsApiKey && elevenLabsApiKey.length > 5) {
    try {
      const elevenLabsUrl = `https://api.elevenlabs.io/v1/text-to-speech/${targetVoiceId}?output_format=mp3_44100_128`;
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 25000); // 25s timeout for cold start & regional languages

      const response = await fetch(elevenLabsUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': elevenLabsApiKey,
          'Accept': 'audio/mpeg'
        },
        body: JSON.stringify({
          text: cleanText,
          model_id: ELEVENLABS_MODEL_ID,
          voice_settings: {
            stability: 0.50,
            similarity_boost: 0.85,
            use_speaker_boost: true
          }
        }),
        signal: controller.signal
      });
      clearTimeout(timeout);

      if (response.ok) {
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = Buffer.from(arrayBuffer);

        res.statusCode = 200;
        res.setHeader('Content-Type', 'audio/mpeg');
        res.setHeader('Content-Length', audioBuffer.length);
        res.setHeader('Cache-Control', 'public, max-age=86400');
        res.end(audioBuffer);
        return;
      }

      const errText = await response.text();
      console.error(`[ElevenLabs TTS Server Error] Voice ID: ${targetVoiceId}, HTTP ${response.status}:`, errText);

      const errObj = {
        error: `ElevenLabs speech synthesis failed for Voice ID ${targetVoiceId}`,
        voiceId: targetVoiceId,
        status: response.status,
        details: errText
      };
      if (res.status && res.json) return res.status(response.status).json(errObj);
      res.statusCode = response.status;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(errObj));
      return;
    } catch (err: any) {
      console.error('[ElevenLabs TTS Exception]:', err?.message);
      const errObj = {
        error: `ElevenLabs speech synthesis exception for Voice ID ${targetVoiceId}`,
        voiceId: targetVoiceId,
        details: err?.message
      };
      if (res.status && res.json) return res.status(500).json(errObj);
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(errObj));
      return;
    }
  }

  // 5. ElevenLabs API key is not configured in Vercel environment variables
  const missingKeyErr = {
    error: 'ELEVENLABS_API_KEY is not configured in Vercel environment variables',
    voiceId: targetVoiceId,
    category: 'MISSING_ELEVENLABS_API_KEY',
    details: `Sangpa Mascot Voice ID "${targetVoiceId}" requires ElevenLabs speech synthesis. Please add ELEVENLABS_API_KEY to your Vercel Project Settings > Environment Variables.`
  };
  console.error(`[TTS Server Error] Cannot synthesize Voice ID "${targetVoiceId}" without ELEVENLABS_API_KEY in Vercel environment variables.`);
  if (res.status && res.json) return res.status(500).json(missingKeyErr);
  res.statusCode = 500;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(missingKeyErr));
}
