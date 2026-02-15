
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchLiteApi, SearchItemRaw } from '../api/searchApi';

const SearchScreen: React.FC = () => {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState('');
  const [results, setResults] = useState<SearchItemRaw[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState('');
  
  // Local state for quantities and feedback
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [toast, setToast] = useState<{ message: string; visible: boolean }>({ message: '', visible: false });

  // Helper to show toast
  const showToast = (message: string) => {
    setToast({ message, visible: true });
    setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 2000);
  };

  const handleSearch = async () => {
    const trimmed = searchText.trim();
    if (!trimmed) {
      setError('Please enter a search key');
      return;
    }

    setError('');
    setIsLoading(true);
    setHasSearched(true);

    try {
      const response = await searchLiteApi(trimmed);
      if (response.success && response.data) {
        setResults(response.data);
        // Initialize quantities for new results
        const newQtys: Record<string, number> = {};
        response.data.forEach(item => {
          const id = `${item.ArtNr}-${item.Brand}`;
          newQtys[id] = 1;
        });
        setQuantities(newQtys);

        if (response.count === 0) {
          setError('No results found for this query.');
        }
      } else {
        setError(response.message || 'Search failed.');
        setResults([]);
      }
    } catch (err: any) {
      setError('Connection error or server unreachable.');
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const updateQty = (id: string, delta: number) => {
    setQuantities(prev => ({
      ...prev,
      [id]: Math.max(1, (prev[id] || 1) + delta)
    }));
  };

  const handleAddToCart = (item: SearchItemRaw) => {
    const id = `${item.ArtNr}-${item.Brand}`;
    const qty = quantities[id] || 1;
    
    // In a real app, you'd dispatch to a global cart store here
    // For now, we simulate success and show feedback
    showToast(`Added ${qty} x ${item.ArtNr} to cart`);
  };

  return (
    <div className="flex-1 flex flex-col bg-blue-50 h-screen overflow-hidden">
      <header className="px-6 py-4 border-b border-blue-100 flex items-center bg-white z-10 shadow-sm">
        <button 
          onClick={() => navigate('/dashboard')} 
          className="mr-4 p-2 -ml-2 rounded-full hover:bg-gray-100 text-blue-900 active:scale-90 transition-all"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h2 className="text-xl font-extrabold text-blue-950">Search Items</h2>
      </header>

      <div className="p-4 bg-white border-b border-gray-100 shrink-0">
        <div className="flex space-x-2 max-w-4xl mx-auto">
          <input
            type="text"
            value={searchText}
            disabled={isLoading}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="PartNo / Brand / Ref No..."
            className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-900 focus:bg-white outline-none transition-all text-sm font-bold text-gray-800 shadow-inner"
          />
          <button
            onClick={handleSearch}
            disabled={isLoading}
            className="px-6 py-3 bg-blue-900 text-white font-black rounded-xl hover:bg-blue-950 active:scale-95 transition-all shadow-md shadow-blue-900/10 text-xs uppercase tracking-widest"
          >
            {isLoading ? '...' : 'FIND'}
          </button>
        </div>
        {error && <p className="mt-2 text-red-600 text-[10px] font-black uppercase ml-1">{error}</p>}
      </div>

      <main className="flex-1 overflow-y-auto p-4 space-y-3 relative">
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-4 opacity-50">
            <div className="w-10 h-10 border-4 border-blue-900 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-[10px] font-black text-blue-900 uppercase tracking-widest">Searching...</p>
          </div>
        ) : results.map((item, idx) => {
          const id = `${item.ArtNr}-${item.Brand}`;
          const qty = quantities[id] || 1;
          const price = parseFloat(item.Price?.toString() || '0');
          const hasPrice = price > 0;
          const totalValue = (price * qty).toFixed(2);

          return (
            <div
              key={id}
              className="w-full bg-white rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center shadow-sm border border-white hover:border-blue-100 transition-all group"
            >
              {/* Left Info Section */}
              <div className="flex flex-1 items-center space-x-4 w-full">
                <div className="w-14 h-14 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-100 shrink-0 overflow-hidden">
                   <img 
                    src={`https://ecom.apexgulf.ae/apex/Images/Items/${item.ImageName}`} 
                    alt="" 
                    className="w-10 h-10 object-contain opacity-80"
                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/40x40/f1f5f9/94a3b8?text=' + (item.Brand?.[0] || '?'); }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-black text-blue-900/50 uppercase tracking-widest leading-none">{item.Brand}</span>
                    <span className={`text-[8px] font-black px-1.5 py-0.5 rounded-full border ${item.Status === 'Normal' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-gray-50 text-gray-400 border-gray-100'}`}>
                      {item.Status.toUpperCase()}
                    </span>
                  </div>
                  <h3 className="text-base font-black text-slate-900 mt-0.5 leading-none">{item.ArtNr}</h3>
                  <p className="text-[10px] font-bold text-blue-600 mt-1 uppercase tracking-tight">Ref: {item.GArtNr || '--'}</p>
                  <p className="text-[10px] text-gray-400 mt-1 truncate font-medium max-w-[150px] uppercase">{item.Bez}</p>
                  
                  {/* Price & Stock info */}
                  <div className="mt-2 flex space-x-3">
                    <span className="text-[9px] font-black text-slate-600 uppercase">
                      Stock: <span className={item.Stock && item.Stock !== '0' ? 'text-green-600' : 'text-slate-400'}>{item.Stock || 'N/A'}</span>
                    </span>
                    <span className="text-[9px] font-black text-slate-600 uppercase">
                      Price: <span className={hasPrice ? 'text-blue-900' : 'text-slate-400'}>{hasPrice ? `${price.toFixed(2)} ${item.Curr}` : 'N/A'}</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Action Section (Inline Cart) */}
              <div className="w-full sm:w-auto mt-4 sm:mt-0 sm:ml-4 flex items-center justify-between sm:justify-end space-x-4 border-t sm:border-t-0 pt-3 sm:pt-0">
                <div className="flex flex-col items-end sm:mr-2">
                  <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Value</label>
                  <span className="text-xs font-black text-blue-900">
                    {hasPrice ? `${totalValue} ${item.Curr}` : '—'}
                  </span>
                </div>

                <div className="flex items-center bg-gray-50 border border-gray-100 rounded-xl px-1 py-1 shadow-inner">
                  <button 
                    onClick={() => updateQty(id, -1)}
                    className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-blue-900 hover:bg-white rounded-lg transition-all active:scale-90 font-black text-lg"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-xs font-black text-slate-900">{qty}</span>
                  <button 
                    onClick={() => updateQty(id, 1)}
                    className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-blue-900 hover:bg-white rounded-lg transition-all active:scale-90 font-black text-lg"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={() => handleAddToCart(item)}
                  className="bg-orange-500 hover:bg-orange-600 text-white p-3 rounded-xl shadow-lg shadow-orange-500/20 active:scale-90 transition-all"
                  title="Add to Cart"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </button>
              </div>
            </div>
          );
        })}

        {hasSearched && !isLoading && results.length === 0 && (
          <div className="py-20 text-center opacity-30">
            <p className="text-sm font-black text-blue-900 uppercase tracking-widest">No matching parts found</p>
          </div>
        )}
      </main>

      {/* Toast Notification */}
      <div className={`fixed bottom-24 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 pointer-events-none ${toast.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <div className="bg-slate-900/90 text-white px-6 py-3 rounded-2xl shadow-2xl backdrop-blur-md flex items-center space-x-3 border border-white/10">
          <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <span className="text-[11px] font-black uppercase tracking-wider">{toast.message}</span>
        </div>
      </div>
    </div>
  );
};

export default SearchScreen;
