
import React, { useMemo } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import PageShell from '../PageShell';
import { OemSearchItem } from './EmployeeDashboard';
import { StatusBadge } from './BadgeComponents';
import { ProductThumb } from '../ProductThumb';
import { useAuth } from '../../App';

const STORAGE_KEY = "emp_search_state_v2";

const ReplacementHistory: React.FC = () => {
  const navigate = useNavigate();
  const { artNr } = useParams();
  const location = useLocation();
  const { user } = useAuth();
  const startItem = location.state as OemSearchItem | undefined;

  const isEmployee = user?.userType === 'APEX';
  const normalizeKey = (val: string = "") => val.trim().replace(/\s+/g, '').toUpperCase();

  const replacementChain = useMemo(() => {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (!saved) return startItem ? [startItem] : [];

    try {
      const parsed = JSON.parse(saved);
      const searchResults: OemSearchItem[] = parsed.searchResults || [];
      const index = new Map<string, OemSearchItem>();
      
      searchResults.forEach(item => {
        index.set(normalizeKey(item.ArtNr), item);
      });

      const chain: OemSearchItem[] = [];
      const visited = new Set<string>();
      let currentKey = normalizeKey(artNr || "");

      while (currentKey && !visited.has(currentKey)) {
        const item = index.get(currentKey);
        if (!item) {
            if (chain.length === 0 && startItem && normalizeKey(startItem.ArtNr) === currentKey) {
                chain.push(startItem);
                visited.add(currentKey);
                if (!startItem.Replaced || startItem.Replaced.trim() === "") break;
                currentKey = normalizeKey(startItem.Replaced);
                continue;
            }
            break;
        }
        
        chain.push(item);
        visited.add(currentKey);
        
        if (!item.Replaced || item.Replaced.trim() === "") break;
        currentKey = normalizeKey(item.Replaced);
      }
      return chain;
    } catch (e) {
      return startItem ? [startItem] : [];
    }
  }, [artNr, startItem]);

  return (
    <PageShell title="Replacement Chain" onBack={() => navigate(-1)}>
      <div className="flex-1 bg-slate-50 overflow-y-auto scroll-smooth animate-in fade-in duration-300">
        <div className="max-w-4xl mx-auto p-5 space-y-6 pb-20">
          
          <header className="px-1 pt-2">
             <h2 className="text-sm font-black text-slate-900 uppercase tracking-tight leading-snug">
                {replacementChain[0]?.Bez || 'Historical Progression'}
             </h2>
             <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">Timeline: Oldest to Latest</p>
          </header>

          <div className="relative space-y-8 pl-4">
             <div className="absolute left-10 top-4 bottom-4 w-0.5 bg-slate-200 z-0" />

             {replacementChain.map((item, idx) => {
               const isLatest = idx === replacementChain.length - 1 && !item.Replaced;
               const hasNext = !!(item.Replaced && item.Replaced.trim().length > 0);
               
               return (
                 <div 
                   key={idx} 
                   className="relative z-10 flex gap-6 animate-in slide-in-from-bottom duration-500" 
                   style={{ animationDelay: `${idx * 100}ms` }}
                 >
                    <div className="flex flex-col items-center">
                       <div className={`w-12 h-12 rounded-full border-4 border-white shadow-md flex items-center justify-center transition-all ${isLatest ? 'bg-green-600 scale-110 ring-4 ring-green-100' : 'bg-slate-900'}`}>
                          <span className="text-[11px] font-black text-white">{idx + 1}</span>
                       </div>
                    </div>

                    <button 
                      onClick={() => navigate(`/product/${item.ArtNr}`, { state: item })}
                      className={`flex-1 bg-white rounded-[24px] p-3 shadow-sm border text-left active:scale-[0.98] transition-all flex items-center gap-4 ${isLatest ? 'border-green-200 bg-green-50/10 ring-1 ring-green-500/20' : 'border-slate-100 hover:border-blue-100 shadow-md shadow-blue-900/5'}`}
                    >
                       <ProductThumb 
                         imageName={item.ImageName} 
                         size={64} 
                         className="shrink-0" 
                       />

                       <div className="flex-1 min-w-0 flex flex-col justify-center">
                          <div className="flex items-center justify-between gap-2 mb-1">
                             <span className="text-[8px] font-black text-orange-500 uppercase tracking-widest truncate">{item.Brand}</span>
                             <StatusBadge 
                               status={item.Status} 
                               isLatest={isLatest} 
                               hasHistory={hasNext && !isLatest}
                             />
                          </div>
                          
                          <h4 className="text-sm font-black text-slate-900 font-mono tracking-tight uppercase whitespace-nowrap overflow-hidden text-ellipsis">
                            {item.ArtNr}
                          </h4>

                          {isEmployee && (
                            <div className="mt-1 flex items-center justify-between border-t border-slate-50 pt-2 opacity-60">
                               <span className="text-[8px] font-black text-slate-300 uppercase truncate pr-4">
                                 {item.Apex_Supp_Name || 'APEX GULF'}
                               </span>
                               <svg className="w-3 h-3 text-slate-200 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7"/></svg>
                            </div>
                          )}
                       </div>
                    </button>
                 </div>
               );
             })}

             {replacementChain.length > 0 && replacementChain[replacementChain.length - 1].Replaced && (
                <div className="relative z-10 flex gap-6 pl-14 animate-in fade-in duration-700">
                    <div className="bg-slate-900 text-white rounded-2xl px-5 py-4 flex items-center space-x-3 shadow-xl max-w-sm">
                        <svg className="w-5 h-5 text-blue-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <p className="text-[10px] font-black uppercase tracking-widest leading-relaxed">
                            Next known variant ({replacementChain[replacementChain.length - 1].Replaced}) not found in current search result set.
                        </p>
                    </div>
                </div>
             )}
          </div>

          <div className="pt-8 text-center opacity-20">
             <p className="text-[8px] font-black text-slate-300 uppercase tracking-[0.4em]">Historical Integrity Verification</p>
          </div>
        </div>
      </div>
    </PageShell>
  );
};

export default ReplacementHistory;
