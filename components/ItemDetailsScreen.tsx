
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const ItemDetailsScreen: React.FC = () => {
  const navigate = useNavigate();
  const { itemCode, brand, imageType } = useParams<{ 
    itemCode: string; 
    brand: string; 
    imageType: 'no_image' | 'product' 
  }>();

  const [activeTab, setActiveTab] = useState<'criteria' | 'engine' | 'axle'>('criteria');

  const decodedItemCode = decodeURIComponent(itemCode || '');
  const decodedBrand = decodeURIComponent(brand || '');
  
  const imageSrc = imageType === 'no_image' 
    ? 'https://placehold.co/120x120/f3f4f6/9ca3af?text=no+image'
    : 'https://placehold.co/120x120/f3f4f6/9ca3af?text=product';

  const criteriaData = [
    { param: 'Parameter', value: 'MSE27/13X36A2' },
    { param: 'Shock Absorber Mounting Type', value: '1' },
    { param: 'Shock Absorber Mounting Type', value: '2' },
    { param: 'Shock Absorber System', value: '2' },
    { param: 'Shock Absorber Type', value: '2' },
  ];

  return (
    <div className="flex-1 flex flex-col bg-blue-50 h-screen overflow-hidden">
      {/* Header */}
      <header className="px-6 py-4 border-b border-blue-100 flex items-center bg-white z-10 shadow-sm">
        <button 
          onClick={() => navigate(-1)} 
          className="mr-4 p-2 -ml-2 rounded-full hover:bg-gray-100 text-blue-900 active:scale-90 transition-all"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h2 className="text-xl font-extrabold text-blue-950">Item Details</h2>
      </header>

      <main className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Top Summary Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-blue-100 p-4">
          <div className="flex items-start space-x-5">
            <img 
              src={imageSrc} 
              alt="Item" 
              className="w-28 h-28 rounded-xl bg-gray-50 border border-gray-100 object-cover flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-black text-gray-900 uppercase truncate leading-tight">
                {decodedBrand}
              </h1>
              <div className="mt-1 flex items-center space-x-2">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Article:</span>
                <span className="text-sm font-black text-blue-900">{decodedItemCode}</span>
              </div>
              <div className="mt-1 flex items-center space-x-2">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Status:</span>
                <span className="text-[10px] font-black text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-100">
                  NORMAL
                </span>
              </div>

              {/* Small info table inside card */}
              <div className="mt-4 border border-gray-100 rounded-xl overflow-hidden text-[10px]">
                <div className="flex bg-gray-50 border-b border-gray-100">
                  <div className="w-1/3 p-2 font-black text-gray-400 uppercase">Group</div>
                  <div className="flex-1 p-2 font-bold text-slate-800">Shock Absorber, driver cab suspension</div>
                </div>
                <div className="flex border-b border-gray-100">
                  <div className="w-1/3 p-2 font-black text-gray-400 uppercase">Replaced</div>
                  <div className="flex-1 p-2 font-bold text-slate-800">-</div>
                </div>
                <div className="flex bg-gray-50 border-b border-gray-100">
                  <div className="w-1/3 p-2 font-black text-gray-400 uppercase">Replaces</div>
                  <div className="flex-1 p-2 font-bold text-slate-800">313 954</div>
                </div>
                <div className="flex">
                  <div className="w-1/3 p-2 font-black text-gray-400 uppercase">Unit</div>
                  <div className="flex-1 p-2 font-bold text-slate-800">1</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Linkages and Criteria Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-blue-100 overflow-hidden flex flex-col">
          <header className="bg-blue-900 px-4 py-3">
            <h3 className="text-xs font-black text-white uppercase tracking-widest">Linkages and Criteria</h3>
          </header>
          
          {/* Tabs */}
          <div className="flex border-b border-gray-100 bg-gray-50/50">
            <button 
              onClick={() => setActiveTab('criteria')}
              className={`flex-1 py-3 text-[10px] font-black uppercase tracking-tighter transition-all ${
                activeTab === 'criteria' 
                ? 'text-blue-900 border-b-2 border-blue-900 bg-white' 
                : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              Criteria
            </button>
            <button 
              onClick={() => setActiveTab('engine')}
              className={`flex-1 py-3 text-[10px] font-black uppercase tracking-tighter transition-all ${
                activeTab === 'engine' 
                ? 'text-blue-900 border-b-2 border-blue-900 bg-white' 
                : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              Engine Linkages
            </button>
            <button 
              onClick={() => setActiveTab('axle')}
              className={`flex-1 py-3 text-[10px] font-black uppercase tracking-tighter transition-all ${
                activeTab === 'axle' 
                ? 'text-blue-900 border-b-2 border-blue-900 bg-white' 
                : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              Axle Linkages
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-0 min-h-[300px]">
            {activeTab === 'criteria' && (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-[9px] font-black text-gray-500 uppercase tracking-widest border-b border-gray-100">
                    <th className="px-4 py-3 w-2/3">Criteria</th>
                    <th className="px-4 py-3">Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {criteriaData.map((row, idx) => (
                    <tr key={idx} className="hover:bg-blue-50/20 transition-colors">
                      <td className="px-4 py-3 text-[11px] font-bold text-gray-700">{row.param}</td>
                      <td className="px-4 py-3 text-[11px] font-black text-blue-900">{row.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {(activeTab === 'engine' || activeTab === 'axle') && (
              <div className="flex flex-col items-center justify-center h-full py-20 opacity-30">
                <p className="text-xs font-black uppercase tracking-widest text-blue-900">No data (dummy)</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Simple Footer spacing */}
      <div className="h-6 bg-transparent" />
    </div>
  );
};

export default ItemDetailsScreen;
