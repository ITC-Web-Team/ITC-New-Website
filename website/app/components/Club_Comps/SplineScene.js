'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Spline from '@/app/components/OptimizedSpline';

export default function SplineScene({ scene, isVisible }) {
  const containerRef = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const [showLoader, setShowLoader] = useState(false);

  // Only show the loader if loading takes noticeably long, so scenes that come
  // from the preload cache appear without a loader flashing up.
  useEffect(() => {
    if (loaded) return;
    const timer = setTimeout(() => setShowLoader(true), 250);
    return () => clearTimeout(timer);
  }, [loaded]);

  // Wait two frames after load so the first frame is drawn before fading in.
  const handleLoad = useCallback(() => {
    requestAnimationFrame(() => requestAnimationFrame(() => setLoaded(true)));
  }, []);

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

  return (
    <div ref={containerRef} className="relative h-full w-full overflow-hidden pointer-events-auto">
      <div className={`absolute inset-0 transition-opacity duration-1000 ease-out ${isVisible && loaded ? 'opacity-100' : 'opacity-0'}`}>
        <Spline
          scene={scene}
          onLoad={handleLoad}
          style={{ width: '100%', height: '100%', transform: 'scale(1.02)', transformOrigin: '50% 50%', pointerEvents: 'auto' }}
        />
      </div>

      {/* Subtle loader while the 3D scene downloads */}
      <div
        aria-hidden={loaded}
        role="status"
        className={`pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-5 transition-opacity duration-700 ease-out ${
          showLoader && !loaded && isVisible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="relative h-14 w-14">
          <div className="absolute inset-0 rounded-full bg-purple-500/20 blur-xl animate-pulse motion-reduce:animate-none" />
          <div className="absolute inset-0 rounded-full border border-white/10" />
          <div className="absolute inset-0 rounded-full border border-transparent border-t-purple-300/80 animate-spin [animation-duration:1.1s] motion-reduce:animate-none" />
        </div>
        <span className="text-[10px] uppercase tracking-[0.3em] text-white/45">Loading scene</span>
      </div>

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(168,85,247,0.16),transparent_40%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.12),transparent_35%),linear-gradient(180deg,rgba(0,0,0,0.02),rgba(0,0,0,0.25))]" />
    </div>
  );
}