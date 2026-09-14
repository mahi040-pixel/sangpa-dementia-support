import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { 
  ArrowLeft, 
  RotateCcw, 
  HelpCircle, 
  Play, 
  CheckCircle2, 
  ArrowRight,
  Sparkles,
  Layers
} from 'lucide-react';
import { audio } from '../../../utils/audio';
import { LanguageCode } from '../../../types';

interface ItemSymbol {
  id: string;
  name: string;
  hindi: string;
  assamese: string;
  bengali: string;
  imageUrl: string;
  color: string;
  activeColor: string;
  soundIndex: number;
}

interface SymbolThemeSet {
  id: string;
  themeName: string;
  themeHindi: string;
  symbols: ItemSymbol[];
}

// 3 Rich Thematic Sets with 12 Authentic Photographic Items
const SYMBOL_SETS: SymbolThemeSet[] = [
  {
    id: 'courtyard',
    themeName: 'Courtyard & Traditions',
    themeHindi: 'आँगन और परंपरा',
    symbols: [
      { 
        id: 'pot', 
        name: 'Clay Pot', 
        hindi: 'मिट्टी का घड़ा (Matka)', 
        assamese: 'মাটিৰ কলহ (Matir Koloh)',
        bengali: 'মাটির কলসি (Kolsi)',
        imageUrl: '/assets/games/clay_pot.jpg', 
        color: 'bg-amber-50 border-amber-300 hover:border-amber-400', 
        activeColor: 'bg-amber-100 ring-4 ring-amber-400 border-amber-600 shadow-xl scale-105',
        soundIndex: 0 
      },
      { 
        id: 'bell', 
        name: 'Temple Bell', 
        hindi: 'मंदिर की घंटी (Ghanti)', 
        assamese: 'মন্দিৰৰ ঘণ্টা (Ghanta)',
        bengali: 'মন্দিরের ঘণ্টা (Ghanta)',
        imageUrl: '/assets/games/temple_bell.jpg', 
        color: 'bg-yellow-50 border-yellow-300 hover:border-yellow-400', 
        activeColor: 'bg-yellow-100 ring-4 ring-yellow-400 border-yellow-600 shadow-xl scale-105',
        soundIndex: 1 
      },
      { 
        id: 'flower', 
        name: 'Marigold', 
        hindi: 'गेंदे का फूल (Genda)', 
        assamese: 'গেন্দা ফুল (Genda Phool)',
        bengali: 'গাঁদা ফুল (Gada Phool)',
        imageUrl: '/assets/games/marigold_flower.jpg', 
        color: 'bg-orange-50 border-orange-300 hover:border-orange-400', 
        activeColor: 'bg-orange-100 ring-4 ring-orange-400 border-orange-600 shadow-xl scale-105',
        soundIndex: 2 
      },
      { 
        id: 'leaf', 
        name: 'Mango Leaf', 
        hindi: 'आम का पत्ता (Mango Leaf)', 
        assamese: 'আমৰ পাত (Aamor Paat)',
        bengali: 'আমের পাতা (Aamer Pata)',
        imageUrl: '/assets/games/mango_leaf.jpg', 
        color: 'bg-emerald-50 border-emerald-300 hover:border-emerald-400', 
        activeColor: 'bg-emerald-100 ring-4 ring-emerald-400 border-emerald-600 shadow-xl scale-105',
        soundIndex: 3 
      },
    ]
  },
  {
    id: 'kitchen_garden',
    themeName: 'Garden & Fresh Treats',
    themeHindi: 'बगीचा और ताज़े उपहार',
    symbols: [
      { 
        id: 'mango', 
        name: 'Sweet Mango', 
        hindi: 'मीठा आम (Aam)', 
        assamese: 'পকা মিঠা আম (Aam)',
        bengali: 'মিষ্টি পাকা আম (Aam)',
        imageUrl: '/assets/games/sweet_mango.jpg', 
        color: 'bg-amber-50 border-amber-300 hover:border-amber-400', 
        activeColor: 'bg-amber-100 ring-4 ring-amber-400 border-amber-600 shadow-xl scale-105',
        soundIndex: 0 
      },
      { 
        id: 'teapot', 
        name: 'Chai Kettle', 
        hindi: 'पीतल की केतली (Ketli)', 
        assamese: 'পিতলৰ কেতলী (Ketli)',
        bengali: 'পিতলের কেটলি (Ketli)',
        imageUrl: '/assets/games/brass_teapot.jpg', 
        color: 'bg-yellow-50 border-yellow-300 hover:border-yellow-400', 
        activeColor: 'bg-yellow-100 ring-4 ring-yellow-400 border-yellow-600 shadow-xl scale-105',
        soundIndex: 1 
      },
      { 
        id: 'coconut', 
        name: 'Fresh Coconut', 
        hindi: 'ताज़ा नारियल (Nariyal)', 
        assamese: 'নাৰিকল (Narikol)',
        bengali: 'টাটকা নারকেল (Narkel)',
        imageUrl: '/assets/games/fresh_coconut.jpg', 
        color: 'bg-stone-50 border-stone-300 hover:border-stone-400', 
        activeColor: 'bg-stone-100 ring-4 ring-stone-400 border-stone-600 shadow-xl scale-105',
        soundIndex: 2 
      },
      { 
        id: 'jasmine', 
        name: 'Jasmine Flower', 
        hindi: 'मोगरा फूल (Mogra)', 
        assamese: 'খৰিকাজাই / বকুল (Mogra)',
        bengali: 'বেলি ফুল (Beli Phool)',
        imageUrl: '/assets/games/jasmine_flower.jpg', 
        color: 'bg-emerald-50 border-emerald-300 hover:border-emerald-400', 
        activeColor: 'bg-emerald-100 ring-4 ring-emerald-400 border-emerald-600 shadow-xl scale-105',
        soundIndex: 3 
      },
    ]
  },
  {
    id: 'festivals_music',
    themeName: 'Festivals & Melody',
    themeHindi: 'त्योहार और मधुर संगीत',
    symbols: [
      { 
        id: 'diya', 
        name: 'Festive Diya', 
        hindi: 'दिवाली का दीया (Diya)', 
        assamese: 'মাটিৰ চাকি (Chaki)',
        bengali: 'উৎসবের প্রদীপ (Pradip)',
        imageUrl: '/assets/games/diwali_diya.jpg', 
        color: 'bg-orange-50 border-orange-300 hover:border-orange-400', 
        activeColor: 'bg-orange-100 ring-4 ring-orange-400 border-orange-600 shadow-xl scale-105',
        soundIndex: 0 
      },
      { 
        id: 'flute', 
        name: 'Bamboo Flute', 
        hindi: 'बाँसुरी (Bansuri)', 
        assamese: 'বাঁহী (Bahi)',
        bengali: 'বাঁশের বাঁশি (Bashi)',
        imageUrl: '/assets/games/bamboo_flute.jpg', 
        color: 'bg-yellow-50 border-yellow-300 hover:border-yellow-400', 
        activeColor: 'bg-yellow-100 ring-4 ring-yellow-400 border-yellow-600 shadow-xl scale-105',
        soundIndex: 1 
      },
      { 
        id: 'fan', 
        name: 'Handwoven Fan', 
        hindi: 'हाथ का पंखा (Pankha)', 
        assamese: 'বিচনী (Bichoni)',
        bengali: 'হাতের পাখা (Pakha)',
        imageUrl: '/assets/games/hand_fan.jpg', 
        color: 'bg-amber-50 border-amber-300 hover:border-amber-400', 
        activeColor: 'bg-amber-100 ring-4 ring-amber-400 border-amber-600 shadow-xl scale-105',
        soundIndex: 2 
      },
      { 
        id: 'pomegranate', 
        name: 'Pomegranate', 
        hindi: 'मीठा अनार (Anar)', 
        assamese: 'ডালিম (Dalim)',
        bengali: 'পাকা ডালিম (Dalim)',
        imageUrl: '/assets/games/pomegranate.jpg', 
        color: 'bg-rose-50 border-rose-300 hover:border-rose-400', 
        activeColor: 'bg-rose-100 ring-4 ring-rose-400 border-rose-600 shadow-xl scale-105',
        soundIndex: 3 
      },
    ]
  }
];

export const SequenceRecallGame: React.FC = () => {
  const { setPatientScreen, speakMascot, updateGameStats, language } = useApp();

  const [currentSetIndex, setCurrentSetIndex] = useState(0);
  const [level, setLevel] = useState(1);
  const [roundsInCurrentLevel, setRoundsInCurrentLevel] = useState(0);
  const [totalRoundsCompleted, setTotalRoundsCompleted] = useState(0);

  const [sequenceLength, setSequenceLength] = useState(3);
  const [sequence, setSequence] = useState<ItemSymbol[]>([]);
  const [playerInput, setPlayerInput] = useState<string[]>([]);
  const [gameState, setGameState] = useState<'idle' | 'showing' | 'playing' | 'success' | 'retry'>('idle');
  const [activeHighlight, setActiveHighlight] = useState<string | null>(null);
  const [showingStep, setShowingStep] = useState<number>(0);
  const [hintUsed, setHintUsed] = useState(false);
  const [feedback, setFeedback] = useState("Tap 'Start Sequence' to watch the pictures light up in order.");

  const currentTheme = SYMBOL_SETS[currentSetIndex];
  const activeSymbols = currentTheme.symbols;

  const getItemLabel = (sym: ItemSymbol, lang: LanguageCode) => {
    switch (lang) {
      case 'hi': return sym.hindi;
      case 'as': return sym.assamese;
      case 'bn': return sym.bengali;
      default: return sym.hindi;
    }
  };

  const startNewRound = (customSymbols?: ItemSymbol[]) => {
    const symbolsToUse = customSymbols || activeSymbols;
    // Generate new sequence
    const newSeq: ItemSymbol[] = [];
    for (let i = 0; i < sequenceLength; i++) {
      const randomSym = symbolsToUse[Math.floor(Math.random() * symbolsToUse.length)];
      newSeq.push(randomSym);
    }
    setSequence(newSeq);
    setPlayerInput([]);
    setHintUsed(false);
    setGameState('showing');
    setShowingStep(0);
    setFeedback("Watch the pictures carefully as they light up in order...");

    // Animate sequence
    newSeq.forEach((sym, idx) => {
      setTimeout(() => {
        setActiveHighlight(sym.id);
        setShowingStep(idx + 1);
        audio.playSequenceNote(sym.soundIndex);
      }, (idx + 1) * 950);

      setTimeout(() => {
        setActiveHighlight(null);
      }, (idx + 1) * 950 + 650);
    });

    // Switch to playing state after sequence finishes
    setTimeout(() => {
      setGameState('playing');
      setActiveHighlight(null);
      setShowingStep(0);
      setFeedback("Now tap the pictures in the same order!");
      speakMascot("Your turn now! Tap the pictures in order. Take your time.", 'speaking');
    }, (newSeq.length + 1) * 1000);
  };

  const handleSymbolClick = (sym: ItemSymbol) => {
    if (gameState !== 'playing') return;

    audio.playSequenceNote(sym.soundIndex);
    const nextInput = [...playerInput, sym.id];
    setPlayerInput(nextInput);

    const currentIndex = nextInput.length - 1;
    if (sym.id !== sequence[currentIndex]?.id) {
      // Gentle mismatch feedback (No harsh failure!)
      setGameState('retry');
      setFeedback("Let's try once more together. You can use a friendly hint!");
      speakMascot("That was a wonderful try! Let's take another gentle look together.", 'help');
      return;
    }

    // If whole sequence matched
    if (nextInput.length === sequence.length) {
      setGameState('success');
      audio.playSuccessJingle();
      setTotalRoundsCompleted(t => t + 1);
      const nextRoundsInLevel = roundsInCurrentLevel + 1;
      setRoundsInCurrentLevel(nextRoundsInLevel);

      if (nextRoundsInLevel >= 2) {
        setFeedback("Splendid! You cleared 2 rounds. Next level brings 4 brand new pictures!");
        speakMascot("Splendid memory! You cleared this level. Next level brings brand new pictures!", 'speaking');
      } else {
        setFeedback("Wonderful memory! You remembered the whole sequence correctly.");
        speakMascot("Wonderful memory! You remembered each picture in order.", 'speaking');
      }

      updateGameStats('sequence', 95);
    }
  };

  // Triggered when user taps the "Play Next Round →" button
  const handlePlayNextRound = () => {
    if (roundsInCurrentLevel >= 2) {
      // Advance level and switch to the next theme set with brand new pictures!
      const nextLevel = level + 1;
      const nextSetIndex = (currentSetIndex + 1) % SYMBOL_SETS.length;
      setLevel(nextLevel);
      setCurrentSetIndex(nextSetIndex);
      setRoundsInCurrentLevel(0);

      // Slightly increase sequence length if comfortable
      if (sequenceLength < 4 && !hintUsed) {
        setSequenceLength(l => l + 1);
      }

      const nextThemeSymbols = SYMBOL_SETS[nextSetIndex].symbols;
      startNewRound(nextThemeSymbols);
    } else {
      startNewRound();
    }
  };

  const handleGiveHint = () => {
    setHintUsed(true);
    if (sequence.length > 0) {
      const nextNeeded = sequence[playerInput.length] || sequence[0];
      setActiveHighlight(nextNeeded.id);
      audio.playSequenceNote(nextNeeded.soundIndex);
      setTimeout(() => setActiveHighlight(null), 900);
      setFeedback(`Friendly Hint: The next picture is ${nextNeeded.name} (${getItemLabel(nextNeeded, language)})`);
    }
  };

  // Optional manual theme switch
  const handleSwitchThemeManually = () => {
    const nextSetIndex = (currentSetIndex + 1) % SYMBOL_SETS.length;
    setCurrentSetIndex(nextSetIndex);
    setGameState('idle');
    setFeedback(`New Theme: ${SYMBOL_SETS[nextSetIndex].themeName}. Tap 'Start Sequence' to play!`);
  };

  return (
    <div className="flex-1 p-3.5 sm:p-5 max-w-xl mx-auto w-full space-y-3.5 sm:space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 border-b border-sangpa-200/80 pb-2.5">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setPatientScreen('games')}
            className="p-2 rounded-2xl bg-white border border-sangpa-300 hover:bg-sangpa-100 text-sangpa-800 transition-colors shadow-2xs"
            title="Back to games"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-sangpa-900 tracking-tight">
              Sequence Recall
            </h2>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs font-bold text-sangpa-700">
                Level {level} • Round {roundsInCurrentLevel + 1}/2
              </span>
              <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md border border-emerald-200">
                {currentTheme.themeName}
              </span>
            </div>
          </div>
        </div>

        {/* Change theme button */}
        <button
          onClick={handleSwitchThemeManually}
          disabled={gameState === 'showing'}
          className="p-2 rounded-2xl bg-sangpa-100 hover:bg-sangpa-200 text-sangpa-800 text-xs font-bold border border-sangpa-200 transition-colors flex items-center gap-1"
          title="Switch to another picture theme"
        >
          <Layers className="w-3.5 h-3.5 text-sangpa-600" />
          <span className="hidden sm:inline">Theme</span>
        </button>
      </div>

      {/* Mascot Guidance & Feedback Prompt */}
      <div className="bg-white border-2 border-sangpa-300 rounded-3xl p-4 sm:p-5 shadow-sm text-center space-y-2">
        <p className="text-base sm:text-lg font-bold text-sangpa-900">
          {feedback}
        </p>

        {/* Live Step Tracker during Demonstration */}
        {gameState === 'showing' && sequence.length > 0 && (
          <div className="flex items-center justify-center gap-2 pt-1">
            <span className="text-xs font-bold text-sangpa-700 uppercase tracking-wider">
              Step {showingStep} of {sequence.length}
            </span>
            <div className="flex items-center gap-1.5">
              {sequence.map((_, i) => (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-full transition-all ${
                    showingStep > i 
                      ? 'bg-sangpa-600 scale-110' 
                      : 'bg-sangpa-200'
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Player Progress Indicators during Turn */}
        {gameState === 'playing' && sequence.length > 0 && (
          <div className="pt-1.5">
            <div className="flex items-center justify-center gap-2">
              <span className="text-xs font-bold text-sangpa-700">
                Your Progress: {playerInput.length} of {sequence.length}
              </span>
            </div>
            <div className="flex items-center justify-center gap-2 mt-2">
              {sequence.map((_, idx) => {
                const isCompleted = idx < playerInput.length;
                const symId = playerInput[idx];
                const matchedSym = activeSymbols.find(s => s.id === symId);
                return (
                  <div
                    key={idx}
                    className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl border-2 flex items-center justify-center overflow-hidden transition-all ${
                      isCompleted && matchedSym
                        ? 'border-sangpa-500 bg-sangpa-50 shadow-sm'
                        : 'border-dashed border-gray-300 bg-gray-50'
                    }`}
                  >
                    {isCompleted && matchedSym ? (
                      <img 
                        src={matchedSym.imageUrl} 
                        alt={matchedSym.name} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-xs font-bold text-gray-400">{idx + 1}</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Success Celebration */}
        {gameState === 'success' && (
          <div className="flex items-center justify-center gap-2 text-emerald-700 font-bold text-sm pt-1 animate-fadeIn">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>
              {roundsInCurrentLevel >= 2
                ? "Level 2-round goal completed! Ready for new pictures?"
                : "Round cleared with wonderful recall!"}
            </span>
          </div>
        )}
      </div>

      {/* 4 Active Symbol Buttons with Real Photographic Pictures */}
      <div className="grid grid-cols-2 gap-3 sm:gap-3.5 py-1">
        {activeSymbols.map((sym) => {
          const isLit = activeHighlight === sym.id;
          return (
            <button
              key={sym.id}
              disabled={gameState === 'showing'}
              onClick={() => handleSymbolClick(sym)}
              className={`p-3 sm:p-3.5 rounded-3xl border-3 flex flex-col items-center justify-center gap-2 transition-all duration-200 active:scale-95 text-center ${
                isLit
                  ? sym.activeColor
                  : `${sym.color} hover:shadow-md text-sangpa-900`
              }`}
            >
              {/* Real Photograph Image Container */}
              <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden shadow-xs border-2 bg-white transition-transform duration-200 ${
                isLit ? 'scale-105 border-sangpa-500 ring-2 ring-sangpa-400' : 'border-black/10'
              }`}>
                <img 
                  src={sym.imageUrl} 
                  alt={sym.name} 
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Title & Cultural Name */}
              <div className="space-y-0.5">
                <span className="block font-extrabold text-sm sm:text-base text-sangpa-900 leading-tight">
                  {sym.name}
                </span>
                <span className="block text-[11px] sm:text-xs font-medium text-sangpa-700">
                  {getItemLabel(sym, language)}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Action Controls */}
      <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
        {gameState === 'idle' && (
          <button
            onClick={() => startNewRound()}
            className="w-full sm:w-auto py-3.5 px-8 rounded-2xl bg-sangpa-500 hover:bg-sangpa-600 text-white font-bold text-base shadow-touch transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <Play className="w-5 h-5 fill-current" />
            <span>Start Sequence</span>
          </button>
        )}

        {gameState === 'playing' && (
          <button
            onClick={handleGiveHint}
            className="py-2.5 px-5 rounded-2xl bg-amber-100 hover:bg-amber-200 border-2 border-amber-300 text-amber-900 font-bold text-sm shadow-xs transition-all flex items-center gap-2 active:scale-95"
          >
            <HelpCircle className="w-4 h-4 text-amber-700" />
            <span>Use a Friendly Hint</span>
          </button>
        )}

        {gameState === 'retry' && (
          <button
            onClick={() => startNewRound()}
            className="py-3 px-7 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-base shadow-md transition-all active:scale-95 flex items-center gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            <span>Try Again Gently</span>
          </button>
        )}

        {/* FORWARD ARROW on 'Play Next Round' as explicitly requested */}
        {gameState === 'success' && (
          <button
            onClick={handlePlayNextRound}
            className="py-3.5 px-8 rounded-2xl bg-sangpa-500 hover:bg-sangpa-600 text-white font-bold text-base shadow-touch transition-all active:scale-95 flex items-center gap-2.5 animate-bounce"
          >
            <span>{roundsInCurrentLevel >= 2 ? "Unlock Next Level & Pictures" : "Play Next Round"}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};
