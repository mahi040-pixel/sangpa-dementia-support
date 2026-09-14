import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  UserRole, 
  DeviceViewport, 
  PatientScreen, 
  CaregiverScreen, 
  LanguageCode, 
  TextScale, 
  MascotState,
  PatientProfile, 
  ReminderItem, 
  DailyActivity, 
  CognitiveGame, 
  MemoryItem, 
  CaregiverAlert, 
  ContactItem 
} from '../types';
import { 
  translations, 
  initialPatientProfile, 
  initialReminders, 
  initialDailyActivities, 
  initialGames, 
  initialMemories, 
  initialAlerts, 
  initialContacts 
} from '../utils/mockData';
import { audio } from '../utils/audio';
import { APP_VOICE_RESPONSES } from '../utils/localization';

interface AppContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  device: DeviceViewport;
  setDevice: (d: DeviceViewport) => void;
  patientScreen: PatientScreen;
  setPatientScreen: (s: PatientScreen) => void;
  caregiverScreen: CaregiverScreen;
  setCaregiverScreen: (s: CaregiverScreen) => void;
  language: LanguageCode;
  setLanguage: (l: LanguageCode) => void;
  textScale: TextScale;
  setTextScale: (s: TextScale) => void;
  highContrast: boolean;
  setHighContrast: (v: boolean | ((prev: boolean) => boolean)) => void;
  isOffline: boolean;
  setIsOffline: (v: boolean | ((prev: boolean) => boolean)) => void;
  pendingSyncCount: number;
  syncNow: () => void;
  
  patientProfile: PatientProfile;
  updatePatientProfile: (p: Partial<PatientProfile>) => void;
  
  reminders: ReminderItem[];
  completeReminder: (id: string) => void;
  snoozeReminder: (id: string) => void;
  addReminder: (r: Omit<ReminderItem, 'id'>) => void;
  deleteReminder: (id: string) => void;
  
  activities: DailyActivity[];
  completeActivity: (id: string) => void;
  addActivity: (act: Omit<DailyActivity, 'id'>) => void;
  deleteActivity: (id: string) => void;
  
  games: CognitiveGame[];
  updateGameStats: (id: string, score: number) => void;
  
  memories: MemoryItem[];
  addMemory: (m: Omit<MemoryItem, 'id'>) => void;
  toggleFavoriteMemory: (id: string) => void;
  toggleFlashcardMemory: (id: string) => void;
  
  alerts: CaregiverAlert[];
  resolveAlert: (id: string) => void;
  addAlert: (a: Omit<CaregiverAlert, 'id' | 'timestamp'>) => void;
  
  contacts: ContactItem[];
  addContact: (c: Omit<ContactItem, 'id'>) => void;
  
  mascotState: MascotState;
  setMascotState: (s: MascotState) => void;
  mascotMessage: string;
  setMascotMessage: (msg: string) => void;
  speakMascot: (text: string, state?: MascotState, langOverride?: LanguageCode) => void;
  
  voiceModalOpen: boolean;
  setVoiceModalOpen: (v: boolean) => void;
  fallbackCallActive: boolean;
  setFallbackCallActive: (v: boolean) => void;
  
  t: (key: string) => string;
}

const getInitialRole = (): UserRole => {
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search);
    const r = params.get('role');
    if (r === 'caregiver' || r === 'patient' || r === 'opening' || r === 'healthcare') {
      return r;
    }
  }
  return 'opening';
};

const getInitialDevice = (): DeviceViewport => {
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search);
    const d = params.get('device');
    if (d === 'desktop' || d === 'tablet' || d === 'mobile') {
      return d;
    }
    if (window.innerWidth >= 1024) return 'desktop';
    if (window.innerWidth >= 768) return 'desktop';
    return 'mobile';
  }
  return 'desktop';
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>(getInitialRole);
  const [device, setDevice] = useState<DeviceViewport>(getInitialDevice);
  const [patientScreen, setPatientScreen] = useState<PatientScreen>('home');
  const [caregiverScreen, setCaregiverScreen] = useState<CaregiverScreen>('overview');
  
  const [language, setLanguage] = useState<LanguageCode>('en');
  const [textScale, setTextScale] = useState<TextScale>('normal');
  const [highContrast, setHighContrast] = useState<boolean>(false);
  const [isOffline, setIsOffline] = useState<boolean>(false);
  const [pendingSyncCount, setPendingSyncCount] = useState<number>(0);
  
  const [patientProfile, setPatientProfile] = useState<PatientProfile>(initialPatientProfile);
  const [reminders, setReminders] = useState<ReminderItem[]>(initialReminders);
  const [activities, setActivities] = useState<DailyActivity[]>(initialDailyActivities);
  const [games, setGames] = useState<CognitiveGame[]>(initialGames);
  const [memories, setMemories] = useState<MemoryItem[]>(initialMemories);
  const [alerts, setAlerts] = useState<CaregiverAlert[]>(initialAlerts);
  const [contacts, setContacts] = useState<ContactItem[]>(initialContacts);

  const [mascotState, setMascotState] = useState<MascotState>('idle');
  const [mascotMessage, setMascotMessage] = useState<string>(
    "Namaste Kamala Dadi! You are doing well. Let's take one small step together."
  );
  const [voiceModalOpen, setVoiceModalOpen] = useState<boolean>(false);
  const [fallbackCallActive, setFallbackCallActive] = useState<boolean>(false);

  // Keep mascot greeting message localized when language or patient name changes
  useEffect(() => {
    const callingName = patientProfile.preferredName || patientProfile.name || 'Kamala Dadi';
    const greetFn = APP_VOICE_RESPONSES.mascotGreeting[language] || APP_VOICE_RESPONSES.mascotGreeting.en;
    setMascotMessage(greetFn(callingName));
  }, [language, patientProfile.preferredName, patientProfile.name]);

  const t = (key: string): string => {
    return translations[language]?.[key] || translations.en[key] || key;
  };

  const updatePatientProfile = (updates: Partial<PatientProfile>) => {
    setPatientProfile(prev => {
      const updated = { ...prev, ...updates };
      const newName = updated.preferredName || updated.name || 'Kamala Dadi';
      const greetFn = APP_VOICE_RESPONSES.mascotGreeting[language] || APP_VOICE_RESPONSES.mascotGreeting.en;
      setMascotMessage(greetFn(newName));
      return updated;
    });
  };

  const getSpeechLangCode = (lang: LanguageCode): string => {
    switch (lang) {
      case 'hi': return 'hi-IN';
      case 'bn': return 'bn-IN';
      case 'as': return 'as-IN';
      case 'mni': return 'mni-IN';
      case 'nag': return 'nag-IN';
      case 'es': return 'es-ES';
      default: return 'en-IN';
    }
  };

  const speakMascot = (text: string, state: MascotState = 'speaking', langOverride?: LanguageCode) => {
    const activeLang = langOverride || language;
    setMascotMessage(text);
    setMascotState(state);
    
    // Play cute child music box chime beforehand
    audio.playCuteChime();
    
    const langCode = getSpeechLangCode(activeLang);
    audio.speak(text, langCode, () => {
      setMascotState('idle');
    });
  };

  const completeReminder = (id: string) => {
    audio.playSuccessJingle();
    setReminders(prev => prev.map(r => r.id === id ? { ...r, status: 'completed' } : r));
    setActivities(prev => prev.map(a => (a.id === id || a.id === `act-from-${id}` || `rem-from-${a.id}` === id) ? { ...a, completed: true } : a));
    if (isOffline) {
      setPendingSyncCount(c => c + 1);
    }
    const msg = APP_VOICE_RESPONSES.reminderCompleted[language] || APP_VOICE_RESPONSES.reminderCompleted.en;
    speakMascot(msg, 'speaking');
  };

  const snoozeReminder = (id: string) => {
    audio.playTempleBell();
    setReminders(prev => prev.map(r => r.id === id ? { ...r, status: 'snoozed' } : r));
    const msg = APP_VOICE_RESPONSES.reminderSnoozed[language] || APP_VOICE_RESPONSES.reminderSnoozed.en;
    speakMascot(msg, 'speaking');
  };

  const addReminder = (r: Omit<ReminderItem, 'id'>) => {
    const newId = `rem-${Date.now()}`;
    const newRem: ReminderItem = {
      ...r,
      id: newId
    };
    setReminders(prev => [newRem, ...prev]);

    // Automatically sync with patient's daily routine screen!
    const newAct: DailyActivity = {
      id: `act-from-${newId}`,
      title: r.title,
      time: r.time,
      shortInstruction: r.instructions || (r.dosage ? `Dosage: ${r.dosage}` : 'Follow caregiver guidance.'),
      icon: r.category === 'medicine' ? 'Pill' : r.category === 'hydration' ? 'Droplets' : r.category === 'meal' ? 'Utensils' : r.category === 'exercise' ? 'Activity' : 'Clock',
      completed: r.status === 'completed',
      isCurrent: false,
      category: r.category,
      audioText: r.audioText || `Kamala Dadi, it is time for ${r.title}.`
    };
    setActivities(prev => [...prev, newAct]);

    if (isOffline) setPendingSyncCount(c => c + 1);
  };

  const deleteReminder = (id: string) => {
    setReminders(prev => prev.filter(r => r.id !== id));
    setActivities(prev => prev.filter(a => a.id !== id && a.id !== `act-from-${id}` && `rem-from-${a.id}` !== id));
  };

  const addActivity = (act: Omit<DailyActivity, 'id'>) => {
    const newId = `act-${Date.now()}`;
    const newAct: DailyActivity = {
      ...act,
      id: newId
    };
    setActivities(prev => [...prev, newAct]);

    // Also sync with reminders
    const newRem: ReminderItem = {
      id: `rem-from-${newId}`,
      title: act.title,
      time: act.time,
      category: (act.category === 'medicine' || act.category === 'hydration' || act.category === 'meal' || act.category === 'exercise') ? act.category : 'activity',
      status: act.completed ? 'completed' : 'upcoming',
      icon: act.icon,
      audioText: act.audioText || `Time for ${act.title}.`,
      instructions: act.shortInstruction,
      isOffline: true,
      notifyCaregiverIfMissed: true,
      scheduledTime: act.time
    };
    setReminders(prev => [newRem, ...prev]);

    if (isOffline) setPendingSyncCount(c => c + 1);
  };

  const deleteActivity = (id: string) => {
    setActivities(prev => prev.filter(a => a.id !== id));
    setReminders(prev => prev.filter(r => r.id !== id && r.id !== `rem-from-${id}` && `act-from-${r.id}` !== id));
  };

  const completeActivity = (id: string) => {
    audio.playSuccessJingle();
    setActivities(prev => prev.map(a => a.id === id ? { ...a, completed: true } : a));
    setReminders(prev => prev.map(r => (r.id === id || r.id === `rem-from-${id}` || `act-from-${r.id}` === id) ? { ...r, status: 'completed' } : r));
    if (isOffline) setPendingSyncCount(c => c + 1);
    const msg = APP_VOICE_RESPONSES.activityCompleted[language] || APP_VOICE_RESPONSES.activityCompleted.en;
    speakMascot(msg, 'speaking');
  };

  const updateGameStats = (id: string, score: number) => {
    setGames(prev => prev.map(g => {
      if (g.id === id) {
        const newAcc = Math.round((g.accuracy + score) / 2);
        return {
          ...g,
          accuracy: newAcc,
          streak: g.streak + 1,
          difficultyLevel: newAcc > 90 && g.difficultyLevel < 5 ? g.difficultyLevel + 1 : g.difficultyLevel,
          lastPlayed: 'Just now'
        };
      }
      return g;
    }));
    if (isOffline) setPendingSyncCount(c => c + 1);
  };

  const addMemory = (m: Omit<MemoryItem, 'id'>) => {
    const newMem: MemoryItem = {
      ...m,
      id: `mem-${Date.now()}`
    };
    setMemories(prev => [newMem, ...prev]);
  };

  const toggleFavoriteMemory = (id: string) => {
    setMemories(prev => prev.map(m => m.id === id ? { ...m, isFavorite: !m.isFavorite } : m));
  };

  const toggleFlashcardMemory = (id: string) => {
    setMemories(prev => prev.map(m => m.id === id ? { ...m, inFlashcards: !m.inFlashcards } : m));
  };

  const resolveAlert = (id: string) => {
    audio.playGentleChime();
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, resolved: true } : a));
  };

  const addAlert = (a: Omit<CaregiverAlert, 'id' | 'timestamp'>) => {
    const newAlert: CaregiverAlert = {
      ...a,
      id: `alt-${Date.now()}`,
      timestamp: 'Just now'
    };
    setAlerts(prev => [newAlert, ...prev]);
  };

  const addContact = (c: Omit<ContactItem, 'id'>) => {
    const newContact: ContactItem = {
      ...c,
      id: `cnt-${Date.now()}`
    };
    setContacts(prev => [...prev, newContact]);
  };

  const syncNow = () => {
    audio.playGentleChime();
    setPendingSyncCount(0);
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        device,
        setDevice,
        patientScreen,
        setPatientScreen,
        caregiverScreen,
        setCaregiverScreen,
        language,
        setLanguage,
        textScale,
        setTextScale,
        highContrast,
        setHighContrast,
        isOffline,
        setIsOffline,
        pendingSyncCount,
        syncNow,
        patientProfile,
        updatePatientProfile,
        reminders,
        completeReminder,
        snoozeReminder,
        addReminder,
        deleteReminder,
        activities,
        completeActivity,
        addActivity,
        deleteActivity,
        games,
        updateGameStats,
        memories,
        addMemory,
        toggleFavoriteMemory,
        toggleFlashcardMemory,
        alerts,
        resolveAlert,
        addAlert,
        contacts,
        addContact,
        mascotState,
        setMascotState,
        mascotMessage,
        setMascotMessage,
        speakMascot,
        voiceModalOpen,
        setVoiceModalOpen,
        fallbackCallActive,
        setFallbackCallActive,
        t,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
