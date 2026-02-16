
import React from 'react';
import BrandingHeader from './BrandingHeader';

interface PageShellProps {
  title?: string;
  onBack?: () => void;
  actions?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  noScroll?: boolean;
  className?: string;
}

const PageShell: React.FC<PageShellProps> = ({
  title,
  onBack,
  actions,
  children,
  footer,
  noScroll = false,
  className = ""
}) => {
  return (
    <div 
      className={`h-[100dvh] w-screen flex flex-col overflow-hidden bg-slate-50 ${className}`}
      style={{ 
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        WebkitUserSelect: 'none'
      }}
    >
      {/* Header handled inside PageShell if title provided */}
      {title && (
        <BrandingHeader 
          title={title} 
          onBack={onBack} 
          rightElement={actions} 
        />
      )}

      {/* Main Content Area */}
      <main 
        className={`flex-1 flex flex-col min-h-0 ${noScroll ? 'overflow-hidden' : 'overflow-y-auto'}`}
        style={{ 
          WebkitOverflowScrolling: 'touch',
          overscrollBehaviorY: 'contain'
        }}
      >
        {children}
      </main>

      {/* Optional Footer (fixed at bottom of screen, safe-area aware) */}
      {footer && (
        <footer className="shrink-0 bg-white border-t border-slate-100 z-40">
          {footer}
        </footer>
      )}
    </div>
  );
};

export default PageShell;
