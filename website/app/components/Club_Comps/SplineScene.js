'use client';

import Spline from '@splinetool/react-spline';

export default function SplineScene({ scene, isVisible }) {
  return (
    <div className="relative h-full w-full overflow-hidden pointer-events-auto">
      <div className={`absolute inset-0 transition-opacity duration-1000 ease-out ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        <Spline
          scene={scene}
          style={{ width: '100%', height: '100%', transform: 'scale(1.02)', transformOrigin: '50% 50%', pointerEvents: 'auto' }}
        />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(168,85,247,0.16),transparent_40%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.12),transparent_35%),linear-gradient(180deg,rgba(0,0,0,0.02),rgba(0,0,0,0.25))]" />
    </div>
  );
}