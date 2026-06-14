'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion, useAnimationControls } from 'framer-motion';
import { isValidPhoneNumber } from 'libphonenumber-js';
import PhoneField from './PhoneField';
import { ShieldCheck, Lock, Check, Tag, Loader2 } from 'lucide-react';
import { CHECKOUT_CONFIG, totalPaise } from '@/lib/checkout-config';
import { findCoupon, applyCoupon, type Coupon } from '@/lib/coupons';
import { CHECKOUT } from '@/lib/content';
import { shake } from '@/lib/motion';

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
  }
}

type FieldErrors = {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  city?: string;
};

export default function CheckoutClient() {
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState<string | undefined>(undefined);
  const [city, setCity] = useState('');
  const [addBump, setAddBump] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});

  const [couponInput, setCouponInput] = useState('');
  const [coupon, setCoupon] = useState<Coupon | null>(null);
  const [couponMsg, setCouponMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const shakeControls = useAnimationControls();

  const subtotalPaise = totalPaise(addBump);
  const totalPaiseFinal = applyCoupon(subtotalPaise, coupon);
  const total = totalPaiseFinal / 100;
  const discount = (subtotalPaise - totalPaiseFinal) / 100;
  const isFree = totalPaiseFinal < 100;

  const clearError = (key: keyof FieldErrors) =>
    setErrors((e) => (e[key] ? { ...e, [key]: undefined } : e));

  const validate = useCallback((): FieldErrors => {
    const e: FieldErrors = {};
    if (!firstName.trim()) e.firstName = 'Please enter your first name.';
    if (!lastName.trim()) e.lastName = 'Please enter your last name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) e.email = 'Please enter a valid email address.';
    if (!phone || !isValidPhoneNumber(phone)) e.phone = 'Please enter a valid phone number.';
    if (!city.trim()) e.city = 'Please enter your town or city.';
    return e;
  }, [firstName, lastName, email, phone, city]);

  // Validate a single field when the user leaves it (on blur), so problems
  // surface early instead of only at submit.
  const validateField = useCallback(
    (key: keyof FieldErrors) => {
      const all = validate();
      setErrors((prev) => ({ ...prev, [key]: all[key] }));
    },
    [validate]
  );

  const applyCode = useCallback(() => {
    const c = findCoupon(couponInput);
    if (c) {
      setCoupon(c);
      setCouponMsg({ ok: true, text: `Coupon applied · ${c.label}` });
    } else {
      setCoupon(null);
      setCouponMsg({ ok: false, text: "That code isn't valid. Please check and try again." });
    }
  }, [couponInput]);

  const pay = useCallback(async () => {
    setError('');
    const fieldErrors = validate();
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      shakeControls.start(shake);
      const first = Object.keys(fieldErrors)[0];
      document.getElementById(`co-${first}`)?.focus();
      return;
    }
    setErrors({});
    if (loading) return;
    setLoading(true);
    try {
      const res = await fetch('/api/razorpay/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ addBump, city, coupon: coupon?.code ?? null }),
      });
      const order = await res.json();
      if (!res.ok) throw new Error(order.error || 'Could not start checkout');

      // Fully discounted (e.g. 100% off): skip payment, grant access.
      if (order.free) {
        router.push(CHECKOUT_CONFIG.successPath);
        return;
      }

      if (!order.orderId) throw new Error('Could not start checkout');
      if (!window.Razorpay) throw new Error('Payment is still loading. Please try again in a moment.');

      const rzp = new window.Razorpay({
        key: order.keyId,
        order_id: order.orderId,
        amount: order.amount,
        currency: order.currency,
        name: CHECKOUT_CONFIG.brand,
        description: CHECKOUT_CONFIG.productName + (addBump ? ' + Love Legacy Visualization' : ''),
        prefill: { name: `${firstName} ${lastName}`.trim(), email, contact: phone },
        notes: { city },
        theme: { color: '#203F5C' },
        handler: async (response: Record<string, string>) => {
          const verify = await fetch('/api/razorpay/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(response),
          });
          const result = await verify.json();
          if (result.verified) {
            router.push(CHECKOUT_CONFIG.successPath);
          } else {
            setError('We could not verify your payment. If money was deducted, please contact support.');
            setLoading(false);
          }
        },
        modal: { ondismiss: () => setLoading(false) },
      });
      rzp.open();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setLoading(false);
    }
  }, [firstName, lastName, email, phone, city, addBump, coupon, loading, router, validate, shakeControls]);

  const fieldBase =
    'w-full rounded-xl border bg-white px-4 py-3 font-body text-[15px] text-navy outline-none transition-colors placeholder:text-navy/40';
  const cls = (err?: string) =>
    `${fieldBase} ${err ? 'border-coral focus:border-coral-dark' : 'border-navy/15 focus:border-navy'}`;
  const labelCls = 'mb-1.5 block font-body text-[13px] font-semibold text-navy/70';
  const errLine = (id: string, msg?: string) => (
    <AnimatePresence initial={false}>
      {msg && (
        <motion.p
          id={`${id}-error`}
          role="alert"
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.2 }}
          className="mt-1.5 font-body text-[13px] text-coral-dark"
        >
          {msg}
        </motion.p>
      )}
    </AnimatePresence>
  );

  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      {/* Left — details + order bump */}
      <div className="space-y-6">
        <div className="rounded-2xl border border-navy/10 bg-white p-6 shadow-soft sm:p-7">
          <h2 className="font-serif text-[20px] text-navy">Your details</h2>
          <div className="mt-5 space-y-4">
            {/* First + last name */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="co-firstName" className={labelCls}>First name</label>
                <input id="co-firstName" className={cls(errors.firstName)} placeholder="First name" value={firstName} aria-invalid={!!errors.firstName} aria-describedby={errors.firstName ? 'co-firstName-error' : undefined} onChange={(e) => { setFirstName(e.target.value); clearError('firstName'); }} onBlur={() => validateField('firstName')} autoComplete="given-name" />
                {errLine('co-firstName', errors.firstName)}
              </div>
              <div>
                <label htmlFor="co-lastName" className={labelCls}>Last name</label>
                <input id="co-lastName" className={cls(errors.lastName)} placeholder="Last name" value={lastName} aria-invalid={!!errors.lastName} aria-describedby={errors.lastName ? 'co-lastName-error' : undefined} onChange={(e) => { setLastName(e.target.value); clearError('lastName'); }} onBlur={() => validateField('lastName')} autoComplete="family-name" />
                {errLine('co-lastName', errors.lastName)}
              </div>
            </div>

            <div>
              <label htmlFor="co-email" className={labelCls}>Email address</label>
              <input id="co-email" className={cls(errors.email)} placeholder="you@example.com" type="email" value={email} aria-invalid={!!errors.email} aria-describedby={errors.email ? 'co-email-error' : undefined} onChange={(e) => { setEmail(e.target.value); clearError('email'); }} onBlur={() => validateField('email')} autoComplete="email" />
              {errLine('co-email', errors.email)}
            </div>

            {/* Phone with country code + flag (default India), searchable picker */}
            <div onBlur={() => validateField('phone')}>
              <label className={labelCls}>Phone number</label>
              <PhoneField
                error={!!errors.phone}
                onChange={(v) => { setPhone(v); clearError('phone'); }}
              />
              {errLine('co-phone', errors.phone)}
            </div>

            <div>
              <label htmlFor="co-city" className={labelCls}>Town / City</label>
              <input id="co-city" className={cls(errors.city)} placeholder="Town / City" value={city} aria-invalid={!!errors.city} aria-describedby={errors.city ? 'co-city-error' : undefined} onChange={(e) => { setCity(e.target.value); clearError('city'); }} onBlur={() => validateField('city')} autoComplete="address-level2" />
              {errLine('co-city', errors.city)}
            </div>
          </div>
        </div>

        {/* Order bump */}
        <button
          type="button"
          onClick={() => setAddBump((v) => !v)}
          className={`block w-full rounded-2xl border-2 border-dashed p-6 text-left transition-colors ${
            addBump ? 'border-coral bg-coral/[0.06]' : 'border-coral/50 bg-white'
          }`}
        >
          <p className="font-body text-[12px] font-bold uppercase tracking-[0.14em] text-coral-dark">
            {CHECKOUT.bumpHeading}
          </p>
          <p className="mt-3 font-body text-[14.5px] leading-relaxed text-navy/80">{CHECKOUT.bumpBody}</p>
          <div className="mt-4 flex items-start gap-3">
            <span
              className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-md border-2 ${
                addBump ? 'border-coral bg-coral text-white' : 'border-navy/30 bg-white'
              }`}
            >
              {addBump && <Check className="h-4 w-4" strokeWidth={3} />}
            </span>
            <span className="font-body text-[15px] font-semibold text-navy">{CHECKOUT.bumpCheckbox}</span>
          </div>
        </button>
      </div>

      {/* Right — order summary */}
      <div className="lg:sticky lg:top-24 lg:self-start">
        <div className="rounded-2xl border border-navy/10 bg-white p-6 shadow-card sm:p-7">
          <h2 className="font-serif text-[20px] text-navy">Order summary</h2>

          <div className="mt-5 space-y-3 border-b border-navy/10 pb-5">
            <div className="flex items-start justify-between gap-4">
              <span className="font-body text-[15px] text-navy/85">{CHECKOUT_CONFIG.productName}</span>
              <span className="shrink-0 font-body text-[15px] font-semibold text-navy">₹{CHECKOUT_CONFIG.basePriceRupees}</span>
            </div>
            {addBump && (
              <div className="flex items-start justify-between gap-4">
                <span className="font-body text-[15px] text-navy/85">{CHECKOUT_CONFIG.bump.name}</span>
                <span className="shrink-0 font-body text-[15px] font-semibold text-navy">₹{CHECKOUT_CONFIG.bump.priceRupees}</span>
              </div>
            )}
            {coupon && (
              <div className="flex items-start justify-between gap-4">
                <span className="font-body text-[15px] text-coral-dark">Coupon {coupon.code}</span>
                <span className="shrink-0 font-body text-[15px] font-semibold text-coral-dark">-₹{discount}</span>
              </div>
            )}
          </div>

          {/* Coupon input */}
          <div className="border-b border-navy/10 py-5">
            <label className="flex items-center gap-2 font-body text-[13px] font-semibold text-navy/70">
              <Tag className="h-4 w-4 text-coral-dark" /> Have a coupon code?
            </label>
            <div className="mt-2.5 flex gap-2">
              <input
                className={`${fieldBase} flex-1 border-navy/15 uppercase focus:border-navy`}
                placeholder="Enter code"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
              />
              <button type="button" onClick={applyCode} className="btn-ghost shrink-0 px-5 py-2.5 text-[14px]" style={{ animation: 'none' }}>
                Apply
              </button>
            </div>
            {couponMsg && (
              <p className={`mt-2 font-body text-[13px] ${couponMsg.ok ? 'text-coral-dark' : 'text-navy/60'}`}>
                {couponMsg.text}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between gap-4 py-5">
            <span className="font-body text-[16px] font-bold text-navy">Total</span>
            <span className="font-serif text-[28px] text-navy">{isFree ? 'Free' : `₹${total}`}</span>
          </div>

          <AnimatePresence initial={false}>
            {error && (
              <motion.p
                role="alert"
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: 'auto', marginBottom: 16 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                transition={{ duration: 0.22 }}
                className="overflow-hidden rounded-lg bg-coral/10 px-3 py-2 font-body text-[13px] text-coral-dark"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          <motion.div animate={shakeControls}>
            <button
              type="button"
              onClick={pay}
              disabled={loading}
              aria-busy={loading}
              className={`btn-primary w-full ${loading ? 'cursor-wait opacity-80' : ''}`}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 shrink-0 animate-spin" aria-hidden="true" />
                  Opening secure checkout…
                </>
              ) : isFree ? (
                'Get Instant Access (Free)'
              ) : (
                `Pay ₹${total} · Get Instant Access`
              )}
            </button>
          </motion.div>

          <ul className="mt-5 space-y-2.5">
            {CHECKOUT.reassurance.map((line, i) => (
              <li key={i} className="flex items-start gap-2.5 font-body text-[13px] leading-relaxed text-navy/70">
                {i === 0 ? (
                  <Lock className="mt-0.5 h-4 w-4 shrink-0 text-coral-dark" />
                ) : (
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-coral-dark" />
                )}
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
