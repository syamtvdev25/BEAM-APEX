
import React from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import PageShell from '../PageShell';

const EmployeeItemDetailsScreen: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  
  // Try to get data from location state (passed from dashboard search)
  const itemData = location.state;

  return (
    <PageShell title="Item Details" onBack={() => navigate('/employee')}>
      <div className="flex-1 bg-slate-50 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-5 space-y-6">
          
          {/* Main Info Card */}
          <div className="bg-white rounded-[32px] p-6 shadow-xl shadow-blue-900/5 border border-white space-y-6">
            <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6">
              <div className="w-40 h-40 bg-slate-50 rounded-[28px] flex items-center justify-center border border-slate-100 shrink-0 shadow-inner overflow-hidden">
                <img 
                  src={itemData?.ImageUrl || 'https://placehold.co/200x200/f1f5f9/94a3b8?text=No+Image'} 
                  alt="" 
                  className="w-[85%] h-[85%] object-contain"
                  onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/200x200/f1f5f9/94a3b8?text=No+Image'; }}
                />
              </div>
              <div className="flex-1 text-center sm:text-left space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                   <span className="text-xs font-black text-orange-500 uppercase tracking-[0.2em]">{itemData?.Brand || 'GENERIC'}</span>
                   <span className="bg-green-50 text-green-600 text-[10px] font-black px-4 py-1.5 rounded-full border border-green-100 uppercase self-center sm:self-auto">
                    {itemData?.Status || 'NORMAL'}
                  </span>
                </div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none uppercase">{id || itemData?.ArtNr}</h1>
                <p className="text-sm font-bold text-slate-500 leading-relaxed uppercase tracking-wide">
                  {itemData?.Bez || 'Article description not available for this variant.'}
                </p>
                {itemData?.Replaced && (
                  <div className="pt-2">
                    <span className="bg-orange-50 text-orange-600 text-[10px] font-black px-4 py-1.5 rounded-full border border-orange-100 uppercase">
                      Replaces: {itemData.Replaced}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Technical Quick Grid */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-50">
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Supplier</p>
                <p className="text-sm font-bold text-slate-900 uppercase">{itemData?.Apex_Supp_Name || 'APEX GULF'}</p>
              </div>
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Source System</p>
                <p className="text-sm font-bold text-slate-900">ECOM-LIVE-V1</p>
              </div>
            </div>
          </div>

          {/* Placeholder for Extended Data */}
          <div className="bg-slate-900 rounded-[32px] p-8 text-center space-y-4">
             <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mx-auto text-white/50">
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
               </svg>
             </div>
             <div className="space-y-1">
               <h3 className="text-white font-black uppercase text-sm tracking-widest">Extended ERP Data</h3>
               <p className="text-white/40 text-[11px] font-bold uppercase tracking-tight">Technical criteria and sales history restricted for current user level.</p>
             </div>
          </div>

          <div className="py-8 text-center opacity-20">
            <p className="text-[8px] font-black text-slate-300 uppercase tracking-[0.4em]">APEX GULF SUPPLY CHAIN DATA</p>
          </div>
        </div>
      </div>
    </PageShell>
  );
};

export default EmployeeItemDetailsScreen;
