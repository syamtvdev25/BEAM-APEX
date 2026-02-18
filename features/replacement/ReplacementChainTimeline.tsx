
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ReplacementStep } from './types';
import { ProductThumb } from '../../components/ProductThumb';
import { StatusBadge } from '../../components/employee/BadgeComponents';
import { productImageUrl } from '../../utils/productImage';

interface ReplacementChainTimelineProps {
  chain: ReplacementStep[];
  isResolving: boolean;
  isEmployee: boolean;
}

export const ReplacementChainTimeline: React.FC<ReplacementChainTimelineProps> = ({ 
  chain, 
  isResolving, 
  isEmployee 
}) => {
  const navigate = useNavigate();

  return (
    <div className="relative space-y-8 pl-4">
      {/* Timeline Line */}
      {chain.length > 0 && (
        <div className="absolute left-10 top-4 bottom-4 w-0.5 bg-slate-200 z-0" />
      )}

      {chain.map((item, idx) => {
        const isLatest = idx === chain.length - 1 && !item.Replaced && !isResolving;
        const hasNextRef = !!(item.Replaced && item.Replaced.trim().length > 0);
        
        // Consistent Image Logic
        const resolvedImageName = item.ImageName || (item.ArtNr ? `${item.ArtNr.trim().replace(/\s+/g, '')}.JPG` : '');
        
        return (
          <div key={`${item.ArtNr}-${idx}`} className="relative z-10 flex gap-6 animate-in slide-in-from-bottom-2 duration-300">
            <div className="flex flex-col items-center">
              <div className={`w-12 h-12 rounded-full border-4 border-white shadow-md flex items-center justify-center transition-all duration-500 ${isLatest ? 'bg-green-600 scale-110 ring-4 ring-green-100' : 'bg-slate-900'}`}>
                <span className="text-[11px] font-black text-white">{idx + 1}</span>
              </div>
            </div>

            <button 
              onClick={() => navigate(`/product/${item.ArtNr}`, { state: item })}
              className={`flex-1 bg-white rounded-[24px] p-3 shadow-sm border text-left active:scale-[0.98] transition-all flex items-center gap-4 ${isLatest ? 'border-green-200 bg-green-50/10 ring-1 ring-green-500/20 shadow-green-900/5' : 'border-slate-100 hover:border-blue-100 shadow-md shadow-blue-900/5'}`}
            >
              <ProductThumb imageName={resolvedImageName} size={64} className="shrink-0" />

              <div className="flex-1 min-w-0 flex flex-col justify-center">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-[8px] font-black text-orange-500 uppercase tracking-widest truncate">{item.Brand}</span>
                  <StatusBadge status={item.Status} isLatest={isLatest} hasHistory={hasNextRef && !isLatest} />
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

      {/* Progressive Loading Skeleton */}
      {isResolving && (
        <div className="relative z-10 flex gap-6 animate-pulse">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full border-4 border-white bg-slate-200 shadow-sm flex items-center justify-center">
              <span className="text-[11px] font-black text-slate-300">{chain.length + 1}</span>
            </div>
          </div>
          <div className="flex-1 bg-white/60 rounded-[24px] p-3 border border-slate-100 flex items-center gap-4 h-[88px]">
            <div className="w-16 h-16 bg-slate-100 rounded-xl shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-2 bg-slate-100 rounded w-1/4" />
              <div className="h-4 bg-slate-100 rounded w-3/4" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
