import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ArrowLeft, 
  PhoneCall, 
  Phone, 
  AlertTriangle, 
  Heart, 
  CalendarCheck, 
  Volume2, 
  CheckCircle2, 
  Clock, 
  User, 
  X,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { audio } from '../../utils/audio';
import { DailyActivity } from '../../types';

type HelpSubView = 'menu' | 'caregiver_confirm' | 'confused' | 'routine_activity';

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

export const PatientHelpScreen: React.FC = () => {
  const { 
    setPatientScreen, 
    contacts, 
    activities, 
    completeActivity, 
    speakMascot, 
    patientProfile,
    language 
  } = useApp();

  const [view, setView] = useState<HelpSubView>('menu');
  const [previousView, setPreviousView] = useState<HelpSubView>('menu');
  const [callActive, setCallActive] = useState<boolean>(false);
  const [callSeconds, setCallSeconds] = useState<number>(0);

  const callingName = patientProfile?.preferredName || patientProfile?.name || 'Kamala Dadi';

  // Configured primary caregiver or first caregiver contact
  const caregiver = contacts.find(c => c.isPrimary || c.role === 'caregiver') || contacts[0];

  // In-call duration timer
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (callActive) {
      interval = setInterval(() => {
        setCallSeconds(s => s + 1);
      }, 1000);
    } else {
      setCallSeconds(0);
    }
    return () => clearInterval(interval);
  }, [callActive]);

  // Handle "I'm Confused" entrance
  const handleOpenConfused = () => {
    audio.playGentleChime();
    setPreviousView('menu');
    setView('confused');
    const speechText = "That’s okay. You are safe. I’m here with you.";
    speakMascot(speechText, 'help');
  };

  // Handle "Call My Caregiver" entrance
  const handleOpenCaregiverCall = (fromView: HelpSubView = 'menu') => {
    audio.playGentleChime();
    setPreviousView(fromView);
    setView('caregiver_confirm');
    setCallActive(false);
  };

  // Handle initiating simulated call / phone link
  const handleStartCall = () => {
    if (!caregiver) return;
    audio.playTempleBell();
    setCallActive(true);
    speakMascot(`Calling ${caregiver.name} right now. Please stay on the line.`, 'speaking');
    if (caregiver.phone) {
      window.open(`tel:${caregiver.phone}`);
    }
  };

  const handleEndCall = () => {
    audio.playGentleChime();
    setCallActive(false);
    setView('menu');
  };

  // Find current or next routine task
  const sortedActivities = [...activities].sort((a, b) => {
    return parseTimeToMinutes(a.time) - parseTimeToMinutes(b.time);
  });

  const nowMinutes = new Date().getHours() * 60 + new Date().getMinutes();
  let matchedIndex = -1;
  for (let i = 0; i < sortedActivities.length; i++) {
    const actStart = parseTimeToMinutes(sortedActivities[i].time);
    const actEnd = sortedActivities[i + 1] ? parseTimeToMinutes(sortedActivities[i + 1].time) : 24 * 60;
    if (nowMinutes >= actStart && nowMinutes < actEnd) {
      matchedIndex = i;
      break;
    }
  }

  let activeTask: DailyActivity | undefined;
  if (matchedIndex !== -1) {
    activeTask = sortedActivities[matchedIndex]?.completed 
      ? sortedActivities.slice(matchedIndex + 1).find(a => !a.completed) || sortedActivities[matchedIndex]
      : sortedActivities[matchedIndex];
  } else {
    activeTask = sortedActivities.find(a => !a.completed) || sortedActivities[0];
  }

  // Handle "Tell me what to do now" entrance
  const handleOpenRoutineActivity = () => {
    audio.playGentleChime();
    setPreviousView('confused');
    setView('routine_activity');
    if (activeTask) {
      const readText = `Right now, it is time for: ${activeTask.title}. ${activeTask.shortInstruction || ''}`;
      speakMascot(readText, 'speaking');
    }
  };

  const handleReadRoutineAloud = () => {
    if (activeTask) {
      audio.playCuteChime();
      const readText = `Right now, it is time for: ${activeTask.title}. ${activeTask.shortInstruction || ''}`;
      speakMascot(readText, 'speaking');
    }
  };

  return (
    <div className="flex-1 p-4 sm:p-6 max-w-xl mx-auto w-full space-y-5 pb-24 md:pb-8 select-none">
      
      {/* ========================================================================= */}
      {/* 1. MAIN HELP SCREEN: "How can I help?"                                    */}
      {/* ========================================================================= */}
      {view === 'menu' && (
        <div className="space-y-5">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-sangpa-200/80 pb-3">
            <button
              onClick={() => {
                audio.playGentleChime();
                setPatientScreen('home');
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white border-2 border-sangpa-300 hover:bg-sangpa-50 text-sangpa-900 font-extrabold text-sm shadow-2xs transition-all active:scale-95 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-sangpa-700" />
              <span>Back</span>
            </button>

            <span className="text-xs font-bold text-sangpa-700 bg-sangpa-100 px-3 py-1 rounded-full border border-sangpa-200">
              SANGPA Support
            </span>
          </div>

          {/* Friendly Mascot Greeting Card */}
          <div className="bg-gradient-to-b from-sangpa-100/90 to-sangpa-50/70 border-2 border-sangpa-300 rounded-3xl p-4 sm:p-5 flex items-center gap-4 shadow-xs">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-3 border-sangpa-400 bg-white flex-shrink-0 shadow-md">
              <img 
                src="/assets/mascot.png" 
                alt="SANGPA Mascot" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl sm:text-3xl font-black text-sangpa-900 tracking-tight">
                How can I help?
              </h1>
              <p className="text-xs sm:text-sm text-sangpa-700 font-semibold mt-0.5">
                Namaste {callingName}! Choose any option below.
              </p>
            </div>
          </div>

          {/* Exactly Three Large Primary Buttons */}
          <div className="space-y-3.5 pt-1">
            
            {/* 1. Call My Caregiver */}
            <button
              onClick={() => handleOpenCaregiverCall('menu')}
              className="w-full p-5 sm:p-6 rounded-3xl bg-white hover:bg-emerald-50/80 border-3 border-emerald-500 shadow-sm transition-all active:scale-98 text-left group cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="p-3.5 rounded-2xl bg-emerald-100 text-emerald-800 group-hover:bg-emerald-600 group-hover:text-white transition-colors flex-shrink-0 shadow-2xs">
                  <PhoneCall className="w-8 h-8" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="block font-black text-xl sm:text-2xl text-emerald-950">
                    Call My Caregiver
                  </span>
                  <span className="block text-xs sm:text-sm font-semibold text-emerald-700 mt-1">
                    {caregiver ? `Speak directly with ${caregiver.name}` : 'Call your family or attendant'}
                  </span>
                </div>
              </div>
            </button>

            {/* 2. I'm Confused */}
            <button
              onClick={handleOpenConfused}
              className="w-full p-5 sm:p-6 rounded-3xl bg-white hover:bg-amber-50/80 border-3 border-amber-400 shadow-sm transition-all active:scale-98 text-left group cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="p-3.5 rounded-2xl bg-amber-100 text-amber-800 group-hover:bg-amber-500 group-hover:text-white transition-colors flex-shrink-0 shadow-2xs">
                  <Heart className="w-8 h-8" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="block font-black text-xl sm:text-2xl text-amber-950">
                    I’m Confused
                  </span>
                  <span className="block text-xs sm:text-sm font-semibold text-amber-800 mt-1">
                    Feel calm, safe, and know what to do next
                  </span>
                </div>
              </div>
            </button>

            {/* 3. Emergency */}
            <button
              onClick={() => {
                audio.playTempleBell();
                setPatientScreen('emergency');
              }}
              className="w-full p-5 sm:p-6 rounded-3xl bg-emergency-50 hover:bg-emergency-100 border-3 border-emergency-500 shadow-sm transition-all active:scale-98 text-left group cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="p-3.5 rounded-2xl bg-emergency-200 text-emergency-900 group-hover:bg-emergency-600 group-hover:text-white transition-colors flex-shrink-0 shadow-2xs">
                  <AlertTriangle className="w-8 h-8" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="block font-black text-xl sm:text-2xl text-emergency-950">
                    Emergency
                  </span>
                  <span className="block text-xs sm:text-sm font-semibold text-emergency-700 mt-1">
                    Doctor, hospital, and immediate SOS help
                  </span>
                </div>
              </div>
            </button>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. CALL MY CAREGIVER SCREEN                                               */}
      {/* ========================================================================= */}
      {view === 'caregiver_confirm' && (
        <div className="space-y-5">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-sangpa-200/80 pb-3">
            <button
              onClick={() => {
                audio.playGentleChime();
                setView(previousView);
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white border-2 border-sangpa-300 hover:bg-sangpa-50 text-sangpa-900 font-extrabold text-sm shadow-2xs transition-all active:scale-95 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-sangpa-700" />
              <span>Back</span>
            </button>

            <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-200">
              Caregiver Phone Line
            </span>
          </div>

          {caregiver ? (
            <div className="space-y-5">
              {/* Caregiver Profile Card */}
              <div className="bg-white border-3 border-emerald-500 rounded-3xl p-6 shadow-sm text-center space-y-4">
                <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-full overflow-hidden border-4 border-emerald-200 bg-emerald-50 flex items-center justify-center shadow-md">
                  {caregiver.avatar ? (
                    <img 
                      src={caregiver.avatar} 
                      alt={caregiver.name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-12 h-12 text-emerald-700" />
                  )}
                </div>

                <div>
                  <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-3 py-0.5 rounded-full inline-block mb-1">
                    {caregiver.relation || 'Primary Caregiver'}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black text-sangpa-900">
                    {caregiver.name}
                  </h2>
                  <p className="text-sm sm:text-base font-bold text-stone-600 mt-1">
                    {caregiver.phone}
                  </p>
                </div>

                {!callActive ? (
                  <p className="text-sm font-semibold text-emerald-900 bg-emerald-50 p-3 rounded-2xl border border-emerald-200">
                    Press <strong>Call Now</strong> to talk to {caregiver.name}.
                  </p>
                ) : (
                  <div className="bg-emerald-100 p-4 rounded-2xl border-2 border-emerald-400 space-y-2 animate-pulse">
                    <div className="flex items-center justify-center gap-2 text-emerald-900 font-black text-lg">
                      <PhoneCall className="w-6 h-6 text-emerald-700 animate-bounce" />
                      <span>Calling {caregiver.name}...</span>
                    </div>
                    <p className="text-xs font-bold text-emerald-800">
                      Call in progress ({callSeconds}s). Please speak into the phone.
                    </p>
                  </div>
                )}
              </div>

              {/* Action Buttons: Call Now, Cancel, Back */}
              {!callActive ? (
                <div className="space-y-3">
                  <button
                    onClick={handleStartCall}
                    className="w-full py-5 px-6 rounded-3xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-black text-xl sm:text-2xl shadow-lg transition-all flex items-center justify-center gap-3 cursor-pointer"
                  >
                    <Phone className="w-7 h-7" />
                    <span>Call Now</span>
                  </button>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => {
                        audio.playGentleChime();
                        setView('menu');
                      }}
                      className="py-4 px-4 rounded-2xl bg-white hover:bg-stone-100 border-2 border-stone-300 font-bold text-base text-stone-700 transition-all active:scale-95 cursor-pointer text-center"
                    >
                      Cancel
                    </button>

                    <button
                      onClick={() => {
                        audio.playGentleChime();
                        setView(previousView);
                      }}
                      className="py-4 px-4 rounded-2xl bg-sangpa-100 hover:bg-sangpa-200 border-2 border-sangpa-300 font-bold text-base text-sangpa-900 transition-all active:scale-95 cursor-pointer text-center"
                    >
                      Back
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <button
                    onClick={handleEndCall}
                    className="w-full py-5 px-6 rounded-3xl bg-rose-600 hover:bg-rose-700 active:scale-98 text-white font-black text-xl shadow-lg transition-all flex items-center justify-center gap-3 cursor-pointer"
                  >
                    <X className="w-6 h-6" />
                    <span>End Call & Return Home</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white border-2 border-sangpa-300 rounded-3xl p-6 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
                <User className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black text-sangpa-900">
                No Caregiver Contact Added
              </h3>
              <p className="text-sm text-stone-600">
                No caregiver contact has been added yet. Please ask your caregiver to add their contact number in settings.
              </p>
              <button
                onClick={() => {
                  audio.playGentleChime();
                  setView('menu');
                }}
                className="py-3 px-6 rounded-2xl bg-sangpa-600 text-white font-bold text-sm shadow-sm cursor-pointer"
              >
                Back to Options
              </button>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. "I'M CONFUSED" SCREEN                                                  */}
      {/* ========================================================================= */}
      {view === 'confused' && (
        <div className="space-y-5">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-sangpa-200/80 pb-3">
            <button
              onClick={() => {
                audio.playGentleChime();
                setView('menu');
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white border-2 border-sangpa-300 hover:bg-sangpa-50 text-sangpa-900 font-extrabold text-sm shadow-2xs transition-all active:scale-95 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-sangpa-700" />
              <span>Back</span>
            </button>

            <span className="text-xs font-bold text-amber-800 bg-amber-100 px-3 py-1 rounded-full border border-amber-200">
              Safe & Calm Space
            </span>
          </div>

          {/* Mascot Reassurance Hero */}
          <div className="bg-gradient-to-b from-amber-50 to-sangpa-50 border-3 border-amber-400 rounded-3xl p-5 sm:p-6 shadow-sm space-y-3.5">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full overflow-hidden border-3 border-amber-500 bg-white shadow-md flex-shrink-0">
                <img 
                  src="/assets/mascot.png" 
                  alt="SANGPA Mascot" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-1">
                <span className="text-xs font-black uppercase tracking-wider text-amber-800 bg-amber-200/80 px-2.5 py-0.5 rounded-full inline-block">
                  Sangpa Says
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-amber-950 leading-snug">
                  “That’s okay. You are safe. I’m here with you.”
                </h2>
              </div>
            </div>

            <div className="pt-2 border-t border-amber-200/80 flex items-center justify-between">
              <span className="text-xs font-semibold text-amber-900">
                Take a gentle, slow breath. What would help most?
              </span>
              <button
                onClick={() => {
                  audio.playCuteChime();
                  speakMascot("That’s okay. You are safe. I’m here with you.", 'help');
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-200 hover:bg-amber-300 text-amber-950 text-xs font-bold cursor-pointer"
              >
                <Volume2 className="w-3.5 h-3.5 text-amber-800" />
                <span>Listen Again</span>
              </button>
            </div>
          </div>

          {/* Exactly Two Useful Choices */}
          <div className="space-y-3.5 pt-1">
            
            {/* Choice 1: Tell me what to do now */}
            <button
              onClick={handleOpenRoutineActivity}
              className="w-full p-5 sm:p-6 rounded-3xl bg-white hover:bg-emerald-50/80 border-3 border-emerald-500 shadow-sm transition-all active:scale-98 text-left group cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="p-3.5 rounded-2xl bg-emerald-100 text-emerald-800 group-hover:bg-emerald-600 group-hover:text-white transition-colors flex-shrink-0 shadow-2xs">
                  <CalendarCheck className="w-8 h-8" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="block font-black text-xl sm:text-2xl text-emerald-950">
                    Tell me what to do now
                  </span>
                  <span className="block text-xs sm:text-sm font-semibold text-emerald-700 mt-1">
                    See your current schedule activity and hear it aloud
                  </span>
                </div>
              </div>
            </button>

            {/* Choice 2: Talk to my caregiver */}
            <button
              onClick={() => handleOpenCaregiverCall('confused')}
              className="w-full p-5 sm:p-6 rounded-3xl bg-white hover:bg-amber-50/80 border-3 border-amber-400 shadow-sm transition-all active:scale-98 text-left group cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="p-3.5 rounded-2xl bg-amber-100 text-amber-800 group-hover:bg-amber-500 group-hover:text-white transition-colors flex-shrink-0 shadow-2xs">
                  <PhoneCall className="w-8 h-8" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="block font-black text-xl sm:text-2xl text-amber-950">
                    Talk to my caregiver
                  </span>
                  <span className="block text-xs sm:text-sm font-semibold text-amber-800 mt-1">
                    {caregiver ? `Connect with ${caregiver.name}` : 'Call family or attendant'}
                  </span>
                </div>
              </div>
            </button>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. "TELL ME WHAT TO DO NOW" (ROUTINE ACTIVITY DISPLAY)                     */}
      {/* ========================================================================= */}
      {view === 'routine_activity' && (
        <div className="space-y-5">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-sangpa-200/80 pb-3">
            <button
              onClick={() => {
                audio.playGentleChime();
                setView('confused');
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white border-2 border-sangpa-300 hover:bg-sangpa-50 text-sangpa-900 font-extrabold text-sm shadow-2xs transition-all active:scale-95 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-sangpa-700" />
              <span>Back</span>
            </button>

            <span className="text-xs font-bold text-sangpa-800 bg-sangpa-100 px-3 py-1 rounded-full border border-sangpa-200">
              Current Routine Task
            </span>
          </div>

          {activeTask ? (
            <div className="space-y-4">
              {/* Activity Card */}
              <div className="bg-white border-3 border-emerald-500 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black uppercase tracking-wider">
                    Scheduled for {activeTask.time}
                  </span>
                  <button
                    onClick={handleReadRoutineAloud}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sangpa-100 hover:bg-sangpa-200 text-sangpa-900 text-xs font-bold cursor-pointer"
                  >
                    <Volume2 className="w-4 h-4 text-sangpa-700" />
                    <span>Read Aloud</span>
                  </button>
                </div>

                <div>
                  <h2 className="text-2xl sm:text-3xl font-black text-sangpa-900">
                    {activeTask.title}
                  </h2>
                  <p className="text-base sm:text-lg font-bold text-stone-700 mt-2 bg-sangpa-50/70 p-3.5 rounded-2xl border border-sangpa-200">
                    {activeTask.shortInstruction || 'Follow your daily routine step.'}
                  </p>
                </div>

                {/* Mark as Done */}
                {!activeTask.completed ? (
                  <button
                    onClick={() => {
                      completeActivity(activeTask.id);
                    }}
                    className="w-full py-4 px-5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-black text-lg shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <CheckCircle2 className="w-6 h-6" />
                    <span>I Finished This (Mark as Done)</span>
                  </button>
                ) : (
                  <div className="p-3 bg-emerald-100 rounded-2xl text-emerald-900 font-extrabold text-sm flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span>✓ This activity is already completed for today!</span>
                  </div>
                )}
              </div>

              {/* Still need help options */}
              <div className="bg-amber-50/80 border-2 border-amber-300 rounded-3xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div>
                  <h4 className="font-extrabold text-amber-950 text-sm">Still unsure or need someone?</h4>
                  <p className="text-xs text-amber-800">You can talk directly to your caregiver anytime.</p>
                </div>
                <button
                  onClick={() => handleOpenCaregiverCall('routine_activity')}
                  className="py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs shadow-xs flex items-center gap-1.5 cursor-pointer whitespace-nowrap self-stretch sm:self-auto justify-center"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>Talk to Caregiver</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white border-2 border-sangpa-300 rounded-3xl p-6 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-sangpa-100 text-sangpa-700 flex items-center justify-center mx-auto">
                <Clock className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black text-sangpa-900">
                No Activities Scheduled Right Now
              </h3>
              <p className="text-sm text-stone-600 max-w-sm mx-auto">
                You have finished your routine for now! Would you like to call your caregiver?
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => handleOpenCaregiverCall('routine_activity')}
                  className="w-full sm:w-auto py-3 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-sm cursor-pointer flex items-center justify-center gap-2"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>Call My Caregiver</span>
                </button>
                <button
                  onClick={() => {
                    audio.playGentleChime();
                    setView('menu');
                  }}
                  className="w-full sm:w-auto py-3 px-6 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-sm cursor-pointer"
                >
                  Back to Help Options
                </button>
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
};
