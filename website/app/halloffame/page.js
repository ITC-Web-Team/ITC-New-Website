'use client';

import { useEffect, useState } from 'react';
import Navbar from '../components/navbar';
import SplineScene from '@/app/components/SplineScene';
import { fetchInterIIT } from '@/lib/api';
import Footer from '../components/footer';
import { PageShell, PageHeader, LoadingState, ErrorState, EmptyState, InterIITCard } from '../components/ui';

export default function HallOfFame() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchInterIIT();
        setItems(Array.isArray(data) ? data : data.results || []);
      } catch (err) {
        console.error('Error fetching InterIIT:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-black text-white">
      <Navbar />

      {/* 3D Spline background scene — interactive */}
      <SplineScene url="https://prod.spline.design/kHATwDL9c08lufl2/scene.splinecode" interactive={true} />

      <PageShell>
        <PageHeader
          title="Hall of Fame"
          description="IIT Bombay's results at every Inter IIT Tech Meet: medals, problem statements and podium finishes."
        />

        {loading && <LoadingState label="Loading results" />}
        {error && <ErrorState title="Couldn't load the Hall of Fame" message={error} />}
        {!loading && !error && items.length === 0 && <EmptyState>No results yet.</EmptyState>}

        {!loading && !error && items.length > 0 && (
          <div className="space-y-6">
            {items.map((meet) => (
              <InterIITCard key={meet.id} meet={meet} />
            ))}
          </div>
        )}
      </PageShell>
      <Footer />
    </main>
  );
}
