
import React, { useEffect, useState, useRef } from 'react';

interface HorizontalScrollDockProps {
  scrollRef: React.RefObject<HTMLDivElement | null>;
}

/**
 * Syncs with a table's horizontal scroll to provide a visible dock on mobile.
 */
const HorizontalScrollDock: React.FC<HorizontalScrollDockProps> = ({ scrollRef }) => {
  const [scrollInfo, setScrollInfo] = useState({ left: 0, width: 0, client: 0 });
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const handleScroll = () => {
      setScrollInfo({
        left: el.scrollLeft,
        width: el.scrollWidth,
        client: el.clientWidth
      });
    };

    el.addEventListener('scroll', handleScroll);
    handleScroll(); // Init

    const resizeObserver = new ResizeObserver(handleScroll);
    resizeObserver.observe(el);

    return () => {
      el.removeEventListener('scroll', handleScroll);
      resizeObserver.disconnect();
    };
  }, [scrollRef]);

  if (scrollInfo.width <= scrollInfo.client) return null;

  const thumbWidthPct = (scrollInfo.client / scrollInfo.width) * 100;
  const thumbLeftPct = (scrollInfo.left / scrollInfo.width) * 100;

  return (
    <div className="sticky bottom-0 left-0 right-0 z-30 bg-white/80 backdrop-blur-md border-t border-slate-100 p-2 pointer-events-none">
      <div 
        ref={trackRef}
        className="h-1.5 w-full bg-slate-200 rounded-full relative overflow-hidden"
      >
        <div 
          className="absolute top-0 bottom-0 bg-blue-600 rounded-full transition-all duration-75 ease-out shadow-[0_0_8px_rgba(37,99,235,0.3)]"
          style={{ 
            width: `${thumbWidthPct}%`,
            left: `${thumbLeftPct}%`
          }}
        />
      </div>
      <div className="text-center mt-1">
        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Swipe Table for more data</span>
      </div>
    </div>
  );
};

export default HorizontalScrollDock;
