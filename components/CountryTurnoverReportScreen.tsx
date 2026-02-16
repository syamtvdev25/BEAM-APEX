
import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { brandingConfig } from '../config/brandingConfig';

const COUNTRIES = ['UAE', 'SAUDI ARABIA', 'QATAR', 'KUWAIT', 'OMAN', 'BAHRAIN', 'EGYPT', 'JORDAN', 'NIGERIA', 'ETHIOPIA'];
const BRANDS = ['SACHS', 'MAHLE', 'ELRING', 'BF', 'BORGWARNER', 'VICTOR REINZ', 'BOSCH', 'FEBI', 'LEMFORDER', 'ZF'];
const SALESMEN = [
  { id: '1', name: 'JOHN DOE' },
  { id: '2', name: 'JANE SMITH' },
  { id: '3', name: 'AHMED ALI' },
  { id: '4', name: 'SARAH KHAN' },
  { id: '5', name: 'MIKE ROSS' },
];

const MultiSelectList: React.FC<{
  title: string;
  items: any[];
  selectedItems: Set<string>;
  onToggle: (id: string) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  labelKey?: string;
  valueKey?: string;
}> = ({ title, items, selectedItems, onToggle, onSelectAll, onDeselectAll, labelKey, valueKey }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden mb-6">
    <div className="bg-slate-50 px-4 py-3 border-b border-slate-100 flex items-center justify-between">
      <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-widest">{title}</h3>
      <div className="flex space-x-3">
        <button onClick={onSelectAll} className="text-[9px] font-black text-blue-600 uppercase">All</button>
        <button onClick={onDeselectAll} className="text-[9px] font-black text-slate-400 uppercase">None</button>
      </div>
    </div>
    <div className="max-h-[200px] overflow-y-auto -webkit-overflow-scrolling-touch divide-y divide-slate-50">
      {items.map((item) => {
        const id = valueKey ? item[valueKey] : item;
        const label = labelKey ? item[labelKey] : item;
        const isSelected = selectedItems.has(id);
        return (
          <button
            key={id}
            onClick={() => onToggle(id)}
            className="w-full px-4 py-3 flex items-center justify-between active:bg-blue-50 transition-colors"
          >
            <span className={`text-[11px] font-bold uppercase tracking-tight ${isSelected ? 'text-blue-900' : 'text-slate-600'}`}>
              {label}
            </span>
            {isSelected && (
              <div className="w-4 h-4 bg-blue-900 rounded-full flex items-center justify-center">
                <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
          </button>
        );
      })}
    </div>
  </div>
);

const CountryTurnoverReportScreen: React.FC = () => {
  const navigate = useNavigate();
  const [fromDate, setFromDate] = useState('2026-01-01');
  const [toDate, setToDate] = useState('2026-02-10');
  const [selectedCountries, setSelectedCountries] = useState<Set<string>>(new Set());
  const [selectedBrands, setSelectedBrands] = useState<Set<string>>(new Set());
  const [selectedSalesmen, setSelectedSalesmen] = useState<Set<string>>(new Set());

  const toggleSelection = (set: Set<string>, setter: (s: Set<string>) => void, id: string) => {
    const next = new Set(set);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setter(next);
  };

  const handleClear = () => {
    setSelectedCountries(new Set());
    setSelectedBrands(new Set());
    setSelectedSalesmen(new Set());
  };

  const handleGenerate = () => {
    navigate('/country-turnover-report/result', {
      state: {
        fromDate,
        toDate,
        countries: Array.from(selectedCountries),
        brands: Array.from(selectedBrands),
        salesmen: Array.from(selectedSalesmen)
      }
    });
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50 h-screen overflow-hidden">
      <header className="bg-gradient-to-r from-[#003366] to-[#00599F] px-4 py-4 flex items-center sticky top-0 z-30 shadow-xl rounded-b-[24px] shrink-0">
        <button onClick={() => navigate('/erp')} className="mr-3 p-2 bg-white/10 border border-white/20 rounded-xl text-white active:scale-90 transition-all shrink-0">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
        </button>
        <div className="w-8 h-8 mr-3 bg-white rounded-lg p-1 shadow-sm shrink-0">
          <img src={brandingConfig.logoPath} alt="" className="w-full h-full object-contain" />
        </div>
        <div className="flex flex-col min-w-0">
          <h2 className="text-[10px] font-black text-white/70 tracking-widest uppercase leading-none mb-1">{brandingConfig.appName}</h2>
          <span className="text-[15px] font-black text-white uppercase tracking-tight leading-tight">Country Turnover Report</span>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 -webkit-overflow-scrolling-touch pb-32">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 mb-6">
          <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-4">Date Range</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 block">From</label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-blue-900 outline-none transition-all"
              />
            </div>
            <div>
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 block">To</label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-blue-900 outline-none transition-all"
              />
            </div>
          </div>
        </div>

        <MultiSelectList
          title="Countries"
          items={COUNTRIES}
          selectedItems={selectedCountries}
          onToggle={(id) => toggleSelection(selectedCountries, setSelectedCountries, id)}
          onSelectAll={() => setSelectedCountries(new Set(COUNTRIES))}
          onDeselectAll={() => setSelectedCountries(new Set())}
        />

        <MultiSelectList
          title="Brands"
          items={BRANDS}
          selectedItems={selectedBrands}
          onToggle={(id) => toggleSelection(selectedBrands, setSelectedBrands, id)}
          onSelectAll={() => setSelectedBrands(new Set(BRANDS))}
          onDeselectAll={() => setSelectedBrands(new Set())}
        />

        <MultiSelectList
          title="Salesmen"
          items={SALESMEN}
          labelKey="name"
          valueKey="id"
          selectedItems={selectedSalesmen}
          onToggle={(id) => toggleSelection(selectedSalesmen, setSelectedSalesmen, id)}
          onSelectAll={() => setSelectedSalesmen(new Set(SALESMEN.map(s => s.id)))}
          onDeselectAll={() => setSelectedSalesmen(new Set())}
        />
      </main>

      <footer 
        className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-6 pt-4 shadow-2xl z-40 flex flex-col space-y-3"
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 12px)' }}
      >
        <button
          onClick={handleGenerate}
          className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black uppercase tracking-[0.2em] shadow-lg active:scale-95 transition-all text-xs"
        >
          Generate Report
        </button>
        <button
          onClick={handleClear}
          className="w-full bg-slate-100 text-slate-400 py-3 rounded-2xl font-black uppercase tracking-widest active:scale-95 transition-all text-[10px]"
        >
          Clear Selection
        </button>
      </footer>
    </div>
  );
};

export default CountryTurnoverReportScreen;
