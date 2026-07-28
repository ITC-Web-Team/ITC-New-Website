import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  const links = [
    { label: "CLUBS", href: "/clubs" },
    { label: "PORTALS", href: "/portals" },
    { label: "ACHIEVEMENTS", href: "/achievements" },
    { label: "HALL OF FAME", href: "/hall-of-fame" },
  ];

  return (
    <header className="fixed inset-x-4 top-4 z-50 sm:inset-x-6 sm:top-6">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/itc-logo.png"
            alt="ITC"
            width={100}
            height={100}
            className="object-contain"
          />
        </Link>

        {/* Navigation */}
        <nav className="group relative ml-auto">
          <div className="flex h-16 w-16 items-center justify-end overflow-hidden rounded-[1.35rem] border border-white/15 bg-black/75 text-white shadow-[0_18px_60px_rgba(0,0,0,0.55)] backdrop-blur-xl transition-[width] duration-300 ease-out group-hover:w-[min(92vw,52rem)] group-focus-within:w-[min(92vw,52rem)] sm:h-18 sm:w-18">
            {/* Background Glow */}
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(168,85,247,0.18),transparent_35%,transparent_65%,rgba(99,102,241,0.12))]" />

            {/* Menu Button */}
            <button
              type="button"
              aria-label="Open navigation menu"
              className="relative z-10 mr-4 flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 transition duration-300 group-hover:border-white/20 group-hover:bg-white/10"
            >
              <Image
                src="/menu-icon.png" // <-- Put your image in /public
                alt="Menu"
                width={26}
                height={26}
                className="object-contain transition-all duration-300 group-hover:opacity-0 group-focus-within:opacity-0 group-hover:scale-90"
              />
            </button>

            {/* Expanded Navigation */}
            <div className="relative z-10 flex h-full items-center justify-end gap-1 pr-3 opacity-0 transition-all duration-300 group-hover:opacity-100 group-focus-within:opacity-100 sm:gap-2 sm:pr-5">
              {links.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="rounded-full px-4 py-2.5 text-[10px] font-medium tracking-[0.28em] text-white/78 transition hover:bg-white/10 hover:text-white sm:px-5 sm:text-xs"
                >
                  {link.label}
                </Link>
              ))}

              <Link
                href="/contact"
                className="ml-1 rounded-full border border-purple-300/35 bg-[linear-gradient(135deg,#111111,#2b143e_55%,#5b21b6)] px-5 py-2.5 text-[10px] font-semibold tracking-[0.25em] text-white shadow-[0_0_30px_rgba(168,85,247,0.35)] transition hover:scale-[1.02] hover:shadow-[0_0_36px_rgba(168,85,247,0.5)] sm:px-6 sm:text-xs"
              >
                CONTACT
              </Link>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}