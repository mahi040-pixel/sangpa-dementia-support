import { LanguageCode, CaregiverScreen } from '../types';

export interface LocalizedCaregiverUI {
  // Navigation & Brand
  nav: {
    portalBrand: string;
    portalSubtitle: string;
    options: Record<string, { label: string; number: string; description: string }>;
    switchToPatient: string;
    activeAlertsCount: (count: number) => string;
    overview: string;
    navigation: string;
    closeMenu: string;
    menu: string;
  };

  // Overview / Patient Summary
  overview: {
    title: string;
    subtitle: (name: string) => string;
    liveConnected: string;
    currentCondition: string;
    ageLabel: (age: number) => string;
    conditionName: string;
    doingWellBadge: string;
    statusUpdateHeader: string;
    statusUpdateText: (name: string) => string;
    quickActionsTitle: string;
    sendVoiceNudge: string;
    voiceNudgeSent: string;
    callPatient: string;
    viewRoutine: string;
    todayStreamTitle: string;
    todayStreamSubtitle: string;
    allTasksSynced: string;
    deviceConnectivityTitle: string;
    onlineStatus: string;
    batteryStatus: (pct: number) => string;
    lastSynced: string;
    completedBadge: string;
    upcomingBadge: string;
    noRemindersToday: string;
  };

  // Option 1: Patient Profile & Preferences
  profileSettings: {
    optionBadge: string;
    title: string;
    subtitle: (name: string) => string;
    backBtn: string;
    saveBtn: string;
    savedToast: string;
    patientInfoTitle: string;
    legalNameLabel: string;
    preferredNameLabel: string;
    ageLabel: string;
    conditionLabel: string;
    languageTitle: string;
    languageSubtitle: string;
    voicePersonaTitle: string;
    voicePersonaSubtitle: string;
    playEnglishSample: string;
    stopAudio: string;
    playHindiSample: string;
    voicePersonaName: string;
    voicePersonaDesc: (name: string) => string;
    soundTonesTitle: string;
    soundTonesSubtitle: string;
    gentleChimesLabel: string;
    gentleChimesDesc: string;
    templeBellLabel: string;
    templeBellDesc: string;
    volumeLabel: string;
    testChimeBtn: string;
    quietHoursTitle: string;
    quietHoursSubtitle: string;
    sleepStartLabel: string;
    morningWakeLabel: string;
    emergencyBypassLabel: string;
    commPrefTitle: string;
    commPrefSubtitle: (name: string) => string;
    commPrefs: {
      voice: { label: string; desc: string };
      text: { label: string; desc: string };
      pictures: { label: string; desc: string };
      combined: { label: string; desc: string };
    };
    selectedBadge: string;
  };

  // Option 2: Knowledge Assistant
  knowledgeAssistant: {
    optionBadge: string;
    title: string;
    subtitle: string;
    backBtn: string;
    assistantOnlineBadge: string;
    suggestedShortcutsTitle: string;
    clearChatBtn: string;
    inputPlaceholder: string;
    sendBtn: string;
    sourceOpenAI: string;
    sourceFallback: string;
    listenAloud: string;
    stopAudio: string;
    copyTooltip: string;
    copiedTooltip: string;
    sampleQuestions: {
      status: string;
      appointment: string;
      games: string;
      missed: string;
      sundowning: string;
      graphs: string;
    };
  };

  // Option 3: Add Memories
  memories: {
    optionBadge: string;
    title: string;
    subtitle: string;
    backBtn: string;
    addNewMemoryTitle: string;
    memoryTitleLabel: string;
    relationshipLabel: string;
    captionLabel: string;
    audioNoteLabel: string;
    locationLabel: string;
    dateLabel: string;
    saveMemoryBtn: string;
    memorySavedToast: string;
    existingMemoriesTitle: (count: number) => string;
    inFlashcardsBadge: string;
    favoriteBadge: string;
    listenStoryBtn: string;
    deleteBtn: string;
  };

  // Option 4: Alerts
  alerts: {
    optionBadge: string;
    title: string;
    subtitle: string;
    backBtn: string;
    urgentBadge: string;
    needsAttentionBadge: string;
    informationalBadge: string;
    resolveBtn: string;
    resolvedBadge: string;
    contactPatientBtn: string;
    allClearTitle: string;
    allClearSubtitle: string;
    unreadCount: (count: number) => string;
  };

  // Option 5: Progress & Analytics
  progress: {
    optionBadge: string;
    title: string;
    subtitle: (name: string) => string;
    backBtn: string;
    tabBoth: string;
    tabEngagement: string;
    tabImprovement: string;
    weeklyActiveTitle: string;
    dailyAvgTitle: string;
    accuracyByGameTitle: string;
    clinicalCurveTitle: string;
    clinicalNoteTitle: string;
    targetExceededBadge: string;
    adherenceTitle: string;
  };

  // Common
  common: {
    backToSummary: string;
    backToPatient: string;
    saveChanges: string;
    saved: string;
    liveStatus: string;
  };
}

export const CAREGIVER_I18N: Record<LanguageCode, LocalizedCaregiverUI> = {
  // -------------------------------------------------------------------------
  // 1. ENGLISH
  // -------------------------------------------------------------------------
  en: {
    nav: {
      portalBrand: "SANGPA",
      portalSubtitle: "Caregiver Portal",
      options: {
        patient_profile: { number: "1.", label: "Patient Details", description: "Personal details, routine schedule & quiet hours" },
        knowledge_assistant: { number: "2.", label: "Knowledge Assistant", description: "AI dementia care advice & guidance" },
        memories: { number: "3.", label: "Add Memories", description: "Family photos, stories & loved ones" },
        alerts: { number: "4.", label: "Alerts", description: "Missed meds, emergency alerts & notices" },
        progress: { number: "5.", label: "Weekly Engagement & Improvement Graph", description: "Active minutes & 4-week cognitive curves" }
      },
      switchToPatient: "Return to Patient Mode",
      activeAlertsCount: (count) => `${count} Unresolved Alert${count === 1 ? '' : 's'}`,
      overview: "Patient Summary",
      navigation: "Care Navigation",
      closeMenu: "Close Menu",
      menu: "Menu"
    },
    overview: {
      title: "Patient Summary",
      subtitle: (name) => `Live status & care monitoring for ${name}`,
      liveConnected: "Live Connected",
      currentCondition: "Current Condition",
      ageLabel: (age) => `Age ${age}`,
      conditionName: "Mild Cognitive Impairment (MCI) - Stage 2",
      doingWellBadge: "Doing Well",
      statusUpdateHeader: "Caregiver Status Update:",
      statusUpdateText: (name) => `${name} is currently calm, cheerful, and resting comfortably in the living room. Cognitive alertness is stable, morning hydration and blood pressure medicine were completed on time, and there are zero signs of distress or confusion.`,
      quickActionsTitle: "Quick Care Actions",
      sendVoiceNudge: "Send Mascot Voice Love Nudge",
      voiceNudgeSent: "Voice Nudge Sent to Sangpa!",
      callPatient: "Emergency Call / Connect to Patient",
      viewRoutine: "Open Patient Details & Schedule",
      todayStreamTitle: "Today's Live Care Stream",
      todayStreamSubtitle: "Synchronized patient schedule & medication adherence",
      allTasksSynced: "All Tasks Synchronized",
      deviceConnectivityTitle: "Device & Connectivity",
      onlineStatus: "Device Online",
      batteryStatus: (pct) => `Battery: ${pct}%`,
      lastSynced: "Just now",
      completedBadge: "Completed",
      upcomingBadge: "Scheduled",
      noRemindersToday: "No remaining reminders for today. All scheduled care is up to date!"
    },
    profileSettings: {
      optionBadge: "Option 1",
      title: "1. Patient Details",
      subtitle: (name) => `Personal details, daily schedule, sound tones, quiet resting hours & language for ${name}`,
      backBtn: "← Back to Patient Summary",
      saveBtn: "Save Changes",
      savedToast: "Patient preferences successfully updated across all SANGPA devices.",
      patientInfoTitle: "Patient Information",
      legalNameLabel: "Full Legal Name",
      preferredNameLabel: "Preferred Calling Name (Used in Voice & Namaste Greeting)",
      ageLabel: "Age",
      conditionLabel: "Condition / Medical Notes",
      languageTitle: "Language & Cultural Persona",
      languageSubtitle: "Select the primary language and regional voice persona for Sangpa voice & text:",
      voicePersonaTitle: "Voice & Audio Feedback",
      voicePersonaSubtitle: "Sangpa mascot voice powered by ElevenLabs Multilingual child companion model:",
      playEnglishSample: "English Sample (Suhana)",
      stopAudio: "Stop Voice",
      playHindiSample: "Hindi Greeting (Sangpa)",
      voicePersonaName: "Voice Persona: Suhana J (Young & Joyful Child Companion)",
      voicePersonaDesc: (name) => `Suhana's voice is bright, youthful, and full of innocence—warm and comforting for ${name} like a loving grandchild.`,
      soundTonesTitle: "Sound Tones & Audio Sensitivity",
      soundTonesSubtitle: "Choose calming auditory cues that gently prompt without causing startle or sensory overwhelm:",
      gentleChimesLabel: "Gentle Bamboo Chimes",
      gentleChimesDesc: "Soft acoustic chimes for peaceful reminder transitions",
      templeBellLabel: "Calm Temple Bell",
      templeBellDesc: "Warm resonant bronze tone grounded in cultural familiarity",
      volumeLabel: "Audio Chime Volume",
      testChimeBtn: "Listen to Tone",
      quietHoursTitle: "Resting & Quiet Hours",
      quietHoursSubtitle: "During quiet hours, routine chimes are silenced to preserve deep restful sleep.",
      sleepStartLabel: "Sleep Start Time (Mute Chimes)",
      morningWakeLabel: "Morning Wake Time (Resume Reminders)",
      emergencyBypassLabel: "Emergency alerts automatically bypass Quiet Hours to guarantee safety.",
      commPrefTitle: "Communication Preference",
      commPrefSubtitle: (name) => `How ${name} absorbs information best:`,
      commPrefs: {
        voice: { label: "Spoken Voice Only", desc: "Auditory voice guidance" },
        text: { label: "Large Text", desc: "Clear bold typography" },
        pictures: { label: "Visual Pictures", desc: "Iconography & memory photos" },
        combined: { label: "Voice + Text + Pictures", desc: "Recommended multi-sensory" }
      },
      selectedBadge: "Selected"
    },
    knowledgeAssistant: {
      optionBadge: "Option 2",
      title: "2. Knowledge Assistant",
      subtitle: "Ask anything about caregiving strategies, routine logs, cognitive metrics & dementia support",
      backBtn: "← Back to Patient Summary",
      assistantOnlineBadge: "Assistant Online (GPT-4o)",
      suggestedShortcutsTitle: "Suggested Questions & Shortcuts",
      clearChatBtn: "Clear Chat",
      inputPlaceholder: "Ask Sangpa Knowledge Assistant anything about patient care or logs...",
      sendBtn: "Ask Assistant",
      sourceOpenAI: "Live AI Response",
      sourceFallback: "Caregiver Knowledge Base",
      listenAloud: "Listen Aloud",
      stopAudio: "Stop Voice",
      copyTooltip: "Copy Message",
      copiedTooltip: "Copied!",
      sampleQuestions: {
        status: "How is patient doing today?",
        appointment: "When is the next doctor appointment?",
        games: "What are her cognitive game scores?",
        missed: "Any missed medicines today?",
        sundowning: "Tips for evening confusion or sundowning?",
        graphs: "Show this week's engagement trends"
      }
    },
    memories: {
      optionBadge: "Option 3",
      title: "3. Add Memories",
      subtitle: "Manage family photographs, audio memories & stories to comfort patient during moments of confusion",
      backBtn: "← Back to Patient Summary",
      addNewMemoryTitle: "Add New Family Memory",
      memoryTitleLabel: "Memory Title (e.g. Aarav's 5th Birthday)",
      relationshipLabel: "Loved One / Relationship (e.g. Daughter Riya)",
      captionLabel: "Memory Story & Gentle Context",
      audioNoteLabel: "Voice Note / Audio Description",
      locationLabel: "Place / Location",
      dateLabel: "Year or Season (e.g. Summer 2021)",
      saveMemoryBtn: "Add to Family Memory Album",
      memorySavedToast: "New family memory added to album & flashcards!",
      existingMemoriesTitle: (count) => `Saved Family Memories (${count})`,
      inFlashcardsBadge: "Active in Flashcards Game",
      favoriteBadge: "Favorite Memory",
      listenStoryBtn: "Listen to Memory Story",
      deleteBtn: "Remove"
    },
    alerts: {
      optionBadge: "Option 4",
      title: "4. Care Alerts & Safety Triage",
      subtitle: "Real-time notifications for missed medications, unusual inactivity, and emergency triggers",
      backBtn: "← Back to Patient Summary",
      urgentBadge: "URGENT",
      needsAttentionBadge: "Needs Attention",
      informationalBadge: "Informational",
      resolveBtn: "Mark Resolved",
      resolvedBadge: "Resolved",
      contactPatientBtn: "Connect with Patient Device",
      allClearTitle: "All Safety Checks Clear!",
      allClearSubtitle: "Zero pending alerts. Patient routine and vitals are stable.",
      unreadCount: (count) => `${count} Active Alert${count === 1 ? '' : 's'}`
    },
    progress: {
      optionBadge: "Option 5",
      title: "5. Weekly Engagement & Improvement Graph",
      subtitle: (name) => `Cognitive engagement trends, game accuracy curves & routine adherence for ${name}`,
      backBtn: "← Back to Patient Summary",
      tabBoth: "All Analytics",
      tabEngagement: "Active Minutes",
      tabImprovement: "Improvement Curves",
      weeklyActiveTitle: "Weekly Active Minutes",
      dailyAvgTitle: "Daily Average Engagement",
      accuracyByGameTitle: "Cognitive Accuracy by Game",
      clinicalCurveTitle: "4-Week Improvement Curve",
      clinicalNoteTitle: "Clinical Observation Note",
      targetExceededBadge: "Target Exceeded (+16%)",
      adherenceTitle: "Routine Adherence Rate"
    },
    common: {
      backToSummary: "← Back to Patient Summary",
      backToPatient: "Return to Patient Dashboard",
      saveChanges: "Save Changes",
      saved: "Saved!",
      liveStatus: "Live Status"
    }
  },

  // -------------------------------------------------------------------------
  // 2. HINDI (हिन्दी)
  // -------------------------------------------------------------------------
  hi: {
    nav: {
      portalBrand: "सांगपा",
      portalSubtitle: "देखभालकर्ता पोर्टल (Caregiver Portal)",
      options: {
        patient_profile: { number: "1.", label: "मरीज़ का विवरण", description: "व्यक्तिगत विवरण, दिनचर्या व विश्राम समय" },
        knowledge_assistant: { number: "2.", label: "ज्ञान सहायक", description: "एआई डिमेंशिया देखभाल सलाह व मार्गदर्शन" },
        memories: { number: "3.", label: "यादें जोड़ें", description: "पारिवारिक तस्वीरें, कहानियाँ व प्रियजन" },
        alerts: { number: "4.", label: "चेतावनी व सूचनाएं", description: "छूटी दवाएं, आपातकालीन अलर्ट व नोट्स" },
        progress: { number: "5.", label: "साप्ताहिक जुड़ाव व सुधार ग्राफ", description: "सक्रिय मिनट व 4-सप्ताह का संज्ञानात्मक ग्राफ" }
      },
      switchToPatient: "मरीज़ मोड पर वापस जाएं",
      activeAlertsCount: (count) => `${count} अनसुलझी चेतावनी`,
      overview: "मरीज़ सारांश",
      navigation: "देखभाल नेविगेशन",
      closeMenu: "मेनू बंद करें",
      menu: "मेनू"
    },
    overview: {
      title: "मरीज़ सारांश",
      subtitle: (name) => `${name} की ताज़ा स्थिति व स्वास्थ्य निगरानी`,
      liveConnected: "लाइव कनेक्टेड",
      currentCondition: "वर्तमान स्थिति",
      ageLabel: (age) => `उम्र ${age} वर्ष`,
      conditionName: "हल्की संज्ञानात्मक हानि (MCI) - स्टेज 2",
      doingWellBadge: "स्वस्थ व प्रसन्न",
      statusUpdateHeader: "देखभालकर्ता स्थिति अपडेट:",
      statusUpdateText: (name) => `${name} अभी बिल्कुल शांत, प्रसन्न और अपने कमरे में आराम से बैठी हैं। संज्ञानात्मक सक्रियता स्थिर है, सुबह का पानी और रक्तचाप की दवा समय पर ली गई है, और किसी प्रकार की घबराहट या परेशानी नहीं है।`,
      quickActionsTitle: "त्वरित देखभाल क्रियाएं",
      sendVoiceNudge: "सांगपा आवाज़ में स्नेह संदेश भेजें",
      voiceNudgeSent: "सांगपा पर स्नेह संदेश भेज दिया गया!",
      callPatient: "आपातकालीन कॉल / मरीज़ से जुड़ें",
      viewRoutine: "मरीज़ का विवरण व दिनचर्या खोलें",
      todayStreamTitle: "आज की लाइव देखभाल दिनचर्या",
      todayStreamSubtitle: "मरीज़ की निर्धारित दिनचर्या और दवा समय पर",
      allTasksSynced: "सभी कार्य समयबद्ध व ट्रैक किए गए",
      deviceConnectivityTitle: "उपकरण व कनेक्टिविटी",
      onlineStatus: "उपकरण ऑनलाइन",
      batteryStatus: (pct) => `बैटरी: ${pct}%`,
      lastSynced: "अभी-अभी",
      completedBadge: "पूर्ण",
      upcomingBadge: "आगामी",
      noRemindersToday: "आज के सभी निर्धारित कार्य सफलतापूर्वक पूर्ण हो चुके हैं!"
    },
    profileSettings: {
      optionBadge: "विकल्प 1",
      title: "1. मरीज़ का विवरण",
      subtitle: (name) => `${name} के लिए व्यक्तिगत विवरण, दिनचर्या, शांत विश्राम के घंटे व भाषा`,
      backBtn: "← मरीज़ सारांश पर वापस जाएं",
      saveBtn: "बदलाव सुरक्षित करें",
      savedToast: "मरीज़ की प्राथमिकताएं सभी सांगपा उपकरणों पर सफलतापूर्वक अपडेट हो गईं।",
      patientInfoTitle: "मरीज़ की जानकारी",
      legalNameLabel: "पूरा कानूनी नाम",
      preferredNameLabel: "पुकारने का पसंदीदा नाम (आवाज़ व नमस्ते में प्रयुक्त)",
      ageLabel: "उम्र",
      conditionLabel: "चिकित्सीय स्थिति व नोट्स",
      languageTitle: "भाषा व सांस्कृतिक स्वरूप",
      languageSubtitle: "सांगपा की आवाज़ और टेक्स्ट के लिए प्राथमिक भाषा चुनें:",
      voicePersonaTitle: "आवाज़ व ऑडियो प्रतिक्रिया",
      voicePersonaSubtitle: "एलेवनलैब्स बहुभाषी बाल साथी मॉडल द्वारा संचालित सांगपा आवाज़:",
      playEnglishSample: "अंग्रेज़ी आवाज़ नमूना (सुहाना)",
      stopAudio: "आवाज़ रोकें",
      playHindiSample: "हिन्दी अभिवादन (सांगपा)",
      voicePersonaName: "आवाज़ स्वरूप: सुहाना जे (हर्षित बाल साथी)",
      voicePersonaDesc: (name) => `सुहाना की आवाज़ नन्हीं पोती जैसी प्यारी, मासूम और ऊर्जावान है—जो ${name} को गहरा सुकून देती है।`,
      soundTonesTitle: "ध्वनि टोन व ऑडियो संवेदनशीलता",
      soundTonesSubtitle: "मधुर और शांत ध्वनियाँ चुनें जो बिना चौकाए मरीज़ का ध्यान आकर्षित करें:",
      gentleChimesLabel: "बांस की मधुर घंटी",
      gentleChimesDesc: "दैनिक कार्यों के लिए शांत व कोमल ध्वनि",
      templeBellLabel: "शांत मंदिर की घंटी",
      templeBellDesc: "पारंपरिक कांसे की गंभीर व परिचित घंटी",
      volumeLabel: "घंटी की आवाज़ का स्तर",
      testChimeBtn: "आवाज़ सुनें",
      quietHoursTitle: "विश्राम व शांत पहर (Quiet Hours)",
      quietHoursSubtitle: "शांत पहर के दौरान गहरी नींद बनाए रखने के लिए सभी घंटियाँ स्वतः मूक रहेंगी।",
      sleepStartLabel: "सोने का समय (घंटी मूक)",
      morningWakeLabel: "जागने का समय (घंटी पुनः चालू)",
      emergencyBypassLabel: "सुरक्षा सुनिश्चित करने हेतु आपातकालीन सूचनाएं शांत पहर में भी बजेंगी।",
      commPrefTitle: "संवाद प्राथमिकता",
      commPrefSubtitle: (name) => `${name} किस माध्यम से जानकारी सबसे अच्छी तरह समझती हैं:`,
      commPrefs: {
        voice: { label: "केवल बोली गई आवाज़", desc: "ऑडियो मार्गदर्शन" },
        text: { label: "बड़े अक्षर", desc: "स्पष्ट व बड़े फॉन्ट" },
        pictures: { label: "तस्वीरें व प्रतीक", desc: "यादगार फोटो व चित्र" },
        combined: { label: "आवाज़ + अक्षर + चित्र", desc: "सर्वश्रेष्ठ बहु-संवेदी" }
      },
      selectedBadge: "चयनित"
    },
    knowledgeAssistant: {
      optionBadge: "विकल्प 2",
      title: "2. ज्ञान सहायक (Knowledge Assistant)",
      subtitle: "देखभाल रणनीतियों, दवा लॉग, संज्ञानात्मक प्रगति व डिमेंशिया सहायता से जुड़ा कुछ भी पूछें",
      backBtn: "← मरीज़ सारांश पर वापस जाएं",
      assistantOnlineBadge: "सहायक ऑनलाइन (GPT-4o)",
      suggestedShortcutsTitle: "सुझाए गए मुख्य प्रश्न व शॉर्टकट",
      clearChatBtn: "बातचीत साफ़ करें",
      inputPlaceholder: "मरीज़ की देखभाल या रिकॉर्ड के बारे में कुछ भी पूछें...",
      sendBtn: "पूछें",
      sourceOpenAI: "लाइव एआई उत्तर",
      sourceFallback: "देखभालकर्ता ज्ञान भंडार",
      listenAloud: "आवाज़ में सुनें",
      stopAudio: "आवाज़ रोकें",
      copyTooltip: "संदेश कॉपी करें",
      copiedTooltip: "कॉपी हो गया!",
      sampleQuestions: {
        status: "आज मरीज़ की स्थिति कैसी है?",
        appointment: "डॉक्टर से अगली अपॉइंटमेंट कब है?",
        games: "खेलों में संज्ञानात्मक स्कोर क्या है?",
        missed: "क्या आज कोई दवाई छूटी है?",
        sundowning: "शाम की घबराहट (सनडाउनिंग) के लिए सुझाव?",
        graphs: "इस सप्ताह के सुधार ग्राफ दिखाएं"
      }
    },
    memories: {
      optionBadge: "विकल्प 3",
      title: "3. यादें जोड़ें (Family Memories)",
      subtitle: "घबराहट के समय मरीज़ को सांत्वना देने हेतु पारिवारिक तस्वीरें व पुरानी कहानियाँ जोड़ें",
      backBtn: "← मरीज़ सारांश पर वापस जाएं",
      addNewMemoryTitle: "नई पारिवारिक याद जोड़ें",
      memoryTitleLabel: "याद का शीर्षक (जैसे: आरव का ५वाँ जन्मदिन)",
      relationshipLabel: "प्रियजन / रिश्ता (जैसे: बेटी रिया)",
      captionLabel: "याद की कहानी व संदर्भ",
      audioNoteLabel: "आवाज़ संदेश / ऑडियो विवरण",
      locationLabel: "स्थान / शहर",
      dateLabel: "वर्ष या मौसम (जैसे: ग्रीष्म २०२१)",
      saveMemoryBtn: "पारिवारिक एल्बम में जोड़ें",
      memorySavedToast: "नई याद पारिवारिक एल्बम व फ्लैशकार्ड में जुड़ गई!",
      existingMemoriesTitle: (count) => `सहेजी गई पारिवारिक यादें (${count})`,
      inFlashcardsBadge: "फ्लैशकार्ड खेल में सक्रिय",
      favoriteBadge: "पसंदीदा याद",
      listenStoryBtn: "कहानी सुनें",
      deleteBtn: "हटाएं"
    },
    alerts: {
      optionBadge: "विकल्प 4",
      title: "4. देखभाल चेतावनी व सुरक्षा ट्राइएज",
      subtitle: "छूटी हुई दवाओं, असामान्य निष्क्रियता व आपातकालीन ट्रिगर हेतु वास्तविक समय की सूचनाएं",
      backBtn: "← मरीज़ सारांश पर वापस जाएं",
      urgentBadge: "अति आवश्यक",
      needsAttentionBadge: "ध्यान दें",
      informationalBadge: "सामान्य सूचना",
      resolveBtn: "हल हुआ चिह्नित करें",
      resolvedBadge: "हल हो गया",
      contactPatientBtn: "मरीज़ के उपकरण से जुड़ें",
      allClearTitle: "सभी सुरक्षा जांच पूरी तरह सुरक्षित!",
      allClearSubtitle: "कोई भी चेतावनी लंबित नहीं है। मरीज़ की दिनचर्या व स्वास्थ्य बिल्कुल स्थिर है।",
      unreadCount: (count) => `${count} सक्रिय चेतावनी`
    },
    progress: {
      optionBadge: "विकल्प 5",
      title: "5. साप्ताहिक जुड़ाव व सुधार ग्राफ",
      subtitle: (name) => `${name} के लिए संज्ञानात्मक जुड़ाव, खेल सटीकता व दिनचर्या का संपूर्ण विश्लेषण`,
      backBtn: "← मरीज़ सारांश पर वापस जाएं",
      tabBoth: "सभी विश्लेषण",
      tabEngagement: "सक्रिय मिनट",
      tabImprovement: "सुधार ग्राफ",
      weeklyActiveTitle: "साप्ताहिक सक्रिय मिनट",
      dailyAvgTitle: "दैनिक औसत जुड़ाव",
      accuracyByGameTitle: "खेल अनुसार सटीकता",
      clinicalCurveTitle: "४-सप्ताह का सुधार वक्र",
      clinicalNoteTitle: "चिकित्सीय अवलोकन नोट",
      targetExceededBadge: "लक्ष्य से अधिक (+१६%)",
      adherenceTitle: "दिनचर्या पालन दर"
    },
    common: {
      backToSummary: "← मरीज़ सारांश पर वापस जाएं",
      backToPatient: "मरीज़ डैशबोर्ड पर वापस जाएं",
      saveChanges: "बदलाव सुरक्षित करें",
      saved: "सुरक्षित हो गया!",
      liveStatus: "लाइव स्थिति"
    }
  },

  // -------------------------------------------------------------------------
  // 3. ASSAMESE (অসমীয়া)
  // -------------------------------------------------------------------------
  as: {
    nav: {
      portalBrand: "চাংপা",
      portalSubtitle: "যত্নশীল পৰ্টেল (Caregiver Portal)",
      options: {
        patient_profile: { number: "১.", label: "ৰোগীৰ বিৱৰণ", description: "ব্যক্তিগত বিৱৰণ, দিনচৰ্যা আৰু নিস্তব্ধ সময়" },
        knowledge_assistant: { number: "২.", label: "জ্ঞান সহায়ক", description: "ডিমেঞ্চিয়া যত্নৰ এআই পৰামৰ্শ" },
        memories: { number: "৩.", label: "স্মৃতি যোগ কৰক", description: "পৰিয়ালৰ ফটো, গল্প আৰু আপোনজন" },
        alerts: { number: "৪.", label: "সতৰ্কবাৰ্তা", description: "নোপোৱা ঔষধ, জৰুৰীকালীন সতৰ্কতা" },
        progress: { number: "৫.", label: "সাপ্তাহিক উন্নতিৰ গ্ৰাফ", description: "সক্ৰিয় মিনিট আৰু ৪ সপ্তাহৰ উন্নতি" }
      },
      switchToPatient: "ৰোগী ম'ডলৈ উভতি যাওক",
      activeAlertsCount: (count) => `${count} টা সক্ৰিয় সতৰ্কবাৰ্তা`,
      overview: "ৰোগীৰ সাৰাংশ",
      navigation: "নেভিগেচন",
      closeMenu: "মেনু বন্ধ কৰক",
      menu: "মেনু"
    },
    overview: {
      title: "ৰোগীৰ সাৰাংশ",
      subtitle: (name) => `${name}ৰ লাইভ স্বাস্থ্য আৰু স্থিতি নিৰীক্ষণ`,
      liveConnected: "লাইভ সংযুক্ত",
      currentCondition: "বৰ্তমান স্থিতি",
      ageLabel: (age) => `বয়স ${age} বছৰ`,
      conditionName: "মৃদু স্মৃতি বিভ্ৰম (MCI) - স্তৰ ২",
      doingWellBadge: "ভালে আছে",
      statusUpdateHeader: "যত্নশীল স্থিতিৰ আপডেট:",
      statusUpdateText: (name) => `${name} বৰ্তমান শান্ত, আনন্দিত আৰু কোঠাত আৰামেৰে বহি আছে। ঔষধ আৰু পানী সময়মতে লোৱা হৈছে, কোনো অস্বস্তিৰ লক্ষণ নাই।`,
      quickActionsTitle: "ক্ষিপ্ৰ যত্নমূলক কাৰ্যসমূহ",
      sendVoiceNudge: "চাংপা কণ্ঠৰে মৰমৰ বাৰ্তা পঠিয়াওক",
      voiceNudgeSent: "চাংপালৈ মৰমৰ বাৰ্তা পঠিওৱা হ'ল!",
      callPatient: "জৰুৰীকালীন কল / সংযোগ কৰক",
      viewRoutine: "ৰোগীৰ বিৱৰণ আৰু দিনচৰ্যা খোলক",
      todayStreamTitle: "আজিৰ লাইভ দিনচৰ্যা",
      todayStreamSubtitle: "নিৰ্ধাৰিত দিনচৰ্যা আৰু ঔষধৰ সময়",
      allTasksSynced: "সকলো কাম সময়মতে সম্পন্ন",
      deviceConnectivityTitle: "ডিভাইচ আৰু সংযোগ",
      onlineStatus: "ডিভাইচ অনলাইন",
      batteryStatus: (pct) => `বেটাৰী: ${pct}%`,
      lastSynced: "এইমাত্ৰ",
      completedBadge: "সম্পন্ন",
      upcomingBadge: "আহিবলগীয়া",
      noRemindersToday: "আজিৰ সকলো কাম সুকলমে সম্পন্ন হৈছে!"
    },
    profileSettings: {
      optionBadge: "বিকল্প ১",
      title: "১. ৰোগীৰ বিৱৰণ",
      subtitle: (name) => `${name}ৰ বাবে ব্যক্তিগত তথ্য, দিনচৰ্যা আৰু নিস্তব্ধ বিশ্ৰামৰ সময়`,
      backBtn: "← ৰোগী সাৰাংশলৈ উভতি যাওক",
      saveBtn: "পৰিৱৰ্তন সংৰক্ষণ কৰক",
      savedToast: "ৰোগীৰ পছন্দসমূহ সকলো চাংপা ডিভাইচত আপডেট কৰা হ'ল।",
      patientInfoTitle: "ৰোগীৰ তথ্য",
      legalNameLabel: "সম্পূৰ্ণ আইনী নাম",
      preferredNameLabel: "মতাৰ পছন্দৰ নাম",
      ageLabel: "বয়স",
      conditionLabel: "চিকিৎসাজনিত টোকা",
      languageTitle: "ভাষা আৰু সাংস্কৃতিক ৰূপ",
      languageSubtitle: "চাংপাৰ কণ্ঠ আৰু পাঠৰ বাবে প্ৰাথমিক ভাষা বাছক:",
      voicePersonaTitle: "কণ্ঠ আৰু অডিঅ' সঁহাৰি",
      voicePersonaSubtitle: "ইলেভেনলেবচ শিশু সঙ্গী আৰ্হিৰে পৰিচালিত চাংপা কণ্ঠ:",
      playEnglishSample: "ইংৰাজী কণ্ঠ নমুনা",
      stopAudio: "কণ্ঠ বন্ধ কৰক",
      playHindiSample: "হিন্দী সম্ভাষণ",
      voicePersonaName: "কণ্ঠ ৰূপ: সুহানা জে (আনন্দময়ী শিশু সঙ্গী)",
      voicePersonaDesc: (name) => `সুহানাৰ কণ্ঠ নাতিনীৰ দৰে মৰমিয়াল আৰু নিষ্পাপ—যিয়ে ${name}ক শান্ত প্ৰদান কৰে।`,
      soundTonesTitle: "শব্দৰ সুৰ আৰু সংবেদনশীলতা",
      soundTonesSubtitle: "শান্ত সুৰ বাছনি কৰক যিয়ে ভীতিৰ সৃষ্টি নকৰে:",
      gentleChimesLabel: "বাঁহৰ মৃদু সুৰ",
      gentleChimesDesc: "দৈনন্দিন কামৰ বাবে শান্ত ধ্বনি",
      templeBellLabel: "শান্ত মন্দিৰৰ ঘণ্টা",
      templeBellDesc: "পৰিচিত কাঁহৰ গম্ভীৰ ঘণ্টাৰ ধ্বনি",
      volumeLabel: "শব্দৰ মাত্ৰা",
      testChimeBtn: "সুৰ শুনক",
      quietHoursTitle: "নিস্তব্ধ বিশ্ৰামৰ সময় (Quiet Hours)",
      quietHoursSubtitle: "শান্ত সময়ছোৱাত টোপনিৰ ব্যাঘাত নঘটিবলৈ ঘণ্টাবোৰ বন্ধ থাকিব।",
      sleepStartLabel: "শোৱাৰ সময় (শব্দ ম্যুট)",
      morningWakeLabel: "জাগ্ৰত হোৱাৰ সময়",
      emergencyBypassLabel: "জৰুৰী সতৰ্কতাই শান্ত সময়কো অতিক্ৰম কৰিব।",
      commPrefTitle: "যোগাযোগৰ মাধ্যম",
      commPrefSubtitle: (name) => `${name}য়ে কেনেদৰে তথ্য সহজে বুজি পায়:`,
      commPrefs: {
        voice: { label: "কেৱল কণ্ঠস্বৰ", desc: "অডিঅ' নিৰ্দেশনা" },
        text: { label: "ডাঙৰ পাঠ", desc: "স্পষ্ট ডাঙৰ আখৰ" },
        pictures: { label: "ছবি আৰু প্ৰতীক", desc: "স্মৃতিৰ ছবি" },
        combined: { label: "কণ্ঠ + পাঠ + ছবি", desc: "উৎকৃষ্ট বহু-সংবেদী" }
      },
      selectedBadge: "নিৰ্বাচিত"
    },
    knowledgeAssistant: {
      optionBadge: "বিকল্প ২",
      title: "২. জ্ঞান সহায়ক",
      subtitle: "যত্নৰ কৌশল, দিনচৰ্যা আৰু ডিমেঞ্চিয়া সমৰ্থন সম্পৰ্কে যিকোনো প্ৰশ্ন সোধক",
      backBtn: "← ৰোগী সাৰাংশলৈ উভতি যাওক",
      assistantOnlineBadge: "সহায়ক অনলাইন (GPT-4o)",
      suggestedShortcutsTitle: "পৰামৰ্শিত প্ৰশ্নসমূহ",
      clearChatBtn: "বাৰ্তালাপ মচক",
      inputPlaceholder: "ৰোগীৰ যত্ন বা দিনচৰ্যা সম্পৰ্কে সোধক...",
      sendBtn: "প্ৰেৰণ কৰক",
      sourceOpenAI: "লাইভ এআই উত্তৰ",
      sourceFallback: "যত্নশীল জ্ঞান ভঁৰাল",
      listenAloud: "কণ্ঠৰে শুনক",
      stopAudio: "কণ্ঠ বন্ধ কৰক",
      copyTooltip: "বাৰ্তা কপি কৰক",
      copiedTooltip: "কপি হ'ল!",
      sampleQuestions: {
        status: "আজি ৰোগীৰ অৱস্থা কেনেকুৱা?",
        appointment: "ডাক্তৰৰ সৈতে পৰৱৰ্তী পৰামৰ্শ কেতিয়া?",
        games: "স্মৃতি খেলৰ নম্বৰসমূহ কি?",
        missed: "আজি কোনো ঔষধ বাদ পৰিছে নেকি?",
        sundowning: "গধূলিৰ বিভ্ৰান্তিৰ বাবে পৰামৰ্শ?",
        graphs: "এই সপ্তাহৰ উন্নতিৰ গ্ৰাফ দেখুৱাওক"
      }
    },
    memories: {
      optionBadge: "বিকল্প ৩",
      title: "৩. স্মৃতি যোগ কৰক",
      subtitle: "বিভ্ৰান্তিৰ সময়ত সান্ত্বনা দিবলৈ পৰিয়ালৰ ছবি আৰু গল্প সংৰক্ষণ কৰক",
      backBtn: "← ৰোগী সাৰাংশলৈ উভতি যাওক",
      addNewMemoryTitle: "নতুন স্মৃতি যোগ কৰক",
      memoryTitleLabel: "স্মৃতিৰ শিৰোনাম",
      relationshipLabel: "আপোনজন / সম্পৰ্ক",
      captionLabel: "গল্প আৰু বিৱৰণ",
      audioNoteLabel: "কণ্ঠ বাৰ্তা / অডিঅ'",
      locationLabel: "স্থান",
      dateLabel: "বছৰ বা ঋতু",
      saveMemoryBtn: "স্মৃতি এলবামলৈ যোগ কৰক",
      memorySavedToast: "নতুন স্মৃতি এলবামত যোগ কৰা হ'ল!",
      existingMemoriesTitle: (count) => `সংৰক্ষিত স্মৃতিসমূহ (${count})`,
      inFlashcardsBadge: "ফ্লেশকাৰ্ডত সক্ৰিয়",
      favoriteBadge: "প্ৰিয় স্মৃতি",
      listenStoryBtn: "গল্প শুনক",
      deleteBtn: "বাতিল কৰক"
    },
    alerts: {
      optionBadge: "বিকল্প ৪",
      title: "৪. যত্ন সতৰ্কতা আৰু সুৰক্ষা",
      subtitle: "নোপোৱা ঔষধ আৰু জৰুৰীকালীন অৱস্থাৰ ক্ষিপ্ৰ সূচনা",
      backBtn: "← ৰোগী সাৰাংশলৈ উভতি যাওক",
      urgentBadge: "জৰুৰী",
      needsAttentionBadge: "মনোযোগ দিয়ক",
      informationalBadge: "সাধাৰণ তথ্য",
      resolveBtn: "সমাধান হ'ল বুলি চিহ্নিত কৰক",
      resolvedBadge: "সমাধান হ'ল",
      contactPatientBtn: "ৰোগীৰ ডিভাইচলৈ সংযোগ কৰক",
      allClearTitle: "সকলো সুৰক্ষিত!",
      allClearSubtitle: "কোনো সতৰ্কবাৰ্তা বাকী নাই। ৰোগীৰ অৱস্থা সুস্থিৰ।",
      unreadCount: (count) => `${count} টা সক্ৰিয় সতৰ্কবাৰ্তা`
    },
    progress: {
      optionBadge: "বিকল্প ৫",
      title: "৫. সাপ্তাহিক উন্নতিৰ গ্ৰাফ",
      subtitle: (name) => `${name}ৰ মানসিক সক্ৰিয়তা আৰু দিনচৰ্যাৰ বিশ্লেষণ`,
      backBtn: "← ৰোগী সাৰাংশলৈ উভতি যাওক",
      tabBoth: "সকলো গ্ৰাফ",
      tabEngagement: "সক্ৰিয় সময়",
      tabImprovement: "উন্নতিৰ বক্ৰৰেখা",
      weeklyActiveTitle: "সাপ্তাহিক সক্ৰিয় মিনিট",
      dailyAvgTitle: "দৈনিক গড় সময়",
      accuracyByGameTitle: "খেল অনুযায়ী সঠিকতা",
      clinicalCurveTitle: "৪ সপ্তাহৰ উন্নতিৰ ৰেখা",
      clinicalNoteTitle: "চিকিৎসকৰ নিৰীক্ষণ টোকা",
      targetExceededBadge: "লক্ষ্যতকৈ অধিক (+১৬%)",
      adherenceTitle: "দিনচৰ্যা পালনৰ হাৰ"
    },
    common: {
      backToSummary: "← ৰোগী সাৰাংশলৈ উভতি যাওক",
      backToPatient: "ৰোগী ডেস্কব'ৰ্ডলৈ যাওক",
      saveChanges: "পৰিৱৰ্তন সংৰক্ষণ কৰক",
      saved: "সংৰক্ষিত!",
      liveStatus: "লাইভ স্থিতি"
    }
  },

  // -------------------------------------------------------------------------
  // 4. BENGALI (বাংলা)
  // -------------------------------------------------------------------------
  bn: {
    nav: {
      portalBrand: "সাংপা",
      portalSubtitle: "যত্নশীল পোর্টাল (Caregiver Portal)",
      options: {
        patient_profile: { number: "১.", label: "রোগীর বিবরণ", description: "ব্যক্তিগত তথ্য, রুটিন ও বিশ্রামের সময়" },
        knowledge_assistant: { number: "২.", label: "জ্ঞান সহায়ক", description: "এআই ডিমেনশিয়া যত্ন পরামর্শ" },
        memories: { number: "৩.", label: "স্মৃতি যোগ করুন", description: "পারিবারিক ছবি, গল্প ও প্রিয়জন" },
        alerts: { number: "৪.", label: "সতর্কবার্তা", description: "ছুটে যাওয়া ওষুধ, জরুরি নোটিস" },
        progress: { number: "৫.", label: "সাপ্তাহিক অগ্রগতি গ্রাফ", description: "সক্রিয় মিনিট ও ৪ সপ্তাহের গ্রাফ" }
      },
      switchToPatient: "রোগী মোডে ফিরে যান",
      activeAlertsCount: (count) => `${count} টি অমীমাংসিত সতর্কতা`,
      overview: "রোগীর সংক্ষিপ্ত বিবরণ",
      navigation: "যত্ন নেভিগেশন",
      closeMenu: "মেনু বন্ধ করুন",
      menu: "মেনু"
    },
    overview: {
      title: "রোগীর সংক্ষিপ্ত বিবরণ",
      subtitle: (name) => `${name}-এর রিয়েল-টাইম স্বাস্থ্য ও যত্ন পর্যবেক্ষণ`,
      liveConnected: "লাইভ সংযুক্ত",
      currentCondition: "বর্তমান অবস্থা",
      ageLabel: (age) => `বয়স ${age} বছর`,
      conditionName: "মৃদু স্মৃতিশক্তির দুর্বলতা (MCI) - পর্যায় ২",
      doingWellBadge: "ভালো আছেন",
      statusUpdateHeader: "যত্নশীল স্ট্যাটাস আপডেট:",
      statusUpdateText: (name) => `${name} বর্তমানে খুব শান্ত, উৎফুল্ল এবং নিজের ঘরে আরামে আছেন। সকালে জল ও রক্তচাপের ওষুধ সময়মতো নিয়েছেন, কোনো বিভ্রান্তি নেই।`,
      quickActionsTitle: "দ্রুত যত্নমূলক পদক্ষেপ",
      sendVoiceNudge: "সাংপা কণ্ঠে ভালোবাসার বার্তা পাঠান",
      voiceNudgeSent: "সাংপাতে ভালোবাসার বার্তা পৌঁছে গেছে!",
      callPatient: "জরুরি কল / রোগীর সাথে কথা বলুন",
      viewRoutine: "রোগীর বিবরণ ও সময়সূচী খুলুন",
      todayStreamTitle: "আজকের লাইভ যত্ন প্রবাহ",
      todayStreamSubtitle: "নির্ধারিত রুটিন এবং ওষুধের সময়সূচী",
      allTasksSynced: "সমস্ত কাজ সময়মতো সম্পন্ন",
      deviceConnectivityTitle: "ডিভাইস ও সংযোগ",
      onlineStatus: "ডিভাইস অনলাইন",
      batteryStatus: (pct) => `ব্যাটারি: ${pct}%`,
      lastSynced: "এইমাত্র",
      completedBadge: "সম্পন্ন",
      upcomingBadge: "আসন্ন",
      noRemindersToday: "আজকের সমস্ত রুটিন কাজ সফলভাবে সম্পন্ন হয়েছে!"
    },
    profileSettings: {
      optionBadge: "বিকল্প ১",
      title: "১. রোগীর বিবরণ",
      subtitle: (name) => `${name}-এর ব্যক্তিগত বিবরণ, রুটিন, বিশ্রামের সময় ও ভাষা`,
      backBtn: "← রোগীর সারাংশে ফিরে যান",
      saveBtn: "পরিবর্তন সংরক্ষণ করুন",
      savedToast: "রোগীর পছন্দসমূহ সফলভাবে সমস্ত ডিভাইসে আপডেট হয়েছে।",
      patientInfoTitle: "রোগীর তথ্য",
      legalNameLabel: "সম্পূর্ণ আইনি নাম",
      preferredNameLabel: "ডাকার পছন্দের নাম",
      ageLabel: "বয়স",
      conditionLabel: "চিকিৎসা সংক্রান্ত তথ্য",
      languageTitle: "ভাষা ও সাংস্কৃতিক রূপ",
      languageSubtitle: "সাংপার কণ্ঠ ও পাঠের জন্য প্রাথমিক ভাষা বেছে নিন:",
      voicePersonaTitle: "কণ্ঠ ও অডিও প্রতিক্রিয়া",
      voicePersonaSubtitle: "ইলেভেনল্যাবস বহুভাষিক শিশু মডেল দ্বারা চালিত কণ্ঠ:",
      playEnglishSample: "ইংরেজি ভয়েস নমুনা",
      stopAudio: "ভয়েস বন্ধ করুন",
      playHindiSample: "হিন্দি সম্ভাষণ",
      voicePersonaName: "ভয়েস পার্সোনা: সুহানা জে (আনন্দময়ী শিশু সঙ্গী)",
      voicePersonaDesc: (name) => `সুহানার কণ্ঠ নাতনির মতো মিষ্টি ও স্নেহময়—যা ${name}-কে মানসিক শান্তি দেয়।`,
      soundTonesTitle: "শব্দের সুর ও সংবেদনশীলতা",
      soundTonesSubtitle: "শান্ত মিষ্টি সুর বেছে নিন যা চমকে না দিয়ে মনে করিয়ে দেয়:",
      gentleChimesLabel: "বাঁশের মিষ্টি ঘণ্টার সুর",
      gentleChimesDesc: "দৈনন্দিন কাজের জন্য শান্ত সুর",
      templeBellLabel: "শান্ত মন্দিরের ঘণ্টা",
      templeBellDesc: "পরিচিত কাঁসার গম্ভীর ঘণ্টার সুর",
      volumeLabel: "শব্দের মাত্রা",
      testChimeBtn: "সুর শুনুন",
      quietHoursTitle: "বিশ্রামের শান্ত সময় (Quiet Hours)",
      quietHoursSubtitle: "শান্ত সময়ে গভীর ঘুমের জন্য অ্যালার্ম নীরব থাকবে।",
      sleepStartLabel: "ঘুমানোর সময় (অ্যালার্ম নীরব)",
      morningWakeLabel: "ওঠার সময়",
      emergencyBypassLabel: "জরুরি সতর্কতা শান্ত সময়েও বাজবে।",
      commPrefTitle: "যোগাযোগের পছন্দ",
      commPrefSubtitle: (name) => `${name} কীভাবে তথ্য সবচেয়ে ভালো বোঝেন:`,
      commPrefs: {
        voice: { label: "কেবল কণ্ঠস্বর", desc: "অডিও নির্দেশনা" },
        text: { label: "বড় লেখা", desc: "পরিষ্কার বড় হরফ" },
        pictures: { label: "ছবি ও প্রতীক", desc: "স্মৃতির ছবি" },
        combined: { label: "কণ্ঠ + লেখা + ছবি", desc: "সেরা বহু-সংবেদী" }
      },
      selectedBadge: "নির্বাচিত"
    },
    knowledgeAssistant: {
      optionBadge: "বিকল্প ২",
      title: "২. জ্ঞান সহায়ক (Knowledge Assistant)",
      subtitle: "যত্নের কৌশল, ডিমেনশিয়া সহায়তা ও রুটিন সম্পর্কিত যেকোনো প্রশ্ন জিজ্ঞাসা করুন",
      backBtn: "← রোগীর সারাংশে ফিরে যান",
      assistantOnlineBadge: "সহায়ক অনলাইন (GPT-4o)",
      suggestedShortcutsTitle: "প্রস্তাবিত প্রশ্নাবলী",
      clearChatBtn: "কথোপকথন মুছুন",
      inputPlaceholder: "রোগীর যত্ন সম্পর্কে কিছু জিজ্ঞাসা করুন...",
      sendBtn: "পাঠান",
      sourceOpenAI: "লাইভ এআই উত্তর",
      sourceFallback: "যত্নশীল জ্ঞান ভাণ্ডার",
      listenAloud: "শুনে নিন",
      stopAudio: "ভয়েস থামান",
      copyTooltip: "কপি করুন",
      copiedTooltip: "কপি সম্পন্ন!",
      sampleQuestions: {
        status: "আজ রোগী কেমন আছেন?",
        appointment: "ডাক্তারের সাথে পরের অ্যাপয়েন্টমেন্ট কবে?",
        games: "স্মৃতি খেলার ফলাফল কেমন?",
        missed: "আজ কোনো ওষুধ বাদ গেছে কি?",
        sundowning: "সন্ধ্যার বিভ্রান্তির জন্য পরামর্শ?",
        graphs: "এই সপ্তাহের অগ্রগতির গ্রাফ দেখান"
      }
    },
    memories: {
      optionBadge: "বিকল্প ৩",
      title: "৩. স্মৃতি যোগ করুন",
      subtitle: "বিভ্রান্তির সময় সান্ত্বনা দিতে পরিবারের ছবি ও প্রিয় গল্প সংরক্ষণ করুন",
      backBtn: "← রোগীর সারাংশে ফিরে যান",
      addNewMemoryTitle: "নতুন স্মৃতি যোগ করুন",
      memoryTitleLabel: "স্মৃতির নাম",
      relationshipLabel: "সম্পর্ক / ব্যক্তি",
      captionLabel: "গল্প ও প্রেক্ষাপট",
      audioNoteLabel: "ভয়েস নোট / অডিও",
      locationLabel: "স্থান",
      dateLabel: "বছর বা সময়",
      saveMemoryBtn: "অ্যালবামে যোগ করুন",
      memorySavedToast: "নতুন স্মৃতি অ্যালবামে যুক্ত হয়েছে!",
      existingMemoriesTitle: (count) => `সংরক্ষিত স্মৃতিসমূহ (${count})`,
      inFlashcardsBadge: "ফ্ল্যাশকার্ডে সক্রিয়",
      favoriteBadge: "প্রিয় স্মৃতি",
      listenStoryBtn: "গল্প শুনুন",
      deleteBtn: "মুছুন"
    },
    alerts: {
      optionBadge: "বিকল্প ৪",
      title: "৪. যত্ন সতর্কতা ও নিরাপত্তা",
      subtitle: "ছুটে যাওয়া ওষুধ ও জরুরি অবস্থার তাৎক্ষণিক তথ্য",
      backBtn: "← রোগীর সারাংশে ফিরে যান",
      urgentBadge: "জরুরি",
      needsAttentionBadge: "মনোযোগ দিন",
      informationalBadge: "তথ্যমূলক",
      resolveBtn: "সমাধান চিহ্নিত করুন",
      resolvedBadge: "সমাধান হয়েছে",
      contactPatientBtn: "রোগীর ডিভাইসে সংযুক্ত হন",
      allClearTitle: "সবকিছু নিরাপদ!",
      allClearSubtitle: "কোনো সতর্কতা নেই। রোগীর অবস্থা স্থিতিশীল।",
      unreadCount: (count) => `${count} টি সক্রিয় সতর্কতা`
    },
    progress: {
      optionBadge: "বিকল্প ৫",
      title: "৫. সাপ্তাহিক অগ্রগতি গ্রাফ",
      subtitle: (name) => `${name}-এর মানসিক সক্রিয়তা ও রুটিন পালনের সামগ্রিক গ্রাফ`,
      backBtn: "← রোগীর সারাংশে ফিরে যান",
      tabBoth: "সমস্ত গ্রাফ",
      tabEngagement: "সক্রিয় সময়",
      tabImprovement: "উন্নতির রেখা",
      weeklyActiveTitle: "সাপ্তাহিক সক্রিয় মিনিট",
      dailyAvgTitle: "দৈনিক গড় সময়",
      accuracyByGameTitle: "খেলা অনুযায়ী সঠিকতা",
      clinicalCurveTitle: "৪ সপ্তাহের উন্নতির রেখা",
      clinicalNoteTitle: "চিকিৎসকের পর্যবেক্ষণ নোট",
      targetExceededBadge: "লক্ষ্যমাত্রা ছাড়িয়েছে (+১৬%)",
      adherenceTitle: "রুটিন পালনের হার"
    },
    common: {
      backToSummary: "← রোগীর সারাংশে ফিরে যান",
      backToPatient: "রোগী ড্যাশবোর্ডে ফিরুন",
      saveChanges: "পরিবর্তন সংরক্ষণ করুন",
      saved: "সংরক্ষিত!",
      liveStatus: "লাইভ স্ট্যাটাস"
    }
  },

  // -------------------------------------------------------------------------
  // 5. MANIPURI (মৈতৈলোন্)
  // -------------------------------------------------------------------------
  mni: {
    nav: {
      portalBrand: "সাংপা",
      portalSubtitle: "শেন্নবগী পোর্তাল (Caregiver Portal)",
      options: {
        patient_profile: { number: "১.", label: "অনাবাগী মরোল", description: "অনাবাগী মরোল, মতম অমসুং পোথারবা" },
        knowledge_assistant: { number: "২.", label: "জ্ঞানগী মতেংপাংবা", description: "এআই ডিমেন্সিয়াগী পাউতাক" },
        memories: { number: "৩.", label: "নীংশিংবা হাপচিনবা", description: "ইমুংগী ফোতো অমসুং ৱারী" },
        alerts: { number: "৪.", label: "চেকশিনৱা", description: "হিদাক থকখিদ্রবা, চেকশিনবা" },
        progress: { number: "৫.", label: "চয়োলগী ফগৎলকপগী গ্রাফ", description: "মতম অমসুং ফগৎলকপগী চার্ত" }
      },
      switchToPatient: "অনাবাগী মোদতা হনবা",
      activeAlertsCount: (count) => `চেকশিনৱা ${count} লৈরি`,
      overview: "অনাবাগী অকুপ্পা ৱারোল",
      navigation: "নেভিগেশন",
      closeMenu: "মেনু থিংবা",
      menu: "মেনু"
    },
    overview: {
      title: "অনাবাগী অকুপ্পা ৱারোল",
      subtitle: (name) => `${name}গী হৌজিক ওইরিবা ফীভম য়েংশিনবা`,
      liveConnected: "লাইভ কন্নেক্তেদ",
      currentCondition: "হৌজিক্কী ফীভম",
      ageLabel: (age) => `চহি ${age}`,
      conditionName: "মৃদু স্মৃতি বিভ্রম (MCI) - তাংকক ২",
      doingWellBadge: "ফনা লৈরি",
      statusUpdateHeader: "শেন্নবগী পাউতাক:",
      statusUpdateText: (name) => `${name} হৌজিক কা অসিদা শান্তিনা অমসুং নুংঙাইনা লৈরি। অয়ুক্কী হিদাক অমসুং ঈশিং মতম চানা থকখ্রে, করিগুম্বা অৱাবা লৈত্ৰে।`,
      quickActionsTitle: "অথুবা থবকশিং",
      sendVoiceNudge: "সাংপাগী খোন্থোক্না নুংশিবা পাউজেল থাবা",
      voiceNudgeSent: "সাংপাদা পাউজেল থাখ্রে!",
      callPatient: "মরুওইবা কোল তৌবা / শম্নবা",
      viewRoutine: "অনাবাগী মতমগী চার্ত হাংদোকপা",
      todayStreamTitle: "ঙসিগী লাইভ থবকশিং",
      todayStreamSubtitle: "লেপখিবা মতমদা হিদাক অমসুং থবকশিং",
      allTasksSynced: "মতম চানা লোইশিনখ্রে",
      deviceConnectivityTitle: "দিভাইস অমসুং কন্নেক্সন",
      onlineStatus: "দিভাইস ওনলাইন",
      batteryStatus: (pct) => `বেত্তরি: ${pct}%`,
      lastSynced: "হৌজিকমক",
      completedBadge: "লোইশিনখ্রে",
      upcomingBadge: "লাক্কদবা",
      noRemindersToday: "ঙসিগী থবক খুদিংমক মপুং ফানা লোইশিনখ্রে!"
    },
    profileSettings: {
      optionBadge: "অপশন ১",
      title: "১. অনাবাগী মরোল",
      subtitle: (name) => `${name}গী ব্যক্তিগত মরোল, থবকশিং অমসুং লোন`,
      backBtn: "← অনাবাগী ৱারোলদা হনবা",
      saveBtn: "শেমদোকপা থমজিনবা",
      savedToast: "অনাবাগী পাম্বশিং দিভাইস পুম্নমক্তা অপদেত তৌখ্রে।",
      patientInfoTitle: "অনাবাগী পাউ",
      legalNameLabel: "অশেংবা মমিং",
      preferredNameLabel: "কৌবদা পাম্বা মমিং",
      ageLabel: "চহি",
      conditionLabel: "লাইনাগী মরোল",
      languageTitle: "লোন অমসুং কলচরেল পার্সোনা",
      languageSubtitle: "সাংপাগী খোন্থোক অমসুং লাইরিক্কী লোন খনবীয়ু:",
      voicePersonaTitle: "খোন্থোক অমসুং ওদিও",
      voicePersonaSubtitle: "ইলেভেনলেবস্ অঙ্গাংগী খোন্থোক্না শিজিন্নবা:",
      playEnglishSample: "ইংলিস খোন্থোক",
      stopAudio: "খোন্থোক লেপপা",
      playHindiSample: "হিন্দি খোন্থোক",
      voicePersonaName: "খোন্থোক: সুহানা জে (অঙ্গাং নুপীমচাগী খোন্থোক)",
      voicePersonaDesc: (name) => `সুহানাগী খোন্থোক অসি শুপ্নগী নুংশিরবা নাতৌনি—মদুনা ${name}বু শান্ত ওইহনগনি।`,
      soundTonesTitle: "খোন্থাংগী মখলশিং",
      soundTonesSubtitle: "অকুপ্পা অমসুং অরাইবা খোন্থাং খনবীয়ু:",
      gentleChimesLabel: "ৱাগী অরাইবা খোন্থাং",
      gentleChimesDesc: "থবকশিং নিংশিংনবা শান্ত ওইবা খোন্থাং",
      templeBellLabel: "লাইশঙগী ঘণ্টা",
      templeBellDesc: "খংনবা ঘণ্টা খোন্থাং",
      volumeLabel: "খোন্থাংগী কনবা",
      testChimeBtn: "খোন্থাং তাবীয়ু",
      quietHoursTitle: "পোথারবা মতম (Quiet Hours)",
      quietHoursSubtitle: "তুম্বগী মতমদা বেল খোন্থাং পুম্নমক লেপকনি।",
      sleepStartLabel: "তুম্বগী মতম",
      morningWakeLabel: "হৌগৎপগী মতম",
      emergencyBypassLabel: "মরুওইবা পাউ অদুনা তুম্বগী মতমদসু খংহনগনি।",
      commPrefTitle: "ৱাফম খংহনবগী মওং",
      commPrefSubtitle: (name) => `${name}না কমদৌনা লাইনা খংবগে:`,
      commPrefs: {
        voice: { label: "খোন্থোক খক্তা", desc: "ওদিও মতেং" },
        text: { label: "চাউবা ময়োক", desc: "অচৌবা ময়েক" },
        pictures: { label: "ফোতো অমসুং মশক", desc: "নীংশিংবা ফোতো" },
        combined: { label: "খোন্থোক + ময়োক + ফোতো", desc: "খ্বাইদগী ফবা" }
      },
      selectedBadge: "খল্লে"
    },
    knowledgeAssistant: {
      optionBadge: "অপশন ২",
      title: "২. জ্ঞানগী মতেংপাংবা",
      subtitle: "অনাবা য়েংশিনবগী পাউতাক অমসুং ডিমেন্সিয়াগী মতেং হংবীয়ু",
      backBtn: "← অনাবাগী ৱারোলদা হনবা",
      assistantOnlineBadge: "ওনলাইন লৈরে (GPT-4o)",
      suggestedShortcutsTitle: "হংবা য়াবা ৱাহংশিং",
      clearChatBtn: "ৱারী মচক",
      inputPlaceholder: "অনাবাগী মরমদা করিগুম্বা হংবীয়ু...",
      sendBtn: "হংবা",
      sourceOpenAI: "লাইভ এআই পাউখুম",
      sourceFallback: "জ্ঞান ভান্দার",
      listenAloud: "খোন্থোক্না তাবা",
      stopAudio: "লেপপা",
      copyTooltip: "কপি তৌবা",
      copiedTooltip: "কপি তৌরে!",
      sampleQuestions: {
        status: "ঙসি অনাবা অসি কমদৌরি?",
        appointment: "দাক্তরগা উনবা মতম করম্বনো?",
        games: "শান্নবগী স্কোরশিং করি লৈরে?",
        missed: "ঙসি হিদাক থকখিদবা লৈব্রা?",
        sundowning: "নুমিদাংগী ৱাখল থোইদোকপগী পাউতাক?",
        graphs: "চয়োলগী ফগৎলকপগী চার্ত তাকপীয়ু"
      }
    },
    memories: {
      optionBadge: "অপশন ৩",
      title: "৩. নীংশিংবা হাপচিনবা",
      subtitle: "ইমুংগী ফোতোশিং অমসুং ৱারীশিং থমজিনবা",
      backBtn: "← অনাবাগী ৱারোলদা হনবা",
      addNewMemoryTitle: "অনৌবা নীংশিংবা হাপচিনবা",
      memoryTitleLabel: "মমিং",
      relationshipLabel: "মরুপ-মপাং",
      captionLabel: "ৱারী অমসুং মরম",
      audioNoteLabel: "খোন্থোক্না রেকোর্দ তৌবা",
      locationLabel: "মফম",
      dateLabel: "চহি নত্রগা মতম",
      saveMemoryBtn: "এলবমদা হাপচিনবা",
      memorySavedToast: "অনৌবা নীংশিংবা হাপচিনখ্রে!",
      existingMemoriesTitle: (count) => `থমজিনখিবা নীংশিংবশিং (${count})`,
      inFlashcardsBadge: "ফ্লেশকার্দতা য়াওরে",
      favoriteBadge: "পামজবা নীংশিংবা",
      listenStoryBtn: "ৱারী তাবা",
      deleteBtn: "লৌথোকপা"
    },
    alerts: {
      optionBadge: "অপশন ৪",
      title: "৪. চেকশিনৱা অমসুং সুৰক্ষা",
      subtitle: "হিদাক থকখিদ্রবা অমসুং মরুওইবা পাউশিং",
      backBtn: "← অনাবাগী ৱারোলদা হনবা",
      urgentBadge: "য়াম্না মরুওই",
      needsAttentionBadge: "মীৎয়েং চনবীয়ু",
      informationalBadge: "পাউতাক",
      resolveBtn: "লোইশিনখ্রে তাকপা",
      resolvedBadge: "লোইশিনখ্রে",
      contactPatientBtn: "অনাবাগী দিভাইসতা শম্নবা",
      allClearTitle: "পুম্নমক শান্তিনা লৈরি!",
      allClearSubtitle: "করিগুম্বা চেকশিনৱা লৈত্ৰে। ফীভম শান্ত ওইরি।",
      unreadCount: (count) => `চেকশিনৱা ${count} লৈরি`
    },
    progress: {
      optionBadge: "অপশন ৫",
      title: "৫. চয়োলগী ফগৎলকপগী গ্রাফ",
      subtitle: (name) => `${name}গী ৱাখলগী ফগৎলকপা অমসুং থবক য়েংশিনবা`,
      backBtn: "← অনাবাগী ৱারোলদা হনবা",
      tabBoth: "গ্রাফ পুম্নমক",
      tabEngagement: "মতমগী চার্ত",
      tabImprovement: "ফগৎলকপগী চার্ত",
      weeklyActiveTitle: "চয়োলগী মিনিট",
      dailyAvgTitle: "নোংমগী চাংচৎ",
      accuracyByGameTitle: "শান্নবগী চপ চাবা",
      clinicalCurveTitle: "চহি ৪গী বক্ররেখা",
      clinicalNoteTitle: "দাক্তরগী পাউতাক",
      targetExceededBadge: "মপুং ফারে (+১৬%)",
      adherenceTitle: "থবক চৎনবগী চাং"
    },
    common: {
      backToSummary: "← অনাবাগী ৱারোলদা হনবা",
      backToPatient: "অনাবাগী মোদতা হনবা",
      saveChanges: "শেমদোকপা থমজিনবা",
      saved: "থামজিনখ্রে!",
      liveStatus: "লাইভ ফীভম"
    }
  },

  // -------------------------------------------------------------------------
  // 6. NAGAMESE (নাগামিজ)
  // -------------------------------------------------------------------------
  nag: {
    nav: {
      portalBrand: "SANGPA",
      portalSubtitle: "Caregiver Portal (সহায়তা পোর্টাল)",
      options: {
        patient_profile: { number: "1.", label: "Patient Laga Details", description: "Personal kotha, routine aru quiet hours" },
        knowledge_assistant: { number: "2.", label: "Knowledge Assistant", description: "AI dementia care advice aru help" },
        memories: { number: "3.", label: "Add Memories", description: "Family photo, story aru apun manu" },
        alerts: { number: "4.", label: "Alerts", description: "Missed dawa, emergency notices" },
        progress: { number: "5.", label: "Weekly Improvement Graph", description: "Active minutes aru 4-week graph" }
      },
      switchToPatient: "Patient Mode te jabi",
      activeAlertsCount: (count) => `${count} ta Alert baaki asey`,
      overview: "Patient Summary",
      navigation: "Care Navigation",
      closeMenu: "Menu Bondho koribi",
      menu: "Menu"
    },
    overview: {
      title: "Patient Summary",
      subtitle: (name) => `${name} laga live condition aru care`,
      liveConnected: "Live Connected",
      currentCondition: "Current Condition",
      ageLabel: (age) => `Umar ${age} saal`,
      conditionName: "Mild Cognitive Impairment (MCI) - Stage 2",
      doingWellBadge: "Bhal asey",
      statusUpdateHeader: "Caregiver Status Update:",
      statusUpdateText: (name) => `${name} eity calm aru khushi asey, room te aaram pora bohi asey. Paani aru dawa time te khailoise, kiba tension ba problem nai.`,
      quickActionsTitle: "Quick Actions",
      sendVoiceNudge: "Sangpa Voice pora Morom Nudge Pathabi",
      voiceNudgeSent: "Voice Nudge Pathai dise!",
      callPatient: "Emergency Call / Connect koribi",
      viewRoutine: "Patient Details & Routine khulibi",
      todayStreamTitle: "Aji Laga Live Care Stream",
      todayStreamSubtitle: "Time table aru dawa tracking",
      allTasksSynced: "Sob task time te asey",
      deviceConnectivityTitle: "Device & Net Connection",
      onlineStatus: "Device Online",
      batteryStatus: (pct) => `Battery: ${pct}%`,
      lastSynced: "Just now",
      completedBadge: "Done",
      upcomingBadge: "Upcoming",
      noRemindersToday: "Aji laga sob kaam bhal pora hoise!"
    },
    profileSettings: {
      optionBadge: "Option 1",
      title: "1. Patient Details",
      subtitle: (name) => `${name} laga personal details, routine schedule aru bhasha`,
      backBtn: "← Patient Summary te jabi",
      saveBtn: "Save Changes",
      savedToast: "Patient preference sob Sangpa device te update hoise.",
      patientInfoTitle: "Patient Information",
      legalNameLabel: "Pura Naam",
      preferredNameLabel: "Maatibo laga Bhal Naam",
      ageLabel: "Umar",
      conditionLabel: "Medical Condition / Notes",
      languageTitle: "Bhasha aru Cultural Voice",
      languageSubtitle: "Sangpa voice aru text karone primary language chunibi:",
      voicePersonaTitle: "Voice & Audio Feedback",
      voicePersonaSubtitle: "ElevenLabs child voice model logote choli asey:",
      playEnglishSample: "English Sample (Suhana)",
      stopAudio: "Awaaz Rokhbi",
      playHindiSample: "Hindi Greeting (Sangpa)",
      voicePersonaName: "Voice Persona: Suhana J (Young Child Companion)",
      voicePersonaDesc: (name) => `Suhana laga voice morom bacha nisina asey—${name} ke bhal lagibo.`,
      soundTonesTitle: "Sound Tones & Bells",
      soundTonesSubtitle: "Gentle sound chunibi jitu pora bhoy na khabo:",
      gentleChimesLabel: "Bamboo Chimes",
      gentleChimesDesc: "Soft and calm sound reminder karone",
      templeBellLabel: "Temple Bell",
      templeBellDesc: "Familiar bronze ghanti laga awaaz",
      volumeLabel: "Chime Volume",
      testChimeBtn: "Sound sunibi",
      quietHoursTitle: "Quiet Resting Hours",
      quietHoursSubtitle: "Shanti pora ghumabo karone ghanti bondho thakibo.",
      sleepStartLabel: "Ghumowa Time (Mute)",
      morningWakeLabel: "Utha Time",
      emergencyBypassLabel: "Emergency alert toh quiet hours te bhi bajibo.",
      commPrefTitle: "Communication Preference",
      commPrefSubtitle: (name) => `${name} kineka bhal bujhi pai:`,
      commPrefs: {
        voice: { label: "Koli Voice", desc: "Audio guidance" },
        text: { label: "Dangor Text", desc: "Bold typography" },
        pictures: { label: "Photo aru Pictures", desc: "Memory photos" },
        combined: { label: "Voice + Text + Pictures", desc: "Recommended" }
      },
      selectedBadge: "Selected"
    },
    knowledgeAssistant: {
      optionBadge: "Option 2",
      title: "2. Knowledge Assistant",
      subtitle: "Caregiving, routine logs aru dementia support kotha hudhibi",
      backBtn: "← Patient Summary te jabi",
      assistantOnlineBadge: "Assistant Online (GPT-4o)",
      suggestedShortcutsTitle: "Suggested Questions",
      clearChatBtn: "Chat Clear koribi",
      inputPlaceholder: "Patient care laga kiba bhi hudhibi...",
      sendBtn: "Send",
      sourceOpenAI: "Live AI Answer",
      sourceFallback: "Caregiver Database",
      listenAloud: "Suni lobi",
      stopAudio: "Stop Voice",
      copyTooltip: "Copy koribi",
      copiedTooltip: "Copied!",
      sampleQuestions: {
        status: "Aji patient kineka asey?",
        appointment: "Doctor logot next appointment ketiya asey?",
        games: "Games laga score kineka asey?",
        missed: "Aji kiba dawa miss hoise naki?",
        sundowning: "Ghulap time confusion laga tips?",
        graphs: "Weekly improvement graph dikhabi"
      }
    },
    memories: {
      optionBadge: "Option 3",
      title: "3. Add Memories",
      subtitle: "Confusion time te comfort dibo karone family photo aru story rakhbi",
      backBtn: "← Patient Summary te jabi",
      addNewMemoryTitle: "New Family Memory Add koribi",
      memoryTitleLabel: "Memory Title",
      relationshipLabel: "Relationship / Manu",
      captionLabel: "Story & Details",
      audioNoteLabel: "Voice Note",
      locationLabel: "Place / Location",
      dateLabel: "Year ba Season",
      saveMemoryBtn: "Album te Add koribi",
      memorySavedToast: "New memory add hoise!",
      existingMemoriesTitle: (count) => `Saved Family Memories (${count})`,
      inFlashcardsBadge: "Active in Flashcards",
      favoriteBadge: "Favorite",
      listenStoryBtn: "Story Sunibi",
      deleteBtn: "Remove"
    },
    alerts: {
      optionBadge: "Option 4",
      title: "4. Care Alerts & Safety",
      subtitle: "Missed dawa aru emergency notices live tracking",
      backBtn: "← Patient Summary te jabi",
      urgentBadge: "URGENT",
      needsAttentionBadge: "Needs Attention",
      informationalBadge: "Info",
      resolveBtn: "Resolve koribi",
      resolvedBadge: "Resolved",
      contactPatientBtn: "Patient logot connect koribi",
      allClearTitle: "Sob Safety Clear asey!",
      allClearSubtitle: "Kiba alert baaki nai. Patient stable asey.",
      unreadCount: (count) => `${count} ta Alert baaki asey`
    },
    progress: {
      optionBadge: "Option 5",
      title: "5. Weekly Improvement Graph",
      subtitle: (name) => `${name} laga engagement aru cognitive score`,
      backBtn: "← Patient Summary te jabi",
      tabBoth: "Sob Graphs",
      tabEngagement: "Active Time",
      tabImprovement: "Improvement",
      weeklyActiveTitle: "Weekly Active Minutes",
      dailyAvgTitle: "Daily Average Engagement",
      accuracyByGameTitle: "Accuracy by Game",
      clinicalCurveTitle: "4-Week Improvement Curve",
      clinicalNoteTitle: "Doctor Observation",
      targetExceededBadge: "Target Exceeded (+16%)",
      adherenceTitle: "Routine Follow Rate"
    },
    common: {
      backToSummary: "← Patient Summary te jabi",
      backToPatient: "Patient Dashboard te jabi",
      saveChanges: "Save Changes",
      saved: "Saved!",
      liveStatus: "Live Status"
    }
  },

  // -------------------------------------------------------------------------
  // 7. SPANISH (Español)
  // -------------------------------------------------------------------------
  es: {
    nav: {
      portalBrand: "SANGPA",
      portalSubtitle: "Portal del Cuidador",
      options: {
        patient_profile: { number: "1.", label: "Detalles del Paciente", description: "Datos personales, rutina y horas de descanso" },
        knowledge_assistant: { number: "2.", label: "Asistente de Conocimiento", description: "Consejos de IA para el cuidado de la demencia" },
        memories: { number: "3.", label: "Añadir Recuerdos", description: "Fotos familiares, historias y seres queridos" },
        alerts: { number: "4.", label: "Alertas y Avisos", description: "Medicamentos omitidos y alertas de emergencia" },
        progress: { number: "5.", label: "Gráfico de Mejora Semanal", description: "Minutos activos y curvas cognitivas de 4 semanas" }
      },
      switchToPatient: "Volver al Modo Paciente",
      activeAlertsCount: (count) => `${count} Alerta${count === 1 ? '' : 's'} sin resolver`,
      overview: "Resumen del Paciente",
      navigation: "Navegación de Cuidados",
      closeMenu: "Cerrar Menú",
      menu: "Menú"
    },
    overview: {
      title: "Resumen del Paciente",
      subtitle: (name) => `Estado en vivo y monitoreo de cuidados para ${name}`,
      liveConnected: "Conectado en Vivo",
      currentCondition: "Condición Actual",
      ageLabel: (age) => `Edad: ${age} años`,
      conditionName: "Deterioro Cognitivo Leve (DCL) - Etapa 2",
      doingWellBadge: "Muy Bien",
      statusUpdateHeader: "Actualización de Estado del Cuidador:",
      statusUpdateText: (name) => `${name} se encuentra actualmente tranquila, alegre y descansando plácidamente en su habitación. La hidratación y los medicamentos matutinos se tomaron a tiempo y no presenta signos de malestar.`,
      quickActionsTitle: "Acciones Rápidas",
      sendVoiceNudge: "Enviar Mensaje de Cariño con Voz de Sangpa",
      voiceNudgeSent: "¡Mensaje enviado a Sangpa!",
      callPatient: "Llamada de Emergencia / Conectar",
      viewRoutine: "Ver Rutina y Detalles del Paciente",
      todayStreamTitle: "Flujo de Cuidados de Hoy",
      todayStreamSubtitle: "Horarios sincronizados y cumplimiento de medicación",
      allTasksSynced: "Tareas Sincronizadas",
      deviceConnectivityTitle: "Dispositivo y Conectividad",
      onlineStatus: "Dispositivo En Línea",
      batteryStatus: (pct) => `Batería: ${pct}%`,
      lastSynced: "Justo ahora",
      completedBadge: "Completado",
      upcomingBadge: "Programado",
      noRemindersToday: "¡Todas las tareas programadas para hoy se han completado con éxito!"
    },
    profileSettings: {
      optionBadge: "Opción 1",
      title: "1. Detalles del Paciente",
      subtitle: (name) => `Datos personales, horarios, tonos y descanso para ${name}`,
      backBtn: "← Volver al Resumen del Paciente",
      saveBtn: "Guardar Cambios",
      savedToast: "Preferencias del paciente actualizadas en todos los dispositivos SANGPA.",
      patientInfoTitle: "Información del Paciente",
      legalNameLabel: "Nombre Completo Legal",
      preferredNameLabel: "Nombre de Preferencia (usado en voz y saludos)",
      ageLabel: "Edad",
      conditionLabel: "Condición Médica y Notas",
      languageTitle: "Idioma y Persona Cultural",
      languageSubtitle: "Seleccione el idioma principal para la voz y texto de Sangpa:",
      voicePersonaTitle: "Voz y Respuesta de Audio",
      voicePersonaSubtitle: "Voz infantil de Sangpa impulsada por ElevenLabs Multilingual:",
      playEnglishSample: "Muestra en Inglés (Suhana)",
      stopAudio: "Detener Voz",
      playHindiSample: "Saludo en Hindi",
      voicePersonaName: "Persona de Voz: Suhana J (Compañera Infantil Alegre)",
      voicePersonaDesc: (name) => `La voz de Suhana es tierna, dulce e inocente, brindando calidez a ${name} como una nieta querida.`,
      soundTonesTitle: "Tonos y Sensibilidad Auditiva",
      soundTonesSubtitle: "Elija melodías suaves que guíen sin asustar:",
      gentleChimesLabel: "Campanas Suaves de Bambú",
      gentleChimesDesc: "Sonido acústico para recordatorios cotidianos",
      templeBellLabel: "Campana Serena",
      templeBellDesc: "Tono cálido de bronce resonante y familiar",
      volumeLabel: "Volumen del Tono",
      testChimeBtn: "Escuchar Tono",
      quietHoursTitle: "Horas de Descanso y Tranquilidad (Quiet Hours)",
      quietHoursSubtitle: "Durante estas horas, los timbres se silencian para proteger el sueño profundo.",
      sleepStartLabel: "Hora de Dormir (Silenciar)",
      morningWakeLabel: "Hora de Despertar",
      emergencyBypassLabel: "Las alertas de emergencia sonarán incluso en horas de silencio.",
      commPrefTitle: "Preferencia de Comunicación",
      commPrefSubtitle: (name) => `Cómo comprende mejor la información ${name}:`,
      commPrefs: {
        voice: { label: "Solo Voz Hablada", desc: "Orientación auditiva" },
        text: { label: "Texto Grande", desc: "Tipografía clara y grande" },
        pictures: { label: "Imágenes Visuales", desc: "Iconos y fotos de recuerdos" },
        combined: { label: "Voz + Texto + Imágenes", desc: "Multisensorial recomendado" }
      },
      selectedBadge: "Seleccionado"
    },
    knowledgeAssistant: {
      optionBadge: "Opción 2",
      title: "2. Asistente de Conocimiento",
      subtitle: "Pregunte sobre estrategias de cuidado, registros y apoyo en demencia",
      backBtn: "← Volver al Resumen del Paciente",
      assistantOnlineBadge: "Asistente En Línea (GPT-4o)",
      suggestedShortcutsTitle: "Preguntas y Accesos Directos",
      clearChatBtn: "Limpiar Conversación",
      inputPlaceholder: "Pregunte al Asistente Sangpa sobre el cuidado...",
      sendBtn: "Enviar",
      sourceOpenAI: "Respuesta de IA en Vivo",
      sourceFallback: "Base de Cuidados",
      listenAloud: "Escuchar en Voz Alta",
      stopAudio: "Detener Voz",
      copyTooltip: "Copiar Mensaje",
      copiedTooltip: "¡Copiado!",
      sampleQuestions: {
        status: "¿Cómo está el paciente hoy?",
        appointment: "¿Cuándo es la próxima cita médica?",
        games: "¿Cuáles son sus puntuaciones en los juegos cognitivos?",
        missed: "¿Se omitió algún medicamento hoy?",
        sundowning: "¿Consejos para la confusión vespertina (sundowning)?",
        graphs: "Mostrar gráficos de mejora de esta semana"
      }
    },
    memories: {
      optionBadge: "Opción 3",
      title: "3. Añadir Recuerdos",
      subtitle: "Gestione fotos familiares e historias para confortar al paciente en momentos de confusión",
      backBtn: "← Volver al Resumen del Paciente",
      addNewMemoryTitle: "Añadir Nuevo Recuerdo Familiar",
      memoryTitleLabel: "Título del Recuerdo",
      relationshipLabel: "Persona / Parentesco",
      captionLabel: "Historia y Contexto",
      audioNoteLabel: "Nota de Voz / Audio",
      locationLabel: "Lugar",
      dateLabel: "Año o Época",
      saveMemoryBtn: "Guardar en el Álbum Familiar",
      memorySavedToast: "¡Nuevo recuerdo añadido al álbum!",
      existingMemoriesTitle: (count) => `Recuerdos Familiares Guardados (${count})`,
      inFlashcardsBadge: "Activo en Tarjetas de Memoria",
      favoriteBadge: "Favorito",
      listenStoryBtn: "Escuchar Historia",
      deleteBtn: "Eliminar"
    },
    alerts: {
      optionBadge: "Opción 4",
      title: "4. Alertas y Seguridad",
      subtitle: "Notificaciones en tiempo real para medicamentos omitidos y emergencias",
      backBtn: "← Volver al Resumen del Paciente",
      urgentBadge: "URGENTE",
      needsAttentionBadge: "Atención Necesaria",
      informationalBadge: "Informativo",
      resolveBtn: "Marcar Resuelto",
      resolvedBadge: "Resuelto",
      contactPatientBtn: "Conectar con Dispositivo del Paciente",
      allClearTitle: "¡Todo Despejado y Seguro!",
      allClearSubtitle: "No hay alertas pendientes. El paciente está estable.",
      unreadCount: (count) => `${count} Alerta${count === 1 ? '' : 's'} Activa${count === 1 ? '' : 's'}`
    },
    progress: {
      optionBadge: "Opción 5",
      title: "5. Gráfico de Mejora Semanal",
      subtitle: (name) => `Tendencias cognitivas, precisión en juegos y adherencia para ${name}`,
      backBtn: "← Volver al Resumen del Paciente",
      tabBoth: "Todos los Gráficos",
      tabEngagement: "Minutos Activos",
      tabImprovement: "Curvas de Mejora",
      weeklyActiveTitle: "Minutos Activos Semanales",
      dailyAvgTitle: "Promedio Diario",
      accuracyByGameTitle: "Precisión por Juego",
      clinicalCurveTitle: "Curva de Mejora de 4 Semanas",
      clinicalNoteTitle: "Nota de Observación Clínica",
      targetExceededBadge: "Objetivo Superado (+16%)",
      adherenceTitle: "Tasa de Adherencia"
    },
    common: {
      backToSummary: "← Volver al Resumen del Paciente",
      backToPatient: "Volver al Tablero del Paciente",
      saveChanges: "Guardar Cambios",
      saved: "¡Guardado!",
      liveStatus: "Estado en Vivo"
    }
  }
};

export function getCaregiverI18n(lang?: LanguageCode): LocalizedCaregiverUI {
  if (lang && CAREGIVER_I18N[lang]) {
    return CAREGIVER_I18N[lang];
  }
  return CAREGIVER_I18N.en;
}
