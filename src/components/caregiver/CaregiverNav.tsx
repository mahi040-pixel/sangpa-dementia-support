import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  User, 
  Bot, 
  Heart, 
  TrendingUp, 
  Bell, 
  Menu, 
  X, 
  Sprout, 
  Home, 
  ArrowRight,
  ChevronRight,
  Sparkles,
  UtensilsCrossed,
  Users,
  LogOut
} from 'lucide-react';
import { CaregiverScreen, CaregiverRole } from '../../types';
import { audio } from '../../utils/audio';
import { getCaregiverI18n } from '../../utils/caregiverLocalization';

export const CaregiverNav: React.FC = () => {
  const { 
    caregiverScreen, 
    setCaregiverScreen, 
    alerts, 
    setRole, 
    setPatientScreen, 
    device,
    language,
    patientProfile,
    caregiverRole,
    caregiverUser,
    logoutCaregiver
  } = useApp();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const isMobile = device === 'mobile';

  const t = getCaregiverI18n(language);
  const patientDisplayName = patientProfile.preferredName || patientProfile.name || 'Maya Devi';

  const roleLabel = caregiverRole === 'doctor' 
    ? 'Doctor' 
    : caregiverRole === 'nurse' 
    ? 'Nurse' 
    : 'Family Member';

  const allSliderItems: { 
    screen: CaregiverScreen; 
    label: string; 
    number: string;
    icon: React.FC<{ className?: string }>; 
    description: string;
    visibleFor: CaregiverRole[];
  }[] = [
    { 
      screen: 'patient_profile', 
      number: t.nav.options.patient_profile?.number || '1.', 
      label: t.nav.options.patient_profile?.label || 'Patient Details', 
      icon: User, 
      description: t.nav.options.patient_profile?.description || 'Personal details, routine schedule & quiet hours',
      visibleFor: ['doctor', 'nurse', 'family']
    },
    { 
      screen: 'knowledge_assistant', 
      number: t.nav.options.knowledge_assistant?.number || '2.', 
      label: t.nav.options.knowledge_assistant?.label || 'Knowledge Assistant', 
      icon: Bot, 
      description: t.nav.options.knowledge_assistant?.description || 'AI dementia care advice & guidance',
      visibleFor: ['doctor', 'nurse', 'family']
    },
    { 
      screen: 'memories', 
      number: t.nav.options.memories?.number || '3.', 
      label: t.nav.options.memories?.label || 'Add Memories', 
      icon: Heart, 
      description: t.nav.options.memories?.description || 'Family photos, stories & loved ones',
      visibleFor: ['family'] // ONLY visible to Family Member!
    },
    { 
      screen: 'alerts', 
      number: t.nav.options.alerts?.number || '4.', 
      label: t.nav.options.alerts?.label || 'Alerts', 
      icon: Bell, 
      description: t.nav.options.alerts?.description || 'Missed meds, emergency alerts & notices',
      visibleFor: ['doctor', 'nurse', 'family']
    },
    { 
      screen: 'progress', 
      number: t.nav.options.progress?.number || '5.', 
      label: t.nav.options.progress?.label || 'Weekly Engagement & Improvements', 
      icon: TrendingUp, 
      description: t.nav.options.progress?.description || 'Active minutes & 4-week cognitive curves',
      visibleFor: ['doctor', 'nurse', 'family']
    },
    { 
      screen: 'diet', 
      number: '6.', 
      label: 'Diet & Nutrition', 
      icon: UtensilsCrossed, 
      description: 'Approved meal plans, portions, tracking & suggestions',
      visibleFor: ['doctor', 'nurse', 'family'] // visible to All!
    },
    { 
      screen: 'care_team', 
      number: '7.', 
      label: 'Care Team', 
      icon: Users, 
      description: 'Clinical doctors, nursing staff & family directory',
      visibleFor: ['doctor'] // ONLY visible to Doctor!
    }
  ];

  // Role-filtered navigation items
  const caregiverSliderItems = allSliderItems.filter(item => item.visibleFor.includes(caregiverRole));

  const unreadAlerts = alerts.filter(a => !a.resolved).length;

  const handleNavClick = (screen: CaregiverScreen) => {
    audio.playGentleChime();
    setCaregiverScreen(screen);
    setIsDrawerOpen(false);
  };

  const handleSwitchToPatient = () => {
    audio.playGentleChime();
    setIsDrawerOpen(false);
    setRole('patient');
    setPatientScreen('home');
  };

  return (
    <>
      {/* Desktop & Tablet Sidebar */}
      {!isMobile && (
        <aside className="hidden md:flex w-56 lg:w-64 flex-col bg-[#FAF8F5] border-r border-[#E7E3D8] p-3 lg:p-4 space-y-4 flex-shrink-0 select-none">
          {/* Brand Header */}
          <div className="px-2 pb-3 border-b border-[#E7E3D8] space-y-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#E9F0E1] flex items-center justify-center text-[#344E2E] flex-shrink-0">
                <Sprout className="w-4 h-4 text-[#4E7037]" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="font-serif font-extrabold text-sm text-[#2B4420] tracking-wider block uppercase">{t.nav.portalBrand}</span>
                <span className="text-[11px] font-bold text-emerald-800 block truncate">
                  Caregiver Portal • {roleLabel}
                </span>
              </div>
            </div>

            {/* Active User Pill & Switch Role button */}
            <div className="flex items-center justify-between gap-1 p-2 rounded-xl bg-white border border-[#E7E3D8] text-[11px]">
              <div className="min-w-0 flex-1">
                <span className="font-bold text-stone-900 block truncate">{caregiverUser.name}</span>
                <span className="text-[10px] text-stone-500 block truncate">{caregiverUser.title}</span>
              </div>
              <button
                onClick={() => {
                  audio.playGentleChime();
                  logoutCaregiver();
                }}
                className="text-[10px] font-bold text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 px-2 py-1 rounded-lg transition-colors cursor-pointer flex-shrink-0"
                title="Log out or switch role"
              >
                Switch
              </button>
            </div>
          </div>

          <nav className="flex-1 space-y-1 pr-1 overflow-y-auto min-w-0">
            {/* Overview / Summary button */}
            <button
              onClick={() => handleNavClick('overview')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-2xl text-xs font-semibold transition-all cursor-pointer mb-2 ${
                caregiverScreen === 'overview'
                  ? 'bg-[#DCE7D3] text-[#24421C] font-bold shadow-2xs'
                  : 'text-stone-700 hover:bg-[#EFECE4]'
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <Home className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{t.nav.overview}</span>
              </div>
            </button>

            <span className="text-[10px] font-black uppercase tracking-wider text-stone-400 px-3 py-1 block">
              {t.nav.navigation}
            </span>

            {/* The 5 Slider Items */}
            {caregiverSliderItems.map((item) => {
              const Icon = item.icon;
              const isActive = caregiverScreen === item.screen;
              const badgeCount = item.screen === 'alerts' ? unreadAlerts : 0;

              return (
                <button
                  key={item.screen}
                  onClick={() => handleNavClick(item.screen)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-2xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#DCE7D3] text-[#24421C] font-bold shadow-2xs'
                      : 'text-stone-700 hover:bg-[#EFECE4]'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <Icon className="w-4 h-4 flex-shrink-0 text-[#4E7037]" />
                    <span className="truncate">{item.number} {item.label}</span>
                  </div>
                  {badgeCount > 0 && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-rose-500 text-white flex-shrink-0">
                      {badgeCount}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          <div className="p-2.5 bg-white rounded-2xl border border-[#E7E3D8] text-xs text-stone-600 shadow-2xs">
            <div className="flex items-center justify-between font-bold text-stone-900 gap-1">
              <span className="truncate text-xs">{patientDisplayName}</span>
              <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded-full flex-shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                {t.overview.onlineStatus}
              </span>
            </div>
            <p className="text-[10px] text-stone-500 mt-1 truncate">{t.overview.batteryStatus(86)} • {t.overview.lastSynced}</p>
          </div>
        </aside>
      )}

      {/* Mobile Top Header Bar (3 small lines on extreme left corner) */}
      <header className={`${isMobile ? 'block' : 'md:hidden'} bg-[#FAF8F5] border-b border-[#E7E3D8] px-3 py-2 sticky top-0 z-30 shadow-2xs select-none`}>
        <div className="flex items-center justify-between gap-1.5">
          {/* Extreme Left: 3 Small Lines Hamburger Button & SANGPA Logo + Role */}
          <div className="flex items-center gap-2 min-w-0">
            <button
              onClick={() => {
                audio.playGentleChime();
                setIsDrawerOpen(true);
              }}
              className="p-1.5 -ml-1 rounded-xl bg-white hover:bg-[#EAE6DC] text-[#2F4A24] border border-[#D5DFC9] shadow-2xs transition-colors cursor-pointer active:scale-95 flex-shrink-0"
              title={t.nav.menu}
              aria-label={t.nav.menu}
            >
              <Menu className="w-5 h-5 stroke-[2.4]" />
            </button>

            {/* SANGPA Logo & Role */}
            <div 
              onClick={() => handleNavClick('overview')}
              className="flex items-center gap-1.5 cursor-pointer min-w-0"
            >
              <Sprout className="w-4 h-4 text-[#4E7037] flex-shrink-0" />
              <div className="min-w-0">
                <span className="text-xs font-black tracking-tight text-[#2B4420] block truncate">
                  Caregiver Portal • {roleLabel}
                </span>
                <span className="text-[10px] text-stone-500 font-medium block truncate">
                  {caregiverUser.name}
                </span>
              </div>
            </div>
          </div>

          {/* Extreme Right: Patient Status Pill & Switch Role */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-emerald-800 bg-[#EAF2E6] px-2 py-0.5 rounded-full border border-[#D5DFC9]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
              <span>Online</span>
            </span>

            <button
              onClick={() => {
                audio.playGentleChime();
                logoutCaregiver();
              }}
              className="text-[10px] font-bold text-stone-700 hover:text-stone-900 bg-white border border-[#E7E3D8] hover:bg-stone-100 px-2 py-1 rounded-lg transition-colors cursor-pointer flex-shrink-0"
              title="Switch role / log out"
            >
              Switch
            </button>
          </div>
        </div>
      </header>

      {/* Slide-out Drawer (Opens strictly on the mobile screen container with absolute positioning) */}
      {isDrawerOpen && (
        <div className="absolute inset-0 z-50 flex select-none overflow-hidden animate-in fade-in duration-200">
          {/* Backdrop Overlay inside phone frame */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity cursor-pointer"
            onClick={() => setIsDrawerOpen(false)}
          />

          {/* Drawer Panel sliding from the left inside the mobile screen */}
          <div className="relative w-[85%] max-w-[320px] h-full bg-[#FAF8F5] shadow-2xl flex flex-col z-50 border-r border-[#E7E3D8] overflow-y-auto animate-in slide-in-from-left duration-200">
            {/* Drawer Top Header */}
            <div className="p-4 border-b border-[#E7E3D8] bg-[#F4F1EA] space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Sprout className="w-5 h-5 text-[#4E7037]" />
                  <span className="text-base font-black tracking-widest text-[#2B4420] uppercase font-serif">
                    {t.nav.portalBrand}
                  </span>
                </div>
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-1.5 rounded-full bg-[#E8E4D9] hover:bg-[#DDD8CA] text-stone-700 transition-colors cursor-pointer active:scale-95"
                  title={t.nav.closeMenu}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Role & Logged in user pill */}
              <div className="p-2.5 rounded-2xl bg-white border border-[#E7E3D8] shadow-2xs flex items-center justify-between gap-1">
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 block">
                    Caregiver Portal • {roleLabel}
                  </span>
                  <span className="text-xs font-bold text-stone-900 block truncate">
                    {caregiverUser.name}
                  </span>
                  <span className="text-[10px] text-stone-500 block truncate">
                    {caregiverUser.title}
                  </span>
                </div>
                <button
                  onClick={() => {
                    audio.playGentleChime();
                    logoutCaregiver();
                  }}
                  className="text-[10px] font-bold text-stone-600 bg-stone-100 hover:bg-stone-200 px-2 py-1 rounded-lg transition-colors cursor-pointer flex-shrink-0"
                  title="Switch role"
                >
                  Switch
                </button>
              </div>

              {/* Patient Identity Badge */}
              <div 
                onClick={() => handleNavClick('overview')}
                className="flex items-center justify-between bg-white p-2.5 rounded-2xl border border-[#E7E3D8] shadow-2xs cursor-pointer hover:bg-[#FAF8F5] transition-all"
              >
                <div>
                  <h4 className="text-xs font-black text-stone-900 truncate">{patientDisplayName}</h4>
                  <p className="text-[10px] text-[#4E7037] font-semibold truncate">🟢 {t.overview.doingWellBadge} • {t.overview.conditionName}</p>
                </div>
                <span className="text-[10px] font-bold text-[#344E2E] bg-[#EAF2E6] px-2 py-0.5 rounded-full">
                  {t.nav.overview}
                </span>
              </div>
            </div>

            {/* ONLY The 5 Slider Options requested by the user */}
            <div className="p-3 flex-1 space-y-2 overflow-y-auto">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-stone-500 px-2 pt-1 block">
                {t.nav.navigation}
              </span>

              {caregiverSliderItems.map((item) => {
                const Icon = item.icon;
                const isActive = caregiverScreen === item.screen;
                const badgeCount = item.screen === 'alerts' ? unreadAlerts : 0;

                return (
                  <button
                    key={item.screen}
                    onClick={() => handleNavClick(item.screen)}
                    className={`w-full flex items-center justify-between p-3 rounded-2xl text-left transition-all cursor-pointer active:scale-98 ${
                      isActive
                        ? 'bg-[#DCE7D3] text-[#24421C] font-extrabold shadow-xs border border-[#CCD8C4]'
                        : 'bg-white text-stone-800 hover:bg-[#EFECE4] border border-[#EBE6DC] shadow-2xs'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`p-2 rounded-xl flex-shrink-0 ${
                        isActive 
                          ? 'bg-[#2B4420] text-white' 
                          : 'bg-[#EAF2E6] text-[#345228]'
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="text-xs font-bold block truncate text-[#243B1D]">
                          {item.number} {item.label}
                        </span>
                        <span className="text-[10px] text-stone-500 block truncate">
                          {item.description}
                        </span>
                      </div>
                    </div>

                    {badgeCount > 0 ? (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-rose-500 text-white flex-shrink-0 ml-1">
                        {badgeCount}
                      </span>
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5 text-stone-400 flex-shrink-0 ml-1" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Switch to Patient Companion at Bottom */}
            <div className="p-3 border-t border-[#E7E3D8] bg-[#F4F1EA]">
              <button
                onClick={handleSwitchToPatient}
                className="w-full py-2.5 px-3 rounded-2xl bg-[#344E2E] hover:bg-[#2B4420] text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-2 active:scale-98 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>{t.nav.switchToPatient}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export const CaregiverMobileBottomNav: React.FC = () => {
  return null;
};

