import React, { useState } from 'react';
import { Sparkles, HeartPulse, Award, X, User, ChevronRight } from 'lucide-react';

export default function SeniorAndExpertsSection({ userAge = 62 }) {
  const [selectedExpert, setSelectedExpert] = useState(null);

  // Experts / Trainers Data List
  const expertsList = [
    {
      id: 1,
      name: 'Alex Rivera',
      role: 'Senior Strength Coach',
      exp: '8+ Years',
      bio: 'Specializes in powerlifting, body composition, functional strength training, and injury recovery.',
      image: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=300'
    },
    {
      id: 2,
      name: 'Sarah Jenkins',
      role: 'Yoga & Senior Mobility Expert',
      exp: '6+ Years',
      bio: 'Focuses on active aging, joint longevity, balance enhancement, and stress-relieving breathing techniques.',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300'
    },
    {
      id: 3,
      name: 'Marcus Vance',
      role: 'Cardio & Endurance Specialist',
      exp: '5+ Years',
      bio: 'Expert in low-impact cardiovascular training, stamina building, and personalized body transformation.',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300'
    }
  ];

  return (
    <div className="space-y-8 bg-slate-950 p-6 rounded-2xl border border-slate-800 text-slate-100 max-w-5xl mx-auto">
      
      {/* ========================================================
          1. SENIOR CITIZEN RECOMMENDATIONS (ONLY FOR AGE 60+)
         ======================================================== */}
      {userAge >= 60 && (
        <div className="bg-emerald-950/40 border border-emerald-500/30 p-5 rounded-2xl relative overflow-hidden">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm mb-2">
            <HeartPulse className="w-5 h-5 text-emerald-400 animate-pulse" />
            <span>Senior Citizen Wellness Advisory (Age 60+ Special)</span>
          </div>
          
          <p className="text-xs text-emerald-200/80 mb-4 leading-relaxed">
            Custom low-impact exercise routines designed to protect joint health, improve core balance, and boost mobility safely.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-slate-900/90 p-4 rounded-xl border border-emerald-500/20 space-y-1 hover:border-emerald-500/40 transition-colors">
              <h4 className="text-xs font-bold text-emerald-400">🧘 Gentle Yoga & Breathing</h4>
              <p className="text-[11px] text-slate-400 leading-normal">
                Enhances spine flexibility, posture, and joint lubrication with zero impact.
              </p>
            </div>

            <div className="bg-slate-900/90 p-4 rounded-xl border border-emerald-500/20 space-y-1 hover:border-emerald-500/40 transition-colors">
              <h4 className="text-xs font-bold text-emerald-400">🚶 Light Exercises & Stretches</h4>
              <p className="text-[11px] text-slate-400 leading-normal">
                20-minute daily light resistance band drills & treadmill walking.
              </p>
            </div>

            <div className="bg-slate-900/90 p-4 rounded-xl border border-emerald-500/20 space-y-1 hover:border-emerald-500/40 transition-colors">
              <h4 className="text-xs font-bold text-emerald-400">💧 Low-Impact Cardio</h4>
              <p className="text-[11px] text-slate-400 leading-normal">
                Stationary cycling and water aerobics to keep heart health strong.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          2. EXPERTS / TRAINERS LIST (CLICKABLE CARDS)
         ======================================================== */}
      <div>
        <div className="mb-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            <span>Meet Our Gym Experts</span>
          </h3>
          <p className="text-xs text-slate-400">Click on any trainer to view full profile & specialization</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {expertsList.map((expert) => (
            <div
              key={expert.id}
              onClick={() => setSelectedExpert(expert)}
              className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between cursor-pointer hover:border-amber-500/50 hover:bg-slate-800/80 transition-all group shadow-sm"
            >
              <div className="flex items-center gap-3">
                <img
                  src={expert.image}
                  alt={expert.name}
                  className="w-12 h-12 rounded-full object-cover border border-amber-500/40 group-hover:scale-105 transition-transform"
                />
                <div>
                  <h4 className="text-xs font-bold text-white group-hover:text-amber-500 transition-colors">
                    {expert.name}
                  </h4>
                  <p className="text-[11px] text-slate-400">{expert.role}</p>
                  <span className="text-[10px] text-amber-400 font-medium">{expert.exp}</span>
                </div>
              </div>

              <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-amber-500 group-hover:translate-x-1 transition-all" />
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================
          3. EXPERT DETAIL MODAL
         ======================================================== */}
      {selectedExpert && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-sm rounded-2xl p-6 relative shadow-2xl text-slate-100 animate-in fade-in zoom-in-95 duration-200">
            
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setSelectedExpert(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Body */}
            <div className="text-center space-y-4">
              <img
                src={selectedExpert.image}
                alt={selectedExpert.name}
                className="w-20 h-20 rounded-full object-cover mx-auto border-2 border-amber-500 shadow-md"
              />
              
              <div>
                <h3 className="text-lg font-bold text-white">{selectedExpert.name}</h3>
                <p className="text-xs text-amber-500 font-medium">{selectedExpert.role}</p>
                <span className="inline-block mt-1.5 text-[10px] bg-slate-800 text-slate-300 px-3 py-0.5 rounded-full border border-slate-700 font-medium">
                  Experience: {selectedExpert.exp}
                </span>
              </div>

              <div className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-left">
                <span className="text-amber-500 font-bold block mb-1">Specialization & Bio:</span>
                {selectedExpert.bio}
              </div>

              <button
                type="button"
                onClick={() => setSelectedExpert(null)}
                className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-2.5 rounded-xl text-xs transition-colors cursor-pointer mt-2"
              >
                Close Details
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}