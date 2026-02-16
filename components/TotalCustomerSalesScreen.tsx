
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { brandingConfig } from '../config/brandingConfig';

const SALES_BY_COUNTRY = [
  { country: 'UNITED ARAB EMIRATES', customerCount: 145, totalSales: '4,520,000.00', pct: 45 },
  { country: 'SAUDI ARABIA', customerCount: 89, totalSales: '2,110,500.00', pct: 25 },
  { country: 'QATAR', customerCount: 34, totalSales: '950,000.00', pct: 15 },
  { country: 'KUWAIT', customerCount: 22, totalSales: '680,400.00', pct: 8 },
  { country: 'OTHERS', customerCount: 56, totalSales: '450,000.00', pct: 7 },
];

const TotalCustomerSalesScreen: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex-1 flex flex-col bg-slate-50 h-screen overflow-hidden">
      <header className="bg-gradient-to-r from-[#003366] to-[#00599F] px-4 py-4 flex items-center sticky top-0 z-30 shadow-xl rounded-b-[24px] shrink-0">
        <button onClick={() => navigate(-1)} className="mr-3 p-2 bg-white/10 border border-white/20 rounded-xl text-white active:scale-90 transition-all shrink-0">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
        </button>
        <div className="w-8 h-8 mr-3 bg-white rounded-lg p-1 shadow-sm shrink-0">
          <img src={brandingConfig.logoPath} alt="" className="w-full h-full object-contain" />
        </div>
        <div className="flex flex-col min-w-0">
          <h2 className="text-[10px] font-black text-white/70 tracking-widest uppercase leading-none mb-1">{brandingConfig.appName}</h2>
          <span className="text-[15px] font-black text-white uppercase tracking-tight leading-tight">Total Sales by Country</span>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 -webkit-overflow-scrolling-touch">
        <div className="space-y-4">
          {SALES_BY_COUNTRY.map((item, idx) => (
            <div key={idx} className="bg-white rounded-[32px] p-6 shadow-sm border border-slate-100 active:scale-[0.98] transition-all group overflow-hidden relative">
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-full -mr-12 -mt-12 opacity-50 group-hover:scale-110 transition-transform duration-500"></div>
              
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight leading-tight">{item.country}</h3>
                    <p className="text-[10px] font-bold text-slate-400 mt-0.5">{item.customerCount} ACTIVE CUSTOMERS</p>
                  </div>
                  <div className="bg-blue-900 text-white text-[10px] font-black px-3 py-1 rounded-full">{item.pct}%</div>
                </div>

                <div className="flex flex-col">
                   <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5">Consolidated Sales (AED)</label>
                   <p className="text-2xl font-black text-blue-900 tracking-tighter">{item.totalSales}</p>
                </div>

                <div className="mt-4 w-full bg-slate-50 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-blue-900 h-full transition-all duration-1000 ease-out" style={{ width: `${item.pct}%` }}></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer className="p-4 bg-white border-t border-slate-100 flex items-center justify-between">
        <span className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em]">{brandingConfig.marketIntelligenceTagline}</span>
        <div className="flex space-x-2">
           <div className="w-2 h-2 bg-blue-900 rounded-full animate-pulse"></div>
           <span className="text-[9px] font-black text-blue-900 uppercase">Live Data</span>
        </div>
      </footer>
    </div>
  );
};

export default TotalCustomerSalesScreen;
