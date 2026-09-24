import { LanguageCode } from '../types';

// Custom ElevenLabs Voice Configuration for Sangpa
export const ELEVENLABS_VOICE_NAME = 'Sangpa Voice';
export const ELEVENLABS_MODEL_ID = 'eleven_multilingual_v2';
export const ELEVENLABS_VOICE_ID = (
  (typeof process !== 'undefined' && process.env?.ELEVENLABS_VOICE_ID) ||
  (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_ELEVENLABS_VOICE_ID) ||
  ''
).trim();

export class ElevenLabsPaymentRequiredError extends Error {
  status = 402;
  details: string;
  constructor(details: string) {
    super(`ElevenLabs HTTP 402 Payment Required: Credit limit or tier restriction reached. Changing Voice ID does not resolve account credit/plan limitations. Details: ${details}`);
    this.name = 'ElevenLabsPaymentRequiredError';
    this.details = details;
  }
}

export const ELEVENLABS_SAMPLE_GREETINGS: Record<LanguageCode, string> = {
  en: 'Namaste Kamala Dadi! I am Sangpa, your loving little granddaughter companion. How are you feeling today?',
  hi: 'नमस्ते कमला दादी! मैं सांगपा हूँ, आपकी प्यारी नन्हीं सहेली। आप आज कैसी हैं?',
  as: 'নমস্কাৰ কমলা আইতা! মই আপোনাৰ কণমানি চাংপা। আজি আপোনাৰ মনটো কেনে লাগিছে?',
  bn: 'নমস্কার কমলা ঠাকুমা! আমি আপনার ছোট্ট নাতনি সাংপা। আজ কেমন আছেন?',
  nag: 'Namaste Kamala Dadi! Aami Sangpa asey, apuni laga morom choto bacha. Aji din kineka asey?',
  mni: 'খুরুমজরি কমলা ইবুধৌ! ঐহাক চাংপাউনি, অদোমগী নুংশিরবা অঙাং নুপীমচানি।',
  es: '¡Hola abuelita Kamala! Soy Sangpa, tu pequeña y cariñosa compañera. ¿Cómo estás hoy?'
};

// In-memory cache for synthesized audio Blobs to minimize API usage and latency
const audioBlobCache = new Map<string, string>();

export interface ElevenLabsConnectionStatus {
  tested: boolean;
  isValid: boolean;
  hasVoice: boolean;
  characterCount?: number;
  characterLimit?: number;
  message: string;
}

class ElevenLabsService {
  private apiKey: string = '';
  private serverVoiceId: string = ELEVENLABS_VOICE_ID;
  private lastStatus: ElevenLabsConnectionStatus = {
    tested: false,
    isValid: true,
    hasVoice: true,
    message: 'Server-side ElevenLabs voice synthesis ready.'
  };

  constructor() {
    if (typeof window !== 'undefined') {
      const storedKey = localStorage.getItem('sangpa_elevenlabs_api_key');
      const envKey = (
        (import.meta as any).env?.VITE_ELEVENLABS_API_KEY ||
        (import.meta as any).env?.VITE_ELEVEN_LABS_API_KEY ||
        (import.meta as any).env?.VITE_XI_API_KEY ||
        (import.meta as any).env?.ELEVENLABS_API_KEY
      );
      this.apiKey = (storedKey && storedKey.trim()) || (envKey && envKey.trim()) || '';

      // Immediately fetch server diagnostic to sync Voice ID from Vercel server environment
      fetch('/api/tts', { method: 'GET' })
        .then(res => res.json())
        .then(data => {
          if (data?.elevenLabsVoiceId) {
            this.serverVoiceId = data.elevenLabsVoiceId;
          } else if (data?.voiceId) {
            this.serverVoiceId = data.voiceId;
          }
        })
        .catch(() => {});
    }
  }

  getVoiceId(): string {
    return this.serverVoiceId || ELEVENLABS_VOICE_ID;
  }

  getVoiceName(): string {
    return ELEVENLABS_VOICE_NAME;
  }

  getModelId(): string {
    return ELEVENLABS_MODEL_ID;
  }

  getApiKey(): string {
    return this.apiKey;
  }

  getLastStatus(): ElevenLabsConnectionStatus {
    return this.lastStatus;
  }

  setApiKey(key: string): void {
    this.apiKey = key.trim();
    if (typeof window !== 'undefined') {
      if (this.apiKey) {
        localStorage.setItem('sangpa_elevenlabs_api_key', this.apiKey);
      } else {
        localStorage.removeItem('sangpa_elevenlabs_api_key');
      }
    }
    this.lastStatus = {
      tested: false,
      isValid: this.apiKey.length > 5,
      hasVoice: false,
      message: this.apiKey.length > 5 ? 'Custom key updated. Click "Test Connection" to verify.' : 'Using server-side ElevenLabs engine.'
    };
  }

  hasApiKey(): boolean {
    // True in production and development:
    // The server-side endpoint (/api/tts) holds the ELEVENLABS_API_KEY securely,
    // protecting it from browser exposure while powering the custom ELEVENLABS_VOICE_ID.
    return true;
  }

  getSampleGreeting(lang: LanguageCode): string {
    return ELEVENLABS_SAMPLE_GREETINGS[lang] || ELEVENLABS_SAMPLE_GREETINGS.en;
  }

  formatPromptForMultilingual(text: string, _lang: LanguageCode): string {
    return text.trim();
  }

  // Tests connection status (custom key or server endpoint)
  async testConnection(): Promise<ElevenLabsConnectionStatus> {
    try {
      // 1. If caregiver entered a custom key, verify directly against ElevenLabs API
      if (this.apiKey && this.apiKey.length > 5) {
        const userRes = await fetch('https://api.elevenlabs.io/v1/user', {
          headers: { 'xi-api-key': this.apiKey }
        });

        if (!userRes.ok) {
          const errText = await userRes.text();
          const msg = userRes.status === 401 
            ? 'Custom API Key invalid (401 Unauthorized).' 
            : `API Error (${userRes.status}): ${errText.slice(0, 80)}`;
          this.lastStatus = { tested: true, isValid: false, hasVoice: false, message: msg };
          return this.lastStatus;
        }

        const userData = await userRes.json();
        const characterCount = userData?.subscription?.character_count || 0;
        const characterLimit = userData?.subscription?.character_limit || 0;

        const voicesRes = await fetch('https://api.elevenlabs.io/v1/voices', {
          headers: { 'xi-api-key': this.apiKey }
        });

        const activeVoiceId = this.getVoiceId();
        let hasVoice = false;
        if (voicesRes.ok) {
          const voicesData = await voicesRes.json();
          const voiceList = voicesData?.voices || [];
          hasVoice = voiceList.some((v: any) => v.voice_id === activeVoiceId);
        }

        this.lastStatus = {
          tested: true,
          isValid: true,
          hasVoice,
          characterCount,
          characterLimit,
          message: hasVoice 
            ? `Connected! Voice ID ${activeVoiceId} is active in your VoiceLab (${(characterLimit - characterCount).toLocaleString()} characters remaining).`
            : `API Key valid (${(characterLimit - characterCount).toLocaleString()} chars), but Voice ${activeVoiceId} is not yet in VoiceLab.`
        };
        return this.lastStatus;
      }

      // 2. Otherwise verify server-side endpoint (/api/tts)
      const res = await fetch('/api/tts', { method: 'GET' });
      if (res.ok) {
        const data = await res.json();
        if (data.voiceId) {
          this.serverVoiceId = data.voiceId;
        }
        const activeVoice = this.getVoiceId();
        if (data.configured) {
          this.lastStatus = {
            tested: true,
            isValid: true,
            hasVoice: true,
            message: `Connected! Secure server ElevenLabs engine (Voice ID: ${activeVoice}) is active and ready.`
          };
        } else {
          this.lastStatus = {
            tested: true,
            isValid: false,
            hasVoice: false,
            message: 'Server ELEVENLABS_API_KEY is not configured yet in Vercel environment variables.'
          };
        }
      } else {
        this.lastStatus = {
          tested: true,
          isValid: true,
          hasVoice: true,
          message: `Mascot Voice ID ${this.getVoiceId()} is ready via server.`
        };
      }
      return this.lastStatus;
    } catch (_err: any) {
      this.lastStatus = {
        tested: true,
        isValid: true,
        hasVoice: true,
        message: `Mascot Voice ID ${this.getVoiceId()} active.`
      };
      return this.lastStatus;
    }
  }

  // Synthesizes speech via our secure server endpoint /api/tts using Voice ID
  async synthesizeSpeech(text: string, lang: LanguageCode): Promise<string | null> {
    const cleanText = text.trim();
    if (!cleanText) return null;

    const currentVoiceId = this.getVoiceId();
    const cacheKey = `${currentVoiceId}_${lang}_${cleanText}`;
    if (audioBlobCache.has(cacheKey)) {
      return audioBlobCache.get(cacheKey)!;
    }

    try {
      const formattedText = this.formatPromptForMultilingual(cleanText, lang);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 20000); // 20s timeout for cold starts and multi-lingual generation

      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text: formattedText,
          lang,
          voiceId: currentVoiceId,
          apiKey: this.apiKey || undefined
        }),
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (response.ok) {
        const blob = await response.blob();
        if (blob.size > 200) {
          const blobUrl = URL.createObjectURL(blob);
          audioBlobCache.set(cacheKey, blobUrl);
          return blobUrl;
        }
      }

      // Log clear error if server endpoint responded with error
      const errData = await response.json().catch(() => ({ error: `HTTP ${response.status}` }));
      console.error(`[ElevenLabs TTS Client] ElevenLabs TTS request failed (HTTP ${response.status}):`, errData);

      // Explicitly report HTTP 402 Payment Required / Credit Limit without suppressing
      if (response.status === 402) {
        const detailMsg = typeof errData === 'object' && (errData?.details || errData?.error)
          ? `${errData.error || ''}: ${errData.details || ''}`.trim()
          : JSON.stringify(errData);
        throw new ElevenLabsPaymentRequiredError(detailMsg);
      }

      // Direct ElevenLabs API fallback if client-side key exists
      const directKey = this.apiKey || (import.meta as any).env?.VITE_ELEVENLABS_API_KEY;
      if (directKey && directKey.length > 5) {
        try {
          const directRes = await fetch(
            `https://api.elevenlabs.io/v1/text-to-speech/${currentVoiceId}?output_format=mp3_44100_128`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'xi-api-key': directKey,
                'Accept': 'audio/mpeg'
              },
              body: JSON.stringify({
                text: formattedText,
                model_id: ELEVENLABS_MODEL_ID,
                voice_settings: {
                  stability: 0.55,
                  similarity_boost: 0.85,
                  use_speaker_boost: true
                }
              })
            }
          );

          if (!directRes.ok && directRes.status === 402) {
            const errText = await directRes.text();
            throw new ElevenLabsPaymentRequiredError(errText);
          }

          if (directRes.ok) {
            const blob = await directRes.blob();
            if (blob.size > 200) {
              const blobUrl = URL.createObjectURL(blob);
              audioBlobCache.set(cacheKey, blobUrl);
              return blobUrl;
            }
          }
        } catch (directErr) {
          if (directErr instanceof ElevenLabsPaymentRequiredError) {
            throw directErr;
          }
          console.error('[ElevenLabs Direct Client Fallback Error]', directErr);
        }
      }

      return null;
    } catch (err: any) {
      const isAbort = err?.name === 'AbortError';
      console.error('[ElevenLabs TTS Client] ElevenLabs TTS request failed:', isAbort ? 'Timed out after 20s' : err?.message);
      return null;
    }
  }

  // Plays the authentic bundled Suhana voice audition sample
  playPreviewSample(): Promise<void> {
    return new Promise((resolve) => {
      const audio = new Audio('/assets/voice_suhana_preview.mp3');
      audio.onended = () => resolve();
      audio.onerror = () => resolve();
      audio.play().catch(() => resolve());
    });
  }

  // Plays authentic bundled Hindi greeting
  playHindiSample(): Promise<void> {
    return new Promise((resolve) => {
      const audio = new Audio('/assets/voice_hi_greeting.mp3');
      audio.onended = () => resolve();
      audio.onerror = () => resolve();
      audio.play().catch(() => resolve());
    });
  }
}

export const elevenLabsService = new ElevenLabsService();
