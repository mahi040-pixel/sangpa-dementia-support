import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { Mic, X, Volume2, Sparkles, Phone, Activity, Heart, Droplets, Gamepad2, AlertCircle, Pill, Image, Send, RotateCcw } from 'lucide-react';
import { audio } from '../../utils/audio';
import { speechRecognizer, isSpeechRecognitionSupported } from '../../utils/speechRecognition';
import { askSangpaOpenAI } from '../../services/openai';
import { LanguageCode } from '../../types';

export const VoiceCommandModal: React.FC = () => {
  const {
    voiceModalOpen,
    setVoiceModalOpen,
    setPatientScreen,
    speakMascot,
    completeReminder,
    reminders,
    language,
    setMascotState,
    patientProfile
  } = useApp();

  const callingName = patientProfile?.preferredName || patientProfile?.name || 'Kamala Dadi';

  const [listening, setListening] = useState(true);
  const [recognizedText, setRecognizedText] = useState<string>('');
  const [aiReplying, setAiReplying] = useState<boolean>(false);
  const [aiReplyText, setAiReplyText] = useState<string>('');
  const [micSupported, setMicSupported] = useState<boolean>(true);
  const hasTriggeredRef = useRef(false);
  const silenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastRecognizedRef = useRef<string>('');

  // Intent detector for all supported languages
  const detectActionIntent = (text: string): string | null => {
    const lower = text.toLowerCase().trim();
    // 1. Direct explicit commands only, avoid hijacking general questions
    if (/(open|play|chalo|start|let's play|khelo|khelna)\s+(a\s+|my\s+|the\s+)?(game|games)|^(games?|play|khel|khelo)$|খেলা|খেল|শান্ন/i.test(lower)) return 'games';
    if (/(show|open|what is|tell me|aaj ka|mera|meri)\s+(a\s+|my\s+|the\s+)?(routine|schedule|dincharya)|^(routine|schedule)$|दिनचर्या|দিনলিপি|রুটিন|থবক/i.test(lower)) return 'routine';
    if (/(i drank|drank|drink|pi liya|pee liya|khilobi)\s+(a\s+|my\s+|some\s+)?(water|paani|pani)|^(water|paani|pani)$|জল|পানী|পানি|ঈশিং/i.test(lower)) return 'water';
    if (/(call|phone|contact|lagao)\s+(a\s+|my\s+|the\s+)?(daughter|riya|family|doctor)|^(call riya|phone riya)$|ফোন|রিয়া|বেটি/i.test(lower)) return 'call';
    if (/(i feel|i am|lag raha hai)\s+(scared|lost|confused|alone|darr|ghabrahat)|^(help|help me|madad|bachao)$|সহায়|সাহায্য|মতেং/i.test(lower)) return 'confused';
    if (/(start|do|open|play)\s+(a\s+|my\s+|the\s+)?(exercise|exercises|hand claps?|stretches|kasrat|yoga)|^(exercise|kasrat|hand claps?)$|ব্যায়াম|কসৰত|এক্সারসাইজ/i.test(lower)) return 'exercise';
    if (/(show|open|what are|take)\s+(a\s+|my\s+|the\s+)?(medicines?|reminders?|pills?|tablets?|dawai)|^(medicines?|reminders?)$|দবা|औषध/i.test(lower)) return 'medicines';
    if (/(show|open|look at)\s+(a\s+|my\s+|the\s+)?(memories|photos|pictures|album|yaadein)|^(memories|photos)$|স্মৃতি|ছবি/i.test(lower)) return 'memories';
    return null;
  };

  const executeAction = (actionType: string, customPrompt?: string) => {
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    setListening(false);
    speechRecognizer.stopListening();
    audio.playGentleChime();

    setTimeout(() => {
      setVoiceModalOpen(false);

      if (actionType === 'games') {
        const msg = language === 'hi'
          ? `आपके खेल अभी खोल रही हूँ, ${callingName}! चलिए याददाश्त ताज़ा करते हैं।`
          : language === 'as'
          ? `আপোনাৰ খেলাবোৰ এতিয়াই খুলি দিছোঁ ${callingName}! আহক আনন্দ কৰোঁ।`
          : language === 'bn'
          ? `আপনার খেলার পাতাটি এখনই খুলছি ${callingName}! চলুন আনন্দ করি।`
          : language === 'mni'
          ? `অদোমগী শান্ন-খোৎনবশিং হৌজিক হাংদোকচরি ${callingName}!`
          : language === 'nag'
          ? `Apuni laga games aji khulibo, ${callingName}! Ahibi khelibo.`
          : `Opening your games right now, ${callingName}. Let's have fun and exercise our memory!`;
        speakMascot(msg, 'speaking');
        setPatientScreen('games');
      } else if (actionType === 'routine') {
        const msg = language === 'hi'
          ? `${callingName}, यह रही आपकी आज की प्यारी दिनचर्या।`
          : language === 'as'
          ? `${callingName}, এইখন আপোনাৰ আজিৰ সুন্দৰ ৰুটিন।`
          : language === 'mni'
          ? `${callingName}, অসি অদোমগী ঙসিগী নুমিৎ চুপ্পগী থবক্নি।`
          : language === 'bn'
          ? `${callingName}, এই দেখুন আজকের সুন্দর রুটিন।`
          : language === 'nag'
          ? `${callingName}, aji laga schedule eitu asey.`
          : `Here is your gentle schedule for today, ${callingName}.`;
        speakMascot(msg, 'speaking');
        setPatientScreen('activities');
      } else if (actionType === 'water') {
        completeReminder('rem-2');
        const msg = language === 'hi'
          ? `बहुत बढ़िया ${callingName}! मैंने आपका पानी पीने का काम पूरा लिख दिया है।`
          : language === 'as'
          ? `বৰ ধুনীয়া ${callingName}! আপোনাৰ পানী খোৱাৰ কামটো সম্পূৰ্ণ হ'ল।`
          : language === 'mni'
          ? `য়াম্না ফরে ${callingName}! অদোমগী ঈশিং থকপগী থবক অসি লোইরে।`
          : language === 'bn'
          ? `খুব ভালো ${callingName}! আপনার জল খাওয়ার কাজ শেষ হিসেবে লিখে রেখেছি।`
          : language === 'nag'
          ? `Bishi bhal ${callingName}! Paani khowa kaam kothom hoise.`
          : `I have marked your fresh water reminder done, ${callingName}. Stay hydrated and refreshed!`;
        speakMascot(msg, 'speaking');
        setPatientScreen('reminders');
      } else if (actionType === 'call') {
        const msg = language === 'hi'
          ? `आपकी बेटी रिया को तुरंत फोन मिला रही हूँ, ${callingName}। वह आपसे बात करके बहुत खुश होंगी।`
          : language === 'as'
          ? `আপোনাৰ জীয়ৰী ৰিয়ালৈ এতিয়াই ফোন লগাই আছোঁ, ${callingName}।`
          : language === 'mni'
          ? `অদোমগী মচানুপী রিয়াদা হৌজিক ফোন তৌজরি, ${callingName}।`
          : language === 'bn'
          ? `আপনার মেয়ে রিয়াকে এখনই ফোন করছি, ${callingName}। সে কথা বলতে পেরে খুব খুশি হবে।`
          : language === 'nag'
          ? `Apuni laga bacha Riya ke etiya call koribo, ${callingName}.`
          : `Calling your daughter Riya immediately, ${callingName}. She will be so happy to talk.`;
        speakMascot(msg, 'speaking');
        setPatientScreen('emergency');
      } else if (actionType === 'confused') {
        const msg = language === 'hi'
          ? `${callingName}, आप बिल्कुल सुरक्षित हैं। शांत होकर गहरी सांस लें, मैं आपके साथ हूँ।`
          : language === 'as'
          ? `${callingName}, আপুনি একেবাৰে সুৰক্ষিত। লাহেকৈ উশাহ লওক, মই আপোনাৰ লগত আছোঁ।`
          : language === 'mni'
          ? `${callingName}, অদোম সুৰক্ষিত ওইনা লৈরি। তপ্না ৱাখল থৌবীয়ু, ঐহাক অদোমগা লৈরি।`
          : language === 'bn'
          ? `${callingName}, আপনি একদম সুরক্ষিত আছেন। আমি আপনার কাছেই আছি।`
          : language === 'nag'
          ? `${callingName}, apuni safe asey. Dheere saas lobi, moi logot asey.`
          : `You are safe and warm in your home, ${callingName}. Breathe gently with me. I am right beside you.`;
        speakMascot(msg, 'help');
        setPatientScreen('mascot_chat');
      } else if (actionType === 'exercise') {
        const msg = language === 'hi'
          ? `चलिए ${callingName}, आज की हल्की कसरत और ताली व्यायाम साथ में करते हैं।`
          : language === 'as'
          ? `আহক ${callingName}, আজিৰ সহজ ব্যায়াম আৰু হাত চাপৰি একেলগে কৰোঁ।`
          : language === 'mni'
          ? `চৎসি ${callingName}, ঙসিগী অরাইবা হকচাংগী এক্সরসাইজ অসি পুন্না তৌসি।`
          : language === 'bn'
          ? `চলুন ${callingName}, আজকের হালকা ব্যায়াম ও তালি অনুশীলন একসাথে করি।`
          : language === 'nag'
          ? `Ahibi ${callingName}, aji laga exercise sob mili koribo.`
          : `Let's do today's gentle seated stretches and hand claps together, ${callingName}.`;
        speakMascot(msg, 'speaking');
        setPatientScreen('wellness');
      } else if (actionType === 'medicines') {
        const msg = language === 'hi'
          ? `${callingName}, यह रही आपकी दवाइयों और कार्यों की सूची।`
          : language === 'as'
          ? `${callingName}, এইখন আপোনাৰ ঔষধ আৰু মনত পেলাবলগীয়া তালিকা।`
          : `Here is your medicine schedule and daily reminders, ${callingName}.`;
        speakMascot(msg, 'speaking');
        setPatientScreen('reminders');
      } else if (actionType === 'memories') {
        const msg = language === 'hi'
          ? `${callingName}, चलिए आपकी पारिवारिक यादें और तस्वीरें देखते हैं।`
          : language === 'as'
          ? `${callingName}, আহক আপোনাৰ পৰিয়ালৰ ধুনীয়া স্মৃতিবোৰ চাওঁ।`
          : `Opening your family photos and warm memories, ${callingName}.`;
        speakMascot(msg, 'speaking');
        setPatientScreen('memories');
      }
    }, 500);
  };

  const handleConversationalPrompt = async (prompt: string) => {
    if (!prompt || !prompt.trim()) return;
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);

    setListening(false);
    speechRecognizer.stopListening();
    setAiReplying(true);
    setMascotState('thinking');
    audio.playTempleBell();

    try {
      const caregiverContext = {
        nextAppointment: "Neurologist consultation with Dr. Anita Verma this Friday at 11:00 AM at Apollo Geriatric Clinic.",
        daughterName: "Riya Sharma",
        doctorName: "Dr. Anita Verma",
        todayReminders: reminders.map(r => `${r.time}: ${r.title} (${r.status})`),
        gamesList: ["Sequence Recall", "Rhythm Tapping", "Family Flashcards", "Object Sorting", "Dice & Category Game"]
      };

      const reply = await askSangpaOpenAI(prompt, language, [], callingName, caregiverContext);
      const replyText = typeof reply === 'string' ? reply : reply.text;
      setAiReplyText(replyText);
      speakMascot(replyText, 'speaking');
      
      // If action is navigate_games, open games
      if (typeof reply === 'object') {
        if (reply.action === 'navigate_games') {
          setTimeout(() => {
            setVoiceModalOpen(false);
            setAiReplying(false);
            setPatientScreen('games');
          }, 3500);
          return;
        } else if (reply.action === 'complete_water') {
          completeReminder('rem-2');
        } else if (reply.action === 'navigate_emergency') {
          setTimeout(() => {
            setVoiceModalOpen(false);
            setAiReplying(false);
            setPatientScreen('emergency');
          }, 3500);
          return;
        }
      }
    } catch (err) {
      console.error('Voice conversational prompt error:', err);
    } finally {
      setAiReplying(false);
    }
  };

  const handleManualSend = () => {
    if (!hasTriggeredRef.current && recognizedText.trim().length > 1) {
      hasTriggeredRef.current = true;
      const matched = detectActionIntent(recognizedText);
      if (matched) {
        executeAction(matched, recognizedText);
      } else {
        handleConversationalPrompt(recognizedText);
      }
    }
  };

  const handleRestartListening = () => {
    hasTriggeredRef.current = false;
    lastRecognizedRef.current = '';
    setRecognizedText('');
    setAiReplyText('');
    setAiReplying(false);
    setListening(true);
    audio.playTempleBell();
    startRecognitionSession();
  };

  const startRecognitionSession = () => {
    const isSupported = isSpeechRecognitionSupported();
    setMicSupported(isSupported);

    if (isSupported) {
      speechRecognizer.startListening(language, {
        onStart: () => {
          setListening(true);
          setMascotState('listening');
        },
        onResult: (text: string, isFinal: boolean) => {
          setRecognizedText(text);
          lastRecognizedRef.current = text;

          const matchedIntent = detectActionIntent(text);
          if (matchedIntent && !hasTriggeredRef.current) {
            hasTriggeredRef.current = true;
            if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
            executeAction(matchedIntent, text);
            return;
          }

          if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);

          if (isFinal && !hasTriggeredRef.current && text.trim().length > 2) {
            hasTriggeredRef.current = true;
            handleConversationalPrompt(text);
          } else if (!hasTriggeredRef.current && text.trim().length > 4) {
            // Auto-trigger if speaker pauses for 1.8 seconds
            silenceTimerRef.current = setTimeout(() => {
              if (!hasTriggeredRef.current && lastRecognizedRef.current.trim().length > 3) {
                hasTriggeredRef.current = true;
                handleConversationalPrompt(lastRecognizedRef.current);
              }
            }, 1800);
          }
        },
        onError: (err: string) => {
          console.warn('Voice modal mic error:', err);
        },
        onEnd: () => {
          setListening(false);
          // Auto-trigger if finished speaking
          if (!hasTriggeredRef.current && lastRecognizedRef.current.trim().length > 2) {
            hasTriggeredRef.current = true;
            const matched = detectActionIntent(lastRecognizedRef.current);
            if (matched) {
              executeAction(matched, lastRecognizedRef.current);
            } else {
              handleConversationalPrompt(lastRecognizedRef.current);
            }
          }
        }
      });
    }
  };

  useEffect(() => {
    if (!voiceModalOpen) {
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      speechRecognizer.stopListening();
      hasTriggeredRef.current = false;
      return;
    }

    setListening(true);
    setRecognizedText('');
    setAiReplyText('');
    setAiReplying(false);
    hasTriggeredRef.current = false;
    lastRecognizedRef.current = '';
    audio.playTempleBell();

    startRecognitionSession();

    return () => {
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      speechRecognizer.stopListening();
    };
  }, [voiceModalOpen, language]);

  if (!voiceModalOpen) return null;

  const handleVoiceCommand = (command: string, actionType: string) => {
    if (hasTriggeredRef.current) return;
    hasTriggeredRef.current = true;
    setRecognizedText(command);
    executeAction(actionType, command);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border-2 border-sangpa-300 rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl animate-mascot-idle relative text-center">
        {/* Close Button */}
        <button
          onClick={() => {
            if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
            speechRecognizer.stopListening();
            audio.stopSpeaking();
            setVoiceModalOpen(false);
          }}
          className="absolute top-4 right-4 p-2 rounded-full bg-sangpa-100 hover:bg-sangpa-200 text-sangpa-700 transition-colors cursor-pointer"
          title="Close voice listener"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Mascot & Mic Visual */}
        <div className="relative mx-auto w-24 h-24 mb-3">
          <div className="w-full h-full rounded-full overflow-hidden border-4 border-sangpa-400 shadow-md">
            <img src="/assets/mascot.png" alt="SANGPA Mascot" className="w-full h-full object-cover" />
          </div>
          <div className="absolute -bottom-2 -right-2 p-2 bg-emerald-500 rounded-full text-white ring-4 ring-emerald-200 animate-pulse">
            <Mic className="w-5 h-5" />
          </div>
        </div>

        <h3 className="text-xl sm:text-2xl font-bold text-sangpa-900 mb-1">
          {aiReplying ? "Sangpa is thinking..." : aiReplyText ? "Sangpa replied:" : listening ? "Sangpa is listening..." : "Ready"}
        </h3>
        
        {aiReplyText ? (
          <div className="my-3 p-4 bg-gradient-to-br from-sangpa-50 to-sangpa-100 border-2 border-sangpa-400 rounded-2xl text-sangpa-900 font-semibold text-sm sm:text-base animate-fadeIn text-left">
            <div className="flex items-center justify-between mb-1.5 border-b border-sangpa-300/60 pb-1">
              <span className="text-xs font-black text-sangpa-700 uppercase tracking-wider flex items-center gap-1.5">
                <Volume2 className="w-3.5 h-3.5 text-sangpa-600 animate-pulse" />
                Sangpa Spoke:
              </span>
              <button
                onClick={() => speakMascot(aiReplyText, 'speaking')}
                className="text-xs text-sangpa-700 font-bold hover:underline flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" /> Replay Voice
              </button>
            </div>
            <p className="leading-relaxed">"{aiReplyText}"</p>
            <div className="mt-3 flex items-center justify-end gap-2 pt-2 border-t border-sangpa-300/60">
              <button
                onClick={handleRestartListening}
                className="px-3 py-1.5 bg-sangpa-500 hover:bg-sangpa-600 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                Ask Another
              </button>
              <button
                onClick={() => {
                  audio.stopSpeaking();
                  setVoiceModalOpen(false);
                }}
                className="px-3 py-1.5 bg-white border border-sangpa-300 text-sangpa-800 rounded-xl text-xs font-bold transition-all hover:bg-sangpa-50 cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <div className="mb-4">
            <p className="text-sangpa-600 text-sm min-h-[28px]">
              {recognizedText ? (
                <span className="font-semibold text-sangpa-900 bg-sangpa-100 px-3 py-1.5 rounded-full inline-flex items-center gap-2">
                  <span>"{recognizedText}"</span>
                  <button 
                    onClick={handleManualSend}
                    className="p-1 rounded-full bg-sangpa-600 text-white hover:bg-sangpa-700 cursor-pointer"
                    title="Ask now"
                  >
                    <Send className="w-3 h-3" />
                  </button>
                </span>
              ) : listening ? (
                micSupported 
                  ? "Speak in English, Hindi, or any language, or tap an option below:" 
                  : "Tap one of the common voice requests below:"
              ) : (
                "Processing..."
              )}
            </p>
          </div>
        )}

        {/* Animated Audio Wave bars */}
        {listening && !aiReplyText && (
          <div className="flex items-center justify-center gap-1.5 h-8 mb-4">
            <span className="w-1.5 h-5 bg-sangpa-400 rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
            <span className="w-1.5 h-8 bg-sangpa-500 rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
            <span className="w-1.5 h-6 bg-sangpa-600 rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
            <span className="w-1.5 h-8 bg-sangpa-500 rounded-full animate-pulse" style={{ animationDelay: '450ms' }} />
            <span className="w-1.5 h-4 bg-sangpa-400 rounded-full animate-pulse" style={{ animationDelay: '600ms' }} />
          </div>
        )}

        {/* Quick Voice Commands to tap or speak */}
        {!aiReplyText && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-left">
            <button
              onClick={() => handleVoiceCommand("Open my games", 'games')}
              className="flex items-center gap-2.5 p-2.5 rounded-2xl bg-sangpa-50 hover:bg-sangpa-100 border border-sangpa-200 text-sangpa-900 font-semibold text-xs sm:text-sm transition-all active:scale-98 cursor-pointer"
            >
              <Gamepad2 className="w-4 h-4 text-sangpa-600 flex-shrink-0" />
              <span>"Open my games"</span>
            </button>

            <button
              onClick={() => handleVoiceCommand("What do I do today?", 'routine')}
              className="flex items-center gap-2.5 p-2.5 rounded-2xl bg-sangpa-50 hover:bg-sangpa-100 border border-sangpa-200 text-sangpa-900 font-semibold text-xs sm:text-sm transition-all active:scale-98 cursor-pointer"
            >
              <Activity className="w-4 h-4 text-sangpa-600 flex-shrink-0" />
              <span>"What do I do today?"</span>
            </button>

            <button
              onClick={() => handleVoiceCommand("I drank my water", 'water')}
              className="flex items-center gap-2.5 p-2.5 rounded-2xl bg-sangpa-50 hover:bg-sangpa-100 border border-sangpa-200 text-sangpa-900 font-semibold text-xs sm:text-sm transition-all active:scale-98 cursor-pointer"
            >
              <Droplets className="w-4 h-4 text-sangpa-600 flex-shrink-0" />
              <span>"I drank my water"</span>
            </button>

            <button
              onClick={() => handleVoiceCommand("Call my daughter Riya", 'call')}
              className="flex items-center gap-2.5 p-2.5 rounded-2xl bg-emergency-50 hover:bg-emergency-100 border border-emergency-200 text-emergency-800 font-semibold text-xs sm:text-sm transition-all active:scale-98 cursor-pointer"
            >
              <Phone className="w-4 h-4 text-emergency-600 flex-shrink-0" />
              <span>"Call my daughter"</span>
            </button>

            <button
              onClick={() => handleVoiceCommand("Play today's exercise", 'exercise')}
              className="flex items-center gap-2.5 p-2.5 rounded-2xl bg-sangpa-50 hover:bg-sangpa-100 border border-sangpa-200 text-sangpa-900 font-semibold text-xs sm:text-sm transition-all active:scale-98 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-sangpa-600 flex-shrink-0" />
              <span>"Play today's exercise"</span>
            </button>

            <button
              onClick={() => handleVoiceCommand("Show my medicines", 'medicines')}
              className="flex items-center gap-2.5 p-2.5 rounded-2xl bg-sangpa-50 hover:bg-sangpa-100 border border-sangpa-200 text-sangpa-900 font-semibold text-xs sm:text-sm transition-all active:scale-98 cursor-pointer"
            >
              <Pill className="w-4 h-4 text-sangpa-600 flex-shrink-0" />
              <span>"Show my medicines"</span>
            </button>

            <button
              onClick={() => handleVoiceCommand("Show family photos", 'memories')}
              className="flex items-center gap-2.5 p-2.5 rounded-2xl bg-sangpa-50 hover:bg-sangpa-100 border border-sangpa-200 text-sangpa-900 font-semibold text-xs sm:text-sm transition-all active:scale-98 cursor-pointer"
            >
              <Image className="w-4 h-4 text-sangpa-600 flex-shrink-0" />
              <span>"Family memories"</span>
            </button>

            <button
              onClick={() => handleVoiceCommand("I feel confused and worried", 'confused')}
              className="flex items-center gap-2.5 p-2.5 rounded-2xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 font-semibold text-xs sm:text-sm transition-all active:scale-98 cursor-pointer"
            >
              <Heart className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span>"I feel confused"</span>
            </button>
          </div>
        )}

        <div className="mt-4 text-xs text-sangpa-500 flex items-center justify-center gap-1.5">
          <Volume2 className="w-4 h-4 text-sangpa-400" />
          <span>Sangpa answers questions directly & executes spoken actions</span>
        </div>
      </div>
    </div>
  );
};
