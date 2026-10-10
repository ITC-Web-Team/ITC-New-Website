'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';

// Lazy-load the Spline runtime so it isn't in the initial bundle
const Spline = dynamic(() => import('@splinetool/react-spline'), { ssr: false });

export default function SplineScene({ scene, isVisible, active = true }) {
  const containerRef = useRef(null);
  const appRef = useRef(null);
  const [loaded, setLoaded] = useState(false);

  // Suppress pointer events during scrolling so that Spline doesn't capture the scroll wheel
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let scrollTimer = null;

    const handleScroll = () => {
      el.style.pointerEvents = 'none';
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        el.style.pointerEvents = 'auto';
      }, 250); // restore interactivity 250ms after scroll ceases
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimer);
    };
  }, []);

  // Only the on-screen scene renders frames; neighbours are loaded but paused
  useEffect(() => {
    const app = appRef.current;
    if (!app) return;
    try {
      if (active) app.play?.();
      else app.stop?.();
    } catch {}
  }, [active, loaded]);

  return (
    <div ref={containerRef} className="relative h-full w-full overflow-hidden pointer-events-auto">
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/15 border-t-purple-400" />
        </div>
      )}
      <div className={`absolute inset-0 transition-opacity duration-700 ease-out ${isVisible && loaded ? 'opacity-100' : 'opacity-0'}`}>
        <Spline
          scene={scene}
          onLoad={(app) => {
            appRef.current = app;
            setLoaded(true);
          }}
          style={{ width: '100%', height: '100%', pointerEvents: 'auto' }}
        />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(168,85,247,0.16),transparent_40%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.12),transparent_35%),linear-gradient(180deg,rgba(0,0,0,0.02),rgba(0,0,0,0.25))]" />
    </div>
  );
}
