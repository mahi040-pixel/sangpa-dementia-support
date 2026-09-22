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
  ContactItem,
  CaregiverRole,
  DietMealItem,
  DietPlan,
  DietSuggestion,
  CareTeamMember
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

  caregiverRole: CaregiverRole;
  setCaregiverRole: (r: CaregiverRole) => void;
  caregiverUser: { name: string; role: CaregiverRole; title: string };
  isCaregiverAuthenticated: boolean;
  loginCaregiver: (role: CaregiverRole, name?: string, title?: string) => void;
  logoutCaregiver: () => void;

  dietPlan: DietPlan;
  updateDietPlan: (p: DietPlan) => void;
  updateMealStatus: (mealId: 'breakfast' | 'lunch' | 'snack' | 'dinner', status: DietMealItem['status'], observation?: string) => void;
  incrementHydration: () => void;

  dietSuggestions: DietSuggestion[];
  addDietSuggestion: (suggestion: Omit<DietSuggestion, 'id' | 'submittedAt' | 'status'>) => void;
  reviewDietSuggestion: (id: string, decision: 'approved' | 'modified' | 'rejected', doctorResponse?: string, modifiedPlanText?: string) => void;

  careTeam: CareTeamMember[];
  addCareTeamMember: (member: Omit<CareTeamMember, 'id'>) => void;
  removeCareTeamMember: (id: string) => void;
  
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

const initialDietPlan: DietPlan = {
  id: 'diet-plan-maya',
  approvedBy: 'Dr. Anita Verma (MD, Geriatric Medicine)',
  lastUpdated: 'Today, 08:00 AM',
  hydrationTarget: 6,
  hydrationCurrent: 4,
  guidelines: 'MIND Diet Protocol: Neuroprotective antioxidant-rich meals, low sodium (<1500mg), high omega-3, soft textures for safe swallowing, and fixed hydration intervals.',
  restrictions: ['Low Sodium / No Table Salt', 'Avoid Refined Sugar', 'Avoid Hard/Crunchy Nuts (crush or powder only)', 'No caffeine after 4:00 PM'],
  meals: [
    {
      id: 'breakfast',
      name: 'Breakfast',
      time: '08:30 AM',
      items: ['Warm Moong Dal Khichdi with Soft Spinach', 'Crushed Walnuts (1 tsp)', 'Warm Cow Milk (150ml)'],
      portion: '1 medium bowl (approx 200g)',
      notes: 'Light on rock salt. Soft consistency for easy swallowing. Take BP medicine after meal.',
      status: 'completed',
      nurseObservation: 'Finished full portion without coughing. Took Amlodipine 5mg at 08:45 AM.',
      loggedAt: '08:45 AM'
    },
    {
      id: 'lunch',
      name: 'Lunch',
      time: '01:00 PM',
      items: ['Steamed Soft Rice with Toor Dal', 'Mashed Bottle Gourd (Lauki)', 'Fresh Curd (Dahi)'],
      portion: '1.5 cups dal-rice, 1 small cup curd',
      notes: 'Ensure curd is at room temperature. High probiotic support for gentle digestion.',
      status: 'completed',
      nurseObservation: 'Ate well, enjoyed curd. Completed 1 glass of water afterwards.',
      loggedAt: '01:35 PM'
    },
    {
      id: 'snack',
      name: 'Snack',
      time: '04:30 PM',
      items: ['Warm Chamomile & Tulsi Tea', '2 Roasted Ragi Biscuits', 'Small Ripe Papaya Cubes'],
      portion: '1 cup tea, 4-5 small papaya cubes',
      notes: 'Avoid refined sugar. Soothing warmth to prevent late-afternoon sundowning agitation.',
      status: 'upcoming'
    },
    {
      id: 'dinner',
      name: 'Dinner',
      time: '08:00 PM',
      items: ['Light Vegetable Stew with Soft Carrots', '1 Soft Whole Wheat Phulka with Ghee'],
      portion: '1 small bowl stew, 1 phulka',
      notes: 'Must be completed at least 1.5 hours before bedtime. Night medicine at 08:45 PM.',
      status: 'upcoming'
    }
  ]
};

const initialDietSuggestions: DietSuggestion[] = [
  {
    id: 'sug-1',
    submittedByRole: 'family',
    submittedByName: 'Rohan Sharma (Son)',
    submittedAt: 'Today, 09:15 AM',
    mealId: 'breakfast',
    message: 'Grandma prefers sliced ripe banana with breakfast instead of crushed walnuts.',
    status: 'pending'
  }
];

const initialCareTeam: CareTeamMember[] = [
  {
    id: 'ct-1',
    name: 'Dr. Anita Verma',
    role: 'Doctor',
    specialty: 'Primary Geriatrician & Neurologist',
    status: 'Active • Lead Attending',
    phone: '+91 11-4567-8900 (Ext 402)',
    email: 'dr.anita.verma@apollo-geriatrics.org'
  },
  {
    id: 'ct-2',
    name: 'Nurse Priya Sharma',
    role: 'Nurse',
    specialty: 'Home Care & Dementia Attendant',
    status: 'On Duty • Morning Shift',
    phone: '+91 98765-43210',
    email: 'priya.sharma@homecarehealth.in'
  },
  {
    id: 'ct-3',
    name: 'Rohan Sharma',
    role: 'Family Member',
    specialty: 'Patient’s Son & Primary Caregiver',
    status: 'Emergency Contact 1 • Local',
    phone: '+91 98111-22334',
    email: 'rohan.sharma@sangpacare.org'
  }
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>(getInitialRole);
  const [device, setDevice] = useState<DeviceViewport>(getInitialDevice);
  const [patientScreen, setPatientScreen] = useState<PatientScreen>('home');
  const [caregiverScreen, setCaregiverScreen] = useState<CaregiverScreen>('overview');
  
  // Caregiver Role and Authentication
  const [caregiverRole, setCaregiverRole] = useState<CaregiverRole>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sangpa_caregiver_role');
      if (saved === 'doctor' || saved === 'nurse' || saved === 'family') return saved;
    }
    return 'doctor';
  });

  const [isCaregiverAuthenticated, setIsCaregiverAuthenticated] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('sangpa_caregiver_auth') === 'true';
    }
    return false;
  });

  // Diet Plan & Suggestions State
  const [dietPlan, setDietPlan] = useState<DietPlan>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sangpa_diet_plan');
      if (saved) {
        try { return JSON.parse(saved); } catch (e) {}
      }
    }
    return initialDietPlan;
  });

  const [dietSuggestions, setDietSuggestions] = useState<DietSuggestion[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sangpa_diet_suggestions');
      if (saved) {
        try { return JSON.parse(saved); } catch (e) {}
      }
    }
    return initialDietSuggestions;
  });

  // Care Team State
  const [careTeam, setCareTeam] = useState<CareTeamMember[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sangpa_care_team');
      if (saved) {
        try { return JSON.parse(saved); } catch (e) {}
      }
    }
    return initialCareTeam;
  });

  const [customCaregiverName, setCustomCaregiverName] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('sangpa_caregiver_name') || '';
    }
    return '';
  });

  const [customCaregiverTitle, setCustomCaregiverTitle] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('sangpa_caregiver_title') || '';
    }
    return '';
  });

  const caregiverUser = {
    name: customCaregiverName || (caregiverRole === 'doctor' ? 'Dr. Anita Verma' : caregiverRole === 'nurse' ? 'Nurse Priya Sharma' : 'Rohan Sharma'),
    role: caregiverRole,
    title: customCaregiverTitle || (caregiverRole === 'doctor' ? 'Lead Geriatrician' : caregiverRole === 'nurse' ? 'Home Care Attendant' : 'Family Member (Son)')
  };
  
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

  const loginCaregiver = (targetRole: CaregiverRole, name?: string, title?: string) => {
    audio.playSuccessJingle();
    setCaregiverRole(targetRole);
    const chosenName = name || (targetRole === 'doctor' ? 'Dr. Anita Verma' : targetRole === 'nurse' ? 'Nurse Priya Sharma' : 'Rohan Sharma');
    const chosenTitle = title || (targetRole === 'doctor' ? 'Lead Geriatrician' : targetRole === 'nurse' ? 'Home Care Attendant' : 'Family Member (Son)');
    setCustomCaregiverName(chosenName);
    setCustomCaregiverTitle(chosenTitle);
    setIsCaregiverAuthenticated(true);
    if (typeof window !== 'undefined') {
      localStorage.setItem('sangpa_caregiver_name', chosenName);
      localStorage.setItem('sangpa_caregiver_title', chosenTitle);
      localStorage.setItem('sangpa_caregiver_role', targetRole);
      localStorage.setItem('sangpa_caregiver_auth', 'true');
    }
    setRole('caregiver');
    setCaregiverScreen('overview');
  };

  const logoutCaregiver = () => {
    audio.playGentleChime();
    setIsCaregiverAuthenticated(false);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('sangpa_caregiver_auth');
    }
    setRole('caregiver_login');
  };

  const updateDietPlan = (p: DietPlan) => {
    setDietPlan(p);
    if (typeof window !== 'undefined') {
      localStorage.setItem('sangpa_diet_plan', JSON.stringify(p));
    }
  };

  const updateMealStatus = (mealId: 'breakfast' | 'lunch' | 'snack' | 'dinner', status: DietMealItem['status'], observation?: string) => {
    setDietPlan(prev => {
      const updatedMeals = prev.meals.map(m => {
        if (m.id === mealId) {
          return {
            ...m,
            status,
            nurseObservation: observation !== undefined ? observation : m.nurseObservation,
            loggedAt: status === 'completed' || status === 'partially_eaten' || status === 'skipped' ? 'Just now' : m.loggedAt
          };
        }
        return m;
      });
      const newPlan = { ...prev, meals: updatedMeals, lastUpdated: 'Just now' };
      if (typeof window !== 'undefined') {
        localStorage.setItem('sangpa_diet_plan', JSON.stringify(newPlan));
      }
      return newPlan;
    });
  };

  const incrementHydration = () => {
    audio.playCuteChime();
    setDietPlan(prev => {
      const nextCount = Math.min(prev.hydrationTarget + 2, prev.hydrationCurrent + 1);
      const newPlan = { ...prev, hydrationCurrent: nextCount, lastUpdated: 'Just now' };
      if (typeof window !== 'undefined') {
        localStorage.setItem('sangpa_diet_plan', JSON.stringify(newPlan));
      }
      return newPlan;
    });
  };

  const addDietSuggestion = (sug: Omit<DietSuggestion, 'id' | 'submittedAt' | 'status'>) => {
    audio.playSuccessJingle();
    const newSug: DietSuggestion = {
      ...sug,
      id: `sug-${Date.now()}`,
      submittedAt: 'Just now',
      status: 'pending'
    };
    setDietSuggestions(prev => {
      const updated = [newSug, ...prev];
      if (typeof window !== 'undefined') {
        localStorage.setItem('sangpa_diet_suggestions', JSON.stringify(updated));
      }
      return updated;
    });
  };

  const reviewDietSuggestion = (
    id: string, 
    decision: 'approved' | 'modified' | 'rejected', 
    doctorResponse?: string, 
    modifiedPlanText?: string
  ) => {
    audio.playGentleChime();
    setDietSuggestions(prev => {
      const targetSug = prev.find(s => s.id === id);
      const updated = prev.map(s => {
        if (s.id === id) {
          return {
            ...s,
            status: decision,
            doctorResponse: doctorResponse || (decision === 'approved' ? 'Approved into clinical diet plan.' : decision === 'modified' ? 'Modified and added.' : 'Reviewed and kept existing balance.'),
            reviewedAt: 'Just now'
          };
        }
        return s;
      });
      if (typeof window !== 'undefined') {
        localStorage.setItem('sangpa_diet_suggestions', JSON.stringify(updated));
      }
      
      // If approved or modified, also automatically update the meal in the diet plan!
      if ((decision === 'approved' || decision === 'modified') && targetSug && targetSug.mealId && targetSug.mealId !== 'general') {
        setDietPlan(currentPlan => {
          const updatedMeals = currentPlan.meals.map(m => {
            if (m.id === targetSug.mealId) {
              const itemToAdd = modifiedPlanText || targetSug.message;
              return {
                ...m,
                items: [...m.items, `★ ${itemToAdd}`],
                notes: `${m.notes} (Doctor approved note: ${itemToAdd})`
              };
            }
            return m;
          });
          const newPlan = { ...currentPlan, meals: updatedMeals, lastUpdated: 'Just now (Updated by Dr. Verma)' };
          if (typeof window !== 'undefined') {
            localStorage.setItem('sangpa_diet_plan', JSON.stringify(newPlan));
          }
          return newPlan;
        });
      }
      
      return updated;
    });
  };

  const addCareTeamMember = (member: Omit<CareTeamMember, 'id'>) => {
    audio.playGentleChime();
    const newMember: CareTeamMember = {
      ...member,
      id: `ct-${Date.now()}`
    };
    setCareTeam(prev => {
      const updated = [...prev, newMember];
      if (typeof window !== 'undefined') {
        localStorage.setItem('sangpa_care_team', JSON.stringify(updated));
      }
      return updated;
    });
  };

  const removeCareTeamMember = (id: string) => {
    audio.playGentleChime();
    setCareTeam(prev => {
      const updated = prev.filter(m => m.id !== id);
      if (typeof window !== 'undefined') {
        localStorage.setItem('sangpa_care_team', JSON.stringify(updated));
      }
      return updated;
    });
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
        caregiverRole,
        setCaregiverRole,
        caregiverUser,
        isCaregiverAuthenticated,
        loginCaregiver,
        logoutCaregiver,
        dietPlan,
        updateDietPlan,
        updateMealStatus,
        incrementHydration,
        dietSuggestions,
        addDietSuggestion,
        reviewDietSuggestion,
        careTeam,
        addCareTeamMember,
        removeCareTeamMember,
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
