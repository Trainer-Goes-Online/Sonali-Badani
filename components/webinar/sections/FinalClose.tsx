import Reveal from '@/components/ui/Reveal';
import Sparkle from '@/components/ui/Sparkle';
import SaveSeatButton from '@/components/webinar/SaveSeatButton';
import { FINAL_CLOSE } from '@/lib/webinar-content';

/**
 * The last word before the footer. Sonali's line, her signature, the button,
 * and the event details in fine print.
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

        <Reveal delay={80}>
          <p className="mx-auto mt-6 max-w-[620px] font-serif text-[22px] font-medium leading-[1.3] text-white sm:text-[30px] lg:text-[34px]">
            {FINAL_CLOSE.quote}
          </p>
        </Reveal>

        <Reveal delay={140}>
          <p className="mt-5 font-serif text-[15px] italic text-coral sm:text-[16px]">
            {FINAL_CLOSE.signature}
          </p>
        </Reveal>

        <Reveal delay={200} className="mx-auto mt-9 max-w-[440px]">
          <SaveSeatButton className="w-full text-[16px] sm:text-[17px]" />
        </Reveal>

        <Reveal delay={250}>
          <p className="mt-4 font-body text-[12px] text-white/50 sm:text-[13px]">
            {FINAL_CLOSE.fine}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
