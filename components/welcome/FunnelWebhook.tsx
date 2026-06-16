'use client';

import { useEffect, useRef } from 'react';
import { CHECKOUT_FIELDS, FUNNEL_STORAGE_KEY, type FunnelLeadData } from '@/lib/tracking';

const PABBLY_WEBHOOK_URL = process.env.NEXT_PUBLIC_PABBLY_WEBHOOK_URL;

/**
 * Invisible welcome-page dispatcher. After the TagMango redirect lands on
 * /welcome, it merges the cached lead data with the email + order_id appended by
 * TagMango, posts one unified payload to the Pabbly webhook, then clears the
 * cache. Renders nothing.
 */
export default function FunnelWebhook() {
  // Guards a second fire across re-renders (and StrictMode's dev double-mount,
  // backed by the synchronous localStorage claim below).
  const hasFired = useRef(false);

  useEffect(() => {
    if (hasFired.current || !PABBLY_WEBHOOK_URL) return;

    const raw = localStorage.getItem(FUNNEL_STORAGE_KEY);
    if (!raw) return;

    // Claim the cache synchronously so no concurrent mount can fire twice;
    // restored below only if the POST does not succeed.
    hasFired.current = true;
    localStorage.removeItem(FUNNEL_STORAGE_KEY);

    let lead: Partial<FunnelLeadData>;
    try {
      lead = JSON.parse(raw) as Partial<FunnelLeadData>;
    } catch {
      return; // corrupt cache already dropped; nothing to send
    }

    const params = new URLSearchParams(window.location.search);

    // Contact details are entered at the TagMango checkout, so the values it
    // appends to the redirect override anything cached on the landing page.
    // Only present params override, so a missing one never blanks the cache.
    const checkout = Object.fromEntries(
      CHECKOUT_FIELDS.map((field) => [field, params.get(field)] as const).filter(
        ([, value]) => value !== null
      )
    );

    // TagMango supplies a single full name; split it into the first/last fields
    // the payload expects (first token = first name, remainder = last name).
    const fullName = (params.get('name') ?? '').trim();
    const [firstName = '', ...lastNameParts] = fullName.split(/\s+/).filter(Boolean);
    const nameParts = fullName
      ? { first_name: firstName, last_name: lastNameParts.join(' ') }
      : {};

    const payload = {
      ...lead,
      ...checkout,
      ...nameParts,
      order_id: params.get('order_id') ?? '',
    };

    const restoreForRetry = () => {
      hasFired.current = false;
      localStorage.setItem(FUNNEL_STORAGE_KEY, raw);
    };

    fetch(PABBLY_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      keepalive: true,
    })
      .then((res) => {
        // Clean up only on a successful response; otherwise keep it for a retry.
        if (!res.ok) restoreForRetry();
      })
      .catch(restoreForRetry);
  }, []);

  return null;
}
