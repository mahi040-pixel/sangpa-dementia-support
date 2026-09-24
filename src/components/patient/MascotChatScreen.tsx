import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ArrowLeft, 
  Volume2, 
  Square,
  Mic, 
  Sparkles, 
  PhoneCall, 
  Heart, 
  Send, 
  HelpCircle,
  Languages,
  ChevronDown,
  Gamepad2
} from 'lucide-react';
import { audio } from '../../utils/audio';
import { MascotState, LanguageCode } from '../../types';
import { askSangpaOpenAI } from '../../services/openai';
import { speechRecognizer, isSpeechRecognitionSupported } from '../../utils/speechRecognition';
import { APP_VOICE_RESPONSES } from '../../utils/localization';

interface Message {
  id: string;
  sender: 'mascot' | 'patient';
  text: string;
  time: string;
  isEscalation?: boolean;
}

const UI_STRINGS: Record<LanguageCode, {
  home: string;
  title: string;
  subtitle: string;
  tapToSpeak: string;
  listeningPrompt: string;
  thinkingPrompt: string;
  speakingPrompt: string;
  idlePrompt: string;
  replay: string;
  stop: string;
  mute: string;
  unmute: string;
  userLabel: string;
  sangpaLabel: string;
  openGamesBtn: string;
  errorMessage: string;
  typePlaceholder: string;
  greeting: (name: string) => string;
  chips: { label: string; text: string; urgent?: boolean }[];
}> = {
  en: {
    home: "Home",
    title: "Talk to Sangpa",
    subtitle: "Your loving AI companion",
    tapToSpeak: "Tap to Speak with Sangpa",
    listeningPrompt: "I'm listening...",
    thinkingPrompt: "Let me think...",
    speakingPrompt: "SANGPA is speaking...",
    idlePrompt: "SANGPA is with you",
    replay: "Listen Again",
    stop: "Stop Voice",
    mute: "Mute",
    unmute: "Unmute",
    userLabel: "User message",
    sangpaLabel: "SANGPA response",
    openGamesBtn: "Open Games Room",
    errorMessage: "I couldn't hear you. Please try again.",
    typePlaceholder: "Ask Sangpa anything...",
    greeting: (name: string) => `Namaste ${name}! I am Sangpa, your loving AI companion. What would you like to talk about today?`,
    chips: [
      { label: "🕒 Next appointment?", text: "When is my next appointment?" },
      { label: "🎮 Play a game", text: "I want to play a game." },
      { label: "💧 Drank fresh water", text: "I drank my fresh glass of water." },
      { label: "💛 I feel confused", text: "I feel confused and alone.", urgent: true },
      { label: "📞 Call Riya", text: "Can I please call my daughter Riya?", urgent: true }
    ]
  },
  hi: {
    home: "मुख्य पृष्ठ",
    title: "सांगपा से बात करें",
    subtitle: "आपकी प्यारी नन्हीं साथी",
    tapToSpeak: "सांगपा से बोलने के लिए दबाएं",
    listeningPrompt: "सुन रही हूँ...",
    thinkingPrompt: "सोचने दीजिए...",
    speakingPrompt: "सांगपा बोल रही है...",
    idlePrompt: "सांगपा आपके साथ है",
    replay: "दोबारा सुनें",
    stop: "आवाज़ रोकें",
    mute: "मौन करें",
    unmute: "आवाज़ चालू",
    userLabel: "उपयोगकर्ता का संदेश",
    sangpaLabel: "सांगपा का उत्तर",
    openGamesBtn: "खेल का कमरा खोलें",
    errorMessage: "मैं सुन नहीं पाई। कृपया दोबारा बोलें।",
    typePlaceholder: "सांगपा से कुछ भी पूछें...",
    greeting: (name: string) => `नमस्ते ${name}! मैं आपकी नन्हीं साथी सांगपा हूँ। आज आप कैसा महसूस कर रही हैं?`,
    chips: [
      { label: "🕒 अगली अपॉइंटमेंट?", text: "डॉक्टर से मेरी अगली अपॉइंटमेंट कब है?" },
      { label: "🎮 खेल खेलना है", text: "मुझे एक प्यारा खेल खेलना है।" },
      { label: "💧 पानी पी लिया", text: "मैंने एक गिलास ताज़ा पानी पी लिया।" },
      { label: "💛 मुझे घबराहट हो रही है", text: "मुझे थोड़ी घबराहट हो रही है।", urgent: true },
      { label: "📞 रिया को बुलाएं", text: "क्या मैं अपनी बेटी रिया से बात कर सकती हूँ?", urgent: true }
    ]
  },
  bn: {
    home: "বাড়ি",
    title: "সাংপার সাথে কথা বলুন",
    subtitle: "আপনার আদুরে এআই সঙ্গী",
    tapToSpeak: "সাংপার সাথে কথা বলতে স্পর্শ করুন",
    listeningPrompt: "শুনছি...",
    thinkingPrompt: "একটু ভাবতে দাও...",
    speakingPrompt: "সাংপা কথা বলছে...",
    idlePrompt: "সাংপা আপনার পাশেই আছে",
    replay: "আবার শুনুন",
    stop: "কণ্ঠ থামান",
    mute: "নিঃশব্দ",
    unmute: "শব্দ চালু",
    userLabel: "ব্যবহারকারীর বার্তা",
    sangpaLabel: "সাংপার উত্তর",
    openGamesBtn: "খেলার ঘরে যান",
    errorMessage: "শুনতে পাইনি। দয়া করে আবার বলুন।",
    typePlaceholder: "সাংপাকে যা খুশি জিজ্ঞাসা করুন...",
    greeting: (name: string) => `নমস্কার ${name}! আমি আপনার আদুরে ছোট্ট সঙ্গী সাংপা। আজ আপনার কেমন লাগছে?`,
    chips: [
      { label: "🕒 পরের অ্যাপয়েন্টমেন্ট?", text: "আমার পরের ডাক্তার দেখানো কবে?" },
      { label: "🎮 খেলা খেলতে চাই", text: "আমি একটা মজার খেলা খেলতে চাই।" },
      { label: "💧 জল খেয়েছি", text: "আমি এক গ্লাস তাজা জল খেয়ে নিয়েছি।" },
      { label: "💛 একটু ভয় লাগছে", text: "আমার একটু একা আর বিভ্রান্ত লাগছে।", urgent: true },
      { label: "📞 রিয়াকে ফোন করুন", text: "আমি কি আমার মেয়ে রিয়ার সাথে কথা বলতে পারি?", urgent: true }
    ]
  },
  es: {
    home: "Inicio",
    title: "Hablar con Sangpa",
    subtitle: "Tu cariñosa compañera de IA",
    tapToSpeak: "Toca para hablar con Sangpa",
    listeningPrompt: "Te estoy escuchando...",
    thinkingPrompt: "Déjame pensar...",
    speakingPrompt: "SANGPA está hablando...",
    idlePrompt: "SANGPA está contigo",
    replay: "Escuchar de nuevo",
    stop: "Detener voz",
    mute: "Silenciar",
    unmute: "Activar voz",
    userLabel: "Mensaje del usuario",
    sangpaLabel: "Respuesta de SANGPA",
    openGamesBtn: "Ir a los juegos",
    errorMessage: "No pude escucharte. Por favor intenta de nuevo.",
    typePlaceholder: "Pregunta lo que quieras a Sangpa...",
    greeting: (name: string) => `¡Hola ${name}! Soy Sangpa, tu compañera de IA. Estoy aquí a tu lado. ¿Cómo te sientes hoy?`,
    chips: [
      { label: "🕒 ¿Próxima cita?", text: "¿Cuándo es mi próxima cita médica?" },
      { label: "🎮 Jugar un juego", text: "Quiero jugar un juego divertido." },
      { label: "💧 Tomé agua", text: "Ya tomé un vaso de agua fresca." },
      { label: "💛 Me siento confundida", text: "Me siento un poco confundida.", urgent: true },
      { label: "📞 Llamar a Riya", text: "¿Puedo llamar a mi hija Riya?", urgent: true }
    ]
  },
  as: {
    home: "ঘৰ",
    title: "চাংপাৰ সৈতে কথা পাতক",
    subtitle: "আপোনাৰ মৰমৰ এআই সঙ্গী",
    tapToSpeak: "চাংপাৰ সৈতে কথা ক'বলৈ টিপক",
    listeningPrompt: "শুনি আছোঁ...",
    thinkingPrompt: "ভাবি লওঁ...",
    speakingPrompt: "চাংপাই কৈছে...",
    idlePrompt: "চাংপা আপোনাৰ লগত আছে",
    replay: "আকৌ শুনক",
    stop: "মাত বন্ধ কৰক",
    mute: "নিমাত",
    unmute: "মাত খোলক",
    userLabel: "ব্যৱহাৰকাৰীৰ বাৰ্তা",
    sangpaLabel: "চাংপাৰ উত্তৰ",
    openGamesBtn: "খেলৰ কোঠালৈ যাওক",
    errorMessage: "মই শুনিব নোৱাৰিলোঁ। অনুগ্ৰহ কৰি আকৌ কওক।",
    typePlaceholder: "চাংপাক যিকোনো কথা সোধক...",
    greeting: (name: string) => `নমস্কাৰ ${name}! মই চাংপা, আপোনাৰ মৰমৰ নাতিনীৰ দৰে সঙ্গী। আজি আপোনাৰ মনটো কেনে লাগিছে?`,
    chips: [
      { label: "🕒 পিছৰ চেকআপ?", text: "মোৰ পিছৰ ডাক্তৰৰ চেকআপ কেতিয়া?" },
      { label: "🎮 খেলা খেলোঁ", text: "মই এটা খেলা খেলিব বিচাৰোঁ।" },
      { label: "💧 পানী খালোঁ", text: "মই এগিলাচ সতেজ পানী খালোঁ।" },
      { label: "💛 মনত চিন্তা লাগিছে", text: "মোৰ মনত অলপ চিন্তা লাগিছে।", urgent: true },
      { label: "📞 ৰিয়াক ফোন কৰক", text: "মই মোৰ জীয়ৰী ৰিয়াক মাতিব পাৰোঁনে?", urgent: true }
    ]
  },
  mni: {
    home: "য়ুম",
    title: "সাংপাগা ৱারী শানবীয়ু",
    subtitle: "অদোমগী নুংশিবা এআই সঙ্গী",
    tapToSpeak: "সাংপাগা ৱারী শানবা নম্বীয়ু",
    listeningPrompt: "তাৰী...",
    thinkingPrompt: "সাংপানা খল্লি...",
    speakingPrompt: "সাংপানা ঙাংলি...",
    idlePrompt: "সাংপা অদোমগা লৈরি",
    replay: "অমুক হন্না তাবীয়ু",
    stop: "খোন্থোক লেপহন্নবা",
    mute: "ম্যুট",
    unmute: "অন-ম্যুট",
    userLabel: "মীওইগী ৱাহৈ",
    sangpaLabel: "সাংপাগী পাউখুম",
    openGamesBtn: "শান্নবদা চৎসি",
    errorMessage: "ঐহাক তাদে। অমুক হন্না হায়বীয়ু।",
    typePlaceholder: "সাংপাদা পুম্নমক হংবীয়ু...",
    greeting: (name: string) => `খুরুমজরি ${name}! ঐহাক সাংপানি। ঐহাক অদোমগা লোয়ননা লৈরি।`,
    chips: [
      { label: "🕒 দাক্তর উনবা?", text: "দাক্তর উনবা মতম করমদাইনো?" },
      { label: "🎮 শান্নসি", text: "ঐখোয় শান্নসি।" },
      { label: "💧 ঈশিং থকখ্রে", text: "ঐহাক ঈশিং থকখ্রে।" },
      { label: "💛 অৱাবা ফাওই", text: "ঐহাক অৱাবা ফাওই।", urgent: true },
      { label: "📞 রিয়া কৌবীয়ু", text: "রিয়া কৌবীয়ু।", urgent: true }
    ]
  },
  nag: {
    home: "Ghar",
    title: "Sangpa logote kotha kobi",
    subtitle: "Apuni laga bhal AI sathi",
    tapToSpeak: "Sangpa logote kotha kobole dababi",
    listeningPrompt: "Huni asey...",
    thinkingPrompt: "Sangpa bhabhi asey...",
    speakingPrompt: "Sangpa kotha koi asey...",
    idlePrompt: "Sangpa apuni logot asey",
    replay: "Abar hunibi",
    stop: "Awaaz bondho koribi",
    mute: "Mute",
    unmute: "Unmute",
    userLabel: "User kotha",
    sangpaLabel: "Sangpa laga jawab",
    openGamesBtn: "Game khelibole jabi",
    errorMessage: "Moi hunibole naparise. Abar kotha kobi.",
    typePlaceholder: "Sangpa ke kotha hudhibi...",
    greeting: (name: string) => `Namaste ${name}! Moi Sangpa asey. Apuni logote asey. Aji kineka lagise?`,
    chips: [
      { label: "🕒 Doctor laga date?", text: "Moi laga doctor appointment ketiya asey?" },
      { label: "🎮 Game khelibi", text: "Moi logote game khelibi." },
      { label: "💧 Paani khailo", text: "Moi bhal pora paani khailo." },
      { label: "💛 Eka lagise", text: "Moi ke eka aru confused lagise.", urgent: true },
      { label: "📞 Riya ke phone koribi", text: "Moi Riya logote kotha kobi?", urgent: true }
    ]
  }
};

export const MascotChatScreen: React.FC = () => {
  const { 
    setPatientScreen, 
    mascotState, 
    setMascotState, 
    speakMascot, 
    language, 
    setLanguage, 
    reminders,
    completeReminder,
    patientProfile
  } = useApp();

  const callingName = patientProfile?.preferredName || patientProfile?.name || 'Kamala Dadi';
  const currentUI = UI_STRINGS[language] || UI_STRINGS.en;

  const [inputVal, setInputVal] = useState('');
  const [isMicListening, setIsMicListening] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [isMuted, setIsMuted] = useState(audio.getMuted());
  const [friendlyError, setFriendlyError] = useState<string | null>(null);
  const [pendingGameNav, setPendingGameNav] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm-1',
      sender: 'mascot',
      text: currentUI.greeting(callingName),
      time: "Just now"
    }
  ]);

  // Keep greeting synchronized when language or patient name changes
  useEffect(() => {
    const greetText = currentUI.greeting(callingName);
    setMessages(prev => {
      if (prev.length <= 1) {
        return [{
          id: 'm-1',
          sender: 'mascot',
          text: greetText,
          time: "Just now"
        }];
      }
      return [
        ...prev,
        {
          id: `m-lang-${Date.now()}`,
          sender: 'mascot',
          text: greetText,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ];
    });
    speakMascot(greetText, 'speaking');
  }, [callingName, language]);

  // Cleanup speech synthesis and recognition on unmount
  useEffect(() => {
    return () => {
      speechRecognizer.stopListening();
      audio.stopSpeaking();
    };
  }, []);

  const handleToggleMute = () => {
    const nextMuted = audio.toggleMute();
    setIsMuted(nextMuted);
    if (nextMuted) {
      audio.stopSpeaking();
      setMascotState('idle');
    }
  };

  // Toggle Microphone for speech-to-text
  const handleToggleMic = () => {
    setFriendlyError(null);

    if (isMicListening) {
      speechRecognizer.stopListening();
      setIsMicListening(false);
      setInterimTranscript('');
      setMascotState('idle');
      if (inputVal.trim().length > 1) {
        handleSendMessage(inputVal);
      }
      return;
    }

    // Silence any previous speech before listening
    audio.stopSpeaking();
    setInterimTranscript('');

    const started = speechRecognizer.startListening(language, {
      onStart: () => {
        setIsMicListening(true);
        setFriendlyError(null);
        setMascotState('listening');
      },
      onResult: (text: string, isFinal: boolean) => {
        setInputVal(text);
        setInterimTranscript(text);
        if (isFinal && text.trim().length > 1) {
          speechRecognizer.stopListening();
          setIsMicListening(false);
          setInterimTranscript('');
          handleSendMessage(text);
        }
      },
      onError: (err: string) => {
        console.warn('Speech recognition notice:', err);
        setIsMicListening(false);
        setMascotState('idle');
        if (err !== 'no-speech') {
          setFriendlyError(currentUI.errorMessage);
        }
      },
      onEnd: () => {
        setIsMicListening(false);
      }
    });

    if (started) {
      setIsMicListening(true);
      setMascotState('listening');
    } else {
      setFriendlyError(currentUI.errorMessage);
    }
  };

  // Send message to OpenAI with caregiver context
  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    setFriendlyError(null);
    if (isMicListening) {
      speechRecognizer.stopListening();
      setIsMicListening(false);
      setInterimTranscript('');
    }

    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      sender: 'patient',
      text: textToSend,
      time: nowTime
    };

    setMessages(prev => [...prev, userMsg]);
    setInputVal('');
    setInterimTranscript('');
    setMascotState('thinking');
    audio.playTempleBell();

    const lower = textToSend.toLowerCase();

    // Prepare live caregiver records for accurate answering
    const caregiverContext = {
      nextAppointment: "Neurologist consultation with Dr. Anita Verma this Friday at 11:00 AM at Apollo Geriatric Clinic.",
      daughterName: "Riya Sharma",
      doctorName: "Dr. Anita Verma",
      todayReminders: reminders.map(r => `${r.time}: ${r.title} (${r.status})`),
      gamesList: ["Sequence Recall", "Rhythm Tapping", "Family Flashcards", "Object Sorting", "Dice & Category Game"]
    };

    try {
      // Call OpenAI with SANGPA persona & real caregiver records
      const responseObj = await askSangpaOpenAI(textToSend, language, messages, callingName, caregiverContext);
      let aiReply = responseObj.text;

      // Anti-repetition safeguard: ensure Sangpa never repeats the exact same statement consecutively
      const prevMascotMsg = [...messages].reverse().find(m => m.sender === 'mascot');
      if (prevMascotMsg && prevMascotMsg.text.trim().toLowerCase() === aiReply.trim().toLowerCase()) {
        if (language === 'hi') {
          aiReply = `हाँ ${callingName}, मैं आपकी बात बहुत ध्यान से सुन रही हूँ। आपका दिन बहुत प्यारा और सुखद रहे।`;
        } else if (language === 'as') {
          aiReply = `হয় ${callingName}, মই আপোনাৰ কথা বৰ মৰমেৰে শুনি আছোঁ। মই সদায় আপোনাৰ ওচৰতেই আছোঁ।`;
        } else if (language === 'bn') {
          aiReply = `হ্যাঁ ${callingName}, আমি খুব মন দিয়ে আপনার কথা শুনছি। আপনার পাশে থাকতে পেরে আমার ভীষণ ভালো লাগছে।`;
        } else if (language === 'mni') {
          aiReply = `হোই ${callingName}, ঐহাক্না অদোমগী ৱাফম অসি নুংশিনা তারি। ঐহাক অদোমগী নক্ননা লৈরি।`;
        } else if (language === 'nag') {
          aiReply = `Hoi ${callingName}, moi apuni laga kotha bhal pora suni asey. Moi apuni logot sadaa asey.`;
        } else {
          aiReply = `Yes ${callingName}, I am listening to you with all my heart. Everything is peaceful and well right beside you.`;
        }
      }

      // Check for escalation or distress
      const isEscalation = 
        lower.includes('confused') || 
        lower.includes('scared') || 
        lower.includes('lost') || 
        lower.includes('pain') ||
        lower.includes('madad') ||
        lower.includes('help') ||
        lower.includes('ayuda') ||
        lower.includes('call') ||
        lower.includes('riya');

      const state: MascotState = isEscalation ? 'help' : 'speaking';

      const replyMsg: Message = {
        id: `m-${Date.now()}`,
        sender: 'mascot',
        text: aiReply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isEscalation
      };

      setMessages(prev => [...prev, replyMsg]);
      // Speak response automatically using the authentic ElevenLabs Suhana J voice
      speakMascot(aiReply, state);

      // Handle Navigation intents smoothly
      if (responseObj.action === 'navigate_games') {
        setPendingGameNav(true);
        setTimeout(() => {
          setPatientScreen('games');
        }, 3400);
      } else if (responseObj.action === 'complete_water') {
        completeReminder('rem-2');
      } else if (responseObj.action === 'navigate_emergency') {
        setTimeout(() => {
          setPatientScreen('emergency');
        }, 3400);
      } else if (responseObj.action === 'navigate_routine') {
        setTimeout(() => {
          setPatientScreen('activities');
        }, 3400);
      }
    } catch (err) {
      console.error('OpenAI chat error:', err);
      const fallbackFn = APP_VOICE_RESPONSES.chatFallback[language] || APP_VOICE_RESPONSES.chatFallback.en;
      const fallbackReply = fallbackFn(callingName);
      const replyMsg: Message = {
        id: `m-${Date.now()}`,
        sender: 'mascot',
        text: fallbackReply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, replyMsg]);
      speakMascot(fallbackReply, 'speaking');
    }
  };

  const handleReplayVoice = (text: string) => {
    audio.stopSpeaking();
    speakMascot(text, 'speaking');
  };

  const handleStopVoice = () => {
    audio.stopSpeaking();
    setMascotState('idle');
  };

  // Find latest messages for clear, large elderly display
  const mascotMessages = messages.filter(m => m.sender === 'mascot');
  const latestMascot = mascotMessages[mascotMessages.length - 1];
  const patientMessages = messages.filter(m => m.sender === 'patient');
  const latestPatient = patientMessages[patientMessages.length - 1];

  const getStatusText = (state: MascotState) => {
    switch (state) {
      case 'listening': return currentUI.listeningPrompt;
      case 'thinking': return currentUI.thinkingPrompt;
      case 'speaking': return currentUI.speakingPrompt;
      default: return currentUI.idlePrompt;
    }
  };

  return (
    <div className="flex-1 p-3 sm:p-5 max-w-xl mx-auto w-full flex flex-col justify-between space-y-4">
      {/* Top Bar: Clean Home Back Button, Title, Mute & Language Controls */}
      <div className="flex items-center justify-between gap-2 border-b border-sangpa-200 pb-3">
        <button
          onClick={() => {
            audio.stopSpeaking();
            setPatientScreen('home');
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-white border-2 border-sangpa-300 hover:bg-sangpa-100 text-sangpa-900 font-bold text-xs sm:text-sm transition-all active:scale-95 shadow-2xs cursor-pointer"
          title="Return to Home Dashboard"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{currentUI.home}</span>
        </button>

        <div className="text-center">
          <h2 className="text-lg sm:text-xl font-extrabold text-sangpa-900 tracking-tight leading-none">
            {currentUI.title}
          </h2>
          <p className="text-[11px] sm:text-xs text-sangpa-600 font-medium mt-0.5">
            {currentUI.subtitle}
          </p>
        </div>

        {/* Right Controls: Mute Toggle & Language Selector */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleToggleMute}
            className={`p-1.5 rounded-full border-2 transition-all cursor-pointer ${
              isMuted 
                ? 'bg-rose-100 border-rose-300 text-rose-700' 
                : 'bg-sangpa-100 border-sangpa-300 text-sangpa-800'
            }`}
            title={isMuted ? currentUI.unmute : currentUI.mute}
          >
            <Volume2 className={`w-3.5 h-3.5 ${isMuted ? 'line-through opacity-50' : ''}`} />
          </button>

          <div className="flex items-center gap-1 bg-white border-2 border-sangpa-300 rounded-full px-2 py-1 shadow-2xs">
            <Languages className="w-3.5 h-3.5 text-sangpa-600" />
            <select
              value={language}
              onChange={(e) => {
                const newLang = e.target.value as LanguageCode;
                setLanguage(newLang);
                audio.stopSpeaking();
              }}
              className="bg-transparent text-xs font-bold text-sangpa-800 outline-none cursor-pointer"
            >
              <option value="en">English</option>
              <option value="hi">हिन्दी (Hindi)</option>
              <option value="bn">বাংলা (Bengali)</option>
              <option value="es">Español (Spanish)</option>
              <option value="as">অসমীয়া (Assamese)</option>
              <option value="mni">মৈতৈলোন্ (Manipuri)</option>
              <option value="nag">Nagamese (নাগামিজ)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Interactive Mascot Stage with Lifelike Blinking, Mouth & Head Movement */}
      <div className="relative w-full flex flex-col items-center">
        {/* The Frame holding the full-body character */}
        <div 
          onClick={handleToggleMic}
          className={`relative cursor-pointer w-48 h-64 sm:w-56 sm:h-76 md:w-64 md:h-84 rounded-3xl overflow-hidden border-4 transition-all duration-500 shadow-xl bg-gradient-to-b from-[#FBFDF7] to-[#E9F0DD] ${
            mascotState === 'speaking'
              ? 'border-sangpa-500 ring-4 ring-sangpa-300 animate-speaking-glow'
              : mascotState === 'listening'
              ? 'border-emerald-500 ring-4 ring-emerald-300 animate-listening-ring'
              : mascotState === 'thinking'
              ? 'border-amber-400 ring-4 ring-amber-200'
              : 'border-sangpa-300 hover:border-sangpa-400'
          }`}
          title="Tap mascot to speak or listen"
        >
          {/* Full-Body Reference Mascot Character Asset */}
          <img
            src="/assets/mascot_full_conversation.png"
            alt="Sangpa full-body character"
            className={`w-full h-full object-cover object-top transition-transform duration-300 select-none ${
              mascotState === 'speaking'
                ? 'animate-mascot-full-speaking'
                : mascotState === 'listening'
                ? 'animate-mascot-full-listening'
                : mascotState === 'thinking'
                ? 'animate-mascot-full-thinking'
                : 'animate-mascot-full-idle'
            }`}
          />

          {/* Voice Spectrum Equalizer Bars when speaking */}
          {mascotState === 'speaking' && (
            <div className="absolute bottom-2.5 inset-x-0 flex items-center justify-center gap-1 bg-black/50 backdrop-blur-xs py-1 px-3 mx-4 rounded-full">
              <span className="w-1 bg-sangpa-300 rounded-full animate-pulse" style={{ height: '12px', animationDelay: '0ms' }} />
              <span className="w-1 bg-white rounded-full animate-pulse" style={{ height: '22px', animationDelay: '150ms' }} />
              <span className="w-1 bg-sangpa-200 rounded-full animate-pulse" style={{ height: '28px', animationDelay: '300ms' }} />
              <span className="w-1 bg-white rounded-full animate-pulse" style={{ height: '18px', animationDelay: '100ms' }} />
              <span className="w-1 bg-sangpa-300 rounded-full animate-pulse" style={{ height: '10px', animationDelay: '250ms' }} />
            </div>
          )}

          {/* Attentive Soundwave radar indicator when listening */}
          {mascotState === 'listening' && (
            <div className="absolute bottom-2.5 inset-x-0 flex items-center justify-center gap-1.5 bg-emerald-950/70 backdrop-blur-xs py-1 px-3 mx-3 rounded-full text-emerald-200 text-xs font-bold animate-pulse">
              <Mic className="w-3.5 h-3.5 text-emerald-400 animate-bounce" />
              <span>{currentUI.listeningPrompt}</span>
            </div>
          )}

          {/* Sparkles pill when thinking */}
          {mascotState === 'thinking' && (
            <div className="absolute bottom-2.5 inset-x-0 flex items-center justify-center gap-1.5 bg-amber-950/70 backdrop-blur-xs py-1 px-3 mx-3 rounded-full text-amber-200 text-xs font-bold animate-pulse">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
              <span>{currentUI.thinkingPrompt}</span>
            </div>
          )}
        </div>

        {/* Live State Badge Below Character */}
        <div className="mt-2 text-center">
          <span className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-extrabold shadow-2xs border ${
            mascotState === 'speaking'
              ? 'bg-sangpa-100 border-sangpa-300 text-sangpa-900'
              : mascotState === 'listening'
              ? 'bg-emerald-100 border-emerald-300 text-emerald-900'
              : mascotState === 'thinking'
              ? 'bg-amber-100 border-amber-300 text-amber-900'
              : 'bg-white border-sangpa-200 text-sangpa-800'
          }`}>
            <span className={`w-2 h-2 rounded-full ${
              mascotState === 'speaking' ? 'bg-sangpa-600 animate-ping' :
              mascotState === 'listening' ? 'bg-emerald-500 animate-ping' :
              mascotState === 'thinking' ? 'bg-amber-500 animate-spin' :
              'bg-emerald-500'
            }`} />
            <span>{getStatusText(mascotState)}</span>
          </span>
        </div>
      </div>

      {/* Friendly Error Banner if mic failed or empty input */}
      {friendlyError && (
        <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-3 text-center text-xs sm:text-sm font-bold text-amber-900 shadow-xs flex items-center justify-between gap-2">
          <span>{friendlyError}</span>
          <button
            onClick={handleToggleMic}
            className="px-2.5 py-1 rounded-full bg-amber-200 hover:bg-amber-300 text-amber-950 text-xs font-extrabold transition-colors cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}

      {/* Prominent Conversation Area with Distinct User & SANGPA Labels */}
      <div className="space-y-3">
        {/* User Message Card */}
        {latestPatient && (
          <div className="bg-sangpa-50/90 border-2 border-sangpa-200 rounded-2xl p-3 shadow-2xs space-y-1">
            <div className="flex items-center gap-1.5 text-[11px] font-extrabold text-sangpa-700 uppercase tracking-wider">
              <span>👤 {currentUI.userLabel}</span>
              <span className="text-[10px] font-normal text-sangpa-500">• {latestPatient.time}</span>
            </div>
            <p className="font-bold text-sangpa-950 text-sm sm:text-base leading-snug">
              "{latestPatient.text}"
            </p>
          </div>
        )}

        {/* SANGPA Response Card: Large, High-Contrast, Dementia-Friendly */}
        <div className="bg-white border-2 border-sangpa-300 rounded-3xl p-4 sm:p-5 shadow-sm space-y-2.5">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-sangpa-500 animate-pulse" />
              <span className="text-xs font-extrabold uppercase tracking-wider text-sangpa-700">
                🌸 {currentUI.sangpaLabel}
              </span>
            </div>

            {/* Audio Voice Controls */}
            <div className="flex items-center gap-1.5">
              {mascotState === 'speaking' ? (
                <button
                  onClick={handleStopVoice}
                  className="flex items-center gap-1 px-3 py-1 rounded-full bg-rose-100 hover:bg-rose-200 text-rose-800 text-xs font-bold border border-rose-300 transition-colors shadow-2xs cursor-pointer"
                  title="Stop voice playback"
                >
                  <Square className="w-3.5 h-3.5 fill-current" />
                  <span>{currentUI.stop}</span>
                </button>
              ) : (
                <button
                  onClick={() => handleReplayVoice(latestMascot ? latestMascot.text : currentUI.greeting(callingName))}
                  className="flex items-center gap-1 px-3 py-1 rounded-full bg-sangpa-100 hover:bg-sangpa-200 text-sangpa-800 text-xs font-bold border border-sangpa-300 transition-colors shadow-2xs cursor-pointer"
                  title="Listen again"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>{currentUI.replay}</span>
                </button>
              )}
            </div>
          </div>

          {/* Large text response */}
          <p className="text-base sm:text-lg md:text-xl font-bold text-sangpa-950 leading-relaxed tracking-normal">
            "{latestMascot ? latestMascot.text : currentUI.greeting(callingName)}"
          </p>

          {/* Direct Interactive Game Room Navigation Button */}
          {pendingGameNav && (
            <div className="pt-2 animate-bounce">
              <button
                onClick={() => setPatientScreen('games')}
                className="w-full py-3 px-4 rounded-2xl bg-sangpa-600 hover:bg-sangpa-700 text-white font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg active:scale-98 transition-all cursor-pointer"
              >
                <Gamepad2 className="w-5 h-5" />
                <span>🎮 {currentUI.openGamesBtn}</span>
              </button>
            </div>
          )}

          {/* Escalation to family/doctor if in distress */}
          {latestMascot?.isEscalation && (
            <div className="pt-2">
              <button
                onClick={() => setPatientScreen('emergency')}
                className="w-full py-2.5 px-4 rounded-2xl bg-emergency-500 hover:bg-emergency-600 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-touch active:scale-98 transition-all animate-pulse cursor-pointer"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Connect to Daughter Riya Immediately</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Primary Voice Action Area */}
      <div className="space-y-2.5">
        {/* Large obvious microphone button */}
        <button
          onClick={handleToggleMic}
          className={`w-full py-3.5 sm:py-4 px-5 rounded-2xl font-extrabold text-base sm:text-lg flex items-center justify-center gap-3 transition-all active:scale-98 shadow-md border-2 cursor-pointer ${
            isMicListening
              ? 'bg-rose-600 hover:bg-rose-700 text-white border-rose-300 ring-4 ring-rose-200 animate-pulse'
              : 'bg-sangpa-500 hover:bg-sangpa-600 text-white border-sangpa-400 shadow-touch'
          }`}
        >
          <Mic className={`w-6 h-6 ${isMicListening ? 'animate-bounce' : ''}`} />
          <span>
            {isMicListening
              ? `${currentUI.listeningPrompt} (Tap to Send)`
              : currentUI.tapToSpeak}
          </span>
        </button>

        {/* Interim recognition transcript display */}
        {isMicListening && interimTranscript && (
          <div className="bg-amber-50 border border-amber-300 rounded-2xl px-4 py-2 text-xs sm:text-sm text-amber-900 flex items-center gap-2 animate-fade-in">
            <span className="font-bold">I hear:</span>
            <span className="italic flex-1">"{interimTranscript}"</span>
          </div>
        )}

        {/* Fallback Text Input */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage(inputVal);
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder={currentUI.typePlaceholder}
            className="flex-1 py-2.5 px-4 rounded-2xl bg-white border-2 border-sangpa-200 focus:border-sangpa-500 outline-none text-sm sm:text-base text-sangpa-900 placeholder:text-sangpa-400 shadow-xs"
          />
          <button
            type="submit"
            disabled={!inputVal.trim()}
            className="p-3 rounded-2xl bg-sangpa-500 hover:bg-sangpa-600 disabled:opacity-40 text-white shadow-sm transition-all active:scale-95 cursor-pointer"
            title="Send typed message"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

        {/* Dementia Comfort Quick Chips including Caregiver Appointments & Games */}
        <div className="flex flex-wrap gap-1.5 justify-center pt-1">
          {currentUI.chips.map((chip, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(chip.text)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all active:scale-95 shadow-2xs border cursor-pointer ${
                chip.urgent
                  ? 'bg-amber-50 border-amber-300 text-amber-900 hover:bg-amber-100'
                  : 'bg-white border-sangpa-200 text-sangpa-800 hover:bg-sangpa-100'
              }`}
            >
              {chip.label}
            </button>
          ))}
        </div>

        {/* Optional Collapsible Conversation History */}
        {messages.length > 2 && (
          <div className="pt-1">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="text-xs text-sangpa-600 hover:text-sangpa-900 font-bold flex items-center justify-center gap-1 mx-auto cursor-pointer"
            >
              <span>{showHistory ? "Hide past exchanges" : `View past exchanges (${messages.length})`}</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showHistory ? 'rotate-180' : ''}`} />
            </button>
            {showHistory && (
              <div className="mt-2 space-y-2 max-h-48 overflow-y-auto p-2.5 bg-sangpa-50/70 rounded-2xl border border-sangpa-200 text-xs">
                {messages.map((m) => (
                  <div key={m.id} className={`flex flex-col ${m.sender === 'mascot' ? 'items-start' : 'items-end'}`}>
                    <div className={`max-w-[85%] rounded-2xl p-2.5 ${m.sender === 'mascot' ? 'bg-white text-sangpa-900 border border-sangpa-200' : 'bg-sangpa-500 text-white'}`}>
                      <p>{m.text}</p>
                    </div>
                    <span className="text-[10px] text-sangpa-400 mt-0.5 px-1">{m.time}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
