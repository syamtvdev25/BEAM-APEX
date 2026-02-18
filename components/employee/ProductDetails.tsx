
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import PageShell from '../PageShell';
import { OemSearchItem } from './EmployeeDashboard';
import { useAuth } from '../../App';
import { StatusBadge } from './BadgeComponents';
import { ProductThumb } from '../ProductThumb';
import { productImageUrl } from '../../utils/productImage';
import { fetchProductDetails, ProductDetailData } from '../../api/productApi';

type TabType = 'oe' | 'criteria' | 'notes';

const ProductDetails: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { artNr } = useParams();
  const { user } = useAuth();
  
  const isEmployee = user?.userType === 'APEX';
  const itemData = location.state as OemSearchItem | undefined;

  // UI States
  const [activeTab, setActiveTab] = useState<TabType>('oe');
  const [details, setDetails] = useState<ProductDetailData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Derived Values
  const imageName = itemData?.ImageName || (artNr ? `${artNr}.JPG` : '');
  const hasReplacement = !!(itemData?.Replaced && itemData.Replaced.trim().length > 0);
  const imageUrl = productImageUrl(imageName);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchProductDetails(itemData?.Brand || '', artNr || '');
        setDetails(data);
      } catch (err) {
        console.error("Failed to load product details", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [artNr, itemData]);

  return (
    <PageShell title="Product Information" onBack={() => navigate(-1)}>
      <div className="flex-1 bg-slate-50 overflow-y-auto scroll-smooth animate-in fade-in duration-500">
        <div className={`max-w-4xl mx-auto p-4 space-y-3 ${isEmployee ? 'pb-8' : 'pb-24'}`}>
          
          {/* A) IMAGE CARD (PREMIUM) */}
          <div className="relative bg-white rounded-[28px] p-3 shadow-xl shadow-blue-900/5 border border-white">
            <div className="w-full h-[230px] flex items-center justify-center bg-slate-50 rounded-[20px] overflow-hidden">
              <img 
                src={imageUrl} 
                alt={artNr} 
                className="max-w-[90%] max-h-[90%] object-contain"
                onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/400x400/f1f5f9/94a3b8?text=No+Image'; }}
              />
            </div>
            
            {/* Expand Icon */}
            <button 
              onClick={() => setIsPreviewOpen(true)}
              className="absolute top-6 right-6 w-10 h-10 bg-white/80 backdrop-blur-md rounded-xl shadow-lg border border-white flex items-center justify-center text-slate-400 active:scale-90 transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
            </button>
          </div>

          {/* B) PRIMARY INFO CARD */}
          <div className="bg-white rounded-[24px] p-5 shadow-sm border border-slate-100 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-orange-500 uppercase tracking-[0.2em]">
                {itemData?.Brand || 'GENERIC'}
              </span>
              <StatusBadge status={itemData?.Status} hasHistory={hasReplacement} />
            </div>

            <div className="space-y-1">
              <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none uppercase font-mono truncate">
                {artNr || itemData?.ArtNr}
              </h1>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-tight truncate">
                {itemData?.Apex_Supp_Name || 'APEX GULF LOGISTICS'}
              </p>
            </div>
            
            <p className="text-[12px] font-bold text-slate-500 leading-snug uppercase tracking-tight opacity-80 pt-1">
               {itemData?.Bez || 'Article description loading...'}
            </p>
          </div>

          {/* C) REPLACEMENT PANEL (COMPACT) */}
          {hasReplacement && (
            <div className="bg-blue-900 rounded-[22px] p-4 shadow-xl shadow-blue-900/20 animate-in slide-in-from-top-4 duration-500">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center text-white shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <h3 className="text-[11px] font-black text-white uppercase tracking-tight leading-tight truncate">Replacement Available</h3>
                  <p className="text-[8px] font-bold text-white/50 uppercase tracking-wide truncate">Part has multiple supersessions</p>
                </div>
              </div>
              <button 
                onClick={() => navigate(`/replacement/${itemData?.ArtNr}`, { state: itemData })}
                className="w-full bg-white text-blue-900 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest active:scale-[0.98] transition-all shadow-lg"
              >
                View Replacement Chain
              </button>
            </div>
          )}

          {/* D) TABS SECTION (Rich Catalog Data) */}
          <div className="bg-white rounded-[24px] shadow-sm border border-slate-100 overflow-hidden flex flex-col">
            <div className="flex border-b border-slate-100 bg-slate-50/50">
              <button 
                onClick={() => setActiveTab('oe')}
                className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'oe' ? 'text-blue-900 bg-white border-b-2 border-blue-900' : 'text-slate-400'}`}
              >
                OE Numbers
              </button>
              <button 
                onClick={() => setActiveTab('criteria')}
                className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'criteria' ? 'text-blue-900 bg-white border-b-2 border-blue-900' : 'text-slate-400'}`}
              >
                Criteria
              </button>
              <button 
                onClick={() => setActiveTab('notes')}
                className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'notes' ? 'text-blue-900 bg-white border-b-2 border-blue-900' : 'text-slate-400'}`}
              >
                Notes
              </button>
            </div>

            <div className="p-4 min-h-[250px]">
              {isLoading ? (
                <div className="py-20 flex flex-col items-center justify-center space-y-3 opacity-30">
                  <div className="w-8 h-8 border-3 border-blue-900 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-[10px] font-black uppercase">Loading catalog data...</span>
                </div>
              ) : (
                <div className="animate-in fade-in duration-300">
                  {activeTab === 'oe' && (
                    <div className="divide-y divide-slate-50">
                      {details?.oeNumbers.map((oe, i) => (
                        <div key={i} className="py-3 flex justify-between items-center group active:bg-slate-50 transition-colors px-2 rounded-xl">
                          <span className="text-[12px] font-black text-slate-800 font-mono tracking-tight">{oe.oe}</span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{oe.ref}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeTab === 'criteria' && (
                    <div className="space-y-2">
                      {details?.criteria.map((c, i) => (
                        <div key={i} className="flex justify-between items-center bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">{c.key}</span>
                          <span className="text-[11px] font-black text-slate-800 uppercase text-right">{c.value}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeTab === 'notes' && (
                    <div className="space-y-4 px-2">
                      {details?.notes.map((note, i) => (
                        <div key={i} className="flex items-start space-x-3">
                          <div className="w-1.5 h-1.5 bg-blue-900 rounded-full mt-1.5 shrink-0" />
                          <p className="text-[11px] font-bold text-slate-600 leading-relaxed uppercase tracking-tight">
                            {note}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Full-Screen Image Preview Modal */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center p-6 animate-in fade-in duration-300">
           <button 
             onClick={() => setIsPreviewOpen(false)}
             className="absolute top-12 right-6 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white active:scale-90 transition-all"
           >
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
             </svg>
           </button>
           
           <img 
             src={imageUrl} 
             alt="Full size preview" 
             className="max-w-full max-h-[80vh] object-contain shadow-2xl"
             onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/800x800/222/999?text=No+Large+Image'; }}
           />
           
           <div className="mt-8 text-center space-y-1">
             <h4 className="text-white font-black uppercase text-sm tracking-widest">{artNr}</h4>
             <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">High-Resolution Reference Image</p>
           </div>
        </div>
      )}

      {/* Floating Action Buttons - ROLE BASED */}
      {!isEmployee && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-md border-t border-slate-100 z-50 flex gap-3 pb-[calc(env(safe-area-inset-bottom, 0px) + 12px)] shadow-[0_-10px_20px_rgba(0,0,0,0.02)]">
          <button 
            disabled 
            className="flex-[2] py-4 bg-slate-200 text-slate-400 rounded-2xl font-black uppercase text-xs tracking-widest cursor-not-allowed"
          >
            Add to Cart
          </button>
          <button className="flex-1 p-4 bg-slate-50 text-slate-500 rounded-2xl border border-slate-100 active:scale-90 transition-all shadow-sm flex items-center justify-center">
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
             </svg>
          </button>
        </div>
      )}
    </PageShell>
  );
};

export default ProductDetails;
