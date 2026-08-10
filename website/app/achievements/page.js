"use client";

import { useEffect, useState, useRef } from 'react';
import Navbar from '../components/navbar';
import SplineScene from '@/app/components/SplineScene';
import { fetchAchievementsByYear, fetchBodiesForFilter } from '@/lib/api';
import Footer from '../components/footer';

export default function Achievements() {
  const [achievementsByYear, setAchievementsByYear] = useState({});
  const [bodies, setBodies] = useState([]);
  const [selectedBody, setSelectedBody] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  const load = async (bodyName = '') => {
    setLoading(true);
    try {
      const data = await fetchAchievementsByYear(bodyName || null);
      setAchievementsByYear(data || {});
    } catch (err) {
      console.error('Error fetching achievements:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        const bodyList = await fetchBodiesForFilter();
        setBodies(Array.isArray(bodyList) ? bodyList : bodyList.results || []);
      } catch (err) {
        console.error('Error fetching bodies for filter:', err);
      }
      await load(selectedBody);
    };

    init();
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (
        buttonRef.current &&
        !buttonRef.current.contains(e.target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        dropdownRef.current.classList.add('hidden');
        buttonRef.current.querySelector('svg')?.classList.remove('rotate-180');
      }
    };

    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);

  const toggleDropdown = (e) => {
    e.preventDefault();
    if (!dropdownRef.current || !buttonRef.current) return;
    dropdownRef.current.classList.toggle('hidden');
    buttonRef.current.querySelector('svg')?.classList.toggle('rotate-180');
  };

  const selectBody = async (bodyName, displayText) => {
    setSelectedBody(bodyName || '');
    if (dropdownRef.current && buttonRef.current) {
      const textSpan = buttonRef.current.querySelector('#dropdownText');
      if (textSpan) textSpan.textContent = displayText;
      dropdownRef.current.classList.add('hidden');
      buttonRef.current.querySelector('svg')?.classList.remove('rotate-180');
    }
    await load(bodyName);
  };

  const renderDate = (iso) => {
    try {
      const d = new Date(iso);
      return d.toLocaleDateString('en-US', { month: 'long', day: '2-digit', year: 'numeric' });
    } catch (e) {
      return iso;
    }
  };

  return (
    <main className="relative min-h-screen bg-black text-white overflow-x-hidden selection:bg-purple-500/30">
      {/* Navbar */}
      <Navbar />

      {/* 3D Spline Background Scene — interactive */}
      <SplineScene url="https://prod.spline.design/RRnoQaeTb9ZXsdtf/scene.splinecode" interactive={true} />

      {/* Ultra-light accent tint only */}
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top,rgba(168,85,247,0.07),transparent_50%),radial-gradient(circle_at_bottom_right,rgba(99,102,241,0.05),transparent_45%)] z-1" />

      {/* Content Container */}
      <div className="relative z-10 min-h-screen pt-32 pb-28 px-4 sm:px-6 lg:px-10 max-w-7xl mx-auto space-y-16">
        {/* Hero Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-black/40 px-4 py-1.5 backdrop-blur-md shadow-xl">
            <span className="h-1.5 w-1.5 rounded-full bg-purple-400 animate-pulse" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.35em] text-white/70">
              Recognition & Honors
            </span>
          </div>

          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-100 to-purple-400 drop-shadow-[0_10px_35px_rgba(168,85,247,0.3)]">
            Achievements
          </h1>

          <p className="text-slate-300/80 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed pt-1">
            Celebrating breakthroughs, competition podiums, and student engineering milestones.
          </p>

          <div className="pt-2">
            <div className="h-px w-28 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent mx-auto" />
          </div>
        </div>

        {/* Fancy Filter Dropdown */}
        <div className="max-w-md mx-auto">
          <div className="relative">
            <div id="filterForm" className="rounded-full border border-white/12 bg-black/50 backdrop-blur-2xl shadow-2xl p-1">
              <button
                id="dropdownButton"
                ref={buttonRef}
                onClick={toggleDropdown}
                type="button"
                className="w-full px-6 py-3.5 text-left text-sm font-semibold tracking-wider uppercase text-slate-200 hover:text-white transition-colors flex justify-between items-center"
              >
                <span id="dropdownText" className="truncate">{selectedBody || 'All Bodies'}</span>
                <svg className="w-5 h-5 text-purple-400 transition-transform duration-300 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>

            <div id="dropdown" ref={dropdownRef} className="hidden absolute left-0 right-0 z-[100] mt-3 bg-slate-900/95 backdrop-blur-2xl border border-white/12 rounded-3xl shadow-2xl overflow-hidden">
              <ul className="py-2 max-h-64 overflow-y-auto">
                <li>
                  <a href="#" onClick={(e) => { e.preventDefault(); selectBody('', 'All Bodies'); }} className="block px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-200 hover:bg-purple-600/20 hover:text-purple-300 transition-colors">All Bodies</a>
                </li>
                {bodies.map((body) => (
                  <li key={body.id}>
                    <a
                      href="#"
                      onClick={(e) => { e.preventDefault(); selectBody(body.name, body.name); }}
                      className="block px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-200 hover:bg-purple-600/20 hover:text-purple-300 transition-colors"
                    >
                      {body.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-12 h-12 border-2 border-purple-500/30 border-t-purple-400 rounded-full animate-spin shadow-[0_0_20px_rgba(168,85,247,0.5)]" />
            <p className="text-xs font-semibold tracking-[0.3em] text-slate-400 uppercase">
              Loading Achievements...
            </p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center text-red-400 py-16 bg-red-950/40 rounded-[2rem] border border-red-500/30 backdrop-blur-2xl max-w-lg mx-auto shadow-2xl">
            <p className="text-lg font-bold">Failed to load achievements</p>
            <p className="text-sm text-red-300/80 mt-1">{error}</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && Object.keys(achievementsByYear).length === 0 && (
          <div className="text-center py-20 bg-slate-900/40 backdrop-blur-2xl rounded-[2rem] border border-white/10 max-w-md mx-auto">
            <p className="text-base text-slate-400">No achievements found for this selection.</p>
          </div>
        )}

        {/* Achievements List */}
        {!loading && !error && Object.keys(achievementsByYear).length > 0 && (
          <div className="space-y-16">
            {Object.entries(achievementsByYear)
              .sort((a, b) => Number(b[0]) - Number(a[0]))
              .map(([year, achievements]) => (
                <section key={year} className="space-y-8">
                  {/* Year Header */}
                  <div className="flex items-center gap-4">
                    <span className="px-4 py-1.5 rounded-full border border-purple-400/30 bg-purple-500/10 text-xs font-extrabold tracking-[0.3em] text-purple-300">
                      YEAR
                    </span>
                    <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-300 to-rose-400">
                      {year}
                    </h2>
                    <div className="h-px flex-1 bg-gradient-to-r from-purple-500/40 via-white/10 to-transparent" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {achievements.map((ach) => (
                      <article
                        key={ach.id}
                        className="group relative overflow-hidden rounded-[2rem] border border-white/12 bg-[linear-gradient(180deg,rgba(14,18,32,0.7),rgba(10,12,22,0.4))] p-8 shadow-[0_30px_100px_rgba(0,0,0,0.5)] backdrop-blur-2xl transition-all duration-500 hover:-translate-y-2 hover:border-purple-400/40 hover:shadow-[0_30px_100px_rgba(168,85,247,0.25)] flex flex-col justify-between"
                      >
                        {/* Glow Overlay */}
                        <div className="pointer-events-none absolute -inset-x-20 -top-20 h-40 bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-blue-600/20 blur-3xl opacity-0 transition-opacity duration-700 group-hover:opacity-100" />

                        <div className="flex items-start gap-6 relative z-1">
                          <a href={`/bodies/${ach.body?.name || ''}`} className="flex-shrink-0">
                            <div className="w-18 h-18 rounded-2xl overflow-hidden border-2 border-white/15 bg-black/50 group-hover:border-purple-400/50 transition-all duration-500 shadow-xl group-hover:scale-105">
                              <img
                                className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
                                src={ach.body?.logo}
                                alt={`${ach.body?.name} logo`}
                              />
                            </div>
                          </a>

                          <div className="flex-1 space-y-2">
                            <h3 className="text-2xl font-bold text-white group-hover:text-purple-200 transition-colors leading-snug">
                              {ach.title}
                            </h3>
                            <p className="text-sm text-slate-300/85 leading-relaxed">
                              {ach.description}
                            </p>
                          </div>
                        </div>

                        <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs relative z-1">
                          <span className="font-semibold text-purple-400 tracking-wider uppercase">{renderDate(ach.date)}</span>
                          {ach.body?.name && (
                            <span className="px-3.5 py-1 rounded-full bg-white/5 border border-white/12 text-[10px] font-bold uppercase tracking-[0.2em] text-white/80">
                              {ach.body.name}
                            </span>
                          )}
                        </div>
                      </article>
                    ))}
                  </div>
                </section>
              ))}
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
}
