import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ArrowLeft, 
  Phone, 
  AlertTriangle, 
  ShieldAlert, 
  PhoneCall, 
  X, 
  CheckCircle,
  Volume2
} from 'lucide-react';
import { audio } from '../../utils/audio';
import { PATIENT_I18N, APP_VOICE_RESPONSES } from '../../utils/localization';

export const PatientEmergency: React.FC = () => {
  const { setPatientScreen, speakMascot, contacts, language, patientProfile } = useApp();

  const [countdown, setCountdown] = useState<number | null>(null);
  const [targetContact, setTargetContact] = useState<{ name: string; phone: string } | null>(null);
  const [callActive, setCallActive] = useState(false);

  const i18n = PATIENT_I18N[language] || PATIENT_I18N.en;
  const callingName = patientProfile?.preferredName || patientProfile?.name || 'Kamala Dadi';

  const primaryCaregiver = contacts.find(c => c.isPrimary) || contacts[0];
  const doctor = contacts.find(c => c.role === 'doctor') || contacts[2];

  // Reassure patient immediately upon entering emergency screen
  useEffect(() => {
    const helpFn = APP_VOICE_RESPONSES.emergencyHelp[language] || APP_VOICE_RESPONSES.emergencyHelp.en;
    const msg = helpFn(callingName);
    speakMascot(msg, 'help');
  }, []);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (countdown !== null && countdown > 0) {
      audio.playEmergencyPulse();
      timer = setTimeout(() => {
        setCountdown(c => (c !== null ? c - 1 : null));
      }, 1000);
    } else if (countdown === 0) {
      setCountdown(null);
      setCallActive(true);
      audio.playSuccessJingle();
      const connectedFn = APP_VOICE_RESPONSES.emergencyConnected[language] || APP_VOICE_RESPONSES.emergencyConnected.en;
      const connectedMsg = connectedFn(targetContact?.name || 'Riya');
      speakMascot(connectedMsg, 'help');
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleStartEmergencyCall = (name: string, phone: string) => {
    setTargetContact({ name, phone });
    setCountdown(5); // 5 second safety countdown
    audio.playTempleBell();
    const promptFn = APP_VOICE_RESPONSES.emergencyCalling[language] || APP_VOICE_RESPONSES.emergencyCalling.en;
    const prompt = promptFn(name);
    speakMascot(prompt, 'help');
  };

  const handleCancelCountdown = () => {
    setCountdown(null);
    setTargetContact(null);
    audio.playGentleChime();
    const cancelFn = APP_VOICE_RESPONSES.emergencyCancelled[language] || APP_VOICE_RESPONSES.emergencyCancelled.en;
    const cancelMsg = cancelFn(callingName);
    speakMascot(cancelMsg, 'idle');
  };

  return (
    <div className="flex-1 p-4 sm:p-6 max-w-2xl mx-auto w-full space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 border-b border-sangpa-200 pb-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setPatientScreen('home')}
            className="p-2 rounded-2xl bg-white border border-sangpa-300 hover:bg-sangpa-100 text-sangpa-800 transition-colors shadow-2xs"
            title={i18n.back}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-emergency-900 tracking-tight">
              {i18n.emergencyTitle}
            </h2>
            <p className="text-xs sm:text-sm text-emergency-700">
              {i18n.emergencySubtitle}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emergency-100 border border-emergency-300 text-emergency-800 text-xs font-bold">
          <ShieldAlert className="w-3.5 h-3.5 text-emergency-600" />
          <span>{i18n.activeGuard}</span>
        </div>
      </div>

      {/* 5-Second Cancel Countdown Alert Banner */}
      {countdown !== null && (
        <div className="bg-emergency-500 text-white rounded-3xl p-6 text-center space-y-3 shadow-2xl animate-pulse">
          <AlertTriangle className="w-12 h-12 mx-auto text-amber-300" />
          <h3 className="text-2xl font-black">
            {i18n.callingInSecs(targetContact?.name || '', countdown)}
          </h3>
          <p className="text-sm text-emergency-100">
            {i18n.cancelAccidentalCall}
          </p>
          <button
            onClick={handleCancelCountdown}
            className="w-full py-4 px-6 rounded-2xl bg-white text-emergency-700 font-extrabold text-lg shadow-lg hover:bg-gray-100 transition-all flex items-center justify-center gap-2"
          >
            <X className="w-6 h-6" />
            <span>{i18n.cancelCallBtn}</span>
          </button>
        </div>
      )}

      {/* Active Call Simulation */}
      {callActive && (
        <div className="bg-emerald-700 text-white rounded-3xl p-6 text-center space-y-4 shadow-xl">
          <div className="w-16 h-16 rounded-full bg-emerald-600 border-2 border-white flex items-center justify-center mx-auto">
            <PhoneCall className="w-8 h-8 animate-bounce" />
          </div>
          <h3 className="text-2xl font-bold">
            {i18n.callActiveWith(targetContact?.name || '')}
          </h3>
          <p className="text-sm text-emerald-100">
            {i18n.callActiveDesc}
          </p>
          <button
            onClick={() => setCallActive(false)}
            className="py-3 px-8 rounded-2xl bg-white text-emerald-900 font-bold text-sm shadow-md"
          >
            {i18n.endCallBtn}
          </button>
        </div>
      )}

      {/* Large 1-Tap Emergency Actions */}
      <div className="space-y-3 pt-1">
        {/* 1. Call Daughter Riya (Primary) */}
        <button
          onClick={() => handleStartEmergencyCall(primaryCaregiver.name, primaryCaregiver.phone)}
          className="w-full p-5 rounded-3xl bg-emergency-500 hover:bg-emergency-600 active:scale-98 text-white font-extrabold text-lg sm:text-xl shadow-touch transition-all flex items-center justify-between border-2 border-emergency-600"
        >
          <div className="flex items-center gap-4 text-left">
            <div className="p-3 rounded-2xl bg-white/20">
              <PhoneCall className="w-8 h-8 text-white" />
            </div>
            <div>
              <span>{i18n.callDaughterRiya}</span>
              <p className="text-xs text-emergency-100 font-normal mt-0.5">
                {i18n.callRiyaDesc}
              </p>
            </div>
          </div>
          <span className="text-xs bg-white text-emergency-800 font-bold px-3 py-1.5 rounded-xl">
            {i18n.callNowBtn}
          </span>
        </button>

        {/* 2. Call Doctor Anita Verma */}
        <button
          onClick={() => handleStartEmergencyCall(doctor.name, doctor.phone)}
          className="w-full p-5 rounded-3xl bg-white hover:bg-sangpa-50 active:scale-98 text-sangpa-900 font-bold text-base sm:text-lg shadow-sm border-2 border-sangpa-300 transition-all flex items-center justify-between"
        >
          <div className="flex items-center gap-4 text-left">
            <div className="p-3 rounded-2xl bg-sangpa-100 text-sangpa-700">
              <Phone className="w-6 h-6" />
            </div>
            <div>
              <span>{i18n.callDoctor}</span>
              <p className="text-xs text-sangpa-600 font-normal mt-0.5">
                {i18n.callDoctorDesc}
              </p>
            </div>
          </div>
          <span className="text-xs bg-sangpa-100 text-sangpa-800 font-bold px-3 py-1.5 rounded-xl">
            {i18n.callNowBtn}
          </span>
        </button>

        {/* 3. Call National Emergency Ambulance (108 / 112) */}
        <button
          onClick={() => handleStartEmergencyCall("National Ambulance 108", "108")}
          className="w-full p-4 rounded-3xl bg-white hover:bg-emergency-50 active:scale-98 text-emergency-800 font-bold text-sm sm:text-base border-2 border-emergency-300 transition-all flex items-center justify-between"
        >
          <div className="flex items-center gap-3 text-left">
            <div className="p-2.5 rounded-xl bg-emergency-100 text-emergency-700">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <span>{i18n.callAmbulance}</span>
              <p className="text-xs text-emergency-600 font-normal">
                {i18n.callAmbulanceDesc}
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-emergency-700">
            108 / 112
          </span>
        </button>
      </div>

      <p className="text-[11px] text-center text-sangpa-500 pt-2">
        {language === 'hi' 
          ? 'प्रत्येक कॉल में गलती से दबने पर रद्द करने के लिए 5 सेकंड का समय मिलता है। आप सुरक्षित हैं।'
          : 'Every call gives you 5 seconds to cancel if pressed accidentally. You are safe.'}
      </p>
    </div>
  );
};
