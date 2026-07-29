import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { Activity, HeartPulse, Award, X, ChevronRight, Plus, Loader2, RefreshCw } from 'lucide-react';
import { API_BASE_URL } from '../config';

export default function AdminAnalytics({ userAge = 62 }) {
  // Pie Chart State
  const [timeFilter, setTimeFilter] = useState('week'); // 'week' | 'month' | 'allTime'
  const [chartData, setChartData] = useState([]);
  const [chartLoading, setChartLoading] = useState(true);

  // Experts State
  const [experts, setExperts] = useState([]);
  const [expertsLoading, setExpertsLoading] = useState(true);
  const [selectedExpert, setSelectedExpert] = useState(null);
  
  // Add Expert Modal Form State
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', role: '', exp: '', bio: '', image: '' });
  const [submitting, setSubmitting] = useState(false);

  // 1. Fetch Dynamic Pie Chart Data from DB when timeFilter changes
  const fetchPieData = async () => {
    setChartLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/analytics/pie-chart?timeRange=${timeFilter}`);
      const data = await res.json();
      if (data.success) {
        setChartData(data.data);
      }
    } catch (err) {
      console.error("Failed to fetch pie chart stats:", err);
    } finally {
      setChartLoading(false);
    }
  };

  useEffect(() => {
    fetchPieData();
  }, [timeFilter]);

  // 2. Fetch Experts List from MongoDB
  const fetchExperts = async () => {
    setExpertsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/analytics/experts`);
      const data = await res.json();
      if (data.success) {
        setExperts(data.experts);
      }
    } catch (err) {
      console.error("Failed to fetch experts:", err);
    } finally {
      setExpertsLoading(false);
    }
  };

  useEffect(() => {
    fetchExperts();
  }, []);

  // 3. Handle Add New Expert Submit
  const handleAddExpert = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/analytics/experts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        setShowAddModal(false);
        setFormData({ name: '', role: '', exp: '', bio: '', image: '' });
        fetchExperts(); // Refresh DB experts list
      }
    } catch (err) {
      console.error("Failed to save expert:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-950 text-slate-100 p-6 rounded-2xl border border-slate-800 space-y-8 max-w-6xl mx-auto shadow-xl">
      
      {/* ========================================================
          1. HEADER & DYNAMIC TIME FILTER (PIE CHART)
         ======================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-amber-500" /> Member Activity & Analytics
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">Live database program distribution</p>
        </div>

        {/* Filter Buttons */}
        <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800">
          {[
            { id: 'week', label: 'This Week' },
            { id: 'month', label: 'This Month' },
            { id: 'allTime', label: 'All Time' }
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTimeFilter(item.id)}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                timeFilter === item.id
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* DYNAMIC PIE CHART DISPLAY */}
      <div className="bg-slate-900 border border-slate-800/80 p-5 rounded-2xl flex flex-col items-center">
        <h3 className="text-xs font-semibold text-slate-300 mb-2">
          Program Distribution ({timeFilter === 'week' ? 'This Week' : timeFilter === 'month' ? 'This Month' : 'All Time'})
        </h3>

        <div className="w-full h-64 flex items-center justify-center">
          {chartLoading ? (
            <div className="flex items-center gap-2 text-amber-500 text-xs font-medium">
              <Loader2 className="w-5 h-5 animate-spin" /> Fetching live DB records...
            </div>
          ) : chartData.length === 0 ? (
            <p className="text-xs text-slate-500">No data found in database.</p>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color || '#f59e0b'} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* ========================================================
          2. SENIOR CITIZEN ADVISORY (CONDITION: AGE 60+)
         ======================================================== */}
      {userAge >= 60 && (
        <div className="bg-emerald-950/40 border border-emerald-500/30 p-5 rounded-2xl relative overflow-hidden">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm mb-2">
            <HeartPulse className="w-5 h-5 text-emerald-400 animate-pulse" />
            Senior Citizen Wellness Advisory (Age 60+ Special)
          </div>
          <p className="text-xs text-emerald-200/80 mb-4">
            Custom low-impact guidelines designed to protect joint health, improve core balance, and boost daily mobility safely.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-slate-900/90 p-3.5 rounded-xl border border-emerald-500/20 space-y-1">
              <div className="text-xs font-bold text-emerald-400">🧘 Gentle Yoga & Breathing</div>
              <p className="text-[11px] text-slate-400">Enhances posture, joint flexibility, and relieves daily spinal tension.</p>
            </div>

            <div className="bg-slate-900/90 p-3.5 rounded-xl border border-emerald-500/20 space-y-1">
              <div className="text-xs font-bold text-emerald-400">🚶 Light Exercises & Stretches</div>
              <p className="text-[11px] text-slate-400">20-minute daily light resistance band drills & treadmill walking.</p>
            </div>

            <div className="bg-slate-900/90 p-3.5 rounded-xl border border-emerald-500/20 space-y-1">
              <div className="text-xs font-bold text-emerald-400">💧 Low-Impact Cardio</div>
              <p className="text-[11px] text-slate-400">Stationary cycling and water aerobics to keep heart health strong.</p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          3. EXPERTS SECTION (CLICKABLE CARDS + ADD MODAL)
         ======================================================== */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" /> Meet Our Gym Experts
            </h3>
            <p className="text-xs text-slate-400">Click on any trainer to view full info & specialization</p>
          </div>

          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-md"
          >
            <Plus className="w-4 h-4" /> Add Expert
          </button>
        </div>

        {expertsLoading ? (
          <div className="text-center py-6 text-slate-400 text-xs flex justify-center items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-amber-500" /> Loading Experts...
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {experts.map((expert) => (
              <div
                key={expert._id || expert.id}
                onClick={() => setSelectedExpert(expert)}
                className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between cursor-pointer hover:border-amber-500/50 hover:bg-slate-800/80 transition-all group shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={expert.image}
                    alt={expert.name}
                    className="w-12 h-12 rounded-full object-cover border border-amber-500/40 group-hover:scale-105 transition-transform"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-white group-hover:text-amber-500 transition-colors">
                      {expert.name}
                    </h4>
                    <p className="text-[11px] text-slate-400">{expert.role}</p>
                    <span className="text-[10px] text-amber-400 font-medium">{expert.exp}</span>
                  </div>
                </div>

                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-amber-500 transition-all" />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* DETAIL MODAL (EXPERT INFO) */}
      {selectedExpert && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-sm rounded-2xl p-6 relative shadow-2xl text-slate-100 animate-in fade-in zoom-in-95 duration-200">
            <button
              type="button"
              onClick={() => setSelectedExpert(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-3">
              <img
                src={selectedExpert.image}
                alt={selectedExpert.name}
                className="w-20 h-20 rounded-full object-cover mx-auto border-2 border-amber-500 shadow-md"
              />
              <div>
                <h3 className="text-lg font-bold text-white">{selectedExpert.name}</h3>
                <p className="text-xs text-amber-500 font-medium">{selectedExpert.role}</p>
                <span className="inline-block mt-1 text-[10px] bg-slate-800 text-slate-300 px-2.5 py-0.5 rounded-full border border-slate-700 font-medium">
                  Experience: {selectedExpert.exp}
                </span>
              </div>

              <div className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-left">
                <span className="text-amber-500 font-bold block mb-1">Specialization & Bio:</span>
                {selectedExpert.bio}
              </div>

              <button
                type="button"
                onClick={() => setSelectedExpert(null)}
                className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-2.5 rounded-xl text-xs transition-colors cursor-pointer mt-2"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD EXPERT MODAL FORM */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl p-6 relative text-slate-100 shadow-2xl">
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-amber-500 mb-4">Add New Gym Expert</h3>

            <form onSubmit={handleAddExpert} className="space-y-3">
              <input
                type="text"
                placeholder="Full Name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              />
              <input
                type="text"
                placeholder="Role / Title (e.g. Senior Strength Coach)"
                required
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              />
              <input
                type="text"
                placeholder="Experience (e.g. 5+ Years)"
                required
                value={formData.exp}
                onChange={(e) => setFormData({ ...formData, exp: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              />
              <input
                type="url"
                placeholder="Image URL"
                required
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              />
              <textarea
                placeholder="Specialization Details / Bio"
                required
                rows="3"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              />

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-2.5 rounded-xl text-xs transition-colors cursor-pointer mt-2 flex items-center justify-center gap-2"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Expert to Database'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}