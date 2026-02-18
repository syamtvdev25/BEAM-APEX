
import React from 'react';
import { ProductThumb as GlobalProductThumb } from '../ProductThumb';

/**
 * Unified Status Badge System
 */
export const StatusBadge: React.FC<{ status?: string; isLatest?: boolean; hasHistory?: boolean }> = ({ 
  status = 'Normal', 
  isLatest = false,
  hasHistory = false
}) => {
  const s = (status || 'Normal').toLowerCase();
  
  if (isLatest) {
    return (
      <span className="bg-green-600 text-white text-[8px] font-black px-2 py-0.5 rounded-full uppercase shadow-sm tracking-tighter animate-in fade-in zoom-in duration-300">
        Latest
      </span>
    );
  }

  if (hasHistory) {
    return (
      <span className="bg-amber-50 text-amber-700 text-[8px] font-black px-2 py-0.5 rounded-full border border-amber-100 uppercase flex items-center gap-1 shadow-sm">
        <div className="w-1 h-1 bg-amber-500 rounded-full animate-pulse" />
        Has Replacement
      </span>
    );
  }

  if (s.includes('no longer supplied') || s.includes('discontinued')) {
    return (
      <span className="bg-red-50 text-red-600 text-[8px] font-black px-2 py-0.5 rounded-full border border-red-100 uppercase">
        No Longer Supplied
      </span>
    );
  }

  if (s.includes('not supplied individually')) {
    return (
      <span className="bg-slate-50 text-slate-500 text-[8px] font-black px-2 py-0.5 rounded-full border border-slate-100 uppercase">
        Not Supplied Separately
      </span>
    );
  }

  return (
    <span className="bg-green-50 text-green-700 text-[8px] font-black px-2 py-0.5 rounded-full border border-green-100 uppercase">
      Normal
    </span>
  );
};

/**
 * Compatiblity wrapper for internal employee dashboard usage.
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
