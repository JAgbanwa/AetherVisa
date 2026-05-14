import { Link } from 'react-router-dom';
import {
  ArrowRight, CheckCircle, Sparkles, Shield, DollarSign,
  Globe, Users, BookOpen, TrendingUp, Star, AlertTriangle,
  FileText, Search, ChevronRight, Zap
} from 'lucide-react';

const features = [
  {
    icon: Sparkles,
    title: 'AI Eligibility Checker',
    desc: 'Get instant success probability estimates for 9+ EU visa pathways based on your unique profile.',
    color: 'from-blue-500 to-cyan-500',
    path: '/eligibility',
  },
  {
    icon: TrendingUp,
    title: 'Visa Comparison Engine',
    desc: 'Compare Spain, Germany, Netherlands, Italy, Belgium and Portugal pathways side by side.',
    color: 'from-violet-500 to-purple-600',
    path: '/comparison',
  },
  {
    icon: FileText,
    title: 'Document Generator',
    desc: 'Auto-generate cover letters, motivation letters, hosting agreement requests and financial proof letters.',
    color: 'from-emerald-500 to-teal-600',
    path: '/documents',
  },
  {
    icon: DollarSign,
    title: 'Cost & Timeline Estimator',
    desc: 'Full breakdown of visa fees, translations, health insurance, and living costs for each pathway.',
    color: 'from-amber-500 to-orange-500',
    path: '/costs',
  },
  {
    icon: Search,
    title: 'University Outreach Tool',
    desc: 'Database of 50+ international-friendly universities with supervisor email templates.',
    color: 'from-pink-500 to-rose-600',
    path: '/outreach',
  },
  {
    icon: AlertTriangle,
    title: 'Risk & Red Flag Analyzer',
    desc: 'Identify dangerous mistakes before you make them — overstaying, wrong country, document fraud and more.',
    color: 'from-red-500 to-rose-600',
    path: '/risks',
  },
];

const stats = [
  { value: '9+', label: 'EU Visa Pathways' },
  { value: '50+', label: 'Universities Tracked' },
  { value: '12', label: 'Countries Covered' },
  { value: '30min', label: 'Avg. Time Saved' },
];

const testimonials = [
  {
    text: '"The eligibility checker saved me from applying for the wrong visa. I would have wasted months and hundreds of euros without it."',
    author: 'Amara K.',
    role: 'PhD Candidate, Nigeria → Spain',
    avatar: 'AK',
    rating: 5,
  },
  {
    text: '"The document generator gave me a hosting agreement request template that actually worked. Got my supervisor at UAB to sign in two weeks."',
    author: 'Carlos M.',
    role: 'Researcher, Venezuela → Spain',
    avatar: 'CM',
    rating: 5,
  },
  {
    text: '"Finally a tool that explains EU immigration in plain language. The risk analyzer made me realize I was about to make a critical mistake."',
    author: 'Priya S.',
    role: 'Software Engineer, India → Netherlands',
    avatar: 'PS',
    rating: 5,
  },
];

const visaFlags = [
  { country: 'Spain', flag: '🇪🇸', visas: 3 },
  { country: 'Germany', flag: '🇩🇪', visas: 3 },
  { country: 'Netherlands', flag: '🇳🇱', visas: 2 },
  { country: 'Italy', flag: '🇮🇹', visas: 2 },
  { country: 'Belgium', flag: '🇧🇪', visas: 2 },
  { country: 'Portugal', flag: '🇵🇹', visas: 2 },
];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative pt-32 pb-24 overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-600/10 rounded-full blur-3xl" />
          <div className="absolute top-40 left-1/4 w-[400px] h-[400px] bg-cyan-600/8 rounded-full blur-3xl" />
          <div className="absolute top-20 right-1/4 w-[300px] h-[300px] bg-violet-600/8 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1.5 mb-8">
            <Zap size={13} className="text-blue-400" />
            <span className="text-blue-300 text-sm font-medium">Free eligibility check — no account needed</span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight tracking-tight">
            Navigate Europe's{' '}
            <span className="gradient-text">Immigration</span>
            <br />System with Confidence
          </h1>

          <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Stop guessing. AetherVisa gives immigrants, researchers, and skilled workers personalized visa pathways, document templates, and step-by-step guidance for 6 EU countries.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link to="/eligibility" className="flex items-center gap-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-semibold px-8 py-4 rounded-xl transition-all shadow-2xl shadow-blue-600/30 text-lg group">
              Check My Eligibility Free
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/comparison" className="flex items-center gap-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-semibold px-8 py-4 rounded-xl transition-all text-lg">
              Compare Visa Routes
            </Link>
          </div>

          {/* Stats bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-slate-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Country flags bar */}
      <section className="border-y border-slate-800 bg-slate-900/50 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <span className="text-slate-500 text-sm mr-4">Covering:</span>
            {visaFlags.map((c) => (
              <Link
                key={c.country}
                to="/comparison"
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700/50 transition-colors"
              >
                <span className="text-xl">{c.flag}</span>
                <span className="text-slate-300 text-sm font-medium">{c.country}</span>
                <span className="badge bg-blue-500/10 text-blue-400">{c.visas} visas</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="section-header">
            <div className="inline-flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-full px-4 py-1.5 mb-6">
              <Globe size={13} className="text-slate-400" />
              <span className="text-slate-400 text-sm">Everything you need in one place</span>
            </div>
            <h2 className="text-4xl font-bold text-white mb-4">
              Your complete immigration toolkit
            </h2>
            <p className="text-slate-400 text-lg max-w-xl mx-auto">
              Every feature is designed around the real challenges faced by immigrants navigating the European system.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <Link key={feature.title} to={feature.path} className="card-hover group">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 shadow-lg`}>
                  <feature.icon size={18} className="text-white" />
                </div>
                <h3 className="text-white font-semibold text-lg mb-2 group-hover:text-blue-300 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-4">{feature.desc}</p>
                <div className="flex items-center gap-1 text-blue-400 text-sm font-medium">
                  Get started <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="section-header">
            <h2 className="text-4xl font-bold text-white mb-4">How AetherVisa works</h2>
            <p className="text-slate-400 text-lg max-w-xl mx-auto">
              From confusion to clarity in under 15 minutes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-10 left-1/6 right-1/6 h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent" />

            {[
              {
                step: '01',
                title: 'Share your profile',
                desc: 'Tell us your nationality, education, work experience, field, and current situation. Takes 3 minutes.',
                icon: Users,
              },
              {
                step: '02',
                title: 'Get personalized results',
                desc: 'Instantly see your best visa options with success probability estimates and missing requirements.',
                icon: Sparkles,
              },
              {
                step: '03',
                title: 'Take action confidently',
                desc: 'Use our checklists, document templates, and university outreach tools to execute your plan.',
                icon: CheckCircle,
              },
            ].map((step) => (
              <div key={step.step} className="relative text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-slate-800 border border-slate-700 mb-6 mx-auto relative">
                  <step.icon size={28} className="text-blue-400" />
                  <div className="absolute -top-3 -right-3 w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
                    {step.step.replace('0', '')}
                  </div>
                </div>
                <h3 className="text-white font-semibold text-xl mb-3">{step.title}</h3>
                <p className="text-slate-400 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="section-header">
            <h2 className="text-4xl font-bold text-white mb-4">Real people, real results</h2>
            <p className="text-slate-400 text-lg">From across the world, navigating into Europe.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.author} className="card">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} size={14} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-slate-300 text-sm leading-relaxed mb-6">{t.text}</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-sm font-semibold">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">{t.author}</p>
                    <p className="text-slate-400 text-xs">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing CTA */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-violet-700 p-12 text-center shadow-2xl shadow-blue-900/40">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.1),transparent)] pointer-events-none" />
            <div className="relative">
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-6">
                <Shield size={13} className="text-white/80" />
                <span className="text-white/80 text-sm">No risk — free tier available</span>
              </div>
              <h2 className="text-4xl font-bold text-white mb-4">
                Start your journey today
              </h2>
              <p className="text-blue-100 text-lg mb-8 max-w-xl mx-auto">
                Get your free eligibility check in 3 minutes. No account required. No credit card.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/eligibility" className="flex items-center gap-2 bg-white text-blue-700 hover:bg-blue-50 font-bold px-8 py-4 rounded-xl transition-colors shadow-xl text-lg">
                  <Sparkles size={18} />
                  Check Eligibility Free
                </Link>
                <Link to="/pricing" className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold px-8 py-4 rounded-xl transition-colors text-lg">
                  <BookOpen size={18} />
                  View Pricing
                </Link>
              </div>
              <div className="flex items-center justify-center gap-6 mt-8 text-blue-200 text-sm">
                {['Free eligibility check', 'No credit card', 'Cancel anytime'].map((item) => (
                  <div key={item} className="flex items-center gap-1.5">
                    <CheckCircle size={14} />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="flex items-start gap-3 bg-amber-500/5 border border-amber-500/20 rounded-xl p-4">
          <AlertTriangle size={16} className="text-amber-400 mt-0.5 flex-shrink-0" />
          <p className="text-slate-400 text-xs leading-relaxed">
            <strong className="text-slate-300">Legal disclaimer:</strong> AetherVisa provides general information only and does not constitute legal advice. Immigration laws change frequently. Always consult with a qualified immigration lawyer before making decisions about your immigration status. Probability estimates are indicative only and cannot guarantee outcomes.
          </p>
        </div>
      </div>
    </div>
  );
}
