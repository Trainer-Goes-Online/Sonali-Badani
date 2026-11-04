import Reveal from '@/components/ui/Reveal';
import Sparkle from '@/components/ui/Sparkle';
import { WHAT_WE_COVER } from '@/lib/webinar-content';

/**
 * "In 90 minutes, you will leave with": Clarity, A Shift, A 30 Day Map.
 *
 * The block on its own, so the landing page can keep it inside What We Cover
 * (straight after the five teaching points) and /live can show it as a section
 * of its own without a second copy drifting out of sync.
 */
export function OutcomeBlock({ className = '' }: { className?: string }) {
  return (
    <div className={`mx-auto max-w-[760px] ${className}`}>
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
  );
}

/** The block as a standalone section, for /live. */
export default function Outcome() {
  return (
    <section className="py-14 sm:py-20 lg:py-24">
      <div className="container-page">
        <OutcomeBlock />
      </div>
    </section>
  );
}
