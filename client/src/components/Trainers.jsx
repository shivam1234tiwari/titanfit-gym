import React, { useState, useEffect } from 'react';
import { Award, Star, CheckCircle2, X, Calendar, Sparkles } from 'lucide-react';
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
  const [selectedTrainer, setSelectedTrainer] = useState(null);

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

  // Modal key bindings & body scroll lock
  useEffect(() => {
    if (!selectedTrainer) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setSelectedTrainer(null);
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [selectedTrainer]);

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
            Click on any coach card to view their full bio, certifications, and booking options.
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
                onClick={() => setSelectedTrainer(trainer)}
                className="group cursor-pointer bg-slate-900/60 border border-slate-800/80 rounded-2xl overflow-hidden hover:border-amber-500/60 hover:-translate-y-1 transition-all duration-300 flex flex-col shadow-lg hover:shadow-amber-500/10"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={trainer.image}
                    alt={trainer.name}
                    className="w-full h-64 object-cover object-top transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-300 flex items-end p-4">
                    <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" /> View Full Profile
                    </span>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-xl font-bold text-white group-hover:text-amber-400 transition">
                        {trainer.name}
                      </h4>
                      <span className="text-amber-400 font-extrabold text-xs flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-amber-400" /> {trainer.rating || '4.9'}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-amber-500 mb-3">{trainer.role}</p>
                    <p className="text-slate-400 text-xs mb-4 line-clamp-3">{trainer.about}</p>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-3 border-t border-slate-800">
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

      {/* Trainer Detail Modal */}
      {selectedTrainer && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/80 p-4 backdrop-blur-sm"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setSelectedTrainer(null);
          }}
        >
          <div className="relative my-auto w-full max-w-xl overflow-hidden rounded-3xl border border-slate-700 bg-slate-900 shadow-2xl">
            {/* Modal Header Banner */}
            <div className="relative h-48 sm:h-56">
              <img
                src={selectedTrainer.image}
                alt={selectedTrainer.name}
                className="w-full h-full object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />

              <button
                type="button"
                onClick={() => setSelectedTrainer(null)}
                className="absolute right-4 top-4 rounded-xl border border-slate-700 bg-slate-950/70 p-2 text-slate-300 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-4 left-6 right-6">
                <span className="text-xs font-extrabold text-amber-400 uppercase tracking-widest bg-slate-950/80 px-2.5 py-1 rounded-full border border-amber-500/30">
                  {selectedTrainer.role}
                </span>
                <h3 className="text-2xl font-black text-white mt-1">
                  {selectedTrainer.name}
                </h3>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 text-xs text-slate-300">
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">
                  <p className="text-[10px] text-slate-500 uppercase font-bold">Experience</p>
                  <p className="text-sm font-bold text-white mt-0.5">
                    {selectedTrainer.experienceYears || '5+'} Years
                  </p>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">
                  <p className="text-[10px] text-slate-500 uppercase font-bold">Rating</p>
                  <p className="text-sm font-bold text-amber-400 mt-0.5 flex items-center justify-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400" /> {selectedTrainer.rating || '4.9'}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-white mb-1">About Coach</h4>
                <p className="leading-5 text-slate-400">{selectedTrainer.about}</p>
              </div>

              {selectedTrainer.certifications && selectedTrainer.certifications.length > 0 && (
                <div>
                  <h4 className="font-bold text-white mb-2 flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-amber-500" /> Certifications
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedTrainer.certifications.map((cert, idx) => (
                      <span
                        key={idx}
                        className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-950 px-2.5 py-1 text-slate-300"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2 border-t border-slate-800 flex gap-3">
                <a
                  href="#contact"
                  onClick={() => setSelectedTrainer(null)}
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 py-3 text-xs font-extrabold text-slate-950 hover:bg-amber-400 transition"
                >
                  <Calendar className="w-4 h-4" /> Book Consultation
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}