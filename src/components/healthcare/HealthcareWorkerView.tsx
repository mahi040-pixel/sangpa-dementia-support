import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Stethoscope, 
  UserCheck, 
  FileText, 
  Calendar, 
  ShieldCheck, 
  TrendingUp, 
  CheckCircle, 
  AlertCircle,
  Clock,
  Plus
} from 'lucide-react';
import { audio } from '../../utils/audio';

export const HealthcareWorkerView: React.FC = () => {
  const { patientProfile, reminders, games } = useApp();

  const [clinicalNotes, setClinicalNotes] = useState([
    {
      date: '10 Sept 2026',
      author: 'Dr. Anita Verma (Geriatrician)',
      note: 'MMSE score indicates stable MCI Stage 2. Blood pressure well controlled with Amlodipine 5mg. Patient is noticeably more responsive and cheerful when family flashcards are integrated into morning routine.'
    },
    {
      date: '06 Sept 2026',
      author: 'Preeti Das (Visiting Nurse)',
      note: 'Monitored seated stretching movements. Motor coordination in rhythm tapping is steady. Advised family to keep salt light in MIND-diet khichdi recipes.'
    }
  ]);

  const [newNote, setNewNote] = useState('');
  const [roleTier, setRoleTier] = useState<'doctor' | 'nurse' | 'social_worker'>('doctor');

  const handleAddNote = () => {
    if (!newNote.trim()) return;

    setClinicalNotes(prev => [
      {
        date: 'Today, 10:30 AM',
        author: roleTier === 'doctor' ? 'Dr. Anita Verma (Geriatrician)' : 'Preeti Das (Visiting Home Nurse)',
        note: newNote
      },
      ...prev
    ]);

    audio.playSuccessJingle();
    setNewNote('');
  };

  return (
    <div className="flex-1 p-3.5 sm:p-6 lg:p-8 max-w-5xl mx-auto w-full space-y-4 sm:space-y-6 pb-24 md:pb-8">
      {/* Header */}
      <div className="border-b border-sangpa-200 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-sangpa-900 tracking-tight flex items-center gap-2">
            <Stethoscope className="w-6 h-6 text-sangpa-600" />
            <span>Healthcare Worker Shared-Care Portal</span>
          </h2>
          <p className="text-xs sm:text-sm text-sangpa-600">
            Permission-scoped clinical observations, medication compliance logs & cognitive trends
          </p>
        </div>

        {/* Role Tier Switcher */}
        <div className="flex items-center gap-1.5 bg-white border border-sangpa-300 rounded-2xl p-1 text-xs font-bold text-sangpa-800">
          <span className="text-[10px] text-sangpa-500 uppercase px-1">Access Level:</span>
          <button
            onClick={() => setRoleTier('doctor')}
            className={`px-2.5 py-1 rounded-xl transition-colors ${roleTier === 'doctor' ? 'bg-sangpa-500 text-white' : 'hover:bg-sangpa-100'}`}
          >
            Physician
          </button>
          <button
            onClick={() => setRoleTier('nurse')}
            className={`px-2.5 py-1 rounded-xl transition-colors ${roleTier === 'nurse' ? 'bg-sangpa-500 text-white' : 'hover:bg-sangpa-100'}`}
          >
            Home Nurse
          </button>
        </div>
      </div>

      {/* Patient Summary Snapshot */}
      <div className="bg-white border-2 border-sangpa-200 rounded-3xl p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-sangpa-600 uppercase tracking-wide">Patient Medical Record</span>
          <h3 className="text-xl font-bold text-sangpa-900 mt-0.5">{patientProfile.name} (Age {patientProfile.age})</h3>
          <p className="text-xs text-sangpa-600">Primary Diagnosis: {patientProfile.condition}</p>
          <p className="text-xs text-sangpa-700 mt-1">Allergies: No known penicillin allergies • Blood Group: B Positive</p>
        </div>

        <div className="p-3 bg-sangpa-50 rounded-2xl border border-sangpa-200 text-xs space-y-1 sm:text-right">
          <p className="font-bold text-sangpa-900">7-Day Medication Adherence: 96%</p>
          <p className="text-emerald-700 font-semibold">Morning Blood Pressure: 124/82 mmHg</p>
          <p className="text-sangpa-600">Next Clinic Checkup: Friday 11:00 AM</p>
        </div>
      </div>

      {/* Clinical Notes & Observations */}
      <div className="bg-white border-2 border-sangpa-200 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
        <h3 className="text-base sm:text-lg font-bold text-sangpa-900 flex items-center gap-2">
          <FileText className="w-5 h-5 text-sangpa-600" />
          <span>Interdisciplinary Care Notes</span>
        </h3>

        {/* Add Note Input */}
        <div className="space-y-2">
          <textarea
            rows={2}
            value={newNote}
            onChange={e => setNewNote(e.target.value)}
            placeholder="Add doctor observation, vitals check, or cognitive engagement recommendation..."
            className="w-full p-3 rounded-2xl border border-sangpa-300 text-sm text-sangpa-900 focus:border-sangpa-500 outline-none resize-none"
          />
          <button
            onClick={handleAddNote}
            className="py-2 px-4 rounded-xl bg-sangpa-500 hover:bg-sangpa-600 text-white font-bold text-xs shadow-xs flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Post Clinical Care Note</span>
          </button>
        </div>

        {/* Existing Clinical Notes */}
        <div className="space-y-3 pt-2">
          {clinicalNotes.map((cn, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-sangpa-50/70 border border-sangpa-200 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-sangpa-900">{cn.author}</span>
                <span className="text-sangpa-600">{cn.date}</span>
              </div>
              <p className="text-xs sm:text-sm text-sangpa-800 leading-relaxed">
                {cn.note}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
