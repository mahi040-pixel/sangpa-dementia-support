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
          voiceId: process.env.ELEVENLABS_VOICE_ID || '9vP6R7VVxNwGIGLnpl17',
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
  }
});

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), ttsPlugin()],
  server: {
    port: 5173,
    host: true
  }
})

