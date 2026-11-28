'use client';

import { useEffect, useState } from 'react';
import Navbar from '../components/navbar';
import SplineScene from '@/app/components/SplineScene';
import { fetchAchievementsByYear, fetchBodiesForFilter } from '@/lib/api';
import Footer from '../components/footer';
import { PageShell, PageHeader, LoadingState, ErrorState, EmptyState, AchievementCard } from '../components/ui';

export default function Achievements() {
  const [achievementsByYear, setAchievementsByYear] = useState({});
  const [bodies, setBodies] = useState([]);
  const [selectedBody, setSelectedBody] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = async (bodyName = '') => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAchievementsByYear(bodyName || null);
      setAchievementsByYear(data || {});
    } catch (err) {
      console.error('Error fetching achievements:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        const bodyList = await fetchBodiesForFilter();
        setBodies(Array.isArray(bodyList) ? bodyList : bodyList.results || []);
      } catch (err) {
        console.error('Error fetching bodies for filter:', err);
      }
      await load('');
    };

    init();
  }, []);

  const onFilterChange = (event) => {
    setSelectedBody(event.target.value);
    load(event.target.value);
  };

  const years = Object.entries(achievementsByYear).sort((a, b) => Number(b[0]) - Number(a[0]));

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-black text-white">
      <Navbar />

      {/* 3D Spline background scene — interactive */}
      <SplineScene url="https://prod.spline.design/RRnoQaeTb9ZXsdtf/scene.splinecode" interactive={true} />

      <PageShell>
        <PageHeader
          title="Achievements"
          description="Competition wins, research milestones and other results from our clubs and teams, year by year."
        >
          <div className="mt-8">
            <label htmlFor="body-filter" className="sr-only">Filter by club or team</label>
            <div className="relative inline-block w-full max-w-xs">
              <select
                id="body-filter"
                value={selectedBody}
                onChange={onFilterChange}
                className="card w-full cursor-pointer appearance-none rounded-full py-2.5 pl-5 pr-11 text-sm text-white/85 outline-none hover:border-white/20 focus-visible:border-white/35"
              >
                <option value="">All clubs and teams</option>
                {bodies.map((body) => (
                  <option key={body.id} value={body.name}>{body.name}</option>
                ))}
              </select>
              <svg className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
                <path d="m6 9 6 6 6-6" />
              </svg>
            </div>
          </div>
        </PageHeader>

        {loading && <LoadingState label="Loading achievements" />}
        {error && <ErrorState title="Couldn't load achievements" message={error} />}
        {!loading && !error && years.length === 0 && <EmptyState>No achievements found for this selection.</EmptyState>}

        {!loading && !error && years.length > 0 && (
          <div className="space-y-20">
            {years.map(([year, achievements]) => (
              <section key={year}>
                <div className="mb-8 flex items-baseline gap-4 border-b border-white/10 pb-4">
                  <h2 className="text-3xl font-semibold tabular-nums tracking-tight text-white sm:text-4xl">{year}</h2>
                  <span className="text-sm text-white/40">
                    {achievements.length} achievement{achievements.length === 1 ? '' : 's'}
                  </span>
                </div>
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  {achievements.map((ach) => (
                    <AchievementCard key={ach.id} achievement={ach} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </PageShell>
      <Footer />
    </main>
  );
}
