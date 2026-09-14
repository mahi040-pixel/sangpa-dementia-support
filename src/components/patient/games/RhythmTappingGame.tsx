import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../../context/AppContext';
import { ArrowLeft, Music, Play, RotateCcw, CheckCircle, Sparkles } from 'lucide-react';
import { audio } from '../../../utils/audio';

export const RhythmTappingGame: React.FC = () => {
  const { setPatientScreen, speakMascot, updateGameStats } = useApp();

  const [isPlayingPattern, setIsPlayingPattern] = useState(false);
  const [patternStep, setPatternStep] = useState(0);
  const [userScore, setUserScore] = useState<number[]>([]);
  const [gameDone, setGameDone] = useState(false);
  const [feedback, setFeedback] = useState("Tap 'Play Rhythm' to hear the beat: Tap, Tap, Pause, Tap");
  const [isDrumActive, setIsDrumActive] = useState(false);

  // Rhythm Pattern: 1 = Beat, 0 = Pause
  const pattern = [1, 1, 0, 1]; // Tap, Tap, Pause, Tap
  const stepInterval = 800; // ms

  const handlePlayRhythm = () => {
    setIsPlayingPattern(true);
    setGameDone(false);
    setUserScore([]);
    setFeedback("Listen to the rhythm...");
    speakMascot("Listen to the soft drum rhythm. Tap, Tap, Pause, Tap.", 'speaking');

    let current = 0;
    const interval = setInterval(() => {
      setPatternStep(current);
      if (pattern[current] === 1) {
        audio.playRhythmBeat(1);
        setIsDrumActive(true);
        setTimeout(() => setIsDrumActive(false), 250);
      }
      current++;
      if (current >= pattern.length) {
        clearInterval(interval);
        setTimeout(() => {
          setIsPlayingPattern(false);
          setPatternStep(-1);
          setFeedback("Your turn! Tap the drum along with the rhythm.");
        }, stepInterval);
      }
    }, stepInterval);
  };

  const handleUserTap = () => {
    audio.playRhythmBeat(1.2);
    setIsDrumActive(true);
    setTimeout(() => setIsDrumActive(false), 200);

    const newScore = [...userScore, Date.now()];
    setUserScore(newScore);

    if (newScore.length === 1) {
      setFeedback("First tap! Keep going...");
    } else if (newScore.length === 2) {
      setFeedback("Good tap! Now pause gently...");
    } else if (newScore.length === 3) {
      // 3 taps completed (for the 3 beats)
      setGameDone(true);
      audio.playSuccessJingle();
      setFeedback("Splendid rhythm coordination! Your motor timing is sharp.");
      speakMascot("Beautiful rhythm, Kamala Dadi! Your hands moved with lovely harmony.", 'speaking');
      updateGameStats('rhythm', 92);
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
              Rhythm Tapping
            </h2>
            <p className="text-xs sm:text-sm text-sangpa-600">
              Motor timing & gentle focus
            </p>
          </div>
        </div>

        <span className="text-xs font-bold px-3 py-1 rounded-full bg-purple-100 text-purple-900 border border-purple-200 flex items-center gap-1">
          <Music className="w-3.5 h-3.5" />
          <span>Calm Tempo</span>
        </span>
      </div>

      {/* Rhythm Indicator Visualizer */}
      <div className="bg-white border-2 border-sangpa-300 rounded-3xl p-5 shadow-card text-center space-y-3">
        <p className="text-base sm:text-lg font-bold text-sangpa-900">
          {feedback}
        </p>

        {/* 4 Beat Step Circles */}
        <div className="flex items-center justify-center gap-3 py-2">
          {pattern.map((beat, idx) => {
            const isCurrent = patternStep === idx;
            const isPause = beat === 0;

            return (
              <div
                key={idx}
                className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center font-bold text-xs transition-all duration-200 ${
                  isCurrent
                    ? 'bg-purple-600 text-white shadow-touch scale-110 ring-4 ring-purple-200'
                    : isPause
                    ? 'bg-gray-100 border-2 border-dashed border-gray-300 text-gray-500'
                    : 'bg-sangpa-100 border-2 border-sangpa-300 text-sangpa-900'
                }`}
              >
                <span>{isPause ? 'Pause' : 'Tap'}</span>
                <span className="text-[10px] text-opacity-80">#{idx + 1}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Large Interactive Tap Drum Pad */}
      <div className="py-4 flex flex-col items-center">
        <button
          disabled={isPlayingPattern}
          onClick={handleUserTap}
          className={`w-48 h-48 sm:w-56 sm:h-56 rounded-full border-8 transition-all flex flex-col items-center justify-center gap-2 shadow-2xl active:scale-95 ${
            isDrumActive
              ? 'bg-purple-500 border-purple-300 text-white scale-105 shadow-touch'
              : 'bg-white hover:bg-sangpa-50 border-sangpa-400 text-sangpa-900'
          }`}
        >
          <div className="p-3 rounded-full bg-purple-100 text-purple-700">
            <Music className="w-8 h-8" />
          </div>
          <span className="font-extrabold text-xl sm:text-2xl tracking-wide">
            {isDrumActive ? "TAP!" : "TAP HERE"}
          </span>
          <span className="text-xs text-sangpa-600">
            {userScore.length} of 3 taps
          </span>
        </button>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          disabled={isPlayingPattern}
          onClick={handlePlayRhythm}
          className="py-3 px-6 rounded-2xl bg-sangpa-500 hover:bg-sangpa-600 text-white font-bold text-base shadow-md transition-all active:scale-95 flex items-center gap-2"
        >
          <Play className="w-5 h-5 fill-current" />
          <span>{isPlayingPattern ? "Listening..." : "Play Demo Rhythm"}</span>
        </button>

        {gameDone && (
          <button
            onClick={() => {
              setGameDone(false);
              setUserScore([]);
              setFeedback("Ready for another round!");
            }}
            className="py-3 px-6 rounded-2xl bg-white hover:bg-sangpa-100 text-sangpa-800 font-bold text-base border border-sangpa-300 shadow-xs flex items-center gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            <span>Play Again</span>
          </button>
        )}
      </div>
    </div>
  );
};
