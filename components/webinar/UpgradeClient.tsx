'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import {
  AlertTriangle,
  ArrowRight,
  Check,
  ChevronDown,
  Headphones,
  Lock,
  Play,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

import Reveal from '@/components/ui/Reveal';
import Sparkle from '@/components/ui/Sparkle';
import { UPGRADE } from '@/lib/webinar-content';
import { OTO_CONFIG, otoTotalRupees } from '@/lib/oto-config';
import { readCachedLead, mergeCachedLead, REGISTERED_FLAG_KEY } from '@/lib/tracking';
import { flushRegistrationRetries } from '@/lib/registration';
import { trackAddToCart, trackOtoDecline } from '@/lib/events';
import { useStickyOffset } from './useStickyOffset';

/**
 * P2 · The one time offer.
 *
 * A single binary decision: take the seat alone, or add The One Partner Reset
 * (with an optional companion add-on) as a head start before the room opens.
 *
 * Two rules from the spec are load-bearing here:
 *  - The decline button is always clearly visible, never disguised, never
 *    shrunk below the fold. A woman who feels tricked at this price does not
 *    buy the programme six days later. Trust is the actual asset.
 *  - The page is reachable only after a registration. A direct visit is sent
 *    back to /masterclass.
 *
 * The checkout link is chosen purely by whether the add-on is kept, and the
 * details captured at registration prefill it so nothing is retyped.
 */
export default function UpgradeClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const retry = searchParams.get('retry') === '1';

  const [allowed, setAllowed] = useState<boolean | null>(null);
  const [added, setAdded] = useState<boolean>(OTO_CONFIG.addonDefaultSelected);
  const [addonOpen, setAddonOpen] = useState(false);
  const leaving = useRef(false);

  const total = useMemo(() => otoTotalRupees(added), [added]);
  /** e.g. "₹498" with the add-on kept, "₹299" without. */
  const totalLabel = `₹${total}`;

  // Keeps the footer clear of the fixed bar (see useStickyOffset).
  const stickyRef = useStickyOffset<HTMLDivElement>();

  /* ── Access gate ──────────────────────────────────────────────────────── */

  useEffect(() => {
    let registered = false;
    try {
      registered = sessionStorage.getItem(REGISTERED_FLAG_KEY) === '1';
    } catch {
      registered = false;
    }

    // A returning visitor whose session flag expired but whose lead is still
    // cached (email present) counts as registered, so a refresh or a hop back
    // from a failed payment never dumps her out of the funnel.
    if (!registered) {
      const lead = readCachedLead();
      registered = Boolean(lead.email);
    }

    if (!registered) {
      router.replace('/masterclass');
      return;
    }

    setAllowed(true);
    void flushRegistrationRetries();
  }, [router]);

  /* ── Actions ──────────────────────────────────────────────────────────── */

  const buildCheckoutUrl = (base: string) => {
    const lead = readCachedLead();
    let url: URL;
    try {
      url = new URL(base);
    } catch {
      return base;
    }
    if (OTO_CONFIG.prefill.enabled) {
      const k = OTO_CONFIG.prefill.keys;
      const fullName = [lead.first_name, lead.last_name].filter(Boolean).join(' ');
      if (fullName) url.searchParams.set(k.name, fullName);
      if (lead.email) url.searchParams.set(k.email, lead.email);
      if (lead.country_code) url.searchParams.set(k.countryCode, lead.country_code);
      if (lead.phone) url.searchParams.set(k.phone, lead.phone);
      if (lead.city) url.searchParams.set(k.city, lead.city);
    }
    return url.toString();
  };

  const handleYes = () => {
    if (leaving.current) return;
    leaving.current = true;

    // Record what she chose, so the post-purchase webhook reports the right
    // amount even though TagMango does not send it back.
    mergeCachedLead({ amount: String(total) });
    trackAddToCart(total, added);

    window.location.href = buildCheckoutUrl(
      added ? OTO_CONFIG.links.productPlusAddon : OTO_CONFIG.links.productOnly
    );
  };

  const handleDecline = () => {
    if (leaving.current) return;
    leaving.current = true;
    trackOtoDecline();
    router.push('/welcome');
  };

  /* ── Gate states ──────────────────────────────────────────────────────── */

  if (allowed === null) {
    return (
      <div className="grid min-h-[60vh] place-items-center px-5">
        <span
          aria-label="Loading"
          className="h-7 w-7 animate-spin rounded-full border-2 border-navy/20 border-t-coral"
        />
      </div>
    );
  }

  /* ── Shared pieces ────────────────────────────────────────────────────── */

  const yesButton = (
    <button type="button" onClick={handleYes} className="btn-primary w-full !py-5 leading-tight">
      <span className="relative z-[3]">{UPGRADE.cta.yes(totalLabel)}</span>
      <ArrowRight className="relative z-[3] h-5 w-5 shrink-0" />
    </button>
  );

  const declineButton = (
    <button
      type="button"
      onClick={handleDecline}
      className="w-full rounded-pill border border-navy/35 bg-white px-6 py-4 font-body text-[15px] font-semibold text-navy transition-colors duration-200 hover:border-navy hover:bg-navy hover:text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-navy/20 sm:text-[16px]"
    >
      {UPGRADE.cta.decline}
    </button>
  );

  const buttonPair = (
    <div className="space-y-3.5">
      {yesButton}
      <p className="text-center font-body text-[12px] text-navy/55">{UPGRADE.cta.note}</p>
      {declineButton}
    </div>
  );

  return (
    <>
      {/* Alert bar */}
      <div className="bg-coral">
        <p className="container-page py-3.5 text-center font-body text-[14px] font-bold leading-snug text-navy sm:text-[15.5px]">
          {UPGRADE.alert}
        </p>
      </div>

      {/* Payment retry banner */}
      {retry && (
        <div className="border-b border-coral/30 bg-coral/[0.14]">
          <p className="container-page flex items-start justify-center gap-2 py-3 text-center font-body text-[13px] leading-snug text-navy sm:text-[14px]">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-coral-dark" />
            {UPGRADE.retryBanner}
          </p>
        </div>
      )}

      <main>
        <div className="container-page pt-7 sm:pt-10">
          {/*
            Two column header on desktop: the copy on the left, the product
            suite on the right. On mobile the grid collapses and the image
            falls in DOM order, which puts it directly above the One Partner
            Reset card, so she sees what she is being offered immediately
            before the offer itself.
          */}
          <div className="mx-auto max-w-[1060px] lg:grid lg:grid-cols-[1.02fr_0.98fr] lg:items-center lg:gap-x-12 xl:gap-x-16">
            <div className="lg:col-start-1">
              {/* Progress */}
              <Reveal>
                <p className="font-body text-[10.5px] font-bold uppercase tracking-[0.16em] text-navy/50 sm:text-[11.5px]">
                  {UPGRADE.progressLabel}
                </p>
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-navy/10">
                  <div className="upgrade-progress h-full rounded-full bg-gradient-to-r from-coral-dark to-coral" />
                </div>
              </Reveal>

              {/* Header */}
              <Reveal delay={80}>
                <p className="mt-7 font-body text-[10.5px] font-bold uppercase tracking-[0.18em] text-coral-dark sm:text-[11.5px]">
                  {UPGRADE.brandLine}
                </p>
                <h1 className="mt-3 font-serif text-[27px] font-semibold leading-[1.16] text-navy sm:text-[34px] lg:text-[36px]">
                  {UPGRADE.heading}
                </h1>
              </Reveal>
              <Reveal delay={130}>
                <p className="lede mt-4">{UPGRADE.deck}</p>
              </Reveal>
              <div className="mt-4 space-y-3.5">
                {UPGRADE.body.map((para, i) => (
                  <Reveal
                    key={para}
                    delay={170 + i * 40}
                    as="p"
                    className="font-body text-[15px] leading-[1.7] text-navy/80 sm:text-[16px]"
                  >
                    {para}
                  </Reveal>
                ))}
              </div>
            </div>

            {/* The product suite */}
            <Reveal
              delay={120}
              variant="scale"
              className="mt-8 lg:col-start-2 lg:mt-0"
            >
              {/*
                A fixed 3:2 frame with `fill` rather than intrinsic width and
                height, so the artwork can be swapped for a file of any
                dimensions without the layout shifting or needing a code change.
              */}
              <div className="relative aspect-[3/2] w-full overflow-hidden rounded-3xl bg-cream shadow-card ring-1 ring-navy/[0.08]">
                <Image
                  src={OTO_CONFIG.images.hero}
                  alt="The One Partner Reset and its five bonuses, from Sonali Badani"
                  fill
                  priority
                  sizes="(max-width: 1024px) 92vw, 520px"
                  className="object-cover object-center"
                />
              </div>
            </Reveal>
          </div>

          {/* Offer card */}
          <Reveal
            delay={60}
            variant="scale"
            className="relative mx-auto mt-8 max-w-[720px] overflow-hidden rounded-[26px] bg-navy shadow-card sm:mt-10"
          >
            <span
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-coral-dark via-coral to-coral-dark"
            />

            <div className="p-5 sm:p-8">
              <span className="inline-flex rounded-pill bg-coral px-3.5 py-1.5 font-body text-[9.5px] font-bold uppercase tracking-[0.14em] text-navy sm:text-[10.5px]">
                {UPGRADE.product.badge}
              </span>

              <h2 className="mt-4 font-serif text-[24px] font-semibold uppercase leading-tight text-white sm:text-[30px]">
                {UPGRADE.product.name}
              </h2>
              <p className="mt-2.5 font-body text-[14.5px] leading-relaxed text-white/75 sm:text-[16px]">
                {UPGRADE.product.tagline}
              </p>

              {/* Inclusions */}
              <ul className="mt-6 space-y-2.5">
                {UPGRADE.product.includes.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 font-body text-[14px] leading-relaxed text-white/90 sm:text-[15px]"
                  >
                    <span className="mt-0.5 grid h-[18px] w-[18px] shrink-0 place-items-center rounded-full bg-coral/20">
                      <Check className="h-3 w-3 text-coral" strokeWidth={3} />
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              {/* Price row */}
              <div className="mt-7 border-t border-white/12 pt-6 text-center">
                <div className="flex items-baseline justify-center gap-3">
                  <span className="font-body text-[19px] text-white/35 line-through decoration-white/30 sm:text-[22px]">
                    {UPGRADE.product.struck}
                  </span>
                  <span className="font-serif text-[42px] font-semibold leading-none text-coral sm:text-[52px]">
                    {UPGRADE.product.price}
                  </span>
                </div>
                <p className="mt-3 font-body text-[12px] text-white/55 sm:text-[13px]">
                  {UPGRADE.product.priceNote}
                </p>
              </div>
            </div>
          </Reveal>

          {/* Add-on */}
          <Reveal delay={80} className="relative mx-auto mt-4 max-w-[720px]">
            <div
              aria-hidden="true"
              className={`halo pointer-events-none absolute -inset-2 -z-10 rounded-[2rem] bg-coral/15 blur-2xl transition-opacity duration-500 ${
                added ? 'opacity-100' : 'opacity-0'
              }`}
            />
            <div
              className={`overflow-hidden rounded-[26px] border-2 bg-white shadow-card transition-colors duration-300 ${
                added ? 'border-coral ring-4 ring-coral/15' : 'border-coral/35'
              }`}
            >
              {/* Header, tappable to expand */}
              <button
                type="button"
                onClick={() => setAddonOpen((o) => !o)}
                aria-expanded={addonOpen}
                className="block w-full text-left"
              >
                <div className="flex items-center justify-between gap-3 bg-coral/[0.1] px-5 py-2.5">
                  <span className="flex items-center gap-1.5 font-body text-[10.5px] font-bold uppercase tracking-[0.13em] text-coral-dark sm:text-[11.5px]">
                    <Sparkles className="h-3.5 w-3.5" strokeWidth={2.5} />
                    {UPGRADE.addon.flag}
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 text-coral-dark transition-transform duration-300 ${
                      addonOpen ? 'rotate-180' : ''
                    }`}
                  />
                </div>

                <div className="flex items-start justify-between gap-3 px-5 pt-4">
                  <div className="min-w-0">
                    <span className="flex items-center gap-1.5 font-body text-[10px] font-bold uppercase tracking-[0.13em] text-coral-dark sm:text-[10.5px]">
                      <Headphones className="h-3.5 w-3.5 shrink-0" strokeWidth={2.2} />
                      {UPGRADE.addon.kicker}
                    </span>
                    <h3 className="mt-1.5 font-serif text-[18px] font-semibold leading-snug text-navy sm:text-[22px]">
                      {UPGRADE.addon.name}
                    </h3>
                  </div>
                  <div className="shrink-0 text-right">
                    <span className="font-serif text-[20px] font-semibold leading-none text-navy sm:text-[24px]">
                      {UPGRADE.addon.price}
                    </span>
                    <p className="mt-1 font-body text-[9px] font-bold uppercase tracking-[0.1em] text-coral-dark sm:text-[9.5px]">
                      {UPGRADE.addon.valueNote}
                    </p>
                  </div>
                </div>
              </button>

              {/* Details */}
              <div
                className={`grid transition-[grid-template-rows,opacity] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  addonOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                }`}
              >
                <div className="overflow-hidden">
                  <div className="px-5 pb-2">
                    <div className="mt-4 grid grid-cols-[110px_1fr] items-start gap-4 sm:grid-cols-[130px_1fr]">
                      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl border border-white/70 bg-cream shadow-soft ring-1 ring-gold/20">
                        <Image
                          src={OTO_CONFIG.images.addon}
                          alt="The Love Legacy Visualization guided meditation"
                          fill
                          sizes="(max-width: 640px) 110px, 130px"
                          className="object-cover object-center"
                        />
                        <span className="absolute inset-0 grid place-items-center">
                          <span className="play-pulse grid h-10 w-10 place-items-center rounded-full border-[3px] border-white/75 bg-coral text-white">
                            <Play className="ml-0.5 h-3.5 w-3.5 fill-current" strokeWidth={0} />
                          </span>
                        </span>
                        <Sparkle twinkle className="absolute -right-1.5 -top-1.5 h-4 w-4 text-gold" />
                      </div>

                      <div className="min-w-0">
                        <div className="flex flex-wrap gap-1.5">
                          {UPGRADE.addon.meta.map((m) => (
                            <span
                              key={m}
                              className="rounded-pill border border-navy/10 bg-warm px-2.5 py-0.5 font-body text-[10px] font-semibold text-navy/70 sm:text-[10.5px]"
                            >
                              {m}
                            </span>
                          ))}
                        </div>
                        <p className="mt-2.5 font-body text-[12.5px] leading-relaxed text-navy/75 sm:text-[13.5px]">
                          {UPGRADE.addon.tagline}
                        </p>
                      </div>
                    </div>

                    <ul className="mt-4 space-y-1.5">
                      {UPGRADE.addon.points.map((p) => (
                        <li
                          key={p}
                          className="flex items-start gap-2 font-body text-[12.5px] leading-relaxed text-navy/80 sm:text-[13.5px]"
                        >
                          <span className="glow-chip mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-coral/15">
                            <Check className="h-2.5 w-2.5 text-coral-dark" strokeWidth={3} />
                          </span>
                          <span>{p}</span>
                        </li>
                      ))}
                    </ul>

                    <figure className="relative mt-4 rounded-xl border border-gold/25 bg-warm px-4 py-3">
                      <Sparkle className="absolute -left-1.5 -top-1.5 h-3.5 w-3.5 text-gold" />
                      <blockquote className="font-serif text-[14.5px] italic leading-snug text-navy/85 sm:text-[15.5px]">
                        {UPGRADE.addon.quote}
                      </blockquote>
                      <figcaption className="mt-1 font-body text-[10px] uppercase tracking-[0.14em] text-navy/45">
                        {UPGRADE.addon.quoteCaption}
                      </figcaption>
                    </figure>
                  </div>
                </div>
              </div>

              {/* Toggle */}
              <button
                type="button"
                onClick={() => setAdded((v) => !v)}
                aria-pressed={added}
                className={`mt-3 flex w-full items-center gap-3 border-t px-5 py-4 text-left transition-colors ${
                  added ? 'border-coral/30 bg-coral/[0.08]' : 'border-navy/10 bg-white hover:bg-navy/[0.02]'
                }`}
              >
                <span
                  className={`grid h-5 w-5 shrink-0 place-items-center rounded-md border-2 transition-colors ${
                    added ? 'border-coral bg-coral text-navy' : 'border-navy/30 bg-white'
                  }`}
                >
                  {added && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
                </span>
                <span className="font-body text-[13px] font-semibold leading-snug text-navy sm:text-[14px]">
                  {added ? UPGRADE.addon.addedLabel : UPGRADE.addon.addLabel}
                </span>
              </button>
            </div>
          </Reveal>

          {/* Total + the two buttons */}
          <Reveal delay={60} className="mx-auto mt-6 max-w-[720px]">
            <div className="mb-4 flex items-center justify-between rounded-2xl border border-navy/10 bg-white px-5 py-4">
              <span className="font-body text-[14px] font-bold text-navy sm:text-[15px]">
                Total today
              </span>
              <span className="font-serif text-[26px] font-semibold text-navy sm:text-[30px]">
                ₹{total}
              </span>
            </div>
            {buttonPair}
          </Reveal>

          {/* Comparison table */}
          <div className="mx-auto mt-12 max-w-[720px] sm:mt-16">
            <Reveal className="flex items-center gap-2">
              <Sparkle twinkle className="h-3 w-3 text-gold" />
              <span className="eyebrow">{UPGRADE.compare.eyebrow}</span>
            </Reveal>

            <Reveal delay={70} className="mt-5 overflow-hidden rounded-3xl border border-navy/10 bg-white">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-navy/10">
                    <th scope="col" className="w-auto px-3.5 py-3 text-left sm:px-5 sm:py-4">
                      <span className="sr-only">Feature</span>
                    </th>
                    <th scope="col" className="w-[74px] px-1 py-3 text-center sm:w-[120px] sm:py-4">
                      <span className="font-body text-[9.5px] font-bold uppercase leading-tight tracking-[0.1em] text-navy/45 sm:text-[11px]">
                        {UPGRADE.compare.columns[0]}
                      </span>
                    </th>
                    <th
                      scope="col"
                      className="w-[74px] bg-coral/[0.1] px-1 py-3 text-center sm:w-[120px] sm:py-4"
                    >
                      <span className="font-body text-[9.5px] font-bold uppercase leading-tight tracking-[0.1em] text-coral-dark sm:text-[11px]">
                        {UPGRADE.compare.columns[1]}
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {UPGRADE.compare.rows.map((row) => (
                    <tr key={row.label} className="border-b border-navy/[0.07] last:border-b-0">
                      <td className="px-3.5 py-3 font-body text-[12.5px] leading-snug text-navy/85 sm:px-5 sm:py-3.5 sm:text-[14.5px]">
                        {row.label}
                      </td>
                      <td className="px-1 py-3 text-center sm:py-3.5">
                        {row.seat ? (
                          <Check
                            className="mx-auto h-4 w-4 text-coral sm:h-[18px] sm:w-[18px]"
                            strokeWidth={3}
                            aria-label="Included"
                          />
                        ) : (
                          <span
                            className="mx-auto block h-1.5 w-1.5 rounded-full bg-navy/20"
                            aria-label="Not included"
                          />
                        )}
                      </td>
                      <td className="bg-coral/[0.06] px-1 py-3 text-center sm:py-3.5">
                        {row.reset ? (
                          <Check
                            className="mx-auto h-4 w-4 text-coral sm:h-[18px] sm:w-[18px]"
                            strokeWidth={3}
                            aria-label="Included"
                          />
                        ) : (
                          <span
                            className="mx-auto block h-1.5 w-1.5 rounded-full bg-navy/20"
                            aria-label="Not included"
                          />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Reveal>
          </div>

          {/* Why this works */}
          <div className="mx-auto mt-11 max-w-[720px] sm:mt-14">
            <Reveal>
              <h3 className="font-serif text-[22px] font-semibold leading-snug text-navy sm:text-[27px]">
                {UPGRADE.why.heading}
              </h3>
            </Reveal>
            <div className="mt-4 space-y-3.5">
              {UPGRADE.why.body.map((para, i) => (
                <Reveal
                  key={para}
                  delay={50 + i * 40}
                  as="p"
                  className="font-body text-[15px] leading-[1.7] text-navy/80 sm:text-[16px]"
                >
                  {para}
                </Reveal>
              ))}
            </div>
          </div>

          {/* Guarantee */}
          <Reveal
            delay={60}
            className="mx-auto mt-7 max-w-[720px] rounded-3xl border-2 border-coral/40 bg-white p-5 sm:p-7"
          >
            <span className="glow-chip mb-3.5 grid h-10 w-10 place-items-center rounded-full bg-coral/15 text-coral-dark">
              <ShieldCheck className="h-5 w-5" strokeWidth={2} />
            </span>
            <h3 className="font-body text-[12px] font-bold uppercase tracking-[0.14em] text-coral-dark sm:text-[13px]">
              {UPGRADE.guarantee.heading}
            </h3>
            <p className="mt-2.5 font-body text-[14.5px] leading-[1.68] text-navy/85 sm:text-[15.5px]">
              {UPGRADE.guarantee.body}
            </p>
          </Reveal>

          {/* Repeat buttons, same order */}
          <Reveal delay={60} className="mx-auto mt-9 max-w-[720px] sm:mt-11">
            {buttonPair}
          </Reveal>

          {/* Closing note */}
          <Reveal
            delay={80}
            className="mx-auto mt-6 max-w-[720px] rounded-2xl border border-navy/12 bg-warm px-5 py-4"
          >
            <p className="flex items-start justify-center gap-2 text-center font-body text-[13px] leading-relaxed text-navy/70 sm:text-[14px]">
              <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-coral-dark" />
              {UPGRADE.closing}
            </p>
          </Reveal>
        </div>
      </main>

      {/*
        Sticky decision bar, on every breakpoint.
        Both choices are real, equally reachable buttons, and the price on the
        primary tracks the live total so it never disagrees with what is charged.
      */}
      <div
        ref={stickyRef}
        className="fixed inset-x-0 bottom-0 z-50 border-t border-navy/10 bg-white/95 shadow-[0_-12px_34px_-16px_rgba(32,63,92,0.45)] backdrop-blur"
      >
        <div className="container-page py-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))] sm:py-3">
          {/*
            The bonus opt-in, mirroring the checkbox on the card above. Both
            write the same `added` state, so ticking either one updates the
            other, the running total, and the price on the button instantly.
            It lives here because the add-on card can be scrolled well out of
            view by the time she is ready to decide.
          */}
          <label
            className={`mx-auto mb-2 flex max-w-[860px] cursor-pointer items-center gap-2.5 rounded-xl border px-3 py-2 transition-colors ${
              added
                ? 'border-coral/40 bg-coral/[0.1]'
                : 'border-navy/12 bg-navy/[0.02] hover:border-coral/30'
            }`}
          >
            <input
              type="checkbox"
              checked={added}
              onChange={(e) => setAdded(e.target.checked)}
              className="sr-only"
            />
            <span
              aria-hidden="true"
              className={`grid h-[18px] w-[18px] shrink-0 place-items-center rounded-[5px] border-2 transition-colors ${
                added ? 'border-coral bg-coral text-navy' : 'border-navy/30 bg-white'
              }`}
            >
              {added && <Check className="h-3 w-3" strokeWidth={3.5} />}
            </span>
            <span className="font-body text-[11.5px] font-semibold leading-tight text-navy sm:text-[13px]">
              {added
                ? UPGRADE.cta.addonToggleOn
                : UPGRADE.cta.addonToggle(UPGRADE.addon.price)}
            </span>
          </label>

          <div className="mx-auto flex max-w-[860px] items-center gap-2.5 sm:gap-4">
            {/* Running total. Hidden on the narrowest phones, where the button
                already carries the number and the row has no space to spare. */}
            <div className="hidden shrink-0 leading-tight min-[400px]:block">
              <p className="font-body text-[9.5px] font-bold uppercase tracking-[0.12em] text-navy/45 sm:text-[10.5px]">
                Total today
              </p>
              <p className="font-serif text-[20px] font-semibold tabular-nums text-navy sm:text-[24px]">
                ₹{total}
              </p>
            </div>

            <button
              type="button"
              onClick={handleDecline}
              className="min-h-[46px] shrink-0 rounded-pill border border-navy/30 bg-white px-3.5 font-body text-[12.5px] font-semibold leading-tight text-navy transition-colors duration-200 hover:border-navy hover:bg-navy hover:text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-navy/20 sm:min-h-[52px] sm:px-6 sm:text-[14px]"
            >
              <span className="lg:hidden">{UPGRADE.cta.declineShort}</span>
              <span className="hidden lg:inline">{UPGRADE.cta.decline}</span>
            </button>

            <button
              type="button"
              onClick={handleYes}
              className="btn-primary min-h-[46px] flex-1 px-3 py-2 text-[12.5px] leading-tight sm:min-h-[52px] sm:px-6 sm:text-[15px]"
            >
              {/* Three lengths of the same promise, so the price always fits. */}
              <span className="relative z-[3] sm:hidden">{UPGRADE.cta.yesTiny(totalLabel)}</span>
              <span className="relative z-[3] hidden sm:inline lg:hidden">
                {UPGRADE.cta.yesShort(totalLabel)}
              </span>
              <span className="relative z-[3] hidden lg:inline">
                {UPGRADE.cta.yes(totalLabel)}
              </span>
              <ArrowRight className="relative z-[3] hidden h-4 w-4 shrink-0 sm:block" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
