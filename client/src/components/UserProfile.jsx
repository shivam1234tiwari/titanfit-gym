import React, { useState, useEffect } from 'react';
import { User, Camera, Utensils, Activity, Save, Loader2, CheckCircle, Target, Scale, Ruler, ArrowLeft } from 'lucide-react';
import { API_BASE_URL } from '../config';

export default function UserProfile({ onClose, onLogout }) {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    weight: '',
    height: '',
    goal: 'Maintenance',
    profilePic: ''
  });

  const [dietPlan, setDietPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('titanfit_token');
      if (!token) {
        setMsg({ type: 'error', text: 'Authentication token missing. Please log in.' });
        setLoading(false);
        return;
      }

      const res = await fetch(`${API_BASE_URL}/api/auth/profile`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();

      if (res.ok && data.user) {
        setProfile({
          name: data.user.name || '',
          email: data.user.email || '',
          phoneNumber: data.user.phoneNumber || '',
          weight: data.user.weight || '',
          height: data.user.height || '',
          goal: data.user.goal || 'Maintenance',
          profilePic: data.user.profilePic || ''
        });
        setDietPlan(data.dietPlan);
      } else {
        setMsg({ type: 'error', text: data.message || 'Failed to fetch profile.' });
      }
    } catch (err) {
      setMsg({ type: 'error', text: 'Failed to load profile data from server.' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  // Multer File Upload Handler
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setMsg({ type: 'error', text: 'Image file size must be less than 5MB' });
      return;
    }

    const uploadData = new FormData();
    uploadData.append('profilePic', file);

    setUploading(true);
    setMsg({ type: '', text: '' });

    try {
      const token = localStorage.getItem('titanfit_token');
      const res = await fetch(`${API_BASE_URL}/api/auth/upload-avatar`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: uploadData
      });

      const data = await res.json();

      if (res.ok) {
        const fullImageUrl = data.profilePic.startsWith('http') 
          ? data.profilePic 
          : `${API_BASE_URL}${data.profilePic}`;

        setProfile((prev) => ({ ...prev, profilePic: fullImageUrl }));
        setMsg({ type: 'success', text: 'Profile picture uploaded successfully!' });
      } else {
        setMsg({ type: 'error', text: data.message || 'Image upload failed.' });
      }
    } catch (err) {
      setMsg({ type: 'error', text: 'Error uploading image to server.' });
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg({ type: '', text: '' });

    try {
      const token = localStorage.getItem('titanfit_token');
      const res = await fetch(`${API_BASE_URL}/api/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profile)
      });

      const data = await res.json();

      if (res.ok) {
        setMsg({ type: 'success', text: 'Profile & Diet Plan updated successfully!' });
        setDietPlan(data.dietPlan);
        localStorage.setItem('titanfit_user', JSON.stringify(data.user));
      } else {
        setMsg({ type: 'error', text: data.message || 'Update failed.' });
      }
    } catch (err) {
      setMsg({ type: 'error', text: 'Server connection error. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  const calculateBMI = () => {
    const w = parseFloat(profile.weight);
    const h = parseFloat(profile.height) / 100;
    if (w && h) {
      const bmi = (w / (h * h)).toFixed(1);
      let category = 'Normal';
      if (bmi < 18.5) category = 'Underweight';
      else if (bmi >= 25) category = 'Overweight';
      return { bmi, category };
    }
    return null;
  };

  const bmiData = calculateBMI();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-amber-500">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Back Navigation Button */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-2 text-xs font-bold text-slate-300 hover:text-amber-500 bg-slate-900 border border-slate-800 hover:border-slate-700 px-4 py-2 rounded-xl transition-all cursor-pointer shadow-md active:scale-95"
          >
            <ArrowLeft className="w-4 h-4 text-amber-500" />
            <span>Back to Home</span>
          </button>
        </div>

        {/* Top Profile Header Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-center gap-6">
          <div className="relative group">
            <div className="w-28 h-28 rounded-full bg-slate-800 border-2 border-amber-500/40 overflow-hidden flex items-center justify-center shadow-lg relative">
              {profile.profilePic ? (
                <img src={profile.profilePic} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User className="w-12 h-12 text-slate-500" />
              )}
              {uploading && (
                <div className="absolute inset-0 bg-slate-950/70 flex items-center justify-center">
                  <Loader2 className="w-6 h-6 text-amber-500 animate-spin" />
                </div>
              )}
            </div>

            <label 
              title="Upload new profile picture"
              className="absolute bottom-0 right-0 bg-amber-500 hover:bg-amber-400 p-2 rounded-full text-slate-950 cursor-pointer shadow-md transition-all active:scale-95"
            >
              <Camera className="w-4 h-4" />
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleFileUpload} 
                className="hidden" 
              />
            </label>
          </div>

          <div className="flex-1 text-center md:text-left">
            <h1 className="text-2xl font-black text-white uppercase tracking-wider">{profile.name || 'Member Profile'}</h1>
            <p className="text-xs text-slate-400 mt-1">{profile.email} {profile.phoneNumber ? `• +91 ${profile.phoneNumber}` : ''}</p>
            <div className="mt-3 flex flex-wrap gap-2 justify-center md:justify-start">
              <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs px-3 py-1 rounded-full font-semibold">
                Goal: {profile.goal}
              </span>
              {bmiData && (
                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs px-3 py-1 rounded-full font-semibold">
                  BMI: {bmiData.bmi} ({bmiData.category})
                </span>
              )}
            </div>
          </div>
        </div>

        {msg.text && (
          <div className={`p-4 rounded-xl text-xs font-semibold flex items-center gap-2 ${
            msg.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
          }`}>
            <CheckCircle className="w-4 h-4" />
            <span>{msg.text}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form Options */}
          <div className="lg:col-span-1 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h2 className="text-sm font-bold text-amber-500 uppercase tracking-wider flex items-center gap-2">
              <Activity className="w-4 h-4" /> Edit Fitness Profile
            </h2>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Image URL (Optional)</label>
                <input
                  type="url"
                  name="profilePic"
                  value={profile.profilePic}
                  onChange={handleChange}
                  placeholder="https://example.com/avatar.jpg"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={profile.name}
                  onChange={handleChange}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Fitness Goal</label>
                <div className="relative">
                  <Target className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                  <select
                    name="goal"
                    value={profile.goal}
                    onChange={handleChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-white focus:border-amber-500 focus:outline-none"
                  >
                    <option value="Weight Loss">Weight Loss</option>
                    <option value="Muscle Gain">Muscle Gain</option>
                    <option value="Maintenance">Maintenance</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Weight (kg)</label>
                  <div className="relative">
                    <Scale className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
                    <input
                      type="number"
                      name="weight"
                      value={profile.weight}
                      onChange={handleChange}
                      placeholder="75"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-2 text-white focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Height (cm)</label>
                  <div className="relative">
                    <Ruler className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
                    <input
                      type="number"
                      name="height"
                      value={profile.height}
                      onChange={handleChange}
                      placeholder="175"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-2 text-white focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-2.5 rounded-xl text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-500/10 mt-2 active:scale-95"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>Save Changes</span>
              </button>
            </form>
          </div>

          {/* Dynamic Diet Plan View */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Utensils className="w-5 h-5 text-amber-500" /> Personalized Diet Plan
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Target recommendations for <span className="text-amber-400 font-semibold">{profile.goal}</span>
                </p>
              </div>

              {dietPlan && (
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Daily Intake Target</span>
                  <span className="text-xs font-mono font-bold text-amber-500">{dietPlan.calories}</span>
                </div>
              )}
            </div>

            {dietPlan ? (
              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <p className="text-[10px] text-slate-500 uppercase font-bold">Protein</p>
                    <p className="text-sm font-bold text-emerald-400 mt-1">{dietPlan.macros?.protein || '30%'}</p>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <p className="text-[10px] text-slate-500 uppercase font-bold">Carbs</p>
                    <p className="text-sm font-bold text-sky-400 mt-1">{dietPlan.macros?.carbs || '40%'}</p>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <p className="text-[10px] text-slate-500 uppercase font-bold">Fats</p>
                    <p className="text-sm font-bold text-amber-400 mt-1">{dietPlan.macros?.fats || '30%'}</p>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
                    <span className="text-amber-500 font-bold block mb-1">🌅 Breakfast</span>
                    <p className="text-slate-300">{dietPlan.breakfast}</p>
                  </div>
                  <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
                    <span className="text-amber-500 font-bold block mb-1">☀️ Lunch</span>
                    <p className="text-slate-300">{dietPlan.lunch}</p>
                  </div>
                  <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
                    <span className="text-amber-500 font-bold block mb-1">🍎 Afternoon Snack</span>
                    <p className="text-slate-300">{dietPlan.snack}</p>
                  </div>
                  <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
                    <span className="text-amber-500 font-bold block mb-1">🌙 Dinner</span>
                    <p className="text-slate-300">{dietPlan.dinner}</p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500">Select your fitness goal and save your profile to display your diet plan.</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}