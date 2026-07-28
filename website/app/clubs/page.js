'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Navbar from '../components/navbar';
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

const CLUB_DATA = [
  {
    Component: Intro,
    clubName: 'Intro',
    description: 'A full-screen opener for the clubs experience, built around the same entrance language used on the home page.',
    websiteUrl: 'https://tech-iitb.org/clubs/',
    instagramHandle: 'tech.iitb',
    linkedinUrl: 'https://www.linkedin.com/company/iitb-tech/',
    splineScene: 'https://prod.spline.design/2vNrWv1hlkDFdsiW/scene.splinecode',
  },
  {
    Component: Krittika,
    clubName: 'Krittika',
    description: 'Astronomy and astrophotography projects that turn curiosity about the night sky into hands-on exploration.',
    websiteUrl: 'https://tech-iitb.org/clubs/',
    instagramHandle: 'tech.iitb',
    linkedinUrl: 'https://www.linkedin.com/company/iitb-tech/',
    splineScene: 'https://prod.spline.design/vhWTM0J5b9R4G5Dn/scene.splinecode',
  },
  {
    Component: Aeromodelling,
    clubName: 'Aeromodelling',
    description: 'A flight-focused build space for projects that mix engineering, experimentation, and iterative design.',
    websiteUrl: 'https://tech-iitb.org/clubs/',
    instagramHandle: 'tech.iitb',
    linkedinUrl: 'https://www.linkedin.com/company/iitb-tech/',
    splineScene: 'https://prod.spline.design/ahCadaPjlOYB-Deh/scene.splinecode',
  },
  {
    Component: WnCC,
    clubName: 'WNCC',
    description: 'A community for coding, collaboration, and technical growth with a strong project-oriented rhythm.',
    websiteUrl: 'https://tech-iitb.org/clubs/',
    instagramHandle: 'tech.iitb',
    linkedinUrl: 'https://www.linkedin.com/company/iitb-tech/',
    splineScene: 'https://prod.spline.design/BI-mcBhItOMri26t/scene.splinecode',
  },
  {
    Component: Mnp,
    clubName: 'MNP',
    description: 'A makerspace for materials, nano-projects, and practical experimentation built for curious engineers.',
    websiteUrl: 'https://tech-iitb.org/clubs/',
    instagramHandle: 'tech.iitb',
    linkedinUrl: 'https://www.linkedin.com/company/iitb-tech/',
    splineScene: 'https://prod.spline.design/chkiXDhlBLZHp4QI/scene.splinecode',
  },
  {
    Component: Csec,
    clubName: 'CSEC',
    description: 'A systems and cybersecurity club built around secure thinking, careful debugging, and technical depth.',
    websiteUrl: 'https://tech-iitb.org/clubs/',
    instagramHandle: 'tech.iitb',
    linkedinUrl: 'https://www.linkedin.com/company/iitb-tech/',
    splineScene: 'https://prod.spline.design/PUgW0zr7D6hSOTbL/scene.splinecode',
  },
  {
    Component: Biox,
    clubName: 'BioX',
    description: 'An interdisciplinary club exploring biology, biotechnology, and computation through hands-on projects.',
    websiteUrl: 'https://tech-iitb.org/clubs/',
    instagramHandle: 'tech.iitb',
    linkedinUrl: 'https://www.linkedin.com/company/iitb-tech/',
    splineScene: 'https://prod.spline.design/BPQWXGJSsM-eExXQ/scene.splinecode',
  },
  {
    Component: Erc,
    clubName: 'ERC',
    description: 'A robotics and electronics club where prototyping, circuits, and embedded systems come together.',
    websiteUrl: 'https://tech-iitb.org/clubs/',
    instagramHandle: 'tech.iitb',
    linkedinUrl: 'https://www.linkedin.com/company/iitb-tech/',
    splineScene: 'https://prod.spline.design/emaIyFBXhsBa3YGI/scene.splinecode',
  },
  {
    Component: Tl,
    clubName: 'TL',
    description: 'A flexible technical learning space for members building interdisciplinary projects and leadership skills.',
    websiteUrl: 'https://tech-iitb.org/clubs/',
    instagramHandle: 'tech.iitb',
    linkedinUrl: 'https://www.linkedin.com/company/iitb-tech/',
    splineScene: 'https://prod.spline.design/AAEIPDFSVVUR9RpY/scene.splinecode',
  },
  {
    Component: Energy,
    clubName: 'Energy',
    description: 'A club dedicated to energy systems, sustainability, and practical engineering around power and efficiency.',
    websiteUrl: 'https://tech-iitb.org/clubs/',
    instagramHandle: 'tech.iitb',
    linkedinUrl: 'https://www.linkedin.com/company/iitb-tech/',
    splineScene: 'https://prod.spline.design/1kxdvBqKD-xqx4GS/scene.splinecode',
  },
  {
    Component: Chemetl,
    clubName: 'ChemETL',
    description: 'An applied chemistry and process-technology club for projects spanning experimentation and scale-up thinking.',
    websiteUrl: 'https://tech-iitb.org/clubs/',
    instagramHandle: 'tech.iitb',
    linkedinUrl: 'https://www.linkedin.com/company/iitb-tech/',
    splineScene: 'https://prod.spline.design/OxLHXGyVJ5nd07Wn/scene.splinecode',
  },
  {
    Component: Quant,
    clubName: 'Quant',
    description: 'A quantitative club for modeling, data-driven thinking, and the kind of problem solving that rewards precision.',
    websiteUrl: 'https://tech-iitb.org/clubs/',
    instagramHandle: 'tech.iitb',
    linkedinUrl: 'https://www.linkedin.com/company/iitb-tech/',
    splineScene: 'https://prod.spline.design/famZuWYiG2zvy9UF/scene.splinecode',
  },
];

export default function ClubsPage() {
  const sectionRefs = useRef([]);
  const [seenSections, setSeenSections] = useState(() => CLUB_DATA.map((_, index) => index === 0));

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        setSeenSections((current) => {
          const next = [...current];
          let changed = false;

          for (const entry of entries) {
            const sectionIndex = Number(entry.target.getAttribute('data-section-index'));

            if (entry.isIntersecting && !next[sectionIndex]) {
              next[sectionIndex] = true;
              changed = true;
            }
          }

          return changed ? next : current;
        });
      },
      {
        threshold: 0.45,
        rootMargin: '0px 0px -10% 0px',
      },
    );

    sectionRefs.current.forEach((section) => {
      if (section) {
        observer.observe(section);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  const clubSections = useMemo(
    () =>
      CLUB_DATA.map((club, index) => ({
        ...club,
        isVisible: seenSections[index],
        ref: (node) => {
          sectionRefs.current[index] = node;
        },
      })),
    [seenSections],
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
            />
          </div>
        );
      })}
    </main>
  );
}