import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Stethoscope, 
  HeartHandshake, 
  Heart, 
  ShieldCheck, 
  ArrowLeft, 
  CheckCircle2, 
  Lock,
  ChevronRight,
  Sprout
} from 'lucide-react';
import { CaregiverRole } from '../../types';
import { audio } from '../../utils/audio';

export const CaregiverLoginScreen: React.FC = () => {
  const { loginCaregiver, setRole, setPatientScreen } = useApp();
  const [selectedRole, setSelectedRole] = useState<CaregiverRole>('doctor');

  const demoAccounts: {
    role: CaregiverRole;
    name: string;
    title: string;
    icon: React.FC<{ className?: string }>;
    accentColor: string;
    badge: string;
    description: string;
    keyPermissions: string[];
  }[] = [
    {
      role: 'doctor',
      name: 'Dr. Anita Verma, MD',
      title: 'Lead Geriatrician & Neurologist',
      icon: Stethoscope,
      accentColor: 'border-emerald-600 bg-emerald-50/60 text-emerald-900',
      badge: 'Doctor • Clinical Lead',
      description: 'Full medical authority, diet plan creation, suggestion approvals, and care team directory.',
      keyPermissions: [
        'Create & edit official diet plan',
        'Review & approve/reject suggestions',
        'Access & manage Care Team (Exclusive)',
        'Full clinical details & advanced analytics'
      ]
    },
    {
      role: 'nurse',
      name: 'Nurse Priya Sharma, RN',
      title: 'Dedicated Home Care Nurse',
      icon: HeartHandshake,
      accentColor: 'border-blue-600 bg-blue-50/60 text-blue-900',
      badge: 'Nurse • Care Monitoring',
      description: 'Daily patient care monitoring, meal intake logging, nursing observations, and change suggestions.',
      keyPermissions: [
        'Track meals (Completed / Skipped / Partial)',
        'Log nursing meal observations',
        'Submit diet change suggestions to Doctor',
        'Acknowledge care alerts & update vitals'
      ]
    },
    {
      role: 'family',
      name: 'Rohan Sharma',
      title: "Patient's Son & Primary Family Contact",
      icon: Heart,
      accentColor: 'border-amber-600 bg-amber-50/60 text-amber-900',
      badge: 'Family Member • Family Circle',
      description: 'Compassionate overview, today’s meal visibility, personal family memories, and change requests.',
      keyPermissions: [
        'Add & manage Family Memories (Exclusive)',
        'View approved diet plan & meal times',
        'Submit diet preferences to Doctor',
        'Warm, reassuring weekly summary'
      ]
    }
  ];

  const handleLogin = (role: CaregiverRole, name: string) => {
    audio.playSuccessJingle();
    loginCaregiver(role, name);
  };

  return (
    <div className="flex-1 bg-[#FAF8F5] min-h-full flex flex-col justify-between p-4 sm:p-6 lg:p-8 select-none">
      <div className="max-w-lg mx-auto w-full space-y-5">
        
        {/* Top Back Navigation */}
        <div className="flex items-center justify-between">
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

          <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-[#344E2E] bg-[#EAF2E6] px-2.5 py-1 rounded-full border border-[#D5DFC9]">
            <Lock className="w-3 h-3 text-[#4E7037]" />
            <span>Role-Based Demo Access</span>
          </span>
        </div>

        {/* Header Branding */}
        <div className="text-center space-y-1.5 pt-1">
          <div className="w-12 h-12 rounded-2xl bg-[#EAF2E6] border-2 border-[#D5DFC9] mx-auto flex items-center justify-center text-[#344E2E] shadow-2xs mb-2">
            <Sprout className="w-6 h-6 text-[#4E7037]" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#243B1D] tracking-tight">
            Caregiver Portal Login
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 font-medium max-w-sm mx-auto">
            Select a verified demo account to experience role-based clinical, nursing, or family care for <strong className="text-stone-900">Maya Devi</strong>.
          </p>
        </div>

        {/* 3 Role Selection Cards */}
        <div className="space-y-3 pt-1">
          {demoAccounts.map((acc) => {
            const Icon = acc.icon;
            const isSelected = selectedRole === acc.role;

            return (
              <div
                key={acc.role}
                onClick={() => setSelectedRole(acc.role)}
                className={`p-4 rounded-3xl border-2 transition-all cursor-pointer shadow-xs relative ${
                  isSelected
                    ? `${acc.accentColor} ring-2 ring-[#4E7037]/40 shadow-sm scale-[1.01]`
                    : 'bg-white border-[#E7E3D8] hover:border-stone-400 hover:bg-stone-50/50'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-2xl bg-white border border-[#E7E3D8] flex items-center justify-center flex-shrink-0 shadow-2xs">
                      <Icon className="w-5 h-5 text-[#344E2E]" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-extrabold text-sm sm:text-base text-stone-900 truncate">
                          {acc.name}
                        </span>
                        <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#EAF2E6] text-[#2B4420] border border-[#D5DFC9]">
                          {acc.badge}
                        </span>
                      </div>

                      <p className="text-xs font-semibold text-stone-600 mt-0.5 truncate">
                        {acc.title}
                      </p>

                      <p className="text-[11px] text-stone-500 mt-1.5 leading-relaxed">
                        {acc.description}
                      </p>

                      {/* Bullet Permissions preview */}
                      <div className="mt-2.5 space-y-1 pt-2 border-t border-stone-200/70">
                        {acc.keyPermissions.map((perm, idx) => (
                          <div key={idx} className="flex items-center gap-1.5 text-[11px] text-stone-700">
                            <CheckCircle2 className="w-3 h-3 text-[#4E7037] flex-shrink-0" />
                            <span>{perm}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Direct 1-Click Login Button */}
                <div className="mt-3.5 pt-2 flex items-center justify-end">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLogin(acc.role, acc.name);
                    }}
                    className={`px-4 py-2 rounded-2xl font-black text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-95 ${
                      isSelected
                        ? 'bg-[#344E2E] hover:bg-[#253920] text-white'
                        : 'bg-stone-100 hover:bg-stone-200 text-stone-800'
                    }`}
                  >
                    <span>Enter as {acc.role === 'doctor' ? 'Doctor' : acc.role === 'nurse' ? 'Nurse' : 'Family Member'}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Security & Role Policy Assurance Note */}
        <div className="p-3 bg-white rounded-2xl border border-[#E7E3D8] text-[11px] text-stone-600 text-center flex items-center justify-center gap-1.5 shadow-2xs">
          <ShieldCheck className="w-4 h-4 text-[#4E7037] flex-shrink-0" />
          <span>One Unified Portal • Permissions enforce strict clinical, nursing, and family privacy boundaries.</span>
        </div>

      </div>
    </div>
  );
};
