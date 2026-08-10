'use client';

export default function Footer() {
  return (
    <footer className="relative z-20 w-full py-8 border-t border-white/5 bg-black/40 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs text-white/40 tracking-[0.25em] uppercase font-medium">
          © {new Date().getFullYear()} ITC · IIT BOMBAY
        </p>
        <p className="text-xs text-white/50 font-medium tracking-wider flex items-center gap-1.5">
          Developed by <span className="text-white/80 font-bold">ITC Web Team</span> with <span className="text-rose-500 animate-pulse">❤️</span>
        </p>
      </div>
    </footer>
  );
}
