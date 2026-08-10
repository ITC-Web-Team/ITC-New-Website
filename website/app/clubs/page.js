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

// ── Spline scenes per club (UI-only, not stored in DB) ──────────────────────
const CLUB_SPLINE = {
  Intro:          'https://prod.spline.design/2vNrWv1hlkDFdsiW/scene.splinecode',
  Krittika:       'https://prod.spline.design/vhWTM0J5b9R4G5Dn/scene.splinecode',
  WNCC:           'https://prod.spline.design/BI-mcBhItOMri26t/scene.splinecode',
  WnCC:           'https://prod.spline.design/BI-mcBhItOMri26t/scene.splinecode',
  MnP:            'https://prod.spline.design/chkiXDhlBLZHp4QI/scene.splinecode',
  Mnp:            'https://prod.spline.design/chkiXDhlBLZHp4QI/scene.splinecode',
  CSEC:           'https://prod.spline.design/PUgW0zr7D6hSOTbL/scene.splinecode',
  Csec:           'https://prod.spline.design/PUgW0zr7D6hSOTbL/scene.splinecode',
  BioX:           'https://prod.spline.design/BPQWXGJSsM-eExXQ/scene.splinecode',
  Biox:           'https://prod.spline.design/BPQWXGJSsM-eExXQ/scene.splinecode',
  ERC:            'https://prod.spline.design/emaIyFBXhsBa3YGI/scene.splinecode',
  Erc:            'https://prod.spline.design/emaIyFBXhsBa3YGI/scene.splinecode',
  'Tinkerers Lab':'https://prod.spline.design/AAEIPDFSVVUR9RpY/scene.splinecode',
  TL:             'https://prod.spline.design/AAEIPDFSVVUR9RpY/scene.splinecode',
  Tl:             'https://prod.spline.design/AAEIPDFSVVUR9RpY/scene.splinecode',
  'Energy Club':  'https://prod.spline.design/1kxdvBqKD-xqx4GS/scene.splinecode',
  Energy:         'https://prod.spline.design/1kxdvBqKD-xqx4GS/scene.splinecode',
  ChemETL:        'https://prod.spline.design/OxLHXGyVJ5nd07Wn/scene.splinecode',
  Chemetl:        'https://prod.spline.design/OxLHXGyVJ5nd07Wn/scene.splinecode',
  'Quant Club':   'https://prod.spline.design/famZuWYiG2zvy9UF/scene.splinecode',
  Quant:          'https://prod.spline.design/famZuWYiG2zvy9UF/scene.splinecode',
  Aeromodelling:  'https://prod.spline.design/ahCadaPjlOYB-Deh/scene.splinecode',
};

// ── Ordered component map (Aeromodelling is last among clubs) ─────────────────
// Key: lowercase name used for matching DB entries
const CLUB_COMPONENTS = [
  { key: 'krittika',      Component: Krittika,      fallbackName: 'Krittika',      preload: false  },
  { key: 'wncc',          Component: WnCC,           fallbackName: 'WNCC',           preload: false },
  { key: 'mnp',           Component: Mnp,            fallbackName: 'MnP',            preload: false },
  { key: 'csec',          Component: Csec,           fallbackName: 'CSEC',           preload: false  },
  { key: 'biox',          Component: Biox,           fallbackName: 'BioX',           preload: false },
  { key: 'erc',           Component: Erc,            fallbackName: 'ERC',            preload: false },
  { key: 'tinkerers',     Component: Tl,             fallbackName: 'Tinkerers Lab', preload: false },
  { key: 'energy',        Component: Energy,         fallbackName: 'Energy Club',   preload: false },
  { key: 'chemetl',       Component: Chemetl,        fallbackName: 'ChemETL',       preload: false },
  { key: 'quant',         Component: Quant,          fallbackName: 'Quant Club',    preload: false },
  { key: 'aeromodelling', Component: Aeromodelling,  fallbackName: 'Aeromodelling', preload: true  },
];

// Match a DB body to one of our component keys (case-insensitive substring)
function matchComponent(body) {
  const haystack = (body.name || '').toLowerCase();
  return CLUB_COMPONENTS.find(({ key }) => haystack.includes(key)) || null;
}

// Build a club entry, merging DB data with static UI config
function buildClubEntry({ Component, fallbackName, preload, body }) {
  const name    = body?.name        || fallbackName;
  const spline  = CLUB_SPLINE[name] || CLUB_SPLINE[fallbackName] || '';
  return {
    Component,
    clubName:        name,
    description:     body?.description || body?.about || '',
    websiteUrl:      body?.website     || null,
    instagramHandle: body?.instagram   || null,
    linkedinUrl:     body?.linkedin    || null,
    splineScene:     spline,
    preload,
  };
}

export default function ClubsPage() {
  const sectionRefs   = useRef([]);
  
  // Pre-initialize with Intro slide so it mounts and preloads its Spline scene instantly on page load
  const [clubs, setClubs] = useState([
    {
      Component:       Intro,
      clubName:        'Intro',
      description:     '',
      websiteUrl:      null,
      instagramHandle: null,
      linkedinUrl:     null,
      splineScene:     CLUB_SPLINE.Intro,
      preload:         true,
    }
  ]);
  const [seenSections, setSeenSections] = useState([true]);

  // ── Fetch clubs from backend, merge with component map ──────────────────
  useEffect(() => {
    fetchBodies(0).then((data) => {
      const bodies = Array.isArray(data) ? data : (data.results || []);

      const ordered = CLUB_COMPONENTS.map((cfg) => {
        const body = bodies.find((b) => matchComponent(b)?.key === cfg.key);
        return buildClubEntry({ ...cfg, body });
      });

      setClubs((prev) => [prev[0], ...ordered]);
      setSeenSections((prev) => [true, ...ordered.map(() => false)]);
    });
  }, []);

  // ── Intersection observer (lazy-render Spline scenes) ────────────────────
  useEffect(() => {
    if (!clubs || clubs.length <= 1) return;

    const observer = new IntersectionObserver(
      (entries) => {
        setSeenSections((current) => {
          const next = [...current];
          let changed = false;
          for (const entry of entries) {
            const idx = Number(entry.target.getAttribute('data-section-index'));
            if (entry.isIntersecting && !next[idx]) {
              next[idx] = true;
              changed = true;
            }
          }
          return changed ? next : current;
        });
      },
      { threshold: 0.45, rootMargin: '0px 0px -10% 0px' },
    );

    sectionRefs.current.forEach((el) => { if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, [clubs]);

  const clubSections = useMemo(
    () =>
      clubs.map((club, index) => ({
        ...club,
        isVisible: seenSections[index] ?? false,
        ref: (node) => { sectionRefs.current[index] = node; },
      })),
    [clubs, seenSections],
  );

  return (
    <main className="relative overflow-x-hidden bg-black text-white">
      <Navbar />

      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top,rgba(168,85,247,0.16),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.08),transparent_30%)]" />

      {clubSections.map((club, index) => {
        const ClubComponent = club.Component;
        return (
          <div
            key={club.clubName}
            ref={club.ref}
            data-section-index={index}
            className="relative"
          >
            <ClubComponent
              index={index}
              isVisible={club.isVisible}
              clubName={club.clubName}
              description={club.description}
              websiteUrl={club.websiteUrl}
              instagramHandle={club.instagramHandle}
              linkedinUrl={club.linkedinUrl}
              splineScene={club.splineScene}
              preload={club.preload}
            />
          </div>
        );
      })}
      <Footer />
    </main>
  );
}