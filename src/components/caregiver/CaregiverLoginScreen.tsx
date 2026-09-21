import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Stethoscope, 
  HeartHandshake, 
  Heart, 
  ArrowLeft, 
  ChevronRight,
  Sprout
} from 'lucide-react';
import { CaregiverRole } from '../../types';
import { audio } from '../../utils/audio';

export const CaregiverLoginScreen: React.FC = () => {
  const { loginCaregiver, setRole } = useApp();
  const [selectedRole, setSelectedRole] = useState<CaregiverRole>('doctor');

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

  const handleLogin = (role: CaregiverRole) => {
    audio.playSuccessJingle();
    loginCaregiver(role);
  };

  return (
    <div className="flex-1 bg-[#FAF8F5] min-h-full flex flex-col justify-between p-4 sm:p-6 lg:p-8 select-none">
      <div className="max-w-md mx-auto w-full space-y-6">
        
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
            const isSelected = selectedRole === opt.role;

            return (
              <div
                key={opt.role}
                onClick={() => {
                  setSelectedRole(opt.role);
                  handleLogin(opt.role);
                }}
                className={`p-4 sm:p-5 rounded-3xl border-2 transition-all cursor-pointer shadow-xs ${
                  isSelected
                    ? `${opt.accentColor} ring-2 shadow-sm scale-[1.01]`
                    : 'bg-white border-[#E7E3D8] hover:border-[#4E7037] hover:bg-stone-50/50'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3.5 min-w-0">
                    <div className="w-11 h-11 rounded-2xl bg-white border border-[#E7E3D8] flex items-center justify-center flex-shrink-0 shadow-2xs mt-0.5">
                      <Icon className="w-6 h-6 text-[#344E2E]" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="font-extrabold text-base text-stone-900">
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
                        handleLogin(opt.role);
                      }}
                      className="px-3.5 py-1.5 rounded-xl font-bold text-xs bg-[#344E2E] hover:bg-[#253920] text-white flex items-center gap-1 transition-all shadow-xs cursor-pointer active:scale-95"
                    >
                      <span>Continue</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
