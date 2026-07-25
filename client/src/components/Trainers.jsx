import React from 'react';

const trainers = [
  {
    name: 'Marcus Vance',
    role: 'Head Strength & Conditioning',
    experience: '8+ Years Exp.',
    image: 'image_agent_tag_18071575271101855258',
    certifications: ['CSCS Certified', 'Olympic Lifting Specialist']
  },
  {
    name: 'Elena Rostova',
    role: 'HIIT & Mobility Coach',
    experience: '6+ Years Exp.',
    image: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?auto=format&fit=crop&q=80&w=600',
    certifications: ['CrossFit L2', 'Yoga Alliance RYT-500']
  },
  {
    name: 'David Miller',
    role: 'Bodybuilding & Nutrition',
    experience: '10+ Years Exp.',
    image: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?auto=format&fit=crop&q=80&w=600',
    certifications: ['NASM CPT', 'Precision Nutrition L2']
  }
];

export default function Trainers() {
  return (
    <section id="trainers" className="py-20 bg-slate-900/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-amber-500 text-sm font-bold tracking-widest uppercase mb-2">Expert Coaches</h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-white">Train With The Very Best</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {trainers.map((trainer, idx) => (
            <div
              key={idx}
              className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-amber-500/50 transition-all group flex flex-col"
            >
              <div className="h-72 overflow-hidden relative">
                <img
                  src={trainer.image}
                  alt={trainer.name}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute bottom-3 right-3 bg-slate-950/80 backdrop-blur-md text-amber-400 text-xs font-semibold px-3 py-1 rounded-full border border-amber-500/20">
                  {trainer.experience}
                </span>
              </div>

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
                        className="bg-slate-800 text-slate-300 text-[11px] px-2.5 py-1 rounded-md font-medium"
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