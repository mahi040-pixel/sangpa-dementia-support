import { LanguageCode } from '../types';

export interface LocalizedUI {
  // Mascot & Global
  sangpaTitle: string;
  talkToSangpa: string;
  listenAgain: string;
  mascotGreeting: (name: string) => string;

  // Header & Controls
  help: string;
  voice: string;
  back: string;
  done: string;
  cancel: string;
  yes: string;
  no: string;

  // Dashboard / Next Activity
  nextActivity: string;
  allDay: string;
  focusView: string;
  happeningNow: string;
  finishedThis: string;
  rest15m: string;
  needHelp: string;
  comingUpNext: string;
  fullRoutine: string;
  caregiverSynced: string;
  activeNow: string;
  earlierToday: string;
  syncedWithTime: string;

  // Reminders
  remindersTitle: string;
  remindersSubtitle: string;
  voiceCallFallback: string;
  remindIn15m: string;
  dosageLabel: string;
  confirmMedTitle: string;
  confirmMedDesc: string;
  confirmMedYes: string;
  confirmMedNo: string;
  snoozedBadge: string;

  // Memories
  memoriesTitle: string;
  memoriesSubtitle: string;
  memoriesCount: (count: number) => string;
  playMemory: string;
  listenStory: string;
  close: string;

  // Wellness / Physical Exercise
  wellnessTitle: string;
  wellnessSubtitle: string;
  mindDietTitle: string;
  dailyMovementTitle: string;
  exerciseSubtitle: string;
  startExercise: string;
  pauseExercise: string;
  resumeExercise: string;
  nextStep: string;
  completedBadge: string;
  caregiverNote: string;
  dietDisclaimer: string;

  // Emergency
  emergencyTitle: string;
  emergencySubtitle: string;
  activeGuard: string;
  currentLocationLabel: string;
  currentLocationVal: string;
  callingInSecs: (name: string, secs: number) => string;
  cancelAccidentalCall: string;
  cancelCallBtn: string;
  callActiveWith: (name: string) => string;
  callActiveDesc: string;
  endCallBtn: string;
  callDaughterRiya: string;
  callRiyaDesc: string;
  callNowBtn: string;
  callDoctor: string;
  callDoctorDesc: string;
  callAmbulance: string;
  callAmbulanceDesc: string;

  // Standard Titles Mapping for Routine & Reminders
  activityTitles: Record<string, { title: string; desc: string }>;
}

export const PATIENT_I18N: Record<LanguageCode, LocalizedUI> = {
  hi: {
    sangpaTitle: "सॉन्गपा (Sangpa)",
    talkToSangpa: "सॉन्गपा से बात करें",
    listenAgain: "दोबारा सुनें",
    mascotGreeting: (name: string) => `नमस्ते ${name}! मैं आपकी साथी सॉन्गपा हूँ। आप आज बहुत अच्छा कर रही हैं। चलिए साथ चलते हैं।`,

    help: "मदद",
    voice: "आवाज़",
    back: "पीछे जाएं",
    done: "पूर्ण ✓",
    cancel: "रद्द करें",
    yes: "हाँ",
    no: "नहीं",

    nextActivity: "अगली गतिविधि",
    allDay: "पूरा दिन",
    focusView: "मुख्य दृश्य",
    happeningNow: "अभी का समय",
    finishedThis: "मैंने यह पूरा किया ✓",
    rest15m: "15 मिनट विश्राम",
    needHelp: "मदद चाहिए",
    comingUpNext: "इसके बाद अगली गतिविधि",
    fullRoutine: "दिनभर की पूरी दिनचर्या",
    caregiverSynced: "केयरगिवर से जुड़ा हुआ",
    activeNow: "सक्रिय",
    earlierToday: "पहले का समय",
    syncedWithTime: "सटीक समय से जुड़ा",

    remindersTitle: "दवा और याददिहानी",
    remindersSubtitle: "दवाइयों और पानी के लिए समय पर याद दिलाने वाले संदेश",
    voiceCallFallback: "कॉल बैकअप",
    remindIn15m: "15 मिनट बाद याद दिलाएं",
    dosageLabel: "मात्रा",
    confirmMedTitle: "क्या आपने अपनी दवा ले ली?",
    confirmMedDesc: "(पुष्टि करने से आपके परिवार को पता चलता है कि आप सुरक्षित और स्वस्थ हैं।)",
    confirmMedYes: "हाँ, मैंने ले ली ✓",
    confirmMedNo: "अभी नहीं",
    snoozedBadge: "स्थगित",

    memoriesTitle: "पारिवारिक यादें और सुखद पल",
    memoriesSubtitle: "तस्वीरें, जानी-पहचानी आवाज़ें और पुरानी यादें",
    memoriesCount: (count: number) => `${count} यादें`,
    playMemory: "याद देखें",
    listenStory: "आवाज़ में कहानी सुनें",
    close: "बंद करें",

    wellnessTitle: "शारीरिक व्यायाम और स्वास्थ्य",
    wellnessSubtitle: "पौष्टिक भोजन और कुर्सी पर बैठे-बैठे हल्का व्यायाम",
    mindDietTitle: "आज का पौष्टिक आहार सुझाव",
    dailyMovementTitle: "रोज़ाना का कुर्सी व्यायाम",
    exerciseSubtitle: "हल्का हाथ-कंधा खिंचाव और ताली व्यायाम",
    startExercise: "व्यायाम शुरू करें",
    pauseExercise: "रोकें",
    resumeExercise: "जारी रखें",
    nextStep: "अगला कदम",
    completedBadge: "व्यायाम पूर्ण ✓",
    caregiverNote: "रिया का सुझाव: खिचड़ी को शुद्ध गाय के घी के साथ हल्का पकाएं।",
    dietDisclaimer: "मस्तिष्क स्वास्थ्य के लिए पोषण सुझाव। चिकित्सीय सलाह नहीं।",

    emergencyTitle: "आपातकालीन सहायता",
    emergencySubtitle: "परिवार और डॉक्टर से तुरंत संपर्क",
    activeGuard: "सुरक्षा चालू",
    currentLocationLabel: "वर्तमान स्थान:",
    currentLocationVal: "घर का शयनकक्ष • तेजपुर (सुरक्षित क्षेत्र)",
    callingInSecs: (name: string, secs: number) => `${name} को ${secs} सेकंड में कॉल की जा रही है...`,
    cancelAccidentalCall: "यदि गलती से दब गया हो तो नीचे रद्द करें दबाएं।",
    cancelCallBtn: "कॉल रद्द करें (गलती से दब गया)",
    callActiveWith: (name: string) => `${name} से बात हो रही है...`,
    callActiveDesc: "ऑडियो लाइन चालू है। आपका स्थान और स्वास्थ्य विवरण साझा किया गया।",
    endCallBtn: "कॉल समाप्त करें",
    callDaughterRiya: "बेटी रिया को कॉल करें",
    callRiyaDesc: "प्राथमिक परिवार देखभालकर्ता • 1-टच में तुरंत कॉल",
    callNowBtn: "कॉल करें",
    callDoctor: "डॉ. अनीता वर्मा (डॉक्टर)",
    callDoctorDesc: "न्यूरोलॉजिस्ट व पारिवारिक चिकित्सक",
    callAmbulance: "राष्ट्रीय एम्बुलेंस 108 / 112",
    callAmbulanceDesc: "24x7 तत्काल आपातकालीन चिकित्सा सेवा",

    activityTitles: {
      "Morning Sunshine & Deep Breathing": {
        title: "सुबह की धूप और गहरा प्राणायाम",
        desc: "खिड़की के पास बैठकर 5 बार गहरी सांस लें।"
      },
      "Nutritious Breakfast": {
        title: "पौष्टिक नाश्ता",
        desc: "बादाम और शहद के साथ गर्म दलिया।"
      },
      "Morning Blood Pressure Tablet": {
        title: "सुबह की ब्लड प्रेशर की दवा",
        desc: "पानी के साथ 1 एमलोडिपिन गोली लें।"
      },
      "Mid-Morning Hydration": {
        title: "ताज़ा पानी पिएं",
        desc: "1 पूरा गिलास ताज़ा पानी पिएं।"
      },
      "Gentle Hand & Shoulder Stretching": {
        title: "हाथ और कंधों का हल्का खिंचाव",
        desc: "कुर्सी पर बैठकर दोनों हाथ ऊपर उठाएं।"
      },
      "Cognitive Sequence Recall Game": {
        title: "याददाश्त का क्रम खेल",
        desc: "सुंदर भारतीय वस्तुओं का क्रम याद रखें।"
      },
      "MIND-Diet Lunch (Khichdi & Spinach)": {
        title: "दोपहर का पौष्टिक भोजन (खिचड़ी व पालक)",
        desc: "अखरोट और ताज़ा पालक से भरपूर मूंग दाल खिचड़ी।"
      },
      "Rest & Afternoon Siesta": {
        title: "दोपहर का आराम व विश्राम",
        desc: "शांत बांसुरी संगीत सुनते हुए बिस्तर पर विश्राम करें।"
      },
      "Afternoon Herbal Chamomile Tea": {
        title: "दोपहर की हर्बल चाय",
        desc: "बालकनी में बैठकर गर्म कैमोमाइल चाय का आनंद लें।"
      },
      "Evening Balcony Walk with Riya": {
        title: "रिया के साथ बालकनी में टहलना",
        desc: "आरामदायक चप्पल पहनें और रिया का हाथ पकड़कर 15 मिनट टहलें।"
      },
      "Light Dinner & Family Conversation": {
        title: "हल्का रात का भोजन और पारिवारिक बातचीत",
        desc: "गर्म रोटी, हरी सब्जियां और आरव के साथ प्यारी बातें।"
      },
      "Night Medicine with Warm Turmeric Milk": {
        title: "हल्दी दूध के साथ रात की दवा",
        desc: "गर्म हल्दी वाले दूध के साथ रात की दवा लें।"
      },
      "Bedtime Gratitude & Calming Music": {
        title: "सुखद नींद और शांत संगीत",
        desc: "आराम से लेटें और शांतिदायक संगीत सुनें।"
      },
      "Morning Blood Pressure Medicine": {
        title: "सुबह की ब्लड प्रेशर की दवा",
        desc: "नाश्ते के बाद गुनगुने पानी के साथ 1 सफेद गोली लें।"
      },
      "Drink Pure Fresh Water": {
        title: "ताज़ा पानी पिएं",
        desc: "आराम से बैठकर एक गिलास ताज़ा पानी पिएं।"
      },
      "Post-Lunch Memory Vitamin B-Complex": {
        title: "भोजन के बाद विटामिन बी-कॉम्प्लेक्स",
        desc: "दोपहर के खाने के 15 मिनट बाद गुनगुने पानी से लें।"
      },
      "Night Medicine with Warm Milk": {
        title: "गर्म दूध के साथ रात की दवा",
        desc: "सोने से पहले गर्म दूध के साथ 1 गोली लें।"
      }
    }
  },

  as: {
    sangpaTitle: "ছাংপা (Sangpa)",
    talkToSangpa: "ছাংপাৰ সৈতে কথা পাতক",
    listenAgain: "পুনৰ শুনক",
    mascotGreeting: (name: string) => `নমস্কাৰ ${name}! মই আপোনাৰ মৰমৰ ছাংপা। আপুনি আজি খুবেই ভাল কৰিছে। আহক একেলগে খোজ পেলাওঁ।`,

    help: "সহায়",
    voice: "কণ্ঠস্বৰ",
    back: "ঘূৰি যাওক",
    done: "সম্পূৰ্ণ ✓",
    cancel: "বাতিল কৰক",
    yes: "হয়",
    no: "নহয়",

    nextActivity: "পৰৱৰ্তী কাম",
    allDay: "গোটেই দিন",
    focusView: "মূল দৃশ্য",
    happeningNow: "বৰ্তমানৰ সময়",
    finishedThis: "মই এইটো কৰিলোঁ ✓",
    rest15m: "১৫ মিনিট জিৰণি",
    needHelp: "সহায় লাগে",
    comingUpNext: "ইয়াৰ পিছৰ কাৰ্য্য",
    fullRoutine: "দিনটোৰ সম্পূৰ্ণ দিনলিপি",
    caregiverSynced: "কেয়াৰগিভাৰৰ সৈতে সংযোজিত",
    activeNow: "সক্ৰিয়",
    earlierToday: "আজিৰ আগৰ সময়",
    syncedWithTime: "সঠিক সময়ৰ সৈতে সংযোজিত",

    remindersTitle: "স্মাৰক আৰু ঔষধ সূচী",
    remindersSubtitle: "ঔষধ আৰু পানী খোৱাৰ সময়োপযোগী সোঁৱৰণি",
    voiceCallFallback: "কল ব্যাকআপ",
    remindIn15m: "১৫ মিনিট পিছত মনত পেলাব",
    dosageLabel: "পৰিমাণ",
    confirmMedTitle: "আপুনি ঔষধ খালে নে?",
    confirmMedDesc: "(নিশ্চিত কৰিলে পৰিয়ালে জানিব পাৰিব যে আপুনি সুস্থ আৰু সুৰক্ষিত।)",
    confirmMedYes: "হয়, মই খালোঁ ✓",
    confirmMedNo: "এতিয়াও নাই খোৱা",
    snoozedBadge: "পিছুওৱা হ’ল",

    memoriesTitle: "মৰমৰ স্মৃতি আৰু সোণালী মুহূৰ্ত",
    memoriesSubtitle: "আলোকচিত্ৰ, চিনাকি মাত আৰু অতীতৰ স্মৃতি",
    memoriesCount: (count: number) => `${count}টা স্মৃতি`,
    playMemory: "স্মৃতি চাওক",
    listenStory: "কণ্ঠস্বৰত কাহিনী শুনক",
    close: "বন্ধ কৰক",

    wellnessTitle: "শাৰীৰিক ব্যায়াম আৰু সুস্থতা",
    wellnessSubtitle: "পুষ্টিকৰ খাদ্য আৰু আৰামদায়ক বহা ব্যায়াম",
    mindDietTitle: "আজিৰ পুষ্টিকৰ খাদ্য পৰামৰ্শ",
    dailyMovementTitle: "দৈনন্দিন আসন ব্যায়াম",
    exerciseSubtitle: "হাত আৰু কান্ধৰ লঘু সঞ্চালন",
    startExercise: "ব্যায়াম আৰম্ভ কৰক",
    pauseExercise: "ৰখাওক",
    resumeExercise: "অব্যাহত ৰাখক",
    nextStep: "পৰৱৰ্তী খোজ",
    completedBadge: "ব্যায়াম সম্পন্ন ✓",
    caregiverNote: "ৰিয়াৰ পৰামৰ্শ: বিশুদ্ধ ঘিউ দি কোমলকৈ খিচিৰি বনাব।",
    dietDisclaimer: "মগজুৰ সুস্থতাৰ বাবে খাদ্য পৰামৰ্শ।",

    emergencyTitle: "জৰুৰীকালীন সাহায্য",
    emergencySubtitle: "পৰিয়াল আৰু চিকিৎসকৰ সৈতে তাৎক্ষণিক সংযোগ",
    activeGuard: "সুৰক্ষা সক্ৰিয়",
    currentLocationLabel: "বৰ্তমান স্থান:",
    currentLocationVal: "শোৱা কোঠা • তেজপুৰ (সুৰক্ষিত এলেকা)",
    callingInSecs: (name: string, secs: number) => `${name}লৈ ${secs} ছেকেণ্ডত ফোন কৰা হ'ব...`,
    cancelAccidentalCall: "ভুলবশতঃ টিপা হ’লে তলত বাতিল কৰক টিপক।",
    cancelCallBtn: "কল বাতিল কৰক (ভুলত টিপিলোঁ)",
    callActiveWith: (name: string) => `${name}ৰ সৈতে কথা চলিছে...`,
    callActiveDesc: "অডিঅ' লাইন সক্ৰিয়। আপোনাৰ স্থান জনোৱা হৈছে।",
    endCallBtn: "কল সমাপ্ত কৰক",
    callDaughterRiya: "জীয়াৰী ৰিয়াক ফোন কৰক",
    callRiyaDesc: "প্ৰধান যত্নকৰ্তা • ১-টাচত ফোন",
    callNowBtn: "এতিয়াই কল কৰক",
    callDoctor: "ডাঃ অনিতা বৰ্মা",
    callDoctorDesc: "স্নায়ু বিশেষজ্ঞ চিকিৎসক",
    callAmbulance: "জাতীয় এম্বুলেন্স ১০৮ / ১১২",
    callAmbulanceDesc: "২৪x৭ জৰুৰীকালীন সেৱা",

    activityTitles: {
      "Morning Sunshine & Deep Breathing": {
        title: "পুৱাৰ ৰ'দ আৰু গভীৰ উশাহ",
        desc: "খিৰিকীৰ কাষত বহি ৫ বাৰ গভীৰ উশাহ লওক।"
      },
      "Nutritious Breakfast": {
        title: "পুষ্টিকৰ পুৱাৰ আহাৰ",
        desc: "বাদাম আৰু মৌৰ সৈতে গৰম দলিয়া।"
      },
      "Morning Blood Pressure Tablet": {
        title: "পুৱাৰ ৰক্তচাপৰ ঔষধ",
        desc: "পানীৰ সৈতে ১টা টেবলেট খাওক।"
      },
      "Mid-Morning Hydration": {
        title: "পানী খাওক",
        desc: "১ গিলাচ বিশুদ্ধ পানী খাওক।"
      },
      "Gentle Hand & Shoulder Stretching": {
        title: "হাত আৰু কান্ধৰ লঘু ব্যায়াম",
        desc: "চকীত বহি হাত দুখন ওপৰলৈ তোলক।"
      },
      "Cognitive Sequence Recall Game": {
        title: "স্মৃতি আৰু ক্ৰম খেল",
        desc: "বস্তুৰ ক্ৰম মনত ৰখাৰ খেল।"
      },
      "MIND-Diet Lunch (Khichdi & Spinach)": {
        title: "দুপৰীয়াৰ আহাৰ (খিচিৰি আৰু পালেং)",
        desc: "আখৰোট আৰু পালেংযুক্ত মুগ দাইলৰ খিচিৰি।"
      },
      "Rest & Afternoon Siesta": {
        title: "দুপৰীয়াৰ বিশ্ৰাম",
        desc: "বাঁহীৰ সুৰ শুনি বিছনাত জিৰণি লওক।"
      },
      "Afternoon Herbal Chamomile Tea": {
        title: "অপৰাহ্ণৰ ভেষজ চাহ",
        desc: "বাৰাণ্ডাত বহি গৰম চাহ উপভোগ কৰক।"
      },
      "Evening Balcony Walk with Riya": {
        title: "ৰিয়াৰ সৈতে বাৰাণ্ডাত খোজকঢ়া",
        desc: "১৫ মিনিট শান্তভাৱে খোজ কাঢ়ক।"
      },
      "Light Dinner & Family Conversation": {
        title: "ৰাতিৰ লঘু আহাৰ আৰু কথা-বতৰা",
        desc: "গৰম ৰুটী আৰু পৰিয়ালৰ সৈতে সুখৰ সময়।"
      },
      "Night Medicine with Warm Turmeric Milk": {
        title: "হালধি গাখীৰ আৰু ৰাতিৰ ঔষধ",
        desc: "গৰম গাখীৰৰ সৈতে ৰাতিৰ ঔষধ খাওক।"
      },
      "Bedtime Gratitude & Calming Music": {
        title: "নিশাৰ শান্তি আৰু সুমধুৰ সংগীত",
        desc: "আৰামেৰে শুই পৰক।"
      },
      "Morning Blood Pressure Medicine": {
        title: "পুৱাৰ ৰক্তচাপৰ ঔষধ",
        desc: "নাস্তাৰ পিছত কুহুমীয়া পানীৰ সৈতে টেবলেট লওক।"
      },
      "Drink Pure Fresh Water": {
        title: "বিশুদ্ধ পানী খাওক",
        desc: "আৰামেৰে বহি এগিলাচ পানী খাওক।"
      },
      "Post-Lunch Memory Vitamin B-Complex": {
        title: "দুপৰীয়াৰ ভিটামিন ঔষধ",
        desc: "আহাৰ খোৱাৰ ১৫ মিনিট পিছত লওক।"
      },
      "Night Medicine with Warm Milk": {
        title: "ৰাতিৰ ঔষধ আৰু গাখীৰ",
        desc: "শোৱাৰ আগতে গাখীৰৰ সৈতে ঔষধ খাওক।"
      }
    }
  },

  bn: {
    sangpaTitle: "সাংপা (Sangpa)",
    talkToSangpa: "সাংপার সাথে কথা বলুন",
    listenAgain: "পুনরায় শুনুন",
    mascotGreeting: (name: string) => `নমস্কার ${name}! আমি আপনার প্রিয় সাথী সাংপা। আপনি আজ খুব ভালো আছেন। আসুন একসাথে এক পা এগিয়ে যাই।`,

    help: "সাহায্য",
    voice: "কণ্ঠস্বর",
    back: "পেছনে যান",
    done: "সম্পন্ন ✓",
    cancel: "বাতিল",
    yes: "হ্যাঁ",
    no: "না",

    nextActivity: "পরবর্তী কাজ",
    allDay: "সারাদিন",
    focusView: "প্রধান দৃশ্য",
    happeningNow: "এখনকার সময়",
    finishedThis: "আমি এটি সম্পন্ন করেছি ✓",
    rest15m: "১৫ মিনিট বিশ্রাম",
    needHelp: "সাহায্য চাই",
    comingUpNext: "এরপরের কাজ",
    fullRoutine: "সারাদিনের রুটিন",
    caregiverSynced: "কেয়ারগিভারের সাথে যুক্ত",
    activeNow: "সক্রিয়",
    earlierToday: "আগের সময়",
    syncedWithTime: "সঠিক সময়ের সাথে যুক্ত",

    remindersTitle: "ওষুধ ও অনুস্মারক",
    remindersSubtitle: "ওষুধ ও জল পানের সময়মতো বার্তা",
    voiceCallFallback: "কল ব্যাকআপ",
    remindIn15m: "১৫ মিনিট পর মনে করিয়ে দাও",
    dosageLabel: "মাত্রা",
    confirmMedTitle: "আপনি কি ওষুধটি খেয়েছেন?",
    confirmMedDesc: "(নিশ্চিত করলে পরিবার জানতে পারবে আপনি সুস্থ ও নিরাপদ আছেন।)",
    confirmMedYes: "হ্যাঁ, আমি খেয়েছি ✓",
    confirmMedNo: "এখনও খাইনি",
    snoozedBadge: "স্থগিত",

    memoriesTitle: "পারিবারিক স্মৃতিমালা",
    memoriesSubtitle: "ছবি, চেনা কণ্ঠ ও মধুর স্মৃতি",
    memoriesCount: (count: number) => `${count}টি স্মৃতি`,
    playMemory: "স্মৃতি দেখুন",
    listenStory: "গল্প শুনুন",
    close: "বন্ধ করুন",

    wellnessTitle: "শারীরিক ব্যায়াম ও স্বাস্থ্য",
    wellnessSubtitle: "পুষ্টিকর খাবার ও চেয়ারে বসে সহজ ব্যায়াম",
    mindDietTitle: "আজকের পুষ্টিকর খাবার পরামর্শ",
    dailyMovementTitle: "প্রতিদিনের চেয়ার ব্যায়াম",
    exerciseSubtitle: "হাত ও কাঁধের সহজ নড়াচড়া",
    startExercise: "ব্যায়াম শুরু করুন",
    pauseExercise: "থামুন",
    resumeExercise: "চালিয়ে যান",
    nextStep: "পরবর্তী ধাপ",
    completedBadge: "ব্যায়াম সম্পন্ন ✓",
    caregiverNote: "রিয়ার পরামর্শ: খাঁটি গাওয়া ঘি দিয়ে খিচুড়ি রান্না করুন।",
    dietDisclaimer: "মস্তিষ্কের যত্নে পুষ্টি পরামর্শ।",

    emergencyTitle: "জরুরি সহায়তা",
    emergencySubtitle: "পরিবার ও ডাক্তারের সাথে সরাসরি যোগাযোগ",
    activeGuard: "নিরাপত্তা সক্রিয়",
    currentLocationLabel: "বর্তমান অবস্থান:",
    currentLocationVal: "শোবার ঘর • তেজপুর (নিরাপদ অঞ্চল)",
    callingInSecs: (name: string, secs: number) => `${name}-কে ${secs} সেকেন্ডে কল করা হচ্ছে...`,
    cancelAccidentalCall: "ভুলবশত চাপ লাগলে বাতিল করুন।",
    cancelCallBtn: "কল বাতিল করুন (ভুল করে চেপেছি)",
    callActiveWith: (name: string) => `${name}-এর সাথে কথা হচ্ছে...`,
    callActiveDesc: "অডিও লাইন চালু আছে। আপনার অবস্থান জানানো হয়েছে।",
    endCallBtn: "কল শেষ করুন",
    callDaughterRiya: "মেয়ে রিয়াকে কল করুন",
    callRiyaDesc: "প্রধান অভিভাবক • ১-চাপে কল",
    callNowBtn: "এখনই কল করুন",
    callDoctor: "ডাঃ অনিতা বর্মা",
    callDoctorDesc: "স্নায়ুরোগ বিশেষজ্ঞ",
    callAmbulance: "জাতীয় অ্যাম্বুলেন্স ১০৮ / ১১২",
    callAmbulanceDesc: "২৪x৭ জরুরি চিকিৎসা সেবা",

    activityTitles: {
      "Morning Sunshine & Deep Breathing": {
        title: "সকালের রোদ ও গভীর শ্বাস",
        desc: "জানালার কাছে বসে ৫ বার গভীর শ্বাস নিন।"
      },
      "Nutritious Breakfast": {
        title: "পুষ্টিকর প্রাতরাশ",
        desc: "বাদাম ও মধুর সাথে গরম ওটস।"
      },
      "Morning Blood Pressure Tablet": {
        title: "সকালের রক্তচাপের ওষুধ",
        desc: "জলের সাথে ১টি ট্যাবলেট খান।"
      },
      "Mid-Morning Hydration": {
        title: "পরিশুদ্ধ জল পান করুন",
        desc: "১ গ্লাস তাজা জল পান করুন।"
      },
      "Gentle Hand & Shoulder Stretching": {
        title: "হাত ও কাঁধের হালকা ব্যায়াম",
        desc: "চেয়ারে বসে হাত উপরে তুলুন।"
      },
      "Cognitive Sequence Recall Game": {
        title: "স্মৃতি ও ক্রম মেলানো খেলা",
        desc: "পরিচিত জিনিসের ক্রম মনে রাখুন।"
      },
      "MIND-Diet Lunch (Khichdi & Spinach)": {
        title: "দুপুরের পুষ্টিকর খাবার (খিচুড়ি ও পালং)",
        desc: "আখরোট ও পালং শাকযুক্ত মুগ ডালের খিচুড়ি।"
      },
      "Rest & Afternoon Siesta": {
        title: "দুপুরের বিশ্রাম",
        desc: "শান্ত বাঁশির সুর শুনতে শুনতে বিশ্রাম নিন।"
      },
      "Afternoon Herbal Chamomile Tea": {
        title: "বিকেলের ভেষজ চা",
        desc: "বারান্দায় বসে এক কাপ গরম চা উপভোগ করুন।"
      },
      "Evening Balcony Walk with Riya": {
        title: "রিয়ার সাথে বারান্দায় হাঁটা",
        desc: "১৫ মিনিট আরামদায়ক গতিতে হাঁটুন।"
      },
      "Light Dinner & Family Conversation": {
        title: "রাতের হালকা খাবার ও পরিবারের সান্নিধ্য",
        desc: "রুটি, সবজি ও পরিবারের সাথে মিষ্টি সময়।"
      },
      "Night Medicine with Warm Turmeric Milk": {
        title: "হলুদ দুধ ও রাতের ওষুধ",
        desc: "ঘুমোনোর আগে গরম দুধের সাথে ওষুধ নিন।"
      },
      "Bedtime Gratitude & Calming Music": {
        title: "শান্তিপূর্ণ ঘুম ও গান",
        desc: "আরামে শুয়ে পড়ুন।"
      },
      "Morning Blood Pressure Medicine": {
        title: "সকালের রক্তচাপের ওষুধ",
        desc: "নাস্তার পর হালকা গরম জলের সাথে নিন।"
      },
      "Drink Pure Fresh Water": {
        title: "তাজা জল পান করুন",
        desc: "আরামে বসে এক গ্লাস জল খান।"
      },
      "Post-Lunch Memory Vitamin B-Complex": {
        title: "দুপুরের ভিটামিন ওষুধ",
        desc: "খাবারের ১৫ মিনিট পর খান।"
      },
      "Night Medicine with Warm Milk": {
        title: "রাতের ওষুধ ও গরম দুধ",
        desc: "ঘুমানোর আগে দুধের সাথে ওষুধ খান।"
      }
    }
  },

  mni: {
    sangpaTitle: "সাংপা (Sangpa)",
    talkToSangpa: "সাংপাগা ৱারী শাগে",
    listenAgain: "অমুক হন্না তাবীয়ু",
    mascotGreeting: (name: string) => `খুরুমজরি ${name}! ঐহাক অদোমগী নুংশিরবী সাংপানী। অদোম ঙসি য়াম্না ফনা লৈরি। ঐখোয় পুন্না চৎমিন্নসি।`,

    help: "মতেং",
    voice: "খোনথোক",
    back: "হন্দোকপা",
    done: "লোইরে ✓",
    cancel: "তোকপা",
    yes: "হোই",
    no: "নত্তে",

    nextActivity: "মথংগী থবক",
    allDay: "নুমিৎ চুপ্পা",
    focusView: "মরুওইবা মফম",
    happeningNow: "হৌজিক্কী মতম",
    finishedThis: "ঐহাক লোইরে ✓",
    rest15m: "মিনিট ১৫ পোথাবা",
    needHelp: "মতেং মথৌ তাই",
    comingUpNext: "মথংদা লাক্কদবা",
    fullRoutine: "নুমিৎ চুপ্পগী থবক",
    caregiverSynced: "কেয়ারগিভারগা শম্নবা",
    activeNow: "চৎথরিবা",
    earlierToday: "মমাংগী মতম",
    syncedWithTime: "অশেংবা মতমগা শম্নবা",

    remindersTitle: "হিদাক অমসুং নিংশিংহনবা",
    remindersSubtitle: "হিদাক অমসুং ঈশিং থক্নবা মতমগী পাউদম",
    voiceCallFallback: "কোল ব্যাকঅপ",
    remindIn15m: "মিনিট ১৫ তুংদা নিংশিংহন্নু",
    dosageLabel: "চাং",
    confirmMedTitle: "অদোম হিদাক চাবা লোইরব্ৰা?",
    confirmMedDesc: "(চাক্রে হায়না য়ারবদি ইমুংগী মীশিংনা অদোম ফনা লৈরে হায়বা খঙগনি।)",
    confirmMedYes: "হোই, চারে ✓",
    confirmMedNo: "হৌজিকসু চাদ্রি",
    snoozedBadge: "মতংদা",

    memoriesTitle: "ইমুংগী নীংশিংবাশিং",
    memoriesSubtitle: "ফোতো, চিন্নবা খোঞ্জেল অমসুং অরিবা ৱারী",
    memoriesCount: (count: number) => `নীংশিংবা ${count}`,
    playMemory: "নীংশিংবা য়েংবা",
    listenStory: "ৱারী তাবীয়ু",
    close: "থিংশিনবা",

    wellnessTitle: "হকচাংগী এক্সরসাইজ",
    wellnessSubtitle: "হকশেলগী চিঞ্জাক অমসুং ফমদুনা এক্সরসাইজ",
    mindDietTitle: "ঙসিগী অফবা চিঞ্জাক",
    dailyMovementTitle: "নুমিৎখুদিংগী ফমদুনা এক্সরসাইজ",
    exerciseSubtitle: "খুৎ অমসুং লেনবোক লিকথবা",
    startExercise: "হৌদোকপা",
    pauseExercise: "লেপপা",
    resumeExercise: "মখা চত্থবা",
    nextStep: "মথংগী তাঙ্কক",
    completedBadge: "লোইরে ✓",
    caregiverNote: "রিয়াগী পাউতাক: খিচড়িদু য়াম্না লুম্না থোংবীয়ু।",
    dietDisclaimer: "ৱাখল ফহন্নবা চিঞ্জাক্কী পাউতাক।",

    emergencyTitle: "মরুওইবা তেংবাং",
    emergencySubtitle: "ইমুং অমসুং ডাক্তরগা অথুবা শম্নবা",
    activeGuard: "ঙাক-শেন লৈরি",
    currentLocationLabel: "হৌজিক লৈরিবা মফম:",
    currentLocationVal: "কা • তেজপুর (সুৰক্ষিত মফম)",
    callingInSecs: (name: string, secs: number) => `${name}দা সেকেন্দ ${secs}দা কোল তৌগনি...`,
    cancelAccidentalCall: "লান্না নম্বীরবদি মখাদা তোকউ নম্বীয়ু।",
    cancelCallBtn: "কোল তোকপা (লান্না নম্বীখ্রে)",
    callActiveWith: (name: string) => `${name}গা ৱারী শারি...`,
    callActiveDesc: "অডিও কোল চৎথরি। অদোমগী মফম পাউদম্লে।",
    endCallBtn: "কোল লোইশিনবা",
    callDaughterRiya: "ইচা নুপী রিয়াদা কোল তৌবীয়ু",
    callRiyaDesc: "ইমুংগী য়েংশিনবীরিবা • ১-তপ কোল",
    callNowBtn: "হৌজিক কোল তৌ",
    callDoctor: "ডাঃ অনিতা বর্মা",
    callDoctorDesc: "মকোক্কী দোক্তর",
    callAmbulance: "নেস্নেল এম্বুলেন্স ১০৮ / ১১২",
    callAmbulanceDesc: "২৪x৭ ইমার্জেন্সী সর্ভিস",

    activityTitles: {
      "Morning Sunshine & Deep Breathing": {
        title: "অয়ুক্কী নুমিৎ অমসুং শ্বাস লৌবা",
        desc: "থোঙনাও মনাক্তা ফমদুনা অরুবা শ্বাস ৫ লক লৌজৌ।"
      },
      "Nutritious Breakfast": {
        title: "অয়ুক্কী অফবা চিঞ্জাক",
        desc: "বাদাম অমসুং খোইহিগী দলিয়া।"
      },
      "Morning Blood Pressure Tablet": {
        title: "অয়ুক্কী বিপি হিদাক",
        desc: "ঈশিংগা লোয়ননা হিদাক ১ চাবীয়ু।"
      },
      "Mid-Morning Hydration": {
        title: "ঈশিং থকপীবগী মতম",
        desc: "ঈশিং গ্লাস ১ চপ চানা থকপীয়ু।"
      },
      "Gentle Hand & Shoulder Stretching": {
        title: "খুৎ অমসুং লেনবোক লিকথবা",
        desc: "চৌকিদা ফমদুনা খুৎ ৱাংনা থাংগৎলু।"
      },
      "Cognitive Sequence Recall Game": {
        title: "নীংশিংবগী শান্নবা",
        desc: "পোৎলমশিংগী মথং-মনাও নীংশিংবগী শান্নবা।"
      },
      "MIND-Diet Lunch (Khichdi & Spinach)": {
        title: "নুংথিলগী খিচড়ি অমসুং পালক",
        desc: "অখরোত অমসুং পালক য়াওবা মুগ দাইল খিচড়ি।"
      },
      "Rest & Afternoon Siesta": {
        title: "নুংথিল পোথাবা",
        desc: "বাসুৰিগী ঈশৈ তাদুনা বিছানাদা পোথাবীয়ু।"
      },
      "Afternoon Herbal Chamomile Tea": {
        title: "নুমিৎ য়াংখিবা চিঞ্জাক চা",
        desc: "বারান্দাদা ফমদুনা চা থকপীয়ু।"
      },
      "Evening Balcony Walk with Riya": {
        title: "রিয়াগা লোয়ননা খোঙ চৎপা",
        desc: "মিনিট ১৫ বারান্দাদা খোঙ চৎপীয়ু।"
      },
      "Light Dinner & Family Conversation": {
        title: "নুমিদাংগী অফবা চিঞ্জাক",
        desc: "রোতি অমসুং ইমুংগা লোয়ননা হরাওবা।"
      },
      "Night Medicine with Warm Turmeric Milk": {
        title: "হৈরু অমসুং অহিংগী হিদাক",
        desc: "হৈরু য়াওবা সংগোমগা লোয়ননা হিদাক চাবীয়ু।"
      },
      "Bedtime Gratitude & Calming Music": {
        title: "অহিংগী শান্তিগী ঈশৈ",
        desc: "ফনা তুম্মরো।"
      },
      "Morning Blood Pressure Medicine": {
        title: "অয়ুক্কী বিপি হিদাক",
        desc: "নাস্তা চাবা লোইবা মতুংদা চাবীয়ু।"
      },
      "Drink Pure Fresh Water": {
        title: "ঈশিং থকপীয়ু",
        desc: "অশেংবা ঈশিং গ্লাস অমা থকপীয়ু।"
      },
      "Post-Lunch Memory Vitamin B-Complex": {
        title: "চা-খাবা লোইবা তুংগী হিদাক",
        desc: "চা-খাবা লোইবা মিনিট ১৫গী তুংদা চাবীয়ু।"
      },
      "Night Medicine with Warm Milk": {
        title: "অহিংগী হিদাক অমসুং সংগোম",
        desc: "তুমদ্রিঙৈ মমাংদা সংগোমগা চাবীয়ু।"
      }
    }
  },

  nag: {
    sangpaTitle: "Sangpa AI",
    talkToSangpa: "Sangpa logote kotha koribi",
    listenAgain: "Aru ekbar hunibi",
    mascotGreeting: (name: string) => `Namaste ${name}! Moi apuni laga sathi Sangpa asey. Apuni aji bhal korise. Ahibi ekta step loi lohi.`,

    help: "Help",
    voice: "Awaaz",
    back: "Piche jabi",
    done: "Hoise ✓",
    cancel: "Cancel",
    yes: "Hoi",
    no: "Nohoi",

    nextActivity: "Next Activity",
    allDay: "Pura Din",
    focusView: "Main View",
    happeningNow: "Etiya Laga Time",
    finishedThis: "Moi kothom korise ✓",
    rest15m: "15 min aaram",
    needHelp: "Help lage",
    comingUpNext: "Pichite ahibole",
    fullRoutine: "Din laga Routine",
    caregiverSynced: "Caregiver logote milise",
    activeNow: "Active asey",
    earlierToday: "Aji aage laga",
    syncedWithTime: "Real time logote synced",

    remindersTitle: "Medicine & Reminders",
    remindersSubtitle: "Time te dawai aru paani khabole yaad korabi",
    voiceCallFallback: "Call Fallback",
    remindIn15m: "15 mins pichite yaad korabi",
    dosageLabel: "Dosage",
    confirmMedTitle: "Apuni medicine khana loise?",
    confirmMedDesc: "(Confirm korile ghor manu bhabibo apuni bhal asey.)",
    confirmMedYes: "Hoi, moi khana loise ✓",
    confirmMedNo: "Khabole baki asey",
    snoozedBadge: "Snoozed",

    memoriesTitle: "Family Memories",
    memoriesSubtitle: "Photos, awaz aru purana dino",
    memoriesCount: (count: number) => `${count} Memories`,
    playMemory: "Memory sabo",
    listenStory: "Kotha hunibo",
    close: "Bondo koribi",

    wellnessTitle: "Physical Exercise & Health",
    wellnessSubtitle: "Bhal khana aru chair te gentle exercise",
    mindDietTitle: "Aji laga MIND-Diet Suggestion",
    dailyMovementTitle: "Chair Movement Exercise",
    exerciseSubtitle: "Haat aru shoulder aaram te hilabi",
    startExercise: "Exercise Shuru Kori",
    pauseExercise: "Pause",
    resumeExercise: "Cholu Kori",
    nextStep: "Next Step",
    completedBadge: "Exercise Hoise ✓",
    caregiverNote: "Riya koise: Desi ghee logote khichdi garam te khabi.",
    dietDisclaimer: "Brain health nimite suggestion asey.",

    emergencyTitle: "Emergency Assistance",
    emergencySubtitle: "Family aru doctor logote jaldi call koribi",
    activeGuard: "Guard Active",
    currentLocationLabel: "Current Location:",
    currentLocationVal: "Bedroom • Tezpur (Safe Zone)",
    callingInSecs: (name: string, secs: number) => `${name} ke ${secs}s te call jabo...`,
    cancelAccidentalCall: "Bhul te click hoise koile cancel dababi.",
    cancelCallBtn: "Call Cancel (Bhul te hoise)",
    callActiveWith: (name: string) => `${name} logote kotha hoise...`,
    callActiveDesc: "Audio line active asey. Location share hoise.",
    endCallBtn: "Call End Kori",
    callDaughterRiya: "Daughter Riya ke call kori",
    callRiyaDesc: "Main caregiver • 1-tap call",
    callNowBtn: "CALL NOW",
    callDoctor: "Dr. Anita Verma",
    callDoctorDesc: "Doctor & Geriatrician",
    callAmbulance: "National Ambulance 108 / 112",
    callAmbulanceDesc: "24x7 Emergency Help",

    activityTitles: {
      "Morning Sunshine & Deep Breathing": {
        title: "Poa Sunshine aru Deep Breathing",
        desc: "Khirki usorte bohi 5 bar deep breath lobi."
      },
      "Nutritious Breakfast": {
        title: "Bhal Breakfast",
        desc: "Oats porridge aru badam khabi."
      },
      "Morning Blood Pressure Tablet": {
        title: "Poa BP Tablet",
        desc: "Paani logote tablet 1 khabi."
      },
      "Mid-Morning Hydration": {
        title: "Paani khabi",
        desc: "1 glass taaza paani piye lobi."
      },
      "Gentle Hand & Shoulder Stretching": {
        title: "Haat aru Shoulder hilabi",
        desc: "Chair te bohi 5 bar stretching koribi."
      },
      "Cognitive Sequence Recall Game": {
        title: "Sequence Recall Khel",
        desc: "Symbols laga sequence yaad koribi."
      },
      "MIND-Diet Lunch (Khichdi & Spinach)": {
        title: "Lunch (Khichdi & Paleng)",
        desc: "Moong dal khichdi walnuts logote."
      },
      "Rest & Afternoon Siesta": {
        title: "Afternoon Aaram",
        desc: "Flute gaan huni aaram koribi."
      },
      "Afternoon Herbal Chamomile Tea": {
        title: "Afternoon Tea",
        desc: "Garam cha piye balcony te aaram koribi."
      },
      "Evening Balcony Walk with Riya": {
        title: "Riya logote Balcony te Walk",
        desc: "15 min aaram te walk koribi."
      },
      "Light Dinner & Family Conversation": {
        title: "Dinner aru Family Kotha",
        desc: "Garam roti aru Aarav logote kotha."
      },
      "Night Medicine with Warm Turmeric Milk": {
        title: "Haldi Dudh aru Raat Medicine",
        desc: "Garam dudh logote tablet lobi."
      },
      "Bedtime Gratitude & Calming Music": {
        title: "Shanti Nind aru Gaan",
        desc: "Aaram te hobi."
      },
      "Morning Blood Pressure Medicine": {
        title: "Poa BP Medicine",
        desc: "Breakfast pichite paani logote khabi."
      },
      "Drink Pure Fresh Water": {
        title: "Taaza Paani Khabi",
        desc: "Aaram te bohi 1 glass paani pibi."
      },
      "Post-Lunch Memory Vitamin B-Complex": {
        title: "Lunch Pichite Vitamin",
        desc: "Khana khua 15 min pichite khabi."
      },
      "Night Medicine with Warm Milk": {
        title: "Raat Medicine aru Garam Dudh",
        desc: "Hobole aage dudh logote khabi."
      }
    }
  },

  es: {
    sangpaTitle: "Sangpa AI",
    talkToSangpa: "Hablar con Sangpa",
    listenAgain: "Escuchar de nuevo",
    mascotGreeting: (name: string) => `¡Hola ${name}! Soy Sangpa, tu compañera amorosa. Lo estás haciendo muy bien hoy. Demos un paso juntos.`,

    help: "Ayuda",
    voice: "Voz",
    back: "Atrás",
    done: "Listo ✓",
    cancel: "Cancelar",
    yes: "Sí",
    no: "No",

    nextActivity: "Próxima actividad",
    allDay: "Todo el día",
    focusView: "Vista principal",
    happeningNow: "Sucediendo ahora",
    finishedThis: "Terminé esto ✓",
    rest15m: "Descansar 15m",
    needHelp: "Necesito ayuda",
    comingUpNext: "A continuación",
    fullRoutine: "Rutina completa del día",
    caregiverSynced: "Sincronizado con cuidador",
    activeNow: "Activo ahora",
    earlierToday: "Más temprano hoy",
    syncedWithTime: "Sincronizado con la hora real",

    remindersTitle: "Medicamentos y Recordatorios",
    remindersSubtitle: "Recordatorios claros y suaves para medicina e hidratación",
    voiceCallFallback: "Respaldo de llamada",
    remindIn15m: "Recordar en 15 mins",
    dosageLabel: "Dosis",
    confirmMedTitle: "¿Tomó su medicamento?",
    confirmMedDesc: "(Confirmar ayuda a su familia a saber que está segura y saludable hoy.)",
    confirmMedYes: "Sí, lo tomé ✓",
    confirmMedNo: "Aún no",
    snoozedBadge: "Pospuesto",

    memoriesTitle: "Recuerdos Familiares",
    memoriesSubtitle: "Fotografías, voces queridas y raíces ancestrales",
    memoriesCount: (count: number) => `${count} Recuerdos`,
    playMemory: "Ver recuerdo",
    listenStory: "Escuchar relato en voz",
    close: "Cerrar",

    wellnessTitle: "Ejercicio Físico y Bienestar",
    wellnessSubtitle: "Comida nutritiva y suaves ejercicios sentada",
    mindDietTitle: "Sugerencia de dieta MIND de hoy",
    dailyMovementTitle: "Movimiento diario en silla",
    exerciseSubtitle: "Estiramientos suaves de brazos y hombros",
    startExercise: "Comenzar ejercicio",
    pauseExercise: "Pausar",
    resumeExercise: "Reanudar",
    nextStep: "Siguiente paso",
    completedBadge: "Ejercicio completado ✓",
    caregiverNote: "Nota de Riya: Cocine el khichdi suave con ghee puro.",
    dietDisclaimer: "Sugerencia nutricional para el bienestar cerebral.",

    emergencyTitle: "Asistencia de Emergencia",
    emergencySubtitle: "Ayuda inmediata de familiares y equipo médico",
    activeGuard: "Protección activa",
    currentLocationLabel: "Ubicación actual:",
    currentLocationVal: "Dormitorio de casa • Tezpur (Zona segura)",
    callingInSecs: (name: string, secs: number) => `Llamando a ${name} en ${secs}s...`,
    cancelAccidentalCall: "Toque cancelar abajo si fue presionado por error.",
    cancelCallBtn: "Cancelar llamada (Presionado por error)",
    callActiveWith: (name: string) => `Hablando con ${name}...`,
    callActiveDesc: "Línea de audio activa. Su ubicación fue compartida.",
    endCallBtn: "Finalizar llamada",
    callDaughterRiya: "Llamar a mi hija Riya",
    callRiyaDesc: "Cuidadora principal • 1-toque conexión rápida",
    callNowBtn: "LLAMAR AHORA",
    callDoctor: "Dra. Anita Verma",
    callDoctorDesc: "Neuróloga y geriatra",
    callAmbulance: "Ambulancia Nacional 108 / 112",
    callAmbulanceDesc: "24x7 Asistencia médica de emergencia",

    activityTitles: {
      "Morning Sunshine & Deep Breathing": {
        title: "Sol matutino y respiración profunda",
        desc: "Siéntese cerca de la ventana y tome 5 respiraciones lentas."
      },
      "Nutritious Breakfast": {
        title: "Desayuno nutritivo",
        desc: "Avena caliente con almendras picadas y miel."
      },
      "Morning Blood Pressure Tablet": {
        title: "Medicamento matutino para la presión",
        desc: "Tome 1 tableta de amlodipino con agua."
      },
      "Mid-Morning Hydration": {
        title: "Beber agua fresca",
        desc: "Beba 1 vaso de agua fresca."
      },
      "Gentle Hand & Shoulder Stretching": {
        title: "Estiramiento suave de manos y hombros",
        desc: "Siga 5 suaves estiramientos de brazos sentada."
      },
      "Cognitive Sequence Recall Game": {
        title: "Juego de memoria de secuencias",
        desc: "Recuerde una secuencia de símbolos tradicionales."
      },
      "MIND-Diet Lunch (Khichdi & Spinach)": {
        title: "Almuerzo MIND (Khichdi y espinacas)",
        desc: "Lentejas amarillas con espinacas y nueces."
      },
      "Rest & Afternoon Siesta": {
        title: "Descanso y siesta de la tarde",
        desc: "Descanse en la cama con música suave de flauta."
      },
      "Afternoon Herbal Chamomile Tea": {
        title: "Té de manzanilla de la tarde",
        desc: "Disfrute de una taza caliente en el balcón."
      },
      "Evening Balcony Walk with Riya": {
        title: "Paseo en el balcón con Riya",
        desc: "Use pantuflas cómodas y camine 15 minutos."
      },
      "Light Dinner & Family Conversation": {
        title: "Cena ligera y charla familiar",
        desc: "Comida caliente y agradable conversación con la familia."
      },
      "Night Medicine with Warm Turmeric Milk": {
        title: "Medicina nocturna con leche tibia",
        desc: "Tome su medicina nocturna con leche tibia."
      },
      "Bedtime Gratitude & Calming Music": {
        title: "Descanso nocturno y música relajante",
        desc: "Acuéstese cómodamente y descanse."
      },
      "Morning Blood Pressure Medicine": {
        title: "Medicina matutina para la presión",
        desc: "Tome con medio vaso de agua tibia después del desayuno."
      },
      "Drink Pure Fresh Water": {
        title: "Beber agua fresca pura",
        desc: "Beba lentamente un vaso lleno de agua."
      },
      "Post-Lunch Memory Vitamin B-Complex": {
        title: "Vitamina B-Complex post-almuerzo",
        desc: "Tome 15 minutos después del almuerzo."
      },
      "Night Medicine with Warm Milk": {
        title: "Medicina nocturna con leche tibia",
        desc: "Tome antes de acostarse a dormir."
      }
    }
  },

  en: {
    sangpaTitle: "SANGPA AI",
    talkToSangpa: "Talk to Sangpa",
    listenAgain: "Listen again",
    mascotGreeting: (name: string) => `Namaste ${name}! I am Sangpa, your loving AI companion. You are doing well today. Let's take one small step together.`,

    help: "Help Me",
    voice: "Voice",
    back: "Back",
    done: "Done ✓",
    cancel: "Cancel",
    yes: "Yes",
    no: "No",

    nextActivity: "Next Activity",
    allDay: "All Day",
    focusView: "Focus View",
    happeningNow: "Happening Now",
    finishedThis: "I Finished This",
    rest15m: "Rest 15m",
    needHelp: "Need Help",
    comingUpNext: "COMING UP NEXT",
    fullRoutine: "Full Daily Routine",
    caregiverSynced: "Caregiver synced",
    activeNow: "Active Now",
    earlierToday: "Earlier Today",
    syncedWithTime: "Synced with Real Time",

    remindersTitle: "Reminders & Routine",
    remindersSubtitle: "Clear, gentle reminders for medicines and hydration",
    voiceCallFallback: "Voice Call Fallback",
    remindIn15m: "Remind in 15 mins",
    dosageLabel: "Dosage",
    confirmMedTitle: "Did you take your medicine?",
    confirmMedDesc: "(Confirming helps your family know you are safe and healthy today.)",
    confirmMedYes: "Yes, I took it",
    confirmMedNo: "Not yet",
    snoozedBadge: "Snoozed",

    memoriesTitle: "Family Memories & Cherished Moments",
    memoriesSubtitle: "Photographs, familiar voices & ancestral roots",
    memoriesCount: (count: number) => `${count} Memories`,
    playMemory: "Play Memory",
    listenStory: "Listen to Voice Story",
    close: "Close",

    wellnessTitle: "Physical Exercise & Wellness",
    wellnessSubtitle: "Nourishing food & joyful, seated movements",
    mindDietTitle: "Today's MIND-Diet Suggestion",
    dailyMovementTitle: "Daily Seated Movement",
    exerciseSubtitle: "Gentle Chair Stretching & Rhythm Claps",
    startExercise: "Start Seated Movement",
    pauseExercise: "Pause",
    resumeExercise: "Resume",
    nextStep: "Next Movement Step",
    completedBadge: "Movement Completed ✓",
    caregiverNote: "Caregiver Preparation Note (from Riya): Ensure khichdi is cooked soft with desi ghee.",
    dietDisclaimer: "General brain-wellness dietary suggestion based on MIND-diet research.",

    emergencyTitle: "Emergency Assistance",
    emergencySubtitle: "Immediate help from loved ones and medical team",
    activeGuard: "Active Guard",
    currentLocationLabel: "Current Location:",
    currentLocationVal: "Home Bedroom • Tezpur, Assam (Safe Zone)",
    callingInSecs: (name: string, secs: number) => `Calling ${name} in ${secs}s...`,
    cancelAccidentalCall: "Tap Cancel below if pressed by accident. No emergency will be triggered.",
    cancelCallBtn: "Cancel Call (Pressed by mistake)",
    callActiveWith: (name: string) => `Speaking with ${name}...`,
    callActiveDesc: "Emergency audio line is active. Your location and status were shared.",
    endCallBtn: "End Emergency Call",
    callDaughterRiya: "Call Daughter Riya",
    callRiyaDesc: "Primary family caregiver • 1-tap fast connect",
    callNowBtn: "CALL NOW",
    callDoctor: "Dr. Anita Verma",
    callDoctorDesc: "Neurologist & Geriatrician",
    callAmbulance: "National Emergency Ambulance 108 / 112",
    callAmbulanceDesc: "24x7 Immediate emergency medical response",

    activityTitles: {}
  }
};

export function getLocalizedActivity(title: string, defaultDesc: string, lang: LanguageCode) {
  const dict = PATIENT_I18N[lang] || PATIENT_I18N.en;
  const match = dict.activityTitles?.[title];
  if (match) {
    return { title: match.title, desc: match.desc };
  }
  return { title, desc: defaultDesc };
}

export const APP_VOICE_RESPONSES = {
  reminderCompleted: {
    hi: "शाबाश! यह काम पूरा हो गया। आप अपना बहुत अच्छा ध्यान रख रही हैं।",
    as: "বৰ ধুনীয়া! এইটো কাম সম্পূৰ্ণ হ'ল। আপুনি নিজৰ খুব ভাল যত্ন লৈছে।",
    mni: "য়াম্না ফরে! থবক অসি লোইরে। অদোম মশাবু য়াম্না নিংথিনা য়েংশিনজরি।",
    bn: "খুব ভালো! এই কাজটি সম্পূর্ণ হয়েছে। আপনি নিজের খুব সুন্দর যত্ন নিচ্ছেন।",
    nag: "Bhal lagise! Eitu kaam hoise. Apuni nijor bhal pora dhyan rakhise.",
    es: "¡Maravilloso! Ese recordatorio está completo. Se está cuidando muy bien.",
    en: "Wonderful! That reminder is complete. You are taking great care of yourself."
  },
  reminderSnoozed: {
    hi: "कोई बात नहीं। मैं 15 मिनट बाद आपको फिर से प्यार से याद दिलाऊँगी।",
    as: "একো চিন্তা নকৰিব। মই ১৫ মিনিট পিছত আপোনাক আকৌ মনত পেলাই দিম।",
    mni: "ৱাবা অমত্তা লৈতে। ঐহাকনা মিনিট ১৫ তুংদা অমুক নিংশিংহনিংবগী পাউদম পীরক্কনি।",
    bn: "কোনো চিন্তা করবেন না। আমি ১৫ মিনিট পর আপনাকে আবার মনে করিয়ে দেব।",
    nag: "Kiba chinta na koribi. Moi 15 min pichite abar yaad korai dibo.",
    es: "No se preocupe para nada. Le recordaré suavemente de nuevo en 15 minutos.",
    en: "No worries at all. I will gently remind you again in 15 minutes."
  },
  activityCompleted: {
    hi: "बहुत बढ़िया! गतिविधि मुस्कान के साथ पूरी हुई।",
    as: "বৰ সুন্দৰ! আপুনি হাঁহি মুখেৰে কামটো সম্পূৰ্ণ কৰিলে।",
    mni: "য়াম্না নুংঙাইরে! থবক অদু মীনোক্কা লোয়ননা লোইরে।",
    bn: "খুব সুন্দর প্রচেষ্টা! কাজটি হাসিমুখে সম্পূর্ণ হয়েছে।",
    nag: "Bishi bhal hoise! Kaam khusi pora kothom korise.",
    es: "¡Gran esfuerzo! Actividad completada con una sonrisa.",
    en: "Great effort! Activity completed with a smile."
  },
  mascotGreeting: {
    hi: (name: string) => `नमस्ते ${name}! मैं आपकी साथी सॉन्गपा हूँ। आप आज बहुत अच्छा कर रही हैं। चलिए साथ चलते हैं।`,
    as: (name: string) => `নমস্কাৰ ${name}! মই আপোনাৰ মৰমৰ ছাংপা। আপুনি আজি খুবেই ভাল কৰিছে। আহক একেলগে খোজ পেলাওঁ।`,
    mni: (name: string) => `খুরুমজরি ${name}! ঐহাক অদোমগী নুংশিরবী সাংপানী। অদোম ঙসি য়াম্না ফনা লৈরি। ঐখোয় পুন্না চৎমিন্নসি।`,
    bn: (name: string) => `নমস্কার ${name}! আমি আপনার প্রিয় সাথী সাংপা। আপনি আজ খুব ভালো আছেন। আসুন একসাথে এক পা এগিয়ে যাই।`,
    nag: (name: string) => `Namaste ${name}! Moi apuni laga sathi Sangpa asey. Apuni aji bhal korise. Ahibi ekta step loi lohi.`,
    es: (name: string) => `¡Hola ${name}! Soy Sangpa. Lo está haciendo maravilloso hoy. Demos un pasito juntos.`,
    en: (name: string) => `Namaste ${name}! I am Sangpa, your loving little companion. You are doing so well today. Let's take one gentle step together.`
  },
  emergencyHelp: {
    hi: (name: string) => `मैं आपके साथ हूँ, ${name}। गहरी सांस लें। यदि आपको सहायता चाहिए, तो मैं तुरंत रिया से संपर्क करा सकती हूँ।`,
    as: (name: string) => `মই আপোনাৰ লগতেই আছোঁ, ${name}। লাহেকৈ উশাহ লওক। আপোনাক সহায় লাগিলে মই এতিয়াই ৰিয়াক মাতিব পাৰোঁ।`,
    mni: (name: string) => `ঐহাক অদোমগা লোয়ননা লৈরি, ${name}। তপ্না ৱাখল থৌবা তৌবীয়ু। মতেং মথৌ তারবদি ঐহাকনা হৌজিক রিয়াদা পাউ পীবীয়ু।`,
    bn: (name: string) => `আমি আপনার পাশেই আছি, ${name}। ধীরে শ্বাস নিন। আপনার সাহায্য প্রয়োজন হলে আমি এখনই রিয়ার সাথে যোগাযোগ করিয়ে দিতে পারি।`,
    nag: (name: string) => `Moi apuni logot asey, ${name}। Dheere pora saas lobi। Help lage koile moi etiya Riya ke phone koribo paribo।`,
    es: (name: string) => `Estoy aquí con usted, ${name}. Respire profundo. Si necesita ayuda, puedo comunicarla con Riya de inmediato.`,
    en: (name: string) => `I am right here with you, ${name}. Take a slow breath. If you need Riya or medical help, I can connect you immediately.`
  },
  emergencyCalling: {
    hi: (name: string) => `${name} को 5 सेकंड में कॉल की जा रही है। यदि गलती से दब गया हो तो रद्द करें दबाएं।`,
    as: (name: string) => `${name} লৈ ৫ ছেকেণ্ডত কল কৰা হৈছে। ভুলবশতঃ হ'লে বাতিল কৰক।`,
    mni: (name: string) => `${name}দা সেকেন্ড ৫দা কোল তৌরগনি। অশোয়বা ওইরবদি তোকপা নম্বীয়ু।`,
    bn: (name: string) => `${name}-কে ৫ সেকেন্ডে কল করা হচ্ছে। ভুলবশত হলে বাতিল চাপুন।`,
    nag: (name: string) => `${name} ke 5 second te call koribo asey. Bhul pora hoise koile cancel koribi.`,
    es: (name: string) => `Llamada de emergencia a ${name} en 5 segundos. Toque cancelar si fue un error.`,
    en: (name: string) => `Emergency call to ${name} starting in 5 seconds. Tap cancel if this was an accident.`
  },
  emergencyConnected: {
    hi: (name: string) => `${name} से फोन कॉल जुड़ रहा है।`,
    as: (name: string) => `${name}ৰ সৈতে ফোন কল সংযোগ কৰা হৈছে।`,
    mni: (name: string) => `${name}গা কোল শম্নরে।`,
    bn: (name: string) => `${name}-এর সাথে ফোন কল যুক্ত হচ্ছে।`,
    nag: (name: string) => `${name} logot call connect hoi asey.`,
    es: (name: string) => `Conectando llamada telefónica con ${name} ahora mismo.`,
    en: (name: string) => `Connecting phone call to ${name} right now.`
  },
  emergencyCancelled: {
    hi: (name: string) => `आपातकालीन कॉल रद्द कर दी गई। आप सुरक्षित हैं, ${name}।`,
    as: (name: string) => `জৰুৰীকালীন কল বাতিল কৰা হ'ল। আপুনি সুৰক্ষিত, ${name}।`,
    mni: (name: string) => `মরুওইবা কোল অদু তোকখ্রে। অদোম সুৰক্ষিত ওইনা লৈরি, ${name}।`,
    bn: (name: string) => `জরুরি কল বাতিল করা হয়েছে। আপনি সুরক্ষিত আছেন, ${name}।`,
    nag: (name: string) => `Emergency call cancel korise. Apuni safe asey, ${name}.`,
    es: (name: string) => `Llamada de emergencia cancelada. Está a salvo, ${name}.`,
    en: (name: string) => `Emergency call cancelled. You are safe, ${name}.`
  },
  foodVoice: {
    hi: "आज का पौष्टिक आहार है ताज़ा पालक और अखरोट वाली मूंग दाल खिचड़ी। पालक मस्तिष्क के लिए फोलेट देता है और अखरोट ओमेगा-3 तेल प्रदान करता है।",
    as: "আজিৰ পুষ্টিকৰ আহাৰ হৈছে সতেজ পালেং শাক আৰু আখৰোটৰ সৈতে মুগ দাইলৰ খিচিৰি। পালেং শাকে মগজুৰ বাবে ফলেট যোগায় আৰু আখৰোটে অমেগা-৩ দিয়ে।",
    mni: "ঙসিগী পুষ্টিকর চারোন-থক্লোন অসি পালং অমসুং অখরোত য়াওবা মুং দাল খিচরি নি। পালংনা ৱাখলগীদমক ফলেত পীবী অমসুং অখরোতনা ওমেগা-৩ পীবী।",
    bn: "আজকের পুষ্টিকর খাবার হলো তাজা পালং শাক ও আখরোট দিয়ে তৈরি মুগ ডালের খিচুড়ি। পালং শাক মস্তিষ্কের জন্য ফোলেট দেয় এবং আখরোট ওমেগা-৩ সরবরাহ করে।",
    nag: "Aji laga bhal khana asey Moong Dal Khichdi paleng saag aru walnut logot. Paleng brain laga bhal aru walnut pora omega-3 pabo.",
    es: "La comida nutritiva de hoy es Moong Dal Khichdi con espinacas frescas y nueces. La espinaca aporta folato y las nueces grasas saludables omega-3.",
    en: "Today's nourishing meal is Moong Dal Khichdi with fresh spinach and crushed walnuts. Spinach provides folate, and walnuts give healthy omega-3 oils."
  },
  exerciseStart: {
    hi: "चलिए साथ मिलकर यह हल्का व्यायाम करते हैं। मेरे साथ शुरू करें!",
    as: "আহক আমি একেলগে এই সহজ ব্যায়ামটো কৰোঁ। মোৰ সৈতে আৰম্ভ কৰক!",
    mni: "ঐখোয় পুন্না অরাইবা হকচাংগী এক্সরসাইজ অসি তৌসি। ঐহাক্কা লোয়ননা হৌসি!",
    bn: "আসুন একসাথে এই হালকা ব্যায়ামটি করি। আমার সাথে শুরু করুন!",
    nag: "Ahibi sob mili eitu sohoj exercise koribo. Moi logote start koribi!",
    es: "Hagamos este suave movimiento juntos. ¡Siga mi ritmo!",
    en: "Let's do this gentle movement together. Follow my lead!"
  },
  exerciseFinish: {
    hi: "बहुत सुंदर! आपने आज का शारीरिक व्यायाम बड़े प्यार से पूरा किया।",
    as: "বৰ সুন্দৰ! আপুনি আজিৰ শাৰীৰিক ব্যায়াম সুন্দৰকৈ সম্পূৰ্ণ কৰিলে।",
    mni: "য়াম্না ফরে! অদোমনা ঙসিগী হকচাংগী এক্সরসাইজ অসি নিংথিনা লোইশিনখ্রে।",
    bn: "দারুণ! আপনি আজকের শারীরিক ব্যায়াম খুব সুন্দরভাবে শেষ করলেন।",
    nag: "Bishi bhal! Apuni aji laga physical exercise bhal pora kothom korise.",
    es: "¡Espléndido trabajo! Completó el ejercicio de hoy con gracia.",
    en: "Splendid job! You completed today's exercise with grace."
  },
  handClapsStart: {
    hi: "चलिए साथ मिलकर ताली बजाते हैं! वीडियो देखें और लय के साथ दोनों हाथों से ताली बजाएं।",
    as: "আহক আমি একেলগে চাপৰি বজাওঁ! ভিডিঅ'টো চাওক আৰু ছন্দত হাত চাপৰি বজাওক।",
    mni: "ঐখোয় পুন্না খুত তপ্না খোয় থাবীয়ু! ভিদিও য়েংদুনা পুন্না খোয় থাবীয়ু।",
    bn: "আসুন একসাথে মিষ্টি ছন্দে তালি দিই! ভিডিওটি দেখে সুন্দর করে তালি বাজান।",
    nag: "Ahibi sob mili taali bajaabi! Video sabhi aru gentle rhythm logot taali bajaabi.",
    es: "¡Aplaudamos suavemente juntos! Siga el video con un ritmo calmado.",
    en: "Let's do hand claps together! Watch the demonstration video and clap along with the rhythm."
  },
  handClapsFinish: {
    hi: "शाबाश! आपने बहुत सुंदर तरीके से ताली बजाने का व्यायाम पूरा किया।",
    as: "বৰ সুন্দৰ! আপুনি বৰ আনন্দৰে হাত চাপৰিৰ ব্যায়াম সম্পূৰ্ণ কৰিলে।",
    mni: "য়াম্না ফরে! অদোমনা খুত খোয় থাবাগী এক্সরসাইজ অসি নিংথিনা লোইশিনখ্রে।",
    bn: "সাবাশ! আপনি খুব চমৎকারভাবে তালি বাজানোর ব্যায়াম শেষ করলেন।",
    nag: "Bishi bhal! Apuni sundor pora taali laga exercise kothom korise.",
    es: "¡Excelente! Completó el ejercicio de aplausos con gran energía.",
    en: "Splendid job! You completed the hand claps rhythm exercise with grace."
  },
  chatFallback: {
    hi: (name: string) => `मैं आपके साथ हूँ, ${name}। आप अपने प्यारे कमरे में बिल्कुल सुरक्षित हैं। चलिए साथ मिलकर एक धीमी और गहरी सांस लेते हैं।`,
    as: (name: string) => `মই আপোনাৰ লগতেই আছোঁ, ${name}। আপুনি আপোনাৰ শুৱনি কোঠাত সম্পূৰ্ণ সুৰক্ষিত। আহক একেলগে লাহেকৈ এটা গভীৰ উশাহ লওঁ।`,
    mni: (name: string) => `ঐহাক অদোমগা লোয়ননা লৈরি, ${name}। অদোমগী নুংশিরবা কা অসিদা অদোম সুৰক্ষিত ওইনা লৈরি। ঐখোয় পুন্না তপ্না ৱাখল থৌসি।`,
    bn: (name: string) => `আমি আপনার পাশেই আছি, ${name}। আপনি আপনার সুন্দর ঘরে একদম সুরক্ষিত আছেন। আসুন একসাথে একটি শান্ত ও গভীর শ্বাস নিই।`,
    nag: (name: string) => `Moi apuni logot asey, ${name}। Apuni nijor room te pura safe asey। Ahibi eksathe ekta gentle breath loi lohi।`,
    es: (name: string) => `Estoy aquí con usted, ${name}. Está a salvo en su cálida habitación. Respiremos suavemente juntos.`,
    en: (name: string) => `I am right here with you, ${name}. You are safe in your lovely room. Let's take one gentle breath together.`
  }
};
