/**
 * Single source of truth for the offer + checkout.
 * Razorpay works in paise (1 rupee = 100 paise). Amounts are computed
 * server-side from these values, never trusted from the client.
 * Prices come from lib/pricing.ts (driven by env), so change them there.
 */
import { COURSE_PRICE_RUPEES, VISUALIZATION_PRICE_RUPEES } from './pricing';

export const CHECKOUT_CONFIG = {
  productName: 'The One Partner Reset',
  brand: 'Sonali Badani',
  basePriceRupees: COURSE_PRICE_RUPEES,
  basePricePaise: COURSE_PRICE_RUPEES * 100,
  // Order bump shown on the checkout step only.
  bump: {
    name: 'The Love Legacy Visualization',
    priceRupees: VISUALIZATION_PRICE_RUPEES,
    pricePaise: VISUALIZATION_PRICE_RUPEES * 100,
  },
  currency: 'INR',
  /** Where the buyer lands after a successful, verified payment. */
  successPath: '/welcome',
} as const;

export function totalPaise(addBump: boolean) {
  return CHECKOUT_CONFIG.basePricePaise + (addBump ? CHECKOUT_CONFIG.bump.pricePaise : 0);
}

export function totalRupees(addBump: boolean) {
  return CHECKOUT_CONFIG.basePriceRupees + (addBump ? CHECKOUT_CONFIG.bump.priceRupees : 0);
}
