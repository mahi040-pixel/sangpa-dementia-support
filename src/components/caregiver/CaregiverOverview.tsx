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
import { getCaregiverI18n } from '../../utils/caregiverLocalization';

export const CaregiverOverview: React.FC = () => {
  const { 
    patientProfile, 
    reminders, 
    setCaregiverScreen,
    speakMascot,
    setRole,
    setPatientScreen,
    language
  } = useApp();

  const [nudgeSent, setNudgeSent] = useState(false);
  const patientDisplayName = patientProfile.preferredName || patientProfile.name || 'Maya Devi';
  const t = getCaregiverI18n(language);

  const careTasks = [
    {
      icon: Pill,
      title: language === 'hi' ? 'सुबह के रक्तचाप की दवा' :
             language === 'as' ? 'পুৱাৰ ৰক্তচাপৰ ঔষধ' :
             language === 'bn' ? 'সকালের রক্তচাপের ওষুধ' :
             language === 'mni' ? 'য়ুকী রক্তচাপকী হিদাক' :
             language === 'nag' ? 'সকালর ব্লাড প্রেসার ঔষধ' :
             language === 'es' ? 'Medicamento de Presión Matutino' : 'Morning Blood Pressure Medicine',
      status: language === 'hi' ? '08:30 AM को ली गई' :
              language === 'as' ? '০৮:৩০ AM লোৱা হ’ল' :
              language === 'bn' ? '০৮:৩০ AM নেওয়া হয়েছে' :
              language === 'mni' ? '০৮:৩০ AM দা লৌরে' :
              language === 'nag' ? '০৮:৩০ AM লোয়া হোল' :
              language === 'es' ? 'Tomado 08:30 AM' : 'Taken 08:30 AM',
      desc: language === 'hi' ? 'नाश्ते के बाद गुनगुने पानी के साथ एम्लोडिपिन 5 मि.ग्रा. ली गई।' :
            language === 'as' ? 'পুৱাৰ জলপানৰ পিছত কুহুমীয়া পানীৰে এমলোডিপিন ৫ মি.গ্ৰা. খালে।' :
            language === 'bn' ? 'প্রাতঃরাশের পর হালকা গরম জল দিয়ে অ্যামলোডিপিন ৫ মিলিগ্রাম গ্রহণ করা হয়েছে।' :
            language === 'mni' ? 'চাকচাবা মতুংদা ঈসিং কন্ননা এমলোডিপিন ৫ মিগ্রা লৌখ্রে।' :
            language === 'nag' ? 'নাস্তার পিছত গৰম পানী লগতে এমলোডিপিন ৫ মিগ্রা খাইছে।' :
            language === 'es' ? 'Amlodipino 5mg tomado con agua tibia después del desayuno.' : 'Amlodipine 5mg taken with warm water after breakfast.'
    },
    {
      icon: Droplets,
      title: language === 'hi' ? 'जलपान सेवन (हाइड्रेशन)' :
             language === 'as' ? 'পানী খোৱা (হাইড্ৰেচন)' :
             language === 'bn' ? 'জলপান গ্রহণ (হাইড্রেশন)' :
             language === 'mni' ? 'ঈসিং থকপা (হাইড্রেশন)' :
             language === 'nag' ? 'পানী খোৱা' :
             language === 'es' ? 'Ingesta de Hidratación' : 'Hydration Intake',
      status: language === 'hi' ? '4 / 5 ग्लास' :
              language === 'as' ? '৪ / ৫ গিলাচ' :
              language === 'bn' ? '৪ / ৫ গ্লাস' :
              language === 'mni' ? '৪ / ৫ গ্লাস' :
              language === 'nag' ? '৪ / ৫ গ্লাস' :
              language === 'es' ? '4 / 5 Vasos' : '4 / 5 Glasses',
      desc: language === 'hi' ? 'अच्छी तरह से हाइड्रेटेड हैं। अगला ग्लास सुबह 10:00 बजे निर्धारित है।' :
            language === 'as' ? 'ভালে পানী খাইছে। পৰৱৰ্তী গিলাচ পুৱা ১০:০০ বজাত নিৰ্ধাৰিত।' :
            language === 'bn' ? 'পর্যাপ্ত জলপান করেছেন। পরবর্তী গ্লাস সকাল ১০:০০ টায় নির্ধারিত।' :
            language === 'mni' ? 'ঈসিং ফনা থকরে। মথংগী গ্লাস অয়ুক্কী ১০:০০ দা।' :
            language === 'nag' ? 'ভাল পানী খাইছে। নেক্সট গ্লাস ১০:০০ AM ত।' :
            language === 'es' ? 'Bien hidratado. Próximo vaso programado a las 10:00 AM.' : 'Well hydrated. Next glass scheduled at 10:00 AM.'
    },
    {
      icon: Activity,
      title: language === 'hi' ? 'शारीरिक गतिविधि और मनोदशा' :
             language === 'as' ? 'শাৰীৰিক কাৰ্যকলাপ আৰু মেজাজ' :
             language === 'bn' ? 'শারীরিক ক্রিয়াকলাপ ও মেজাজ' :
             language === 'mni' ? 'হকচাংগী এক্টিভিটি অমসুং ৱাখল' :
             language === 'nag' ? 'শারীরিক এক্টিভিটি আৰু মুড' :
             language === 'es' ? 'Actividad Física y Estado de Ánimo' : 'Physical Activity & Mood',
      status: language === 'hi' ? 'आरामदायक' :
              language === 'as' ? 'সুখকৰ' :
              language === 'bn' ? 'স্বস্তিদায়ক' :
              language === 'mni' ? 'নুংঙাইবা' :
              language === 'nag' ? 'আরামদায়ক' :
              language === 'es' ? 'Cómodo' : 'Comfortable',
      desc: language === 'hi' ? 'देखभालकर्ता के साथ बैठकर स्ट्रेचिंग पूरी की; मुस्कुराते और शांत।' :
            language === 'as' ? 'সেৱকৰ লগত বহি ষ্ট্ৰেচিং সম্পূৰ্ণ কৰা হ’ল; হাঁহি আৰু শান্ত।' :
            language === 'bn' ? 'পরিচর্যাকারীর সাথে বসে স্ট্রেচিং সম্পন্ন করেছেন; হাসিখুশি ও শান্ত।' :
            language === 'mni' ? 'কেয়ারগিভারগা লোয়ননা স্ট্রেচিং তৌরে; নুংঙাইনা পোত্থারে।' :
            language === 'nag' ? 'কেয়ারগিভার লগতে বহি ষ্ট্ৰেচিং কৰিলে; হাঁহি আৰু শান্ত।' :
            language === 'es' ? 'Estiramiento sentado completado con el cuidador; sonriente y relajado.' : 'Seated stretching completed with caregiver; smiling and relaxed.'
    },
    {
      icon: ShieldCheck,
      title: language === 'hi' ? 'सुरक्षा एवं स्वास्थ्य अलर्ट' :
             language === 'as' ? 'সুৰক্ষা আৰু স্বাস্থ্য সতৰ্কতা' :
             language === 'bn' ? 'নিরাপত্তা ও স্বাস্থ্য সতর্কতা' :
             language === 'mni' ? 'ঙাক-শেন অমসুং হকশেল এলার্ট' :
             language === 'nag' ? 'সুরক্ষা আৰু স্বাস্থ্য এলার্ট' :
             language === 'es' ? 'Alertas de Seguridad y Salud' : 'Safety & Health Alerts',
      status: language === 'hi' ? 'सब सामान्य' :
              language === 'as' ? 'সকলো ঠিক আছে' :
              language === 'bn' ? 'সব ঠিক আছে' :
              language === 'mni' ? 'খুদিংমক শেংনা লৈ' :
              language === 'nag' ? 'সব ক্লিয়ার' :
              language === 'es' ? 'Todo Despejado' : 'All Clear',
      desc: language === 'hi' ? 'कोई छूटी हुई दवा नहीं, कोई आपातकालीन चेतावनी नहीं, कोई भटकाव नहीं।' :
            language === 'as' ? 'কোনো বাদ পৰা ঔষধ নাই, কোনো জৰুৰী সতৰ্কতা নাই।' :
            language === 'bn' ? 'কোনো বাদ পড়া ওষুধ নেই, কোনো জরুরি সতর্কতা নেই।' :
            language === 'mni' ? 'হিদাক মাংবা অমত্তা লৈতে, ইমার্জেন্সি এলার্ট লৈতে।' :
            language === 'nag' ? 'একো ঔষধ বাদ যোৱা নাই, একো জৰুৰী সতৰ্কতা নাই।' :
            language === 'es' ? 'Cero medicamentos omitidos, sin alertas de emergencia ni desorientación.' : 'Zero missed medicines, no emergency alerts, no wander warnings.'
    }
  ];

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
              {t.overview.title}
            </h1>
            <p className="text-xs text-[#687C62] font-medium mt-0.5">
              {t.overview.subtitle(patientDisplayName)}
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-[#EAF2E6] border border-[#D5DFC9] px-2.5 py-1 rounded-full text-[11px] font-bold text-[#2F4E24]">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{t.overview.liveConnected}</span>
          </div>
        </div>

        {/* 1. How is the Patient Doing? (Main Status Card) */}
        <div className="bg-white rounded-3xl p-5 border border-[#E7E3D8] shadow-xs space-y-3.5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#4E7037] block">
                {t.overview.currentCondition}
              </span>
              <h2 className="text-lg font-black text-[#243B1D] mt-0.5 truncate">
                {patientProfile.name || 'Maya Devi'} ({t.overview.ageLabel(patientProfile.age || 74)})
              </h2>
              <p className="text-xs text-stone-500 font-medium">
                {patientProfile.condition || t.overview.conditionName}
              </p>
            </div>

            {/* Status Badge */}
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#EAF2E6] text-[#24421C] text-xs font-black border border-[#D5DFC9] shadow-2xs flex-shrink-0">
              <Smile className="w-4 h-4 text-[#3E6530]" />
              <span>{t.overview.doingWellBadge}</span>
            </span>
          </div>

          {/* Reassuring Clinical & Emotional Summary */}
          <div className="p-3.5 bg-[#F7FAF4] rounded-2xl border border-[#E1EAD8] text-xs text-[#203D17] leading-relaxed space-y-1">
            <div className="font-bold flex items-center gap-1.5 text-[#243B1D]">
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
              <span>{t.overview.statusUpdateHeader}</span>
            </div>
            <p>
              {t.overview.statusUpdateText(patientDisplayName)}
            </p>
          </div>

          {/* Live Connectivity Vitals */}
          <div className="grid grid-cols-3 gap-2 pt-1 border-t border-[#F0ECE1] text-[11px] text-stone-600">
            <div className="flex items-center gap-1.5">
              <Wifi className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
              <span className="truncate">{t.overview.onlineStatus}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <BatteryCharging className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
              <span>{t.overview.batteryStatus(86)}</span>
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
              {t.overview.todayStreamTitle}
            </h3>
            <span className="text-[11px] font-bold text-emerald-700">
              {t.overview.allTasksSynced}
            </span>
          </div>

          <div className="space-y-2.5 text-xs">
            {careTasks.map((task, idx) => {
              const TaskIcon = task.icon;
              return (
                <div key={idx} className="flex items-start gap-3 p-2.5 rounded-2xl bg-[#FAF8F5] border border-[#EBE6DC]">
                  <div className="w-7 h-7 rounded-xl bg-[#EAF2E6] text-[#345228] flex items-center justify-center flex-shrink-0">
                    <TaskIcon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-extrabold text-[#243B1D] truncate">{task.title}</span>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full flex-shrink-0">
                        {task.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-500 mt-0.5">
                      {task.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. Quick Direct Patient Contact Actions */}
        <div className="bg-white rounded-3xl p-4 border border-[#E7E3D8] shadow-xs space-y-2.5">
          <span className="text-[10px] font-black uppercase tracking-wider text-stone-500 block">
            {t.overview.quickActionsTitle}
          </span>

          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={handleCallPatient}
              className="py-3 px-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all active:scale-98 cursor-pointer"
            >
              <Phone className="w-4 h-4" />
              <span>{t.overview.callPatient}</span>
            </button>

            <button
              onClick={handleSendVoiceNudge}
              className="py-3 px-3 rounded-2xl bg-[#EAF2E6] hover:bg-[#DCE7D3] text-[#24421C] font-bold text-xs flex items-center justify-center gap-2 border border-[#CCD8C4] shadow-2xs transition-all active:scale-98 cursor-pointer"
            >
              <MessageSquare className="w-4 h-4 text-[#3E6530]" />
              <span>{t.overview.sendVoiceNudge}</span>
            </button>
          </div>

          {nudgeSent && (
            <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold text-center animate-in fade-in">
              ✓ {t.overview.voiceNudgeSent}
            </div>
          )}
        </div>

        {/* 4. Subtle Navigation Guidance Note */}
        <div className="p-3 bg-[#FAF8F5] rounded-2xl border border-[#E7E3D8] text-[11px] text-stone-600 text-center space-y-1">
          <p className="font-semibold text-stone-700">
            👉 {t.nav.navigation}:
          </p>
          <p className="text-[10px] text-stone-500">
            {t.nav.options.patient_profile?.number} {t.nav.options.patient_profile?.label} • {t.nav.options.knowledge_assistant?.number} {t.nav.options.knowledge_assistant?.label} • {t.nav.options.memories?.number} {t.nav.options.memories?.label} • {t.nav.options.alerts?.number} {t.nav.options.alerts?.label} • {t.nav.options.progress?.number} {t.nav.options.progress?.label}
          </p>
        </div>

      </div>
    </div>
  );
};

