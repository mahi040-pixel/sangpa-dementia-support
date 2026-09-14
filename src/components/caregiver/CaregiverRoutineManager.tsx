import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Plus, 
  Trash2, 
  Clock, 
  Pill, 
  Droplets, 
  Utensils, 
  Footprints, 
  Calendar, 
  CheckCircle, 
  AlertCircle,
  Volume2,
  WifiOff
} from 'lucide-react';
import { audio } from '../../utils/audio';
import { ReminderItem } from '../../types';

export const CaregiverRoutineManager: React.FC = () => {
  const { reminders, addReminder, deleteReminder } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [step, setStep] = useState(1);

  // New Reminder Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'medicine' | 'hydration' | 'meal' | 'exercise' | 'activity' | 'appointment'>('medicine');
  const [time, setTime] = useState('11:00 AM');
  const [dosage, setDosage] = useState('');
  const [instructions, setInstructions] = useState('');
  const [notifyCaregiver, setNotifyCaregiver] = useState(true);
  const [offlineReady, setOfflineReady] = useState(true);

  const handleOpenAddModal = () => {
    setTitle('');
    setCategory('medicine');
    setTime('11:00 AM');
    setDosage('');
    setInstructions('');
    setStep(1);
    setIsModalOpen(true);
  };

  const handleFinishAdd = () => {
    if (!title.trim()) return;

    addReminder({
      title,
      category,
      time,
      status: 'upcoming',
      dosage: dosage || undefined,
      instructions: instructions || 'Follow caregiver guidance.',
      audioText: `Kamala Dadi, it is time for ${title}.`,
      icon: category === 'medicine' ? 'Pill' : category === 'hydration' ? 'Droplets' : 'Clock',
      isOffline: offlineReady,
      notifyCaregiverIfMissed: notifyCaregiver,
      scheduledTime: time
    });

    audio.playSuccessJingle();
    setIsModalOpen(false);
  };

  return (
    <div className="flex-1 p-3.5 sm:p-6 lg:p-8 max-w-5xl mx-auto w-full space-y-4 sm:space-y-6 pb-24 md:pb-8 min-w-0">
      {/* Header */}
      <div className="border-b border-sangpa-200 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-sangpa-900 tracking-tight">
            Routine & Reminders Management
          </h2>
          <p className="text-xs sm:text-sm text-sangpa-600">
            Configure medicines, hydration, meals, exercise & routines — synced directly to the patient screen
          </p>
          <div className="flex items-center gap-2 mt-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-800 text-[11px] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Connected with Patient's Routine
            </span>
          </div>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="py-2.5 px-5 rounded-2xl bg-sangpa-500 hover:bg-sangpa-600 text-white font-bold text-sm shadow-md transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Routine / Reminder</span>
        </button>
      </div>

      {/* Reminders Timeline */}
      <div className="space-y-3">
        {reminders.map((rem) => (
          <div
            key={rem.id}
            className="bg-white border-2 border-sangpa-200 rounded-3xl p-4 sm:p-5 shadow-sm hover:border-sangpa-300 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
          >
            <div className="flex items-start sm:items-center gap-3.5">
              <div className="p-3 rounded-2xl bg-sangpa-100 text-sangpa-700 flex-shrink-0">
                {rem.category === 'medicine' ? <Pill className="w-6 h-6" /> :
                 rem.category === 'hydration' ? <Droplets className="w-6 h-6" /> :
                 <Clock className="w-6 h-6" />}
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-sangpa-200 text-sangpa-800">
                    {rem.time}
                  </span>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-sangpa-100 text-sangpa-700 capitalize">
                    {rem.category}
                  </span>
                  {rem.isOffline && (
                    <span className="text-[10px] text-sangpa-600 flex items-center gap-1">
                      <WifiOff className="w-3 h-3" /> Offline Ready
                    </span>
                  )}
                  {rem.notifyCaregiverIfMissed && (
                    <span className="text-[10px] text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded">
                      Alerts Riya if missed
                    </span>
                  )}
                </div>

                <h4 className="text-base font-bold text-sangpa-900 mt-1">
                  {rem.title}
                </h4>
                <p className="text-xs text-sangpa-600 mt-0.5">
                  {rem.dosage ? `Dosage: ${rem.dosage} • ` : ''}{rem.instructions}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto pt-2 sm:pt-0">
              <button
                onClick={() => {
                  audio.playGentleChime();
                  audio.speak(rem.audioText, 'en-IN');
                }}
                className="p-2 rounded-xl bg-sangpa-100 hover:bg-sangpa-200 text-sangpa-700"
                title="Preview Voice Announcement"
              >
                <Volume2 className="w-4 h-4" />
              </button>

              <button
                onClick={() => deleteReminder(rem.id)}
                className="p-2 rounded-xl hover:bg-rose-50 text-sangpa-400 hover:text-rose-600 transition-colors"
                title="Delete Reminder"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Step-by-Step Creation Wizard Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white border-2 border-sangpa-300 rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-sangpa-100 pb-3">
              <span className="text-xs font-bold text-sangpa-600 uppercase tracking-wide">
                Step {step} of 2 • Add Routine / Reminder (Live Synced with Patient)
              </span>
              <button onClick={() => setIsModalOpen(false)} className="text-xs text-sangpa-500 font-bold">
                Cancel
              </button>
            </div>

            {step === 1 ? (
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-sangpa-700 block mb-1">Reminder Category</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'medicine', label: 'Medicine' },
                      { id: 'hydration', label: 'Hydration' },
                      { id: 'meal', label: 'Meal / Snack' },
                      { id: 'exercise', label: 'Exercise' },
                      { id: 'appointment', label: 'Doctor Visit' },
                      { id: 'activity', label: 'Family Call' },
                    ].map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setCategory(c.id as any)}
                        className={`p-2.5 rounded-xl text-xs font-bold border transition-all ${
                          category === c.id
                            ? 'bg-sangpa-500 border-sangpa-600 text-white'
                            : 'bg-sangpa-50 border-sangpa-200 text-sangpa-800'
                        }`}
                      >
                        {c.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-sangpa-700 block mb-1">Reminder Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="e.g. Afternoon Turmeric Milk, Eye Drops..."
                    className="w-full p-2.5 rounded-xl border border-sangpa-300 text-sm text-sangpa-900 focus:border-sangpa-500 outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-sangpa-700 block mb-1">Scheduled Time</label>
                  <input
                    type="text"
                    value={time}
                    onChange={e => setTime(e.target.value)}
                    placeholder="e.g. 03:30 PM"
                    className="w-full p-2.5 rounded-xl border border-sangpa-300 text-sm font-semibold text-sangpa-900"
                  />
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => {
                      if (title.trim()) setStep(2);
                    }}
                    className="w-full py-3 rounded-2xl bg-sangpa-500 hover:bg-sangpa-600 text-white font-bold text-sm shadow-md"
                  >
                    Next: Instructions & Alerts
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-sangpa-700 block mb-1">Dosage / Details (Optional)</label>
                  <input
                    type="text"
                    value={dosage}
                    onChange={e => setDosage(e.target.value)}
                    placeholder="e.g. 1 yellow capsule, 1 full cup..."
                    className="w-full p-2.5 rounded-xl border border-sangpa-300 text-sm text-sangpa-900 outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-sangpa-700 block mb-1">Gentle Instruction (Read by Mascot)</label>
                  <textarea
                    rows={2}
                    value={instructions}
                    onChange={e => setInstructions(e.target.value)}
                    placeholder="e.g. Sip warm with breakfast. Sit comfortably in your armchair."
                    className="w-full p-2.5 rounded-xl border border-sangpa-300 text-sm text-sangpa-900 outline-none resize-none"
                  />
                </div>

                <div className="space-y-2 pt-1">
                  <label className="flex items-center gap-2 text-xs font-semibold text-sangpa-800">
                    <input
                      type="checkbox"
                      checked={notifyCaregiver}
                      onChange={e => setNotifyCaregiver(e.target.checked)}
                      className="w-4 h-4 rounded text-sangpa-600"
                    />
                    <span>Notify Caregiver Riya immediately if missed for 15 minutes</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs font-semibold text-sangpa-800">
                    <input
                      type="checkbox"
                      checked={offlineReady}
                      onChange={e => setOfflineReady(e.target.checked)}
                      className="w-4 h-4 rounded text-sangpa-600"
                    />
                    <span>Store locally on patient tablet for offline delivery</span>
                  </label>
                </div>

                <div className="pt-3 flex gap-2">
                  <button
                    onClick={() => setStep(1)}
                    className="py-3 px-4 rounded-2xl bg-white border border-sangpa-300 text-sangpa-800 font-bold text-sm"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleFinishAdd}
                    className="flex-1 py-3 px-4 rounded-2xl bg-sangpa-500 hover:bg-sangpa-600 text-white font-bold text-sm shadow-md"
                  >
                    Create Reminder
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
