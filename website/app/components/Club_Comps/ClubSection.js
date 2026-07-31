'use client';

import Image from 'next/image';
import SplineScene from './SplineScene';

function normalizeUrl(value) {
  if (!value) {
    return '#';
  }

  return value;
}

function instagramUrlFromHandle(handle) {
  if (!handle) {
    return '#';
  }

  if (handle.startsWith('http://') || handle.startsWith('https://')) {
    return handle;
  }

  return `https://www.instagram.com/${handle.replace(/^@/, '')}/`;
}

export default function ClubSection({
  clubName,
  description,
  websiteUrl,
  instagramHandle,
  linkedinUrl,
  splineScene,
  isVisible,
  index,
}) {
  const shouldRenderScene = Boolean(isVisible);

  return (
    <section className="relative h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(168,85,247,0.2),transparent_28%),linear-gradient(180deg,#050505_0%,#07040f_48%,#020202_100%)]" />

      <div
        className={`relative flex h-full w-full flex-col overflow-hidden border border-white/10 bg-white/2 shadow-[0_30px_100px_rgba(0,0,0,0.48)] transition-all duration-700 ease-out ${
          isVisible ? 'translate-y-0 opacity-100 blur-0' : 'translate-y-10 opacity-0 blur-[1px]'
        }`}
      >
        <div className="relative h-full flex-1">
          <div className="pointer-events-auto absolute inset-0">
            {shouldRenderScene ? <SplineScene scene={splineScene} isVisible={isVisible} loading="eager"/> : null}
          </div>

          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.08)_48%,rgba(0,0,0,0.42)_100%)]" />

          <div className="pointer-events-none absolute inset-x-5 top-5 z-20 flex items-center justify-between sm:inset-x-7 lg:inset-x-10">
            <span className="rounded-full border border-white/12 bg-black/30 px-3 py-1.5 text-[10px] uppercase tracking-[0.35em] text-white/65 backdrop-blur-md sm:px-4">
              {String(index + 1).padStart(2, '0')}
            </span>
            <span className="rounded-full border border-white/12 bg-black/30 px-3 py-1.5 text-[10px] uppercase tracking-[0.3em] text-white/55 backdrop-blur-md sm:px-4">
              Scroll to transition
            </span>
          </div>
        </div>

        <div className="group relative z-20 border-t border-white/10 bg-[linear-gradient(180deg,rgba(6,6,10,0.72),rgba(8,8,14,0.92))] px-5 py-3 sm:px-7 sm:py-2.5">
          <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-white/48">
              <span>{clubName}</span>
              <span className="h-px w-8 bg-white/15" />
              <span>Hover for links</span>
            </div>

            <div className="flex items-center gap-3 sm:justify-end">
              <a
                href={normalizeUrl(websiteUrl)}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-white/10 bg-white/3 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-white/82 transition duration-300 hover:-translate-y-0.5 hover:border-purple-300/30 hover:bg-white/8 hover:text-white"
              >
                Learn More
              </a>

              <a
                href={instagramUrlFromHandle(instagramHandle)}
                target="_blank"
                rel="noreferrer"
                aria-label={`${clubName} Instagram`}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/3 transition duration-300 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/8"
              >
                <Image src="/img/instagram.svg" alt="Instagram" width={18} height={18} className="h-4.5 w-4.5 object-contain" />
              </a>

              <a
                href={normalizeUrl(linkedinUrl)}
                target="_blank"
                rel="noreferrer"
                aria-label={`${clubName} LinkedIn`}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/3 transition duration-300 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/8"
              >
                <Image src="/img/linkedin.png" alt="LinkedIn" width={18} height={18} className="h-4.5 w-4.5 object-contain" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}