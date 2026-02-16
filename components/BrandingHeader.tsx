
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { brandingConfig } from '../config/brandingConfig';

interface BrandingHeaderProps {
  title: string;
  onBack?: () => void;
  rightElement?: React.ReactNode;
}

const BrandingHeader: React.FC<BrandingHeaderProps> = ({ title, onBack, rightElement }) => {
  const navigate = useNavigate();

  return (
    <header 
      className="bg-gradient-to-r from-[#003366] to-[#00599F] px-4 flex items-center sticky top-0 z-50 shadow-xl rounded-b-[24px] shrink-0 pointer-events-auto"
      style={{ 
        paddingTop: 'calc(env(safe-area-inset-top, 0px) + 1rem)',
        paddingBottom: '1rem'
      }}
    >
      <button 
        onClick={onBack || (() => navigate(-1))} 
        className="mr-3 p-2 bg-white/10 border border-white/20 rounded-xl text-white active:scale-90 transition-all flex items-center justify-center shrink-0"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
      <div className="w-8 h-8 mr-3 bg-white rounded-lg p-1 shadow-sm shrink-0">
        <img 
          src={brandingConfig.logoPath} 
          alt={brandingConfig.appName}
          className="w-full h-full object-contain"
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
        />
      </div>

      <div className="flex flex-col min-w-0 flex-1">
        <h2 className="text-[10px] font-black text-white/70 tracking-widest uppercase leading-none mb-1">
          {brandingConfig.appName}
        </h2>
        <span className="text-[14px] font-black text-white uppercase tracking-tight leading-tight truncate">
          {title}
        </span>
      </div>

      {rightElement && (
        <div className="ml-2 shrink-0 flex items-center space-x-2">
          {rightElement}
        </div>
      )}
    </header>
  );
};

export default BrandingHeader;
