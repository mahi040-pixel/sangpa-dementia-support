import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Pill, 
  Droplets, 
  CupSoda, 
  Footprints, 
  Moon, 
  Volume2, 
  CheckCircle, 
  Clock, 
  ArrowLeft, 
  HelpCircle,
  PhoneCall,
  RotateCcw
} from 'lucide-react';
import { audio } from '../../utils/audio';
import { ReminderItem } from '../../types';
import { PATIENT_I18N, getLocalizedActivity } from '../../utils/localization';

export const PatientReminders: React.FC = () => {
  const {
    reminders,
    completeReminder,
    snoozeReminder,
    setPatientScreen,
    speakMascot,
    setFallbackCallActive,
    language,
    patientProfile
  } = useApp();

  const [confirmMedModal, setConfirmMedModal] = useState<ReminderItem | null>(null);

  const i18n = PATIENT_I18N[language] || PATIENT_I18N.en;
  const callingName = patientProfile?.preferredName || patientProfile?.name || 'Kamala Dadi';

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'medicine': return <Pill className="w-6 h-6 text-sangpa-700" />;
      case 'hydration': return <Droplets className="w-6 h-6 text-sangpa-700" />;
      case 'exercise': return <Footprints className="w-6 h-6 text-sangpa-700" />;
      case 'night': return <Moon className="w-6 h-6 text-sangpa-700" />;
      default: return <CupSoda className="w-6 h-6 text-sangpa-700" />;
    }
  };

  const handlePlayAudio = (r: ReminderItem, e: React.MouseEvent) => {
    e.stopPropagation();
    const loc = getLocalizedActivity(r.title, r.instructions || '', language);
    const text = (language === 'hi' || language === 'bn' || language === 'as' || language === 'mni')
      ? `${loc.title}। ${loc.desc}`
      : (language === 'en' && r.audioText ? r.audioText : `${loc.title}. ${loc.desc}`);
    speakMascot(text, 'speaking');
  };

  const handleDoneClick = (r: ReminderItem) => {
    if (r.category === 'medicine') {
      setConfirmMedModal(r);
    } else {
      completeReminder(r.id);
    }
  };

  const handleConfirmMedicineTaken = () => {
    if (confirmMedModal) {
      completeReminder(confirmMedModal.id);
      setConfirmMedModal(null);
    }
  };

  return (
    <div className="flex-1 p-4 sm:p-6 max-w-2xl mx-auto w-full space-y-4">
      {/* Header with Back button */}
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
            <h2 className="text-xl sm:text-2xl font-extrabold text-sangpa-900 tracking-tight">
              {i18n.remindersTitle}
            </h2>
            <p className="text-xs sm:text-sm text-sangpa-600">
              {i18n.remindersSubtitle}
            </p>
          </div>
        </div>

        {/* Fallback phone call trigger for rural simulation */}
        <button
          onClick={() => setFallbackCallActive(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-sangpa-100 hover:bg-sangpa-200 text-sangpa-800 text-xs font-semibold border border-sangpa-300"
          title="Rural call fallback"
        >
          <PhoneCall className="w-3.5 h-3.5 text-sangpa-600" />
          <span className="hidden sm:inline">{i18n.voiceCallFallback}</span>
        </button>
      </div>

      {/* Reminder Cards Chronological List */}
      <div className="space-y-3.5">
        {reminders.map((r) => {
          const isCompleted = r.status === 'completed';
          const isSnoozed = r.status === 'snoozed';
          const loc = getLocalizedActivity(r.title, r.instructions || '', language);

          return (
            <div
              key={r.id}
              className={`rounded-3xl p-4 sm:p-5 border-2 transition-all shadow-sm ${
                isCompleted
                  ? 'bg-sangpa-50/70 border-sangpa-200 opacity-80'
                  : isSnoozed
                  ? 'bg-amber-50/80 border-amber-300'
                  : 'bg-white border-sangpa-300 hover:border-sangpa-400'
              }`}
            >
              {/* Card Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-2xl ${isCompleted ? 'bg-sangpa-200/60' : 'bg-sangpa-100'}`}>
                    {getCategoryIcon(r.category)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-sangpa-200 text-sangpa-800">
                        {r.time}
                      </span>
                      {isCompleted && (
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" /> {i18n.done}
                        </span>
                      )}
                      {isSnoozed && (
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 flex items-center gap-1">
                          <RotateCcw className="w-3 h-3" /> {i18n.snoozedBadge}
                        </span>
                      )}
                    </div>
                    <h3 className={`text-base sm:text-lg font-bold mt-1 leading-snug ${
                      isCompleted ? 'line-through text-sangpa-600' : 'text-sangpa-900'
                    }`}>
                      {loc.title}
                    </h3>
                  </div>
                </div>

                {/* Voice audio instruction readout */}
                <button
                  onClick={(e) => handlePlayAudio(r, e)}
                  className="p-2 rounded-full bg-sangpa-100 hover:bg-sangpa-200 text-sangpa-700 transition-colors flex-shrink-0"
                  title={i18n.listenAgain}
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>

              {/* Dosage & Instruction Details */}
              <div className="mt-2.5 pl-1 text-xs sm:text-sm text-sangpa-700 bg-sangpa-50/50 p-2.5 rounded-xl border border-sangpa-100">
                {r.dosage && (
                  <p className="font-semibold text-sangpa-900 mb-0.5">
                    {i18n.dosageLabel}: <span className="font-normal text-sangpa-700">{r.dosage}</span>
                  </p>
                )}
                <p>{loc.desc}</p>
              </div>

              {/* Action Buttons */}
              {!isCompleted && (
                <div className="mt-4 pt-2 border-t border-sangpa-100 flex flex-wrap items-center justify-between gap-2">
                  <button
                    onClick={() => handleDoneClick(r)}
                    className="flex-1 py-2.5 px-4 rounded-2xl bg-sangpa-500 hover:bg-sangpa-600 active:scale-98 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>{i18n.done}</span>
                  </button>

                  <button
                    onClick={() => snoozeReminder(r.id)}
                    className="py-2.5 px-4 rounded-2xl bg-white hover:bg-sangpa-100 text-sangpa-800 font-semibold text-xs sm:text-sm border border-sangpa-300 transition-all flex items-center justify-center gap-1.5"
                  >
                    <Clock className="w-4 h-4 text-sangpa-600" />
                    <span>{i18n.remindIn15m}</span>
                  </button>

                  <button
                    onClick={() => {
                      audio.playTempleBell();
                      const msg = language === 'hi'
                        ? `कोई बात नहीं ${callingName}। मैं आपकी बेटी रिया को सूचित कर रही हूँ कि आपको ${loc.title} में सहायता चाहिए।`
                        : language === 'as'
                        ? `একো কথা নাই ${callingName}। মই আপোনাৰ জীয়ৰী ৰিয়াক জনাই আছোঁ যে আপোনাক ${loc.title}ত সহায় লাগিব।`
                        : language === 'mni'
                        ? `ৱাবা লৈতে ${callingName}। অদোমদা ${loc.title}গীদমক মতেং মথৌ তাই হায়না ঐহাক্না অদোমগী মচানুপী রিয়াদা পাউদমজরি।`
                        : language === 'bn'
                        ? `কোনো অসুবিধা নেই ${callingName}। আমি আপনার মেয়ে রিয়াকে জানিয়ে দিচ্ছি যে আপনার ${loc.title}-এ সাহায্য প্রয়োজন।`
                        : language === 'nag'
                        ? `Kiba chinta nai ${callingName}। Moi apuni laga bacha Riya ke jonai dibo apuni ke ${loc.title} te help lage।`
                        : language === 'es'
                        ? `No hay problema, ${callingName}. Le avisaré a su hija Riya que necesita ayuda con ${loc.title}.`
                        : `No problem, ${callingName}. I will notify your daughter Riya that you need assistance with ${loc.title}.`;
                      speakMascot(msg, 'help');
                    }}
                    className="py-2.5 px-3 rounded-2xl bg-sangpa-100 hover:bg-sangpa-200 text-sangpa-800 text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-1"
                  >
                    <HelpCircle className="w-4 h-4 text-sangpa-600" />
                    <span>{i18n.needHelp}</span>
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Friendly Medication Confirmation Safety Modal */}
      {confirmMedModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border-2 border-sangpa-400 rounded-3xl max-w-md w-full p-6 shadow-2xl text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-sangpa-100 border-2 border-sangpa-300 flex items-center justify-center mx-auto text-sangpa-700">
              <Pill className="w-8 h-8" />
            </div>

            <h3 className="text-xl font-bold text-sangpa-900">
              {i18n.confirmMedTitle}
            </h3>

            <div className="bg-sangpa-50 p-3 rounded-2xl border border-sangpa-200 text-left text-sm">
              <p className="font-bold text-sangpa-900">
                {getLocalizedActivity(confirmMedModal.title, confirmMedModal.instructions || '', language).title}
              </p>
              {confirmMedModal.dosage && (
                <p className="text-sangpa-600 mt-1">{i18n.dosageLabel}: {confirmMedModal.dosage}</p>
              )}
              <p className="text-xs text-sangpa-500 mt-1 italic">
                {getLocalizedActivity(confirmMedModal.title, confirmMedModal.instructions || '', language).desc}
              </p>
            </div>

            <p className="text-xs text-sangpa-600">
              {i18n.confirmMedDesc}
            </p>

            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <button
                onClick={handleConfirmMedicineTaken}
                className="flex-1 py-3 px-4 rounded-2xl bg-sangpa-500 hover:bg-sangpa-600 active:scale-98 text-white font-bold text-base shadow-md transition-all"
              >
                {i18n.confirmMedYes}
              </button>
              <button
                onClick={() => setConfirmMedModal(null)}
                className="py-3 px-4 rounded-2xl bg-white hover:bg-sangpa-100 text-sangpa-800 font-semibold text-sm border border-sangpa-300"
              >
                {i18n.confirmMedNo}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
