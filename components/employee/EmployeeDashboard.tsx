
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import PageShell from '../PageShell';
import { useAuth } from '../../App';

const STORAGE_KEY = "emp_search_state_v2";

type OemSearchItem = {
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
  
  // Define menuItems for Employee Dashboard to fix 'Cannot find name' error
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
  
  // Chain States
  const [replacementChain, setReplacementChain] = useState<OemSearchItem[] | null>(null);
  const [chainRoot, setChainRoot] = useState<string>("");

  const requestIdRef = useRef(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isHomeActive = pathname === '/employee' || pathname.startsWith('/employee/');

  // UI Rules
  const hasActiveSearch = searchTerm.trim().length > 0;
  const showSearchPanel = hasActiveSearch || isSearching || searchResults.length > 0 || !!searchError;

  const normalizeKey = (val: string = "") => val.trim().replace(/\s+/g, '').toUpperCase();

  // 1. Restore State on Mount
  useEffect(() => {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.searchTerm) setSearchTerm(parsed.searchTerm);
        if (parsed.searchResults) setSearchResults(parsed.searchResults);
        if (parsed.searchError) setSearchError(parsed.searchError);
        if (parsed.lastQuery) setLastQuery(parsed.lastQuery);
        if (parsed.replacementChain) setReplacementChain(parsed.replacementChain);
        if (parsed.chainRoot) setChainRoot(parsed.chainRoot);
        
        if (parsed.scrollTop && scrollRef.current) {
          requestAnimationFrame(() => {
            if (scrollRef.current) scrollRef.current.scrollTop = parsed.scrollTop;
          });
        }
      } catch (e) {
        console.error("Failed to restore search state", e);
      }
    }
  }, []);

  // 2. Persist State Changes
  useEffect(() => {
    if (!showSearchPanel && !searchTerm && !replacementChain) {
      sessionStorage.removeItem(STORAGE_KEY);
      return;
    }
    const state = {
      searchTerm,
      searchResults,
      searchError,
      lastQuery,
      replacementChain,
      chainRoot,
      scrollTop: scrollRef.current?.scrollTop || 0
    };
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [searchTerm, searchResults, searchError, lastQuery, showSearchPanel, replacementChain, chainRoot]);

  // Client-side filtering logic
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
    setReplacementChain(null);
    setChainRoot("");
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
    
    setReplacementChain(null);
    setChainRoot("");

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
    debounceTimerRef.current = setTimeout(() => {
      executeSearch(trimmed);
    }, 600);

    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, [searchTerm, lastQuery]);

  // Local Chain Algorithm
  const buildReplacementChain = (startArtNr: string): OemSearchItem[] => {
    const index = new Map<string, OemSearchItem>();
    searchResults.forEach(item => {
      index.set(normalizeKey(item.ArtNr), item);
    });

    const chain: OemSearchItem[] = [];
    const visited = new Set<string>();
    let currentKey = normalizeKey(startArtNr);

    while (currentKey && !visited.has(currentKey)) {
      const item = index.get(currentKey);
      if (!item) break;
      chain.push(item);
      visited.add(currentKey);
      if (!item.Replaced || item.Replaced.trim() === "") break;
      currentKey = normalizeKey(item.Replaced);
    }
    return chain;
  };

  const handleOpenChain = (artNr: string) => {
    const chain = buildReplacementChain(artNr);
    if (chain.length > 0) {
      setReplacementChain(chain);
      setChainRoot(artNr);
    }
  };

  const getStatusStyle = (status: string = '') => {
    const s = status.toLowerCase();
    if (s.includes('normal') || s.includes('active')) return 'bg-green-50 text-green-700 border-green-100';
    if (s.includes('not available')) return 'bg-red-50 text-red-700 border-red-100';
    if (s.includes('no longer supplied')) return 'bg-orange-50 text-orange-700 border-orange-100';
    return 'bg-gray-50 text-gray-500 border-gray-100';
  };

  const ResultCard = ({ item, isChainStep = false, isLast = false }: { item: OemSearchItem, isChainStep?: boolean, isLast?: boolean }) => (
    <div 
      onClick={() => isChainStep ? navigate(`/employee/item/${item.ArtNr}`, { state: item }) : handleOpenChain(item.ArtNr)}
      className={`w-full text-left bg-white rounded-[24px] p-4 border shadow-sm flex gap-4 active:scale-[0.99] transition-all group relative overflow-hidden ${isLast ? 'ring-2 ring-green-500/30 bg-green-50/10 border-green-200' : 'border-slate-100'}`}
    >
      <div className="w-16 h-16 bg-slate-100 rounded-xl flex items-center justify-center shrink-0 overflow-hidden border border-slate-50 shadow-inner">
        <img 
          loading="lazy"
          decoding="async"
          src={item.ImageUrl || '/assets/branding/no-image.jpg'} 
          alt="" 
          className="w-full h-full object-contain p-1"
          onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/100x100/f1f5f9/94a3b8?text=No+Image'; }}
        />
      </div>

      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-0.5">
            <span className="text-[10px] font-black text-[#F37021] uppercase tracking-wider">{item.Brand}</span>
            <span className={`text-[8px] font-black px-2 py-0.5 rounded-full border uppercase shadow-sm ${getStatusStyle(item.Status)}`}>
              {item.Status || 'UNKNOWN'}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <h4 className="text-sm font-black text-slate-900 font-mono tracking-tight">Part No: {item.ArtNr}</h4>
            {isLast && isChainStep && (
              <span className="bg-green-600 text-white text-[7px] font-black px-1.5 py-0.5 rounded-md uppercase tracking-widest animate-pulse">LATEST</span>
            )}
          </div>
          
          {item.Replaced && item.Replaced.trim().length > 0 && (
            <div 
              onClick={(e) => {
                e.stopPropagation();
                handleOpenChain(item.ArtNr);
              }}
              className="mt-2 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 flex items-center justify-between active:bg-amber-100 transition-all group/repl"
            >
               <div className="flex flex-col">
                  <span className="text-[8px] font-black text-amber-600 uppercase tracking-[0.2em] leading-none mb-0.5 flex items-center">
                    <svg className="w-2.5 h-2.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 5l7 7-7 7M5 5l7 7-7 7"/></svg>
                    Replaced By
                  </span>
                  <span className="text-xs font-black text-amber-900 leading-none underline decoration-amber-300 underline-offset-2">{item.Replaced}</span>
               </div>
               <svg className="w-4 h-4 text-amber-400 group-hover/repl:text-amber-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" />
               </svg>
            </div>
          )}

          <p className="text-[10px] font-bold text-slate-500 line-clamp-2 mt-2 leading-snug uppercase tracking-tight opacity-80">{item.Bez}</p>
        </div>

        <div className="mt-2 flex items-center justify-between border-t border-slate-50 pt-2">
          <div className="flex flex-col min-w-0">
            <span className="text-[8px] font-black text-slate-300 uppercase leading-none mb-1">Supplier</span>
            <span className="text-[9px] font-black text-slate-400 uppercase truncate pr-2 max-w-[120px]">{item.Apex_Supp_Name}</span>
          </div>
          
          <div className="flex items-center space-x-1.5 shrink-0">
             <button 
                onClick={(e) => { e.stopPropagation(); navigate(`/employee/criteria?artnr=${item.ArtNr}`); }}
                className="w-[44px] h-[44px] bg-slate-50 rounded-lg border border-slate-200 text-slate-600 active:scale-90 active:bg-blue-900 active:text-white transition-all shadow-sm flex items-center justify-center"
                title="Technical Criteria"
             >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
             </button>
             <button 
                onClick={(e) => { e.stopPropagation(); navigate(`/employee/parts-list?artnr=${item.ArtNr}`); }}
                className="w-[44px] h-[44px] bg-slate-50 rounded-lg border border-slate-200 text-slate-600 active:scale-90 active:bg-orange-600 active:text-white transition-all shadow-sm flex items-center justify-center"
                title="Parts List / BOM"
             >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
             </button>
          </div>
        </div>
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
      title={`Hi, ${user?.customerName || 'Employee'}`} 
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
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-tighter">v1.1.0</span>
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
              const saved = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || '{}');
              sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ ...saved, scrollTop: top }));
           }
        }}
        className="flex-1 bg-slate-50 overflow-y-auto scroll-smooth relative"
      >
        <div className="max-w-4xl mx-auto p-5 space-y-4">
          
          {/* ERP Polish Search Bar */}
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

          {/* Results Area */}
          {showSearchPanel && (
            <div className="space-y-4 animate-in fade-in duration-300">
              {/* Premium Results Header */}
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
                
                {/* Client Side Filter Chips */}
                <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar pb-1">
                  <FilterChip type="All" label="All" />
                  <FilterChip type="Active" label="Active / Normal" />
                  <FilterChip type="NotAvailable" label="Not Available" />
                  <FilterChip type="Superseded" label="Superseded" />
                </div>
              </div>

              {isSearching && (
                <div className="space-y-3">
                  <div className="bg-white rounded-2xl p-4 border border-slate-100 flex gap-4 animate-pulse"><div className="w-16 h-16 bg-slate-100 rounded-xl"></div><div className="flex-1 space-y-2"><div className="h-3 bg-slate-100 rounded w-1/4"></div><div className="h-4 bg-slate-100 rounded w-3/4"></div></div></div>
                  <div className="bg-white rounded-2xl p-4 border border-slate-100 flex gap-4 animate-pulse"><div className="w-16 h-16 bg-slate-100 rounded-xl"></div><div className="flex-1 space-y-2"><div className="h-3 bg-slate-100 rounded w-1/4"></div><div className="h-4 bg-slate-100 rounded w-3/4"></div></div></div>
                </div>
              )}

              {searchError && !isSearching && (
                <div className="py-10 text-center bg-white rounded-3xl border border-slate-100 shadow-sm px-6">
                  <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
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

          {/* Module Grid - Shown only when not searching */}
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

        {/* Back to top FAB */}
        {showBackToTop && (
          <button 
            onClick={() => scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-24 right-6 w-12 h-12 bg-white rounded-2xl shadow-xl border border-slate-100 flex items-center justify-center text-blue-900 active:scale-90 transition-all z-40"
          >
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 15l7-7 7 7" /></svg>
          </button>
        )}
      </div>

      {/* Replacement Chain Premium Drawer */}
      {replacementChain && (
        <div className="fixed inset-0 z-[100] flex flex-col overflow-hidden animate-in fade-in duration-300">
           <div onClick={() => setReplacementChain(null)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
           
           <div className="relative mt-auto h-[90vh] bg-white rounded-t-[32px] shadow-2xl flex flex-col animate-in slide-in-from-bottom-10 duration-500">
              <div className="w-12 h-1 bg-slate-200 rounded-full mx-auto mt-3 shrink-0" />
              <header className="px-6 py-5 border-b border-slate-50 flex flex-col shrink-0">
                 <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                       <button onClick={() => setReplacementChain(null)} className="p-2 -ml-2 rounded-full active:bg-slate-100 transition-colors">
                          <svg className="w-6 h-6 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" /></svg>
                       </button>
                       <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight leading-none">Replacement History</h2>
                    </div>
                    <button onClick={() => setReplacementChain(null)} className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-2 rounded-xl active:bg-slate-100 transition-all">Close</button>
                 </div>
                 <div className="mt-3 flex items-center space-x-2">
                    <span className="text-[8px] font-black text-slate-300 uppercase tracking-[0.2em]">Tracing:</span>
                    <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{chainRoot}</span>
                 </div>
              </header>

              <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50/30">
                 <div className="space-y-6 relative">
                    <div className="absolute left-[34px] top-8 bottom-8 w-0.5 bg-slate-100 z-0" />
                    
                    {replacementChain.map((item, idx) => (
                      <div key={idx} className="relative z-10 flex gap-4">
                         <div className="w-12 flex flex-col items-center">
                            <div className="w-8 h-8 rounded-full bg-blue-900 border-4 border-white shadow-sm flex items-center justify-center text-white">
                               <span className="text-[9px] font-black">{idx + 1}</span>
                            </div>
                         </div>
                         <div className="flex-1 min-w-0">
                            <ResultCard item={item} isChainStep={true} isLast={idx === replacementChain.length - 1 && !item.Replaced} />
                         </div>
                      </div>
                    ))}

                    <div className="pt-4 px-2">
                       {replacementChain[replacementChain.length - 1].Replaced ? (
                         <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4 flex items-center space-x-3 opacity-80">
                            <svg className="w-5 h-5 text-orange-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                            <p className="text-[9px] font-black text-orange-700 uppercase tracking-widest leading-relaxed">
                               Next replacement ({replacementChain[replacementChain.length - 1].Replaced}) not found in local results.
                            </p>
                         </div>
                       ) : (
                         <div className="bg-green-50 border border-green-100 rounded-2xl p-4 flex items-center space-x-3">
                            <svg className="w-5 h-5 text-green-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                            <p className="text-[9px] font-black text-green-700 uppercase tracking-widest leading-none">Latest known replacement reached.</p>
                         </div>
                       )}
                    </div>
                 </div>
              </div>

              <footer className="p-6 border-t border-slate-50 bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
                 <button 
                   onClick={() => setReplacementChain(null)}
                   className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-[11px] tracking-[0.2em] shadow-xl active:scale-95 transition-all"
                 >
                    Dismiss Drawer
                 </button>
              </footer>
           </div>
        </div>
      )}
    </PageShell>
  );
};

export default EmployeeDashboard;
