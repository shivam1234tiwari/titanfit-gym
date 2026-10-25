import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';

const FALLBACK_TRAINERS = [
  {
    _id: '1',
    name: 'Elena Rostova',
    role: 'HIIT & Mobility Specialist',
    specialization: 'HIIT Training & Joint Mobility',
    experienceYears: 6,
    rating: 5.0,
    about: 'Elena blends explosive cardiovascular conditioning with joint mobility routines to ensure fat loss while maintaining joint longevity.',
    specialties: ['HIIT Training', 'Mobility & Stretching', 'Fat Loss'],
    certifications: ['CrossFit L2', 'Yoga Alliance RYT-500'],
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80&w=600'
  },
  {
    _id: '2',
    name: 'Marcus Vance',
    role: 'Head Strength & Conditioning',
    specialization: 'Powerlifting & Hypertrophy',
    experienceYears: 8,
    rating: 4.9,
    about: 'Marcus has trained elite athletes and bodybuilders for over 8 years. He specializes in strength progression, powerlifting, and hypertrophy.',
    specialties: ['Powerlifting', 'Hypertrophy', 'Injury Prevention'],
    certifications: ['CSCS Certified', 'Olympic Lifting'],
    image: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?auto=format&fit=crop&q=80&w=600'
  },
  {
    _id: '3',
    name: 'Vikram Singh',
    role: 'Fat Loss & Endurance Coach',
    specialization: 'Functional Training & Fat Loss',
    experienceYears: 5,
    rating: 4.9,
    about: 'Vikram specializes in body re-composition, metabolic conditioning, and endurance development through high-intensity circuit training.',
    specialties: ['TRX Suspension', 'Metabolic Conditioning', 'Calisthenics'],
    certifications: ['ISSA Strength Coach', 'TRX Specialist'],
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600'
  }
];

export default function Trainers() {
  const [trainers, setTrainers] = useState(FALLBACK_TRAINERS);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/trainers`);
        if (!res.ok) throw new Error('Server error');
        const data = await res.json();

        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          setTrainers(data.data);
        }
      } catch (err) {
        console.warn('Backend API unavailable, displaying default trainers:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrainers();
  }, []);

  return (
    <section id="trainers" className="bg-slate-950 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="mb-2 text-sm font-bold uppercase tracking-widest text-amber-500">
            Expert Coaches
          </h2>
          <h3 className="text-3xl font-extrabold text-white sm:text-4xl">
            Train With The Very Best
          </h3>
          <p className="mt-2 text-sm text-slate-400">
            Click on any coach to view their full profile, bio, and specialization details.
          </p>
        </div>

        {loading ? (
          <div className="text-center text-amber-500 text-sm font-bold py-10">
            Loading Trainers...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {trainers.map((trainer) => (
              <div
                key={trainer._id || trainer.id}
                className="bg-slate-900/60 border border-slate-800/80 rounded-2xl overflow-hidden hover:border-amber-500/50 transition-all flex flex-col"
              >
                <img
                  src={trainer.image}
                  alt={trainer.name}
                  className="w-full h-64 object-cover object-top"
                />
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-xl font-bold text-white">{trainer.name}</h4>
                      <span className="text-amber-400 font-extrabold text-xs">
                        ★ {trainer.rating || '4.9'}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-amber-500 mb-3">{trainer.role}</p>
                    <p className="text-slate-400 text-xs mb-4 line-clamp-3">{trainer.about}</p>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-800">
                    {(trainer.specialties || []).map((spec, idx) => (
                      <span
                        key={idx}
                        className="bg-slate-950 text-slate-300 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-slate-800"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}