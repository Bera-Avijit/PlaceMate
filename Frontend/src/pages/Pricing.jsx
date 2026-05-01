import React from 'react';
import { motion } from 'framer-motion';
import { Check, ArrowRight, Zap, Shield, Crown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Pricing = () => {
  const navigate = useNavigate();

  const plans = [
    {
      name: 'Basic',
      icon: Shield,
      price: 'Free',
      description: 'Perfect for exploring your career options.',
      features: [
        'AI Resume Parsing',
        'Top 5 Company Matches',
        'Unlock 1 Detailed Company Prep Plan',
        'Basic Progress Tracking'
      ],
      buttonText: 'Current Plan',
      isPopular: false,
      buttonAction: () => navigate('/dashboard')
    },
    {
      name: 'Pro',
      icon: Zap,
      price: '$10',
      period: '/month',
      description: 'For serious candidates ready to crack top tier interviews.',
      features: [
        'Everything in Basic',
        'Unlimited Detailed Company Prep Plans',
        'Advanced Mock Interview Generation',
        'Priority AI Processing',
        'Direct HR Referrals (Coming Soon)'
      ],
      buttonText: 'Upgrade to Pro',
      isPopular: true,
      buttonAction: () => console.log('Upgrade to Pro')
    },
    {
      name: 'Enterprise',
      icon: Crown,
      price: 'Custom',
      description: 'For universities and placement agencies.',
      features: [
        'Everything in Pro',
        'Bulk Resume Processing',
        'Custom Company Workflows',
        'API Access',
        'Dedicated Account Manager'
      ],
      buttonText: 'Contact Us',
      isPopular: false,
      buttonAction: () => console.log('Contact Enterprise')
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white selection:bg-amber-500/30">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-8 pt-32 pb-24">
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-black tracking-tight mb-4 uppercase italic"
          >
            Invest in Your <span className="text-amber-500">Future.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-slate-500 text-sm font-bold uppercase tracking-[0.2em] max-w-2xl mx-auto"
          >
            Choose the plan that accelerates your career placement journey.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`relative bg-[#0a0a0a] rounded-[2.5rem] p-8 flex flex-col ${
                plan.isPopular 
                  ? 'border-2 border-amber-500 transform md:-translate-y-4 shadow-2xl shadow-amber-500/10' 
                  : 'border border-white/5'
              }`}
            >
              {plan.isPopular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-amber-500 text-black text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full">
                  Most Popular
                </div>
              )}

              <div className="mb-8">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 ${
                  plan.isPopular ? 'bg-amber-500/10 text-amber-500' : 'bg-white/5 text-slate-400'
                }`}>
                  <plan.icon size={24} />
                </div>
                <h3 className="text-xl font-black uppercase italic tracking-wide mb-2">{plan.name}</h3>
                <p className="text-slate-500 text-xs font-medium leading-relaxed">{plan.description}</p>
              </div>

              <div className="mb-8">
                <span className="text-4xl font-black tracking-tight">{plan.price}</span>
                {plan.period && <span className="text-slate-500 text-sm font-bold uppercase tracking-widest ml-1">{plan.period}</span>}
              </div>

              <ul className="space-y-4 mb-10 flex-1">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className="mt-0.5 w-5 h-5 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                      <Check size={12} className={plan.isPopular ? 'text-amber-500' : 'text-slate-400'} />
                    </div>
                    <span className="text-xs font-bold text-slate-300 leading-relaxed">{feature}</span>
                  </li>
                ))}
              </ul>

              <button 
                onClick={plan.buttonAction}
                className={`w-full py-4 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-2 active:scale-95 ${
                  plan.isPopular 
                    ? 'bg-amber-500 hover:bg-amber-400 text-black shadow-lg shadow-amber-500/20' 
                    : 'bg-white/5 hover:bg-white/10 text-white border border-white/5'
                }`}
              >
                {plan.buttonText}
                <ArrowRight size={14} />
              </button>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Pricing;
