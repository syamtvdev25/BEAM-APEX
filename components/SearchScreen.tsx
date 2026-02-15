
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchItem, CartItem, getSearchCache, setSearchCache } from './searchCache';
import { searchLiteApi, SearchItemRaw } from '../api/searchApi';

interface QueryReport {
  code: string;
  brand: string;
  packingUnit: string;
  manufacturer: string;
  group: string;
  subGroup: string;
  clientBackorder: number;
  reserved: number;
  underPacking: number;
  balQty: number;
  underCounting: number;
}

interface QtyPriceRow {
  fromQty: number;
  toQty: number;
  price: number;
}

const DUMMY_QTY_PRICES: QtyPriceRow[] = [
  { fromQty: 1, toQty: 1679, price: 2.77 },
  { fromQty: 1680, toQty: 6719, price: 2.56 },
  { fromQty: 6720, toQty: 100000, price: 2.41 },
];

const SearchScreen: React.FC = () => {
  const navigate = useNavigate();
  const cache = getSearchCache();

  // Initialize state from cache if available
  const [searchText, setSearchText] = useState(cache?.searchText ?? '');
  const [results, setResults] = useState<SearchItem[]>(cache?.results ?? []);
  const [quantities, setQuantities] = useState<{ [key: string]: number }>(cache?.quantities ?? {});
  const [cart, setCart] = useState<CartItem[]>(cache?.cart ?? []);
  const [hasSearched, setHasSearched] = useState(cache?.hasSearched ?? false);
  const [error, setError] = useState(cache?.error ?? '');
  const [isLoading, setIsLoading] = useState(false);

  // Ephemeral UI state
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isQueryModalOpen, setIsQueryModalOpen] = useState(false);
  const [isQtyPriceModalOpen, setIsQtyPriceModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<QueryReport | null>(null);
  const [selectedQtyPriceItem, setSelectedQtyPriceItem] = useState<{ itemNo: string; brand: string } | null>(null);

  useEffect(() => {
    setSearchCache({
      searchText,
      results,
      quantities,
      cart,
      hasSearched,
      error
    });
  }, [searchText, results, quantities, cart, hasSearched, error]);

  const handleSearch = async () => {
    const trimmedInput = searchText.trim();
    
    if (!trimmedInput) {
      setError('Please enter a search key');
      setResults([]);
      setHasSearched(false);
      return;
    }

    setError('');
    setIsLoading(true);
    setHasSearched(true);

    try {
      const response = await searchLiteApi(trimmedInput);
      
      if (response.Success && response.Data) {
        // Map raw API data to our UI-friendly SearchItem interface
        const mappedResults: SearchItem[] = response.Data.map((item: SearchItemRaw) => ({
          id: item.ID || `api-${item.ItemCode}-${item.Brand}`,
          image: item.Image || 'https://placehold.co/80x80/f3f4f6/9ca3af?text=no+image',
          brand: item.Brand,
          itemCode: item.ItemCode,
          status: item.Status === 'Active' ? 'Active' : 'Inactive',
          replacedBy: item.ReplacedBy || '',
          description: item.Description,
          price: item.Price || 0,
          stock: item.Stock === 'Available' ? 'Available' : 'Out of Stock',
          currency: item.Currency || '€',
        }));
        
        setResults(mappedResults);
        
        const initialQtys: { [key: string]: number } = {};
        mappedResults.forEach(item => {
          initialQtys[item.id] = quantities[item.id] ?? 0;
        });
        setQuantities(initialQtys);
      } else {
        setError(response.Message || 'No items found matching your query.');
        setResults([]);
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred during search.');
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQtyChange = (id: string, value: string) => {
    const num = value === '' ? 0 : parseInt(value);
    if (!isNaN(num) && num >= 0) {
      setQuantities(prev => ({ ...prev, [id]: num }));
    }
  };

  const handleAddToCart = (item: SearchItem) => {
    const selectedQty = quantities[item.id] || 0;
    if (selectedQty <= 0) {
      alert('Please set quantity');
      return;
    }

    setCart(prevCart => {
      const existingIndex = prevCart.findIndex(ci => ci.id === item.id);
      if (existingIndex > -1) {
        const updatedCart = [...prevCart];
        updatedCart[existingIndex] = {
          ...updatedCart[existingIndex],
          cartQty: updatedCart[existingIndex].cartQty + selectedQty
        };
        return updatedCart;
      } else {
        return [...prevCart, { ...item, cartQty: selectedQty }];
      }
    });

    setQuantities(prev => ({ ...prev, [item.id]: 0 }));
    alert(`${selectedQty} item(s) of ${item.itemCode} added to cart`);
  };

  const handleOpenQuery = (item: SearchItem) => {
    setSelectedReport({
      code: item.itemCode,
      brand: item.brand,
      packingUnit: '1',
      manufacturer: 'Mercedes Benz-Truck',
      group: 'Other applications',
      subGroup: 'Shock absorber cab',
      clientBackorder: 40,
      reserved: 0,
      underPacking: 0,
      balQty: 0,
      underCounting: 0,
    });
    setIsQueryModalOpen(true);
  };

  const handleOpenQtyPrice = (item: SearchItem) => {
    setSelectedQtyPriceItem({ itemNo: item.itemCode, brand: item.brand });
    setIsQtyPriceModalOpen(true);
  };

  const handleItemDetails = (item: SearchItem) => {
    const imageType = item.image.includes('no+image') ? 'no_image' : 'product';
    navigate(`/item-details/${encodeURIComponent(item.itemCode)}/${encodeURIComponent(item.brand)}/${imageType}`);
  };

  const calculateCartTotal = () => {
    return cart.reduce((acc, item) => acc + (item.price * item.cartQty), 0).toFixed(2);
  };

  return (
    <div className="flex-1 flex flex-col bg-blue-50 h-screen overflow-hidden">
      <header className="px-6 py-4 border-b border-blue-100 flex items-center justify-between bg-white z-10 shadow-sm">
        <div className="flex items-center">
          <button 
            onClick={() => navigate(-1)} 
            className="mr-4 p-2 -ml-2 rounded-full hover:bg-gray-100 text-blue-900 active:scale-90 transition-all"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h2 className="text-xl font-extrabold text-blue-950">Search</h2>
        </div>

        <button 
          onClick={() => setIsCartOpen(true)}
          className="relative p-2 rounded-xl hover:bg-gray-100 transition-colors"
        >
          <svg className="w-7 h-7 text-blue-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          {cart.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-black min-w-[20px] h-[20px] flex items-center justify-center rounded-full border-2 border-white shadow-sm">
              {cart.length}
            </span>
          )}
        </button>
      </header>

      <div className="p-4 bg-white border-b border-gray-100">
        <div className="flex space-x-2 max-w-4xl mx-auto">
          <div className="flex-1 relative">
            <input
              type="text"
              value={searchText}
              disabled={isLoading}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="PartNo/OEM/Reff No .."
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-900 focus:bg-white focus:border-transparent outline-none transition-all text-sm font-medium disabled:opacity-50"
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={isLoading}
            className={`px-6 py-3 text-white font-bold rounded-lg transition-all shadow-md text-sm whitespace-nowrap flex items-center space-x-2 ${
              isLoading ? 'bg-blue-300' : 'bg-blue-900 hover:bg-blue-950 active:scale-95 shadow-blue-900/10'
            }`}
          >
            {isLoading && (
              <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            )}
            <span>{isLoading ? 'SEARCHING' : 'SEARCH'}</span>
          </button>
        </div>
        {error && (
          <div className="mt-3 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-xs font-bold rounded-r-lg flex items-center space-x-2">
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        )}
      </div>

      <main className="flex-1 overflow-y-auto p-4 space-y-4">
        {isLoading ? (
          <div className="h-full flex flex-col items-center justify-center space-y-4">
            <div className="w-12 h-12 border-4 border-blue-900 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-blue-900 font-black text-xs uppercase tracking-widest animate-pulse">Contacting Enterprise Server...</p>
          </div>
        ) : !hasSearched ? (
          <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
            <svg className="w-16 h-16 mb-4 text-blue-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <p className="text-blue-900 font-bold uppercase tracking-widest text-sm">Enter a Part Number to start</p>
          </div>
        ) : results.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center px-10">
            <svg className="w-16 h-16 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 9.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-gray-500 font-bold uppercase tracking-widest text-sm opacity-50">No results found for your query</p>
          </div>
        ) : (
          results.map((item) => {
            const qty = quantities[item.id] || 0;
            const value = (qty * item.price).toFixed(2);
            
            return (
              <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-blue-100 overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="p-4 flex items-start space-x-4">
                  <img 
                    src={item.image} 
                    alt="product" 
                    onClick={() => handleItemDetails(item)}
                    className="w-20 h-20 rounded-xl bg-gray-50 border border-gray-100 object-contain flex-shrink-0 cursor-pointer" 
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://placehold.co/80x80/f3f4f6/9ca3af?text=load+error';
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-black text-gray-900 uppercase truncate">{item.brand}</h3>
                    <p 
                      onClick={() => handleItemDetails(item)}
                      className="text-blue-600 font-bold text-lg underline decoration-blue-200 mt-1 cursor-pointer"
                    >
                      {item.itemCode}
                    </p>
                    <div className="mt-1 flex items-center">
                       <span className={`text-white text-[9px] font-black px-2 py-1 rounded shadow-sm uppercase whitespace-nowrap ${
                         item.stock === 'Available' ? 'bg-green-600 shadow-green-200' : 'bg-red-500 shadow-red-200'
                       }`}>
                        {item.stock.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-3 flex-shrink-0">
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border whitespace-nowrap ${
                      item.status === 'Active' ? 'text-green-600 bg-green-50 border-green-100' : 'text-gray-500 bg-gray-50 border-gray-100'
                    }`}>
                      {item.status.toUpperCase()}
                    </span>
                    <button 
                      onClick={() => handleAddToCart(item)}
                      className="p-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 active:scale-90 transition-all shadow-md shadow-orange-500/20"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="px-4 pb-4">
                  <p className="text-xs text-gray-500 leading-relaxed font-medium">
                    {item.description}
                  </p>
                </div>

                <div className="bg-gray-50/50 p-4 border-t border-gray-100 grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div>
                      <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-0.5">Price</label>
                      <p className="text-sm font-black text-gray-900">{item.price.toFixed(2)} {item.currency}</p>
                    </div>
                    <div className="flex items-center space-x-1.5 flex-wrap gap-y-2">
                      <button 
                        onClick={() => handleOpenQuery(item)}
                        className="bg-blue-600 hover:bg-blue-700 text-white text-[9px] font-black px-2 py-1 rounded flex items-center space-x-1 shadow-sm transition-colors active:scale-95 whitespace-nowrap"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>QUERY</span>
                      </button>
                      <button 
                        onClick={() => handleOpenQtyPrice(item)}
                        className="bg-purple-600 hover:bg-purple-700 text-white text-[9px] font-black px-2 py-1 rounded flex items-center space-x-1 shadow-sm transition-colors active:scale-95 whitespace-nowrap"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                        <span>QTY PRICE</span>
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-3">
                    <div className="w-full max-w-[100px]">
                      <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-0.5 text-right">Quantity</label>
                      <input
                        type="number"
                        min="0"
                        value={qty === 0 ? '' : qty}
                        placeholder="0"
                        onChange={(e) => handleQtyChange(item.id, e.target.value)}
                        className="w-full px-3 py-1.5 text-sm font-black bg-white border border-gray-200 rounded-lg text-center focus:ring-2 focus:ring-blue-900 outline-none transition-all"
                      />
                    </div>
                    <div className="text-right">
                      <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-0.5">Value</label>
                      <p className="text-base font-black text-blue-900">{value} {item.currency}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </main>

      {/* Item Query Report Modal */}
      {isQueryModalOpen && selectedReport && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsQueryModalOpen(false)}></div>
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl z-10 flex flex-col overflow-hidden animate-in zoom-in duration-200 border border-blue-100">
            <header className="p-5 border-b border-gray-100 bg-blue-50/50 flex justify-between items-center">
              <h3 className="text-xs font-black text-blue-900 uppercase tracking-tight">
                {selectedReport.code} - Item Query Report
              </h3>
              <button onClick={() => setIsQueryModalOpen(false)} className="p-1.5 bg-white border border-gray-200 rounded-full text-gray-400 hover:text-gray-600 shadow-sm transition-all active:scale-90">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </header>

            <div className="p-6 space-y-5 overflow-y-auto">
              <div className="space-y-3">
                {[
                  { label: 'CODE', value: selectedReport.code },
                  { label: 'BRAND', value: selectedReport.brand },
                  { label: 'PACKING UNIT', value: selectedReport.brand === 'SACHS' ? '1' : selectedReport.packingUnit },
                  { label: 'MANUFACTURER', value: selectedReport.manufacturer },
                  { label: 'GROUP', value: selectedReport.group },
                  { label: 'SUBGROUP', value: selectedReport.subGroup },
                ].map((field, idx) => (
                  <div key={idx} className="flex border-b border-gray-50 pb-2 last:border-0">
                    <span className="w-1/3 text-[10px] font-black text-gray-400 uppercase tracking-widest">{field.label}</span>
                    <span className="flex-1 text-[11px] font-bold text-slate-800">{field.value}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-blue-900 text-white text-[9px] font-black uppercase tracking-widest">
                      <th className="px-3 py-2 border-r border-blue-800/50">Client Backorder</th>
                      <th className="px-3 py-2 border-r border-blue-800/50">Reserved</th>
                      <th className="px-3 py-2">Under Packing</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="bg-white text-blue-950 text-xs font-black">
                      <td className="px-3 py-3 border-r border-gray-100 text-center">{selectedReport.clientBackorder}</td>
                      <td className="px-3 py-3 border-r border-gray-100 text-center">{selectedReport.reserved}</td>
                      <td className="px-3 py-3 text-center">{selectedReport.underPacking}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end space-x-8 pt-2">
                <div className="text-right">
                  <span className="block text-[9px] font-black text-gray-400 uppercase tracking-widest">BAL QTY</span>
                  <span className="text-lg font-black text-blue-900">{selectedReport.balQty}</span>
                </div>
                <div className="text-right">
                  <span className="block text-[9px] font-black text-gray-400 uppercase tracking-widest">UNDER COUNTING</span>
                  <span className="text-lg font-black text-gray-200">-</span>
                </div>
              </div>
            </div>

            <footer className="p-6 bg-gray-50 border-t border-gray-100">
              <button 
                onClick={() => setIsQueryModalOpen(false)}
                className="w-full py-3 bg-blue-900 text-white font-black rounded-xl shadow-lg shadow-blue-900/10 active:scale-95 transition-all uppercase tracking-widest text-xs"
              >
                Close Report
              </button>
            </footer>
          </div>
        </div>
      )}

      {/* Qty Price Modal */}
      {isQtyPriceModalOpen && selectedQtyPriceItem && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsQtyPriceModalOpen(false)}></div>
          <div className="bg-white w-full max-sm rounded-3xl shadow-2xl z-10 flex flex-col overflow-hidden animate-in zoom-in duration-200 border border-purple-100">
            <header className="p-5 border-b border-gray-100 bg-purple-50/50 flex justify-between items-center">
              <div>
                <h3 className="text-sm font-black text-purple-900 uppercase tracking-tight">
                  Qty Price
                </h3>
                <p className="text-[10px] font-bold text-gray-400 uppercase mt-0.5">
                  {selectedQtyPriceItem.brand} - {selectedQtyPriceItem.itemNo}
                </p>
              </div>
              <button onClick={() => setIsQtyPriceModalOpen(false)} className="p-1.5 bg-white border border-gray-200 rounded-full text-gray-400 hover:text-gray-600 shadow-sm transition-all active:scale-90">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </header>

            <div className="p-0">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-100 text-[9px] font-black text-gray-500 uppercase tracking-widest border-b border-gray-200">
                    <th className="px-4 py-3 border-r border-gray-200">FromQty</th>
                    <th className="px-4 py-3 border-r border-gray-200">ToQty</th>
                    <th className="px-4 py-3">Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {DUMMY_QTY_PRICES.map((row, idx) => (
                    <tr key={idx} className="bg-white text-[11px] font-bold text-slate-800">
                      <td className="px-4 py-3 border-r border-gray-50">{row.fromQty}</td>
                      <td className="px-4 py-3 border-r border-gray-50">{row.toQty}</td>
                      <td className="px-4 py-3 text-purple-900 font-black">{row.price.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <footer className="p-6 bg-gray-50 border-t border-gray-100">
              <button 
                onClick={() => setIsQtyPriceModalOpen(false)}
                className="w-full py-3 bg-purple-900 text-white font-black rounded-xl shadow-lg shadow-purple-900/10 active:scale-95 transition-all uppercase tracking-widest text-xs"
              >
                Close
              </button>
            </footer>
          </div>
        </div>
      )}

      {/* Cart Modal Overlay */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-blue-900/40 backdrop-blur-sm" onClick={() => setIsCartOpen(false)}></div>
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl z-10 flex flex-col max-h-[85vh] overflow-hidden animate-in zoom-in duration-200">
            <header className="p-6 border-b border-gray-100 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-black text-blue-950">My Cart</h3>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">
                  {cart.length} Unique Item{cart.length !== 1 ? 's' : ''}
                </p>
              </div>
              <button onClick={() => setIsCartOpen(false)} className="p-2 bg-gray-100 rounded-full text-gray-400 hover:text-gray-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </header>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {cart.length === 0 ? (
                <div className="text-center py-10 opacity-30">
                  <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  <p className="text-sm font-bold uppercase tracking-widest">Cart is empty</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="flex space-x-4 border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                    <img src={item.image} className="w-12 h-12 rounded-lg bg-gray-50 object-cover" alt="" />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between">
                        <h4 className="text-xs font-black text-gray-900 uppercase truncate">{item.brand}</h4>
                        <span className="text-[11px] font-black text-blue-900">{(item.price * item.cartQty).toFixed(2)} {item.currency}</span>
                      </div>
                      <p className="text-[11px] font-bold text-blue-600">{item.itemCode}</p>
                      <p className="text-[10px] text-gray-400 mt-1">
                        Qty: {item.cartQty} × {item.price.toFixed(2)} {item.currency}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <footer className="p-6 bg-gray-50 border-t border-gray-100">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Grand Total</span>
                  <span className="text-2xl font-black text-blue-950">{calculateCartTotal()} €</span>
                </div>
                <button 
                  onClick={() => { alert('Proceeding to checkout...'); setIsCartOpen(false); }}
                  className="w-full py-4 bg-blue-900 text-white font-black rounded-2xl shadow-lg shadow-blue-900/20 active:scale-95 transition-all uppercase tracking-widest text-sm"
                >
                  Checkout Now
                </button>
              </footer>
            )}
          </div>
        </div>
      )}

      {/* Footer Summary */}
      {!isLoading && results.length > 0 && (
        <div className="bg-white border-t border-gray-100 p-3 px-6 text-[10px] font-black text-blue-900 uppercase tracking-[0.2em] text-center">
          Found {results.length} result(s)
        </div>
      )}
    </div>
  );
};

export default SearchScreen;
