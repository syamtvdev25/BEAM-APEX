
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import PageShell from '../PageShell';
import { OemSearchItem } from './EmployeeDashboard';
import { useAuth } from '../../App';
import { StatusBadge } from './BadgeComponents';
import { ProductThumb } from '../ProductThumb';
import { productImageUrl } from '../../utils/productImage';
import { fetchProductDetailExtra, ProductDetailExtra } from '../../api/productApi';

type TabType = 'criteria' | 'vehicle' | 'engine' | 'axle';

const ProductDetails: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { artNr } = useParams();
  const { user } = useAuth();
  
  const isEmployee = user?.userType === 'APEX';
  const itemData = location.state as OemSearchItem | undefined;

  // UI States
  const [activeTab, setActiveTab] = useState<TabType>('criteria');
  const [details, setDetails] = useState<ProductDetailExtra | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  
  // Visibility counts for "Show More"
  const [visibleVehicles, setVisibleVehicles] = useState(8);
  const [visibleEngines, setVisibleEngines] = useState(12);
  const [visibleAxles, setVisibleAxles] = useState(12);

  // Derived Values
  const imageName = itemData?.ImageName || (artNr ? `${artNr}.JPG` : '');
  const hasReplacement = !!(itemData?.Replaced && itemData.Replaced.trim().length > 0);
  const imageUrl = productImageUrl(imageName);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const data = await fetchProductDetailExtra(itemData?.Brand || '', artNr || '');
        setDetails(data);
      } catch (err) {
        console.error("Failed to load product details", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
    // Reset visible counts when artNr changes
    setVisibleVehicles(8);
    setVisibleEngines(12);
    setVisibleAxles(12);
  }, [artNr, itemData]);

  const handlePartLink = (newArtNr: string) => {
    navigate(`/product/${encodeURIComponent(newArtNr)}`, { 
      state: { ...itemData, ArtNr: newArtNr, ImageName: `${newArtNr}.JPG` } 
    });
  };

  return (
    <PageShell title="Product Information" onBack={() => navigate(-1)}>
      <div className="flex-1 bg-slate-50 overflow-y-auto scroll-smooth animate-in fade-in duration-500">
        <div className={`max-w-4xl mx-auto p-4 space-y-4 ${isEmployee ? 'pb-8' : 'pb-24'}`}>
          
          {/* A) IMAGE CARD (PREMIUM) */}
          <div className="relative bg-white rounded-[32px] p-4 shadow-xl shadow-blue-900/10 border border-white">
            <div className="w-full h-[230px] flex items-center justify-center bg-[#f8fafc] rounded-[24px] overflow-hidden border border-slate-100/50">
              <img 
                src={imageUrl} 
                alt={artNr} 
                className="max-w-[85%] max-h-[85%] object-contain drop-shadow-md"
                onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/400x400/f1f5f9/94a3b8?text=No+Image'; }}
              />
            </div>
            
            <button 
              onClick={() => setIsPreviewOpen(true)}
              className="absolute top-8 right-8 w-11 h-11 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-white flex items-center justify-center text-slate-400 active:scale-90 transition-all z-10"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
            </button>
          </div>

          {/* B) PRIMARY INFO CARD */}
          <div className="bg-white rounded-[28px] p-6 shadow-sm border border-slate-100 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-orange-500 uppercase tracking-[0.25em]">
                {itemData?.Brand || 'GENERIC'}
              </span>
              <StatusBadge status={itemData?.Status} hasHistory={hasReplacement} />
            </div>

            <div className="space-y-1">
              <h1 className="text-2xl font-black text-slate-900 tracking-tighter leading-none uppercase font-mono truncate">
                {artNr || itemData?.ArtNr}
              </h1>
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest truncate">
                {itemData?.Apex_Supp_Name || 'APEX GULF LOGISTICS'}
              </p>
            </div>

            {/* Replacements Links Section */}
            <div className="pt-4 border-t border-slate-50 grid grid-cols-2 gap-6">
               <div className="space-y-1">
                 <p className="text-[8px] font-black text-slate-300 uppercase tracking-[0.2em] leading-none mb-1">Replaces</p>
                 {details?.replaces ? (
                   <button 
                     onClick={() => handlePartLink(details.replaces!)}
                     className="text-[13px] font-black text-blue-600 uppercase tracking-tight hover:underline decoration-2 underline-offset-2"
                   >
                     {details.replaces}
                   </button>
                 ) : (
                   <p className="text-[13px] font-bold text-slate-200 uppercase tracking-tight">—</p>
                 )}
               </div>
               <div className="space-y-1 text-right border-l border-slate-50 pl-6">
                 <p className="text-[8px] font-black text-slate-300 uppercase tracking-[0.2em] leading-none mb-1">Replaced By</p>
                 {details?.replacedBy ? (
                   <button 
                     onClick={() => handlePartLink(details.replacedBy!)}
                     className="text-[13px] font-black text-blue-600 uppercase tracking-tight hover:underline decoration-2 underline-offset-2"
                   >
                     {details.replacedBy}
                   </button>
                 ) : (
                   <p className="text-[13px] font-bold text-slate-200 uppercase tracking-tight">—</p>
                 )}
               </div>
            </div>
            
            <p className="text-[13px] font-bold text-slate-500 leading-snug uppercase tracking-tight opacity-90 pt-1">
               {itemData?.Bez || 'Article description loading...'}
            </p>
          </div>

          {/* C) REPLACEMENT PANEL (COMPACT) */}
          {hasReplacement && (
            <div className="bg-slate-900 rounded-[24px] p-4 shadow-xl shadow-slate-900/10 animate-in slide-in-from-top-4 duration-500">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-blue-400 shrink-0 shadow-inner">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <h3 className="text-[11px] font-black text-white uppercase tracking-widest leading-tight truncate">Supersession Active</h3>
                  <p className="text-[8px] font-bold text-white/40 uppercase tracking-widest truncate">Multiple parts identified in chain</p>
                </div>
              </div>
              <button 
                onClick={() => navigate(`/replacement/${itemData?.ArtNr}`, { state: itemData })}
                className="w-full bg-blue-600 text-white py-3.5 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] active:scale-[0.97] transition-all shadow-lg shadow-blue-900/20"
              >
                View Replacement Chain
              </button>
            </div>
          )}

          {/* D) ICON TAB BAR (4-ICON SEGMENTED) */}
          <div className="bg-white rounded-[28px] shadow-sm border border-slate-100 overflow-hidden flex flex-col">
            <div className="flex border-b border-slate-100 bg-slate-50/30 p-1">
              {[
                { id: 'criteria', label: 'Criteria', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg> },
                { id: 'vehicle', label: 'Vehicle', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1" /></svg> },
                { id: 'engine', label: 'Engine', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg> },
                { id: 'axle', label: 'Axle', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg> },
              ].map((tab) => (
                <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`flex-1 py-4 px-1 rounded-[22px] transition-all duration-200 flex flex-col items-center justify-center space-y-1 active:scale-[0.96] ${activeTab === tab.id ? 'bg-white shadow-sm text-blue-900' : 'text-slate-300'}`}
                >
                  <div className={`transition-colors ${activeTab === tab.id ? 'text-blue-600 scale-110' : 'text-slate-300'}`}>{tab.icon}</div>
                  <span className={`text-[9px] font-black uppercase tracking-widest ${activeTab === tab.id ? 'text-blue-900 opacity-100' : 'text-slate-400 opacity-60'}`}>
                    {tab.label}
                  </span>
                </button>
              ))}
            </div>

            <div className="p-6 min-h-[300px]">
              {isLoading ? (
                <div className="py-24 flex flex-col items-center justify-center space-y-4 opacity-30">
                  <div className="w-10 h-10 border-[3.5px] border-blue-900 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-[10px] font-black uppercase tracking-[0.25em]">Loading technical data</span>
                </div>
              ) : (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-400">
                  
                  {/* TAB 1: CRITERIA */}
                  {activeTab === 'criteria' && (
                    <div className="space-y-1">
                      <div className="px-1 py-3 flex justify-between border-b border-slate-100 mb-2">
                         <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Parameter</span>
                         <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Value</span>
                      </div>
                      {details?.criteria.map((c, i) => (
                        <div key={i} className="flex justify-between items-center py-3.5 border-b border-slate-50/50 last:border-0 group">
                          <span className="text-[12px] font-bold text-slate-400 uppercase tracking-tight group-active:text-blue-600 transition-colors">{c.key}</span>
                          <span className="text-[12px] font-black text-slate-800 uppercase text-right tracking-tight">{c.value}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* TAB 2: VEHICLE LINKAGE */}
                  {activeTab === 'vehicle' && (
                    <div className="space-y-4">
                      <div className="flex gap-3 mb-2">
                        <div className="relative flex-1">
                          <select className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-[11px] font-black text-slate-700 outline-none appearance-none shadow-inner">
                            <option>ALL BRANDS</option>
                            <option>MERCEDES-BENZ</option>
                            <option>MAN</option>
                          </select>
                          <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7"/></svg>
                        </div>
                      </div>
                      <div className="space-y-2.5">
                        {details?.vehicleLinkage.slice(0, visibleVehicles).map((v, i) => (
                          <div key={i} className="flex items-center space-x-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm active:bg-slate-50 active:scale-[0.99] transition-all">
                            <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 shadow-inner shrink-0">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[9px] font-black text-blue-500 uppercase tracking-[0.15em] leading-none mb-1.5">{v.make}</p>
                              <p className="text-[12px] font-black text-slate-800 tracking-tight truncate">{v.model}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      {details && visibleVehicles < details.vehicleLinkage.length && (
                        <button 
                          onClick={() => setVisibleVehicles(prev => prev + 8)}
                          className="w-full py-4 mt-2 text-[10px] font-black text-blue-600 uppercase tracking-[0.25em] border-2 border-dashed border-slate-100 rounded-2xl active:bg-blue-50 transition-all"
                        >
                          View 8 More Vehicles
                        </button>
                      )}
                    </div>
                  )}

                  {/* TAB 3: ENGINE LINKAGES */}
                  {activeTab === 'engine' && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {details?.engineLinkages.slice(0, visibleEngines).map((e, i) => (
                          <div key={i} className="flex items-center space-x-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm active:scale-[0.98] transition-transform">
                            <div className="w-9 h-9 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600 shadow-inner shrink-0">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                            </div>
                            <p className="text-[12px] font-black text-slate-700 uppercase tracking-tight truncate leading-none">
                              {e.make} <span className="mx-1 text-slate-300">/</span> <span className="text-orange-600">{e.code}</span>
                            </p>
                          </div>
                        ))}
                      </div>
                      {details && visibleEngines < details.engineLinkages.length && (
                        <button 
                          onClick={() => setVisibleEngines(prev => prev + 12)}
                          className="w-full py-4 mt-2 text-[10px] font-black text-orange-600 uppercase tracking-[0.25em] border-2 border-dashed border-slate-100 rounded-2xl active:bg-orange-50 transition-all"
                        >
                          View 12 More Engines
                        </button>
                      )}
                    </div>
                  )}

                  {/* TAB 4: AXLE LINKAGES */}
                  {activeTab === 'axle' && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {details?.axleLinkages.slice(0, visibleAxles).map((a, i) => (
                          <div key={i} className="flex items-center space-x-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm active:scale-[0.98] transition-transform">
                            <div className="w-9 h-9 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 shadow-inner shrink-0">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                            </div>
                            <p className="text-[12px] font-black text-slate-700 uppercase tracking-tight truncate leading-none">
                              {a.make} <span className="mx-1 text-slate-300">/</span> <span className="text-emerald-600">{a.code}</span>
                            </p>
                          </div>
                        ))}
                      </div>
                      {details && visibleAxles < details.axleLinkages.length && (
                        <button 
                          onClick={() => setVisibleAxles(prev => prev + 12)}
                          className="w-full py-4 mt-2 text-[10px] font-black text-emerald-600 uppercase tracking-[0.25em] border-2 border-dashed border-slate-100 rounded-2xl active:bg-emerald-50 transition-all"
                        >
                          View 12 More Axles
                        </button>
                      )}
                    </div>
                  )}

                </div>
              )}
            </div>
          </div>

          {/* E) NOTES SECTION */}
          {!isLoading && details?.notes && details.notes.length > 0 && (
            <div className="bg-slate-900 rounded-[28px] p-6 shadow-2xl shadow-slate-900/20 border border-white/5">
              <h4 className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] mb-4 ml-1 flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
                Technical Compliance
              </h4>
              <div className="space-y-4">
                {details.notes.map((note, i) => (
                  <div key={i} className="flex items-start space-x-4 bg-white/5 p-4 rounded-[20px] border border-white/5">
                    <p className="text-[12px] font-bold text-white/80 leading-relaxed uppercase tracking-tight">
                      {note}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Full-Screen Image Preview Modal */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-[100] bg-slate-950/95 flex flex-col items-center justify-center p-6 animate-in fade-in duration-300">
           <button 
             onClick={() => setIsPreviewOpen(false)}
             className="absolute top-12 right-6 w-14 h-14 bg-white/10 rounded-full border border-white/20 flex items-center justify-center text-white active:scale-90 transition-all shadow-2xl backdrop-blur-md"
           >
             <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
             </svg>
           </button>
           
           <img 
             src={imageUrl} 
             alt="Full size preview" 
             className="max-w-full max-h-[75vh] object-contain shadow-[0_35px_60px_-15px_rgba(0,0,0,0.5)] animate-in zoom-in-95 duration-500"
             onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/800x800/222/999?text=No+Large+Image'; }}
           />
           
           <div className="mt-12 text-center space-y-2">
             <h4 className="text-white font-black uppercase text-lg tracking-[0.1em] font-mono">{artNr}</h4>
             <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.4em]">High-Resolution Reference</p>
           </div>
        </div>
      )}

      {/* Floating Action Buttons - ROLE BASED */}
      {!isEmployee && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-xl border-t border-slate-100 z-50 flex gap-4 pb-[calc(env(safe-area-inset-bottom, 0px) + 16px)] shadow-[0_-15px_30px_rgba(0,0,0,0.04)]">
          <button 
            disabled 
            className="flex-[2] py-4.5 bg-slate-100 text-slate-400 rounded-[24px] font-black uppercase text-[11px] tracking-[0.2em] cursor-not-allowed border border-slate-200"
          >
            Add to Cart
          </button>
          <button className="flex-1 p-4 bg-slate-50 text-slate-600 rounded-[24px] border border-slate-200 active:scale-90 transition-all shadow-sm flex items-center justify-center">
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
             </svg>
          </button>
        </div>
      )}
    </PageShell>
  );
};

export default ProductDetails;
