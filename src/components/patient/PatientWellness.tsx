import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ArrowLeft, 
  Volume2, 
  Play, 
  Pause, 
  CheckCircle, 
  HeartHandshake, 
  ShieldAlert, 
  Sparkles, 
  Info, 
  RotateCcw,
  ExternalLink,
  Video as VideoIcon
} from 'lucide-react';
import { audio } from '../../utils/audio';
import { PATIENT_I18N, APP_VOICE_RESPONSES } from '../../utils/localization';
import { LanguageCode } from '../../types';

type ExerciseId = 'hand_claps' | 'hand_raises' | 'shoulder_circles' | 'deep_breaths';

interface ExerciseItem {
  id: ExerciseId;
  icon: string;
  hasVideo: boolean;
  titles: Record<LanguageCode, string>;
  subtitles: Record<LanguageCode, string>;
  duration: Record<LanguageCode, string>;
}

const EXERCISES: ExerciseItem[] = [
  {
    id: 'hand_claps',
    icon: '👏',
    hasVideo: true,
    titles: {
      en: 'Hand Claps',
      hi: 'हाथों की ताली (Hand Claps)',
      as: 'হাত চাপৰি (Hand Claps)',
      bn: 'হাতে তালি (Hand Claps)',
      mni: 'খুত খোয় থাবা (Hand Claps)',
      nag: 'Haath Taali (Hand Claps)',
      es: 'Aplausos Rítmicos (Hand Claps)'
    },
    subtitles: {
      en: 'Watch the video demonstration & clap along to boost palm circulation and alertness.',
      hi: 'वीडियो प्रदर्शन देखें और रक्त संचार व स्फूर्ति बढ़ाने के लिए ताल के साथ ताली बजाएं।',
      as: 'ভিডিঅ\' প্ৰদৰ্শন চাওক আৰু ৰক্ত সঞ্চালন বৃদ্ধিৰ বাবে তালত হাত চাপৰি বজাওক।',
      bn: 'ভিডিও প্রদর্শন দেখুন এবং রক্ত সঞ্চালন বাড়াতে ছন্দের সাথে তালি বাজান।',
      mni: 'ভিদিও য়েংদুনা পুন্না খোয় থাবীয়ু অমসুং ঈগী খোঙজেল হেনগৎহনবীয়ু।',
      nag: 'Video sabhi aru rhythm logot taali bajaabi blood circulation bhal hobole.',
      es: 'Vea la demostración en video y aplauda al ritmo para mejorar la circulación.'
    },
    duration: {
      en: '2 mins',
      hi: '2 मिनट',
      as: '২ মিনিট',
      bn: '২ মিনিট',
      mni: 'মিনিট ২',
      nag: '2 mins',
      es: '2 min'
    }
  },
  {
    id: 'hand_raises',
    icon: '🙌',
    hasVideo: false,
    titles: {
      en: 'Gentle Hand Raises',
      hi: 'हाथ धीरे से ऊपर उठाएं',
      as: 'হাত লাহেকৈ ওপৰলৈ তোলক',
      bn: 'হাত ধীরে ধীরে উপরে তুলুন',
      mni: 'খুত তপ্না ৱাংনা থাংগৎপীয়ু',
      nag: 'Haath Dheere Uthabi',
      es: 'Levantar Manos Suavemente'
    },
    subtitles: {
      en: 'Slowly lift both hands to chest height. Breathe in softly and relax.',
      hi: 'दोनों हाथों को छाती की ऊंचाई तक धीरे-धीरे उठाएं। आराम से सांस लें।',
      as: 'দুয়োখন হাত বুকুলৈকে তোলক আৰু শান্তভাৱে উশাহ লওক।',
      bn: 'দুটো হাত বুকের উচ্চতা পর্যন্ত তুলুন এবং শান্তভাবে শ্বাস নিন।',
      mni: 'খুত অনিমক থবাক্তা য়ৌনা তপ্না থাংগৎপীয়ু অমসুং ঈন-হুন তৌবীয়ু।',
      nag: 'Dui ta haath chest tok uthabi aru aaram pora saas lobi.',
      es: 'Levante ambas manos suavemente a la altura del pecho y respire profundo.'
    },
    duration: {
      en: '1 min',
      hi: '1 मिनट',
      as: '১ মিনিট',
      bn: '১ মিনিট',
      mni: 'মিনিট ১',
      nag: '1 min',
      es: '1 min'
    }
  },
  {
    id: 'shoulder_circles',
    icon: '🧘',
    hasVideo: false,
    titles: {
      en: 'Shoulder Circles',
      hi: 'कंधों को गोल घुमाएं',
      as: 'কান্ধৰ সঞ্চালন',
      bn: 'কাঁধ ঘোরান',
      mni: 'লেংবান কোয়শিনবা',
      nag: 'Kaandh Ghuraabi',
      es: 'Círculos con Hombros'
    },
    subtitles: {
      en: 'Roll shoulders gently backward twice, then forward twice without strain.',
      hi: 'कंधों को दो बार पीछे की ओर और दो बार आगे की ओर हल्के से घुमाएं।',
      as: 'কান্ধ দুবাৰ পিছলৈ আৰু দুবাৰ আগলৈ লাহেকৈ ঘূৰাওক।',
      bn: 'কাঁধ হালকা করে দুইবার পেছনে ও দুইবার সামনে ঘোরান।',
      mni: 'লেংবান অনিমক তুংদা অনিরক অমসুং মমাংদা অনিরক কোয়শিনবীয়ু।',
      nag: 'Kaandh piche te dui bar aru aage te dui bar ghuraabi.',
      es: 'Gire suavemente los hombros hacia atrás y hacia adelante.'
    },
    duration: {
      en: '1 min',
      hi: '1 मिनट',
      as: '১ মিনিট',
      bn: '১ মিনিট',
      mni: 'মিনিট ১',
      nag: '1 min',
      es: '1 min'
    }
  },
  {
    id: 'deep_breaths',
    icon: '🌸',
    hasVideo: false,
    titles: {
      en: 'Deep Peaceful Breath',
      hi: 'गहरी शांत सांस लें',
      as: 'গভীৰ উশাহ লওক',
      bn: 'গভীর শ্বাস নিন',
      mni: 'লুপ্না ঈন-হুন তৌবীয়ু',
      nag: 'Lamba Saas Lobi',
      es: 'Respiración Profunda'
    },
    subtitles: {
      en: 'Place one hand over your heart and take two slow, calming breaths.',
      hi: 'एक हाथ हृदय पर रखें और दो बार गहरी व शांत सांस लें।',
      as: 'বুকুত হাত থৈ দুবাৰ গভীৰ আৰু শান্ত উশাহ লওক।',
      bn: 'বুকে হাত রেখে দুইবার ধীরে ধীরে শান্ত শ্বাস নিন।',
      mni: 'থম্মোয়দা খুত থমদুনা অনিরক লুপ্না ঈন-হুন তৌবীয়ু।',
      nag: 'Dil upor te haath rakhi 2 bar lamba saas lobi.',
      es: 'Coloque una mano sobre el pecho y respire suave y profundamente.'
    },
    duration: {
      en: '1 min',
      hi: '1 मिनट',
      as: '১ মিনিট',
      bn: '১ মিনিট',
      mni: 'মিনিট ১',
      nag: '1 min',
      es: '1 min'
    }
  }
];

export const PatientWellness: React.FC = () => {
  const { setPatientScreen, speakMascot, language } = useApp();

  // Active exercise selection
  const [selectedExercise, setSelectedExercise] = useState<ExerciseId>('hand_claps');
  
  const videoRef = useRef<HTMLVideoElement>(null);

  // Stepper state for other gentle movements
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [caregiverMode, setCaregiverMode] = useState<boolean>(true);
  const [exerciseCompleted, setExerciseCompleted] = useState<boolean>(false);

  const i18n = PATIENT_I18N[language] || PATIENT_I18N.en;

  // Voice guide triggers
  const handlePlayVoiceFood = () => {
    const msg = APP_VOICE_RESPONSES.foodVoice[language] || APP_VOICE_RESPONSES.foodVoice.en;
    speakMascot(msg, 'speaking');
  };

  const handlePlayVoiceHandClaps = () => {
    audio.playCuteChime();
    const prompt = APP_VOICE_RESPONSES.handClapsStart[language] || APP_VOICE_RESPONSES.handClapsStart.en;
    speakMascot(prompt, 'speaking');
  };

  // Non-video exercise stepper controls
  const handleToggleExercise = () => {
    if (!isPlaying) {
      setIsPlaying(true);
      audio.playTempleBell();
      const prompt = APP_VOICE_RESPONSES.exerciseStart[language] || APP_VOICE_RESPONSES.exerciseStart.en;
      speakMascot(prompt, 'speaking');
    } else {
      setIsPlaying(false);
    }
  };

  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(s => s + 1);
      audio.playGentleChime();
    } else {
      setIsPlaying(false);
      setExerciseCompleted(true);
      audio.playSuccessJingle();
      const finishMsg = APP_VOICE_RESPONSES.exerciseFinish[language] || APP_VOICE_RESPONSES.exerciseFinish.en;
      speakMascot(finishMsg, 'speaking');
    }
  };

  // Helper labels
  const getUiLabel = (key: string) => {
    const labels: Record<string, Record<LanguageCode, string>> = {
      chooseExercise: {
        en: 'Choose an Exercise',
        hi: 'व्यायाम चुनें',
        as: 'ব্যায়াম বাছক',
        bn: 'ব্যায়াম নির্বাচন করুন',
        mni: 'এক্সরসাইজ খনবীয়ু',
        nag: 'Exercise chunibi',
        es: 'Elija un ejercicio'
      },
      videoGuideBadge: {
        en: '▶ Video Demonstration',
        hi: '▶ वीडियो प्रदर्शन',
        as: '▶ ভিডিঅ\' প্ৰদৰ্শন',
        bn: '▶ ভিডিও প্রদর্শন',
        mni: '▶ ভিদিও প্ৰদৰ্শন',
        nag: '▶ Video Guide',
        es: '▶ Demostración en video'
      },
      listenVoiceGuide: {
        en: "Listen to Sangpa's Voice Guide",
        hi: 'सांगपा के निर्देश सुनें',
        as: 'ছাংপাৰ নিৰ্দেশনা শুনক',
        bn: 'সাংপার নির্দেশ শুনুন',
        mni: 'সাংপাগী পাউতাক তাবীয়ু',
        nag: 'Sangpa laga aawaz sunibi',
        es: 'Escuchar guía de Sangpa'
      },
      openDriveVideo: {
        en: 'Open Video in Google Drive',
        hi: 'गूगल ड्राइव में वीडियो खोलें',
        as: 'গুগল ড্ৰাইভত ভিডিঅ\' খোলক',
        bn: 'গুগল ড্রাইভে ভিডিও দেখুন',
        mni: 'গুগল দ্রাইফতা ভিদিও হাংদোকপীয়ু',
        nag: 'Google Drive te video khulibi',
        es: 'Abrir video en Google Drive'
      }
    };
    return labels[key]?.[language] || labels[key]?.en || '';
  };

  const activeItem = EXERCISES.find(e => e.id === selectedExercise) || EXERCISES[0];

  return (
    <div className="flex-1 p-4 sm:p-6 max-w-2xl mx-auto w-full space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-sangpa-200 pb-3">
        <button
          onClick={() => setPatientScreen('home')}
          className="p-2 rounded-2xl bg-white border border-sangpa-300 hover:bg-sangpa-100 text-sangpa-800 transition-colors shadow-2xs"
          title={i18n.back}
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-sangpa-900 tracking-tight">
            {i18n.wellnessTitle}
          </h2>
          <p className="text-xs sm:text-sm text-sangpa-600">
            {i18n.wellnessSubtitle}
          </p>
        </div>
      </div>

      {/* Safety Sitting Banner */}
      <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs sm:text-sm shadow-2xs">
        <ShieldAlert className="w-5 h-5 text-amber-600 flex-shrink-0" />
        <span className="font-medium">
          {language === 'hi' 
            ? 'कुर्सी पर आराम से पीठ टिकाकर बैठें। शरीर पर ज़ोर न डालें।' 
            : 'Keep your back resting comfortably against the chair. Never force any movement.'}
        </span>
      </div>

      {/* Exercise Selection Grid / Carousel */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs sm:text-sm font-bold text-sangpa-800 uppercase tracking-wide">
            {getUiLabel('chooseExercise')}
          </span>
          <span className="text-xs text-sangpa-500">
            {EXERCISES.length} {language === 'hi' ? 'व्यायाम' : 'exercises'}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
          {EXERCISES.map((ex) => {
            const isSelected = selectedExercise === ex.id;
            return (
              <button
                key={ex.id}
                onClick={() => {
                  setSelectedExercise(ex.id);
                  audio.playGentleChime();
                  if (ex.id === 'hand_claps') {
                    // Trigger Mascot greeting for hand claps
                    const prompt = APP_VOICE_RESPONSES.handClapsStart[language] || APP_VOICE_RESPONSES.handClapsStart.en;
                    speakMascot(prompt, 'speaking');
                  }
                }}
                className={`p-3 sm:p-3.5 rounded-2xl border-2 text-left transition-all relative flex flex-col justify-between ${
                  isSelected
                    ? 'bg-sangpa-100/90 border-sangpa-500 shadow-sm scale-[1.01] ring-2 ring-sangpa-400/30'
                    : 'bg-white border-sangpa-200 hover:border-sangpa-300 hover:bg-sangpa-50/60 shadow-2xs'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1.5">
                    <span className="text-2xl sm:text-3xl">{ex.icon}</span>
                    {ex.hasVideo && (
                      <span className="px-2 py-0.5 rounded-full bg-red-600 text-white font-black text-[10px] sm:text-[11px] shadow-xs flex items-center gap-1 animate-pulse">
                        <VideoIcon className="w-3 h-3" />
                        <span>VIDEO</span>
                      </span>
                    )}
                  </div>
                  <h4 className="font-extrabold text-xs sm:text-sm text-sangpa-900 line-clamp-2 leading-tight">
                    {ex.titles[language] || ex.titles.en}
                  </h4>
                </div>

                <div className="mt-2 flex items-center justify-between pt-1 border-t border-sangpa-200/60 text-[11px] text-sangpa-600">
                  <span>⏱ {ex.duration[language] || ex.duration.en}</span>
                  {isSelected && (
                    <span className="text-sangpa-700 font-bold text-[10px] uppercase tracking-wider">
                      ● {language === 'hi' ? 'सक्रिय' : 'Active'}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ACTIVE EXERCISE VIEW */}
      {selectedExercise === 'hand_claps' ? (
        /* HAND CLAPS EXERCISE (WITH VIDEO PLAYER) */
        <div className="bg-white border-2 border-sangpa-300 rounded-3xl p-4 sm:p-5 shadow-card space-y-4">
          {/* Card Header */}
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-700 border border-red-200 font-extrabold text-xs mb-1">
                <VideoIcon className="w-3.5 h-3.5 text-red-600" />
                <span>{getUiLabel('videoGuideBadge')}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-sangpa-950 flex items-center gap-2">
                <span>👏</span>
                <span>{activeItem.titles[language] || activeItem.titles.en}</span>
              </h3>
              <p className="text-xs sm:text-sm text-sangpa-700 mt-0.5">
                {activeItem.subtitles[language] || activeItem.subtitles.en}
              </p>
            </div>

            <button
              onClick={handlePlayVoiceHandClaps}
              className="p-2.5 rounded-2xl bg-sangpa-100 hover:bg-sangpa-200 text-sangpa-800 transition-colors shadow-2xs flex-shrink-0"
              title={getUiLabel('listenVoiceGuide')}
            >
              <Volume2 className="w-5 h-5 text-sangpa-700" />
            </button>
          </div>

          {/* EMBEDDED VIDEO PLAYER */}
          <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-black border-2 border-sangpa-300 shadow-md">
            <video
              ref={videoRef}
              src="/videos/hand_claps.mp4"
              controls
              playsInline
              preload="metadata"
              className="w-full max-h-[360px] sm:max-h-[420px] object-contain mx-auto bg-black block"
            >
              <source src="/videos/hand_claps.mp4" type="video/mp4" />
              <source src="/assets/hand_claps.mp4" type="video/mp4" />
              Your browser does not support playing this video.
            </video>
          </div>

          {/* Video External Link & Info Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 p-2.5 rounded-xl bg-sangpa-50 border border-sangpa-200 text-xs text-sangpa-800">
            <div className="flex items-center gap-1.5 text-sangpa-700">
              <Sparkles className="w-4 h-4 text-sangpa-600 flex-shrink-0" />
              <span className="font-semibold">
                {language === 'hi' 
                  ? 'वीडियो देखकर लय के साथ ताली बजाएं' 
                  : 'Watch the rhythm and follow along gently'}
              </span>
            </div>
            <a
              href="https://drive.google.com/file/d/183bhX1l3uIl1tzJbq4cyK_52Zezo9_Hk/view?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-bold text-sangpa-700 hover:text-sangpa-900 hover:underline flex-shrink-0"
            >
              <span>{getUiLabel('openDriveVideo')}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      ) : (
        /* OTHER GENTLE CHAIR MOVEMENTS (STEP GUIDED) */
        <div className="bg-white border-2 border-sangpa-300 rounded-3xl p-5 shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="px-3 py-1 rounded-full bg-sangpa-100 text-sangpa-800 font-bold text-xs uppercase tracking-wider">
                {i18n.dailyMovementTitle}
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-sangpa-900 mt-1">
                {activeItem.titles[language] || activeItem.titles.en}
              </h3>
            </div>

            <button
              onClick={() => setCaregiverMode(!caregiverMode)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold transition-colors border ${
                caregiverMode
                  ? 'bg-sangpa-100 border-sangpa-300 text-sangpa-800'
                  : 'bg-gray-100 border-gray-300 text-gray-600'
              }`}
            >
              <HeartHandshake className="w-3.5 h-3.5 text-sangpa-600" />
              <span>{caregiverMode ? (language === 'hi' ? "रिया के साथ" : "With Caregiver") : (language === 'hi' ? "अकेले" : "Solo")}</span>
            </button>
          </div>

          {/* Illustrated Mascot Guide */}
          <div className="bg-sangpa-50 border-2 border-sangpa-200 rounded-2xl p-5 text-center relative overflow-hidden">
            <div className="w-24 h-24 mx-auto mb-3 rounded-full overflow-hidden border-3 border-sangpa-400 bg-white p-1 shadow-sm">
              <img 
                src="/assets/mascot.png" 
                alt="Mascot Sangpa" 
                className={`w-full h-full object-cover rounded-full ${isPlaying ? 'animate-bounce' : ''}`}
              />
            </div>

            <div className="mb-2">
              <span className="text-xs font-bold text-sangpa-600 uppercase tracking-wide">
                {language === 'hi' ? `कदम ${currentStep} / 3` : `Step ${currentStep} of 3`}
              </span>
              <h4 className="text-lg font-bold text-sangpa-900 mt-0.5">
                {activeItem.titles[language] || activeItem.titles.en}
              </h4>
              <p className="text-sm text-sangpa-700 max-w-md mx-auto mt-1">
                {activeItem.subtitles[language] || activeItem.subtitles.en}
              </p>
            </div>

            {/* Stepper Controls */}
            <div className="flex items-center justify-center gap-3 mt-4">
              <button
                onClick={handleToggleExercise}
                className="p-3.5 rounded-full bg-sangpa-500 hover:bg-sangpa-600 text-white shadow-md transition-all active:scale-95 flex items-center justify-center"
                title={isPlaying ? i18n.pauseExercise : i18n.startExercise}
              >
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
              </button>

              {isPlaying && (
                <button
                  onClick={handleNextStep}
                  className="px-4 py-2.5 rounded-2xl bg-white hover:bg-sangpa-100 border border-sangpa-300 text-sangpa-800 font-bold text-sm shadow-xs transition-all"
                >
                  {currentStep < 3 ? i18n.nextStep : i18n.done}
                </button>
              )}

              {exerciseCompleted && (
                <button
                  onClick={() => {
                    setExerciseCompleted(false);
                    setCurrentStep(1);
                  }}
                  className="flex items-center gap-1 px-3 py-2 rounded-xl bg-sangpa-100 text-sangpa-800 text-xs font-semibold"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{language === 'hi' ? "दोबारा करें" : "Repeat"}</span>
                </button>
              )}
            </div>

            {exerciseCompleted && (
              <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold animate-bounce">
                <CheckCircle className="w-4 h-4" />
                <span>{i18n.completedBadge}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* DAILY MIND-DIET FOOD SUGGESTION CARD */}
      <div className="bg-white border-2 border-sangpa-300 rounded-3xl p-5 shadow-card space-y-4">
        <div className="flex items-center justify-between">
          <span className="px-3 py-1 rounded-full bg-sangpa-100 text-sangpa-800 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-sangpa-600" />
            <span>{i18n.mindDietTitle}</span>
          </span>
          <button
            onClick={handlePlayVoiceFood}
            className="p-2 rounded-full bg-sangpa-100 hover:bg-sangpa-200 text-sangpa-700 transition-colors"
            title={i18n.listenAgain}
          >
            <Volume2 className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl overflow-hidden bg-amber-50 border-2 border-amber-200 flex-shrink-0 relative shadow-sm">
            <img 
              src="https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=300&auto=format&fit=crop&q=80" 
              alt="Khichdi" 
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex-1 text-center sm:text-left">
            <h3 className="text-lg sm:text-xl font-bold text-sangpa-900">
              {language === 'hi' ? 'पालक और अखरोट वाली मूंग दाल खिचड़ी' : 'Moong Dal Khichdi with Spinach & Walnuts'}
            </h3>
            <p className="text-xs sm:text-sm text-sangpa-700 mt-1 leading-relaxed">
              {language === 'hi' 
                ? 'गर्म और आसानी से पचने वाली खिचड़ी जिसमें ताज़ा पालक और अखरोट मिले हैं।'
                : 'Warm, easily digestible rice and yellow lentils folded with tender garden spinach and crushed walnuts.'}
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5 justify-center sm:justify-start">
              <span className="px-2 py-0.5 rounded-md bg-sangpa-50 text-sangpa-800 text-[11px] font-semibold border border-sangpa-200">
                🌱 Folate
              </span>
              <span className="px-2 py-0.5 rounded-md bg-sangpa-50 text-sangpa-800 text-[11px] font-semibold border border-sangpa-200">
                🧠 Omega-3
              </span>
              <span className="px-2 py-0.5 rounded-md bg-sangpa-50 text-sangpa-800 text-[11px] font-semibold border border-sangpa-200">
                💛 Easy Digestion
              </span>
            </div>
          </div>
        </div>

        {/* Caregiver Dietary Note Box */}
        <div className="p-3 bg-sangpa-50 rounded-2xl border border-sangpa-200 text-xs text-sangpa-800">
          <div className="flex items-center gap-1.5 font-bold text-sangpa-900 mb-0.5">
            <Info className="w-3.5 h-3.5 text-sangpa-600" />
            <span>{i18n.caregiverNote}</span>
          </div>
        </div>

        <p className="text-[11px] text-sangpa-500 italic text-center">
          {i18n.dietDisclaimer}
        </p>
      </div>
    </div>
  );
};
