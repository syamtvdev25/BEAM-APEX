
import React from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../App';

const CartSummaryBar: React.FC = () => {
  const { user } = useAuth();
  const { uniqueCount, totalsByCurrency } = useCart();

  return (
    <div 
      style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
      className="bg-white border-b border-slate-100 z-[100] shadow-sm shrink-0"
    >
      <div className="px-4 py-3 flex items-center justify-between space-x-3">
        {/* Column 1: Customer Info (Left) */}
        <div className="flex items-center flex-1 min-w-0">
          <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center shrink-0 mr-2 border border-slate-200">
            <svg className="w-4 h-4 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest leading-none mb-0.5">Account</span>
            <span className="text-[11px] font-black text-slate-900 truncate uppercase tracking-tight">
              {user?.customerName || 'GUEST CUSTOMER'}
            </span>
          </div>
        </div>

        {/* Column 2: Totals Chips (Middle - Scrollable) */}
        <div className="flex-[2] flex justify-center overflow-x-auto no-scrollbar scroll-smooth -webkit-overflow-scrolling-touch px-1">
          <div className="flex items-center space-x-2 whitespace-nowrap">
            {totalsByCurrency.length > 0 ? (
              totalsByCurrency.map((t, idx) => (
                <div 
                  key={idx}
                  className="bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-xl flex flex-col items-center min-w-[50px]"
                >
                  <span className="text-[6px] font-black text-blue-400 uppercase leading-none mb-0.5">{t.currency}</span>
                  <span className="text-[10px] font-black text-blue-900 leading-none">{t.amount}</span>
                </div>
              ))
            ) : (
              <div className="bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-xl flex flex-col items-center min-w-[50px]">
                <span className="text-[6px] font-black text-slate-300 uppercase leading-none mb-0.5">TOTAL</span>
                <span className="text-[10px] font-black text-slate-300 leading-none">0.00</span>
              </div>
            )}
          </div>
        </div>

        {/* Column 3: Cart Icon (Far Right) */}
        <div className="flex-shrink-0 relative">
          <div className="p-2 bg-slate-900 rounded-xl shadow-lg shadow-slate-900/10 border border-slate-800">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          {uniqueCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 flex h-4.5 min-w-[18px] items-center justify-center rounded-full bg-orange-600 px-1 text-[9px] font-black text-white border-2 border-white shadow-sm animate-in zoom-in">
              {uniqueCount > 99 ? '99+' : uniqueCount}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartSummaryBar;
