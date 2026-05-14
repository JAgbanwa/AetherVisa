import { useState } from 'react';
import { Check, Sparkles, Shield, Zap, Lock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';

interface Plan {
  id: string;
  name: string;
  price: number;
  yearlyPrice?: number;
  period: string;
  description: string;
  cta: string;
  ctaStyle: string;
  popular?: boolean;
  icon: React.ElementType;
  features: { label: string; included: boolean }[];
}

const PLANS: Plan[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    period: 'forever',
    description: 'For people just starting to explore their options.',
    cta: 'Get Started Free',
    ctaStyle: 'btn-secondary w-full justify-center',
    icon: Zap,
    features: [
      { label: 'Eligibility checker (basic)', included: true },
      { label: 'Visa comparison (all pathways)', included: true },
      { label: '2 free document templates', included: true },
      { label: 'Risk & Red Flag Analyzer', included: true },
      { label: 'Cost estimator (overview)', included: true },
      { label: 'University database (view only)', included: true },
      { label: 'Community forum access', included: true },
      { label: 'Detailed probability breakdown', included: false },
      { label: 'All 20+ document templates', included: false },
      { label: 'Personalized step-by-step plan', included: false },
      { label: 'University outreach tracker', included: false },
      { label: 'Detailed cost breakdown', included: false },
      { label: 'Priority support', included: false },
    ],
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 14,
    yearlyPrice: 9,
    period: 'month',
    description: 'Everything you need to plan and execute your visa application.',
    cta: 'Start Premium',
    ctaStyle: 'btn-primary w-full justify-center',
    popular: true,
    icon: Sparkles,
    features: [
      { label: 'Eligibility checker (basic)', included: true },
      { label: 'Visa comparison (all pathways)', included: true },
      { label: '2 free document templates', included: true },
      { label: 'Risk & Red Flag Analyzer', included: true },
      { label: 'Cost estimator (overview)', included: true },
      { label: 'University database (view only)', included: true },
      { label: 'Community forum access', included: true },
      { label: 'Detailed probability breakdown', included: true },
      { label: 'All 20+ document templates', included: true },
      { label: 'Personalized step-by-step plan', included: true },
      { label: 'University outreach tracker', included: true },
      { label: 'Detailed cost breakdown', included: true },
      { label: 'Priority support', included: false },
    ],
  },
  {
    id: 'expert',
    name: 'Expert Review',
    price: 199,
    period: 'one-time',
    description: 'Human expert reviews your full application package before submission.',
    cta: 'Book Expert Review',
    ctaStyle: 'btn-outline w-full justify-center',
    icon: Shield,
    features: [
      { label: 'Everything in Premium', included: true },
      { label: 'Full application package review', included: true },
      { label: 'Immigration expert video call (60 min)', included: true },
      { label: 'Document review & corrections', included: true },
      { label: 'Cover letter personalization', included: true },
      { label: 'Red flag identification', included: true },
      { label: 'Follow-up Q&A (30 days)', included: true },
      { label: 'Refund if rejected due to our error', included: true },
      { label: 'Priority support', included: true },
      { label: 'Unlimited template generation', included: true },
      { label: 'Custom hosting agreement drafting', included: true },
      { label: 'Appeal letter support', included: true },
      { label: 'Ongoing monthly access', included: false },
    ],
  },
];

const FAQ = [
  {
    q: 'Is this legal advice?',
    a: 'No. AetherVisa provides general information, templates, and guidance only. We are not lawyers and this is not legal advice. For complex immigration situations — especially if you have past rejections, overstays, or unusual circumstances — always consult a qualified immigration lawyer.',
  },
  {
    q: 'How accurate are the probability estimates?',
    a: 'Our probability estimates are based on publicly known criteria for each visa type combined with your profile inputs. They are indicative only — visa outcomes depend on many factors including consulate discretion, documentation quality, and policy changes. Treat them as directional guidance, not guarantees.',
  },
  {
    q: 'Can I cancel my Premium subscription anytime?',
    a: 'Yes. You can cancel at any time with no penalty. Your access continues until the end of the current billing period.',
  },
  {
    q: 'What countries and visas are covered?',
    a: 'We cover Spain, Germany, Netherlands, Italy, Belgium, and Portugal — with 9+ visa pathways including researcher visas, student visas, job seeker visas, EU Blue Card, Highly Skilled Migrant, talent visas, and orientation year permits.',
  },
  {
    q: 'What is the Expert Review service?',
    a: 'Expert Review is a one-time service where a human immigration expert (not a lawyer, but an experienced consultant) reviews your complete application package, identifies weaknesses, and provides personalized recommendations before you submit. It includes a 60-minute video call.',
  },
  {
    q: 'Is my data secure?',
    a: 'Yes. Your profile data is processed client-side for the eligibility checker and is not stored on our servers unless you create an account. All data is encrypted in transit.',
  },
];

export default function PricingPage() {
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <h1 className="text-4xl font-bold text-white mb-3">Simple, transparent pricing</h1>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            Start free. Upgrade when you need more. Cancel anytime.
          </p>

          {/* Billing toggle */}
          <div className="inline-flex items-center gap-3 bg-slate-800 border border-slate-700 rounded-xl p-1 mt-8">
            {(['monthly', 'yearly'] as const).map(b => (
              <button
                key={b}
                onClick={() => setBilling(b)}
                className={clsx(
                  'px-5 py-2 rounded-lg text-sm font-medium transition-all capitalize',
                  billing === b ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
                )}
              >
                {b}
                {b === 'yearly' && <span className="ml-1.5 badge bg-emerald-500/20 text-emerald-400 text-xs">Save 36%</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {PLANS.map(plan => (
            <div
              key={plan.id}
              className={clsx(
                'rounded-2xl border p-8 relative',
                plan.popular
                  ? 'bg-gradient-to-b from-blue-600/10 to-blue-900/10 border-blue-500/40'
                  : 'bg-slate-800/40 border-slate-700'
              )}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="bg-blue-600 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">Most Popular</span>
                </div>
              )}

              <div className={clsx('w-10 h-10 rounded-xl flex items-center justify-center mb-5', plan.popular ? 'bg-blue-600' : 'bg-slate-700')}>
                <plan.icon size={18} className="text-white" />
              </div>

              <h2 className="text-white font-bold text-xl mb-1">{plan.name}</h2>
              <p className="text-slate-400 text-sm mb-5">{plan.description}</p>

              <div className="mb-6">
                {plan.price === 0 ? (
                  <div className="text-4xl font-bold text-white">Free</div>
                ) : plan.period === 'one-time' ? (
                  <div>
                    <span className="text-4xl font-bold text-white">€{plan.price}</span>
                    <span className="text-slate-400 ml-2 text-sm">one-time</span>
                  </div>
                ) : (
                  <div>
                    <span className="text-4xl font-bold text-white">
                      €{billing === 'yearly' ? plan.yearlyPrice : plan.price}
                    </span>
                    <span className="text-slate-400 ml-2 text-sm">/month</span>
                    {billing === 'yearly' && (
                      <p className="text-emerald-400 text-xs mt-1">Billed €{(plan.yearlyPrice! * 12).toFixed(0)}/year</p>
                    )}
                  </div>
                )}
              </div>

              <Link
                to="/eligibility"
                className={clsx('flex items-center gap-2 font-semibold py-3 px-5 rounded-xl transition-all mb-7', plan.ctaStyle)}
              >
                {plan.cta} <ArrowRight size={15} />
              </Link>

              <div className="space-y-3">
                {plan.features.map(f => (
                  <div key={f.label} className="flex items-start gap-2.5">
                    {f.included ? (
                      <Check size={15} className={clsx('flex-shrink-0 mt-0.5', plan.popular ? 'text-blue-400' : 'text-emerald-400')} />
                    ) : (
                      <Lock size={15} className="text-slate-600 flex-shrink-0 mt-0.5" />
                    )}
                    <span className={clsx('text-sm', f.included ? 'text-slate-300' : 'text-slate-600')}>{f.label}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Trust signals */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-16">
          {[
            { icon: '🔒', title: 'Secure & Private', desc: 'Profile data is not stored. All processing is client-side.' },
            { icon: '↩️', title: 'Cancel Anytime', desc: 'No long-term contracts. Cancel with one click.' },
            { icon: '⚠️', title: 'Not Legal Advice', desc: 'We provide information and tools — not legal representation.' },
          ].map(t => (
            <div key={t.title} className="flex items-start gap-3 card p-5">
              <span className="text-2xl">{t.icon}</span>
              <div>
                <p className="text-white font-medium text-sm">{t.title}</p>
                <p className="text-slate-400 text-xs">{t.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-white text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {FAQ.map((item, i) => (
              <div key={i} className="border border-slate-700 rounded-xl overflow-hidden">
                <button
                  onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                  className="w-full flex items-center justify-between gap-4 p-5 text-left"
                >
                  <span className="text-white font-medium text-sm">{item.q}</span>
                  <Zap size={15} className={clsx('text-slate-400 flex-shrink-0 transition-transform', expandedFaq === i && 'text-blue-400')} />
                </button>
                {expandedFaq === i && (
                  <div className="px-5 pb-5 border-t border-slate-700">
                    <p className="text-slate-400 text-sm leading-relaxed mt-4">{item.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
