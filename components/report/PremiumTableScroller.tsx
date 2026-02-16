
import React, { useState, useRef, useEffect, useCallback } from 'react';

interface PremiumTableScrollerProps {
  children: React.ReactNode;
  minWidth?: number | string;
  className?: string;
}

const PremiumTableScroller: React.FC<PremiumTableScrollerProps> = ({ 
  children, 
  minWidth = 1200,
  className = "" 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollInfo, setScrollInfo] = useState({ left: 0, width: 0, client: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [showHint, setShowHint] = useState(true);
  const dragStartRef = useRef({ x: 0, scrollLeft: 0 });

  const updateScrollInfo = useCallback(() => {
    if (containerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
      setScrollInfo({ left: scrollLeft, width: scrollWidth, client: clientWidth });
    }
  }, []);

  useEffect(() => {
    updateScrollInfo();
    window.addEventListener('resize', updateScrollInfo);
    const timer = setTimeout(() => setShowHint(false), 2500);
    return () => {
      window.removeEventListener('resize', updateScrollInfo);
      clearTimeout(timer);
    };
  }, [updateScrollInfo]);

  const handlePointerDown = (e: React.PointerEvent) => {
    // Only drag on the table area, not interactive elements
    if ((e.target as HTMLElement).closest('button, input, a')) return;
    
    if (!containerRef.current) return;
    setIsDragging(true);
    containerRef.current.setPointerCapture(e.pointerId);
    dragStartRef.current = {
      x: e.clientX,
      scrollLeft: containerRef.current.scrollLeft,
    };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !containerRef.current) return;
    const dx = e.clientX - dragStartRef.current.x;
    containerRef.current.scrollLeft = dragStartRef.current.scrollLeft - dx;
    updateScrollInfo();
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    if (containerRef.current) {
      containerRef.current.releasePointerCapture(e.pointerId);
    }
  };

  const { left, width, client } = scrollInfo;
  const canScroll = width > client;
  const showLeftFade = left > 10;
  const showRightFade = left < width - client - 10;

  const thumbWidth = width ? (client / width) * 100 : 0;
  const thumbLeft = width ? (left / width) * 100 : 0;

  return (
    <div className={`relative flex flex-col flex-1 overflow-hidden ${className}`}>
      {canScroll && (
        <div className="sticky top-0 z-[48] bg-white border-b border-slate-100 h-1.5 w-full overflow-hidden shrink-0">
          <div 
            className="h-full bg-blue-600 transition-all duration-75 ease-out rounded-full shadow-[0_0_8px_rgba(37,99,235,0.4)]"
            style={{ 
              width: `${thumbWidth}%`, 
              transform: `translateX(${(thumbLeft / thumbWidth) * 100}%)`,
              minWidth: '30px'
            }}
          />
        </div>
      )}

      {showHint && canScroll && (
        <div className="absolute top-10 left-1/2 -translate-x-1/2 z-[100] pointer-events-none animate-in fade-in zoom-in slide-in-from-top-2 duration-500">
          <div className="bg-slate-900/90 backdrop-blur-md text-white px-4 py-2 rounded-full flex items-center space-x-2 border border-white/10 shadow-2xl">
            <span className="text-[10px] font-black uppercase tracking-widest">Swipe for more</span>
          </div>
        </div>
      )}

      <div 
        ref={containerRef}
        onScroll={updateScrollInfo}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className={`flex-1 overflow-x-auto overflow-y-auto select-none touch-pan-y scroll-smooth no-scrollbar ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        <div style={{ minWidth: typeof minWidth === 'number' ? `${minWidth}px` : minWidth }} className="relative">
          {children}
        </div>
      </div>

      <div 
        className={`absolute top-0 bottom-0 left-0 w-6 bg-gradient-to-r from-white/40 to-transparent pointer-events-none z-40 transition-opacity duration-300 ${showLeftFade ? 'opacity-100' : 'opacity-0'}`}
      />
      <div 
        className={`absolute top-0 bottom-0 right-0 w-6 bg-gradient-to-l from-white/40 to-transparent pointer-events-none z-40 transition-opacity duration-300 ${showRightFade ? 'opacity-100' : 'opacity-0'}`}
      />
    </div>
  );
};

export default PremiumTableScroller;
