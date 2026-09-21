/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_OPENAI_API_KEY?: string;
  readonly VITE_ELEVENLABS_VOICE_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare const process: {
  env?: {
    ELEVENLABS_VOICE_ID?: string;
    VITE_ELEVENLABS_VOICE_ID?: string;
    [key: string]: string | undefined;
  };
};
