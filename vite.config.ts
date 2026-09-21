import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { spawn } from 'child_process'
import path from 'path'

const ttsPlugin = () => ({
  name: 'tts-api-server',
  configureServer(server: any) {
    server.middlewares.use('/api/tts', async (req: any, res: any) => {
      if (req.method === 'GET') {
        const hasKey = Boolean(process.env.ELEVENLABS_API_KEY && process.env.ELEVENLABS_API_KEY.trim().length > 5);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({
          configured: hasKey,
          voiceId: process.env.ELEVENLABS_VOICE_ID || process.env.VITE_ELEVENLABS_VOICE_ID || '5f1FjpWl2X8UqTlgo9Ov',
          message: 'Local Vite dev TTS endpoint active'
        }));
        return;
      }

      if (req.method !== 'POST') {
        res.statusCode = 405;
        res.end('Method Not Allowed');
        return;
      }

      let body = '';
      req.on('data', (chunk: any) => {
        body += chunk;
      });

      req.on('end', async () => {
        try {
          const { text, lang = 'hi', apiKey = '' } = JSON.parse(body || '{}');
          if (!text || !text.trim()) {
            res.statusCode = 400;
            res.end('Missing text');
            return;
          }

          const scriptPath = path.resolve(__dirname, 'scripts/synthesize_stream.py');
          const effectiveKey = apiKey || process.env.ELEVENLABS_API_KEY || '';
          const py = spawn('python', [scriptPath, lang, effectiveKey]);

          const chunks: Buffer[] = [];
          py.stdout.on('data', (data: Buffer) => chunks.push(data));

          py.stderr.on('data', (err: Buffer) => {
            console.warn('[TTS API Warning]', err.toString());
          });

          py.on('close', (code: number) => {
            if (code !== 0 || chunks.length === 0) {
              res.statusCode = 500;
              res.end('TTS synthesis failed');
              return;
            }

            const audioBuffer = Buffer.concat(chunks);
            res.writeHead(200, {
              'Content-Type': 'audio/mpeg',
              'Content-Length': audioBuffer.length,
              'Cache-Control': 'public, max-age=86400'
            });
            res.end(audioBuffer);
          });

          py.stdin.write(text);
          py.stdin.end();
        } catch (e: any) {
          res.statusCode = 500;
          res.end(e.message || 'Internal Server Error');
        }
      });
    });
    server.middlewares.use('/api/chat', async (req: any, res: any) => {
      const apiKey = (process.env.OPENAI_API_KEY || process.env.VITE_OPENAI_API_KEY || '').trim();
      if (req.method === 'GET') {
        const hasKey = apiKey.length > 10;
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({
          configured: hasKey,
          model: 'gpt-4o-mini',
          message: hasKey ? 'Dev OpenAI chat endpoint ready' : 'OPENAI_API_KEY not configured'
        }));
        return;
      }
      if (req.method !== 'POST') {
        res.statusCode = 405;
        res.end('Method Not Allowed');
        return;
      }
      let body = '';
      req.on('data', (chunk: any) => { body += chunk; });
      req.on('end', async () => {
        try {
          const { messages, apiKey: clientApiKey, model = 'gpt-4o-mini' } = JSON.parse(body || '{}');
          const effectiveKey = (apiKey || clientApiKey || '').trim();
          if (!effectiveKey) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Missing OPENAI_API_KEY in environment variables' }));
            return;
          }
          const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${effectiveKey}`
            },
            body: JSON.stringify({ model, messages, max_tokens: 140, temperature: 0.7 })
          });
          if (!response.ok) {
            const errText = await response.text();
            res.statusCode = response.status;
            res.setHeader('Content-Type', 'application/json');
            res.end(errText);
            return;
          }
          const data = await response.json();
          const rawReply = data?.choices?.[0]?.message?.content?.trim() || '';
          const cleanReply = rawReply
            .replace(/\*.*?\*/g, '')
            .replace(/\(.*?\)/g, (match: string) => {
              if (/smile|laugh|giggle|hug|pause|whisper|nod|gentle/i.test(match)) return '';
              return match;
            })
            .replace(/[*_#`~]/g, '')
            .replace(/\s+/g, ' ')
            .trim();
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ text: cleanReply || rawReply, raw: rawReply, model: data?.model }));
        } catch (e: any) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: e.message }));
        }
      });
    });
  }
});

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), ttsPlugin()],
  define: {
    'process.env.ELEVENLABS_VOICE_ID': JSON.stringify(
      process.env.ELEVENLABS_VOICE_ID || process.env.VITE_ELEVENLABS_VOICE_ID || '5f1FjpWl2X8UqTlgo9Ov'
    )
  },
  server: {
    port: 5173,
    host: true
  }
})

