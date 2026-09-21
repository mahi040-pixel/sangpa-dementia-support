import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Bell, 
  AlertCircle, 
  AlertTriangle, 
  Info, 
  CheckCircle2, 
  Phone, 
  Clock, 
  ShieldCheck,
  RotateCcw,
  ArrowLeft
} from 'lucide-react';
import { audio } from '../../utils/audio';
import { CaregiverAlert } from '../../types';
import { getCaregiverI18n } from '../../utils/caregiverLocalization';

export const CaregiverAlertsPage: React.FC = () => {
  const { 
    alerts, 
    resolveAlert, 
    setRole, 
    setPatientScreen, 
    speakMascot, 
    setCaregiverScreen, 
    patientProfile,
    language,
    caregiverRole
  } = useApp();

  const patientDisplayName = patientProfile?.preferredName || patientProfile?.name || 'Maya Devi';
  const t = getCaregiverI18n(language);

  const getSeverityBadge = (sev: CaregiverAlert['severity']) => {
    switch (sev) {
      case 'urgent':
        return (
          <span className="px-2.5 py-1 rounded-full bg-emergency-100 text-emergency-900 border border-emergency-300 text-xs font-black flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5 text-emergency-600" />
            <span>{t.alerts.urgentBadge}</span>
          </span>
        );
      case 'needs_attention':
        return (
          <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
            <span>{t.alerts.needsAttentionBadge}</span>
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full bg-sangpa-100 text-sangpa-900 border border-sangpa-300 text-xs font-semibold flex items-center gap-1">
            <Info className="w-3.5 h-3.5 text-sangpa-600" />
            <span>{t.alerts.informationalBadge}</span>
          </span>
        );
    }
  };

  const handleContactPatient = () => {
    audio.playGentleChime();
    speakMascot(`Connecting you to ${patientDisplayName} right now.`, 'speaking');
    setRole('patient');
    setPatientScreen('emergency');
  };

  const unreadCount = alerts.filter(a => !a.resolved).length;

  return (
    <div className="flex-1 p-3.5 sm:p-6 lg:p-8 max-w-5xl mx-auto w-full space-y-4 sm:space-y-6 pb-24 md:pb-8 min-w-0">
      {/* Header */}
      <div className="border-b border-sangpa-200 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <button
            onClick={() => {
              audio.playGentleChime();
              setCaregiverScreen('overview');
            }}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#24421C] bg-[#DCE7D3] hover:bg-[#CAD8C6] px-3.5 py-1.5 rounded-full transition-all active:scale-95 cursor-pointer shadow-2xs mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{t.alerts.backBtn}</span>
          </button>
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-[#4E7037] block">
              {t.alerts.optionBadge}
            </span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
              caregiverRole === 'doctor'
                ? 'bg-purple-100 text-purple-900 border-purple-200'
                : caregiverRole === 'nurse'
                ? 'bg-blue-100 text-blue-900 border-blue-200'
                : 'bg-emerald-100 text-emerald-900 border-emerald-200'
            }`}>
              {caregiverRole === 'doctor' ? '👨‍⚕️ Clinical Clearance Authority' : caregiverRole === 'nurse' ? '👩‍⚕️ Daily Care Response' : '🏡 Family View • Supervised by Care Team'}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-sangpa-900 tracking-tight flex items-center gap-2">
            <span>{t.alerts.title}</span>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emergency-100 text-emergency-800">
              {t.alerts.unreadCount(unreadCount)}
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-sangpa-600">
            {t.alerts.subtitle}
          </p>
        </div>

        <button
          onClick={handleContactPatient}
          className="py-2 px-4 rounded-2xl bg-sangpa-500 hover:bg-sangpa-600 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <Phone className="w-4 h-4" />
          <span>{t.alerts.contactPatientBtn}</span>
        </button>
      </div>

      {/* Alerts Feed */}
      <div className="space-y-4">
        {alerts.map((alt) => {
          const isResolved = alt.resolved;

          return (
            <div
              key={alt.id}
              className={`rounded-3xl p-5 border-2 transition-all shadow-sm space-y-3 ${
                isResolved
                  ? 'bg-sangpa-50/70 border-sangpa-200 opacity-75'
                  : alt.severity === 'urgent'
                  ? 'bg-emergency-50/50 border-emergency-300'
                  : alt.severity === 'needs_attention'
                  ? 'bg-amber-50/50 border-amber-300'
                  : 'bg-white border-sangpa-200'
              }`}
            >
              {/* Top Row: Severity, Timestamp & Title */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  {getSeverityBadge(alt.severity)}
                  <h3 className={`text-base sm:text-lg font-bold ${isResolved ? 'line-through text-sangpa-600' : 'text-sangpa-900'}`}>
                    {alt.title}
                  </h3>
                </div>

                <span className="text-xs text-sangpa-600 font-medium">
                  {alt.timestamp}
                </span>
              </div>

              {/* Description */}
              <p className="text-sm text-sangpa-700">
                {alt.description}
              </p>

              {/* Recommended Care Action Box */}
              <div className="p-3 bg-white/90 rounded-2xl border border-sangpa-200 text-xs text-sangpa-800 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-sangpa-900">
                    {language === 'hi' ? 'अनुशंसित देखभालकर्ता कार्रवाई: ' : 
                     language === 'as' ? 'পৰামৰ্শ দিয়া সেৱকৰ কাৰ্য: ' : 
                     language === 'bn' ? 'সুপারিশকৃত পরিচর্যাকারীর পদক্ষেপ: ' : 
                     language === 'mni' ? 'রিকমেন্ড তৌবা কেয়ারগিভার এক্সন: ' : 
                     language === 'nag' ? 'ৰিকমেন্ড কৰা কেয়ারগিভার একশন: ' : 
                     language === 'es' ? 'Acción Recomendada del Cuidador: ' : 'Recommended Caregiver Action: '}
                  </span>
                  <span>{alt.recommendedAction}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-sangpa-100 flex flex-wrap items-center justify-between gap-2">
                {!isResolved ? (
                  <>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => resolveAlert(alt.id)}
                        className={`py-2 px-4 rounded-xl text-white font-bold text-xs shadow-xs flex items-center gap-1.5 cursor-pointer ${
                          caregiverRole === 'doctor'
                            ? 'bg-purple-700 hover:bg-purple-800'
                            : caregiverRole === 'nurse'
                            ? 'bg-blue-600 hover:bg-blue-700'
                            : 'bg-emerald-600 hover:bg-emerald-700'
                        }`}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>
                          {caregiverRole === 'doctor'
                            ? 'Resolve & Clear Clinical Alert'
                            : caregiverRole === 'nurse'
                            ? 'Acknowledge & Record Care Action'
                            : 'Acknowledge as Family'}
                        </span>
                      </button>

                      {caregiverRole === 'family' && (
                        <span className="text-[10px] font-bold px-2 py-1 rounded-lg bg-blue-50 text-blue-800 border border-blue-200">
                          🛡️ Under Nurse & Doctor Care
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleContactPatient}
                        className="py-2 px-3 rounded-xl bg-white hover:bg-sangpa-100 border border-sangpa-300 text-sangpa-800 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <Phone className="w-3.5 h-3.5 text-sangpa-600" />
                        <span>{t.alerts.contactPatientBtn}</span>
                      </button>

                      <button
                        onClick={() => {
                          audio.playTempleBell();
                          alert("Alert snoozed for 30 minutes.");
                        }}
                        className="py-2 px-3 rounded-xl bg-sangpa-100 hover:bg-sangpa-200 text-sangpa-800 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <Clock className="w-3.5 h-3.5 text-sangpa-600" />
                        <span>{language === 'hi' ? '30 मिनट स्नूज़' : language === 'as' ? '৩০ মিনিট স্নুজ' : language === 'bn' ? '৩০ মিনিট স্নুজ' : language === 'mni' ? 'মিনিট ৩০ স্নুজ' : language === 'nag' ? '৩০ মিনিট স্নুজ' : language === 'es' ? 'Posponer 30m' : 'Snooze 30m'}</span>
                      </button>
                    </div>
                  </>
                ) : (
                  <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5 py-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>{t.alerts.resolvedBadge}</span>
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
