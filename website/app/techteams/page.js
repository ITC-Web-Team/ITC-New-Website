'use client';

import { useEffect, useState } from 'react';
import Navbar from '../components/navbar';
import SplineScene from '@/app/components/SplineScene';
import { fetchBodies, getBodyLink } from '@/lib/api';
import Footer from '../components/footer';
import { PageShell, PageHeader, LoadingState, ErrorState, EmptyState, BodyCard } from '../components/ui';

export default function TechTeams() {
  const [bodies, setBodies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch tech teams (type=1)
        const data = await fetchBodies(1);
        setBodies(Array.isArray(data) ? data : data.results || []);
      } catch (err) {
        console.error('Error fetching tech teams:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-black text-white">
      <Navbar />

      {/* 3D Spline background scene — interactive */}
      <SplineScene url="https://prod.spline.design/lef3qDOiHdOfbags/scene.splinecode" interactive={true} />

      <PageShell>
        <PageHeader
          title="Tech Teams"
          description="Student teams building racecars, satellites, rockets, rovers and autonomous vehicles, and taking them to competitions around the world."
        />

        {loading && <LoadingState label="Loading tech teams" />}
        {error && <ErrorState title="Couldn't load tech teams" message={error} />}
        {!loading && !error && bodies.length === 0 && <EmptyState>No tech teams yet.</EmptyState>}

        {!loading && !error && bodies.length > 0 && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {bodies.map((body) => (
              <BodyCard key={body.id} body={body} link={getBodyLink(body)} />
            ))}
          </div>
        )}
      </PageShell>
      <Footer />
    </main>
  );
}
