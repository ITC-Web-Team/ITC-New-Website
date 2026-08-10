'use client';

import { useEffect, useState } from 'react';
import Navbar from '../components/navbar';
import SplineScene from '@/app/components/SplineScene';
import { fetchCabinet } from '@/lib/api';
import Footer from '../components/footer';

export default function Contact() {
  const [cabinet, setCabinet] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchCabinet();
        setCabinet(Array.isArray(data) ? data : data.results || []);
      } catch (err) {
        console.error('Error fetching cabinet:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <main className="relative min-h-screen bg-black text-white overflow-x-hidden selection:bg-purple-500/30">
      {/* Navbar */}
      <Navbar />

      {/* 3D Spline Background Scene — interactive */}
      <SplineScene url="https://prod.spline.design/Wo6UttIK8jjj1QsT/scene.splinecode" interactive={true} />

      {/* Ultra-light accent tint only */}
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top,rgba(168,85,247,0.07),transparent_50%),radial-gradient(circle_at_bottom_right,rgba(99,102,241,0.05),transparent_45%)] z-1" />

      {/* Content Container */}
      <div className="relative z-10 min-h-screen pt-32 pb-28 px-4 sm:px-6 lg:px-10 max-w-7xl mx-auto space-y-20">
        {/* Hero Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-black/40 px-4 py-1.5 backdrop-blur-md shadow-xl">
            <span className="h-1.5 w-1.5 rounded-full bg-purple-400 animate-pulse" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.35em] text-white/70">
              Institute Technical Council
            </span>
          </div>

          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-100 to-purple-400 drop-shadow-[0_10px_35px_rgba(168,85,247,0.3)]">
            Cabinet
          </h1>

          <p className="text-slate-300/80 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed pt-1">
            Meet the team leading student innovation, technical clubs, and engineering teams at IIT Bombay.
          </p>

          <div className="pt-2">
            <div className="h-px w-28 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent mx-auto" />
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-12 h-12 border-2 border-purple-500/30 border-t-purple-400 rounded-full animate-spin shadow-[0_0_20px_rgba(168,85,247,0.5)]" />
            <p className="text-xs font-semibold tracking-[0.3em] text-slate-400 uppercase">
              Loading Cabinet Members...
            </p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center text-red-400 py-16 bg-red-950/40 rounded-[2rem] border border-red-500/30 backdrop-blur-2xl max-w-lg mx-auto shadow-2xl">
            <p className="text-lg font-bold">Failed to load cabinet members</p>
            <p className="text-sm text-red-300/80 mt-1">{error}</p>
          </div>
        )}

        {/* Cabinet Members Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
            {cabinet.map((member) => (
              <article
                key={member.id}
                className="group relative overflow-hidden rounded-[2rem] border border-white/12 bg-[linear-gradient(180deg,rgba(14,18,32,0.7),rgba(10,12,22,0.4))] p-8 shadow-[0_30px_100px_rgba(0,0,0,0.5)] backdrop-blur-2xl transition-all duration-500 hover:-translate-y-2 hover:border-purple-400/40 hover:shadow-[0_30px_100px_rgba(168,85,247,0.25)] flex flex-col items-center text-center"
              >
                {/* Neon Glow Highlight on Hover */}
                <div className="pointer-events-none absolute -inset-x-20 -top-20 h-40 bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-blue-600/20 blur-3xl opacity-0 transition-opacity duration-700 group-hover:opacity-100" />

                {/* Profile Picture */}
                {member.image && (
                  <div className="relative w-36 h-36 mb-6 rounded-3xl overflow-hidden border-2 border-white/15 shadow-2xl group-hover:border-purple-400/50 transition-all duration-500 group-hover:scale-105">
                    <img
                      className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
                      src={member.image}
                      alt={`Profile picture of ${member.name}`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                )}

                {/* Name & Position */}
                {member.name && (
                  <h2 className="text-2xl font-bold text-white group-hover:text-purple-200 transition-colors mb-1.5 leading-snug">
                    {member.name}
                  </h2>
                )}
                {member.position && (
                  <span className="inline-block px-3 py-1 rounded-full border border-purple-400/30 bg-purple-500/10 text-[10px] font-bold uppercase tracking-[0.25em] text-purple-300 mb-6">
                    {member.position}
                  </span>
                )}

                {/* Contact Info */}
                <div className="w-full space-y-2.5 mb-6 pt-5 border-t border-white/10 text-xs">
                  {member.email && (
                    <a
                      href={`mailto:${member.email}`}
                      className="flex items-center justify-center gap-2 text-slate-300 hover:text-purple-300 transition-colors py-2 px-3 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/10"
                    >
                      <svg className="w-4 h-4 text-purple-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span className="truncate">{member.email}</span>
                    </a>
                  )}
                  {member.phone && (
                    <a
                      href={`tel:${member.phone}`}
                      className="flex items-center justify-center gap-2 text-slate-300 hover:text-purple-300 transition-colors py-2 px-3 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/10"
                    >
                      <svg className="w-4 h-4 text-purple-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span>{member.phone}</span>
                    </a>
                  )}
                </div>

                {/* Social Links Buttons */}
                <div className="flex justify-center gap-3 mt-auto pt-2">
                  {member.linkedin && (
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-11 w-11 items-center justify-center rounded-full border border-white/12 bg-white/5 text-slate-300 transition duration-300 hover:-translate-y-1 hover:border-purple-400/50 hover:bg-purple-600/30 hover:text-white hover:shadow-[0_0_20px_rgba(168,85,247,0.4)]"
                      aria-label="LinkedIn"
                    >
                      <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.475-2.236-1.986-2.236-1.081 0-1.722.731-2.004 1.437-.103.25-.129.599-.129.948v5.42h-3.554s.05-8.736 0-9.646h3.554v1.348c-.013.021-.031.042-.044.063h.044v-.063c.42-.648 1.169-1.574 2.823-1.574 2.064 0 3.61 1.348 3.61 4.253v5.62zM5.337 8.855c-1.144 0-1.915-.758-1.915-1.706 0-.955.767-1.703 1.96-1.703 1.188 0 1.913.75 1.937 1.703 0 .948-.749 1.706-1.982 1.706zm1.581 11.597H3.72V8.806h3.198v11.646zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
                      </svg>
                    </a>
                  )}
                  {member.instagram && (
                    <a
                      href={member.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-11 w-11 items-center justify-center rounded-full border border-white/12 bg-white/5 text-slate-300 transition duration-300 hover:-translate-y-1 hover:border-pink-400/50 hover:bg-pink-600/30 hover:text-white hover:shadow-[0_0_20px_rgba(236,72,153,0.4)]"
                      aria-label="Instagram"
                    >
                      <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1 1 12.324 0 6.162 6.162 0 0 1-12.324 0zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm4.965-10.322a1.44 1.44 0 1 1 2.881.001 1.44 1.44 0 0 1-2.881-.001z" />
                      </svg>
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Location Section */}
        <div className="pt-12">
          <div className="text-center mb-8 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.35em] text-pink-400">
              Campus Location
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-300 to-rose-400">
              Where to Find Us
            </h2>
          </div>

          <div className="overflow-hidden rounded-[2.2rem] border border-white/12 bg-[linear-gradient(180deg,rgba(14,18,32,0.7),rgba(10,12,22,0.4))] p-4 sm:p-6 shadow-[0_30px_100px_rgba(0,0,0,0.6)] backdrop-blur-2xl">
            <iframe
              className="w-full h-[440px] rounded-2xl border border-white/10"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1550.7623311490229!2d72.91352570167592!3d19.135329810827326!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7b809cdbb26f9%3A0x1bc7aa048f060162!2sStudents%20Activity%20Center!5e0!3m2!1sen!2sin!4v1725463700699!5m2!1sen!2sin"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
