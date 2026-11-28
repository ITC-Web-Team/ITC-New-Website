'use client';

import { useEffect, useMemo, useState } from 'react';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import SplineScene from '@/app/components/SplineScene';
import { fetchEvents } from '@/lib/api';
import { PageShell, PageHeader, LoadingState, ClockIcon } from '../components/ui';

// Paste the Spline export link here once it's ready (leave empty for a plain black background).
const EVENTS_SPLINE_URL = '';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const DOT_COLORS = [
  'bg-purple-400', 'bg-blue-400', 'bg-cyan-400', 'bg-pink-400',
  'bg-emerald-400', 'bg-amber-400', 'bg-rose-400', 'bg-indigo-400',
  'bg-teal-400', 'bg-fuchsia-400',
];

// "2026-05-15" -> local Date (avoids timezone shifts from new Date(string)).
const parseDate = (value) => {
  const [y, m, d] = value.split('-').map(Number);
  return new Date(y, m - 1, d);
};
const dayKey = (date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
const dayDiff = (a, b) => Math.round((b - a) / 86400000);

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [club, setClub] = useState('All');
  const [cursor, setCursor] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    fetchEvents().then((data) => {
      const list = data.map((e) => ({
        ...e,
        start: parseDate(e.start_date),
        end: parseDate(e.end_date || e.start_date),
      }));
      setEvents(list);
      setLoading(false);

      // Jump to the nearest month that actually has events.
      if (list.length) {
        const first = new Date(list[0].start.getFullYear(), list[0].start.getMonth(), 1);
        const last = new Date(list[list.length - 1].end.getFullYear(), list[list.length - 1].end.getMonth(), 1);
        setCursor((current) => (current < first ? first : current > last ? last : current));
      }
    });
  }, []);

  const clubs = useMemo(
    () => ['All', ...Array.from(new Set(events.flatMap((e) => e.clubs))).sort()],
    [events]
  );
  const colorFor = (name) => DOT_COLORS[Math.max(0, clubs.indexOf(name) - 1) % DOT_COLORS.length];

  const filtered = useMemo(
    () => (club === 'All' ? events : events.filter((e) => e.clubs.includes(club))),
    [events, club]
  );

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const monthStart = new Date(year, month, 1);
  const monthEnd = new Date(year, month + 1, 0);

  // Multi-week programs go in their own list instead of filling every cell.
  const isLong = (e) => dayDiff(e.start, e.end) >= 7;

  const { byDay, ongoing } = useMemo(() => {
    const map = {};
    const long = [];
    filtered.forEach((e) => {
      if (e.end < monthStart || e.start > monthEnd) return;
      if (isLong(e)) {
        long.push(e);
        return;
      }
      for (let d = new Date(Math.max(e.start, monthStart)); d <= e.end && d <= monthEnd; d.setDate(d.getDate() + 1)) {
        const key = dayKey(d);
        (map[key] = map[key] || []).push(e);
      }
    });
    return { byDay: map, ongoing: long };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtered, year, month]);

  const cells = [];
  for (let i = 0; i < monthStart.getDay(); i++) cells.push(null);
  for (let d = 1; d <= monthEnd.getDate(); d++) cells.push(new Date(year, month, d));

  const todayKey = dayKey(new Date());
  const selectedEvents = selected ? byDay[selected] || [] : [];
  const monthEventCount = new Set(Object.values(byDay).flat().map((e) => e.id)).size;

  const shiftMonth = (delta) => {
    setCursor(new Date(year, month + delta, 1));
    setSelected(null);
  };

  const EventRow = ({ e }) => (
    <li className="rounded-xl border border-violet-300/[0.12] bg-violet-500/[0.04] p-4">
      <div className="flex items-start justify-between gap-3">
        <h4 className="font-medium text-white">{e.name}</h4>
        <span className="shrink-0 text-xs text-white/45">{e.date_label}</span>
      </div>
      {e.time && (
        <p className="mt-1.5 inline-flex items-center gap-1.5 text-xs text-white/50">
          <ClockIcon className="h-3.5 w-3.5" />
          {e.time}
        </p>
      )}
      <div className="mt-3 flex flex-wrap gap-1.5">
        {e.clubs.map((c) => (
          <span key={c} className="chip">
            <span className={`h-1.5 w-1.5 rounded-full ${colorFor(c)}`} />
            {c}
          </span>
        ))}
      </div>
    </li>
  );

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-black text-white">
      <Navbar />

      {/* 3D background — add the Spline export link to EVENTS_SPLINE_URL above */}
      {EVENTS_SPLINE_URL && <SplineScene url={EVENTS_SPLINE_URL} interactive={true} />}

      <PageShell>
        <PageHeader
          title="Events"
          description="Workshops, sessions, competitions and more from every club, in one calendar."
        />

        {/* Club filter */}
        <div className="mb-8 flex flex-wrap gap-2">
          {clubs.map((name) => (
            <button
              key={name}
              type="button"
              onClick={() => { setClub(name); setSelected(null); }}
              className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${
                club === name
                  ? 'border-violet-600 bg-violet-600 text-white'
                  : 'border-violet-300/20 bg-[#0f0a1a]/70 text-violet-100/75 hover:border-violet-400/50 hover:text-white'
              }`}
            >
              {name}
            </button>
          ))}
        </div>

        {loading ? (
          <LoadingState label="Loading events" />
        ) : (
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
            {/* Calendar */}
            <section className="card p-4 sm:p-7">
              <div className="mb-6 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => shiftMonth(-1)}
                  aria-label="Previous month"
                  className="icon-btn"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6" /></svg>
                </button>
                <div className="text-center">
                  <h2 className="text-xl font-semibold sm:text-2xl">{MONTH_NAMES[month]} {year}</h2>
                  <p className="mt-0.5 text-xs text-white/45">
                    {monthEventCount + ongoing.length} event{monthEventCount + ongoing.length === 1 ? '' : 's'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => shiftMonth(1)}
                  aria-label="Next month"
                  className="icon-btn"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6" /></svg>
                </button>
              </div>

              <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
                {WEEKDAYS.map((w) => (
                  <div key={w} className="pb-2 text-center text-xs font-medium text-white/40">{w}</div>
                ))}
                {cells.map((date, i) => {
                  if (!date) return <div key={`blank-${i}`} />;
                  const key = dayKey(date);
                  const list = byDay[key] || [];
                  const isSelected = selected === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setSelected(isSelected ? null : key)}
                      className={`flex aspect-square flex-col items-center justify-between rounded-lg border p-1 text-sm transition-colors sm:items-start sm:p-2 ${
                        isSelected
                          ? 'border-violet-400/70 bg-violet-500/20'
                          : list.length
                            ? 'border-violet-300/20 bg-violet-500/[0.07] hover:border-violet-400/50'
                            : 'border-violet-300/[0.06] hover:border-violet-300/25'
                      }`}
                    >
                      <span className={`text-xs font-medium sm:text-sm ${key === todayKey ? 'rounded-full bg-violet-600 px-1.5 text-white' : list.length ? 'text-white/85' : 'text-white/40'}`}>
                        {date.getDate()}
                      </span>
                      {list.length > 0 && (
                        <span className="flex flex-wrap items-center justify-center gap-0.5 sm:justify-start">
                          {list.slice(0, 4).map((e) => (
                            <span key={e.id} className={`h-1.5 w-1.5 rounded-full ${colorFor(e.clubs[0])}`} />
                          ))}
                          {list.length > 4 && <span className="text-[9px] text-white/45">+{list.length - 4}</span>}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Side panel */}
            <aside className="space-y-5">
              <section className="card p-6">
                <h3 className="mb-4 text-sm font-medium text-white">
                  {selected
                    ? parseDate(selected).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })
                    : 'Select a day'}
                </h3>
                {selected ? (
                  selectedEvents.length ? (
                    <ul className="space-y-3">{selectedEvents.map((e) => <EventRow key={e.id} e={e} />)}</ul>
                  ) : (
                    <p className="text-sm text-white/45">No events on this day.</p>
                  )
                ) : (
                  <p className="text-sm text-white/45">Pick a highlighted date to see what’s on.</p>
                )}
              </section>

              {ongoing.length > 0 && (
                <section className="card p-6">
                  <h3 className="mb-4 text-sm font-medium text-white">
                    Ongoing and multi-week
                  </h3>
                  <ul className="space-y-3">{ongoing.map((e) => <EventRow key={e.id} e={e} />)}</ul>
                </section>
              )}
            </aside>
          </div>
        )}
      </PageShell>
      <Footer />
    </main>
  );
}
