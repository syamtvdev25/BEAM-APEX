
import React from 'react';
import { ItemVariant } from './ItemQueryScreen';

interface KpiCardProps {
  label: string;
  value: string | number;
  unit?: string;
}

const KpiCard: React.FC<KpiCardProps> = ({ label, value, unit }) => (
  <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-5 shadow-sm transition-all active:scale-[0.98] flex flex-col justify-center min-h-[110px]">
    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] block mb-2 leading-tight whitespace-normal">
      {label}
    </label>
    <div className="flex items-baseline space-x-1 overflow-hidden">
      <span className="text-2xl font-black text-slate-900 tracking-tighter truncate">
        {value}
      </span>
      {unit && (
        <span className="text-[9px] font-bold text-slate-400 uppercase shrink-0">
          {unit}
        </span>
      )}
    </div>
  </div>
);

const ItemQueryPopup: React.FC<{ selectedVariant?: ItemVariant }> = ({ selectedVariant }) => {
  // Logic to fetch data based on selectedVariant would go here
  const kpiData = [
    { label: 'CLIENT BACKORDER', value: 40, unit: 'UNIT' },
    { label: 'RESERVED', value: 0, unit: 'UNIT' },
    { label: 'UNDER PACKING', value: 0, unit: 'UNIT' },
    { label: 'BAL QTY', value: 0, unit: 'UNIT' },
    { label: 'UNDER COUNTING', value: 0, unit: 'UNIT' },
  ];

  return (
    <div className="flex flex-col space-y-4 pb-4 animate-in fade-in duration-500">
      {/* Grid Layout for KPI Cards */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {kpiData.map((kpi, idx) => (
          <KpiCard 
            key={idx}
            label={kpi.label}
            value={kpi.value}
            unit={kpi.unit}
          />
        ))}
      </div>
      
      {/* Subtle Bottom Accent Indicator */}
      <div className="flex justify-center pt-4">
        <div className="w-12 h-1 bg-slate-200/50 rounded-full"></div>
      </div>
    </div>
  );
};

export default ItemQueryPopup;
