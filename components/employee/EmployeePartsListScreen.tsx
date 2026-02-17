
import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import PageShell from '../PageShell';

const EmployeePartsListScreen: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const artnr = searchParams.get('artnr');

  return (
    <PageShell title="Parts List" onBack={() => navigate(-1)}>
      <div className="flex-1 p-6 space-y-6 bg-slate-50">
        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100 text-center">
          <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-orange-600">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
          </div>
          <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">BOM / Parts List</h2>
          <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest mt-1">Article: {artnr}</p>
          <div className="mt-8 py-10 opacity-30">
            <p className="text-sm font-bold uppercase tracking-widest">Assembly data unavailable</p>
          </div>
        </div>
      </div>
    </PageShell>
  );
};

export default EmployeePartsListScreen;
