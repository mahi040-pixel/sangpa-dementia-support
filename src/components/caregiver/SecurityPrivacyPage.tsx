import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Shield, 
  Lock, 
  Mic, 
  Bell, 
  Phone, 
  Image as ImageIcon, 
  MapPin, 
  Check, 
  UserPlus, 
  KeyRound,
  FileCheck
} from 'lucide-react';
import { audio } from '../../utils/audio';

export const SecurityPrivacyPage: React.FC = () => {
  const [inviteEmail, setInviteEmail] = useState('');
  const [invitedSuccess, setInvitedSuccess] = useState(false);

  // Permission toggles
  const [permMic, setPermMic] = useState(true);
  const [permNotifications, setPermNotifications] = useState(true);
  const [permPhone, setPermPhone] = useState(true);
  const [permLocation, setPermLocation] = useState(true);
  const [permPhotos, setPermPhotos] = useState(true);

  const handleInvite = () => {
    if (!inviteEmail.trim()) return;
    audio.playSuccessJingle();
    setInvitedSuccess(true);
    setTimeout(() => {
      setInvitedSuccess(false);
      setInviteEmail('');
    }, 3000);
  };

  return (
    <div className="flex-1 p-3.5 sm:p-6 lg:p-8 max-w-5xl mx-auto w-full space-y-4 sm:space-y-6 pb-24 md:pb-8">
      {/* Header */}
      <div className="border-b border-sangpa-200 pb-3">
        <h2 className="text-xl sm:text-2xl font-extrabold text-sangpa-900 tracking-tight flex items-center gap-2">
          <Shield className="w-6 h-6 text-sangpa-600" />
          <span>Security, Consent & Device Permissions</span>
        </h2>
        <p className="text-xs sm:text-sm text-sangpa-600">
          Transparent explanation of hardware sensor access, role-based encryption & caregiver invitations
        </p>
      </div>

      {/* 1. Device Hardware Permissions Explainer */}
      <div className="bg-white border-2 border-sangpa-200 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
        <h3 className="text-base sm:text-lg font-bold text-sangpa-900 flex items-center gap-2">
          <Lock className="w-5 h-5 text-sangpa-600" />
          <span>Hardware Sensor Access & Explanations</span>
        </h3>
        <p className="text-xs text-sangpa-600">
          Each permission is strictly bounded to caregiving functions and local offline storage:
        </p>

        <div className="space-y-3 pt-1">
          {/* Microphone */}
          <div className="p-3.5 rounded-2xl bg-sangpa-50/70 border border-sangpa-200 flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-sangpa-100 text-sangpa-700">
                <Mic className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-sangpa-900">Microphone Access</h4>
                <p className="text-xs text-sangpa-600 mt-0.5">
                  <strong>Why needed:</strong> Enables Kamala Dadi to speak commands to Sangpa and record family voice notes. Voice is processed locally on device.
                </p>
              </div>
            </div>
            <input 
              type="checkbox" 
              checked={permMic} 
              onChange={e => setPermMic(e.target.checked)} 
              className="w-5 h-5 rounded text-sangpa-600 mt-1"
            />
          </div>

          {/* Location */}
          <div className="p-3.5 rounded-2xl bg-sangpa-50/70 border border-sangpa-200 flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-sangpa-100 text-sangpa-700">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-sangpa-900">Safe-Zone Location (GPS)</h4>
                <p className="text-xs text-sangpa-600 mt-0.5">
                  <strong>Why needed:</strong> Verifies patient is safe at home and automatically attaches coordinates if Emergency Assistance is pressed.
                </p>
              </div>
            </div>
            <input 
              type="checkbox" 
              checked={permLocation} 
              onChange={e => setPermLocation(e.target.checked)} 
              className="w-5 h-5 rounded text-sangpa-600 mt-1"
            />
          </div>

          {/* Phone */}
          <div className="p-3.5 rounded-2xl bg-sangpa-50/70 border border-sangpa-200 flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-sangpa-100 text-sangpa-700">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-sangpa-900">Cellular Calls & Automated Dialing</h4>
                <p className="text-xs text-sangpa-600 mt-0.5">
                  <strong>Why needed:</strong> Initiates direct phone calls to daughter Riya and runs automated voice reminders in rural low-connectivity mode.
                </p>
              </div>
            </div>
            <input 
              type="checkbox" 
              checked={permPhone} 
              onChange={e => setPermPhone(e.target.checked)} 
              className="w-5 h-5 rounded text-sangpa-600 mt-1"
            />
          </div>

          {/* Notifications */}
          <div className="p-3.5 rounded-2xl bg-sangpa-50/70 border border-sangpa-200 flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-sangpa-100 text-sangpa-700">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-sangpa-900">High-Priority Notifications</h4>
                <p className="text-xs text-sangpa-600 mt-0.5">
                  <strong>Why needed:</strong> Delivers audible chimes for medicines and alerts caregiver phone when hydration is pending.
                </p>
              </div>
            </div>
            <input 
              type="checkbox" 
              checked={permNotifications} 
              onChange={e => setPermNotifications(e.target.checked)} 
              className="w-5 h-5 rounded text-sangpa-600 mt-1"
            />
          </div>
        </div>
      </div>

      {/* 2. Caregiver Invitation / Shared Care */}
      <div className="bg-white border-2 border-sangpa-200 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
        <h3 className="text-base sm:text-lg font-bold text-sangpa-900 flex items-center gap-2">
          <UserPlus className="w-5 h-5 text-sangpa-600" />
          <span>Invite Secondary Caregiver or Visiting Doctor</span>
        </h3>
        <p className="text-xs text-sangpa-600">
          Send a secure role-based passkey to family members or nurses with granular data view permissions.
        </p>

        <div className="flex flex-col sm:flex-row gap-2">
          <input 
            type="email" 
            value={inviteEmail}
            onChange={e => setInviteEmail(e.target.value)}
            placeholder="caregiver.email@example.com"
            className="flex-1 p-3 rounded-2xl border border-sangpa-300 text-sm outline-none focus:border-sangpa-500"
          />
          <button
            onClick={handleInvite}
            className="py-3 px-6 rounded-2xl bg-sangpa-500 hover:bg-sangpa-600 text-white font-bold text-sm shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <KeyRound className="w-4 h-4" />
            <span>Send Secure Invite</span>
          </button>
        </div>

        {invitedSuccess && (
          <div className="p-3 bg-emerald-100 border border-emerald-300 rounded-xl text-emerald-900 text-xs font-bold flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-700" />
            <span>Encrypted invitation link dispatched to {inviteEmail}.</span>
          </div>
        )}
      </div>
    </div>
  );
};
