'use client';

import { useEffect, useState } from 'react';
import Navbar from '../components/navbar';
import SplineScene from '@/app/components/SplineScene';
import { fetchPortals } from '@/lib/api';
import Footer from '../components/footer';
import { PageShell, PageHeader, LoadingState, ErrorState, EmptyState, ArrowUpRightIcon } from '../components/ui';

export default function Portals() {
  const [portals, setPortals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchPortals();
        setPortals(Array.isArray(data) ? data : data.results || []);
      } catch (err) {
        console.error('Error fetching portals:', err);
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
      <SplineScene url="https://prod.spline.design/e1LFmN925FT-Qrss/scene.splinecode" interactive={true} />

      <PageShell>
        <PageHeader
          title="Portals"
          description="Web apps and tools built and maintained by ITC teams for the IIT Bombay community."
        />

        {loading && <LoadingState label="Loading portals" />}
        {error && <ErrorState title="Couldn't load portals" message={error} />}
        {!loading && !error && portals.length === 0 && <EmptyState>No portals yet.</EmptyState>}

        {!loading && !error && portals.length > 0 && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {portals.map((portal) => (
              <a
                key={portal.id}
                href={portal.link || '#'}
                target={portal.link?.startsWith('http') ? '_blank' : '_self'}
                rel="noopener noreferrer"
                className="card card-link group flex flex-col overflow-hidden"
              >
                {portal.banner && (
                  <div className="aspect-video w-full overflow-hidden border-b border-violet-300/[0.1]">
                    <img src={portal.banner} alt="" loading="lazy" className="h-full w-full object-cover" />
                  </div>
                )}

                <div className="flex flex-1 flex-col p-6">
                  <h2 className="text-lg font-semibold leading-snug text-white">{portal.name}</h2>
                  {portal.description && (
                    <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-white/55">{portal.description}</p>
                  )}

                  {portal.techstacks?.length > 0 && (
                    <div className="mt-5 flex flex-wrap gap-1.5">
                      {portal.techstacks.map((tech) => (
                        <span key={tech.id} className="chip">
                          {tech.logo && <img className="h-3.5 w-3.5 object-contain" src={tech.logo} alt="" />}
                          {tech.name}
                        </span>
                      ))}
                    </div>
                  )}

                  <span className="mt-auto inline-flex items-center gap-1.5 pt-6 text-sm font-medium text-violet-300 transition-colors group-hover:text-violet-200">
                    Open portal
                    <ArrowUpRightIcon className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </span>
                </div>
              </a>
            ))}
          </div>
        )}
      </PageShell>
      <Footer />
    </main>
  );
}
