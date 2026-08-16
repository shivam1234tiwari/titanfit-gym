import React, { useState } from 'react';
import { X, Award, CheckCircle2, Star, Calendar } from 'lucide-react';

const trainers = [
  {
    name: 'Marcus Vance',
    role: 'Head Strength & Conditioning',
    experience: '8+ Years Exp.',
    image: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?auto=format&fit=crop&q=80&w=600',
    certifications: ['CSCS Certified', 'Olympic Lifting'],
    bio: 'Marcus has trained elite athletes and bodybuilders for over 8 years. He specializes in strength progression, powerlifting, and hypertrophy.',
    specialties: ['Powerlifting', 'Hypertrophy', 'Injury Prevention'],
    rating: '4.9'
  },
  {
    name: 'Elena Rostova',
    role: 'HIIT & Mobility Specialist',
    experience: '6+ Years Exp.',
    image: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?auto=format&fit=crop&q=80&w=600',
    certifications: ['CrossFit L2', 'Yoga Alliance RYT-500'],
    bio: 'Elena blends explosive cardiovascular conditioning with joint mobility routines to ensure fat loss while maintaining joint longevity.',
    specialties: ['HIIT Training', 'Mobility & Stretching', 'Fat Loss'],
    rating: '5.0'
  },
  {
    name: 'David Miller',
    role: 'Bodybuilding & Powerlifting Coach',
    experience: '10+ Years Exp.',
    image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&q=80&w=600',
    certifications: ['NASM CPT', 'Precision Nutrition L2'],
    bio: 'David combines science-backed strength programming with macro nutrition strategy to help members maximize muscle gains.',
    specialties: ['Contest Prep', 'Strength Mechanics', 'Nutrition Coaching'],
    rating: '4.9'
  },
  {
    name: 'Sophia Chen',
    role: 'Pilates & Functional Movement',
    experience: '5+ Years Exp.',
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&q=80&w=600',
    certifications: ['ACE Certified', 'Pilates Master Trainer'],
    bio: 'Sophia focuses on core alignment, posture correction, and body awareness through low-impact Pilates and functional movement.',
    specialties: ['Mat & Reformer Pilates', 'Core Stability', 'Postural Realignment'],
    rating: '4.8'
  },
  {
    name: 'Vikram Singh',
    role: 'Fat Loss & Endurance Coach',
    experience: '7+ Years Exp.',
    image: 'https://images.unsplash.com/photo-1534367507873-d2d7e24c797f?auto=format&fit=crop&q=80&w=600',
    certifications: ['ISSA Strength Coach', 'TRX Specialist'],
    bio: 'Vikram specializes in body re-composition, metabolic conditioning, and endurance development through high-intensity circuit training.',
    specialties: ['TRX Suspension', 'Metabolic Conditioning', 'Calisthenics'],
    rating: '4.9'
  },
  {
    name: 'Aaliyah Khan',
    role: 'Boxing & Athletic Conditioning',
    experience: '9+ Years Exp.',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80&w=600',
    certifications: ['USA Boxing Coach', 'Kettlebell L2'],
    bio: 'Aaliyah brings intense combat-sports conditioning, quick footwork drills, and kettlebell movements to build explosive speed.',
    specialties: ['Boxing Footwork', 'Heavy Bag Drills', 'Explosive Power'],
    rating: '5.0'
  }
];

export default function Trainers() {
  const [selectedTrainer, setSelectedTrainer] = useState(null);

  return (
    <section id="trainers" className="py-20 bg-slate-900/40 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-amber-500 text-sm font-bold tracking-widest uppercase mb-2">
            Expert Coaches
          </h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-white">
            Train With The Very Best
          </h3>
          <p className="text-slate-400 text-sm sm:text-base mt-2">
            Click on any coach to view their full profile, bio, and specialization details.
          </p>
        </div>

        {/* 6 Trainers Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {trainers.map((trainer, idx) => (
            <div
              key={idx}
              onClick={() => setSelectedTrainer(trainer)}
              className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-amber-500/50 transition-all duration-300 group flex flex-col shadow-lg cursor-pointer hover:scale-[1.02]"
            >
              {/* Photo Container */}
              <div className="h-80 overflow-hidden relative">
                <img
                  src={trainer.image}
                  alt={trainer.name}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute bottom-3 right-3 bg-slate-950/80 backdrop-blur-md text-amber-400 text-xs font-semibold px-3 py-1 rounded-full border border-amber-500/20">
                  {trainer.experience}
                </span>
              </div>

              {/* Information Container */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="text-xl font-bold text-white mb-1 group-hover:text-amber-500 transition-colors">
                    {trainer.name}
                  </h4>
                  <p className="text-amber-500 text-sm font-medium mb-4">{trainer.role}</p>
                </div>

                <div className="pt-4 border-t border-slate-800/80">
                  <p className="text-xs text-slate-400 mb-2 font-medium">Certifications:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {trainer.certifications.map((cert, i) => (
                      <span
                        key={i}
                        className="bg-slate-800 text-slate-300 text-[11px] px-2.5 py-1 rounded-md font-medium border border-slate-700/50"
                      >
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* ========================================================
          CLICK MODAL POPUP (FULL COACH DETAILS)
         ======================================================== */}
      {selectedTrainer && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-2xl overflow-hidden relative shadow-2xl text-slate-100 animate-in fade-in zoom-in-95 duration-200">
            
            {/* Close Button */}
            <button
              onClick={() => setSelectedTrainer(null)}
              className="absolute top-4 right-4 z-10 bg-slate-950/70 text-slate-300 hover:text-white p-2 rounded-full backdrop-blur-sm border border-slate-800 cursor-pointer transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header Image */}
            <div className="relative h-56 sm:h-64">
              <img
                src={selectedTrainer.image}
                alt={selectedTrainer.name}
                className="w-full h-full object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
              <div className="absolute bottom-4 left-6 right-6 flex justify-between items-end">
                <div>
                  <h3 className="text-2xl font-bold text-white">{selectedTrainer.name}</h3>
                  <p className="text-xs text-amber-500 font-medium">{selectedTrainer.role}</p>
                </div>
                <div className="bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold px-2.5 py-1 rounded-lg flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" /> {selectedTrainer.rating}
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
              {/* Bio */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">About Coach</h4>
                <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-3 rounded-xl border border-slate-800">
                  {selectedTrainer.bio}
                </p>
              </div>

              {/* Specialties */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Key Specialties</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedTrainer.specialties.map((spec, i) => (
                    <span key={i} className="bg-slate-950 text-emerald-400 border border-emerald-500/30 text-xs px-3 py-1 rounded-lg flex items-center gap-1.5 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> {spec}
                    </span>
                  ))}
                </div>
              </div>

              {/* Certifications */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Certifications</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedTrainer.certifications.map((cert, i) => (
                    <span key={i} className="bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-medium px-3 py-1 rounded-lg flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5" /> {cert}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2">
                <button
                  onClick={() => {
                    alert(`Booking consultation with ${selectedTrainer.name}`);
                    setSelectedTrainer(null);
                  }}
                  className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-3 rounded-xl text-xs transition-colors cursor-pointer shadow-lg shadow-amber-500/10 flex items-center justify-center gap-2"
                >
                  <Calendar className="w-4 h-4" /> Book Consultation with {selectedTrainer.name.split(' ')[0]}
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </section>
  );
}