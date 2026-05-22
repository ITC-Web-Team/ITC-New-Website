'use client';

import { useEffect, useRef, useState } from "react";
import ITC from "./components/ITC";
import About from "./components/about";
import Navbar from "./components/navbar";

export default function Home() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const targetProgressRef = useRef(0);
  const animationFrameRef = useRef(null);
  const wheelLockRef = useRef(false);

  useEffect(() => {
    const animateProgress = () => {
      setScrollProgress((currentProgress) => {
        const nextProgress = currentProgress + (targetProgressRef.current - currentProgress) * 0.09;

        if (Math.abs(targetProgressRef.current - nextProgress) < 0.002) {
          animationFrameRef.current = null;
          return targetProgressRef.current;
        }

        animationFrameRef.current = window.requestAnimationFrame(animateProgress);
        return nextProgress;
      });
    };

    const handleWheel = (event) => {
      event.preventDefault();

      if (wheelLockRef.current) {
        return;
      }

      const direction = event.deltaY > 0 ? 1 : -1;
      const step = 0.55;
      targetProgressRef.current = Math.max(0, Math.min(1, targetProgressRef.current + direction * step));

      if (animationFrameRef.current === null) {
        animationFrameRef.current = window.requestAnimationFrame(animateProgress);
      }

      wheelLockRef.current = true;
      window.setTimeout(() => {
        wheelLockRef.current = false;
      }, 900);
    };

    window.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      window.removeEventListener("wheel", handleWheel);

      if (animationFrameRef.current !== null) {
        window.cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const itcOpacity = Math.max(0, 1 - scrollProgress * 1.15);
  const aboutOpacity = Math.max(0, Math.min(1, (scrollProgress - 0.18) * 1.18));
  const itcTransform = `translateY(${scrollProgress * -18}px) scale(${1 - scrollProgress * 0.02})`;
  const aboutTransform = `translateY(${Math.max(0, (1 - scrollProgress) * 18)}px) scale(${0.985 + scrollProgress * 0.015})`;

  return (
    <main className="relative h-screen overflow-hidden bg-black text-white">
      <Navbar />

      <section className="relative h-screen overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(168,85,247,0.22),transparent_38%),linear-gradient(180deg,#050505_0%,#09040f_55%,#020202_100%)]" />

        <div
          className="absolute inset-0 transition-[opacity,transform] duration-700 ease-out"
          style={{
            opacity: itcOpacity,
            transform: itcTransform,
            pointerEvents: scrollProgress > 0.45 ? "none" : "auto",
          }}
        >
          <ITC />
        </div>

        <div
          className="absolute inset-0 transition-[opacity,transform] duration-700 ease-out"
          style={{
            opacity: aboutOpacity,
            transform: aboutTransform,
            pointerEvents: scrollProgress < 0.2 ? "none" : "auto",
          }}
        >
          <About />
        </div>

        <div className="pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2 rounded-full border border-white/10 bg-black/30 px-4 py-2 text-[10px] uppercase tracking-[0.35em] text-white/55 backdrop-blur-md">
          Scroll to transition
        </div>
      </section>
    </main>
  );
}
