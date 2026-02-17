
import React from 'react';
import { useNavigate } from 'react-router-dom';
import PageShell from '../PageShell';

interface EmployeeModulePageProps {
  title: string;
}

const EmployeeModulePage: React.FC<EmployeeModulePageProps> = ({ title }) => {
  const navigate = useNavigate();

  return (
    <PageShell title={title} onBack={() => navigate('/employee')}>
      <div className="flex-1 flex flex-col items-center justify-center p-6 bg-slate-50">
        <div className="w-full max-w-md bg-white rounded-[32px] p-10 shadow-xl shadow-blue-900/5 border border-white text-center space-y-6">
          <div className="w-20 h-20 bg-blue-50 rounded-[24px] flex items-center justify-center mx-auto text-blue-900 shadow-inner">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          
          <div className="space-y-2">
            <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">{title}</h2>
            <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Coming Soon</p>
          </div>

          <div className="pt-4 space-y-4">
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 text-left">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Module ID</p>
              <p className="text-sm font-bold text-slate-900">{title.replace(/\s+/g, '_').toUpperCase()}_SECURE_ENTRY</p>
            </div>
            
            <button 
              onClick={() => navigate('/employee')}
              className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-[11px] tracking-widest shadow-lg active:scale-95 transition-all"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
        
        <p className="mt-8 text-[8px] font-black text-slate-300 uppercase tracking-[0.4em]">APEX GULF ENTERPRISE DATA</p>
      </div>
    </PageShell>
  );
};

export default EmployeeModulePage;
