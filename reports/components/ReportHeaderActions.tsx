
import React from 'react';

interface ReportHeaderActionsProps {
  onExcel: () => void;
  onPdf: () => void;
  isExporting?: boolean;
}

const ReportHeaderActions: React.FC<ReportHeaderActionsProps> = ({ onExcel, onPdf, isExporting }) => {
  return (
    <div className="flex items-center space-x-2">
      <button 
        onClick={onExcel}
        disabled={isExporting}
        className="w-10 h-10 bg-white/20 border border-white/20 rounded-xl flex items-center justify-center text-white active:scale-90 transition-all backdrop-blur-md hover:bg-green-500 disabled:opacity-50"
        title="Excel"
      >
        {isExporting ? (
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        ) : (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
        )}
      </button>
      <button 
        onClick={onPdf}
        disabled={isExporting}
        className="w-10 h-10 bg-white/20 border border-white/20 rounded-xl flex items-center justify-center text-white active:scale-90 transition-all backdrop-blur-md hover:bg-red-500 disabled:opacity-50"
        title="PDF"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
        </svg>
      </button>
    </div>
  );
};

export default ReportHeaderActions;
