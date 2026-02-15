
import React from 'react';
import { ItemVariant } from './ItemQueryScreen';

interface HistoryTileProps {
  label: string;
  value: string;
  isPeak?: boolean;
  isMain?: boolean;
}

const HistoryTile: React.FC<HistoryTileProps> = ({ label, value, isPeak, isMain }) => (
  <div className={`
    flex flex-col bg-white border rounded-2xl transition-all h-full justify-center
    ${isMain ? 'p-6 border-blue-200 shadow-xl ring-2 ring-blue-50 min-h-[120px]' : 'p-4 border-slate-200 shadow-md min-h-[92px]'}
    ${isPeak ? 'border-orange-300 ring-2 ring-orange-100/50 bg-orange-50/10' : ''}
  `}>
    <div className="flex justify-between items-start mb-1">
      <span className={`font-black uppercase tracking-[0.15em] ${isMain ? 'text-xs text-blue-900/70' : 'text-[11px] text-slate-500'}`}>
        {label}
      </span>
      {isPeak && (
        <span className="bg-orange-600 text-white text-[8px] font-black px-2 py-0.5 rounded-full uppercase shadow-sm">Peak</span>
      )}
    </div>
    <span className={`
      font-black tracking-tight leading-none
      ${isMain ? 'text-4xl text-blue-950 mt-2' : 'text-2xl mt-1.5'}
      ${isPeak ? 'text-orange-700' : isMain ? 'text-blue-950' : 'text-slate-900'}
    `}>
      {value}
    </span>
  </div>
);

const SalesKpiCard: React.FC<{ label: string; value: string; unit?: string }> = ({ label, value, unit }) => (
  <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm flex flex-col justify-center min-h-[85px]">
    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1.5 leading-tight">
      {label}
    </label>
    <div className="flex items-baseline space-x-1 overflow-hidden">
      <span className="text-sm font-black text-slate-900 truncate">{value}</span>
      {unit && <span className="text-[8px] font-black text-slate-400 uppercase">{unit}</span>}
    </div>
  </div>
);

const GroupTitle: React.FC<{ title: string }> = ({ title }) => (
  <div className="col-span-2 mt-6 mb-2">
    <div className="flex items-center space-x-3">
      <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] whitespace-nowrap">
        {title}
      </h4>
      <div className="flex-1 h-[1px] bg-slate-100"></div>
    </div>
  </div>
);

interface KpiItem {
  label: string;
  value: string;
  unit?: string;
  isPeak?: boolean;
}

const SalesViewPopup: React.FC<{ selectedVariant?: ItemVariant }> = ({ selectedVariant }) => {
  const TOTAL_SALES = { label: 'Total Sales', value: '722' };
  
  const YEARLY_HISTORY: KpiItem[] = [
    { label: '2025', value: '36' },
    { label: '2024', value: '40' },
    { label: '2023', value: '2' },
    { label: '2022', value: '21' },
    { label: '2021', value: '113' },
    { label: '2020', value: '179', isPeak: true },
    { label: '2019', value: '128' },
    { label: '2018', value: '–' },
    { label: '2017', value: '96' },
  ];

  const PRICING_KPIs: KpiItem[] = [
    { label: 'List Price', value: '0.00', unit: 'EUR' },
    { label: 'Net Price', value: '0.00', unit: 'EUR' },
    { label: 'Currency', value: 'EUR' },
    { label: 'Discount %', value: '0', unit: '%' },
  ];

  const PERFORMANCE_KPIs: KpiItem[] = [
    { label: 'Last Sold Date', value: '--/--/----' },
    { label: 'Last Sold Qty', value: '0' },
    { label: 'Avg Monthly Sales', value: '0' },
    { label: 'YTD Sales Qty', value: '0' },
  ];

  const MARKET_KPIs: KpiItem[] = [
    { label: 'Top Customer', value: 'N/A' },
    { label: 'Country Wise Sales', value: 'N/A' },
    { label: 'Sales Category', value: 'N/A' },
    { label: 'GM %', value: '0', unit: '%' },
  ];

  return (
    <div className="flex-1 flex flex-col pb-6 animate-in fade-in duration-500 max-h-full">
      
      {/* Sales History Block */}
      <div className="mb-8">
        <h5 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.25em] mb-4 ml-1">
          Sales History
        </h5>
        <div className="bg-slate-50/80 border border-slate-200 rounded-[32px] p-6 shadow-inner space-y-4">
          {/* Main Total Sales Card */}
          <HistoryTile label={TOTAL_SALES.label} value={TOTAL_SALES.value} isMain />
          
          {/* Fixed 3-Column Grid */}
          <div className="grid grid-cols-3 gap-4">
            {YEARLY_HISTORY.map((item, idx) => (
              <HistoryTile 
                key={idx} 
                label={item.label} 
                value={item.value} 
                isPeak={item.isPeak} 
              />
            ))}
          </div>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 gap-3">
        <GroupTitle title="Pricing" />
        {PRICING_KPIs.map((kpi, idx) => (
          <SalesKpiCard key={idx} label={kpi.label} value={kpi.value} unit={kpi.unit} />
        ))}

        <GroupTitle title="Sales Performance" />
        {PERFORMANCE_KPIs.map((kpi, idx) => (
          <SalesKpiCard key={idx} label={kpi.label} value={kpi.value} unit={kpi.unit} />
        ))}

        <GroupTitle title="Market / Margin" />
        {MARKET_KPIs.map((kpi, idx) => (
          <SalesKpiCard key={idx} label={kpi.label} value={kpi.value} unit={kpi.unit} />
        ))}
      </div>
    </div>
  );
};

export default SalesViewPopup;
