import React, { useState, useEffect, useCallback } from 'react';
import { useApp } from '../../../context/AppContext';
import { 
  ArrowLeft, 
  Dices, 
  Volume2, 
  Sparkles, 
  Coffee, 
  HelpCircle, 
  Award, 
  Play,
  Plus,
  ArrowRight,
  TrendingUp
} from 'lucide-react';
import { audio } from '../../../utils/audio';
import { 
  LanguageCode, 
  DiceMathActivityType, 
  DiceMathConfig, 
  DiceMathSessionRecord 
} from '../../../types';

type NumericDifficulty = 1 | 2 | 3;

// Cultural objects configuration
interface CulturalItem {
  id: string;
  emoji: string;
  names: Record<LanguageCode, string>;
}

const CULTURAL_ITEMS: CulturalItem[] = [
  {
    id: 'laddu',
    emoji: '🟡',
    names: {
      en: 'Sweet Laddus',
      hi: 'बेसन के लड्डू',
      as: 'মিঠাইৰ লাড়ু',
      bn: 'সুস্বাদু লাড্ডু',
      mni: 'নুংঙাইবা লাডু',
      nag: 'Meetha Laddu',
      es: 'Dulces Laddus'
    }
  },
  {
    id: 'mango',
    emoji: '🥭',
    names: {
      en: 'Ripe Mangoes',
      hi: 'मीठे आम',
      as: 'পকা আম',
      bn: 'পাকা আম',
      mni: 'হৈনু',
      nag: 'Paka Aam',
      es: 'Mangos maduros'
    }
  },
  {
    id: 'apple',
    emoji: '🍎',
    names: {
      en: 'Fresh Apples',
      hi: 'ताज़े सेब',
      as: 'মিঠা আপেল',
      bn: 'তাজা আপেল',
      mni: 'সেব',
      nag: 'Apple',
      es: 'Manzanas frescas'
    }
  },
  {
    id: 'chai',
    emoji: '☕',
    names: {
      en: 'Cups of Chai',
      hi: 'गरम चाय के कप',
      as: 'গৰম চাহৰ কাপ',
      bn: 'গরম চা',
      mni: 'চা',
      nag: 'Garam Cha',
      es: 'Tazas de té chai'
    }
  },
  {
    id: 'diya',
    emoji: '🪔',
    names: {
      en: 'Festival Diyas',
      hi: 'पूजा के दीये',
      as: 'উৎসৱৰ চাকি',
      bn: 'উৎসবের প্রদীপ',
      mni: 'থাওইচাক',
      nag: 'Puja Diya',
      es: 'Lámparas Diyas'
    }
  },
  {
    id: 'banana',
    emoji: '🍌',
    names: {
      en: 'Yellow Bananas',
      hi: 'पके केले',
      as: 'পকা কল',
      bn: 'পাকা কলা',
      mni: 'লফোই',
      nag: 'Poka Kola',
      es: 'Plátanos'
    }
  }
];

// UI Localized Strings
interface GameUIStrings {
  title: string;
  subtitle: string;
  rollDice: string;
  rolling: string;
  level: string;
  level1Label: string;
  level2Label: string;
  level3Label: string;
  listenAgain: string;
  hintButton: string;
  pauseButton: string;
  resumeButton: string;
  pauseTitle: string;
  pauseMessage: string;
  celebrationTitle: string;
  celebrationSubtitle: string;
  moodPrompt: string;
  moodCalm: string;
  moodHappy: string;
  moodLoved: string;
  playAgain: string;
  backToGames: string;
  streakText: string;
  encouragementDefault: string;
  biggerLeft: string;
  biggerRight: string;
  shopUnit: string;
  pricePerItem: string;
  totalCost: string;
  questionNumber: string;
  nextQuestion: string;
  finishSession: string;
  wellDone: string;
  tryTogether: string;
}

const UI_TEXT: Record<LanguageCode, GameUIStrings> = {
  en: {
    title: 'Dice Math Journey',
    subtitle: 'Gentle counting, joyful math & familiar stories',
    rollDice: 'Roll the Lucky Dice',
    rolling: 'Rolling the dice...',
    level: 'Difficulty Level',
    level1Label: 'Level 1: Gentle 1-5',
    level2Label: 'Level 2: Friendly 1-10',
    level3Label: 'Level 3: Everyday Math',
    listenAgain: 'Hear Sangpa speak',
    hintButton: 'Gentle Hint',
    pauseButton: 'Take a Break',
    resumeButton: 'Resume Game',
    pauseTitle: 'Restful Pause',
    pauseMessage: 'Take a warm sip of tea, relax your shoulders, and breathe gently. There is never any rush.',
    celebrationTitle: 'Joyful Journey Completed!',
    celebrationSubtitle: 'You did wonderful math with Sangpa today!',
    moodPrompt: 'How are you feeling right now?',
    moodCalm: '🌸 Peaceful & Calm',
    moodHappy: '😊 Happy & Proud',
    moodLoved: '❤️ Loved & Cherished',
    playAgain: 'Play Another Round',
    backToGames: 'Back to Games Hub',
    streakText: 'Joyful steps together',
    encouragementDefault: 'Take your time. Every step is lovely!',
    biggerLeft: 'Left Plate',
    biggerRight: 'Right Plate',
    shopUnit: '₹',
    pricePerItem: 'each',
    totalCost: 'Total needed',
    questionNumber: 'Question',
    nextQuestion: 'Next Activity',
    finishSession: 'Finish for Today',
    wellDone: 'Wonderful job! Spot on!',
    tryTogether: 'Let\'s count them together! Take all the time you like.'
  },
  hi: {
    title: 'पासा गणित यात्रा',
    subtitle: 'सरल गिनती, सुखद गणित और जानी-पहचानी वस्तुएं',
    rollDice: 'भाग्यशाली पासा फेंकें',
    rolling: 'पासा घूम रहा है...',
    level: 'कठिनाई स्तर',
    level1Label: 'स्तर 1: आसान 1-5',
    level2Label: 'स्तर 2: सुखद 1-10',
    level3Label: 'स्तर 3: दैनिक हिसाब',
    listenAgain: 'सांगपा की आवाज़ सुनें',
    hintButton: 'सहारा / संकेत',
    pauseButton: 'विश्राम लें',
    resumeButton: 'खेल जारी रखें',
    pauseTitle: 'विश्राम का समय',
    pauseMessage: 'थोड़ा गुनगुना पानी या चाय पिएं, कंधे ढीले छोड़ें। कोई भी जल्दी नहीं है।',
    celebrationTitle: 'बहुत सुंदर गणित यात्रा!',
    celebrationSubtitle: 'आज आपने सांगपा के साथ बहुत अच्छा खेल खेला!',
    moodPrompt: 'अभी आपको कैसा लग रहा है?',
    moodCalm: '🌸 शांत और सहज',
    moodHappy: '😊 प्रसन्न और खुश',
    moodLoved: '❤️ स्नेह और प्यार',
    playAgain: 'एक और बार खेलें',
    backToGames: 'खेल सूची में वापस जाएं',
    streakText: 'सफलतापूर्वक पूरे किए',
    encouragementDefault: 'आराम से कीजिए, कोई जल्दी नहीं है।',
    biggerLeft: 'बाईं थाली',
    biggerRight: 'दाईं थाली',
    shopUnit: '₹',
    pricePerItem: 'प्रति वस्तु',
    totalCost: 'कुल कितने रुपये चाहिए?',
    questionNumber: 'सवाल',
    nextQuestion: 'अगला सवाल',
    finishSession: 'आज के लिए पूरा हुआ',
    wellDone: 'अरे वाह! बिल्कुल सही!',
    tryTogether: 'कोई बात नहीं, मिलकर गिनते हैं! कोई जल्दी नहीं है।'
  },
  as: {
    title: 'পাশা গণিত যাত্ৰা',
    subtitle: 'সহজ গণনা, আনন্দদায়ক অংক আৰু চিনাকি বস্তু',
    rollDice: 'মৰমৰ পাশা গুৰুৱাওক',
    rolling: 'পাশা ঘূৰি আছে...',
    level: 'স্তৰ',
    level1Label: 'স্তৰ ১: সহজ ১-৫',
    level2Label: 'স্তৰ ২: আনন্দদায়ক ১-১০',
    level3Label: 'স্তৰ ৩: ঘৰুৱা হিচাপ',
    listenAgain: 'চাংপাৰ মাত শুনক',
    hintButton: 'সহায় / ইংগিত',
    pauseButton: 'অলপ জিৰণি লওক',
    resumeButton: 'পুনৰ আৰম্ভ কৰক',
    pauseTitle: 'শান্তিময় জিৰণি',
    pauseMessage: 'এক ঘটি গৰম পানী বা চাহ খাওক, হাত-ভৰি শিথিল কৰক। কোনো ধপধপনি নাই।',
    celebrationTitle: 'অপূৰ্ব খেল সমাপ্ত!',
    celebrationSubtitle: 'আজি আপুনি চাংপাৰ সৈতে বৰ ধুনীয়াকৈ খেলিলে!',
    moodPrompt: 'এতিয়া আপোনাৰ কেনে লাগিছে?',
    moodCalm: '🌸 শান্ত আৰু আৰাম',
    moodHappy: '😊 আনন্দ আৰু সুখ',
    moodLoved: '❤️ মৰম আৰু আপোনভাব',
    playAgain: 'আকৌ এবাৰ খেলক',
    backToGames: 'খেলৰ পৃষ্ঠালৈ উভতি যাওক',
    streakText: 'একেলগে সুন্দৰ খোজেৰে',
    encouragementDefault: 'লাহে লাহে কৰক আইতা, কোনো তাড়া নাই।',
    biggerLeft: 'বাওঁফালৰ কাঁহী',
    biggerRight: 'সোঁফালৰ কাঁহী',
    shopUnit: '₹',
    pricePerItem: 'প্ৰতিটো',
    totalCost: 'মুঠ কিমান টকা হ’ব?',
    questionNumber: 'প্ৰশ্ন',
    nextQuestion: 'পৰৱৰ্তী প্ৰশ্ন',
    finishSession: 'আজিৰ বাবে সমাপ্ত',
    wellDone: 'বৰ ধুনীয়া! একেবাৰে সঠিক!',
    tryTogether: 'একো কথা নাই, আমি একেলগে গণনা কৰোঁ আহক!'
  },
  bn: {
    title: 'পাশা গণিত যাত্রা',
    subtitle: 'সহজ গণনা, আনন্দময় অঙ্ক ও পরিচিত জিনিস',
    rollDice: 'শুভ পাশাটি ফেলুন',
    rolling: 'পাশা ঘুরছে...',
    level: 'স্তর',
    level1Label: 'স্তর ১: সহজ ১-৫',
    level2Label: 'স্তর ২: মিষ্টি ১-১০',
    level3Label: 'স্তর ৩: দৈনন্দিন হিসাব',
    listenAgain: 'সাংপার কথা শুনুন',
    hintButton: 'সহজ সংকেত',
    pauseButton: 'একটু জিরিয়ে নিন',
    resumeButton: 'খেলা চালু করুন',
    pauseTitle: 'বিশ্রামের সময়',
    pauseMessage: 'এক চুমুক গরম চা বা জল খান, শরীর শিথিল করুন। কোনো তাড়া নেই।',
    celebrationTitle: 'দারুণ আনন্দময় খেলা!',
    celebrationSubtitle: 'আজ সাংপার সাথে আপনি দারুণভাবে অঙ্ক করলেন!',
    moodPrompt: 'এখন আপনার কেমন লাগছে?',
    moodCalm: '🌸 শান্ত ও স্নিগ্ধ',
    moodHappy: '😊 খুশি ও আনন্দিত',
    moodLoved: '❤️ স্নেহে ভরা মন',
    playAgain: 'আরেকবার খেলুন',
    backToGames: 'খেলার তালিকায় ফিরুন',
    streakText: 'একসঙ্গে সফল পদক্ষেপ',
    encouragementDefault: 'ধীরে ধীরে ভাবুন দিদিমা, কোনো তাড়া নেই।',
    biggerLeft: 'বাঁদিকের থালা',
    biggerRight: 'ডানদিকের থালা',
    shopUnit: '₹',
    pricePerItem: 'প্রতিটি',
    totalCost: 'মোট কত টাকা লাগবে?',
    questionNumber: 'প্রশ্ন',
    nextQuestion: 'পরের প্রশ্ন',
    finishSession: 'আজকের মতো শেষ',
    wellDone: 'অপূর্ব! একদম সঠিক!',
    tryTogether: 'কোনো ব্যাপার না, আমরা একসঙ্গে গুনি! কোনো তাড়া নেই।'
  },
  mni: {
    title: 'ডাইস মেথ খোংচৎ',
    subtitle: 'লাইরবা মশীং থীবা অমসুং নুংঙাইবা ৱারী',
    rollDice: 'ডাইস লেংবীয়ু',
    rolling: 'ডাইস লেংলি...',
    level: 'লেভেল',
    level1Label: 'লেভেল ১: লাইরবা ১-৫',
    level2Label: 'লেভেল ২: ১-১০',
    level3Label: 'লেভেল ৩: নুমিৎ খুদিংগী হিসাপ',
    listenAgain: 'চাংপাগী খোঞ্জেল তাবীয়ু',
    hintButton: 'মতেং পাংবা',
    pauseButton: 'পোথারসি',
    resumeButton: 'অমুক হন্না শান্নসি',
    pauseTitle: 'পোথারবা মতম',
    pauseMessage: 'চা নত্রগা ঈশিং খরা থকপীদুনা তপ্না পোথারবীয়ু। লমজেল য়াংনা চৎপগী মথৌ তাদে।',
    celebrationTitle: 'য়াম্না ফজরবা খোংচৎ লোইশিন্লে!',
    celebrationSubtitle: 'ঙসি চাংপাগা লোয়ননা য়াম্না ফনা শান্নরে!',
    moodPrompt: 'হৌজিক অদোমগী ফাওরিবদু করিনো?',
    moodCalm: '🌸 শান্ত ওইবা',
    moodHappy: '😊 হরাওবা',
    moodLoved: '❤️ নুংশিবা ফাওবা',
    playAgain: 'অমুক হন্না শান্নসি',
    backToGames: 'শান্নপোৎকী মফমদা হঞ্জিনবা',
    streakText: 'পুন্না চংশিনবা',
    encouragementDefault: 'তপ্না তৌবীয়ু, করিসু লানদে।',
    biggerLeft: 'ওইথংবা থাল',
    biggerRight: 'য়েথংবা থাল',
    shopUnit: '₹',
    pricePerItem: 'অমমমদা',
    totalCost: 'লুপা কয়া চংগনি?',
    questionNumber: 'ৱাহং',
    nextQuestion: 'মথংগী ৱাহং',
    finishSession: 'ঙসিগী লোইরে',
    wellDone: 'য়াম্না ফরে! চপ চারে!',
    tryTogether: 'করিমত্তা তৌদে, ঐখোই পুল্লপ মশীং থীসি!'
  },
  nag: {
    title: 'Dice Math Journey',
    subtitle: 'Aaste aaste counting aru bhal laga kotha',
    rollDice: 'Dice Ghurabi',
    rolling: 'Dice ghuri ase...',
    level: 'Level',
    level1Label: 'Level 1: Aaste 1-5',
    level2Label: 'Level 2: Bhal 1-10',
    level3Label: 'Level 3: Dukan Hisab',
    listenAgain: 'Sangpa kotha sunibi',
    hintButton: 'Misa Hint',
    pauseButton: 'Rest Lobi',
    resumeButton: 'Game Chalu Koribi',
    pauseTitle: 'Rest Time',
    pauseMessage: 'Garam cha pibi, aaste rest lobi. Kono dhor-phori nai.',
    celebrationTitle: 'Bohut Bhal Game Hoise!',
    celebrationSubtitle: 'Aji Sangpa logote bhal kori hisab korise!',
    moodPrompt: 'Etiya kineka lagi ase?',
    moodCalm: '🌸 Shanto laga',
    moodHappy: '😊 Khushi laga',
    moodLoved: '❤️ Morom laga',
    playAgain: 'Arobi Ekbar Khelabi',
    backToGames: 'Games Hub te Jabi',
    streakText: 'Logote bhal kori korise',
    encouragementDefault: 'Aaste aaste koribi, kono chinta nai.',
    biggerLeft: 'Bawa Plate',
    biggerRight: 'Dahina Plate',
    shopUnit: '₹',
    pricePerItem: 'ekta te',
    totalCost: 'Total keta poisa lagibo?',
    questionNumber: 'Sawal',
    nextQuestion: 'Aro Sawal',
    finishSession: 'Aji karone shesh',
    wellDone: 'Bohut bhal! Ekdom thik!',
    tryTogether: 'Kono kotha nai, aaste aaste logote ginti koribi.'
  },
  es: {
    title: 'Viaje Matemático con Dados',
    subtitle: 'Conteo suave, números alegres y objetos cotidianos',
    rollDice: 'Lanzar los Dados',
    rolling: 'Lanzando los dados...',
    level: 'Nivel de Dificultad',
    level1Label: 'Nivel 1: Suave 1-5',
    level2Label: 'Nivel 2: Amigable 1-10',
    level3Label: 'Nivel 3: Cotidiano',
    listenAgain: 'Escuchar a Sangpa',
    hintButton: 'Pista Suave',
    pauseButton: 'Tomar un Descanso',
    resumeButton: 'Reanudar Juego',
    pauseTitle: 'Descanso Relajante',
    pauseMessage: 'Disfruta de un sorbo de té, relaja los hombros y respira con calma. Nunca hay prisa.',
    celebrationTitle: '¡Viaje Completado con Alegría!',
    celebrationSubtitle: '¡Hoy hiciste números maravillosos con Sangpa!',
    moodPrompt: '¿Cómo te sientes ahora mismo?',
    moodCalm: '🌸 Tranquilo y en paz',
    moodHappy: '😊 Alegre y orgulloso',
    moodLoved: '❤️ Con cariño y amor',
    playAgain: 'Jugar Otra Ronda',
    backToGames: 'Volver a Juegos',
    streakText: 'Pasos alegres juntos',
    encouragementDefault: 'Tómate todo tu tiempo, cada paso es hermoso.',
    biggerLeft: 'Plato Izquierdo',
    biggerRight: 'Plato Derecho',
    shopUnit: '₹',
    pricePerItem: 'cada uno',
    totalCost: 'Total necesario',
    questionNumber: 'Pregunta',
    nextQuestion: 'Siguiente actividad',
    finishSession: 'Terminar por hoy',
    wellDone: '¡Maravilloso trabajo! ¡Exactamente!',
    tryTogether: '¡Contemos juntos! Tómate todo el tiempo que necesites.'
  }
};

// Activity Question definition
interface ActivityData {
  type: DiceMathActivityType;
  difficulty: NumericDifficulty;
  diceValues: number[];
  culturalItem: CulturalItem;
  itemCountA: number;
  itemCountB: number;
  operation?: '+' | '-';
  correctAnswer: number | string;
  options: (number | string)[];
  promptTexts: Record<LanguageCode, string>;
  hintTexts: Record<LanguageCode, string>;
  sequenceItems?: (number | string)[];
  shopPricePerItem?: number;
  shopQuantity?: number;
}

// Helper to render die face
const DieFace: React.FC<{ value: number; isRolling?: boolean; size?: 'md' | 'lg' }> = ({ 
  value, 
  isRolling = false,
  size = 'lg' 
}) => {
  const getDots = (v: number) => {
    switch (v) {
      case 1: return [4];
      case 2: return [0, 8];
      case 3: return [0, 4, 8];
      case 4: return [0, 2, 6, 8];
      case 5: return [0, 2, 4, 6, 8];
      case 6: return [0, 2, 3, 5, 6, 8];
      default: return [4];
    }
  };

  const activeDots = getDots(value);
  const sizeClasses = size === 'lg' 
    ? 'w-24 h-24 sm:w-28 sm:h-28 rounded-3xl p-3 border-4' 
    : 'w-16 h-16 sm:w-20 sm:h-20 rounded-2xl p-2 border-3';

  return (
    <div 
      className={`relative bg-gradient-to-br from-[#FFFDF7] via-white to-[#F6EED8] border-amber-300 shadow-md flex flex-col justify-between select-none transition-transform duration-300 ${sizeClasses} ${
        isRolling ? 'animate-spin scale-105' : 'hover:scale-102'
      }`}
    >
      <div className="grid grid-cols-3 grid-rows-3 w-full h-full gap-1">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((idx) => (
          <div key={idx} className="flex items-center justify-center">
            {activeDots.includes(idx) && (
              <span 
                className={`rounded-full bg-[#3D2B1F] shadow-inner ${
                  size === 'lg' ? 'w-4 h-4 sm:w-5 sm:h-5' : 'w-3 h-3 sm:w-3.5 sm:h-3.5'
                }`} 
              />
            )}
          </div>
        ))}
      </div>
      <span className="absolute -bottom-2 -right-2 bg-sangpa-700 text-white text-xs sm:text-sm font-black w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center shadow-md border-2 border-white">
        {value}
      </span>
    </div>
  );
};

export const DiceMathJourneyGame: React.FC = () => {
  const { setPatientScreen, speakMascot, updateGameStats, language } = useApp();
  const text = UI_TEXT[language] || UI_TEXT.en;

  // Configuration state
  const [config, setConfig] = useState<DiceMathConfig>({
    startingDifficulty: 1,
    visualSupport: true,
    voiceInstructions: true,
    allowedActivities: ['counting_dots', 'adding_numbers', 'subtracting_objects', 'choosing_bigger', 'number_sequences', 'shopping_food'],
    sessionLength: 5,
  });

  // Gameplay State
  const [difficulty, setDifficulty] = useState<NumericDifficulty>(1);
  const [currentRound, setCurrentRound] = useState(1);
  const [currentActivity, setCurrentActivity] = useState<ActivityData | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | string | null>(null);
  const [mascotDialogue, setMascotDialogue] = useState<string>('');
  const [feedbackType, setFeedbackType] = useState<'idle' | 'success' | 'encourage'>('idle');

  // Stats
  const [consecutiveCorrect, setConsecutiveCorrect] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [hintsUsedCount, setHintsUsedCount] = useState(0);
  const [roundAttempts, setRoundAttempts] = useState(0);

  // Load Caregiver Settings
  useEffect(() => {
    try {
      const stored = localStorage.getItem('sangpa_dice_math_config');
      if (stored) {
        const parsed: DiceMathConfig = JSON.parse(stored);
        setConfig(parsed);
        const startDiff = (parsed.startingDifficulty === 2 ? 2 : parsed.startingDifficulty === 3 ? 3 : 1) as NumericDifficulty;
        setDifficulty(startDiff);
      }
    } catch (e) {
      console.error('Error loading dice math config', e);
    }
  }, []);

  const shuffle = <T,>(arr: T[]): T[] => {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  };

  const createQuestion = useCallback((diff: NumericDifficulty): ActivityData => {
    const allowed = (config.allowedActivities && config.allowedActivities.length > 0)
      ? config.allowedActivities 
      : ['counting_dots', 'adding_numbers', 'subtracting_objects', 'choosing_bigger', 'number_sequences', 'shopping_food'] as DiceMathActivityType[];
    
    let pickedType: DiceMathActivityType;
    if (diff === 1) {
      const l1Types = allowed.filter(t => t === 'counting_dots' || t === 'adding_numbers' || t === 'choosing_bigger');
      pickedType = l1Types.length > 0 ? l1Types[Math.floor(Math.random() * l1Types.length)] : 'counting_dots';
    } else if (diff === 2) {
      const l2Types = allowed.filter(t => t === 'adding_numbers' || t === 'subtracting_objects' || t === 'choosing_bigger' || t === 'number_sequences');
      pickedType = l2Types.length > 0 ? l2Types[Math.floor(Math.random() * l2Types.length)] : 'adding_numbers';
    } else {
      pickedType = allowed[Math.floor(Math.random() * allowed.length)];
    }

    const item = CULTURAL_ITEMS[Math.floor(Math.random() * CULTURAL_ITEMS.length)];

    if (pickedType === 'counting_dots' || pickedType === 'counting') {
      const val = diff === 1 ? Math.floor(Math.random() * 5) + 1 : Math.floor(Math.random() * 6) + 1;
      const opts = Array.from(new Set([val, Math.max(1, (val + 1) % 6 || 2), Math.max(1, (val + 2) % 6 || 3)]));
      while (opts.length < 3) opts.push(opts.length + 1);
      
      return {
        type: 'counting_dots',
        difficulty: diff,
        diceValues: [val],
        culturalItem: item,
        itemCountA: val,
        itemCountB: 0,
        correctAnswer: val,
        options: shuffle(opts),
        promptTexts: {
          en: `Count the dots on the lucky die! How many do you see?`,
          hi: `पासे पर कितने बिंदु हैं? मिलकर गिनते हैं!`,
          as: `পাশাৰ ফোঁটবোৰ কেইটা আছে গণনা কৰক!`,
          bn: `পাশার ফোঁটাগুলো কটি আছে গুনে দেখুন!`,
          mni: `ডাইসকী খুদম মশীং থীবীয়ু! কয়া উবগে?`,
          nag: `Dice te keta phota ase ginti koribi!`,
          es: `¡Cuenta los puntos del dado! ¿Cuántos ves?`
        },
        hintTexts: {
          en: `Let's count slowly together: 1, 2, 3... Point your finger at each dot!`,
          hi: `धीरे-धीरे उँगली रखकर एक-एक बिंदु गिनते हैं: एक, दो, तीन...`,
          as: `লাহে লাহে আঙুলিৰে এটা এটাকৈ ফোঁট গণনা কৰক: এক, দুই, তিনি...`,
          bn: `আঙুল দিয়ে একটা একটা করে গুনি: এক, দুই, তিন...`,
          mni: `তপ্না খুৎশাংদুনা মশীং থীসি: অমা, অনী, অহুম...`,
          nag: `Aaste aaste ungli lagai kena ekta ekta ginti koribi.`,
          es: `¡Contemos despacio juntos: 1, 2, 3... Señala cada punto con tu dedo!`
        }
      };
    } 
    
    if (pickedType === 'adding_numbers' || pickedType === 'addition') {
      const v1 = diff === 1 ? Math.floor(Math.random() * 3) + 1 : Math.floor(Math.random() * 5) + 1;
      const v2 = diff === 1 ? Math.floor(Math.random() * 2) + 1 : Math.floor(Math.random() * 4) + 1;
      const sum = v1 + v2;
      const opts = Array.from(new Set([sum, sum + 1, Math.max(1, sum - 1)]));
      while (opts.length < 3) opts.push(opts.length + 2);

      return {
        type: 'adding_numbers',
        difficulty: diff,
        diceValues: [v1, v2],
        culturalItem: item,
        itemCountA: v1,
        itemCountB: v2,
        operation: '+',
        correctAnswer: sum,
        options: shuffle(opts),
        promptTexts: {
          en: `Roll the two dice! How many ${item.names.en} do we have altogether?`,
          hi: `दोनों पासों को मिलाकर कुल कितने ${item.names.hi} बने?`,
          as: `দুয়োটা পাশা মিলি মুঠ কিমান ${item.names.as} হ'ল?`,
          bn: `দুটো পাশা মিলে মোট কটি ${item.names.bn} হলো?`,
          mni: `ডাইস অনী পুল্লপ মশীং থীবদা কয়া ${item.names.mni} য়াওবগে?`,
          nag: `Duta dice milaikena total keta ${item.names.nag} ase?`,
          es: `¡Sumemos los dos dados! ¿Cuántos ${item.names.es} tenemos en total?`
        },
        hintTexts: {
          en: `First count the ${v1} items on the left, then continue counting the ${v2} on the right!`,
          hi: `पहले बाईं तरफ के ${v1} गिनें, फिर दाईं तरफ के ${v2} आगे जोड़ें।`,
          as: `প্ৰথমে বাওঁফালৰ ${v1} টা গণক, তাৰ পাছত সোঁফালৰ ${v2} টা যোগ কৰক।`,
          bn: `প্রথমে বাঁদিকের ${v1} টি গুনুন, তারপর ডানদিকের ${v2} টি সঙ্গে যোগ করুন।`,
          mni: `অহানবদা ওইথংবগী ${v1} থীবীয়ু, অদুদগী য়েথংবগী ${v2} পুন্সিনবীয়ু।`,
          nag: `Pehle bamer ${v1} ginti koribi, pichete dahina laga ${v2} milabi.`,
          es: `¡Primero cuenta los ${v1} de la izquierda, luego sigue contando los ${v2} de la derecha!`
        }
      };
    }

    if (pickedType === 'subtracting_objects' || pickedType === 'subtraction') {
      const start = diff === 1 ? Math.floor(Math.random() * 3) + 3 : Math.floor(Math.random() * 3) + 4;
      const takeAway = Math.floor(Math.random() * 2) + 1;
      const left = start - takeAway;
      const opts = Array.from(new Set([left, left + 1, Math.max(1, left - 1)]));
      while (opts.length < 3) opts.push(opts.length + 1);

      return {
        type: 'subtracting_objects',
        difficulty: diff,
        diceValues: [start],
        culturalItem: item,
        itemCountA: start,
        itemCountB: takeAway,
        operation: '-',
        correctAnswer: left,
        options: shuffle(opts),
        promptTexts: {
          en: `You have ${start} ${item.names.en}. You share ${takeAway} with Sangpa. How many remain?`,
          hi: `आपके पास ${start} ${item.names.hi} हैं। आपने ${takeAway} सांगपा को दिए। अब कितने बचे?`,
          as: `আপোনাৰ হাতত ${start} টা ${item.names.as} আছে। ${takeAway} টা চাংপাক দিলে। বাকী কেইটা থাকিল?`,
          bn: `আপনার কাছে ${start} টি ${item.names.bn} আছে। ${takeAway} টি সাংপাকে দিলেন। কটি বাকি রইল?`,
          mni: `অদোমদা ${item.names.mni} ${start} লৈ। চাংপাদা ${takeAway} পীথোক্লবা মতুংদা কয়া ৱাৎলি?`,
          nag: `Apnar logote ${start} ta ${item.names.nag} ase. ${takeAway} ta Sangpa k dile keta bachi thakibo?`,
          es: `Tienes ${start} ${item.names.es}. Compartes ${takeAway} con Sangpa. ¿Cuántos te quedan?`
        },
        hintTexts: {
          en: `Imagine holding ${start} items. Take away ${takeAway}, and count what is still on your plate!`,
          hi: `सोचिए थाली में ${start} हैं। उनमें से ${takeAway} कम कर दिए, तो कितने बचे?`,
          as: `ভাবক কাঁহীত ${start} টা আছে। ${takeAway} টা আঁতৰালে কেইটা থাকিব চাওক!`,
          bn: `ভাবুন থালায় ${start} টি আছে। ${takeAway} টি সরিয়ে নিলে কটি থাকে দেখুন!`,
          mni: `থালদা ${start} লৈ হায়না খনবীয়ু। ${takeAway} লৌথোক্লগা কয়া লৈবগে য়েংসি!`,
          nag: `Plate te ${start} ta ase bhabibi. ${takeAway} ta hataile keta thakibo sabo.`,
          es: `Imagina que tienes ${start} en tu plato. Quita ${takeAway}, ¿cuántos quedan?`
        }
      };
    }

    if (pickedType === 'choosing_bigger' || pickedType === 'comparison') {
      const v1 = Math.floor(Math.random() * 5) + 1;
      let v2 = Math.floor(Math.random() * 5) + 1;
      while (v2 === v1) v2 = Math.floor(Math.random() * 5) + 1;
      
      const correctSide = v1 > v2 ? 'left' : 'right';

      return {
        type: 'choosing_bigger',
        difficulty: diff,
        diceValues: [v1, v2],
        culturalItem: item,
        itemCountA: v1,
        itemCountB: v2,
        correctAnswer: correctSide,
        options: ['left', 'right'],
        promptTexts: {
          en: `Which plate has more ${item.names.en}? Tap the bigger one!`,
          hi: `किस थाली में अधिक ${item.names.hi} हैं? बड़ी संख्या वाली थाली छुएं!`,
          as: `কোনখন কাঁহীত বেছি ${item.names.as} আছে? বেছি থকা কাঁহীখন স্পৰ্শ কৰক!`,
          bn: `কোন থালায় বেশি ${item.names.bn} আছে? বেশি থাকা থালাটি ছুঁয়ে দিন!`,
          mni: `কদাইদা হেন্না য়াম্বা ${item.names.mni} য়াওবগে? হেন্না য়াম্বদু থীগৎলু!`,
          nag: `Kuntu plate te beshi ${item.names.nag} ase? Beshi thaka plate dababi!`,
          es: `¿Qué plato tiene más ${item.names.es}? ¡Toca el más grande!`
        },
        hintTexts: {
          en: `Compare the two plates side by side. The one packed with more items is larger!`,
          hi: `दोनों थालियों को देखें। जिस थाली में ज्यादा वस्तुएं हैं, वही बड़ी है।`,
          as: `দুয়োখন কাঁহী চাওক। য'ত বেছি বস্তু আছে, সেইখন বাছক।`,
          bn: `দুটো থালা দেখুন। যেটিতে বেশি জিনিস আছে, সেটি বেছে নিন।`,
          mni: `থাল অনী তুলনা তৌসি। হেন্না পোৎলম য়াওবদুনী।`,
          nag: `Duta plate sabo. Juntu te beshi bostu ase etu chuni lobi.`,
          es: `Compara los dos platos. ¡El que tiene más objetos es el ganador!`
        }
      };
    }

    if (pickedType === 'number_sequences' || pickedType === 'sequence') {
      const startNum = diff === 1 ? 1 : Math.floor(Math.random() * 4) + 1;
      const seq = [startNum, startNum + 1, startNum + 2, startNum + 3];
      const missingIndex = diff === 1 ? 3 : Math.floor(Math.random() * 2) + 2;
      const correctVal = seq[missingIndex];
      const displaySeq: (number | string)[] = [...seq];
      displaySeq[missingIndex] = '?';

      const opts = Array.from(new Set([correctVal, correctVal + 1, Math.max(1, correctVal - 1)]));
      while (opts.length < 3) opts.push(opts.length + 1);

      return {
        type: 'number_sequences',
        difficulty: diff,
        diceValues: [correctVal],
        culturalItem: item,
        itemCountA: correctVal,
        itemCountB: 0,
        correctAnswer: correctVal,
        options: shuffle(opts),
        sequenceItems: displaySeq,
        promptTexts: {
          en: `What number comes next in this gentle sequence?`,
          hi: `इस सरल क्रम में प्रश्नवाचक चिन्ह (?) की जगह क्या आएगा?`,
          as: `এই সহজ ক্ৰমটোত প্ৰশ্নবোধক (?) চিনত কি নম্বৰ হ'ব?`,
          bn: `এই সহজ ক্রমে প্রশ্নবোধক চিহ্নে (?) কোন সংখ্যা বসবে?`,
          mni: `মথংগী মশীং করিনো? (?) মফমদা চপ চাবা মশীং খল্লু!`,
          nag: `Etu sequence te (?) jaga te kuntu number ahibo?`,
          es: `¿Qué número sigue en esta suave secuencia?`
        },
        hintTexts: {
          en: `Say the numbers out loud in rhythm: ${seq[0]}, ${seq[1]}... what comes naturally next?`,
          hi: `आवाज़ के साथ क्रम बोलें: ${seq[0]}, ${seq[1]}... इसके बाद क्या आता है?`,
          as: `মাত মাতি ক্ৰমটো কওক: ${seq[0]}, ${seq[1]}... তাৰ পাছত কি আহে?`,
          bn: `মুখে মুখে সংখ্যাগুলো বলুন: ${seq[0]}, ${seq[1]}... এরপর স্বাভাবিকভাবেই কী আসে?`,
          mni: `মশীংদু তপ্না হায়দুনা য়েংসি: ${seq[0]}, ${seq[1]}... মথংদা করিনো?`,
          nag: `Kotha te boli kena sabo: ${seq[0]}, ${seq[1]}... etu pichete ki ahibo?`,
          es: `Di los números en voz alta: ${seq[0]}, ${seq[1]}... ¿cuál viene después?`
        }
      };
    }

    // Default to shopping_food
    const shopPrice = Math.floor(Math.random() * 2) + 2;
    const shopQty = Math.floor(Math.random() * 2) + 2;
    const totalCost = shopPrice * shopQty;
    const shopOpts = Array.from(new Set([totalCost, totalCost + shopPrice, Math.max(1, totalCost - 1)]));
    while (shopOpts.length < 3) shopOpts.push(shopOpts.length + 2);

    return {
      type: 'shopping_food',
      difficulty: diff,
      diceValues: [shopQty],
      culturalItem: item,
      itemCountA: shopQty,
      itemCountB: shopPrice,
      shopPricePerItem: shopPrice,
      shopQuantity: shopQty,
      correctAnswer: totalCost,
      options: shuffle(shopOpts),
      promptTexts: {
        en: `At the warm tea stall: 1 ${item.names.en} costs ₹${shopPrice}. How much for ${shopQty}?`,
        hi: `दुकान पर: 1 ${item.names.hi} ₹${shopPrice} का है। ${shopQty} के लिए कितने रुपये चाहिए?`,
        as: `দোকানত: ১ টা ${item.names.as}ৰ দাম ₹${shopPrice} টকা। ${shopQty} টাৰ বাবে কিমান টকা লাগিব?`,
        bn: `দোকানে: ১টি ${item.names.bn} এর দাম ₹${shopPrice}। ${shopQty}টির জন্য কত টাকা লাগবে?`,
        mni: `দুকান্দা: ${item.names.mni} ১ গী মমোল লুপা ₹${shopPrice} নি। ${shopQty} গী কয়া চংগনি?`,
        nag: `Dukan te: 1 ta ${item.names.nag} laga daam ₹${shopPrice} ase. ${shopQty} ta karone keta lagibo?`,
        es: `En el puesto: 1 ${item.names.es} cuesta ₹${shopPrice}. ¿Cuánto cuestan ${shopQty}?`
      },
      hintTexts: {
        en: `Count in steps of ₹${shopPrice}: ${Array.from({ length: shopQty }, (_, i) => `₹${shopPrice * (i + 1)}`).join(', ')}!`,
        hi: `₹${shopPrice} करके जोड़ें: हर वस्तु के लिए ₹${shopPrice}।`,
        as: `₹${shopPrice} টকাকৈ যোগ কৰক: মুঠ টকা ওলাই পৰিব।`,
        bn: `₹${shopPrice} টাকা করে গুনুন: প্রতিটি জিনিসের জন্য ₹${shopPrice}।`,
        mni: `লুপা ₹${shopPrice} তৌদুনা পুন্সিনবীয়ু।`,
        nag: `₹${shopPrice} kori kena hisab koribi.`,
        es: `Suma ₹${shopPrice} por cada uno.`
      }
    };
  }, [config.allowedActivities]);

  const startNewRound = useCallback((targetDifficulty: NumericDifficulty) => {
    setShowHint(false);
    setSelectedAnswer(null);
    setFeedbackType('idle');
    setRoundAttempts(0);
    setIsRolling(true);
    audio.playGentleChime();

    let count = 0;
    const interval = setInterval(() => {
      count++;
      if (count > 6) {
        clearInterval(interval);
        setIsRolling(false);
        const nextQ = createQuestion(targetDifficulty);
        setCurrentActivity(nextQ);

        const prompt = nextQ.promptTexts[language] || nextQ.promptTexts.en;
        setMascotDialogue(prompt);
        if (config.voiceInstructions) {
          speakMascot(prompt, 'speaking');
        }
      }
    }, 100);
  }, [createQuestion, language, config.voiceInstructions, speakMascot]);

  useEffect(() => {
    startNewRound(difficulty);
  }, []);

  const handleSpeakAgain = () => {
    if (mascotDialogue) {
      speakMascot(mascotDialogue, 'speaking');
    }
  };

  const handleAskHint = () => {
    if (!currentActivity) return;
    setShowHint(true);
    setHintsUsedCount(h => h + 1);
    audio.playSequenceNote(1);
    const hint = currentActivity.hintTexts[language] || currentActivity.hintTexts.en;
    setMascotDialogue(hint);
    if (config.voiceInstructions) {
      speakMascot(hint, 'speaking');
    }
  };

  const handleSelectAnswer = (choice: number | string) => {
    if (!currentActivity || selectedAnswer !== null || isRolling) return;

    setSelectedAnswer(choice);
    setTotalAttempts(t => t + 1);
    const isCorrect = choice === currentActivity.correctAnswer;

    if (isCorrect) {
      setFeedbackType('success');
      audio.playSuccessJingle();
      setCorrectCount(c => c + 1);
      const newStreak = consecutiveCorrect + 1;
      setConsecutiveCorrect(newStreak);

      const praise = text.wellDone;
      setMascotDialogue(praise);
      if (config.voiceInstructions) {
        speakMascot(praise, 'speaking');
      }

      let nextDiff = difficulty;
      if (newStreak >= 2 && difficulty < 3) {
        nextDiff = (difficulty + 1) as NumericDifficulty;
        setDifficulty(nextDiff);
      }

      setTimeout(() => {
        if (currentRound >= config.sessionLength) {
          setIsCompleted(true);
          audio.playTempleBell();
          if (config.voiceInstructions) {
            speakMascot(text.celebrationTitle + ' ' + text.celebrationSubtitle, 'speaking');
          }
        } else {
          setCurrentRound(r => r + 1);
          startNewRound(nextDiff);
        }
      }, 2000);

    } else {
      setFeedbackType('encourage');
      audio.playGentleChime();
      setConsecutiveCorrect(0);
      setShowHint(true);
      const newAttempts = roundAttempts + 1;
      setRoundAttempts(newAttempts);

      const gentle = text.tryTogether;
      setMascotDialogue(gentle);
      if (config.voiceInstructions) {
        speakMascot(gentle, 'speaking');
      }

      if (newAttempts >= 2 && difficulty > 1) {
        setDifficulty((d) => Math.max(1, d - 1) as NumericDifficulty);
      }

      setTimeout(() => {
        setSelectedAnswer(null);
        setFeedbackType('idle');
      }, 2200);
    }
  };

  const handleFinishWithMood = (mood: 'calm' | 'happy' | 'loved') => {
    audio.playSuccessJingle();

    const record: DiceMathSessionRecord = {
      id: 'dm_' + Date.now(),
      timestamp: new Date().toISOString(),
      dateStr: new Date().toLocaleDateString(),
      activityType: currentActivity?.type || 'counting_dots',
      difficulty,
      difficultyReached: difficulty,
      roundsAttempted: totalAttempts || 1,
      roundsCorrect: correctCount,
      roundsCompleted: currentRound,
      accuracy: totalAttempts > 0 ? Math.round((correctCount / totalAttempts) * 100) : 100,
      hintsUsed: hintsUsedCount,
      completed: true,
      postGameMood: mood,
      mood,
      activitiesCompleted: [currentActivity?.type || 'counting_dots']
    };

    try {
      const existing = localStorage.getItem('sangpa_dice_math_results');
      const list: DiceMathSessionRecord[] = existing ? JSON.parse(existing) : [];
      list.unshift(record);
      localStorage.setItem('sangpa_dice_math_results', JSON.stringify(list.slice(0, 30)));
    } catch (e) {
      console.error('Error saving dice math record', e);
    }

    const accuracy = totalAttempts > 0 ? Math.round((correctCount / totalAttempts) * 100) : 95;
    updateGameStats('dice_category', accuracy);
    setPatientScreen('games');
  };

  return (
    <div className="flex-1 p-3 sm:p-5 max-w-2xl mx-auto w-full space-y-4 pb-20 select-none box-border">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 border-b border-sangpa-200 pb-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <button
            onClick={() => setPatientScreen('games')}
            className="p-2 rounded-2xl bg-white border border-sangpa-300 hover:bg-sangpa-100 text-sangpa-800 transition-colors shadow-2xs flex-shrink-0 cursor-pointer"
            title="Back to games"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="min-w-0">
            <h2 className="text-xl sm:text-2xl font-black text-sangpa-900 tracking-tight truncate">
              {text.title}
            </h2>
            <p className="text-xs text-sangpa-600 truncate">
              {text.subtitle}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button
            onClick={() => setIsPaused(true)}
            className="p-2 sm:px-3 sm:py-1.5 rounded-2xl bg-[#EAF2E6] hover:bg-[#DCE7D3] border border-[#CAD8C6] text-sangpa-800 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            title={text.pauseButton}
          >
            <Coffee className="w-4 h-4 text-sangpa-700" />
            <span className="hidden sm:inline">{text.pauseButton}</span>
          </button>

          <span className="text-[11px] font-extrabold px-2.5 py-1 rounded-full bg-sangpa-100 text-sangpa-800 border border-sangpa-300">
            {difficulty === 1 ? text.level1Label : difficulty === 2 ? text.level2Label : text.level3Label}
          </span>
        </div>
      </div>

      {/* Interactive Mascot Companion Banner */}
      <div className="bg-white border-2 border-sangpa-300 rounded-3xl p-3 sm:p-4 shadow-sm flex items-start gap-3 sm:gap-4 relative overflow-hidden">
        <div className="relative flex-shrink-0 w-16 h-20 sm:w-20 sm:h-24 rounded-2xl overflow-hidden border-2 border-sangpa-300 bg-gradient-to-b from-[#FAFDF5] to-[#EAF2E6] shadow-2xs">
          <img
            src="/assets/mascot_full_conversation.png"
            alt="Sangpa mascot"
            className="w-full h-full object-cover object-top"
          />
        </div>

        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex items-center justify-between gap-1">
            <span className="text-xs font-black text-sangpa-800 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-sangpa-600" />
              <span>SANGPA</span>
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={handleSpeakAgain}
                className="p-1.5 rounded-xl bg-sangpa-100 hover:bg-sangpa-200 text-sangpa-800 transition-colors cursor-pointer"
                title={text.listenAgain}
              >
                <Volume2 className="w-4 h-4" />
              </button>
              <button
                onClick={handleAskHint}
                className="p-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 transition-colors cursor-pointer"
                title={text.hintButton}
              >
                <HelpCircle className="w-4 h-4 text-amber-700" />
              </button>
            </div>
          </div>

          <p className="text-xs sm:text-sm font-bold text-sangpa-900 leading-relaxed bg-[#F8FAF5] p-2.5 rounded-2xl border border-sangpa-200">
            {mascotDialogue || text.encouragementDefault}
          </p>
        </div>
      </div>

      {/* Main Dice Stage */}
      <div className="bg-white border-2 border-sangpa-300 rounded-3xl p-4 sm:p-6 shadow-md text-center space-y-5">
        
        {/* Progress & Round indicator */}
        <div className="flex items-center justify-between text-xs font-bold text-sangpa-700 border-b border-sangpa-100 pb-2">
          <span className="flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-sangpa-600" />
            <span>{text.questionNumber} {currentRound} / {config.sessionLength}</span>
          </span>

          {consecutiveCorrect > 1 && (
            <span className="text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              <span>{consecutiveCorrect} {text.streakText}</span>
            </span>
          )}
        </div>

        {/* Dice Visual Display */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 py-2">
          {currentActivity?.diceValues.map((val, idx) => (
            <React.Fragment key={idx}>
              {idx > 0 && currentActivity.operation && (
                <span className="text-2xl sm:text-3xl font-black text-sangpa-700">
                  {currentActivity.operation}
                </span>
              )}
              <DieFace value={val} isRolling={isRolling} size="lg" />
            </React.Fragment>
          ))}
        </div>

        {/* Visual Support Objects Representation */}
        {(config.visualSupport || showHint) && currentActivity && (
          <div className="p-3 bg-[#FAF8F5] rounded-2xl border border-[#E7E3D8] space-y-2 animate-fadeIn">
            {currentActivity.type === 'counting_dots' && (
              <div className="flex items-center justify-center gap-2 flex-wrap">
                {Array.from({ length: currentActivity.itemCountA }, (_, i) => (
                  <div key={i} className="flex flex-col items-center bg-white px-2.5 py-1 rounded-xl border border-sangpa-200 shadow-2xs">
                    <span className="text-xl sm:text-2xl">{currentActivity.culturalItem.emoji}</span>
                    <span className="text-[11px] font-black text-sangpa-800">{i + 1}</span>
                  </div>
                ))}
              </div>
            )}

            {currentActivity.type === 'adding_numbers' && (
              <div className="flex items-center justify-center gap-3 flex-wrap">
                <div className="flex items-center gap-1 bg-white p-2 rounded-xl border border-sangpa-200">
                  {Array.from({ length: currentActivity.itemCountA }, (_, i) => (
                    <span key={i} className="text-xl sm:text-2xl">{currentActivity.culturalItem.emoji}</span>
                  ))}
                  <span className="text-xs font-black text-sangpa-700 ml-1">({currentActivity.itemCountA})</span>
                </div>
                <Plus className="w-5 h-5 text-sangpa-600" />
                <div className="flex items-center gap-1 bg-white p-2 rounded-xl border border-sangpa-200">
                  {Array.from({ length: currentActivity.itemCountB }, (_, i) => (
                    <span key={i} className="text-xl sm:text-2xl">{currentActivity.culturalItem.emoji}</span>
                  ))}
                  <span className="text-xs font-black text-sangpa-700 ml-1">({currentActivity.itemCountB})</span>
                </div>
              </div>
            )}

            {currentActivity.type === 'subtracting_objects' && (
              <div className="flex items-center justify-center gap-2 flex-wrap">
                <div className="flex items-center gap-1.5 bg-white p-2.5 rounded-xl border border-sangpa-200">
                  {Array.from({ length: currentActivity.itemCountA }, (_, i) => {
                    const isRemoved = i >= (currentActivity.itemCountA - currentActivity.itemCountB);
                    return (
                      <div key={i} className={`flex flex-col items-center ${isRemoved ? 'opacity-40 line-through' : ''}`}>
                        <span className="text-2xl">{currentActivity.culturalItem.emoji}</span>
                        <span className="text-[10px] font-bold text-sangpa-700">
                          {isRemoved ? '🎁 Gift' : (i + 1)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {currentActivity.type === 'number_sequences' && currentActivity.sequenceItems && (
              <div className="flex items-center justify-center gap-2 flex-wrap">
                {currentActivity.sequenceItems.map((val, idx) => (
                  <div
                    key={idx}
                    className={`w-12 h-14 sm:w-14 sm:h-16 rounded-2xl flex items-center justify-center text-lg sm:text-xl font-black border-2 shadow-2xs ${
                      val === '?'
                        ? 'bg-amber-100 border-amber-400 text-amber-900 animate-pulse'
                        : 'bg-white border-sangpa-300 text-sangpa-900'
                    }`}
                  >
                    {val}
                  </div>
                ))}
              </div>
            )}

            {currentActivity.type === 'shopping_food' && (
              <div className="flex items-center justify-center gap-3 flex-wrap">
                <div className="bg-white p-3 rounded-2xl border border-sangpa-200 flex items-center gap-2">
                  <span className="text-3xl">{currentActivity.culturalItem.emoji}</span>
                  <div className="text-left text-xs">
                    <p className="font-extrabold text-sangpa-900">{currentActivity.culturalItem.names[language] || currentActivity.culturalItem.names.en}</p>
                    <p className="text-stone-600 font-bold">₹{currentActivity.shopPricePerItem} {text.pricePerItem}</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-sangpa-600" />
                <div className="bg-amber-50 p-2.5 rounded-2xl border border-amber-300 text-xs font-bold text-amber-900">
                  {currentActivity.shopQuantity} items = ?
                </div>
              </div>
            )}
          </div>
        )}

        {/* Options / Large Touch Answer Buttons */}
        {currentActivity && (
          <div className="pt-2">
            {currentActivity.type === 'choosing_bigger' ? (
              <div className="grid grid-cols-2 gap-3 sm:gap-4 max-w-md mx-auto">
                <button
                  onClick={() => handleSelectAnswer('left')}
                  disabled={selectedAnswer !== null || isRolling}
                  className={`p-4 rounded-3xl border-3 transition-all flex flex-col items-center gap-2 cursor-pointer ${
                    selectedAnswer === 'left'
                      ? feedbackType === 'success'
                        ? 'bg-emerald-100 border-emerald-500 shadow-md scale-102 ring-4 ring-emerald-200'
                        : 'bg-amber-100 border-amber-400'
                      : 'bg-white hover:bg-sangpa-50 border-sangpa-300 hover:border-sangpa-500 shadow-sm'
                  }`}
                >
                  <span className="text-xs font-black text-sangpa-700">{text.biggerLeft}</span>
                  <div className="flex flex-wrap items-center justify-center gap-1 min-h-[40px]">
                    {Array.from({ length: currentActivity.itemCountA }, (_, i) => (
                      <span key={i} className="text-xl sm:text-2xl">{currentActivity.culturalItem.emoji}</span>
                    ))}
                  </div>
                  <span className="text-lg font-black text-sangpa-900">({currentActivity.itemCountA})</span>
                </button>

                <button
                  onClick={() => handleSelectAnswer('right')}
                  disabled={selectedAnswer !== null || isRolling}
                  className={`p-4 rounded-3xl border-3 transition-all flex flex-col items-center gap-2 cursor-pointer ${
                    selectedAnswer === 'right'
                      ? feedbackType === 'success'
                        ? 'bg-emerald-100 border-emerald-500 shadow-md scale-102 ring-4 ring-emerald-200'
                        : 'bg-amber-100 border-amber-400'
                      : 'bg-white hover:bg-sangpa-50 border-sangpa-300 hover:border-sangpa-500 shadow-sm'
                  }`}
                >
                  <span className="text-xs font-black text-sangpa-700">{text.biggerRight}</span>
                  <div className="flex flex-wrap items-center justify-center gap-1 min-h-[40px]">
                    {Array.from({ length: currentActivity.itemCountB }, (_, i) => (
                      <span key={i} className="text-xl sm:text-2xl">{currentActivity.culturalItem.emoji}</span>
                    ))}
                  </div>
                  <span className="text-lg font-black text-sangpa-900">({currentActivity.itemCountB})</span>
                </button>
              </div>
            ) : (
              <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
                {currentActivity.options.map((opt, idx) => {
                  const isSelected = selectedAnswer === opt;
                  const isSuccess = isSelected && feedbackType === 'success';
                  const isEncourage = isSelected && feedbackType === 'encourage';

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectAnswer(opt)}
                      disabled={selectedAnswer !== null || isRolling}
                      className={`min-w-[85px] sm:min-w-[110px] py-4 px-5 rounded-3xl border-3 text-xl sm:text-2xl font-black transition-all cursor-pointer select-none active:scale-95 ${
                        isSuccess
                          ? 'bg-emerald-100 border-emerald-500 text-emerald-950 shadow-md scale-105 ring-4 ring-emerald-200'
                          : isEncourage
                          ? 'bg-amber-100 border-amber-400 text-amber-950 shadow-sm scale-102 ring-4 ring-amber-200'
                          : 'bg-white hover:bg-sangpa-50 border-sangpa-300 hover:border-sangpa-500 text-sangpa-900 shadow-sm'
                      }`}
                    >
                      {currentActivity.type === 'shopping_food' ? `₹${opt}` : opt}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Bottom Helper Bar */}
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={handleAskHint}
            className="py-2.5 px-4 rounded-2xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <HelpCircle className="w-4 h-4 text-amber-700" />
            <span>{text.hintButton}</span>
          </button>

          <button
            onClick={() => startNewRound(difficulty)}
            disabled={isRolling}
            className="py-2.5 px-5 rounded-2xl bg-sangpa-500 hover:bg-sangpa-600 text-white text-xs font-extrabold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <Dices className="w-4 h-4" />
            <span>{text.rollDice}</span>
          </button>
        </div>
      </div>

      {/* Rest / Pause Modal */}
      {isPaused && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full text-center space-y-5 border-4 border-sangpa-300 shadow-2xl animate-fadeIn">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 flex items-center justify-center text-sangpa-700">
              <Coffee className="w-8 h-8 text-sangpa-700" />
            </div>

            <h3 className="text-2xl font-black text-sangpa-900">
              {text.pauseTitle}
            </h3>

            <p className="text-sm text-sangpa-700 leading-relaxed">
              {text.pauseMessage}
            </p>

            <button
              onClick={() => {
                audio.playGentleChime();
                setIsPaused(false);
              }}
              className="w-full py-4 rounded-2xl bg-sangpa-500 hover:bg-sangpa-600 text-white font-extrabold text-base shadow-md transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>{text.resumeButton}</span>
            </button>
          </div>
        </div>
      )}

      {/* Session Completion & Post-Game Mood Modal */}
      {isCompleted && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full text-center space-y-5 border-4 border-amber-300 shadow-2xl animate-fadeIn">
            <div className="w-16 h-16 mx-auto rounded-full bg-amber-100 flex items-center justify-center text-amber-700">
              <Award className="w-9 h-9 text-amber-600" />
            </div>

            <div className="space-y-1">
              <h3 className="text-2xl font-black text-sangpa-900">
                {text.celebrationTitle}
              </h3>
              <p className="text-xs sm:text-sm text-sangpa-700">
                {text.celebrationSubtitle}
              </p>
            </div>

            <div className="p-3 bg-sangpa-50 rounded-2xl border border-sangpa-200 text-xs font-bold text-sangpa-800 flex items-center justify-around">
              <span>🎯 {correctCount} / {totalAttempts} answers</span>
              <span>💡 {hintsUsedCount} hints explored</span>
            </div>

            <div className="space-y-2 pt-2">
              <p className="text-xs font-black text-sangpa-800 uppercase tracking-wider">
                {text.moodPrompt}
              </p>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => handleFinishWithMood('calm')}
                  className="w-full py-3 px-4 rounded-2xl bg-[#EAF2E6] hover:bg-[#DCE7D3] border border-[#CAD8C6] text-sangpa-900 font-extrabold text-sm transition-all active:scale-95 cursor-pointer"
                >
                  {text.moodCalm}
                </button>
                <button
                  onClick={() => handleFinishWithMood('happy')}
                  className="w-full py-3 px-4 rounded-2xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 font-extrabold text-sm transition-all active:scale-95 cursor-pointer"
                >
                  {text.moodHappy}
                </button>
                <button
                  onClick={() => handleFinishWithMood('loved')}
                  className="w-full py-3 px-4 rounded-2xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-900 font-extrabold text-sm transition-all active:scale-95 cursor-pointer"
                >
                  {text.moodLoved}
                </button>
              </div>
            </div>

            <button
              onClick={() => setPatientScreen('games')}
              className="text-xs text-sangpa-600 hover:text-sangpa-900 font-bold block mx-auto pt-2 cursor-pointer"
            >
              {text.backToGames}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
