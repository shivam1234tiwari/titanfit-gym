import React from 'react';
import { Check } from 'lucide-react';
import PaymentButton from './PaymentButton';

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
  const handlePaymentSuccess = (plan, updatedPlan) => {
    // Preserve the current user data and apply membership details returned
    // by PaymentButton, if it provides them.
    let existingUser = {};

    try {
      existingUser = JSON.parse(localStorage.getItem('titanfit_user') || '{}');
    } catch (error) {
      console.error('Could not read saved TitanFit user:', error);
    }

    const membershipName =
      (updatedPlan && (updatedPlan.membershipPlan || updatedPlan.activePlan || updatedPlan.planName)) ||
      plan.name;

    const updatedUser = {
      ...existingUser,
      ...(updatedPlan && typeof updatedPlan === 'object' ? updatedPlan : {}),
      activePlan: membershipName,
      membershipPlan: membershipName,
    };

    localStorage.setItem('titanfit_user', JSON.stringify(updatedUser));

    // Notify components listening for membership changes in this tab.
    window.dispatchEvent(
      new CustomEvent('titanfit:membership-updated', {
        detail: {
          plan: membershipName,
          user: updatedUser,
        },
      }),
    );

    // Notify the parent component/context so it can refresh its own state.
    if (typeof onSelectPlan === 'function') {
      onSelectPlan(membershipName, updatedUser);
    }
  };

  return (
    <section id="membership" className="relative bg-slate-950 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
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

        {/* Membership cards */}
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

              <h4 className="mb-4 text-2xl font-bold text-white">{plan.name}</h4>

              <div className="mb-6 flex items-baseline gap-1">
                <span className="text-4xl font-black text-white sm:text-5xl">
                  ₹{plan.price}
                </span>
                <span className="text-sm font-medium text-slate-400">
                  / {plan.period}
                </span>
              </div>

              <ul className="mb-8 flex-1 space-y-3">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-3 text-sm text-slate-300"
                  >
                    <Check className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <PaymentButton
                planName={plan.name}
                amount={plan.price}
                onSuccess={(updatedPlan) =>
                  handlePaymentSuccess(plan, updatedPlan)
                }
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
