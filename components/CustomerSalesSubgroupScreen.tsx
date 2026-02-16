
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { brandingConfig } from '../config/brandingConfig';

const SUBGROUP_SALES = {
  CV: [
    { group: 'ENGINE COMPONENTS', sales: '840,500.00', growth: '+12%', items: 120 },
    { group: 'AXLE & SUSPENSION', sales: '650,200.00', growth: '+5%', items: 85 },
    { group: 'BRAKE SYSTEMS', sales: '310,000.00', growth: '-2%', items: 44 },
    { group: 'FILTRATION', sales: '120,400.00', growth: '+22%', items: 210 },
  ],
  PC: [
    { group: 'ENGINE COMPONENTS', sales: '1,250,000.00', growth: '+18%', items: 340 },
    { group: 'CHASSIS PARTS', sales: '890,000.00', growth: '+3%', items: 190 },
    { group: 'ELECTRICAL', sales: '440,000.00', growth: '+30%', items: 215 },
    { group: 'TRANSMISSION', sales: '220,150.00', growth: '-5%', items: 60 },
  ]
};

const CustomerSalesSubgroupScreen: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'CV' | 'PC'>('CV');

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
          <span className="text-[15px] font-black text-white uppercase tracking-tight leading-tight">Sales by Subgroup</span>
        </div>
      </header>

      <div className="p-4 bg-white border-b border-slate-100 shrink-0">
        <div className="flex p-1 bg-slate-100 rounded-[20px]">
          <button 
            onClick={() => setActiveTab('CV')}
            className={`flex-1 py-3 px-2 rounded-[16px] transition-all duration-300 ${activeTab === 'CV' ? 'bg-white shadow-sm text-blue-900 font-black' : 'text-slate-400 font-bold'} text-xs uppercase tracking-widest`}
          >
            Commercial (CV)
          </button>
          <button 
            onClick={() => setActiveTab('PC')}
            className={`flex-1 py-3 px-2 rounded-[16px] transition-all duration-300 ${activeTab === 'PC' ? 'bg-white shadow-sm text-blue-900 font-black' : 'text-slate-400 font-bold'} text-xs uppercase tracking-widest`}
          >
            Passenger (PC)
          </button>
        </div>
      </div>

      <main className="flex-1 overflow-y-auto p-4 -webkit-overflow-scrolling-touch">
        <div className="space-y-4 pb-8">
          {SUBGROUP_SALES[activeTab].map((item, idx) => (
            <div key={idx} className="bg-white rounded-[28px] p-5 shadow-sm border border-slate-100 flex items-center space-x-4 active:bg-blue-50/50 transition-colors">
              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center shrink-0">
                 <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              </div>
              
              <div className="flex-1 min-w-0">
                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5">{item.items} SKUs</p>
                 <h4 className="text-[13px] font-black text-slate-900 uppercase tracking-tight truncate leading-none">{item.group}</h4>
              </div>

              <div className="text-right shrink-0">
                 <p className={`text-[9px] font-black uppercase tracking-widest mb-1 ${item.growth.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                    {item.growth}
                 </p>
                 <p className="text-sm font-black text-blue-900 leading-none">AED {item.sales}</p>
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer className="p-4 bg-white border-t border-slate-100 text-center">
         <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Global Product Line Analysis</p>
      </footer>
    </div>
  );
};

export default CustomerSalesSubgroupScreen;
