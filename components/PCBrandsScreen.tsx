
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

interface BrandItem {
  id: string;
  name: string;
  shortCode: string;
  logo: string;
}

const DUMMY_BRANDS: BrandItem[] = [
  { id: 'bw', name: 'BorgWarner', shortCode: 'BW', logo: 'https://placehold.co/120x80/f3f4f6/9ca3af?text=BW' },
  { id: 'bwt', name: 'BorgWarner Turbo', shortCode: 'BWT', logo: 'https://placehold.co/120x80/f3f4f6/9ca3af?text=BWT' },
  { id: 'conti', name: 'Continental', shortCode: 'CON', logo: 'https://placehold.co/120x80/f3f4f6/9ca3af?text=CONTI' },
  { id: 'elr', name: 'Elring', shortCode: 'ELR', logo: 'https://placehold.co/120x80/f3f4f6/9ca3af?text=ELR' },
  { id: 'fte', name: 'FTE', shortCode: 'FTE', logo: 'https://placehold.co/120x80/f3f4f6/9ca3af?text=FTE' },
  { id: 'ks', name: 'Kolbenschmidt', shortCode: 'KS', logo: 'https://placehold.co/120x80/f3f4f6/9ca3af?text=KS' },
  { id: 'lf', name: 'Lemförder', shortCode: 'LF', logo: 'https://placehold.co/120x80/f3f4f6/9ca3af?text=LF' },
  { id: 'pg', name: 'Pierburg', shortCode: 'PG', logo: 'https://placehold.co/120x80/f3f4f6/9ca3af?text=PG' },
  { id: 'stb', name: 'Stabilus', shortCode: 'STB', logo: 'https://placehold.co/120x80/f3f4f6/9ca3af?text=STB' },
  { id: 'trw', name: 'TRW', shortCode: 'TRW', logo: 'https://placehold.co/120x80/f3f4f6/9ca3af?text=TRW' },
  { id: 'wahler', name: 'Wahler', shortCode: 'Wahler', logo: 'https://placehold.co/120x80/f3f4f6/9ca3af?text=WAHLER' },
  { id: 'zf', name: 'ZF', shortCode: 'ZF', logo: 'https://placehold.co/120x80/f3f4f6/9ca3af?text=ZF' },
];

const PCBrandsScreen: React.FC = () => {
  const navigate = useNavigate();
  const { manufacturer, model } = useParams<{ manufacturer: string; model: string }>();
  const decodedModel = decodeURIComponent(model || '');

  const [isExpanded, setIsExpanded] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Responsive column logic
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getGridCols = () => {
    if (windowWidth >= 1024) return 'grid-cols-4';
    if (windowWidth >= 768) return 'grid-cols-3';
    return 'grid-cols-2';
  };

  const handleBrandSelect = (brand: BrandItem) => {
    alert(`Selected brand: ${brand.name}`);
  };

  const toggleFilters = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="flex-1 flex flex-col bg-blue-50 h-screen overflow-hidden">
      {/* Header */}
      <header className="px-6 py-4 border-b border-blue-100 flex items-center bg-white z-10 shadow-sm shrink-0">
        <button 
          onClick={() => navigate(-1)} 
          className="mr-4 p-2 -ml-2 rounded-full hover:bg-gray-100 text-blue-900 active:scale-90 transition-all"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h2 className="text-xl font-extrabold text-blue-950 uppercase truncate">PC - {manufacturer}</h2>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 flex flex-col space-y-4">
        
        {/* Collapsible PC Search Panel */}
        <div className="bg-white rounded-2xl shadow-sm border border-blue-100 overflow-hidden shrink-0">
          <button 
            onClick={toggleFilters}
            className="w-full bg-blue-900 px-5 py-3 flex items-center justify-between active:bg-blue-950 transition-colors"
          >
            <h3 className="text-[10px] font-black text-white uppercase tracking-widest">PC Search</h3>
            <svg 
              className={`w-4 h-4 text-white transition-transform duration-300 ${isExpanded ? 'rotate-180' : 'rotate-0'}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <div 
            className={`transition-all duration-300 ease-in-out overflow-hidden ${
              isExpanded ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Manufacturer</label>
                <input 
                  type="text" 
                  readOnly 
                  value={(manufacturer || '').toUpperCase()}
                  className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl text-sm font-bold text-gray-400 cursor-not-allowed outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Model</label>
                <input 
                  type="text" 
                  readOnly 
                  value={decodedModel}
                  className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl text-sm font-bold text-gray-400 cursor-not-allowed outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Brand</label>
                <select className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-900 transition-all outline-none text-sm font-bold text-gray-800 appearance-none">
                  <option value="">All Brands</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Article Status</label>
                <select className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-900 transition-all outline-none text-sm font-bold text-gray-800 appearance-none">
                  <option value="All">All</option>
                  <option value="Normal">Normal</option>
                </select>
              </div>

              <button className="w-full py-4 bg-blue-900 text-white font-black rounded-xl shadow-lg shadow-blue-900/10 active:scale-95 transition-all uppercase tracking-widest text-xs mt-2">
                SEARCH
              </button>
            </div>
          </div>
        </div>

        {/* Model Identifier Label */}
        <div className="px-1">
          <p className="text-[10px] font-black text-blue-900/40 uppercase tracking-[0.1em]">Brand Selection for: {decodedModel}</p>
        </div>

        {/* Brand Tiles Grid */}
        <div className={`grid ${getGridCols()} gap-3`}>
          {DUMMY_BRANDS.map((brand) => (
            <button
              key={brand.id}
              onClick={() => handleBrandSelect(brand)}
              className="flex flex-col items-center justify-center bg-white rounded-2xl p-4 transition-all active:scale-95 shadow-sm border border-transparent hover:border-blue-100 hover:shadow-md"
            >
              <div className="w-full aspect-video flex items-center justify-center mb-2 bg-gray-50 rounded-xl overflow-hidden p-2">
                <img 
                  src={brand.logo} 
                  alt={brand.name} 
                  className="max-w-full max-h-full object-contain"
                />
              </div>
              <span className="text-[10px] font-black text-blue-900 text-center uppercase tracking-tight leading-tight">
                {brand.shortCode}
              </span>
              <span className="text-[8px] font-bold text-gray-400 text-center uppercase mt-1">
                {brand.name}
              </span>
            </button>
          ))}
        </div>

        {/* Informational Footer */}
        <div className="pt-8 pb-4 text-center opacity-40">
          <p className="text-[10px] font-black text-blue-900 uppercase tracking-widest">
            {DUMMY_BRANDS.length} Brands Available
          </p>
        </div>
      </main>
    </div>
  );
};

export default PCBrandsScreen;
