'use client';

import { useEffect, useState } from 'react';
import SplineScene from '@/app/components/SplineScene';
import { fetchCabinet } from '@/lib/api';

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
    <div className="relative">
      {/* Spline Background */}
      <SplineScene url="lef3qDOiHdOfbags" />

      {/* Content */}
      <div className="relative z-10 min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Header */}
          <h1 className="text-4xl md:text-6xl font-bold text-center mb-16 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
            Cabinet
          </h1>

          {/* Loading State */}
          {loading && (
            <div className="text-center text-gray-400">
              <p>Loading cabinet members...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center text-red-400">
              <p>Error loading cabinet: {error}</p>
            </div>
          )}

          {/* Cabinet Members Grid */}
          {!loading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
              {cabinet.map((member) => (
                <div
                  key={member.id}
                  className="group bg-slate-800/50 backdrop-blur-md rounded-2xl border border-slate-700/50 p-6 transition-all duration-300 hover:scale-102 hover:shadow-lg hover:shadow-blue-500/10"
                >
                  {/* Profile Section */}
                  <div className="flex flex-col items-center text-center mb-6">
                    {member.image && (
                      <div className="w-32 h-32 mb-4 rounded-2xl overflow-hidden">
                        <img
                          className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
                          src={member.image}
                          alt={`Profile picture of ${member.name}`}
                        />
                      </div>
                    )}
                    {member.name && (
                      <h2 className="text-2xl font-bold text-white mb-2">
                        {member.name}
                      </h2>
                    )}
                    {member.position && (
                      <p className="text-blue-400 font-medium">{member.position}</p>
                    )}
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-3 mb-6">
                    {member.email && (
                      <div className="flex items-center justify-center gap-2 text-gray-300 hover:text-blue-400 transition-colors">
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                        <a href={`mailto:${member.email}`}>{member.email}</a>
                      </div>
                    )}
                    {member.phone && (
                      <div className="flex items-center justify-center gap-2 text-gray-300 hover:text-blue-400 transition-colors">
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          />
                        </svg>
                        <a href={`tel:${member.phone}`}>{member.phone}</a>
                      </div>
                    )}
                  </div>

                  {/* Social Links */}
                  <div className="flex justify-center gap-4">
                    {member.linkedin && (
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="transform transition-transform hover:scale-110"
                      >
                        <svg
                          className="w-8 h-8 text-gray-400 hover:text-blue-400 transition-colors"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.475-2.236-1.986-2.236-1.081 0-1.722.731-2.004 1.437-.103.25-.129.599-.129.948v5.42h-3.554s.05-8.736 0-9.646h3.554v1.348c-.013.021-.031.042-.044.063h.044v-.063c.42-.648 1.169-1.574 2.823-1.574 2.064 0 3.61 1.348 3.61 4.253v5.62zM5.337 8.855c-1.144 0-1.915-.758-1.915-1.706 0-.955.767-1.703 1.96-1.703 1.188 0 1.913.75 1.937 1.703 0 .948-.749 1.706-1.982 1.706zm1.581 11.597H3.72V8.806h3.198v11.646zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
                        </svg>
                      </a>
                    )}
                    {member.instagram && (
                      <a
                        href={member.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="transform transition-transform hover:scale-110"
                      >
                        <svg
                          className="w-8 h-8 text-gray-400 hover:text-pink-400 transition-colors"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1 1 12.324 0 6.162 6.162 0 0 1-12.324 0zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm4.965-10.322a1.44 1.44 0 1 1 2.881.001 1.44 1.44 0 0 1-2.881-.001z" />
                        </svg>
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Location Section */}
          <div className="mt-20">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              Where to Find Us
            </h2>
            <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl border border-slate-700/50 p-6 overflow-hidden">
              <iframe
                className="w-full h-[400px] rounded-xl"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1550.7623311490229!2d72.91352570167592!3d19.135329810827326!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7b809cdbb26f9%3A0x1bc7aa048f060162!2sStudents%20Activity%20Center!5e0!3m2!1sen!2sin!4v1725463700699!5m2!1sen!2sin"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
