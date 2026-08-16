import React, { useState } from 'react';
import { Check, X, ShieldCheck, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import { API_BASE_URL } from '../config';

const plans = [
  {
    id: 'basic',
    name: 'Basic Access',
    price: '1,499',
    period: 'month',
    features: [
      'Gym floor & equipment access',
      'Locker room & shower access',
      '1 Complimentary body composition analysis',
      'Free high-speed Wi-Fi',
    ],
    featured: false,
  },
  {
    id: 'pro',
    name: 'Pro Athlete',
    price: '2,999',
    period: 'month',
    features: [
      'Full gym access across all time slots',
      'Unlimited group classes (Zumba, Yoga, HIIT)',
      '2 Guest passes per month',
      'Steam & Sauna room access',
      '1 Personal trainer guidance session / month',
    ],
    featured: true,
  },
  {
    id: 'vip',
    name: 'VIP Elite',
    price: '4,999',
    period: 'month',
    features: [
      '24/7 Unlimited gym & facility access',
      '4 Personal training sessions / month',
      'Customized Indian diet & nutrition plan',
      'Unlimited guest passes',
      'Dedicated locker & complimentary towel service',
    ],
    featured: false,
  },
];

export default function MembershipPlans({ onSelectPlan }) {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleOpenModal = (plan) => {
    setSelectedPlan(plan);
    setIsSuccess(false);
  };

  // Direct Plan Activation
  const handleConfirmPlan = async () => {
    if (!selectedPlan) return;

    const token = localStorage.getItem('titanfit_token');
    if (!token) {
      alert('Please log in first to activate your membership plan.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ activePlan: selectedPlan.name }),
      });

      const data = await res.json();

      if (data.success) {
        setIsSuccess(true);
        if (onSelectPlan) onSelectPlan(selectedPlan.name);

        setTimeout(() => {
          setSelectedPlan(null);
          setIsSuccess(false);
        }, 2000);
      } else {
        alert(data.message || 'Failed to activate plan.');
      }
    } catch (err) {
      console.error('Plan Activation Error:', err);
      alert('Failed to connect to the server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="membership" className="py-20 bg-slate-950 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-amber-500 text-sm font-bold tracking-widest uppercase mb-2">
            Membership Plans
          </h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-white">
            Invest In Your Health
          </h3>
          <p className="text-slate-400 text-sm sm:text-base mt-2">
            Flexible plans designed for all fitness levels. No hidden charges.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {plans.map((p) => (
            <div
              key={p.id}
              className={`flex flex-col p-8 rounded-2xl relative transition-all ${
                p.featured
                  ? 'bg-slate-900 border-2 border-amber-500 shadow-xl shadow-amber-500/10'
                  : 'bg-slate-900/40 border border-slate-800'
              }`}
            >
              {p.featured && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-amber-500 text-slate-950 text-xs font-black uppercase px-3 py-1 rounded-full tracking-wider shadow-md">
                  Most Popular
                </span>
              )}

              <h4 className="text-2xl font-bold mb-4 text-white">{p.name}</h4>

              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl sm:text-5xl font-black text-white">₹{p.price}</span>
                <span className="text-slate-400 text-sm font-medium">/ {p.period}</span>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {p.features.map((feat, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
                    <Check className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>

              <button
                type="button"
                onClick={() => handleOpenModal(p)}
                className={`w-full py-3.5 rounded-xl font-bold transition-all cursor-pointer ${
                  p.featured
                    ? 'bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-lg shadow-amber-500/20'
                    : 'bg-slate-800 text-white hover:bg-slate-700 border border-slate-700'
                }`}
              >
                Choose {p.name}
              </button>
            </div>
          ))}
        </div>

      </div>

      {/* ========================================================
          CONFIRMATION & ACTIVATION MODAL (NO PAYMENT STEP)
         ======================================================== */}
      {selectedPlan && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl p-6 relative shadow-2xl text-slate-100 animate-in fade-in zoom-in-95 duration-150">
            
            <button
              type="button"
              onClick={() => setSelectedPlan(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {isSuccess ? (
              <div className="py-6 text-center space-y-3 animate-in zoom-in-95">
                <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/20">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h3 className="text-base font-bold text-white">Membership Activated!</h3>
                <p className="text-xs text-slate-400">
                  Your <span className="text-amber-400 font-bold">{selectedPlan.name}</span> plan is now live and updated in your profile.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-amber-500">
                  <ShieldCheck className="w-6 h-6" />
                  <h3 className="text-base font-bold text-white">Membership Confirmation</h3>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Selected Plan:</span>
                    <span className="font-bold text-white">{selectedPlan.name}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Billing Cycle:</span>
                    <span className="font-bold text-slate-300">Monthly Recurring</span>
                  </div>
                  <div className="flex justify-between items-center text-sm pt-2 border-t border-slate-800">
                    <span className="font-bold text-white">Plan Price:</span>
                    <span className="font-extrabold text-amber-400 text-base">₹{selectedPlan.price}</span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-400 leading-relaxed">
                  By confirming, your account will be upgraded immediately with all {selectedPlan.name} access privileges.
                </p>

                <button
                  type="button"
                  onClick={handleConfirmPlan}
                  disabled={loading}
                  className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-3 rounded-xl text-xs transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Activating Membership...</span>
                    </>
                  ) : (
                    <>
                      <span>Confirm & Activate Plan</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            )}

          </div>
        </div>
      )}
    </section>
  );
}