import React, { useState } from 'react';
import { Check, CheckCircle, Sparkles } from 'lucide-react';
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
  const [loadingPlan, setLoadingPlan] = useState(null);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  const showToast = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 4000);
  };

  const handleDirectActivate = async (plan) => {
    const token = localStorage.getItem('titanfit_token');
    if (!token) {
      showToast('Please log in to activate a membership plan.', 'error');
      return;
    }

    setLoadingPlan(plan.id);

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          activePlan: plan.name,
          membershipPlan: plan.name,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        let existingUser = {};
        try {
          existingUser = JSON.parse(localStorage.getItem('titanfit_user') || '{}');
        } catch (error) {
          console.error('Could not read saved TitanFit user:', error);
        }

        const updatedUser = {
          ...existingUser,
          ...(data.data || {}),
          activePlan: plan.name,
          membershipPlan: plan.name,
        };

        localStorage.setItem('titanfit_user', JSON.stringify(updatedUser));

        window.dispatchEvent(
          new CustomEvent('titanfit:membership-updated', {
            detail: {
              plan: plan.name,
              user: updatedUser,
            },
          })
        );

        if (typeof onSelectPlan === 'function') {
          onSelectPlan(plan.name, updatedUser);
        }

        showToast(`${plan.name} Plan activated successfully!`, 'success');
      } else {
        showToast(data.message || 'Failed to activate plan.', 'error');
      }
    } catch (error) {
      console.error('Activation Error:', error);
      showToast('Server error while activating plan.', 'error');
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <section id="membership" className="relative bg-zinc-950 py-20 border-t border-zinc-900">
      {/* Subtle Ambient Glow */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[32rem] h-[32rem] bg-red-600/5 rounded-full blur-3xl" />

      {/* Custom Floating Toast Notification */}
      {notification.show && (
        <div className="fixed top-6 right-6 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
          <div
            className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl border backdrop-blur-xl ${
              notification.type === 'success'
                ? 'bg-emerald-950/90 border-emerald-500/30 text-emerald-300'
                : 'bg-rose-950/90 border-rose-500/30 text-rose-300'
            }`}
          >
            <Sparkles className="w-5 h-5 text-red-400 shrink-0" />
            <span className="text-xs font-bold tracking-wide">{notification.message}</span>
          </div>
        </div>
      )}

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="mb-2 text-sm font-bold uppercase tracking-[0.2em] text-red-500">
            Membership Plans
          </h2>
          <h3 className="text-3xl font-black text-white sm:text-4xl">
            Invest In Your Health
          </h3>
          <p className="mt-3 text-sm text-zinc-400 sm:text-base">
            Flexible plans designed for all fitness levels. Instant one-click activation synced to your Member Dashboard.
          </p>
        </div>

        {/* Membership cards */}
        <div className="grid grid-cols-1 items-stretch gap-8 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative flex flex-col rounded-2xl p-8 transition-all duration-300 ${
                plan.featured
                  ? 'border-2 border-red-600 bg-zinc-900 shadow-2xl shadow-red-600/15 md:-translate-y-2'
                  : 'border border-zinc-800 bg-zinc-900/50 hover:border-zinc-700'
              }`}
            >
              {plan.featured && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-red-600 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-white shadow-lg shadow-red-600/30">
                  Most Popular
                </span>
              )}

              <h4 className="mb-4 text-2xl font-bold text-white">{plan.name}</h4>

              <div className="mb-6 flex items-baseline gap-1">
                <span className="text-4xl font-black text-white sm:text-5xl">
                  ₹{plan.price}
                </span>
                <span className="text-sm font-medium text-zinc-400">
                  / {plan.period}
                </span>
              </div>

              <ul className="mb-8 flex-1 space-y-3">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-3 text-sm text-zinc-300"
                  >
                    <Check className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleDirectActivate(plan)}
                disabled={loadingPlan === plan.id}
                className={`w-full font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all text-xs uppercase tracking-wider disabled:opacity-50 cursor-pointer ${
                  plan.featured
                    ? 'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/25'
                    : 'bg-zinc-950 hover:bg-red-600 text-white border border-zinc-800 hover:border-red-600'
                }`}
              >
                <CheckCircle className="w-4 h-4" />
                {loadingPlan === plan.id ? 'Activating...' : `Activate ${plan.name}`}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}