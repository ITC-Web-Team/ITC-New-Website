"use client";

import { useEffect, useState } from 'react';
import Navbar from '../components/navbar';
import SplineScene from '@/app/components/SplineScene';
import { fetchPortals } from '@/lib/api';
import Footer from '../components/footer';

export default function Portals() {
  const [portals, setPortals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchPortals();
        setPortals(Array.isArray(data) ? data : data.results || []);
      } catch (err) {
        console.error('Error fetching portals:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return (
    <main className="relative min-h-screen bg-black text-white overflow-x-hidden selection:bg-purple-500/30">
      {/* Navbar */}
      <Navbar />

      {/* 3D Spline Background Scene — interactive */}
      <SplineScene url="https://prod.spline.design/e1LFmN925FT-Qrss/scene.splinecode" interactive={true} />

      {/* Ultra-light accent tint only */}
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top,rgba(168,85,247,0.07),transparent_50%),radial-gradient(circle_at_bottom_right,rgba(99,102,241,0.05),transparent_45%)] z-1" />

      {/* Content Container */}
      <div className="relative z-10 min-h-screen pt-32 pb-28 px-4 sm:px-6 lg:px-10 max-w-7xl mx-auto space-y-16">
        {/* Hero Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-black/40 px-4 py-1.5 backdrop-blur-md shadow-xl">
            <span className="h-1.5 w-1.5 rounded-full bg-purple-400 animate-pulse" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.35em] text-white/70">
              Digital Services & Tools
            </span>
          </div>

          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-100 to-purple-400 drop-shadow-[0_10px_35px_rgba(168,85,247,0.3)]">
            Portals
          </h1>

          <p className="text-slate-300/80 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed pt-1">
            Web applications, project management tools, and digital platforms engineered by ITC teams.
          </p>

          <div className="pt-2">
            <div className="h-px w-28 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent mx-auto" />
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-12 h-12 border-2 border-purple-500/30 border-t-purple-400 rounded-full animate-spin shadow-[0_0_20px_rgba(168,85,247,0.5)]" />
            <p className="text-xs font-semibold tracking-[0.3em] text-slate-400 uppercase">
              Loading Portals...
            </p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center text-red-400 py-16 bg-red-950/40 rounded-[2rem] border border-red-500/30 backdrop-blur-2xl max-w-lg mx-auto shadow-2xl">
            <p className="text-lg font-bold">Failed to load portals</p>
            <p className="text-sm text-red-300/80 mt-1">{error}</p>
          </div>
        )}

        {/* Portals Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
            {portals.map((portal) => (
              <a
                key={portal.id}
                href={portal.link || '#'}
                target={portal.link?.startsWith('http') ? '_blank' : '_self'}
                rel="noopener noreferrer"
                className="group relative overflow-hidden rounded-[2rem] border border-white/12 bg-[linear-gradient(180deg,rgba(14,18,32,0.7),rgba(10,12,22,0.4))] shadow-[0_30px_100px_rgba(0,0,0,0.5)] backdrop-blur-2xl transition-all duration-500 hover:-translate-y-2 hover:border-purple-400/40 hover:shadow-[0_30px_100px_rgba(168,85,247,0.25)] flex flex-col justify-between"
              >
                {/* Glow Overlay */}
                <div className="pointer-events-none absolute -inset-x-20 -top-20 h-40 bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-blue-600/20 blur-3xl opacity-0 transition-opacity duration-700 group-hover:opacity-100" />

                <div>
                  {/* Banner Image */}
                  {portal.banner && (
                    <div className="aspect-video w-full overflow-hidden border-b border-white/10 relative">
                      <img
                        src={portal.banner}
                        alt={`${portal.name} banner`}
                        className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-60" />
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-8">
                    <h2 className="text-2xl font-bold text-white group-hover:text-purple-200 transition-colors mb-3 leading-snug">
                      {portal.name}
                    </h2>
                    <p className="text-slate-300/85 text-sm leading-relaxed mb-6 line-clamp-3">
                      {portal.description}
                    </p>

                    {/* Tech Stack Pills */}
                    {portal.techstacks && portal.techstacks.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {portal.techstacks.map((tech) => (
                          <div
                            key={tech.id}
                            className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2 group-hover:border-purple-500/30 transition-colors"
                          >
                            {tech.logo && (
                              <img className="w-4 h-4 object-contain" src={tech.logo} alt={tech.name} />
                            )}
                            <span className="text-xs text-slate-300 font-medium">{tech.name}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="px-8 pb-7 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-bold uppercase tracking-[0.25em] text-purple-400 group-hover:text-purple-300 transition-colors">
                  <span>Launch Portal</span>
                  <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/12 bg-white/5 transition-transform group-hover:translate-x-1 group-hover:bg-purple-600/30 group-hover:border-purple-400/50">
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
