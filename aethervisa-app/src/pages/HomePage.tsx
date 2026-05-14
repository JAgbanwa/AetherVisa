import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
  ArrowRight, CheckCircle, Sparkles, Shield, DollarSign,
  Globe, Users, BookOpen, TrendingUp, Star, AlertTriangle,
  FileText, Search, ChevronRight, Zap, Send, ThumbsUp
} from 'lucide-react';
import clsx from 'clsx';

interface Review {
  id: string;
  author: string;
  initials: string;
  role: string;
  rating: number;
  text: string;
  feature: string;
  date: string;
  helpful: number;
  helpedBy: string[];
}

const SEED_REVIEWS: Review[] = [
  {
    id: 'seed-1',
    author: 'Amara K.',
    initials: 'AK',
    role: 'PhD Candidate · Nigeria → Spain',
    rating: 5,
    text: 'The eligibility checker saved me from applying for the wrong visa. I would have wasted months and hundreds of euros without it.',
    feature: 'Eligibility Checker',
    date: '2 weeks ago',
    helpful: 18,
    helpedBy: [],
  },
  {
    id: 'seed-2',
    author: 'Carlos M.',
    initials: 'CM',
    role: 'Researcher · Venezuela → Spain',
    rating: 5,
    text: 'The document generator gave me a hosting agreement request template that actually worked. Got my supervisor at UAB to sign in two weeks.',
    feature: 'Document Generator',
    date: '1 month ago',
    helpful: 24,
    helpedBy: [],
  },
  {
    id: 'seed-3',
    author: 'Priya S.',
    initials: 'PS',
    role: 'Software Engineer · India → Netherlands',
    rating: 4,
    text: 'Finally a tool that explains EU immigration in plain language. The risk analyzer made me realize I was about to make a critical mistake.',
    feature: 'Risk Analyzer',
    date: '3 weeks ago',
    helpful: 11,
    helpedBy: [],
  },
];

const FEATURES = ['Eligibility Checker', 'Visa Comparison', 'Document Generator', 'Cost Estimator', 'Outreach Tool', 'Risk Analyzer', 'General'];

function StarPicker({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(n => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          onMouseEnter={() => setHover(n)}
          onMouseLeave={() => setHover(0)}
          className="transition-transform hover:scale-110"
          aria-label={`${n} star`}
        >
          <Star
            size={24}
            className={clsx(
              'transition-colors',
              (hover || value) >= n ? 'text-amber-400 fill-amber-400' : 'text-slate-600'
            )}
          />
        </button>
      ))}
    </div>
  );
}

const STORAGE_KEY = 'aethervisa_reviews';

function loadReviews(): Review[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? (JSON.parse(stored) as Review[]) : SEED_REVIEWS;
  } catch {
    return SEED_REVIEWS;
  }
}

function saveReviews(reviews: Review[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
  } catch {
    // storage unavailable — silent fail
  }
}

function RatingsSection() {
  const [reviews, setReviews] = useState<Review[]>(loadReviews);
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [rating, setRating] = useState(0);
  const [text, setText] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [feature, setFeature] = useState('General');
  const [userId] = useState(() => Math.random().toString(36).slice(2));

  useEffect(() => {
    saveReviews(reviews);
  }, [reviews]);

  const avgRating = reviews.length
    ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
    : 0;

  const dist = [5, 4, 3, 2, 1].map(n => ({
    stars: n,
    count: reviews.filter(r => r.rating === n).length,
    pct: reviews.length ? Math.round((reviews.filter(r => r.rating === n).length / reviews.length) * 100) : 0,
  }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating || !text.trim()) return;
    const initials = name.trim()
      ? name.trim().split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
      : 'AN';
    const newReview: Review = {
      id: `user-${Date.now()}`,
      author: name.trim() || 'Anonymous',
      initials,
      role: role.trim() || 'AetherVisa user',
      rating,
      text: text.trim(),
      feature,
      date: 'Just now',
      helpful: 0,
      helpedBy: [],
    };
    setReviews(prev => [newReview, ...prev]);
    setSubmitted(true);
    setShowForm(false);
    setRating(0);
    setText('');
    setName('');
    setRole('');
    setFeature('General');
  };

  const toggleHelpful = (id: string) => {
    setReviews(prev => prev.map(r => {
      if (r.id !== id) return r;
      const alreadyMarked = r.helpedBy.includes(userId);
      return {
        ...r,
        helpful: alreadyMarked ? r.helpful - 1 : r.helpful + 1,
        helpedBy: alreadyMarked ? r.helpedBy.filter(u => u !== userId) : [...r.helpedBy, userId],
      };
    }));
  };

  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="section-header">
          <h2 className="text-4xl font-bold text-white mb-4">Rate your experience</h2>
          <p className="text-slate-400 text-lg">Honest reviews from people using AetherVisa to navigate their journey.</p>
        </div>

        {/* Aggregate + form trigger */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Score card */}
          <div className="card flex flex-col items-center justify-center py-8 text-center">
            <span className="text-7xl font-bold text-white mb-2">{avgRating.toFixed(1)}</span>
            <div className="flex gap-1 mb-3">
              {[1,2,3,4,5].map(n => (
                <Star key={n} size={18} className={clsx(avgRating >= n ? 'text-amber-400 fill-amber-400' : avgRating >= n - 0.5 ? 'text-amber-400 fill-amber-400/50' : 'text-slate-600')} />
              ))}
            </div>
            <p className="text-slate-400 text-sm">{reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}</p>
          </div>

          {/* Distribution bars */}
          <div className="card flex flex-col justify-center gap-2.5 py-6">
            {dist.map(d => (
              <div key={d.stars} className="flex items-center gap-2.5">
                <span className="text-slate-400 text-xs w-4 text-right flex-shrink-0">{d.stars}</span>
                <Star size={11} className="text-amber-400 fill-amber-400 flex-shrink-0" />
                <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-400 rounded-full transition-all duration-500"
                    style={{ width: `${d.pct}%` }}
                  />
                </div>
                <span className="text-slate-500 text-xs w-8 flex-shrink-0">{d.count}</span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="card flex flex-col items-center justify-center text-center gap-4 py-8">
            {submitted ? (
              <>
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <CheckCircle size={28} className="text-emerald-400" />
                </div>
                <p className="text-white font-semibold">Thank you for your review!</p>
                <p className="text-slate-400 text-sm">Your feedback helps others navigate their journey.</p>
                <button onClick={() => setSubmitted(false)} className="btn-secondary text-sm py-2">Write another</button>
              </>
            ) : (
              <>
                <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                  <Star size={28} className="text-blue-400" />
                </div>
                <p className="text-white font-semibold">Used AetherVisa?</p>
                <p className="text-slate-400 text-sm">Share what helped you — your review can guide someone else's move to Europe.</p>
                <button onClick={() => setShowForm(v => !v)} className="btn-primary text-sm py-2.5 px-6">
                  {showForm ? 'Cancel' : 'Leave a Review'}
                </button>
              </>
            )}
          </div>
        </div>

        {/* Review form */}
        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="card border-blue-500/30 bg-blue-950/20 mb-10"
          >
            <h3 className="text-white font-semibold text-lg mb-6">Your review</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
              <div>
                <label className="label">Your name <span className="text-slate-500">(optional)</span></label>
                <input className="input" placeholder="e.g. Amara K." value={name} onChange={e => setName(e.target.value)} maxLength={60} />
              </div>
              <div>
                <label className="label">Background <span className="text-slate-500">(optional)</span></label>
                <input className="input" placeholder="e.g. PhD student · Nigeria → Spain" value={role} onChange={e => setRole(e.target.value)} maxLength={80} />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
              <div>
                <label className="label">Feature reviewed</label>
                <select className="select" value={feature} onChange={e => setFeature(e.target.value)}>
                  {FEATURES.map(f => <option key={f}>{f}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Overall rating <span className="text-red-400">*</span></label>
                <StarPicker value={rating} onChange={setRating} />
              </div>
            </div>
            <div className="mb-5">
              <label className="label">Your experience <span className="text-red-400">*</span></label>
              <textarea
                className="input min-h-[100px] resize-y"
                placeholder="What did you find useful? What could be better?"
                value={text}
                onChange={e => setText(e.target.value)}
                maxLength={600}
                required
              />
              <p className="text-slate-500 text-xs mt-1 text-right">{text.length}/600</p>
            </div>
            <div className="flex items-center justify-between gap-4">
              <p className="text-slate-500 text-xs">Reviews are stored locally in your browser.</p>
              <button type="submit" disabled={!rating || !text.trim()} className="btn-primary flex items-center gap-2 py-2.5 px-6 disabled:opacity-40 disabled:cursor-not-allowed">
                <Send size={14} /> Submit Review
              </button>
            </div>
          </form>
        )}

        {/* Review list */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.slice(0, 6).map(r => (
            <div key={r.id} className="card flex flex-col">
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex gap-0.5">
                  {[1,2,3,4,5].map(n => (
                    <Star key={n} size={13} className={clsx(r.rating >= n ? 'text-amber-400 fill-amber-400' : 'text-slate-600')} />
                  ))}
                </div>
                <span className="badge bg-slate-700/60 text-slate-400 text-xs">{r.feature}</span>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed flex-1 mb-5">{r.text}</p>
              <div className="flex items-center justify-between gap-2 pt-3 border-t border-slate-700/50">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                    {r.initials}
                  </div>
                  <div>
                    <p className="text-white font-medium text-xs">{r.author}</p>
                    <p className="text-slate-400 text-xs">{r.role}</p>
                  </div>
                </div>
                <button
                  onClick={() => toggleHelpful(r.id)}
                  className={clsx(
                    'flex items-center gap-1 text-xs px-2 py-1 rounded-lg transition-colors',
                    r.helpedBy.includes(userId)
                      ? 'bg-blue-600/20 text-blue-400'
                      : 'text-slate-500 hover:text-slate-300 hover:bg-slate-700/50'
                  )}
                  aria-label="Mark as helpful"
                >
                  <ThumbsUp size={11} /> {r.helpful > 0 && r.helpful}
                </button>
              </div>
            </div>
          ))}
        </div>
        {reviews.length > 6 && (
          <p className="text-center text-slate-500 text-sm mt-6">{reviews.length - 6} more reviews stored locally.</p>
        )}
      </div>
    </section>
  );
}

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

      <RatingsSection />

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
