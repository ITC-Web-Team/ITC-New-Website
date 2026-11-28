'use client';

const stats = [
  { value: '20+', label: 'Clubs and tech teams' },
  { value: '80+', label: 'Events every year' },
  { value: '200+', label: 'Summer projects' },
  { value: '10k+', label: 'Students reached' },
];

export default function About() {
  return (
    <section className="relative flex h-full w-full items-center justify-center px-5 py-24 text-white sm:px-8 lg:px-10">
      <div className="card grid w-full max-w-6xl overflow-hidden bg-[#08080c]/80 lg:grid-cols-[1.15fr_1fr]">
        <div className="p-7 sm:p-10 lg:p-12">
          <h2 className="text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl lg:text-[2.75rem]">
            The home of technical activity at IIT Bombay
          </h2>
          <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-white/60 sm:text-base">
            <p>
              The Institute Technical Council supports student innovation, technical skills and
              leadership. We give students the resources and guidance to bring their ideas to life
              through technical clubs, competition teams and events.
            </p>
            <p>
              From aeromodelling to artificial intelligence, ITC runs workshops, competitions and
              projects across a wide range of technical interests.
            </p>
          </div>
        </div>

        <dl className="grid grid-cols-2 border-t border-white/[0.08] lg:border-l lg:border-t-0">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className={`flex flex-col justify-end p-6 sm:p-8 ${i % 2 === 0 ? 'border-r border-white/[0.08]' : ''} ${i < 2 ? 'border-b border-white/[0.08]' : ''}`}
            >
              <dd className="font-[family-name:var(--font-display)] text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                {stat.value}
              </dd>
              <dt className="mt-2 text-sm text-white/50">{stat.label}</dt>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
