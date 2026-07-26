import React, { useState, useEffect } from 'react';
import { X, CheckCircle } from 'lucide-react';
import { API_BASE_URL } from '../config';

export default function FreeTrialModal({ isOpen, onClose, selectedPlan }) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    plan: selectedPlan || 'Free Trial',
    preferredDate: '',
    preferredTime: 'Morning (8:00 AM)',
    fitnessGoal: 'Weight Loss'
  });

  const [status, setStatus] = useState({ loading: false, success: false, error: null });

  useEffect(() => {
    if (selectedPlan) {
      setFormData((prev) => ({ ...prev, plan: selectedPlan }));
    }
  }, [selectedPlan]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, success: false, error: null });

    try {
      const res = await fetch(`${API_BASE_URL}/api/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Booking failed');

      setStatus({ loading: false, success: true, error: null });
    } catch (err) {
      setStatus({ loading: false, success: false, error: err.message });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-2xl p-6 sm:p-8 relative shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white cursor-pointer"
        >
          <X className="w-6 h-6" />
        </button>

        {status.success ? (
          <div className="text-center py-8">
            <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2 text-white">Booking Confirmed!</h3>
            <p className="text-slate-400 text-sm mb-6">
              We look forward to seeing you. A confirmation notification has been logged in our system.
            </p>
            <button
              onClick={onClose}
              className="bg-amber-500 text-slate-950 font-bold px-6 py-2.5 rounded-xl text-sm cursor-pointer"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            <h3 className="text-2xl font-bold mb-1 text-white">Book Your Session</h3>
            <p className="text-slate-400 text-sm mb-6"> Selected Plan: <span className="text-amber-500 font-semibold">{formData.plan}</span></p>

            {status.error && (
              <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs p-3 rounded-lg mb-4">
                {status.error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Rahul Sharma"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-amber-500 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="rahul@example.com"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-amber-500 text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="9876543210"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-amber-500 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Preferred Date</label>
                  <input
                    type="date"
                    name="preferredDate"
                    required
                    value={formData.preferredDate}
                    onChange={handleChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-amber-500 text-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Time Slot</label>
                  <select
                    name="preferredTime"
                    value={formData.preferredTime}
                    onChange={handleChange}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-amber-500 text-slate-200"
                  >
                    <option>Morning (8:00 AM)</option>
                    <option>Afternoon (1:00 PM)</option>
                    <option>Evening (6:00 PM)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Fitness Goal</label>
                <select
                  name="fitnessGoal"
                  value={formData.fitnessGoal}
                  onChange={handleChange}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-amber-500 text-slate-200"
                >
                  <option>Weight Loss</option>
                  <option>Muscle Gain</option>
                  <option>Overall Fitness & Conditioning</option>
                  <option>Rehabilitation & Mobility</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={status.loading}
                className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-3.5 rounded-xl transition-all mt-2 disabled:opacity-50 cursor-pointer"
              >
                {status.loading ? 'Submitting Request...' : 'Confirm Session Booking'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}