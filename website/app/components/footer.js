import Link from 'next/link';

const LINKS = [
  { label: 'Clubs', href: '/clubs' },
  { label: 'Tech Teams', href: '/techteams' },
  { label: 'Events', href: '/events' },
  { label: 'Achievements', href: '/achievements' },
  { label: 'Hall of Fame', href: '/halloffame' },
  { label: 'Portals', href: '/portals' },
  { label: 'Team', href: '/team' },
  { label: 'Contact', href: '/contact' },
];

export default function Footer() {
  return (
    <footer className="relative z-20 w-full border-t border-white/[0.08] bg-black">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-[1fr_auto] lg:px-10">
        <div className="max-w-sm">
          <p className="font-[family-name:var(--font-display)] text-lg font-semibold text-white">
            Institute Technical Council
          </p>
          <p className="mt-2 text-sm leading-relaxed text-white/50">
            Student Activity Centre, IIT Bombay, Powai, Mumbai 400076
          </p>
        </div>

        <nav aria-label="Footer" className="grid grid-cols-2 gap-x-12 gap-y-2.5 text-sm sm:grid-cols-4 md:grid-cols-2 lg:grid-cols-4">
          {LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="text-white/55 transition-colors hover:text-white">
              {link.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="border-t border-white/[0.06]">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-5 text-xs text-white/40 sm:flex-row sm:justify-between sm:px-8 lg:px-10">
          <p>© {new Date().getFullYear()} Institute Technical Council, IIT Bombay</p>
          <p>Built by the ITC Web Team</p>
        </div>
      </div>
    </footer>
  );
}
