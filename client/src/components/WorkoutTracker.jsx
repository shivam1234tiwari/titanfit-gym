import React, { useState, useEffect } from 'react';
import { Dumbbell, Plus, TrendingUp } from 'lucide-react';
import { API_BASE_URL } from '../config';

export default function WorkoutTracker() {
  const [workouts, setWorkouts] = useState([]);
  const [exercise, setExercise] = useState('');
  const [sets, setSets] = useState('');
  const [reps, setReps] = useState('');
  const [weight, setWeight] = useState('');
  const [category, setCategory] = useState('Chest');

  const fetchWorkouts = async () => {
    const token = localStorage.getItem('titanfit_token');
    if (!token) return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/workouts`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) setWorkouts(data.data || []);
    } catch (err) {
      console.error('Error fetching workouts:', err);
    }
  };

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const handleAddWorkout = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('titanfit_token');

    try {
      const res = await fetch(`${API_BASE_URL}/api/workouts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ exercise, sets, reps, weight, category })
      });
      const data = await res.json();
      if (data.success) {
        setExercise('');
        setSets('');
        setReps('');
        setWeight('');
        fetchWorkouts();
      }
    } catch (err) {
      console.error('Error logging workout:', err);
    }
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-xl">
      <div className="flex items-center gap-3 mb-6">
        <Dumbbell className="w-6 h-6 text-amber-500" />
        <h3 className="text-xl font-bold text-white">Workout Tracker & Progress Log</h3>
      </div>

      {/* Log Form */}
      <form onSubmit={handleAddWorkout} className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-8">
        <input
          type="text"
          placeholder="Exercise (e.g. Bench Press)"
          value={exercise}
          onChange={(e) => setExercise(e.target.value)}
          required
          className="col-span-2 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white"
        />
        <input
          type="number"
          placeholder="Sets"
          value={sets}
          onChange={(e) => setSets(e.target.value)}
          required
          className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white"
        />
        <input
          type="number"
          placeholder="Reps"
          value={reps}
          onChange={(e) => setReps(e.target.value)}
          required
          className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white"
        />
        <input
          type="number"
          placeholder="Weight (kg)"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          required
          className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white"
        />
        <button
          type="submit"
          className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl flex items-center justify-center gap-1 text-xs uppercase"
        >
          <Plus className="w-4 h-4" /> Add
        </button>
      </form>

      {/* Workout Logs List */}
      <div className="space-y-3">
        {workouts.length === 0 ? (
          <p className="text-xs text-slate-500 text-center py-4">No workout logs recorded yet. Add your first set above!</p>
        ) : (
          workouts.map((w) => (
            <div key={w._id} className="flex justify-between items-center bg-slate-950/80 p-3.5 rounded-xl border border-slate-800/80 text-xs">
              <div>
                <span className="font-bold text-white text-sm block">{w.exercise}</span>
                <span className="text-slate-400">{w.category} • {new Date(w.date || Date.now()).toLocaleDateString()}</span>
              </div>
              <div className="text-right">
                <span className="text-amber-400 font-extrabold">{w.weight} kg</span>
                <span className="text-slate-400 block">{w.sets} sets × {w.reps} reps</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}