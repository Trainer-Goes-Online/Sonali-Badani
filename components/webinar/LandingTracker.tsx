'use client';

import { useEffect } from 'react';
import { TRACKING_FIELDS, FUNNEL_STORAGE_KEY, type FunnelLeadData } from '@/lib/tracking';
import { trackViewContent } from '@/lib/events';
import { flushRegistrationRetries } from '@/lib/registration';

/**
 * Landing-page side effects, all invisible.
 *
 * 1. Caches the ad tracking params (UTMs, fbclid, lead fields) from the URL into
 *    localStorage so they survive the TagMango checkout hop, which strips custom
 *    query params.
 * 2. Fires Meta `ViewContent` after a 3 second dwell, per the spec's event table.
 * 3. Retries any registration webhook POST that failed on an earlier visit.
 */
export default function LandingTracker() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const entries = TRACKING_FIELDS.map((field) => [field, params.get(field)] as const);

    // Skip visits that carried no tracking params at all, so a direct or organic
    // load never overwrites a lead captured from an earlier ad click.
    if (entries.some(([, value]) => value !== null)) {
      const incoming = Object.fromEntries(
        entries.map(([field, value]) => [field, value ?? ''])
      ) as FunnelLeadData;

      try {
        // Merge rather than replace: a returning visitor keeps the details she
        // already entered, while the fresh campaign params still win.
        const raw = localStorage.getItem(FUNNEL_STORAGE_KEY);
        const existing = raw ? (JSON.parse(raw) as Record<string, string>) : {};
        const merged: Record<string, string> = { ...existing };
        for (const [field, value] of Object.entries(incoming)) {
          if (value) merged[field] = value;
          else if (!(field in merged)) merged[field] = '';
        }
        localStorage.setItem(FUNNEL_STORAGE_KEY, JSON.stringify(merged));
      } catch {
        /* private mode: tracking degrades, the funnel still works */
      }
    }

    const dwell = window.setTimeout(trackViewContent, 3000);
    void flushRegistrationRetries();

    return () => window.clearTimeout(dwell);
  }, []);

  return null;
}
