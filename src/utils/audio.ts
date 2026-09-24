// SANGPA Web Audio API Sound Synthesizer, OpenAI TTS, and Multilingual Audio Asset Engine
import { elevenLabsService } from '../services/elevenlabs';
import { LanguageCode } from '../types';

const mapLangToCode = (lang: string): LanguageCode => {
  const l = lang.toLowerCase();
  if (l.startsWith('hi')) return 'hi';
  if (l.startsWith('as')) return 'as';
  if (l.startsWith('bn')) return 'bn';
  if (l.startsWith('nag')) return 'nag';
  if (l.startsWith('mni') || l.startsWith('mn')) return 'mni';
  if (l.startsWith('es')) return 'es';
  return 'en';
};

const detectScriptLanguage = (text: string, fallbackLang: LanguageCode): LanguageCode => {
  // If a specific language is already explicitly selected by the user, strictly preserve it
  if (fallbackLang && fallbackLang !== 'en') {
    return fallbackLang;
  }

  // Eastern Nagari script (Assamese, Bengali, Manipuri)
  if (/[\u0980-\u09FF]/.test(text)) {
    if (
      /[\u09F0\u09F1]/.test(text) ||
      text.includes('অসমীয়া') ||
      text.includes('চাংপা') ||
      text.includes('আইতা') ||
      text.includes('সেউজীয়া') ||
      text.includes('নমস্কাৰ') ||
      text.includes('বুটাম') ||
      text.includes('সাজু')
    ) {
      return 'as';
    }
    if (
      text.includes('মৈতৈলোন্') ||
      text.includes('খুরুমজরি') ||
      text.includes('তরাম্না') ||
      text.includes('শেম-শারে') ||
      text.includes('বটনদু')
    ) {
      return 'mni';
    }
    return 'bn';
  }

  // Devanagari letters (Hindi)
  if (/[\u0901-\u0963\u0966-\u097F]/.test(text)) {
    return 'hi';
  }

  return fallbackLang || 'en';
};

class AudioManager {
  private ctx: AudioContext | null = null;
  private activeAudio: HTMLAudioElement | null = null;

  constructor() {}

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  // Cute, soothing music box chime for our adorable mascot
  playCuteChime() {
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const notes = [1046.50, 1318.51, 1567.98]; // C6, E6, G6 - soft sparkling music box
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.08);

      gain.gain.setValueAtTime(0, now + i * 0.08);
      gain.gain.linearRampToValueAtTime(0.12, now + i * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.6);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + i * 0.08);
      osc.stop(now + i * 0.08 + 0.6);
    });
  }

  // 1. Gentle Chime
  playGentleChime() {
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, now); // D5
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.1); // A5

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.2, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 1.2);
  }

  // 2. Soft Temple Bell
  playTempleBell() {
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const freqs = [440, 880, 1320];
    freqs.forEach((f, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, now);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.15 / (i + 1), now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.8);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 1.8);
    });
  }

  // 3. Forest Birds (Gentle two-chirp)
  playForestBirds() {
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';

    osc.frequency.setValueAtTime(1800, now);
    osc.frequency.exponentialRampToValueAtTime(2400, now + 0.08);
    osc.frequency.exponentialRampToValueAtTime(2000, now + 0.15);

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.1, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.3);
  }

  // 4. Rhythm Drum Beat
  playRhythmBeat(pitchMultiplier = 1) {
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(160 * pitchMultiplier, now);
    osc.frequency.exponentialRampToValueAtTime(45, now + 0.12);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.25);
  }

  // 5. Sequence Note (0 to 3)
  playSequenceNote(index: number) {
    const ctx = this.getContext();
    if (!ctx) return;
    const notes = [261.63, 329.63, 392.00, 523.25]; // C4, E4, G4, C5
    const freq = notes[index % notes.length];
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.2, now + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.6);
  }

  // 6. Encouraging Success Jingle
  playSuccessJingle() {
    const ctx = this.getContext();
    if (!ctx) return;
    const notes = [440, 554.37, 659.25, 880]; // A major
    notes.forEach((freq, idx) => {
      const start = ctx.currentTime + idx * 0.12;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, start);

      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(0.15, start + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(start);
      osc.stop(start + 0.4);
    });
  }

  // 7. Emergency Pulse
  playEmergencyPulse() {
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(450, now + 0.3);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.35);
  }

  private isMuted: boolean = false;

  setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted) {
      this.stopSpeaking();
    }
  }

  toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.stopSpeaking();
    }
    return this.isMuted;
  }

  getMuted(): boolean {
    return this.isMuted;
  }

  // In-memory cache for dynamic speech audio blobs
  private dynamicTtsCache = new Map<string, string>();

  // Plays synthesized or custom audio asset
  playAudioAsset(url: string, onEnd?: () => void): Promise<boolean> {
    this.stopSpeaking();
    return new Promise((resolve) => {
      const el = new Audio(url);
      this.activeAudio = el;
      el.onended = () => {
        this.activeAudio = null;
        if (onEnd) onEnd();
        resolve(true);
      };
      el.onerror = () => {
        this.activeAudio = null;
        if (onEnd) onEnd();
        resolve(false);
      };
      el.play().then(() => {
        resolve(true);
      }).catch((err) => {
        console.warn('[Audio Autoplay Blocked or Failed]', err);
        this.activeAudio = null;
        if (onEnd) onEnd();
        resolve(false);
      });
    });
  }

  // Text-To-Speech powered by real-time dynamic ElevenLabs voice synthesis
  async speak(text: string, lang = 'en-IN', onEnd?: () => void) {
    if (this.isMuted || !text || !text.trim()) {
      if (onEnd) setTimeout(onEnd, 1500);
      return;
    }

    this.stopSpeaking();

    const rawLangCode = mapLangToCode(lang);
    const langCode = detectScriptLanguage(text, rawLangCode);
    const cacheKey = `${langCode}_${text.trim()}`;

    // 1. Check in-memory audio blob cache for instant playback
    if (this.dynamicTtsCache.has(cacheKey)) {
      await this.playAudioAsset(this.dynamicTtsCache.get(cacheKey)!, onEnd);
      return;
    }

    // 2. Dynamic Voice Synthesis via serverless endpoint /api/tts using custom ELEVENLABS_VOICE_ID
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 25000);
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          text, 
          lang: langCode,
          voiceId: elevenLabsService.getVoiceId()
        }),
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const blob = await res.blob();
        if (blob.size > 200) {
          const audioUrl = URL.createObjectURL(blob);
          this.dynamicTtsCache.set(cacheKey, audioUrl);
          await this.playAudioAsset(audioUrl, onEnd);
          return;
        } else {
          const errData = await res.json().catch(() => ({}));
          console.error('[ElevenLabs TTS Endpoint Failure]:', res.status, errData);
        }
      } else {
        const errText = await res.text().catch(() => '');
        console.error(`[ElevenLabs TTS Server Error HTTP ${res.status}]:`, errText);
      }
    } catch (err) {
      console.error('[ElevenLabs TTS Network Error]:', err);
    }

    // 3. Fallback to direct client ElevenLabs if direct key is present in client settings
    const clientElevenKey = elevenLabsService.getApiKey();
    if (clientElevenKey && clientElevenKey.length > 5) {
      try {
        const audioUrl = await elevenLabsService.synthesizeSpeech(text, langCode);
        if (audioUrl) {
          this.dynamicTtsCache.set(cacheKey, audioUrl);
          await this.playAudioAsset(audioUrl, onEnd);
          return;
        }
      } catch (err: any) {
        console.error('[Direct ElevenLabs Client Error]:', err);
      }
    }

    // Browser speechSynthesis is permanently disabled per strict ElevenLabs voice policy.
    // If synthesis failed, safely notify callback without playing robotic fallback audio.
    if (onEnd) onEnd();
  }

  // Audition English voice sample via ElevenLabs
  async playSuhanaAuthenticSample(onEnd?: () => void): Promise<void> {
    await this.speak(elevenLabsService.getSampleGreeting('en'), 'en-IN', onEnd);
  }

  // Audition Hindi voice sample via ElevenLabs
  async playHindiAuthenticSample(onEnd?: () => void): Promise<void> {
    await this.speak(elevenLabsService.getSampleGreeting('hi'), 'hi-IN', onEnd);
  }

  // Test Sangpa's voice in any of the app's supported languages
  async testSuhanaVoice(lang: LanguageCode, customText?: string, onEnd?: () => void) {
    const textToSpeak = customText || elevenLabsService.getSampleGreeting(lang);
    const speechLang = lang === 'as' ? 'as-IN' :
                       lang === 'bn' ? 'bn-IN' :
                       lang === 'hi' ? 'hi-IN' :
                       lang === 'es' ? 'es-ES' :
                       lang === 'mni' ? 'mni-IN' :
                       lang === 'nag' ? 'nag-IN' : 'en-IN';
    await this.speak(textToSpeak, speechLang, onEnd);
  }

  stopSpeaking() {
    if (this.activeAudio) {
      this.activeAudio.pause();
      this.activeAudio.currentTime = 0;
      this.activeAudio = null;
    }
  }
}

export const audio = new AudioManager();
