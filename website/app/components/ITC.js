'use client';

import Spline from '@/app/components/OptimizedSpline';

export default function ITC({ paused = false }) {
  return (
    <main className="h-full w-full flex items-center justify-center">
      <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
        <Spline
          paused={paused}
          scene="https://prod.spline.design/7BKUCAYUubE4SAct/scene.splinecode"
          style={{
            width: '130%',
            height: '130%',
            transform: 'scale(1.22) translateZ(0)',
            transformOrigin: '50% 20%',
          }}
        />
      </div>
    </main>
  );
}