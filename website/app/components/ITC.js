'use client';

import Spline from '@splinetool/react-spline';

export default function ITC() {
  return (
    <main className="h-full w-full flex items-center justify-center">
      <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
        <Spline
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