import React from 'react';
import { ArrowRight, Flame, Dumbbell, CalendarCheck, ShieldCheck, Utensils } from 'lucide-react';

export default function Hero({ onOpenBooking }) {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 bg-zinc-950 text-white overflow-hidden">
      {/* Subtle Performance Red Ambient Glow */}
      <div className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[28rem] h-[28rem] bg-red-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Authentic Value Proposition */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/25 text-red-400 text-xs sm:text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
              <Flame className="w-4 h-4 text-red-500" />
              Smart Workout Tracking & Trainer Booking Portal
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-none mb-6">
              TRAIN <span className="text-red-500">SMARTER.</span><br />
              TRACK EVERY REP.
            </h1>

            <p className="text-zinc-400 text-lg sm:text-xl font-normal leading-relaxed mb-8 max-w-2xl">
              Log daily workout volume, follow goal-based macro diet plans, and book conflict-free personal training sessions—all from one connected dashboard.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={onOpenBooking}
                className="inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 text-white font-bold px-8 py-4 rounded-xl transition-all shadow-lg shadow-red-600/25 cursor-pointer"
              >
                Book Free Trial Session
                <ArrowRight className="w-5 h-5" />
              </button>
              <a
                href="#membership"
                className="inline-flex items-center justify-center bg-zinc-900 hover:bg-zinc-800 text-white font-bold px-8 py-4 rounded-xl border border-zinc-800 transition-all"
              >
                Explore Memberships
              </a>
            </div>

            {/* Real Platform Highlights */}
            <div className="mt-12 pt-8 border-t border-zinc-800/80 grid grid-cols-3 gap-4">
              <div>
                <p className="text-xl sm:text-2xl font-black text-white">0 Clash</p>
                <p className="text-xs sm:text-sm text-zinc-400">Live Slot Booking</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-black text-white">3 Roles</p>
                <p className="text-xs sm:text-sm text-zinc-400">Member, Trainer & Admin</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-black text-white">Auto-Calc</p>
                <p className="text-xs sm:text-sm text-zinc-400">Volume & Macro Plans</p>
              </div>
            </div>
          </div>

          {/* Right Column: Live Connected Dashboard Preview Card */}
          <div className="lg:col-span-5">
            <div className="bg-zinc-900/90 backdrop-blur-md border border-zinc-800 rounded-2xl p-6 shadow-2xl shadow-black/60 relative">
              {/* Top Status Bar */}
              <div className="flex items-center justify-between pb-4 mb-5 border-b border-zinc-800">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                    Connected Member Portal
                  </span>
                </div>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-400 bg-red-500/10 border border-red-500/20 px-2.5 py-1 rounded-md">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  OTP Verified
                </span>
              </div>

              {/* Feature Cards Inside Preview */}
              <div className="space-y-4">
                <div className="bg-zinc-950/90 border border-zinc-800/90 rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3.5">
                    <div className="p-2.5 rounded-lg bg-red-500/10 text-red-500">
                      <Dumbbell className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-zinc-400">Auto Volume Tracker</p>
                      <p className="text-sm font-bold text-white">Bench Press • 3 × 10 × 60 kg</p>
                    </div>
                  </div>
                  <span className="text-sm font-black text-red-400">1,800 kg</span>
                </div>

                <div className="bg-zinc-950/90 border border-zinc-800/90 rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3.5">
                    <div className="p-2.5 rounded-lg bg-red-500/10 text-red-500">
                      <Utensils className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-zinc-400">Goal: Muscle Gain</p>
                      <p className="text-sm font-bold text-white">2,650 kcal • 165g Protein</p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md">
                    Active Plan
                  </span>
                </div>

                <div className="bg-zinc-950/90 border border-zinc-800/90 rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3.5">
                    <div className="p-2.5 rounded-lg bg-red-500/10 text-red-500">
                      <CalendarCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-zinc-400">Personal Trainer Slot</p>
                      <p className="text-sm font-bold text-white">Morning Strength Session</p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-red-400 bg-red-500/10 px-2.5 py-1 rounded-md">
                    Confirmed
                  </span>
                </div>
              </div>

              {/* Card Footer */}
              <div className="mt-5 pt-4 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-400">
                <span>Real-time Sync with Trainer & Admin</span>
                <button
                  onClick={onOpenBooking}
                  className="text-red-400 hover:text-red-300 font-bold cursor-pointer"
                >
                  Try Live →
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}