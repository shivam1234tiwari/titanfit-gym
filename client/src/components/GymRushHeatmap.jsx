import React from 'react';
import { Users, Clock, Flame } from 'lucide-react';

const timeSlots = [
  { time: '06:00 AM - 08:00 AM', status: 'Moderate', capacity: 55, color: 'bg-amber-500' },
  { time: '08:00 AM - 11:00 AM', status: 'Low (Quiet)', capacity: 25, color: 'bg-emerald-500' },
  { time: '11:00 AM - 04:00 PM', status: 'Optimal Hours', capacity: 15, color: 'bg-emerald-500' },
  { time: '04:00 PM - 06:00 PM', status: 'Moderate', capacity: 60, color: 'bg-amber-500' },
  { time: '06:00 PM - 08:30 PM', status: 'Peak Rush', capacity: 92, color: 'bg-rose-500' },
  { time: '08:30 PM - 10:30 PM', status: 'Low (Quiet)', capacity: 30, color: 'bg-emerald-500' },
];

export default function GymRushHeatmap() {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-amber-500" /> Gym Occupancy & Rush Hours
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">Plan your workout during quiet hours to avoid waiting for equipment</p>
        </div>
        <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full w-max">
          Current Live Status: 22% Occupied
        </span>
      </div>

      <div className="space-y-3">
        {timeSlots.map((slot, idx) => (
          <div key={idx} className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" /> {slot.time}
              </span>
              <span className={`font-extrabold ${slot.capacity > 75 ? 'text-rose-400' : slot.capacity > 45 ? 'text-amber-400' : 'text-emerald-400'}`}>
                {slot.status} ({slot.capacity}%)
              </span>
            </div>

            {/* Capacity Progress Bar */}
            <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
              <div
                className={`h-full transition-all duration-500 ${slot.color}`}
                style={{ width: `${slot.capacity}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}