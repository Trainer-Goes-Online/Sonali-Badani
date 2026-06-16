'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Check, ArrowRight, Headphones, Lock, ShieldCheck, Sparkles } from 'lucide-react';

import Reveal from '@/components/ui/Reveal';
import Sparkle from '@/components/ui/Sparkle';
import { OTO } from '@/lib/content';
import { OTO_CONFIG, otoTotalRupees } from '@/lib/oto-config';

/**
 * The OTO decision. The main product is always included; the add-on is an
 * optional, pre-selected upgrade. The single Continue button sends her to one
 * of two links depending on whether the add-on is kept:
 *   add-on kept    -> OTO_CONFIG.links.productPlusAddon (link 2)
 *   add-on removed -> OTO_CONFIG.links.productOnly       (link 1)
 *
 * Layout keeps the add-on + Continue in view with little scrolling: on desktop
 * the product sits left and a sticky decision panel (add-on + total + CTA) sits
 * right; on smaller screens it stacks with a sticky bottom Continue bar.
 */
export default function OtoClient() {
  const [added, setAdded] = useState<boolean>(OTO_CONFIG.addonDefaultSelected);

  const total = otoTotalRupees(added);
  const href = added ? OTO_CONFIG.links.productPlusAddon : OTO_CONFIG.links.productOnly;
  const ctaLabel = added ? OTO.cta.withAddon : OTO.cta.productOnly;

  return (
    <>
      <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-stretch">
        {/* ── LEFT · Main product ───────────────────────────────────────── */}
        <Reveal className="flex h-full flex-col overflow-hidden rounded-3xl border border-navy/10 bg-white shadow-card">
          <div className="relative h-28 overflow-hidden border-b border-navy/[0.06] bg-cream sm:h-44 lg:h-auto lg:aspect-[16/9]">
            <Image
              src={OTO_CONFIG.images.product}
              alt="The One Partner Reset full book suite"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 540px"
              className="object-cover object-center"
            />
            <span className="absolute left-4 top-4 rounded-full bg-navy px-3 py-1 font-body text-[10px] font-bold uppercase tracking-[0.14em] text-white shadow-soft sm:text-[10.5px]">
              {OTO.product.badge}
            </span>
          </div>

          <div className="flex grow flex-col p-4 sm:p-6 lg:p-7">
            <h2 className="font-serif text-[21px] font-semibold leading-snug text-navy sm:text-[24px] lg:text-[26px]">
              {OTO.product.name}
            </h2>
            <p className="mt-1 font-body text-[13.5px] leading-relaxed text-navy/70 sm:text-[14px]">
              {OTO.product.tagline}
            </p>

            {/* Mobile/tablet: one compact line so the companion sits high on screen */}
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

            <div className="mt-4 flex items-end justify-between gap-4 border-t border-navy/10 pt-3.5 lg:mt-auto lg:pt-5">
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

        {/* ── RIGHT · Decision panel (add-on + summary + CTA), sticky ────── */}
        <div className="relative lg:sticky lg:top-24">
          {/* warm coral halo so this side reads as the highlighted choice */}
          <div
            aria-hidden="true"
            className="halo pointer-events-none absolute -inset-3 -z-10 rounded-[2rem] bg-coral/12 blur-2xl"
          />

          {/* space-y lives on its own wrapper so the absolute halo above does
              not become the "first child" and push the cards down a row gap. */}
          <div className="space-y-5">
          {/* Add-on (compact but appealing, toggleable) */}
          <button
            type="button"
            onClick={() => setAdded((v) => !v)}
            aria-pressed={added}
            className={`block w-full overflow-hidden rounded-3xl border-2 bg-white text-left shadow-card transition-all duration-300 ${
              added ? 'border-coral ring-4 ring-coral/15' : 'border-coral/40 hover:border-coral/70'
            }`}
          >
            <div className="flex items-center justify-between gap-3 bg-coral/[0.08] px-5 py-2.5">
              <span className="flex items-center gap-1.5 font-body text-[11px] font-bold uppercase tracking-[0.14em] text-coral-dark">
                <Sparkles className="h-3.5 w-3.5" strokeWidth={2.5} />
                {OTO.addon.flag}
              </span>
              <span className="hidden font-body text-[10.5px] font-bold uppercase tracking-[0.12em] text-navy/45 sm:block">
                {OTO.addon.badge}
              </span>
            </div>

            <div className="grid grid-cols-[100px_1fr] items-start gap-4 p-5 sm:grid-cols-[112px_1fr]">
              {/* Cover */}
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

              {/* Copy */}
              <div className="min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="flex items-center gap-1.5 font-body text-[10.5px] font-bold uppercase tracking-[0.14em] text-coral-dark">
                    <Headphones className="h-3.5 w-3.5" strokeWidth={2.2} />
                    Guided meditation
                  </span>
                  <span className="font-serif text-[18px] font-semibold text-navy">
                    {OTO.addon.priceLabel}
                  </span>
                </div>
                <h3 className="mt-1 font-serif text-[18px] font-semibold leading-snug text-navy">
                  {OTO.addon.name}
                </h3>
                <p className="mt-1.5 font-body text-[12.5px] leading-relaxed text-navy/70">
                  {OTO.addon.tagline}
                </p>
              </div>
            </div>

            {/* Benefit points span the full width below the header row */}
            <ul className="space-y-1.5 px-5 pb-4">
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

            {/* Toggle footer */}
            <div
              className={`flex items-center gap-3 border-t px-5 py-3.5 transition-colors ${
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
            </div>
          </button>

          {/* Summary + Continue */}
          <div className="rounded-3xl border border-navy/10 bg-white p-5 shadow-card sm:p-6">
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

            <a href={href} className="btn-primary w-full">
              {ctaLabel}
              <ArrowRight className="h-5 w-5 shrink-0" />
            </a>

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
          </div>
          </div>
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
          <a href={href} className="btn-primary flex-1">
            {ctaLabel}
            <ArrowRight className="h-5 w-5 shrink-0" />
          </a>
        </div>
      </div>
    </>
  );
}
