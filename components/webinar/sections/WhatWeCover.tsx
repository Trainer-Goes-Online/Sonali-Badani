import { MessageCircleHeart } from 'lucide-react';

import Reveal from '@/components/ui/Reveal';
import Sparkle from '@/components/ui/Sparkle';
import SaveSeatButton, { CtaReassurance } from '@/components/webinar/SaveSeatButton';
import { WHAT_WE_COVER, CTA } from '@/lib/webinar-content';

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

        {/*
          The outcome, living inside this section rather than in one of its own.
          It used to be stated three times on the page: a takeaway strip here, a
          Clarity / Control / Plan section below, and again at the close. Once,
          immediately after the five teaching points, is enough.
        */}
        <div className="mx-auto mt-12 max-w-[760px] sm:mt-16">
          <Reveal className="flex items-center justify-center gap-2">
            <Sparkle twinkle className="h-3 w-3 text-gold" />
            <span className="eyebrow">{WHAT_WE_COVER.outcome.eyebrow}</span>
          </Reveal>

          <Reveal delay={70}>
            <h3 className="mt-4 text-center font-serif text-[25px] font-semibold leading-[1.16] text-navy sm:text-[33px] lg:text-[37px]">
              {WHAT_WE_COVER.outcome.heading}
            </h3>
          </Reveal>

          <div className="mt-8 grid gap-3.5 sm:mt-10 sm:gap-4 lg:grid-cols-3">
            {WHAT_WE_COVER.outcome.items.map((item, i) => (
              <Reveal
                key={item.n}
                delay={i * 80}
                className="h-full rounded-3xl border-2 border-coral/35 bg-white p-5 shadow-[0_2px_12px_rgba(32,63,92,0.06)] sm:p-6"
              >
                <span className="font-serif text-[12.5px] font-semibold tracking-[0.18em] text-coral-dark">
                  {item.n}
                </span>
                <h4 className="mt-2 font-serif text-[22px] font-semibold uppercase leading-none text-navy sm:text-[26px]">
                  {item.title}
                </h4>
                <p className="mt-3 font-body text-[14px] leading-[1.65] text-navy/75 sm:text-[15px]">
                  {item.body}
                </p>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal delay={120} className="mx-auto mt-10 max-w-[560px]">
          <SaveSeatButton
            label={CTA.labels.afterOutcome}
            className="w-full !px-5 text-[14.5px] leading-tight sm:text-[16px]"
          />
          <CtaReassurance className="mt-3 font-body text-[11.5px] text-navy/50 sm:text-[12.5px]" />
        </Reveal>
      </div>
    </section>
  );
}
