
import React, { useMemo } from 'react';
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
    { id: 'search_primary', label: 'SEARCH', path: '/search', icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg> },
    { id: 'erp', label: 'ERP', path: '/erp', icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg> },
    { id: 'pc', label: 'PC', path: '/pc', icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/></svg> },
    { id: 'cv', label: 'CV', path: '/cv', icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"/></svg> },
    { id: 'axles', label: 'AXLES', path: '/axles', icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg> },
    { id: 'engines', label: 'ENGINES', path: '/engines', icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z"/></svg> },
    { id: 'search', label: 'DESCRIPTION SEARCH', path: '/description-search', icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg> },
    { id: 'bearings', label: 'BEARINGS', path: '/bearings', icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg> },
    { id: 'batteries', label: 'BATTERIES', path: '/batteries', icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg> },
    { id: 'import', label: 'IMPORT', path: '/import', icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"/></svg> },
  ];

  return (
    <PageLayout className="bg-gradient-to-b from-blue-50/50 to-white">
      <header 
        className="bg-gradient-to-r from-[#003366] to-[#00599F] px-4 xs:px-6 flex items-center justify-between sticky top-0 z-50 shadow-xl rounded-b-[24px] shrink-0"
        style={{ paddingTop: 'calc(env(safe-area-inset-top, 0px) + 1rem)', paddingBottom: '1rem' }}
      >
        <div className="flex items-center space-x-3 min-w-0">
          <div className="w-9 h-9 bg-white rounded-xl p-1 shadow-md shrink-0 border border-white/20">
            <img 
              src={brandingConfig.logoPath} 
              alt={brandingConfig.appName} 
              className="w-full h-full object-contain"
            />
          </div>
          <div className="flex flex-col min-w-0">
            <h2 className="text-[10px] font-black text-white/70 tracking-widest uppercase leading-none mb-1">{brandingConfig.appName}</h2>
            {effectiveUser && (
              <span className="text-[13px] font-black text-white uppercase tracking-tight leading-tight truncate max-w-[150px] sm:max-w-[250px]">
                {effectiveUser.displayName}
              </span>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-2 sm:space-x-4 ml-2 shrink-0">
          {effectiveUser && (
            <div className="w-9 h-9 bg-orange-500 rounded-xl flex items-center justify-center shadow-lg border-2 border-white/20 shrink-0">
              <span className="text-sm font-black text-white tracking-tighter">
                {getInitials(effectiveUser.displayName)}
              </span>
            </div>
          )}
          
          <button 
            onClick={handleLogout}
            className="flex items-center justify-center p-2.5 rounded-xl border border-white/20 bg-white/10 hover:bg-red-500/80 transition-all active:scale-90 shadow-sm group"
          >
            <svg className="w-5 h-5 text-white group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </header>

      <main className="flex-1 p-5 overflow-y-auto no-scrollbar scroll-smooth" style={{ WebkitOverflowScrolling: 'touch' }}>
        <div className="grid grid-cols-2 gap-5 pb-20">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className="flex flex-col items-center justify-center aspect-square bg-white rounded-[32px] shadow-sm shadow-blue-900/5 border border-slate-50 p-6 transition-all hover:shadow-xl hover:-translate-y-1 active:scale-95 group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-transparent to-blue-50/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10 w-16 h-16 bg-blue-50/50 rounded-2xl flex items-center justify-center mb-4 transition-all group-hover:scale-110 group-hover:bg-white group-hover:shadow-lg duration-300">
                <div className="text-[#00599F] transition-colors group-hover:text-[#003366]">
                  {item.icon}
                </div>
              </div>
              <span className="relative z-10 text-[11px] font-black text-slate-700 text-center uppercase tracking-[0.15em] leading-tight">
                {item.label}
              </span>
            </button>
          ))}
        </div>
        
        <div className="py-8 flex flex-col items-center justify-center space-y-2">
           <div className="w-8 h-0.5 bg-blue-100 rounded-full" />
           <p className="text-[11px] font-bold text-[#003366] tracking-[0.2em] uppercase">APEX-ECOMMERCE</p>
        </div>
      </main>

      <footer className="bg-gradient-to-r from-[#003366] to-[#00599F] py-2 flex flex-col items-center border-t border-white/10 shadow-inner shrink-0">
        <p className="text-[9px] font-black text-white/50 tracking-[0.3em] uppercase">
          {brandingConfig.poweredBy}
        </p>
      </footer>

      <BottomNav />
    </PageLayout>
  );
};

export default DashboardScreen;
