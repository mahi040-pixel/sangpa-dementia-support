import { LanguageCode } from '../types';

export interface SpeechRecognitionResultHandler {
  onStart?: () => void;
  onResult: (transcript: string, isFinal: boolean) => void;
  onError?: (error: string) => void;
  onEnd?: () => void;
}

// Map app language code to speech recognition BCP-47 locale
export function getSpeechRecognitionLocale(lang: LanguageCode): string {
  switch (lang) {
    case 'hi': return 'hi-IN';
    case 'bn': return 'bn-IN';
    case 'as': return 'as-IN';
    case 'mni': return 'hi-IN';
    case 'nag': return 'en-IN';
    case 'es': return 'es-ES';
    case 'en':
    default:
      return 'en-IN';
  }
}

// Check if Web Speech Recognition is supported in the current browser
export function isSpeechRecognitionSupported(): boolean {
  if (typeof window === 'undefined') return false;
  return !!(
    (window as unknown as { SpeechRecognition?: any }).SpeechRecognition ||
    (window as unknown as { webkitSpeechRecognition?: any }).webkitSpeechRecognition
  );
}

class SpeechRecognitionManager {
  private recognition: any = null;
  private isCurrentlyListening: boolean = false;
  private currentHandler: SpeechRecognitionResultHandler | null = null;

  constructor() {
    this.initRecognition();
  }

  private initRecognition() {
    if (typeof window === 'undefined') return;

    const SpeechRec = 
      (window as unknown as { SpeechRecognition?: any }).SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition?: any }).webkitSpeechRecognition;

    if (!SpeechRec) return;

    try {
      this.recognition = new SpeechRec();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.maxAlternatives = 1;

      this.recognition.onstart = () => {
        this.isCurrentlyListening = true;
        if (this.currentHandler?.onStart) {
          this.currentHandler.onStart();
        }
      };

      this.recognition.onresult = (event: any) => {
        if (!this.currentHandler) return;

        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const result = event.results[i];
          const transcript = result[0]?.transcript || '';
          if (result.isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        const text = finalTranscript || interimTranscript;
        const isFinal = !!finalTranscript;
        if (text.trim()) {
          this.currentHandler.onResult(text.trim(), isFinal);
        }
      };

      this.recognition.onerror = (event: any) => {
        console.warn('[SpeechRecognition Error]', event.error);
        if (event.error !== 'no-speech') {
          this.isCurrentlyListening = false;
          if (this.currentHandler?.onError) {
            this.currentHandler.onError(event.error);
          }
        }
      };

      this.recognition.onend = () => {
        this.isCurrentlyListening = false;
        if (this.currentHandler?.onEnd) {
          this.currentHandler.onEnd();
        }
      };
    } catch (e) {
      console.error('[SpeechRecognition Init Failed]', e);
    }
  }

  startListening(lang: LanguageCode, handler: SpeechRecognitionResultHandler): boolean {
    if (!this.recognition) {
      this.initRecognition();
    }

    if (!this.recognition) {
      console.warn('SpeechRecognition not supported in this browser.');
      return false;
    }

    try {
      // Stop previous instance if running
      if (this.isCurrentlyListening) {
        this.recognition.abort();
      }

      this.currentHandler = handler;
      this.recognition.lang = getSpeechRecognitionLocale(lang);
      this.recognition.start();
      this.isCurrentlyListening = true;
      return true;
    } catch (err: any) {
      // If already started, set current language and handler
      if (err.name === 'InvalidStateError') {
        this.isCurrentlyListening = true;
        return true;
      }
      console.error('[SpeechRecognition Start Error]', err);
      return false;
    }
  }

  stopListening() {
    if (this.recognition && this.isCurrentlyListening) {
      try {
        this.recognition.stop();
      } catch (e) {
        // ignore
      }
    }
    this.isCurrentlyListening = false;
  }

  isListening(): boolean {
    return this.isCurrentlyListening;
  }
}

export const speechRecognizer = new SpeechRecognitionManager();
