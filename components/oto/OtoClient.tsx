'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  Check,
  ArrowRight,
  Headphones,
  Lock,
  ShieldCheck,
  Sparkles,
  ChevronDown,
} from 'lucide-react';

import Reveal from '@/components/ui/Reveal';
import Sparkle from '@/components/ui/Sparkle';
import PhoneField from '@/components/checkout/PhoneField';
import { OTO } from '@/lib/content';
import { OTO_CONFIG, otoTotalRupees } from '@/lib/oto-config';
import { TRACKING_FIELDS, FUNNEL_STORAGE_KEY, splitName } from '@/lib/tracking';

type ContactErrors = { name?: string; email?: string; phone?: string; city?: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * The OTO decision in two columns on desktop:
 *   LEFT  : Main offer  ->  Your details (form)
 *   RIGHT : Companion add-on  ->  Summary + Pay   (sticky so Continue stays in view)
 * On smaller screens it stacks (offer, details, add-on, pay) and the add-on
 * collapses so the form stays within easy reach.
 *
 * The buyer enters their contact details here (TagMango does not return them in
 * its redirect); we cache them for the Welcome page and prefill the checkout.
 * Continue routes to one of two links depending on whether the add-on is kept.
 */
export default function OtoClient() {
  const [added, setAdded] = useState<boolean>(OTO_CONFIG.addonDefaultSelected);
  const [addonOpen, setAddonOpen] = useState(false); // expanded on desktop via lg:, collapsed on mobile
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [dialCode, setDialCode] = useState('+91'); // default India
  const [phoneNational, setPhoneNational] = useState('');
  const [city, setCity] = useState('');
  const [errors, setErrors] = useState<ContactErrors>({});

  const total = otoTotalRupees(added);
  const ctaLabel = added ? OTO.cta.withAddon : OTO.cta.productOnly;

  const clearError = (key: keyof ContactErrors) =>
    setErrors((e) => (e[key] ? { ...e, [key]: undefined } : e));

  const validate = (): ContactErrors => {
    const e: ContactErrors = {};
    if (!name.trim()) e.name = 'Please enter your name.';
    if (!EMAIL_RE.test(email.trim())) e.email = 'Please enter a valid email.';
    if (phoneNational.replace(/\D/g, '').length < 7) e.phone = 'Please enter your phone number.';
    if (!city.trim()) e.city = 'Please enter your city.';
    return e;
  };

  /** Merge the contact details into the cached lead so the Welcome page sends them. */
  const persistLead = () => {
    let existing: Record<string, string> = {};
    try {
      const raw = localStorage.getItem(FUNNEL_STORAGE_KEY);
      existing = raw ? (JSON.parse(raw) as Record<string, string>) : {};
    } catch {
      existing = {};
    }
    const base = Object.fromEntries(TRACKING_FIELDS.map((f) => [f, ''])) as Record<string, string>;
    const { first_name, last_name } = splitName(name);
    const merged = {
      ...base,
      ...existing,
      first_name,
      last_name,
      email: email.trim(),
      country_code: dialCode,
      phone: phoneNational.replace(/\D/g, ''),
      city: city.trim(),
    };
    localStorage.setItem(FUNNEL_STORAGE_KEY, JSON.stringify(merged));
  };

  /** Append the contact details to the TagMango link so the checkout is prefilled. */
  const buildCheckoutUrl = (base: string) => {
    const url = new URL(base);
    if (OTO_CONFIG.prefill.enabled) {
      const k = OTO_CONFIG.prefill.keys;
      url.searchParams.set(k.name, name.trim());
      url.searchParams.set(k.email, email.trim());
      url.searchParams.set(k.countryCode, dialCode);
      url.searchParams.set(k.phone, phoneNational.replace(/\D/g, ''));
      url.searchParams.set(k.city, city.trim());
    }
    return url.toString();
  };

  const handleContinue = () => {
    const found = validate();
    if (Object.keys(found).length > 0) {
      setErrors(found);
      document.getElementById('oto-form')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      document.getElementById(`oto-${Object.keys(found)[0]}`)?.focus();
      return;
    }
    setErrors({});
    persistLead();
    window.location.href = buildCheckoutUrl(
      added ? OTO_CONFIG.links.productPlusAddon : OTO_CONFIG.links.productOnly
    );
  };

  const fieldCls = (err?: string) =>
    `w-full rounded-xl border bg-white px-3.5 py-2.5 font-body text-[14px] text-navy outline-none transition-colors placeholder:text-navy/40 ${
      err ? 'border-coral focus:border-coral-dark' : 'border-navy/15 focus:border-navy'
    }`;
  const labelCls = 'mb-1 block font-body text-[12px] font-semibold text-navy/70';
  const errLine = (msg?: string) =>
    msg ? <p className="mt-1 font-body text-[12px] text-coral-dark">{msg}</p> : null;

  // ── Cards (defined once, placed into the two columns below) ──────────────
  const offerCard = (
    <Reveal className="overflow-hidden rounded-3xl border border-navy/10 bg-white shadow-card">
      <div className="relative h-28 overflow-hidden border-b border-navy/[0.06] bg-cream sm:h-44 lg:h-auto lg:aspect-[16/9]">
        <Image
          src={OTO_CONFIG.images.product}
          alt="The One Partner Reset full book suite"
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 520px"
          className="object-cover object-center"
        />
        <span className="absolute left-4 top-4 rounded-full bg-navy px-3 py-1 font-body text-[10px] font-bold uppercase tracking-[0.14em] text-white shadow-soft sm:text-[10.5px]">
          {OTO.product.badge}
        </span>
      </div>

      <div className="p-4 sm:p-6 lg:p-7">
        <h2 className="font-serif text-[21px] font-semibold leading-snug text-navy sm:text-[24px] lg:text-[26px]">
          {OTO.product.name}
        </h2>
        <p className="mt-1 font-body text-[13.5px] leading-relaxed text-navy/70 sm:text-[14px]">
          {OTO.product.tagline}
        </p>

        {/* Mobile/tablet: one compact line */}
        <p className="mt-3 font-body text-[13px] leading-relaxed text-navy/75 lg:hidden">
          {OTO.product.includesShort}
        </p>

        {/* Desktop: the full itemised list */}
        <ul className="mt-5 hidden space-y-2.5 lg:block">
          {OTO.product.includes.map((item) => (
            <li
              key={item}
              className="flex items-start gap-2.5 font-body text-[14.5px] leading-relaxed text-navy/85"
            >
              <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-coral/15">
                <Check className="h-3 w-3 text-coral-dark" strokeWidth={3} />
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>

        <div className="mt-4 flex items-end justify-between gap-4 border-t border-navy/10 pt-3.5 lg:mt-6 lg:pt-4">
          <div>
            <span className="font-body text-[11.5px] font-semibold uppercase tracking-[0.14em] text-coral-dark">
              Included today
            </span>
            <p className="mt-1 font-body text-[12.5px] text-navy/50">
              <span className="line-through decoration-navy/25">{OTO.product.valueLabel}</span> value
            </p>
          </div>
          <div className="text-right">
            <span className="font-serif text-[28px] font-semibold leading-none text-navy sm:text-[32px]">
              {OTO.product.priceLabel}
            </span>
            <p className="mt-1 font-body text-[12px] text-navy/55">{OTO.product.priceNote}</p>
          </div>
        </div>
      </div>
    </Reveal>
  );

  const formCard = (
    <Reveal className="rounded-3xl border border-navy/10 bg-white p-5 shadow-card sm:p-6">
      <div id="oto-form">
        <h3 className="font-serif text-[18px] font-semibold text-navy">{OTO.form.heading}</h3>
        <p className="mt-1 font-body text-[12.5px] leading-relaxed text-navy/60">{OTO.form.note}</p>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div>
            <label htmlFor="oto-name" className={labelCls}>{OTO.form.name}</label>
            <input
              id="oto-name"
              className={fieldCls(errors.name)}
              placeholder={OTO.form.name}
              value={name}
              autoComplete="name"
              aria-invalid={!!errors.name}
              onChange={(e) => { setName(e.target.value); clearError('name'); }}
            />
            {errLine(errors.name)}
          </div>
          <div>
            <label htmlFor="oto-email" className={labelCls}>{OTO.form.email}</label>
            <input
              id="oto-email"
              type="email"
              className={fieldCls(errors.email)}
              placeholder="you@example.com"
              value={email}
              autoComplete="email"
              aria-invalid={!!errors.email}
              onChange={(e) => { setEmail(e.target.value); clearError('email'); }}
            />
            {errLine(errors.email)}
          </div>
          <div>
            <label className={labelCls}>{OTO.form.phone}</label>
            <PhoneField
              error={!!errors.phone}
              onParts={(p) => {
                setDialCode(p.dialCode);
                setPhoneNational(p.national);
                clearError('phone');
              }}
            />
            {errLine(errors.phone)}
          </div>
          <div>
            <label htmlFor="oto-city" className={labelCls}>{OTO.form.city}</label>
            <input
              id="oto-city"
              className={fieldCls(errors.city)}
              placeholder={OTO.form.city}
              value={city}
              autoComplete="address-level2"
              aria-invalid={!!errors.city}
              onChange={(e) => { setCity(e.target.value); clearError('city'); }}
            />
            {errLine(errors.city)}
          </div>
        </div>
      </div>
    </Reveal>
  );

  const addonCard = (
    <Reveal variant="scale" className="relative">
      <div
        aria-hidden="true"
        className="halo pointer-events-none absolute -inset-3 -z-10 rounded-[2rem] bg-coral/12 blur-2xl"
      />
      <div
        className={`overflow-hidden rounded-3xl border-2 bg-white shadow-card transition-colors duration-300 ${
          added ? 'border-coral ring-4 ring-coral/15' : 'border-coral/40'
        }`}
      >
        {/* Header — tappable on mobile to expand/collapse the details */}
        <button
          type="button"
          onClick={() => setAddonOpen((o) => !o)}
          aria-expanded={addonOpen}
          className="block w-full text-left"
        >
          <div className="flex items-center justify-between gap-3 bg-coral/[0.08] px-5 py-2.5">
            <span className="flex items-center gap-1.5 font-body text-[11px] font-bold uppercase tracking-[0.14em] text-coral-dark">
              <Sparkles className="h-3.5 w-3.5" strokeWidth={2.5} />
              {OTO.addon.flag}
            </span>
            <span className="hidden font-body text-[10.5px] font-bold uppercase tracking-[0.12em] text-navy/45 sm:block">
              {OTO.addon.badge}
            </span>
            <ChevronDown
              className={`h-4 w-4 shrink-0 text-coral-dark transition-transform lg:hidden ${
                addonOpen ? 'rotate-180' : ''
              }`}
            />
          </div>

          {/* Always-visible compact summary (kicker + title + price) */}
          <div className="px-5 pt-4">
            <div className="flex items-center justify-between gap-2">
              <span className="flex items-center gap-1.5 font-body text-[10.5px] font-bold uppercase tracking-[0.14em] text-coral-dark">
                <Headphones className="h-3.5 w-3.5" strokeWidth={2.2} />
                Guided meditation
              </span>
              <span className="font-serif text-[18px] font-semibold text-navy">
                {OTO.addon.priceLabel}
              </span>
            </div>
            <h3 className="mt-1 font-serif text-[18px] font-semibold leading-snug text-navy sm:text-[20px]">
              {OTO.addon.name}
            </h3>
          </div>
        </button>

        {/* Collapsible details — always shown on desktop (lg:block) */}
        <div className={`px-5 pb-1 ${addonOpen ? 'block' : 'hidden'} lg:block`}>
          <div className="mt-3 grid grid-cols-[100px_1fr] items-start gap-4 sm:grid-cols-[112px_1fr]">
            <div className="relative aspect-[3/4] w-full self-start overflow-hidden rounded-xl border border-white/70 bg-cream shadow-soft ring-1 ring-gold/15">
              <Image
                src={OTO_CONFIG.images.addon}
                alt="The Love Legacy Visualization"
                fill
                sizes="(max-width: 640px) 100px, 112px"
                className="object-cover object-center"
              />
              <Sparkle twinkle className="absolute -right-1.5 -top-1.5 h-3.5 w-3.5 text-gold" />
            </div>
            <p className="font-body text-[12.5px] leading-relaxed text-navy/70">
              {OTO.addon.tagline}
            </p>
          </div>

          <ul className="mt-3 space-y-1.5 pb-3">
            {OTO.addon.points.map((p) => (
              <li
                key={p}
                className="flex items-start gap-2 font-body text-[12.5px] leading-relaxed text-navy/80"
              >
                <span className="glow-chip mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-coral/15">
                  <Check className="h-2.5 w-2.5 text-coral-dark" strokeWidth={3} />
                </span>
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Add / remove toggle (always visible) */}
        <button
          type="button"
          onClick={() => setAdded((v) => !v)}
          aria-pressed={added}
          className={`flex w-full items-center gap-3 border-t px-5 py-3.5 text-left transition-colors ${
            added ? 'border-coral/30 bg-coral/[0.06]' : 'border-navy/10 bg-white'
          }`}
        >
          <span
            className={`grid h-5 w-5 shrink-0 place-items-center rounded-md border-2 transition-colors ${
              added ? 'border-coral bg-coral text-white' : 'border-navy/30 bg-white'
            }`}
          >
            {added && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
          </span>
          <span className="font-body text-[13px] font-semibold leading-snug text-navy">
            {added ? OTO.addon.addedLabel : OTO.addon.addLabel}
          </span>
        </button>
      </div>
    </Reveal>
  );

  const payCard = (
    <Reveal className="rounded-3xl border border-navy/10 bg-white p-5 shadow-card sm:p-6">
      <div className="space-y-2.5 border-b border-navy/10 pb-4">
        <div className="flex items-center justify-between gap-4">
          <span className="font-body text-[14px] text-navy/85">{OTO.product.name}</span>
          <span className="shrink-0 font-body text-[14px] font-semibold text-navy">
            {OTO.product.priceLabel}
          </span>
        </div>
        {added && (
          <div className="flex items-center justify-between gap-4">
            <span className="font-body text-[14px] text-navy/85">{OTO.addon.name}</span>
            <span className="shrink-0 font-body text-[14px] font-semibold text-navy">
              {OTO.addon.priceLabel}
            </span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between gap-4 py-4">
        <span className="font-body text-[15px] font-bold text-navy">Total</span>
        <span className="font-serif text-[26px] font-semibold text-navy">₹{total}</span>
      </div>

      <button type="button" onClick={handleContinue} className="btn-primary w-full">
        {ctaLabel}
        <ArrowRight className="h-5 w-5 shrink-0" />
      </button>

      {added && (
        <button
          type="button"
          onClick={() => setAdded(false)}
          className="mt-3 block w-full text-center font-body text-[12.5px] text-navy/50 underline underline-offset-2 transition-colors hover:text-navy/80"
        >
          {OTO.declineLabel}
        </button>
      )}

      <ul className="mt-5 space-y-2">
        {OTO.reassurance.map((line, i) => (
          <li
            key={line}
            className="flex items-start gap-2.5 font-body text-[12.5px] leading-relaxed text-navy/70"
          >
            {i === 0 ? (
              <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-coral-dark" />
            ) : (
              <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-coral-dark" />
            )}
            <span>{line}</span>
          </li>
        ))}
      </ul>
    </Reveal>
  );

  return (
    <>
      <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-2 lg:items-start">
        {/* LEFT · main offer then the form */}
        <div className="space-y-6">
          {offerCard}
          {formCard}
        </div>
        {/* RIGHT · add-on then pay, packed together and pinned in view */}
        <div className="space-y-6 lg:sticky lg:top-24">
          {addonCard}
          {payCard}
        </div>
      </div>

      {/* Sticky bottom Continue bar — always visible below the desktop layout */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-navy/10 bg-white/95 px-4 py-3 backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-5xl items-center gap-3">
          <div className="leading-tight">
            <p className="font-body text-[11px] font-semibold uppercase tracking-[0.12em] text-navy/45">
              Total
            </p>
            <p className="font-serif text-[20px] font-semibold text-navy">₹{total}</p>
          </div>
          <button type="button" onClick={handleContinue} className="btn-primary flex-1">
            {ctaLabel}
            <ArrowRight className="h-5 w-5 shrink-0" />
          </button>
        </div>
      </div>
    </>
  );
}
