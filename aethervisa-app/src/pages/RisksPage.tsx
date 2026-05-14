import { useState } from 'react';
import { RED_FLAGS } from '../data';
import { AlertTriangle, XCircle, Info, ChevronDown, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';

const SEVERITY_CONFIG = {
  critical: {
    label: 'Critical',
    icon: XCircle,
    headerColor: 'bg-red-500/10 border-red-500/30 text-red-400',
    badgeColor: 'bg-red-500/10 text-red-400 border-red-500/20',
    dotColor: 'bg-red-500',
    iconColor: 'text-red-400',
  },
  warning: {
    label: 'Warning',
    icon: AlertTriangle,
    headerColor: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
    badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    dotColor: 'bg-amber-500',
    iconColor: 'text-amber-400',
  },
  info: {
    label: 'Info',
    icon: Info,
    headerColor: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
    badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    dotColor: 'bg-blue-500',
    iconColor: 'text-blue-400',
  },
};

const SITUATION_QUESTIONS = [
  {
    id: 'overstaying',
    question: 'Are you currently in an EU country without valid status (overstaying)?',
    flagId: 'undocumented-status',
  },
  {
    id: 'recent-rejection',
    question: 'Have you had a visa rejected in the past 2 years?',
    flagId: null,
    warning: 'A recent rejection must always be declared. Not declaring it is fraud. Address the reason and get legal advice before reapplying.',
  },
  {
    id: 'multiple-countries',
    question: 'Are you planning to visit multiple Schengen countries equally?',
    flagId: 'wrong-country-application',
  },
  {
    id: 'bank-deposits',
    question: 'Have you made large, unexplained deposits to your bank account recently?',
    flagId: 'financial-proof',
  },
  {
    id: 'gaps',
    question: 'Do you have gaps of 6+ months in your employment or education history?',
    flagId: 'gaps-in-history',
  },
];

export default function RisksPage() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, boolean | null>>({});
  const [filter, setFilter] = useState<'all' | 'critical' | 'warning' | 'info'>('all');

  const filtered = RED_FLAGS.filter(f => filter === 'all' || f.severity === filter);

  const triggeredFlags = SITUATION_QUESTIONS
    .filter(q => answers[q.id] === true && q.flagId)
    .map(q => q.flagId)
    .filter(Boolean);

  const triggeredWarnings = SITUATION_QUESTIONS
    .filter(q => answers[q.id] === true && q.warning)
    .map(q => q.warning)
    .filter(Boolean);

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-white mb-3">Risk & Red Flag Analyzer</h1>
          <p className="text-slate-400 text-lg max-w-2xl">
            Learn about common immigration mistakes before you make them. These are real scenarios that lead to rejections, bans, and deportations.
          </p>
        </div>

        {/* Quick situational check */}
        <div className="card mb-10">
          <h2 className="text-white font-semibold mb-2 flex items-center gap-2">
            <Shield size={16} className="text-blue-400" /> Quick Situation Check
          </h2>
          <p className="text-slate-400 text-sm mb-5">Answer these questions to identify risks specific to your situation.</p>

          <div className="space-y-4">
            {SITUATION_QUESTIONS.map(q => (
              <div key={q.id} className="bg-slate-900/50 rounded-xl border border-slate-700 p-4">
                <p className="text-slate-200 text-sm mb-3">{q.question}</p>
                <div className="flex gap-3">
                  {[true, false].map(val => (
                    <button
                      key={String(val)}
                      onClick={() => setAnswers(a => ({ ...a, [q.id]: val }))}
                      className={clsx(
                        'px-4 py-1.5 rounded-lg text-sm border transition-all',
                        answers[q.id] === val
                          ? val
                            ? 'bg-red-500/10 border-red-500/30 text-red-400'
                            : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                          : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'
                      )}
                    >
                      {val ? 'Yes' : 'No'}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {(triggeredFlags.length > 0 || triggeredWarnings.length > 0) && (
            <div className="mt-5 p-4 bg-red-500/5 border border-red-500/20 rounded-xl">
              <p className="text-red-400 font-semibold text-sm mb-2 flex items-center gap-2">
                <AlertTriangle size={14} /> Risks Identified
              </p>
              {triggeredWarnings.map((w, i) => (
                <p key={i} className="text-amber-300 text-sm mb-2">• {w}</p>
              ))}
              {triggeredFlags.length > 0 && (
                <p className="text-red-300 text-sm">
                  {triggeredFlags.length} critical risk{triggeredFlags.length > 1 ? 's' : ''} flagged below. Read the detailed sections carefully.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {(['all', 'critical', 'warning', 'info'] as const).map(f => {
            const count = f === 'all' ? RED_FLAGS.length : RED_FLAGS.filter(rf => rf.severity === f).length;
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={clsx(
                  'px-4 py-2 rounded-xl text-sm font-medium border transition-all capitalize',
                  filter === f
                    ? f === 'critical' ? 'bg-red-600 border-red-600 text-white'
                    : f === 'warning' ? 'bg-amber-500 border-amber-500 text-white'
                    : f === 'info' ? 'bg-blue-600 border-blue-600 text-white'
                    : 'bg-slate-700 border-slate-700 text-white'
                    : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-600'
                )}
              >
                {f === 'all' ? `All (${count})` : `${f.charAt(0).toUpperCase() + f.slice(1)} (${count})`}
              </button>
            );
          })}
        </div>

        {/* Red flags */}
        <div className="space-y-4">
          {filtered.map(flag => {
            const config = SEVERITY_CONFIG[flag.severity];
            const Icon = config.icon;
            const isExpanded = expanded === flag.id;
            const isTriggered = triggeredFlags.includes(flag.id);

            return (
              <div
                key={flag.id}
                className={clsx(
                  'border rounded-2xl overflow-hidden transition-all',
                  isTriggered ? 'border-red-500/40 bg-red-500/5' : 'border-slate-700 bg-slate-800/30'
                )}
              >
                <button
                  onClick={() => setExpanded(isExpanded ? null : flag.id)}
                  className="w-full flex items-center justify-between gap-4 p-5 text-left"
                >
                  <div className="flex items-start gap-3">
                    <div className={clsx('w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0', config.headerColor.split(' ')[0])}>
                      <Icon size={16} className={config.iconColor} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <h3 className="text-white font-semibold">{flag.title}</h3>
                        {isTriggered && (
                          <span className="badge bg-red-500/10 text-red-400 border border-red-500/20 text-xs">Your risk</span>
                        )}
                      </div>
                      <span className={clsx('badge border', config.badgeColor)}>
                        {config.label}
                      </span>
                    </div>
                  </div>
                  <ChevronDown
                    size={18}
                    className={clsx('text-slate-400 flex-shrink-0 transition-transform', isExpanded && 'rotate-180')}
                  />
                </button>

                {isExpanded && (
                  <div className="px-5 pb-5 border-t border-slate-700/50">
                    <p className="text-slate-300 text-sm leading-relaxed mt-4 mb-4">{flag.description}</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-red-500/5 border border-red-500/15 rounded-xl p-4">
                        <p className="text-red-400 text-xs font-semibold uppercase tracking-wider mb-2">Consequences</p>
                        {flag.consequences.map((c, i) => (
                          <div key={i} className="flex items-start gap-2 mb-1.5">
                            <XCircle size={12} className="text-red-400 mt-0.5 flex-shrink-0" />
                            <span className="text-slate-300 text-sm">{c}</span>
                          </div>
                        ))}
                      </div>

                      <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-xl p-4">
                        <p className="text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-2">How to Avoid</p>
                        <p className="text-slate-300 text-sm leading-relaxed">{flag.howToAvoid}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Legal advice callout */}
        <div className="mt-10 card bg-gradient-to-r from-blue-500/5 to-violet-500/5 border-blue-500/20">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0">
              <Shield size={18} className="text-blue-400" />
            </div>
            <div>
              <h3 className="text-white font-semibold mb-1">Consider Legal Advice</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-3">
                If you have any red flags in your situation — past rejections, overstays, expired status — investing €100–€300 in a consultation with an immigration lawyer can save you from a multi-year ban.
              </p>
              <Link to="/costs" className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors">
                See cost estimates including legal help →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
