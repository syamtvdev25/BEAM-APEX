
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Manufacturer {
  id: string;
  name: string;
  logo: string;
}

interface FilterState {
  manufacturer: string;
  model: string;
  year: string;
  engine: string;
}

const MANUFACTURERS: Manufacturer[] = [
  { id: 'audi', name: 'Audi', logo: 'https://placehold.co/120x80/f3f4f6/9ca3af?text=Audi' },
  { id: 'bmw', name: 'BMW', logo: 'https://placehold.co/120x80/f3f4f6/9ca3af?text=BMW' },
  { id: 'mercedes', name: 'Mercedes-Benz', logo: 'https://placehold.co/120x80/f3f4f6/9ca3af?text=MB' },
  { id: 'vw', name: 'Volkswagen', logo: 'https://placehold.co/120x80/f3f4f6/9ca3af?text=VW' },
  { id: 'toyota', name: 'Toyota', logo: 'https://placehold.co/120x80/f3f4f6/9ca3af?text=Toyota' },
  { id: 'honda', name: 'Honda', logo: 'https://placehold.co/120x80/f3f4f6/9ca3af?text=Honda' },
  { id: 'ford', name: 'Ford', logo: 'https://placehold.co/120x80/f3f4f6/9ca3af?text=Ford' },
  { id: 'nissan', name: 'Nissan', logo: 'https://placehold.co/120x80/f3f4f6/9ca3af?text=Nissan' },
  { id: 'hyundai', name: 'Hyundai', logo: 'https://placehold.co/120x80/f3f4f6/9ca3af?text=Hyundai' },
  { id: 'kia', name: 'Kia', logo: 'https://placehold.co/120x80/f3f4f6/9ca3af?text=Kia' },
  { id: 'renault', name: 'Renault', logo: 'https://placehold.co/120x80/f3f4f6/9ca3af?text=Renault' },
  { id: 'peugeot', name: 'Peugeot', logo: 'https://placehold.co/120x80/f3f4f6/9ca3af?text=Peugeot' },
];

const PCScreen: React.FC = () => {
  const navigate = useNavigate();
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    manufacturer: '',
    model: '',
    year: '',
    engine: '',
  });

  const handleManufacturerSelect = (m: Manufacturer) => {
    navigate(`/pc-models/${m.id}`);
  };

  const handleFilterChange = (field: keyof FilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleSearch = () => {
    if (!filters.manufacturer) {
      alert('Please select a manufacturer');
      return;
    }
    // If user clicks search from dropdown, also navigate to models for that brand
    navigate(`/pc-models/${filters.manufacturer}`);
  };

  return (
    <div className="flex-1 flex flex-col bg-blue-50 h-screen overflow-hidden">
      {/* Sticky Header */}
      <header className="px-4 py-4 border-b border-blue-100 flex items-center bg-white z-20 shadow-sm shrink-0">
        <button 
          onClick={() => navigate(-1)} 
          className="mr-3 p-2 -ml-2 rounded-full hover:bg-gray-100 text-blue-900 active:scale-90 transition-all"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h2 className="text-xl font-extrabold text-blue-950">Passenger Cars</h2>
      </header>

      {/* Main Content (Scrollable) */}
      <main className="flex-1 overflow-y-auto p-4 space-y-4">
        
        {/* Collapsible Filter Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-blue-100 overflow-hidden transition-all duration-300">
          <button 
            onClick={() => setIsFilterExpanded(!isFilterExpanded)}
            className="w-full flex items-center justify-between px-5 py-4 bg-white hover:bg-gray-50 active:bg-gray-100 transition-colors"
          >
            <div className="flex items-center space-x-2">
              <span className="text-blue-900 font-black text-xs uppercase tracking-widest">Advanced Filters</span>
              {filters.manufacturer && (
                <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                  {MANUFACTURERS.find(m => m.id === filters.manufacturer)?.name}
                </span>
              )}
            </div>
            <svg 
              className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isFilterExpanded ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <div className={`transition-all duration-300 ease-in-out ${isFilterExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
            <div className="p-5 pt-0 space-y-4">
              <div className="grid grid-cols-1 gap-3">
                {/* Manufacturer Dropdown */}
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Manufacturer</label>
                  <select 
                    value={filters.manufacturer}
                    onChange={(e) => handleFilterChange('manufacturer', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-900 transition-all outline-none text-sm font-bold text-gray-800 appearance-none"
                  >
                    <option value="">Choose Manufacturer</option>
                    {MANUFACTURERS.map(m => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                  </select>
                </div>

                {/* Model Dropdown */}
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Model</label>
                  <select 
                    value={filters.model}
                    onChange={(e) => handleFilterChange('model', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-900 transition-all outline-none text-sm font-bold text-gray-800 appearance-none"
                  >
                    <option value="">Choose Model</option>
                    <option value="model_1">Example Model A</option>
                    <option value="model_2">Example Model B</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {/* Year Dropdown */}
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Year</label>
                    <select 
                      value={filters.year}
                      onChange={(e) => handleFilterChange('year', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-900 transition-all outline-none text-sm font-bold text-gray-800 appearance-none"
                    >
                      <option value="">Year</option>
                      <option value="2024">2024</option>
                      <option value="2023">2023</option>
                      <option value="2022">2022</option>
                    </select>
                  </div>
                  {/* Engine Dropdown */}
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Engine</label>
                    <select 
                      value={filters.engine}
                      onChange={(e) => handleFilterChange('engine', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-900 transition-all outline-none text-sm font-bold text-gray-800 appearance-none"
                    >
                      <option value="">Engine</option>
                      <option value="gas">Gasoline</option>
                      <option value="diesel">Diesel</option>
                      <option value="electric">Electric</option>
                    </select>
                  </div>
                </div>

                <button 
                  onClick={handleSearch}
                  className="w-full py-4 bg-blue-900 text-white font-black rounded-xl shadow-lg shadow-blue-900/10 active:scale-95 transition-all uppercase tracking-widest text-xs mt-2"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Manufacturer Selection Heading */}
        <div className="px-1">
          <h3 className="text-[10px] font-black text-blue-900/40 uppercase tracking-[0.2em]">Select Manufacturer</h3>
        </div>

        {/* Responsive Logo Grid */}
        <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {MANUFACTURERS.map((m) => {
            const isSelected = filters.manufacturer === m.id;
            return (
              <button
                key={m.id}
                onClick={() => handleManufacturerSelect(m)}
                className={`flex flex-col items-center justify-center bg-white rounded-2xl p-4 transition-all active:scale-95 shadow-sm border-2 ${
                  isSelected 
                    ? 'border-blue-900 bg-blue-50/50 shadow-md' 
                    : 'border-white hover:border-gray-100 hover:shadow-md'
                }`}
              >
                <div className="w-full aspect-video flex items-center justify-center mb-2">
                  <img 
                    src={m.logo} 
                    alt={m.name} 
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
                <span className={`text-[10px] font-black text-center uppercase tracking-tight leading-tight ${
                  isSelected ? 'text-blue-900' : 'text-gray-600'
                }`}>
                  {m.name}
                </span>
              </button>
            );
          })}
        </div>

        {/* Informational Footer */}
        <div className="pt-8 pb-4 text-center opacity-40">
          <p className="text-[10px] font-black text-blue-900 uppercase tracking-widest">
            {MANUFACTURERS.length} Manufacturers Available
          </p>
        </div>
      </main>
    </div>
  );
};

export default PCScreen;
