import React from 'react';
import { ArrowRight, Flame } from 'lucide-react';

export default function Hero({ onOpenBooking }) {
  return (
    <section className="relative pt-32 pb-20 md:pt-44 md:pb-32 overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs sm:text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
            <Flame className="w-4 h-4" />
            Transform Your Mind & Body Today
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-none mb-6">
            BUILD YOUR <span className="text-amber-500">ULTIMATE</span> SELF.
          </h1>

          <p className="text-slate-400 text-lg sm:text-xl font-normal leading-relaxed mb-8 max-w-2xl">
            State-of-the-art facilities, world-class personal trainers, and high-intensity group classes designed to push your limits.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={onOpenBooking}
              className="inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-8 py-4 rounded-xl transition-all shadow-lg shadow-amber-500/20 cursor-pointer"
            >
              Book Free Trial Session
              <ArrowRight className="w-5 h-5" />
            </button>
            <a
              href="#membership"
              className="inline-flex items-center justify-center bg-slate-900 hover:bg-slate-800 text-white font-bold px-8 py-4 rounded-xl border border-slate-800 transition-all"
            >
              Explore Memberships
            </a>
          </div>

          <div className="mt-12 pt-8 border-t border-slate-800/80 grid grid-cols-3 gap-4">
            <div>
              <p className="text-2xl sm:text-3xl font-black text-white">1,500+</p>
              <p className="text-xs sm:text-sm text-slate-400">Active Members</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-black text-white">25+</p>
              <p className="text-xs sm:text-sm text-slate-400">Expert Coaches</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-black text-white">40+</p>
              <p className="text-xs sm:text-sm text-slate-400">Weekly Classes</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}