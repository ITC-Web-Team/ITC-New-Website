'use client';

import { useEffect, useState } from 'react';
import Navbar from '../components/navbar';
import SplineScene from '@/app/components/SplineScene';
import { fetchTeam } from '@/lib/api';
import Footer from '../components/footer';
import { PageShell, PageHeader, LoadingState, ErrorState, EmptyState, PersonCard } from '../components/ui';

// Paste the Spline export link here once it's ready (empty = plain black background).
const TEAM_SPLINE_URL = 'https://prod.spline.design/uT-0OHh5zapHkXmE/scene.splinecode';

export default function Team() {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchTeam();
        setTeam(Array.isArray(data) ? data : data.results || []);
      } catch (err) {
        console.error('Error fetching team:', err);
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
      {TEAM_SPLINE_URL && <SplineScene url={TEAM_SPLINE_URL} interactive={true} />}

      <PageShell>
        <PageHeader
          eyebrow="Managers and nominees"
          title="Team"
          description="The managers and nominees running our clubs and technical teams at IIT Bombay."
        />

        {loading && <LoadingState label="Loading team" />}
        {error && <ErrorState title="Couldn't load the team" message={error} />}
        {!loading && !error && team.length === 0 && <EmptyState>No team members yet.</EmptyState>}

        {!loading && !error && team.length > 0 && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {team.map((member) => (
              <PersonCard
                key={member.id}
                name={member.name}
                role={member.post}
                image={member.image}
                email={member.email}
                linkedin={member.linkedin}
                instagram={member.instagram}
              />
            ))}
          </div>
        )}
      </PageShell>
      <Footer />
    </main>
  );
}
