import React, { useState } from 'react';
import { Sparkles, Loader2, Dumbbell, Utensils, Flame } from 'lucide-react';
import { API_BASE_URL } from '../config';

export default function AIPersonalPlanner({ user }) {
  const [dietPref, setDietPref] = useState('Indian');
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState(null);

  const handleGenerate = async () => {
    const token = localStorage.getItem('titanfit_token');
    if (!token) {
      alert('Please log in to generate your AI plan.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/ai/generate-plan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ dietaryPreference: dietPref }),
      });

      const data = await res.json();
      if (data.success) {
        setPlan(data.data);
      } else {
        alert(data.message || 'Error generating plan');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to communicate with AI server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
            <Sparkles className="w-3.5 h-3.5" /> AI Powered Intelligence
          </span>
          <h3 className="text-xl font-bold text-white mt-2">Custom AI Workout & Nutrition Split</h3>
          <p className="text-xs text-slate-400 mt-1">
            Tailored to your current stats: {user?.weightKg || 70}kg, {user?.heightCm || 175}cm ({user?.fitnessGoal || 'Overall Fitness'})
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={dietPref}
            onChange={(e) => setDietPref(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-xs text-white rounded-xl px-3 py-2.5 focus:outline-none focus:border-amber-500"
          >
            <option value="Indian">Indian Cuisine</option>
            <option value="Global">Global / Western</option>
            <option value="High-Protein Veg">High-Protein Veg</option>
          </select>

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {loading ? 'Analyzing Profile...' : 'Generate Plan'}
          </button>
        </div>
      </div>

      {plan && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Target Macros Overview */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-center">
              <p className="text-[10px] text-slate-400 uppercase font-bold">Target Calories</p>
              <p className="text-lg font-black text-amber-400">{plan.dailyCalories} kcal</p>
            </div>
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-center">
              <p className="text-[10px] text-slate-400 uppercase font-bold">Protein Target</p>
              <p className="text-lg font-black text-emerald-400">{plan.macros?.protein}</p>
            </div>
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-center">
              <p className="text-[10px] text-slate-400 uppercase font-bold">Carbohydrates</p>
              <p className="text-lg font-black text-sky-400">{plan.macros?.carbs}</p>
            </div>
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-center">
              <p className="text-[10px] text-slate-400 uppercase font-bold">Healthy Fats</p>
              <p className="text-lg font-black text-rose-400">{plan.macros?.fats}</p>
            </div>
          </div>

          {/* Workout Split & Meal Plan Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Workout Section */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Dumbbell className="w-4 h-4 text-amber-500" /> Weekly Workout Split
              </h4>
              <div className="space-y-3">
                {plan.workoutSplit?.map((item, idx) => (
                  <div key={idx} className="bg-slate-900 p-3 rounded-lg border border-slate-800 text-xs">
                    <p className="font-bold text-amber-400">{item.day} — {item.focus}</p>
                    <ul className="mt-1.5 list-disc list-inside text-slate-300 space-y-0.5">
                      {item.exercises?.map((ex, i) => (
                        <li key={i}>{ex}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Diet Section */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Utensils className="w-4 h-4 text-amber-500" /> Customized Meal Plan
              </h4>
              <div className="space-y-3">
                {plan.mealPlan?.map((item, idx) => (
                  <div key={idx} className="bg-slate-900 p-3 rounded-lg border border-slate-800 text-xs">
                    <span className="font-bold text-emerald-400 block">{item.meal}</span>
                    <p className="text-slate-300 mt-0.5">{item.option}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}