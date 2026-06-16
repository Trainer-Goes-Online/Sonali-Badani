'use client';

import { useEffect } from 'react';
import { TRACKING_FIELDS, FUNNEL_STORAGE_KEY, type FunnelLeadData } from '@/lib/tracking';

/**
 * Invisible landing-page tracker. On mount it reads the custom tracking fields
 * from the URL query string and caches them in localStorage so they survive the
 * TagMango checkout (which drops custom params). Renders nothing.
 */
export default function FunnelTracker() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const entries = TRACKING_FIELDS.map((field) => [field, params.get(field)] as const);

    // Skip visits that carried no tracking params at all, so a direct/organic
    // load never overwrites a lead captured from an earlier ad click.
    if (!entries.some(([, value]) => value !== null)) return;

    const lead = Object.fromEntries(
      entries.map(([field, value]) => [field, value ?? ''])
    ) as FunnelLeadData;

    localStorage.setItem(FUNNEL_STORAGE_KEY, JSON.stringify(lead));
  }, []);

  return null;
}
