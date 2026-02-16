
import React from 'react';

interface PageLayoutProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

/**
 * PageLayout ensures every screen respects iOS/Android safe areas 
 * and provides a consistent root flex container.
 */
const PageLayout: React.FC<PageLayoutProps> = ({ children, className = "", id }) => {
  return (
    <div 
      id={id}
      className={`h-screen w-screen overflow-hidden flex flex-col bg-slate-50 ${className}`}
      style={{ 
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        WebkitUserSelect: 'none'
      }}
    >
      {children}
    </div>
  );
};

export default PageLayout;
