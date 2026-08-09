"use client";

import { useEffect, useState } from 'react';
import Navbar from '../components/navbar';
import SplineScene from '@/app/components/SplineScene';
import { fetchInterIIT } from '@/lib/api';

export default function HallOfFame() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchInterIIT();
        setItems(Array.isArray(data) ? data : data.results || []);
      } catch (err) {
        console.error('Error fetching InterIIT:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return (
    <main className="relative min-h-screen bg-black text-white overflow-x-hidden selection:bg-amber-500/30">
      {/* Navbar */}
      <Navbar />

      {/* 3D Spline Background Scene */}
      <SplineScene url="https://prod.spline.design/7BKUCAYUubE4SAct/scene.splinecode" />

      {/* Ambient Gradient Overlays */}
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top,rgba(234,179,8,0.2),transparent_42%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.15),transparent_40%),linear-gradient(180deg,#050505_0%,#0c0903_50%,#020202_100%)] z-1 opacity-70" />

      {/* Content Container */}
      <div className="relative z-10 min-h-screen pt-32 pb-28 px-4 sm:px-6 lg:px-10 max-w-7xl mx-auto space-y-16">
        {/* Hero Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-black/40 px-4 py-1.5 backdrop-blur-md shadow-xl">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.35em] text-white/70">
              Inter-IIT Tech Meet Champions
            </span>
          </div>

          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-amber-100 to-amber-400 drop-shadow-[0_10px_35px_rgba(245,158,11,0.3)]">
            Hall of Fame
          </h1>

          <p className="text-slate-300/80 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed pt-1">
            Honoring IIT Bombay&apos;s trophy victories, podium finishes, and engineering supremacy across Inter-IIT meets.
          </p>

          <div className="pt-2">
            <div className="h-px w-28 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent mx-auto" />
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-12 h-12 border-2 border-amber-500/30 border-t-amber-400 rounded-full animate-spin shadow-[0_0_20px_rgba(245,158,11,0.5)]" />
            <p className="text-xs font-semibold tracking-[0.3em] text-slate-400 uppercase">
              Loading Hall of Fame...
            </p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center text-red-400 py-16 bg-red-950/40 rounded-[2rem] border border-red-500/30 backdrop-blur-2xl max-w-lg mx-auto shadow-2xl">
            <p className="text-lg font-bold">Failed to load Hall of Fame</p>
            <p className="text-sm text-red-300/80 mt-1">{error}</p>
          </div>
        )}

        {/* Inter-IIT Cards */}
        {!loading && !error && (
          <div className="space-y-14">
            {items.map((d) => (
              <article
                key={d.id}
                className="group relative overflow-hidden rounded-[2.2rem] border border-white/12 bg-[linear-gradient(180deg,rgba(16,18,30,0.7),rgba(10,12,22,0.4))] shadow-[0_30px_100px_rgba(0,0,0,0.6)] backdrop-blur-2xl transition-all duration-500 hover:border-amber-400/40 hover:shadow-[0_30px_100px_rgba(245,158,11,0.2)]"
              >
                <div className="relative h-full">
                  {/* Background Banner with Dark Vignette */}
                  {d.img && (
                    <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${d.img})` }}>
                      <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/80 to-black/95 backdrop-blur-sm" />
                    </div>
                  )}

                  <div className="relative flex flex-col lg:flex-row">
                    {/* Left Column: InterIIT Header & Medals */}
                    <div className="w-full lg:w-1/2 p-8 sm:p-10 border-b lg:border-b-0 lg:border-r border-white/10 flex flex-col justify-between space-y-8">
                      <div className="flex items-center gap-6">
                        {d.logo && (
                          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl overflow-hidden border-2 border-white/15 bg-black/60 shadow-2xl flex-shrink-0">
                            <img className="w-full h-full object-cover" src={d.logo} alt="Logo" />
                          </div>
                        )}
                        <div>
                          <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight mb-1">
                            {d.title}
                          </h2>
                          <p className="text-base sm:text-lg font-extrabold text-amber-400 tracking-wide">
                            {d.subtitle}
                          </p>
                        </div>
                      </div>

                      {/* Medals Showcase Grid */}
                      <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/10">
                        {/* Bronze */}
                        <div className="text-center group/medal">
                          <div className="relative w-14 sm:w-20 h-14 sm:h-20 mx-auto transition-transform duration-300 group-hover/medal:scale-110">
                            <img src="/static/img/3.svg" className="w-full h-full object-contain" alt="Bronze Medal" />
                          </div>
                          <p className="text-3xl sm:text-5xl font-black mt-3 bg-gradient-to-r from-amber-700 to-yellow-600 text-transparent bg-clip-text">
                            {d.bronze}
                          </p>
                          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400">Bronze</span>
                        </div>

                        {/* Gold */}
                        <div className="text-center group/medal">
                          <div className="relative w-14 sm:w-20 h-14 sm:h-20 mx-auto transition-transform duration-300 group-hover/medal:scale-110">
                            <img src="/static/img/1.svg" className="w-full h-full object-contain" alt="Gold Medal" />
                          </div>
                          <p className="text-3xl sm:text-5xl font-black mt-3 bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-500 text-transparent bg-clip-text">
                            {d.gold}
                          </p>
                          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-amber-400">Gold</span>
                        </div>

                        {/* Silver */}
                        <div className="text-center group/medal">
                          <div className="relative w-14 sm:w-20 h-14 sm:h-20 mx-auto transition-transform duration-300 group-hover/medal:scale-110">
                            <img src="/static/img/2.svg" className="w-full h-full object-contain" alt="Silver Medal" />
                          </div>
                          <p className="text-3xl sm:text-5xl font-black mt-3 bg-gradient-to-r from-slate-100 to-slate-400 text-transparent bg-clip-text">
                            {d.silver}
                          </p>
                          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-300">Silver</span>
                        </div>
                      </div>
                    </div>

                    {/* Right Column: Description & Table */}
                    <div className="w-full lg:w-1/2 p-8 sm:p-10 flex flex-col justify-between space-y-8">
                      <p className="text-slate-300/90 text-base leading-relaxed">
                        {d.description}
                      </p>

                      {/* Problem Statements Table */}
                      {d.problemstatements && d.problemstatements.length > 0 && (
                        <div className="overflow-hidden rounded-2xl border border-white/12 bg-black/40 backdrop-blur-md shadow-inner">
                          <table className="w-full text-left border-collapse">
                            <thead className="bg-white/5 border-b border-white/10">
                              <tr>
                                <th className="px-5 py-3.5 text-xs font-bold text-slate-300 uppercase tracking-wider">Company / Event</th>
                                <th className="px-5 py-3.5 text-xs font-bold text-slate-300 uppercase tracking-wider">Position</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 text-sm">
                              {d.problemstatements.map((p) => (
                                <tr key={p.id} className="hover:bg-white/5 transition-colors">
                                  <td className="px-5 py-3.5 text-slate-200 font-medium">{p.title}</td>
                                  <td className="px-5 py-3.5 font-bold text-amber-400">{p.position}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
