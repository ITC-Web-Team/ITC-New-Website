'use client';

import Spline from '@splinetool/react-spline';

const stats = [
  { value: '20+', label: 'Tech Bodies', accent: 'from-sky-400 to-blue-500' },
  { value: '80+', label: 'Yearly Events', accent: 'from-violet-400 to-fuchsia-500' },
  { value: '200+', label: 'Summer Projects', accent: 'from-pink-400 to-rose-500' },
  { value: '10k+', label: 'Students Catered', accent: 'from-cyan-300 to-sky-400' },
];

export default function About() {
  return (
    <main className="relative h-full w-full overflow-hidden text-white">
      <div className="absolute inset-0">
        <Spline
          scene="https://prod.spline.design/Hdtrd3vkM-S0nA6j/scene.splinecode"
          style={{ width: '100%', height: '100%', transform: 'scale(1.02)' }}
        />
      </div>

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.12),transparent_26%),radial-gradient(circle_at_bottom_right,rgba(236,72,153,0.1),transparent_26%),linear-gradient(180deg,rgba(2,4,10,0.08),rgba(2,4,10,0.3)_70%,rgba(2,4,10,0.42))]" />

      <section className="relative flex h-full w-full items-center justify-center px-6 py-10 sm:px-10 lg:px-14">
        <div className="relative w-full max-w-6xl">
          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
            <article className="relative z-10 overflow-hidden rounded-[1.8rem] border border-white/10 bg-[linear-gradient(180deg,rgba(12,16,28,0.55),rgba(12,16,28,0.28))] p-7 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:p-9">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.16),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(236,72,153,0.12),transparent_30%)]" />

              <div className="relative space-y-5 text-left text-base leading-7 text-white/86 sm:text-lg sm:leading-8">
                <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  About ITC
                </h1>
                <p>
                  The Institute Technical Council (ITC) at IIT Bombay is at the
                  forefront of nurturing student innovation, technical skills,
                  and leadership. We provide students with the resources and
                  guidance needed to bring their ideas to life through a wide
                  range of technical clubs, teams, and events.
                </p>
                <p>
                  With a focus on fostering collaboration and creativity, ITC
                  plays a pivotal role in organizing technical workshops,
                  competitions, and projects. From aeromodelling to artificial
                  intelligence, the council caters to a diverse set of
                  technical interests, making it a hub for student-led
                  innovation.
                </p>
              </div>
            </article>

            <div className="relative z-10 grid gap-5 gap-y-10 sm:grid-cols-2">
              {stats.map((stat) => (
                <article
                  key={stat.label}
                  className="group relative overflow-hidden rounded-[1.6rem] border border-white/12 bg-[linear-gradient(180deg,rgba(16,20,34,0.72),rgba(16,20,34,0.42))] p-6 shadow-[0_18px_70px_rgba(0,0,0,0.3)] backdrop-blur-xl transition-transform duration-300 hover:-translate-y-1 hover:border-white/18"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${stat.accent} opacity-0 blur-3xl transition-opacity duration-300 group-hover:opacity-18`} />
                  <div className="relative">
                    <div className={`mb-2 inline-block bg-gradient-to-r ${stat.accent} bg-clip-text text-4xl font-semibold tracking-tight text-transparent sm:text-5xl`}>
                      {stat.value}
                    </div>
                    <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-white/62 sm:text-sm">
                      {stat.label}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
