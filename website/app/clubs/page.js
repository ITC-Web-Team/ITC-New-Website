
'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import Intro from '../components/Club_Comps/intro';
import Krittika from '../components/Club_Comps/Krittika';
import Aeromodelling from '../components/Club_Comps/Aeromoddelling';
import WnCC from '../components/Club_Comps/WnCC';
import Mnp from '../components/Club_Comps/Mnp';
import Csec from '../components/Club_Comps/Csec';
import Biox from '../components/Club_Comps/Biox';
import Erc from '../components/Club_Comps/Erc';
import Tl from '../components/Club_Comps/Tl';
import Energy from '../components/Club_Comps/Energy';
import Chemetl from '../components/Club_Comps/Chemetl';
import Quant from '../components/Club_Comps/Quant';
import { fetchBodies } from '@/lib/api';
import { preloadSplineScenes } from '@/lib/splinePreload';

const CLUB_SPLINE = {
  Intro: 'https://prod.spline.design/2vNrWv1hlkDFdsiW/scene.splinecode',
  Krittika: 'https://prod.spline.design/vhWTM0J5b9R4G5Dn/scene.splinecode',
  WNCC: 'https://prod.spline.design/BI-mcBhItOMri26t/scene.splinecode',
  WnCC: 'https://prod.spline.design/BI-mcBhItOMri26t/scene.splinecode',
  MnP: 'https://prod.spline.design/chkiXDhlBLZHp4QI/scene.splinecode',
  Mnp: 'https://prod.spline.design/chkiXDhlBLZHp4QI/scene.splinecode',
  CSEC: 'https://prod.spline.design/PUgW0zr7D6hSOTbL/scene.splinecode',
  Csec: 'https://prod.spline.design/PUgW0zr7D6hSOTbL/scene.splinecode',
  BioX: 'https://prod.spline.design/BPQWXGJSsM-eExXQ/scene.splinecode',
  Biox: 'https://prod.spline.design/BPQWXGJSsM-eExXQ/scene.splinecode',
  ERC: 'https://prod.spline.design/emaIyFBXhsBa3YGI/scene.splinecode',
  Erc: 'https://prod.spline.design/emaIyFBXhsBa3YGI/scene.splinecode',
  'Tinkerers Lab': 'https://prod.spline.design/AAEIPDFSVVUR9RpY/scene.splinecode',
  TL: 'https://prod.spline.design/AAEIPDFSVVUR9RpY/scene.splinecode',
  Tl: 'https://prod.spline.design/AAEIPDFSVVUR9RpY/scene.splinecode',
  'Energy Club': 'https://prod.spline.design/1kxdvBqKD-xqx4GS/scene.splinecode',
  Energy: 'https://prod.spline.design/1kxdvBqKD-xqx4GS/scene.splinecode',
  ChemETL: 'https://prod.spline.design/OxLHXGyVJ5nd07Wn/scene.splinecode',
  Chemetl: 'https://prod.spline.design/OxLHXGyVJ5nd07Wn/scene.splinecode',
  'Quant Club': 'https://prod.spline.design/famZuWYiG2zvy9UF/scene.splinecode',
  Quant: 'https://prod.spline.design/famZuWYiG2zvy9UF/scene.splinecode',
  Aeromodelling: 'https://prod.spline.design/ahCadaPjlOYB-Deh/scene.splinecode',
};

// Large scene files that take longest to download — preloaded early on the
// clubs page so they're ready before the user reaches them.
const HEAVY_SCENES = [CLUB_SPLINE.Krittika, CLUB_SPLINE.CSEC, CLUB_SPLINE.BioX];

const CLUB_COMPONENTS = [
  { key: 'krittika', Component: Krittika, fallbackName: 'Krittika' },
  { key: 'wncc', Component: WnCC, fallbackName: 'WNCC' },
  { key: 'mnp', Component: Mnp, fallbackName: 'MnP' },
  { key: 'csec', Component: Csec, fallbackName: 'CSEC' },
  { key: 'biox', Component: Biox, fallbackName: 'BioX' },
  { key: 'erc', Component: Erc, fallbackName: 'ERC' },
  { key: 'tinkerers', Component: Tl, fallbackName: 'Tinkerers Lab' },
  { key: 'energy', Component: Energy, fallbackName: 'Energy Club' },
  { key: 'chemetl', Component: Chemetl, fallbackName: 'ChemETL' },
  { key: 'quant', Component: Quant, fallbackName: 'Quant Club' },
  { key: 'aeromodelling', Component: Aeromodelling, fallbackName: 'Aeromodelling' },
];

function matchComponent(body) {
  const name = (body.name || '').toLowerCase();
  return CLUB_COMPONENTS.find(({ key }) => name.includes(key)) || null;
}

function buildClubEntry({ Component, fallbackName, body }) {
  const name = body?.name || fallbackName;

  return {
    Component,
    clubName: name,
    description: body?.description || body?.about || '',
    websiteUrl: body?.website || null,
    instagramHandle: body?.instagram || null,
    linkedinUrl: body?.linkedin || null,
    splineScene: CLUB_SPLINE[name] || CLUB_SPLINE[fallbackName] || '',
  };
}

export default function ClubsPage() {
  const [clubs, setClubs] = useState([
    {
      Component: Intro,
      clubName: 'Intro',
      description: '',
      websiteUrl: null,
      instagramHandle: null,
      linkedinUrl: null,
      splineScene: CLUB_SPLINE.Intro,
    },
  ]);

  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartX = useRef(null);
  const wheelLock = useRef(false);

  // Fetch club information from the backend.
  useEffect(() => {
    let cancelled = false;

    fetchBodies(0)
      .then((data) => {
        if (cancelled) return;

        const bodies = Array.isArray(data)
          ? data
          : data?.results || [];

        const ordered = CLUB_COMPONENTS.map((cfg) => {
          const body = bodies.find(
            (item) => matchComponent(item)?.key === cfg.key
          );

          return buildClubEntry({ ...cfg, body });
        });

        setClubs((previous) => [previous[0], ...ordered]);
      })
      .catch((error) => {
        console.error('Failed to fetch clubs:', error);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const totalClubs = clubs.length;

  const goTo = (index) => {
    setActiveIndex(Math.max(0, Math.min(index, totalClubs - 1)));
  };

  const nextClub = () => goTo(activeIndex + 1);
  const previousClub = () => goTo(activeIndex - 1);

  // Keyboard navigation.
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'ArrowRight') {
        setActiveIndex((index) => Math.min(index + 1, totalClubs - 1));
      }

      if (event.key === 'ArrowLeft') {
        setActiveIndex((index) => Math.max(index - 1, 0));
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [totalClubs]);

  // Swipe and horizontal trackpad navigation.
  const handleTouchStart = (event) => {
    touchStartX.current = event.touches[0].clientX;
  };

  const handleTouchEnd = (event) => {
    if (touchStartX.current === null) return;

    const distance =
      touchStartX.current - event.changedTouches[0].clientX;

    if (Math.abs(distance) > 60) {
      if (distance > 0) nextClub();
      else previousClub();
    }

    touchStartX.current = null;
  };

  // Only horizontal trackpad gestures change slides; vertical scrolling does not.
  const handleWheel = (event) => {
    const isHorizontalSwipe = Math.abs(event.deltaX) > Math.abs(event.deltaY);

    if (!isHorizontalSwipe || Math.abs(event.deltaX) < 35 || wheelLock.current) return;

    if (
      (event.deltaX > 0 && activeIndex === totalClubs - 1) ||
      (event.deltaX < 0 && activeIndex === 0)
    ) {
      return;
    }

    event.preventDefault();

    wheelLock.current = true;

    if (event.deltaX > 0) nextClub();
    else previousClub();

    // Allow another wheel gesture after the transition begins.
    setTimeout(() => {
      wheelLock.current = false;
    }, 700);
  };

  // Download the upcoming slides' 3D scenes in the background, so they open
  // without a loading wait when the user moves to them. The next slide comes
  // first, then the heaviest scenes, then the remaining nearby slides.
  useEffect(() => {
    const timer = setTimeout(() => {
      const nearby = [activeIndex + 1, activeIndex + 2, activeIndex - 1]
        .filter((i) => i >= 0 && i < clubs.length)
        .map((i) => clubs[i].splineScene);
      preloadSplineScenes([nearby[0], ...HEAVY_SCENES, ...nearby.slice(1)]);
    }, 1500);
    return () => clearTimeout(timer);
  }, [activeIndex, clubs]);

  const clubSections = useMemo(
    () =>
      clubs.map((club, index) => ({
        ...club,
        isVisible: index === activeIndex,
        mountScene: index === activeIndex,
      })),
    [clubs, activeIndex]
  );

  return (
    <main className="relative overflow-x-hidden bg-black text-white">
      <Navbar />

      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_at_top,rgba(168,85,247,0.16),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.08),transparent_30%)]" />

      {/* Horizontal club carousel */}
      <section
        className="relative w-full overflow-hidden"
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="flex w-full"
          style={{
            transform: `translateX(-${activeIndex * 100}%)`,
            transition: 'transform 650ms cubic-bezier(0.22, 1, 0.36, 1)',
            willChange: 'transform',
          }}
        >
          {clubSections.map((club, index) => {
            const ClubComponent = club.Component;

            return (
              <div
                key={club.clubName}
                className="relative w-full shrink-0"
                aria-hidden={index !== activeIndex}
              >
                <ClubComponent
                  isVisible={club.isVisible}
                  clubName={club.clubName}
                  description={club.description}
                  websiteUrl={club.websiteUrl}
                  instagramHandle={club.instagramHandle}
                  linkedinUrl={club.linkedinUrl}
                  splineScene={club.splineScene}
                  mountScene={club.mountScene}
                />
              </div>
            );
          })}
        </div>

        {/* Previous button */}
        <button
          type="button"
          onClick={previousClub}
          disabled={activeIndex === 0}
          aria-label="Previous club"
          className="absolute left-3 top-1/2 z-40 -translate-y-1/2 rounded-full border border-white/20 bg-black/60 p-3 text-white backdrop-blur-md transition hover:bg-purple-600 disabled:cursor-not-allowed disabled:opacity-30 sm:left-6"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>

        {/* Next button */}
        <button
          type="button"
          onClick={nextClub}
          disabled={activeIndex === totalClubs - 1}
          aria-label="Next club"
          className="absolute right-3 top-1/2 z-40 -translate-y-1/2 rounded-full border border-white/20 bg-black/60 p-3 text-white backdrop-blur-md transition hover:bg-purple-600 disabled:cursor-not-allowed disabled:opacity-30 sm:right-6"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
        </button>

        {/* Slide indicator */}
        <div className="absolute bottom-5 left-1/2 z-40 flex max-w-[85%] -translate-x-1/2 items-center justify-center gap-2">
          {clubs.map((club, index) => (
            <button
              key={club.clubName}
              type="button"
              onClick={() => goTo(index)}
              aria-label={`Go to ${club.clubName}`}
              aria-current={index === activeIndex ? 'step' : undefined}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === activeIndex
                  ? 'w-7 bg-purple-400'
                  : 'w-2 bg-white/40 hover:bg-white/80'
              }`}
            />
          ))}
        </div>

        {/* Current slide name and position */}
        <div className="absolute right-5 top-5 z-40 rounded-full border border-white/15 bg-black/50 px-3 py-1.5 text-xs text-white/80 backdrop-blur-md">
          {activeIndex + 1} / {totalClubs}
        </div>
      </section>

      <Footer />
    </main>
  );
}
