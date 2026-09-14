import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ArrowLeft, 
  CheckCircle, 
  Clock, 
  Volume2, 
  HelpCircle, 
  Sun, 
  Utensils, 
  Pill, 
  Droplets, 
  Activity, 
  Sparkles, 
  Bed,
  ChevronDown,
  ChevronUp,
  Footprints,
  CalendarCheck
} from 'lucide-react';
import { audio } from '../../utils/audio';
import { DailyActivity } from '../../types';
import { PATIENT_I18N, getLocalizedActivity } from '../../utils/localization';

// Helper to parse time string like "08:30 AM", "10:00 PM" into total minutes from midnight
const parseTimeToMinutes = (timeStr: string): number => {
  if (!timeStr) return 0;
  const match = timeStr.trim().match(/(\d+):(\d+)\s*(AM|PM)?/i);
  if (!match) return 0;
  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const modifier = match[3]?.toUpperCase();

  if (modifier === 'PM' && hours < 12) hours += 12;
  if (modifier === 'AM' && hours === 12) hours = 0;

  return hours * 60 + minutes;
};

// Helper to format Date into 12-hour format
const formatClockTime = (date: Date): string => {
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;
  const minutesFormatted = minutes < 10 ? '0' + minutes : minutes;
  return `${hours}:${minutesFormatted} ${ampm}`;
};

export const PatientRoutine: React.FC = () => {
  const { setPatientScreen, activities, completeActivity, speakMascot, language, patientProfile } = useApp();
  const [showFullDay, setShowFullDay] = useState(false);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  const i18n = PATIENT_I18N[language] || PATIENT_I18N.en;
  const callingName = patientProfile?.preferredName || patientProfile?.name || 'Kamala Dadi';

  // Real-time ticking clock every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nowMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();

  // Sort activities chronologically by scheduled time
  const sortedActivities = [...activities].sort((a, b) => {
    return parseTimeToMinutes(a.time) - parseTimeToMinutes(b.time);
  });

  // Determine which activity is active right now based on real clock
  let currentTask: DailyActivity | undefined;
  let nextTask: DailyActivity | undefined;

  let matchedIndex = -1;
  for (let i = 0; i < sortedActivities.length; i++) {
    const actStart = parseTimeToMinutes(sortedActivities[i].time);
    const actEnd = sortedActivities[i + 1] ? parseTimeToMinutes(sortedActivities[i + 1].time) : 24 * 60;

    if (nowMinutes >= actStart && nowMinutes < actEnd) {
      matchedIndex = i;
      break;
    }
  }

  if (matchedIndex !== -1) {
    const matched = sortedActivities[matchedIndex];
    if (!matched.completed) {
      currentTask = matched;
      nextTask = sortedActivities.slice(matchedIndex + 1).find(a => !a.completed);
    } else {
      const remaining = sortedActivities.slice(matchedIndex + 1).filter(a => !a.completed);
      currentTask = remaining[0] || matched;
      nextTask = remaining[1];
    }
  } else {
    const uncompleted = sortedActivities.filter(a => !a.completed);
    currentTask = uncompleted[0] || sortedActivities[sortedActivities.length - 1];
    nextTask = uncompleted[1];
  }

  const getActivityIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sun': return <Sun className="w-6 h-6 text-amber-500" />;
      case 'Utensils': return <Utensils className="w-6 h-6 text-orange-500" />;
      case 'Pill': return <Pill className="w-6 h-6 text-rose-500" />;
      case 'Droplets': return <Droplets className="w-6 h-6 text-blue-500" />;
      case 'Activity': return <Activity className="w-6 h-6 text-emerald-500" />;
      case 'Sparkles': return <Sparkles className="w-6 h-6 text-purple-500" />;
      case 'Bed': return <Bed className="w-6 h-6 text-indigo-500" />;
      case 'Footprints': return <Footprints className="w-6 h-6 text-teal-500" />;
      default: return <Clock className="w-6 h-6 text-sangpa-700" />;
    }
  };

  const handlePlayVoice = (act: DailyActivity, e: React.MouseEvent) => {
    e.stopPropagation();
    const localized = getLocalizedActivity(act.title, act.shortInstruction, language);
    const msg = (language === 'hi' || language === 'bn' || language === 'as' || language === 'mni')
      ? `${localized.title}। ${localized.desc}`
      : (language === 'en' && act.audioText ? act.audioText : `${localized.title}. ${localized.desc}`);
    speakMascot(msg, 'speaking');
  };

  const currentTaskLoc = currentTask ? getLocalizedActivity(currentTask.title, currentTask.shortInstruction, language) : null;
  const nextTaskLoc = nextTask ? getLocalizedActivity(nextTask.title, nextTask.shortInstruction, language) : null;

  return (
    <div className="flex-1 p-3.5 sm:p-5 max-w-xl mx-auto w-full space-y-4">
      {/* Header with Live Real-Time Clock Sync Pill */}
      <div className="flex items-center justify-between gap-2 border-b border-sangpa-200/80 pb-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setPatientScreen('home')}
            className="p-2 rounded-2xl bg-white border border-sangpa-300 hover:bg-sangpa-100 text-sangpa-800 transition-colors shadow-2xs"
            title={i18n.back}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-sangpa-900 tracking-tight">
              {i18n.fullRoutine}
            </h2>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-xs font-bold text-emerald-800">
                {i18n.syncedWithTime}: {formatClockTime(currentTime)}
              </p>
            </div>
          </div>
        </div>

        {/* Focus / All Day Toggle */}
        <button
          onClick={() => setShowFullDay(prev => !prev)}
          className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-sangpa-100 hover:bg-sangpa-200 text-sangpa-800 text-xs font-bold border border-sangpa-300 transition-colors"
        >
          <span>{showFullDay ? i18n.focusView : i18n.allDay}</span>
          {showFullDay ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Main Focus: Real-Time Synced "Happening Now" Task */}
      {currentTask && currentTaskLoc && (
        <div className="bg-white border-2 border-sangpa-400 rounded-3xl p-4 sm:p-5 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="px-3 py-1 rounded-full bg-emerald-600 text-white font-extrabold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-white animate-ping" />
              <span>{i18n.happeningNow}</span>
            </span>
            <span className="text-xs font-bold text-sangpa-800 bg-sangpa-100 px-2.5 py-1 rounded-lg border border-sangpa-200">
              {currentTask.time}
            </span>
          </div>

          <div className="flex items-start gap-3.5 mt-2.5">
            <div className="p-3 rounded-2xl bg-sangpa-100 flex-shrink-0">
              {getActivityIcon(currentTask.icon)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-lg sm:text-xl font-extrabold text-sangpa-900 leading-snug">
                  {currentTaskLoc.title}
                </h3>
                <button
                  onClick={(e) => handlePlayVoice(currentTask, e)}
                  className="p-1.5 rounded-full bg-sangpa-100 hover:bg-sangpa-200 text-sangpa-700 flex-shrink-0"
                  title={i18n.listenAgain}
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
              <p className="text-sm text-sangpa-700 mt-1 leading-relaxed">
                {currentTaskLoc.desc}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-4 pt-3 border-t border-sangpa-100 flex flex-wrap items-center justify-between gap-2">
            <button
              onClick={() => completeActivity(currentTask.id)}
              className="flex-1 py-3 px-4 rounded-2xl bg-sangpa-500 hover:bg-sangpa-600 active:scale-98 text-white font-bold text-base shadow-touch transition-all flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-5 h-5" />
              <span>{i18n.finishedThis}</span>
            </button>

            <button
              onClick={() => {
                audio.playTempleBell();
                const restMsg = language === 'hi'
                  ? `कोई बात नहीं ${callingName}। थोड़ी देर आराम करने के बाद हम यह कार्य करेंगे।`
                  : `We will come back to this activity after a short rest, ${callingName}.`;
                speakMascot(restMsg, 'speaking');
              }}
              className="py-3 px-3.5 rounded-2xl bg-white hover:bg-sangpa-100 text-sangpa-800 font-semibold text-sm border border-sangpa-300 transition-all flex items-center justify-center gap-1.5"
            >
              <Clock className="w-4 h-4 text-sangpa-600" />
              <span>{i18n.rest15m}</span>
            </button>

            <button
              onClick={() => {
                audio.playTempleBell();
                const helpMsg = language === 'hi'
                  ? "मैं आपकी सहायता के लिए तुरंत रिया को सूचना भेज रही हूँ।"
                  : "I will notify Riya right away to assist you.";
                speakMascot(helpMsg, 'help');
              }}
              className="py-3 px-3 rounded-2xl bg-sangpa-100 hover:bg-sangpa-200 text-sangpa-800 text-sm font-semibold transition-all flex items-center justify-center gap-1"
            >
              <HelpCircle className="w-4 h-4 text-sangpa-600" />
              <span>{i18n.needHelp}</span>
            </button>
          </div>
        </div>
      )}

      {/* Up Next Preview Card (if focus mode) */}
      {!showFullDay && nextTask && nextTaskLoc && (
        <div className="bg-sangpa-100/70 border border-sangpa-200 rounded-3xl p-3.5 transition-all">
          <div className="flex items-center justify-between text-xs font-bold text-sangpa-600 mb-1">
            <span>{i18n.comingUpNext}</span>
            <span>{nextTask.time}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white text-sangpa-700 flex-shrink-0">
              {getActivityIcon(nextTask.icon)}
            </div>
            <div className="min-w-0">
              <h4 className="text-base font-bold text-sangpa-900 truncate">{nextTaskLoc.title}</h4>
              <p className="text-xs text-sangpa-600 truncate">{nextTaskLoc.desc}</p>
            </div>
          </div>
        </div>
      )}

      {/* Full Day Expanded View / Complete Synced Schedule */}
      <div className="space-y-2.5 pt-1">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-sangpa-800 uppercase tracking-wider flex items-center gap-1.5">
            <CalendarCheck className="w-4 h-4 text-sangpa-600" />
            <span>{i18n.fullRoutine} ({sortedActivities.length})</span>
          </h3>
          <span className="text-[11px] text-sangpa-600">
            {i18n.caregiverSynced}
          </span>
        </div>

        {sortedActivities.map((act) => {
          const actMin = parseTimeToMinutes(act.time);
          const isActCurrent = act.id === currentTask?.id;
          const isPast = actMin < nowMinutes && !act.completed;
          const loc = getLocalizedActivity(act.title, act.shortInstruction, language);

          return (
            <div
              key={act.id}
              className={`p-3 sm:p-3.5 rounded-2xl border-2 flex items-center justify-between gap-3 transition-all ${
                isActCurrent
                  ? 'bg-emerald-50/60 border-emerald-400 ring-2 ring-emerald-200 shadow-xs'
                  : act.completed
                  ? 'bg-gray-50 border-gray-200 opacity-70'
                  : 'bg-white border-sangpa-200 hover:border-sangpa-300'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2 rounded-xl bg-sangpa-100 flex-shrink-0">
                  {getActivityIcon(act.icon)}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-sangpa-700">{act.time}</span>
                    {act.completed && (
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded">
                        {i18n.done}
                      </span>
                    )}
                    {isActCurrent && !act.completed && (
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                        {i18n.activeNow}
                      </span>
                    )}
                    {isPast && !isActCurrent && (
                      <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded">
                        {i18n.earlierToday}
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-bold text-sangpa-900 truncate">{loc.title}</p>
                  <p className="text-xs text-sangpa-600 truncate">{loc.desc}</p>
                </div>
              </div>

              {!act.completed ? (
                <button
                  onClick={() => completeActivity(act.id)}
                  className="px-3 py-1.5 rounded-xl bg-sangpa-500 hover:bg-sangpa-600 text-white text-xs font-bold shadow-xs transition-all active:scale-95 flex-shrink-0"
                >
                  {i18n.done}
                </button>
              ) : (
                <span className="text-xs text-emerald-600 font-bold px-2 flex-shrink-0">
                  ✓
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
