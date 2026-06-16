'use client';

import { useEffect, useRef } from 'react';
import { FUNNEL_STORAGE_KEY, type FunnelLeadData } from '@/lib/tracking';
import { buildHashedFields } from '@/lib/meta-capi';

/** Treat an unresolved merge tag (e.g. literal "{{email}}") as empty. */
const cleanParam = (value: string | null) =>
  value && !/^\{\{.*\}\}$/.test(value) ? value : '';

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
    const orderId = cleanParam(params.get('order_id'));
    const paymentId = cleanParam(params.get('razorpay_payment_id'));

    const restoreForRetry = () => {
      hasFired.current = false;
      localStorage.setItem(FUNNEL_STORAGE_KEY, raw);
    };

    (async () => {
      try {
        // Contact details were captured on the OTO page and already live in
        // `lead` (raw, for nurturing/manual use). Add the SHA-256 versions of
        // Meta's hashed parameters and the transaction ids from the redirect.
        const hashed = await buildHashedFields(lead as Record<string, string>);
        const payload = {
          ...lead,
          ...hashed,
          order_id: orderId,
          razorpay_payment_id: paymentId,
        };

        const res = await fetch(PABBLY_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          keepalive: true,
        });
        // Clean up only on a successful response; otherwise keep it for a retry.
        if (!res.ok) restoreForRetry();
      } catch {
        restoreForRetry();
      }
    })();
  }, []);

  return null;
}
