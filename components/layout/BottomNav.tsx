
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface NavTab {
  id: string;
  label: string;
  path: string;
  icon: (active: boolean) => React.ReactNode;
}

const FLOATING_TAB_ID = 'stats'; // Easily change which tab floats

const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs: NavTab[] = [
    {
      id: 'home',
      label: 'Home',
      path: '/dashboard',
      icon: (active) => (
        <svg className={`w-5 h-5 transition-all duration-300 ${active ? 'nav-active-icon' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    {
      id: 'stats',
      label: 'Stats',
      path: '#stats-disabled', // Placeholder path
      icon: (active) => (
        <svg className={`w-6 h-6 transition-all duration-300 ${active ? 'nav-active-icon text-white' : 'text-white'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
    {
      id: 'settings',
      label: 'Settings',
      path: '#settings-disabled', // Placeholder path
      icon: (active) => (
        <svg className={`w-5 h-5 transition-all duration-300 ${active ? 'nav-active-icon' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    }
  ];

  const handleTabClick = (tab: NavTab) => {
    if (tab.path.startsWith('#')) return; // Ignore disabled placeholders
    navigate(tab.path);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none">
      {/* Wave Notch SVG Background (Visual cutout for FAB) */}
      <div className="absolute left-1/2 -translate-x-1/2 -top-6 w-24 h-12 pointer-events-none overflow-hidden">
        <svg viewBox="0 0 100 40" className="w-full h-full text-slate-900/80 fill-current opacity-95" style={{ backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)' }}>
          <path d="M0 40 Q50 40 50 0 Q50 40 100 40 Z" />
        </svg>
      </div>

      {/* Main Nav Bar */}
      <nav 
        className="relative bg-slate-900/85 backdrop-blur-xl border-t border-white/10 flex items-center justify-around pointer-events-auto shadow-[0_-10px_40px_rgba(0,0,0,0.3)] h-[58px]"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path;
          const isFloating = tab.id === FLOATING_TAB_ID;

          if (isFloating) {
            return (
              <div key={tab.id} className="relative w-16 h-full flex items-center justify-center">
                <button
                  onClick={() => handleTabClick(tab)}
                  className="absolute -top-7 w-12 h-12 bg-gradient-to-tr from-blue-600 to-blue-400 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/40 border-4 border-slate-950 active:scale-90 transition-all z-20"
                >
                  {tab.icon(isActive)}
                </button>
                <span className="absolute bottom-1 text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none">
                  {tab.label}
                </span>
              </div>
            );
          }

          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab)}
              className={`flex-1 h-full flex flex-col items-center justify-center transition-all relative ${isActive ? 'text-blue-400' : 'text-slate-500'}`}
            >
              <div className="flex flex-col items-center">
                {tab.icon(isActive)}
                <span className="text-[9px] mt-1 font-black uppercase tracking-[0.15em] leading-none">
                  {tab.label}
                </span>
              </div>
              
              {/* Active Indicator Pill */}
              {isActive && (
                <div className="absolute bottom-1.5 w-1 h-1 bg-blue-400 rounded-full shadow-[0_0_8px_rgba(96,165,250,0.8)]" />
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default BottomNav;
