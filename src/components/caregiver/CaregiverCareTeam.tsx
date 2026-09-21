import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  ShieldCheck,
  Phone,
  Mail,
  Plus,
  Trash2,
  ArrowLeft,
  UserCheck,
  Heart,
  Stethoscope,
  Clock,
  CheckCircle2,
  X,
  AlertCircle
} from 'lucide-react';
import { audio } from '../../utils/audio';
import { CareTeamMember } from '../../types';

export const CaregiverCareTeam: React.FC = () => {
  const {
    caregiverRole,
    careTeam,
    addCareTeamMember,
    removeCareTeamMember,
    setCaregiverScreen,
    patientProfile
  } = useApp();

  const patientDisplayName = patientProfile?.preferredName || patientProfile?.name || 'Kamla Devi';

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newMember, setNewMember] = useState<Omit<CareTeamMember, 'id'>>({
    name: '',
    role: 'Nurse',
    specialty: '',
    status: 'Active',
    phone: '',
    email: ''
  });

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMember.name.trim()) return;

    audio.playSuccessJingle();
    addCareTeamMember({
      name: newMember.name.trim(),
      role: newMember.role,
      specialty: newMember.specialty.trim() || 'Care Attendant',
      status: newMember.status.trim() || 'Active',
      phone: newMember.phone.trim() || '+91 98000-00000',
      email: newMember.email.trim() || 'contact@sangpacare.org'
    });

    setIsAddModalOpen(false);
    setNewMember({
      name: '',
      role: 'Nurse',
      specialty: '',
      status: 'Active',
      phone: '',
      email: ''
    });
  };

  const getRoleIcon = (role: CareTeamMember['role']) => {
    switch (role) {
      case 'Doctor':
        return <Stethoscope className="w-5 h-5 text-purple-600" />;
      case 'Nurse':
        return <UserCheck className="w-5 h-5 text-blue-600" />;
      case 'Family Member':
        return <Heart className="w-5 h-5 text-emerald-600" />;
      default:
        return <Users className="w-5 h-5 text-stone-600" />;
    }
  };

  const getRoleBadgeStyle = (role: CareTeamMember['role']) => {
    switch (role) {
      case 'Doctor':
        return 'bg-purple-100 text-purple-900 border-purple-200';
      case 'Nurse':
        return 'bg-blue-100 text-blue-900 border-blue-200';
      case 'Family Member':
        return 'bg-emerald-100 text-emerald-900 border-emerald-200';
      default:
        return 'bg-stone-100 text-stone-900 border-stone-200';
    }
  };

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
              Interdisciplinary Team Management
            </span>
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-900 border border-purple-200">
              Doctor Authority Only
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-extrabold text-sangpa-900 tracking-tight flex items-center gap-2 mt-0.5">
            <Users className="w-6 h-6 text-purple-700" />
            <span>Care Team Directory for {patientDisplayName}</span>
          </h1>
          <p className="text-xs sm:text-sm text-sangpa-600 mt-0.5">
            Designated clinical attending, daily care nurses, and primary family emergency liaisons.
          </p>
        </div>

        {/* Doctor Action: Add Member */}
        {caregiverRole === 'doctor' && (
          <button
            onClick={() => {
              audio.playGentleChime();
              setIsAddModalOpen(true);
            }}
            className="py-2 px-4 rounded-2xl bg-[#24421C] hover:bg-[#1B3213] text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Team Member</span>
          </button>
        )}
      </div>

      {/* 2. Lead Geriatrician Banner */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50/60 rounded-3xl p-4 sm:p-5 border border-purple-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center font-black text-lg shadow-sm">
            🩺
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-extrabold text-purple-950">Clinical Governance</h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-200 text-purple-900">
                Primary Attending
              </span>
            </div>
            <p className="text-xs text-purple-800">
              Dr. Anita Verma oversees diagnosis, medication protocols, cognitive therapy schedules, and approves dietary changes.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-purple-900 self-start sm:self-auto">
          <ShieldCheck className="w-4 h-4 text-purple-700" />
          <span>NABH Geriatric Protocol Verified</span>
        </div>
      </div>

      {/* 3. Care Team Member Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {careTeam.map(member => (
          <div
            key={member.id}
            className="bg-white rounded-3xl p-5 border border-sangpa-200 shadow-2xs flex flex-col justify-between space-y-4 hover:border-sangpa-300 transition-all"
          >
            <div className="space-y-3">
              {/* Member Top Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 rounded-2xl bg-[#F5F8F1] border border-sangpa-100">
                    {getRoleIcon(member.role)}
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-sangpa-900">{member.name}</h3>
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md border ${getRoleBadgeStyle(member.role)} uppercase tracking-wider block mt-0.5`}>
                      {member.role}
                    </span>
                  </div>
                </div>

                {caregiverRole === 'doctor' && member.id !== 'ct-1' && (
                  <button
                    onClick={() => {
                      if (confirm(`Remove ${member.name} from active care team?`)) {
                        removeCareTeamMember(member.id);
                      }
                    }}
                    title="Remove from care team"
                    className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-all cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Specialty & Status */}
              <div className="space-y-1 text-xs">
                <p className="text-stone-700 font-semibold">{member.specialty}</p>
                <div className="flex items-center gap-1.5 text-[11px] text-emerald-800 font-bold bg-emerald-50 px-2.5 py-1 rounded-xl w-fit">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                  <span>{member.status}</span>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-1.5 pt-2 border-t border-sangpa-100 text-xs text-stone-600">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-stone-400" />
                  <a href={`tel:${member.phone}`} className="hover:text-sangpa-800 font-medium">
                    {member.phone}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-stone-400" />
                  <a href={`mailto:${member.email}`} className="hover:text-sangpa-800 font-medium truncate">
                    {member.email}
                  </a>
                </div>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="pt-3 border-t border-sangpa-100 flex items-center gap-2">
              <a
                href={`tel:${member.phone}`}
                className="flex-1 py-1.5 px-2 rounded-xl bg-sangpa-100 hover:bg-sangpa-200 text-sangpa-900 font-bold text-xs flex items-center justify-center gap-1 transition-all"
              >
                <Phone className="w-3.5 h-3.5 text-sangpa-700" />
                <span>Call</span>
              </a>

              <a
                href={`mailto:${member.email}?subject=Regarding ${patientDisplayName}`}
                className="flex-1 py-1.5 px-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs flex items-center justify-center gap-1 transition-all"
              >
                <Mail className="w-3.5 h-3.5 text-stone-600" />
                <span>Message</span>
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* 4. Communication & Handover Protocol */}
      <div className="bg-white rounded-3xl p-5 border border-sangpa-200 shadow-2xs space-y-3">
        <h3 className="text-sm font-bold text-sangpa-900 flex items-center gap-2">
          <Clock className="w-4 h-4 text-sangpa-600" />
          <span>Care Handover & Communication Guidelines</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-stone-700">
          <div className="p-3 bg-[#FAF8F5] rounded-2xl border border-stone-100 space-y-1">
            <span className="font-bold text-purple-900 block">👨‍⚕️ Clinical Attending</span>
            <p className="text-stone-600">
              Reviews morning vitals and medication adherence logs daily by 10:00 AM. Evaluates family dietary requests and adjusts prescriptions.
            </p>
          </div>
          <div className="p-3 bg-[#FAF8F5] rounded-2xl border border-stone-100 space-y-1">
            <span className="font-bold text-blue-900 block">👩‍⚕️ Daily Care Attendant</span>
            <p className="text-stone-600">
              Logs meal consumption, hydration status, mood after games, and alerts immediately if systolic BP &gt; 150 or disorientation spikes.
            </p>
          </div>
          <div className="p-3 bg-[#FAF8F5] rounded-2xl border border-stone-100 space-y-1">
            <span className="font-bold text-emerald-900 block">🏡 Primary Family Liaison</span>
            <p className="text-stone-600">
              Submits family memory photos and notes patient food preferences. Receives reassurance notifications and attends weekly review.
            </p>
          </div>
        </div>
      </div>

      {/* MODAL: Add Care Team Member */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-sangpa-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-sangpa-100 pb-3">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-700" />
                <h3 className="text-base font-extrabold text-sangpa-900">
                  Add Care Team Member
                </h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-full hover:bg-stone-100 text-stone-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddMember} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Full Name & Credentials:</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Dr. Rajesh Mehra / Sunita Roy, GNM"
                  value={newMember.name}
                  onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-sangpa-200 bg-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Role in Team:</label>
                <select
                  value={newMember.role}
                  onChange={(e) => setNewMember({ ...newMember, role: e.target.value as any })}
                  className="w-full text-xs font-semibold p-2.5 rounded-xl border border-sangpa-200 bg-white"
                >
                  <option value="Doctor">Doctor (Clinical Consultant)</option>
                  <option value="Nurse">Nurse (Daily Attendant)</option>
                  <option value="Family Member">Family Member</option>
                  <option value="Other">Other Specialist / Physiotherapist</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Specialty / Relationship:</label>
                <input
                  type="text"
                  placeholder="e.g. Physical Therapist / Daughter"
                  value={newMember.specialty}
                  onChange={(e) => setNewMember({ ...newMember, specialty: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-sangpa-200 bg-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Phone Number:</label>
                <input
                  type="text"
                  placeholder="+91 98XXX-XXXXX"
                  value={newMember.phone}
                  onChange={(e) => setNewMember({ ...newMember, phone: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-sangpa-200 bg-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Email Address:</label>
                <input
                  type="email"
                  placeholder="name@healthcare.org"
                  value={newMember.email}
                  onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-sangpa-200 bg-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-sangpa-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="py-2 px-3 rounded-xl text-stone-600 text-xs font-bold hover:bg-stone-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2 px-4 rounded-xl bg-[#24421C] hover:bg-[#1B3213] text-white font-bold text-xs flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add to Team</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
