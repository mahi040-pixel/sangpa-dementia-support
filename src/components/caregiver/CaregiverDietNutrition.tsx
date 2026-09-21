import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Utensils,
  Coffee,
  Sun,
  Sunset,
  Moon,
  Droplets,
  Plus,
  CheckCircle2,
  Clock,
  AlertCircle,
  Sparkles,
  ArrowLeft,
  Edit3,
  X,
  Check,
  MessageSquare,
  ShieldCheck,
  HeartHandshake,
  UserCheck,
  FileText,
  Send
} from 'lucide-react';
import { audio } from '../../utils/audio';
import { DietMealItem, DietPlan, DietSuggestion } from '../../types';

export const CaregiverDietNutrition: React.FC = () => {
  const {
    caregiverRole,
    caregiverUser,
    dietPlan,
    dietSuggestions,
    updateDietPlan,
    updateMealStatus,
    incrementHydration,
    addDietSuggestion,
    reviewDietSuggestion,
    setCaregiverScreen,
    patientProfile,
    language
  } = useApp();

  const patientDisplayName = patientProfile?.preferredName || patientProfile?.name || 'Kamla Devi';

  // Modals state
  const [isSuggestModalOpen, setIsSuggestModalOpen] = useState(false);
  const [suggestionMealId, setSuggestionMealId] = useState<'breakfast' | 'lunch' | 'snack' | 'dinner'>('breakfast');
  const [suggestionText, setSuggestionText] = useState('');

  const [isEditPlanModalOpen, setIsEditPlanModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<DietPlan>(dietPlan);

  const [activeMealLogging, setActiveMealLogging] = useState<string | null>(null);
  const [nurseObservationInput, setNurseObservationInput] = useState('');

  // Modify suggestion modal for Doctor
  const [modifyingSuggestion, setModifyingSuggestion] = useState<DietSuggestion | null>(null);
  const [doctorModificationNote, setDoctorModificationNote] = useState('');

  const getMealIcon = (id: string) => {
    switch (id) {
      case 'breakfast': return <Coffee className="w-5 h-5 text-amber-600" />;
      case 'lunch': return <Sun className="w-5 h-5 text-emerald-600" />;
      case 'snack': return <Sunset className="w-5 h-5 text-orange-600" />;
      case 'dinner': return <Moon className="w-5 h-5 text-indigo-600" />;
      default: return <Utensils className="w-5 h-5 text-sangpa-600" />;
    }
  };

  const getStatusBadge = (status: DietMealItem['status']) => {
    switch (status) {
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Completed
          </span>
        );
      case 'partially_eaten':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
            <AlertCircle className="w-3 h-3 text-amber-600" />
            Partially Eaten
          </span>
        );
      case 'skipped':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200">
            <X className="w-3 h-3 text-rose-600" />
            Skipped
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700 border border-stone-200">
            <Clock className="w-3 h-3 text-stone-500" />
            Upcoming
          </span>
        );
    }
  };

  const handleOpenSuggestModal = (mealId?: 'breakfast' | 'lunch' | 'snack' | 'dinner') => {
    audio.playGentleChime();
    if (mealId) setSuggestionMealId(mealId);
    setSuggestionText('');
    setIsSuggestModalOpen(true);
  };

  const handleSubmitSuggestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!suggestionText.trim()) return;

    addDietSuggestion({
      submittedByRole: caregiverRole,
      submittedByName: caregiverUser.name,
      mealId: suggestionMealId,
      message: suggestionText.trim()
    });

    setIsSuggestModalOpen(false);
    setSuggestionText('');
  };

  const handleSavePlanEdit = (e: React.FormEvent) => {
    e.preventDefault();
    audio.playSuccessJingle();
    updateDietPlan({
      ...editingPlan,
      lastUpdated: 'Just now'
    });
    setIsEditPlanModalOpen(false);
  };

  const handleNurseLogMeal = (mealId: 'breakfast' | 'lunch' | 'snack' | 'dinner', status: DietMealItem['status']) => {
    audio.playGentleChime();
    updateMealStatus(mealId, status, nurseObservationInput.trim() || undefined);
    setActiveMealLogging(null);
    setNurseObservationInput('');
  };

  const pendingSuggestions = dietSuggestions.filter(s => s.status === 'pending');
  const pastSuggestions = dietSuggestions.filter(s => s.status !== 'pending');

  return (
    <div className="flex-1 p-3.5 sm:p-6 lg:p-8 max-w-5xl mx-auto w-full space-y-5 pb-24 md:pb-8 min-w-0">
      
      {/* 1. Header & Navigation */}
      <div className="border-b border-sangpa-200 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <button
            onClick={() => {
              audio.playGentleChime();
              setCaregiverScreen('overview');
            }}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#24421C] bg-[#DCE7D3] hover:bg-[#CAD8C6] px-3.5 py-1.5 rounded-full transition-all active:scale-95 cursor-pointer shadow-2xs mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Patient Summary</span>
          </button>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-black uppercase tracking-wider text-[#4E7037] block">
              Nutrition & Wellness Protocol
            </span>
            <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
              caregiverRole === 'doctor'
                ? 'bg-purple-100 text-purple-900 border-purple-200'
                : caregiverRole === 'nurse'
                ? 'bg-blue-100 text-blue-900 border-blue-200'
                : 'bg-emerald-100 text-emerald-900 border-emerald-200'
            }`}>
              {caregiverRole === 'doctor' ? '👨‍⚕️ Clinical Oversight' : caregiverRole === 'nurse' ? '👩‍⚕️ Daily Log & Care' : '🏡 Family View & Input'}
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-extrabold text-sangpa-900 tracking-tight flex items-center gap-2 mt-0.5">
            <Utensils className="w-6 h-6 text-sangpa-600" />
            <span>Diet & Nutrition for {patientDisplayName}</span>
          </h1>
          <p className="text-xs sm:text-sm text-sangpa-600 mt-0.5">
            MIND Diet Protocol for cognitive support, hydration tracking, and cross-caregiver dietary suggestions.
          </p>
        </div>

        {/* Action Buttons based on Role */}
        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          {caregiverRole === 'doctor' && (
            <button
              onClick={() => {
                audio.playGentleChime();
                setEditingPlan(dietPlan);
                setIsEditPlanModalOpen(true);
              }}
              className="py-2 px-3.5 rounded-2xl bg-[#24421C] hover:bg-[#1B3213] text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Official Diet Plan</span>
            </button>
          )}

          {(caregiverRole === 'nurse' || caregiverRole === 'family') && (
            <button
              onClick={() => handleOpenSuggestModal()}
              className="py-2 px-3.5 rounded-2xl bg-sangpa-600 hover:bg-sangpa-700 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Suggest a Diet Change</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. Top Summary: MIND Diet Protocol & Hydration Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Diet Guidelines Badge */}
        <div className="md:col-span-2 bg-white rounded-3xl p-4 sm:p-5 border border-sangpa-200 shadow-2xs space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <h3 className="text-sm font-bold text-sangpa-900">Current Diet Protocol</h3>
            </div>
            <span className="text-[11px] text-sangpa-600">Updated: {dietPlan.lastUpdated}</span>
          </div>

          <p className="text-xs sm:text-sm text-stone-700 font-medium leading-relaxed bg-[#F7FAF4] p-3 rounded-2xl border border-sangpa-100">
            {dietPlan.guidelines || 'MIND Diet Protocol: Neuroprotective antioxidant-rich meals, low sodium, high omega-3, soft textures for safe swallowing, and fixed hydration intervals.'}
          </p>

          <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px]">
            <span className="font-bold text-stone-500">Dietary Restrictions:</span>
            {(dietPlan.restrictions || ['Low Sodium', 'No Refined Sugar', 'Crushed Nuts Only']).map((res: string, i: number) => (
              <span key={i} className="px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-800 border border-rose-200 font-semibold">
                ⚠️ {res}
              </span>
            ))}
          </div>
        </div>

        {/* Hydration Tracker */}
        <div className="bg-gradient-to-br from-sky-50 to-blue-50/70 rounded-3xl p-4 sm:p-5 border border-sky-200 shadow-2xs flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sky-900">
              <Droplets className="w-4 h-4 text-sky-600" />
              <h3 className="text-sm font-black">Today’s Hydration</h3>
            </div>
            <span className="text-xs font-bold text-sky-800 bg-sky-100/80 px-2 py-0.5 rounded-full">
              {Math.round((dietPlan.hydrationCurrent / dietPlan.hydrationTarget) * 100)}%
            </span>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black text-sky-950">
                {dietPlan.hydrationCurrent} <span className="text-xs font-bold text-sky-700">/ {dietPlan.hydrationTarget} glasses</span>
              </span>
              <span className="text-[11px] text-sky-700 font-medium">({dietPlan.hydrationCurrent * 250} ml)</span>
            </div>

            {/* Glasses Visual */}
            <div className="flex items-center gap-1.5 pt-1">
              {Array.from({ length: dietPlan.hydrationTarget }).map((_, idx) => (
                <div
                  key={idx}
                  className={`flex-1 h-3 rounded-full transition-all ${
                    idx < dietPlan.hydrationCurrent ? 'bg-sky-500 shadow-2xs' : 'bg-sky-200'
                  }`}
                />
              ))}
            </div>
          </div>

          <button
            onClick={incrementHydration}
            className="w-full py-2 px-3 rounded-xl bg-sky-600 hover:bg-sky-700 active:scale-98 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Log 1 Glass Water (+250ml)</span>
          </button>
        </div>
      </div>

      {/* 3. DOCTOR ONLY: Pending Suggestions Approval Queue */}
      {caregiverRole === 'doctor' && (
        <div className="bg-purple-50/60 rounded-3xl p-4 sm:p-5 border-2 border-purple-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-purple-700" />
              <h2 className="text-base font-extrabold text-purple-950">
                Dietary Suggestions Pending Doctor Review ({pendingSuggestions.length})
              </h2>
            </div>
            <span className="text-xs font-bold text-purple-800 bg-purple-100 px-2.5 py-0.5 rounded-full border border-purple-200">
              Geriatrician Approval Authority
            </span>
          </div>
          <p className="text-xs text-purple-800">
            Suggestions submitted by Nurse Priya or Rohan (Family). Approving an item automatically incorporates it into {patientDisplayName}’s official active meal schedule.
          </p>

          {pendingSuggestions.length === 0 ? (
            <div className="bg-white/80 rounded-2xl p-4 text-center text-xs font-semibold text-purple-900 border border-purple-100">
              ✓ All dietary suggestions have been reviewed. No pending requests.
            </div>
          ) : (
            <div className="space-y-3">
              {pendingSuggestions.map(sug => (
                <div
                  key={sug.id}
                  className="bg-white rounded-2xl p-4 border border-purple-200 shadow-2xs space-y-2.5"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-purple-900">{sug.submittedByName}</span>
                      <span className="px-2 py-0.5 rounded-md bg-purple-100 text-purple-800 text-[10px] font-black uppercase">
                        {sug.submittedByRole}
                      </span>
                      <span className="text-stone-400">•</span>
                      <span className="capitalize font-semibold text-stone-700">Target: {sug.mealId}</span>
                    </div>
                    <span className="text-stone-500 text-[11px]">{sug.submittedAt}</span>
                  </div>

                  <p className="text-xs sm:text-sm text-stone-800 font-medium bg-[#FAF8F5] p-2.5 rounded-xl border border-stone-200">
                    "{sug.message}"
                  </p>

                  <div className="flex flex-wrap items-center justify-end gap-2 pt-1">
                    <button
                      onClick={() => {
                        reviewDietSuggestion(sug.id, 'approved', 'Approved by Dr. Anita Verma');
                      }}
                      className="py-1.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 shadow-2xs transition-all cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Approve & Add to Plan</span>
                    </button>

                    <button
                      onClick={() => {
                        setModifyingSuggestion(sug);
                        setDoctorModificationNote(sug.message);
                      }}
                      className="py-1.5 px-3 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-900 font-bold text-xs flex items-center gap-1 transition-all cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Modify</span>
                    </button>

                    <button
                      onClick={() => {
                        const reason = prompt('Please enter clinical rationale for rejection:', 'Clinically contraindicated / kept on current nutritional balance');
                        if (reason !== null) {
                          reviewDietSuggestion(sug.id, 'rejected', reason || 'Rejected by Doctor');
                        }
                      }}
                      className="py-1.5 px-3 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-800 font-bold text-xs flex items-center gap-1 transition-all cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 4. The 4 Structured Meal Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-black text-sangpa-900 flex items-center gap-2">
            <span>Today’s 4 Scheduled Meals</span>
            <span className="text-xs font-semibold text-sangpa-600">({dietPlan.meals.length} meals)</span>
          </h2>

          <span className="text-xs text-stone-500">
            {caregiverRole === 'nurse' ? 'Click meal status to record observations' : caregiverRole === 'doctor' ? 'Doctor approval active' : 'Prepared with care'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {dietPlan.meals.map(meal => {
            const isLoggingThis = activeMealLogging === meal.id;

            return (
              <div
                key={meal.id}
                className="bg-white rounded-3xl p-5 border border-sangpa-200 shadow-2xs space-y-3 flex flex-col justify-between hover:border-sangpa-300 transition-all"
              >
                <div>
                  {/* Top Meal Header */}
                  <div className="flex items-center justify-between pb-2 border-b border-sangpa-100">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-xl bg-[#F5F8F1] border border-sangpa-100">
                        {getMealIcon(meal.id)}
                      </div>
                      <div>
                        <h3 className="text-base font-extrabold text-sangpa-900">{meal.name}</h3>
                        <span className="text-xs font-bold text-sangpa-600 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {meal.time}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      {getStatusBadge(meal.status)}
                      {meal.loggedAt && (
                        <span className="text-[10px] text-stone-500 font-medium">at {meal.loggedAt}</span>
                      )}
                    </div>
                  </div>

                  {/* Meal Recommended Items */}
                  <div className="pt-3 space-y-1.5">
                    <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
                      Recommended Items:
                    </span>
                    <ul className="space-y-1">
                      {meal.items.map((it, idx) => (
                        <li key={idx} className="text-xs sm:text-sm text-stone-800 font-semibold flex items-start gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-sangpa-500 flex-shrink-0 mt-1.5" />
                          <span>{it}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Portion & Dietary Notes */}
                  <div className="pt-2 space-y-1">
                    <p className="text-xs text-stone-600">
                      <strong className="text-stone-800 font-bold">Portion:</strong> {meal.portion}
                    </p>
                    <p className="text-xs text-stone-600 italic bg-[#FAF8F5] p-2 rounded-xl border border-stone-100">
                      💡 {meal.notes}
                    </p>
                  </div>

                  {/* Nurse Observation if recorded */}
                  {meal.nurseObservation && (
                    <div className="mt-2.5 p-2.5 rounded-xl bg-blue-50/70 border border-blue-200 text-xs text-blue-900">
                      <div className="flex items-center gap-1 font-bold text-[11px] text-blue-950">
                        <UserCheck className="w-3.5 h-3.5 text-blue-700" />
                        <span>Nurse Observation:</span>
                      </div>
                      <p className="mt-0.5 text-blue-800">{meal.nurseObservation}</p>
                    </div>
                  )}
                </div>

                {/* Interactive Controls per Role */}
                <div className="pt-3 border-t border-sangpa-100 flex flex-col gap-2">
                  {/* Nurse Controls: Log Completion & Observation */}
                  {caregiverRole === 'nurse' && (
                    <>
                      {!isLoggingThis ? (
                        <div className="flex items-center justify-between gap-2">
                          <button
                            onClick={() => {
                              setActiveMealLogging(meal.id);
                              setNurseObservationInput(meal.nurseObservation || '');
                            }}
                            className="py-1.5 px-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-800 font-bold text-xs flex items-center gap-1 border border-blue-200 transition-all cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Log Intake / Observation</span>
                          </button>

                          <button
                            onClick={() => handleOpenSuggestModal(meal.id as any)}
                            className="text-xs font-bold text-sangpa-700 hover:text-sangpa-900 transition-all underline cursor-pointer"
                          >
                            Suggest change
                          </button>
                        </div>
                      ) : (
                        <div className="bg-blue-50/90 rounded-2xl p-3 border border-blue-200 space-y-2.5">
                          <span className="text-xs font-bold text-blue-950 block">Record Intake for {meal.name}:</span>
                          
                          {/* Status Options */}
                          <div className="grid grid-cols-3 gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleNurseLogMeal(meal.id as any, 'completed')}
                              className="py-1.5 px-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1 cursor-pointer"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Completed</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleNurseLogMeal(meal.id as any, 'partially_eaten')}
                              className="py-1.5 px-1 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center justify-center gap-1 cursor-pointer"
                            >
                              <AlertCircle className="w-3.5 h-3.5" />
                              <span>Partial</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleNurseLogMeal(meal.id as any, 'skipped')}
                              className="py-1.5 px-1 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs flex items-center justify-center gap-1 cursor-pointer"
                            >
                              <X className="w-3.5 h-3.5" />
                              <span>Skipped</span>
                            </button>
                          </div>

                          {/* Quick note input */}
                          <input
                            type="text"
                            value={nurseObservationInput}
                            onChange={(e) => setNurseObservationInput(e.target.value)}
                            placeholder="Optional note: e.g. Ate 70%, drank 1 glass water..."
                            className="w-full text-xs p-2 rounded-xl border border-blue-200 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />

                          <div className="flex justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => setActiveMealLogging(null)}
                              className="py-1 px-2.5 rounded-lg text-stone-600 text-xs font-semibold hover:bg-stone-200 cursor-pointer"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {/* Family Controls: Suggest Preference */}
                  {caregiverRole === 'family' && (
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-stone-500">
                        {meal.status === 'completed' ? '✓ Finished today' : 'Scheduled as per Doctor'}
                      </span>
                      <button
                        onClick={() => handleOpenSuggestModal(meal.id as any)}
                        className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-2.5 py-1 rounded-xl transition-all cursor-pointer"
                      >
                        <HeartHandshake className="w-3.5 h-3.5" />
                        <span>Suggest Grandma's Preference</span>
                      </button>
                    </div>
                  )}

                  {/* Doctor Controls */}
                  {caregiverRole === 'doctor' && (
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-stone-500 font-medium">Approved clinical guideline</span>
                      <button
                        onClick={() => {
                          setEditingPlan(dietPlan);
                          setIsEditPlanModalOpen(true);
                        }}
                        className="font-bold text-purple-800 hover:text-purple-950 underline cursor-pointer"
                      >
                        Edit meal
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. Family & Nurse Suggestion History Tracker */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-sangpa-200 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-sangpa-600" />
            <h3 className="text-sm font-bold text-sangpa-900">
              Dietary Suggestions & Preference Log ({dietSuggestions.length})
            </h3>
          </div>
          <button
            onClick={() => handleOpenSuggestModal()}
            className="text-xs font-bold text-sangpa-700 hover:text-sangpa-900 underline cursor-pointer"
          >
            + Add Suggestion
          </button>
        </div>

        {dietSuggestions.length === 0 ? (
          <p className="text-xs text-stone-500">No suggestions submitted yet.</p>
        ) : (
          <div className="divide-y divide-sangpa-100">
            {dietSuggestions.map(sug => (
              <div key={sug.id} className="py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sangpa-900">{sug.message}</span>
                    <span className="capitalize text-[10px] font-bold px-2 py-0.5 rounded bg-stone-100 text-stone-700">
                      {sug.mealId}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-stone-500 text-[11px]">
                    <span>By {sug.submittedByName} ({sug.submittedByRole})</span>
                    <span>•</span>
                    <span>{sug.submittedAt}</span>
                    {sug.doctorResponse && (
                      <>
                        <span>•</span>
                        <span className="text-purple-800 font-semibold">Doctor Note: "{sug.doctorResponse}"</span>
                      </>
                    )}
                  </div>
                </div>

                <div>
                  {sug.status === 'pending' && (
                    <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 font-bold text-[11px] inline-flex items-center gap-1">
                      <Clock className="w-3 h-3 text-amber-600" />
                      Pending Review
                    </span>
                  )}
                  {sug.status === 'approved' && (
                    <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold text-[11px] inline-flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      Approved & Added
                    </span>
                  )}
                  {sug.status === 'modified' && (
                    <span className="px-2.5 py-1 rounded-full bg-purple-100 text-purple-900 border border-purple-300 font-bold text-[11px] inline-flex items-center gap-1">
                      <Edit3 className="w-3 h-3 text-purple-600" />
                      Modified by Doctor
                    </span>
                  )}
                  {sug.status === 'rejected' && (
                    <span className="px-2.5 py-1 rounded-full bg-rose-100 text-rose-900 border border-rose-300 font-bold text-[11px] inline-flex items-center gap-1">
                      <X className="w-3 h-3 text-rose-600" />
                      Declined
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL 1: Suggest a Change (For Nurse & Family) */}
      {isSuggestModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-sangpa-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-sangpa-100 pb-3">
              <div className="flex items-center gap-2">
                <HeartHandshake className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-extrabold text-sangpa-900">
                  Suggest Diet Change to Doctor
                </h3>
              </div>
              <button
                onClick={() => setIsSuggestModalOpen(false)}
                className="p-1 rounded-full hover:bg-stone-100 text-stone-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitSuggestion} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  Target Meal:
                </label>
                <select
                  value={suggestionMealId}
                  onChange={(e) => setSuggestionMealId(e.target.value as any)}
                  className="w-full text-xs font-semibold p-2.5 rounded-xl border border-sangpa-200 bg-white"
                >
                  <option value="breakfast">Breakfast (08:30 AM)</option>
                  <option value="lunch">Lunch (01:00 PM)</option>
                  <option value="snack">Evening Snack (04:30 PM)</option>
                  <option value="dinner">Dinner (08:00 PM)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  Your Suggestion / Food Preference:
                </label>
                <textarea
                  required
                  rows={3}
                  value={suggestionText}
                  onChange={(e) => setSuggestionText(e.target.value)}
                  placeholder="e.g. Grandma prefers soft sliced banana with morning oats instead of crushed walnuts..."
                  className="w-full text-xs p-3 rounded-xl border border-sangpa-200 bg-white focus:ring-2 focus:ring-sangpa-500 focus:outline-none"
                />
                <span className="text-[11px] text-stone-500">
                  Submitting as: <strong className="text-sangpa-900">{caregiverUser.name}</strong> ({caregiverRole})
                </span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-sangpa-100">
                <button
                  type="button"
                  onClick={() => setIsSuggestModalOpen(false)}
                  className="py-2 px-4 rounded-xl text-stone-600 text-xs font-bold hover:bg-stone-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2 px-4 rounded-xl bg-sangpa-600 hover:bg-sangpa-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send to Dr. Anita Verma</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Modify Suggestion (For Doctor) */}
      {modifyingSuggestion && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-purple-200 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="text-base font-extrabold text-purple-950">
                Modify & Approve Dietary Suggestion
              </h3>
              <button
                onClick={() => setModifyingSuggestion(null)}
                className="p-1 rounded-full hover:bg-stone-100 text-stone-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-stone-600">
              Original request by <strong>{modifyingSuggestion.submittedByName}</strong>: "{modifyingSuggestion.message}"
            </p>

            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">
                Doctor Adjusted Note / Item to Incorporate:
              </label>
              <textarea
                rows={3}
                value={doctorModificationNote}
                onChange={(e) => setDoctorModificationNote(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-purple-200 bg-white"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setModifyingSuggestion(null)}
                className="py-2 px-3 rounded-xl text-stone-600 text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  reviewDietSuggestion(
                    modifyingSuggestion.id,
                    'modified',
                    'Modified & approved with clinical adjustment',
                    doctorModificationNote
                  );
                  setModifyingSuggestion(null);
                }}
                className="py-2 px-4 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Save & Incorporate Modification</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Edit Official Diet Plan (For Doctor) */}
      {isEditPlanModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-5 sm:p-6 shadow-2xl border border-sangpa-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-sangpa-100 pb-3">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-purple-700" />
                <h3 className="text-base font-extrabold text-purple-950">
                  Edit Official MIND Diet Plan
                </h3>
              </div>
              <button
                onClick={() => setIsEditPlanModalOpen(false)}
                className="p-1 rounded-full hover:bg-stone-100 text-stone-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePlanEdit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  Overall Clinical Guidelines:
                </label>
                <textarea
                  rows={2}
                  value={editingPlan.guidelines || ''}
                  onChange={(e) => setEditingPlan({ ...editingPlan, guidelines: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-sangpa-200 bg-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  Daily Hydration Target (glasses):
                </label>
                <input
                  type="number"
                  min={4}
                  max={12}
                  value={editingPlan.hydrationTarget}
                  onChange={(e) => setEditingPlan({ ...editingPlan, hydrationTarget: Number(e.target.value) || 6 })}
                  className="w-32 text-xs font-bold p-2 rounded-xl border border-sangpa-200 bg-white"
                />
              </div>

              {/* Edit Each Meal */}
              <div className="space-y-3">
                <span className="text-xs font-black text-stone-700 uppercase">Meal Details:</span>
                {editingPlan.meals.map((m, idx) => (
                  <div key={m.id} className="p-3 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-xs text-sangpa-900">{m.name}</span>
                      <input
                        type="text"
                        value={m.time}
                        onChange={(e) => {
                          const updated = [...editingPlan.meals];
                          updated[idx].time = e.target.value;
                          setEditingPlan({ ...editingPlan, meals: updated });
                        }}
                        className="text-xs font-semibold p-1 rounded-lg border border-stone-300 w-28 bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-stone-600 block">Food Items (comma separated):</label>
                      <input
                        type="text"
                        value={m.items.join(', ')}
                        onChange={(e) => {
                          const updated = [...editingPlan.meals];
                          updated[idx].items = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                          setEditingPlan({ ...editingPlan, meals: updated });
                        }}
                        className="w-full text-xs p-1.5 rounded-lg border border-stone-300 bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-stone-600 block">Portion & Clinical Notes:</label>
                      <input
                        type="text"
                        value={m.notes}
                        onChange={(e) => {
                          const updated = [...editingPlan.meals];
                          updated[idx].notes = e.target.value;
                          setEditingPlan({ ...editingPlan, meals: updated });
                        }}
                        className="w-full text-xs p-1.5 rounded-lg border border-stone-300 bg-white"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-sangpa-100">
                <button
                  type="button"
                  onClick={() => setIsEditPlanModalOpen(false)}
                  className="py-2 px-4 rounded-xl text-stone-600 text-xs font-bold hover:bg-stone-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2 px-5 rounded-xl bg-[#24421C] hover:bg-[#1B3213] text-white font-bold text-xs flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Save Diet Plan</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
