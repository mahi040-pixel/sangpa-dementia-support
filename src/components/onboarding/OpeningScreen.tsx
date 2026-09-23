import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Volume2, 
  VolumeX,
  HeartHandshake, 
  UserCheck, 
  Sparkles, 
  Languages,
  Check
} from 'lucide-react';
import { audio } from '../../utils/audio';
import { LanguageCode } from '../../types';
import { translations } from '../../utils/mockData';

// All 6 fed languages with their authentic high-fidelity companion audio and text
const FED_LANGUAGES: {
  code: LanguageCode;
  label: string;
  audioUrl: string;
  greetingText: string;
}[] = [
  {
    code: 'hi',
    label: 'हिन्दी (Hindi)',
    audioUrl: '/assets/voice_hi_greeting.mp3',
    greetingText: 'नमस्ते! सांगपा हिन्दी में तैयार है।'
  },
  {
    code: 'as',
    label: 'অসমীয়া (Assamese)',
    audioUrl: '/assets/voice_as_ready.mp3',
    greetingText: 'নমস্কাৰ! চাংপা অসমীয়াত সাজু।'
  },
  {
    code: 'en',
    label: 'English',
    audioUrl: '/assets/voice_en_ready.mp3',
    greetingText: 'Namaste! Sangpa is ready in English.'
  },
  {
    code: 'bn',
    label: 'বাংলা (Bengali)',
    audioUrl: '/assets/voice_bn_ready.mp3',
    greetingText: 'নমস্কার! সাংপা বাংলায় প্রস্তুত।'
  },
  {
    code: 'mni',
    label: 'মৈতৈলোন্ (Manipuri)',
    audioUrl: '/assets/voice_mni_ready.mp3',
    greetingText: 'খুরুমজরি! সাংপা মৈতৈলোন্দা শেম-শারে।'
  },
  {
    code: 'nag',
    label: 'নাগামিজ (Nagamese)',
    audioUrl: '/assets/voice_nag_ready.mp3',
    greetingText: 'Namaste! Sangpa Nagamese te ready asey.'
  }
];

export const OpeningScreen: React.FC = () => {
  const {
    setRole,
    setPatientScreen,
    setCaregiverScreen,
    language,
    setLanguage,
    t,
    speakMascot,
    mascotState,
    setMascotState,
    patientProfile
  } = useApp();

  const [spokenSubtitle, setSpokenSubtitle] = useState<string>('');
  const [spokenLangLabel, setSpokenLangLabel] = useState<string>('');
  const isCancelledRef = useRef<boolean>(false);

  const isSpeaking = mascotState === 'speaking';
  const callingName = patientProfile?.preferredName || patientProfile?.name || 'Kamala Dadi';

  // The 6 allowed languages on SANGPA
  const availableLanguages: { code: LanguageCode; label: string; subLabel: string }[] = [
    { code: 'hi', label: 'हिन्दी', subLabel: 'Hindi' },
    { code: 'as', label: 'অসমীয়া', subLabel: 'Assamese' },
    { code: 'en', label: 'English', subLabel: 'Indian Accent' },
    { code: 'bn', label: 'বাংলা', subLabel: 'Bengali' },
    { code: 'mni', label: 'মৈতৈলোন্', subLabel: 'Manipuri' },
    { code: 'nag', label: 'নাগামিজ', subLabel: 'Nagamese' },
  ];

  // Automatic multilingual speech as soon as the app is opened
  useEffect(() => {
    let isMounted = true;
    isCancelledRef.current = false;

    const startSequence = async () => {
      // Small pause for clean DOM and audio context readiness
      await new Promise(r => setTimeout(r, 400));
      if (!isMounted || isCancelledRef.current) return;

      // Play introductory cute chime
      audio.playCuteChime();
      await new Promise(r => setTimeout(r, 200));
      if (!isMounted || isCancelledRef.current) return;

      // Speak sequentially in all fed languages
      for (let i = 0; i < FED_LANGUAGES.length; i++) {
        if (!isMounted || isCancelledRef.current) break;
        const item = FED_LANGUAGES[i];

        setLanguage(item.code);
        setSpokenLangLabel(item.label);
        setSpokenSubtitle(item.greetingText);
        setMascotState('speaking');

        const played = await audio.playAudioAsset(item.audioUrl);

        // If browser autoplay policy blocked audio before any user click
        if (!played && i === 0) {
          console.warn('[Autoplay policy: awaiting first user interaction to speak]');
          setMascotState('idle');
          setSpokenSubtitle('');

          // Trigger automatically on the very first touch/click anywhere on the screen
          const unlockAutoplay = () => {
            window.removeEventListener('click', unlockAutoplay);
            window.removeEventListener('touchstart', unlockAutoplay);
            window.removeEventListener('keydown', unlockAutoplay);
            if (isMounted && !isCancelledRef.current) {
              startSequence();
            }
          };
          window.addEventListener('click', unlockAutoplay, { once: true });
          window.addEventListener('touchstart', unlockAutoplay, { once: true });
          window.addEventListener('keydown', unlockAutoplay, { once: true });
          return;
        }

        // Natural pause between languages
        if (!isMounted || isCancelledRef.current) break;
        await new Promise(r => setTimeout(r, 350));
      }

      if (isMounted && !isCancelledRef.current) {
        setMascotState('idle');
        setSpokenSubtitle('');
      }
    };

    startSequence();

    return () => {
      isMounted = false;
      isCancelledRef.current = true;
      audio.stopSpeaking();
    };
  }, []);

  const handlePlayInstructions = () => {
    if (isSpeaking) {
      isCancelledRef.current = true;
      audio.stopSpeaking();
      setMascotState('idle');
      setSpokenSubtitle('');
      return;
    }

    isCancelledRef.current = true;
    const currentTrans = translations[language] || translations.en;
    const textToSpeak = currentTrans.openingInstruction || currentTrans.tagline;

    setSpokenSubtitle(textToSpeak);
    setSpokenLangLabel(availableLanguages.find(l => l.code === language)?.label || '');
    speakMascot(textToSpeak, 'speaking', language);
  };

  const handleLanguageChange = (newLang: LanguageCode) => {
    isCancelledRef.current = true;
    audio.stopSpeaking();
    setLanguage(newLang);
    
    // Announce the selected language briefly and sweetly in the child voice
    const langGreetings: Record<LanguageCode, string> = {
      hi: 'नमस्ते! सांगपा हिन्दी में तैयार है।',
      as: 'নমস্কাৰ! চাংপা অসমীয়াত সাজু।',
      bn: 'নমস্কার! সাংপা বাংলায় প্রস্তুত।',
      en: 'Namaste! Sangpa is ready in English.',
      mni: 'খুরুমজরি! সাংপা মৈতৈলোন্দা শেম-শারে।',
      nag: 'Namaste! Sangpa Nagamese te ready asey.',
      es: '¡Hola! Sangpa está lista en español.'
    };
    const greeting = langGreetings[newLang] || langGreetings.hi;
    setSpokenSubtitle(greeting);
    setSpokenLangLabel(availableLanguages.find(l => l.code === newLang)?.label || '');
    speakMascot(greeting, 'speaking', newLang);
  };

  const handleSelectPatient = () => {
    isCancelledRef.current = true;
    audio.stopSpeaking();
    audio.playSuccessJingle();
    setRole('patient');
    setPatientScreen('home');
    const greetingMsg = language === 'hi'
      ? `नमस्ते ${callingName}! सांगपा में आपका स्वागत है।`
      : language === 'as'
      ? `নমস্কাৰ ${callingName}! চাংপালৈ স্বাগতম।`
      : language === 'bn'
      ? `নমস্কার ${callingName}! সাংপাতে স্বাগতম।`
      : language === 'mni'
      ? `খুরুমজরি ${callingName}! সাংপাদা তরাম্না ওকচরি।`
      : language === 'nag'
      ? `Namaste ${callingName}! SANGPA te swagat asey.`
      : `Namaste ${callingName}! Welcome home to SANGPA.`;
    speakMascot(greetingMsg, 'speaking', language);
  };

  const handleSelectCaregiver = () => {
    isCancelledRef.current = true;
    audio.stopSpeaking();
    audio.playCuteChime();
    setRole('caregiver_login');
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-5 sm:p-8 max-w-xl mx-auto w-full text-center">
      {/* Top Header Bar: Voice button on left, Language options on TOP RIGHT CORNER */}
      <div className="flex items-center justify-between gap-3 pt-1">
        {/* Voice Playback Button with Cute Sound & Speech */}
        <button
          onClick={handlePlayInstructions}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all shadow-sm active:scale-95 border-2 ${
            isSpeaking
              ? 'bg-sangpa-600 text-white border-sangpa-700 ring-4 ring-sangpa-200 animate-pulse'
              : 'bg-white hover:bg-sangpa-100 text-sangpa-900 border-sangpa-300'
          }`}
          title="Voice playback of instructions in cute child voice"
        >
          {isSpeaking ? (
            <>
              <VolumeX className="w-4 h-4 text-white" />
              <span>Stop Voice</span>
            </>
          ) : (
            <>
              <Volume2 className="w-4 h-4 text-sangpa-600" />
              <span>{t('listenInstructions')}</span>
            </>
          )}
        </button>

        {/* TOP RIGHT CORNER: Hindi, Assamese, English, Bengali, Manipuri, Nagamese */}
        <div className="relative flex items-center gap-1.5 bg-white border-2 border-sangpa-300 hover:border-sangpa-500 rounded-2xl px-3 py-1.5 shadow-xs transition-colors">
          <Languages className="w-4 h-4 text-sangpa-600 flex-shrink-0" />
          <select
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value as LanguageCode)}
            className="bg-transparent text-xs sm:text-sm font-extrabold text-sangpa-900 outline-none cursor-pointer pr-1"
            title="Choose Language"
          >
            {availableLanguages.map((langItem) => (
              <option key={langItem.code} value={langItem.code} className="bg-white text-sangpa-900 font-semibold">
                {langItem.label} ({langItem.subLabel})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Hero Mascot & Branding Area */}
      <div className="my-auto py-4 sm:py-6 flex flex-col items-center">
        {/* Mascot Avatar with Cute Interactive Breathing & Speaking States */}
        <div className="relative mb-4">
          <div 
            onClick={handlePlayInstructions}
            className={`cursor-pointer w-36 h-36 sm:w-44 sm:h-44 rounded-full overflow-hidden border-4 transition-all duration-300 shadow-xl p-1 ${
              isSpeaking
                ? 'border-sangpa-500 ring-8 ring-sangpa-200 shadow-touch animate-mascot-speaking scale-105'
                : 'border-sangpa-400 bg-sangpa-100 hover:border-sangpa-500 animate-mascot-idle'
            }`}
            title="Tap Sangpa to speak instructions"
          >
            <img 
              src="/assets/mascot.png" 
              alt="SANGPA Cute Mascot" 
              className="w-full h-full object-cover rounded-full"
            />
          </div>

          {/* Voice Indicator Badge */}
          <div className="absolute -bottom-2 right-3 bg-sangpa-500 text-white p-2 rounded-full shadow-lg border-2 border-white">
            {isSpeaking ? (
              <Volume2 className="w-4 h-4 animate-bounce" />
            ) : (
              <Sparkles className="w-4 h-4 animate-pulse" />
            )}
          </div>
        </div>

        {/* Spoken Instruction Live Subtitle Bubble */}
        {isSpeaking && (
          <div className="max-w-md w-full mb-3 p-3.5 bg-white border-2 border-sangpa-400 rounded-2xl shadow-sm text-center animate-fadeIn">
            <div className="flex items-center justify-center gap-1.5 mb-1">
              <span className="w-2 h-2 rounded-full bg-sangpa-500 animate-ping" />
              <p className="text-xs font-bold text-sangpa-600 uppercase tracking-wider">
                Sangpa is speaking {spokenLangLabel ? `(${spokenLangLabel})` : ''}:
              </p>
            </div>
            <p className="text-xs sm:text-sm font-semibold text-sangpa-900 leading-snug">
              "{spokenSubtitle || translations[language]?.openingInstruction}"
            </p>
          </div>
        )}

        {/* Brand Name & Tagline */}
        <h1 className="text-3xl sm:text-4xl font-black text-sangpa-900 tracking-tight mb-1">
          {t('appName')}
        </h1>
        <p className="text-sangpa-700 text-lg sm:text-xl font-bold max-w-sm mx-auto leading-relaxed">
          "{t('tagline')}"
        </p>
        <p className="text-sangpa-600 text-xs sm:text-sm mt-1 max-w-xs text-center font-medium">
          Friendly AI companion supporting independence, memory, and heartfelt care.
        </p>
      </div>

      {/* Role Selection Large Buttons */}
      <div className="space-y-3.5 pb-2">
        {/* Patient App Button - Primary High Touch Target */}
        <button
          onClick={handleSelectPatient}
          className="w-full py-5 px-6 rounded-3xl bg-sangpa-500 hover:bg-sangpa-600 active:scale-98 text-white font-black text-lg sm:text-xl shadow-touch transition-all flex items-center justify-center gap-3 border-2 border-sangpa-600"
        >
          <HeartHandshake className="w-7 h-7 flex-shrink-0" />
          <span className="text-left leading-tight">{t('patientBtn')}</span>
        </button>

        {/* Caregiver Button */}
        <button
          onClick={handleSelectCaregiver}
          className="w-full py-4 px-6 rounded-3xl bg-white hover:bg-sangpa-100 active:scale-98 text-sangpa-900 font-extrabold text-base sm:text-lg shadow-sm border-2 border-sangpa-300 transition-all flex items-center justify-center gap-3"
        >
          <UserCheck className="w-6 h-6 text-sangpa-700 flex-shrink-0" />
          <span className="text-left leading-tight">{t('caregiverBtn')}</span>
        </button>
      </div>

      {/* Selected Language Indicator & Reassurance */}
      <div className="text-[11px] text-sangpa-600 text-center font-medium pt-1">
        Selected Language: <span className="font-bold text-sangpa-900">{availableLanguages.find(l => l.code === language)?.label}</span> • Voice tuned for calm clarity.
      </div>
    </div>
  );
};
