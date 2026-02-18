
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import PageShell from '../PageShell';
import { useAuth } from '../../App';
import { StatusBadge } from './BadgeComponents';
import { ProductThumb } from '../ProductThumb';

const STORAGE_KEY = "emp_search_state_v2";

export type OemSearchItem = {
  ArtNr: string;
  Bez: string;
  ImageName?: string;
  ImageUrl?: string;
  Brand?: string;
  Apex_Supp_Name?: string;
  Replaced?: string;
  Status?: string;
};

interface EmployeeMenuItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  color: string;
}

type FilterType = 'All' | 'Active' | 'NotAvailable' | 'Superseded';

const EmployeeDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { logout, user } = useAuth();
  
  const isEmployee = user?.userType === 'APEX';

  const menuItems: EmployeeMenuItem[] = useMemo(() => [
    { label: 'HOME', path: '/employee/home', color: 'bg-blue-50 text-blue-900', icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg> },
    { label: 'PC', path: '/employee/pc', color: 'bg-indigo-50 text-indigo-900', icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/></svg> },
    { label: 'CV', path: '/employee/cv', color: 'bg-emerald-50 text-emerald-900', icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"/></svg> },
    { label: 'AXLES', path: '/employee/axles', color: 'bg-amber-50 text-amber-900', icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg> },
    { label: 'ENGINES', path: '/employee/engines', color: 'bg-red-50 text-red-900', icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z"/></svg> },
    { label: 'IMPORT', path: '/employee/apex-import', color: 'bg-purple-50 text-purple-900', icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"/></svg> },
  ], []);

  // Search States
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [searchResults, setSearchResults] = useState<OemSearchItem[]>([]);
  const [lastQuery, setLastQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('All');
  const [showEmptyError, setShowEmptyError] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  
  const requestIdRef = useRef(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isHomeActive = pathname === '/employee' || pathname.startsWith('/employee/');

  // UI Rules
  const hasActiveSearch = searchTerm.trim().length > 0;
  const showSearchPanel = hasActiveSearch || isSearching || searchResults.length > 0 || !!searchError;

  // Restore State
  useEffect(() => {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.searchTerm) setSearchTerm(parsed.searchTerm);
        if (parsed.searchResults) setSearchResults(parsed.searchResults);
        if (parsed.searchError) setSearchError(parsed.searchError);
        if (parsed.lastQuery) setLastQuery(parsed.lastQuery);
        
        if (parsed.scrollTop && scrollRef.current) {
          requestAnimationFrame(() => {
            if (scrollRef.current) scrollRef.current.scrollTop = parsed.scrollTop;
          });
        }
      } catch (e) {}
    }
  }, []);

  // Persist State
  useEffect(() => {
    if (!showSearchPanel && !searchTerm) {
      sessionStorage.removeItem(STORAGE_KEY);
      return;
    }
    const state = {
      searchTerm,
      searchResults,
      searchError,
      lastQuery,
      scrollTop: scrollRef.current?.scrollTop || 0
    };
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [searchTerm, searchResults, searchError, lastQuery, showSearchPanel]);

  const filteredResults = useMemo(() => {
    if (activeFilter === 'All') return searchResults;
    return searchResults.filter(item => {
      const s = (item.Status || '').toLowerCase();
      if (activeFilter === 'Active') return s.includes('normal') || s.includes('active');
      if (activeFilter === 'NotAvailable') return s.includes('not available');
      if (activeFilter === 'Superseded') return s.includes('no longer supplied');
      return true;
    });
  }, [searchResults, activeFilter]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleHomeClick = async () => {
    try { await Haptics.impact({ style: ImpactStyle.Light }); } catch (e) {}
    handleClear();
    navigate('/employee');
  };

  const handleClear = () => {
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    setSearchTerm('');
    setSearchResults([]);
    setSearchError('');
    setLastQuery('');
    setActiveFilter('All');
    setShowEmptyError(false);
    sessionStorage.removeItem(STORAGE_KEY);
  };

  const executeSearch = async (query: string) => {
    const trimmed = query.trim();
    if (!trimmed) {
      setShowEmptyError(true);
      return;
    }
    setShowEmptyError(false);
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    
    const currentId = ++requestIdRef.current;
    setIsSearching(true);
    setSearchError('');

    try {
      const response = await fetch(`https://ecom.apexgulf.ae/apex/API/APIOemSearch.ashx?q=${encodeURIComponent(trimmed)}`);
      const json = await response.json();
      if (currentId !== requestIdRef.current) return;

      if (json.success) {
        setSearchResults(json.data || []);
        setLastQuery(trimmed);
        if (!json.data || json.data.length === 0) {
          setSearchError("No matching parts found");
        }
      } else {
        setSearchError(json.message || "Search failed");
      }
    } catch (err) {
      if (currentId === requestIdRef.current) {
        setSearchError("Connection error. Please try again.");
      }
    } finally {
      if (currentId === requestIdRef.current) {
        setIsSearching(false);
      }
    }
  };

  // Debounce Auto-Search
  useEffect(() => {
    const trimmed = searchTerm.trim();
    if (trimmed.length < 3) {
      if (trimmed === "" && searchResults.length > 0) handleClear();
      return;
    }
    if (trimmed === lastQuery) return;
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(() => executeSearch(trimmed), 600);
    return () => { if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current); };
  }, [searchTerm, lastQuery]);

  const ResultCard: React.FC<{ item: OemSearchItem }> = ({ item }) => (
    <div 
      onClick={() => navigate(`/product/${item.ArtNr}`, { state: item })}
      className="w-full text-left bg-white rounded-[24px] p-4 border shadow-sm flex gap-4 active:scale-[0.98] transition-all group relative overflow-hidden border-slate-100 hover:border-blue-100 shadow-blue-900/5"
    >
      <div className="flex flex-col items-center shrink-0">
        <ProductThumb 
          imageName={item.ImageName} 
          size={64} 
        />
        {isEmployee && (
           <button 
             onClick={(e) => { e.stopPropagation(); navigate(`/erp/${encodeURIComponent(item.ArtNr)}`, { state: item }); }}
             className="mt-3 w-16 h-10 bg-[#003366] text-white rounded-xl flex flex-col items-center justify-center shadow-lg active:scale-95 transition-all border border-white/10"
           >
              <svg className="w-3.5 h-3.5 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
              <span className="text-[8px] font-black uppercase leading-none">ERP</span>
           </button>
        )}
      </div>

      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-0.5">
            <span className="text-[10px] font-black text-[#F37021] uppercase tracking-wider">{item.Brand}</span>
            <StatusBadge status={item.Status} hasHistory={!!(item.Replaced && item.Replaced.trim().length > 0)} />
          </div>
          <div className="flex items-center space-x-2">
            <h4 className="text-sm font-black text-slate-900 font-mono tracking-tight uppercase whitespace-nowrap overflow-hidden text-ellipsis">
              Part No: {item.ArtNr}
            </h4>
          </div>
          <p className="text-[10px] font-bold text-slate-500 line-clamp-2 mt-1 leading-snug uppercase tracking-tight opacity-70">
            {item.Bez}
          </p>
        </div>

        {isEmployee && (
          <div className="mt-2 flex items-center justify-between border-t border-slate-50 pt-2">
            <div className="flex flex-col min-w-0">
              <span className="text-[8px] font-black text-slate-300 uppercase leading-none mb-1">Supplier</span>
              <span className="text-[9px] font-black text-slate-400 uppercase truncate pr-2 max-w-[120px]">{item.Apex_Supp_Name}</span>
            </div>
            
            <div className="flex items-center space-x-1 shrink-0">
               <button 
                  onClick={(e) => { e.stopPropagation(); navigate(`/employee/criteria?artnr=${item.ArtNr}`); }}
                  className="w-8 h-8 bg-slate-50 rounded-lg border border-slate-200 text-slate-400 active:scale-90 active:bg-blue-900 active:text-white transition-all shadow-sm flex items-center justify-center"
               >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
               </button>
               <button 
                  onClick={(e) => { e.stopPropagation(); navigate(`/employee/parts-list?artnr=${item.ArtNr}`); }}
                  className="w-8 h-8 bg-slate-50 rounded-lg border border-slate-200 text-slate-400 active:scale-90 active:bg-orange-600 active:text-white transition-all shadow-sm flex items-center justify-center"
               >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
               </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const FilterChip = ({ type, label }: { type: FilterType, label: string }) => (
    <button 
      onClick={() => setActiveFilter(type)}
      className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all border ${
        activeFilter === type 
          ? 'bg-blue-900 text-white border-blue-900 shadow-md scale-105' 
          : 'bg-white text-slate-400 border-slate-100 active:bg-slate-50'
      }`}
    >
      {label}
    </button>
  );

  return (
    <PageShell 
      title={`Hi, ${user?.customerName || 'Enterprise'}`} 
      onBack={undefined} 
      actions={
        <button onClick={handleLogout} className="p-2.5 bg-white/10 border border-white/20 rounded-xl text-white active:scale-90 transition-all shadow-sm">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
        </button>
      }
      footer={
        <div className="bg-white border-t border-gray-200 rounded-t-2xl shadow-[0_-6px_16px_rgba(0,0,0,0.06)] px-5 py-3 flex items-center justify-between" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 12px)' }}>
          <button 
            onClick={handleHomeClick}
            className={`transition-all duration-150 p-3 rounded-xl active:scale-95 flex items-center justify-center ${isHomeActive && !showSearchPanel ? 'bg-blue-50 text-[#003366] ring-2 ring-blue-100 shadow-[0_0_0_6px_rgba(0,51,102,0.06)]' : 'bg-gray-50 text-gray-400'}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
          </button>
          <div className="bg-gray-100 px-3 py-1 rounded-full border border-gray-200">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-tighter">v1.1.2</span>
          </div>
        </div>
      }
    >
      <div 
        ref={scrollRef}
        onScroll={(e) => {
           const top = e.currentTarget.scrollTop;
           setShowBackToTop(top > 400);
           if (scrollRef.current) {
              const savedString = sessionStorage.getItem(STORAGE_KEY);
              const saved = savedString ? JSON.parse(savedString) : {};
              sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ ...saved, scrollTop: top }));
           }
        }}
        className="flex-1 bg-slate-50 overflow-y-auto scroll-smooth relative"
      >
        <div className="max-w-4xl mx-auto p-5 space-y-4">
          
          <div className="space-y-2 mb-2">
            <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden flex flex-row items-stretch">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Enter part no..."
                  value={searchTerm}
                  onChange={(e) => { setSearchTerm(e.target.value); setShowEmptyError(false); }}
                  onKeyDown={(e) => e.key === 'Enter' && executeSearch(searchTerm)}
                  className="w-full pl-12 pr-12 py-4 bg-transparent text-sm font-bold text-slate-800 outline-none"
                />
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
                {searchTerm && (
                  <button 
                    onClick={handleClear}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 bg-slate-100 rounded-full text-slate-400 active:scale-90 transition-all"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                )}
              </div>
              <button 
                onClick={() => executeSearch(searchTerm)}
                className="bg-[#003366] text-white px-8 font-black uppercase text-[11px] tracking-widest active:bg-blue-950 transition-colors flex items-center justify-center min-w-[100px]"
              >
                {isSearching ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : "Search"}
              </button>
            </div>
            <div className="flex justify-between px-1">
               <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Search by Part No / OEM / Description</p>
               {showEmptyError && <p className="text-[9px] font-black text-red-500 uppercase tracking-widest animate-pulse">Please enter a value</p>}
            </div>
          </div>

          {showSearchPanel && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div className="flex flex-col space-y-3 px-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <h3 className="text-[10px] font-black text-blue-900 uppercase tracking-widest">Search Results</h3>
                    {lastQuery && !isSearching && (
                      <button onClick={() => executeSearch(lastQuery)} className="p-1 text-slate-300 active:rotate-180 transition-all duration-500">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                      </button>
                    )}
                  </div>
                  <span className="text-[9px] font-black text-slate-300 uppercase">{searchResults.length} Items Found</span>
                </div>
                
                <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar pb-1">
                  <FilterChip type="All" label="All" />
                  <FilterChip type="Active" label="Active / Normal" />
                  <FilterChip type="NotAvailable" label="Not Available" />
                  <FilterChip type="Superseded" label="Superseded" />
                </div>
              </div>

              {isSearching && (
                <div className="space-y-3">
                  {[1,2].map(i => (
                    <div key={i} className="bg-white rounded-2xl p-4 border border-slate-100 flex gap-4 animate-pulse"><div className="w-16 h-16 bg-slate-100 rounded-xl"></div><div className="flex-1 space-y-2"><div className="h-3 bg-slate-100 rounded w-1/4"></div><div className="h-4 bg-slate-100 rounded w-3/4"></div></div></div>
                  ))}
                </div>
              )}

              {searchError && !isSearching && (
                <div className="py-10 text-center bg-white rounded-3xl border border-slate-100 shadow-sm px-6">
                  <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-3 text-slate-300">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                  </div>
                  <h4 className="text-sm font-black text-slate-900 uppercase">No results found</h4>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mt-1">Try another Part No, OEM, or description.</p>
                </div>
              )}

              {!isSearching && filteredResults.length > 0 && (
                <div className="space-y-3 pb-8">
                  {filteredResults.map((item, idx) => (
                    <ResultCard key={idx} item={item} />
                  ))}
                </div>
              )}

              {!isSearching && searchResults.length > 0 && filteredResults.length === 0 && (
                <div className="py-12 text-center opacity-30">
                  <p className="text-[10px] font-black uppercase tracking-widest">No items match the "{activeFilter}" filter</p>
                </div>
              )}
            </div>
          )}

          {!showSearchPanel && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="px-1 mb-4 flex items-center">
                <div className="w-1 h-3 bg-[#003366] rounded-full mr-2"></div>
                <h3 className="text-[10px] font-black text-blue-900 uppercase tracking-widest">Enterprise Modules</h3>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pb-10">
                {menuItems.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => navigate(item.path)}
                    className="flex flex-col items-center justify-center p-6 bg-white rounded-[32px] shadow-sm border border-white hover:border-blue-100 hover:shadow-md transition-all active:scale-95 group min-h-[140px]"
                  >
                    <div className={`p-4 rounded-2xl mb-4 transition-all group-hover:scale-110 group-hover:shadow-lg ${item.color}`}>
                      {item.icon}
                    </div>
                    <span className="text-[10px] font-black text-slate-700 text-center uppercase tracking-widest leading-tight">
                      {item.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="pt-4 pb-12 flex flex-col items-center space-y-2 opacity-20">
            <div className="w-12 h-1 bg-slate-300 rounded-full"></div>
            <p className="text-[8px] font-black uppercase tracking-[0.4em]">APEX GULF ENTERPRISE</p>
          </div>
        </div>

        {showBackToTop && (
          <button 
            onClick={() => scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-24 right-6 w-12 h-12 bg-white rounded-2xl shadow-xl border border-slate-100 flex items-center justify-center text-blue-900 active:scale-90 transition-all z-40"
          >
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 15l7-7 7 7" /></svg>
          </button>
        )}
      </div>
    </PageShell>
  );
};

export default EmployeeDashboard;
