
import React, { useMemo } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import PageShell from '../PageShell';

const SectionHeader: React.FC<{ title: string; subtitle?: string; icon?: React.ReactNode }> = ({ title, subtitle, icon }) => (
  <div className="flex items-center justify-between mb-3 px-1">
    <div className="flex items-center space-x-3">
      {icon && <div className="text-blue-900">{icon}</div>}
      <div>
        <h3 className="text-[10px] font-black text-blue-900 uppercase tracking-[0.25em] leading-none">{title}</h3>
        {subtitle && <p className="text-[8px] font-bold text-slate-400 uppercase mt-1 tracking-widest">{subtitle}</p>}
      </div>
    </div>
  </div>
);

const InfoRow: React.FC<{ label: string; value: string | number; mono?: boolean }> = ({ label, value, mono }) => (
  <div className="flex justify-between items-center py-2.5 border-b border-slate-50 last:border-0 group">
    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-tight group-active:text-blue-600 transition-colors">{label}</span>
    <span className={`text-[12px] font-black text-slate-800 uppercase text-right tracking-tight ${mono ? 'font-mono' : ''}`}>
      {value || '—'}
    </span>
  </div>
);

const KpiCard: React.FC<{ label: string; value: string | number; color?: string; onClick: () => void }> = ({ label, value, color = "text-blue-900", onClick }) => (
  <button 
    onClick={onClick}
    className="bg-white px-4 py-2.5 rounded-xl border border-slate-100 shadow-sm active:scale-[0.98] transition-all text-left flex items-center justify-between min-h-[64px]"
  >
    <div className="flex flex-col flex-1 min-w-0">
      <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1.5 truncate">{label}</span>
      <div className="flex items-baseline space-x-1.5">
        <span className={`text-lg font-black ${color} tracking-tight`}>{value}</span>
        <span className="text-[8px] font-bold text-slate-300 uppercase tracking-widest">Unit</span>
      </div>
    </div>
    <svg className="w-3 h-3 text-slate-200 shrink-0 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7"/>
    </svg>
  </button>
);

const SalesHeroCard: React.FC<{ value: string | number; onClick: () => void }> = ({ value, onClick }) => (
  <button 
    onClick={onClick}
    className="w-full bg-gradient-to-br from-blue-900 to-[#003d7a] rounded-2xl px-6 py-3.5 shadow-lg shadow-blue-900/10 text-left relative overflow-hidden active:scale-[0.98] transition-all group animate-in fade-in zoom-in-98 duration-300"
  >
    <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-8 -mt-8 group-hover:scale-110 transition-transform duration-700" />
    <div className="relative z-10 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <span className="text-[9px] font-black text-blue-300 uppercase tracking-[0.2em]">Total Sales</span>
        <span className="text-2xl font-black text-white tracking-tighter">{value}</span>
      </div>
      <div className="flex items-center space-x-3">
        <span className="text-[8px] font-bold text-blue-400 uppercase tracking-widest opacity-80">Units Consumed</span>
        <svg className="w-3 h-3 text-blue-400/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7"/>
        </svg>
      </div>
    </div>
  </button>
);

const YearlyKpiCard: React.FC<{ 
  year: string; 
  value: string | number; 
  trend?: 'up' | 'down' | 'neutral'; 
  isPeak?: boolean;
  onClick: () => void 
}> = ({ year, value, trend, isPeak, onClick }) => (
  <button 
    onClick={onClick}
    className="bg-white rounded-2xl p-3.5 border border-slate-100 shadow-sm flex flex-col justify-between min-h-[82px] active:scale-[0.97] transition-all text-left relative group hover:border-blue-100"
  >
    <div className="flex justify-between items-start">
      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{year}</span>
      {trend === 'up' && <span className="text-[10px] text-emerald-500 font-bold leading-none">↑</span>}
      {trend === 'down' && <span className="text-[10px] text-rose-400 font-bold leading-none">↓</span>}
      {isPeak && (
        <div className="absolute -top-1.5 -right-1 bg-orange-500 text-white text-[7px] font-black px-1.5 py-0.5 rounded shadow-sm uppercase">Peak</div>
      )}
    </div>
    <div className="mt-1 flex items-baseline justify-between">
      <span className={`text-lg font-black tracking-tight ${value === '—' ? 'text-slate-200' : 'text-slate-800'}`}>
        {value}
      </span>
      <svg className="w-2.5 h-2.5 text-slate-200 group-hover:text-blue-900 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M9 5l7 7-7 7"/>
      </svg>
    </div>
  </button>
);

const EmployeeERPPage: React.FC = () => {
  const navigate = useNavigate();
  const { artNr } = useParams();
  const location = useLocation();
  const itemData = location.state;

  const navigateToMetric = (type: string) => {
    navigate(`/erp/metric/${type}/${encodeURIComponent(artNr || '')}`, { state: itemData });
  };

  const navigateToYearlyHistory = (year: string) => {
    alert(`Sales History Drill-Down: Year ${year}`);
  };

  const salesHistoryData = [
    { year: '2025', value: '36' },
    { year: '2024', value: '40' },
    { year: '2023', value: '2' },
    { year: '2022', value: '21' },
    { year: '2021', value: '113' },
    { year: '2020', value: '179' },
    { year: '2019', value: '128' },
    { year: '2018', value: '—' },
    { year: '2017', value: '96' },
  ];

  // Helper to determine visual trend
  const getTrend = (index: number) => {
    if (index >= salesHistoryData.length - 1) return 'neutral';
    const current = parseInt(salesHistoryData[index].value) || 0;
    const previous = parseInt(salesHistoryData[index + 1].value) || 0;
    if (current > previous) return 'up';
    if (current < previous) return 'down';
    return 'neutral';
  };

  const maxSalesValue = useMemo(() => {
    return Math.max(...salesHistoryData.map(d => parseInt(d.value) || 0));
  }, [salesHistoryData]);

  return (
    <PageShell title="ERP Data Context" onBack={() => navigate(-1)}>
      <div className="flex-1 bg-slate-50 overflow-y-auto scroll-smooth animate-in fade-in duration-300">
        <div className="max-w-4xl mx-auto p-4 space-y-6 pb-20">
          
          {/* COMPACT TWO-COLUMN HEADER BLOCK */}
          <header className="bg-white rounded-[28px] p-5 shadow-sm border border-slate-100">
            <div className="flex flex-col space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] truncate pr-4">
                  {itemData?.Brand || 'BORGWARNER'}
                </span>
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">
                  SX-01
                </span>
              </div>
              <div className="flex justify-between items-baseline">
                <h2 className="text-2xl font-black text-blue-900 uppercase tracking-tight leading-none font-mono truncate pr-4">
                   {artNr || itemData?.ArtNr}
                </h2>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight truncate max-w-[40%] text-right">
                  MERCEDES-BENZ TRUCK
                </span>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-[12px] font-semibold text-slate-500 uppercase tracking-tight truncate pr-4">
                  DB CAB SUSPENSION DAMPER
                </p>
                <span className="text-[10px] font-bold text-slate-300 uppercase tracking-tight truncate max-w-[40%] text-right">
                  AXLE & SUSPENSION
                </span>
              </div>
            </div>
          </header>

          {/* 1) PRODUCT DETAILS (MASTER DATA) */}
          <section className="mt-2">
            <SectionHeader title="Product Details" />
            <div className="bg-white rounded-[28px] p-6 shadow-sm border border-slate-100">
               <InfoRow label="Manufacturer" value="Mercedes-Benz Truck" />
               <InfoRow label="Product Group" value="Axle & Suspension" />
               <InfoRow label="Sub Group" value="Shock Absorbers" />
               <InfoRow label="Brand Identity" value={itemData?.Brand || 'APEX'} />
            </div>
          </section>

          {/* 2) ERP STOCK STATUS (OPERATIONAL KPIs) */}
          <section>
            <SectionHeader title="ERP Stock Status" subtitle="Live Operational Metrics" />
            <div className="px-1 mb-5">
              <p className="text-[11px] font-bold text-slate-400 leading-relaxed uppercase tracking-tight">
                {itemData?.Bez || 'Article description loading...'}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <KpiCard label="Client Backorder" value="40" onClick={() => navigateToMetric('client-backorder')} />
              <KpiCard label="Reserved Stock" value="12" onClick={() => navigateToMetric('reserved')} />
              <KpiCard label="Under Packing" value="8" color="text-orange-500" onClick={() => navigateToMetric('under-packing')} />
              <KpiCard label="Balance Quantity" value="156" color="text-emerald-500" onClick={() => navigateToMetric('balance')} />
              <div className="col-span-2">
                <KpiCard label="Under Counting / Verification" value="0" onClick={() => navigateToMetric('verification')} />
              </div>
            </div>
          </section>

          {/* 3) SALES HISTORY (HISTORICAL KPI DASHBOARD) */}
          <section>
            <SectionHeader title="Sales History" subtitle="Yearly Performance" />
            <div className="space-y-3">
               <SalesHeroCard 
                 value="722" 
                 onClick={() => navigateToYearlyHistory('All Time')} 
               />
               <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                 {salesHistoryData.map((item, idx) => (
                   <YearlyKpiCard 
                     key={item.year} 
                     year={item.year} 
                     value={item.value} 
                     trend={getTrend(idx)}
                     isPeak={parseInt(item.value) === maxSalesValue}
                     onClick={() => navigateToYearlyHistory(item.year)}
                   />
                 ))}
               </div>
            </div>
            <div className="mt-6 flex justify-center opacity-10">
              <div className="w-12 h-1 bg-slate-900 rounded-full" />
            </div>
          </section>

          {/* 4) PURCHASE INFO (SUPPLY PIPELINE) */}
          <section>
            <SectionHeader title="Purchase Info" subtitle="Inbound Logistics" />
            <div className="bg-white rounded-[28px] p-6 shadow-sm border border-slate-100">
               <InfoRow label="Country of Origin" value="Germany" />
               <InfoRow label="Supplier Backorder" value="30" />
               <InfoRow label="Transit Quantity" value="15" />
               <InfoRow label="Open PO Qty" value="200" />
               <InfoRow label="AG Bonded Qty" value="0" />
            </div>
          </section>

          {/* 5) SALES DETAILS (COMMERCIAL RULES) */}
          <section>
            <SectionHeader title="Sales Details" subtitle="Commercial Configuration" />
            <div className="bg-white rounded-[28px] p-6 shadow-sm border border-slate-100">
               <InfoRow label="Packing Unit" value="1 pc" />
               <InfoRow label="Minimum Order Qty" value="1" />
               <InfoRow label="Total Group Bal" value="412" />
               <div className="mt-4 pt-4 border-t border-slate-50 space-y-4">
                 <div>
                   <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">Remarks (Purchase)</p>
                   <p className="text-[11px] font-bold text-slate-600 leading-relaxed uppercase">Order confirmed for next shipment Q3-2024.</p>
                 </div>
                 <div>
                   <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">Remarks (Sales)</p>
                   <p className="text-[11px] font-bold text-slate-600 leading-relaxed uppercase">Internal stock transfer pending approval.</p>
                 </div>
               </div>
            </div>
          </section>

          {/* 6) REPORTS (FUTURE) */}
          <section>
            <SectionHeader title="Reports" subtitle="Analytical Deep-Dive" />
            <div className="space-y-3">
              {['Stock Movement History', 'Backorder Aging Analysis', 'Sales vs Procurement Trend'].map((rep) => (
                <div key={rep} className="bg-slate-100/50 p-5 rounded-2xl border border-dashed border-slate-200 flex justify-between items-center opacity-60">
                   <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{rep}</span>
                   <span className="text-[8px] font-black bg-slate-200 text-slate-500 px-2 py-1 rounded uppercase">Coming Soon</span>
                </div>
              ))}
            </div>
          </section>

          <div className="py-12 text-center opacity-20">
             <p className="text-[8px] font-black text-slate-300 uppercase tracking-[0.4em]">APEX GULF SUPPLY CHAIN ANALYTICS</p>
          </div>
        </div>
      </div>
    </PageShell>
  );
};

export default EmployeeERPPage;
