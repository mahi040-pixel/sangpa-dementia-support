import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Phone, 
  Clock, 
  MessageSquare, 
  CheckCircle2, 
  Smile, 
  Heart, 
  Activity, 
  Droplets, 
  Pill, 
  ShieldCheck,
  Menu,
  Sparkles,
  Wifi,
  BatteryCharging
} from 'lucide-react';
import { audio } from '../../utils/audio';

export const CaregiverOverview: React.FC = () => {
  const { 
    patientProfile, 
    reminders, 
    setCaregiverScreen,
    speakMascot,
    setRole,
    setPatientScreen
  } = useApp();

  const [nudgeSent, setNudgeSent] = useState(false);
  const patientDisplayName = patientProfile.preferredName || patientProfile.name || 'Maya Devi';

  const handleSendVoiceNudge = () => {
    audio.playGentleChime();
    speakMascot(`Namaste ${patientDisplayName}! Ananya sends you lots of warm love and reminds you to stay hydrated.`, 'speaking');
    setNudgeSent(true);
    setTimeout(() => setNudgeSent(false), 4000);
  };

  const handleCallPatient = () => {
    audio.playGentleChime();
    setRole('patient');
    setPatientScreen('emergency');
  };

  return (
    <div className="flex-1 bg-[#FAF8F5] min-h-full flex flex-col select-none">
      <div className="max-w-md md:max-w-xl mx-auto w-full px-4 py-5 space-y-4 pb-20 min-w-0">
        
        {/* Top Header Title */}
        <div className="flex items-center justify-between border-b border-[#E7E3D8] pb-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-[#243B1D] leading-tight tracking-tight">
              Patient Summary
            </h1>
            <p className="text-xs text-[#687C62] font-medium mt-0.5">
              Live status & care monitoring for {patientProfile.preferredName || patientProfile.name || 'Maya Devi'}
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-[#EAF2E6] border border-[#D5DFC9] px-2.5 py-1 rounded-full text-[11px] font-bold text-[#2F4E24]">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Live Connected</span>
          </div>
        </div>

        {/* 1. How is the Patient Doing? (Main Status Card) */}
        <div className="bg-white rounded-3xl p-5 border border-[#E7E3D8] shadow-xs space-y-3.5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#4E7037] block">
                Current Condition
              </span>
              <h2 className="text-lg font-black text-[#243B1D] mt-0.5 truncate">
                {patientProfile.name || 'Maya Devi'} (Age {patientProfile.age || 74})
              </h2>
              <p className="text-xs text-stone-500 font-medium">
                {patientProfile.condition || 'Mild Cognitive Impairment (MCI) - Stage 2'}
              </p>
            </div>

            {/* Status Badge */}
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#EAF2E6] text-[#24421C] text-xs font-black border border-[#D5DFC9] shadow-2xs flex-shrink-0">
              <Smile className="w-4 h-4 text-[#3E6530]" />
              <span>Doing Well</span>
            </span>
          </div>

          {/* Reassuring Clinical & Emotional Summary */}
          <div className="p-3.5 bg-[#F7FAF4] rounded-2xl border border-[#E1EAD8] text-xs text-[#203D17] leading-relaxed space-y-1">
            <div className="font-bold flex items-center gap-1.5 text-[#243B1D]">
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
              <span>Caregiver Status Update:</span>
            </div>
            <p>
              {patientDisplayName} is currently calm, cheerful, and resting comfortably in the living room. Cognitive alertness is stable, morning hydration and blood pressure medicine were completed on time, and there are zero signs of distress or confusion.
            </p>
          </div>

          {/* Live Connectivity Vitals */}
          <div className="grid grid-cols-3 gap-2 pt-1 border-t border-[#F0ECE1] text-[11px] text-stone-600">
            <div className="flex items-center gap-1.5">
              <Wifi className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
              <span className="truncate">Device Online</span>
            </div>
            <div className="flex items-center gap-1.5">
              <BatteryCharging className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
              <span>Battery 86%</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-stone-400 flex-shrink-0" />
              <span className="truncate">{patientProfile.lastActive || '10:42 AM'}</span>
            </div>
          </div>
        </div>

        {/* 2. Today's Patient Care Summary at a Glance */}
        <div className="bg-white rounded-3xl p-5 border border-[#E7E3D8] shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-[#F0ECE1] pb-2">
            <h3 className="text-xs font-black uppercase tracking-wider text-stone-700">
              Today's Care Summary
            </h3>
            <span className="text-[11px] font-bold text-emerald-700">
              4 of 4 Completed
            </span>
          </div>

          <div className="space-y-2.5 text-xs">
            {/* Medicine */}
            <div className="flex items-start gap-3 p-2.5 rounded-2xl bg-[#FAF8F5] border border-[#EBE6DC]">
              <div className="w-7 h-7 rounded-xl bg-[#EAF2E6] text-[#345228] flex items-center justify-center flex-shrink-0">
                <Pill className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-[#243B1D]">Morning Blood Pressure Medicine</span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                    Taken 08:30 AM
                  </span>
                </div>
                <p className="text-[11px] text-stone-500 mt-0.5">
                  Amlodipine 5mg taken with warm water after breakfast.
                </p>
              </div>
            </div>

            {/* Hydration */}
            <div className="flex items-start gap-3 p-2.5 rounded-2xl bg-[#FAF8F5] border border-[#EBE6DC]">
              <div className="w-7 h-7 rounded-xl bg-[#EAF2E6] text-[#345228] flex items-center justify-center flex-shrink-0">
                <Droplets className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-[#243B1D]">Hydration Intake</span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                    4 / 5 Glasses
                  </span>
                </div>
                <p className="text-[11px] text-stone-500 mt-0.5">
                  Well hydrated. Next glass scheduled at 10:00 AM.
                </p>
              </div>
            </div>

            {/* Physical & Cognitive */}
            <div className="flex items-start gap-3 p-2.5 rounded-2xl bg-[#FAF8F5] border border-[#EBE6DC]">
              <div className="w-7 h-7 rounded-xl bg-[#EAF2E6] text-[#345228] flex items-center justify-center flex-shrink-0">
                <Activity className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-[#243B1D]">Physical Activity & Mood</span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                    Comfortable
                  </span>
                </div>
                <p className="text-[11px] text-stone-500 mt-0.5">
                  Seated stretching completed with caregiver; smiling and relaxed.
                </p>
              </div>
            </div>

            {/* Safety & Alerts */}
            <div className="flex items-start gap-3 p-2.5 rounded-2xl bg-[#FAF8F5] border border-[#EBE6DC]">
              <div className="w-7 h-7 rounded-xl bg-[#EAF2E6] text-[#345228] flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-[#243B1D]">Safety & Health Alerts</span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                    All Clear
                  </span>
                </div>
                <p className="text-[11px] text-stone-500 mt-0.5">
                  Zero missed medicines, no emergency alerts, no wander warnings.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Quick Direct Patient Contact Actions */}
        <div className="bg-white rounded-3xl p-4 border border-[#E7E3D8] shadow-xs space-y-2.5">
          <span className="text-[10px] font-black uppercase tracking-wider text-stone-500 block">
            Direct Caregiver Actions
          </span>

          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={handleCallPatient}
              className="py-3 px-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all active:scale-98 cursor-pointer"
            >
              <Phone className="w-4 h-4" />
              <span>Call {patientDisplayName}</span>
            </button>

            <button
              onClick={handleSendVoiceNudge}
              className="py-3 px-3 rounded-2xl bg-[#EAF2E6] hover:bg-[#DCE7D3] text-[#24421C] font-bold text-xs flex items-center justify-center gap-2 border border-[#CCD8C4] shadow-2xs transition-all active:scale-98 cursor-pointer"
            >
              <MessageSquare className="w-4 h-4 text-[#3E6530]" />
              <span>Voice Nudge</span>
            </button>
          </div>

          {nudgeSent && (
            <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold text-center animate-in fade-in">
              ✓ Voice nudge dispatched to {patientDisplayName}: "Ananya sends you warm love and reminds you to stay hydrated."
            </div>
          )}
        </div>

        {/* 4. Subtle Navigation Guidance Note */}
        <div className="p-3 bg-[#FAF8F5] rounded-2xl border border-[#E7E3D8] text-[11px] text-stone-600 text-center space-y-1">
          <p className="font-semibold text-stone-700">
            👉 Tap the 3 lines menu (☰) on the top-left corner to access:
          </p>
          <p className="text-[10px] text-stone-500">
            1. Patient Details • 2. Knowledge Assistant • 3. Add Memories • 4. Alerts • 5. Weekly Engagement & Improvement Graph
          </p>
        </div>

      </div>
    </div>
  );
};

