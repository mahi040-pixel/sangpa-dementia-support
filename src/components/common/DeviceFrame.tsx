import React from 'react';
import { useApp } from '../../context/AppContext';

export const DeviceFrame: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { device } = useApp();

  if (device === 'desktop') {
    return (
      <main className="w-full min-h-[calc(100vh-42px)] bg-[#F5F8F1] transition-all">
        {children}
      </main>
    );
  }

  if (device === 'tablet') {
    return (
      <div className="w-full min-h-[calc(100vh-42px)] bg-sangpa-900/10 py-4 sm:py-8 px-2 flex justify-center items-start transition-all overflow-y-auto">
        <div className="w-full max-w-[960px] bg-[#F5F8F1] min-h-[780px] rounded-3xl border-8 border-sangpa-900/80 shadow-2xl overflow-hidden flex flex-col relative">
          {/* Subtle tablet camera pinhole */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-sangpa-900/70 rounded-full z-40" />
          <div className="flex-1 flex flex-col pt-3">
            {children}
          </div>
        </div>
      </div>
    );
  }

  // Mobile frame default
  return (
    <div className="w-full min-h-[calc(100vh-42px)] bg-sangpa-900/15 py-3 sm:py-6 px-2 flex justify-center items-start transition-all overflow-y-auto">
      <div className="w-full max-w-[420px] bg-[#F5F8F1] min-h-[820px] rounded-[2.5rem] border-[10px] border-sangpa-900 shadow-2xl overflow-hidden flex flex-col relative">
        {/* Dynamic Island / Speaker Pill */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-5 bg-sangpa-950 rounded-full z-40 flex items-center justify-between px-3">
          <div className="w-2.5 h-2.5 rounded-full bg-sangpa-800" />
          <div className="w-2 h-2 rounded-full bg-emerald-500/80 animate-pulse" />
        </div>
        <div className="flex-1 flex flex-col pt-6 overflow-y-auto relative">
          {children}
        </div>
        {/* Home swipe indicator */}
        <div className="w-32 h-1 bg-sangpa-900/30 rounded-full mx-auto my-2" />
      </div>
    </div>
  );
};
