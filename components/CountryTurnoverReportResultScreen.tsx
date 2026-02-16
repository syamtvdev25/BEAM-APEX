
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PageShell from './PageShell';
import ReportHeaderActions from '../reports/components/ReportHeaderActions';
import HorizontalScrollDock from '../reports/components/HorizontalScrollDock';
import { exportToExcel, exportToPdf } from '../reports/utils/exportCountryTurnover';
// Added clearUIState to imports
import { saveUIState, loadUIState, clearUIState } from '../utils/uiState';

const COUNTRY = "UNITED ARAB EMIRATES";
const ROWS = [
  { brand: "BF", salesValue: 122675.86, y2023: 37447.45, y2024: 34172.66, y2025: 43598.75, y2026: 7457.00, sameDay: 112.32, diffAmount: 7344.68, diffPct: 6539.07, backOrder: 9267.01 },
  { brand: "BW", salesValue: 574019.60, y2023: 164664.01, y2024: 149838.10, y2025: 223695.99, y2026: 35821.50, sameDay: 39345.14, diffAmount: -3523.64, diffPct: -8.96, backOrder: 42901.65 },
  { brand: "BW TMS", salesValue: 124035.09, y2023: 69014.83, y2024: 27325.73, y2025: 27694.53, y2026: 0.00, sameDay: 3696.39, diffAmount: -3696.39, diffPct: -100.00, backOrder: 4323.00 },
  { brand: "CONTI", salesValue: 158101.01, y2023: 62904.45, y2024: 60469.99, y2025: 31463.45, y2026: 3263.12, sameDay: 6357.51, diffAmount: -3094.39, diffPct: -48.67, backOrder: 17795.64 },
  { brand: "ELRING", salesValue: 3731977.02, y2023: 1126208.55, y2024: 1045958.59, y2025: 1327779.52, y2026: 232030.36, sameDay: 134733.18, diffAmount: 97297.18, diffPct: 72.21, backOrder: 658174.18 },
  { brand: "FTE", salesValue: 754538.05, y2023: 300277.66, y2024: 207813.34, y2025: 228951.45, y2026: 17495.60, sameDay: 96238.99, diffAmount: -78743.39, diffPct: -81.82, backOrder: 51273.50 },
  { brand: "KAT", salesValue: -6.62, y2023: 0.00, y2024: -6.62, y2025: 0.00, y2026: 0.00, sameDay: 0.00, diffAmount: 0.00, diffPct: 0.00, backOrder: 2591.79 },
  { brand: "KS", salesValue: 9041738.50, y2023: 2844237.53, y2024: 2689756.11, y2025: 3060234.17, y2026: 447510.69, sameDay: 371283.13, diffAmount: 76227.56, diffPct: 20.53, backOrder: 867838.90 },
  { brand: "KS-TRW", salesValue: 1430133.83, y2023: 411357.87, y2024: 435554.94, y2025: 512300.27, y2026: 70920.75, sameDay: 74980.83, diffAmount: -4060.08, diffPct: -5.41, backOrder: 140731.94 },
  { brand: "LASO", salesValue: 2063307.29, y2023: 541585.72, y2024: 602804.74, y2025: 830439.50, y2026: 88477.33, sameDay: 148052.75, diffAmount: -59575.42, diffPct: -40.24, backOrder: 452624.74 },
  { brand: "LEMF.", salesValue: 16421701.05, y2023: 4633542.67, y2024: 5984208.04, y2025: 5063986.24, y2026: 739964.10, sameDay: 596865.44, diffAmount: 143098.66, diffPct: 23.98, backOrder: 1674940.59 },
  { brand: "PG", salesValue: 265910.07, y2023: 111111.46, y2024: 93524.26, y2025: 60666.82, y2026: 607.53, sameDay: 9348.71, diffAmount: -8741.18, diffPct: -93.50, backOrder: 13499.22 },
  { brand: "POWER DRIVE", salesValue: 205451.96, y2023: 95149.32, y2024: 68625.67, y2025: 33989.81, y2026: 7687.15, sameDay: 11545.20, diffAmount: -3858.05, diffPct: -33.42, backOrder: 2701.79 },
  { brand: "SACHS", salesValue: 32964875.72, y2023: 7794975.41, y2024: 10940090.71, y2025: 12924477.44, y2026: 1305332.16, sameDay: 1452432.95, diffAmount: -147100.79, diffPct: -10.13, backOrder: 4423157.29 },
  { brand: "SPE", salesValue: 0.00, y2023: 0.00, y2024: 0.00, y2025: 0.00, y2026: 0.00, sameDay: 0.00, diffAmount: 0.00, diffPct: 0.00, backOrder: 840.70 },
  { brand: "SPS", salesValue: -269.55, y2023: -45.05, y2024: -34.00, y2025: -190.50, y2026: 0.00, sameDay: 0.00, diffAmount: 0.00, diffPct: 0.00, backOrder: 970.41 },
  { brand: "STB", salesValue: 102121.87, y2023: 6747.28, y2024: 38746.76, y2025: 45986.10, y2026: 10641.73, sameDay: 6191.87, diffAmount: 4449.86, diffPct: 71.87, backOrder: 5137.87 },
  { brand: "TGL BATTERIES", salesValue: 44954.91, y2023: 8846.08, y2024: 32588.32, y2025: 1506.72, y2026: 2013.80, sameDay: 0.00, diffAmount: 2013.80, diffPct: 0.00, backOrder: 5129.84 },
  { brand: "TGL BEARINGS", salesValue: 66625.07, y2023: 20869.24, y2024: 22504.97, y2025: 23198.34, y2026: 52.52, sameDay: 2374.85, diffAmount: -2322.33, diffPct: -97.79, backOrder: 6119.19 },
  { brand: "TIGRIL", salesValue: 2821303.81, y2023: 948993.64, y2024: 923016.02, y2025: 841268.71, y2026: 108025.44, sameDay: 109443.72, diffAmount: -1418.28, diffPct: -1.30, backOrder: 139494.93 },
  { brand: "VALEO", salesValue: 9181.07, y2023: 7774.00, y2024: 1071.74, y2025: 335.33, y2026: 0.00, sameDay: 0.00, diffAmount: 0.00, diffPct: 0.00, backOrder: 270.00 },
  { brand: "WAHLER", salesValue: 138553.30, y2023: 69983.53, y2024: 38068.86, y2025: 30500.91, y2026: 0.00, sameDay: 0.00, diffAmount: 0.00, diffPct: 0.00, backOrder: 12376.18 }
];

const SUBTOTAL = {
  label: "Sub Total ::",
  salesValue: 71040928.92,
  y2023: 19255645.64,
  y2024: 23396098.94,
  y2025: 25311883.55,
  y2026: 3077300.78,
  sameDay: 3063002.98,
  diffAmount: 14297.80,
  backOrder: 8532160.36
};

const CountryTurnoverReportResultScreen: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const filters = location.state || {};
  const [searchTerm, setSearchTerm] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const tableRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const dateRange = `${filters.fromDate || '01/01/2026'} TO ${filters.toDate || '16/02/2026'}`;

  // Restore scroll
  useEffect(() => {
    const saved = loadUIState<{ searchTerm: string, scrollY: number, scrollX: number }>('turnover_result');
    if (saved) {
      setSearchTerm(saved.searchTerm || '');
      if (scrollRef.current) scrollRef.current.scrollTop = saved.scrollY;
      if (tableRef.current) tableRef.current.scrollLeft = saved.scrollX;
    }
  }, []);

  const saveState = () => {
    saveUIState('turnover_result', {
      searchTerm,
      scrollY: scrollRef.current?.scrollTop || 0,
      scrollX: tableRef.current?.scrollLeft || 0
    });
  };

  const filteredRows = useMemo(() => {
    return ROWS.filter(row => row.brand.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [searchTerm]);

  const formatNum = (val: number, decimals: number = 2) => {
    return val.toLocaleString(undefined, { 
      minimumFractionDigits: decimals, 
      maximumFractionDigits: decimals 
    });
  };

  return (
    <PageShell 
      title="Country Turnover" 
      // Fixed: clearUIState now exists due to the import above
      onBack={() => { clearUIState('turnover_result'); navigate('/country-turnover'); }}
      actions={
        <ReportHeaderActions 
          isExporting={isExporting} 
          onExcel={async () => { setIsExporting(true); await exportToExcel(filteredRows, SUBTOTAL, COUNTRY, dateRange); setIsExporting(false); }} 
          onPdf={async () => { setIsExporting(true); await exportToPdf(filteredRows, SUBTOTAL, COUNTRY, dateRange); setIsExporting(false); }}
        />
      }
    >
      <div className="bg-white px-4 py-3 border-b border-slate-100 z-50 shrink-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0">
          <div>
            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none block mb-1">Range</span>
            <span className="text-[10px] font-black text-slate-900 uppercase tracking-tight">{dateRange}</span>
          </div>
          <div className="relative flex-1 max-w-xs sm:ml-4">
            <input
              type="text"
              placeholder="Filter brand..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-[11px] font-bold outline-none focus:ring-2 focus:ring-blue-900"
            />
            <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
          </div>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto" onScroll={saveState}>
        <div ref={tableRef} className="overflow-x-auto" onScroll={saveState}>
          <table className="min-w-[1200px] border-collapse bg-white">
            <thead className="sticky top-0 z-40 bg-slate-900 text-white shadow-sm">
              <tr className="uppercase text-[9px] font-black tracking-widest">
                <th className="px-3 py-3 text-left border-r border-slate-800">Brand</th>
                <th className="px-2 py-3 text-right border-r border-slate-800">Sales Value</th>
                <th className="px-2 py-3 text-right border-r border-slate-800">2023</th>
                <th className="px-2 py-3 text-right border-r border-slate-800">2024</th>
                <th className="px-2 py-3 text-right border-r border-slate-800">2025</th>
                <th className="px-2 py-3 text-right border-r border-slate-800">2026</th>
                <th className="px-2 py-3 text-right border-r border-slate-800">Same Day Last...</th>
                <th className="px-2 py-3 text-right border-r border-slate-800">Diff Amt</th>
                <th className="px-2 py-3 text-right border-r border-slate-800">Diff%</th>
                <th className="px-2 py-3 text-right">Backorder</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr className="bg-slate-100"><td colSpan={10} className="px-4 py-1.5 text-[10px] font-black text-blue-900">{COUNTRY}</td></tr>
              {filteredRows.map((row, i) => (
                <tr key={i} className="active:bg-blue-50/50">
                  <td className="px-3 py-3 text-[10px] font-black text-slate-800 uppercase border-r border-slate-50">{row.brand}</td>
                  <td className="px-2 py-3 text-right text-[10px] font-bold text-slate-900 tabular-nums border-r border-slate-50">{formatNum(row.salesValue)}</td>
                  <td className="px-2 py-3 text-right text-[10px] font-medium text-slate-400 tabular-nums border-r border-slate-50">{formatNum(row.y2023)}</td>
                  <td className="px-2 py-3 text-right text-[10px] font-medium text-slate-400 tabular-nums border-r border-slate-50">{formatNum(row.y2024)}</td>
                  <td className="px-2 py-3 text-right text-[10px] font-medium text-slate-400 tabular-nums border-r border-slate-50">{formatNum(row.y2025)}</td>
                  <td className="px-2 py-3 text-right text-[10px] font-black text-slate-800 tabular-nums border-r border-slate-50">{formatNum(row.y2026)}</td>
                  <td className="px-2 py-3 text-right text-[10px] font-medium text-slate-400 tabular-nums border-r border-slate-50">{formatNum(row.sameDay)}</td>
                  <td className={`px-2 py-3 text-right text-[10px] font-black tabular-nums border-r border-slate-50 ${row.diffAmount >= 0 ? 'text-green-600' : 'text-red-600'}`}>{formatNum(row.diffAmount)}</td>
                  <td className={`px-2 py-3 text-right text-[10px] font-black tabular-nums border-r border-slate-50 ${row.diffPct >= 0 ? 'text-green-600' : 'text-red-600'}`}>{row.diffPct.toFixed(2)}%</td>
                  <td className="px-2 py-3 text-right text-[10px] font-black text-orange-600 tabular-nums">{formatNum(row.backOrder)}</td>
                </tr>
              ))}
              <tr className="bg-slate-50 border-t-2 border-slate-200">
                <td className="px-3 py-4 text-[10px] font-black text-slate-900">{SUBTOTAL.label}</td>
                <td className="px-2 py-4 text-right text-[10px] font-black text-red-600 tabular-nums">{formatNum(SUBTOTAL.salesValue)}</td>
                <td className="px-2 py-4 text-right text-[10px] font-black text-red-600 tabular-nums">{formatNum(SUBTOTAL.y2023)}</td>
                <td className="px-2 py-4 text-right text-[10px] font-black text-red-600 tabular-nums">{formatNum(SUBTOTAL.y2024)}</td>
                <td className="px-2 py-4 text-right text-[10px] font-black text-red-600 tabular-nums">{formatNum(SUBTOTAL.y2025)}</td>
                <td className="px-2 py-4 text-right text-[10px] font-black text-red-600 tabular-nums">{formatNum(SUBTOTAL.y2026)}</td>
                <td className="px-2 py-4 text-right text-[10px] font-black text-red-600 tabular-nums">{formatNum(SUBTOTAL.sameDay)}</td>
                <td className="px-2 py-4 text-right text-[10px] font-black text-red-600 tabular-nums">{formatNum(SUBTOTAL.diffAmount)}</td>
                <td className="px-2 py-4 text-right"></td>
                <td className="px-2 py-4 text-right text-[10px] font-black text-red-600 tabular-nums">{formatNum(SUBTOTAL.backOrder)}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <HorizontalScrollDock scrollRef={tableRef} />
      </div>
    </PageShell>
  );
};

export default CountryTurnoverReportResultScreen;
