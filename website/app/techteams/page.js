'use client';

import { useEffect, useState } from 'react';
import Navbar from '../components/navbar';
import SplineScene from '@/app/components/SplineScene';
import { fetchBodies } from '@/lib/api';
import Footer from '../components/footer';

export default function TechTeams() {
  const [bodies, setBodies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch tech teams (type=1)
        const data = await fetchBodies(1);
        setBodies(Array.isArray(data) ? data : data.results || []);
      } catch (err) {
        console.error('Error fetching tech teams:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <main className="relative min-h-screen bg-black text-white overflow-x-hidden selection:bg-blue-500/30">
      {/* Navbar */}
      <Navbar />

      {/* 3D Spline Background Scene — interactive */}
      <SplineScene url="https://prod.spline.design/lef3qDOiHdOfbags/scene.splinecode" interactive={true} />

      {/* Very light ambient tint — lets Spline shine */}
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.08),transparent_50%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.06),transparent_45%)] z-1" />

      {/* Content Container */}
      <div className="relative z-10 min-h-screen pt-32 pb-28 px-4 sm:px-6 lg:px-10 max-w-7xl mx-auto space-y-16">
        {/* Hero Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-black/40 px-4 py-1.5 backdrop-blur-md shadow-xl">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.35em] text-white/70">
              Specialized Engineering Units
            </span>
          </div>

          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-blue-400 drop-shadow-[0_10px_35px_rgba(59,130,246,0.3)]">
            Tech Teams
          </h1>

          <p className="text-slate-300/80 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed pt-1">
            Student competition teams engineering Formula electric racecars, satellites, autonomous vehicles, and rovers.
          </p>

          <div className="pt-2">
            <div className="h-px w-28 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent mx-auto" />
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-12 h-12 border-2 border-blue-500/30 border-t-blue-400 rounded-full animate-spin shadow-[0_0_20px_rgba(59,130,246,0.5)]" />
            <p className="text-xs font-semibold tracking-[0.3em] text-slate-400 uppercase">
              Loading Tech Teams...
            </p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center text-red-400 py-16 bg-red-950/40 rounded-[2rem] border border-red-500/30 backdrop-blur-2xl max-w-lg mx-auto shadow-2xl">
            <p className="text-lg font-bold">Failed to load tech teams</p>
            <p className="text-sm text-red-300/80 mt-1">{error}</p>
          </div>
        )}

        {/* Bodies Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
            {bodies.map((body) => (
              <a
                key={body.id}
                href={`/bodies/${body.name}`}
                className="group relative overflow-hidden rounded-[2rem] border border-white/12 bg-[linear-gradient(180deg,rgba(14,18,32,0.7),rgba(10,12,22,0.4))] p-8 shadow-[0_30px_100px_rgba(0,0,0,0.5)] backdrop-blur-2xl transition-all duration-500 hover:-translate-y-2 hover:border-blue-400/40 hover:shadow-[0_30px_100px_rgba(59,130,246,0.25)] cursor-pointer flex flex-col justify-between"
              >
                {/* Glow Overlay */}
                <div className="pointer-events-none absolute -inset-x-20 -top-20 h-40 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-cyan-600/20 blur-3xl opacity-0 transition-opacity duration-700 group-hover:opacity-100" />

                <div>
                  <div className="flex items-center gap-5 mb-6">
                    <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-white/15 bg-black/50 group-hover:border-blue-400/50 transition-all duration-500 shadow-xl flex-shrink-0 group-hover:scale-105">
                      <img
                        src={body.logo}
                        alt={`${body.name} Logo`}
                        className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
                      />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white group-hover:text-blue-200 transition-colors leading-snug">
                        {body.name}
                      </h2>
                    </div>
                  </div>

                  <p className="text-slate-300/85 text-sm leading-relaxed line-clamp-3 mb-8">
                    {body.short_description}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-bold uppercase tracking-[0.25em] text-blue-400 group-hover:text-blue-300 transition-colors">
                  <span>Explore Team</span>
                  <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/12 bg-white/5 transition-transform group-hover:translate-x-1 group-hover:bg-blue-600/30 group-hover:border-blue-400/50">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
}
