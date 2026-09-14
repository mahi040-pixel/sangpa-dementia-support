import React from 'react';
import { useApp } from '../../../context/AppContext';
import { 
  ListOrdered, 
  Music, 
  Image as ImageIcon, 
  Boxes, 
  Dices, 
  HeartHandshake, 
  ArrowLeft, 
  Sparkles, 
  WifiOff, 
  CheckCircle,
  Play,
  ChevronRight
} from 'lucide-react';
import { PatientScreen, CognitiveGame, LanguageCode } from '../../../types';

interface LocalizedGameData {
  title: string;
  desc: string;
}

interface HubStrings {
  heading: string;
  subtitle: string;
  recommendedBadge: string;
  recommendedTitle: string;
  recommendedDesc: string;
  playNow: string;
  play: string;
  level: string;
  caregiverPick: string;
  recall: string;
  offlineReady: string;
  footerMessage: string;
  gameData: Record<string, LocalizedGameData>;
}

const STRINGS: Record<LanguageCode, HubStrings> = {
  en: {
    heading: "Games",
    subtitle: "Gentle memory, rhythm, and culturally familiar play",
    recommendedBadge: "⭐ Recommended for You",
    recommendedTitle: "Sequence Recall: Courtyard Symbols",
    recommendedDesc: "Remember gentle traditional items. Adaptive difficulty adjusts automatically.",
    playNow: "Play Now",
    play: "Play",
    level: "Level",
    caregiverPick: "Caregiver Pick",
    recall: "recall",
    offlineReady: "Offline Ready",
    footerMessage: "Every game adapts to your pace. Enjoy the moment with no pressure.",
    gameData: {
      sequence: {
        title: "Sequence Recall",
        desc: "Remember and tap traditional cultural symbols in order."
      },
      rhythm: {
        title: "Rhythm Tapping",
        desc: "Tap gently along to a calm rhythm: Tap, Tap, Pause, Tap."
      },
      flashcards: {
        title: "Loved Ones Flashcards",
        desc: "Recall family faces, happy moments, and loving voices."
      },
      sorting: {
        title: "Object Sorting",
        desc: "Sort familiar fruits, festival treasures, and home utensils."
      },
      dice_category: {
        title: "Dice Math Journey",
        desc: "Roll digital dice for gentle counting, adding, and familiar cultural math."
      },
      dice_movement: {
        title: "Gentle Movement Dice",
        desc: "Chair-safe easy movements for relaxation, breath, and joint ease."
      }
    }
  },
  hi: {
    heading: "खेल",
    subtitle: "याददाश्त, लय और सांस्कृतिक रूप से परिचित मनोरंजक खेल",
    recommendedBadge: "⭐ आपके लिए विशेष पसंद",
    recommendedTitle: "क्रम याद रखें: आँगन के प्रतीक",
    recommendedDesc: "सुंदर पारंपरिक वस्तुओं को क्रम में याद रखें। कठिनाई स्वतः अनुकूलित होती है।",
    playNow: "अभी खेलें",
    play: "खेलें",
    level: "स्तर",
    caregiverPick: "पसंदीदा",
    recall: "स्मरण",
    offlineReady: "ऑफ़लाइन तैयार",
    footerMessage: "हर खेल आपकी गति के अनुसार ढलता है। बिना किसी तनाव के आनंद लें।",
    gameData: {
      sequence: {
        title: "क्रम याद रखें (Sequence)",
        desc: "सुंदर पारंपरिक वस्तुओं को उसी क्रम में याद रखें और छुएं।"
      },
      rhythm: {
        title: "लयबद्ध थाप (Rhythm)",
        desc: "एक शांत संगीत की लय पर उँगलियों से धीरे-धीरे थाप दें।"
      },
      flashcards: {
        title: "प्रियजनों के चित्र (Flashcards)",
        desc: "परिवार के प्रिय चेहरे, सुखद यादें और उनकी आवाज़ें पहचानें।"
      },
      sorting: {
        title: "वस्तु वर्गीकरण (Sorting)",
        desc: "ताज़े फल, त्योहारों की सामग्री और बर्तनों को सही टोकरी में रखें।"
      },
      dice_category: {
        title: "पासा गणित यात्रा (Dice Math)",
        desc: "पासा फेंकें और फल, मिठाइयों के साथ आसान गिनती व जोड़ का आनंद लें।"
      },
      dice_movement: {
        title: "सरल व्यायाम पासा (Movement)",
        desc: "कुर्सी पर बैठकर आसान खिंचाव, सांस और जोड़ों के लिए व्यायाम।"
      }
    }
  },
  as: {
    heading: "খেল-ধেমালি",
    subtitle: "স্মৃতি, ছন্দ আৰু পৰিচিত সংস্কৃতিৰ আনন্দময় খেল",
    recommendedBadge: "⭐ আপোনাৰ বাবে পৰামৰ্শ",
    recommendedTitle: "ক্ৰম স্মৃতি: চোতালৰ প্ৰতীক",
    recommendedDesc: "পৰম্পৰাগত সামগ্ৰী ক্ৰমত মনত ৰাখক। খেল আপোনাৰ অনুসাৰে সলনি হ'ব।",
    playNow: "এতিয়া খেলক",
    play: "খেলক",
    level: "স্তৰ",
    caregiverPick: "পচন্দ",
    recall: "স্মৃতি",
    offlineReady: "অফলাইন সাজু",
    footerMessage: "প্ৰতিটো খেল আপোনাৰ গতিত চলিব। কোনো চাপ নোহোৱাকৈ উপভোগ কৰক।",
    gameData: {
      sequence: {
        title: "ক্ৰম স্মৃতি (Sequence)",
        desc: "পৰম্পৰাগত সামগ্ৰীসমূহ একে ক্ৰমত মনত ৰাখি স্পৰ্শ কৰক।"
      },
      rhythm: {
        title: "ছন্দৰ চাপৰি (Rhythm)",
        desc: "শান্ত সুৰৰ ছন্দত লাহে লাহে আঙুলিৰে চাপৰি বজাওক।"
      },
      flashcards: {
        title: "মৰমৰ আত্মীয়ৰ ছবি (Flashcards)",
        desc: "পৰিয়ালৰ মৰমৰ মুখবোৰ আৰু আনন্দৰ স্মৃতি মনত পেলাওক।"
      },
      sorting: {
        title: "সামগ্ৰী শ্ৰেণীবিভাজন (Sorting)",
        desc: "ফল-মূল, উৎসৱৰ সামগ্ৰী আৰু ঘৰুৱা বাচন সঠিক খৰাহীত থওক।"
      },
      dice_category: {
        title: "পাশা গণিত যাত্ৰা (Dice Math)",
        desc: "পাশা গুৰুৱাওক আৰু ফল-মূল, মিঠাইৰ সৈতে সহজ গণনা আৰু যোগৰ আনন্দ লওক।"
      },
      dice_movement: {
        title: "সহজ ব্যায়ামৰ পাশা (Movement)",
        desc: "চকীত বহি আৰামদায়ক হাত-ভৰিৰ লৰচৰ আৰু উশাহৰ অনুশীলন।"
      }
    }
  },
  bn: {
    heading: "খেলাধুলা",
    subtitle: "স্মৃতি, ছন্দ ও চেনা সংস্কৃতির আনন্দদায়ক খেলা",
    recommendedBadge: "⭐ আপনার জন্য বিশেষ পছন্দ",
    recommendedTitle: "ক্রম স্মৃতি: উঠোনের প্রতীক",
    recommendedDesc: "ঐতিহ্যবাহী জিনিসগুলি ক্রমানুসারে মনে রাখুন। আপনার সুবিধামতো স্তর পরিবর্তিত হবে।",
    playNow: "এখনই খেলুন",
    play: "খেলুন",
    level: "স্তর",
    caregiverPick: "পছন্দ",
    recall: "স্মরণ",
    offlineReady: "অফলাইন প্রস্তুত",
    footerMessage: "প্রতিটি খেলা আপনার ছন্দে মানিয়ে নেয়। কোনো চাপ ছাড়া আনন্দের সাথে খেলুন।",
    gameData: {
      sequence: {
        title: "ক্রম স্মৃতি (Sequence)",
        desc: "ঐতিহ্যবাহী জিনিসগুলি ক্রমানুসারে মনে রাখুন এবং স্পর্শ করুন।"
      },
      rhythm: {
        title: "ছন্দের তাল (Rhythm)",
        desc: "শান্ত সুরের ছন্দে ধীরে ধীরে আঙুল দিয়ে তাল দিন।"
      },
      flashcards: {
        title: "প্রিয়জনদের ছবি (Flashcards)",
        desc: "পরিবারের প্রিয় মুখ ও মধুর স্মৃতির কথা স্মরণ করুন।"
      },
      sorting: {
        title: "জিনিসপত্র সাজানো (Sorting)",
        desc: "ফলমূল, উৎসবের উপকরণ ও ঘরের জিনিস সঠিক ঝুড়িতে রাখুন।"
      },
      dice_category: {
        title: "পাশা গণিত যাত্রা (Dice Math)",
        desc: "পাশা ফেলুন এবং মিষ্টি, ফলমূলের সাথে সহজ গণনা ও যোগের আনন্দ নিন।"
      },
      dice_movement: {
        title: "সহজ ব্যায়ামের পাশা (Movement)",
        desc: "চেয়ারে বসে আরামদায়ক শরীরের নড়াচড়া ও শ্বাসের অভ্যাস।"
      }
    }
  },
  mni: {
    heading: "শান-খোৎনবশিং",
    subtitle: "নিংশিংবা, ঈশৈগী রিদম অমসুং হরাওবা শান্নপোৎশিং",
    recommendedBadge: "⭐ অদোমগীদমক অফবা",
    recommendedTitle: "ক্রম নিংশিংবা: খোংহামগী খুদমশিং",
    recommendedDesc: "লাইনা চৎনবীগী পোৎলমশিং নিংশিংদুনা শান্নবা।",
    playNow: "হৌজিক শান্নসি",
    play: "শান্নসি",
    level: "লেভেল",
    caregiverPick: "খল্লবা",
    recall: "নিংশিংবা",
    offlineReady: "অফলাইন য়াওরে",
    footerMessage: "খেল খুদিংমক অদোমগী খোঙজেলদা চৎকনি। নুংঙাইনা শান্নবীয়ু।",
    gameData: {
      sequence: {
        title: "ক্রম নিংশিংবা (Sequence)",
        desc: "চৎনবীগী খুদমশিং মথং-মনাও নাইনা নিংশিংদুনা থম্ব।"
      },
      rhythm: {
        title: "ঈশৈগী রিদম চাপুরি (Rhythm)",
        desc: "ঈশৈগী তপ্পা রিদমদা খুৎপাক খোয়বা।"
      },
      flashcards: {
        title: "নাকনবা মীশিংগী ফোতো (Flashcards)",
        desc: "ইমুংগী নুংশিবা মীশিংগী মশক অমসুং খোন্থোক নিংশিংবা।"
      },
      sorting: {
        title: "পোৎলমশিং তোঙান্না খাইদোকপা (Sorting)",
        desc: "উহৈ-ৱাহৈ অমসুং য়ুমগী পোৎলমশিং চপ চাবা থুংদা থম্বা।"
      },
      dice_category: {
        title: "ডাইস মেথ খোংচৎ (Dice Math)",
        desc: "ডাইস লেংদুনা উহৈ-ৱাহৈ, হরাওবা পোৎলমশিংগা লোয়ননা লাইরবা মশীং থীবা।"
      },
      dice_movement: {
        title: "হকচাংগী তপ্পা এক্সরসাইজ ডাইস",
        desc: "চৌকিদা ফমদুনা হকচাং শোমহনবগী তপ্পা এক্সরসাইজ।"
      }
    }
  },
  nag: {
    heading: "Games",
    subtitle: "Gentle memory, rhythm aru bhal laga games",
    recommendedBadge: "⭐ Apnar karone bhal",
    recommendedTitle: "Sequence Recall: Ghoror bostu",
    recommendedDesc: "Bostukhan krome krome monot rakhabi. Aponi bhal pabo.",
    playNow: "Khelabi",
    play: "Khelabi",
    level: "Level",
    caregiverPick: "Caregiver Pick",
    recall: "recall",
    offlineReady: "Offline Ready",
    footerMessage: "Sob game aponi hisab te chole. Bhal pabo kono tension nai.",
    gameData: {
      sequence: {
        title: "Sequence Recall",
        desc: "Bostukhan krome krome monot rakhikena dababi."
      },
      rhythm: {
        title: "Rhythm Tapping",
        desc: "Shanto gaan laga taalda aaste aaste dababi."
      },
      flashcards: {
        title: "Family Flashcards",
        desc: "Ghoror manu laga chehra aru bhal kothakhan monot koribi."
      },
      sorting: {
        title: "Object Sorting",
        desc: "Fal-ful, festival laga bostu aru ghoror bartan alag alag rakhabi."
      },
      dice_category: {
        title: "Dice Math Journey",
        desc: "Dice ghurabi aru mithai, fal logote aaste aaste hisab aru counting koribi."
      },
      dice_movement: {
        title: "Gentle Movement Dice",
        desc: "Chowki te bohikena aaste aaste hath-theng hilabole laga exercise."
      }
    }
  },
  es: {
    heading: "Juegos",
    subtitle: "Juegos suaves de memoria, ritmo y alegría cultural",
    recommendedBadge: "⭐ Recomendado para ti",
    recommendedTitle: "Memoria Secuencial: Símbolos Familiares",
    recommendedDesc: "Recuerda objetos tradicionales. La dificultad se adapta suavemente.",
    playNow: "Jugar Ahora",
    play: "Jugar",
    level: "Nivel",
    caregiverPick: "Recomendado",
    recall: "acierto",
    offlineReady: "Listo sin conexión",
    footerMessage: "Cada juego se adapta a tu propio ritmo. Disfruta sin ninguna presión.",
    gameData: {
      sequence: {
        title: "Memoria Secuencial",
        desc: "Recuerda y toca los símbolos tradicionales en su orden."
      },
      rhythm: {
        title: "Toque de Ritmo",
        desc: "Toca suavemente al compás de un ritmo tranquilo."
      },
      flashcards: {
        title: "Tarjetas Familiares",
        desc: "Recuerda los rostros familiares, momentos felices y voces."
      },
      sorting: {
        title: "Clasificación de Objetos",
        desc: "Clasifica frutas frescas, objetos festivos y utensilios del hogar."
      },
      dice_category: {
        title: "Viaje Matemático con Dados",
        desc: "Lanza dados digitales para contar, sumar y resolver operaciones sencillas con objetos cotidianos."
      },
      dice_movement: {
        title: "Dado de Movimiento Suave",
        desc: "Movimientos seguros sentado en silla para relajar articulaciones y respirar."
      }
    }
  }
};

export const GameHub: React.FC = () => {
  const { setPatientScreen, isOffline, games, language } = useApp();

  const str = STRINGS[language] || STRINGS.en;

  const handleOpenGame = (gameId: string) => {
    const screenMap: Record<string, PatientScreen> = {
      sequence: 'game_sequence',
      rhythm: 'game_rhythm',
      flashcards: 'game_flashcards',
      sorting: 'game_sorting',
      dice_category: 'game_dice_math',
      dice_math: 'game_dice_math',
      dice_movement: 'game_dice_movement',
    };
    setPatientScreen(screenMap[gameId] || 'games');
  };

  const getIcon = (id: string) => {
    switch (id) {
      case 'sequence': return <ListOrdered className="w-5 h-5 sm:w-6 sm:h-6 text-sangpa-700" />;
      case 'rhythm': return <Music className="w-5 h-5 sm:w-6 sm:h-6 text-purple-700" />;
      case 'flashcards': return <ImageIcon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-700" />;
      case 'sorting': return <Boxes className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-700" />;
      case 'dice_category': return <Dices className="w-5 h-5 sm:w-6 sm:h-6 text-amber-700" />;
      case 'dice_movement': return <HeartHandshake className="w-5 h-5 sm:w-6 sm:h-6 text-rose-700" />;
      default: return <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-sangpa-700" />;
    }
  };

  return (
    <div className="flex-1 p-3.5 sm:p-5 max-w-xl mx-auto w-full space-y-3.5 sm:space-y-4 overflow-x-hidden box-border">
      {/* Header with strictly "Games" heading */}
      <div className="flex items-center justify-between gap-2 border-b border-sangpa-200/80 pb-2.5">
        <div className="flex items-center gap-2.5 min-w-0">
          <button
            onClick={() => setPatientScreen('home')}
            className="p-2 rounded-2xl bg-white border border-sangpa-300 hover:bg-sangpa-100 text-sangpa-800 transition-colors shadow-2xs flex-shrink-0"
            title="Go back home"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="min-w-0">
            <h2 className="text-xl sm:text-2xl font-extrabold text-sangpa-900 tracking-tight truncate">
              {str.heading}
            </h2>
            <p className="text-xs text-sangpa-600 truncate">
              {str.subtitle}
            </p>
          </div>
        </div>

        {isOffline && (
          <span className="flex items-center gap-1 text-[10px] font-bold text-sangpa-700 bg-sangpa-100 px-2 py-0.5 rounded-full border border-sangpa-200 flex-shrink-0">
            <WifiOff className="w-3 h-3 text-sangpa-600" />
            <span>{str.offlineReady}</span>
          </span>
        )}
      </div>

      {/* Recommended Game Banner - Clean, Contained Inside Mobile Boundaries */}
      <div className="bg-gradient-to-r from-sangpa-600 to-sangpa-500 rounded-3xl p-4 sm:p-5 text-white shadow-soft relative overflow-hidden w-full box-border">
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 w-full">
          <div className="min-w-0 w-full sm:w-auto">
            <span className="inline-block px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-bold uppercase tracking-wider mb-1">
              {str.recommendedBadge}
            </span>
            <h3 className="text-lg sm:text-xl font-extrabold text-white leading-snug break-words">
              {str.recommendedTitle}
            </h3>
            <p className="text-xs text-sangpa-100 mt-1 max-w-sm leading-relaxed">
              {str.recommendedDesc}
            </p>
          </div>

          <button
            onClick={() => setPatientScreen('game_sequence')}
            className="w-full sm:w-auto py-2.5 px-5 rounded-2xl bg-white text-sangpa-900 hover:bg-sangpa-50 font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 flex-shrink-0 mt-1 sm:mt-0"
          >
            <Play className="w-4 h-4 text-sangpa-600 fill-current" />
            <span>{str.playNow}</span>
          </button>
        </div>
      </div>

      {/* Grid of Games - Well-contained within borders without overflow */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3.5 pt-0.5 w-full box-border">
        {games.map((g: CognitiveGame) => {
          const gameText = str.gameData[g.id] || { title: g.title, desc: g.description };

          return (
            <div
              key={g.id}
              onClick={() => handleOpenGame(g.id)}
              className="cursor-pointer bg-white hover:bg-sangpa-50/90 border-2 border-sangpa-200 hover:border-sangpa-400 rounded-2xl sm:rounded-3xl p-3.5 sm:p-4 shadow-2xs transition-all active:scale-98 flex flex-col justify-between w-full box-border overflow-hidden group"
            >
              <div className="w-full min-w-0">
                <div className="flex items-center justify-between gap-2 mb-2 w-full">
                  <div className="p-2.5 rounded-xl bg-sangpa-100 text-sangpa-700 flex-shrink-0 group-hover:bg-sangpa-500 group-hover:text-white transition-colors">
                    {getIcon(g.id)}
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap justify-end">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-sangpa-100 text-sangpa-800">
                      {str.level} {g.difficultyLevel}
                    </span>
                    {g.isCaregiverRecommended && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-200">
                        {str.caregiverPick}
                      </span>
                    )}
                  </div>
                </div>

                <h4 className="text-base font-extrabold text-sangpa-900 leading-snug truncate">
                  {gameText.title}
                </h4>
                <p className="text-xs text-sangpa-600 mt-1 line-clamp-2 leading-relaxed">
                  {gameText.desc}
                </p>
              </div>

              {/* Bottom Action Bar - Fully Contained Inside the Card */}
              <div className="mt-3 pt-2.5 border-t border-sangpa-100 flex items-center justify-between text-xs text-sangpa-700 w-full">
                <span className="flex items-center gap-1 font-bold text-emerald-700 text-[11px] truncate">
                  <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{g.accuracy}% {str.recall}</span>
                </span>

                <span className="px-3 py-1 rounded-xl bg-sangpa-500 group-hover:bg-sangpa-600 text-white font-bold text-xs flex items-center gap-1 shadow-2xs transition-colors flex-shrink-0">
                  <span>{str.play}</span>
                  <Play className="w-3 h-3 fill-current" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Encouragement Footer */}
      <p className="text-center text-xs text-sangpa-600 italic pt-1 leading-relaxed">
        {str.footerMessage}
      </p>
    </div>
  );
};
