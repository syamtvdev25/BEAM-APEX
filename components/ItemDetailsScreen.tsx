
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PageShell from './PageShell';

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
    <PageShell title="Item Details" onBack={() => navigate(-1)}>
      <div className="p-4 space-y-4">
        {/* Top Summary Card */}
        <div className="bg-white rounded-[32px] shadow-sm border border-blue-50 p-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-6 sm:space-y-0 sm:space-x-8">
            <div className="w-32 h-32 rounded-3xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 overflow-hidden shadow-inner">
              <img 
                src={imageSrc} 
                alt="Item" 
                className="w-24 h-24 object-contain"
              />
            </div>
            <div className="flex-1 min-w-0 text-center sm:text-left">
              <h1 className="text-3xl font-black text-slate-900 uppercase truncate leading-none">
                {decodedBrand}
              </h1>
              <div className="mt-2 flex items-center justify-center sm:justify-start space-x-2">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Article:</span>
                <span className="text-sm font-black text-blue-900">{decodedItemCode}</span>
              </div>
              <div className="mt-2 flex items-center justify-center sm:justify-start space-x-2">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Status:</span>
                <span className="text-[10px] font-black text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-100">
                  NORMAL
                </span>
              </div>

              {/* Small info table inside card */}
              <div className="mt-6 border border-slate-50 rounded-2xl overflow-hidden text-[10px]">
                <div className="flex bg-slate-50/50 border-b border-slate-50">
                  <div className="w-1/3 p-3 font-black text-slate-400 uppercase text-left">Group</div>
                  <div className="flex-1 p-3 font-bold text-slate-800 text-left">Shock Absorber, driver cab suspension</div>
                </div>
                <div className="flex border-b border-slate-50">
                  <div className="w-1/3 p-3 font-black text-slate-400 uppercase text-left">Replaced</div>
                  <div className="flex-1 p-3 font-bold text-slate-800 text-left">—</div>
                </div>
                <div className="flex bg-slate-50/50">
                  <div className="w-1/3 p-3 font-black text-slate-400 uppercase text-left">Replaces</div>
                  <div className="flex-1 p-3 font-bold text-slate-800 text-left">313 954</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Linkages and Criteria Section */}
        <div className="bg-white rounded-[32px] shadow-sm border border-blue-50 overflow-hidden flex flex-col">
          <header className="bg-slate-900 px-6 py-4">
            <h3 className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Technical Data</h3>
          </header>
          
          {/* Tabs */}
          <div className="flex border-b border-slate-100 bg-slate-50/50">
            <button 
              onClick={() => setActiveTab('criteria')}
              className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest transition-all ${
                activeTab === 'criteria' 
                ? 'text-blue-900 bg-white border-b-2 border-blue-900 shadow-inner' 
                : 'text-slate-400'
              }`}
            >
              Criteria
            </button>
            <button 
              onClick={() => setActiveTab('engine')}
              className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest transition-all ${
                activeTab === 'engine' 
                ? 'text-blue-900 bg-white border-b-2 border-blue-900 shadow-inner' 
                : 'text-slate-400'
              }`}
            >
              Engines
            </button>
            <button 
              onClick={() => setActiveTab('axle')}
              className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest transition-all ${
                activeTab === 'axle' 
                ? 'text-blue-900 bg-white border-b-2 border-blue-900 shadow-inner' 
                : 'text-slate-400'
              }`}
            >
              Axles
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-0 min-h-[350px]">
            {activeTab === 'criteria' && (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                    <th className="px-6 py-4 w-2/3">Criteria</th>
                    <th className="px-6 py-4">Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {criteriaData.map((row, idx) => (
                    <tr key={idx} className="active:bg-blue-50/20 transition-colors">
                      <td className="px-6 py-4 text-[11px] font-bold text-slate-600">{row.param}</td>
                      <td className="px-6 py-4 text-[11px] font-black text-blue-900">{row.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {(activeTab === 'engine' || activeTab === 'axle') && (
              <div className="flex flex-col items-center justify-center py-24 opacity-20 px-8 text-center">
                <svg className="w-12 h-12 mb-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <p className="text-[10px] font-black uppercase tracking-[0.2em]">No technical linkings available</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="py-8 text-center">
          <p className="text-[8px] font-black text-slate-300 uppercase tracking-[0.4em]">APEX GULF SUPPLY CHAIN DATA</p>
        </div>
      </div>
    </PageShell>
  );
};

export default ItemDetailsScreen;
