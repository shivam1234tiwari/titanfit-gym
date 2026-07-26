import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle, AlertCircle } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://titanfit-gym.onrender.com';

export default function ContactForm() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    message: ''
  });

  const [status, setStatus] = useState({
    loading: false,
    success: false,
    error: null,
    message: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, success: false, error: null, message: '' });

    try {
      const res = await fetch(`${API_BASE_URL}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Something went wrong. Please try again.');
      }

      setStatus({
        loading: false,
        success: true,
        error: null,
        message: data.message || 'Thank you! Your message has been sent.'
      });

      // Clear form on success
      setForm({ name: '', email: '', message: '' });
    } catch (err) {
      setStatus({
        loading: false,
        success: false,
        error: true,
        message: err.message
      });
    }
  };

  return (
    <section id="contact" className="py-20 bg-slate-900/30 border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-amber-500 text-sm font-bold tracking-widest uppercase mb-2">Get In Touch</h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-white">Have Questions? Reach Out To Us</h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Contact Information */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <h4 className="text-2xl font-bold text-white mb-4">Visit TITANFIT Gym</h4>
              <p className="text-slate-400 text-sm leading-relaxed">
                Whether you have questions about our memberships, personal training programs, or facility access, our team is always ready to assist you.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-amber-500/10 text-amber-500 rounded-xl flex items-center justify-center shrink-0 border border-amber-500/20">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h5 className="text-sm font-semibold text-slate-200">Our Location</h5>
                  <p className="text-sm text-slate-400">123 Fitness Avenue, Sector 4, Metro City</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-amber-500/10 text-amber-500 rounded-xl flex items-center justify-center shrink-0 border border-amber-500/20">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h5 className="text-sm font-semibold text-slate-200">Phone Support</h5>
                  <p className="text-sm text-slate-400">+1 (555) 234-5678 / +1 (555) 876-5432</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-amber-500/10 text-amber-500 rounded-xl flex items-center justify-center shrink-0 border border-amber-500/20">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h5 className="text-sm font-semibold text-slate-200">Email Us</h5>
                  <p className="text-sm text-slate-400">support@titanfitgym.com</p>
                </div>
              </div>
            </div>

            {/* Operating Hours Box */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
              <h5 className="text-sm font-bold text-amber-500 uppercase tracking-wider mb-2">Operating Hours</h5>
              <div className="text-xs text-slate-300 space-y-1">
                <p className="flex justify-between"><span>Monday - Friday:</span> <span className="text-white font-medium">5:00 AM - 11:00 PM</span></p>
                <p className="flex justify-between"><span>Saturday - Sunday:</span> <span className="text-white font-medium">6:00 AM - 9:00 PM</span></p>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Form */}
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 relative">
            <h4 className="text-xl font-bold text-white mb-6">Send Us A Message</h4>

            {/* Feedback Alert Banners */}
            {status.success && (
              <div className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-xl text-sm mb-6">
                <CheckCircle className="w-5 h-5 shrink-0" />
                <span>{status.message}</span>
              </div>
            )}

            {status.error && (
              <div className="flex items-center gap-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-xl text-sm mb-6">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>{status.message}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Your Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Rahul Sharma"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500 text-white placeholder:text-slate-600 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  placeholder="rahul@example.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500 text-white placeholder:text-slate-600 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Message</label>
                <textarea
                  name="message"
                  rows="5"
                  required
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Hi! I would like to inquire about personal training schedules..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500 text-white placeholder:text-slate-600 transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={status.loading}
                className="w-full inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-3.5 px-6 rounded-xl transition-all shadow-lg shadow-amber-500/10 disabled:opacity-50 cursor-pointer"
              >
                {status.loading ? (
                  <span>Sending Message...</span>
                ) : (
                  <>
                    <span>Send Message</span>
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>

        </div>
      </div>
    </section>
  );
}