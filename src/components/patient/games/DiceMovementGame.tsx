import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { ArrowLeft, Dices, Volume2, CheckCircle, Sparkles, Heart } from 'lucide-react';
import { audio } from '../../../utils/audio';

interface MovementPrompt {
  name: string;
  hindi: string;
  instruction: string;
  icon: string;
  reps: string;
}

const movements: MovementPrompt[] = [
  { name: 'Gentle Hand Clap', hindi: 'हाथों की ताली', instruction: 'Clap both hands softly 5 times together with a smile.', icon: '👏', reps: '5 claps' },
  { name: 'Gentle Shoulder Rolls', hindi: 'कंधों का व्यायाम', instruction: 'Roll your shoulders backward twice, then forward twice.', icon: '🧘', reps: '3 rolls' },
  { name: 'Calm Table Tap', hindi: 'मेज़ पर थाप', instruction: 'Gently tap both palms on the table or armrest.', icon: '🤲', reps: '4 taps' },
  { name: 'Peaceful Breath', hindi: 'गहरी आरामदायक सांस', instruction: 'Place hand on heart, inhale the cool morning air, exhale slowly.', icon: '🌸', reps: '2 breaths' },
  { name: 'Soft Wrist Circles', hindi: 'कलाई का घुमाव', instruction: 'Gently rotate your wrists in a slow, peaceful circle.', icon: '✨', reps: '4 circles' },
];

export const DiceMovementGame: React.FC = () => {
  const { setPatientScreen, speakMascot, updateGameStats } = useApp();

  const [selectedMovement, setSelectedMovement] = useState<MovementPrompt | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  const [completedCount, setCompletedCount] = useState(0);

  const rollMovement = () => {
    setIsRolling(true);
    audio.playGentleChime();

    let rollCount = 0;
    const interval = setInterval(() => {
      const randomMove = movements[Math.floor(Math.random() * movements.length)];
      setSelectedMovement(randomMove);
      rollCount++;

      if (rollCount > 8) {
        clearInterval(interval);
        setIsRolling(false);
        audio.playSuccessJingle();

        if (randomMove) {
          speakMascot(`Let's do this gentle movement together: ${randomMove.instruction}`, 'speaking');
        }
      }
    }, 120);
  };

  const handleDone = () => {
    audio.playTempleBell();
    setCompletedCount(c => c + 1);
    updateGameStats('dice-movement', 95);
    speakMascot("Wonderful! That brings warmth and peace to the body.", 'speaking');
    setSelectedMovement(null);
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
              Gentle Movement Dice
            </h2>
            <p className="text-xs sm:text-sm text-sangpa-600">
              Chair-safe physical coordination & mindfulness
            </p>
          </div>
        </div>

        <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-200">
          Safe in Chair
        </span>
      </div>

      {/* Main Movement Dice Box */}
      <div className="bg-white border-2 border-sangpa-300 rounded-3xl p-6 sm:p-8 shadow-card text-center space-y-5">
        {/* Visual Dice */}
        <div className={`w-32 h-32 mx-auto rounded-3xl bg-linear-to-br from-emerald-50 via-white to-emerald-100 border-4 border-emerald-300 shadow-touch flex items-center justify-center transition-all ${
          isRolling ? 'animate-spin scale-105' : 'hover:scale-102'
        }`}>
          {selectedMovement ? (
            <span className="text-5xl">{selectedMovement.icon}</span>
          ) : (
            <Dices className="w-16 h-16 text-emerald-600" />
          )}
        </div>

        {/* Selected Movement Details */}
        {selectedMovement ? (
          <div className="space-y-3 animate-fadeIn">
            <span className="text-xs font-bold text-sangpa-700 uppercase tracking-widest">
              Gentle Exercise
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-sangpa-900">
              {selectedMovement.name}
            </h3>
            <p className="text-sm font-semibold text-emerald-800">
              {selectedMovement.hindi}
            </p>
            <p className="text-base sm:text-lg text-sangpa-800 leading-relaxed font-medium bg-emerald-50 p-4 rounded-2xl border border-emerald-200 max-w-md mx-auto">
              "{selectedMovement.instruction}"
            </p>

            <button
              onClick={handleDone}
              className="mt-2 py-3 px-8 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-base shadow-touch inline-flex items-center gap-2"
            >
              <CheckCircle className="w-5 h-5" />
              <span>I completed this movement!</span>
            </button>
          </div>
        ) : (
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-sangpa-900">
              Roll for a gentle, relaxing stretch!
            </h3>
            <p className="text-xs sm:text-sm text-sangpa-600">
              Easy movements designed for comfort, joint warmth, and calm.
            </p>
          </div>
        )}

        {/* Roll Controls */}
        <div className="pt-2">
          {!selectedMovement && (
            <button
              onClick={rollMovement}
              disabled={isRolling}
              className="py-3.5 px-8 rounded-2xl bg-sangpa-500 hover:bg-sangpa-600 disabled:bg-gray-300 text-white font-bold text-base shadow-touch transition-all active:scale-95 inline-flex items-center gap-2"
            >
              <Dices className="w-5 h-5" />
              <span>Roll the Movement Dice</span>
            </button>
          )}
        </div>
      </div>

      {/* Exercises Done */}
      {completedCount > 0 && (
        <div className="text-center text-xs text-sangpa-600 flex items-center justify-center gap-1.5">
          <Sparkles className="w-4 h-4 text-sangpa-500" />
          <span>{completedCount} gentle movements completed today</span>
        </div>
      )}
    </div>
  );
};
