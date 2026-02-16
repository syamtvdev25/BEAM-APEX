
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { SearchItemRaw, searchLiteApi } from '../api/searchApi';
import { User } from '../types';
import { useCart } from '../context/CartContext';

const CartSelectionScreen: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const initialItem = location.state?.item as SearchItemRaw;

  const [item, setItem] = useState<SearchItemRaw>(initialItem);
  const [qty, setQty] = useState(1);
  const [isEnriching, setIsEnriching] = useState(false);

  useEffect(() => {
    if (!initialItem) {
      navigate('/search');
      return;
    }

    const enrichData = async () => {
      const authUserStr = localStorage.getItem('authUser');
      if (authUserStr) {
        try {
          const user = JSON.parse(authUserStr) as User;
          if (user.customerCode && user.country) {
            setIsEnriching(true);
            const response = await searchLiteApi(initialItem.ArtNr, user.customerCode, user.country);
            if (response.success && response.data && response.data.length > 0) {
              const match = response.data.find(d => d.Brand === initialItem.Brand && d.ArtNr === initialItem.ArtNr) || response.data[0];
              setItem(match);
            }
          }
        } catch (e) {
          console.error("Enrichment failed", e);
        } finally {
          setIsEnriching(false);
        }
      }
    };

    enrichData();
  }, [initialItem, navigate]);

  if (!item) return null;

  const priceNum = parseFloat(item.Price?.toString() || '0') || 0;
  const totalValue = (qty * priceNum).toFixed(2);

  const handleAddToCart = () => {
    addToCart(item, qty);
    navigate('/search');
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50 h-screen overflow-hidden">
      <header 
        style={{ paddingTop: 'calc(env(safe-area-inset-top, 0px) + 0.75rem)' }}
        className="px-6 pb-4 border-b border-blue-100 flex items-center bg-white z-10 shadow-sm"
      >
        <button 
          onClick={() => navigate(-1)} 
          className="mr-4 p-2 -ml-2 rounded-full hover:bg-gray-100 text-blue-900 active:scale-90 transition-all"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h2 className="text-xl font-black text-blue-950">Configure Item</h2>
        {isEnriching && (
          <div className="ml-auto w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        )}
      </header>

      <main className="flex-1 overflow-y-auto p-4">
        <div className="bg-white rounded-[32px] shadow-xl shadow-blue-900/5 border border-white overflow-hidden animate-in zoom-in-95 duration-300">
          <div className="p-6">
            <div className="flex items-start space-x-6">
              <div className="w-24 h-24 bg-slate-50 rounded-[24px] border border-slate-100 flex items-center justify-center shrink-0 shadow-inner">
                <img 
                  src={`https://ecom.apexgulf.ae/apex/Images/Items/${item.ImageName}`} 
                  alt="Item"
                  className="max-w-[80%] max-h-[80%] object-contain"
                  onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/100x100/f1f5f9/94a3b8?text=No+Image'; }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest">{item.Brand}</span>
                <h1 className="text-2xl font-black text-slate-900 leading-tight mt-1 truncate">{item.ArtNr}</h1>
                <p className="text-[11px] font-bold text-blue-600 uppercase tracking-tight mt-0.5">Suffix: {item.GArtNr}</p>
                <div className="flex mt-2 space-x-2">
                  <span className="bg-green-50 text-green-600 text-[8px] font-black px-2 py-0.5 rounded-full border border-green-100 uppercase">
                    {item.Status}
                  </span>
                  {item.Replaced && (
                    <span className="bg-orange-50 text-orange-600 text-[8px] font-black px-2 py-0.5 rounded-full border border-orange-100 uppercase">
                      Replaces: {item.Replaced}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-50">
              <p className="text-[11px] font-medium text-slate-500 leading-relaxed uppercase tracking-wide">
                {item.Bez}
              </p>
            </div>
          </div>

          <div className="bg-slate-50/50 p-6 border-t border-slate-100">
            <div className="grid grid-cols-2 gap-y-6 gap-x-4">
              <div className="col-span-1">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Unit Price</label>
                <p className="text-lg font-black text-slate-900">
                  {priceNum > 0 ? priceNum.toFixed(2) : '—'} <span className="text-xs text-slate-400 ml-1">{item.Curr}</span>
                </p>
              </div>

              <div className="col-span-1 text-right">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Stock</label>
                <span className={`text-[10px] font-black px-2 py-1 rounded-lg uppercase inline-block ${item.Stock && item.Stock !== '0' ? 'bg-green-600 text-white shadow-lg' : 'bg-slate-200 text-slate-400'}`}>
                  {item.Stock || 'N/A'}
                </span>
              </div>

              <div className="col-span-1">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2">Quantity</label>
                <div className="flex items-center bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm w-32">
                  <button 
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="flex-1 py-3 text-slate-400 hover:bg-slate-50 active:bg-slate-100 font-bold transition-colors"
                  >-</button>
                  <input 
                    type="number" 
                    value={qty}
                    onChange={(e) => setQty(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-10 text-center text-sm font-black text-slate-900 bg-transparent outline-none"
                  />
                  <button 
                    onClick={() => setQty(qty + 1)}
                    className="flex-1 py-3 text-slate-400 hover:bg-slate-50 active:bg-slate-100 font-bold transition-colors"
                  >+</button>
                </div>
              </div>

              <div className="col-span-1 text-right flex flex-col justify-end">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Total Value</label>
                <p className="text-2xl font-black text-blue-900">
                  {totalValue} <span className="text-xs text-blue-300 ml-0.5">{item.Curr || 'AED'}</span>
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 bg-white border-t border-slate-100">
            <button 
              onClick={handleAddToCart}
              className="w-full bg-orange-500 text-white py-5 rounded-[24px] font-black text-sm uppercase tracking-[0.2em] shadow-xl shadow-orange-500/30 active:scale-95 transition-all flex items-center justify-center space-x-3"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span>Confirm & Add</span>
            </button>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-slate-100 p-4 text-center pb-[env(safe-area-inset-bottom, 1rem)]">
        <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Enterprise Inventory Control</p>
      </footer>
    </div>
  );
};

export default CartSelectionScreen;
