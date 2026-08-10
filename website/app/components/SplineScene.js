'use client';

import { useEffect, useRef } from 'react';
import Spline from '@splinetool/react-spline';

/**
 * SplineScene — interactive, preloaded 3D background.
 * - No loading spinner (scenes start rendering immediately, hidden until ready).
 * - pointer-events-auto so users can interact with the 3D.
 * - Scroll on the content layer (z-10+) is NOT blocked — pointer events on the
 *   Spline layer only fire when the user isn't scrolling the page.
 */
export default function SplineScene({ url, scene, className = '', interactive = true }) {
  const containerRef = useRef(null);

  const rawUrl = url || scene || '';

  const getFullSplineUrl = (inputUrl) => {
    if (!inputUrl) return '';
    const trimmed = inputUrl.trim();
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
    return `https://prod.spline.design/${trimmed}/scene.splinecode`;
  };

  const finalUrl = getFullSplineUrl(rawUrl);

  // When the user starts scrolling, temporarily suppress pointer events on the
  // Spline layer so the scroll isn't captured by the 3D canvas.
  useEffect(() => {
    if (!interactive) return;
    const el = containerRef.current;
    if (!el) return;

    let scrollTimer = null;

    const disablePointer = () => {
      el.style.pointerEvents = 'none';
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        el.style.pointerEvents = 'auto';
      }, 300);
    };

    window.addEventListener('scroll', disablePointer, { passive: true });
    return () => {
      window.removeEventListener('scroll', disablePointer);
      clearTimeout(scrollTimer);
    };
  }, [interactive]);

  if (!finalUrl) return null;

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 overflow-hidden z-0 ${interactive ? 'pointer-events-auto' : 'pointer-events-none'} ${className}`}
    >
      {/* Ambient base gradient (visible while Spline loads) */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.14),transparent_55%),radial-gradient(ellipse_at_bottom_right,rgba(168,85,247,0.09),transparent_50%),linear-gradient(180deg,#060810_0%,#030305_100%)]" />

      {/* Spline canvas — renders immediately, fades in on load */}
      <div className="relative w-full h-full pointer-events-auto">
        <Spline
          scene={finalUrl}
          style={{ width: '100%', height: '100%', pointerEvents: 'auto' }}
        />
      </div>

      {/* Ultra-light bottom vignette — just enough to ground content, not hide Spline */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/[0.04] via-transparent to-black/25 pointer-events-none" />
    </div>
  );
}
