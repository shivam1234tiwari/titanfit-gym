import React from 'react';
import { Check } from 'lucide-react';

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
  return (
    <section id="membership" className="py-20 bg-slate-950">
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

        {/* Pricing Cards */}
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

              {/* Price in INR */}
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl sm:text-5xl font-black text-white">₹{p.price}</span>
                <span className="text-slate-400 text-sm font-medium">/ {p.period}</span>
              </div>

              {/* Feature List */}
              <ul className="space-y-3 mb-8 flex-1">
                {p.features.map((feat, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
                    <Check className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>

              {/* Select Button */}
              <button
                onClick={() => onSelectPlan(p.name)}
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
    </section>
  );
}