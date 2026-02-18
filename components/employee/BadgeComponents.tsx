
import React from 'react';
import { ProductThumb as GlobalProductThumb } from '../ProductThumb';

/**
 * Unified Status Badge System - Premium Polish
 */
export const StatusBadge: React.FC<{ status?: string; isLatest?: boolean; hasHistory?: boolean }> = ({ 
  status = 'Normal', 
  isLatest = false,
  hasHistory = false
}) => {
  const s = (status || 'Normal').toLowerCase();
  
  const baseClasses = "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border shadow-sm flex items-center gap-1.5 transition-all duration-300";

  if (isLatest) {
    return (
      <span className={`${baseClasses} bg-emerald-600 text-white border-emerald-500 shadow-emerald-900/20 animate-in fade-in zoom-in duration-500`}>
        <div className="w-1 h-1 bg-white rounded-full animate-pulse" />
        Latest
      </span>
    );
  }

  if (hasHistory) {
    return (
      <span className={`${baseClasses} bg-orange-50 text-orange-700 border-orange-100 shadow-orange-900/5`}>
        <div className="w-1.5 h-1.5 bg-orange-500 rounded-full shadow-[0_0_8px_rgba(249,115,22,0.4)]" />
        History Available
      </span>
    );
  }

  if (s.includes('no longer supplied') || s.includes('discontinued')) {
    return (
      <span className={`${baseClasses} bg-rose-50 text-rose-600 border-rose-100 shadow-rose-900/5`}>
        <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"/></svg>
        Discontinued
      </span>
    );
  }

  if (s.includes('not supplied individually')) {
    return (
      <span className={`${baseClasses} bg-slate-100 text-slate-500 border-slate-200 shadow-inner`}>
        Assembly Only
      </span>
    );
  }

  // Default: Normal
  return (
    <span className={`${baseClasses} bg-emerald-50 text-emerald-700 border-emerald-100 shadow-emerald-900/5`}>
      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
      Normal
    </span>
  );
};

/**
 * Compatibility wrapper for internal employee dashboard usage.
 */
export const ProductThumb: React.FC<{ imageName?: string; className?: string; size?: 'T' | 'M' | 'L' }> = ({ 
  imageName, 
  className = "",
  size = 'T'
}) => {
  const pixelSize = size === 'T' ? 64 : size === 'M' ? 120 : 250;
  return (
    <GlobalProductThumb 
      imageName={imageName} 
      className={className} 
      size={pixelSize} 
    />
  );
};

/**
 * Placeholder Card for Future Metrics
 */
export const MetricPlaceholderCard: React.FC<{ label: string }> = ({ label }) => (
  <div className="bg-white border border-slate-100 p-4 rounded-2xl shadow-sm flex flex-col items-center justify-center min-h-[80px] opacity-60">
    <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest mb-1">{label}</span>
    <span className="text-lg font-black text-slate-200">—</span>
    <span className="text-[7px] font-bold text-slate-400 uppercase mt-1">Coming Soon</span>
  </div>
);
