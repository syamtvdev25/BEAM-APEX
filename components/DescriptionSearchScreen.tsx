
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface DescriptionSearchRow {
  id: string;
  brand: string;
  partNo: string;
  status: "Normal";
  description: string;
  hasImage: boolean;
}

const DUMMY_DATA: DescriptionSearchRow[] = [
  { id: '1', brand: 'BF', partNo: '20180340700', status: 'Normal', description: 'Oil Jet, piston underside cooling', hasImage: true },
  { id: '2', brand: 'BorgWarner', partNo: '34265', status: 'Normal', description: 'Piston Ring', hasImage: false },
  { id: '3', brand: 'ELRING', partNo: '173.910', status: 'Normal', description: 'Shift Piston, multi-plate clutch (automatic transmission)', hasImage: true },
  { id: '4', brand: 'ELRING', partNo: '175.430', status: 'Normal', description: 'Piston, shift cylinder', hasImage: true },
  { id: '5', brand: 'MAHLE', partNo: '001 234', status: 'Normal', description: 'Piston Assembly, complete set', hasImage: true },
  { id: '6', brand: 'VICTOR REINZ', partNo: '12-345-67', status: 'Normal', description: 'Gasket Set, cylinder head cover', hasImage: false },
  { id: '7', brand: 'BOSCH', partNo: '0445 110', status: 'Normal', description: 'Injector nozzle, common rail system', hasImage: true },
  { id: '8', brand: 'FEBI', partNo: '10023', status: 'Normal', description: 'Timing Belt, reinforced', hasImage: true },
  { id: '9', brand: 'LEMFORDER', partNo: '23412', status: 'Normal', description: 'Control Arm, front axle left', hasImage: false },
  { id: '10', brand: 'SACHS', partNo: '316 699', status: 'Normal', description: 'Shock Absorber, cab suspension', hasImage: true },
];

const DescriptionSearchScreen: React.FC = () => {
  const navigate = useNavigate();
  
  // State for layout & UI
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  
  // State for search logic
  const [searchKey, setSearchKey] = useState('');
  const [filteredData, setFilteredData] = useState<DescriptionSearchRow[]>(DUMMY_DATA);
  const [hasSearched, setHasSearched] = useState(false);
  
  // State for selection
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isTablet = windowWidth >= 1024;

  const handleSearch = () => {
    const trimmedKey = searchKey.trim().toLowerCase();
    if (!trimmedKey) {
      alert('Please enter search text');
      return;
    }

    setHasSearched(true);
    const results = DUMMY_DATA.filter(item => 
      item.description.toLowerCase().includes(trimmedKey) || 
      item.partNo.toLowerCase().includes(trimmedKey)
    );
    setFilteredData(results);
    setSelectedIds(new Set()); // Reset selection on new search
  };

  const toggleSelection = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredData.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredData.map(d => d.id)));
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-blue-50 h-screen overflow-hidden">
      {/* Header */}
      <header className="px-6 py-4 border-b border-blue-100 flex items-center bg-white z-20 shadow-sm shrink-0">
        <button 
          onClick={() => navigate(-1)} 
          className="mr-4 p-2 -ml-2 rounded-full hover:bg-gray-100 text-blue-900 active:scale-90 transition-all"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h2 className="text-xl font-extrabold text-blue-950 uppercase">Description Search</h2>
      </header>

      {/* Simple Search Bar Section */}
      <div className="p-4 bg-white border-b border-gray-100">
        <div className="flex space-x-2 max-w-4xl mx-auto">
          <input
            type="text"
            value={searchKey}
            onChange={(e) => setSearchKey(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Enter description..."
            className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-900 focus:bg-white focus:border-transparent outline-none transition-all text-sm font-bold text-gray-800"
          />
          <button
            onClick={handleSearch}
            className="px-6 py-3 bg-blue-900 text-white font-black rounded-xl hover:bg-blue-950 active:scale-95 transition-all shadow-md shadow-blue-900/10 text-xs uppercase tracking-widest"
          >
            SEARCH
          </button>
        </div>
      </div>

      {/* Content Area */}
      <main className="flex-1 overflow-y-auto p-4 flex flex-col">
        
        {/* Results Section */}
        <section className="flex-1 min-w-0">
          <div className="bg-white rounded-2xl shadow-sm border border-blue-100 overflow-hidden h-full flex flex-col">
            <div className="bg-gray-50 px-5 py-3 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-[10px] font-black text-blue-900 uppercase tracking-widest">Available Items</h3>
              {isTablet && (
                <div className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    onChange={toggleSelectAll}
                    checked={filteredData.length > 0 && selectedIds.size === filteredData.length}
                    className="w-4 h-4 accent-blue-900 rounded cursor-pointer" 
                  />
                  <span className="text-[9px] font-black text-gray-400 uppercase">Select All</span>
                </div>
              )}
            </div>

            <div className="flex-1 overflow-y-auto">
              {filteredData.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 opacity-20 text-center px-6">
                  <p className="text-sm font-black uppercase tracking-widest">
                    {hasSearched ? 'No results found' : 'Enter a description to search'}
                  </p>
                </div>
              ) : isTablet ? (
                /* Tablet Table View */
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 text-[9px] font-black text-gray-500 uppercase tracking-widest border-b border-gray-100">
                      <th className="px-4 py-3 w-10"></th>
                      <th className="px-4 py-3 w-16">Img</th>
                      <th className="px-4 py-3">Brand</th>
                      <th className="px-4 py-3">Part No</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredData.map((item) => (
                      <tr key={item.id} className="hover:bg-blue-50/30 transition-colors">
                        <td className="px-4 py-4">
                          <input 
                            type="checkbox" 
                            checked={selectedIds.has(item.id)}
                            onChange={() => toggleSelection(item.id)}
                            className="w-4 h-4 accent-blue-900 rounded cursor-pointer"
                          />
                        </td>
                        <td className="px-4 py-4">
                          <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-100 overflow-hidden">
                            {item.hasImage ? (
                                <img src={`https://placehold.co/40x40/f3f4f6/9ca3af?text=${item.brand[0]}`} className="w-full h-full object-cover" alt=""/>
                            ) : (
                                <span className="text-[10px] font-black text-gray-200">N/A</span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-4 text-[11px] font-black text-gray-900 uppercase">{item.brand}</td>
                        <td className="px-4 py-4 text-[11px] font-bold text-blue-600 underline cursor-pointer">{item.partNo}</td>
                        <td className="px-4 py-4">
                           <span className="bg-green-50 text-green-600 text-[8px] font-black px-2 py-0.5 rounded-full border border-green-100 uppercase">
                            {item.status}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-[10px] font-bold text-gray-500 leading-relaxed">{item.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                /* Mobile Card View */
                <div className="divide-y divide-gray-100">
                  {filteredData.map((item) => (
                    <div key={item.id} className="p-4 flex space-x-4 bg-white active:bg-blue-50/50 transition-colors">
                      <div className="pt-1">
                         <input 
                            type="checkbox" 
                            checked={selectedIds.has(item.id)}
                            onChange={() => toggleSelection(item.id)}
                            className="w-5 h-5 accent-blue-900 rounded cursor-pointer"
                          />
                      </div>
                      <div className="w-16 h-16 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-100 overflow-hidden shrink-0">
                         {item.hasImage ? (
                            <img src={`https://placehold.co/60x60/f3f4f6/9ca3af?text=${item.brand[0]}`} className="w-full h-full object-cover" alt=""/>
                         ) : (
                            <span className="text-[10px] font-black text-gray-200 uppercase tracking-tighter text-center">No Image</span>
                         )}
                      </div>
                      <div className="flex-1 min-w-0">
                         <div className="flex justify-between items-start">
                           <div>
                              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{item.brand}</p>
                              <p className="text-sm font-black text-blue-900 mt-0.5 underline decoration-blue-200">{item.partNo}</p>
                           </div>
                           <span className="bg-green-50 text-green-600 text-[8px] font-black px-2 py-0.5 rounded-full border border-green-100 uppercase">
                            {item.status}
                          </span>
                         </div>
                         <p className="text-[11px] font-bold text-gray-500 mt-2 leading-tight">
                            {item.description}
                         </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <footer className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
              <p className="text-[10px] font-black text-blue-200 uppercase tracking-widest">
                {filteredData.length} items listed
              </p>
              {selectedIds.size > 0 && (
                <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest bg-blue-100 px-3 py-1 rounded-full">
                  {selectedIds.size} Selected
                </p>
              )}
            </footer>
          </div>
        </section>
      </main>
    </div>
  );
};

export default DescriptionSearchScreen;
