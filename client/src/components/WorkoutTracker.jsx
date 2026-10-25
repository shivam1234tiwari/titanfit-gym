import React, { useState, useEffect } from 'react';
import { Plus, Dumbbell, Trash2, TrendingUp, Calendar, CheckCircle } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { API_BASE_URL } from '../config';

export default function WorkoutTracker() {
  const [workoutType, setWorkoutType] = useState('Chest & Triceps');
  const [exercises, setExercises] = useState([{ name: '', sets: '', reps: '', weightKg: '' }]);
  const [history, setHistory] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchWorkouts = async () => {
    const token = localStorage.getItem('titanfit_token');
    if (!token) return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/workouts/history`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setHistory(data.workouts);
        setChartData(data.chartData);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const handleAddExerciseRow = () => {
    setExercises([...exercises, { name: '', sets: '', reps: '', weightKg: '' }]);
  };

  const handleRemoveRow = (index) => {
    setExercises(exercises.filter((_, i) => i !== index));
  };

  const handleChange = (index, field, value) => {
    const updated = [...exercises];
    updated[index][field] = value;
    setExercises(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('titanfit_token');
    if (!token) return alert('Please log in first.');

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/workouts/log`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ workoutType, exercises })
      });
      const data = await res.json();
      if (data.success) {
        alert('Workout Logged Successfully! 🔥');
        setExercises([{ name: '', sets: '', reps: '', weightKg: '' }]);
        fetchWorkouts();
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 bg-slate-950 text-white p-6 rounded-2xl border border-slate-800">
      <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
        <Dumbbell className="w-7 h-7 text-amber-500" />
        <h2 className="text-xl font-bold">Daily Workout Tracker & Analytics</h2>
      </div>

      {/* Progress Chart */}
      {chartData.length > 0 && (
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3">
          <div className="flex items-center gap-2 text-amber-500 text-xs font-bold uppercase tracking-wider">
            <TrendingUp className="w-4 h-4" />
            Total Volume Lifted Over Time (kg)
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorVol" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }} />
                <Area type="monotone" dataKey="totalVolume" stroke="#f59e0b" fillOpacity={1} fill="url(#colorVol)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Workout Logger Form */}
      <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <label className="text-xs font-bold uppercase text-amber-500">Select Workout Split</label>
          <select
            value={workoutType}
            onChange={(e) => setWorkoutType(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-amber-500"
          >
            <option>Chest & Triceps</option>
            <option>Back & Biceps</option>
            <option>Legs & Abs</option>
            <option>Shoulders</option>
            <option>Cardio / HIIT</option>
            <option>Full Body</option>
          </select>
        </div>

        {exercises.map((ex, index) => (
          <div key={index} className="grid grid-cols-12 gap-2 items-center bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs">
            <input
              type="text"
              placeholder="Exercise Name (e.g., Bench Press)"
              value={ex.name}
              onChange={(e) => handleChange(index, 'name', e.target.value)}
              className="col-span-5 bg-transparent border-b border-slate-800 p-1 focus:outline-none focus:border-amber-500"
              required
            />
            <input
              type="number"
              placeholder="Sets"
              value={ex.sets}
              onChange={(e) => handleChange(index, 'sets', e.target.value)}
              className="col-span-2 bg-transparent border-b border-slate-800 p-1 text-center focus:outline-none focus:border-amber-500"
              required
            />
            <input
              type="number"
              placeholder="Reps"
              value={ex.reps}
              onChange={(e) => handleChange(index, 'reps', e.target.value)}
              className="col-span-2 bg-transparent border-b border-slate-800 p-1 text-center focus:outline-none focus:border-amber-500"
              required
            />
            <input
              type="number"
              placeholder="Kg"
              value={ex.weightKg}
              onChange={(e) => handleChange(index, 'weightKg', e.target.value)}
              className="col-span-2 bg-transparent border-b border-slate-800 p-1 text-center focus:outline-none focus:border-amber-500"
              required
            />
            {exercises.length > 1 && (
              <button
                type="button"
                onClick={() => handleRemoveRow(index)}
                className="col-span-1 text-rose-400 hover:text-rose-300 flex justify-center"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={handleAddExerciseRow}
            className="flex-1 bg-slate-800 hover:bg-slate-700 text-amber-500 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 border border-slate-700"
          >
            <Plus className="w-4 h-4" /> Add Exercise
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-amber-500/20"
          >
            <CheckCircle className="w-4 h-4" /> Log Session
          </button>
        </div>
      </form>
    </div>
  );
}