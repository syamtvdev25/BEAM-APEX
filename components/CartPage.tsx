
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import CartSummaryBar from './CartSummaryBar';
import PageShell from './PageShell';
import { saveUIState, loadUIState } from '../utils/uiState';
import { ProductThumb } from './ProductThumb';

const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { pricedItems, offerItems, updateQty, removeFromCart, clearCart, totalsByCurrency } = useCart();
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const [activeTab, setActiveTab] = useState<'order' | 'offer'>(
    pricedItems.length > 0 ? 'order' : 'offer'
  );

  useEffect(() => {
    const saved = loadUIState<any>('cart_view');
    if (saved) {
      if (saved.activeTab) setActiveTab(saved.activeTab);
      setTimeout(() => { if (scrollRef.current) scrollRef.current.scrollTop = saved.scrollY; }, 50);
    }
  }, []);

  const handleStateSave = () => {
    saveUIState('cart_view', {
      activeTab,
      scrollY: scrollRef.current?.scrollTop || 0
    });
  };

  const handleTabChange = (tab: 'order' | 'offer') => {
    setActiveTab(tab);
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  };

  const displayItems = activeTab === 'order' ? pricedItems : offerItems;

  return (
    <PageShell title="Manage Cart" onBack={() => { saveUIState('cart_view', { activeTab, scrollY: 0 }); navigate(-1); }}>
      <CartSummaryBar />

      <div className="bg-white px-6 py-4 shrink-0 border-b border-slate-100">
        <div className="flex p-1 bg-slate-100 rounded-[20px]">
          <button 
            onClick={() => handleTabChange('order')}
            className={`flex-1 py-3 px-2 rounded-[16px] transition-all flex flex-col items-center ${activeTab === 'order' ? 'bg-white shadow-sm text-blue-900' : 'text-slate-400'}`}
          >
            <span className="text-[11px] font-black uppercase tracking-widest">Order Confirm</span>
            <span className="text-[8px] font-bold opacity-60">{pricedItems.length} Items</span>
          </button>
          <button 
            onClick={() => handleTabChange('offer')}
            className={`flex-1 py-3 px-2 rounded-[16px] transition-all flex flex-col items-center ${activeTab === 'offer' ? 'bg-white shadow-sm text-blue-900' : 'text-slate-400'}`}
          >
            <span className="text-[11px] font-black uppercase tracking-widest">Sales Offer</span>
            <span className="text-[8px] font-bold opacity-60">{offerItems.length} Pending</span>
          </button>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3" onScroll={handleStateSave}>
        {displayItems.length === 0 ? (
          <div className="py-24 text-center opacity-30 flex flex-col items-center">
             <p className="uppercase font-black tracking-[0.2em] text-[10px] text-slate-400">Empty Tab</p>
          </div>
        ) : displayItems.map(item => {
          // Standardized image name resolution
          const resolvedImageName = item.ImageName || (item.ArtNr ? `${item.ArtNr.trim()}.JPG` : '');
          
          return (
            <div key={item.id} className="bg-white rounded-[28px] p-4 shadow-sm border border-slate-100 flex items-center space-x-4">
               <div className="flex flex-1 items-center space-x-4 min-w-0" onClick={() => { handleStateSave(); navigate(`/product/${encodeURIComponent(item.ArtNr)}`, { state: item }); }}>
                  <ProductThumb imageName={resolvedImageName} size={96} className="w-16 h-16 rounded-2xl" />
                  <div className="flex-1 min-w-0">
                     <h4 className="text-[13px] font-black text-slate-900 truncate">{item.ArtNr}</h4>
                     <p className="text-[10px] text-slate-500 uppercase italic truncate">{item.Bez}</p>
                     <p className="text-[10px] font-black text-blue-900 mt-1">{item.Curr} {item.isPriced ? item.Price.toFixed(2) : 'OFFER REQ'}</p>
                  </div>
               </div>
               <div className="flex items-center space-x-2">
                  <div className="flex items-center bg-slate-50 border border-slate-100 rounded-xl p-0.5">
                     <button onClick={() => updateQty(item.id, -1)} className="w-7 h-7 flex items-center justify-center font-black">-</button>
                     <span className="w-5 text-center text-xs font-black">{item.qty}</span>
                     <button onClick={() => updateQty(item.id, 1)} className="w-7 h-7 flex items-center justify-center font-black">+</button>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} className="w-8 h-8 text-red-500">×</button>
               </div>
            </div>
          );
        })}
      </div>

      <div className="p-6 bg-white border-t border-slate-100 shadow-inner">
        <div className="flex justify-between items-center mb-4">
           <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Value</p>
              {totalsByCurrency.map((t, i) => <p key={i} className="text-xl font-black text-slate-900">{t.currency} {t.amount}</p>)}
           </div>
           <button onClick={() => { if(confirm('Clear items?')) clearCart(); }} className="text-[9px] font-black text-slate-400 hover:text-red-500 uppercase tracking-widest">Clear</button>
        </div>
        <button disabled={displayItems.length === 0} onClick={() => { alert('Saving to ERP...'); clearCart(); navigate('/dashboard'); }} className="w-full bg-slate-900 text-white py-4 rounded-[20px] font-black uppercase text-xs shadow-xl active:scale-95 disabled:opacity-30">
          {activeTab === 'order' ? 'Save Order Confirmation' : 'Request Sales Offer'}
        </button>
      </div>
    </PageShell>
  );
};

export default CartPage;
