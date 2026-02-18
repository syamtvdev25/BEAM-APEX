
import React, { useState, useCallback, memo, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchLiteApi, SearchItemRaw } from '../api/searchApi';
import { useCart } from '../context/CartContext';
import CartSummaryBar from './CartSummaryBar';
import PageShell from './PageShell';
import { saveUIState, loadUIState } from '../utils/uiState';
import { ProductThumb } from './ProductThumb';

const getUniqueKey = (item: SearchItemRaw) => {
  const normalizedArtNr = (item.ArtNr || '').trim().replace(/\s+/g, '');
  const brand = (item.Brand || '').trim();
  const suffix = (item.GArtNr || 'REF').trim();
  return `${normalizedArtNr}|${brand}|${suffix}`.toUpperCase();
};

const SearchItemCard = memo(({ item, onAdd, qty, onQtyChange, onNavigate }: any) => {
  const id = getUniqueKey(item);
  const price = typeof item.Price === 'string' ? parseFloat(item.Price) : (item.Price || 0);
  const hasPrice = price > 0;
  const currency = item.Curr || 'AED';
  const stockValue = item.Stock && item.Stock !== '0' ? item.Stock : 'N/A';
  const isOutOfStock = stockValue === 'N/A' || stockValue === '0';

  return (
    <div className="w-full bg-white rounded-[32px] p-5 flex flex-col shadow-sm border border-slate-100 hover:border-blue-100 transition-all">
      <div onClick={onNavigate} className="flex items-start justify-between space-x-4 cursor-pointer active:opacity-70 transition-opacity">
        <div className="flex flex-1 space-x-4 min-w-0">
          <ProductThumb 
            imageName={item.ImageName} 
            size={64} 
            alt={item.Bez || item.ArtNr} 
          />
          <div className="flex-1 min-w-0 flex flex-col justify-center">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] mb-1">{item.Brand}</span>
            <h3 className="text-lg font-black text-slate-900 leading-tight truncate uppercase font-mono">{item.ArtNr}</h3>
            <p className="text-[10px] text-slate-500 mt-1 line-clamp-2 uppercase leading-tight">{item.Bez}</p>
          </div>
        </div>
        <div className="bg-slate-50/80 rounded-2xl p-3 border border-slate-100 shrink-0 flex flex-col items-end min-w-[110px]">
           <label className="text-[8px] font-black text-slate-400 uppercase mb-1">Unit Price</label>
           <p className={`text-sm font-black ${hasPrice ? 'text-slate-900' : 'text-slate-300'}`}>{hasPrice ? `${currency} ${price.toFixed(2)}` : 'N/A'}</p>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
        <span className={`text-[10px] font-black px-2 py-0.5 rounded-lg border uppercase ${!isOutOfStock ? 'bg-green-100 text-green-700 border-green-200' : 'bg-slate-100 text-slate-400 border-slate-200'}`}>
          {stockValue !== 'N/A' ? `Stock: ${stockValue}` : 'No Stock'}
        </span>
        <div className="flex items-center space-x-3">
          <div className="flex items-center bg-white border border-slate-200 rounded-2xl p-1 shadow-sm" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => onQtyChange(id, -1)} className="w-8 h-8 flex items-center justify-center text-slate-400 active:scale-90 font-black">-</button>
            <span className="w-10 text-center text-xs font-black text-slate-900">{qty}</span>
            <button onClick={() => onQtyChange(id, 1)} className="w-8 h-8 flex items-center justify-center text-slate-400 active:scale-90 font-black">+</button>
          </div>
          <button onClick={(e) => { e.stopPropagation(); onAdd(item); }} className="bg-orange-500 text-white py-3 px-5 rounded-2xl shadow-lg active:scale-95 text-[10px] font-black uppercase tracking-widest">ADD</button>
        </div>
      </div>
    </div>
  );
});

const SearchScreen: React.FC = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const scrollRef = useRef<HTMLElement>(null);
  
  const [searchText, setSearchText] = useState('');
  const [results, setResults] = useState<SearchItemRaw[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [toast, setToast] = useState({ message: '', visible: false });

  useEffect(() => {
    const saved = loadUIState<any>('catalog_search');
    if (saved) {
      setSearchText(saved.searchText || '');
      setResults(saved.results || []);
      setQuantities(saved.quantities || {});
      // Delay to ensure DOM is ready for scroll
      setTimeout(() => { 
        if (scrollRef.current) scrollRef.current.scrollTop = saved.scrollY;
      }, 100);
    }
  }, []);

  const handleStateSave = useCallback(() => {
    saveUIState('catalog_search', {
      searchText,
      results,
      quantities,
      scrollY: scrollRef.current?.scrollTop || 0
    });
  }, [searchText, results, quantities]);

  const handleSearch = async () => {
    if (!searchText.trim()) return;
    setIsLoading(true);
    try {
      const resp = await searchLiteApi(searchText.trim());
      if (resp.success && resp.data) {
        setResults(resp.data);
        const qtys = { ...quantities };
        resp.data.forEach(item => { if (!qtys[getUniqueKey(item)]) qtys[getUniqueKey(item)] = 1; });
        setQuantities(qtys);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (results.length > 0) handleStateSave();
  }, [results, handleStateSave]);

  const updateSearchQty = (id: string, delta: number) => {
    setQuantities(prev => ({ ...prev, [id]: Math.max(1, (prev[id] || 1) + delta) }));
  };

  return (
    <PageShell 
      title="Search Catalog" 
      onBack={() => { sessionStorage.removeItem('ui_state_catalog_search'); navigate('/dashboard'); }}
    >
      <div onClick={() => { handleStateSave(); navigate('/cart'); }} className="cursor-pointer active:opacity-75">
        <CartSummaryBar />
      </div>

      <div className="p-4 bg-white border-b border-slate-100 shrink-0">
        <div className="flex space-x-2 max-w-4xl mx-auto">
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="PartNo / Brand..."
            className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-slate-900 outline-none transition-all text-sm font-bold shadow-inner"
          />
          <button onClick={handleSearch} disabled={isLoading} className="px-6 py-3 bg-slate-900 text-white font-black rounded-2xl active:scale-95 text-xs">
            {isLoading ? '...' : 'FIND'}
          </button>
        </div>
      </div>

      <div 
        ref={(el) => { (scrollRef as any).current = el; }}
        className="flex-1 overflow-y-auto p-4 space-y-4" 
        onScroll={handleStateSave}
      >
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-4 opacity-50">
            <div className="w-10 h-10 border-4 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-[10px] font-black uppercase tracking-widest">Searching...</p>
          </div>
        ) : results.length > 0 ? (
          results.map((item) => (
            <SearchItemCard 
              key={getUniqueKey(item)} 
              item={item} 
              qty={quantities[getUniqueKey(item)] || 1} 
              onQtyChange={updateSearchQty} 
              onAdd={() => { addToCart(item, quantities[getUniqueKey(item)] || 1); setToast({ message: 'Added to cart', visible: true }); setTimeout(() => setToast(p => ({ ...p, visible: false })), 1000); }}
              onNavigate={() => { handleStateSave(); navigate(`/product/${encodeURIComponent(item.ArtNr)}`, { state: item }); }}
            />
          ))
        ) : (
          <div className="py-32 flex flex-col items-center justify-center opacity-20 text-center">
            <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <p className="text-sm font-black uppercase tracking-[0.2em]">Enter query above</p>
          </div>
        )}
      </div>

      {toast.visible && (
        <div className="fixed top-[45%] left-1/2 -translate-x-1/2 z-[250] bg-slate-900 text-white px-8 py-4 rounded-3xl shadow-2xl flex flex-col items-center animate-in zoom-in duration-300">
          <span className="text-[12px] font-black uppercase tracking-[0.2em]">{toast.message}</span>
        </div>
      )}
    </PageShell>
  );
};

export default SearchScreen;
