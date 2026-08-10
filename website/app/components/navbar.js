import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  const links = [
    { label: "CLUBS", href: "/clubs" },
    { label: "TECH TEAMS", href: "/techteams" },
    { label: "PORTALS", href: "/portals" },
    { label: "ACHIEVEMENTS", href: "/achievements" },
    { label: "HALL OF FAME", href: "/halloffame" },
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
          <div className="relative flex h-16 w-16 items-center justify-end overflow-hidden rounded-full border border-white/10 bg-black/80 backdrop-blur-2xl shadow-[0_10px_40px_rgba(0,0,0,0.6)] transition-[width,border-radius,box-shadow] duration-500 ease-[cubic-bezier(.4,0,.2,1)] group-hover:w-[min(94vw,64rem)] group-hover:rounded-2xl group-hover:shadow-[0_10px_50px_rgba(139,92,246,0.18)]">

            {/* Inner glow — activates on expand */}
            <div className="pointer-events-none absolute inset-0 rounded-[inherit] bg-gradient-to-r from-violet-600/15 via-transparent to-blue-600/15 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

            {/* Links — slide in with slight delay */}
            <div className="flex h-full w-full items-center gap-1 pl-5 pr-[4.5rem] opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-hover:delay-100">
              {links.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="whitespace-nowrap rounded-xl px-4 py-2.5 text-xs font-bold tracking-[0.22em] text-white/70 transition-colors duration-150 hover:bg-white/10 hover:text-white"
                >
                  {link.label}
                </Link>
              ))}

              {/* Divider */}
              <div className="mx-2 h-5 w-px shrink-0 bg-white/15" />

              <Link
                href="/contact"
                className="shrink-0 whitespace-nowrap rounded-xl bg-gradient-to-r from-violet-600 to-violet-500 px-6 py-2.5 text-xs font-black tracking-[0.22em] text-white shadow-[0_0_18px_rgba(139,92,246,0.55)] transition-all duration-150 hover:brightness-110 hover:shadow-[0_0_28px_rgba(139,92,246,0.75)]"
              >
                CONTACT
              </Link>
            </div>

            {/* Menu icon — fades and shrinks when expanded */}
            <button
              type="button"
              aria-label="Open navigation menu"
              className="absolute right-2.5 z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-[opacity,transform] duration-300 group-hover:pointer-events-none group-hover:scale-50 group-hover:opacity-0"
            >
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
            </button>

          </div>
        </nav>

      </div>
    </header>
  );
}