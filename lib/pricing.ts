/**
 * Funnel pricing — the single knob for the two prices.
 *
 * Change them in the environment and every label, the order bump, and the
 * server-side Razorpay amount follow automatically:
 *   NEXT_PUBLIC_COURSE_PRICE         The One Partner Reset price, in rupees.
 *   NEXT_PUBLIC_VISUALIZATION_PRICE  The Love Legacy Visualization add-on, in rupees.
 *
 * These are NEXT_PUBLIC_ (read on both client and server) and inlined at build
 * time, so a change takes effect on the next build/deploy. The defaults below
 * are the current live prices, so the funnel stays correct even if the env vars
 * are unset.
 */
function priceFromEnv(value: string | undefined, fallback: number): number {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

/** The One Partner Reset course price, in rupees. */
export const COURSE_PRICE_RUPEES = priceFromEnv(process.env.NEXT_PUBLIC_COURSE_PRICE, 499);

/** The Love Legacy Visualization add-on price, in rupees. */
export const VISUALIZATION_PRICE_RUPEES = priceFromEnv(
  process.env.NEXT_PUBLIC_VISUALIZATION_PRICE,
  199
);

/** Display labels, e.g. "₹499" / "₹199". */
export const COURSE_PRICE_LABEL = `₹${COURSE_PRICE_RUPEES}`;
export const VISUALIZATION_PRICE_LABEL = `₹${VISUALIZATION_PRICE_RUPEES}`;
