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
  Clock,
  Phone,
  Lock,
  UserCheck,
  UserPlus,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Mail
} from 'lucide-react';
import { CaregiverRole } from '../../types';
import { audio } from '../../utils/audio';

type LoginView = 
  | 'roles' 
  | 'doctor' 
  | 'nurse' 
  | 'family' 
  | 'doctor_signup' 
  | 'nurse_signup' 
  | 'family_signup';

interface RegisteredAccount {
  role: CaregiverRole;
  name: string;
  email: string;
  title: string;
  createdAt: string;
  details?: Record<string, string>;
}

export const CaregiverLoginScreen: React.FC = () => {
  const { loginCaregiver, setRole } = useApp();
  const [view, setView] = useState<LoginView>('roles');

  // Doctor Login Form State
  const [doctorName, setDoctorName] = useState('Dr. Anita Verma, MD');
  const [doctorLicense, setDoctorLicense] = useState('MCI-2018-49210');
  const [doctorHospital, setDoctorHospital] = useState('Apollo Geriatrics & Memory Care');
  const [doctorPin, setDoctorPin] = useState('1234');

  // Nurse Login Form State
  const [nurseName, setNurseName] = useState('Nurse Priya Sharma, RN');
  const [nurseStaffId, setNurseStaffId] = useState('NUR-DL-5521');
  const [nurseShift, setNurseShift] = useState('Morning Shift (07:00 AM - 03:00 PM)');
  const [nurseAgency, setNurseAgency] = useState('HomeCare Health Services');
  const [nursePin, setNursePin] = useState('1234');

  // Family Login Form State
  const [familyName, setFamilyName] = useState('Rohan Sharma');
  const [familyRelation, setFamilyRelation] = useState('Son');
  const [familyPhone, setFamilyPhone] = useState('+91 98111-22334');
  const [familyPin, setFamilyPin] = useState('1234');

  // Doctor Sign Up State
  const [doctorSignupName, setDoctorSignupName] = useState('');
  const [doctorSignupEmail, setDoctorSignupEmail] = useState('');
  const [doctorSignupLicense, setDoctorSignupLicense] = useState('');
  const [doctorSignupHospital, setDoctorSignupHospital] = useState('');
  const [doctorSignupPassword, setDoctorSignupPassword] = useState('');
  const [doctorSignupConfirmPassword, setDoctorSignupConfirmPassword] = useState('');

  // Nurse Sign Up State
  const [nurseSignupName, setNurseSignupName] = useState('');
  const [nurseSignupEmail, setNurseSignupEmail] = useState('');
  const [nurseSignupLicense, setNurseSignupLicense] = useState('');
  const [nurseSignupCenter, setNurseSignupCenter] = useState('');
  const [nurseSignupPassword, setNurseSignupPassword] = useState('');
  const [nurseSignupConfirmPassword, setNurseSignupConfirmPassword] = useState('');

  // Family Member Sign Up State
  const [familySignupName, setFamilySignupName] = useState('');
  const [familySignupEmail, setFamilySignupEmail] = useState('');
  const [familySignupRelation, setFamilySignupRelation] = useState('Daughter');
  const [familySignupPhone, setFamilySignupPhone] = useState('');
  const [familySignupPassword, setFamilySignupPassword] = useState('');
  const [familySignupConfirmPassword, setFamilySignupConfirmPassword] = useState('');

  // Shared Validation and Success State
  const [signupError, setSignupError] = useState<string | null>(null);
  const [successAccount, setSuccessAccount] = useState<{ role: CaregiverRole; name: string } | null>(null);

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
    setSignupError(null);
    setSuccessAccount(null);
    if (role === 'doctor') setView('doctor');
    else if (role === 'nurse') setView('nurse');
    else setView('family');
  };

  const handleSelectSignup = (role: CaregiverRole) => {
    audio.playGentleChime();
    setSignupError(null);
    setSuccessAccount(null);
    if (role === 'doctor') setView('doctor_signup');
    else if (role === 'nurse') setView('nurse_signup');
    else setView('family_signup');
  };

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  };

  const saveRegisteredAccount = (account: RegisteredAccount) => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('sangpa_registered_users');
        const list: RegisteredAccount[] = stored ? JSON.parse(stored) : [];
        list.push(account);
        localStorage.setItem('sangpa_registered_users', JSON.stringify(list));
      } catch (err) {
        console.error('Failed to save registered account to localStorage', err);
      }
    }
  };

  // Doctor Login Submit
  const handleDoctorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = doctorName.trim() || 'Dr. Anita Verma, MD';
    const finalTitle = `Geriatrician • ${doctorHospital.trim() || 'Apollo Geriatrics'}`;
    loginCaregiver('doctor', finalName, finalTitle);
  };

  // Nurse Login Submit
  const handleNurseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = nurseName.trim() || 'Nurse Priya Sharma, RN';
    const shortShift = nurseShift.includes('Morning') ? 'Morning' : nurseShift.includes('Evening') ? 'Evening' : 'Night';
    const finalTitle = `Home Care Nurse • ${shortShift} Shift`;
    loginCaregiver('nurse', finalName, finalTitle);
  };

  // Family Login Submit
  const handleFamilySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = familyName.trim() || 'Rohan Sharma';
    const finalTitle = `Family Member (${familyRelation})`;
    loginCaregiver('family', finalName, finalTitle);
  };

  // Doctor Sign Up Submit
  const handleDoctorSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError(null);

    if (!doctorSignupName.trim()) {
      setSignupError('Please enter your Doctor Full Name.');
      return;
    }
    if (!validateEmail(doctorSignupEmail)) {
      setSignupError('Please enter a valid Email Address.');
      return;
    }
    if (!doctorSignupLicense.trim()) {
      setSignupError('Please enter your Medical Registration / License No.');
      return;
    }
    if (!doctorSignupHospital.trim()) {
      setSignupError('Please enter your Hospital or Clinic Affiliation.');
      return;
    }
    if (!doctorSignupPassword) {
      setSignupError('Please enter a Password.');
      return;
    }
    if (doctorSignupPassword.length < 4) {
      setSignupError('Password must be at least 4 characters long.');
      return;
    }
    if (doctorSignupPassword !== doctorSignupConfirmPassword) {
      setSignupError('Password and Confirm Password do not match.');
      return;
    }

    const newName = doctorSignupName.trim();
    const newHospital = doctorSignupHospital.trim();
    const newLicense = doctorSignupLicense.trim();

    saveRegisteredAccount({
      role: 'doctor',
      name: newName,
      email: doctorSignupEmail.trim(),
      title: `Geriatrician • ${newHospital}`,
      createdAt: new Date().toISOString(),
      details: {
        license: newLicense,
        hospital: newHospital
      }
    });

    // Prepopulate Doctor Login fields for instant login convenience
    setDoctorName(newName);
    setDoctorHospital(newHospital);
    setDoctorLicense(newLicense);
    setDoctorPin(doctorSignupPassword);

    audio.playSuccessJingle();
    setSuccessAccount({ role: 'doctor', name: newName });
  };

  // Nurse Sign Up Submit
  const handleNurseSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError(null);

    if (!nurseSignupName.trim()) {
      setSignupError('Please enter your Nurse Full Name.');
      return;
    }
    if (!validateEmail(nurseSignupEmail)) {
      setSignupError('Please enter a valid Email Address.');
      return;
    }
    if (!nurseSignupCenter.trim()) {
      setSignupError('Please enter your Hospital, Clinic, or Care Center.');
      return;
    }
    if (!nurseSignupPassword) {
      setSignupError('Please enter a Password.');
      return;
    }
    if (nurseSignupPassword.length < 4) {
      setSignupError('Password must be at least 4 characters long.');
      return;
    }
    if (nurseSignupPassword !== nurseSignupConfirmPassword) {
      setSignupError('Password and Confirm Password do not match.');
      return;
    }

    const newName = nurseSignupName.trim();
    const newCenter = nurseSignupCenter.trim();
    const newLicense = nurseSignupLicense.trim() || 'NUR-DL-5521';

    saveRegisteredAccount({
      role: 'nurse',
      name: newName,
      email: nurseSignupEmail.trim(),
      title: `Home Care Nurse • ${newCenter}`,
      createdAt: new Date().toISOString(),
      details: {
        license: newLicense,
        center: newCenter
      }
    });

    // Prepopulate Nurse Login fields
    setNurseName(newName);
    setNurseAgency(newCenter);
    setNurseStaffId(newLicense);
    setNursePin(nurseSignupPassword);

    audio.playSuccessJingle();
    setSuccessAccount({ role: 'nurse', name: newName });
  };

  // Family Member Sign Up Submit
  const handleFamilySignup = (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError(null);

    if (!familySignupName.trim()) {
      setSignupError('Please enter your Full Name.');
      return;
    }
    if (!validateEmail(familySignupEmail)) {
      setSignupError('Please enter a valid Email Address.');
      return;
    }
    if (!familySignupRelation.trim()) {
      setSignupError('Please select your Relationship to Patient.');
      return;
    }
    if (!familySignupPassword) {
      setSignupError('Please enter a Password.');
      return;
    }
    if (familySignupPassword.length < 4) {
      setSignupError('Password must be at least 4 characters long.');
      return;
    }
    if (familySignupPassword !== familySignupConfirmPassword) {
      setSignupError('Password and Confirm Password do not match.');
      return;
    }

    const newName = familySignupName.trim();
    const newRelation = familySignupRelation.trim();
    const newPhone = familySignupPhone.trim() || '+91 98111-22334';

    saveRegisteredAccount({
      role: 'family',
      name: newName,
      email: familySignupEmail.trim(),
      title: `Family Member (${newRelation})`,
      createdAt: new Date().toISOString(),
      details: {
        relation: newRelation,
        phone: newPhone
      }
    });

    // Prepopulate Family Login fields
    setFamilyName(newName);
    setFamilyRelation(newRelation);
    setFamilyPhone(newPhone);
    setFamilyPin(familySignupPassword);

    audio.playSuccessJingle();
    setSuccessAccount({ role: 'family', name: newName });
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
                    className="p-4 sm:p-5 rounded-3xl border-2 bg-white border-[#E7E3D8] hover:border-[#4E7037] transition-all shadow-xs group"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div className="flex items-start gap-3.5 min-w-0 flex-1">
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

                      {/* Login and Secondary Sign Up Actions */}
                      <div className="mt-2 sm:mt-1 flex items-center gap-2 flex-shrink-0 self-end sm:self-start">
                        <button
                          onClick={() => handleSelectRole(opt.role)}
                          className="px-3.5 py-1.5 rounded-xl font-bold text-xs bg-[#344E2E] hover:bg-[#253920] text-white flex items-center gap-1 transition-all shadow-xs cursor-pointer active:scale-95"
                        >
                          <span>Login</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleSelectSignup(opt.role)}
                          className="px-3 py-1.5 rounded-xl font-bold text-xs text-[#243B1D] hover:text-[#182813] bg-stone-100 hover:bg-[#EAF2E6] border border-[#CCD8C4] transition-all cursor-pointer active:scale-95 shadow-2xs"
                        >
                          <span>Sign Up</span>
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

              <div className="pt-2 space-y-2">
                <button
                  type="submit"
                  className="w-full py-3.5 px-4 rounded-2xl bg-purple-700 hover:bg-purple-800 text-white font-extrabold text-sm shadow-md transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Login as Doctor</span>
                </button>

                {/* Switch to Sign Up */}
                <div className="text-center pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      audio.playGentleChime();
                      setSignupError(null);
                      setView('doctor_signup');
                    }}
                    className="text-xs font-medium text-stone-600 hover:text-stone-900 cursor-pointer"
                  >
                    Don't have an account? <span className="font-bold underline text-purple-700">Sign Up</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* ========================================================= */}
        {/* 3. DOCTOR DEDICATED SIGN UP SCREEN                        */}
        {/* ========================================================= */}
        {view === 'doctor_signup' && (
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

            {/* Doctor Sign Up Header */}
            <div className="text-center space-y-1">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 border-2 border-purple-200 mx-auto flex items-center justify-center text-purple-800 shadow-2xs mb-2">
                <UserPlus className="w-6 h-6" />
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-purple-950">
                Doctor Portal Sign Up
              </h2>
              <p className="text-xs text-stone-600">
                Create your clinical care account
              </p>
            </div>

            {/* Success State */}
            {successAccount && successAccount.role === 'doctor' ? (
              <div className="bg-white rounded-3xl p-6 border-2 border-emerald-300 shadow-md text-center space-y-4 animate-in fade-in">
                <div className="w-14 h-14 rounded-full bg-emerald-100 border-2 border-emerald-300 flex items-center justify-center mx-auto text-emerald-700 shadow-sm">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-black text-emerald-950">
                    Account created successfully.
                  </h3>
                  <p className="text-xs text-stone-600">
                    Welcome, <strong>{successAccount.name}</strong>! Your clinical doctor account is ready.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    audio.playGentleChime();
                    setSuccessAccount(null);
                    setView('doctor');
                  }}
                  className="w-full py-3.5 px-4 rounded-2xl bg-purple-700 hover:bg-purple-800 text-white font-extrabold text-sm shadow-md transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Continue to Login</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              /* Doctor Sign Up Form */
              <form onSubmit={handleDoctorSignup} className="bg-white rounded-3xl p-5 border-2 border-purple-200 shadow-sm space-y-3.5">
                {signupError && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                    <span>{signupError}</span>
                  </div>
                )}

                <div>
                  <label className="text-xs font-extrabold text-stone-700 block mb-1">
                    Doctor Full Name:
                  </label>
                  <input
                    type="text"
                    required
                    value={doctorSignupName}
                    onChange={(e) => setDoctorSignupName(e.target.value)}
                    placeholder="e.g. Dr. Rajesh Kulkarni, MD"
                    className="w-full text-xs font-semibold p-3 rounded-xl border border-stone-300 focus:border-purple-600 focus:ring-1 focus:ring-purple-600 outline-none bg-stone-50/50"
                  />
                </div>

                <div>
                  <label className="text-xs font-extrabold text-stone-700 block mb-1">
                    Email Address:
                  </label>
                  <input
                    type="email"
                    required
                    value={doctorSignupEmail}
                    onChange={(e) => setDoctorSignupEmail(e.target.value)}
                    placeholder="e.g. dr.rajesh@hospital.org"
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
                    value={doctorSignupLicense}
                    onChange={(e) => setDoctorSignupLicense(e.target.value)}
                    placeholder="e.g. MCI-2021-99881"
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
                    value={doctorSignupHospital}
                    onChange={(e) => setDoctorSignupHospital(e.target.value)}
                    placeholder="e.g. Fortis Memory Clinic & Neuro Care"
                    className="w-full text-xs font-semibold p-3 rounded-xl border border-stone-300 focus:border-purple-600 focus:ring-1 focus:ring-purple-600 outline-none bg-stone-50/50"
                  />
                </div>

                <div>
                  <label className="text-xs font-extrabold text-stone-700 block mb-1">
                    Password:
                  </label>
                  <input
                    type="password"
                    required
                    value={doctorSignupPassword}
                    onChange={(e) => setDoctorSignupPassword(e.target.value)}
                    placeholder="Create a password"
                    className="w-full text-xs font-semibold p-3 rounded-xl border border-stone-300 focus:border-purple-600 focus:ring-1 focus:ring-purple-600 outline-none bg-stone-50/50"
                  />
                </div>

                <div>
                  <label className="text-xs font-extrabold text-stone-700 block mb-1">
                    Confirm Password:
                  </label>
                  <input
                    type="password"
                    required
                    value={doctorSignupConfirmPassword}
                    onChange={(e) => setDoctorSignupConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    className="w-full text-xs font-semibold p-3 rounded-xl border border-stone-300 focus:border-purple-600 focus:ring-1 focus:ring-purple-600 outline-none bg-stone-50/50"
                  />
                </div>

                <div className="pt-2 space-y-2">
                  <button
                    type="submit"
                    className="w-full py-3.5 px-4 rounded-2xl bg-purple-700 hover:bg-purple-800 text-white font-extrabold text-sm shadow-md transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-2"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Create Doctor Account</span>
                  </button>

                  <div className="text-center pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        audio.playGentleChime();
                        setSignupError(null);
                        setView('doctor');
                      }}
                      className="text-xs font-medium text-stone-600 hover:text-stone-900 cursor-pointer"
                    >
                      Already have an account? <span className="font-bold underline text-purple-700">Login</span>
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* 4. NURSE CUSTOMIZED LOGIN SCREEN                          */}
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

              <div className="pt-2 space-y-2">
                <button
                  type="submit"
                  className="w-full py-3.5 px-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm shadow-md transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-2"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Login as Nurse</span>
                </button>

                {/* Switch to Sign Up */}
                <div className="text-center pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      audio.playGentleChime();
                      setSignupError(null);
                      setView('nurse_signup');
                    }}
                    className="text-xs font-medium text-stone-600 hover:text-stone-900 cursor-pointer"
                  >
                    Don't have an account? <span className="font-bold underline text-blue-600">Sign Up</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* ========================================================= */}
        {/* 5. NURSE DEDICATED SIGN UP SCREEN                         */}
        {/* ========================================================= */}
        {view === 'nurse_signup' && (
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

            {/* Nurse Sign Up Header */}
            <div className="text-center space-y-1">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 border-2 border-blue-200 mx-auto flex items-center justify-center text-blue-800 shadow-2xs mb-2">
                <UserPlus className="w-6 h-6" />
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-blue-950">
                Nurse Portal Sign Up
              </h2>
              <p className="text-xs text-stone-600">
                Create your care team account
              </p>
            </div>

            {/* Success State */}
            {successAccount && successAccount.role === 'nurse' ? (
              <div className="bg-white rounded-3xl p-6 border-2 border-emerald-300 shadow-md text-center space-y-4 animate-in fade-in">
                <div className="w-14 h-14 rounded-full bg-emerald-100 border-2 border-emerald-300 flex items-center justify-center mx-auto text-emerald-700 shadow-sm">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-black text-emerald-950">
                    Account created successfully.
                  </h3>
                  <p className="text-xs text-stone-600">
                    Welcome, <strong>{successAccount.name}</strong>! Your nursing care account is ready.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    audio.playGentleChime();
                    setSuccessAccount(null);
                    setView('nurse');
                  }}
                  className="w-full py-3.5 px-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm shadow-md transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Continue to Login</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              /* Nurse Sign Up Form */
              <form onSubmit={handleNurseSignup} className="bg-white rounded-3xl p-5 border-2 border-blue-200 shadow-sm space-y-3.5">
                {signupError && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                    <span>{signupError}</span>
                  </div>
                )}

                <div>
                  <label className="text-xs font-extrabold text-stone-700 block mb-1">
                    Nurse Full Name:
                  </label>
                  <input
                    type="text"
                    required
                    value={nurseSignupName}
                    onChange={(e) => setNurseSignupName(e.target.value)}
                    placeholder="e.g. Sunita Devi, GNM"
                    className="w-full text-xs font-semibold p-3 rounded-xl border border-stone-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none bg-stone-50/50"
                  />
                </div>

                <div>
                  <label className="text-xs font-extrabold text-stone-700 block mb-1">
                    Email Address:
                  </label>
                  <input
                    type="email"
                    required
                    value={nurseSignupEmail}
                    onChange={(e) => setNurseSignupEmail(e.target.value)}
                    placeholder="e.g. sunita.devi@careteam.org"
                    className="w-full text-xs font-semibold p-3 rounded-xl border border-stone-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none bg-stone-50/50"
                  />
                </div>

                <div>
                  <label className="text-xs font-extrabold text-stone-700 block mb-1">
                    Nursing Registration / License No. (if applicable):
                  </label>
                  <input
                    type="text"
                    value={nurseSignupLicense}
                    onChange={(e) => setNurseSignupLicense(e.target.value)}
                    placeholder="e.g. INC-AS-2019-332"
                    className="w-full text-xs font-semibold p-3 rounded-xl border border-stone-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none bg-stone-50/50"
                  />
                </div>

                <div>
                  <label className="text-xs font-extrabold text-stone-700 block mb-1">
                    Hospital / Clinic / Care Center:
                  </label>
                  <input
                    type="text"
                    required
                    value={nurseSignupCenter}
                    onChange={(e) => setNurseSignupCenter(e.target.value)}
                    placeholder="e.g. Guwahati Geriatric Care & Home Nursing"
                    className="w-full text-xs font-semibold p-3 rounded-xl border border-stone-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none bg-stone-50/50"
                  />
                </div>

                <div>
                  <label className="text-xs font-extrabold text-stone-700 block mb-1">
                    Password:
                  </label>
                  <input
                    type="password"
                    required
                    value={nurseSignupPassword}
                    onChange={(e) => setNurseSignupPassword(e.target.value)}
                    placeholder="Create a password"
                    className="w-full text-xs font-semibold p-3 rounded-xl border border-stone-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none bg-stone-50/50"
                  />
                </div>

                <div>
                  <label className="text-xs font-extrabold text-stone-700 block mb-1">
                    Confirm Password:
                  </label>
                  <input
                    type="password"
                    required
                    value={nurseSignupConfirmPassword}
                    onChange={(e) => setNurseSignupConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    className="w-full text-xs font-semibold p-3 rounded-xl border border-stone-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none bg-stone-50/50"
                  />
                </div>

                <div className="pt-2 space-y-2">
                  <button
                    type="submit"
                    className="w-full py-3.5 px-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm shadow-md transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-2"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Create Nurse Account</span>
                  </button>

                  <div className="text-center pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        audio.playGentleChime();
                        setSignupError(null);
                        setView('nurse');
                      }}
                      className="text-xs font-medium text-stone-600 hover:text-stone-900 cursor-pointer"
                    >
                      Already have an account? <span className="font-bold underline text-blue-600">Login</span>
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* 6. FAMILY CUSTOMIZED LOGIN SCREEN                         */}
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

              <div className="pt-2 space-y-2">
                <button
                  type="submit"
                  className="w-full py-3.5 px-4 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-sm shadow-md transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-2"
                >
                  <Heart className="w-4 h-4" />
                  <span>Login as Family Member</span>
                </button>

                {/* Switch to Sign Up */}
                <div className="text-center pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      audio.playGentleChime();
                      setSignupError(null);
                      setView('family_signup');
                    }}
                    className="text-xs font-medium text-stone-600 hover:text-stone-900 cursor-pointer"
                  >
                    Don't have an account? <span className="font-bold underline text-amber-700">Sign Up</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* ========================================================= */}
        {/* 7. FAMILY MEMBER DEDICATED SIGN UP SCREEN                 */}
        {/* ========================================================= */}
        {view === 'family_signup' && (
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

            {/* Family Sign Up Header */}
            <div className="text-center space-y-1">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 border-2 border-amber-200 mx-auto flex items-center justify-center text-amber-800 shadow-2xs mb-2">
                <UserPlus className="w-6 h-6" />
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-amber-950">
                Family Member Sign Up
              </h2>
              <p className="text-xs text-stone-600">
                Create your family caregiver account
              </p>
            </div>

            {/* Success State */}
            {successAccount && successAccount.role === 'family' ? (
              <div className="bg-white rounded-3xl p-6 border-2 border-emerald-300 shadow-md text-center space-y-4 animate-in fade-in">
                <div className="w-14 h-14 rounded-full bg-emerald-100 border-2 border-emerald-300 flex items-center justify-center mx-auto text-emerald-700 shadow-sm">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-black text-emerald-950">
                    Account created successfully.
                  </h3>
                  <p className="text-xs text-stone-600">
                    Welcome, <strong>{successAccount.name}</strong>! Your family caregiver account is ready.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    audio.playGentleChime();
                    setSuccessAccount(null);
                    setView('family');
                  }}
                  className="w-full py-3.5 px-4 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-sm shadow-md transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Continue to Login</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              /* Family Sign Up Form */
              <form onSubmit={handleFamilySignup} className="bg-white rounded-3xl p-5 border-2 border-amber-200 shadow-sm space-y-3.5">
                {signupError && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                    <span>{signupError}</span>
                  </div>
                )}

                <div>
                  <label className="text-xs font-extrabold text-stone-700 block mb-1">
                    Full Name:
                  </label>
                  <input
                    type="text"
                    required
                    value={familySignupName}
                    onChange={(e) => setFamilySignupName(e.target.value)}
                    placeholder="e.g. Ananya Sharma"
                    className="w-full text-xs font-semibold p-3 rounded-xl border border-stone-300 focus:border-amber-600 focus:ring-1 focus:ring-amber-600 outline-none bg-stone-50/50"
                  />
                </div>

                <div>
                  <label className="text-xs font-extrabold text-stone-700 block mb-1">
                    Email Address:
                  </label>
                  <input
                    type="email"
                    required
                    value={familySignupEmail}
                    onChange={(e) => setFamilySignupEmail(e.target.value)}
                    placeholder="e.g. ananya.sharma@gmail.com"
                    className="w-full text-xs font-semibold p-3 rounded-xl border border-stone-300 focus:border-amber-600 focus:ring-1 focus:ring-amber-600 outline-none bg-stone-50/50"
                  />
                </div>

                <div>
                  <label className="text-xs font-extrabold text-stone-700 block mb-1">
                    Relationship to Patient:
                  </label>
                  <select
                    value={familySignupRelation}
                    onChange={(e) => setFamilySignupRelation(e.target.value)}
                    className="w-full text-xs font-semibold p-3 rounded-xl border border-stone-300 focus:border-amber-600 focus:ring-1 focus:ring-amber-600 outline-none bg-stone-50/50"
                  >
                    <option value="Daughter">Daughter</option>
                    <option value="Son">Son</option>
                    <option value="Spouse">Spouse / Partner</option>
                    <option value="Grandchild">Grandchild</option>
                    <option value="Brother">Brother</option>
                    <option value="Sister">Sister</option>
                    <option value="Primary Caregiver">Primary Family Caregiver</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-extrabold text-stone-700 block mb-1">
                    Phone Number (optional):
                  </label>
                  <input
                    type="tel"
                    value={familySignupPhone}
                    onChange={(e) => setFamilySignupPhone(e.target.value)}
                    placeholder="e.g. +91 98765-43210"
                    className="w-full text-xs font-semibold p-3 rounded-xl border border-stone-300 focus:border-amber-600 focus:ring-1 focus:ring-amber-600 outline-none bg-stone-50/50"
                  />
                </div>

                <div>
                  <label className="text-xs font-extrabold text-stone-700 block mb-1">
                    Password:
                  </label>
                  <input
                    type="password"
                    required
                    value={familySignupPassword}
                    onChange={(e) => setFamilySignupPassword(e.target.value)}
                    placeholder="Create a password"
                    className="w-full text-xs font-semibold p-3 rounded-xl border border-stone-300 focus:border-amber-600 focus:ring-1 focus:ring-amber-600 outline-none bg-stone-50/50"
                  />
                </div>

                <div>
                  <label className="text-xs font-extrabold text-stone-700 block mb-1">
                    Confirm Password:
                  </label>
                  <input
                    type="password"
                    required
                    value={familySignupConfirmPassword}
                    onChange={(e) => setFamilySignupConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    className="w-full text-xs font-semibold p-3 rounded-xl border border-stone-300 focus:border-amber-600 focus:ring-1 focus:ring-amber-600 outline-none bg-stone-50/50"
                  />
                </div>

                <div className="pt-2 space-y-2">
                  <button
                    type="submit"
                    className="w-full py-3.5 px-4 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-sm shadow-md transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-2"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Create Family Account</span>
                  </button>

                  <div className="text-center pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        audio.playGentleChime();
                        setSignupError(null);
                        setView('family');
                      }}
                      className="text-xs font-medium text-stone-600 hover:text-stone-900 cursor-pointer"
                    >
                      Already have an account? <span className="font-bold underline text-amber-700">Login</span>
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
