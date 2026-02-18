
import React from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import PageShell from '../PageShell';

const EmployeeERPPage: React.FC = () => {
  const navigate = useNavigate();
  const { artNr } = useParams();
  const location = useLocation();
  const itemData = location.state;

  return (
    <PageShell title="ERP Data Context" onBack={() => navigate(-1)}>
      <div className="flex-1 bg-slate-50 overflow-y-auto scroll-smooth animate-in fade-in duration-300">
        <div className="max-w-4xl mx-auto p-5 space-y-6">
          
          <header className="px-1 pt-2">
             <div className="flex items-center space-x-2">
               <span className="text-[10px] font-black text-orange-500 uppercase tracking-[0.2em]">
                 {itemData?.Brand || 'REFERENCE'}
               </span>
               <div className="w-1 h-1 bg-slate-300 rounded-full" />
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                 Live Transaction Hub
               </span>
             </div>
             <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight leading-none mt-2 font-mono">
                {artNr || itemData?.ArtNr}
             </h2>
          </header>

          <div className="bg-white rounded-[32px] p-8 shadow-xl shadow-blue-900/5 border border-white text-center space-y-6">
            <div className="w-20 h-20 bg-blue-50 rounded-[28px] flex items-center justify-center mx-auto text-blue-900 shadow-inner">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            
            <div className="space-y-3">
              <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">ERP Technical Details</h3>
              <p className="text-sm font-medium text-slate-400 leading-relaxed px-4">
                This item is mapped to the internal ledger. Historical transaction data, current warehouse bin locations, and procurement lead times will be implemented here.
              </p>
            </div>

            <div className="pt-4 space-y-3">
               <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 text-left flex justify-between items-center">
                 <div className="min-w-0">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</p>
                   <p className="text-sm font-bold text-slate-900 truncate">UNSYNCHRONIZED_STUB</p>
                 </div>
                 <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
               </div>
            </div>
          </div>

          <div className="py-8 text-center opacity-20">
             <p className="text-[8px] font-black text-slate-300 uppercase tracking-[0.4em]">APEX GULF SUPPLY CHAIN ANALYTICS</p>
          </div>
        </div>
      </div>
    </PageShell>
  );
};

export default EmployeeERPPage;
