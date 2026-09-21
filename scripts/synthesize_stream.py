import sys
import asyncio
import edge_tts
import io
import os
import json
import urllib.request
import urllib.error

# ElevenLabs Authentic Mascot Voice Configuration
ELEVENLABS_VOICE_ID = (
    os.environ.get("ELEVENLABS_VOICE_ID")
    or os.environ.get("VITE_ELEVENLABS_VOICE_ID")
    or "5f1FjpWl2X8UqTlgo9Ov"
)
ELEVENLABS_MODEL_ID = "eleven_multilingual_v2"

# High-Pitch Edge Neural Voice Timbre Map (+28Hz to +32Hz) modeled to match Suhana J's young child persona
VOICE_MAP = {
    "hi": ("hi-IN-SwaraNeural", "+32Hz", "-4%"),
    "bn": ("bn-IN-TanishaaNeural", "+28Hz", "-3%"),
    "as": ("bn-IN-TanishaaNeural", "+28Hz", "-3%"),
    "mni": ("bn-IN-TanishaaNeural", "+28Hz", "-3%"),
    "mn": ("bn-IN-TanishaaNeural", "+28Hz", "-3%"),
    "nag": ("en-IN-NeerjaNeural", "+30Hz", "-4%"),
    "en": ("en-IN-NeerjaNeural", "+30Hz", "-4%"),
    "es": ("es-ES-ElviraNeural", "+25Hz", "-3%"),
}

def try_elevenlabs_synthesize(text: str, api_key: str) -> bytes | None:
    """Attempts speech synthesis via ElevenLabs Multilingual v2 with Suhana J voice."""
    clean_key = (api_key or "").strip()
    if not clean_key or len(clean_key) < 6:
        # Check environment variables
        clean_key = (os.environ.get("VITE_ELEVENLABS_API_KEY") or os.environ.get("ELEVENLABS_API_KEY") or "").strip()

    if not clean_key or len(clean_key) < 6:
        return None

    try:
        url = f"https://api.elevenlabs.io/v1/text-to-speech/{ELEVENLABS_VOICE_ID}?output_format=mp3_44100_128"
        headers = {
            "Content-Type": "application/json",
            "xi-api-key": clean_key,
            "Accept": "audio/mpeg"
        }
        payload = json.dumps({
            "text": text,
            "model_id": ELEVENLABS_MODEL_ID,
            "voice_settings": {
                "stability": 0.55,
                "similarity_boost": 0.85,
                "use_speaker_boost": True
            }
        }).encode("utf-8")

        req = urllib.request.Request(url, data=payload, headers=headers, method="POST")
        with urllib.request.urlopen(req, timeout=12) as response:
            if response.status == 200:
                audio_bytes = response.read()
                if audio_bytes and len(audio_bytes) > 200:
                    return audio_bytes
    except Exception as e:
        sys.stderr.write(f"[ElevenLabs API notice: {e}]\n")
    return None

async def synthesize_edge(text: str, lang: str = "hi") -> bytes:
    """High-pitch edge neural child voice synthesis fallback."""
    lang_normalized = lang.lower().split('-')[0].strip()
    voice_info = VOICE_MAP.get(lang_normalized) or VOICE_MAP.get(lang[:2].lower(), VOICE_MAP["hi"])
    voice, pitch, rate = voice_info
    comm = edge_tts.Communicate(text=text, voice=voice, pitch=pitch, rate=rate)
    buffer = io.BytesIO()
    async for chunk in comm.stream():
        if chunk["type"] == "audio":
            buffer.write(chunk["data"])
    return buffer.getvalue()

if __name__ == "__main__":
    lang = sys.argv[1] if len(sys.argv) > 1 else "hi"
    api_key_arg = sys.argv[2] if len(sys.argv) > 2 else ""

    raw_bytes = sys.stdin.buffer.read()
    input_text = raw_bytes.decode('utf-8', errors='replace').strip()

    if not input_text and len(sys.argv) > 3:
        input_text = sys.argv[3]

    if not input_text:
        sys.exit(1)

    # 1. Try ElevenLabs Suhana J first if API key is present
    eleven_audio = try_elevenlabs_synthesize(input_text, api_key_arg)
    if eleven_audio:
        sys.stdout.buffer.write(eleven_audio)
        sys.exit(0)

    # 2. Seamlessly fallback to high-fidelity child neural voice
    try:
        audio_data = asyncio.run(synthesize_edge(input_text, lang))
        sys.stdout.buffer.write(audio_data)
    except Exception as e:
        sys.stderr.write(str(e))
        sys.exit(1)
