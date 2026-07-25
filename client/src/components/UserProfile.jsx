import React, { useState, useEffect } from 'react';
import { User, Activity, CreditCard, Dumbbell, ShieldCheck, RefreshCw, Scale, Ruler, LogOut, ArrowLeft } from 'lucide-react';

export default function UserProfile({ onClose, onLogout }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [editForm, setEditForm] = useState({
    weightKg: 70,
    heightCm: 175,
    fitnessGoal: 'Muscle Gain'
  });

  // Fetch Member Profile from Protected API
  const fetchProfile = async () => {
    const token = localStorage.getItem('titanfit_token');
    if (!token) return;

    try {
      const res = await fetch('http://localhost:5000/api/auth/profile', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const json = await res.json();
      if (json.success) {
        setProfile(json.data);
        setEditForm({
          weightKg: json.data.weightKg || 70,
          heightCm: json.data.heightCm || 175,
          fitnessGoal: json.data.fitnessGoal || 'Muscle Gain'
        });
      }
    } catch (err) {
      console.error('Failed to fetch profile', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // Calculate BMI Formula
  const calculateBMI = (weight, height) => {
    if (!weight || !height) return { bmi: 'N/A', category: 'Unknown' };
    const heightInMeters = height / 100;
    const bmiVal = (weight / (heightInMeters * heightInMeters)).toFixed(1);
    
    let category = 'Normal';
    if (bmiVal < 18.5) category = 'Underweight';
    else if (bmiVal >= 25 && bmiVal < 29.9) category = 'Overweight';
    else if (bmiVal >= 30) category = 'Obese';

    return { bmi: bmiVal, category };
  };

  const handleUpdateMetrics = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    const token = localStorage.getItem('titanfit_token');

    try {
      const res = await fetch('http://localhost:5000/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(editForm)
      });
      const data = await res.json();
      if (data.success) {
        fetchProfile();
        alert('Fitness metrics updated!');
      }
    } catch (err) {
      alert('Failed to update metrics');
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400 text-sm">
        Loading profile details...
      </div>
    );
  }

  const { bmi, category } = calculateBMI(profile?.weightKg, profile?.heightCm);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-8 pt-24">
      <div className="max-w-5xl mx-auto">
        
        {/* Navigation & Logout */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-800">
          <button
            onClick={onClose}
            className="inline-flex items-center gap-2 text-slate-400 hover:text-amber-500 text-sm font-semibold transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Website
          </button>

          <button
            onClick={onLogout}
            className="inline-flex items-center gap-2 bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>

        {/* Member Banner Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 mb-8 relative overflow-hidden shadow-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-amber-500 text-slate-950 rounded-2xl flex items-center justify-center font-black text-2xl shadow-lg shadow-amber-500/20">
                {profile?.name ? profile.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div>
                <h1 className="text-2xl font-black text-white">{profile?.name}</h1>
                <p className="text-xs text-slate-400">{profile?.email}</p>
                <div className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-bold px-2.5 py-0.5 rounded-full mt-2">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Verified Member
                </div>
              </div>
            </div>

            {/* Current Active Plan Badge */}
            <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl w-full sm:w-auto text-left sm:text-right">
              <p className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">Active Membership</p>
              <p className="text-xl font-extrabold text-amber-500 mt-0.5">{profile?.activePlan || 'Pro Athlete'}</p>
              <p className="text-[11px] text-slate-500 mt-1">Valid Till: 25 August 2026</p>
            </div>
          </div>
        </div>

        {/* Grid Stats & Tracker */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Fitness Metrics & BMI */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* BMI & Goal Card */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
              <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-amber-500" />
                Your Body Composition Index
              </h3>

              <div className="grid grid-cols-3 gap-4 text-center mb-6">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <p className="text-xs text-slate-400 mb-1">Body Weight</p>
                  <p className="text-2xl font-black text-white">{profile?.weightKg || 70} <span className="text-xs font-normal text-slate-400">kg</span></p>
                </div>
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <p className="text-xs text-slate-400 mb-1">Height</p>
                  <p className="text-2xl font-black text-white">{profile?.heightCm || 175} <span className="text-xs font-normal text-slate-400">cm</span></p>
                </div>
                <div className="bg-slate-950 p-4 rounded-xl border border-amber-500/30">
                  <p className="text-xs text-slate-400 mb-1">BMI Index</p>
                  <p className="text-2xl font-black text-amber-500">{bmi}</p>
                  <span className="text-[10px] text-emerald-400 font-semibold">{category}</span>
                </div>
              </div>

              {/* Update Metrics Form */}
              <form onSubmit={handleUpdateMetrics} className="space-y-4 pt-4 border-t border-slate-800">
                <p className="text-xs font-bold text-slate-300">Update Current Measurements:</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Weight (kg)</label>
                    <input
                      type="number"
                      value={editForm.weightKg}
                      onChange={(e) => setEditForm({ ...editForm, weightKg: Number(e.target.value) })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Height (cm)</label>
                    <input
                      type="number"
                      value={editForm.heightCm}
                      onChange={(e) => setEditForm({ ...editForm, heightCm: Number(e.target.value) })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isUpdating}
                  className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-2.5 rounded-xl text-xs transition-all cursor-pointer"
                >
                  {isUpdating ? 'Saving Changes...' : 'Save Updated Measurements'}
                </button>
              </form>
            </div>

          </div>

          {/* Right Column: Enrolled Program & Coach Info */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
              <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                <Dumbbell className="w-5 h-5 text-amber-500" />
                Program & Coach Details
              </h3>

              <div className="space-y-4 text-sm">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <p className="text-xs text-slate-400">Current Enrolled Program</p>
                  <p className="font-bold text-white text-base mt-0.5">{profile?.enrolledProgram || 'Strength & Power Training'}</p>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <p className="text-xs text-slate-400">Assigned Personal Trainer</p>
                  <p className="font-bold text-amber-400 text-base mt-0.5">{profile?.assignedTrainer || 'Marcus Vance (Head Coach)'}</p>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <p className="text-xs text-slate-400">Fitness Primary Goal</p>
                  <p className="font-bold text-white text-base mt-0.5">{profile?.fitnessGoal || 'Muscle Mass & Hypertrophy'}</p>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}