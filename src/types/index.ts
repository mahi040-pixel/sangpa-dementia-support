export type LanguageCode = 'en' | 'hi' | 'as' | 'bn' | 'mni' | 'nag' | 'es';

export type TextScale = 'normal' | 'large' | 'xlarge';

export type UserRole = 'opening' | 'patient' | 'caregiver' | 'healthcare' | 'caregiver_login';

export type DeviceViewport = 'mobile' | 'tablet' | 'desktop';

export type MascotState = 'idle' | 'listening' | 'thinking' | 'speaking' | 'offline' | 'help';

export type PatientScreen = 
  | 'home'
  | 'activities'
  | 'reminders'
  | 'games'
  | 'game_sequence'
  | 'game_rhythm'
  | 'game_flashcards'
  | 'game_sorting'
  | 'game_dice_category'
  | 'game_dice_math'
  | 'game_dice_movement'
  | 'wellness'
  | 'memories'
  | 'emergency'
  | 'mascot_chat'
  | 'help';

export type CaregiverRole = 'doctor' | 'nurse' | 'family';

export type CaregiverScreen = 
  | 'overview'
  | 'patient_profile'
  | 'routine'
  | 'knowledge_assistant'
  | 'memories'
  | 'games_config'
  | 'progress'
  | 'contacts'
  | 'alerts'
  | 'healthcare_shared'
  | 'security'
  | 'diet'
  | 'care_team';

export interface ReminderItem {
  id: string;
  title: string;
  time: string;
  category: 'medicine' | 'hydration' | 'meal' | 'exercise' | 'activity' | 'appointment' | 'family';
  status: 'upcoming' | 'completed' | 'snoozed' | 'missed';
  icon: string;
  audioText: string;
  instructions: string;
  dosage?: string;
  isOffline: boolean;
  notifyCaregiverIfMissed: boolean;
  scheduledTime: string;
}

export interface DailyActivity {
  id: string;
  title: string;
  time: string;
  shortInstruction: string;
  icon: string;
  completed: boolean;
  isCurrent: boolean;
  category: string;
  audioText: string;
}

export interface CognitiveGame {
  id: 'sequence' | 'rhythm' | 'flashcards' | 'sorting' | 'dice_category' | 'dice_movement' | 'dice_math';
  title: string;
  titleHi: string;
  description: string;
  icon: string;
  category: 'cognitive' | 'physical';
  difficultyLevel: number; // 1 to 5
  accuracy: number;
  streak: number;
  lastPlayed: string;
  isCaregiverRecommended: boolean;
  offlineReady: boolean;
}

export type DiceMathDifficulty = 1 | 2 | 3 | 'easy' | 'moderate' | 'advanced' | 'adaptive';
export type DiceMathActivityType = 
  | 'counting' 
  | 'addition' 
  | 'subtraction' 
  | 'comparison' 
  | 'sequence' 
  | 'shopping'
  | 'counting_dots'
  | 'adding_numbers'
  | 'subtracting_objects'
  | 'choosing_bigger'
  | 'number_sequences'
  | 'shopping_food';

export interface DiceMathConfig {
  startingDifficulty: DiceMathDifficulty;
  difficulty?: DiceMathDifficulty;
  visualSupport: boolean;
  voiceInstructions: boolean;
  sessionLength: number; // 3, 5, 8, 10
  allowedActivities: DiceMathActivityType[];
  enabledActivities?: DiceMathActivityType[];
}

export interface DiceMathSessionRecord {
  id: string;
  timestamp: string;
  dateStr?: string;
  accuracy: number;
  hintsUsed: number;
  difficulty?: DiceMathDifficulty;
  difficultyReached?: number; // 1 to 3
  roundsAttempted: number;
  roundsCorrect: number;
  roundsCompleted: number;
  completed?: boolean;
  postGameMood?: 'happy' | 'calm' | 'loved';
  mood?: 'happy' | 'calm' | 'loved';
  activityType?: DiceMathActivityType;
  activitiesCompleted?: string[];
}

export interface MemoryItem {
  id: string;
  title: string;
  relationship: string;
  caption: string;
  audioNote: string;
  imageUrl: string;
  dateOrEra: string;
  location: string;
  isFavorite: boolean;
  inFlashcards: boolean;
}

export interface CaregiverAlert {
  id: string;
  timestamp: string;
  type: 'missed_medicine' | 'missed_hydration' | 'inactivity' | 'emergency' | 'device_offline' | 'appointment';
  severity: 'info' | 'needs_attention' | 'urgent';
  title: string;
  description: string;
  recommendedAction: string;
  resolved: boolean;
}

export interface ContactItem {
  id: string;
  name: string;
  relation: string;
  phone: string;
  role: 'family' | 'doctor' | 'caregiver' | 'emergency';
  avatar: string;
  canCallInEmergency: boolean;
  receivesAlerts: boolean;
  isPrimary: boolean;
}

export interface PatientProfile {
  name: string;
  preferredName: string;
  age: number;
  condition: string;
  avatar: string;
  language: LanguageCode;
  reminderSound: 'chime' | 'temple_bell' | 'forest_birds' | 'family_voice';
  communicationPref: 'voice' | 'text' | 'pictures' | 'combined';
  quietHours: {
    enabled: boolean;
    start: string;
    end: string;
    bypassForEmergency: boolean;
  };
  battery: number;
  lastActive: string;
  isOnline: boolean;
}

export interface DietMealItem {
  id: 'breakfast' | 'lunch' | 'snack' | 'dinner';
  name: string;
  time: string;
  items: string[];
  portion: string;
  notes: string;
  status: 'upcoming' | 'completed' | 'partially_eaten' | 'skipped';
  nurseObservation?: string;
  loggedAt?: string;
}

export interface DietPlan {
  id: string;
  approvedBy: string;
  lastUpdated: string;
  hydrationTarget: number;
  hydrationCurrent: number;
  guidelines?: string;
  restrictions?: string[];
  meals: DietMealItem[];
}

export interface DietSuggestion {
  id: string;
  submittedByRole: CaregiverRole;
  submittedByName: string;
  submittedAt: string;
  mealId?: 'breakfast' | 'lunch' | 'snack' | 'dinner' | 'general';
  message: string;
  status: 'pending' | 'approved' | 'modified' | 'rejected';
  doctorResponse?: string;
  reviewedAt?: string;
}

export interface CareTeamMember {
  id: string;
  name: string;
  role: 'Doctor' | 'Nurse' | 'Family Member';
  specialty: string;
  status: string;
  phone: string;
  email: string;
  avatar?: string;
}

