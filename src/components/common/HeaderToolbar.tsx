import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Smartphone, 
  Tablet, 
  Monitor, 
  Wifi, 
  WifiOff, 
  Type, 
  Eye, 
  Languages, 
  RefreshCw,
  User,
  HeartHandshake,
  Stethoscope
} from 'lucide-react';
import { LanguageCode, TextScale } from '../../types';

export const HeaderToolbar: React.FC = () => {
  const {
    role,
    setRole,
    device,
    setDevice,
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
    setPatientScreen,
    setCaregiverScreen,
  } = useApp();

  const handleRoleChange = (newRole: 'opening' | 'patient' | 'caregiver' | 'healthcare') => {
    setRole(newRole);
    if (newRole === 'patient') setPatientScreen('home');
    if (newRole === 'caregiver') setCaregiverScreen('overview');
  };

  return (
    <header style={{ fontSize: '12px' }} className="bg-sangpa-900 text-sangpa-100 px-3 py-2 text-xs border-b border-sangpa-800 shadow-sm select-none sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        {/* Logo and Brand */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full overflow-hidden border border-sangpa-400 bg-sangpa-100 flex-shrink-0">
            <img src="/assets/mascot.png" alt="SANGPA Mascot" className="w-full h-full object-cover" />
          </div>
          <span className="font-bold text-sm tracking-wide text-white">SANGPA</span>
        </div>

        {/* Role Switcher - Exactly 2 Tabs: Patient App & Caregiver */}
        <div className="flex items-center bg-sangpa-950/70 p-0.5 rounded-lg border border-sangpa-800">
          <button
            onClick={() => handleRoleChange('patient')}
            className={`px-3 py-1 rounded transition-all text-xs font-bold flex items-center gap-1.5 ${
              role === 'patient' ? 'bg-sangpa-500 text-white shadow-sm' : 'text-sangpa-300 hover:text-white'
            }`}
          >
            <HeartHandshake className="w-3.5 h-3.5" />
            <span>Patient App</span>
          </button>
          <button
            onClick={() => handleRoleChange('caregiver')}
            className={`px-3 py-1 rounded transition-all text-xs font-bold flex items-center gap-1.5 ${
              role === 'caregiver' ? 'bg-sangpa-500 text-white shadow-sm' : 'text-sangpa-300 hover:text-white'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Caregiver</span>
          </button>
        </div>

        {/* Viewport Frame Mode */}
        <div className="hidden md:flex items-center bg-sangpa-950/70 p-0.5 rounded-lg border border-sangpa-800">
          <button
            onClick={() => setDevice('mobile')}
            title="Mobile Phone View (390px)"
            className={`p-1.5 rounded transition-colors ${device === 'mobile' ? 'bg-sangpa-600 text-white' : 'text-sangpa-400 hover:text-white'}`}
          >
            <Smartphone className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setDevice('tablet')}
            title="Tablet View (820px)"
            className={`p-1.5 rounded transition-colors ${device === 'tablet' ? 'bg-sangpa-600 text-white' : 'text-sangpa-400 hover:text-white'}`}
          >
            <Tablet className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setDevice('desktop')}
            title="Responsive Full Viewport"
            className={`p-1.5 rounded transition-colors ${device === 'desktop' ? 'bg-sangpa-600 text-white' : 'text-sangpa-400 hover:text-white'}`}
          >
            <Monitor className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Accessibility & Offline Controls */}
        <div className="flex items-center gap-2">
          {/* Offline simulator toggle */}
          <button
            onClick={() => setIsOffline(prev => !prev)}
            className={`flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium transition-all ${
              isOffline
                ? 'bg-amber-600/90 text-amber-100 hover:bg-amber-600'
                : 'bg-sangpa-800/80 text-sangpa-300 hover:text-white'
            }`}
            title="Toggle Offline Simulation"
          >
            {isOffline ? <WifiOff className="w-3.5 h-3.5 text-amber-300" /> : <Wifi className="w-3.5 h-3.5 text-sangpa-400" />}
            <span className="hidden sm:inline">{isOffline ? 'Offline Mode' : 'Online'}</span>
            {pendingSyncCount > 0 && (
              <span className="px-1 bg-amber-400 text-amber-950 font-bold rounded-full text-[9px] animate-pulse">
                {pendingSyncCount}
              </span>
            )}
          </button>

          {/* Sync action if pending */}
          {pendingSyncCount > 0 && (
            <button
              onClick={syncNow}
              title="Sync pending changes"
              className="p-1 text-sangpa-200 hover:text-white transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            </button>
          )}

          {/* Text Size Scaler: M | L | XL */}
          <div className="flex items-center bg-sangpa-950/80 rounded-lg border border-sangpa-800 p-0.5 gap-0.5" title="Change text size: Medium, Large, Extra Large">
            <Type className="w-3 h-3 text-sangpa-400 ml-1 mr-0.5 flex-shrink-0" />
            {(['normal', 'large', 'xlarge'] as TextScale[]).map((scale) => {
              const label = scale === 'normal' ? 'M' : scale === 'large' ? 'L' : 'XL';
              const isActive = textScale === scale;
              return (
                <button
                  key={scale}
                  onClick={() => setTextScale(scale)}
                  className={`px-1.5 py-0.5 rounded text-[10px] font-extrabold transition-all ${
                    isActive
                      ? 'bg-sangpa-500 text-white shadow-xs font-black ring-1 ring-white/20'
                      : 'text-sangpa-300 hover:text-white hover:bg-sangpa-800/60'
                  }`}
                  title={`Set text size to ${label} (${scale})`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* High Contrast Toggle */}
          <button
            onClick={() => setHighContrast(prev => !prev)}
            className={`p-1 rounded-md transition-colors ${
              highContrast ? 'bg-amber-400 text-sangpa-950' : 'text-sangpa-400 hover:text-white'
            }`}
            title="Toggle High Contrast for Elderly / Low Vision"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>

          {/* Language Selector */}
          <div className="flex items-center gap-1 bg-sangpa-950/70 px-1.5 py-0.5 rounded-md border border-sangpa-800">
            <Languages className="w-3 h-3 text-sangpa-400" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as LanguageCode)}
              className="bg-transparent text-sangpa-100 text-[11px] font-medium outline-none cursor-pointer"
            >
              <option value="hi" className="bg-sangpa-900 text-white">हिन्दी (Hindi)</option>
              <option value="as" className="bg-sangpa-900 text-white">অসমীয়া (Assamese)</option>
              <option value="en" className="bg-sangpa-900 text-white">English</option>
              <option value="bn" className="bg-sangpa-900 text-white">বাংলা (Bengali)</option>
              <option value="mni" className="bg-sangpa-900 text-white">মৈতৈলোন্ (Manipuri)</option>
              <option value="nag" className="bg-sangpa-900 text-white">Nagamese (নাগামিজ)</option>
              <option value="es" className="bg-sangpa-900 text-white">Español (Spanish)</option>
            </select>
          </div>
        </div>
      </div>
    </header>
  );
};
