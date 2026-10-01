import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, Droplets, Footprints, Scale } from 'lucide-react';

const weightData = [
  { date: 'W1', weight: 78 },
  { date: 'W2', weight: 77.2 },
  { date: 'W3', weight: 76.5 },
  { date: 'W4', weight: 75.8 },
  { date: 'W5', weight: 75.0 },
];

export default function ProgressDashboard({ user }) {
  const weight = user?.weightKg || 75;
  const height = user?.heightCm || 175;
  
  // Calculate BMI
  const heightMeters = height / 100;
  const bmi = (weight / (heightMeters * heightMeters)).toFixed(1);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-white">Fitness Progress & Stats Dashboard</h3>
          <p className="text-xs text-slate-400 mt-0.5">Track your body metrics and daily habits</p>
        </div>
        <span className="text-xs font-bold bg-slate-950 text-amber-400 border border-slate-800 px-3 py-1.5 rounded-xl">
          BMI Score: {bmi}
        </span>
      </div>

      {/* Habit Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
          <div className="flex items-center gap-2 text-amber-500">
            <Scale className="w-4 h-4" />
            <span className="text-xs font-bold text-slate-400">Current Weight</span>
          </div>
          <p className="text-xl font-black text-white">{weight} <span className="text-xs font-normal text-slate-400">kg</span></p>
        </div>

        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
          <div className="flex items-center gap-2 text-sky-400">
            <Droplets className="w-4 h-4" />
            <span className="text-xs font-bold text-slate-400">Daily Water Goal</span>
          </div>
          <p className="text-xl font-black text-white">3.2 / 4.0 <span className="text-xs font-normal text-slate-400">L</span></p>
        </div>

        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
          <div className="flex items-center gap-2 text-emerald-400">
            <Footprints className="w-4 h-4" />
            <span className="text-xs font-bold text-slate-400">Steps Walked</span>
          </div>
          <p className="text-xl font-black text-white">8,450 <span className="text-xs font-normal text-slate-400">/ 10k</span></p>
        </div>

        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
          <div className="flex items-center gap-2 text-rose-400">
            <Activity className="w-4 h-4" />
            <span className="text-xs font-bold text-slate-400">Calorie Deficit</span>
          </div>
          <p className="text-xl font-black text-white">-450 <span className="text-xs font-normal text-slate-400">kcal</span></p>
        </div>
      </div>

      {/* Weight Trend Chart */}
      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
        <h4 className="text-xs font-bold text-slate-300 mb-4">Weight Trend (Last 5 Weeks)</h4>
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={weightData}>
              <defs>
                <linearGradient id="weightGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="date" stroke="#64748b" fontSize={11} />
              <YAxis domain={['dataMin - 2', 'dataMax + 2']} stroke="#64748b" fontSize={11} />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }} />
              <Area type="monotone" dataKey="weight" stroke="#f59e0b" strokeWidth={2} fillOpacity={1} fill="url(#weightGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}