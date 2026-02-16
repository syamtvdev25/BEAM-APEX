
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import { brandingConfig } from '../config/brandingConfig';
import PageLayout from './layout/PageLayout';
import BrandingHeader from './BrandingHeader';

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
}

const ERPScreen: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const menuItems: MenuItem[] = [
    { id: 'item_query', label: 'ITEM QUERY', path: '/item-query', icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg> },
    { id: 'backorder', label: 'BACKORDER LIST', path: '/backorder-list', icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg> },
    { id: 'country_turnover', label: 'COUNTRY TURNOVER', path: '/country-turnover', icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg> },
    { id: 'sales_country_salesman', label: 'TOTAL CUSTOMER SALES BY COUNTRY – SALESMAN', path: '/customer-sales-country-salesman/filter', icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg> },
    { id: 'sales_subgroup', label: 'SALES BY SUBGROUP', path: '/customer-sales-subgroup', icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"/></svg> },
  ];

  return (
    <PageLayout>
      <BrandingHeader title="ERP Menu" onBack={() => navigate('/dashboard')} />

      <main className="flex-1 p-5 overflow-y-auto scroll-smooth" style={{ WebkitOverflowScrolling: 'touch' }}>
        <div className="px-1 mb-6">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em]">Enterprise Functions</h3>
        </div>
        
        <div className="grid grid-cols-2 gap-5 pb-10">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className="flex flex-col items-center justify-center aspect-square bg-white rounded-[32px] shadow-sm shadow-blue-900/5 border border-slate-50 p-6 transition-all hover:shadow-xl hover:-translate-y-1 active:scale-95 group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-transparent to-blue-50/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10 w-16 h-16 bg-blue-50/50 rounded-2xl flex items-center justify-center mb-4 transition-all group-hover:scale-110 group-hover:bg-white group-hover:shadow-lg duration-300">
                <div className="text-[#00599F] transition-colors group-hover:text-[#003366]">
                  {item.icon}
                </div>
              </div>
              <span className="relative z-10 text-[11px] font-black text-slate-700 text-center uppercase tracking-[0.15em] leading-tight">
                {item.label}
              </span>
            </button>
          ))}
          <div className="flex flex-col items-center justify-center aspect-square bg-slate-100/50 rounded-[32px] border-2 border-dashed border-slate-200 p-6 opacity-40">
            <div className="w-12 h-12 bg-slate-200 rounded-2xl mb-4" />
            <span className="text-[9px] font-black text-slate-400 text-center uppercase tracking-[0.15em]">COMING SOON</span>
          </div>
        </div>

        <div className="py-8 flex flex-col items-center justify-center space-y-2">
           <div className="w-8 h-0.5 bg-blue-100 rounded-full" />
           <p className="text-[11px] font-bold text-[#003366] tracking-[0.2em] uppercase">{brandingConfig.enterpriseTagline}</p>
        </div>
      </main>

      <footer className="bg-white border-t border-slate-100 p-4 text-center shrink-0">
        <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest italic leading-none">
          v1.0.0 Module Access
        </p>
      </footer>
    </PageLayout>
  );
};

export default ERPScreen;
