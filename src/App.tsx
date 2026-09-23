import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { HeaderToolbar } from './components/common/HeaderToolbar';
import { DeviceFrame } from './components/common/DeviceFrame';
import { VoiceCommandModal } from './components/common/VoiceCommandModal';
import { RuralFallbackCallModal } from './components/common/RuralFallbackCallModal';
import { OpeningScreen } from './components/onboarding/OpeningScreen';

// Patient Components
import { PatientNav } from './components/patient/PatientNav';
import { PatientHome } from './components/patient/PatientHome';
import { PatientReminders } from './components/patient/PatientReminders';
import { PatientRoutine } from './components/patient/PatientRoutine';
import { PatientWellness } from './components/patient/PatientWellness';
import { PatientMemories } from './components/patient/PatientMemories';
import { PatientEmergency } from './components/patient/PatientEmergency';
import { MascotChatScreen } from './components/patient/MascotChatScreen';
import { PatientHelpScreen } from './components/patient/PatientHelpScreen';
import { PatientAuthScreen } from './components/patient/PatientAuthScreen';

// Patient Games
import { GameHub } from './components/patient/games/GameHub';
import { SequenceRecallGame } from './components/patient/games/SequenceRecallGame';
import { RhythmTappingGame } from './components/patient/games/RhythmTappingGame';
import { FlashcardsGame } from './components/patient/games/FlashcardsGame';
import { ObjectSortingGame } from './components/patient/games/ObjectSortingGame';
import { DiceCategoryGame } from './components/patient/games/DiceCategoryGame';
import { DiceMathJourneyGame } from './components/patient/games/DiceMathJourneyGame';
import { DiceMovementGame } from './components/patient/games/DiceMovementGame';

// Caregiver Components
import { CaregiverLoginScreen } from './components/caregiver/CaregiverLoginScreen';
import { CaregiverNav, CaregiverMobileBottomNav } from './components/caregiver/CaregiverNav';
import { CaregiverOverview } from './components/caregiver/CaregiverOverview';
import { CaregiverKnowledgeAssistant } from './components/caregiver/CaregiverKnowledgeAssistant';
import { CaregiverProfileSettings } from './components/caregiver/CaregiverProfileSettings';
import { CaregiverRoutineManager } from './components/caregiver/CaregiverRoutineManager';
import { CaregiverMemoriesManager } from './components/caregiver/CaregiverMemoriesManager';
import { CaregiverGamesConfig } from './components/caregiver/CaregiverGamesConfig';
import { CaregiverProgressAnalytics } from './components/caregiver/CaregiverProgressAnalytics';
import { CaregiverContactsManager } from './components/caregiver/CaregiverContactsManager';
import { CaregiverAlertsPage } from './components/caregiver/CaregiverAlertsPage';
import { CaregiverDietNutrition } from './components/caregiver/CaregiverDietNutrition';
import { CaregiverCareTeam } from './components/caregiver/CaregiverCareTeam';
import { SecurityPrivacyPage } from './components/caregiver/SecurityPrivacyPage';

// Healthcare Component
import { HealthcareWorkerView } from './components/healthcare/HealthcareWorkerView';

const AppContent: React.FC = () => {
  const { 
    role, 
    device,
    patientScreen, 
    caregiverScreen, 
    textScale, 
    highContrast 
  } = useApp();

  React.useEffect(() => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      root.classList.remove('scale-normal', 'scale-large', 'scale-xlarge');
      root.classList.add(`scale-${textScale}`);

      // Dynamically scale root font size so all Tailwind rem units scale up smoothly!
      if (textScale === 'xlarge') {
        root.style.fontSize = '22px';
      } else if (textScale === 'large') {
        root.style.fontSize = '18.5px';
      } else {
        root.style.fontSize = '16px';
      }
    }
  }, [textScale]);

  const getScaleClass = () => {
    switch (textScale) {
      case 'xlarge': return 'scale-xlarge';
      case 'large': return 'scale-large';
      default: return 'scale-normal';
    }
  };

  const renderPatientScreen = () => {
    switch (patientScreen) {
      case 'home': return <PatientHome />;
      case 'activities': return <PatientRoutine />;
      case 'reminders': return <PatientReminders />;
      case 'wellness': return <PatientWellness />;
      case 'memories': return <PatientMemories />;
      case 'emergency': return <PatientEmergency />;
      case 'mascot_chat': return <MascotChatScreen />;
      case 'help': return <PatientHelpScreen />;
      case 'games': return <GameHub />;
      case 'game_sequence': return <SequenceRecallGame />;
      case 'game_rhythm': return <RhythmTappingGame />;
      case 'game_flashcards': return <FlashcardsGame />;
      case 'game_sorting': return <ObjectSortingGame />;
      case 'game_dice_category': return <DiceMathJourneyGame />;
      case 'game_dice_math': return <DiceMathJourneyGame />;
      case 'game_dice_movement': return <DiceMovementGame />;
      default: return <PatientHome />;
    }
  };

  const renderCaregiverScreen = () => {
    switch (caregiverScreen) {
      case 'overview': return <CaregiverOverview />;
      case 'patient_profile': return <CaregiverProfileSettings />;
      case 'routine': return <CaregiverRoutineManager />;
      case 'knowledge_assistant': return <CaregiverKnowledgeAssistant />;
      case 'memories': return <CaregiverMemoriesManager />;
      case 'games_config': return <CaregiverGamesConfig />;
      case 'progress': return <CaregiverProgressAnalytics />;
      case 'contacts': return <CaregiverContactsManager />;
      case 'alerts': return <CaregiverAlertsPage />;
      case 'diet': return <CaregiverDietNutrition />;
      case 'care_team': return <CaregiverCareTeam />;
      case 'healthcare_shared': return <HealthcareWorkerView />;
      case 'security': return <SecurityPrivacyPage />;
      default: return <CaregiverOverview />;
    }
  };

  return (
    <div className={`min-h-screen flex flex-col bg-[#F5F8F1] transition-all ${getScaleClass()} ${highContrast ? 'high-contrast' : ''}`}>
      {/* Top Prototype Controls Banner */}
      <HeaderToolbar />

      {/* Main Experience Viewport */}
      <DeviceFrame>
        {role === 'opening' && <OpeningScreen />}
        {role === 'patient_auth' && <PatientAuthScreen />}
        {role === 'caregiver_login' && <CaregiverLoginScreen />}

        {role === 'patient' && (
          <div className="flex-1 flex flex-col min-h-full">
            <main className="flex-1 flex flex-col">
              {renderPatientScreen()}
            </main>
          </div>
        )}

        {role === 'caregiver' && (
          <div className={`flex-1 flex ${device === 'mobile' ? 'flex-col' : 'flex-col md:flex-row'} min-h-full min-w-0 w-full relative overflow-hidden`}>
            <CaregiverNav />
            <main className="flex-1 min-w-0 flex flex-col overflow-y-auto w-full">
              {renderCaregiverScreen()}
            </main>
          </div>
        )}

        {role === 'healthcare' && (
          <div className="flex-1 flex flex-col min-h-full">
            <main className="flex-1 flex flex-col overflow-y-auto">
              <HealthcareWorkerView />
            </main>
          </div>
        )}
      </DeviceFrame>

      {/* Global Modals */}
      <VoiceCommandModal />
      <RuralFallbackCallModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
