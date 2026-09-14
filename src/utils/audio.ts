// SANGPA Web Audio API Sound Synthesizer and ElevenLabs Suhana J Voice Integration
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
    if (
      text.includes('বাংলা') ||
      text.includes('সাংপা') ||
      text.includes('দিদিমা') ||
      text.includes('নমস্কার') ||
      text.includes('বোতামটি') ||
      text.includes('প্রস্তুত')
    ) {
      return 'bn';
    }
    if (fallbackLang === 'as') return 'as';
    if (fallbackLang === 'mni') return 'mni';
    return 'bn';
  }

  // Devanagari script (Hindi)
  if (/[\u0900-\u097F]/.test(text)) {
    return 'hi';
  }

  return fallbackLang;
};

class AudioManager {
  private ctx: AudioContext | null = null;
  private cachedVoices: SpeechSynthesisVoice[] = [];
  private activeAudio: HTMLAudioElement | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.cachedVoices = window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => {
        this.cachedVoices = window.speechSynthesis.getVoices();
      };
    }
  }

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

  getVoices(): SpeechSynthesisVoice[] {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return [];
    const live = window.speechSynthesis.getVoices();
    if (live && live.length > 0) {
      this.cachedVoices = live;
      return live;
    }
    return this.cachedVoices || [];
  }

  // Specifically check if a voice name is female
  private isExplicitlyFemale(name: string): boolean {
    const n = name.toLowerCase();
    return (
      n.includes('zira') ||
      n.includes('heera') ||
      n.includes('swara') ||
      n.includes('neerja') ||
      n.includes('jenny') ||
      n.includes('aria') ||
      n.includes('samantha') ||
      n.includes('victoria') ||
      n.includes('karen') ||
      n.includes('kalpana') ||
      n.includes('sangeeta') ||
      n.includes('veena') ||
      n.includes('tanisha') ||
      n.includes('ananya') ||
      n.includes('female') ||
      n.includes('girl') ||
      n.includes('woman') ||
      n.includes('hazel') ||
      n.includes('susan') ||
      n.includes('catherine') ||
      n.includes('linda') ||
      n.includes('mary') ||
      n.includes('helena') ||
      n.includes('joana') ||
      n.includes('laura') ||
      n.includes('shilpa') ||
      n.includes('sunita') ||
      n.includes('priya') ||
      n.includes('monica') ||
      n.includes('paulina') ||
      n.includes('sabina') ||
      n.includes('lucia') ||
      n.includes('elena') ||
      n.includes('conchita') ||
      n.includes('lupe')
    );
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

  // Strictly identify adult male voices to exclude
  private isMaleVoice(name: string): boolean {
    // If it is known to be female, NEVER classify as male
    if (this.isExplicitlyFemale(name)) {
      return false;
    }

    const n = name.toLowerCase();
    return (
      n.includes('david') ||
      n.includes('mark') ||
      n.includes('george') ||
      n.includes('ravi') ||
      n.includes('guy') ||
      n.includes('richard') ||
      n.includes('brian') ||
      n.includes('sean') ||
      n.includes('james') ||
      n.includes('stefan') ||
      n.includes('paul') ||
      n.includes('mike') ||
      n.includes('michael') ||
      n.includes('alex') ||
      n.includes('daniel') ||
      n.includes('oliver') ||
      n.includes('prabhat') ||
      n.includes('madhav') ||
      n.includes('hemant') ||
      /\bmale\b/i.test(n) ||
      /\bman\b/i.test(n)
    );
  }

  // Specifically select cute girl/female child-like voices and strictly reject any male voice
  selectCuteGirlVoice(lang: string): SpeechSynthesisVoice | undefined {
    const voices = this.getVoices();
    if (!voices || voices.length === 0) return undefined;

    // Filter out all male voices
    const nonMaleVoices = voices.filter(v => !this.isMaleVoice(v.name));

    const isPreferredFemale = (name: string) => this.isExplicitlyFemale(name) || name.toLowerCase().includes('natural');

    const langPrefix = lang.slice(0, 2).toLowerCase();

    // 1. Preferred female voice in matching language (e.g. Heera for en-IN, Swara for hi-IN)
    let match = nonMaleVoices.find(v => 
      v.lang.toLowerCase().startsWith(langPrefix) && isPreferredFemale(v.name)
    );
    if (match) return match;

    // 2. Eastern Nagari Script voices for Assamese (as) and Manipuri (mni)
    if (langPrefix === 'as' || lang === 'as' || lang === 'mni' || langPrefix === 'mn') {
      match = nonMaleVoices.find(v => v.lang.toLowerCase().startsWith('bn') && isPreferredFemale(v.name));
      if (match) return match;
      match = nonMaleVoices.find(v => v.lang.toLowerCase().startsWith('bn'));
      if (match) return match;
    }

    // 3. English preferred female voice (Heera, Zira, Jenny, Aria, Samantha)
    if (langPrefix === 'en' || lang === 'nag' || lang === 'as' || lang === 'mni') {
      // Prioritize Indian English female first (Heera, Neerja), then standard female (Zira, Jenny, Aria, Samantha)
      match = nonMaleVoices.find(v => v.name.toLowerCase().includes('heera'));
      if (match) return match;
      match = nonMaleVoices.find(v => v.name.toLowerCase().includes('neerja'));
      if (match) return match;
      match = nonMaleVoices.find(v => v.name.toLowerCase().includes('zira'));
      if (match) return match;
      match = nonMaleVoices.find(v => v.name.toLowerCase().includes('jenny'));
      if (match) return match;
      match = nonMaleVoices.find(v => v.name.toLowerCase().includes('aria'));
      if (match) return match;
      match = nonMaleVoices.find(v => v.lang.toLowerCase().startsWith('en') && isPreferredFemale(v.name));
      if (match) return match;
    }

    // 3. Any non-male voice matching the language prefix
    match = nonMaleVoices.find(v => v.lang.toLowerCase().startsWith(langPrefix));
    if (match) return match;

    // 4. Any preferred female voice in any dialect
    match = nonMaleVoices.find(v => isPreferredFemale(v.name));
    if (match) return match;

    // 5. Any non-male voice
    if (nonMaleVoices.length > 0) return nonMaleVoices[0];

    return undefined;
  }

  // In-memory cache for dynamic speech audio blobs
  private dynamicTtsCache = new Map<string, string>();

  // Match speech text to high-fidelity companion voice assets only when text specifically matches pre-recorded phrases
  private getMatchingAudioAsset(text: string, langCode: LanguageCode): string | null {
    const t = text.toLowerCase().trim();

    // 1. Exact English Audio Matches
    if (langCode === 'en' || t.includes('ready in english') || t.includes('welcome home to sangpa')) {
      if (t === 'ready in english' || t.includes('ready in english') || t.includes('sangpa is ready in english')) {
        return '/assets/voice_en_ready.mp3';
      }
      if (
        (t.includes('green button') || t.includes('white button')) &&
        (t.includes('welcome') || t.includes('instruction') || t.includes('caregiver'))
      ) {
        return '/assets/voice_en_opening_instructions.mp3';
      }
      return null;
    }

    // 2. Exact Assamese Audio Matches
    if (langCode === 'as' || /[\u09F0\u09F1]/.test(text) || t.includes('অসমীয়া')) {
      if (t.includes('অসমীয়াত সাজু') || t === 'সাজু' || t.includes('ভাষা নিৰ্বাচন')) {
        return '/assets/voice_as_ready.mp3';
      }
      if (t.includes('সেউজীয়া বুটাম') || (t.includes('বুটাম') && t.includes('নিৰ্দেশ'))) {
        return '/assets/voice_as_opening_instructions.mp3';
      }
      if (t.includes('চাংপালৈ স্বাগতম') && (t.includes('আইতা') || t.includes('কমলা আইতা'))) {
        return '/assets/voice_as_patient_welcome.mp3';
      }
      return null;
    }

    // 3. Exact Manipuri Audio Matches
    if (langCode === 'mni' || t.includes('মৈতৈলোন্দা')) {
      if (t.includes('মৈতৈলোন্দা শেম-শারে') || t.includes('শেম-শারে')) {
        return '/assets/voice_mni_ready.mp3';
      }
      if (t.includes('বটনদু') && (t.includes('অশেংবা') || t.includes('পাউতাক'))) {
        return '/assets/voice_mni_opening_instructions.mp3';
      }
      return null;
    }

    // 4. Exact Bengali Audio Matches
    if (langCode === 'bn') {
      if (t.includes('বাংলায় প্রস্তুত') || t === 'প্রস্তুত') {
        return '/assets/voice_bn_ready.mp3';
      }
      if (t.includes('সবুজ বোতাম') && t.includes('নির্দেশনা')) {
        return '/assets/voice_bn_opening_instructions.mp3';
      }
      return null;
    }

    // 5. Exact Nagamese Audio Matches
    if (langCode === 'nag') {
      if (t.includes('nagamese te ready') || t.includes('ready asey')) {
        return '/assets/voice_nag_ready.mp3';
      }
      if (t.includes('green button') && t.includes('swagat asey')) {
        return '/assets/voice_nag_opening_instructions.mp3';
      }
      return null;
    }

    // 6. Exact Hindi Audio Matches (Devanagari script)
    if (langCode === 'hi' || /[\u0900-\u097F]/.test(text)) {
      if (t.includes('हिन्दी में तैयार') || t === 'तैयार है' || t.includes('भाषा चुनी')) {
        return '/assets/voice_hi_greeting.mp3';
      }
      if (t.includes('हरे बटन') && (t.includes('सफेद बटन') || t.includes('निर्देश'))) {
        return '/assets/voice_hi_opening_instructions.mp3';
      }
      if (t.includes('कमला दादी, आपका स्वागत है') || (t.includes('स्वागत है') && t.includes('कमला दादी'))) {
        return '/assets/voice_hi_welcome_patient.mp3';
      }
      return null;
    }

    return null;
  }

  // Plays pre-rendered or dynamic high-fidelity audio asset
  private playAudioAsset(url: string, onEnd?: () => void): Promise<void> {
    this.stopSpeaking();
    return new Promise((resolve) => {
      const el = new Audio(url);
      this.activeAudio = el;
      el.onended = () => {
        this.activeAudio = null;
        if (onEnd) onEnd();
        resolve();
      };
      el.onerror = () => {
        this.activeAudio = null;
        if (onEnd) onEnd();
        resolve();
      };
      el.play().catch(() => {
        this.activeAudio = null;
        if (onEnd) onEnd();
        resolve();
      });
    });
  }

  // Text-To-Speech powered by real-time dynamic child voice synthesis with zero delay
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

    // 2. Exact Pre-rendered Audio Asset (0ms delay for language switcher/onboarding)
    const matchingAsset = this.getMatchingAudioAsset(text, langCode);
    if (matchingAsset) {
      await this.playAudioAsset(matchingAsset, onEnd);
      return;
    }

    // 3. Try ElevenLabs Multilingual v2 with Voice ID 9vP6R7VVxNwGIGLnpl17 (Suhana J) if configured
    if (elevenLabsService.hasApiKey()) {
      try {
        const audioUrl = await elevenLabsService.synthesizeSpeech(text, langCode);
        if (audioUrl) {
          this.dynamicTtsCache.set(cacheKey, audioUrl);
          await this.playAudioAsset(audioUrl, onEnd);
          return;
        }
      } catch (err) {
        console.warn('[ElevenLabs Synthesis Fallback]', err);
      }
    }

    // 4. Dynamic High-Fidelity Companion Voice Synthesis via /api/tts (ElevenLabs or Suhana J child neural)
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 7000);
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          text, 
          lang: langCode,
          apiKey: elevenLabsService.getApiKey()
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
        }
      }
    } catch (err) {
      console.warn('[TTS API Endpoint Notice]', err);
    }

    // 5. Emergency offline browser acoustic child companion speech
    this.speakFallback(text, lang, onEnd);
  }

  private speakFallback(text: string, lang: string, onEnd?: () => void) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      if (onEnd) setTimeout(onEnd, 1800);
      return;
    }

    const doSpeak = () => {
      try {
        window.speechSynthesis.cancel(); // Stop prior utterance

        // Clean text: strip markdown characters (*, _, #, `, etc.) so speech doesn't read symbols
        const cleanText = text
          .replace(/[*_#`~[\]()<>]/g, ' ')
          .replace(/\s+/g, ' ')
          .trim();

        if (!cleanText) {
          if (onEnd) onEnd();
          return;
        }

        const utterance = new SpeechSynthesisUtterance(cleanText);
        this.currentUtterance = utterance; // Prevent Chromium garbage collection bug

        // Suhana J voice acoustic configuration:
        // Pitch: 1.60 matches the youthful, bright, innocent 6-year-old storyteller tone
        utterance.pitch = 1.60;
        // Rate: 0.92 ensures calm, gentle, respectful clarity for elderly ears
        utterance.rate = 0.92;
        utterance.volume = 1.0;
        utterance.lang = lang;

        // Strictly select a cute girl/female voice matching the language
        const selectedVoice = this.selectCuteGirlVoice(lang);
        if (selectedVoice) {
          utterance.voice = selectedVoice;
        }

        const handleFinish = () => {
          this.currentUtterance = null;
          if (onEnd) onEnd();
        };

        utterance.onend = handleFinish;
        utterance.onerror = (e) => {
          if (e.error !== 'canceled' && e.error !== 'interrupted') {
            console.warn('[SANGPA Voice Synthesis Event]', e.error);
          }
          handleFinish();
        };

        window.speechSynthesis.speak(utterance);
      } catch (err) {
        console.error('[SANGPA Voice Error]', err);
        if (onEnd) onEnd();
      }
    };

    // Ensure voices are loaded before speaking
    const voices = this.getVoices();
    if (voices.length === 0 && 'onvoiceschanged' in window.speechSynthesis) {
      const onVoices = () => {
        window.speechSynthesis.onvoiceschanged = null;
        doSpeak();
      };
      window.speechSynthesis.onvoiceschanged = onVoices;
      setTimeout(doSpeak, 200);
    } else {
      doSpeak();
    }
  }

  // Play the authentic bundled sample of Suhana J from ElevenLabs (Voice 9vP6R7VVxNwGIGLnpl17)
  playSuhanaAuthenticSample(onEnd?: () => void): Promise<void> {
    return this.playAudioAsset('/assets/voice_suhana_preview.mp3', onEnd);
  }

  // Play authentic Hindi sample of Sangpa (Voice 9vP6R7VVxNwGIGLnpl17 persona)
  playHindiAuthenticSample(onEnd?: () => void): Promise<void> {
    return this.playAudioAsset('/assets/voice_hi_greeting.mp3', onEnd);
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
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }
}

export const audio = new AudioManager();
