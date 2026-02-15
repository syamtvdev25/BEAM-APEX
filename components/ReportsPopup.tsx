
import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { ItemVariant } from './ItemQueryScreen';

interface ReportItem {
  key: string;
  title: string;
}

const REPORTS_MASTER: ReportItem[] = [
  { key: "item_query_report", title: "Item Query Report." },
  { key: "product_details", title: "Product Details" },
  { key: "supplier_back_order", title: "Supplier Back Order" },
  { key: "goods_in_transit", title: "Goods In Transit" },
  { key: "client_backorder_query", title: "Client BackOrder - Query" },
  { key: "reserve_qty_query", title: "Reserve Qty - Query" },
  { key: "under_packing_query", title: "Under Packing - Query" },
  { key: "sales_history", title: "Sales History" },
  { key: "product_wise_ref_details", title: "Product Wise Reference Details" },
  { key: "country_wise_pricing_sales", title: "Country wise Pricing Sales" },
  { key: "ag_quantity", title: "AG Quantity" },
  { key: "unapproved_pick_list_cso", title: "UnApproved Pick List-CSO" },
  { key: "qty_pricing_report_sales", title: "Qty Pricing Report-Sales" },
  { key: "stock_movement_item_query_sales", title: "Stock Movement Item Query - Sales" },
  { key: "oc_cancelled_item_query", title: "OC Cancelled -Item Query" },
];

const PAGE_SIZE = 5;

interface ReportRowProps {
  title: string;
  onPress: () => void;
}

const ReportRow: React.FC<ReportRowProps> = ({ title, onPress }) => (
  <button
    onClick={onPress}
    className="w-full flex items-center p-4 bg-white border border-slate-100 rounded-[24px] shadow-sm hover:shadow-md active:scale-[0.98] transition-all text-left mb-3 group"
  >
    <div className="w-10 h-10 bg-blue-50 flex items-center justify-center rounded-xl group-hover:bg-blue-900 transition-colors duration-300 shrink-0">
      <svg
        className="w-5 h-5 text-blue-600 group-hover:text-white transition-colors duration-300"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2.5"
          d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    </div>

    <span className="flex-1 ml-4 text-sm font-bold text-slate-800 tracking-tight leading-tight">
      {title}
    </span>

    <div className="text-slate-300 group-hover:text-blue-900 transition-colors duration-300 shrink-0">
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" />
      </svg>
    </div>
  </button>
);

const ReportsPopup: React.FC<{ selectedVariant?: ItemVariant }> = ({ selectedVariant }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleReports, setVisibleReports] = useState<ReportItem[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [activeReportKey, setActiveReportKey] = useState<string | null>(null);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const loadingRef = useRef(false);
  const hasMoreRef = useRef(true);
  const pageRef = useRef(1);

  const allFilteredItems = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return REPORTS_MASTER;
    return REPORTS_MASTER.filter((r) => r.title.toLowerCase().includes(q));
  }, [searchQuery]);

  const maxPages = useMemo(() => {
    return Math.max(1, Math.ceil(allFilteredItems.length / PAGE_SIZE));
  }, [allFilteredItems.length]);

  const syncHasMore = (val: boolean) => {
    hasMoreRef.current = val;
    setHasMore(val);
  };

  const loadPage = useCallback(
    (pageNum: number, replace: boolean) => {
      if (loadingRef.current) return;
      if (!replace && !hasMoreRef.current) return;
      if (pageNum > maxPages) {
        syncHasMore(false);
        return;
      }

      loadingRef.current = true;
      setIsLoadingMore(true);

      window.setTimeout(() => {
        const start = (pageNum - 1) * PAGE_SIZE;
        const end = pageNum * PAGE_SIZE;

        const batch = allFilteredItems.slice(start, end);

        if (batch.length === 0) {
          syncHasMore(false);
          loadingRef.current = false;
          setIsLoadingMore(false);
          return;
        }

        if (replace) {
          setVisibleReports(batch);
        } else {
          setVisibleReports((prev) => {
            const set = new Set(prev.map((x) => x.key));
            const merged = [...prev, ...batch.filter((x) => !set.has(x.key))];
            return merged;
          });
        }

        const reachedEnd = end >= allFilteredItems.length;
        syncHasMore(!reachedEnd);

        loadingRef.current = false;
        setIsLoadingMore(false);
      }, 450);
    },
    [allFilteredItems, maxPages]
  );

  useEffect(() => {
    pageRef.current = 1;
    syncHasMore(true);
    loadPage(1, true);
  }, [searchQuery, loadPage]);

  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const el = e.currentTarget;
      const nearBottom = el.scrollHeight - el.scrollTop <= el.clientHeight + 80;

      if (!nearBottom) return;
      if (loadingRef.current) return;
      if (!hasMoreRef.current) return;

      const nextPage = pageRef.current + 1;
      if (nextPage > maxPages) {
        syncHasMore(false);
        return;
      }

      pageRef.current = nextPage;
      loadPage(nextPage, false);
    },
    [loadPage, maxPages]
  );

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    if (loadingRef.current) return;
    if (!hasMoreRef.current) return;

    if (visibleReports.length >= allFilteredItems.length) {
      syncHasMore(false);
      return;
    }

    const notScrollableYet = el.scrollHeight <= el.clientHeight + 5;
    if (!notScrollableYet) return;

    const nextPage = pageRef.current + 1;
    if (nextPage > maxPages) {
      syncHasMore(false);
      return;
    }

    pageRef.current = nextPage;
    loadPage(nextPage, false);
  }, [visibleReports, allFilteredItems.length, maxPages, loadPage]);

  const activeReport = useMemo(() => {
    return REPORTS_MASTER.find((r) => r.key === activeReportKey) || null;
  }, [activeReportKey]);

  return (
    <div className="flex flex-col h-full max-h-[600px] animate-in fade-in duration-500">
      <div className="px-1 mb-5">
        <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] mb-3 ml-1">
          Reports
        </h5>

        <div className="relative group">
          <input
            type="text"
            placeholder="Search analytical summaries..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none transition-all shadow-sm group-hover:shadow-md"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="3"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
      </div>

      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto pr-1 scroll-smooth"
      >
        <div className="pb-4">
          {visibleReports.length > 0 ? (
            visibleReports.map((report) => (
              <ReportRow key={report.key} title={report.title} onPress={() => setActiveReportKey(report.key)} />
            ))
          ) : !isLoadingMore ? (
            <div className="py-20 flex flex-col items-center justify-center opacity-30 text-center">
              <svg className="w-12 h-12 mb-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
              <p className="text-sm font-black uppercase tracking-widest text-slate-900">No reports found</p>
            </div>
          ) : null}

          <div className="py-6 flex flex-col items-center justify-center space-y-2">
            {isLoadingMore && (
              <div className="flex items-center space-x-3 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-50">
                <div className="w-4 h-4 border-2 border-blue-900 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Loading more...</span>
              </div>
            )}

            {!hasMore && visibleReports.length > 0 && (
              <div className="text-center opacity-40">
                <div className="w-12 h-0.5 bg-slate-200 mx-auto mb-2 rounded-full"></div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">End of reports</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {activeReportKey && activeReport && (
        <div className="fixed inset-0 z-[100] flex flex-col bg-slate-50 animate-in slide-in-from-bottom duration-300 ease-out">
          <header className="px-6 py-5 bg-white border-b border-slate-100 flex items-center justify-between shadow-sm sticky top-0">
            <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight truncate pr-4">
              {activeReport.title}
            </h2>
            <button
              onClick={() => setActiveReportKey(null)}
              className="p-2.5 bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200 active:scale-90 transition-all shadow-sm border border-white"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </header>

          <main className="flex-1 p-8 flex flex-col items-center justify-center text-center">
            <h3 className="text-xl font-black text-slate-900 mb-3 tracking-tight">Report Intelligence</h3>
            <p className="text-sm font-medium text-slate-400 max-w-xs leading-relaxed mb-8">
              Data context for <span className="text-blue-600 font-bold">{selectedVariant?.partNo || 'Unknown Item'}</span>. 
              Popup content for <span className="text-blue-600 font-bold">{activeReport.key}</span> will be designed later.
            </p>
            <button
              onClick={() => setActiveReportKey(null)}
              className="px-10 py-4 bg-blue-900 text-white font-black rounded-2xl shadow-xl shadow-blue-900/20 active:scale-95 transition-all uppercase tracking-widest text-[11px]"
            >
              Back
            </button>
          </main>
        </div>
      )}
    </div>
  );
};

export default ReportsPopup;
