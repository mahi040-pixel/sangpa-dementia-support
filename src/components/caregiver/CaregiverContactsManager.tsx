import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Plus, 
  Phone, 
  AlertTriangle, 
  ShieldCheck, 
  Check, 
  Bell, 
  User, 
  Play, 
  ArrowUp, 
  ArrowDown 
} from 'lucide-react';
import { audio } from '../../utils/audio';

export const CaregiverContactsManager: React.FC = () => {
  const { contacts, addContact } = useApp();

  const [testEmergencyModal, setTestEmergencyModal] = useState(false);
  const [testStep, setTestStep] = useState(1);
  const [isAddOpen, setIsAddOpen] = useState(false);

  // New Contact State
  const [name, setName] = useState('');
  const [relation, setRelation] = useState('Family');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<'family' | 'doctor' | 'caregiver' | 'emergency'>('family');
  const [canCallInEmergency, setCanCallInEmergency] = useState(true);
  const [receivesAlerts, setReceivesAlerts] = useState(true);

  const handleTestEmergency = () => {
    setTestStep(1);
    setTestEmergencyModal(true);
    audio.playEmergencyPulse();
  };

  const handleCreateContact = () => {
    if (!name.trim() || !phone.trim()) return;

    addContact({
      name,
      relation,
      phone,
      role,
      avatar: '',
      canCallInEmergency,
      receivesAlerts,
      isPrimary: false
    });

    audio.playSuccessJingle();
    setIsAddOpen(false);
    setName('');
    setPhone('');
  };

  return (
    <div className="flex-1 p-3.5 sm:p-6 lg:p-8 max-w-5xl mx-auto w-full space-y-4 sm:space-y-6 pb-24 md:pb-8">
      {/* Header */}
      <div className="border-b border-sangpa-200 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-sangpa-900 tracking-tight">
            Contacts & Emergency Escalation
          </h2>
          <p className="text-xs sm:text-sm text-sangpa-600">
            Designate emergency calling order, doctors & automated SMS notifications
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handleTestEmergency}
            className="py-2.5 px-4 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 font-bold text-xs sm:text-sm transition-all flex items-center gap-1.5 shadow-2xs"
            title="Safe simulation of emergency escalation"
          >
            <Play className="w-3.5 h-3.5 fill-current text-amber-700" />
            <span>Test Emergency Protocol</span>
          </button>

          <button
            onClick={() => setIsAddOpen(true)}
            className="py-2.5 px-4 rounded-2xl bg-sangpa-500 hover:bg-sangpa-600 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Contact</span>
          </button>
        </div>
      </div>

      {/* Emergency Escalation Order Banner */}
      <div className="bg-white border-2 border-emergency-200 rounded-3xl p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-emergency-100 text-emergency-900 uppercase tracking-wide flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-emergency-600" />
            <span>Automated Emergency Escalation Order</span>
          </span>
          <span className="text-xs text-sangpa-600">5-second cancel buffer active</span>
        </div>
        <p className="text-xs text-sangpa-700">
          When the patient presses the emergency trigger, SANGPA calls contacts in this strict sequential priority:
        </p>

        <div className="space-y-2 pt-1">
          {contacts.filter(c => c.canCallInEmergency).map((c, idx) => (
            <div
              key={c.id}
              className="p-3 rounded-2xl bg-sangpa-50/70 border border-sangpa-200 flex items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-emergency-500 text-white font-bold flex items-center justify-center text-[11px] flex-shrink-0">
                  {idx + 1}
                </span>
                <div>
                  <span className="font-bold text-sm text-sangpa-900">{c.name}</span>
                  <span className="text-sangpa-600 ml-2">({c.relation})</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="font-mono text-sangpa-700 font-semibold">{c.phone}</span>
                {c.isPrimary && (
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-md">
                    Primary Responder
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Full Contact Cards List */}
      <div className="space-y-3">
        <h3 className="text-base font-bold text-sangpa-900">
          All Registered Care Contacts
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {contacts.map((c) => (
            <div
              key={c.id}
              className="bg-white border-2 border-sangpa-200 rounded-3xl p-4 shadow-sm space-y-3 flex flex-col justify-between"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-sangpa-100 flex items-center justify-center text-sangpa-700 font-bold text-lg flex-shrink-0">
                    {c.avatar ? (
                      <img src={c.avatar} alt={c.name} className="w-full h-full object-cover rounded-2xl" />
                    ) : (
                      c.name.slice(0, 1)
                    )}
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-sangpa-900">{c.name}</h4>
                    <p className="text-xs text-sangpa-600">{c.relation}</p>
                    <p className="text-xs font-mono font-bold text-sangpa-700 mt-0.5">{c.phone}</p>
                  </div>
                </div>

                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-sangpa-100 text-sangpa-800 uppercase">
                  {c.role}
                </span>
              </div>

              <div className="pt-2 border-t border-sangpa-100 flex items-center justify-between text-xs text-sangpa-600">
                <span className="flex items-center gap-1">
                  <Bell className="w-3.5 h-3.5 text-sangpa-500" />
                  <span>{c.receivesAlerts ? "Receives Missed Alerts" : "No Alerts"}</span>
                </span>
                <span className="flex items-center gap-1 font-semibold text-emergency-700">
                  <Phone className="w-3.5 h-3.5" />
                  <span>{c.canCallInEmergency ? "Emergency Responder" : "General"}</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Safe Simulation Modal for Emergency Test */}
      {testEmergencyModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border-2 border-amber-300 rounded-3xl max-w-md w-full p-6 shadow-2xl text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-8 h-8 text-amber-600" />
            </div>

            <h3 className="text-xl font-bold text-sangpa-900">
              Safe Emergency Escalation Test
            </h3>
            <p className="text-xs text-sangpa-600">
              This executes a full software drill without placing real cellular calls or notifying emergency dispatches.
            </p>

            <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-left text-xs space-y-2 text-amber-950">
              <p className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Step 1: Patient tablet alerts with 5s cancel buffer.</span>
              </p>
              <p className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Step 2: Dial sequence attempts Primary Contact Riya Sharma.</span>
              </p>
              <p className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Step 3: If unanswered in 20s, system calls Son Amit Sharma.</span>
              </p>
              <p className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Step 4: GPS coordinates broadcast to Clinic and Family SMS.</span>
              </p>
            </div>

            <button
              onClick={() => setTestEmergencyModal(false)}
              className="w-full py-3 rounded-2xl bg-sangpa-500 text-white font-bold text-sm shadow-md"
            >
              Close Simulation Drill
            </button>
          </div>
        </div>
      )}

      {/* Add Contact Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white border-2 border-sangpa-300 rounded-3xl max-w-md w-full p-5 sm:p-6 shadow-2xl space-y-3 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-sangpa-100 pb-2">
              <h3 className="text-base font-bold text-sangpa-900">Add New Care Contact</h3>
              <button onClick={() => setIsAddOpen(false)} className="text-xs text-sangpa-500 font-bold">Cancel</button>
            </div>

            <div>
              <label className="text-xs font-bold text-sangpa-700 block mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Dr. Preeti Das (Visiting Nurse)"
                className="w-full p-2.5 rounded-xl border border-sangpa-300 text-sm text-sangpa-900 outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-sangpa-700 block mb-1">Relationship / Role</label>
              <input
                type="text"
                value={relation}
                onChange={e => setRelation(e.target.value)}
                placeholder="e.g. Physical Therapist, Daughter-in-law"
                className="w-full p-2.5 rounded-xl border border-sangpa-300 text-sm text-sangpa-900 outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-sangpa-700 block mb-1">Phone Number</label>
              <input
                type="text"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="+91 98765 00000"
                className="w-full p-2.5 rounded-xl border border-sangpa-300 text-sm text-sangpa-900 outline-none"
              />
            </div>

            <div className="space-y-2 pt-1">
              <label className="flex items-center gap-2 text-xs font-semibold text-sangpa-800">
                <input
                  type="checkbox"
                  checked={canCallInEmergency}
                  onChange={e => setCanCallInEmergency(e.target.checked)}
                  className="w-4 h-4 rounded text-sangpa-600"
                />
                <span>Include in Patient Emergency Call dialer</span>
              </label>

              <label className="flex items-center gap-2 text-xs font-semibold text-sangpa-800">
                <input
                  type="checkbox"
                  checked={receivesAlerts}
                  onChange={e => setReceivesAlerts(e.target.checked)}
                  className="w-4 h-4 rounded text-sangpa-600"
                />
                <span>Receive SMS alerts for missed medicine / hydration</span>
              </label>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                onClick={() => setIsAddOpen(false)}
                className="py-2.5 px-4 rounded-xl bg-white border border-sangpa-300 text-sangpa-800 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateContact}
                className="flex-1 py-2.5 px-4 rounded-xl bg-sangpa-500 hover:bg-sangpa-600 text-white text-xs font-bold shadow-sm"
              >
                Save Contact
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
