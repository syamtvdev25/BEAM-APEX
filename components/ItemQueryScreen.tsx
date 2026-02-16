
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GeneralPopup from './GeneralPopup';
import ReportsPopup from './ReportsPopup';
import InventoryProcurementPopup from './InventoryProcurementPopup';
import ItemQueryPopup from './ItemQueryPopup';
import ProductDetailsPopup from './ProductDetailsPopup';
import SalesViewPopup from './SalesViewPopup';
import PageLayout from './layout/PageLayout';
import BrandingHeader from './BrandingHeader';

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
          isExpanded ? 'max-h-[3000px] opacity-100 shadow-xl' : 'max-h-0 opacity-0 border-none'
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

const TrendAnalysisModule: React.FC<{ partNo: string }> = ({ partNo }) => {
  const ERP_TH = "bg-slate-50 border-y border-slate-200 px-1 py-1.5 text-[7px] font-black text-slate-500 uppercase tracking-tighter text-center sticky top-0 z-10 whitespace-nowrap";
  const ERP_TD = "px-1 py-1 text-[7.5px] font-medium text-slate-800 border-b border-slate-100 truncate";
  const ERP_TD_NUM = "px-1 py-1 text-[7.5px] font-bold text-slate-900 border-b border-slate-100 text-right font-mono";

  return (
    <div className="space-y-8 bg-white p-2">
      <section className="space-y-3">
        <h5 className="text-[10px] font-black text-blue-900 uppercase tracking-widest flex items-center">
          <span className="w-1.5 h-1.5 bg-blue-900 rounded-full mr-2"></span>
          Stock Movement Ledger
        </h5>
        <div className="overflow-x-auto border border-slate-200 rounded-lg -webkit-overflow-scrolling-touch">
          <table className="w-full min-w-[500px] table-fixed border-collapse">
            <thead>
              <tr>
                <th className={ERP_TH} style={{width: '15%'}}>Date</th>
                <th className={ERP_TH} style={{width: '15%'}}>Voucher</th>
                <th className={ERP_TH} style={{width: '20%'}}>Account</th>
                <th className={ERP_TH} style={{width: '10%'}}>R.Qty</th>
                <th className={ERP_TH} style={{width: '10%'}}>R.Rate</th>
                <th className={ERP_TH} style={{width: '10%'}}>I.Qty</th>
                <th className={ERP_TH} style={{width: '10%'}}>I.Rate</th>
                <th className={ERP_TH} style={{width: '10%'}}>Bal</th>
              </tr>
            </thead>
            <tbody>
              {[1,2,3].map(i => (
                <tr key={i} className="hover:bg-slate-50">
                  <td className={ERP_TD}>12/04/2024</td>
                  <td className={ERP_TD}>V-992{i}</td>
                  <td className={ERP_TD}>Global Logi...</td>
                  <td className={ERP_TD_NUM}>120</td>
                  <td className={ERP_TD_NUM}>85.00</td>
                  <td className={ERP_TD_NUM}>0</td>
                  <td className={ERP_TD_NUM}>0.00</td>
                  <td className={ERP_TD_NUM}>240</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

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

  const handleToggle = (id: SectionType) => {
    setExpandedSection(expandedSection === id ? null : id);
  };

  return (
    <PageLayout>
      <BrandingHeader title="Item Query" onBack={() => navigate('/erp')} />

      <div className="p-3 bg-white border-b border-slate-100 shrink-0 z-40">
        <div className="flex space-x-2 max-w-4xl mx-auto">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Search PartNo.."
            className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-900 focus:bg-white outline-none transition-all text-sm font-bold text-slate-800"
          />
          <button
            onClick={handleSearch}
            className="px-6 py-3 bg-blue-900 text-white font-black rounded-2xl hover:bg-blue-950 active:scale-95 transition-all shadow-md text-[10px] uppercase tracking-widest"
          >
            FIND
          </button>
        </div>
      </div>

      <main className="flex-1 overflow-y-auto p-4 scroll-smooth" style={{ WebkitOverflowScrolling: 'touch' }}>
        <CascadingSection
          id="item"
          title="Item Overview"
          isExpanded={expandedSection === 'item'}
          onToggle={() => handleToggle('item')}
        >
          {selectedItem ? <ItemQueryPopup selectedVariant={selectedItem} /> : <div className="text-center py-10 opacity-40 text-xs font-black uppercase">Search an item to view</div>}
        </CascadingSection>

        <CascadingSection
          id="sales"
          title="Sales Performance"
          isExpanded={expandedSection === 'sales'}
          onToggle={() => handleToggle('sales')}
        >
          {selectedItem ? <SalesViewPopup selectedVariant={selectedItem} /> : <div className="text-center py-10 opacity-40 text-xs font-black uppercase">Search an item to view</div>}
        </CascadingSection>

        <CascadingSection
          id="trend"
          title="ERP Transaction Trend"
          isExpanded={expandedSection === 'trend'}
          onToggle={() => handleToggle('trend')}
        >
          {selectedItem ? <TrendAnalysisModule partNo={selectedItem.partNo} /> : <div className="text-center py-10 opacity-40 text-xs font-black uppercase">Search an item to view</div>}
        </CascadingSection>
      </main>

      <footer className="p-4 bg-white border-t border-slate-100 text-center shrink-0">
        <p className="text-[9px] font-bold text-[#003366] uppercase tracking-widest leading-none">APEX-ECOMMERCE ERP</p>
      </footer>

      {showVariantPanel && (
        <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-end justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-[32px] p-6 shadow-2xl animate-in slide-in-from-bottom duration-300">
            <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4">Select Variant</h4>
            <div className="space-y-2 mb-6">
              {searchResults.map((v, i) => (
                <button key={i} onClick={() => { setSelectedItem(v); setShowVariantPanel(false); }} className="w-full text-left p-4 bg-slate-50 rounded-2xl hover:bg-blue-50 border border-transparent hover:border-blue-200 transition-all font-bold text-xs uppercase tracking-tight">
                  {v.brand} — {v.suffix}
                </button>
              ))}
            </div>
            <button onClick={() => setShowVariantPanel(false)} className="w-full py-4 bg-slate-100 rounded-2xl font-black text-[10px] uppercase tracking-widest text-slate-400">Cancel</button>
          </div>
        </div>
      )}
    </PageLayout>
  );
};

export default ItemQueryScreen;
