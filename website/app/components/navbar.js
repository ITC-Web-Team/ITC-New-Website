'use client';

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { label: "Clubs", href: "/clubs" },
    { label: "Tech Teams", href: "/techteams" },
    { label: "Events", href: "/events" },
    { label: "Team", href: "/team" },
    { label: "Portals", href: "/portals" },
    { label: "Achievements", href: "/achievements" },
    { label: "Hall of Fame", href: "/halloffame" },
  ];

  return (
    <header className="fixed inset-x-5 top-5 z-50 sm:inset-x-8 sm:top-6">
      <div className="mx-auto flex max-w-7xl items-center justify-between">

        {/* Logo */}
        <Link href="/" aria-label="ITC Home">
          <Image
            src="/itc-logo.png"
            alt="ITC Logo"
            width={110}
            height={110}
            priority
            className="transition-opacity hover:opacity-75"
          />
        </Link>

        {/* Expanding pill nav */}
        <nav className="group relative" aria-label="Main navigation">
          {/*
            Collapsed → rounded pill, just shows the menu icon
            Expanded  → wide bar, shows all links + CONTACT, icon fades out
          */}
          <div className={`relative flex h-16 w-16 items-center justify-end overflow-hidden rounded-full border border-white/10 bg-black/75 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.5)] transition-[width,border-radius,box-shadow] duration-500 ease-[cubic-bezier(.4,0,.2,1)] group-hover:w-[min(94vw,64rem)] group-hover:rounded-2xl  ${isOpen ? "w-[min(94vw,64rem)] rounded-2xl" : ""}`}>

            {/* Links — slide in with slight delay */}
            <div id="primary-navigation-links" className={`flex h-full w-full items-center gap-1 pl-5 pr-[4.5rem] opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-hover:delay-100 ${isOpen ? "opacity-100 delay-100" : ""}`}>
              {links.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="whitespace-nowrap rounded-lg px-3.5 py-2 text-[13px] font-medium text-white/65 transition-colors duration-150 hover:bg-white/[0.08] hover:text-white"
                >
                  {link.label}
                </Link>
              ))}

              {/* Divider */}
              <div className="mx-2 h-5 w-px shrink-0 bg-white/15" />

              <Link
                href="/contact"
                onClick={() => setIsOpen(false)}
                className="shrink-0 whitespace-nowrap rounded-full bg-white px-5 py-2 text-[13px] font-medium text-black transition-colors duration-150 hover:bg-white/85"
              >
                Contact
              </Link>
            </div>

            {/* Menu toggle stays visible so it can open and close the navigation */}
            <button
              type="button"
              aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={isOpen}
              aria-controls="primary-navigation-links"
              onClick={() => setIsOpen((open) => !open)}
              className="absolute right-2.5 z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-[opacity,transform] duration-300"
            >
              {isOpen ? (
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
                  <path d="M4 4L16 16M16 4L4 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              ) : (
                <svg
                  width="22"
                  height="16"
                  viewBox="0 0 22 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-white"
                >
                  <rect width="22" height="2.2" rx="1.1" fill="currentColor" />
                  <rect y="6.9" width="16" height="2.2" rx="1.1" fill="currentColor" opacity="0.7" />
                  <rect y="13.8" width="10" height="2.2" rx="1.1" fill="currentColor" opacity="0.45" />
                </svg>
              )}
            </button>

          </div>
        </nav>

      </div>
    </header>
  );
}
