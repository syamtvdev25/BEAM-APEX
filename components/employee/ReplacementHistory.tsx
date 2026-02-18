
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import PageShell from '../PageShell';
import { useAuth } from '../../App';
import { ReplacementStep } from '../../features/replacement/types';
import { ReplacementChainTimeline } from '../../features/replacement/ReplacementChainTimeline';
import { 
  getCachedChain, 
  setCachedChain, 
  resolveReplacementChainGenerator,
  normalizeKey 
} from '../../features/replacement/replacementService';

const ReplacementHistory: React.FC = () => {
  const navigate = useNavigate();
  const { artNr } = useParams();
  const location = useLocation();
  const { user } = useAuth();
  const startItem = location.state as ReplacementStep | undefined;

  const [replacementChain, setReplacementChain] = useState<ReplacementStep[]>(() => {
    return startItem ? [startItem] : [];
  });
  const [isResolving, setIsResolving] = useState(true);
  const [isIncomplete, setIsIncomplete] = useState(false);
  
  const isEmployee = user?.userType === 'APEX';
  const resolutionIdRef = useRef(0);

  const resolveChain = useCallback(async () => {
    if (!artNr) return;
    
    const currentId = ++resolutionIdRef.current;
    const cached = getCachedChain(startItem?.Brand || '', artNr);

    if (cached) {
      setReplacementChain(cached);
      setIsResolving(false);
      return;
    }

    setIsResolving(true);
    setIsIncomplete(false);
    
    const generator = resolveReplacementChainGenerator(artNr, startItem, isEmployee);
    let finalChain: ReplacementStep[] = startItem ? [startItem] : [];

    for await (const update of generator) {
      if (currentId !== resolutionIdRef.current) return;
      
      if (update.isIncomplete) {
        setIsIncomplete(true);
        break;
      }

      if (update.step.ArtNr) {
        // Prevent duplicate initial step if generator yielded it
        if (finalChain.length > 0 && normalizeKey(finalChain[0].ArtNr) === normalizeKey(update.step.ArtNr)) {
           // Skip
        } else {
           finalChain = [...finalChain, update.step];
           setReplacementChain(finalChain);
        }
      }

      if (update.isComplete) break;
    }

    if (currentId === resolutionIdRef.current) {
      setCachedChain(startItem?.Brand || '', artNr, finalChain);
      setIsResolving(false);
    }
  }, [artNr, startItem, isEmployee]);

  useEffect(() => {
    resolveChain();
  }, [resolveChain]);

  return (
    <PageShell title="Replacement Chain" onBack={() => navigate(-1)}>
      <div className="flex-1 bg-slate-50 overflow-y-auto scroll-smooth animate-in fade-in duration-300">
        <div className="max-w-4xl mx-auto p-5 space-y-6 pb-24">
          
          <header className="px-1 pt-2 flex justify-between items-end">
             <div>
                <h2 className="text-sm font-black text-slate-900 uppercase tracking-tight leading-snug">
                    {replacementChain[0]?.Bez || 'Historical Progression'}
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Timeline: Oldest to Latest</p>
                  {isResolving && (
                    <span className="flex items-center gap-1.5">
                       <div className="w-1 h-1 bg-blue-500 rounded-full animate-pulse" />
                       <span className="text-[8px] font-black text-blue-500 uppercase tracking-widest animate-pulse">Resolving...</span>
                    </span>
                  )}
                </div>
             </div>
             {isIncomplete && (
               <div className="bg-amber-50 border border-amber-100 px-2 py-1 rounded-md mb-0.5">
                 <span className="text-[7px] font-black text-amber-600 uppercase tracking-widest">Chain Incomplete</span>
               </div>
             )}
          </header>

          <ReplacementChainTimeline 
            chain={replacementChain} 
            isResolving={isResolving} 
            isEmployee={isEmployee} 
          />

          {!isResolving && replacementChain.length === 0 && (
            <div className="py-20 text-center opacity-30">
               <p className="text-sm font-black uppercase tracking-widest">No history found</p>
            </div>
          )}

          {!isResolving && (
            <div className="pt-12 text-center opacity-20">
               <p className="text-[8px] font-black text-slate-300 uppercase tracking-[0.4em]">Historical Integrity Verification Complete</p>
            </div>
          )}
        </div>
      </div>
    </PageShell>
  );
};

export default ReplacementHistory;
