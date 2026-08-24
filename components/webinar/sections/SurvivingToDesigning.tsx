import { ArrowRight } from 'lucide-react';

import Reveal from '@/components/ui/Reveal';
import Sparkle from '@/components/ui/Sparkle';
import { SURVIVING_TO_DESIGNING as S, CREDIBILITY } from '@/lib/webinar-content';

/**
 * The brand anchor, immediately under the hero.
 *
 * "Stop surviving, start designing" is the thread the whole site hangs on, so
 * it gets one full-width, high-contrast moment here and is not restated until
 * the final close. The three step strip names the mechanism in a single line
 * each; the full explanation belongs to the Method section further down, and
 * deliberately is not repeated in both places.
 *
 * The credibility strip closes the section so the promise she has just read is
 * immediately backed by who is making it, rather than leaving that to a founder
 * story two thirds down the page.
 */
export default function SurvivingToDesigning() {
  return (
    <section className="relative overflow-hidden bg-navy py-14 sm:py-20 lg:py-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-1/2 h-[420px] -translate-y-1/2 bg-[radial-gradient(50%_60%_at_50%_50%,rgba(245,144,117,0.14),transparent_70%)]"
      />

      <div className="container-page relative text-center">
        <Reveal className="flex items-center justify-center gap-2">
          <Sparkle twinkle className="h-3 w-3 text-gold" />
          <span className="eyebrow">{S.eyebrow}</span>
        </Reveal>

        {/* The anchor */}
        <Reveal delay={70}>
          <h2 className="mx-auto mt-5 max-w-[900px] font-serif text-[27px] font-semibold uppercase leading-[1.14] text-white sm:text-[38px] lg:text-[46px]">
            <span className="block text-white/55">{S.from}</span>
            <span className="mt-2 block">
              <span className="hl">{S.to}</span>
            </span>
          </h2>
        </Reveal>

        <Reveal delay={150} className="mx-auto mt-7 max-w-[540px] space-y-2">
          {S.body.map((line) => (
            <p
              key={line}
              className="font-body text-[15px] leading-[1.62] text-white/75 sm:text-[16.5px]"
            >
              {line}
            </p>
          ))}
        </Reveal>

        {/* The mechanism, one line each */}
        <Reveal delay={220} className="mt-10 sm:mt-12">
          <p className="font-body text-[10.5px] font-bold uppercase tracking-[0.2em] text-coral">
            {S.stripLabel}
          </p>

          <ol className="mx-auto mt-5 grid max-w-[900px] gap-3 sm:gap-4 lg:grid-cols-3">
            {S.steps.map((step, i) => (
              <li
                key={step.n}
                className="relative flex items-start gap-3 rounded-2xl border border-white/20 bg-white/[0.06] px-5 py-4 text-left backdrop-blur-sm sm:rounded-3xl sm:px-6 sm:py-5 lg:flex-col lg:items-center lg:text-center"
              >
                <span className="font-serif text-[15px] font-semibold uppercase leading-none text-coral sm:text-[17px] lg:text-[13px] lg:tracking-[0.18em]">
                  {step.title}
                </span>
                <p className="font-body text-[13.5px] leading-[1.6] text-white/70 sm:text-[14.5px] lg:mt-2">
                  {step.body}
                </p>

                {/* Connector, desktop only, so the three read as one sequence */}
                {i < S.steps.length - 1 && (
                  <ArrowRight
                    aria-hidden="true"
                    className="absolute -right-3 top-1/2 hidden h-4 w-4 -translate-y-1/2 text-coral/60 lg:block"
                  />
                )}
              </li>
            ))}
          </ol>
        </Reveal>

        {/* Credibility */}
        <Reveal delay={300} className="mt-11 sm:mt-14">
          <div className="mx-auto grid max-w-[720px] gap-2.5 sm:grid-cols-3 sm:gap-3">
            {CREDIBILITY.stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-white/12 bg-white/[0.05] px-4 py-4"
              >
                <p className="font-serif text-[22px] font-semibold leading-none text-coral sm:text-[26px]">
                  {stat.value}
                </p>
                <p className="mt-2 font-body text-[11.5px] leading-snug text-white/60 sm:text-[12px]">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
