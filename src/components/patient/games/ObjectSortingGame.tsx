import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { ArrowLeft, CheckCircle2, RotateCcw } from 'lucide-react';
import { audio } from '../../../utils/audio';

interface SortItem {
  id: string;
  name: string;
  hindi: string;
  icon: string;
  category: 'fruits' | 'festivals' | 'household';
}

const itemsToSort: SortItem[] = [
  { id: '1', name: 'Sweet Mango', hindi: 'मीठा आम', icon: '🥭', category: 'fruits' },
  { id: '2', name: 'Diwali Diya', hindi: 'दिवाली का दीया', icon: '🪔', category: 'festivals' },
  { id: '3', name: 'Handwoven Fan', hindi: 'हाथ का पंखा', icon: '🪭', category: 'household' },
  { id: '4', name: 'Ripe Banana', hindi: 'पका केला', icon: '🍌', category: 'fruits' },
  { id: '5', name: 'Marigold Garland', hindi: 'गेंदे की माला', icon: '🌼', category: 'festivals' },
  { id: '6', name: 'Brass Chai Pot', hindi: 'पीतल की केतली', icon: '🫖', category: 'household' },
];

export const ObjectSortingGame: React.FC = () => {
  const { setPatientScreen, speakMascot, updateGameStats } = useApp();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [sortedCount, setSortedCount] = useState(0);
  const [feedback, setFeedback] = useState("Tap the matching basket for this item:");

  const currentItem = itemsToSort[currentIndex];
  const isFinished = currentIndex >= itemsToSort.length;

  const handleSelectCategory = (selectedCat: 'fruits' | 'festivals' | 'household') => {
    if (!currentItem) return;

    if (selectedCat === currentItem.category) {
      audio.playSuccessJingle();
      setSortedCount(c => c + 1);
      setFeedback(`Great choice! ${currentItem.name} placed in the right basket.`);
      speakMascot(`Perfect! That belongs right there.`, 'speaking');
      setCurrentIndex(i => i + 1);

      if (currentIndex + 1 >= itemsToSort.length) {
        updateGameStats('sorting', 95);
        speakMascot("You sorted all items beautifully, Kamala Dadi!", 'speaking');
      }
    } else {
      audio.playTempleBell();
      setFeedback(`Let's think together. Is ${currentItem.name} a fruit, festival item, or for the home?`);
      speakMascot(`Take another moment, Kamala Dadi. Let's look at it together.`, 'help');
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
              Object Sorting
            </h2>
            <p className="text-xs sm:text-sm text-sangpa-600">
              Culturally familiar item categorization
            </p>
          </div>
        </div>

        <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-200">
          Item {Math.min(currentIndex + 1, itemsToSort.length)} of {itemsToSort.length}
        </span>
      </div>

      {!isFinished ? (
        <>
          {/* Current Item to Sort */}
          <div className="bg-white border-2 border-sangpa-300 rounded-3xl p-6 shadow-card text-center space-y-2">
            <span className="text-5xl sm:text-6xl block animate-mascot-idle">
              {currentItem.icon}
            </span>
            <h3 className="text-2xl font-extrabold text-sangpa-900">
              {currentItem.name}
            </h3>
            <p className="text-sm text-sangpa-600">
              {currentItem.hindi}
            </p>
            <p className="text-sm font-semibold text-sangpa-800 pt-1">
              {feedback}
            </p>
          </div>

          {/* 3 Large Category Baskets */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <button
              onClick={() => handleSelectCategory('fruits')}
              className="p-4 rounded-3xl bg-amber-50 hover:bg-amber-100 border-2 border-amber-300 active:scale-95 transition-all text-center flex flex-col items-center gap-1 shadow-sm"
            >
              <span className="text-3xl">🍎</span>
              <span className="font-bold text-base text-amber-900">Fresh Fruits</span>
              <span className="text-xs text-amber-700">ताज़े फल</span>
            </button>

            <button
              onClick={() => handleSelectCategory('festivals')}
              className="p-4 rounded-3xl bg-rose-50 hover:bg-rose-100 border-2 border-rose-300 active:scale-95 transition-all text-center flex flex-col items-center gap-1 shadow-sm"
            >
              <span className="text-3xl">🪔</span>
              <span className="font-bold text-base text-rose-900">Festival Items</span>
              <span className="text-xs text-rose-700">त्योहारों की सामग्री</span>
            </button>

            <button
              onClick={() => handleSelectCategory('household')}
              className="p-4 rounded-3xl bg-emerald-50 hover:bg-emerald-100 border-2 border-emerald-300 active:scale-95 transition-all text-center flex flex-col items-center gap-1 shadow-sm"
            >
              <span className="text-3xl">🥣</span>
              <span className="font-bold text-base text-emerald-900">Home Utensils</span>
              <span className="text-xs text-emerald-700">घर के बर्तन</span>
            </button>
          </div>
        </>
      ) : (
        <div className="bg-white border-2 border-sangpa-300 rounded-3xl p-8 shadow-card text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-bold text-sangpa-900">
            All Items Sorted Perfectly!
          </h3>
          <p className="text-sm text-sangpa-600">
            You recognized all fruits, festival treasures, and home utensils.
          </p>
          <button
            onClick={() => {
              setCurrentIndex(0);
              setSortedCount(0);
            }}
            className="py-3 px-6 rounded-2xl bg-sangpa-500 hover:bg-sangpa-600 text-white font-bold text-sm shadow-md inline-flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Sort Again</span>
          </button>
        </div>
      )}
    </div>
  );
};
