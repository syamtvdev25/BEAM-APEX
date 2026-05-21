import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Filter, Grid3X3, List, Loader2, RefreshCw, Search, Truck } from './Icons';
import { buildApiUrl } from '../config/api';

type ApiResponse<T> = {
  success: boolean;
  message?: string;
  data?: T;
};

type VehicleModel = {
  modelCode: string;
  model: string;
};

const PCModelsScreen: React.FC = () => {
  const navigate = useNavigate();
  const { manufacturer } = useParams<{ manufacturer: string }>();
  const mfCode = manufacturer || '';

  const [models, setModels] = useState<VehicleModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [keyword, setKeyword] = useState('');
  const [modelSearch, setModelSearch] = useState('');
  const [articleStatus, setArticleStatus] = useState('all');

  const modelSearchText = modelSearch.trim().toLowerCase();

  const filteredModels = models.filter((m) => {
    const modelName = String(m.model || '').toLowerCase();

    if (!modelSearchText) return true;

    return (
      modelName.startsWith(modelSearchText) ||
      modelName.includes(modelSearchText)
    );
  });

  async function loadModels() {
    if (!mfCode) {
      setMessage('Manufacturer code is missing');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const url = buildApiUrl('PCHandler.ashx', 'models', { mfCode });
      const res = await fetch(url, { method: 'GET', credentials: 'include' });
      const text = await res.text();

      let json: ApiResponse<VehicleModel[]>;
      try {
        json = JSON.parse(text);
      } catch {
        throw new Error(`Invalid API response: ${text.slice(0, 180)}`);
      }

      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Unable to load models');
      }

      setModels(json.data || []);
      setMessage(`${json.data?.length || 0} models found`);
    } catch (e: any) {
      setModels([]);
      setMessage(e.message || 'Unable to load models');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadModels();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mfCode]);

  function handleModelClick(model: VehicleModel) {
    navigate(`/pc-brands/${encodeURIComponent(mfCode)}/${encodeURIComponent(model.modelCode)}`, {
      state: {
        manufacturer: mfCode,
        modelCode: model.modelCode,
        modelName: model.model,
      },
    });
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-950 overflow-hidden">
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-slate-200 shadow-sm">
        <div className="h-16 px-4 flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="h-10 w-10 rounded-full flex items-center justify-center text-blue-950 hover:bg-slate-100 active:scale-95"
            aria-label="Back"
          >
            <ChevronLeft size={24} strokeWidth={2.7} />
          </button>

          <div className="flex-1 min-w-0">
            <h1 className="text-base font-black text-blue-950 leading-none">PC Search</h1>
            <p className="mt-1 text-[10px] font-black tracking-widest uppercase text-slate-400 truncate">
              Passenger Cars - {mfCode || 'Manufacturer'}
            </p>
          </div>

          <button
            onClick={() => setShowFilters((v) => !v)}
            className={`h-10 px-3 rounded-xl flex items-center gap-1.5 text-xs font-black active:scale-95 ${
              showFilters ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            <Filter size={15} />
            Filters
          </button>

          <button
            onClick={loadModels}
            className="h-10 w-10 rounded-xl flex items-center justify-center bg-slate-100 text-slate-600 active:scale-95"
            aria-label="Refresh"
          >
            <RefreshCw size={17} />
          </button>
        </div>
      </header>

      <main className="h-[calc(100vh-64px)] overflow-y-auto p-3 pb-24">
        {showFilters && (
          <section className="mb-3 rounded-2xl bg-white border border-slate-200 shadow-sm p-3">
            <div className="grid grid-cols-1 gap-3">
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Manufacturer</label>
                <input
                  value={mfCode}
                  readOnly
                  className="w-full h-10 rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-bold text-slate-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Search Model</label>
                <div className="relative">
                  <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder="Type model name..."
                    className="w-full h-10 rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-xs font-bold outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Article Status</label>
                <select
                  value={articleStatus}
                  onChange={(e) => setArticleStatus(e.target.value)}
                  className="w-full h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold outline-none"
                >
                  <option value="all">All</option>
                  <option value="active">Active</option>
                  <option value="discontinued">Discontinued</option>
                  <option value="upcoming">Upcoming</option>
                </select>
              </div>
            </div>
          </section>
        )}

        {/* Compact manufacturer chip */}
        <div className="flex items-center gap-2 mb-3 px-1">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Selected Manufacturer:</span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 border border-blue-100 rounded-full text-xs font-black text-blue-700 uppercase">
            {mfCode}
          </span>
        </div>

        <section className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-3 py-3 border-b border-slate-100 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <span className="h-8 w-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                <Truck size={17} />
              </span>
              <div className="min-w-0">
                <h2 className="text-sm font-black text-slate-950 uppercase leading-tight">Models</h2>
                <p className="text-[10px] font-bold text-slate-400 truncate">{filteredModels.length} listed</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {loading && <Loader2 size={17} className="animate-spin text-blue-600" />}
              <button
                onClick={() => setViewMode('grid')}
                className={`h-9 w-9 rounded-xl flex items-center justify-center ${viewMode === 'grid' ? 'bg-blue-50 text-blue-700' : 'bg-slate-50 text-slate-500'}`}
              >
                <Grid3X3 size={16} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`h-9 w-9 rounded-xl flex items-center justify-center ${viewMode === 'list' ? 'bg-blue-50 text-blue-700' : 'bg-slate-50 text-slate-500'}`}
              >
                <List size={16} />
              </button>
            </div>
          </div>

          <div className="px-3 pb-3">
            <p className="text-[10px] font-black text-red-600 mb-1">
              MODEL SEARCH VISIBLE
            </p>
            <input
              type="text"
              value={modelSearch}
              onChange={(e) => setModelSearch(e.target.value)}
              placeholder="Search models..."
              className="w-full h-10 rounded-xl border border-blue-200 bg-white px-3 text-xs font-bold text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {message && (
            <div className="mx-3 mt-3 rounded-xl border border-blue-100 bg-blue-50 px-3 py-2 text-[11px] font-bold text-blue-800">
              {message}
            </div>
          )}

          <div className="p-3">
            {!loading && filteredModels.length === 0 ? (
              <div className="py-16 text-center">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">No models found</p>
              </div>
            ) : (
              <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-2' : 'grid grid-cols-1 gap-2'}>
                {filteredModels.map((model) => (
                  <button
                    key={model.modelCode}
                    onClick={() => handleModelClick(model)}
                    className="group text-left rounded-xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-blue-300 hover:shadow-sm active:scale-[0.99] transition-all px-3 py-3"
                  >
                    <span className="block text-xs font-black text-slate-950 leading-snug group-hover:text-blue-800">
                      {model.model}
                    </span>
                    <span className="mt-1 block text-[9px] font-black uppercase tracking-widest text-slate-400">
                      Code: {model.modelCode}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default PCModelsScreen;
