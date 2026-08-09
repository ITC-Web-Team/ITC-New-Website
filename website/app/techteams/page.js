'use client';

import { useEffect, useState } from 'react';
import SplineScene from '@/app/components/SplineScene';
import { fetchBodies } from '@/lib/api';

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
    <div className="relative">
      {/* Spline Background */}
      <SplineScene url="lef3qDOiHdOfbags" />

      {/* Content */}
      <div className="relative z-10 min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Header */}
          <h1 className="text-4xl md:text-6xl font-bold text-center mb-16 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
            Tech Teams
          </h1>

          {/* Loading State */}
          {loading && (
            <div className="text-center text-gray-400">
              <p>Loading tech teams...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center text-red-400">
              <p>Error loading tech teams: {error}</p>
            </div>
          )}

          {/* Bodies Grid */}
          {!loading && !error && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {bodies.map((body) => (
                <a
                  key={body.id}
                  href={`/bodies/${body.name}`}
                  className="group bg-slate-800/50 backdrop-blur-md rounded-2xl border border-slate-700/50 p-6 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/10 cursor-pointer"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src={body.logo}
                      alt={`${body.name} Logo`}
                      className="w-20 h-20 rounded-xl object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <h2 className="text-2xl font-bold text-white group-hover:text-blue-400 transition-colors">
                      {body.name}
                    </h2>
                  </div>
                  <p className="text-gray-300 text-sm line-clamp-3">
                    {body.short_description}
                  </p>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
