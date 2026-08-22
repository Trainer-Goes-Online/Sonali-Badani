import Reveal from '@/components/ui/Reveal';
import Sparkle from '@/components/ui/Sparkle';
import { RECOGNITION, CREDIBILITY } from '@/lib/webinar-content';

/**
 * The "this is exactly me" moment, immediately under the hero.
 *
 * Deliberately the quietest section on the page and the largest type. It names
 * the in between place, neither leaving nor staying happily, which is where
 * most of this audience actually is and which generic relationship copy never
 * says out loud. Nothing competes with it: no card, no button, no image.
 *
 * The credibility strip sits underneath so the claim she has just recognised
 * herself in is immediately backed by who is making it, rather than leaving
 * that to the founder story two thirds down the page.
 */
export default function Recognition() {
  return (
    <section className="relative overflow-hidden bg-navy py-14 sm:py-20 lg:py-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-1/2 h-[420px] -translate-y-1/2 bg-[radial-gradient(50%_60%_at_50%_50%,rgba(245,144,117,0.14),transparent_70%)]"
      />

      <div className="container-reading relative text-center">
        <Reveal className="flex justify-center">
          <Sparkle twinkle className="h-4 w-4 text-gold" />
        </Reveal>

        <Reveal delay={70} className="mt-6 space-y-1.5 sm:space-y-2">
          {RECOGNITION.lines.map((line) => (
            <p
              key={line}
              className="font-serif text-[24px] leading-[1.24] text-white/70 sm:text-[32px] lg:text-[38px]"
            >
              {line}
            </p>
          ))}
        </Reveal>

        <Reveal delay={180}>
          <p className="mt-2 font-serif text-[26px] font-semibold leading-[1.22] text-white sm:mt-3 sm:text-[36px] lg:text-[44px]">
            <span className="hl">{RECOGNITION.emphasis}</span>
          </p>
        </Reveal>

        <Reveal delay={280}>
          <p className="mx-auto mt-7 max-w-[460px] font-body text-[13.5px] leading-relaxed text-white/55 sm:text-[15px]">
            {RECOGNITION.closer}
          </p>
        </Reveal>

        {/* Credibility strip */}
        <Reveal delay={340} className="mt-10 sm:mt-12">
          <div className="mx-auto grid max-w-[720px] gap-2.5 sm:grid-cols-3 sm:gap-3">
            {CREDIBILITY.stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-white/12 bg-white/[0.05] px-4 py-4 transition-colors duration-300 hover:border-coral/30 hover:bg-white/[0.08]"
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
