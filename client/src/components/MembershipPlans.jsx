
import React, { useState } from 'react';
import {
  Check,
  X,
  ShieldCheck,
  ArrowRight,
  Loader2,
  CheckCircle2,
} from 'lucide-react';
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

  const handleCloseModal = () => {
    if (loading) return;

    setSelectedPlan(null);
    setIsSuccess(false);
  };

  const handleConfirmPlan = async () => {
    if (!selectedPlan || loading) return;

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
        body: JSON.stringify({
          activePlan: selectedPlan.name,
          membershipPlan: selectedPlan.name,
        }),
      });

      const data = await res.json();

      if (!res.ok || data.success === false) {
        throw new Error(
          data.message || 'Failed to activate membership.'
        );
      }

      // Preserve existing user data and merge the server response.
      const existingUser = JSON.parse(
        localStorage.getItem('titanfit_user') || '{}'
      );

      const updatedUser = {
        ...existingUser,
        ...(data.user || {}),
        activePlan: selectedPlan.name,
        membershipPlan: selectedPlan.name,
      };

      localStorage.setItem(
        'titanfit_user',
        JSON.stringify(updatedUser)
      );

      // Notify other components in the same browser tab.
      window.dispatchEvent(
        new CustomEvent('titanfit:membership-updated', {
          detail: {
            plan: selectedPlan.name,
            user: updatedUser,
          },
        })
      );

      // Notify the parent component, if a callback was provided.
      if (onSelectPlan) {
        onSelectPlan(selectedPlan.name);
      }

      setIsSuccess(true);

      // Keep the success message visible before closing the modal.
      setTimeout(() => {
        setSelectedPlan(null);
        setIsSuccess(false);
      }, 2000);
    } catch (error) {
      console.error('Membership activation error:', error);
      alert(error.message || 'Failed to connect to the server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="membership"
      className="relative bg-slate-950 py-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="mb-2 text-sm font-bold uppercase tracking-widest text-amber-500">
            Membership Plans
          </h2>

          <h3 className="text-3xl font-extrabold text-white sm:text-4xl">
            Invest In Your Health
          </h3>

          <p className="mt-2 text-sm text-slate-400 sm:text-base">
            Flexible plans designed for all fitness levels. No hidden charges.
          </p>
        </div>

        {/* Pricing cards */}
        <div className="grid grid-cols-1 items-stretch gap-8 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative flex flex-col rounded-2xl p-8 transition-all ${
                plan.featured
                  ? 'border-2 border-amber-500 bg-slate-900 shadow-xl shadow-amber-500/10'
                  : 'border border-slate-800 bg-slate-900/40'
              }`}
            >
              {plan.featured && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-amber-500 px-3 py-1 text-xs font-black uppercase tracking-wider text-slate-950 shadow-md">
                  Most Popular
                </span>
              )}

              <h4 className="mb-4 text-2xl font-bold text-white">
                {plan.name}
              </h4>

              <div className="mb-6 flex items-baseline gap-1">
                <span className="text-4xl font-black text-white sm:text-5xl">
                  ₹{plan.price}
                </span>
                <span className="text-sm font-medium text-slate-400">
                  / {plan.period}
                </span>
              </div>

              <ul className="mb-8 flex-1 space-y-3">
                {plan.features.map((feature, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 text-sm text-slate-300"
                  >
                    <Check className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                type="button"
                onClick={() => handleOpenModal(plan)}
                className={`w-full cursor-pointer rounded-xl py-3.5 font-bold transition-all ${
                  plan.featured
                    ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20 hover:bg-amber-400'
                    : 'border border-slate-700 bg-slate-800 text-white hover:bg-slate-700'
                }`}
              >
                Choose {plan.name}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Confirmation modal */}
      {selectedPlan && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur-md"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              handleCloseModal();
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="membership-modal-title"
            className="relative w-full max-w-md animate-in rounded-2xl border border-slate-800 bg-slate-900 p-6 text-slate-100 shadow-2xl fade-in zoom-in-95 duration-150"
          >
            <button
              type="button"
              onClick={handleCloseModal}
              disabled={loading}
              aria-label="Close membership dialog"
              className="absolute right-4 top-4 cursor-pointer text-slate-400 hover:text-white disabled:cursor-not-allowed"
            >
              <X className="h-5 w-5" />
            </button>

            {isSuccess ? (
              <div className="space-y-3 py-6 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-400">
                  <CheckCircle2 className="h-7 w-7" />
                </div>

                <h3
                  id="membership-modal-title"
                  className="text-base font-bold text-white"
                >
                  Membership Activated!
                </h3>

                <p className="text-sm text-slate-400">
                  Your{' '}
                  <span className="font-bold text-amber-400">
                    {selectedPlan.name}
                  </span>{' '}
                  plan has been saved.
                </p>

                <p className="text-xs text-slate-500">
                  Your profile should now display the selected membership.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-amber-500">
                  <ShieldCheck className="h-6 w-6" />
                  <h3
                    id="membership-modal-title"
                    className="text-base font-bold text-white"
                  >
                    Membership Confirmation
                  </h3>
                </div>

                <div className="space-y-3 rounded-xl border border-slate-800 bg-slate-950 p-4">
                  <div className="flex items-center justify-between gap-4 text-xs">
                    <span className="text-slate-400">Selected Plan:</span>
                    <span className="font-bold text-white">
                      {selectedPlan.name}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-4 text-xs">
                    <span className="text-slate-400">Billing Cycle:</span>
                    <span className="font-bold text-slate-300">
                      Monthly
                    </span>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-800 pt-3 text-sm">
                    <span className="font-bold text-white">Plan Price:</span>
                    <span className="text-base font-extrabold text-amber-400">
                      ₹{selectedPlan.price}
                    </span>
                  </div>
                </div>

                <p className="text-xs leading-relaxed text-slate-400">
                  Confirming will request activation of the{' '}
                  {selectedPlan.name} membership on your account.
                </p>

                <button
                  type="button"
                  onClick={handleConfirmPlan}
                  disabled={loading}
                  className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-amber-500 py-3 text-xs font-bold text-slate-950 shadow-lg shadow-amber-500/20 transition-colors hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Activating Membership...</span>
                    </>
                  ) : (
                    <>
                      <span>Confirm & Activate Plan</span>
                      <ArrowRight className="h-4 w-4" />
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
