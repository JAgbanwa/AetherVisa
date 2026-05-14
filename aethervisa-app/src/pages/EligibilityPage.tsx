import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { UserProfile, EligibilityResult } from '../types';
import { COUNTRIES, EDUCATION_LEVELS, RESEARCH_FIELDS } from '../data';
import { calculateEligibility } from '../hooks/useEligibility';
import { getUpdatesForVisa } from '../data/lawUpdates';
import { LawUpdatesPill } from '../components/LawUpdatesBanner';
import {
  ArrowRight, ArrowLeft, CheckCircle, XCircle, AlertTriangle,
  Sparkles, ChevronRight, TrendingUp, Shield, Loader, Scale, ExternalLink
} from 'lucide-react';
import clsx from 'clsx';

const defaultProfile: UserProfile = {
  nationality: '',
  education: '',
  field: '',
  workExperience: 0,
  currentLocation: '',
  monthlyIncome: 0,
  hasJobOffer: false,
  hasUniversityOffer: false,
  languageLevel: 'None',
  familySize: 1,
};

const STEPS = [
  { id: 1, title: 'Background', desc: 'Where are you from?' },
  { id: 2, title: 'Education', desc: 'Your academic profile' },
  { id: 3, title: 'Work & Finances', desc: 'Experience and income' },
  { id: 4, title: 'Your Situation', desc: 'Current circumstances' },
];

function ProbabilityBar({ value, label }: { value: number; label: string }) {
  const color =
    value >= 70 ? 'from-emerald-500 to-green-500' :
    value >= 50 ? 'from-amber-500 to-yellow-500' :
    value >= 30 ? 'from-orange-500 to-amber-600' :
    'from-red-500 to-rose-600';

  const textColor =
    value >= 70 ? 'text-emerald-400' :
    value >= 50 ? 'text-amber-400' :
    value >= 30 ? 'text-orange-400' :
    'text-red-400';

  return (
    <div className="mb-1">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs text-slate-400">{label}</span>
        <span className={`text-sm font-bold ${textColor}`}>{value}%</span>
      </div>
      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
        <div
          className={`h-full bg-gradient-to-r ${color} rounded-full transition-all duration-1000`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function ResultCard({ result, rank }: { result: EligibilityResult; rank: number }) {
  const [expanded, setExpanded] = useState(false);
  const { visa, probability, recommendation, missingRequirements, strengths, legalBasis } = result;

  const probColor =
    probability >= 70 ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' :
    probability >= 50 ? 'text-amber-400 bg-amber-500/10 border-amber-500/30' :
    probability >= 30 ? 'text-orange-400 bg-orange-500/10 border-orange-500/30' :
    'text-red-400 bg-red-500/10 border-red-500/30';

  return (
    <div className={clsx('card transition-all duration-300', rank === 0 && 'border-blue-500/40 bg-blue-500/5')}>
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-start gap-3">
          <span className="text-2xl">{visa.flag}</span>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <h3 className="text-white font-semibold">{visa.name}</h3>
              {rank === 0 && (
                <span className="badge bg-blue-500/10 text-blue-400 border border-blue-500/20">Best Match</span>
              )}
            </div>
            <p className="text-slate-400 text-sm">{visa.country} · {visa.type} · {visa.processingTime}</p>
          </div>
        </div>
        <div className={`badge border ${probColor} text-sm font-bold px-3 py-1.5`}>
          {probability}%
        </div>
      </div>

      <ProbabilityBar value={probability} label="Approval probability" />

      <p className="text-slate-300 text-sm mt-3 mb-4 leading-relaxed">{recommendation}</p>

      <button
        onClick={() => setExpanded(!expanded)}
        className="text-blue-400 text-sm font-medium flex items-center gap-1 hover:text-blue-300 transition-colors"
      >
        {expanded ? 'Hide details' : 'Show details'}
        <ChevronRight size={14} className={clsx('transition-transform', expanded && 'rotate-90')} />
      </button>

      {expanded && (
        <div className="mt-4 pt-4 border-t border-slate-700 space-y-4">
          {strengths.length > 0 && (
            <div>
              <p className="text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-2">Your Strengths</p>
              {strengths.map((s, i) => (
                <div key={i} className="flex items-start gap-2 mb-1.5">
                  <CheckCircle size={14} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-300 text-sm">{s}</span>
                </div>
              ))}
            </div>
          )}
          {missingRequirements.length > 0 && (
            <div>
              <p className="text-amber-400 text-xs font-semibold uppercase tracking-wider mb-2">Missing / Needs Work</p>
              {missingRequirements.map((m, i) => (
                <div key={i} className="flex items-start gap-2 mb-1.5">
                  <XCircle size={14} className="text-amber-400 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-300 text-sm">{m}</span>
                </div>
              ))}
            </div>
          )}
          <div>
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">Key Requirements</p>
            {visa.requirements.slice(0, 5).map((r, i) => (
              <div key={i} className="flex items-start gap-2 mb-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-500 mt-2 flex-shrink-0" />
                <span className="text-slate-400 text-sm">{r}</span>
              </div>
            ))}
          </div>

          {legalBasis.length > 0 && (
            <div className="bg-blue-950/40 border border-blue-700/30 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <Scale size={14} className="text-blue-400 flex-shrink-0" />
                <p className="text-blue-300 text-xs font-semibold uppercase tracking-wider">Legal Basis &amp; EU Law Pathways</p>
              </div>
              <div className="space-y-3">
                {legalBasis.map((ref, i) => (
                  <div key={i} className="border-l-2 border-blue-600/40 pl-3">
                    <div className="flex items-start justify-between gap-2 mb-0.5">
                      <span className="text-blue-300 text-xs font-semibold leading-snug">{ref.label}</span>
                      <a
                        href={ref.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-300 flex-shrink-0 transition-colors"
                        aria-label={`Open ${ref.label}`}
                      >
                        <ExternalLink size={11} />
                      </a>
                    </div>
                    <p className="text-slate-400 text-xs leading-relaxed">{ref.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {getUpdatesForVisa(visa.id).length > 0 && (
            <div className="flex items-center gap-2 py-1">
              <span className="text-slate-500 text-xs">Law changes:</span>
              <LawUpdatesPill visaId={visa.id} />
            </div>
          )}

          <div className="flex items-center gap-3 pt-2">
            <Link to="/comparison" className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1">
              Full comparison <ArrowRight size={13} />
            </Link>
            <Link to="/documents" className="text-sm text-violet-400 hover:text-violet-300 flex items-center gap-1">
              Generate documents <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default function EligibilityPage() {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);
  const [results, setResults] = useState<EligibilityResult[] | null>(null);
  const [loading, setLoading] = useState(false);

  const update = (key: keyof UserProfile, value: string | number | boolean) => {
    setProfile((p) => ({ ...p, [key]: value }));
  };

  const runCheck = () => {
    setLoading(true);
    // Simulate async calculation
    setTimeout(() => {
      const res = calculateEligibility(profile);
      setResults(res);
      setLoading(false);
    }, 1200);
  };

  const reset = () => {
    setResults(null);
    setStep(1);
    setProfile(defaultProfile);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-16">
        <div className="text-center">
          <div className="w-20 h-20 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center mx-auto mb-6 animate-pulse">
            <Loader className="text-blue-400 animate-spin" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Analyzing your profile...</h2>
          <p className="text-slate-400">Calculating eligibility across 9 EU visa pathways</p>
        </div>
      </div>
    );
  }

  if (results) {
    const topThree = results.slice(0, 3);
    const rest = results.slice(3);

    return (
      <div className="min-h-screen pt-24 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles size={16} className="text-blue-400" />
                <span className="text-blue-400 text-sm font-medium">Your Results</span>
              </div>
              <h1 className="text-3xl font-bold text-white">Eligibility Report</h1>
              <p className="text-slate-400 mt-1">Based on your profile — {profile.nationality || 'Unknown'} national, {profile.education || 'Unknown education'}</p>
            </div>
            <button onClick={reset} className="btn-secondary text-sm py-2">
              Start Over
            </button>
          </div>

          {/* Disclaimer */}
          <div className="flex items-start gap-3 bg-amber-500/5 border border-amber-500/20 rounded-xl p-4 mb-8">
            <AlertTriangle size={15} className="text-amber-400 mt-0.5 flex-shrink-0" />
            <p className="text-slate-400 text-xs leading-relaxed">
              Probability estimates are indicative only and based on general criteria. Legal references are provided for educational purposes — they do not constitute legal advice. Immigration outcomes depend on many factors. Always consult a qualified immigration lawyer.
            </p>
          </div>

          {/* Summary banner */}
          {topThree.length > 0 && topThree[0].probability >= 50 && (
            <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-2xl p-6 mb-8">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp size={20} className="text-emerald-400" />
                <h2 className="text-white font-semibold text-lg">Good news! You have strong options.</h2>
              </div>
              <p className="text-slate-300 text-sm">
                Your best match is <strong className="text-white">{topThree[0].visa.name}</strong> with a <strong className="text-emerald-400">{topThree[0].probability}%</strong> estimated probability.
              </p>
            </div>
          )}

          {/* Top 3 */}
          <h2 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
            <Shield size={16} className="text-blue-400" /> Top Recommendations
          </h2>
          <div className="space-y-4 mb-10">
            {topThree.map((result, i) => (
              <ResultCard key={result.visa.id} result={result} rank={i} />
            ))}
          </div>

          {/* Other options */}
          {rest.length > 0 && (
            <>
              <h2 className="text-slate-400 font-semibold text-sm uppercase tracking-wider mb-4">Other Pathways (Lower Probability)</h2>
              <div className="space-y-4">
                {rest.map((result, i) => (
                  <ResultCard key={result.visa.id} result={result} rank={i + 3} />
                ))}
              </div>
            </>
          )}

          {/* Next steps */}
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: 'Generate Documents', path: '/documents', icon: '📄', desc: 'Create cover letters & templates' },
              { label: 'Compare Visas', path: '/comparison', icon: '⚖️', desc: 'Full side-by-side comparison' },
              { label: 'Estimate Costs', path: '/costs', icon: '💶', desc: 'Realistic budget breakdown' },
            ].map((item) => (
              <Link key={item.label} to={item.path} className="card-hover flex flex-col items-center text-center p-5">
                <span className="text-3xl mb-3">{item.icon}</span>
                <p className="text-white font-semibold text-sm mb-1">{item.label}</p>
                <p className="text-slate-400 text-xs">{item.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1.5 mb-6">
            <Sparkles size={13} className="text-blue-400" />
            <span className="text-blue-300 text-sm font-medium">Free · No account needed</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">Check Your Eligibility</h1>
          <p className="text-slate-400">Answer a few questions to see your best EU visa pathways with success probability estimates.</p>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-10">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center gap-2 flex-1">
              <div className={clsx(
                'flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold transition-all flex-shrink-0',
                step > s.id ? 'bg-blue-600 text-white' :
                step === s.id ? 'bg-blue-600 text-white ring-4 ring-blue-600/20' :
                'bg-slate-800 text-slate-400 border border-slate-700'
              )}>
                {step > s.id ? <CheckCircle size={14} /> : s.id}
              </div>
              {i < STEPS.length - 1 && (
                <div className={clsx('flex-1 h-px transition-colors', step > s.id ? 'bg-blue-600' : 'bg-slate-700')} />
              )}
            </div>
          ))}
        </div>
        <p className="text-center text-white font-semibold mb-1">{STEPS[step - 1].title}</p>
        <p className="text-center text-slate-400 text-sm mb-8">{STEPS[step - 1].desc}</p>

        {/* Step content */}
        <div className="card">
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <label className="label">Your Nationality *</label>
                <select className="select" value={profile.nationality} onChange={e => update('nationality', e.target.value)}>
                  <option value="">Select your country</option>
                  {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Current Location</label>
                <select className="select" value={profile.currentLocation} onChange={e => update('currentLocation', e.target.value)}>
                  <option value="">Where are you currently?</option>
                  <option value="home-country">My home country</option>
                  <option value="eu-legal">In EU (legal status)</option>
                  <option value="eu-student">In EU (student visa)</option>
                  <option value="eu-expired">In EU (expired/overstayed)</option>
                  <option value="uk">United Kingdom</option>
                  <option value="usa">United States</option>
                  <option value="canada">Canada</option>
                  <option value="other">Other country</option>
                </select>
                {profile.currentLocation === 'eu-expired' && (
                  <div className="flex items-start gap-2 mt-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <AlertTriangle size={14} className="text-red-400 mt-0.5 flex-shrink-0" />
                    <p className="text-red-300 text-xs">Warning: Applying while overstaying is a critical risk. See our <Link to="/risks" className="underline">Risk Analyzer</Link> before proceeding.</p>
                  </div>
                )}
              </div>
              <div>
                <label className="label">Family Size (including yourself)</label>
                <input
                  type="number"
                  className="input"
                  min={1}
                  max={10}
                  value={profile.familySize}
                  onChange={e => update('familySize', parseInt(e.target.value))}
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <div>
                <label className="label">Highest Education Level *</label>
                <select className="select" value={profile.education} onChange={e => update('education', e.target.value)}>
                  <option value="">Select education level</option>
                  {EDUCATION_LEVELS.map(e => <option key={e} value={e}>{e}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Field of Study / Work *</label>
                <select className="select" value={profile.field} onChange={e => update('field', e.target.value)}>
                  <option value="">Select your field</option>
                  {RESEARCH_FIELDS.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>
              <div>
                <label className="label">German Language Level</label>
                <select className="select" value={profile.languageLevel} onChange={e => update('languageLevel', e.target.value)}>
                  <option value="None">None / A1</option>
                  <option value="A2">A2 - Basic</option>
                  <option value="B1">B1 - Intermediate</option>
                  <option value="B2">B2 - Upper Intermediate</option>
                  <option value="C1">C1 - Advanced</option>
                  <option value="C2">C2 - Mastery</option>
                </select>
                <p className="text-slate-500 text-xs mt-1">Relevant for Germany pathways</p>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              <div>
                <label className="label">Years of Work Experience</label>
                <input
                  type="number"
                  className="input"
                  min={0}
                  max={40}
                  placeholder="0"
                  value={profile.workExperience || ''}
                  onChange={e => update('workExperience', parseInt(e.target.value) || 0)}
                />
              </div>
              <div>
                <label className="label">Monthly Income / Budget (€)</label>
                <input
                  type="number"
                  className="input"
                  min={0}
                  placeholder="e.g. 2000"
                  value={profile.monthlyIncome || ''}
                  onChange={e => update('monthlyIncome', parseInt(e.target.value) || 0)}
                />
                <p className="text-slate-500 text-xs mt-1">Include salary, savings you can show, or family support</p>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-5">
              <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium text-sm">I have a job offer from a European employer</p>
                    <p className="text-slate-400 text-xs mt-0.5">Required for Blue Card, HSM, and some work permits</p>
                  </div>
                  <button
                    onClick={() => update('hasJobOffer', !profile.hasJobOffer)}
                    className={clsx(
                      'relative w-12 h-6 rounded-full transition-colors flex-shrink-0',
                      profile.hasJobOffer ? 'bg-blue-600' : 'bg-slate-600'
                    )}
                  >
                    <div className={clsx(
                      'absolute top-1 w-4 h-4 bg-white rounded-full transition-transform shadow-sm',
                      profile.hasJobOffer ? 'translate-x-7' : 'translate-x-1'
                    )} />
                  </button>
                </div>
              </div>

              <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium text-sm">I have a university / research institution offer</p>
                    <p className="text-slate-400 text-xs mt-0.5">Required for researcher visas and student visas</p>
                  </div>
                  <button
                    onClick={() => update('hasUniversityOffer', !profile.hasUniversityOffer)}
                    className={clsx(
                      'relative w-12 h-6 rounded-full transition-colors flex-shrink-0',
                      profile.hasUniversityOffer ? 'bg-blue-600' : 'bg-slate-600'
                    )}
                  >
                    <div className={clsx(
                      'absolute top-1 w-4 h-4 bg-white rounded-full transition-transform shadow-sm',
                      profile.hasUniversityOffer ? 'translate-x-7' : 'translate-x-1'
                    )} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6">
          <button
            onClick={() => setStep(s => Math.max(1, s - 1))}
            disabled={step === 1}
            className="flex items-center gap-2 btn-secondary disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ArrowLeft size={16} /> Back
          </button>

          {step < 4 ? (
            <button
              onClick={() => setStep(s => Math.min(4, s + 1))}
              disabled={step === 1 && !profile.nationality}
              className="flex items-center gap-2 btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Continue <ArrowRight size={16} />
            </button>
          ) : (
            <button
              onClick={runCheck}
              disabled={!profile.nationality || !profile.education}
              className="flex items-center gap-2 btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Sparkles size={16} /> Check Eligibility
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
