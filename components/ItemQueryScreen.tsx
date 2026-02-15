
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GeneralPopup from './GeneralPopup';
import ReportsPopup from './ReportsPopup';
import InventoryProcurementPopup from './InventoryProcurementPopup';
import ItemQueryPopup from './ItemQueryPopup';
import ProductDetailsPopup from './ProductDetailsPopup';
import SalesViewPopup from './SalesViewPopup';

export interface ItemVariant {
  partNo: string;
  brand: string;
  suffix: string;
}

type SectionType = 'item' | 'sales' | 'trend' | 'product' | 'general' | 'inventory' | 'reports' | null;

interface CascadingSectionProps {
  id: SectionType;
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  headerExtra?: React.ReactNode;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

const CascadingSection: React.FC<CascadingSectionProps> = ({ 
  id, 
  title, 
  subtitle, 
  icon, 
  headerExtra,
  isExpanded, 
  onToggle, 
  children 
}) => {
  return (
    <div className={`mb-4 transition-all duration-300 ${isExpanded ? 'ring-2 ring-blue-900/10' : ''}`}>
      <button
        onClick={onToggle}
        className={`w-full flex items-start p-5 bg-white rounded-3xl shadow-md border transition-all active:scale-[0.99] ${
          isExpanded ? 'border-blue-100 rounded-b-none shadow-lg' : 'border-white'
        }`}
      >
        {icon && (
          <div className={`p-3.5 rounded-2xl transition-all duration-300 shrink-0 ${isExpanded ? 'bg-blue-900 text-white shadow-lg shadow-blue-900/20' : 'bg-slate-50 text-slate-500'}`}>
            {icon}
          </div>
        )}
        
        <div className={`flex-1 flex flex-col sm:flex-row sm:items-center min-w-0 ${icon ? 'ml-4' : 'ml-1'}`}>
          <div className="flex-1 min-w-0 text-left pr-2">
            <h3 className="text-base font-black text-slate-900 uppercase tracking-tight leading-tight truncate">
              {title}
            </h3>
            {subtitle && (
              <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest mt-0.5 opacity-80 truncate">
                {subtitle}
              </p>
            )}
          </div>
          {headerExtra && (
            <div className="mt-2 sm:mt-0 flex flex-wrap gap-2 items-center max-w-full overflow-visible">
              {headerExtra}
            </div>
          )}
        </div>

        <div className={`shrink-0 ml-2 mt-0.5 transition-transform duration-300 ${isExpanded ? 'rotate-180 text-blue-900' : 'rotate-0 text-slate-300'}`}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      <div 
        className={`overflow-hidden transition-all duration-500 ease-in-out bg-white border-x border-b border-blue-50 rounded-b-3xl ${
          isExpanded ? 'max-h-[2000px] opacity-100 shadow-xl' : 'max-h-0 opacity-0 border-none'
        }`}
      >
        <div className="p-6 pt-2 border-t border-slate-50">
          <div className="bg-slate-50/40 rounded-2xl p-2 sm:p-6 min-h-[120px]">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * TREND ANALYSIS COMPONENT
 * Standalone ERP Modules for Stock, Back Order, and Transit
 */
const TrendAnalysisModule: React.FC<{ partNo: string }> = ({ partNo }) => {
  const ERP_TH = "bg-slate-50 border-y border-slate-200 px-1 py-1.5 text-[7px] font-black text-slate-500 uppercase tracking-tighter text-center sticky top-0 z-10 whitespace-nowrap";
  const ERP_TD = "px-1 py-1 text-[7.5px] font-medium text-slate-800 border-b border-slate-100 truncate";
  const ERP_TD_NUM = "px-1 py-1 text-[7.5px] font-bold text-slate-900 border-b border-slate-100 text-right font-mono";

  return (
    <div className="p-4 space-y-8 bg-white">
      {/* 1. STOCK MOVEMENT LEDGER */}
      <section className="space-y-3">
        <h5 className="text-[10px] font-black text-blue-900 uppercase tracking-widest flex items-center">
          <span className="w-1.5 h-1.5 bg-blue-900 rounded-full mr-2"></span>
          Stock Movement Ledger
        </h5>
        <div className="bg-slate-50/50 p-3 rounded-xl border border-slate-100">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <p className="text-[10px] font-black text-slate-900 truncate">{partNo} – DB CAB SUSPENSION DAMPER</p>
            <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">
              Low: <span className="text-slate-900">0.00 (09/03/17)</span> • High: <span className="text-slate-900">272.00 (31/12/18)</span>
            </p>
          </div>
        </div>
        <div className="overflow-x-hidden border border-slate-200 rounded-lg">
          <table className="w-full table-fixed border-collapse">
            <thead>
              <tr>
                <th className={ERP_TH} style={{width: '12%'}}>Date</th>
                <th className={ERP_TH} style={{width: '12%'}}>Voucher</th>
                <th className={ERP_TH} style={{width: '16%'}}>Account</th>
                <th className={ERP_TH} style={{width: '8%'}}>R.Qty</th>
                <th className={ERP_TH} style={{width: '10%'}}>R.Rate</th>
                <th className={ERP_TH} style={{width: '8%'}}>I.Qty</th>
                <th className={ERP_TH} style={{width: '10%'}}>I.Rate</th>
                <th className={ERP_TH} style={{width: '10%'}}>I.Val</th>
                <th className={ERP_TH} style={{width: '7%'}}>Bal</th>
                <th className={ERP_TH} style={{width: '7%'}}>Avg</th>
              </tr>
            </thead>
            <tbody>
              {[1,2,3].map(i => (
                <tr key={i} className="hover:bg-slate-50">
                  <td className={ERP_TD}>12/04/2024</td>
                  <td className={ERP_TD}>V-992{i}</td>
                  <td className={ERP_TD} title="Global Logistics Parts Ltd">Global Logi...</td>
                  <td className={ERP_TD_NUM}>120</td>
                  <td className={ERP_TD_NUM}>85.00</td>
                  <td className={ERP_TD_NUM}>0</td>
                  <td className={ERP_TD_NUM}>0.00</td>
                  <td className={ERP_TD_NUM}>0.00</td>
                  <td className={ERP_TD_NUM}>240</td>
                  <td className={ERP_TD_NUM}>85.20</td>
                </tr>
              ))}
              <tr>
                <td colSpan={10} className="py-6 text-center text-[9px] font-black text-slate-300 uppercase italic">
                  No further stock movement records
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 2. SUPPLIER BACK ORDER */}
      <section className="space-y-3">
        <h5 className="text-[10px] font-black text-orange-900 uppercase tracking-widest flex items-center">
          <span className="w-1.5 h-1.5 bg-orange-600 rounded-full mr-2"></span>
          Supplier Back Order
        </h5>
        <div className="overflow-x-hidden border border-slate-200 rounded-lg">
          <table className="w-full table-fixed border-collapse">
            <thead>
              <tr>
                <th className={ERP_TH}>Date</th>
                <th className={ERP_TH}>Our Ref</th>
                <th className={ERP_TH}>Supplier</th>
                <th className={ERP_TH}>Qty</th>
                <th className={ERP_TH}>Price</th>
                <th className={ERP_TH}>Del.Date</th>
                <th className={ERP_TH}>Remarks</th>
                <th className={ERP_TH}>CUR</th>
                <th className={ERP_TH}>PO No</th>
                <th className={ERP_TH}>Pos</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className={ERP_TD}>02/05/24</td>
                <td className={ERP_TD}>REF-01</td>
                <td className={ERP_TD}>SACHS AG</td>
                <td className={ERP_TD_NUM}>15</td>
                <td className={ERP_TD_NUM}>78.20</td>
                <td className={ERP_TD}>30/06/24</td>
                <td className={ERP_TD}>Pending</td>
                <td className={ERP_TD}>EUR</td>
                <td className={ERP_TD}>PO-981</td>
                <td className={ERP_TD}>01</td>
              </tr>
              <tr className="bg-yellow-50/50">
                <td colSpan={3} className="px-2 py-1.5 text-[8px] font-black text-slate-900 uppercase border-y border-slate-200">Sub Total :: {partNo}</td>
                <td className="px-1 py-1.5 text-[8px] font-black text-red-600 text-right border-y border-slate-200">15</td>
                <td className="px-1 py-1.5 text-[8px] font-black text-red-600 text-right border-y border-slate-200">78.20</td>
                <td colSpan={5} className="border-y border-slate-200"></td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 3. GOODS IN TRANSIT WITH PRICE */}
      <section className="space-y-3">
        <h5 className="text-[10px] font-black text-green-900 uppercase tracking-widest flex items-center">
          <span className="w-1.5 h-1.5 bg-green-600 rounded-full mr-2"></span>
          Goods In Transit with Price
        </h5>
        <div className="overflow-x-hidden border border-slate-200 rounded-lg">
          <table className="w-full table-fixed border-collapse">
            <thead>
              <tr>
                <th className={ERP_TH}>Arr.Date</th>
                <th className={ERP_TH}>Our Ref</th>
                <th className={ERP_TH}>Supplier</th>
                <th className={ERP_TH}>Qty</th>
                <th className={ERP_TH}>Price</th>
                <th className={ERP_TH}>ETA</th>
                <th className={ERP_TH}>Ord.Conf</th>
                <th className={ERP_TH}>CUR</th>
                <th className={ERP_TH}>Pos</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className={ERP_TD}>15/06/24</td>
                <td className={ERP_TD}>TX-402</td>
                <td className={ERP_TD}>BorgWarner</td>
                <td className={ERP_TD_NUM}>8</td>
                <td className={ERP_TD_NUM}>240.50</td>
                <td className={ERP_TD}>18/06/24</td>
                <td className={ERP_TD}>OC-221</td>
                <td className={ERP_TD}>EUR</td>
                <td className={ERP_TD}>05</td>
              </tr>
              <tr className="bg-yellow-50/50">
                <td colSpan={3} className="px-2 py-1.5 text-[8px] font-black text-slate-900 uppercase border-y border-slate-200">Sub Total :: {partNo}</td>
                <td className="px-1 py-1.5 text-[8px] font-black text-red-600 text-right border-y border-slate-200">8</td>
                <td colSpan={5} className="border-y border-slate-200"></td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

const ClickableBadgePopover: React.FC<{
  label: string;
  value: string;
  type: 'brand' | 'suffix';
}> = ({ label, value, type }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEsc);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen]);

  const config = type === 'brand' ? {
    bg: 'bg-green-50',
    border: 'border-green-200',
    activeBorder: 'ring-2 ring-green-400 border-green-300',
    text: 'text-green-900',
    dot: 'text-green-900/40',
    label: 'text-green-900/70',
    width: 'max-w-[140px] sm:max-w-[180px]'
  } : {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    activeBorder: 'ring-2 ring-blue-400 border-blue-300',
    text: 'text-blue-900',
    dot: 'text-blue-900/40',
    label: 'text-blue-900/70',
    width: 'max-w-[110px] sm:max-w-[160px]'
  };

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className={`
          ${config.bg} 
          ${isOpen ? config.activeBorder : config.border} 
          border rounded-full px-3 py-1 flex items-center space-x-2 shadow-sm h-7 whitespace-nowrap overflow-hidden 
          ${config.width} transition-all active:scale-95 cursor-pointer
        `}
      >
        <span className={`text-[10px] font-black ${config.label} uppercase tracking-widest leading-none shrink-0`}>
          {label}
        </span>
        <span className={`${config.dot} font-bold leading-none shrink-0`}>•</span>
        <span className={`text-[11px] font-black ${config.text} uppercase leading-none truncate`}>
          {value || '...'}
        </span>
      </button>

      {isOpen && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 z-[100] animate-in fade-in zoom-in slide-in-from-bottom-2 duration-200">
          <div className="bg-white border border-slate-100 rounded-xl p-3 shadow-xl min-w-[150px] max-w-[220px] text-center relative">
            <span className="block text-[8px] font-black text-slate-400 uppercase tracking-[0.25em] mb-1.5 border-b border-slate-50 pb-1">
              Full {label}
            </span>
            <span className="block text-xs font-black text-slate-900 whitespace-normal break-words leading-tight">
              {value}
            </span>
            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 w-2.5 h-2.5 bg-white border-r border-b border-slate-100 rotate-45 shadow-sm"></div>
          </div>
        </div>
      )}
    </div>
  );
};

const EmptySectionPlaceholder: React.FC<{ message: string }> = ({ message }) => (
  <div className="flex flex-col items-center justify-center py-10 text-center opacity-40">
    <div className="w-12 h-12 mb-3 bg-slate-200 rounded-full flex items-center justify-center text-slate-400">
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
      </svg>
    </div>
    <p className="text-[11px] font-black text-slate-900 uppercase tracking-widest px-10">
      {message}
    </p>
  </div>
);

const ItemQueryScreen: React.FC = () => {
  const navigate = useNavigate();
  const [expandedSection, setExpandedSection] = useState<SectionType>('item');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<ItemVariant[]>([]);
  const [selectedItem, setSelectedItem] = useState<ItemVariant | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [showVariantPanel, setShowVariantPanel] = useState(false);

  const handleSearch = () => {
    const trimmed = searchQuery.trim().replace(/\s/g, '');
    if (!trimmed) return;
    setHasSearched(true);
    setSelectedItem(null);
    if (trimmed === '316699' || trimmed === '316.699') {
      const results: ItemVariant[] = [
        { partNo: '316.699', brand: 'SACHS', suffix: 'SX' },
        { partNo: '316.699', brand: 'BORGWARNER', suffix: 'BW' },
        { partNo: '316.699', brand: 'ELRING', suffix: 'EL:01' },
      ];
      setSearchResults(results);
      setShowVariantPanel(true);
    } else {
      setSearchResults([]);
      setShowVariantPanel(false);
    }
  };

  const handleSelectVariant = (variant: ItemVariant) => {
    setSelectedItem(variant);
    setShowVariantPanel(false);
  };

  const handleToggle = (id: SectionType) => {
    setExpandedSection(expandedSection === id ? null : id);
  };

  const sectionPlaceholderMessage = useMemo(() => {
    if (!hasSearched) return "Search for an item to view data";
    if (searchResults.length > 1 && !selectedItem) return "Please select a Brand/Suffix variant to view details";
    if (searchResults.length === 0) return "No matches found for this search";
    return "";
  }, [hasSearched, searchResults, selectedItem]);

  return (
    <div className="flex-1 flex flex-col bg-slate-50 h-screen overflow-hidden">
      <header className="px-6 py-4 border-b border-slate-100 flex items-center bg-white z-20 shadow-sm shrink-0">
        <button 
          onClick={() => navigate('/dashboard')} 
          className="mr-3 flex items-center space-x-1 p-2 -ml-2 rounded-xl hover:bg-slate-100 text-slate-900 active:scale-90 transition-all group"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
          </svg>
          <span className="hidden sm:inline text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-slate-900 transition-colors">Home</span>
        </button>
        <div className="flex-1 flex items-center justify-between min-w-0">
          <div className="flex items-center space-x-3 truncate">
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight truncate">Item Query</h2>
            {selectedItem && (
              <div className="hidden xs:flex bg-blue-900/10 px-3 py-1 rounded-full items-center space-x-2 animate-in fade-in slide-in-from-right-2 duration-300 shrink-0">
                <span className="w-1.5 h-1.5 bg-blue-900 rounded-full animate-pulse"></span>
                <span className="text-[9px] font-black text-blue-900 uppercase tracking-tight">
                  {selectedItem.brand}
                </span>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-2 ml-2">
            <button 
              onClick={() => navigate('/dashboard')}
              className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-slate-400 hover:text-blue-900 hover:bg-white hover:border-blue-100 active:scale-90 transition-all shadow-sm"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </button>
          </div>
        </div>
      </header>
      <div className="p-3 bg-white border-b border-slate-100 shrink-0">
        <div className="flex space-x-2 max-w-4xl mx-auto">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Search PartNo/Reff No.."
            className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-900 focus:bg-white focus:border-transparent outline-none transition-all text-xs font-bold text-slate-800 shadow-inner"
          />
          <button
            onClick={handleSearch}
            className="px-6 py-3 bg-blue-900 text-white font-black rounded-2xl hover:bg-blue-950 active:scale-95 transition-all shadow-md shadow-blue-900/10 text-[10px] uppercase tracking-widest whitespace-nowrap"
          >
            FIND
          </button>
        </div>
      </div>
      {showVariantPanel && searchResults.length > 1 && (
        <div className="bg-white border-b border-slate-100 p-4 animate-in slide-in-from-top duration-300 ease-out z-10 shadow-md">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-3 px-1">
              <div>
                <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-widest">Select Item Variant</h4>
                <p className="text-[10px] font-medium text-slate-400 mt-0.5">Multiple matches found for "{searchQuery}"</p>
              </div>
              <button onClick={() => setShowVariantPanel(false)} className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">Dismiss</button>
            </div>
            <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1">
              {searchResults.map((variant, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectVariant(variant)}
                  className="w-full flex items-center justify-between p-3 bg-slate-50 rounded-[18px] border border-transparent hover:border-blue-200 hover:bg-white hover:shadow-md active:scale-[0.99] transition-all group"
                >
                  <div className="flex items-center space-x-4">
                    <span className="text-xs font-black text-slate-900">{variant.partNo}</span>
                    <div className="flex items-center space-x-2">
                       <div className="bg-green-50 border border-green-200 rounded-full px-2.5 py-0.5 flex items-center space-x-1.5 h-6">
                        <span className="text-[8px] font-black text-green-900/60 uppercase tracking-widest">Brand</span>
                        <span className="text-green-900/40 font-bold">•</span>
                        <span className="text-[10px] font-black text-green-900 uppercase">{variant.brand}</span>
                      </div>
                      <div className="bg-blue-50 border border-blue-200 rounded-full px-2.5 py-0.5 flex items-center space-x-1.5 h-6">
                        <span className="text-[8px] font-black text-blue-900/60 uppercase tracking-widest">Suffix</span>
                        <span className="text-blue-900/40 font-bold">•</span>
                        <span className="text-[10px] font-black text-blue-900 uppercase">{variant.suffix}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-slate-300 group-hover:text-blue-900 transition-colors"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" /></svg></div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      {selectedItem && !showVariantPanel && searchResults.length > 1 && (
        <div className="bg-slate-100/50 px-6 py-2 flex justify-end">
           <button onClick={() => setShowVariantPanel(true)} className="flex items-center space-x-2 text-[9px] font-black text-blue-600 uppercase tracking-widest hover:text-blue-800 transition-colors">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
              <span>Change Variant</span>
           </button>
        </div>
      )}
      <main className="flex-1 overflow-y-auto p-4 flex flex-col">
        {/* Section 1: Item Query */}
        <CascadingSection
          id="item"
          title="Item Query"
          isExpanded={expandedSection === 'item'}
          onToggle={() => handleToggle('item')}
          headerExtra={
            <div className="flex items-center space-x-2 flex-wrap">
              <ClickableBadgePopover label="Brand" value={selectedItem?.brand || ''} type="brand" />
              <ClickableBadgePopover label="Suffix" value={selectedItem?.suffix || ''} type="suffix" />
            </div>
          }
        >
          {selectedItem ? <ItemQueryPopup selectedVariant={selectedItem} /> : <EmptySectionPlaceholder message={sectionPlaceholderMessage} />}
        </CascadingSection>

        {/* Section 2: Sales View */}
        <CascadingSection
          id="sales"
          title="Sales View"
          subtitle="Commercial Performance"
          isExpanded={expandedSection === 'sales'}
          onToggle={() => handleToggle('sales')}
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>}
        >
           {selectedItem ? <SalesViewPopup selectedVariant={selectedItem} /> : <EmptySectionPlaceholder message={sectionPlaceholderMessage} />}
        </CascadingSection>

        {/* Section 3: Trend Analysis (Standalone Accordion) */}
        <CascadingSection
          id="trend"
          title="Trend Analysis"
          subtitle="ERP Transactional History"
          isExpanded={expandedSection === 'trend'}
          onToggle={() => handleToggle('trend')}
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M3 14h18m-9-4v8m-5-4v4m10-4v4M4 6h16a1 1 0 011 1v10a1 1 0 01-1 1H4a1 1 0 01-1-1V7a1 1 0 011-1z" /></svg>}
        >
          {selectedItem ? <TrendAnalysisModule partNo={selectedItem.partNo} /> : <EmptySectionPlaceholder message={sectionPlaceholderMessage} />}
        </CascadingSection>

        {/* Section 4: Product Details */}
        <CascadingSection
          id="product"
          title="Product Details"
          subtitle="Enterprise Master Data"
          isExpanded={expandedSection === 'product'}
          onToggle={() => handleToggle('product')}
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>}
        >
           {selectedItem ? <ProductDetailsPopup selectedVariant={selectedItem} /> : <EmptySectionPlaceholder message={sectionPlaceholderMessage} />}
        </CascadingSection>

        {/* Section 5: General */}
        <CascadingSection
          id="general"
          title="General"
          subtitle="Core Technical Data"
          isExpanded={expandedSection === 'general'}
          onToggle={() => handleToggle('general')}
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}
        >
           {selectedItem ? <GeneralPopup selectedVariant={selectedItem} /> : <EmptySectionPlaceholder message={sectionPlaceholderMessage} />}
        </CascadingSection>

        {/* Section 6: Inventory & Procurement */}
        <CascadingSection
          id="inventory"
          title="Inventory & Procurement"
          subtitle="Stock & Logistics Tracking"
          isExpanded={expandedSection === 'inventory'}
          onToggle={() => handleToggle('inventory')}
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>}
        >
          {selectedItem ? <InventoryProcurementPopup selectedVariant={selectedItem} /> : <EmptySectionPlaceholder message={sectionPlaceholderMessage} />}
        </CascadingSection>

        {/* Section 7: Reports */}
        <CascadingSection
          id="reports"
          title="Reports"
          subtitle="Analytical Summaries"
          isExpanded={expandedSection === 'reports'}
          onToggle={() => handleToggle('reports')}
          icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}
        >
          {selectedItem ? <ReportsPopup selectedVariant={selectedItem} /> : <EmptySectionPlaceholder message={sectionPlaceholderMessage} />}
        </CascadingSection>

        <div className="mt-8 mb-12 flex flex-col items-center justify-center text-center px-10">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#003366]">APEX-ECOMMERCE FOR AUTO SPARE PARTS</p>
        </div>
      </main>
      <footer className="p-4 bg-white border-t border-slate-100 text-center shrink-0">
        <p className="text-[11px] font-bold text-[#003366] uppercase tracking-widest">APEX-ECOMMERCE FOR AUTO SPARE PARTS</p>
      </footer>
    </div>
  );
};

export default ItemQueryScreen;
