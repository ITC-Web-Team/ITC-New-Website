'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Spline from '@splinetool/react-spline';
import ITC from './components/ITC';
import About from './components/about';
import Navbar from './components/navbar';
import {
  fetchBodies,
  fetchAchievements,
  fetchInterIIT,
  fetchWorkReports,
} from '@/lib/api';

// ─── Scroll-based hero → about transition ──────────────────────────────────
export default function Home() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const targetProgressRef = useRef(0);
  const animationFrameRef = useRef(null);
  const wheelLockRef = useRef(false);

  // Secondary sections data
  const [clubs, setClubs] = useState([]);
  const [techTeams, setTechTeams] = useState([]);
  const [communities, setCommunities] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [interIITs, setInterIITs] = useState([]);
  const [workReports, setWorkReports] = useState([]);

  // Fetch all data for sections below the fold
  useEffect(() => {
    const load = async () => {
      try {
        const [clubData, teamData, communityData, achData, iitData, reportData] =
          await Promise.allSettled([
            fetchBodies(0),
            fetchBodies(1),
            fetchBodies(2),
            fetchAchievements(),
            fetchInterIIT(),
            fetchWorkReports(),
          ]);
        if (clubData.status === 'fulfilled') {
          const d = clubData.value;
          setClubs(Array.isArray(d) ? d : d.results || []);
        }
        if (teamData.status === 'fulfilled') {
          const d = teamData.value;
          setTechTeams(Array.isArray(d) ? d : d.results || []);
        }
        if (communityData.status === 'fulfilled') {
          const d = communityData.value;
          setCommunities(Array.isArray(d) ? d : d.results || []);
        }
        if (achData.status === 'fulfilled') {
          const d = achData.value;
          const list = Array.isArray(d) ? d : d.results || [];
          setAchievements(list.slice(0, 6)); // show 6 most recent
        }
        if (iitData.status === 'fulfilled') {
          const d = iitData.value;
          const list = Array.isArray(d) ? d : d.results || [];
          setInterIITs(list.slice(0, 1)); // show latest only
        }
        if (reportData.status === 'fulfilled') {
          const d = reportData.value;
          setWorkReports(Array.isArray(d) ? d : d.results || []);
        }
      } catch (err) {
        console.error('Home data fetch error:', err);
      }
    };
    load();
  }, []);

  // ── Smooth wheel-scroll transition logic ──────────────────────────────────
  useEffect(() => {
    const animateProgress = () => {
      setScrollProgress((cur) => {
        const next = cur + (targetProgressRef.current - cur) * 0.09;
        if (Math.abs(targetProgressRef.current - next) < 0.002) {
          animationFrameRef.current = null;
          return targetProgressRef.current;
        }
        animationFrameRef.current = window.requestAnimationFrame(animateProgress);
        return next;
      });
    };

    const handleWheel = (event) => {
      // Only intercept while at the very top of the page
      if (window.scrollY > 20) return;

      const direction = event.deltaY > 0 ? 1 : -1;

      // Scrolling DOWN but transition already complete → release to normal scroll
      if (direction > 0 && targetProgressRef.current >= 1) return;
      // Scrolling UP but already at the beginning → release to normal scroll
      if (direction < 0 && targetProgressRef.current <= 0) return;

      // We are mid-transition: take over scrolling
      event.preventDefault();
      if (wheelLockRef.current) return;

      const step = 0.55;
      targetProgressRef.current = Math.max(
        0,
        Math.min(1, targetProgressRef.current + direction * step)
      );

      if (animationFrameRef.current === null) {
        animationFrameRef.current = window.requestAnimationFrame(animateProgress);
      }

      wheelLockRef.current = true;
      window.setTimeout(() => {
        wheelLockRef.current = false;
      }, 900);
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      window.removeEventListener('wheel', handleWheel);
      if (animationFrameRef.current !== null)
        window.cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  const itcOpacity = Math.max(0, 1 - scrollProgress * 1.15);
  const aboutOpacity = Math.max(0, Math.min(1, (scrollProgress - 0.18) * 1.18));
  const itcTransform = `translateY(${scrollProgress * -18}px) scale(${1 - scrollProgress * 0.02})`;
  const aboutTransform = `translateY(${Math.max(0, (1 - scrollProgress) * 18)}px) scale(${0.985 + scrollProgress * 0.015})`;

  return (
    <main className="relative bg-black text-white">
      <Navbar />

      {/* ══ ABOUT SPLINE — fixed background for the entire page ═══════════ */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <Spline
          scene="https://prod.spline.design/DeRwt5-Ygauh9zYX/scene.splinecode"
          style={{ width: '100%', height: '100%', transform: 'scale(1.02)' }}
        />
        {/* Subtle overlay keeps text readable */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.1),transparent_40%),linear-gradient(180deg,rgba(2,4,10,0.05),rgba(2,4,10,0.45)_60%,rgba(2,4,10,0.65))]" />
      </div>

      {/* ══ HERO SECTION (scroll-based ITC → About) ══════════════════════ */}
      <section className="relative z-10 h-screen overflow-hidden">
        {/* Dark bg fades out as About slides in, revealing the fixed Spline */}
        <div
          className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(168,85,247,0.22),transparent_38%),linear-gradient(180deg,#050505_0%,#09040f_55%,#020202_100%)]"
          style={{ opacity: Math.max(0, 1 - scrollProgress * 1.8) }}
        />

        {/* ITC 3D scene */}
        <div
          className="absolute inset-0 transition-[opacity,transform] duration-700 ease-out"
          style={{
            opacity: itcOpacity,
            transform: itcTransform,
            pointerEvents: scrollProgress > 0.45 ? 'none' : 'auto',
          }}
        >
          <ITC />
        </div>

        {/* About panel */}
        <div
          className="absolute inset-0 transition-[opacity,transform] duration-700 ease-out"
          style={{
            opacity: aboutOpacity,
            transform: aboutTransform,
            pointerEvents: scrollProgress < 0.2 ? 'none' : 'auto',
          }}
        >
          <About />
        </div>

        {/* Scroll hint */}
        <div className="pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2 rounded-full border border-white/10 bg-black/30 px-4 py-2 text-[10px] uppercase tracking-[0.35em] text-white/55 backdrop-blur-md">
          Scroll to transition
        </div>
      </section>

      {/* ══ CTA BUTTONS ══════════════════════════════════════════════════ */}
      <section className="relative z-10 py-20 px-4">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.08),transparent_60%)]" />
        <div className="relative z-10 max-w-4xl mx-auto flex flex-wrap gap-5 justify-center">
          <Link
            href="/clubs"
            className="group relative inline-flex items-center gap-3 overflow-hidden rounded-2xl border border-blue-500/30 bg-gradient-to-r from-blue-600 to-blue-500 px-8 py-4 text-sm font-bold uppercase tracking-[0.2em] text-white shadow-[0_5px_30px_rgba(59,130,246,0.35)] transition-all duration-300 hover:scale-105 hover:shadow-[0_8px_40px_rgba(59,130,246,0.5)]"
          >
            <span>Explore Clubs</span>
            <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>

          <Link
            href="/techteams"
            className="group relative inline-flex items-center gap-3 overflow-hidden rounded-2xl border border-white/20 bg-white/5 px-8 py-4 text-sm font-bold uppercase tracking-[0.2em] text-white backdrop-blur-md shadow-[0_5px_30px_rgba(0,0,0,0.3)] transition-all duration-300 hover:scale-105 hover:border-blue-400/40 hover:bg-blue-600/15 hover:shadow-[0_8px_40px_rgba(59,130,246,0.25)]"
          >
            <span>Tech Teams</span>
            <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>

          <Link
            href="/portals"
            className="group relative inline-flex items-center gap-3 overflow-hidden rounded-2xl border border-purple-500/30 bg-gradient-to-r from-purple-600 to-violet-600 px-8 py-4 text-sm font-bold uppercase tracking-[0.2em] text-white shadow-[0_5px_30px_rgba(147,51,234,0.35)] transition-all duration-300 hover:scale-105 hover:shadow-[0_8px_40px_rgba(147,51,234,0.5)]"
          >
            <span>Communities</span>
            <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </section>

      {/* ══ OUR FAMILY (logo collage) ═════════════════════════════════════ */}
      <section className="relative z-10 py-24 px-4">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.07),transparent_50%),radial-gradient(circle_at_bottom_left,rgba(168,85,247,0.07),transparent_50%)]" />

        <div className="relative z-10 max-w-7xl mx-auto">
          {/* Section heading */}
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-300 to-pink-400">
              Our Family
            </h2>
            <div className="mt-4 h-px w-20 bg-gradient-to-r from-transparent via-purple-500/60 to-transparent mx-auto" />
          </div>

          {/* Clubs */}
          {clubs.length > 0 && (
            <div className="mb-16">
              <h3 className="text-xl font-bold text-blue-400 uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
                <span className="h-px flex-1 bg-gradient-to-r from-blue-500/40 to-transparent" />
                Clubs
                <span className="h-px flex-1 bg-gradient-to-l from-blue-500/40 to-transparent" />
              </h3>
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-4">
                {clubs.map((club) => (
                  <Link
                    key={club.id}
                    href={`/clubs`}
                    className="group aspect-square rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:border-blue-500/40 hover:bg-blue-500/10 hover:shadow-[0_0_20px_rgba(59,130,246,0.2)]"
                    title={club.name}
                  >
                    {club.logo ? (
                      <img
                        src={club.logo}
                        alt={`${club.name} logo`}
                        className="w-full h-full object-contain opacity-80 group-hover:opacity-100 transition-opacity"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-white/40 text-center leading-tight">
                        {club.name}
                      </div>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Tech Teams */}
          {techTeams.length > 0 && (
            <div className="mb-16">
              <h3 className="text-xl font-bold text-purple-400 uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
                <span className="h-px flex-1 bg-gradient-to-r from-purple-500/40 to-transparent" />
                Tech Teams
                <span className="h-px flex-1 bg-gradient-to-l from-purple-500/40 to-transparent" />
              </h3>
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-4">
                {techTeams.map((team) => (
                  <Link
                    key={team.id}
                    href={`/techteams`}
                    className="group aspect-square rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:border-purple-500/40 hover:bg-purple-500/10 hover:shadow-[0_0_20px_rgba(168,85,247,0.2)]"
                    title={team.name}
                  >
                    {team.logo ? (
                      <img
                        src={team.logo}
                        alt={`${team.name} logo`}
                        className="w-full h-full object-contain opacity-80 group-hover:opacity-100 transition-opacity"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-white/40 text-center leading-tight">
                        {team.name}
                      </div>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Communities */}
          {communities.length > 0 && (
            <div>
              <h3 className="text-xl font-bold text-pink-400 uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
                <span className="h-px flex-1 bg-gradient-to-r from-pink-500/40 to-transparent" />
                Communities
                <span className="h-px flex-1 bg-gradient-to-l from-pink-500/40 to-transparent" />
              </h3>
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-4">
                {communities.map((community) => (
                  <Link
                    key={community.id}
                    href={`/portals`}
                    className="group aspect-square rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:border-pink-500/40 hover:bg-pink-500/10 hover:shadow-[0_0_20px_rgba(236,72,153,0.2)]"
                    title={community.name}
                  >
                    {community.logo ? (
                      <img
                        src={community.logo}
                        alt={`${community.name} logo`}
                        className="w-full h-full object-contain opacity-80 group-hover:opacity-100 transition-opacity"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-white/40 text-center leading-tight">
                        {community.name}
                      </div>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ══ RECENT ACHIEVEMENTS ══════════════════════════════════════════ */}
      {achievements.length > 0 && (
        <section className="relative py-24 px-4">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.08),transparent_60%)]" />

          <div className="relative z-10 max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-300 to-rose-400">
                Recent Achievements
              </h2>
              <div className="mt-4 h-px w-20 bg-gradient-to-r from-transparent via-pink-500/60 to-transparent mx-auto" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {achievements.map((ach) => (
                <article
                  key={ach.id}
                  className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(14,18,32,0.7),rgba(10,12,22,0.4))] p-6 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.4)] transition-all duration-500 hover:-translate-y-2 hover:border-purple-400/30 hover:shadow-[0_30px_80px_rgba(168,85,247,0.2)]"
                >
                  <div className="pointer-events-none absolute -inset-x-10 -top-10 h-32 bg-gradient-to-r from-purple-600/15 via-pink-600/15 to-blue-600/15 blur-3xl opacity-0 transition-opacity duration-700 group-hover:opacity-100" />

                  <div className="relative flex items-start gap-5">
                    {/* Body logo */}
                    {ach.body?.logo && (
                      <Link href={`/clubs`} className="flex-shrink-0">
                        <div className="w-14 h-14 rounded-xl overflow-hidden border border-white/15 bg-black/50 group-hover:border-purple-400/40 transition-all duration-300 group-hover:scale-105">
                          <img
                            src={ach.body.logo}
                            alt={`${ach.body.name} logo`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </Link>
                    )}

                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-white group-hover:text-purple-200 transition-colors leading-snug mb-2">
                        {ach.title}
                      </h3>
                      <p className="text-sm text-slate-300/80 leading-relaxed line-clamp-3">
                        {ach.description}
                      </p>
                      {ach.date && (
                        <p className="mt-3 text-xs font-semibold text-purple-400 uppercase tracking-wider">
                          {new Date(ach.date).toLocaleDateString('en-US', {
                            month: 'long',
                            day: '2-digit',
                            year: 'numeric',
                          })}
                        </p>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* View all button */}
            <div className="mt-14 text-center">
              <Link
                href="/achievements"
                className="group inline-flex items-center gap-3 rounded-2xl border border-purple-500/30 bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-4 text-sm font-bold uppercase tracking-[0.2em] text-white shadow-[0_5px_30px_rgba(168,85,247,0.35)] transition-all duration-300 hover:scale-105 hover:shadow-[0_8px_40px_rgba(168,85,247,0.5)]"
              >
                View All Achievements
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ══ LATEST INTER-IIT TECH MEET ════════════════════════════════════ */}
      {interIITs.length > 0 && interIITs.map((d) => (
        <section key={d.id} className="relative py-24 px-4">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(234,179,8,0.08),transparent_55%),radial-gradient(circle_at_bottom,rgba(59,130,246,0.06),transparent_55%)]" />

          <div className="relative z-10 max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-300 to-amber-400">
                Latest Inter IIT Tech Meet
              </h2>
              <div className="mt-4 h-px w-20 bg-gradient-to-r from-transparent via-amber-500/60 to-transparent mx-auto" />
            </div>

            {/* Card */}
            <div className="group relative overflow-hidden rounded-[2.2rem] border border-white/12 bg-[linear-gradient(180deg,rgba(16,18,30,0.75),rgba(10,12,22,0.45))] shadow-[0_40px_120px_rgba(0,0,0,0.6)] backdrop-blur-2xl transition-all duration-500 hover:border-amber-400/30 hover:shadow-[0_40px_120px_rgba(245,158,11,0.15)]">
              {/* Background banner */}
              {d.img && (
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${d.img})` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-black/88 via-black/82 to-black/96 backdrop-blur-sm" />
                </div>
              )}

              <div className="relative flex flex-col lg:flex-row">
                {/* Left — header + medals */}
                <div className="w-full lg:w-1/2 p-8 sm:p-10 border-b lg:border-b-0 lg:border-r border-white/10 flex flex-col justify-between space-y-8">
                  <div className="flex items-center gap-6">
                    {d.logo && (
                      <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl overflow-hidden border-2 border-white/15 bg-black/60 shadow-2xl flex-shrink-0">
                        <img className="w-full h-full object-cover" src={d.logo} alt="IIT Logo" />
                      </div>
                    )}
                    <div>
                      <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight mb-1">
                        {d.title}
                      </h3>
                      <p className="text-base font-extrabold text-amber-400 tracking-wide">
                        {d.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Medals */}
                  <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/10">
                    {[
                      { count: d.bronze, label: 'Bronze', gradient: 'from-amber-700 to-yellow-600', color: 'text-amber-700', icon: '🥉' },
                      { count: d.gold,   label: 'Gold',   gradient: 'from-yellow-300 via-amber-400 to-yellow-500', color: 'text-amber-400', icon: '🥇' },
                      { count: d.silver, label: 'Silver', gradient: 'from-slate-100 to-slate-400', color: 'text-slate-300', icon: '🥈' },
                    ].map(({ count, label, gradient, color, icon }) => (
                      <div key={label} className="text-center group/medal">
                        <div className="text-3xl mb-2">{icon}</div>
                        <p className={`text-3xl sm:text-5xl font-black bg-gradient-to-r ${gradient} text-transparent bg-clip-text`}>
                          {count}
                        </p>
                        <span className={`text-[10px] font-bold uppercase tracking-[0.25em] ${color} opacity-80`}>
                          {label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right — description + problem statements */}
                <div className="w-full lg:w-1/2 p-8 sm:p-10 flex flex-col justify-between space-y-8">
                  <p className="text-slate-300/90 text-base leading-relaxed">
                    {d.description}
                  </p>

                  {d.problemstatements && d.problemstatements.length > 0 && (
                    <div className="overflow-hidden rounded-2xl border border-white/12 bg-black/40 backdrop-blur-md">
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

            {/* View full Hall of Fame */}
            <div className="mt-14 text-center">
              <Link
                href="/hall-of-fame"
                className="group inline-flex items-center gap-3 rounded-2xl border border-blue-500/30 bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-4 text-sm font-bold uppercase tracking-[0.2em] text-white shadow-[0_5px_30px_rgba(59,130,246,0.35)] transition-all duration-300 hover:scale-105 hover:shadow-[0_8px_40px_rgba(59,130,246,0.5)]"
              >
                View Full Hall of Fame
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </div>
        </section>
      ))}

      {/* ══ WORK REPORTS ══════════════════════════════════════════════════ */}
      {workReports.length > 0 && (
        <section className="relative py-24 px-4">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.07),transparent_60%)]" />

          <div className="relative z-10 max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-300 to-rose-400">
                Work Reports
              </h2>
              <div className="mt-4 h-px w-20 bg-gradient-to-r from-transparent via-purple-500/60 to-transparent mx-auto" />
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {workReports.map((report) => (
                <a
                  key={report.id}
                  href={report.url || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(14,18,32,0.7),rgba(10,12,22,0.4))] shadow-[0_20px_60px_rgba(0,0,0,0.4)] backdrop-blur-2xl transition-all duration-500 hover:-translate-y-2 hover:border-purple-400/30 hover:shadow-[0_30px_80px_rgba(168,85,247,0.2)] flex flex-col"
                >
                  <div className="pointer-events-none absolute -inset-x-10 -top-10 h-32 bg-gradient-to-r from-purple-600/15 via-pink-600/15 to-blue-600/15 blur-3xl opacity-0 transition-opacity duration-700 group-hover:opacity-100" />

                  {/* Thumbnail */}
                  {report.image && (
                    <div className="relative w-full overflow-hidden" style={{ paddingBottom: '56.25%' }}>
                      <img
                        src={report.image}
                        alt={report.title}
                        className="absolute inset-0 w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110 opacity-75 group-hover:opacity-90"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
                    </div>
                  )}

                  <div className="relative p-6 flex-1 flex flex-col justify-between">
                    <h3 className="text-xl font-bold text-white group-hover:text-purple-200 transition-colors leading-snug mb-4">
                      {report.title}
                    </h3>
                    <div className="flex items-center justify-between text-xs font-bold uppercase tracking-[0.25em] text-purple-400 group-hover:text-purple-300 transition-colors">
                      <span>View Report</span>
                      <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/12 bg-white/5 transition-transform group-hover:translate-x-1 group-hover:bg-purple-600/30 group-hover:border-purple-400/50">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══ FOOTER SPACER ════════════════════════════════════════════════ */}
      <div className="h-24 bg-gradient-to-t from-black/80 to-transparent" />
    </main>
  );
}
