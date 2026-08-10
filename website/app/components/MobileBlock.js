'use client';

import { useEffect, useState } from 'react';

export default function MobileBlock() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  if (!isMobile) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center text-center px-8"
      style={{
        background: 'radial-gradient(ellipse at top, #0d0a1a 0%, #030303 70%)',
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
    >
      {/* Ambient glow */}
      <div
        style={{
          position: 'absolute',
          top: '20%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '320px',
          height: '320px',
          background: 'radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%)',
          filter: 'blur(40px)',
          pointerEvents: 'none',
        }}
      />

      {/* Icon */}
      <div style={{ marginBottom: '2rem', opacity: 0.5 }}>
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
          <line x1="12" y1="18" x2="12.01" y2="18"/>
        </svg>
      </div>

      {/* Heading */}
      <h1
        style={{
          fontFamily: "'Outfit', system-ui, sans-serif",
          fontSize: '1.6rem',
          fontWeight: 700,
          color: 'rgba(255,255,255,0.9)',
          letterSpacing: '-0.02em',
          marginBottom: '0.75rem',
          lineHeight: 1.2,
        }}
      >
        Desktop Only
      </h1>

      {/* Sub-text */}
      <p
        style={{
          fontSize: '0.8rem',
          color: 'rgba(255,255,255,0.3)',
          letterSpacing: '0.05em',
          lineHeight: 1.7,
          maxWidth: '260px',
          marginBottom: '2.5rem',
        }}
      >
        This experience is designed for larger screens.<br />
        Please open it on a laptop or desktop.
      </p>

      {/* Divider */}
      <div
        style={{
          width: '40px',
          height: '1px',
          background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.15), transparent)',
          marginBottom: '2rem',
        }}
      />

      {/* ITC label */}
      <span
        style={{
          fontSize: '0.65rem',
          fontWeight: 500,
          letterSpacing: '0.35em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.15)',
        }}
      >
        ITC · IIT Bombay
      </span>
    </div>
  );
}
