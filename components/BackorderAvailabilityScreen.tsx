
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { brandingConfig } from '../config/brandingConfig';

const DUMMY_BACKORDERS = [
  { artNr: '316.699', brand: 'SACHS', desc: 'Shock Absorber Cab', qty: 15, stock: 2, bal: 13, eta: '12/06/24' },
  { artNr: '001 234', brand: 'MAHLE', desc: 'Piston Assembly', qty: 24, stock: 0, bal: 24, eta: '20/06/24' },
  { artNr: '173.910', brand: 'ELRING', desc: 'Multi-plate clutch', qty: 8, stock: 3, bal: 5, eta: '15/06/24' },
  { artNr: '2018034', brand: 'BF', desc: 'Oil Jet Piston', qty: 100, stock: 45, bal: 55, eta: '01/07/24' },
];

const BackorderAvailabilityScreen: React.FC = () => {
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
          <span className="text-[15px] font-black text-white uppercase tracking-tight leading-tight">Backorder / Availability</span>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 -webkit-overflow-scrolling-touch">
        <div className="bg-white rounded-[24px] shadow-sm border border-slate-100 overflow-hidden mb-6">
          <div className="p-4 border-b border-slate-50">
            <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-widest">Pending Fulfilment</h3>
          </div>
          
          <div className="overflow-x-auto -webkit-overflow-scrolling-touch">
            <table className="w-full min-w-[600px] border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-4 py-3 text-left text-[9px] font-black text-slate-400 uppercase tracking-widest">Art No</th>
                  <th className="px-4 py-3 text-left text-[9px] font-black text-slate-400 uppercase tracking-widest">Brand</th>
                  <th className="px-4 py-3 text-left text-[9px] font-black text-slate-400 uppercase tracking-widest">Description</th>
                  <th className="px-4 py-3 text-right text-[9px] font-black text-slate-400 uppercase tracking-widest">Order Qty</th>
                  <th className="px-4 py-3 text-right text-[9px] font-black text-slate-400 uppercase tracking-widest">Stock</th>
                  <th className="px-4 py-3 text-right text-[9px] font-black text-slate-400 uppercase tracking-widest">Bal</th>
                  <th className="px-4 py-3 text-center text-[9px] font-black text-slate-400 uppercase tracking-widest">ETA</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {DUMMY_BACKORDERS.map((item, idx) => (
                  <tr key={idx} className="active:bg-blue-50/50 transition-colors">
                    <td className="px-4 py-4 text-[11px] font-black text-blue-900">{item.artNr}</td>
                    <td className="px-4 py-4 text-[11px] font-black text-slate-900">{item.brand}</td>
                    <td className="px-4 py-4 text-[10px] font-bold text-slate-500 uppercase">{item.desc}</td>
                    <td className="px-4 py-4 text-right text-[11px] font-black text-slate-900">{item.qty}</td>
                    <td className="px-4 py-4 text-right text-[11px] font-black text-slate-900">{item.stock}</td>
                    <td className="px-4 py-4 text-right text-[11px] font-black text-orange-600">{item.bal}</td>
                    <td className="px-4 py-4 text-center text-[10px] font-black text-slate-400">{item.eta}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <footer className="p-4 bg-white border-t border-slate-100 flex items-center justify-between">
        <span className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em]">Live Supply Chain View</span>
        <button className="bg-slate-900 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest">EXPORT PDF</button>
      </footer>
    </div>
  );
};

export default BackorderAvailabilityScreen;
