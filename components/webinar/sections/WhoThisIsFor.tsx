import Reveal from '@/components/ui/Reveal';
import Sparkle from '@/components/ui/Sparkle';
import SaveSeatButton from '@/components/webinar/SaveSeatButton';
import { WHO_FOR } from '@/lib/webinar-content';

/**
 * Four persona cards. She only needs to recognise one, so each card is
 * self-contained: four symptoms then the line that reframes them. The
 * disqualifier block and the identity pills close the section by turning
 * recognition into a decision.
 */
export default function WhoThisIsFor() {
  return (
    <section className="py-14 sm:py-20 lg:py-24">
      <div className="container-page">
        <div className="mx-auto max-w-[720px] text-center">
          <Reveal className="flex items-center justify-center gap-2">
            <Sparkle twinkle className="h-3 w-3 text-gold" />
            <span className="eyebrow">{WHO_FOR.eyebrow}</span>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="mt-4 font-serif text-[26px] font-semibold uppercase leading-[1.14] text-navy sm:text-[34px] lg:text-[40px]">
              {WHO_FOR.heading}
            </h2>
          </Reveal>
          <Reveal delay={140}>
            <p className="lede mx-auto mt-5 max-w-[520px]">{WHO_FOR.sub}</p>
          </Reveal>
        </div>

        {/* Cards */}
        <div className="mx-auto mt-9 grid max-w-[980px] gap-3.5 sm:mt-12 sm:gap-5 lg:grid-cols-2">
          {WHO_FOR.cards.map((card, i) => (
            <Reveal
              key={card.title}
              delay={i * 70}
              className="group h-full rounded-3xl border border-navy/10 bg-white p-5 shadow-[0_2px_12px_rgba(32,63,92,0.06)] transition-all duration-300 hover:-translate-y-1 hover:border-coral/35 hover:shadow-card sm:p-6"
            >
              <h3 className="font-body text-[15px] font-bold uppercase leading-snug tracking-[0.02em] text-navy sm:text-[16.5px]">
                {card.title}
              </h3>

              <ul className="mt-4 space-y-2.5">
                {card.points.map((point) => (
                  <li
                    key={point}
                    className="flex items-start gap-2.5 font-body text-[14px] leading-[1.6] text-navy/80 sm:text-[15px]"
                  >
                    <span
                      aria-hidden="true"
                      className="mt-[0.55em] h-1.5 w-1.5 shrink-0 rounded-full bg-coral"
                    />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>

              <p className="mt-5 rounded-2xl bg-coral/[0.12] px-4 py-3 font-body text-[13.5px] italic leading-relaxed text-navy/85 transition-colors duration-300 group-hover:bg-coral/[0.18] sm:text-[14.5px]">
                {card.pull}
              </p>
            </Reveal>
          ))}
        </div>

        {/* Disqualifier */}
        <Reveal
          delay={80}
          className="mx-auto mt-8 max-w-[720px] rounded-3xl bg-navy p-6 sm:mt-10 sm:p-8"
        >
          <p className="font-body text-[14.5px] leading-[1.65] text-white/85 sm:text-[16px]">
            {WHO_FOR.disqualifier}
          </p>
        </Reveal>

        {/* Transition */}
        <Reveal delay={120}>
          <p className="mx-auto mt-8 max-w-[620px] text-center font-serif text-[17px] italic leading-relaxed text-navy/75 sm:mt-10 sm:text-[19px]">
            {WHO_FOR.transition}
          </p>
        </Reveal>

        {/* Identity pills */}
        <div className="mx-auto mt-7 grid max-w-[520px] gap-2.5">
          {WHO_FOR.identities.map((identity, i) => (
            <Reveal
              key={identity}
              delay={i * 60}
              // Sized so the longest line still fits on one row at 360px. The
              // pills read as a rhythm, and one of six wrapping to two lines
              // breaks it.
              className="rounded-xl bg-navy px-4 py-3.5 text-center font-body text-[11px] font-bold uppercase tracking-[0.06em] text-white transition-colors duration-300 hover:bg-navy-deep sm:px-5 sm:text-[12.5px] sm:tracking-[0.1em] lg:text-[13px] lg:tracking-[0.12em]"
            >
              {identity}
            </Reveal>
          ))}
        </div>

        <Reveal delay={120} className="mx-auto mt-8 max-w-[520px]">
          <SaveSeatButton className="w-full" />
        </Reveal>
      </div>
    </section>
  );
}
