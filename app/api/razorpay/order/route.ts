import { NextResponse } from 'next/server';
import { getRazorpay } from '@/lib/razorpay';
import { CHECKOUT_CONFIG, totalPaise } from '@/lib/checkout-config';
import { findCoupon, applyCoupon } from '@/lib/coupons';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Creates a Razorpay order. The amount is computed server-side from config
 * (base ₹497 + optional ₹199 bump, then any valid coupon) and never trusted
 * from the client. If a coupon brings the total to zero (e.g. a 100%-off test
 * code), we skip Razorpay and return { free: true } so access can be granted.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const addBump = body?.addBump === true;
    const city = typeof body?.city === 'string' ? body.city.slice(0, 80) : '';

    const coupon = findCoupon(body?.coupon);
    const subtotal = totalPaise(addBump);
    const amount = applyCoupon(subtotal, coupon);

    // Razorpay's minimum order is ₹1 (100 paise). A fully-discounted order is free.
    if (amount < 100) {
      return NextResponse.json({ free: true, couponApplied: Boolean(coupon) });
    }

    const razorpay = getRazorpay();
    const order = await razorpay.orders.create({
      amount,
      currency: CHECKOUT_CONFIG.currency,
      receipt: `opr_${Date.now()}`,
      notes: {
        product: CHECKOUT_CONFIG.productName,
        bump: addBump ? CHECKOUT_CONFIG.bump.name : 'none',
        coupon: coupon ? coupon.code : 'none',
        city: city || 'n/a',
      },
    });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unable to create order';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
