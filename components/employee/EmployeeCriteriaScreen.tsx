
import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import PageShell from '../PageShell';

const EmployeeCriteriaScreen: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const artnr = searchParams.get('artnr');

  return (
    <PageShell title="Technical Criteria" onBack={() => navigate(-1)}>
      <div className="flex-1 p-6 space-y-6 bg-slate-50">
        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100 text-center">
          <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-blue-600">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Criteria Data</h2>
          <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mt-1">Article: {artnr}</p>
          <div className="mt-8 py-10 opacity-30">
            <p className="text-sm font-bold uppercase tracking-widest">No criteria linked to this record</p>
          </div>
        </div>
      </div>
    </PageShell>
  );
};

export default EmployeeCriteriaScreen;
