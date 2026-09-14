import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { ArrowLeft, Volume2, CheckCircle2, RotateCcw, Eye, Heart, Sparkles } from 'lucide-react';
import { audio } from '../../../utils/audio';
import { MemoryItem } from '../../../types';

export const FlashcardsGame: React.FC = () => {
  const { setPatientScreen, memories, speakMascot, updateGameStats } = useApp();

  const flashcardItems = memories.filter((m: MemoryItem) => m.inFlashcards);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [rememberedCount, setRememberedCount] = useState(0);

  const current = flashcardItems[currentIndex] || flashcardItems[0];

  const handlePlayVoice = () => {
    if (current) {
      speakMascot(current.audioNote, 'speaking');
    }
  };

  const handleReveal = () => {
    setIsRevealed(true);
    audio.playGentleChime();
  };

  const handleRemembered = () => {
    audio.playSuccessJingle();
    setRememberedCount(c => c + 1);
    speakMascot(`Wonderful! You remembered ${current.title}.`, 'speaking');
    nextCard();
  };

  const handleNeedReview = () => {
    audio.playTempleBell();
    speakMascot(`That is completely fine, Kamala Dadi. We will look at this beautiful memory together again.`, 'speaking');
    nextCard();
  };

  const nextCard = () => {
    if (currentIndex < flashcardItems.length - 1) {
      setCurrentIndex(i => i + 1);
      setIsRevealed(false);
    } else {
      updateGameStats('flashcards', 90);
      speakMascot("You completed all family flashcards today! What wonderful memories.", 'speaking');
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
              Family & Loved Ones Flashcards
            </h2>
            <p className="text-xs sm:text-sm text-sangpa-600">
              Card {currentIndex + 1} of {flashcardItems.length}
            </p>
          </div>
        </div>

        <button
          onClick={handlePlayVoice}
          className="p-2 rounded-full bg-sangpa-100 hover:bg-sangpa-200 text-sangpa-700"
          title="Voice narration"
        >
          <Volume2 className="w-5 h-5" />
        </button>
      </div>

      {/* Main Flashcard */}
      <div className="bg-white border-2 border-sangpa-300 rounded-3xl p-5 shadow-card space-y-4 text-center">
        {/* Photo Container */}
        <div className="w-full h-56 sm:h-72 rounded-2xl overflow-hidden bg-sangpa-50 border-2 border-sangpa-200 relative shadow-inner">
          <img 
            src={current.imageUrl} 
            alt={current.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2.5 py-1 rounded-full flex items-center gap-1">
            <Heart className="w-3.5 h-3.5 text-rose-400 fill-current" />
            <span>{current.relationship}</span>
          </div>
        </div>

        {/* Question Prompt or Revealed Answer */}
        {!isRevealed ? (
          <div className="py-2">
            <h3 className="text-lg sm:text-xl font-bold text-sangpa-900">
              Who or where is in this photograph?
            </h3>
            <p className="text-xs sm:text-sm text-sangpa-600 mt-1">
              Take a quiet moment to look at the smiling face.
            </p>

            <button
              onClick={handleReveal}
              className="mt-4 py-3 px-6 rounded-2xl bg-sangpa-500 hover:bg-sangpa-600 active:scale-98 text-white font-bold text-sm shadow-md transition-all inline-flex items-center gap-2"
            >
              <Eye className="w-4 h-4" />
              <span>Reveal Name & Details</span>
            </button>
          </div>
        ) : (
          <div className="py-2 bg-sangpa-50 rounded-2xl p-4 border border-sangpa-200 animate-fadeIn text-left">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-sangpa-700 uppercase tracking-wider">
                {current.relationship}
              </span>
              <span className="text-xs text-sangpa-500">{current.location}</span>
            </div>
            <h3 className="text-xl font-bold text-sangpa-900 mt-0.5">
              {current.title}
            </h3>
            <p className="text-sm text-sangpa-700 mt-1.5 leading-relaxed">
              {current.caption}
            </p>

            {/* Self-Rating for Adaptive Review */}
            <div className="mt-4 pt-3 border-t border-sangpa-200 flex flex-col sm:flex-row gap-2">
              <button
                onClick={handleRemembered}
                className="flex-1 py-2.5 px-4 rounded-xl bg-sangpa-500 hover:bg-sangpa-600 text-white font-bold text-sm shadow-xs flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>I remembered!</span>
              </button>

              <button
                onClick={handleNeedReview}
                className="py-2.5 px-4 rounded-xl bg-white hover:bg-sangpa-100 text-sangpa-800 font-semibold text-xs sm:text-sm border border-sangpa-300"
              >
                Review again later
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Progress Footer */}
      <div className="text-center text-xs text-sangpa-600 flex items-center justify-center gap-2">
        <Sparkles className="w-4 h-4 text-sangpa-500" />
        <span>{rememberedCount} family memories recalled with love</span>
      </div>
    </div>
  );
};
