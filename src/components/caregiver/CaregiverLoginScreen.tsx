import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Stethoscope, 
  HeartHandshake, 
  Heart, 
  ArrowLeft, 
  ChevronRight,
  Sprout,
  ShieldCheck,
  Building,
  BadgeAlert,
  Clock,
  Phone,
  Lock,
  UserCheck
} from 'lucide-react';
import { CaregiverRole } from '../../types';
import { audio } from '../../utils/audio';

type LoginView = 'roles' | 'doctor' | 'nurse' | 'family';

export const CaregiverLoginScreen: React.FC = () => {
  const { loginCaregiver, setRole } = useApp();
  const [view, setView] = useState<LoginView>('roles');

  // Doctor Form State
  const [doctorName, setDoctorName] = useState('Dr. Anita Verma, MD');
  const [doctorLicense, setDoctorLicense] = useState('MCI-2018-49210');
  const [doctorHospital, setDoctorHospital] = useState('Apollo Geriatrics & Memory Care');
  const [doctorPin, setDoctorPin] = useState('1234');

  // Nurse Form State
  const [nurseName, setNurseName] = useState('Nurse Priya Sharma, RN');
  const [nurseStaffId, setNurseStaffId] = useState('NUR-DL-5521');
  const [nurseShift, setNurseShift] = useState('Morning Shift (07:00 AM - 03:00 PM)');
  const [nurseAgency, setNurseAgency] = useState('HomeCare Health Services');
  const [nursePin, setNursePin] = useState('1234');

  // Family Form State
  const [familyName, setFamilyName] = useState('Rohan Sharma');
  const [familyRelation, setFamilyRelation] = useState('Son');
  const [familyPhone, setFamilyPhone] = useState('+91 98111-22334');
  const [familyPin, setFamilyPin] = useState('1234');

  const roleOptions: {
    role: CaregiverRole;
    title: string;
    icon: React.FC<{ className?: string }>;
    accentColor: string;
    summary: string;
  }[] = [
    {
      role: 'doctor',
      title: 'Doctor',
      icon: Stethoscope,
      accentColor: 'border-emerald-600 bg-emerald-50/70 text-emerald-900 ring-emerald-600/30',
      summary: 'Manage official diet plan, clinical details, review suggestions, and care team directory.'
    },
    {
      role: 'nurse',
      title: 'Nurse',
      icon: HeartHandshake,
      accentColor: 'border-blue-600 bg-blue-50/70 text-blue-900 ring-blue-600/30',
      summary: 'Daily care monitoring, meal and hydration logging, observations, and diet suggestions.'
    },
    {
      role: 'family',
      title: 'Family',
      icon: Heart,
      accentColor: 'border-amber-600 bg-amber-50/70 text-amber-900 ring-amber-600/30',
      summary: 'Add family memories, view diet schedule, suggest food preferences, and view daily progress.'
    }
  ];

  const handleSelectRole = (role: CaregiverRole) => {
    audio.playGentleChime();
    if (role === 'doctor') setView('doctor');
    else if (role === 'nurse') setView('nurse');
    else setView('family');
  };

  const handleDoctorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = doctorName.trim() || 'Dr. Anita Verma, MD';
    const finalTitle = `Geriatrician • ${doctorHospital.trim() || 'Apollo Geriatrics'}`;
    loginCaregiver('doctor', finalName, finalTitle);
  };

  const handleNurseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = nurseName.trim() || 'Nurse Priya Sharma, RN';
    const shortShift = nurseShift.includes('Morning') ? 'Morning' : nurseShift.includes('Evening') ? 'Evening' : 'Night';
    const finalTitle = `Home Care Nurse • ${shortShift} Shift`;
    loginCaregiver('nurse', finalName, finalTitle);
  };

  const handleFamilySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = familyName.trim() || 'Rohan Sharma';
    const finalTitle = `Family Member (${familyRelation})`;
    loginCaregiver('family', finalName, finalTitle);
  };

  return (
    <div className="flex-1 bg-[#FAF8F5] min-h-full flex flex-col justify-between p-4 sm:p-6 lg:p-8 select-none">
      <div className="max-w-md mx-auto w-full space-y-6">
        
        {/* ========================================================= */}
        {/* 1. ROLE SELECTION SCREEN: Doctor, Nurse, Family           */}
        {/* ========================================================= */}
        {view === 'roles' && (
          <div className="space-y-6">
            {/* Top Navigation */}
            <div>
              <button
                onClick={() => {
                  audio.playGentleChime();
                  setRole('opening');
                }}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-700 hover:text-stone-900 bg-white border border-[#E7E3D8] px-3.5 py-1.5 rounded-full shadow-2xs transition-all active:scale-95 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Home</span>
              </button>
            </div>

            {/* Clean Header */}
            <div className="text-center space-y-1.5">
              <div className="w-12 h-12 rounded-2xl bg-[#EAF2E6] border-2 border-[#D5DFC9] mx-auto flex items-center justify-center text-[#344E2E] shadow-2xs mb-2">
                <Sprout className="w-6 h-6 text-[#4E7037]" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#243B1D] tracking-tight">
                Caregiver Portal
              </h1>
              <p className="text-xs sm:text-sm text-stone-600 font-medium">
                Select your role to continue
              </p>
            </div>

            {/* 3 Main Role Options: Doctor, Nurse, Family */}
            <div className="space-y-3 pt-1">
              {roleOptions.map((opt) => {
                const Icon = opt.icon;

                return (
                  <div
                    key={opt.role}
                    onClick={() => handleSelectRole(opt.role)}
                    className="p-4 sm:p-5 rounded-3xl border-2 bg-white border-[#E7E3D8] hover:border-[#4E7037] hover:bg-stone-50/80 transition-all cursor-pointer shadow-xs active:scale-[0.99] group"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3.5 min-w-0">
                        <div className="w-11 h-11 rounded-2xl bg-white border border-[#E7E3D8] flex items-center justify-center flex-shrink-0 shadow-2xs mt-0.5 group-hover:border-[#4E7037] transition-colors">
                          <Icon className="w-6 h-6 text-[#344E2E]" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <h3 className="font-extrabold text-base text-stone-900 group-hover:text-[#243B1D]">
                            {opt.title}
                          </h3>
                          <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                            {opt.summary}
                          </p>
                        </div>
                      </div>

                      <div className="mt-1 flex-shrink-0">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectRole(opt.role);
                          }}
                          className="px-3.5 py-1.5 rounded-xl font-bold text-xs bg-[#344E2E] hover:bg-[#253920] text-white flex items-center gap-1 transition-all shadow-xs cursor-pointer active:scale-95"
                        >
                          <span>Login</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* 2. DOCTOR CUSTOMIZED LOGIN SCREEN                         */}
        {/* ========================================================= */}
        {view === 'doctor' && (
          <div className="space-y-5 animate-in fade-in zoom-in-95 duration-150">
            {/* Top Navigation */}
            <div>
              <button
                onClick={() => {
                  audio.playGentleChime();
                  setView('roles');
                }}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-700 hover:text-stone-900 bg-white border border-[#E7E3D8] px-3.5 py-1.5 rounded-full shadow-2xs transition-all active:scale-95 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Role Selection</span>
              </button>
            </div>

            {/* Doctor Header */}
            <div className="text-center space-y-1">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 border-2 border-purple-200 mx-auto flex items-center justify-center text-purple-800 shadow-2xs mb-2">
                <Stethoscope className="w-6 h-6" />
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-purple-950">
                Doctor Portal Login
              </h2>
              <p className="text-xs text-stone-600">
                Clinical attending & medical oversight credentials
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleDoctorSubmit} className="bg-white rounded-3xl p-5 border-2 border-purple-200 shadow-sm space-y-3.5">
              <div>
                <label className="text-xs font-extrabold text-stone-700 block mb-1">
                  Doctor Full Name:
                </label>
                <input
                  type="text"
                  required
                  value={doctorName}
                  onChange={(e) => setDoctorName(e.target.value)}
                  placeholder="e.g. Dr. Anita Verma, MD"
                  className="w-full text-xs font-semibold p-3 rounded-xl border border-stone-300 focus:border-purple-600 focus:ring-1 focus:ring-purple-600 outline-none bg-stone-50/50"
                />
              </div>

              <div>
                <label className="text-xs font-extrabold text-stone-700 block mb-1">
                  Medical Registration / License No:
                </label>
                <input
                  type="text"
                  required
                  value={doctorLicense}
                  onChange={(e) => setDoctorLicense(e.target.value)}
                  placeholder="e.g. MCI-2018-49210"
                  className="w-full text-xs font-semibold p-3 rounded-xl border border-stone-300 focus:border-purple-600 focus:ring-1 focus:ring-purple-600 outline-none bg-stone-50/50"
                />
              </div>

              <div>
                <label className="text-xs font-extrabold text-stone-700 block mb-1">
                  Hospital / Clinic Affiliation:
                </label>
                <input
                  type="text"
                  required
                  value={doctorHospital}
                  onChange={(e) => setDoctorHospital(e.target.value)}
                  placeholder="e.g. Apollo Geriatrics & Memory Care"
                  className="w-full text-xs font-semibold p-3 rounded-xl border border-stone-300 focus:border-purple-600 focus:ring-1 focus:ring-purple-600 outline-none bg-stone-50/50"
                />
              </div>

              <div>
                <label className="text-xs font-extrabold text-stone-700 block mb-1">
                  Clinical Access PIN / Passcode:
                </label>
                <input
                  type="password"
                  required
                  value={doctorPin}
                  onChange={(e) => setDoctorPin(e.target.value)}
                  placeholder="••••"
                  className="w-full text-xs font-semibold p-3 rounded-xl border border-stone-300 focus:border-purple-600 focus:ring-1 focus:ring-purple-600 outline-none bg-stone-50/50"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 px-4 rounded-2xl bg-purple-700 hover:bg-purple-800 text-white font-extrabold text-sm shadow-md transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Login as Doctor</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ========================================================= */}
        {/* 3. NURSE CUSTOMIZED LOGIN SCREEN                          */}
        {/* ========================================================= */}
        {view === 'nurse' && (
          <div className="space-y-5 animate-in fade-in zoom-in-95 duration-150">
            {/* Top Navigation */}
            <div>
              <button
                onClick={() => {
                  audio.playGentleChime();
                  setView('roles');
                }}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-700 hover:text-stone-900 bg-white border border-[#E7E3D8] px-3.5 py-1.5 rounded-full shadow-2xs transition-all active:scale-95 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Role Selection</span>
              </button>
            </div>

            {/* Nurse Header */}
            <div className="text-center space-y-1">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 border-2 border-blue-200 mx-auto flex items-center justify-center text-blue-800 shadow-2xs mb-2">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-blue-950">
                Nurse Portal Login
              </h2>
              <p className="text-xs text-stone-600">
                Daily care attendant & routine monitoring credentials
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleNurseSubmit} className="bg-white rounded-3xl p-5 border-2 border-blue-200 shadow-sm space-y-3.5">
              <div>
                <label className="text-xs font-extrabold text-stone-700 block mb-1">
                  Nurse Full Name:
                </label>
                <input
                  type="text"
                  required
                  value={nurseName}
                  onChange={(e) => setNurseName(e.target.value)}
                  placeholder="e.g. Nurse Priya Sharma, RN"
                  className="w-full text-xs font-semibold p-3 rounded-xl border border-stone-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none bg-stone-50/50"
                />
              </div>

              <div>
                <label className="text-xs font-extrabold text-stone-700 block mb-1">
                  Staff / Nursing Registration ID:
                </label>
                <input
                  type="text"
                  required
                  value={nurseStaffId}
                  onChange={(e) => setNurseStaffId(e.target.value)}
                  placeholder="e.g. NUR-DL-5521"
                  className="w-full text-xs font-semibold p-3 rounded-xl border border-stone-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none bg-stone-50/50"
                />
              </div>

              <div>
                <label className="text-xs font-extrabold text-stone-700 block mb-1">
                  Assigned Care Shift:
                </label>
                <select
                  value={nurseShift}
                  onChange={(e) => setNurseShift(e.target.value)}
                  className="w-full text-xs font-semibold p-3 rounded-xl border border-stone-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none bg-stone-50/50"
                >
                  <option value="Morning Shift (07:00 AM - 03:00 PM)">Morning Shift (07:00 AM - 03:00 PM)</option>
                  <option value="Evening Shift (03:00 PM - 11:00 PM)">Evening Shift (03:00 PM - 11:00 PM)</option>
                  <option value="Night Shift (11:00 PM - 07:00 AM)">Night Shift (11:00 PM - 07:00 AM)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-extrabold text-stone-700 block mb-1">
                  Nursing Agency / Hospital:
                </label>
                <input
                  type="text"
                  required
                  value={nurseAgency}
                  onChange={(e) => setNurseAgency(e.target.value)}
                  placeholder="e.g. HomeCare Health Services"
                  className="w-full text-xs font-semibold p-3 rounded-xl border border-stone-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none bg-stone-50/50"
                />
              </div>

              <div>
                <label className="text-xs font-extrabold text-stone-700 block mb-1">
                  Staff Access PIN / Passcode:
                </label>
                <input
                  type="password"
                  required
                  value={nursePin}
                  onChange={(e) => setNursePin(e.target.value)}
                  placeholder="••••"
                  className="w-full text-xs font-semibold p-3 rounded-xl border border-stone-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none bg-stone-50/50"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 px-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm shadow-md transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-2"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Login as Nurse</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ========================================================= */}
        {/* 4. FAMILY CUSTOMIZED LOGIN SCREEN                         */}
        {/* ========================================================= */}
        {view === 'family' && (
          <div className="space-y-5 animate-in fade-in zoom-in-95 duration-150">
            {/* Top Navigation */}
            <div>
              <button
                onClick={() => {
                  audio.playGentleChime();
                  setView('roles');
                }}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-700 hover:text-stone-900 bg-white border border-[#E7E3D8] px-3.5 py-1.5 rounded-full shadow-2xs transition-all active:scale-95 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Role Selection</span>
              </button>
            </div>

            {/* Family Header */}
            <div className="text-center space-y-1">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 border-2 border-amber-200 mx-auto flex items-center justify-center text-amber-800 shadow-2xs mb-2">
                <Heart className="w-6 h-6" />
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-amber-950">
                Family Circle Login
              </h2>
              <p className="text-xs text-stone-600">
                Loving home care & family liaison credentials
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleFamilySubmit} className="bg-white rounded-3xl p-5 border-2 border-amber-200 shadow-sm space-y-3.5">
              <div>
                <label className="text-xs font-extrabold text-stone-700 block mb-1">
                  Your Full Name:
                </label>
                <input
                  type="text"
                  required
                  value={familyName}
                  onChange={(e) => setFamilyName(e.target.value)}
                  placeholder="e.g. Rohan Sharma"
                  className="w-full text-xs font-semibold p-3 rounded-xl border border-stone-300 focus:border-amber-600 focus:ring-1 focus:ring-amber-600 outline-none bg-stone-50/50"
                />
              </div>

              <div>
                <label className="text-xs font-extrabold text-stone-700 block mb-1">
                  Relationship to Patient:
                </label>
                <select
                  value={familyRelation}
                  onChange={(e) => setFamilyRelation(e.target.value)}
                  className="w-full text-xs font-semibold p-3 rounded-xl border border-stone-300 focus:border-amber-600 focus:ring-1 focus:ring-amber-600 outline-none bg-stone-50/50"
                >
                  <option value="Son">Son</option>
                  <option value="Daughter">Daughter</option>
                  <option value="Spouse">Spouse / Partner</option>
                  <option value="Grandchild">Grandchild</option>
                  <option value="Brother">Brother</option>
                  <option value="Sister">Sister</option>
                  <option value="Primary Caregiver">Primary Family Caregiver</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-extrabold text-stone-700 block mb-1">
                  Phone / WhatsApp Number:
                </label>
                <input
                  type="text"
                  required
                  value={familyPhone}
                  onChange={(e) => setFamilyPhone(e.target.value)}
                  placeholder="e.g. +91 98111-22334"
                  className="w-full text-xs font-semibold p-3 rounded-xl border border-stone-300 focus:border-amber-600 focus:ring-1 focus:ring-amber-600 outline-none bg-stone-50/50"
                />
              </div>

              <div>
                <label className="text-xs font-extrabold text-stone-700 block mb-1">
                  Family Access PIN:
                </label>
                <input
                  type="password"
                  required
                  value={familyPin}
                  onChange={(e) => setFamilyPin(e.target.value)}
                  placeholder="••••"
                  className="w-full text-xs font-semibold p-3 rounded-xl border border-stone-300 focus:border-amber-600 focus:ring-1 focus:ring-amber-600 outline-none bg-stone-50/50"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 px-4 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-sm shadow-md transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-2"
                >
                  <Heart className="w-4 h-4" />
                  <span>Login as Family Member</span>
                </button>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};
