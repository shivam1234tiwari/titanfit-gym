import React from 'react';
import { Dumbbell, HeartPulse, Flame, UserCheck, Activity, Zap } from 'lucide-react';

const programs = [
  { icon: Dumbbell, title: 'Strength & Power', desc: 'Heavy compound movements and resistance training to build muscle mass.' },
  { icon: HeartPulse, title: 'Cardio Endurance', desc: 'High-energy cardiovascular workouts to boost stamina and lung capacity.' },
  { icon: Flame, title: 'Fat Loss HIIT', desc: 'Interval circuits designed to maximize calorie burn long after your session.' },
  { icon: Activity, title: 'Yoga & Recovery', desc: 'Improve joint mobility, dynamic flexibility, and mental wellness.' },
  { icon: Zap, title: 'CrossFit Circuits', desc: 'Functional strength conditioning combined with timed athletic challenges.' },
  { icon: UserCheck, title: '1-on-1 Coaching', desc: 'Customized programming with dedicated expert performance trainers.' },
];

// 🔴 MAKE SURE THIS HAS "export default"
export default function Programs() {
  return (
    <section id="programs" className="py-20 bg-slate-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-amber-500 text-sm font-bold tracking-widest uppercase mb-2">Our Programs</h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-white">Engineered For Dynamic Performance</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {programs.map((prog, idx) => {
            const Icon = prog.icon;
            return (
              <div
                key={idx}
                className="bg-slate-900 border border-slate-800 p-8 rounded-2xl hover:border-amber-500/50 transition-all group"
              >
                <div className="w-12 h-12 bg-amber-500/10 text-amber-500 rounded-xl flex items-center justify-center mb-6 group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors">
                  <Icon className="w-6 h-6" />
                </div>
                <h4 className="text-xl font-bold mb-3 text-white">{prog.title}</h4>
                <p className="text-slate-400 text-sm leading-relaxed">{prog.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}