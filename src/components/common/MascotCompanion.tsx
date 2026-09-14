import React from 'react';
import { useApp } from '../../context/AppContext';
import { Mic, Volume2, Sparkles, HelpCircle, ArrowRight } from 'lucide-react';
import { PATIENT_I18N } from '../../utils/localization';

interface MascotCompanionProps {
  onOpenChat?: () => void;
  compact?: boolean;
}

export const MascotCompanion: React.FC<MascotCompanionProps> = ({ 
  onOpenChat,
  compact = false 
}) => {
  const { 
    mascotMessage, 
    mascotState, 
    speakMascot,
    setPatientScreen,
    patientProfile,
    language
  } = useApp();

  const callingName = patientProfile?.preferredName || patientProfile?.name || 'Kamala Dadi';
  const i18n = PATIENT_I18N[language] || PATIENT_I18N.en;

  // Localized message if current mascotMessage is the generic default
  const isDefaultEnglish = mascotMessage.includes("Namaste Kamala Dadi! You are doing well") || mascotMessage.includes("Let's take one small step");
  const displayMessage = (isDefaultEnglish && language !== 'en')
    ? i18n.mascotGreeting(callingName)
    : mascotMessage;

  const handleSpeakAgain = (e: React.MouseEvent) => {
    e.stopPropagation();
    speakMascot(displayMessage, 'speaking');
  };

  const handleOpenConversation = () => {
    if (onOpenChat) onOpenChat();
    else setPatientScreen('mascot_chat');
  };

  return (
    <div className={`relative bg-gradient-to-b from-sangpa-100/90 to-sangpa-50/70 border border-sangpa-200 rounded-3xl p-3.5 sm:p-4 shadow-soft transition-all duration-300 ${compact ? 'py-2.5' : ''}`}>
      <div className="flex items-center gap-3.5">
        {/* Mascot Avatar Container */}
        <div className="relative flex-shrink-0">
          <div 
            onClick={handleOpenConversation}
            className={`cursor-pointer group relative rounded-full overflow-hidden border-3 transition-all duration-300 ${
              compact ? 'w-16 h-16 sm:w-20 sm:h-20' : 'w-20 h-20 sm:w-24 sm:h-24'
            } ${
              mascotState === 'speaking'
                ? 'border-sangpa-500 shadow-touch animate-mascot-speaking'
                : mascotState === 'listening'
                ? 'border-emerald-500 ring-4 ring-emerald-200 shadow-lg'
                : mascotState === 'help'
                ? 'border-amber-500 ring-4 ring-amber-200'
                : 'border-sangpa-300 shadow-md hover:border-sangpa-500 animate-mascot-idle'
            }`}
          >
            <img 
              src="/assets/mascot.png" 
              alt="SANGPA Mascot Sangpa" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
            />
            <div className="absolute inset-0 bg-sangpa-900/10 group-hover:bg-transparent transition-colors" />
          </div>

          {/* State badge on collar */}
          <div className="absolute -bottom-1 -right-1">
            {mascotState === 'speaking' && (
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-sangpa-600 text-white shadow-md">
                <Volume2 className="w-3.5 h-3.5 animate-bounce" />
              </span>
            )}
            {mascotState === 'listening' && (
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-white shadow-md ring-2 ring-emerald-300 animate-pulse">
                <Mic className="w-3.5 h-3.5" />
              </span>
            )}
            {mascotState === 'thinking' && (
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500 text-white shadow-md">
                <Sparkles className="w-3.5 h-3.5 animate-spin" />
              </span>
            )}
            {mascotState === 'help' && (
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-600 text-white shadow-md">
                <HelpCircle className="w-3.5 h-3.5" />
              </span>
            )}
            {mascotState === 'idle' && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenConversation();
                }}
                title={i18n.talkToSangpa}
                className="flex h-6 w-6 items-center justify-center rounded-full bg-sangpa-500 text-white shadow-md hover:bg-sangpa-600 transition-colors"
              >
                <Mic className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Speech Bubble - Clean, Direct */}
        <div className="flex-1 min-w-0">
          <div className="bg-white border border-sangpa-200/90 rounded-2xl p-3 sm:p-3.5 shadow-2xs space-y-2">
            <div className="flex items-center justify-between gap-1">
              <span className="text-sangpa-700 text-[11px] font-extrabold uppercase tracking-wider">
                {i18n.sangpaTitle}
              </span>
              <button
                onClick={handleSpeakAgain}
                className="p-1 rounded-full bg-sangpa-100 hover:bg-sangpa-200 text-sangpa-700 transition-colors"
                title={i18n.listenAgain}
              >
                <Volume2 className="w-3.5 h-3.5" />
              </button>
            </div>

            <p className="text-sangpa-900 font-semibold text-sm sm:text-base leading-snug line-clamp-2">
              "{displayMessage}"
            </p>

            <button
              onClick={handleOpenConversation}
              className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-sangpa-500 hover:bg-sangpa-600 text-white text-xs sm:text-sm font-bold shadow-xs transition-all active:scale-95"
            >
              <Mic className="w-4 h-4" />
              <span>{i18n.talkToSangpa}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
