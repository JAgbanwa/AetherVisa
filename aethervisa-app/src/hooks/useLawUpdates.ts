import { useState, useEffect, useCallback } from 'react';
import { LAW_UPDATES, getRecentUpdates, hasStaleData, GLOBAL_VERIFIED_AT } from '../data/lawUpdates';
import type { LawUpdate } from '../types';

const SEEN_KEY = 'aethervisa_seen_updates';
const DISMISSED_BANNER_KEY = 'aethervisa_banner_dismissed_at';
/** Re-show the banner after this many ms even if previously dismissed */
const REDISMISS_AFTER_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

function loadSeen(): Set<string> {
  try {
    const raw = localStorage.getItem(SEEN_KEY);
    return new Set(raw ? (JSON.parse(raw) as string[]) : []);
  } catch {
    return new Set();
  }
}

function saveSeen(seen: Set<string>) {
  try {
    localStorage.setItem(SEEN_KEY, JSON.stringify([...seen]));
  } catch {
    // storage unavailable
  }
}

export function useLawUpdates() {
  const [seen, setSeen] = useState<Set<string>>(loadSeen);
  const [bannerDismissed, setBannerDismissed] = useState(() => {
    try {
      const ts = localStorage.getItem(DISMISSED_BANNER_KEY);
      if (!ts) return false;
      return Date.now() - Number(ts) < REDISMISS_AFTER_MS;
    } catch {
      return false;
    }
  });

  // All updates sorted newest first
  const allUpdates: LawUpdate[] = LAW_UPDATES;

  // Updates from last 6 months
  const recentUpdates = getRecentUpdates(180);

  // Unseen recent updates
  const unseenUpdates = recentUpdates.filter(u => !seen.has(u.id));

  const staleData = hasStaleData();
  const globalVerifiedAt = GLOBAL_VERIFIED_AT;

  const markSeen = useCallback((ids: string | string[]) => {
    setSeen(prev => {
      const next = new Set(prev);
      (Array.isArray(ids) ? ids : [ids]).forEach(id => next.add(id));
      saveSeen(next);
      return next;
    });
  }, []);

  const markAllSeen = useCallback(() => {
    markSeen(allUpdates.map(u => u.id));
  }, [allUpdates, markSeen]);

  const dismissBanner = useCallback(() => {
    setBannerDismissed(true);
    try {
      localStorage.setItem(DISMISSED_BANNER_KEY, String(Date.now()));
    } catch {
      // storage unavailable
    }
  }, []);

  // Mark updates as seen when the banner is dismissed
  const dismissAndMarkSeen = useCallback(() => {
    dismissBanner();
    markAllSeen();
  }, [dismissBanner, markAllSeen]);

  // Auto-surface banner if new unseen updates arrived after a prior dismissal
  useEffect(() => {
    if (unseenUpdates.length > 0 && bannerDismissed) {
      try {
        const ts = Number(localStorage.getItem(DISMISSED_BANNER_KEY) ?? '0');
        const newestUnseen = Math.max(
          ...unseenUpdates.map(u => new Date(u.effectiveDate).getTime()),
        );
        // Re-open banner if a new update arrived after the last dismissal
        if (newestUnseen > ts) {
          setBannerDismissed(false);
          localStorage.removeItem(DISMISSED_BANNER_KEY);
        }
      } catch {
        // ignore
      }
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const showBanner = !bannerDismissed && (unseenUpdates.length > 0 || staleData);

  return {
    allUpdates,
    recentUpdates,
    unseenUpdates,
    unseenCount: unseenUpdates.length,
    showBanner,
    staleData,
    globalVerifiedAt,
    markSeen,
    markAllSeen,
    dismissBanner,
    dismissAndMarkSeen,
  };
}
