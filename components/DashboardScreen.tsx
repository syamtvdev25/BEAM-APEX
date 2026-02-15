
import React, { useMemo } from 'react';
import { useAuth } from '../App';
import { useNavigate } from 'react-router-dom';
import { User } from '../types';

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
}

const DashboardScreen: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Robust user resolution: Context -> LocalStorage fallback
  const effectiveUser = useMemo(() => {
    if (user && user.displayName) return user;
    const stored = localStorage.getItem('authUser');
    if (stored) {
      try {
        return JSON.parse(stored) as User;
      } catch (e) {
        return null;
      }
    }
    return null;
  }, [user]);

  // Helper to generate initials from displayName
  const getInitials = (name: string) => {
    if (!name) return "??";
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems: MenuItem[] = [
    { 
      id: 'search_primary', 
      label: 'SEARCH', 
      path: '/search',
      icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg> 
    },
    { 
      id: 'item_query', 
      label: 'ITEM QUERY', 
      path: '/item-query',
      icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg> 
    },
    { 
      id: 'pc', 
      label: 'PC', 
      path: '/pc',
      icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/></svg>
    },
    { 
      id: 'cv', 
      label: 'CV', 
      path: '/cv',
      icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"/></svg>
    },
    { 
      id: 'axles', 
      label: 'AXLES', 
      path: '/axles',
      icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
    },
    { 
      id: 'engines', 
      label: 'ENGINES', 
      path: '/engines',
      icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z"/></svg>
    },
    { 
      id: 'search', 
      label: 'DESCRIPTION SEARCH', 
      path: '/description-search',
      icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
    },
    { 
      id: 'bearings', 
      label: 'BEARINGS', 
      path: '/bearings',
      icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>
    },
    { 
      id: 'batteries', 
      label: 'BATTERIES', 
      path: '/batteries',
      icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
    },
    { 
      id: 'import', 
      label: 'IMPORT', 
      path: '/import',
      icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"/></svg>
    },
  ];

  const handleMenuPress = (item: MenuItem) => {
    navigate(item.path);
  };

  return (
    <div className="flex-1 flex flex-col bg-gradient-to-b from-blue-50/50 to-white">
      {/* Premium Header with Fixed User Display */}
      <header className="bg-gradient-to-r from-[#003366] to-[#00599F] px-4 xs:px-6 py-4 flex items-center justify-between sticky top-0 z-30 shadow-xl rounded-b-[24px]">
        {/* Left Section: Title & Customer Name */}
        <div className="flex flex-col min-w-0">
          <h2 className="text-[10px] font-black text-white/70 tracking-widest uppercase leading-none mb-1">Apex-Ecom</h2>
          {effectiveUser && (
            <span className="text-[13px] font-black text-white uppercase tracking-tight leading-tight truncate max-w-[200px] sm:max-w-[300px]">
              {effectiveUser.displayName}
            </span>
          )}
        </div>
        
        {/* Right Section: Avatar & Logout */}
        <div className="flex items-center space-x-2 sm:space-x-4 ml-2 shrink-0">
          {effectiveUser && (
            <div className="flex items-center space-x-2">
              {/* User Avatar Circle with Initials */}
              <div className="w-9 h-9 bg-orange-500 rounded-xl flex items-center justify-center shadow-lg border-2 border-white/20 shrink-0">
                <span className="text-sm font-black text-white tracking-tighter">
                  {getInitials(effectiveUser.displayName)}
                </span>
              </div>
            </div>
          )}
          
          <button 
            onClick={handleLogout}
            className="flex items-center justify-center p-2.5 rounded-xl border border-white/20 bg-white/10 hover:bg-red-500/80 transition-all active:scale-90 shadow-sm group"
            title="Logout"
          >
            <svg className="w-5 h-5 text-white group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </header>

      {/* Grid Menu Content Area */}
      <main className="flex-1 p-5 overflow-y-auto">
        <div className="grid grid-cols-2 gap-5">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleMenuPress(item)}
              className="flex flex-col items-center justify-center aspect-square bg-white rounded-[32px] shadow-sm shadow-blue-900/5 border border-slate-50 p-6 transition-all hover:shadow-xl hover:-translate-y-1 active:scale-95 group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-transparent to-blue-50/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10 w-16 h-16 bg-blue-50/50 rounded-2xl flex items-center justify-center mb-4 transition-all group-hover:scale-110 group-hover:bg-white group-hover:shadow-lg duration-300">
                <div className="text-[#00599F] transition-colors group-hover:text-[#003366]">
                  {item.icon}
                </div>
                <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-[#F37021] rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <span className="relative z-10 text-[11px] font-black text-slate-700 text-center uppercase tracking-[0.15em] leading-tight">
                {item.label}
              </span>
            </button>
          ))}
        </div>
        
        <div className="py-12 flex flex-col items-center justify-center space-y-2">
           <div className="w-8 h-0.5 bg-blue-100 rounded-full" />
           <p className="text-[11px] font-bold text-[#003366] tracking-[0.2em] uppercase">APEX-ECOMMERCE FOR AUTO SPARE PARTS</p>
        </div>
      </main>

      <footer className="bg-gradient-to-r from-[#003366] to-[#00599F] py-2 flex flex-col items-center border-t border-white/10 shadow-inner">
        <p className="text-[9px] font-black text-white/50 tracking-[0.3em] uppercase">
          Powered by SKTV © 2026
        </p>
      </footer>

      <nav className="bg-slate-900/95 backdrop-blur-xl border-t border-slate-800 px-6 py-4 flex justify-around items-center sticky bottom-0 z-30 shadow-[0_-10px_40px_rgba(0,0,0,0.3)]">
        <div 
          className="flex flex-col items-center text-blue-400 cursor-pointer group active:scale-95 transition-all" 
          onClick={() => navigate('/dashboard')}
        >
          <div className="w-10 h-10 bg-slate-800 rounded-2xl flex items-center justify-center shadow-inner border border-slate-700 group-hover:bg-slate-700 transition-colors">
             <span className="text-xl">🏠</span>
          </div>
          <span className="text-[10px] mt-2 font-black uppercase tracking-[0.2em]">Home</span>
        </div>
        
        <div className="flex flex-col items-center text-slate-600 cursor-not-allowed">
          <div className="w-10 h-10 flex items-center justify-center opacity-30">
             <span className="text-xl">📊</span>
          </div>
          <span className="text-[10px] mt-2 font-black uppercase tracking-[0.2em]">Stats</span>
        </div>
        
        <div className="flex flex-col items-center text-slate-600 cursor-not-allowed">
          <div className="w-10 h-10 flex items-center justify-center opacity-30">
             <span className="text-xl">⚙️</span>
          </div>
          <span className="text-[10px] mt-2 font-black uppercase tracking-[0.2em]">Settings</span>
        </div>
      </nav>
    </div>
  );
};

export default DashboardScreen;
