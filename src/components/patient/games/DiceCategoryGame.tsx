import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { ArrowLeft, Dices, Volume2, Sparkles, Heart } from 'lucide-react';
import { audio } from '../../../utils/audio';

interface CategoryPrompt {
  category: string;
  hindi: string;
  icon: string;
  sampleItems: string[];
}

const categories: CategoryPrompt[] = [
  { category: 'Sweet Indian Fruits', hindi: 'मीठे फल', icon: '🥭', sampleItems: ['Mango (आम)', 'Guava (अमरूद)', 'Papaya (पपीता)', 'Banana (केला)'] },
  { category: 'Beloved Animals & Birds', hindi: 'पशु और पक्षी', icon: '🦚', sampleItems: ['Peacock (मोर)', 'Cow (गौ माता)', 'Parrot (तोता)', 'Deer (हिरण)'] },
  { category: 'Traditional Indian Sweets', hindi: 'पारंपरिक मिठाइयाँ', icon: '🍯', sampleItems: ['Kheer (खीर)', 'Gulab Jamun', 'Besan Ladoo', 'Halwa'] },
  { category: 'Familiar Festival Songs', hindi: 'त्योहारों के गीत', icon: '🎶', sampleItems: ['Bihu Melody', 'Diwali Aarti', 'Krishna Bhajan', 'Lullaby'] },
  { category: 'Favorite Home Places', hindi: 'घर के प्रिय कोने', icon: '🏡', sampleItems: ['Verandah (बरामदा)', 'Pooja Room', 'Sunny Garden', 'Kitchen'] },
];

export const DiceCategoryGame: React.FC = () => {
  const { setPatientScreen, speakMascot, updateGameStats } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<CategoryPrompt | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  const [completedRounds, setCompletedRounds] = useState(0);

  const rollDice = () => {
    setIsRolling(true);
    audio.playGentleChime();

    let rollCount = 0;
    const interval = setInterval(() => {
      const randomCat = categories[Math.floor(Math.random() * categories.length)];
      setSelectedCategory(randomCat);
      rollCount++;

      if (rollCount > 8) {
        clearInterval(interval);
        setIsRolling(false);
        audio.playSuccessJingle();
        setCompletedRounds(c => c + 1);
        updateGameStats('dice-category', 90);

        if (randomCat) {
          speakMascot(`Wonderful topic, Kamala Dadi! Name three things from ${randomCat.category}. Take all the time you like.`, 'speaking');
        }
      }
    }, 120);
  };

  const handleHearPromptAgain = () => {
    if (selectedCategory) {
      speakMascot(`Tell me about your favorite ${selectedCategory.category}. For example: ${selectedCategory.sampleItems.join(', ')}.`, 'speaking');
    }
  };

  return (
    <div className="flex-1 p-4 sm:p-6 max-w-2xl mx-auto w-full space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 border-b border-sangpa-200 pb-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setPatientScreen('games')}
            className="p-2 rounded-2xl bg-white border border-sangpa-300 hover:bg-sangpa-100 text-sangpa-800 transition-colors shadow-2xs"
            title="Back to games"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-sangpa-900 tracking-tight">
              Dice of Memories
            </h2>
            <p className="text-xs sm:text-sm text-sangpa-600">
              Gentle verbal fluency & reminiscence
            </p>
          </div>
        </div>

        <span className="text-xs font-bold px-3 py-1 rounded-full bg-sangpa-100 text-sangpa-800 border border-sangpa-200">
          Open Conversation
        </span>
      </div>

      {/* Main Dice Stage */}
      <div className="bg-white border-2 border-sangpa-300 rounded-3xl p-6 sm:p-8 shadow-card text-center space-y-5">
        {/* Dice Visual */}
        <div className={`w-32 h-32 mx-auto rounded-3xl bg-linear-to-br from-amber-50 via-white to-amber-100 border-4 border-amber-300 shadow-touch flex items-center justify-center transition-all ${
          isRolling ? 'animate-bounce scale-105' : 'hover:scale-102'
        }`}>
          {selectedCategory ? (
            <span className="text-5xl">{selectedCategory.icon}</span>
          ) : (
            <Dices className="w-16 h-16 text-amber-600" />
          )}
        </div>

        {/* Category Result */}
        {selectedCategory ? (
          <div className="space-y-2 animate-fadeIn">
            <span className="text-xs font-bold text-sangpa-700 uppercase tracking-widest">
              Rolled Topic
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-sangpa-900">
              {selectedCategory.category}
            </h3>
            <p className="text-base text-sangpa-700 font-medium">
              {selectedCategory.hindi}
            </p>

            <div className="p-4 bg-sangpa-50 rounded-2xl border border-sangpa-200 text-left max-w-md mx-auto mt-3">
              <p className="text-xs font-semibold text-sangpa-800 mb-1.5 flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-sangpa-600 fill-current" />
                <span>Sangpa asks: "Can you name 2 or 3 of these?"</span>
              </p>
              <div className="flex flex-wrap gap-1.5">
                {selectedCategory.sampleItems.map((item, idx) => (
                  <span key={idx} className="text-xs font-bold px-2.5 py-1 rounded-xl bg-white border border-sangpa-200 text-sangpa-800">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-sangpa-900">
              Roll the golden memory dice!
            </h3>
            <p className="text-xs sm:text-sm text-sangpa-600">
              Every roll brings up a warm, familiar topic to talk about.
            </p>
          </div>
        )}

        {/* Controls */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={rollDice}
            disabled={isRolling}
            className="py-3.5 px-8 rounded-2xl bg-sangpa-500 hover:bg-sangpa-600 disabled:bg-gray-300 text-white font-bold text-base shadow-touch transition-all active:scale-95 flex items-center gap-2"
          >
            <Dices className="w-5 h-5" />
            <span>{selectedCategory ? 'Roll Again' : 'Roll the Dice'}</span>
          </button>

          {selectedCategory && (
            <button
              onClick={handleHearPromptAgain}
              className="p-3 rounded-2xl bg-sangpa-100 hover:bg-sangpa-200 text-sangpa-800"
              title="Hear prompt aloud"
            >
              <Volume2 className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Rounds completed */}
      {completedRounds > 0 && (
        <div className="text-center text-xs text-sangpa-600 flex items-center justify-center gap-1.5">
          <Sparkles className="w-4 h-4 text-sangpa-500" />
          <span>{completedRounds} memory conversations explored together</span>
        </div>
      )}
    </div>
  );
};
