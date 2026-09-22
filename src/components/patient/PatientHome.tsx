import React from 'react';
import { useApp } from '../../context/AppContext';
import { MascotCompanion } from '../common/MascotCompanion';
import { 
  CalendarCheck, 
  Bell, 
  Gamepad2, 
  Activity, 
  Heart, 
  AlertCircle, 
  Mic, 
  CheckCircle2, 
  Clock, 
  Droplets,
  HelpCircle,
  ChevronRight
} from 'lucide-react';
import { audio } from '../../utils/audio';
import { LanguageCode } from '../../types';
import { PATIENT_I18N, getLocalizedActivity, APP_VOICE_RESPONSES } from '../../utils/localization';

export const PatientHome: React.FC = () => {
  const {
    t,
    setPatientScreen,
    reminders,
    completeReminder,
    setVoiceModalOpen,
    speakMascot,
    language,
    patientProfile
  } = useApp();

  const i18n = PATIENT_I18N[language] || PATIENT_I18N.en;

  // Dynamic caregiver-entered patient name
  const callingName = patientProfile?.preferredName || patientProfile?.name || 'Kamala Dadi';

  const getLocalizedGreeting = (lang: LanguageCode, name: string) => {
    switch (lang) {
      case 'hi': return `नमस्ते, ${name}`;
      case 'as': return `নমস্কাৰ, ${name}`;
      case 'bn': return `নমস্কার, ${name}`;
      case 'mni': return `খুরুমজরি, ${name}`;
      case 'nag': return `Namaste, ${name}`;
      case 'es': return `Hola, ${name}`;
      case 'en':
      default:
        return `Namaste, ${name}`;
    }
  };

  const getButtonLabel = (key: 'routine' | 'reminders' | 'games' | 'exercise' | 'memories' | 'emergency', lang: LanguageCode) => {
    switch (key) {
      case 'routine':
        switch (lang) {
          case 'hi': return 'दिनचर्या';
          case 'as': return 'ৰুটিন';
          case 'bn': return 'রুটিন';
          case 'mni': return 'নুমিৎখুদিংগী থবক';
          case 'nag': return 'Routine';
          case 'es': return 'Rutina';
          default: return 'Routine';
        }
      case 'reminders':
        switch (lang) {
          case 'hi': return 'याददिहानी';
          case 'as': return 'স্মাৰক';
          case 'bn': return 'অনুস্মারক';
          case 'mni': return 'নিংশিংহনবা';
          case 'nag': return 'Reminders';
          case 'es': return 'Recordatorios';
          default: return 'Reminders';
        }
      case 'games':
        switch (lang) {
          case 'hi': return 'खेल';
          case 'as': return 'খেল-ধেমালি';
          case 'bn': return 'খেলা';
          case 'mni': return 'শান-খোৎনবশিং';
          case 'nag': return 'Games';
          case 'es': return 'Juegos';
          default: return 'Games';
        }
      case 'exercise':
        switch (lang) {
          case 'hi': return 'शारीरिक व्यायाम';
          case 'as': return 'শাৰীৰিক ব্যায়াম';
          case 'bn': return 'শারীরিক ব্যায়াম';
          case 'mni': return 'হকচাংগী এক্সরসাইজ';
          case 'nag': return 'Physical Exercise';
          case 'es': return 'Ejercicio Físico';
          default: return 'Physical Exercise';
        }
      case 'memories':
        switch (lang) {
          case 'hi': return 'यादें';
          case 'as': return 'মৰমৰ স্মৃতি';
          case 'bn': return 'স্মৃতিমালা';
          case 'mni': return 'নিংশিংবাশিং';
          case 'nag': return 'Memories';
          case 'es': return 'Recuerdos';
          default: return 'Memories';
        }
      case 'emergency':
        switch (lang) {
          case 'hi': return 'आपातकालीन सहायता';
          case 'as': return 'জৰুৰীকালীন সাহায্য';
          case 'bn': return 'জরুরি সহায়তা';
          case 'mni': return 'মরুওইবা তেংবাং';
          case 'nag': return 'Emergency';
          case 'es': return 'Emergencia';
          default: return 'Emergency';
        }
    }
  };

  // Find next upcoming reminder
  const nextReminder = reminders.find(r => r.status === 'upcoming') || reminders[1];

  const handleHelpMe = () => {
    audio.playGentleChime();
    setPatientScreen('help');
  };

  const handleCompleteNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (nextReminder) {
      completeReminder(nextReminder.id);
    }
  };

  const localizedNextTitle = nextReminder 
    ? getLocalizedActivity(nextReminder.title, nextReminder.title, language).title
    : '';

  return (
    <div className="flex-1 p-3.5 sm:p-5 max-w-xl mx-auto w-full space-y-3.5 sm:space-y-4">
      {/* Top Greeting Header (Clean, no date/time/day) */}
      <div className="flex items-center justify-between gap-2 border-b border-sangpa-200/80 pb-2.5">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <h2 className="text-xl sm:text-2xl font-extrabold text-sangpa-900 tracking-tight">
            {getLocalizedGreeting(language, callingName)}
          </h2>
        </div>

        {/* Quick Voice / Help touch buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleHelpMe}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-bold border border-amber-300 transition-all active:scale-95 shadow-2xs"
            title={i18n.help}
          >
            <HelpCircle className="w-4 h-4 text-amber-700" />
            <span>{i18n.help}</span>
          </button>

          <button
            onClick={() => setVoiceModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-sangpa-500 hover:bg-sangpa-600 text-white text-xs font-bold shadow-touch transition-all active:scale-95"
            title={i18n.voice}
          >
            <Mic className="w-4 h-4 animate-pulse" />
            <span>{i18n.voice}</span>
          </button>
        </div>
      </div>

      {/* Interactive SANGPA Mascot Companion Hero */}
      <MascotCompanion onOpenChat={() => setPatientScreen('mascot_chat')} />

      {/* Next Up Activity Card */}
      {nextReminder && (
        <div className="bg-white border-2 border-sangpa-300 rounded-2xl p-3 sm:p-4 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <div className="flex items-center gap-1.5 text-sangpa-700 text-xs font-bold uppercase tracking-wider">
              <Clock className="w-3.5 h-3.5 text-sangpa-600" />
              <span>{i18n.nextActivity}</span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-sangpa-100 text-sangpa-800 text-xs font-bold">
              {nextReminder.time}
            </span>
          </div>

          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="p-2 rounded-xl bg-sangpa-100 text-sangpa-700 flex-shrink-0">
                <Droplets className="w-5 h-5 text-sangpa-600" />
              </div>
              <h3 className="text-base font-extrabold text-sangpa-900 truncate">
                {localizedNextTitle}
              </h3>
            </div>

            <button
              onClick={handleCompleteNext}
              className="flex items-center justify-center gap-1.5 py-2 px-3.5 rounded-xl bg-sangpa-500 hover:bg-sangpa-600 text-white font-bold text-xs sm:text-sm shadow-sm transition-all active:scale-95 flex-shrink-0"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{i18n.done}</span>
            </button>
          </div>
        </div>
      )}

      {/* 6 Main Action Buttons - Stacked Top and Above (Not Side by Side) */}
      <div className="space-y-2.5 sm:space-y-3">
        {/* 1. Routine */}
        <button
          onClick={() => setPatientScreen('activities')}
          className="w-full flex items-center justify-between p-3.5 sm:p-4 rounded-2xl bg-white hover:bg-sangpa-50 border-2 border-sangpa-200 hover:border-sangpa-400 shadow-2xs transition-all active:scale-98 text-left group"
        >
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 rounded-xl bg-sangpa-100 text-sangpa-700 group-hover:bg-sangpa-500 group-hover:text-white transition-colors flex-shrink-0">
              <CalendarCheck className="w-6 h-6" />
            </div>
            <span className="font-extrabold text-base sm:text-lg text-sangpa-900 leading-tight">
              {getButtonLabel('routine', language)}
            </span>
          </div>
          <ChevronRight className="w-5 h-5 text-sangpa-400 group-hover:text-sangpa-600 transition-colors flex-shrink-0" />
        </button>

        {/* 2. Reminders */}
        <button
          onClick={() => setPatientScreen('reminders')}
          className="w-full flex items-center justify-between p-3.5 sm:p-4 rounded-2xl bg-white hover:bg-sangpa-50 border-2 border-sangpa-200 hover:border-sangpa-400 shadow-2xs transition-all active:scale-98 text-left group"
        >
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 rounded-xl bg-sangpa-100 text-sangpa-700 group-hover:bg-sangpa-500 group-hover:text-white transition-colors flex-shrink-0">
              <Bell className="w-6 h-6" />
            </div>
            <span className="font-extrabold text-base sm:text-lg text-sangpa-900 leading-tight">
              {getButtonLabel('reminders', language)}
            </span>
          </div>
          <ChevronRight className="w-5 h-5 text-sangpa-400 group-hover:text-sangpa-600 transition-colors flex-shrink-0" />
        </button>

        {/* 3. Games */}
        <button
          onClick={() => setPatientScreen('games')}
          className="w-full flex items-center justify-between p-3.5 sm:p-4 rounded-2xl bg-white hover:bg-sangpa-50 border-2 border-sangpa-200 hover:border-sangpa-400 shadow-2xs transition-all active:scale-98 text-left group"
        >
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 rounded-xl bg-sangpa-100 text-sangpa-700 group-hover:bg-sangpa-500 group-hover:text-white transition-colors flex-shrink-0">
              <Gamepad2 className="w-6 h-6" />
            </div>
            <span className="font-extrabold text-base sm:text-lg text-sangpa-900 leading-tight">
              {getButtonLabel('games', language)}
            </span>
          </div>
          <ChevronRight className="w-5 h-5 text-sangpa-400 group-hover:text-sangpa-600 transition-colors flex-shrink-0" />
        </button>

        {/* 4. Physical Exercise (formerly Wellness and Exercise) */}
        <button
          onClick={() => setPatientScreen('wellness')}
          className="w-full flex items-center justify-between p-3.5 sm:p-4 rounded-2xl bg-white hover:bg-sangpa-50 border-2 border-sangpa-200 hover:border-sangpa-400 shadow-2xs transition-all active:scale-98 text-left group"
        >
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 rounded-xl bg-sangpa-100 text-sangpa-700 group-hover:bg-sangpa-500 group-hover:text-white transition-colors flex-shrink-0">
              <Activity className="w-6 h-6" />
            </div>
            <span className="font-extrabold text-base sm:text-lg text-sangpa-900 leading-tight">
              {getButtonLabel('exercise', language)}
            </span>
          </div>
          <ChevronRight className="w-5 h-5 text-sangpa-400 group-hover:text-sangpa-600 transition-colors flex-shrink-0" />
        </button>

        {/* 5. Memories (formerly Family Memories) */}
        <button
          onClick={() => setPatientScreen('memories')}
          className="w-full flex items-center justify-between p-3.5 sm:p-4 rounded-2xl bg-white hover:bg-sangpa-50 border-2 border-sangpa-200 hover:border-sangpa-400 shadow-2xs transition-all active:scale-98 text-left group"
        >
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 rounded-xl bg-sangpa-100 text-sangpa-700 group-hover:bg-sangpa-500 group-hover:text-white transition-colors flex-shrink-0">
              <Heart className="w-6 h-6" />
            </div>
            <span className="font-extrabold text-base sm:text-lg text-sangpa-900 leading-tight">
              {getButtonLabel('memories', language)}
            </span>
          </div>
          <ChevronRight className="w-5 h-5 text-sangpa-400 group-hover:text-sangpa-600 transition-colors flex-shrink-0" />
        </button>

        {/* 6. Emergency */}
        <button
          onClick={() => setPatientScreen('emergency')}
          className="w-full flex items-center justify-between p-3.5 sm:p-4 rounded-2xl bg-emergency-50 hover:bg-emergency-100 border-2 border-emergency-300 shadow-2xs transition-all active:scale-98 text-left group"
        >
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 rounded-xl bg-emergency-200 text-emergency-800 group-hover:bg-emergency-500 group-hover:text-white transition-colors flex-shrink-0">
              <AlertCircle className="w-6 h-6" />
            </div>
            <span className="font-extrabold text-base sm:text-lg text-emergency-900 leading-tight">
              {getButtonLabel('emergency', language)}
            </span>
          </div>
          <ChevronRight className="w-5 h-5 text-emergency-400 group-hover:text-emergency-600 transition-colors flex-shrink-0" />
        </button>
      </div>

      {/* Short Reassuring Message */}
      <div className="bg-sangpa-100/70 border border-sangpa-200/80 rounded-2xl py-2 px-3 text-center text-xs text-sangpa-800 font-medium flex items-center justify-center gap-1.5">
        <span>🌸</span>
        <span>{t('calmMessage')}</span>
      </div>
    </div>
  );
};
