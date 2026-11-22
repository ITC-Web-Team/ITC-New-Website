'use client';

import { useEffect, useMemo, useState } from 'react';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import SplineScene from '@/app/components/SplineScene';
import { fetchEvents } from '@/lib/api';

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
    <li className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <div className="flex items-start justify-between gap-3">
        <h4 className="font-semibold text-white">{e.name}</h4>
        <span className="shrink-0 text-[10px] font-bold uppercase tracking-[0.2em] text-purple-300">
          {e.date_label}
        </span>
      </div>
      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400">
        {e.time && <span>🕒 {e.time}</span>}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {e.clubs.map((c) => (
          <span key={c} className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-black/40 px-2.5 py-1 text-[11px] text-slate-300">
            <span className={`h-1.5 w-1.5 rounded-full ${colorFor(c)}`} />
            {c}
          </span>
        ))}
      </div>
    </li>
  );

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-black text-white selection:bg-purple-500/30">
      <Navbar />

      {/* 3D background — add the Spline export link to EVENTS_SPLINE_URL above */}
      {EVENTS_SPLINE_URL && <SplineScene url={EVENTS_SPLINE_URL} interactive={true} />}

      <div className="pointer-events-none fixed inset-0 z-[1] bg-[radial-gradient(circle_at_top,rgba(168,85,247,0.12),transparent_45%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.08),transparent_40%)]" />

      <div className="relative z-10 mx-auto max-w-7xl space-y-12 px-4 pb-28 pt-32 sm:px-6 lg:px-10">
        {/* Header */}
        <div className="space-y-4 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-black/40 px-4 py-1.5 shadow-xl backdrop-blur-md">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-purple-400" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.35em] text-white/70">
              Academic Year Timeline
            </span>
          </div>
          <h1 className="bg-gradient-to-r from-white via-purple-100 to-purple-400 bg-clip-text text-5xl font-black tracking-tight text-transparent drop-shadow-[0_10px_35px_rgba(168,85,247,0.3)] sm:text-7xl lg:text-8xl">
            Events
          </h1>
          <p className="mx-auto max-w-2xl pt-1 text-base leading-relaxed text-slate-300/80 sm:text-lg">
            Workshops, sessions, competitions and more from every club, all in one calendar.
          </p>
          <div className="mx-auto h-px w-28 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
        </div>

        {/* Club filter */}
        <div className="flex flex-wrap justify-center gap-2">
          {clubs.map((name) => (
            <button
              key={name}
              type="button"
              onClick={() => { setClub(name); setSelected(null); }}
              className={`rounded-full border px-4 py-1.5 text-xs font-semibold tracking-wide transition ${
                club === name
                  ? 'border-purple-400/60 bg-purple-600/30 text-white'
                  : 'border-white/12 bg-black/40 text-slate-300 hover:border-white/30'
              }`}
            >
              {name}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex flex-col items-center gap-4 py-24">
            <div className="h-12 w-12 animate-spin rounded-full border-2 border-purple-500/30 border-t-purple-400" />
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Loading Events...</p>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
            {/* Calendar */}
            <section className="rounded-[2rem] border border-white/12 bg-[linear-gradient(180deg,rgba(14,18,32,0.7),rgba(10,12,22,0.4))] p-4 shadow-[0_30px_100px_rgba(0,0,0,0.5)] backdrop-blur-2xl sm:p-8">
              <div className="mb-6 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => shiftMonth(-1)}
                  aria-label="Previous month"
                  className="rounded-full border border-white/15 bg-black/60 p-2.5 transition hover:bg-purple-600"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6" /></svg>
                </button>
                <div className="text-center">
                  <h2 className="text-2xl font-bold sm:text-3xl">{MONTH_NAMES[month]} {year}</h2>
                  <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
                    {monthEventCount + ongoing.length} event{monthEventCount + ongoing.length === 1 ? '' : 's'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => shiftMonth(1)}
                  aria-label="Next month"
                  className="rounded-full border border-white/15 bg-black/60 p-2.5 transition hover:bg-purple-600"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6" /></svg>
                </button>
              </div>

              <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
                {WEEKDAYS.map((w) => (
                  <div key={w} className="pb-2 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">{w}</div>
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
                      className={`flex aspect-square flex-col items-center justify-between rounded-xl border p-1 text-sm transition sm:items-start sm:p-2 ${
                        isSelected
                          ? 'border-purple-400/70 bg-purple-600/25'
                          : list.length
                            ? 'border-white/15 bg-white/[0.05] hover:border-purple-400/40'
                            : 'border-white/5 bg-black/20 hover:border-white/20'
                      }`}
                    >
                      <span className={`text-xs font-semibold sm:text-sm ${key === todayKey ? 'rounded-full bg-purple-500 px-1.5 text-white' : 'text-slate-300'}`}>
                        {date.getDate()}
                      </span>
                      {list.length > 0 && (
                        <span className="flex flex-wrap items-center justify-center gap-0.5 sm:justify-start">
                          {list.slice(0, 4).map((e) => (
                            <span key={e.id} className={`h-1.5 w-1.5 rounded-full ${colorFor(e.clubs[0])}`} />
                          ))}
                          {list.length > 4 && <span className="text-[9px] text-slate-400">+{list.length - 4}</span>}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Side panel */}
            <aside className="space-y-8">
              <section className="rounded-[2rem] border border-white/12 bg-[linear-gradient(180deg,rgba(14,18,32,0.7),rgba(10,12,22,0.4))] p-6 shadow-[0_30px_100px_rgba(0,0,0,0.5)] backdrop-blur-2xl">
                <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.3em] text-purple-300">
                  {selected
                    ? parseDate(selected).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })
                    : 'Select a day'}
                </h3>
                {selected ? (
                  selectedEvents.length ? (
                    <ul className="space-y-3">{selectedEvents.map((e) => <EventRow key={e.id} e={e} />)}</ul>
                  ) : (
                    <p className="text-sm text-slate-400">No events on this day.</p>
                  )
                ) : (
                  <p className="text-sm text-slate-400">Pick a highlighted date to see what’s happening.</p>
                )}
              </section>

              {ongoing.length > 0 && (
                <section className="rounded-[2rem] border border-white/12 bg-[linear-gradient(180deg,rgba(14,18,32,0.7),rgba(10,12,22,0.4))] p-6 shadow-[0_30px_100px_rgba(0,0,0,0.5)] backdrop-blur-2xl">
                  <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.3em] text-purple-300">
                    Ongoing &amp; multi-week
                  </h3>
                  <ul className="space-y-3">{ongoing.map((e) => <EventRow key={e.id} e={e} />)}</ul>
                </section>
              )}
            </aside>
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
}
