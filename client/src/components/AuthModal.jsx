import React, { useState, useEffect } from 'react';
import { X, Lock, Mail, User, Scale, Ruler, Loader2 } from 'lucide-react';
import { API_BASE_URL } from '../config';

export default function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  const [isSignUp, setIsSignUp] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    weight: '',
    height: ''
  });
  const [loading, setLoading] = useState(false); // Default MUST be false
  const [errorMsg, setErrorMsg] = useState('');

  // Reset form & loading whenever modal opens or closes
  useEffect(() => {
    if (isOpen) {
      setLoading(false);
      setErrorMsg('');
      setFormData({ name: '', email: '', password: '', weight: '', height: '' });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevents auto reload
    if (loading) return;

    setLoading(true);
    setErrorMsg('');

    const endpoint = isSignUp ? '/api/auth/register' : '/api/auth/login';

    try {
      const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok && data.token) {
        localStorage.setItem('titanfit_token', data.token);
        localStorage.setItem('titanfit_user', JSON.stringify(data.user));
        if (onAuthSuccess) onAuthSuccess(data.user);
        onClose();
      } else {
        setErrorMsg(data.message || 'Authentication failed. Please try again.');
      }
    } catch (err) {
      setErrorMsg('Unable to connect to server. Render backend might be starting up!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl p-6 relative shadow-2xl text-slate-100">
        
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <h2 className="text-xl font-bold tracking-wider text-amber-500 uppercase">TITANFIT</h2>
          <p className="text-xs text-slate-400 mt-1">
            {isSignUp ? 'Create your member account to start tracking progress.' : 'Welcome back! Log in to your portal.'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-950 p-1 rounded-xl mb-6 border border-slate-800">
          <button
            type="button"
            onClick={() => { setIsSignUp(false); setErrorMsg(''); }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              !isSignUp ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Log In
          </button>
          <button
            type="button"
            onClick={() => { setIsSignUp(true); setErrorMsg(''); }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              isSignUp ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign Up
          </button>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs rounded-xl text-center">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div className="relative">
              <User className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Full Name"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          )}

          <div className="relative">
            <Mail className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="Email Address"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="relative">
            <Lock className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          {isSignUp && (
            <div className="grid grid-cols-2 gap-3">
              <div className="relative">
                <input
                  type="number"
                  name="weight"
                  required
                  value={formData.weight}
                  onChange={handleChange}
                  placeholder="Weight (kg)"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
              <div className="relative">
                <input
                  type="number"
                  name="height"
                  required
                  value={formData.height}
                  onChange={handleChange}
                  placeholder="Height (cm)"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-500 hover:bg-amber-400 disabled:opacity-60 text-slate-950 font-bold py-3 rounded-xl text-xs transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-amber-500/10 mt-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <span>{isSignUp ? 'Create Account' : 'Log In'}</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}