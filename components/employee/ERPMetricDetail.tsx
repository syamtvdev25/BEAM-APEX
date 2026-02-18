
import React from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import PageShell from '../PageShell';

const ERPMetricDetail: React.FC = () => {
  const navigate = useNavigate();
  const { type, artNr } = useParams();
  const location = useLocation();
  const itemData = location.state;

  const formattedType = type?.split('-').join(' ').toUpperCase();

  return (
    <PageShell title={formattedType || 'METRIC DETAILS'} onBack={() => navigate(-1)}>
      <div className="flex-1 bg-slate-50 overflow-y-auto p-5">
        <div className="max-w-4xl mx-auto space-y-6">
          
          <header className="px-1">
             <span className="text-[10px] font-black text-orange-500 uppercase tracking-[0.2em]">
               {itemData?.Brand || 'REF'} • {artNr}
             </span>
             <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight leading-none mt-2">
                {formattedType}
             </h2>
          </header>

          <div className="bg-white rounded-[32px] p-10 border border-slate-100 shadow-sm text-center space-y-6 animate-in zoom-in-95 duration-500">
             <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto text-blue-900">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
             </div>
             <div className="space-y-2">
                <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">Data Visualization Pending</h3>
                <p className="text-sm font-bold text-slate-400 leading-relaxed uppercase">
                   Detailed transactional lists for <span className="text-blue-600">{formattedType}</span> will be implemented here with live ERP synchronization.
                </p>
             </div>
             <button 
               onClick={() => navigate(-1)}
               className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-[11px] tracking-widest active:scale-95 transition-all"
             >
               Return to Overview
             </button>
          </div>

          <div className="pt-8 text-center opacity-20">
             <p className="text-[8px] font-black text-slate-300 uppercase tracking-[0.4em]">SECURE TRANSACTION LOGS</p>
          </div>
        </div>
      </div>
    </PageShell>
  );
};

export default ERPMetricDetail;
