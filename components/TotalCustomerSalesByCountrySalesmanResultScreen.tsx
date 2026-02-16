
import React, { useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import BrandingHeader from './BrandingHeader';
import { exportToExcel, exportToPdf } from '../utils/exportTotalCustomerSalesByCountrySalesman';
import PremiumTableScroller from './report/PremiumTableScroller';

const DUMMY_RESULT_DATA = [
  { clientName: "ARABIAN TRUCK FZCO", brand: "SACHS", country: "UAE", salesValue: 1245670.50, y2026: 120500.00, sameDay: 115000.00, diffPct: 4.78, backorderValue: 450000.00 },
  { clientName: "EURO PART MIDDLE EAST FZCO", brand: "MAHLE", country: "UAE", salesValue: 980450.20, y2026: 85000.00, sameDay: 92000.00, diffPct: -7.61, backorderValue: 320000.00 },
  { clientName: "MOHD. AHMED AL MIDFA AUTO", brand: "ELRING", country: "UAE", salesValue: 850000.00, y2026: 78000.00, sameDay: 75000.00, diffPct: 4.00, backorderValue: 120000.00 },
  { clientName: "AUTO POWER FZE", brand: "BF", country: "UAE", salesValue: 740200.45, y2026: 62000.00, sameDay: 58000.00, diffPct: 6.90, backorderValue: 180000.00 },
  { clientName: "AUTO PLUS PARTS & ACCESSORIE", brand: "BORGWARNER", country: "UAE", salesValue: 690150.00, y2026: 55000.00, sameDay: 60000.00, diffPct: -8.33, backorderValue: 95000.00 },
  { clientName: "AL ITHIYATI AUTO SPARE PARTS", brand: "VICTOR REINZ", country: "UAE", salesValue: 580000.00, y2026: 48000.00, sameDay: 50000.00, diffPct: -4.00, backorderValue: 110000.00 },
  { clientName: "KAPICO MIDDLE EAST FZE", brand: "BOSCH", country: "UAE", salesValue: 1540000.00, y2026: 142000.00, sameDay: 138000.00, diffPct: 2.90, backorderValue: 280000.00 },
  { clientName: "JOHN AUTO SPARE PARTS CO.LLC", brand: "FEBI", country: "UAE", salesValue: 420000.00, y2026: 38000.00, sameDay: 35000.00, diffPct: 8.57, backorderValue: 65000.00 },
  { clientName: "NEW EAST GENERAL TRADING FZ", brand: "LEMFORDER", country: "UAE", salesValue: 2100500.00, y2026: 185000.00, sameDay: 172000.00, diffPct: 7.56, backorderValue: 540000.00 },
  { clientName: "SELECT AUTO L.L.C", brand: "ZF", country: "UAE", salesValue: 310450.00, y2026: 25000.00, sameDay: 28000.00, diffPct: -10.71, backorderValue: 45000.00 },
  { clientName: "THREE STAR AUTO SPARE PARTS", brand: "SACHS", country: "UAE", salesValue: 280000.00, y2026: 22000.00, sameDay: 20000.00, diffPct: 10.00, backorderValue: 55000.00 },
  { clientName: "SAMIR ODEH & SONS FZCO", brand: "MAHLE", country: "UAE", salesValue: 1150000.00, y2026: 105000.00, sameDay: 98000.00, diffPct: 7.14, backorderValue: 310000.00 },
  { clientName: "PRO LINE AUTO SPARE PARTS FZE", brand: "ELRING", country: "UAE", salesValue: 410000.00, y2026: 35000.00, sameDay: 38000.00, diffPct: -7.89, backorderValue: 72000.00 },
  { clientName: "K LINE AUTO SPARE PARTS L.L.C.", brand: "BF", country: "UAE", salesValue: 190000.00, y2026: 15000.00, sameDay: 18000.00, diffPct: -16.67, backorderValue: 28000.00 },
  { clientName: "ISHER TRADING LLC", brand: "BORGWARNER", country: "UAE", salesValue: 560000.00, y2026: 48000.00, sameDay: 45000.00, diffPct: 6.67, backorderValue: 120000.00 },
  { clientName: "HERCULES INTERNATIONAL ENT", brand: "VICTOR REINZ", country: "UAE", salesValue: 340000.00, y2026: 28000.00, sameDay: 30000.00, diffPct: -6.67, backorderValue: 62000.00 },
  { clientName: "AL SAFAN AUTO SPARE PARTS CO", brand: "BOSCH", country: "UAE", salesValue: 280000.00, y2026: 22000.00, sameDay: 24000.00, diffPct: -8.33, backorderValue: 54000.00 }
];

const SUBTOTAL = {
  label: "Sub Total ::",
  salesValue: 12211943.24,
  y2026: 1056964.00,
  sameDay: 1207570.29,
  diffPct: -12.47,
  backorderValue: 2937483.92
};

const TotalCustomerSalesByCountrySalesmanResultScreen: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const filters = location.state || {};
  const [isExporting, setIsExporting] = useState(false);
  const [toast, setToast] = useState<{ message: string; visible: boolean }>({ message: '', visible: false });

  const formatNum = (val: number | null | undefined, decimals: number = 2) => {
    if (val === null || val === undefined) return '';
    return val.toLocaleString(undefined, { 
      minimumFractionDigits: decimals, 
      maximumFractionDigits: decimals 
    });
  };

  const showToast = (message: string) => {
    setToast({ message, visible: true });
    setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 1500);
  };

  const handleExcelExport = async () => {
    setIsExporting(true);
    await exportToExcel(DUMMY_RESULT_DATA, SUBTOTAL, filters);
    setIsExporting(false);
    showToast("Excel generated");
  };

  const handlePdfExport = async () => {
    setIsExporting(true);
    await exportToPdf(DUMMY_RESULT_DATA, SUBTOTAL, filters);
    setIsExporting(false);
    showToast("PDF generated");
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50 h-screen overflow-hidden print:bg-white print:overflow-visible">
      <BrandingHeader 
        title="Total Customer Sales By Country – Salesman" 
        onBack={() => navigate('/customer-sales-country-salesman/filter', { state: filters })} 
      />

      {/* Export Actions in Header */}
      <div className="fixed top-3 right-4 z-[60] flex items-center space-x-2 print:hidden">
        <button 
          onClick={handleExcelExport}
          disabled={isExporting}
          className="w-10 h-10 bg-white/20 border border-white/20 rounded-xl flex items-center justify-center text-white active:scale-90 transition-all shadow-sm backdrop-blur-md hover:bg-green-500 disabled:opacity-50"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
        </button>
        <button 
          onClick={handlePdfExport}
          disabled={isExporting}
          className="w-10 h-10 bg-white/20 border border-white/20 rounded-xl flex items-center justify-center text-white active:scale-90 transition-all shadow-sm backdrop-blur-md hover:bg-red-500 disabled:opacity-50"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
          </svg>
        </button>
      </div>

      {/* Filter Summary Bar */}
      <div className="bg-white px-4 py-3 border-b border-slate-100 shrink-0 z-50 shadow-sm print:hidden">
        <div className="flex flex-col space-y-1">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-black text-slate-900 uppercase">
              {filters.fromDate || '01/01/2026'} — {filters.toDate || '16/02/2026'}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
             <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">
               Brands({filters.selectedBrands?.length || 0}) 
               • Countries({filters.selectedCountries?.length || 0}) 
               • Accounts({filters.selectedAccounts?.length || 0}) 
               • Salesmen({filters.selectedSalesmen?.length || 0})
             </span>
          </div>
        </div>
      </div>

      {/* Main Table Content wrapped in PremiumTableScroller */}
      <PremiumTableScroller minWidth={1200}>
        <table className="min-w-full border-collapse bg-white">
          <thead className="sticky top-0 z-40 shadow-sm">
            <tr className="bg-[#003366] text-white">
              <th className="px-4 py-3.5 text-left text-[9px] font-black uppercase tracking-widest border-r border-white/10">Client Name</th>
              <th className="px-3 py-3.5 text-left text-[9px] font-black uppercase tracking-widest border-r border-white/10">Brand</th>
              <th className="px-3 py-3.5 text-left text-[9px] font-black uppercase tracking-widest border-r border-white/10">Country</th>
              <th className="px-3 py-3.5 text-right text-[9px] font-black uppercase tracking-widest border-r border-white/10">Sales Value</th>
              <th className="px-3 py-3.5 text-right text-[9px] font-black uppercase tracking-widest border-r border-white/10">2026</th>
              <th className="px-3 py-3.5 text-right text-[9px] font-black uppercase tracking-widest border-r border-white/10">Same Day Last...</th>
              <th className="px-3 py-3.5 text-right text-[9px] font-black uppercase tracking-widest border-r border-white/10">Diff %</th>
              <th className="px-3 py-3.5 text-right text-[9px] font-black uppercase tracking-widest">Backorder Value</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {DUMMY_RESULT_DATA.map((row, idx) => (
              <tr key={idx} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3.5 text-[10px] font-bold text-slate-800 uppercase truncate max-w-[250px] border-r border-slate-50">{row.clientName}</td>
                <td className="px-3 py-3.5 text-[10px] font-black text-slate-400 uppercase border-r border-slate-50">{row.brand}</td>
                <td className="px-3 py-3.5 text-[10px] font-bold text-slate-500 uppercase border-r border-slate-50">{row.country}</td>
                <td className="px-3 py-3.5 text-right text-[10px] font-black text-slate-900 tabular-nums border-r border-slate-50">{formatNum(row.salesValue)}</td>
                <td className="px-3 py-3.5 text-right text-[10px] font-black text-slate-900 tabular-nums border-r border-slate-50">{formatNum(row.y2026)}</td>
                <td className="px-3 py-3.5 text-right text-[10px] font-medium text-slate-400 tabular-nums border-r border-slate-50">{formatNum(row.sameDay)}</td>
                <td className={`px-3 py-3.5 text-right text-[10px] font-black tabular-nums border-r border-slate-50 ${row.diffPct >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {row.diffPct.toFixed(2)}%
                </td>
                <td className="px-3 py-3.5 text-right text-[10px] font-black text-[#F37021] tabular-nums">{formatNum(row.backorderValue)}</td>
              </tr>
            ))}

            {/* Subtotal Row */}
            <tr className="bg-slate-50 border-t-2 border-slate-200">
              <td colSpan={3} className="px-4 py-4 text-[10px] font-black text-slate-900 uppercase border-r border-slate-200">{SUBTOTAL.label}</td>
              <td className="px-3 py-4 text-right text-[10px] font-black text-red-600 tabular-nums border-r border-slate-200">{formatNum(SUBTOTAL.salesValue)}</td>
              <td className="px-3 py-4 text-right text-[10px] font-black text-red-600 tabular-nums border-r border-slate-200">{formatNum(SUBTOTAL.y2026)}</td>
              <td className="px-3 py-4 text-right text-[10px] font-black text-red-600 tabular-nums border-r border-slate-200">{formatNum(SUBTOTAL.sameDay)}</td>
              <td className="px-3 py-4 text-right text-[10px] font-black text-red-600 tabular-nums border-r border-slate-200"></td>
              <td className="px-3 py-4 text-right text-[10px] font-black text-red-600 tabular-nums">{formatNum(SUBTOTAL.backorderValue)}</td>
            </tr>

            {/* Report Total Row */}
            <tr className="bg-slate-100 border-t-2 border-slate-300">
              <td colSpan={3} className="px-4 py-5 text-[11px] font-black text-blue-900 uppercase border-r border-slate-300">REPORT TOTAL</td>
              <td className="px-3 py-5 text-right text-[11px] font-black text-blue-900 tabular-nums border-r border-slate-300">{formatNum(SUBTOTAL.salesValue)}</td>
              <td className="px-3 py-5 text-right text-[11px] font-black text-blue-900 tabular-nums border-r border-slate-300">{formatNum(SUBTOTAL.y2026)}</td>
              <td className="px-3 py-5 text-right text-[11px] font-black text-blue-900 tabular-nums border-r border-slate-300">{formatNum(SUBTOTAL.sameDay)}</td>
              <td className="px-3 py-5 text-right text-[11px] font-black text-blue-900 tabular-nums border-r border-slate-300"></td>
              <td className="px-3 py-5 text-right text-[11px] font-black text-blue-900 tabular-nums">{formatNum(SUBTOTAL.backorderValue)}</td>
            </tr>
          </tbody>
        </table>
      </PremiumTableScroller>

      {/* Toast Notification */}
      <div className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[200] transition-all duration-300 pointer-events-none ${toast.visible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
        <div className="bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center space-x-3 border border-white/10">
          <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
          </div>
          <span className="text-[11px] font-black uppercase tracking-widest">{toast.message}</span>
        </div>
      </div>

      <footer className="bg-white border-t border-slate-100 p-2 text-center shrink-0 print:hidden">
        <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.25em]">
          © APEX-ECOM • Market Analytics Intelligence
        </p>
      </footer>
    </div>
  );
};

export default TotalCustomerSalesByCountrySalesmanResultScreen;
