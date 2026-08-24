import { ShieldCheck } from 'lucide-react';

import Reveal from '@/components/ui/Reveal';
import Sparkle from '@/components/ui/Sparkle';
import Testimonials from '@/components/webinar/Testimonials';
import SaveSeatButton, { CtaReassurance } from '@/components/webinar/SaveSeatButton';
import { PROOF, CTA } from '@/lib/webinar-content';

/**
 * Real client messages, in their original screenshots.
 *
 * The four testimonials live in one list that presents as a continuously
 * sliding marquee on mobile and as an equal-height two column grid on desktop.
 * See Testimonials.tsx for why it is a single list rather than two layouts.
 *
 * The privacy note underneath is a conversion asset, not a disclaimer. For a
 * woman whose deepest fear is exposure, a coach who visibly protects privacy is
 * exactly the coach she trusts, so it carries real visual weight.
 */
export default function Proof() {
  return (
    <section className="py-14 sm:py-20 lg:py-24">
      <div className="container-page">
        <div className="mx-auto max-w-[1040px]">
          <Reveal className="flex items-center justify-center gap-2">
            <Sparkle twinkle className="h-3 w-3 text-gold" />
            <span className="eyebrow">{PROOF.eyebrow}</span>
          </Reveal>

          <Reveal delay={80}>
            <h2 className="mt-4 text-center font-serif text-[27px] font-semibold leading-[1.16] text-navy sm:text-[36px] lg:text-[40px]">
              {PROOF.heading}
            </h2>
          </Reveal>

          <Reveal delay={130}>
            <p className="lede mx-auto mt-4 max-w-[560px] text-center">{PROOF.sub}</p>
          </Reveal>

          {/*
            Deliberately NOT wrapped in Reveal. The `.reveal` class animates
            `filter: blur()`, and blurring four tall screenshots as they cross
            the viewport is what made this section stutter while scrolling.
          */}
          <div className="mx-auto mt-8 max-w-[820px] sm:mt-10">
            <Testimonials />
          </div>

          {/* Privacy note */}
          <Reveal
            delay={90}
            className="relative mt-6 overflow-hidden rounded-3xl border border-gold/30 bg-warm p-6 sm:mt-8 sm:p-8"
          >
            <Sparkle
              twinkle
              className="absolute right-5 top-5 h-4 w-4 text-gold sm:right-6 sm:top-6"
            />
            <span className="glow-chip mb-4 grid h-10 w-10 place-items-center rounded-full bg-coral/15 text-coral-dark">
              <ShieldCheck className="h-5 w-5" strokeWidth={2} />
            </span>
            <p className="font-serif text-[15.5px] italic leading-[1.7] text-navy/85 sm:text-[17.5px]">
              {PROOF.privacy}
            </p>
          </Reveal>

          <Reveal delay={140} className="mx-auto mt-9 max-w-[520px]">
            <SaveSeatButton
              label={CTA.labels.afterProof}
              className="w-full !px-5 text-[14.5px] leading-tight sm:text-[16px]"
            />
            <CtaReassurance className="mt-3 font-body text-[11.5px] text-navy/50 sm:text-[12.5px]" />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
