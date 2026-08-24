import Reveal from '@/components/ui/Reveal';
import Sparkle from '@/components/ui/Sparkle';
import SaveSeatButton, { CtaReassurance } from '@/components/webinar/SaveSeatButton';
import { FINAL_CLOSE, CTA } from '@/lib/webinar-content';

/**
 * The last word before the footer.
 *
 * Closes on the same line the page opened with, so the brand narrative is the
 * first and last thing she reads. The event details are repeated here on
 * purpose: by this point she has scrolled a long way from the hero, and the
 * date is the one fact she needs before she commits.
 */
export default function FinalClose() {
  return (
    <section className="relative overflow-hidden bg-navy-deep py-16 sm:py-20 lg:py-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[420px] bg-[radial-gradient(55%_60%_at_50%_100%,rgba(245,144,117,0.18),transparent_70%)]"
      />

      <div className="container-reading relative text-center">
        <Reveal className="flex justify-center">
          <Sparkle twinkle className="h-5 w-5 text-gold" />
        </Reveal>

        {/* The brand line, one last time */}
        <Reveal delay={70}>
          <h2 className="mx-auto mt-6 max-w-[680px] font-serif text-[27px] font-semibold uppercase leading-[1.14] text-white sm:text-[38px] lg:text-[44px]">
            <span className="block text-white/55">{FINAL_CLOSE.heading.line1}</span>
            <span className="mt-2 block">
              <span className="hl">{FINAL_CLOSE.heading.line2}</span>
            </span>
          </h2>
        </Reveal>

        <Reveal delay={140}>
          <p className="mx-auto mt-7 max-w-[560px] font-serif text-[17px] italic leading-[1.45] text-white/70 sm:text-[20px]">
            {FINAL_CLOSE.quote}
          </p>
        </Reveal>

        <Reveal delay={190}>
          <p className="mt-4 font-serif text-[15px] italic text-coral sm:text-[16px]">
            {FINAL_CLOSE.signature}
          </p>
        </Reveal>

        {/* The event details, repeated where she is deciding */}
        <Reveal delay={240}>
          <p className="mx-auto mt-9 inline-block rounded-pill border border-white/15 bg-white/[0.06] px-5 py-2.5 font-body text-[12px] font-semibold text-white/85 sm:text-[13.5px]">
            {FINAL_CLOSE.fine}
          </p>
        </Reveal>

        <Reveal delay={290} className="mx-auto mt-6 max-w-[520px]">
          <SaveSeatButton
            label={CTA.labels.final}
            className="w-full !px-5 text-[14.5px] leading-tight sm:text-[16px]"
          />
          <CtaReassurance className="mt-3.5 font-body text-[11.5px] text-white/45 sm:text-[12.5px]" />
        </Reveal>
      </div>
    </section>
  );
}
