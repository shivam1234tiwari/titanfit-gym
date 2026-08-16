import React, { useState, useEffect } from 'react';
import { Award, X, ChevronRight, Plus, Loader2, ArrowLeft, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config';

export default function ExpertsManager() {
  const navigate = useNavigate();
  const [experts, setExperts] = useState([]);
  const [selectedExpert, setSelectedExpert] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Admin Form State
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', role: '', exp: '', bio: '', image: '' });
  const [submitting, setSubmitting] = useState(false);

  // MongoDB se Experts Fetch karein
  const fetchExperts = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/analytics/experts`);
      const data = await res.json();
      if (data.success && data.experts) {
        setExperts(data.experts);
      }
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    fetchExperts(); 
  }, []);

  // Instant Automatic Update Handler
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
        const newAddedExpert = data.expert || data.data;
        if (newAddedExpert) {
          setExperts((prevExperts) => [newAddedExpert, ...prevExperts]);
        } else {
          fetchExperts();
        }
        setFormData({ name: '', role: '', exp: '', bio: '', image: '' });
        setShowAddModal(false);
      } else {
        alert(data.message || 'Failed to save expert');
      }
    } catch (err) {
      console.error('Save error:', err);
      alert('Failed to connect to the server.');
    } finally {
      setSubmitting(false);
    }
  };

  // Logout Handler
  const handleLogout = () => {
    localStorage.removeItem('titanfit_token');
    localStorage.removeItem('titanfit_user');
    navigate('/'); // Redirect to Home/Login page
  };

  return (
    <div className="space-y-6">
      
      {/* TOP NAVIGATION BAR (Back & Logout) */}
      <div className="flex items-center justify-between bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-slate-400 hover:text-amber-500 transition-colors text-xs font-bold cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Go Back
        </button>
        
        <button 
          onClick={handleLogout} 
          className="flex items-center gap-2 text-rose-400 hover:text-rose-500 bg-rose-500/10 hover:bg-rose-500/20 px-3 py-1.5 rounded-lg border border-rose-500/20 transition-colors text-xs font-bold cursor-pointer"
        >
          <LogOut className="w-4 h-4" /> Admin Logout
        </button>
      </div>

      {/* HEADER SECTION */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" /> Meet Our Gym Experts
          </h3>
          <p className="text-xs text-slate-400">Click on any trainer to view full profile & specialization</p>
        </div>
        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-md"
        >
          <Plus className="w-4 h-4" /> Add Expert
        </button>
      </div>

      {/* EXPERTS LIST */}
      {loading ? (
        <div className="text-center py-8 text-slate-400 text-xs flex justify-center items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin text-amber-500" /> Loading Experts...
        </div>
      ) : experts.length === 0 ? (
        <div className="text-center py-8 text-slate-500 text-xs bg-slate-900/50 rounded-xl border border-slate-800">
          No experts available. Click "+ Add Expert" to add one.
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

      {/* VIEW EXPERT MODAL */}
      {selectedExpert && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-sm rounded-2xl p-6 relative shadow-2xl text-slate-100 animate-in fade-in zoom-in-95 duration-150">
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
                <span className="inline-block mt-1 text-[10px] bg-slate-800 text-slate-300 px-2.5 py-0.5 rounded-full border border-slate-700">
                  Exp: {selectedExpert.exp}
                </span>
              </div>
              <div className="text-xs text-slate-300 bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-left">
                <span className="text-amber-500 font-bold block mb-1">Specialization & Bio:</span>
                {selectedExpert.bio}
              </div>
              <button 
                type="button"
                onClick={() => setSelectedExpert(null)} 
                className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD EXPERT FORM MODAL */}
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
                type="text" placeholder="Full Name" required 
                value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500" 
              />
              <input 
                type="text" placeholder="Role / Title" required 
                value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500" 
              />
              <input 
                type="text" placeholder="Experience (e.g. 5+ Years)" required 
                value={formData.exp} onChange={(e) => setFormData({ ...formData, exp: e.target.value })} 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500" 
              />
              <input 
                type="url" placeholder="Image URL" required 
                value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500" 
              />
              <textarea 
                placeholder="Bio / Specialization Details" required rows="3" 
                value={formData.bio} onChange={(e) => setFormData({ ...formData, bio: e.target.value })} 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500" 
              />
              <button 
                type="submit" disabled={submitting}
                className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-2.5 rounded-xl text-xs mt-2 transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
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