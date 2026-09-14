import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PhoneCall, X, Volume2, ShieldCheck, CheckCircle } from 'lucide-react';
import { audio } from '../../utils/audio';

export const RuralFallbackCallModal: React.FC = () => {
  const { fallbackCallActive, setFallbackCallActive, patientProfile } = useApp();

  const [callState, setCallState] = useState<'ringing' | 'connected' | 'completed'>('ringing');

  if (!fallbackCallActive) return null;

  const handleAnswer = () => {
    setCallState('connected');
    audio.playGentleChime();
    audio.speak(
      "Namaste Kamala Dadi. This is Sangpa calling via regular telephone line. It is time for your morning water and medicine. Press 1 to confirm.",
      'en-IN'
    );
  };

  const handleConfirmOnCall = () => {
    setCallState('completed');
    audio.playSuccessJingle();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border-2 border-sangpa-300 rounded-3xl max-w-md w-full p-6 shadow-2xl text-center space-y-4 relative">
        <button
          onClick={() => {
            setFallbackCallActive(false);
            setCallState('ringing');
          }}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-sangpa-100 text-sangpa-700"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-16 h-16 rounded-full bg-sangpa-100 border-2 border-sangpa-400 flex items-center justify-center mx-auto text-sangpa-700">
          <PhoneCall className="w-8 h-8 animate-bounce" />
        </div>

        <div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-100 text-amber-900 uppercase tracking-wider">
            Rural Fallback Voice Call Mode
          </span>
          <h3 className="text-xl font-bold text-sangpa-900 mt-2">
            Incoming Voice Call from SANGPA
          </h3>
          <p className="text-xs sm:text-sm text-sangpa-600 mt-1">
            Automated cellular phone call triggered for low-connectivity / rural regions.
          </p>
        </div>

        {callState === 'ringing' && (
          <div className="p-4 bg-sangpa-50 rounded-2xl border border-sangpa-200 space-y-3">
            <p className="text-sm font-semibold text-sangpa-900">
              Calling {patientProfile.name} on regular mobile SIM...
            </p>
            <button
              onClick={handleAnswer}
              className="w-full py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base shadow-md flex items-center justify-center gap-2"
            >
              <PhoneCall className="w-5 h-5" />
              <span>Simulate Answering Call</span>
            </button>
          </div>
        )}

        {callState === 'connected' && (
          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-left space-y-2">
            <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs uppercase">
              <Volume2 className="w-4 h-4 animate-pulse" />
              <span>Automated IVR Audio Playing</span>
            </div>
            <p className="text-xs text-emerald-950 italic">
              "Namaste Kamala Dadi. This is Sangpa calling via regular telephone line. It is time for your morning water. Press 1 to confirm."
            </p>
            <button
              onClick={handleConfirmOnCall}
              className="w-full mt-2 py-2.5 px-4 rounded-xl bg-sangpa-500 hover:bg-sangpa-600 text-white font-bold text-sm shadow-xs flex items-center justify-center gap-1.5"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Press Keypad 1 (Confirm Done)</span>
            </button>
          </div>
        )}

        {callState === 'completed' && (
          <div className="p-4 bg-emerald-100 rounded-2xl text-emerald-900 text-center space-y-2">
            <CheckCircle className="w-8 h-8 mx-auto text-emerald-700" />
            <p className="font-bold text-sm">Reminder Confirmed by Voice Call!</p>
            <p className="text-xs text-emerald-800">Caregiver Riya received SMS confirmation.</p>
            <button
              onClick={() => {
                setFallbackCallActive(false);
                setCallState('ringing');
              }}
              className="mt-2 py-2 px-4 rounded-xl bg-white text-emerald-900 font-semibold text-xs border border-emerald-300"
            >
              Dismiss
            </button>
          </div>
        )}

        <div className="flex items-center justify-center gap-1 text-[11px] text-sangpa-500">
          <ShieldCheck className="w-3.5 h-3.5 text-sangpa-600" />
          <span>Ensures zero missed care even without active 4G/Wi-Fi</span>
        </div>
      </div>
    </div>
  );
};
