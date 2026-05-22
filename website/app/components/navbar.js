import Image from 'next/image';
import Link from 'next/link';

export default function Navbar() {
  const links = [
    { label: "CLUBS", href: "/clubs" },
    { label: "PORTALS", href: "/portals" },
    { label: "ACHIEVEMENTS", href: "/achievements" },
    { label: "HALL OF FAME", href: "/hall-of-fame" },

  ];

  return (
    <header className="fixed inset-x-4 top-4 z-50 sm:inset-x-6 sm:top-6">
      <div className="mx-auto max-w-[1400px] flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3">
            <Image src="/itc-logo.png" alt="ITC" width={100} height={100} className="object-contain" />
        </Link>

        <nav className="relative overflow-hidden rounded-2xl border border-white/15 bg-black/75 px-4 py-3 text-white shadow-[0_18px_60px_rgba(0,0,0,0.55)] backdrop-blur-xl sm:px-5 sm:py-4">
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(168,85,247,0.18),transparent_35%,transparent_65%,rgba(99,102,241,0.12))]" />
          <div className="relative flex items-center gap-2 sm:gap-3">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="rounded-full px-3 py-2 text-[10px] font-medium tracking-[0.3em] text-white/80 transition hover:bg-white/10 hover:text-white sm:px-4 sm:text-xs"
              >
                {link.label}
              </a>
            ))}
            <a
              href="/contact"
              className="ml-1 rounded-full border border-purple-300/35 bg-[linear-gradient(135deg,#111111,#2b143e_55%,#5b21b6)] px-4 py-2 text-[10px] font-semibold tracking-[0.25em] text-white shadow-[0_0_30px_rgba(168,85,247,0.35)] transition hover:scale-[1.02] hover:shadow-[0_0_36px_rgba(168,85,247,0.5)] sm:px-5 sm:text-xs"
            >
              CONTACT
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}