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
  BatteryCharging,
  UtensilsCrossed,
  ChevronRight,
  MapPin,
  Radio,
  Stethoscope,
  RefreshCw,
  Map
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
    language,
    dietPlan,
    caregiverRole
  } = useApp();

  const [nudgeSent, setNudgeSent] = useState(false);
  const [isPingingGps, setIsPingingGps] = useState(false);
  const [gpsPingFeedback, setGpsPingFeedback] = useState<string | null>(null);
  const [showMiniMap, setShowMiniMap] = useState(false);

  const handlePingGps = () => {
    if (isPingingGps) return;
    setIsPingingGps(true);
    audio.playGentleChime();
    setTimeout(() => {
      setIsPingingGps(false);
      setGpsPingFeedback(
        language === 'hi'
          ? 'जीपीएस सत्यापित: सुरक्षित क्षेत्र में (सटीकता ±4 मी)'
          : 'GPS Verified: Safe at Home (Accuracy ±4m)'
      );
      setTimeout(() => setGpsPingFeedback(null), 3500);
    }, 700);
  };
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

        {/* 1B. Live GPS & Safe-Zone Geofence (Clean & Compact for Doctor, Nurse & Family) */}
        <div className="bg-white rounded-3xl p-4 border border-[#E7E3D8] shadow-xs space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-2xl bg-[#EAF2E6] text-[#2F4E24] flex items-center justify-center flex-shrink-0 shadow-2xs">
                <MapPin className="w-4 h-4 text-[#3E6530]" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-extrabold text-sm sm:text-base text-[#243B1D] leading-none">
                    {language === 'hi' ? 'लाइव जीपीएस एवं सुरक्षित क्षेत्र' :
                     language === 'as' ? 'লাইভ জিপিএছ আৰু সুৰক্ষিত স্থান' :
                     language === 'bn' ? 'লাইভ জিপিএস এবং নিরাপদ এলাকা' :
                     'Live GPS & Safe Zone'}
                  </h3>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>{language === 'hi' ? 'सक्रिय' : 'Live'}</span>
                  </span>
                </div>
                <p className="text-[11px] text-stone-500 mt-1 truncate">
                  {language === 'hi' ? 'घर का शयनकक्ष • तेजपुर, असम (26.6528° N, 92.7926° E)' : 'Home Residence • Tezpur, Assam (26.6528° N, 92.7926° E)'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 flex-shrink-0">
              <button
                type="button"
                onClick={handlePingGps}
                disabled={isPingingGps}
                title="Ping GPS"
                className="p-1.5 px-2.5 rounded-xl bg-[#FAF8F5] hover:bg-[#EAE5D9] text-[#243B1D] border border-[#DDD7C9] text-[11px] font-bold flex items-center gap-1 transition-all active:scale-95 cursor-pointer disabled:opacity-60"
              >
                <RefreshCw className={`w-3 h-3 text-[#3E6530] ${isPingingGps ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">{language === 'hi' ? 'पिंग करें' : 'Ping'}</span>
              </button>

              <button
                type="button"
                onClick={() => setShowMiniMap(!showMiniMap)}
                className={`p-1.5 px-2.5 rounded-xl border text-[11px] font-bold flex items-center gap-1 transition-all active:scale-95 cursor-pointer ${
                  showMiniMap 
                    ? 'bg-[#EAF2E6] text-[#24421C] border-[#CCD8C4]' 
                    : 'bg-[#FAF8F5] hover:bg-[#EAE5D9] text-[#243B1D] border-[#DDD7C9]'
                }`}
              >
                <Map className="w-3 h-3 text-[#3E6530]" />
                <span>{showMiniMap ? (language === 'hi' ? 'नक्शा छिपाएं' : 'Hide') : (language === 'hi' ? 'नक्शा' : 'Map')}</span>
              </button>
            </div>
          </div>

          {/* Location Badges & Status Row */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px]">
            <div className="p-2 rounded-xl bg-[#FAF8F5] border border-[#EBE6DC] flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
              <div className="min-w-0">
                <span className="text-[10px] text-stone-400 block leading-tight">{language === 'hi' ? 'दायरा' : 'Geofence'}</span>
                <span className="font-extrabold text-[#243B1D] truncate block">{language === 'hi' ? 'सुरक्षित क्षेत्र (200मी.)' : 'Safe Zone (200m)'}</span>
              </div>
            </div>

            <div className="p-2 rounded-xl bg-[#FAF8F5] border border-[#EBE6DC] flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
              <div className="min-w-0">
                <span className="text-[10px] text-stone-400 block leading-tight">{language === 'hi' ? 'सटीकता' : 'Accuracy'}</span>
                <span className="font-extrabold text-[#243B1D] truncate block">±4m (GNSS/NavIC)</span>
              </div>
            </div>

            <div className="p-2 rounded-xl bg-[#FAF8F5] border border-[#EBE6DC] col-span-2 sm:col-span-1 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
              <div className="min-w-0">
                <span className="text-[10px] text-stone-400 block leading-tight">{language === 'hi' ? 'स्थिति' : 'Patient State'}</span>
                <span className="font-extrabold text-[#243B1D] truncate block">{language === 'hi' ? 'घर पर स्थिर' : 'Stationary at Home'}</span>
              </div>
            </div>
          </div>

          {/* Role-Specific Perspective Banner */}
          {caregiverRole === 'doctor' && (
            <div className="p-2.5 rounded-xl bg-blue-50/70 border border-blue-200 text-[11px] text-blue-950 flex items-start gap-2">
              <Stethoscope className="w-3.5 h-3.5 text-blue-600 flex-shrink-0 mt-0.5" />
              <p className="leading-snug">
                <strong>{language === 'hi' ? 'डॉक्टर अवलोकन:' : 'Doctor Review:'}</strong>{' '}
                {language === 'hi'
                  ? 'मरीज सामान्य रूप से घर के सुरक्षित दायरे में हैं। पिछले 24 घंटों में भटकाव की कोई घटना दर्ज नहीं हुई।'
                  : 'Patient is resting within normal baseline home perimeter. Zero wandering anomalies recorded in the past 24h.'}
              </p>
            </div>
          )}

          {caregiverRole === 'nurse' && (
            <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200 text-[11px] text-emerald-950 flex items-start gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <p className="leading-snug">
                <strong>{language === 'hi' ? 'नर्स निगरानी:' : 'Nurse Duty:'}</strong>{' '}
                {language === 'hi'
                  ? '200मी. सुरक्षित दायरा सक्रिय है। यदि मरीज इस परिधि से बाहर जाता है तो तुरंत अलर्ट नर्सिंग डेस्क को जाएगा।'
                  : 'Active 200m perimeter monitoring. Automated emergency notifications armed if patient exits safe zone.'}
              </p>
            </div>
          )}

          {caregiverRole === 'family' && (
            <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200 text-[11px] text-amber-950 flex items-start gap-2">
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 flex-shrink-0 mt-0.5" />
              <p className="leading-snug">
                <strong>{language === 'hi' ? 'पारिवारिक सुरक्षा:' : 'Family Peace of Mind:'}</strong>{' '}
                {language === 'hi'
                  ? `${patientDisplayName} तेजपुर में घर पर सुरक्षित हैं। जीपीएस लगातार सक्रिय निगरानी में है।`
                  : `${patientDisplayName} is resting safely at home in Tezpur. Live satellite connection active.`}
              </p>
            </div>
          )}

          {/* Ping verification feedback toast */}
          {gpsPingFeedback && (
            <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold text-center animate-in fade-in flex items-center justify-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>{gpsPingFeedback}</span>
            </div>
          )}

          {/* Expandable Compact Stylized SVG Map View */}
          {showMiniMap && (
            <div className="relative rounded-2xl overflow-hidden border border-[#D5DFC9] bg-[#E8EFE2] h-32 w-full flex items-center justify-center animate-in fade-in duration-200">
              <svg className="absolute inset-0 w-full h-full opacity-40" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse">
                    <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#687C62" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
                <path d="M -10 64 Q 100 20, 200 70 T 450 50" fill="none" stroke="#D3DCB9" strokeWidth="6" />
                <path d="M 80 -10 Q 90 80, 160 140" fill="none" stroke="#CBD7B2" strokeWidth="4" />
              </svg>

              {/* Safe Zone Geofence Circle */}
              <div className="absolute w-24 h-24 rounded-full border-2 border-dashed border-emerald-600/70 bg-emerald-500/10 flex items-center justify-center animate-pulse">
                <span className="absolute -top-3 text-[9px] font-black uppercase text-emerald-800 bg-white/90 px-1.5 py-0.2 rounded-full border border-emerald-300">
                  200m Safe Zone
                </span>
              </div>

              {/* Pinpoint & Beacon */}
              <div className="relative z-10 flex flex-col items-center">
                <div className="relative">
                  <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-md border-2 border-white">
                    <MapPin className="w-4 h-4 fill-current" />
                  </div>
                  <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                  </span>
                </div>
                <div className="bg-white/95 px-2 py-0.5 rounded-md shadow-xs border border-emerald-200 mt-1">
                  <span className="text-[10px] font-extrabold text-[#243B1D] whitespace-nowrap">
                    {patientDisplayName} • Tezpur Home
                  </span>
                </div>
              </div>

              <div className="absolute bottom-1 right-2 text-[9px] text-stone-500 font-mono bg-white/80 px-1 rounded">
                26.6528°N, 92.7926°E
              </div>
            </div>
          )}
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

        {/* 2B. Today's Nutrition Section */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#E7E3D8] shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-[#EAF2E6] text-[#345228] flex items-center justify-center flex-shrink-0">
                <UtensilsCrossed className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm sm:text-base text-[#243B1D]">
                  Today's Nutrition
                </h3>
                <p className="text-[10px] text-stone-500">
                  Approved by {dietPlan.approvedBy.split(' (')[0]}
                </p>
              </div>
            </div>

            <span className="text-[11px] font-bold text-emerald-800 bg-[#EAF2E6] px-2.5 py-0.5 rounded-full border border-[#D5DFC9]">
              Hydration: {dietPlan.hydrationCurrent} / {dietPlan.hydrationTarget} glasses
            </span>
          </div>

          {/* Meals Status List */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
            {dietPlan.meals.map(m => {
              const isDone = m.status === 'completed';
              const isPartial = m.status === 'partially_eaten';
              const isSkipped = m.status === 'skipped';
              return (
                <div key={m.id} className="p-2.5 rounded-2xl bg-[#FAF8F5] border border-[#EBE6DC] text-center space-y-1">
                  <span className="text-xs font-bold text-stone-800 block capitalize">{m.name}</span>
                  <div className="flex items-center justify-center gap-1 text-[11px] font-bold">
                    {isDone ? (
                      <span className="text-emerald-700 flex items-center gap-1">
                        <span>✓</span> Completed
                      </span>
                    ) : isPartial ? (
                      <span className="text-amber-700 flex items-center gap-1">
                        <span>◐</span> Partial
                      </span>
                    ) : isSkipped ? (
                      <span className="text-rose-700 flex items-center gap-1">
                        <span>✕</span> Skipped
                      </span>
                    ) : (
                      <span className="text-stone-400 flex items-center gap-1">
                        <span>○</span> Upcoming
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action Button: View Diet Plan */}
          <button
            onClick={() => {
              audio.playGentleChime();
              setCaregiverScreen('diet');
            }}
            className="w-full py-2.5 px-3 rounded-2xl bg-[#EAF2E6] hover:bg-[#DCE7D3] text-[#24421C] font-extrabold text-xs flex items-center justify-center gap-1.5 border border-[#CCD8C4] transition-all active:scale-98 cursor-pointer shadow-2xs"
          >
            <span>View Diet Plan</span>
            <ChevronRight className="w-4 h-4 text-[#3E6530]" />
          </button>
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

