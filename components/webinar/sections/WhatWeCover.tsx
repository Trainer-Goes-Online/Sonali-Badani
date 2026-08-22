import { MessageCircleHeart } from 'lucide-react';

import Reveal from '@/components/ui/Reveal';
import Sparkle from '@/components/ui/Sparkle';
import SaveSeatButton from '@/components/webinar/SaveSeatButton';
import { WHAT_WE_COVER } from '@/lib/webinar-content';

/**
 * Five step cards mirroring the running order of the webinar, so whichever
 * script Sonali lands on, the page still matches the room. Closes with the live
 * Q&A block and a CTA.
 */
export default function WhatWeCover() {
  return (
    <section className="py-14 sm:py-20 lg:py-24">
      <div className="container-page">
        <div className="mx-auto max-w-[700px] text-center">
          <Reveal className="flex items-center justify-center gap-2">
            <Sparkle twinkle className="h-3 w-3 text-gold" />
            <span className="eyebrow">{WHAT_WE_COVER.eyebrow}</span>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="mt-4 font-serif text-[26px] font-semibold uppercase leading-[1.14] text-navy sm:text-[34px] lg:text-[40px]">
              {WHAT_WE_COVER.heading}
            </h2>
          </Reveal>
          <Reveal delay={140}>
            <p className="lede mx-auto mt-5 max-w-[540px]">{WHAT_WE_COVER.sub}</p>
          </Reveal>
        </div>

        <ol className="mx-auto mt-9 max-w-[760px] space-y-3.5 sm:mt-12 sm:space-y-4">
          {WHAT_WE_COVER.steps.map((step, i) => (
            <Reveal
              key={step.title}
              delay={i * 60}
              as="li"
              className="group relative rounded-3xl border border-navy/10 bg-white p-5 shadow-[0_2px_12px_rgba(32,63,92,0.06)] transition-all duration-300 hover:-translate-y-1 hover:border-coral/35 hover:shadow-card sm:p-6"
            >
              {/* Number + title share a row on mobile so the card stays compact */}
              <div className="flex items-start gap-3.5">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-coral font-serif text-[16px] font-semibold text-navy shadow-[0_6px_16px_-8px_rgba(245,144,117,0.9)] transition-transform duration-300 group-hover:scale-110 sm:h-10 sm:w-10 sm:text-[18px]">
                  {i + 1}
                </span>
                <h3 className="mt-1 font-body text-[14px] font-bold uppercase leading-snug tracking-[0.04em] text-navy sm:mt-1.5 sm:text-[15.5px]">
                  {step.title}
                </h3>
              </div>

              <p className="mt-3.5 font-body text-[14.5px] leading-[1.68] text-navy/80 sm:ml-[3.375rem] sm:mt-3 sm:text-[15.5px]">
                {step.body}
              </p>
            </Reveal>
          ))}
        </ol>

        {/* Live Q&A */}
        <Reveal
          delay={60}
          className="relative mx-auto mt-8 max-w-[760px] overflow-hidden rounded-3xl bg-navy p-6 shadow-card sm:mt-10 sm:p-8"
        >
          <span
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-coral-dark via-coral to-coral-dark"
          />
          <div className="flex items-center gap-3">
            <span className="glow-chip grid h-9 w-9 shrink-0 place-items-center rounded-full bg-coral/15 text-coral">
              <MessageCircleHeart className="h-[18px] w-[18px]" strokeWidth={2} />
            </span>
            <h3 className="font-serif text-[19px] font-semibold text-white sm:text-[22px]">
              {WHAT_WE_COVER.qa.title}
            </h3>
          </div>
          <p className="mt-3.5 font-body text-[14.5px] leading-[1.68] text-white/80 sm:text-[15.5px]">
            {WHAT_WE_COVER.qa.body}
          </p>
        </Reveal>

        {/* The concrete promise, pulled forward so it is visible before the CTA */}
        <Reveal delay={90} className="mx-auto mt-8 max-w-[760px] rounded-3xl border-2 border-coral/40 bg-white p-5 sm:p-6">
          <p className="text-center font-body text-[11px] font-bold uppercase tracking-[0.16em] text-coral-dark sm:text-[12px]">
            {WHAT_WE_COVER.takeaway.label}
          </p>
          <div className="mt-4 grid gap-2.5 sm:grid-cols-3 sm:gap-3">
            {WHAT_WE_COVER.takeaway.items.map((item) => (
              <p
                key={item}
                className="rounded-2xl bg-coral/[0.1] px-4 py-3 text-center font-serif text-[16px] font-semibold leading-snug text-navy sm:text-[17px]"
              >
                {item}
              </p>
            ))}
          </div>
        </Reveal>

        <Reveal delay={120} className="mx-auto mt-8 max-w-[520px]">
          <SaveSeatButton className="w-full" />
        </Reveal>
      </div>
    </section>
  );
}
