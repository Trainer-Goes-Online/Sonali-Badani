/**
 * Coupon codes. Validation is shared so the client can preview the discount,
 * but the order API re-applies it server-side as the source of truth.
 */
export type Coupon = {
  code: string;
  type: 'percent' | 'flat';
  value: number; // percent (0-100) or flat rupees
  label: string;
};

const COUPONS: Record<string, Coupon> = {
  TGOTEST2025: { code: 'TGOTEST2025', type: 'percent', value: 100, label: '100% off' },
};

export function findCoupon(code?: string | null): Coupon | null {
  if (!code) return null;
  return COUPONS[code.trim().toUpperCase()] ?? null;
}

/** Returns the discounted amount in paise (never below 0). */
export function applyCoupon(subtotalPaise: number, coupon: Coupon | null): number {
  if (!coupon) return subtotalPaise;
  if (coupon.type === 'percent') {
    return Math.max(0, Math.round(subtotalPaise * (1 - coupon.value / 100)));
  }
  return Math.max(0, subtotalPaise - coupon.value * 100);
}
