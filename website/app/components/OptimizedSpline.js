'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { getPreloadedScene, preloadSplineScene } from '@/lib/splinePreload';

/**
 * OptimizedSpline — drop-in replacement for `@splinetool/react-spline`.
 *
 * Same props and same visuals/interaction, plus a few performance safeguards
 * that matter on lower-spec PCs:
 *  - The heavy Spline runtime is code-split and loaded client-side only, so it
 *    no longer blocks hydration of the rest of the page.
 *  - Rendering is paused (app.stop()) while the scene is off-screen, the tab is
 *    hidden, or the caller passes `paused` (e.g. the scene is fully faded out),
 *    and resumed (app.play()) as soon as it is visible again.
 *  - Scene files go through a shared download cache, so a scene that was
 *    preloaded in the background (see lib/splinePreload.js) opens instantly.
 *  - Render resolution is capped: 1x on low-end hardware, at most 2x elsewhere,
 *    so weak GPUs on hi-DPI screens don't render 2-3x the pixels.
 */

const Spline = dynamic(() => import('@splinetool/react-spline'), { ssr: false });

// ── Silence "[Intervention] Ignored attempt to cancel a touchend event with
// cancelable=false" ────────────────────────────────────────────────────────
// Spline's built-in controls call preventDefault() on every touch event,
// including ones the browser has already marked non-cancelable because a scroll
// is in progress. preventDefault() on a non-cancelable event does nothing except
// print that warning, so skipping the call there has no behavioural effect.
if (typeof window !== 'undefined' && !window.__itcTouchPreventDefaultGuard) {
  window.__itcTouchPreventDefaultGuard = true;
  const originalPreventDefault = Event.prototype.preventDefault;
  Event.prototype.preventDefault = function preventDefault() {
    if (!this.cancelable && typeof this.type === 'string' && this.type.startsWith('touch')) return;
    return originalPreventDefault.call(this);
  };
}

function getPixelRatioCap() {
  const dpr = window.devicePixelRatio || 1;
  const cores = navigator.hardwareConcurrency || 8;
  const memory = navigator.deviceMemory || 8; // GB, Chromium-only
  const lowEnd = cores <= 4 || memory <= 4;
  return lowEnd ? 1 : Math.min(dpr, 2);
}

export default function OptimizedSpline({ paused = false, onLoad, scene, ...props }) {
  // Resolve the scene through the download cache (reuses a background preload
  // instead of downloading the same file twice).
  const [resolved, setResolved] = useState({ scene: null, src: null });
  const src = getPreloadedScene(scene) || (resolved.scene === scene ? resolved.src : null);

  useEffect(() => {
    if (!scene || getPreloadedScene(scene)) return;
    let cancelled = false;
    preloadSplineScene(scene).then((url) => {
      if (!cancelled) setResolved({ scene, src: url });
    });
    return () => {
      cancelled = true;
    };
  }, [scene]);

  const appRef = useRef(null);
  const stateRef = useRef({ paused, inView: true, pageVisible: true });
  const observerRef = useRef(null);

  const sync = useCallback(() => {
    const app = appRef.current;
    if (!app) return;
    const { paused: p, inView, pageVisible } = stateRef.current;
    const shouldRun = !p && inView && pageVisible;
    try {
      if (shouldRun && app.isStopped) app.play();
      else if (!shouldRun && !app.isStopped) app.stop();
    } catch {
      // Runtime already disposed — nothing to do.
    }
  }, []);

  // Caller-controlled pause (e.g. scene faded out / hidden behind content).
  useEffect(() => {
    stateRef.current.paused = paused;
    sync();
  }, [paused, sync]);

  // Pause while the browser tab is hidden.
  useEffect(() => {
    const onVisibility = () => {
      stateRef.current.pageVisible = !document.hidden;
      sync();
    };
    onVisibility();
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, [sync]);

  // Cleanup on unmount.
  useEffect(
    () => () => {
      observerRef.current?.disconnect();
      observerRef.current = null;
      appRef.current = null;
    },
    []
  );

  const handleLoad = useCallback(
    (app) => {
      appRef.current = app;

      // Cap render resolution for weaker hardware.
      try {
        const renderer = app._renderer;
        const current = renderer?.getPixelRatio?.();
        const cap = getPixelRatioCap();
        if (renderer?.setPixelRatio && typeof current === 'number' && current > cap) {
          renderer.setPixelRatio(cap);
          app.requestRender?.();
        }
      } catch {
        // Non-critical optimisation; ignore if the runtime internals change.
      }

      // Pause rendering while the canvas is scrolled / translated off-screen.
      observerRef.current?.disconnect();
      if (app.canvas && 'IntersectionObserver' in window) {
        observerRef.current = new IntersectionObserver(([entry]) => {
          stateRef.current.inView = entry.isIntersecting;
          sync();
        });
        observerRef.current.observe(app.canvas);
      }

      sync();
      onLoad?.(app);
    },
    [onLoad, sync]
  );

  if (!src) return null;
  return <Spline {...props} scene={src} onLoad={handleLoad} />;
}
