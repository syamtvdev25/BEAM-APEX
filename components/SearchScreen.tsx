
import React, { useState, useCallback, memo, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchLiteApi, SearchItemRaw } from '../api/searchApi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../App';
import CartSummaryBar from './CartSummaryBar';
import PageShell from './PageShell';
import { saveUIState, loadUIState } from '../utils/uiState';
import { ProductThumb } from './ProductThumb';
import { productImageUrl } from '../utils/productImage';

const getUniqueKey = (item: SearchItemRaw) => {
  const normalizedArtNr = (item.ArtNr || '').trim().replace(/\s+/g, '');
  const brand = (item.Brand || '').trim();
  const suffix = (item.GArtNr || 'REF').trim();
  return `${normalizedArtNr}|${brand}|${suffix}`.toUpperCase();
};

/**
 * Customer-only image component to handle absolute URL rendering and error fallbacks
 */
const CustomerSearchImage = ({ item }: { item: SearchItemRaw }) => {
  const [hasError, setHasError] = useState(false);
  const src = (item.ImageUrl || "").trim();

  const placeholder = (
    <div className="w-16 h-16 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 shadow-inner">
      <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    </div>
  );

  if (!src || hasError) return placeholder;

  return (
    <div className="w-16 h-16 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 shadow-sm overflow-hidden">
      <img
        src={src}
        alt={item.Bez || item.ArtNr}
        className="w-full h-full object-cover"
        loading="lazy"
        onError={() => setHasError(true)}
      />
    </div>
  );
};

const SearchItemCard = memo(({ item, onAdd, qty, onQtyChange, onNavigate, isEmployee }: any) => {
  const navigate = useNavigate();
  const id = getUniqueKey(item);
  const price = typeof item.Price === 'string' ? parseFloat(item.Price) : (item.Price || 0);
  const hasPrice = price > 0;
  const currency = item.Curr || 'AED';
  const stockValue = item.Stock && item.Stock !== '0' ? item.Stock : 'N/A';
  const isOutOfStock = stockValue === 'N/A' || stockValue === '0';
  
  // Unified replacement detection logic
  const hasReplacement = !!(item.Replaced && item.Replaced.trim() !== "");

  // Standardized image name resolution (Employee/Fallback use only)
  const resolvedImageName = item.ImageName || (item.ArtNr ? `${item.ArtNr.trim().replace(/\s+/g, '')}.JPG` : '');

  // Role-based debugging
  if (!isEmployee) {
    console.log("CUSTOMER_IMGURL", item.ArtNr, item.ImageUrl);
  } else if ((import.meta as any).env?.DEV) {
    console.debug("SEARCH_IMG_DEBUG", item.ArtNr, productImageUrl(resolvedImageName));
  }

  return (
    <div className="w-full bg-white rounded-[32px] p-5 flex flex-col shadow-sm border border-slate-100 hover:border-blue-100 transition-all">
      <div onClick={onNavigate} className="flex items-start justify-between space-x-3 cursor-pointer active:opacity-70 transition-opacity">
        <div className="flex flex-1 space-x-4 min-w-0">
          <div className="flex flex-col items-center shrink-0">
            {/* Role-based Image Rendering */}
            {!isEmployee ? (
              <CustomerSearchImage item={item} />
            ) : (
              <ProductThumb 
                imageName={resolvedImageName} 
                size={64} 
                alt={item.Bez || item.ArtNr} 
              />
            )}
            
            {isEmployee && (
              <button 
                onClick={(e) => { e.stopPropagation(); navigate(`/erp/${encodeURIComponent(item.ArtNr)}`, { state: item }); }}
                className="mt-3 w-16 h-10 bg-[#003366] text-white rounded-xl flex flex-col items-center justify-center shadow-lg active:scale-95 transition-all border border-white/10"
              >
                <svg className="w-3.5 h-3.5 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 v2M7 7h10" /></svg>
                <span className="text-[8px] font-black uppercase leading-none">ERP</span>
              </button>
            )}
          </div>
          <div className="flex-1 min-w-0 flex flex-col justify-center">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] mb-1">{item.Brand}</span>
            <div className="flex items-baseline space-x-2 min-w-0">
              <h3 className="text-lg font-black text-slate-900 leading-tight truncate uppercase font-mono shrink-0">{item.ArtNr}</h3>
            </div>
            
            {hasReplacement && (
              <div className="flex flex-col mt-1">
                <div className="flex items-center space-x-1.5 overflow-hidden">
                  <span className="bg-amber-50 text-amber-600 text-[7px] font-black px-1 py-0.5 rounded border border-amber-100 uppercase shrink-0">
                    REPLACED
                  </span>
                  <span className="text-[7px] font-bold text-amber-500 uppercase tracking-tighter leading-none truncate whitespace-nowrap">
                    Newer version available
                  </span>
                </div>
                {!isEmployee && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); navigate(`/replacement/${item.ArtNr}`, { state: item }); }}
                    className="text-[9px] font-black text-blue-600 uppercase tracking-widest mt-1 hover:text-blue-800 text-left"
                  >
                    View Replacement →
                  </button>
                )}
              </div>
            )}

            <p className="text-[10px] text-slate-500 mt-1 line-clamp-2 uppercase leading-tight tracking-tight">{item.Bez}</p>
          </div>
        </div>

        <div className="w-20 shrink-0 flex flex-col items-end justify-center py-2 px-2 bg-slate-50/40 rounded-2xl border border-slate-100/50 self-center">
           <label className="text-[7px] font-black text-slate-400 uppercase tracking-tighter mb-0.5">Price</label>
           <div className="flex flex-col items-end">
              <span className="text-[8px] font-bold text-slate-400 leading-none">{currency}</span>
              <span className={`text-xs font-black tracking-tighter ${hasPrice ? 'text-slate-900' : 'text-slate-300'} leading-tight`}>
                {hasPrice ? price.toFixed(2) : 'N/A'}
              </span>
           </div>
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
  const { user } = useAuth();
  const scrollRef = useRef<HTMLElement>(null);
  
  const [searchText, setSearchText] = useState('');
  const [results, setResults] = useState<SearchItemRaw[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [toast, setToast] = useState({ message: '', visible: false });

  const isEmployee = user?.userType === 'APEX';

  useEffect(() => {
    const saved = loadUIState<any>('catalog_search');
    if (saved) {
      setSearchText(saved.searchText || '');
      setResults(saved.results || []);
      setQuantities(saved.quantities || {});
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
              isEmployee={isEmployee}
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
