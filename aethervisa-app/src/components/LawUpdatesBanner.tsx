import { Link } from 'react-router-dom';
import { Bell, X, AlertTriangle, Info, ArrowRight } from 'lucide-react';
import { useLawUpdates } from '../hooks/useLawUpdates';
import type { LawChangeSeverity } from '../types';
import clsx from 'clsx';

function severityStyles(severity: LawChangeSeverity) {
  switch (severity) {
    case 'critical':
      return {
        bar: 'bg-red-950/80 border-red-700/60',
        icon: 'text-red-400',
        badge: 'bg-red-500/20 text-red-300 border border-red-500/30',
        dot: 'bg-red-400',
      };
    case 'important':
      return {
        bar: 'bg-amber-950/80 border-amber-700/40',
        icon: 'text-amber-400',
        badge: 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
        dot: 'bg-amber-400',
      };
    default:
      return {
        bar: 'bg-blue-950/80 border-blue-700/30',
        icon: 'text-blue-400',
        badge: 'bg-blue-500/20 text-blue-300 border border-blue-500/30',
        dot: 'bg-blue-400',
      };
  }
}

export default function LawUpdatesBanner() {
  const { showBanner, unseenUpdates, staleData, dismissAndMarkSeen, globalVerifiedAt } =
    useLawUpdates();

  if (!showBanner) return null;

  // Show the highest-severity unseen update as the lead message
  const lead =
    unseenUpdates.find(u => u.severity === 'critical') ??
    unseenUpdates.find(u => u.severity === 'important') ??
    unseenUpdates[0];

  const isStaleBannerOnly = !lead && staleData;
  const styles = lead
    ? severityStyles(lead.severity)
    : {
        bar: 'bg-slate-800/90 border-slate-700/60',
        icon: 'text-slate-400',
        badge: 'bg-slate-700 text-slate-300 border border-slate-600',
        dot: 'bg-slate-400',
      };

  const Icon = lead?.severity === 'critical' || lead?.severity === 'important'
    ? AlertTriangle
    : Info;

  return (
    <div
      className={clsx(
        'w-full border-b z-40 backdrop-blur-md',
        styles.bar,
      )}
      role="alert"
      aria-live="polite"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center gap-3">
        {/* Dot + icon */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <span className={clsx('w-2 h-2 rounded-full animate-pulse', styles.dot)} />
          <Icon size={14} className={styles.icon} />
        </div>

        {/* Message */}
        <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
          {isStaleBannerOnly ? (
            <p className="text-slate-300 text-xs leading-snug">
              Some immigration data may be outdated (last verified{' '}
              <span className="font-semibold">{globalVerifiedAt}</span>). Check the
              updates page for the latest information.
            </p>
          ) : (
            <>
              <p className="text-sm font-medium text-white leading-snug truncate">
                {lead!.flag} {lead!.title}
              </p>
              {unseenUpdates.length > 1 && (
                <span className={clsx('text-xs px-2 py-0.5 rounded-full flex-shrink-0', styles.badge)}>
                  +{unseenUpdates.length - 1} more update{unseenUpdates.length > 2 ? 's' : ''}
                </span>
              )}
            </>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <Link
            to="/law-updates"
            onClick={dismissAndMarkSeen}
            className="hidden sm:flex items-center gap-1 text-xs font-semibold text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-colors"
          >
            View all <ArrowRight size={12} />
          </Link>
          <button
            onClick={dismissAndMarkSeen}
            className="text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
            aria-label="Dismiss"
          >
            <X size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}

/** Small badge to show in the navbar — unseen count indicator */
export function LawUpdatesBadge() {
  const { unseenCount } = useLawUpdates();
  if (unseenCount === 0) return null;
  return (
    <span className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold leading-none">
      {unseenCount > 9 ? '9+' : unseenCount}
    </span>
  );
}

/** Inline pill used on the eligibility result cards */
export function LawUpdatesPill({ visaId }: { visaId: string }) {
  const { allUpdates, globalVerifiedAt } = useLawUpdates();
  const count = allUpdates.filter(u => u.affectedVisaIds.includes(visaId)).length;
  const hasRecent = allUpdates
    .filter(u => u.affectedVisaIds.includes(visaId))
    .some(u => {
      const days = (Date.now() - new Date(u.effectiveDate).getTime()) / (1000 * 60 * 60 * 24);
      return days < 180;
    });

  return (
    <Link
      to="/law-updates"
      className={clsx(
        'inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full transition-colors',
        hasRecent
          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20'
          : 'bg-slate-700/60 text-slate-400 hover:bg-slate-700',
      )}
      title={`Last verified: ${globalVerifiedAt}`}
    >
      <Bell size={9} />
      {count > 0 ? `${count} law update${count > 1 ? 's' : ''}` : 'Verified ' + globalVerifiedAt}
    </Link>
  );
}
