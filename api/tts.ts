import type { IncomingMessage, ServerResponse } from 'http';

// Sangpa Mascot Voice Configuration
const DEFAULT_ELEVENLABS_VOICE_ID = '5f1FjpWl2X8UqTlgo9Ov';
const ELEVENLABS_MODEL_ID = 'eleven_multilingual_v2';
const OPENAI_TTS_VOICE = 'nova'; // Warm, gentle, cheerful female companion voice (fallback)
const OPENAI_TTS_MODEL = 'tts-1';

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
  const clientOpenAiKey = body?.openAiApiKey;

  // Resolve ElevenLabs API Key
  const elevenLabsApiKey = (
    process.env.ELEVENLABS_API_KEY ||
    process.env.VITE_ELEVENLABS_API_KEY ||
    process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY ||
    process.env.ELEVEN_API_KEY ||
    process.env.XI_API_KEY ||
    (typeof clientApiKey === 'string' && !clientApiKey.startsWith('sk-') ? clientApiKey : '') ||
    ''
  ).trim();

  // Resolve ElevenLabs Voice ID from environment variables or client payload
  const targetVoiceId = (
    process.env.ELEVENLABS_VOICE_ID ||
    process.env.VITE_ELEVENLABS_VOICE_ID ||
    process.env.NEXT_PUBLIC_ELEVENLABS_VOICE_ID ||
    process.env.ELEVEN_VOICE_ID ||
    process.env.VITE_ELEVEN_VOICE_ID ||
    process.env.XI_VOICE_ID ||
    process.env.VOICE_ID ||
    process.env.VITE_VOICE_ID ||
    body?.voiceId ||
    DEFAULT_ELEVENLABS_VOICE_ID
  ).trim();

  // Resolve OpenAI API Key (from server environment or client payload)
  const openAiApiKey = (
    process.env.OPENAI_API_KEY ||
    process.env.VITE_OPENAI_API_KEY ||
    process.env.NEXT_PUBLIC_OPENAI_API_KEY ||
    clientOpenAiKey ||
    (typeof clientApiKey === 'string' && clientApiKey.startsWith('sk-') ? clientApiKey : '') ||
    ''
  ).trim();

  // 2. GET Request: Configuration diagnostic (never exposes secret values)
  if (req.method === 'GET') {
    const hasElevenLabs = elevenLabsApiKey.length > 5;
    const hasOpenAi = openAiApiKey.length > 5;

    const result = {
      status: 'ok',
      configured: hasElevenLabs || hasOpenAi,
      primaryEngine: hasElevenLabs ? 'elevenlabs' : hasOpenAi ? 'openai' : 'none',
      elevenLabsConfigured: hasElevenLabs,
      elevenLabsVoiceId: targetVoiceId,
      voiceId: targetVoiceId,
      elevenLabsModel: ELEVENLABS_MODEL_ID,
      openAiConfigured: hasOpenAi,
      openAiModel: OPENAI_TTS_MODEL,
      openAiVoice: OPENAI_TTS_VOICE,
      message: hasElevenLabs
        ? `Server ElevenLabs TTS endpoint is active with Voice ID "${targetVoiceId}" using ${ELEVENLABS_MODEL_ID}.`
        : hasOpenAi
        ? `Server OpenAI TTS fallback endpoint is active with voice "${OPENAI_TTS_VOICE}" (model ${OPENAI_TTS_MODEL}).`
        : 'Neither ELEVENLABS_API_KEY nor OPENAI_API_KEY is configured in Vercel environment variables.'
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

  const cleanText = text.trim();

  // 1. Primary Engine: ElevenLabs Multilingual v2 with the user's configured Voice ID across all languages
  if (elevenLabsApiKey && elevenLabsApiKey.length > 5) {
    try {
      const elevenLabsUrl = `https://api.elevenlabs.io/v1/text-to-speech/${targetVoiceId}?output_format=mp3_44100_128`;
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 20000); // 20s timeout

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
            stability: 0.55,
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
      console.warn(`[ElevenLabs TTS Warning] HTTP ${response.status}:`, errText);

      // If OpenAI fallback is NOT configured, return ElevenLabs error directly
      if (!openAiApiKey || openAiApiKey.length < 5) {
        const errObj = {
          error: 'ElevenLabs TTS request failed',
          status: response.status,
          details: errText
        };
        if (res.status && res.json) return res.status(response.status).json(errObj);
        res.statusCode = response.status;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(errObj));
        return;
      }
      console.info('[ElevenLabs TTS unavailable or credit exhausted, proceeding to OpenAI TTS fallback]');
    } catch (err: any) {
      console.warn('[ElevenLabs TTS Exception, attempting OpenAI fallback if available]:', err?.message);
      if (!openAiApiKey || openAiApiKey.length < 5) {
        const errObj = {
          error: 'ElevenLabs TTS request failed',
          details: err?.message
        };
        if (res.status && res.json) return res.status(500).json(errObj);
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(errObj));
        return;
      }
    }
  }

  // 2. Secondary Fallback: OpenAI TTS (strictly fallback when ElevenLabs is unconfigured or failed)
  if (openAiApiKey && openAiApiKey.length > 5) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 20000); // 20s timeout

      const response = await fetch('https://api.openai.com/v1/audio/speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openAiApiKey}`
        },
        body: JSON.stringify({
          model: OPENAI_TTS_MODEL,
          input: cleanText,
          voice: OPENAI_TTS_VOICE
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
      console.error(`[OpenAI TTS Fallback Server Error] HTTP ${response.status}:`, errText);
      const errObj = {
        error: 'TTS request failed',
        status: response.status,
        details: errText
      };
      if (res.status && res.json) return res.status(response.status).json(errObj);
      res.statusCode = response.status;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(errObj));
      return;
    } catch (err: any) {
      console.error('[OpenAI TTS Fallback Exception]:', err?.message);
      const errObj = {
        error: 'TTS request failed',
        details: err?.message
      };
      if (res.status && res.json) return res.status(500).json(errObj);
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(errObj));
      return;
    }
  }

  // 3. Neither ElevenLabs nor OpenAI API key is configured
  const missingKeyErr = {
    error: 'Text-to-speech failed: No API key found',
    category: 'MISSING_API_KEY',
    details: 'Neither ELEVENLABS_API_KEY nor OPENAI_API_KEY is configured in Vercel environment variables.'
  };
  console.error('[TTS Server Error] Missing ELEVENLABS_API_KEY in Vercel environment variables.');
  if (res.status && res.json) return res.status(500).json(missingKeyErr);
  res.statusCode = 500;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(missingKeyErr));
}
