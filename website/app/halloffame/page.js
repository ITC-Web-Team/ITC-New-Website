"use client";

import { useEffect, useState } from 'react';
import SplineScene from '@/app/components/SplineScene';
import { fetchInterIIT } from '@/lib/api';

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
    <div className="relative">
      <SplineScene url="" />

      <div className="relative z-10 min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-4xl md:text-6xl font-bold text-center mb-16 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Hall of Fame</h1>

          {loading && <div className="text-center text-gray-400">Loading...</div>}
          {error && <div className="text-center text-red-400">Error: {error}</div>}

          {!loading && items.map((d) => (
            <div className="mb-12" key={d.id}>
              <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl border border-slate-700/50 overflow-hidden">
                <div className="relative h-full">
                  <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${d.img})` }}>
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
                  </div>

                  <div className="relative flex flex-col md:flex-row">
                    <div className="w-full md:w-1/2 p-6 lg:p-8">
                      <div className="flex items-center gap-4 mb-8">
                        <img className="w-24 lg:w-32 h-24 lg:h-32 rounded-2xl object-cover" src={d.logo} alt="Logo" />
                        <div>
                          <h2 className="text-2xl lg:text-3xl font-bold text-white mb-2">{d.title}</h2>
                          <p className="text-lg lg:text-xl text-gray-300">{d.subtitle}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-6 mt-8">
                        <div className="text-center group">
                          <div className="relative w-16 lg:w-20 h-16 lg:h-20 mx-auto transform transition-transform group-hover:scale-110">
                            <img src="/static/img/3.svg" className="w-full h-full" alt="Bronze Medal" />
                          </div>
                          <p className="text-4xl lg:text-6xl font-bold mt-4 bg-gradient-to-r from-amber-700 to-yellow-600 text-transparent bg-clip-text">{d.bronze}</p>
                        </div>

                        <div className="text-center group">
                          <div className="relative w-16 lg:w-20 h-16 lg:h-20 mx-auto transform transition-transform group-hover:scale-110">
                            <img src="/static/img/1.svg" className="w-full h-full" alt="Gold Medal" />
                          </div>
                          <p className="text-4xl lg:text-6xl font-bold mt-4 bg-gradient-to-r from-yellow-400 to-yellow-600 text-transparent bg-clip-text">{d.gold}</p>
                        </div>

                        <div className="text-center group">
                          <div className="relative w-16 lg:w-20 h-16 lg:h-20 mx-auto transform transition-transform group-hover:scale-110">
                            <img src="/static/img/2.svg" className="w-full h-full" alt="Silver Medal" />
                          </div>
                          <p className="text-4xl lg:text-6xl font-bold mt-4 bg-gradient-to-r from-gray-300 to-gray-400 text-transparent bg-clip-text">{d.silver}</p>
                        </div>
                      </div>
                    </div>

                    <div className="w-full md:w-1/2 p-6 lg:p-8">
                      <p className="text-gray-300 text-lg mb-8">{d.description}</p>

                      <div className="overflow-hidden rounded-xl border border-slate-700/50">
                        <table className="w-full">
                          <thead className="bg-slate-700/50">
                            <tr>
                              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-200">Company</th>
                              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-200">Position</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-700/50">
                            {d.problemstatements.map((p) => (
                              <tr key={p.id} className="hover:bg-slate-700/30 transition-colors">
                                <td className="px-4 py-3 text-sm text-gray-300">{p.title}</td>
                                <td className="px-4 py-3 text-sm text-gray-300">{p.position}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
