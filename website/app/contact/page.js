'use client';

import { useEffect, useState } from 'react';
import Navbar from '../components/navbar';
import SplineScene from '@/app/components/SplineScene';
import { fetchCabinet } from '@/lib/api';
import Footer from '../components/footer';
import { PageShell, PageHeader, SectionHeader, LoadingState, ErrorState, EmptyState, PersonCard } from '../components/ui';

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
    <main className="relative min-h-screen overflow-x-hidden bg-black text-white">
      <Navbar />

      {/* 3D Spline background scene — interactive */}
      <SplineScene url="https://prod.spline.design/Wo6UttIK8jjj1QsT/scene.splinecode" interactive={true} />

      <PageShell>
        <PageHeader
          title="Cabinet"
          description="The people leading student innovation, technical clubs and engineering teams at IIT Bombay. Reach out to any of us."
        />

        {loading && <LoadingState label="Loading cabinet" />}
        {error && <ErrorState title="Couldn't load the cabinet" message={error} />}
        {!loading && !error && cabinet.length === 0 && <EmptyState>No cabinet members yet.</EmptyState>}

        {!loading && !error && cabinet.length > 0 && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {cabinet.map((member) => (
              <PersonCard
                key={member.id}
                name={member.name}
                role={member.position}
                image={member.image}
                email={member.email}
                phone={member.phone}
                linkedin={member.linkedin}
                instagram={member.instagram}
              />
            ))}
          </div>
        )}

        <section className="mt-28">
          <SectionHeader
            title="Student Activity Centre"
            description="ITC works out of the Student Activity Centre (SAC), IIT Bombay, Powai, Mumbai."
          />
          <div className="card overflow-hidden p-2">
            <iframe
              title="Map of the Student Activity Centre, IIT Bombay"
              className="h-[420px] w-full rounded-xl"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1550.7623311490229!2d72.91352570167592!3d19.135329810827326!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7b809cdbb26f9%3A0x1bc7aa048f060162!2sStudents%20Activity%20Center!5e0!3m2!1sen!2sin!4v1725463700699!5m2!1sen!2sin"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </section>
      </PageShell>
      <Footer />
    </main>
  );
}
