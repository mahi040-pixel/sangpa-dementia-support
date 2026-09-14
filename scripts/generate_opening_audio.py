import asyncio
import edge_tts
import os
import sys

AUDIO_ITEMS = [
    # Assamese
    (
        "public/assets/voice_as_ready.mp3",
        "নমস্কাৰ! চাংপা অসমীয়াত সাজু।",
        "bn-IN-TanishaaNeural",
        "+28Hz",
        "-3%"
    ),
    (
        "public/assets/voice_as_opening_instructions.mp3",
        "নমস্কাৰ! চাংপালৈ আপোনাক সাদৰ স্বাগতম জনাইছোঁ। আপুনি যদি নিজৰ যত্ন, লঘু ব্যায়াম আৰু স্মৃতিৰ খেলাৰ বাবে আহিছে, তেন্তে তলৰ ডাঙৰ সেউজীয়া বুটামটো টিপক। আৰু যদি আপুনি পৰিয়ালৰ যত্নকৰ্তা, তেন্তে বগা বুটামটো বাছক। মই আপোনাৰ লগতেই আছোঁ!",
        "bn-IN-TanishaaNeural",
        "+28Hz",
        "-3%"
    ),
    (
        "public/assets/voice_as_patient_welcome.mp3",
        "নমস্কাৰ কমলা আইতা! চাংপালৈ স্বাগতম।",
        "bn-IN-TanishaaNeural",
        "+28Hz",
        "-3%"
    ),
    # Manipuri
    (
        "public/assets/voice_mni_ready.mp3",
        "খুরুমজরি! সাংপা মৈতৈলোন্দা শেম-শারে।",
        "bn-IN-TanishaaNeural",
        "+28Hz",
        "-3%"
    ),
    (
        "public/assets/voice_mni_opening_instructions.mp3",
        "খুরুমজরি! সাংপাদা তরাম্না ওকচরি। অদোম নুমিৎ খুদিংগী য়েংশিনবা, অরোইবা এক্সারসাইজ অমসুং নীংশিংবগী শান্ন-খোৎনবগীদমক লাকপীরবদি, মখাগী অশেংবা অচৌবা অতেনবা বটনদু নম্বীয়ু। অদোম য়ুমগী য়েংশিনবীরিবা মী ওইরবদি, অঙৌবা বটনদু খনবীয়ু। ঐহাক অদোমগা লোয়ননা লৈজরি!",
        "bn-IN-TanishaaNeural",
        "+28Hz",
        "-3%"
    ),
    # Bengali
    (
        "public/assets/voice_bn_ready.mp3",
        "নমস্কার! সাংপা বাংলায় প্রস্তুত।",
        "bn-IN-TanishaaNeural",
        "+28Hz",
        "-3%"
    ),
    (
        "public/assets/voice_bn_opening_instructions.mp3",
        "নমস্কার! সাংপাতে আপনাকে অনেক ভালোবাসা ও স্বাগতম। আপনি যদি নিজের যত্ন, সহজ শরীরচর্চা ও স্মৃতি খেলার জন্য এসে থাকেন, তবে নিচের বড় সবুজ বোতামটি চাপুন। আর আপনি যদি পরিবারের যত্নকারী হন, তবে সাদা বোতামটি বেছে নিন। আমি সবসময় আপনার সাথে আছি!",
        "bn-IN-TanishaaNeural",
        "+28Hz",
        "-3%"
    ),
    # English
    (
        "public/assets/voice_en_ready.mp3",
        "Namaste! Sangpa is ready in English.",
        "en-IN-NeerjaNeural",
        "+30Hz",
        "-4%"
    ),
    (
        "public/assets/voice_en_opening_instructions.mp3",
        "Namaste! Welcome home to SANGPA. If you are here for gentle activities and care, tap the large green button below. If you are a family caregiver, tap the white button. I am right here with you!",
        "en-IN-NeerjaNeural",
        "+30Hz",
        "-4%"
    ),
    # Nagamese
    (
        "public/assets/voice_nag_ready.mp3",
        "Namaste! Sangpa Nagamese te ready asey.",
        "en-IN-NeerjaNeural",
        "+30Hz",
        "-4%"
    ),
    (
        "public/assets/voice_nag_opening_instructions.mp3",
        "Namaste! SANGPA te apuni laga swagat asey. Apuni bhal dhyan aru sohoj exercise karne aahise koile green button dababi. Aru apuni family caregiver asey koile white button chunibi. Moi apuni logote asey!",
        "en-IN-NeerjaNeural",
        "+30Hz",
        "-4%"
    ),
]

async def generate_all():
    for filepath, text, voice, pitch, rate in AUDIO_ITEMS:
        print(f"Generating {filepath} with voice {voice}...")
        try:
            comm = edge_tts.Communicate(text=text, voice=voice, pitch=pitch, rate=rate)
            await comm.save(filepath)
            size = os.path.getsize(filepath)
            print(f"[OK] Created {filepath} ({size} bytes)")
        except Exception as e:
            print(f"[ERR] Failed {filepath}: {e}")

if __name__ == "__main__":
    asyncio.run(generate_all())
