import React from 'react';

const trainers = [
  {
    name: 'Marcus Vance',
    role: 'Head Strength & Conditioning',
    experience: '8+ Years Exp.',
    image: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?auto=format&fit=crop&q=80&w=600',
    certifications: ['CSCS Certified', 'Olympic Lifting']
  },
  {
    name: 'Elena Rostova',
    role: 'HIIT & Mobility Specialist',
    experience: '6+ Years Exp.',
    image: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?auto=format&fit=crop&q=80&w=600',
    certifications: ['CrossFit L2', 'Yoga Alliance RYT-500']
  },
  {
    name: 'David Miller',
    role: 'Bodybuilding & Powerlifting Coach',
    experience: '10+ Years Exp.',
    image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&q=80&w=600',
    certifications: ['NASM CPT', 'Precision Nutrition L2']
  },
  {
    name: 'Sophia Chen',
    role: 'Pilates & Functional Movement',
    experience: '5+ Years Exp.',
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&q=80&w=600',
    certifications: ['ACE Certified', 'Pilates Master Trainer']
  },
  {
    name: 'Vikram Singh',
    role: 'Fat Loss & Endurance Coach',
    experience: '7+ Years Exp.',
    image: 'https://images.unsplash.com/photo-1534367507873-d2d7e24c797f?auto=format&fit=crop&q=80&w=600',
    certifications: ['ISSA Strength Coach', 'TRX Specialist']
  },
  {
    name: 'Aaliyah Khan',
    role: 'Boxing & Athletic Conditioning',
    experience: '9+ Years Exp.',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80&w=600',
    certifications: ['USA Boxing Coach', 'Kettlebell L2']
  }
];

export default function Trainers() {
  return (
    <section id="trainers" className="py-20 bg-slate-900/40">
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
            Our certified master trainers are here to guide, push, and help you reach your peak potential.
          </p>
        </div>

        {/* 6 Trainers Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {trainers.map((trainer, idx) => (
            <div
              key={idx}
              className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-amber-500/50 transition-all duration-300 group flex flex-col shadow-lg"
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
                  <h4 className="text-xl font-bold text-white mb-1">{trainer.name}</h4>
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
    </section>
  );
}