
import React, { useState, useMemo } from 'react';
import { useAuth } from '../App';
import { useNavigate } from 'react-router-dom';
import { User } from '../types';
import BottomNav from './layout/BottomNav';
import { brandingConfig } from '../config/brandingConfig';
import PageLayout from './layout/PageLayout';

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
}

const DashboardScreen: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showInfo, setShowInfo] = useState(false);

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
    { id: 'search_primary', label: 'SEARCH', path: '/search', icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg> },
    { id: 'erp', label: 'ERP', path: '/erp', icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg> },
    { id: 'pc', label: 'PC', path: '/pc', icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/></svg> },
    { id: 'cv', label: 'CV', path: '/cv', icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"/></svg> },
    { id: 'axles', label: 'AXLES', path: '/axles', icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg> },
    { id: 'engines', label: 'ENGINES', path: '/engines', icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z"/></svg> },
    { id: 'search', label: 'DESCRIPTION SEARCH', path: '/description-search', icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg> },
    { id: 'bearings', label: 'BEARINGS', path: '/bearings', icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg> },
    { id: 'batteries', label: 'BATTERIES', path: '/batteries', icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg> },
    { id: 'import', label: 'IMPORT', path: '/import', icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"/></svg> },
  ];

  const coreMenuItems = useMemo(() => {
    return menuItems.filter(item => 
      ['search_primary', 'erp', 'pc', 'cv', 'axles', 'engines'].includes(item.id)
    );
  }, [menuItems]);

  const secondaryMenuItems = useMemo(() => {
    return menuItems.filter(item => 
      !['search_primary', 'erp', 'pc', 'cv', 'axles', 'engines'].includes(item.id)
    );
  }, [menuItems]);

  return (
    <PageLayout className="bg-gradient-to-b from-slate-50 to-white">
      {/* Premium Gradient Header Card */}
      <header 
        className="bg-gradient-to-r from-[#0a1b33] via-[#003366] to-[#0d5296] px-4 xs:px-6 flex items-center justify-between sticky top-0 z-50 shadow-[0_10px_30px_rgba(0,51,102,0.12)] rounded-b-[28px] border-b border-white/10 shrink-0"
        style={{ paddingTop: 'calc(env(safe-area-inset-top, 0px) + 1.25rem)', paddingBottom: '1.25rem' }}
      >
        <div className="flex items-center space-x-3.5 min-w-0">
          <div className="h-10 w-10 rounded-xl bg-white p-1 flex items-center justify-center shadow-sm overflow-hidden shrink-0">
            <img 
              src="/logo.png" 
              alt="Apex-Ecom" 
              className="h-full w-full object-contain"
            />
          </div>
          <div className="flex flex-col min-w-0">
            <h2 className="text-[10px] font-black text-white/60 tracking-[0.2em] uppercase leading-none mb-1">{brandingConfig.appName}</h2>
            {effectiveUser && (
              <span className="text-sm font-black text-white uppercase tracking-tight leading-tight truncate max-w-[140px] sm:max-w-[240px]">
                {effectiveUser.displayName}
              </span>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-2 shrink-0">
          {effectiveUser && (
            <div className="w-9 h-9 bg-gradient-to-tr from-amber-500 to-orange-500 rounded-xl flex items-center justify-center shadow-md border border-white/15 shrink-0">
              <span className="text-xs font-black text-white tracking-widest leading-none">
                {getInitials(effectiveUser.displayName)}
              </span>
            </div>
          )}

          {/* Premium Circular Custom Information Button */}
          <button
            onClick={() => setShowInfo(true)}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/10 border border-white/15 hover:bg-white/20 active:scale-90 transition-all text-white shadow-sm"
            title="App Information"
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
          
          <button 
            onClick={handleLogout}
            className="flex items-center justify-center p-2.5 rounded-xl border border-white/10 bg-white/10 hover:bg-red-500/80 transition-all active:scale-95 shadow-sm group"
            title="Logout"
          >
            <svg className="w-4 h-4 text-white group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </header>

      <main className="flex-1 p-5 overflow-y-auto no-scrollbar scroll-smooth" style={{ WebkitOverflowScrolling: 'touch' }}>
        
        {/* 1. Core Modules (6 tiles style) */}
        <div className="mb-6">
          <div className="flex items-center justify-between px-1 mb-3.5">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.22em] leading-none">Core Modules</h4>
            <span className="text-[9px] font-black text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100 uppercase tracking-widest leading-none">6 active</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {coreMenuItems.map((item) => {
              // Get custom luxury brand accent styles for core tiles
              let iconTheme = 'bg-blue-50/75 text-[#00599F] border-blue-100/40';
              if (item.id === 'search_primary') {
                iconTheme = 'bg-blue-50 text-blue-600 border-blue-100/50';
              } else if (item.id === 'erp') {
                iconTheme = 'bg-teal-50 text-teal-600 border-teal-100/50';
              } else if (item.id === 'pc') {
                iconTheme = 'bg-indigo-50 text-indigo-600 border-indigo-100/50';
              } else if (item.id === 'cv') {
                iconTheme = 'bg-violet-50 text-violet-600 border-violet-100/50';
              } else if (item.id === 'axles') {
                iconTheme = 'bg-amber-50 text-amber-600 border-amber-100/50';
              } else if (item.id === 'engines') {
                iconTheme = 'bg-rose-50 text-rose-600 border-rose-100/50';
              }

              return (
                <button
                  key={item.id}
                  onClick={() => navigate(item.path)}
                  className="flex flex-col items-center justify-center p-5 bg-white rounded-[28px] shadow-[0_8px_30px_rgba(0,0,0,0.02)] hover:shadow-[0_15px_45px_rgba(0,0,0,0.06)] border border-slate-100/80 transition-all hover:-translate-y-1 active:scale-95 group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent to-blue-50/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  {/* Premium Corner Element */}
                  <div className="absolute top-0 right-0 w-10 h-10 bg-gradient-to-bl from-slate-50 to-transparent rounded-bl-full pointer-events-none opacity-60" />

                  <div className={`relative z-10 w-14 h-14 ${iconTheme} border rounded-2xl flex items-center justify-center mb-3.5 transition-all group-hover:scale-110 duration-300 shadow-sm`}>
                    <div className="transition-transform group-hover:rotate-3">
                      {item.icon}
                    </div>
                  </div>
                  
                  <span className="relative z-10 text-[10px] font-extrabold text-[#111c30] text-center uppercase tracking-[0.14em] leading-tight">
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Secondary Tools Header and Grid */}
        {secondaryMenuItems.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center justify-between px-1 mb-3">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.22em] leading-none">Secondary Tools</h4>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{secondaryMenuItems.length} more</span>
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              {secondaryMenuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => navigate(item.path)}
                  className="flex items-center gap-3 p-3.5 bg-slate-50/50 hover:bg-white rounded-2xl border border-slate-100/60 transition-all hover:shadow-[0_8px_25px_rgba(0,0,0,0.02)] active:scale-95 group relative overflow-hidden text-left"
                >
                  <div className="w-10 h-10 bg-white group-hover:bg-blue-50 text-slate-500 group-hover:text-blue-600 rounded-xl flex items-center justify-center shrink-0 border border-slate-150/40 transition-colors shadow-sm">
                    <div className="scale-75">
                      {item.icon}
                    </div>
                  </div>
                  <div className="min-w-0">
                    <span className="block text-[9px] font-black text-slate-700 uppercase tracking-wider truncate">
                      {item.label}
                    </span>
                    <span className="block text-[8px] font-bold text-slate-400 uppercase tracking-[0.1em] mt-0.5 truncate">
                      Utility
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
        
        <div className="py-8 flex flex-col items-center justify-center space-y-2">
           <div className="w-8 h-0.5 bg-blue-100 rounded-full" />
           <p className="text-[10px] font-bold text-blue-900/60 tracking-[0.25em] uppercase">APEX-ECOMMERCE</p>
        </div>
      </main>

      {/* Modern, elegant close footer */}
      <footer className="bg-white py-3 flex flex-col items-center border-t border-slate-100 shadow-inner shrink-0">
        <p className="text-[9px] font-black text-slate-400 tracking-[0.25em] uppercase leading-none">
          {brandingConfig.poweredBy}
        </p>
      </footer>

      {/* Bottom Navigation */}
      <BottomNav />

      {/* Premium Centered Information Modal */}
      {showInfo && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center p-4">
          {/* Backdrop Blur overlay */}
          <div 
            className="fixed inset-0 bg-[#020813]/60 backdrop-blur-sm transition-opacity duration-300" 
            onClick={() => setShowInfo(false)}
          />
          
          {/* Content container */}
          <div className="relative bg-white w-full max-w-sm rounded-[32px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] border border-slate-100 overflow-hidden transform transition-all z-10 animate-in fade-in slide-in-from-bottom-8 duration-300">
            {/* Elegant Top Decorative Stripe */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 via-[#00599F] to-indigo-600" />
            
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-[#00599F]">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">System Information</h3>
                </div>
                <button 
                  onClick={() => setShowInfo(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors flex items-center justify-center active:scale-95"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Information Listing Cards */}
              <div className="space-y-4 mb-6">
                <div className="bg-slate-50 rounded-2xl p-4.5 border border-slate-100/80 flex flex-col items-center text-center">
                  <div className="h-14 w-14 rounded-2xl bg-white p-1 flex items-center justify-center shadow-sm overflow-hidden">
                    <img
                      src="/logo.png"
                      alt="Apex-Ecom"
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.25em] mb-1">Company Name</span>
                  <span className="text-base font-black text-slate-800 tracking-tight">Apex Of Gulf FZE</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-100 flex flex-col">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">App Version</span>
                    <span className="text-xs font-black text-slate-800">v1.0.0</span>
                  </div>
                  <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-100 flex flex-col">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">System State</span>
                    <span className="text-xs font-black text-emerald-700">Production</span>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex flex-col">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 leading-none">Developer</span>
                  <span className="text-xs font-black text-slate-800 uppercase tracking-wide">SYAM KUMAR TV</span>
                </div>
              </div>

              {/* Action buttons */}
              <button 
                onClick={() => setShowInfo(false)}
                className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-black uppercase tracking-wider rounded-2xl shadow-md shadow-blue-500/15 active:scale-95 transition-all"
              >
                Close Information
              </button>
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  );
};

export default DashboardScreen;
