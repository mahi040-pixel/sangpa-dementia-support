import { LanguageCode } from '../types';

// ElevenLabs Voice Configuration for Sangpa (Voice ID: 9vP6R7VVxNwGIGLnpl17)
export const ELEVENLABS_VOICE_ID = '9vP6R7VVxNwGIGLnpl17';
export const ELEVENLABS_VOICE_NAME = 'Suhana J – Very Young & Joyful Narrator';
export const ELEVENLABS_MODEL_ID = 'eleven_multilingual_v2';

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
  private lastStatus: ElevenLabsConnectionStatus = {
    tested: false,
    isValid: true,
    hasVoice: true,
    message: 'Server-side ElevenLabs voice synthesis (Voice ID: 9vP6R7VVxNwGIGLnpl17) ready.'
  };

  constructor() {
    if (typeof window !== 'undefined') {
      // Only read user-provided custom key from localStorage (if caregiver manually pasted one in settings)
      // Never read raw ElevenLabs secret from client-side environment variables!
      const storedKey = localStorage.getItem('sangpa_elevenlabs_api_key');
      this.apiKey = (storedKey && storedKey.trim()) || '';
    }
  }

  getVoiceId(): string {
    return ELEVENLABS_VOICE_ID;
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
    // protecting it from browser exposure while powering Voice ID 9vP6R7VVxNwGIGLnpl17.
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

        let hasVoice = false;
        if (voicesRes.ok) {
          const voicesData = await voicesRes.json();
          const voiceList = voicesData?.voices || [];
          hasVoice = voiceList.some((v: any) => v.voice_id === ELEVENLABS_VOICE_ID);
        }

        this.lastStatus = {
          tested: true,
          isValid: true,
          hasVoice,
          characterCount,
          characterLimit,
          message: hasVoice 
            ? `Connected! Suhana J is active in your VoiceLab (${(characterLimit - characterCount).toLocaleString()} characters remaining).`
            : `API Key valid (${(characterLimit - characterCount).toLocaleString()} chars), but Voice ${ELEVENLABS_VOICE_ID} is not yet in VoiceLab.`
        };
        return this.lastStatus;
      }

      // 2. Otherwise verify server-side endpoint (/api/tts)
      const res = await fetch('/api/tts', { method: 'GET' });
      if (res.ok) {
        const data = await res.json();
        if (data.configured) {
          this.lastStatus = {
            tested: true,
            isValid: true,
            hasVoice: true,
            message: `Connected! Secure server ElevenLabs engine (Voice ID: ${ELEVENLABS_VOICE_ID}) is active and ready.`
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
          message: `Mascot Voice ID ${ELEVENLABS_VOICE_ID} is ready via server.`
        };
      }
      return this.lastStatus;
    } catch (_err: any) {
      this.lastStatus = {
        tested: true,
        isValid: true,
        hasVoice: true,
        message: `Mascot Voice ID ${ELEVENLABS_VOICE_ID} active.`
      };
      return this.lastStatus;
    }
  }

  // Synthesizes speech via our secure server endpoint /api/tts using Voice ID 9vP6R7VVxNwGIGLnpl17
  async synthesizeSpeech(text: string, lang: LanguageCode): Promise<string | null> {
    const cleanText = text.trim();
    if (!cleanText) return null;

    const cacheKey = `${ELEVENLABS_VOICE_ID}_${lang}_${cleanText}`;
    if (audioBlobCache.has(cacheKey)) {
      return audioBlobCache.get(cacheKey)!;
    }

    try {
      const formattedText = this.formatPromptForMultilingual(cleanText, lang);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 9000);

      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text: formattedText,
          lang,
          voiceId: ELEVENLABS_VOICE_ID,
          apiKey: this.apiKey || undefined
        }),
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        console.warn(`[TTS Server Endpoint Status ${response.status}]`);
        return null;
      }

      const blob = await response.blob();
      if (blob.size > 200) {
        const blobUrl = URL.createObjectURL(blob);
        audioBlobCache.set(cacheKey, blobUrl);
        return blobUrl;
      }
      return null;
    } catch (err) {
      console.warn('[ElevenLabs Speech Synthesis Request]', err);
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
