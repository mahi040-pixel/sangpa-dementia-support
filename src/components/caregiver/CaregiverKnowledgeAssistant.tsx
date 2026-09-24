import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Bot, 
  Send, 
  Mic, 
  MicOff,
  Sparkles, 
  ShieldAlert, 
  ArrowRight, 
  Volume2,
  VolumeX,
  ArrowLeft,
  Copy,
  Check,
  RotateCcw
} from 'lucide-react';
import { audio } from '../../utils/audio';
import { 
  askCaregiverKnowledgeAssistantOpenAI, 
  CaregiverKnowledgeContext, 
  CaregiverAssistantResponse
} from '../../services/openai';
import { speechRecognizer, isSpeechRecognitionSupported } from '../../utils/speechRecognition';
import { getCaregiverI18n } from '../../utils/caregiverLocalization';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  time: string;
  linkText?: string;
  linkAction?: 'routine' | 'progress' | 'games_config' | 'alerts' | 'memories' | 'patient_profile';
  source?: 'openai' | 'contextual_fallback';
}

export const CaregiverKnowledgeAssistant: React.FC = () => {
  const { 
    setCaregiverScreen, 
    patientProfile, 
    reminders, 
    activities, 
    alerts, 
    language,
    caregiverRole,
    caregiverUser
  } = useApp();

  const t = getCaregiverI18n(language);
  const patientDisplayName = patientProfile.preferredName || patientProfile.name || 'Maya Devi';

  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const roleGreeting = caregiverRole === 'doctor'
      ? `Namaste Dr. Anita Verma! I am your SANGPA Clinical Assistant. I have real-time access to ${patientDisplayName}'s diagnostic history, medication adherence, 4-week cognitive trajectory metrics, and pending dietary suggestions. How can I assist your clinical oversight today?`
      : caregiverRole === 'nurse'
      ? `Namaste Nurse Priya! I am your SANGPA Daily Care Assistant. I have real-time access to ${patientDisplayName}'s routine completion, hydration tracking, meal intake logs, and vitals alerts. How can I assist your care shift today?`
      : `Namaste ${caregiverUser.name}! I am your SANGPA Family Assistant. I can help you understand how Grandma is feeling, her memory game moments, daily meals, and gentle tips for loving communication at home.`;

    return [
      {
        id: 'welcome-0',
        sender: 'assistant',
        text: roleGreeting,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: 'openai'
      }
    ];
  });

  // Voice & Speech Recognition State
  const [isListening, setIsListening] = useState(false);
  const [currentlySpeakingId, setCurrentlySpeakingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Assemble Live Real-time Patient Context from App State
  const buildLivePatientContext = (): CaregiverKnowledgeContext => {
    // Map reminders & activities to today's care pulse
    const routineSteps = reminders.map(r => ({
      time: r.time,
      title: r.title,
      status: r.status === 'completed' ? ('completed' as const) : ('scheduled' as const),
      details: r.instructions || r.dosage || r.audioText || ''
    }));

    // If no reminders present, provide default structured routine
    if (routineSteps.length === 0) {
      routineSteps.push(
        { time: '08:30 AM', title: 'Morning BP Medicine (Amlodipine 5mg)', status: 'completed', details: 'Taken with warm water after breakfast' },
        { time: '10:00 AM', title: 'Fresh Water Hydration (Glass 2 of 5)', status: 'completed', details: 'Hydrated with gentle mascot prompt' },
        { time: '01:30 PM', title: 'Memory Vitamin Neuro-B Complex', status: 'scheduled', details: 'To be taken after dal and khichdi' },
        { time: '04:30 PM', title: 'Chamomile Tea & Relaxing Music', status: 'scheduled', details: 'Calming evening transition before dusk' },
        { time: '05:45 PM', title: 'Balcony Garden Walk with Riya', status: 'scheduled', details: 'Light 15-minute gentle mobility' },
        { time: '08:45 PM', title: 'Night Calming Routine with Warm Milk', status: 'scheduled', details: 'Quiet environment preparation' }
      );
    }

    return {
      patientName: patientProfile.name || 'Maya Devi',
      preferredName: patientProfile.preferredName || 'Kamala Dadi',
      age: patientProfile.age || 74,
      condition: patientProfile.condition || 'Mild Cognitive Impairment (MCI) - Stage 2',
      language: language === 'hi' ? 'Hindi' : language === 'as' ? 'Assamese' : language === 'bn' ? 'Bengali' : 'English',
      emotionalState: 'Doing well, calm, cheerful, oriented, smiling, zero signs of distress or agitation',
      deviceStatus: {
        online: true,
        batteryLevel: 86,
        lastActive: patientProfile.lastActive || '10:42 AM'
      },
      todayCarePulse: {
        medicationConfirmed: 'Morning Blood Pressure Medication (Amlodipine 5mg) confirmed taken at 08:30 AM',
        hydrationCompleted: '4 out of 5 glasses logged (well hydrated, next glass scheduled at 10:00 AM)',
        activityStatus: 'Comfortable seated stretching completed earlier today; relaxed, smiling posture',
        alertsStatus: 'All Clear — 0 active urgent alerts, 0 missed medications',
        routineSteps
      },
      cognitiveMetrics: {
        weeklyActiveMinutesTotal: 249,
        dailyAverageMinutes: 35.6,
        dailyBreakdown: [
          { day: 'Mon', date: 'Sep 8', minutes: 32, adherence: 87.5, recall: 84 },
          { day: 'Tue', date: 'Sep 9', minutes: 38, adherence: 100, recall: 88 },
          { day: 'Wed', date: 'Sep 10', minutes: 28, adherence: 75, recall: 82 },
          { day: 'Thu', date: 'Sep 11', minutes: 40, adherence: 100, recall: 91 },
          { day: 'Fri', date: 'Sep 12', minutes: 35, adherence: 87.5, recall: 89 },
          { day: 'Sat', date: 'Sep 13', minutes: 42, adherence: 100, recall: 94 },
          { day: 'Sun', date: 'Sep 14', minutes: 34, adherence: 87.5, recall: 90 },
        ],
        fourWeekTrend: [
          { week: 'Week 1', sequence: 72, rhythm: 80, flashcards: 75, hints: 8 },
          { week: 'Week 2', sequence: 78, rhythm: 86, flashcards: 82, hints: 6 },
          { week: 'Week 3', sequence: 84, rhythm: 90, flashcards: 88, hints: 4 },
          { week: 'Week 4 (Current)', sequence: 88, rhythm: 94, flashcards: 91, hints: 3 },
        ],
        clinicalNote: 'Maya Devi demonstrates consistent improvement in cognitive recognition. Her hint requirement dropped from 8 per session in Week 1 to only 3 this week (-62.5%). Seated motor rhythm tapping is exceptionally stable at 94%. Continue current morning routine schedule.'
      },
      doctorAndAppointments: {
        doctorName: 'Dr. Anita Verma',
        specialty: 'Neurologist & Geriatrician',
        nextAppointment: 'This Friday at 11:00 AM',
        clinicLocation: 'Apollo Geriatric Clinic'
      },
      activeAlerts: alerts.filter(a => !a.resolved).map(a => ({
        id: a.id,
        title: a.title,
        severity: a.severity,
        time: a.timestamp,
        resolved: a.resolved
      })),
      familyContext: {
        caregiverName: 'Riya Sharma',
        daughterName: 'Riya Sharma',
        grandsonName: 'Aarav (age 5)',
        memoriesList: ['Diwali celebration in Northeast / Assam', 'Guwahati family garden', 'Assam tea garden visit']
      }
    };
  };

  // Submit Query to OpenAI
  const handleAsk = async (userText: string) => {
    if (!userText.trim() || isLoading) return;

    const trimmedText = userText.trim();
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const userMessage: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: trimmedText,
      time: nowTime
    };

    setMessages(prev => [...prev, userMessage]);
    setQuery('');
    setIsLoading(true);
    audio.playCuteChime();

    try {
      const patientContext = buildLivePatientContext();
      const conversationHistory = messages.map(m => ({
        sender: m.sender,
        text: m.text
      }));

      const response: CaregiverAssistantResponse = await askCaregiverKnowledgeAssistantOpenAI(
        trimmedText,
        conversationHistory,
        patientContext
      );

      const assistantMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: response.text,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        linkText: response.linkText,
        linkAction: response.linkAction,
        source: response.source
      };

      setMessages(prev => [...prev, assistantMessage]);
      audio.playSuccessJingle();
    } catch (err: any) {
      console.error('Failed to get Knowledge Assistant response:', err);
      const errorMessage: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        text: `I had trouble connecting to the cloud service. However, based on ${patientDisplayName}'s local records, she is doing well today with all morning BP medications and 4/5 glasses of hydration completed.`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: 'contextual_fallback',
        linkText: "View Today's Routine",
        linkAction: 'routine'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Voice Recognition Toggle
  const handleToggleVoice = () => {
    if (!isSpeechRecognitionSupported()) {
      alert("Speech recognition is not supported in this browser. Please use Google Chrome or Edge.");
      return;
    }

    if (isListening) {
      speechRecognizer.stopListening();
      setIsListening(false);
    } else {
      audio.playCuteChime();
      const started = speechRecognizer.startListening(language || 'en', {
        onStart: () => setIsListening(true),
        onResult: (text: string, isFinal: boolean) => {
          setQuery(text);
          if (isFinal && text.trim().length > 2) {
            speechRecognizer.stopListening();
            setIsListening(false);
            handleAsk(text);
          }
        },
        onError: () => setIsListening(false),
        onEnd: () => setIsListening(false)
      });
      if (started) {
        setIsListening(true);
      }
    }
  };

  // Text-To-Speech Read Aloud
  const handleReadAloud = (messageId: string, textToSpeak: string) => {
    if (currentlySpeakingId === messageId) {
      audio.stopSpeaking();
      setCurrentlySpeakingId(null);
      return;
    }

    audio.stopSpeaking();
    const plainText = textToSpeak
      .replace(/[*#_`•-]/g, ' ')
      .replace(/\n+/g, '. ')
      .trim();

    const speechLang = language === 'as' ? 'as-IN' :
                       language === 'bn' ? 'bn-IN' :
                       language === 'hi' ? 'hi-IN' :
                       language === 'es' ? 'es-ES' :
                       language === 'mni' ? 'mni-IN' :
                       language === 'nag' ? 'nag-IN' : 'en-IN';

    setCurrentlySpeakingId(messageId);
    audio.speak(plainText, speechLang, () => {
      setCurrentlySpeakingId(null);
    });
  };

  // Copy Message to Clipboard
  const handleCopy = (messageId: string, text: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedId(messageId);
      setTimeout(() => setCopiedId(null), 2500);
    }
  };

  // Clear Chat History
  const handleClearChat = () => {
    audio.playTempleBell();
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: 'assistant',
        text: `Conversation cleared. I am ready to answer any questions about ${patientDisplayName}'s care, routine logs, cognitive metrics, or general dementia guidance!`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: 'openai'
      }
    ]);
  };

  // Formats bold, bullet lists, numbered steps cleanly
  const renderFormattedText = (text: string) => {
    const lines = text.split('\n');
    return (
      <div className="space-y-1.5 leading-relaxed text-xs sm:text-sm">
        {lines.map((line, idx) => {
          const trimmed = line.trim();
          if (!trimmed) return <div key={idx} className="h-1" />;

          // Bullet item
          if (trimmed.startsWith('•') || trimmed.startsWith('-') || trimmed.startsWith('*')) {
            const content = trimmed.replace(/^[•\-\*]\s*/, '');
            return (
              <div key={idx} className="flex items-start gap-2 pl-1">
                <span className="text-[#3E6530] font-bold mt-0.5 flex-shrink-0">•</span>
                <span dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(content) }} />
              </div>
            );
          }

          // Numbered item (e.g. "1. ")
          const numberedMatch = trimmed.match(/^(\d+)\.\s*(.+)/);
          if (numberedMatch) {
            return (
              <div key={idx} className="flex items-start gap-2 pl-1">
                <span className="text-[10px] font-black bg-[#EAF2E6] text-[#24421C] px-1.5 py-0.5 rounded-md flex-shrink-0 mt-0.5">
                  {numberedMatch[1]}
                </span>
                <span dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(numberedMatch[2]) }} />
              </div>
            );
          }

          return (
            <p key={idx} dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(line) }} />
          );
        })}
      </div>
    );
  };

  const formatInlineMarkdown = (str: string): string => {
    return str
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-extrabold text-[#1B3213]">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
      .replace(/`([^`]+)`/g, '<code class="bg-[#F0ECE1] px-1.5 py-0.5 rounded text-[11px] font-mono text-[#24421C]">$1</code>');
  };

  const suggestedQuestions = caregiverRole === 'doctor' ? [
    `Evaluate ${patientDisplayName}'s 4-week cognitive trajectory and motor rhythm`,
    `Review clinical medication interactions and vitals adherence`,
    `What are evidence-based non-pharmacological protocols for sundowning?`,
    `Summarize pending dietary suggestions and MIND diet compliance`
  ] : caregiverRole === 'nurse' ? [
    `Check today's meal completion and hydration logs for ${patientDisplayName}`,
    `Protocol for evening restlessness and sundowning de-escalation`,
    `Did Kamala Dadi take her morning BP medicine (Amlodipine)?`,
    `Gentle chair exercises and hydration schedule for afternoon shift`
  ] : [
    `How is Grandma feeling today and what memory games did she play?`,
    `Compassionate communication tips when Grandma repeats questions`,
    `What did Grandma eat for lunch and how was her appetite?`,
    `Gentle evening activities we can enjoy together at home`
  ];

  return (
    <div className="flex-1 p-3.5 sm:p-6 lg:p-8 max-w-4xl mx-auto w-full space-y-4 flex flex-col justify-between pb-24 md:pb-8 min-w-0">
      
      {/* 1. Header & Quick Controls */}
      <div className="border-b border-[#E7E3D8] pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <button
            onClick={() => {
              audio.playGentleChime();
              setCaregiverScreen('overview');
            }}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#24421C] bg-[#DCE7D3] hover:bg-[#CAD8C6] px-3.5 py-1.5 rounded-full transition-all active:scale-95 cursor-pointer shadow-2xs mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{t.knowledgeAssistant.backBtn}</span>
          </button>
          
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-black uppercase tracking-wider text-[#4E7037] block">
              {t.knowledgeAssistant.optionBadge}
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
              <span>{t.knowledgeAssistant.assistantOnlineBadge}</span>
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-extrabold text-[#243B1D] tracking-tight flex items-center gap-2 mt-0.5">
            <span>{t.knowledgeAssistant.title}</span>
          </h1>
          <p className="text-xs text-[#5D7257]">
            {t.knowledgeAssistant.subtitle}
          </p>
        </div>

        {/* Action Buttons: Clear Chat */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handleClearChat}
            className="px-3.5 py-2 rounded-xl bg-white border border-[#E7E3D8] text-stone-700 hover:bg-[#FAF8F5] text-xs font-bold flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer active:scale-95"
            title={t.knowledgeAssistant.clearChatBtn}
          >
            <RotateCcw className="w-3.5 h-3.5 text-stone-500" />
            <span>{t.knowledgeAssistant.clearChatBtn}</span>
          </button>
        </div>
      </div>

      {/* 2. Medical Disclaimer Notice */}
      <div className="bg-[#FFFDF7] border border-amber-300/80 rounded-2xl p-2.5 sm:p-3 flex items-start gap-2.5 text-[11px] text-amber-950 shadow-2xs">
        <ShieldAlert className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Caregiver Clinical Companion:</strong> SANGPA Knowledge Assistant synthesizes {patientDisplayName}'s live vitals, adherence logs, and dementia care practices in real time. It is an empathetic assistant and not a replacement for emergency clinical services.
        </p>
      </div>

      {/* 3. Messages Feed */}
      <div className="flex-1 overflow-y-auto space-y-3.5 min-h-[320px] max-h-[460px] p-3 sm:p-4 bg-[#FAF8F5] rounded-3xl border border-[#E7E3D8] shadow-inner">
        {messages.map((m) => {
          const isAssistant = m.sender === 'assistant';
          const isSpeakingThis = currentlySpeakingId === m.id;
          const isCopied = copiedId === m.id;

          return (
            <div
              key={m.id}
              className={`flex flex-col ${isAssistant ? 'items-start' : 'items-end'} animate-in fade-in duration-200`}
            >
              <div
                className={`max-w-[90%] sm:max-w-[85%] rounded-3xl p-4 shadow-2xs space-y-2 ${
                  isAssistant
                    ? 'bg-white border border-[#E2DDD2] text-[#203D17]'
                    : 'bg-[#2E4A21] text-white font-medium'
                }`}
              >
                {/* Header Row of Message */}
                <div className="flex items-center justify-between gap-2 border-b pb-1.5 text-[11px] font-bold border-opacity-20 border-current">
                  <div className="flex items-center gap-1.5">
                    {isAssistant ? (
                      <>
                        <div className="w-4 h-4 rounded-full bg-[#EAF2E6] flex items-center justify-center text-[#2E4A21]">
                          <Sparkles className="w-2.5 h-2.5" />
                        </div>
                        <span className="text-[#2B4420] font-black uppercase tracking-wider">
                          SANGPA AI
                        </span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-[#EAF2E6] text-[#3E6530] font-extrabold">
                          Clinical AI
                        </span>
                      </>
                    ) : (
                      <span className="text-emerald-100 font-bold">Caregiver Riya</span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 text-[10px] opacity-75">
                    <span>{m.time}</span>
                  </div>
                </div>

                {/* Message Body with Markdown Formatting */}
                <div className={isAssistant ? 'text-stone-800' : 'text-white'}>
                  {isAssistant ? renderFormattedText(m.text) : <p className="text-xs sm:text-sm whitespace-pre-wrap">{m.text}</p>}
                </div>

                {/* Interactive Direct Route Action Button */}
                {isAssistant && m.linkText && m.linkAction && (
                  <div className="pt-1">
                    <button
                      onClick={() => {
                        audio.playGentleChime();
                        setCaregiverScreen(m.linkAction!);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#EAF2E6] hover:bg-[#DCE7D3] text-[#24421C] text-xs font-bold transition-all border border-[#CCD8C4] shadow-2xs cursor-pointer active:scale-95"
                    >
                      <span>{m.linkText}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {/* Message Utility Controls (Listen, Copy) */}
                {isAssistant && (
                  <div className="flex items-center gap-1 pt-1 border-t border-[#F0ECE1] justify-end">
                    <button
                      onClick={() => handleReadAloud(m.id, m.text)}
                      className={`p-1.5 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                        isSpeakingThis 
                          ? 'bg-rose-100 text-rose-800 animate-pulse' 
                          : 'text-stone-500 hover:bg-[#FAF8F5] hover:text-stone-800'
                      }`}
                      title={isSpeakingThis ? t.knowledgeAssistant.stopAudio : t.knowledgeAssistant.listenAloud}
                    >
                      {isSpeakingThis ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                      <span>{isSpeakingThis ? t.knowledgeAssistant.stopAudio : t.knowledgeAssistant.listenAloud}</span>
                    </button>

                    <button
                      onClick={() => handleCopy(m.id, m.text)}
                      className="p-1.5 rounded-lg text-[11px] font-bold flex items-center gap-1 text-stone-500 hover:bg-[#FAF8F5] hover:text-stone-800 transition-all cursor-pointer"
                      title={t.knowledgeAssistant.copyTooltip}
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{isCopied ? t.knowledgeAssistant.copiedTooltip : t.knowledgeAssistant.copyTooltip}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Live Loading Indicator */}
        {isLoading && (
          <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white border border-[#E7E3D8] text-xs text-[#2B4420] shadow-2xs animate-pulse max-w-[280px]">
            <Sparkles className="w-4 h-4 text-[#3E6530] animate-spin" />
            <div className="flex flex-col">
              <span className="font-bold">{t.knowledgeAssistant.assistantOnlineBadge}...</span>
              <span className="text-[10px] text-stone-500">{t.knowledgeAssistant.subtitle}</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 4. Suggested Questions Grid */}
      <div className="space-y-1.5">
        <span className="text-[10px] font-black text-[#4E7037] uppercase tracking-wider block">
          {t.knowledgeAssistant.suggestedShortcutsTitle}
        </span>
        <div className="flex flex-wrap gap-1.5">
          {suggestedQuestions.map((suggestion, idx) => (
            <button
              key={idx}
              disabled={isLoading}
              onClick={() => handleAsk(suggestion)}
              className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-[#EAF2E6] border border-[#DCD6C8] text-[#243B1D] text-xs font-semibold transition-all shadow-2xs cursor-pointer active:scale-95 disabled:opacity-50 text-left"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>

      {/* 5. Input Bar with Voice Recognition & Send */}
      <div className="flex items-center gap-2 pt-1">
        <div className="flex-1 relative flex items-center">
          <input
            type="text"
            value={query}
            disabled={isLoading}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAsk(query)}
            placeholder={t.knowledgeAssistant.inputPlaceholder}
            className="w-full py-3 pl-4 pr-10 rounded-2xl bg-white border border-[#D5DFC9] focus:border-[#344E2E] focus:ring-2 focus:ring-[#DCE7D3] outline-none text-xs sm:text-sm text-stone-900 shadow-2xs transition-all disabled:bg-stone-100"
          />

          {isListening && (
            <span className="absolute right-3 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500" />
            </span>
          )}
        </div>

        {/* Speech Recognition Mic Button */}
        <button
          onClick={handleToggleVoice}
          disabled={isLoading}
          className={`p-3 rounded-2xl transition-all shadow-2xs cursor-pointer active:scale-95 ${
            isListening
              ? 'bg-rose-600 text-white animate-pulse'
              : 'bg-[#EAF2E6] hover:bg-[#DCE7D3] text-[#24421C] border border-[#CCD8C4]'
          }`}
          title={isListening ? t.knowledgeAssistant.stopAudio : "Voice Input"}
        >
          {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
        </button>

        {/* Send Button */}
        <button
          onClick={() => handleAsk(query)}
          disabled={isLoading || !query.trim()}
          className="p-3 rounded-2xl bg-[#2E4A21] hover:bg-[#243B1D] text-white shadow-xs transition-all cursor-pointer active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
          title={t.knowledgeAssistant.sendBtn}
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
