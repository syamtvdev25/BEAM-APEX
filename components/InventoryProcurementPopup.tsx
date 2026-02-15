
import React from 'react';
import { ItemVariant } from './ItemQueryScreen';

interface KpiCardProps {
  label: string;
  value: string | number;
  unit?: string;
}

const KpiCard: React.FC<KpiCardProps> = ({ label, value, unit }) => (
  <div className="bg-white border border-slate-200/60 rounded-2xl p-4 sm:p-5 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] transition-all active:scale-[0.99] flex flex-col justify-between min-h-[110px]">
    <div className="space-y-1.5">
      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em] leading-tight block whitespace-normal">
        {label}
      </label>
      <div className="flex flex-col">
        <span className="text-xl sm:text-2xl font-black text-slate-800 leading-tight break-words whitespace-normal">
          {value === '' || value === null || value === undefined ? (
            <span className="text-slate-200">N/A</span>
          ) : (
            value
          )}
        </span>
        {unit && (
          <span className="text-[10px] font-bold text-slate-400 uppercase mt-0.5 tracking-wider">
            {unit}
          </span>
        )}
      </div>
    </div>
  </div>
);

const InventoryProcurementPopup: React.FC<{ selectedVariant?: ItemVariant }> = ({ selectedVariant }) => {
  const kpiData = [
    { label: 'Made In', value: 'GERMANY' },
    { label: 'Supplier Back Order', value: 30, unit: 'Units' },
    { label: 'Transit Quantity', value: 15, unit: 'Units' },
    { label: 'PO Quantity', value: 0, unit: 'Units' },
    { label: 'AG Quantity', value: 0, unit: 'Units' },
    { label: 'Balance Qty [Total All]', value: 0, unit: 'Units' },
    { label: 'Packing Unit', value: 1, unit: 'Per Pack' },
    { label: 'Minimum Quantity', value: 0, unit: 'Units' },
  ];

  return (
    <div className="flex flex-col pb-6 animate-in fade-in duration-500">
      <div className="mb-6 px-1">
        <h3 className="text-lg font-black text-slate-900 tracking-tight leading-tight">
          Inventory Metrics
        </h3>
        <p className="text-xs font-medium text-slate-400 tracking-normal mt-0.5">
          Comprehensive stock status and logistics tracking for this article.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {kpiData.map((kpi, idx) => (
          <KpiCard 
            key={idx}
            label={kpi.label}
            value={kpi.value}
            unit={kpi.unit}
          />
        ))}
      </div>
      
      <div className="mt-6 bg-slate-50 border border-slate-200/60 rounded-2xl p-4 flex items-center space-x-4">
        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">
            Synchronization
          </p>
          <p className="text-[11px] text-slate-600 font-medium leading-tight">
            Last updated 15 minutes ago from central ERP. Global quantities are verified across all bonded zones.
          </p>
        </div>
      </div>
    </div>
  );
};

export default InventoryProcurementPopup;
