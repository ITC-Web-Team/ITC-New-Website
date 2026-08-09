"use client";

import { useEffect, useState, useRef } from 'react';
import SplineScene from '@/app/components/SplineScene';
import { fetchAchievementsByYear, fetchBodiesForFilter } from '@/lib/api';

export default function Achievements() {
  const [achievementsByYear, setAchievementsByYear] = useState({});
  const [bodies, setBodies] = useState([]);
  const [selectedBody, setSelectedBody] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  const load = async (bodyName = '') => {
    setLoading(true);
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
      await load(selectedBody);
    };

    init();
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (
        buttonRef.current &&
        !buttonRef.current.contains(e.target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        dropdownRef.current.classList.add('hidden');
        buttonRef.current.querySelector('svg')?.classList.remove('rotate-180');
      }
    };

    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);

  const toggleDropdown = (e) => {
    e.preventDefault();
    if (!dropdownRef.current || !buttonRef.current) return;
    dropdownRef.current.classList.toggle('hidden');
    buttonRef.current.querySelector('svg')?.classList.toggle('rotate-180');
  };

  const selectBody = async (bodyName, displayText) => {
    setSelectedBody(bodyName || '');
    if (dropdownRef.current && buttonRef.current) {
      const textSpan = buttonRef.current.querySelector('#dropdownText');
      if (textSpan) textSpan.textContent = displayText;
      dropdownRef.current.classList.add('hidden');
      buttonRef.current.querySelector('svg')?.classList.remove('rotate-180');
    }
    await load(bodyName);
  };

  const renderDate = (iso) => {
    try {
      const d = new Date(iso);
      return d.toLocaleDateString('en-US', { month: 'long', day: '2-digit', year: 'numeric' });
    } catch (e) {
      return iso;
    }
  };

  return (
    <div className="relative">
      <SplineScene url="voidspiral-DVEO7fSYQ2xMH5oHhzTW6kIz" />

      <div className="relative z-10 min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-4xl md:text-6xl font-bold text-center mb-16 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
            Achievements
          </h1>

          {/* Filter */}
          <div className="max-w-md mx-auto mb-12">
            <div className="relative">
              <div id="filterForm" className="bg-slate-800/50 backdrop-blur-md rounded-xl border border-slate-700/50">
                <button
                  id="dropdownButton"
                  ref={buttonRef}
                  onClick={toggleDropdown}
                  type="button"
                  className="w-full px-6 py-4 text-left text-lg font-medium text-gray-200 hover:text-white transition-colors flex justify-between items-center"
                >
                  <span id="dropdownText">{selectedBody || 'All Bodies'}</span>
                  <svg className="w-5 h-5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>

              <div id="dropdown" ref={dropdownRef} className="hidden absolute left-0 right-0 z-[100] mt-2 bg-slate-800 border border-slate-700 rounded-xl shadow-xl">
                <ul className="py-2 max-h-60 overflow-y-auto">
                  <li>
                    <a href="#" onClick={(e) => { e.preventDefault(); selectBody('', 'All Bodies'); }} className="block px-6 py-3 text-gray-200 hover:bg-slate-700 transition-colors">All Bodies</a>
                  </li>
                  {bodies.map((body) => (
                    <li key={body.id}>
                      <a
                        href="#"
                        onClick={(e) => { e.preventDefault(); selectBody(body.name, body.name); }}
                        className="block px-6 py-3 text-gray-200 hover:bg-slate-700 transition-colors"
                      >
                        {body.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Achievements List */}
          {loading && <div className="text-center text-gray-400">Loading achievements...</div>}
          {error && <div className="text-center text-red-400">Error: {error}</div>}

          {!loading && Object.keys(achievementsByYear).length === 0 && (
            <div className="text-center py-12">
              <p className="text-xl text-gray-400">No achievements found.</p>
            </div>
          )}

          {!loading && Object.keys(achievementsByYear).length > 0 && (
            <>
              {Object.entries(achievementsByYear)
                .sort((a, b) => Number(b[0]) - Number(a[0]))
                .map(([year, achievements]) => (
                  <div className="mb-16" key={year}>
                    <h2 className="text-3xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">{year}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {achievements.map((ach) => (
                        <div key={ach.id} className="group bg-slate-800/50 backdrop-blur-md rounded-xl border border-slate-700/50 p-6 transition-all duration-300 hover:scale-102 hover:shadow-lg hover:shadow-blue-500/10">
                          <div className="flex items-start gap-6">
                            <a href={`/bodies/${ach.body.name}`} className="flex-shrink-0">
                              <img className="w-16 h-16 rounded-xl object-cover transition-transform duration-300 group-hover:scale-110" src={ach.body.logo} alt={`${ach.body.name} logo`} />
                            </a>
                            <div className="flex-1">
                              <h3 className="text-xl font-semibold mb-2 text-white group-hover:text-blue-400 transition-colors">{ach.title}</h3>
                              <p className="text-gray-300 mb-3">{ach.description}</p>
                              <p className="text-sm text-gray-400">{renderDate(ach.date)}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
