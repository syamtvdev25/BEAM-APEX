
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import BrandingHeader from './BrandingHeader';

const COUNTRIES = ['UAE', 'SAUDI ARABIA', 'QATAR', 'KUWAIT', 'OMAN', 'BAHRAIN', 'EGYPT', 'JORDAN', 'NIGERIA', 'ETHIOPIA'];
const BRANDS = ['SACHS', 'MAHLE', 'ELRING', 'BF', 'BORGWARNER', 'VICTOR REINZ', 'BOSCH', 'FEBI', 'LEMFORDER', 'ZF'];
const SALESMEN = [
  { id: '1', name: 'JOHN DOE' },
  { id: '2', name: 'JANE SMITH' },
  { id: '3', name: 'AHMED ALI' },
  { id: '4', name: 'SARAH KHAN' },
  { id: '5', name: 'MIKE ROSS' },
];

const ACCOUNTS = [
  { code: 'A1001', name: 'TRUCK ZONE AUTO SPARE PARTS LLC' },
  { code: 'A1002', name: 'ABAYAR AL QASSIM TRADING EST.' },
  { code: 'A1003', name: 'ABDUL KAREEM TAHA AL HADDAD' },
  { code: 'A1004', name: 'ABDUL RAHMAN BANAEM TRADING EST' },
  { code: 'A1005', name: 'GLOBAL LOGISTICS PARTS LTD' },
  { code: 'A1006', name: 'AL KHAIL AUTO SPARE PARTS' },
  { code: 'A1007', name: 'PREMIER MOTORS FZC' },
  { code: 'A1008', name: 'ELITE TRUCK PARTS' },
  { code: 'A1009', name: 'SAHARA GEN TRADING' },
  { code: 'A1010', name: 'GULF PARTS CENTER' },
  { code: 'A1011', name: 'QUICK FIX AUTO SERVICES' },
  { code: 'A1012', name: 'METRO TRADING CO' },
  { code: 'A1013', name: 'RED SEA SPARE PARTS' },
  { code: 'A1014', name: 'DESERT ROAD AUTO' },
  { code: 'A1015', name: 'TITAN HEAVY EQUIPMENT' },
];

const MasterSelectionList: React.FC<{
  title: string;
  items: any[];
  selectedItems: Set<string>;
  onToggle: (id: string) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  labelKey?: (item: any) => string;
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
    <div className="max-h-[160px] overflow-y-auto -webkit-overflow-scrolling-touch divide-y divide-slate-50">
      {items.map((item) => {
        const id = valueKey ? item[valueKey] : item;
        const label = labelKey ? labelKey(item) : item;
        const isSelected = selectedItems.has(id);
        return (
          <button
            key={id}
            onClick={() => onToggle(id)}
            className="w-full px-4 py-2.5 flex items-center justify-between active:bg-blue-50 transition-colors text-left"
          >
            <span className={`text-[10.5px] font-bold uppercase tracking-tight leading-tight ${isSelected ? 'text-blue-900' : 'text-slate-600'}`}>
              {label}
            </span>
            {isSelected && (
              <div className="w-3.5 h-3.5 bg-blue-900 rounded-full flex items-center justify-center shrink-0 ml-2">
                <svg className="w-2 h-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

const TotalCustomerSalesByCountrySalesmanFilterScreen: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const initialData = location.state || {};

  const [fromDate, setFromDate] = useState(initialData.fromDate || '2026-01-01');
  const [toDate, setToDate] = useState(initialData.toDate || '2026-02-16');
  const [selectedBrands, setSelectedBrands] = useState<Set<string>>(new Set(initialData.selectedBrands || []));
  const [selectedCountries, setSelectedCountries] = useState<Set<string>>(new Set(initialData.selectedCountries || []));
  const [selectedAccounts, setSelectedAccounts] = useState<Set<string>>(new Set(initialData.selectedAccounts || []));
  const [selectedSalesmen, setSelectedSalesmen] = useState<Set<string>>(new Set(initialData.selectedSalesmen || []));

  const toggleSelection = (set: Set<string>, setter: (s: Set<string>) => void, id: string) => {
    const next = new Set(set);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setter(next);
  };

  const handleClear = () => {
    setSelectedBrands(new Set());
    setSelectedCountries(new Set());
    setSelectedAccounts(new Set());
    setSelectedSalesmen(new Set());
  };

  const handleGenerate = () => {
    navigate('/customer-sales-country-salesman/result', {
      state: {
        fromDate,
        toDate,
        selectedBrands: Array.from(selectedBrands),
        selectedCountries: Array.from(selectedCountries),
        selectedAccounts: Array.from(selectedAccounts),
        selectedSalesmen: Array.from(selectedSalesmen)
      }
    });
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50 h-screen overflow-hidden">
      <BrandingHeader title="Total Customer Sales By Country – Salesman" onBack={() => navigate('/erp')} />
      
      <main className="flex-1 overflow-y-auto p-4 -webkit-overflow-scrolling-touch pb-40">
        {/* Date Range Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 mb-6">
          <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-4">Date Range (Between)</h3>
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

        <MasterSelectionList
          title="Brand"
          items={BRANDS}
          selectedItems={selectedBrands}
          onToggle={(id) => toggleSelection(selectedBrands, setSelectedBrands, id)}
          onSelectAll={() => setSelectedBrands(new Set(BRANDS))}
          onDeselectAll={() => setSelectedBrands(new Set())}
        />

        <MasterSelectionList
          title="Country"
          items={COUNTRIES}
          selectedItems={selectedCountries}
          onToggle={(id) => toggleSelection(selectedCountries, setSelectedCountries, id)}
          onSelectAll={() => setSelectedCountries(new Set(COUNTRIES))}
          onDeselectAll={() => setSelectedCountries(new Set())}
        />

        <MasterSelectionList
          title="Account"
          items={ACCOUNTS}
          labelKey={(item) => `${item.code} – ${item.name}`}
          valueKey="code"
          selectedItems={selectedAccounts}
          onToggle={(id) => toggleSelection(selectedAccounts, setSelectedAccounts, id)}
          onSelectAll={() => setSelectedAccounts(new Set(ACCOUNTS.map(a => a.code)))}
          onDeselectAll={() => setSelectedAccounts(new Set())}
        />

        <MasterSelectionList
          title="Salesman"
          items={SALESMEN}
          labelKey={(item) => item.name}
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
          className="w-full bg-[#003366] text-white py-4 rounded-2xl font-black uppercase tracking-[0.2em] shadow-lg active:scale-95 transition-all text-xs"
        >
          GENERATE REPORT
        </button>
        <button
          onClick={handleClear}
          className="w-full bg-slate-100 text-slate-400 py-3 rounded-2xl font-black uppercase tracking-widest active:scale-95 transition-all text-[10px]"
        >
          CLEAR SELECTION
        </button>
      </footer>
    </div>
  );
};

export default TotalCustomerSalesByCountrySalesmanFilterScreen;
