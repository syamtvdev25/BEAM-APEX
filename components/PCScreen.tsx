import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Search, RefreshCw, Car, Grid3X3, List, PackageSearch, FileSpreadsheet, Wrench, Loader2, SlidersHorizontal } from './Icons';
import { FILE_BASE, buildApiUrl } from '../config/api';

type ApiResponse<T> = {
  success: boolean;
  message?: string;
  data?: T;
};

type Manufacturer = {
  mfCode: string;
  mfName: string;
  imageName?: string;
  imageUrl?: string;
};

type VehicleModel = {
  modelCode: string;
  model: string;
};

type Brand = {
  brandCode: string;
  brand: string;
  imageUrl?: string;
};

type ItemRow = {
  artNr: string;
  brand: string;
  description: string;
  [key: string]: any;
};

type FilterState = {
  manufacturer: string;
  model: string;
  brand: string;
  articleStatus: string;
};

async function apiGet<T>(action: string, params: Record<string, string | number | undefined> = {}): Promise<T> {
  const url = buildApiUrl('PCHandler.ashx', action, params);
  const res = await fetch(url, { method: 'GET', credentials: 'include' });
  const text = await res.text();
  let json: ApiResponse<T>;
  try {
    json = JSON.parse(text);
  } catch {
    throw new Error(`Invalid API response from ${action}: ${text.slice(0, 180)}`);
  }
  if (!res.ok || !json.success) throw new Error(json.message || `API failed: ${action}`);
  return (json.data || ([] as T)) as T;
}

function makeManufacturerImage(m: Manufacturer) {
  if (m.imageUrl) return m.imageUrl;
  if (m.imageName) return `${FILE_BASE}/assets/img/Manuf/${m.imageName}`;
  return '';
}

function makeBrandImage(b: Brand) {
  if (b.imageUrl) return b.imageUrl;
  if (b.brandCode) return `${FILE_BASE}/assets/img/Manuf/${b.brandCode}.jpg`;
  return '';
}

const PCScreen: React.FC = () => {
  const navigate = useNavigate();
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
  const [manufacturerSearch, setManufacturerSearch] = useState('');
  const [models, setModels] = useState<VehicleModel[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [items, setItems] = useState<ItemRow[]>([]);
  const [productRows, setProductRows] = useState<Record<string, any>[]>([]);
  const [activeView, setActiveView] = useState<'manufacturers' | 'models' | 'brands' | 'items' | 'products'>('manufacturers');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterState>({ manufacturer: 'NA', model: 'NA', brand: 'NA', articleStatus: 'all' });

  const filteredManufacturers = useMemo(() => {
    const q = manufacturerSearch.trim().toLowerCase();
    if (!q) return manufacturers;
    return manufacturers.filter((m) =>
      (m.mfName || '').toLowerCase().startsWith(q)
    );
  }, [manufacturers, manufacturerSearch]);

  const selectedManufacturerName = useMemo(
    () => manufacturers.find((x) => x.mfCode === filters.manufacturer)?.mfName || '',
    [manufacturers, filters.manufacturer]
  );

  async function loadInit() {
    setLoading(true);
    setMessage('');
    try {
      const data = await apiGet<{ manufacturers: Manufacturer[]; tiles: Manufacturer[] }>('init');
      setManufacturers(data.tiles || []);
      setActiveView('manufacturers');
    } catch (e: any) {
      setMessage(e.message || 'Unable to load manufacturers');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadInit();
  }, []);

  async function selectManufacturer(mfCode: string) {
    setLoading(true);
    setMessage('');
    setFilters((p) => ({ ...p, manufacturer: mfCode, model: 'NA', brand: 'NA' }));
    setBrands([]);
    setItems([]);
    setProductRows([]);
    try {
      const data = await apiGet<VehicleModel[]>('models', { mfCode });
      setModels(data || []);
      setActiveView('models');
    } catch (e: any) {
      setMessage(e.message || 'Unable to load models');
    } finally {
      setLoading(false);
    }
  }

  async function selectModel(modelCode: string) {
    if (!filters.manufacturer || filters.manufacturer === 'NA') return;
    setLoading(true);
    setMessage('');
    setFilters((p) => ({ ...p, model: modelCode, brand: 'NA' }));
    setItems([]);
    setProductRows([]);
    try {
      const data = await apiGet<Brand[]>('brands', { mfCode: filters.manufacturer, modelCode });
      setBrands(data || []);
      setActiveView('brands');
    } catch (e: any) {
      setMessage(e.message || 'Unable to load brands');
    } finally {
      setLoading(false);
    }
  }

  async function searchItems(brandCode?: string) {
    const mfCode = filters.manufacturer;
    const modelCode = filters.model;
    const finalBrand = brandCode || filters.brand;
    if (!mfCode || mfCode === 'NA') return setMessage('Please select manufacturer');
    if (!modelCode || modelCode === 'NA') return setMessage('Please select model');
    if (!finalBrand || finalBrand === 'NA') return setMessage('Please select brand');

    setLoading(true);
    setMessage('');
    setFilters((p) => ({ ...p, brand: finalBrand }));
    try {
      const data = await apiGet<ItemRow[]>('search', {
        mfCode,
        modelCode,
        brandCode: finalBrand,
        fitFor: 'PKW',
        articleStatus: filters.articleStatus,
      });
      setItems(data || []);
      setActiveView('items');
      setMessage(`${data?.length || 0} items found`);
    } catch (e: any) {
      setMessage(e.message || 'Search failed');
    } finally {
      setLoading(false);
    }
  }

  async function loadProductDetails(type: 'productdetails' | 'oemdetails') {
    if (!items.length) return setMessage('Please search items first');
    setLoading(true);
    setMessage('');
    try {
      const url = buildApiUrl('PCHandler.ashx', type);
      const res = await fetch(url, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rows: items, brand: items[0]?.brand || filters.brand }),
      });
      const json: ApiResponse<Record<string, any>[]> = await res.json();
      if (!json.success) throw new Error(json.message || 'Request failed');
      setProductRows(json.data || []);
      setActiveView('products');
      setMessage(`${json.data?.length || 0} ${type === 'oemdetails' ? 'OEM' : 'product'} rows found`);
    } catch (e: any) {
      setMessage(e.message || 'Unable to load details');
    } finally {
      setLoading(false);
    }
  }

  const productColumns = useMemo(() => {
    if (!productRows.length) return [];
    return Object.keys(productRows[0]);
  }, [productRows]);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-sm">
        <div className="h-14 px-3 flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-slate-100 text-blue-900">
            <ChevronLeft size={22} strokeWidth={2.6} />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-base font-black text-blue-950 leading-tight">PC Search</h1>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 truncate">
              Passenger Cars {selectedManufacturerName ? `• ${selectedManufacturerName}` : ''}
            </p>
          </div>
          <div className="flex items-center gap-1.5">
            <button 
              onClick={() => setShowFilters(!showFilters)} 
              className={`h-9 px-3 rounded-xl flex items-center gap-1.5 text-xs font-black transition-all active:scale-95 ${showFilters ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
              title="Toggle Filters"
            >
              <SlidersHorizontal size={14} />
              <span>Filters</span>
            </button>
            <button onClick={loadInit} className="p-2 h-9 w-9 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 active:scale-95 flex items-center justify-center">
              <RefreshCw size={16} />
            </button>
          </div>
        </div>
      </header>

      <main className="p-3 lg:p-4 max-w-7xl mx-auto w-full">
        {/* Filters Sidebar / Slide-over Drawer */}
        {showFilters && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <div 
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
              onClick={() => setShowFilters(false)}
            />
            <div className="relative w-80 max-w-full bg-white h-full shadow-2xl p-5 flex flex-col z-10 animate-in slide-in-from-right duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal size={16} className="text-blue-700" />
                  <h3 className="font-extrabold text-slate-800 uppercase text-xs tracking-wider">Search Filters</h3>
                </div>
                <button 
                  onClick={() => setShowFilters(false)}
                  className="p-1 px-2 rounded-lg hover:bg-slate-100 text-slate-500 text-sm font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-4 pr-1">
                <div>
                  <label className="block text-[11px] font-bold mb-1 text-slate-500 uppercase tracking-widest">Manufacturer</label>
                  <select 
                    value={filters.manufacturer} 
                    onChange={(e) => selectManufacturer(e.target.value)} 
                    className="w-full h-10 rounded-lg border border-slate-300 px-3 text-xs bg-white focus:border-blue-500 outline-none"
                  >
                    <option value="NA">---Select---</option>
                    {manufacturers.map((m) => (
                      <option key={m.mfCode} value={m.mfCode}>{m.mfName}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold mb-1 text-slate-500 uppercase tracking-widest">Models</label>
                  <select 
                    value={filters.model} 
                    onChange={(e) => selectModel(e.target.value)} 
                    className="w-full h-10 rounded-lg border border-slate-300 px-3 text-xs bg-white focus:border-blue-500 outline-none" 
                    disabled={!models.length}
                  >
                    <option value="NA">---Select---</option>
                    {models.map((m) => (
                      <option key={m.modelCode} value={m.modelCode}>{m.model}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold mb-1 text-slate-500 uppercase tracking-widest">Brand</label>
                  <select 
                    value={filters.brand} 
                    onChange={(e) => setFilters((p) => ({ ...p, brand: e.target.value }))} 
                    className="w-full h-10 rounded-lg border border-slate-300 px-3 text-xs bg-white focus:border-blue-500 outline-none" 
                    disabled={!brands.length}
                  >
                    <option value="NA">---Select---</option>
                    {brands.map((b) => (
                      <option key={b.brandCode} value={b.brandCode}>{b.brand}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold mb-1 text-slate-500 uppercase tracking-widest">Article Status</label>
                  <select 
                    value={filters.articleStatus} 
                    onChange={(e) => setFilters((p) => ({ ...p, articleStatus: e.target.value }))} 
                    className="w-full h-10 rounded-lg border border-slate-300 px-3 text-xs bg-white focus:border-blue-500 outline-none"
                  >
                    <option value="all">All</option>
                    <option value="active">Active</option>
                    <option value="discontinued">Discontinued</option>
                    <option value="upcoming">Upcoming</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 mt-4 space-y-2">
                <button 
                  onClick={() => {
                    searchItems();
                    setShowFilters(false);
                  }} 
                  className="w-full h-11 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black flex items-center justify-center gap-2 active:scale-[0.98] transition-all shadow-md shadow-blue-500/20"
                >
                  <Search size={15} /> Apply & Search
                </button>
                <button 
                  onClick={() => {
                    setFilters({ manufacturer: 'NA', model: 'NA', brand: 'NA', articleStatus: 'all' });
                    setModels([]);
                    setBrands([]);
                    setActiveView('manufacturers');
                    setShowFilters(false);
                  }}
                  className="w-full h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold active:scale-[0.98] transition-all"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          </div>
        )}

        <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-3 min-h-[70vh]">
          {/* Wizard Breadcrumbs for intuitive quick backtracking */}
          {(filters.manufacturer !== 'NA' || filters.model !== 'NA' || filters.brand !== 'NA') && (
            <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-bold text-slate-500 bg-slate-50 p-2.5 rounded-lg mb-3">
              <span className="text-blue-700 uppercase cursor-pointer hover:underline" onClick={() => { setActiveView('manufacturers'); setFilters(p => ({ ...p, model: 'NA', brand: 'NA' })); }}>
                {selectedManufacturerName || 'Manufacturers'}
              </span>
              {filters.model !== 'NA' && (
                <>
                  <span className="text-slate-300">/</span>
                  <span className="text-blue-700 uppercase cursor-pointer hover:underline" onClick={() => { setActiveView('models'); setFilters(p => ({ ...p, brand: 'NA' })); }}>
                    {models.find(m => m.modelCode === filters.model)?.model || 'Model'}
                  </span>
                </>
              )}
              {filters.brand !== 'NA' && (
                <>
                  <span className="text-slate-300">/</span>
                  <span className="text-blue-700 uppercase cursor-pointer hover:underline" onClick={() => { setActiveView('brands'); }}>
                    {brands.find(b => b.brandCode === filters.brand)?.brand || 'Brand'}
                  </span>
                </>
              )}
            </div>
          )}

          <div className="flex items-center justify-between gap-2 mb-3 border-b border-slate-100 pb-2">
            <div className="flex items-center gap-2">
              <Car size={18} className="text-blue-700" />
              <h2 className="text-sm font-black text-slate-800 uppercase tracking-wide">
                {activeView === 'manufacturers' && 'Manufacturers'}
                {activeView === 'models' && 'Models'}
                {activeView === 'brands' && 'Brands'}
                {activeView === 'items' && 'Vehicle Model Items'}
                {activeView === 'products' && 'Product / OEM Details'}
              </h2>
            </div>
            <div className="flex items-center gap-2">
              {loading && <Loader2 size={16} className="animate-spin text-blue-600" />}
              <button onClick={() => setViewMode('grid')} className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-50 text-blue-700' : 'bg-slate-50 text-slate-500'}`}><Grid3X3 size={16} /></button>
              <button onClick={() => setViewMode('list')} className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-50 text-blue-700' : 'bg-slate-50 text-slate-500'}`}><List size={16} /></button>
            </div>
          </div>

          {message && <div className="mb-3 rounded-lg bg-blue-50 border border-blue-100 px-3 py-2 text-xs font-bold text-blue-800">{message}</div>}

          {activeView === 'manufacturers' && (
            <div className="space-y-3">
              <div className="relative max-w-xs">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={manufacturerSearch}
                  onChange={(e) => setManufacturerSearch(e.target.value)}
                  placeholder="Search manufacturer..."
                  className="w-full h-9 pl-9 pr-3 text-xs font-bold rounded-xl border border-slate-200 outline-none focus:border-blue-500 bg-slate-50 focus:bg-white transition-all"
                />
              </div>

              <div className={viewMode === 'grid' ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-8 gap-2' : 'grid grid-cols-1 gap-2'}>
                {filteredManufacturers.map((m) => (
                  <button key={m.mfCode} onClick={() => selectManufacturer(m.mfCode)} className="h-28 rounded-lg border border-slate-200 bg-white hover:border-blue-300 hover:shadow-sm active:scale-[0.99] flex flex-col items-center justify-center p-2">
                    {makeManufacturerImage(m) ? <img src={makeManufacturerImage(m)} alt={m.mfName} className="h-14 max-w-[90px] object-contain mb-2" /> : <Car className="h-10 w-10 text-slate-300 mb-2" />}
                    <span className="text-[11px] font-black text-center uppercase">{m.mfName}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeView === 'models' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2">
              {models.map((m) => (
                <button key={m.modelCode} onClick={() => selectModel(m.modelCode)} className="text-left rounded-lg border border-slate-200 hover:border-blue-300 p-3 text-xs font-bold bg-slate-50 hover:bg-white transition-colors">
                  {m.model}
                </button>
              ))}
            </div>
          )}

          {activeView === 'brands' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-8 gap-2">
              {brands.map((b) => (
                <button key={b.brandCode} onClick={() => searchItems(b.brandCode)} className="h-28 rounded-lg border border-slate-200 bg-white hover:border-blue-300 hover:shadow-sm active:scale-[0.99] flex flex-col items-center justify-center p-2">
                  {makeBrandImage(b) ? <img src={makeBrandImage(b)} alt={b.brand} className="h-14 max-w-[110px] object-contain mb-2" onError={(e) => ((e.currentTarget.style.display = 'none'))} /> : null}
                  <span className="text-[11px] font-black text-center uppercase">{b.brand}</span>
                </button>
              ))}
            </div>
          )}

          {activeView === 'items' && (
            <>
              <div className="flex flex-wrap gap-2 mb-3">
                <button onClick={() => loadProductDetails('productdetails')} className="h-9 px-3 rounded bg-slate-800 text-white text-xs font-bold flex items-center gap-2"><PackageSearch size={15} /> Get Product Details</button>
                <button onClick={() => loadProductDetails('oemdetails')} className="h-9 px-3 rounded bg-slate-800 text-white text-xs font-bold flex items-center gap-2"><Wrench size={15} /> Get OEM Details</button>
                <button onClick={() => window.print()} className="h-9 px-3 rounded bg-emerald-600 text-white text-xs font-bold flex items-center gap-2"><FileSpreadsheet size={15} /> Export / Print</button>
              </div>
              <div className="overflow-auto border rounded-lg">
                <table className="min-w-full text-xs">
                  <thead className="bg-slate-100 sticky top-0">
                    <tr><th className="text-left p-2 border-b">Part No</th><th className="text-left p-2 border-b">Brand</th><th className="text-left p-2 border-b">Description</th></tr>
                  </thead>
                  <tbody>
                    {items.map((r, i) => <tr key={`${r.artNr}-${i}`} className="odd:bg-white even:bg-slate-50"><td className="p-2 border-b font-bold">{r.artNr}</td><td className="p-2 border-b">{r.brand}</td><td className="p-2 border-b">{r.description}</td></tr>)}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {activeView === 'products' && (
            <div className="overflow-auto border rounded-lg">
              <table className="min-w-full text-xs">
                <thead className="bg-slate-100 sticky top-0"><tr>{productColumns.map((c) => <th key={c} className="text-left p-2 border-b whitespace-nowrap">{c}</th>)}</tr></thead>
                <tbody>{productRows.map((r, i) => <tr key={i} className="odd:bg-white even:bg-slate-50">{productColumns.map((c) => <td key={c} className="p-2 border-b whitespace-nowrap">{String(r[c] ?? '')}</td>)}</tr>)}</tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default PCScreen;
