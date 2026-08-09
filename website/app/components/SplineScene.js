'use client';

import { useState, useEffect } from 'react';
import Spline from '@splinetool/react-spline';

/**
 * SplineScene component for background or embedded 3D Spline scenes.
 * Supports full Spline URLs (https://prod.spline.design/.../scene.splinecode)
 * and short Spline scene IDs (e.g., "lef3qDOiHdOfbags").
 *
 * @param {Object} props
 * @param {string} props.url - The Spline scene URL or short scene ID
 * @param {string} props.scene - Alternative prop name for scene URL
 * @param {string} props.className - Additional CSS classes for container
 * @param {boolean} props.interactive - Whether the 3D scene should receive mouse events
 */
export default function SplineScene({ url, scene, className = '', interactive = false }) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  const rawUrl = url || scene || '';

  // Helper to normalize short Spline IDs into full scene.splinecode URLs
  const getFullSplineUrl = (inputUrl) => {
    if (!inputUrl) return '';
    const trimmed = inputUrl.trim();
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
      return trimmed;
    }
    // Handle short IDs or voidspiral IDs
    return `https://prod.spline.design/${trimmed}/scene.splinecode`;
  };

  const finalUrl = getFullSplineUrl(rawUrl);

  useEffect(() => {
    setLoaded(false);
    setError(false);
  }, [finalUrl]);

  return (
    <div className={`fixed inset-0 overflow-hidden ${interactive ? 'pointer-events-auto' : 'pointer-events-none'} z-0 ${className}`}>
      {/* Background ambient gradient fallback */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.15),transparent_45%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.12),transparent_40%),linear-gradient(180deg,#090d16_0%,#05070c_100%)] z-0" />

      {/* Loading Skeleton / Pulse effect */}
      {!loaded && !error && finalUrl && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm z-10 transition-opacity duration-700">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
            <span className="text-xs tracking-widest text-slate-400 uppercase">Loading 3D Scene...</span>
          </div>
        </div>
      )}

      {/* Spline canvas */}
      {finalUrl && !error && (
        <div className={`relative w-full h-full transition-opacity duration-1000 ${loaded ? 'opacity-100' : 'opacity-0'} z-1`}>
          <Spline
            scene={finalUrl}
            onLoad={() => setLoaded(true)}
            onError={(err) => {
              console.warn('SplineScene failed to load:', finalUrl, err);
              setError(true);
            }}
            style={{ width: '100%', height: '100%' }}
          />
        </div>
      )}

      {/* Overlay vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-transparent to-slate-950/80 pointer-events-none z-2" />
    </div>
  );
}
