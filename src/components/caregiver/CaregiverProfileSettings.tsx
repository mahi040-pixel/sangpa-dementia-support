import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  User, 
  Volume2, 
  Play, 
  Square,
  Moon, 
  MessageSquare, 
  Languages, 
  Check, 
  Save, 
  Sparkles,
  Bot,
  Key,
  ExternalLink,
  AlertTriangle,
  CheckCircle2,
  ArrowLeft
} from 'lucide-react';
import { audio } from '../../utils/audio';
import { LanguageCode } from '../../types';
import { getCaregiverI18n } from '../../utils/caregiverLocalization';
import { 
  elevenLabsService, 
  ELEVENLABS_VOICE_ID, 
  ELEVENLABS_VOICE_NAME, 
  ELEVENLABS_SAMPLE_GREETINGS 
} from '../../services/elevenlabs';

export const CaregiverProfileSettings: React.FC = () => {
  const { 
    patientProfile, 
    updatePatientProfile, 
    language, 
    setLanguage,
    speakMascot,
    setCaregiverScreen
  } = useApp();

  const t = getCaregiverI18n(language);

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [name, setName] = useState(patientProfile.name);
  const [preferredName, setPreferredName] = useState(patientProfile.preferredName);
  const [age, setAge] = useState(patientProfile.age);
  const [condition, setCondition] = useState(patientProfile.condition);

  // Sync state if profile is updated elsewhere
  React.useEffect(() => {
    setName(patientProfile.name);
    setPreferredName(patientProfile.preferredName);
  }, [patientProfile.name, patientProfile.preferredName]);

  const [reminderSound, setReminderSound] = useState<'chime' | 'temple_bell' | 'forest_birds' | 'family_voice'>(
    patientProfile.reminderSound
  );

  const [quietHoursStart, setQuietHoursStart] = useState(patientProfile.quietHours.start);
  const [quietHoursEnd, setQuietHoursEnd] = useState(patientProfile.quietHours.end);
  const [bypassEmergency, setBypassEmergency] = useState(patientProfile.quietHours.bypassForEmergency);

  const [commPref, setCommPref] = useState<'voice' | 'text' | 'pictures' | 'combined'>(
    patientProfile.communicationPref
  );

  const handleNameChange = (val: string) => {
    setName(val);
    updatePatientProfile({ name: val });
  };

  const handlePreferredNameChange = (val: string) => {
    setPreferredName(val);
    updatePatientProfile({ preferredName: val });
  };

  const [elevenLabsKey, setElevenLabsKey] = useState(elevenLabsService.getApiKey());
  const [keySaved, setKeySaved] = useState(false);
  const [testLang, setTestLang] = useState<LanguageCode>(language);
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);
  const [isPlayingHindi, setIsPlayingHindi] = useState(false);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [connectionResult, setConnectionResult] = useState<any>(null);

  const handlePlayAuthenticSample = async () => {
    if (isPlayingPreview) {
      audio.stopSpeaking();
      setIsPlayingPreview(false);
      return;
    }
    setIsPlayingPreview(true);
    setIsPlayingHindi(false);
    await audio.playSuhanaAuthenticSample(() => setIsPlayingPreview(false));
    setIsPlayingPreview(false);
  };

  const handlePlayHindiSample = async () => {
    if (isPlayingHindi) {
      audio.stopSpeaking();
      setIsPlayingHindi(false);
      return;
    }
    setIsPlayingHindi(true);
    setIsPlayingPreview(false);
    await audio.playHindiAuthenticSample(() => setIsPlayingHindi(false));
    setIsPlayingHindi(false);
  };

  const handleTestLanguageVoice = async (langToTest: LanguageCode) => {
    await audio.testSuhanaVoice(langToTest);
  };

  const handleSaveElevenLabsKey = () => {
    elevenLabsService.setApiKey(elevenLabsKey);
    setKeySaved(true);
    audio.playSuccessJingle();
    setTimeout(() => setKeySaved(false), 3000);
  };

  const handleTestConnection = async () => {
    setIsTestingConnection(true);
    elevenLabsService.setApiKey(elevenLabsKey);
    const res = await elevenLabsService.testConnection();
    setConnectionResult(res);
    setIsTestingConnection(false);
    if (res.isValid) {
      audio.playSuccessJingle();
    }
  };

  const handleAuditionSound = (sound: 'chime' | 'temple_bell' | 'forest_birds' | 'family_voice') => {
    if (sound === 'chime') audio.playGentleChime();
    else if (sound === 'temple_bell') audio.playTempleBell();
    else if (sound === 'forest_birds') audio.playForestBirds();
    else {
      audio.testSuhanaVoice(language, `Namaste ${preferredName || name}! It is time for your gentle routine.`);
    }
  };

  const handleSave = () => {
    // Save ElevenLabs API key when saving overall profile
    if (elevenLabsKey) {
      elevenLabsService.setApiKey(elevenLabsKey);
    }

    updatePatientProfile({
      name,
      preferredName,
      age: Number(age),
      condition,
      reminderSound,
      communicationPref: commPref,
      quietHours: {
        enabled: true,
        start: quietHoursStart,
        end: quietHoursEnd,
        bypassForEmergency: bypassEmergency
      }
    });

    audio.playSuccessJingle();
    setSavedSuccess(true);
    speakMascot(`Namaste ${preferredName || name}! Your profile and name have been updated.`, 'speaking');
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  return (
    <div className="flex-1 p-3.5 sm:p-6 lg:p-8 max-w-4xl mx-auto w-full space-y-5 sm:space-y-6 pb-28 md:pb-12 min-w-0">
      {/* Header & Back Action */}
      <div className="border-b border-sangpa-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <button
            onClick={() => {
              audio.playGentleChime();
              setCaregiverScreen('overview');
            }}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#24421C] bg-[#DCE7D3] hover:bg-[#CAD8C6] px-3.5 py-1.5 rounded-full transition-all active:scale-95 cursor-pointer shadow-2xs mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{t.profileSettings.backBtn}</span>
          </button>
          <span className="text-[10px] font-black uppercase tracking-wider text-[#4E7037] block">
            {t.profileSettings.optionBadge}
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-sangpa-900 tracking-tight">
            {t.profileSettings.title}
          </h2>
          <p className="text-xs sm:text-sm text-sangpa-600">
            {t.profileSettings.subtitle(preferredName || name || 'Maya Devi')}
          </p>
        </div>

        <button
          onClick={handleSave}
          className="w-full sm:w-auto py-3 px-6 rounded-2xl bg-sangpa-500 hover:bg-sangpa-600 active:scale-95 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer flex-shrink-0"
        >
          <Save className="w-4 h-4" />
          <span>{savedSuccess ? t.profileSettings.savedToast : t.profileSettings.saveBtn}</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-3.5 bg-emerald-100 border border-emerald-300 rounded-2xl text-emerald-900 text-xs sm:text-sm font-bold flex items-center gap-2.5 animate-fadeIn">
          <Check className="w-5 h-5 text-emerald-700 flex-shrink-0" />
          <span>{t.profileSettings.savedToast}</span>
        </div>
      )}

      {/* 1. Patient Info Card */}
      <div className="bg-white border-2 border-sangpa-200 rounded-3xl p-4 sm:p-6 shadow-sm space-y-4">
        <h3 className="text-base sm:text-lg font-bold text-sangpa-900 flex items-center gap-2">
          <User className="w-5 h-5 text-sangpa-600" />
          <span>{t.profileSettings.patientInfoTitle}</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-sangpa-700 block">{t.profileSettings.legalNameLabel}</label>
            <input 
              type="text" 
              value={name} 
              onChange={e => handleNameChange(e.target.value)}
              className="w-full p-3 rounded-xl border border-sangpa-300 text-sm text-sangpa-900 focus:border-sangpa-500 outline-none bg-sangpa-50/20"
              placeholder="e.g. Kamala Sharma"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-sangpa-700 block">{t.profileSettings.preferredNameLabel}</label>
            <input 
              type="text" 
              value={preferredName} 
              onChange={e => handlePreferredNameChange(e.target.value)}
              className="w-full p-3 rounded-xl border border-sangpa-300 text-sm text-sangpa-900 focus:border-sangpa-500 outline-none ring-1 ring-sangpa-300 bg-sangpa-50/20"
              placeholder="e.g. Kamala Dadi"
            />
            <p className="text-[11px] text-sangpa-600 pt-0.5">
              ✨ The AI mascot will say "Namaste {preferredName || name || '...'}" and display this name on the patient screen.
            </p>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-sangpa-700 block">{t.profileSettings.ageLabel}</label>
            <input 
              type="number" 
              value={age} 
              onChange={e => setAge(Number(e.target.value))}
              className="w-full p-3 rounded-xl border border-sangpa-300 text-sm text-sangpa-900 focus:border-sangpa-500 outline-none bg-sangpa-50/20"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-sangpa-700 block">{t.profileSettings.conditionLabel}</label>
            <input 
              type="text" 
              value={condition} 
              onChange={e => setCondition(e.target.value)}
              className="w-full p-3 rounded-xl border border-sangpa-300 text-sm text-sangpa-900 focus:border-sangpa-500 outline-none bg-sangpa-50/20"
            />
          </div>
        </div>
      </div>

      {/* 2. Language & Voice Customization (Clean vertical cards on mobile) */}
      <div className="bg-white border-2 border-sangpa-200 rounded-3xl p-4 sm:p-6 shadow-sm space-y-4">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-sangpa-900 flex items-center gap-2">
            <Languages className="w-5 h-5 text-sangpa-600" />
            <span>{t.profileSettings.languageTitle}</span>
          </h3>
          <p className="text-xs text-sangpa-600 mt-1">
            {t.profileSettings.languageSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
          {[
            { code: 'hi', label: 'हिन्दी (Hindi)', desc: 'Full Suhana child companion voice & native script' },
            { code: 'as', label: 'অসমীয়া (Assamese)', desc: 'Regional voice synthesis & Assamese prompts' },
            { code: 'en', label: 'English (Indian Accent)', desc: 'Clear Indian English pronunciation' },
            { code: 'bn', label: 'বাংলা (Bengali)', desc: 'Authentic Bengali voice & visual script' },
            { code: 'mni', label: 'মৈতৈলোন্ (Manipuri)', desc: 'Native Manipuri Meitei Mayek & voice' },
            { code: 'nag', label: 'Nagamese (নাগামিজ)', desc: 'Friendly Northeast Nagamese dialect' },
          ].map((l) => (
            <button
              key={l.code}
              type="button"
              onClick={() => setLanguage(l.code as LanguageCode)}
              className={`p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer flex items-center justify-between gap-3 ${
                language === l.code 
                  ? 'bg-sangpa-500 border-sangpa-600 text-white shadow-xs' 
                  : 'bg-white border-sangpa-200 text-sangpa-800 hover:bg-sangpa-50'
              }`}
            >
              <div className="min-w-0 flex-1">
                <span className="font-bold text-xs sm:text-sm block">{l.label}</span>
                <span className={`text-[11px] block mt-0.5 ${language === l.code ? 'text-sangpa-100' : 'text-sangpa-500'}`}>
                  {l.desc}
                </span>
              </div>
              {language === l.code && (
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                  <Check className="w-4 h-4 text-white" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Reminder Sounds & Audition (Clean full cards) */}
      <div className="bg-white border-2 border-sangpa-200 rounded-3xl p-4 sm:p-6 shadow-sm space-y-4">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-sangpa-900 flex items-center gap-2">
            <Volume2 className="w-5 h-5 text-sangpa-600" />
            <span>{t.profileSettings.soundTonesTitle}</span>
          </h3>
          <p className="text-xs text-sangpa-600 mt-1">
            {t.profileSettings.soundTonesSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { id: 'temple_bell', name: t.profileSettings.templeBellLabel, desc: t.profileSettings.templeBellDesc },
            { id: 'chime', name: t.profileSettings.gentleChimesLabel, desc: t.profileSettings.gentleChimesDesc },
            { id: 'forest_birds', name: 'Morning Forest Birds', desc: 'Natural forest chirps evoking peace and morning air' },
            { id: 'family_voice', name: 'Mascot Voice Prompt', desc: 'Sangpa speaks the instruction directly in familiar native dialect' },
          ].map((s) => (
            <div
              key={s.id}
              onClick={() => setReminderSound(s.id as any)}
              className={`cursor-pointer p-4 rounded-2xl border-2 transition-all flex items-center justify-between gap-3 ${
                reminderSound === s.id
                  ? 'bg-sangpa-50 border-sangpa-500 shadow-xs'
                  : 'bg-white border-sangpa-200 hover:border-sangpa-300'
              }`}
            >
              <div className="min-w-0 flex-1">
                <span className="font-bold text-sm text-sangpa-900 block">{s.name}</span>
                <p className="text-xs text-sangpa-600 mt-0.5 leading-relaxed">{s.desc}</p>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAuditionSound(s.id as any);
                }}
                className="p-3 rounded-full bg-sangpa-100 hover:bg-sangpa-200 text-sangpa-800 flex-shrink-0 cursor-pointer active:scale-95 transition-all shadow-2xs"
                title={t.profileSettings.testChimeBtn}
              >
                <Play className="w-4 h-4 fill-current text-sangpa-700" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Sangpa Mascot Voice: ElevenLabs Multilingual v2 */}
      <div className="bg-white border-2 border-sangpa-300 rounded-3xl p-4 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-col gap-3 border-b border-sangpa-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sangpa-500 text-white flex items-center justify-center shadow-xs flex-shrink-0">
              <Bot className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base sm:text-lg font-extrabold text-sangpa-900">
                  {t.profileSettings.voicePersonaTitle}
                </h3>
                <span className="text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-full bg-sangpa-100 text-sangpa-900 border border-sangpa-200">
                  ElevenLabs Multilingual v2
                </span>
              </div>
              <p className="text-xs text-sangpa-600 truncate">
                {t.profileSettings.voicePersonaSubtitle}
              </p>
            </div>
          </div>

          {/* Quick Audition Buttons stacked vertically on mobile */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1">
            <button
              type="button"
              onClick={handlePlayHindiSample}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer active:scale-95 ${
                isPlayingHindi
                  ? 'bg-emerald-600 text-white animate-pulse'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
            >
              {isPlayingHindi ? <Square className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
              <span>{isPlayingHindi ? t.profileSettings.stopAudio : t.profileSettings.playHindiSample}</span>
            </button>

            <button
              type="button"
              onClick={handlePlayAuthenticSample}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer active:scale-95 ${
                isPlayingPreview
                  ? 'bg-emergency-600 text-white animate-pulse'
                  : 'bg-sangpa-800 hover:bg-sangpa-900 text-white'
              }`}
            >
              {isPlayingPreview ? <Square className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
              <span>{isPlayingPreview ? t.profileSettings.stopAudio : t.profileSettings.playEnglishSample}</span>
            </button>
          </div>
        </div>

        {/* Character & Tone Overview */}
        <div className="p-4 bg-sangpa-50/80 rounded-2xl border border-sangpa-200 text-xs text-sangpa-800 space-y-1.5">
          <p className="font-bold text-sangpa-900 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-sangpa-600" />
            <span>{t.profileSettings.voicePersonaName}</span>
          </p>
          <p className="text-sangpa-700 leading-relaxed text-[11px] sm:text-xs">
            {t.profileSettings.voicePersonaDesc(preferredName || name || 'Maya Devi')}
          </p>
        </div>

        {/* Multilingual Voice Converter & Live Audition (1-col on mobile, clean spacing) */}
        <div className="space-y-2.5 pt-1">
          <label className="text-xs font-bold text-sangpa-700 block">
            Audition Sangpa's Voice in Each Supported Language (Tap to Play):
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {[
              { code: 'hi' as LanguageCode, label: 'Hindi (हिन्दी)', icon: '🇮🇳', sample: ELEVENLABS_SAMPLE_GREETINGS.hi },
              { code: 'en' as LanguageCode, label: 'English', icon: '🇬🇧', sample: ELEVENLABS_SAMPLE_GREETINGS.en },
              { code: 'as' as LanguageCode, label: 'Assamese (অসমীয়া)', icon: '🌾', sample: ELEVENLABS_SAMPLE_GREETINGS.as },
              { code: 'bn' as LanguageCode, label: 'Bengali (বাংলা)', icon: '🌺', sample: ELEVENLABS_SAMPLE_GREETINGS.bn },
              { code: 'nag' as LanguageCode, label: 'Nagamese', icon: '🏔️', sample: ELEVENLABS_SAMPLE_GREETINGS.nag },
              { code: 'mni' as LanguageCode, label: 'Manipuri (মৈতৈলোন্)', icon: '🌿', sample: ELEVENLABS_SAMPLE_GREETINGS.mni },
            ].map((item) => (
              <button
                key={item.code}
                type="button"
                onClick={() => {
                  setTestLang(item.code);
                  handleTestLanguageVoice(item.code);
                }}
                className={`p-3 rounded-2xl border text-left transition-all active:scale-95 flex items-center justify-between gap-2.5 cursor-pointer ${
                  testLang === item.code
                    ? 'bg-sangpa-50 border-sangpa-400 ring-2 ring-sangpa-300'
                    : 'bg-white hover:bg-sangpa-50/50 border-sangpa-200'
                }`}
              >
                <div className="min-w-0 flex-1">
                  <span className="text-xs font-bold text-sangpa-900 block truncate">
                    {item.icon} {item.label}
                  </span>
                  <span className="text-[11px] text-sangpa-600 block truncate mt-0.5">
                    {item.sample}
                  </span>
                </div>
                <div className="p-2 rounded-full bg-sangpa-100 hover:bg-sangpa-500 hover:text-white transition-colors flex-shrink-0">
                  <Play className="w-3.5 h-3.5 fill-current" />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* ElevenLabs API Key Setup & Cloud Diagnostics */}
        <div className="pt-3 border-t border-sangpa-100 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <label className="text-xs font-bold text-sangpa-700 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-sangpa-600" />
              <span>ElevenLabs API Key (Cloud Voice Synthesis)</span>
            </label>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full w-fit ${
              elevenLabsService.hasApiKey()
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                : 'bg-sangpa-100 text-sangpa-700 border border-sangpa-200'
            }`}>
              {elevenLabsService.hasApiKey() ? '● Cloud Key Configured' : '● Authentic Local Engine Active'}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row gap-2.5">
            <input
              type="password"
              value={elevenLabsKey}
              onChange={e => {
                setElevenLabsKey(e.target.value);
                elevenLabsService.setApiKey(e.target.value);
              }}
              placeholder="Paste xi-api-key here (e.g. sk_...)"
              className="flex-1 p-2.5 rounded-xl border border-sangpa-300 text-xs font-mono text-sangpa-900 focus:border-sangpa-500 outline-none bg-sangpa-50/20"
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleSaveElevenLabsKey}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-sangpa-500 hover:bg-sangpa-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-2xs active:scale-95 cursor-pointer"
              >
                {keySaved ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
                <span>{keySaved ? 'Saved!' : 'Save Key'}</span>
              </button>
              <button
                type="button"
                onClick={handleTestConnection}
                disabled={isTestingConnection}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-sangpa-800 hover:bg-sangpa-900 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-2xs active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                <Sparkles className={`w-3.5 h-3.5 ${isTestingConnection ? 'animate-spin' : ''}`} />
                <span>{isTestingConnection ? 'Testing...' : 'Test Connection'}</span>
              </button>
            </div>
          </div>

          {/* Connection Test Diagnostic Banner */}
          {connectionResult && (
            <div className={`p-3.5 rounded-xl border text-xs space-y-1.5 animate-fadeIn ${
              connectionResult.isValid && connectionResult.hasVoice
                ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                : connectionResult.isValid && !connectionResult.hasVoice
                ? 'bg-amber-50 border-amber-300 text-amber-900'
                : 'bg-rose-50 border-rose-300 text-rose-900'
            }`}>
              <div className="flex items-start gap-2">
                {connectionResult.isValid && connectionResult.hasVoice ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                )}
                <div className="flex-1 space-y-1">
                  <p className="font-bold">{connectionResult.message}</p>
                  
                  {connectionResult.isValid && !connectionResult.hasVoice && (
                    <div className="pt-1">
                      <p className="text-[11px] text-amber-800">
                        In ElevenLabs, shared voices must be added to your VoiceLab once before API access:
                      </p>
                      <a 
                        href={`https://elevenlabs.io/voices/${ELEVENLABS_VOICE_ID}`} 
                        target="_blank" 
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 mt-1 text-[11px] font-bold text-amber-900 underline hover:text-amber-950"
                      >
                        <span>Open Suhana J on ElevenLabs and click "Add to VoiceLab"</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <p className="text-[11px] text-sangpa-500 leading-relaxed">
            ✨ Sangpa speaks in the joyful child companion persona (Voice ID: <code className="font-mono bg-sangpa-100 px-1 py-0.5 rounded">{ELEVENLABS_VOICE_ID}</code>). With an active ElevenLabs key, cloud synthesis generates dynamic replies. Even without cloud credits, the app uses pre-rendered authentic child voice files across all Hindi interactions.
          </p>
        </div>
      </div>

      {/* 5. Quiet Hours Configuration */}
      <div className="bg-white border-2 border-sangpa-200 rounded-3xl p-4 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
          <h3 className="text-base sm:text-lg font-bold text-sangpa-900 flex items-center gap-2">
            <Moon className="w-5 h-5 text-sangpa-600" />
            <span>{t.profileSettings.quietHoursTitle}</span>
          </h3>
          <span className="text-xs bg-sangpa-100 text-sangpa-800 font-bold px-2.5 py-1 rounded-full w-fit">
            Active Every Night
          </span>
        </div>
        <p className="text-xs text-sangpa-600">
          {t.profileSettings.quietHoursSubtitle}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-sangpa-700 block">{t.profileSettings.sleepStartLabel}</label>
            <input 
              type="time" 
              value={quietHoursStart} 
              onChange={e => setQuietHoursStart(e.target.value)}
              className="w-full p-3 rounded-xl border border-sangpa-300 text-sm font-semibold text-sangpa-900 bg-sangpa-50/20"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-sangpa-700 block">{t.profileSettings.morningWakeLabel}</label>
            <input 
              type="time" 
              value={quietHoursEnd} 
              onChange={e => setQuietHoursEnd(e.target.value)}
              className="w-full p-3 rounded-xl border border-sangpa-300 text-sm font-semibold text-sangpa-900 bg-sangpa-50/20"
            />
          </div>
        </div>

        <div className="flex items-start gap-2.5 pt-1">
          <input 
            type="checkbox" 
            id="bypass" 
            checked={bypassEmergency} 
            onChange={e => setBypassEmergency(e.target.checked)}
            className="w-4 h-4 mt-0.5 rounded text-sangpa-600 focus:ring-sangpa-400 cursor-pointer"
          />
          <label htmlFor="bypass" className="text-xs font-semibold text-sangpa-800 cursor-pointer leading-relaxed">
            {t.profileSettings.emergencyBypassLabel}
          </label>
        </div>
      </div>

      {/* 6. Communication Preference (Clean 1-column cards on mobile) */}
      <div className="bg-white border-2 border-sangpa-200 rounded-3xl p-4 sm:p-6 shadow-sm space-y-4">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-sangpa-900 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-sangpa-600" />
            <span>{t.profileSettings.commPrefTitle}</span>
          </h3>
          <p className="text-xs text-sangpa-600 mt-1">
            {t.profileSettings.commPrefSubtitle(preferredName || name || 'Maya Devi')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
          {[
            { id: 'voice', label: t.profileSettings.commPrefs.voice.label, desc: t.profileSettings.commPrefs.voice.desc },
            { id: 'text', label: t.profileSettings.commPrefs.text.label, desc: t.profileSettings.commPrefs.text.desc },
            { id: 'pictures', label: t.profileSettings.commPrefs.pictures.label, desc: t.profileSettings.commPrefs.pictures.desc },
            { id: 'combined', label: t.profileSettings.commPrefs.combined.label, desc: t.profileSettings.commPrefs.combined.desc },
          ].map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setCommPref(c.id as any)}
              className={`p-3.5 rounded-2xl border-2 text-left sm:text-center transition-all cursor-pointer flex flex-col justify-between ${
                commPref === c.id 
                  ? 'bg-sangpa-500 border-sangpa-600 text-white shadow-xs' 
                  : 'bg-white border-sangpa-200 text-sangpa-800 hover:bg-sangpa-50'
              }`}
            >
              <div>
                <span className="font-bold text-xs sm:text-sm block">{c.label}</span>
                <span className={`text-[11px] block mt-1 ${commPref === c.id ? 'text-sangpa-100' : 'text-sangpa-500'}`}>
                  {c.desc}
                </span>
              </div>
              {commPref === c.id && (
                <span className="text-[10px] font-bold uppercase tracking-wider mt-2 inline-block self-start sm:self-center bg-white/20 px-2 py-0.5 rounded-full">
                  {t.profileSettings.selectedBadge}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Save Action Bar for smooth scroll experience */}
      <div className="pt-2 pb-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => {
            audio.playGentleChime();
            setCaregiverScreen('overview');
          }}
          className="text-xs font-bold text-sangpa-700 hover:text-sangpa-900 px-3.5 py-2.5 rounded-xl hover:bg-sangpa-100 transition-all cursor-pointer text-center sm:text-left"
        >
          {t.profileSettings.backBtn}
        </button>

        <button
          type="button"
          onClick={handleSave}
          className="w-full sm:w-auto py-3.5 px-8 rounded-2xl bg-sangpa-500 hover:bg-sangpa-600 active:scale-95 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>{savedSuccess ? t.profileSettings.savedToast : t.profileSettings.saveBtn}</span>
        </button>
      </div>
    </div>
  );
};
