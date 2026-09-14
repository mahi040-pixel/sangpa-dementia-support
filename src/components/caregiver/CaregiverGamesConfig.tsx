import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Gamepad2, 
  Sliders, 
  Check, 
  Save, 
  Sparkles, 
  ShieldCheck, 
  Star, 
  RotateCcw,
  Dices,
  Volume2,
  Eye,
  CheckSquare,
  Square
} from 'lucide-react';
import { audio } from '../../utils/audio';
import { DiceMathDifficulty, DiceMathActivityType, DiceMathConfig } from '../../types';

export const CaregiverGamesConfig: React.FC = () => {
  const { games, setCaregiverScreen } = useApp();

  const [saved, setSaved] = useState(false);
  const [seqLength, setSeqLength] = useState(3);
  const [rhythmSpeed, setRhythmSpeed] = useState('gentle');
  const [hintTolerance, setHintTolerance] = useState('immediate');
  const [maxTimePerTurn, setMaxTimePerTurn] = useState(45); // seconds

  // Dice Math Journey Settings
  const [diceDifficulty, setDiceDifficulty] = useState<DiceMathDifficulty>(() => {
    try {
      const stored = localStorage.getItem('sangpa_dice_math_config');
      if (stored) return JSON.parse(stored).startingDifficulty || 1;
    } catch (e) {}
    return 1;
  });
  const [diceVisualSupport, setDiceVisualSupport] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem('sangpa_dice_math_config');
      if (stored) return JSON.parse(stored).visualSupport ?? true;
    } catch (e) {}
    return true;
  });
  const [diceVoiceEnabled, setDiceVoiceEnabled] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem('sangpa_dice_math_config');
      if (stored) return JSON.parse(stored).voiceInstructions ?? true;
    } catch (e) {}
    return true;
  });
  const [diceSessionLength, setDiceSessionLength] = useState<number>(() => {
    try {
      const stored = localStorage.getItem('sangpa_dice_math_config');
      if (stored) return JSON.parse(stored).sessionLength || 5;
    } catch (e) {}
    return 5;
  });
  const [diceAllowedActivities, setDiceAllowedActivities] = useState<DiceMathActivityType[]>(() => {
    try {
      const stored = localStorage.getItem('sangpa_dice_math_config');
      if (stored && JSON.parse(stored).allowedActivities) return JSON.parse(stored).allowedActivities;
    } catch (e) {}
    return ['counting_dots', 'adding_numbers', 'subtracting_objects', 'choosing_bigger', 'number_sequences', 'shopping_food'];
  });

  const toggleActivity = (act: DiceMathActivityType) => {
    if (diceAllowedActivities.includes(act)) {
      if (diceAllowedActivities.length > 1) {
        setDiceAllowedActivities(diceAllowedActivities.filter(a => a !== act));
      }
    } else {
      setDiceAllowedActivities([...diceAllowedActivities, act]);
    }
  };

  const handleSave = () => {
    audio.playSuccessJingle();
    try {
      const config: DiceMathConfig = {
        startingDifficulty: diceDifficulty,
        visualSupport: diceVisualSupport,
        voiceInstructions: diceVoiceEnabled,
        sessionLength: diceSessionLength,
        allowedActivities: diceAllowedActivities
      };
      localStorage.setItem('sangpa_dice_math_config', JSON.stringify(config));
    } catch (e) {
      console.error('Error saving dice math config', e);
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="flex-1 p-3.5 sm:p-6 lg:p-8 max-w-5xl mx-auto w-full space-y-4 sm:space-y-6 pb-24 md:pb-8">
      {/* Header */}
      <div className="border-b border-sangpa-200 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-sangpa-900 tracking-tight">
            Cognitive Games & Adaptive Difficulty
          </h2>
          <p className="text-xs sm:text-sm text-sangpa-600">
            Tune algorithmic challenge scaling, hint frequency & comfort levels
          </p>
        </div>

        <button
          onClick={handleSave}
          className="py-2.5 px-6 rounded-2xl bg-sangpa-500 hover:bg-sangpa-600 text-white font-bold text-sm shadow-md transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <Save className="w-4 h-4" />
          <span>{saved ? "Settings Saved!" : "Save Configuration"}</span>
        </button>
      </div>

      {saved && (
        <div className="p-3 bg-emerald-100 border border-emerald-300 rounded-2xl text-emerald-900 text-xs sm:text-sm font-bold flex items-center gap-2">
          <Check className="w-5 h-5 text-emerald-700" />
          <span>Adaptive difficulty profile updated. SANGPA will apply these thresholds to Kamala Dadi's games.</span>
        </div>
      )}

      {/* Adaptive Scaling Principles Banner */}
      <div className="bg-sangpa-100/70 border border-sangpa-200 rounded-3xl p-5 flex items-start gap-4">
        <div className="p-3 rounded-2xl bg-white text-sangpa-700 shadow-2xs flex-shrink-0">
          <Sparkles className="w-6 h-6 text-sangpa-600" />
        </div>
        <div>
          <h4 className="text-base font-bold text-sangpa-900">
            Core SANGPA Principle: Non-Judgmental Reinforcement
          </h4>
          <p className="text-xs sm:text-sm text-sangpa-700 mt-1 leading-relaxed">
            The platform never displays words like "Failed" or "Wrong". When Kamala Dadi encounters difficulty, the system automatically shortens sequences, offers pleasant visual hints, and praises effort.
          </p>
        </div>
      </div>

      {/* Controls Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Sequence Length Control */}
        <div className="bg-white border-2 border-sangpa-200 rounded-3xl p-5 shadow-sm space-y-3">
          <label className="text-sm font-bold text-sangpa-900 block">
            Starting Sequence Recall Length
          </label>
          <p className="text-xs text-sangpa-600">
            Number of cultural symbols shown before requiring reproduction.
          </p>
          <div className="flex gap-2">
            {[2, 3, 4].map((len) => (
              <button
                key={len}
                onClick={() => setSeqLength(len)}
                className={`flex-1 py-3 rounded-2xl font-bold text-sm border-2 transition-all ${
                  seqLength === len
                    ? 'bg-sangpa-500 border-sangpa-600 text-white shadow-xs'
                    : 'bg-sangpa-50 border-sangpa-200 text-sangpa-800 hover:bg-sangpa-100'
                }`}
              >
                {len} Symbols {len === 3 ? '(Current)' : ''}
              </button>
            ))}
          </div>
        </div>

        {/* Rhythm Tapping Speed */}
        <div className="bg-white border-2 border-sangpa-200 rounded-3xl p-5 shadow-sm space-y-3">
          <label className="text-sm font-bold text-sangpa-900 block">
            Rhythm Tapping Metronome Speed
          </label>
          <p className="text-xs text-sangpa-600">
            Pacing for the slow drum taps: Tap, Tap, Pause, Tap.
          </p>
          <div className="flex gap-2">
            {[
              { id: 'gentle', label: 'Very Gentle (800ms)' },
              { id: 'moderate', label: 'Standard (600ms)' },
            ].map((spd) => (
              <button
                key={spd.id}
                onClick={() => setRhythmSpeed(spd.id)}
                className={`flex-1 py-3 rounded-2xl font-bold text-xs sm:text-sm border-2 transition-all ${
                  rhythmSpeed === spd.id
                    ? 'bg-sangpa-500 border-sangpa-600 text-white shadow-xs'
                    : 'bg-sangpa-50 border-sangpa-200 text-sangpa-800 hover:bg-sangpa-100'
                }`}
              >
                {spd.label}
              </button>
            ))}
          </div>
        </div>

        {/* Hint Tolerance */}
        <div className="bg-white border-2 border-sangpa-200 rounded-3xl p-5 shadow-sm space-y-3">
          <label className="text-sm font-bold text-sangpa-900 block">
            Friendly Hint Availability
          </label>
          <p className="text-xs text-sangpa-600">
            Controls how proactively the mascot offers assistance.
          </p>
          <div className="flex gap-2">
            {[
              { id: 'immediate', label: 'Always Visible (Encouraging)' },
              { id: 'after_attempt', label: 'Offer after 1 attempt' },
            ].map((h) => (
              <button
                key={h.id}
                onClick={() => setHintTolerance(h.id)}
                className={`flex-1 py-3 px-2 rounded-2xl font-bold text-xs border-2 transition-all ${
                  hintTolerance === h.id
                    ? 'bg-sangpa-500 border-sangpa-600 text-white shadow-xs'
                    : 'bg-sangpa-50 border-sangpa-200 text-sangpa-800 hover:bg-sangpa-100'
                }`}
              >
                {h.label}
              </button>
            ))}
          </div>
        </div>

        {/* Physical Movement Mode */}
        <div className="bg-white border-2 border-sangpa-200 rounded-3xl p-5 shadow-sm space-y-3">
          <label className="text-sm font-bold text-sangpa-900 block">
            Physical Dice Games Safeguard
          </label>
          <p className="text-xs text-sangpa-600">
            Ensure physical clapping and shoulder movements are always accompanied.
          </p>
          <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 flex items-center justify-between text-xs text-amber-900">
            <span>Mandatory Caregiver Present Warning</span>
            <span className="font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">Enforced</span>
          </div>
        </div>

        {/* Dice Math Journey Dedicated Config Card */}
        <div className="md:col-span-2 bg-white border-2 border-sangpa-300 rounded-3xl p-5 sm:p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-sangpa-100 pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-amber-100 text-amber-800">
                <Dices className="w-6 h-6 text-amber-700" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-sangpa-900">
                  Dice Math Journey Adaptive Settings
                </h3>
                <p className="text-xs text-sangpa-600">
                  Configure elderly-friendly math activities, visual helpers, and session lengths
                </p>
              </div>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
              Active Game
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Starting Difficulty */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-sangpa-900 block uppercase tracking-wider">
                Starting Challenge Level
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { lvl: 1, label: 'Level 1: 1-5', desc: 'Single die & simple counting' },
                  { lvl: 2, label: 'Level 2: 1-10', desc: '2 dice addition & compare' },
                  { lvl: 3, label: 'Level 3: Everyday', desc: 'Shop & sequences' },
                ].map((item) => (
                  <button
                    key={item.lvl}
                    onClick={() => setDiceDifficulty(item.lvl as DiceMathDifficulty)}
                    className={`p-3 rounded-2xl border-2 text-left transition-all ${
                      diceDifficulty === item.lvl
                        ? 'bg-sangpa-500 border-sangpa-600 text-white shadow-xs'
                        : 'bg-sangpa-50 border-sangpa-200 text-sangpa-800 hover:bg-sangpa-100'
                    }`}
                  >
                    <p className="text-xs font-black">{item.label}</p>
                    <p className={`text-[10px] mt-0.5 ${diceDifficulty === item.lvl ? 'text-sangpa-100' : 'text-stone-500'}`}>
                      {item.desc}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Session Length */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-sangpa-900 block uppercase tracking-wider">
                Session Length (Questions per round)
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[3, 5, 8, 10].map((len) => (
                  <button
                    key={len}
                    onClick={() => setDiceSessionLength(len)}
                    className={`py-3 rounded-2xl border-2 text-center text-xs font-black transition-all ${
                      diceSessionLength === len
                        ? 'bg-sangpa-500 border-sangpa-600 text-white shadow-xs'
                        : 'bg-sangpa-50 border-sangpa-200 text-sangpa-800 hover:bg-sangpa-100'
                    }`}
                  >
                    {len} Questions
                  </button>
                ))}
              </div>
            </div>

            {/* Visual Support & Voice Toggle */}
            <div className="space-y-2 md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <button
                onClick={() => setDiceVisualSupport(!diceVisualSupport)}
                className={`p-3.5 rounded-2xl border-2 flex items-center justify-between transition-all text-left ${
                  diceVisualSupport
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                    : 'bg-stone-50 border-stone-200 text-stone-700'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Eye className="w-5 h-5 text-emerald-700" />
                  <div>
                    <p className="text-xs font-bold">Visual Dot & Fruit Counters</p>
                    <p className="text-[10px] text-stone-500">Show numbered badges and cultural fruit emojis</p>
                  </div>
                </div>
                <span className={`text-xs font-black px-2.5 py-1 rounded-full ${diceVisualSupport ? 'bg-emerald-600 text-white' : 'bg-stone-200 text-stone-700'}`}>
                  {diceVisualSupport ? 'Enabled' : 'Disabled'}
                </span>
              </button>

              <button
                onClick={() => setDiceVoiceEnabled(!diceVoiceEnabled)}
                className={`p-3.5 rounded-2xl border-2 flex items-center justify-between transition-all text-left ${
                  diceVoiceEnabled
                    ? 'bg-purple-50 border-purple-300 text-purple-950'
                    : 'bg-stone-50 border-stone-200 text-stone-700'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Volume2 className="w-5 h-5 text-purple-700" />
                  <div>
                    <p className="text-xs font-bold">Mascot Voice Narration</p>
                    <p className="text-[10px] text-stone-500">SANGPA speaks every question and hint aloud</p>
                  </div>
                </div>
                <span className={`text-xs font-black px-2.5 py-1 rounded-full ${diceVoiceEnabled ? 'bg-purple-600 text-white' : 'bg-stone-200 text-stone-700'}`}>
                  {diceVoiceEnabled ? 'Enabled' : 'Disabled'}
                </span>
              </button>
            </div>

            {/* Allowed Activities */}
            <div className="space-y-2 md:col-span-2 pt-1">
              <label className="text-xs font-bold text-sangpa-900 block uppercase tracking-wider">
                Active Math Activity Types
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { id: 'counting_dots', label: '1. Counting Dots (1-5)' },
                  { id: 'adding_numbers', label: '2. Adding Numbers (+)' },
                  { id: 'subtracting_objects', label: '3. Subtracting Objects (-)' },
                  { id: 'choosing_bigger', label: '4. Choosing Bigger Number' },
                  { id: 'number_sequences', label: '5. Number Sequences (1,2,?)' },
                  { id: 'shopping_food', label: '6. Chai & Sweet Math (₹)' },
                ].map((act) => {
                  const isActive = diceAllowedActivities.includes(act.id as DiceMathActivityType);
                  return (
                    <button
                      key={act.id}
                      onClick={() => toggleActivity(act.id as DiceMathActivityType)}
                      className={`p-2.5 rounded-2xl border text-xs font-bold flex items-center gap-2 text-left transition-all ${
                        isActive
                          ? 'bg-sangpa-50 border-sangpa-400 text-sangpa-900 shadow-2xs'
                          : 'bg-stone-50 border-stone-200 text-stone-500 opacity-60'
                      }`}
                    >
                      {isActive ? (
                        <CheckSquare className="w-4 h-4 text-sangpa-700 flex-shrink-0" />
                      ) : (
                        <Square className="w-4 h-4 text-stone-400 flex-shrink-0" />
                      )}
                      <span className="truncate">{act.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
