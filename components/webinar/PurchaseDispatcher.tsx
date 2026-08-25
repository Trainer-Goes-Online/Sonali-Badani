'use client';

import { useEffect, useRef } from 'react';
import { dispatchPurchase } from '@/lib/purchase';

/**
 * Invisible. Mounted once on /welcome-reset and /welcome-reset-plus, it fires
 * Meta `Purchase` + `sales` through the Conversions API and posts the full row
 * to the purchase webhook. See lib/purchase.ts for why this runs in the browser
 * and what guards it.
 *
 * The ref guard covers React Strict Mode's deliberate double mount in
 * development; the localStorage claim inside dispatchPurchase covers everything
 * else, including a reload and a second tab.
 */
export default function PurchaseDispatcher({ amount }: { amount: number }) {
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    void dispatchPurchase(amount);
  }, [amount]);

  return null;
}
