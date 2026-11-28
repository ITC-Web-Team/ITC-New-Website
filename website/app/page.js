'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import Spline from '@/app/components/OptimizedSpline';
import ITC from './components/ITC';
import About from './components/about';
import Navbar from './components/navbar';
import Footer from './components/footer';
import {
  SectionHeader,
  AchievementCard,
  InterIITCard,
  ArrowRightIcon,
  ArrowUpRightIcon,
} from './components/ui';
import {
  fetchBodies,
  fetchAchievements,
  fetchInterIIT,
  fetchWorkReports,
  isCsecBody,
} from '@/lib/api';

// ─── Scroll-based hero → about transition ──────────────────────────────────
export default function Home() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const targetProgressRef = useRef(0);
  const animationFrameRef = useRef(null);
  const wheelLockRef = useRef(false);
  const homeBgRef = useRef(null);

  // Secondary sections data
  const [clubs, setClubs] = useState([]);
  const [techTeams, setTechTeams] = useState([]);
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
        const asList = (result) => {
          if (result.status !== 'fulfilled') return [];
          const data = result.value;
          return Array.isArray(data) ? data : data?.results || [];
        };
        const clubBodies = asList(clubData);
        const communityBodies = asList(communityData);
        const clubsWithCsec = [...clubBodies];

        for (const body of communityBodies) {
          if (
            isCsecBody(body) &&
            !clubsWithCsec.some((club) => isCsecBody(club))
          ) {
            clubsWithCsec.push(body);
          }
        }

        setClubs(
          clubsWithCsec.sort((a, b) =>
            String(a.name || '').localeCompare(String(b.name || ''))
          )
        );
        if (teamData.status === 'fulfilled') {
          const d = teamData.value;
          setTechTeams(Array.isArray(d) ? d : d.results || []);
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

  // Lock normal scrolling while the transition is not fully complete (scrollProgress < 1)
  useEffect(() => {
    if (scrollProgress < 1) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [scrollProgress]);

  // Set scrollRestoration to manual and force scroll to top on load to prevent getting stuck on back navigation
  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
    return () => {
      if ('scrollRestoration' in history) {
        history.scrollRestoration = 'auto';
      }
    };
  }, []);

  // ── Smooth wheel-scroll transition logic ──────────────────────────────────
  useEffect(() => {
    const animateProgress = () => {
      setScrollProgress((cur) => {
        const next = cur + (targetProgressRef.current - cur) * 0.22; // Snappier, faster transition ease
        if (Math.abs(targetProgressRef.current - next) < 0.001) {
          animationFrameRef.current = null;
          return targetProgressRef.current;
        }
        animationFrameRef.current = window.requestAnimationFrame(animateProgress);
        return next;
      });
    };

    const handleWheel = (event) => {
      // If we are below the fold, let normal scrolling happen
      if (window.scrollY > 0) return;

      const direction = event.deltaY > 0 ? 1 : -1;

      // Scrolling DOWN but transition already complete → let normal scroll handle it
      if (direction > 0 && targetProgressRef.current >= 1) return;
      // Scrolling UP but already at the beginning → let normal scroll handle it
      if (direction < 0 && targetProgressRef.current <= 0) return;

      // We are in the transition phase: block default scrolling!
      event.preventDefault();

      if (wheelLockRef.current) return;

      // 1.0 step triggers transition in a single distinct wheel scroll action
      const step = 1.0;
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
      }, 400); // Reduced lock from 800ms to 400ms for responsiveness
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      window.removeEventListener('wheel', handleWheel);
      if (animationFrameRef.current !== null)
        window.cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  // Suppress home bg pointer events while scrolling so scroll isn't captured by Spline
  useEffect(() => {
    const el = homeBgRef.current;
    if (!el) return;
    let t = null;
    const onScroll = () => {
      el.style.pointerEvents = 'none';
      clearTimeout(t);
      t = setTimeout(() => { el.style.pointerEvents = 'auto'; }, 300);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { window.removeEventListener('scroll', onScroll); clearTimeout(t); };
  }, []);

  const itcOpacity = Math.max(0, 1 - scrollProgress * 1.15);
  const aboutOpacity = Math.max(0, Math.min(1, (scrollProgress - 0.18) * 1.18));
  const itcTransform = `translateY(${scrollProgress * -18}px) scale(${1 - scrollProgress * 0.02})`;
  const aboutTransform = `translateY(${Math.max(0, (1 - scrollProgress) * 18)}px) scale(${0.985 + scrollProgress * 0.015})`;

  return (
    <main className="relative bg-[#030303] text-[#f0f0f5]" style={{ fontFamily: 'var(--font-body)' }}>
      <Navbar />

      {/* ══ ABOUT SPLINE — fixed, interactive, scroll-aware background ═══════════ */}
      <div ref={homeBgRef} className="fixed inset-0 z-0 pointer-events-auto">
        <Spline
          scene="https://prod.spline.design/DeRwt5-Ygauh9zYX/scene.splinecode"
          style={{ width: '100%', height: '100%', transform: 'scale(1.02)', pointerEvents: 'auto' }}
        />
        {/* Ultra-light bottom vignette only */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20 pointer-events-none" />
      </div>

      {/* ══ HERO SECTION (scroll-based ITC → About) ══════════════════════ */}
      <section className="relative z-10 h-screen overflow-hidden">
        {/* Dark bg fades out as About slides in, revealing the fixed Spline */}
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(124,92,246,0.12),transparent_45%),linear-gradient(180deg,#050505_0%,#060509_55%,#020202_100%)]"
          style={{ opacity: Math.max(0, 1 - scrollProgress * 1.8) }}
        />

        {/* ITC 3D scene */}
        <div
          className="absolute inset-0 transition-[opacity,transform] duration-300 ease-out"
          style={{
            opacity: itcOpacity,
            transform: itcTransform,
            pointerEvents: scrollProgress > 0.45 ? 'none' : 'auto',
          }}
        >
          <ITC paused={scrollProgress >= 1} />
        </div>

        {/* About panel */}
        <div
          className="absolute inset-0 transition-[opacity,transform] duration-300 ease-out"
          style={{
            opacity: aboutOpacity,
            transform: aboutTransform,
            pointerEvents: scrollProgress < 0.2 ? 'none' : 'auto',
          }}
        >
          <About />
        </div>

        {/* Scroll hint */}
        <div
          className="pointer-events-none absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3 text-xs text-violet-200/55 transition-opacity duration-300"
          style={{ opacity: Math.max(0, 1 - scrollProgress * 2) }}
        >
          Scroll
          <span className="relative h-10 w-px overflow-hidden bg-white/15">
            <span className="absolute inset-x-0 top-0 h-1/2 animate-[scroll-hint_1.8s_ease-in-out_infinite] bg-white/70 motion-reduce:animate-none" />
          </span>
        </div>
      </section>

      {/* Everything below the hero sits on a dark scrim so text stays readable over the 3D scene */}
      <div className="relative z-10 bg-[linear-gradient(180deg,rgba(10,5,20,0)_0%,rgba(10,5,20,0.8)_10rem,rgba(8,4,16,0.92)_100%)]">

        {/* ══ EXPLORE ═════════════════════════════════════════════════════ */}
        <section className="mx-auto max-w-7xl px-5 pb-20 pt-32 sm:px-8 lg:px-10">
          <SectionHeader title="Find your place at ITC" />
          <div className="grid gap-5 lg:grid-cols-5">
            <ExploreCard
              className="lg:col-span-3"
              href="/clubs"
              title="Clubs"
              text="Interest-driven communities, from astronomy and robotics to quant finance and coding."
              cta="Browse clubs"
              items={clubs}
              countLabel="clubs"
            />
            <ExploreCard
              className="lg:col-span-2"
              href="/events"
              title="Events"
              text="Workshops, sessions and competitions from every club, all in one calendar."
              cta="See the calendar"
              preview={<CalendarPreview />}
            />
            <ExploreCard
              className="lg:col-span-2"
              href="/portals"
              title="Portals"
              text="Tools and web apps built by ITC for the campus."
              cta="Open portals"
              preview={<PortalPreview />}
            />
            <ExploreCard
              className="lg:col-span-3"
              href="/techteams"
              title="Tech teams"
              text="Competition teams designing and building racecars, rockets, rovers, satellites and underwater vehicles."
              cta="Meet the teams"
              items={techTeams}
              countLabel="teams"
            />
          </div>
        </section>

        {/* ══ OUR FAMILY ══════════════════════════════════════════════════ */}
        {(clubs.length > 0 || techTeams.length > 0) && (
          <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10">
            <SectionHeader
              title="Our family"
              description={`${clubs.length} clubs and ${techTeams.length} tech teams under one council.`}
            />
            <LogoGroup title="Clubs" href="/clubs" items={clubs} />
            <LogoGroup title="Tech teams" href="/techteams" items={techTeams} />
          </section>
        )}

        {/* ══ RECENT ACHIEVEMENTS ════════════════════════════════════════ */}
        {achievements.length > 0 && (
          <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10">
            <SectionHeader
              title="Recent achievements"
              action={{ href: '/achievements', label: 'All achievements' }}
            />
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {achievements.map((ach) => (
                <AchievementCard key={ach.id} achievement={ach} />
              ))}
            </div>
          </section>
        )}

        {/* ══ LATEST INTER-IIT TECH MEET ═════════════════════════════════ */}
        {interIITs.length > 0 && (
          <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10">
            <SectionHeader
              title="Latest Inter IIT Tech Meet"
              action={{ href: '/halloffame', label: 'Full Hall of Fame' }}
            />
            {interIITs.map((meet) => (
              <InterIITCard key={meet.id} meet={meet} />
            ))}
          </section>
        )}

        {/* ══ WORK REPORTS ═══════════════════════════════════════════════ */}
        {workReports.length > 0 && (
          <section className="mx-auto max-w-7xl px-5 pb-28 pt-20 sm:px-8 lg:px-10">
            <SectionHeader
              title="Work reports"
              description="What the council set out to do, and what it delivered."
            />
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {workReports.map((report) => (
                <a
                  key={report.id}
                  href={report.url || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="card card-link group flex flex-col overflow-hidden"
                >
                  {report.image && (
                    <div className="aspect-video w-full overflow-hidden border-b border-violet-300/[0.1]">
                      <img src={report.image} alt="" loading="lazy" className="h-full w-full object-cover" />
                    </div>
                  )}
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="text-lg font-semibold leading-snug text-white">{report.title}</h3>
                    <span className="mt-auto inline-flex items-center gap-1.5 pt-6 text-sm font-medium text-violet-300 transition-colors group-hover:text-violet-200">
                      Read report
                      <ArrowUpRightIcon className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}
      </div>

      <Footer />
    </main>
  );
}

function ExploreCard({ className = '', href, title, text, cta, items, countLabel, preview }) {
  const logos = (items || []).filter((item) => item.logo);
  const shown = logos.slice(0, 7);
  const extra = (items || []).length - shown.length;

  return (
    <Link
      href={href}
      className={`card card-link group relative flex flex-col overflow-hidden p-7 sm:p-8 ${className}`}
    >
      {/* Soft purple glow in the corner that warms up on hover */}
      <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-violet-500/10 blur-3xl transition-colors duration-500 group-hover:bg-violet-500/20" />

      <div className="relative flex flex-1 flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="max-w-sm">
          <h3 className="text-2xl font-semibold tracking-tight text-white">
            {title}
            {items?.length > 0 && (
              <span className="ml-2 align-middle text-base font-medium tabular-nums text-violet-300">
                {items.length} {countLabel}
              </span>
            )}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-violet-100/60">{text}</p>
          <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-violet-300 transition-colors group-hover:text-violet-200">
            {cta}
            <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>

        {shown.length > 0 && (
          <div className="flex shrink-0 items-center">
            {shown.map((item, i) => (
              <img
                key={item.id}
                src={item.logo}
                alt=""
                loading="lazy"
                style={{ zIndex: shown.length - i }}
                className="-ml-3 h-12 w-12 rounded-full border-2 border-[#1c1033] object-cover transition-transform duration-300 first:ml-0 group-hover:-translate-y-1"
              />
            ))}
            {extra > 0 && (
              <span className="-ml-3 flex h-12 w-12 items-center justify-center rounded-full border-2 border-[#1c1033] bg-violet-600 text-xs font-semibold text-white">
                +{extra}
              </span>
            )}
          </div>
        )}

        {preview && <div className="relative shrink-0">{preview}</div>}
      </div>
    </Link>
  );
}

/** Small decorative month grid for the Events card. */
function CalendarPreview() {
  const marked = new Set([3, 8, 9, 15, 19, 24]);
  return (
    <div aria-hidden="true" className="grid grid-cols-7 gap-1 rounded-xl border border-violet-300/15 bg-black/30 p-2.5">
      {Array.from({ length: 28 }, (_, i) => (
        <span
          key={i}
          className={`h-3.5 w-3.5 rounded-[4px] ${
            marked.has(i) ? 'bg-violet-500 transition-colors group-hover:bg-violet-400' : 'bg-violet-300/10'
          }`}
        />
      ))}
    </div>
  );
}

/** Small decorative browser window for the Portals card. */
function PortalPreview() {
  return (
    <div aria-hidden="true" className="w-36 overflow-hidden rounded-xl border border-violet-300/15 bg-black/30">
      <div className="flex gap-1 border-b border-violet-300/10 px-2.5 py-2">
        <span className="h-1.5 w-1.5 rounded-full bg-violet-300/30" />
        <span className="h-1.5 w-1.5 rounded-full bg-violet-300/30" />
        <span className="h-1.5 w-1.5 rounded-full bg-violet-300/30" />
      </div>
      <div className="space-y-1.5 p-2.5">
        <span className="block h-2 w-3/4 rounded bg-violet-500/70" />
        <span className="block h-1.5 w-full rounded bg-violet-300/15" />
        <span className="block h-1.5 w-5/6 rounded bg-violet-300/15" />
        <div className="grid grid-cols-3 gap-1 pt-1">
          <span className="h-5 rounded bg-violet-300/10" />
          <span className="h-5 rounded bg-violet-300/10" />
          <span className="h-5 rounded bg-violet-500/40" />
        </div>
      </div>
    </div>
  );
}

function LogoGroup({ title, href, items }) {
  if (!items.length) return null;
  return (
    <div className="mb-16 last:mb-0">
      <div className="mb-5 flex items-baseline justify-between">
        <h3 className="text-base font-medium text-white">
          {title} <span className="ml-1 text-violet-200/45">{items.length}</span>
        </h3>
        <Link href={href} className="text-sm text-violet-300 transition-colors hover:text-violet-200">
          View all
        </Link>
      </div>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
        {items.map((item) => (
          <Link key={item.id} href={href} title={item.name} className="card card-link group flex flex-col items-center p-3">
            <div className="aspect-square w-full overflow-hidden rounded-lg bg-violet-500/10">
              {item.logo ? (
                <img src={item.logo} alt="" loading="lazy" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xs text-violet-200/50">{item.name}</div>
              )}
            </div>
            <p className="mt-2.5 w-full truncate text-center text-xs text-violet-100/60 transition-colors group-hover:text-violet-50">
              {item.name}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
