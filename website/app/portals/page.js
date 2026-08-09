"use client";

import { useEffect, useState } from 'react';
import SplineScene from '@/app/components/SplineScene';
import { fetchPortals } from '@/lib/api';

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
    <div className="relative">
      <SplineScene url="e1LFmN925FT-Qrss" />

      <div className="relative z-10 min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-4xl md:text-6xl font-bold text-center mb-16 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
            Portals
          </h1>

          {loading && (
            <div className="text-center text-gray-400">Loading portals...</div>
          )}

          {error && (
            <div className="text-center text-red-400">Error: {error}</div>
          )}

          {!loading && !error && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {portals.map((portal) => (
                <a
                  key={portal.id}
                  href={portal.link}
                  className="group bg-slate-800/50 backdrop-blur-md rounded-2xl border border-slate-700/50 overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/10"
                >
                  <div className="aspect-video w-full overflow-hidden">
                    <img
                      src={portal.banner}
                      alt={`${portal.name} banner`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>

                  <div className="p-6">
                    <h2 className="text-2xl font-bold text-white group-hover:text-blue-400 transition-colors mb-4">
                      {portal.name}
                    </h2>
                    <p className="text-gray-300 text-sm mb-6">{portal.description}</p>

                    <div className="flex flex-wrap gap-3">
                      {portal.techstacks.map((tech) => (
                        <div key={tech.id} className="p-2 bg-slate-700/50 rounded-lg group-hover:bg-slate-600/50 transition-colors">
                          <img className="w-6 h-6 object-contain" src={tech.logo} alt={tech.name} />
                        </div>
                      ))}
                    </div>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
