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
    isValid: false,
    hasVoice: false,
    message: 'Awaiting connection test'
  };

  constructor() {
    if (typeof window !== 'undefined') {
      const storedKey = localStorage.getItem('sangpa_elevenlabs_api_key');
      const envKey = (import.meta as unknown as { env?: Record<string, string> })?.env?.VITE_ELEVENLABS_API_KEY;
      this.apiKey = (storedKey && storedKey.trim()) || (envKey && envKey.trim()) || '';
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
      message: this.apiKey.length > 5 ? 'Key updated. Click "Test Connection" to verify.' : 'No API key set.'
    };
  }

  hasApiKey(): boolean {
    return this.apiKey.length > 5;
  }

  getSampleGreeting(lang: LanguageCode): string {
    return ELEVENLABS_SAMPLE_GREETINGS[lang] || ELEVENLABS_SAMPLE_GREETINGS.en;
  }

  formatPromptForMultilingual(text: string, lang: LanguageCode): string {
    return text.trim();
  }

  // Tests the ElevenLabs API Key and checks whether voice 9vP6R7VVxNwGIGLnpl17 is added to VoiceLab
  async testConnection(): Promise<ElevenLabsConnectionStatus> {
    if (!this.hasApiKey()) {
      this.lastStatus = {
        tested: true,
        isValid: false,
        hasVoice: false,
        message: 'Please paste your ElevenLabs API key first.'
      };
      return this.lastStatus;
    }

    try {
      // 1. Fetch user subscription and character balance
      const userRes = await fetch('https://api.elevenlabs.io/v1/user', {
        headers: { 'xi-api-key': this.apiKey }
      });

      if (!userRes.ok) {
        const errText = await userRes.text();
        const msg = userRes.status === 401 
          ? 'Invalid API Key (401 Unauthorized). Please check your xi-api-key from elevenlabs.io.'
          : `API Error (${userRes.status}): ${errText.slice(0, 80)}`;
        this.lastStatus = { tested: true, isValid: false, hasVoice: false, message: msg };
        return this.lastStatus;
      }

      const userData = await userRes.json();
      const characterCount = userData?.subscription?.character_count || 0;
      const characterLimit = userData?.subscription?.character_limit || 0;

      // 2. Fetch list of available voices to verify Suhana J
      const voicesRes = await fetch('https://api.elevenlabs.io/v1/voices', {
        headers: { 'xi-api-key': this.apiKey }
      });

      let hasVoice = false;
      if (voicesRes.ok) {
        const voicesData = await voicesRes.json();
        const voiceList = voicesData?.voices || [];
        hasVoice = voiceList.some((v: any) => v.voice_id === ELEVENLABS_VOICE_ID);
      }

      if (hasVoice) {
        this.lastStatus = {
          tested: true,
          isValid: true,
          hasVoice: true,
          characterCount,
          characterLimit,
          message: `Connected! Suhana J is active in your VoiceLab (${(characterLimit - characterCount).toLocaleString()} characters remaining).`
        };
      } else {
        this.lastStatus = {
          tested: true,
          isValid: true,
          hasVoice: false,
          characterCount,
          characterLimit,
          message: `API Key valid (${(characterLimit - characterCount).toLocaleString()} chars), but Suhana J is not yet in your VoiceLab. Click "Add Voice" below.`
        };
      }

      return this.lastStatus;
    } catch (err: any) {
      this.lastStatus = {
        tested: true,
        isValid: false,
        hasVoice: false,
        message: `Network notice: ${err.message || 'Could not reach ElevenLabs directly'}`
      };
      return this.lastStatus;
    }
  }

  // Synthesize speech using ElevenLabs Multilingual v2 with voice 9vP6R7VVxNwGIGLnpl17
  async synthesizeSpeech(text: string, lang: LanguageCode): Promise<string | null> {
    if (!this.hasApiKey()) {
      return null;
    }

    const cacheKey = `${ELEVENLABS_VOICE_ID}_${lang}_${text}`;
    if (audioBlobCache.has(cacheKey)) {
      return audioBlobCache.get(cacheKey)!;
    }

    try {
      const formattedText = this.formatPromptForMultilingual(text, lang);

      const response = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${ELEVENLABS_VOICE_ID}?output_format=mp3_44100_128`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'xi-api-key': this.apiKey,
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

      if (!response.ok) {
        const errorDetail = await response.text();
        console.warn(`[ElevenLabs API Status ${response.status}]`, errorDetail);
        
        if (response.status === 400 || response.status === 404) {
          this.lastStatus.hasVoice = false;
          this.lastStatus.message = 'Voice 9vP6R7VVxNwGIGLnpl17 needs to be added from Voice Library to your account.';
        } else if (response.status === 429 || response.status === 402) {
          this.lastStatus.message = 'ElevenLabs character limit reached. Using high-fidelity local voice.';
        }
        return null;
      }

      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      audioBlobCache.set(cacheKey, blobUrl);
      return blobUrl;
    } catch (err) {
      console.error('[ElevenLabs Speech Synthesis Error]', err);
      return null;
    }
  }

  // Plays the authentic bundled Suhana voice audition sample from ElevenLabs
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
