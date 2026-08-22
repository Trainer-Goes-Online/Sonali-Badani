import { Check, X } from 'lucide-react';

import Reveal from '@/components/ui/Reveal';
import Sparkle from '@/components/ui/Sparkle';
import { NOT_THIS } from '@/lib/webinar-content';

/**
 * Expectation setting, made visual.
 *
 * The spec said the same thing in a paragraph. Two columns of crosses and ticks
 * does it in about two seconds, and for a woman whose actual fear is being sold
 * a manipulation script, seeing "a script to make him change" listed under NOT
 * is the thing that lets her register. Ruling people out honestly is what earns
 * the ones who stay.
 *
 * The icons are real elements rather than emoji, so they inherit the palette
 * and stay crisp at any size.
 */
export default function NotThis() {
  return (
    <section className="py-14 sm:py-20 lg:py-24">
      <div className="container-page">
        <div className="mx-auto max-w-[860px]">
          <Reveal className="flex items-center justify-center gap-2">
            <Sparkle twinkle className="h-3 w-3 text-gold" />
            <span className="eyebrow">{NOT_THIS.eyebrow}</span>
          </Reveal>

          <Reveal delay={80}>
            <h2 className="mt-4 text-center font-serif text-[26px] font-semibold leading-[1.16] text-navy sm:text-[34px] lg:text-[38px]">
              {NOT_THIS.heading}
            </h2>
          </Reveal>

          <div className="mt-9 grid gap-3.5 sm:mt-12 sm:gap-4 lg:grid-cols-2">
            {/* Not */}
            <Reveal className="rounded-3xl border border-navy/12 bg-white p-5 shadow-[0_2px_12px_rgba(32,63,92,0.06)] sm:p-6">
              <div className="flex items-center gap-2.5">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-navy/[0.07]">
                  <X className="h-4 w-4 text-navy/50" strokeWidth={3} />
                </span>
                <h3 className="font-body text-[12px] font-bold uppercase tracking-[0.16em] text-navy/50 sm:text-[13px]">
                  {NOT_THIS.not.label}
                </h3>
              </div>

              <ul className="mt-5 space-y-3">
                {NOT_THIS.not.items.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 font-body text-[14.5px] leading-snug text-navy/55 line-through decoration-navy/25 sm:text-[15.5px]"
                  >
                    <X
                      className="mt-0.5 h-4 w-4 shrink-0 text-navy/35"
                      strokeWidth={2.6}
                      aria-hidden="true"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </Reveal>

            {/* Is */}
            <Reveal
              delay={90}
              className="relative overflow-hidden rounded-3xl border-2 border-coral/45 bg-white p-5 shadow-card sm:p-6"
            >
              <span
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-coral-dark via-coral to-coral-dark"
              />
              <div className="flex items-center gap-2.5">
                <span className="glow-chip grid h-8 w-8 shrink-0 place-items-center rounded-full bg-coral/20">
                  <Check className="h-4 w-4 text-coral-dark" strokeWidth={3} />
                </span>
                <h3 className="font-body text-[12px] font-bold uppercase tracking-[0.16em] text-coral-dark sm:text-[13px]">
                  {NOT_THIS.is.label}
                </h3>
              </div>

              <ul className="mt-5 space-y-3">
                {NOT_THIS.is.items.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 font-body text-[14.5px] font-medium leading-snug text-navy sm:text-[15.5px]"
                  >
                    <Check
                      className="mt-0.5 h-4 w-4 shrink-0 text-coral-dark"
                      strokeWidth={3}
                      aria-hidden="true"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
