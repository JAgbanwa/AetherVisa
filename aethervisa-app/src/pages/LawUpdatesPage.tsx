import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, ExternalLink, AlertTriangle, Info, CheckCircle, RefreshCw, ArrowRight, Filter } from 'lucide-react';
import { THRESHOLDS, isStale } from '../data/lawUpdates';
import { useLawUpdates } from '../hooks/useLawUpdates';
import type { LawUpdate, LawChangeSeverity } from '../types';
import clsx from 'clsx';

const SEVERITY_CONFIG: Record<LawChangeSeverity, { label: string; icon: typeof AlertTriangle; card: string; badge: string; iconClass: string }> = {
  critical: {
    label: 'Critical',
    icon: AlertTriangle,
    card: 'border-red-600/30 bg-red-950/20',
    badge: 'bg-red-500/20 text-red-300 border border-red-500/30',
    iconClass: 'text-red-400',
  },
  important: {
    label: 'Important',
    icon: AlertTriangle,
    card: 'border-amber-600/30 bg-amber-950/10',
    badge: 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
    iconClass: 'text-amber-400',
  },
  minor: {
    label: 'Minor',
    icon: Info,
    card: 'border-slate-700',
    badge: 'bg-slate-700/60 text-slate-300 border border-slate-600',
    iconClass: 'text-blue-400',
  },
};

function UpdateCard({ update, isSeen, onMarkSeen }: { update: LawUpdate; isSeen: boolean; onMarkSeen: (id: string) => void }) {
  const cfg = SEVERITY_CONFIG[update.severity];
  const SevIcon = cfg.icon;

  const daysSince = Math.round((Date.now() - new Date(update.effectiveDate).getTime()) / (1000 * 60 * 60 * 24));
  const isNew = daysSince <= 60;

  return (
    <div className={clsx('rounded-xl border p-5 transition-all', cfg.card, !isSeen && 'ring-1 ring-offset-0 ring-white/5')}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          <SevIcon size={16} className={cfg.iconClass} />
        </div>
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="text-lg">{update.flag}</span>
            <span className={clsx('text-xs px-2 py-0.5 rounded-full font-medium', cfg.badge)}>
              {cfg.label}
            </span>
            {isNew && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-600/20 text-blue-300 border border-blue-600/30 font-medium">
                New
              </span>
            )}
            {!isSeen && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-white font-medium">
                Unread
              </span>
            )}
            <span className="text-slate-500 text-xs ml-auto flex-shrink-0">
              Effective {new Date(update.effectiveDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
          </div>

          <h3 className="text-white font-semibold text-sm mb-1 leading-snug">{update.title}</h3>
          <p className="text-slate-400 text-sm leading-relaxed mb-3">{update.summary}</p>

          {/* Before / After */}
          {update.what && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
              <div className="bg-red-950/30 border border-red-800/30 rounded-lg p-3">
                <p className="text-red-400 text-xs font-semibold uppercase tracking-wider mb-1">Before</p>
                <p className="text-slate-300 text-xs">{update.what.before}</p>
              </div>
              <div className="bg-emerald-950/30 border border-emerald-800/30 rounded-lg p-3">
                <p className="text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-1">After</p>
                <p className="text-slate-300 text-xs">{update.what.after}</p>
              </div>
            </div>
          )}

          {/* Action required */}
          {update.actionRequired && (
            <div className="flex items-start gap-2 bg-amber-500/5 border border-amber-500/20 rounded-lg p-3 mb-3">
              <AlertTriangle size={13} className="text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-amber-300 text-xs font-semibold mb-0.5">Action required</p>
                <p className="text-slate-300 text-xs leading-relaxed">{update.actionRequired}</p>
              </div>
            </div>
          )}

          {/* Affected visas + source */}
          <div className="flex flex-wrap items-center gap-3">
            {update.affectedVisaIds.length > 0 && (
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-slate-500 text-xs">Affects:</span>
                {update.affectedVisaIds.map(id => (
                  <Link
                    key={id}
                    to="/comparison"
                    className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-0.5 rounded-md transition-colors"
                  >
                    {id}
                  </Link>
                ))}
              </div>
            )}
            <a
              href={update.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition-colors flex-shrink-0"
            >
              {update.sourceLabel} <ExternalLink size={11} />
            </a>
          </div>

          {/* Mark seen */}
          {!isSeen && (
            <button
              onClick={() => onMarkSeen(update.id)}
              className="mt-3 text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
            >
              <CheckCircle size={12} /> Mark as read
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function LawUpdatesPage() {
  const { allUpdates, markSeen, markAllSeen, unseenCount, globalVerifiedAt } = useLawUpdates();
  const [filterCountry, setFilterCountry] = useState('All');
  const [filterSeverity, setFilterSeverity] = useState<'all' | LawChangeSeverity>('all');
  const seenIds = new Set(allUpdates.filter((_, i) => i >= 0).map(u => u.id).filter(
    id => {
      try {
        const stored = localStorage.getItem('aethervisa_seen_updates');
        const arr: string[] = stored ? JSON.parse(stored) : [];
        return arr.includes(id);
      } catch { return false; }
    }
  ));

  const countries = ['All', ...Array.from(new Set(allUpdates.map(u => u.country)))];

  const filtered = allUpdates.filter(u => {
    if (filterCountry !== 'All' && u.country !== filterCountry) return false;
    if (filterSeverity !== 'all' && u.severity !== filterSeverity) return false;
    return true;
  });

  const staleCount = THRESHOLDS.filter(t => isStale(t.verifiedAt)).length;

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-3">
            <Bell size={16} className="text-blue-400" />
            <span className="text-blue-400 text-sm font-medium">Immigration Law Tracker</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Law Updates</h1>
              <p className="text-slate-400">
                Tracked changes to EU and national immigration law. Data last verified:{' '}
                <span className={clsx('font-medium', isStale(globalVerifiedAt) ? 'text-amber-400' : 'text-emerald-400')}>
                  {new Date(globalVerifiedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {unseenCount > 0 && (
                <button
                  onClick={markAllSeen}
                  className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5"
                >
                  <CheckCircle size={12} /> Mark all read
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Stale data warning */}
        {staleCount > 0 && (
          <div className="flex items-start gap-3 bg-amber-500/5 border border-amber-500/20 rounded-xl p-4 mb-8">
            <AlertTriangle size={15} className="text-amber-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-amber-300 text-sm font-medium mb-1">
                {staleCount} threshold{staleCount > 1 ? 's' : ''} may need re-verification
              </p>
              <p className="text-slate-400 text-xs leading-relaxed">
                These values haven't been verified in over 90 days. They may still be accurate — verify
                against the source link before relying on them for an application.
              </p>
            </div>
          </div>
        )}

        {/* Summary stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            { label: 'Total tracked changes', value: allUpdates.length, color: 'text-white' },
            { label: 'Unread', value: unseenCount, color: unseenCount > 0 ? 'text-amber-400' : 'text-slate-400' },
            { label: 'Critical', value: allUpdates.filter(u => u.severity === 'critical').length, color: 'text-red-400' },
            { label: 'Current thresholds', value: THRESHOLDS.length, color: 'text-emerald-400' },
          ].map(s => (
            <div key={s.label} className="card text-center py-4">
              <p className={clsx('text-2xl font-bold mb-1', s.color)}>{s.value}</p>
              <p className="text-slate-400 text-xs">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <Filter size={14} className="text-slate-400" />
          <select
            value={filterCountry}
            onChange={e => setFilterCountry(e.target.value)}
            className="select text-sm py-1.5 w-auto"
          >
            {countries.map(c => <option key={c}>{c}</option>)}
          </select>
          <div className="flex gap-1">
            {(['all', 'critical', 'important', 'minor'] as const).map(s => (
              <button
                key={s}
                onClick={() => setFilterSeverity(s)}
                className={clsx(
                  'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors capitalize',
                  filterSeverity === s
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700',
                )}
              >
                {s === 'all' ? 'All' : s}
              </button>
            ))}
          </div>
          <span className="text-slate-500 text-xs ml-auto">{filtered.length} updates</span>
        </div>

        {/* Update cards */}
        <div className="space-y-4 mb-14">
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-slate-400">
              No updates match the current filters.
            </div>
          ) : (
            filtered.map(update => (
              <UpdateCard
                key={update.id}
                update={update}
                isSeen={seenIds.has(update.id)}
                onMarkSeen={markSeen}
              />
            ))
          )}
        </div>

        {/* Versioned thresholds table */}
        <div>
          <h2 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
            <RefreshCw size={16} className="text-blue-400" /> Current Salary &amp; Income Thresholds
          </h2>
          <p className="text-slate-400 text-sm mb-5">
            These are the operative numeric values used in the eligibility checker. Verified against official sources — last updated dates shown per entry.
          </p>
          <div className="overflow-x-auto rounded-xl border border-slate-700">
            <table className="w-full text-sm">
              <thead className="bg-slate-800/60">
                <tr>
                  {['Visa / Pathway', 'Threshold', 'Value', 'Effective', 'Verified', 'Source'].map(h => (
                    <th key={h} className="text-left text-xs text-slate-400 font-semibold px-4 py-3 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {THRESHOLDS.map(t => (
                  <tr key={t.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-3 text-slate-300">{t.country}</td>
                    <td className="px-4 py-3 text-white font-medium">{t.label}</td>
                    <td className="px-4 py-3">
                      <span className="text-emerald-400 font-bold">€{t.value.toLocaleString()}</span>
                      <span className="text-slate-500 text-xs ml-1">{t.unit}</span>
                    </td>
                    <td className="px-4 py-3 text-slate-400 text-xs whitespace-nowrap">
                      {new Date(t.effectiveDate).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-4 py-3 text-xs whitespace-nowrap">
                      <span className={clsx(isStale(t.verifiedAt) ? 'text-amber-400' : 'text-slate-400')}>
                        {new Date(t.verifiedAt).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}
                        {isStale(t.verifiedAt) && ' ⚠️'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <a
                        href={t.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 flex items-center gap-1 text-xs transition-colors"
                      >
                        {t.sourceLabel} <ExternalLink size={10} />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-10 flex flex-col sm:flex-row gap-3">
          <Link to="/eligibility" className="btn-primary flex items-center gap-2 justify-center">
            Re-run eligibility check <ArrowRight size={15} />
          </Link>
          <Link to="/comparison" className="btn-secondary flex items-center gap-2 justify-center">
            Compare visa pathways
          </Link>
        </div>

        <p className="text-slate-500 text-xs mt-8 leading-relaxed">
          Law updates are researched and maintained manually by the AetherVisa team. This page is informational only and does not constitute legal advice. Always verify against official government sources before making immigration decisions.
        </p>
      </div>
    </div>
  );
}
