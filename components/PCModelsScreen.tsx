
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

interface ModelItem {
  id: string;
  name: string;
}

const DUMMY_MODELS: ModelItem[] = [
  { id: '1', name: '260 (P262, P264)' },
  { id: '2', name: '260 Kombi (P245)' },
  { id: '3', name: '740 (744)' },
  { id: '4', name: '740 Kombi (745)' },
  { id: '5', name: '760 (704, 764)' },
  { id: '6', name: '760 Kombi (704, 765)' },
  { id: '7', name: '780 (782)' },
  { id: '8', name: '850 (854)' },
  { id: '9', name: '850 Kombi (855)' },
  { id: '10', name: '940 (944)' },
  { id: '11', name: '940 Kombi (945)' },
  { id: '12', name: '940 II (944)' },
  { id: '13', name: '940 II Kombi (945)' },
  { id: '14', name: '960 (964)' },
  { id: '15', name: '960 Kombi (965)' },
  { id: '16', name: '960 II (964)' },
  { id: '17', name: '960 II Kombi (965)' },
  { id: '18', name: 'C30 (533)' },
  { id: '19', name: 'C70 I Cabriolet (873)' },
  { id: '20', name: 'C70 I Coupe (872)' },
  { id: '21', name: 'S40 I (644)' },
  { id: '22', name: 'V40 Cross Country (526)' },
  { id: '23', name: 'XC90 I (275)' },
];

const PCModelsScreen: React.FC = () => {
  const navigate = useNavigate();
  const { manufacturer } = useParams<{ manufacturer: string }>();
  
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState({
    manufacturer: (manufacturer || '').toUpperCase(),
    model: '',
    brand: '',
    status: 'All'
  });

  const handleModelClick = (modelName: string) => {
    navigate(`/pc-brands/${manufacturer}/${encodeURIComponent(modelName)}`);
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
        <h2 className="text-xl font-extrabold text-blue-950 uppercase">PC - {manufacturer}</h2>
      </header>

      {/* Responsive Content Area */}
      <main className="flex-1 overflow-y-auto p-4 flex flex-col lg:flex-row lg:space-x-4 space-y-4 lg:space-y-0">
        
        {/* Left Panel: PC Search Filters (Collapsible) */}
        <aside className="lg:w-80 w-full shrink-0">
          <div className="bg-white rounded-2xl shadow-sm border border-blue-100 overflow-hidden transition-all duration-300 ease-in-out">
            {/* Clickable Header Bar */}
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

            {/* Collapsible Content */}
            <div 
              className={`transition-all duration-300 ease-in-out overflow-hidden ${
                isExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="p-5 space-y-4">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Manufacturer</label>
                  <input 
                    type="text" 
                    readOnly 
                    value={filters.manufacturer}
                    className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl text-sm font-bold text-gray-400 cursor-not-allowed outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Models</label>
                  <select className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-900 transition-all outline-none text-sm font-bold text-gray-800 appearance-none">
                    <option value="">Choose Model</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Brand</label>
                  <select className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-900 transition-all outline-none text-sm font-bold text-gray-800 appearance-none">
                    <option value="">Choose Brand</option>
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
        </aside>

        {/* Right Panel: Models List Grid */}
        <section className="flex-1">
          <div className="bg-white rounded-2xl shadow-sm border border-blue-100 overflow-hidden h-full flex flex-col">
             <div className="bg-gray-50 px-5 py-3 border-b border-gray-100">
              <h3 className="text-[10px] font-black text-blue-900 uppercase tracking-widest">Available Models</h3>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-0">
                {DUMMY_MODELS.map((model) => (
                  <button
                    key={model.id}
                    onClick={() => handleModelClick(model.name)}
                    className="group flex flex-col text-left px-3 py-4 border-b border-gray-100 hover:bg-blue-50/50 transition-colors"
                  >
                    <span className="text-blue-600 text-[11px] font-bold underline group-hover:text-blue-800 transition-colors">
                      {model.name}
                    </span>
                  </button>
                ))}
              </div>
              
              {/* Optional messaging if empty */}
              {DUMMY_MODELS.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 opacity-20">
                   <p className="text-sm font-black uppercase tracking-widest">No models found</p>
                </div>
              )}
            </div>
            
            <footer className="p-4 bg-gray-50 border-t border-gray-100 text-center">
               <p className="text-[10px] font-black text-blue-200 uppercase tracking-widest">{DUMMY_MODELS.length} items listed</p>
            </footer>
          </div>
        </section>

      </main>
    </div>
  );
};

export default PCModelsScreen;
