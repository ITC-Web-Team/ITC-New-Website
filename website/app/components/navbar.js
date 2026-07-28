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
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        {/* Logo */}
        <Link href="/" >
          <Image
            src="/itc-logo.png"
            alt="ITC Logo"
            width={100}
            height={100}
            priority
          />
        </Link>

        {/* Navigation */}
        <nav className="group relative">
          <div className="relative flex h-16 w-16 items-center justify-end overflow-hidden rounded-[26px] border border-white/10 bg-black/80 backdrop-blur-xl shadow-2xl transition-all duration-300 ease-out group-hover:w-[min(92vw,50rem)]">

            {/* Glow */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-purple-600/20 via-transparent to-blue-600/20" />

            {/* Menu Icon */}
            <button
              type="button"
              className="absolute right-3 z-50 flex h-10 w-10 items-center justify-center"
            >
              <Image
                src="/menu-icon.png"
                alt="Menu"
                width={32}
                height={32}
                priority
                unoptimized
                className="block"
              />
            </button>

            {/* Links */}
            <div className="flex h-full w-full items-center justify-end gap-2 pr-20 opacity-0 transition-opacity duration-300 group-hover:opacity-100">

              {links.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="whitespace-nowrap rounded-full px-5 py-2 text-xs tracking-[0.25em] text-white/80 hover:bg-white/10 hover:text-white"
                >
                  {link.label}
                </Link>
              ))}

              <Link
                href="/contact"
                className="rounded-full bg-gradient-to-r from-violet-900 to-violet-600 px-6 py-2 text-xs font-semibold tracking-[0.2em] text-white"
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