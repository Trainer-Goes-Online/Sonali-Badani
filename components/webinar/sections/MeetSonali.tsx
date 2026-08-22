import Image from 'next/image';

import Reveal from '@/components/ui/Reveal';
import Sparkle from '@/components/ui/Sparkle';
import { MEET_SONALI } from '@/lib/webinar-content';

/**
 * Sonali's story, first person, with the 4:5 portrait in a coral offset frame.
 * On desktop the portrait becomes a sticky column beside the prose so her face
 * stays with the reader through the whole story.
 */
export default function MeetSonali() {
  return (
    <section className="bg-warm py-14 sm:py-20 lg:py-24">
      <div className="container-page">
        <div className="mx-auto max-w-[980px]">
          <Reveal className="flex items-center justify-center gap-2">
            <Sparkle twinkle className="h-3 w-3 text-gold" />
            <span className="eyebrow">{MEET_SONALI.eyebrow}</span>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="mt-4 text-center font-serif text-[26px] font-semibold uppercase leading-[1.14] text-navy sm:text-[34px] lg:text-[38px]">
              {MEET_SONALI.heading}
            </h2>
          </Reveal>

          <div className="mt-8 grid gap-8 sm:mt-10 lg:grid-cols-[minmax(0,320px)_1fr] lg:items-start lg:gap-12">
            {/* Portrait */}
            <Reveal variant="scale" className="lg:sticky lg:top-24">
              <div className="relative mx-auto max-w-[300px] lg:max-w-none">
                {/* Coral offset frame */}
                <span
                  aria-hidden="true"
                  className="absolute -bottom-3 -right-3 h-full w-full rounded-3xl border-[3px] border-coral/60"
                />
                <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-cream shadow-card ring-1 ring-navy/[0.06]">
                  <Image
                    src="/Hero-Image/sonali-main-hero-image.JPG"
                    alt="Sonali Badani, Marriage Architect and founder of The Soul Space"
                    fill
                    sizes="(max-width: 1024px) 300px, 320px"
                    className="object-cover object-top"
                  />
                </div>
                <Sparkle twinkle className="absolute -left-2 -top-2 h-5 w-5 text-gold" />
              </div>
            </Reveal>

            {/* Story */}
            <div>
              <div className="space-y-4 sm:space-y-5">
                {MEET_SONALI.body.map((para, i) => (
                  <Reveal
                    key={para}
                    delay={i * 35}
                    as="p"
                    className={
                      i === 0
                        ? 'font-serif text-[19px] leading-snug text-navy sm:text-[22px]'
                        : 'font-body text-[15.5px] leading-[1.7] text-navy/85 sm:text-[16.5px]'
                    }
                  >
                    {para}
                  </Reveal>
                ))}
              </div>

              {/* Credential pills */}
              <Reveal delay={80} className="mt-7 flex flex-wrap gap-2">
                {MEET_SONALI.pills.map((pill) => (
                  <span
                    key={pill}
                    className="rounded-pill bg-coral/[0.16] px-3.5 py-2 font-body text-[10.5px] font-bold uppercase tracking-[0.1em] text-navy transition-colors duration-300 hover:bg-coral/25 sm:text-[11.5px]"
                  >
                    {pill}
                  </span>
                ))}
              </Reveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
