import React from 'react';
import { useApp } from '../../context/AppContext';
import { Home, CalendarCheck, Bell, Gamepad2, Heart, AlertTriangle, MessageCircle } from 'lucide-react';
import { PatientScreen } from '../../types';

export const PatientNav: React.FC = () => {
  const { patientScreen, setPatientScreen, reminders } = useApp();

  const pendingRemindersCount = reminders.filter(r => r.status === 'upcoming').length;

  const navItems: { screen: PatientScreen; label: string; icon: React.FC<{ className?: string }> }[] = [
    { screen: 'home', label: 'Home', icon: Home },
    { screen: 'activities', label: 'Routine', icon: CalendarCheck },
    { screen: 'reminders', label: 'Reminders', icon: Bell },
    { screen: 'games', label: 'Games', icon: Gamepad2 },
    { screen: 'memories', label: 'Memories', icon: Heart },
    { screen: 'emergency', label: 'Emergency', icon: AlertTriangle },
  ];

  return (
    <nav className="sticky bottom-0 z-40 bg-white/95 backdrop-blur-md border-t border-sangpa-200 px-2 py-2 shadow-card">
      <div className="max-w-md sm:max-w-xl mx-auto flex items-center justify-around gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = patientScreen === item.screen;
          const isEmergency = item.screen === 'emergency';

          if (isEmergency) {
            return (
              <button
                key={item.screen}
                onClick={() => setPatientScreen(item.screen)}
                className={`flex flex-col items-center justify-center p-1.5 rounded-2xl transition-all ${
                  isActive 
                    ? 'bg-emergency-500 text-white shadow-md' 
                    : 'bg-emergency-100 hover:bg-emergency-200 text-emergency-700'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px] sm:text-xs font-bold mt-0.5">Help</span>
              </button>
            );
          }

          return (
            <button
              key={item.screen}
              onClick={() => setPatientScreen(item.screen)}
              className={`relative flex flex-col items-center justify-center py-1.5 px-2.5 sm:px-3.5 rounded-2xl transition-all ${
                isActive
                  ? 'bg-sangpa-500 text-white font-bold shadow-sm'
                  : 'text-sangpa-700 hover:bg-sangpa-100 font-medium'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[11px] sm:text-xs mt-0.5">{item.label}</span>
              {item.screen === 'reminders' && pendingRemindersCount > 0 && !isActive && (
                <span className="absolute top-1 right-2 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-white" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
