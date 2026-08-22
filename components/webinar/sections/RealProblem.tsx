import Reveal from '@/components/ui/Reveal';
import Sparkle from '@/components/ui/Sparkle';
import { REAL_PROBLEM } from '@/lib/webinar-content';

/**
 * The signature metaphor, given display weight.
 *
 * The crack and foundation idea is the one thing that separates this session
 * from every "communicate better" class, so the heading is set at near hero
 * scale and the symptom list is broken onto its own lines. Reading it slowly is
 * the point: each symptom should land as a separate recognition before the
 * verdict reframes all of them at once.
 */
export default function RealProblem() {
  return (
    <section className="bg-warm py-14 sm:py-20 lg:py-24">
      <div className="container-reading text-center">
        <Reveal className="flex items-center justify-center gap-2">
          <Sparkle twinkle className="h-3 w-3 text-gold" />
          <span className="eyebrow">{REAL_PROBLEM.eyebrow}</span>
        </Reveal>

        {/* The metaphor, at display scale */}
        <Reveal delay={80}>
          <h2 className="mt-5 font-serif text-[28px] font-semibold uppercase leading-[1.1] tracking-[-0.015em] text-navy sm:text-[38px] lg:text-[46px]">
            <span className="block text-navy/55">{REAL_PROBLEM.heading.line1}</span>
            <span className="mt-1.5 block">{REAL_PROBLEM.heading.line2}</span>
          </h2>
        </Reveal>

        <span
          aria-hidden="true"
          className="mx-auto mt-7 block h-px w-24 bg-gradient-to-r from-transparent via-coral/60 to-transparent"
        />

        <div className="mt-7 space-y-4 sm:space-y-5">
          {REAL_PROBLEM.intro.map((para, i) => (
            <Reveal
              key={para}
              delay={40 + i * 40}
              as="p"
              className={
                // The one line verdict carries more weight than the paragraph
                // above it, so it gets the serif and a size step up.
                para.length < 90
                  ? 'font-serif text-[19px] leading-snug text-navy sm:text-[23px]'
                  : 'font-body text-[15.5px] leading-[1.7] text-navy/85 sm:text-[16.5px]'
              }
            >
              {para}
            </Reveal>
          ))}
        </div>

        {/* Symptoms, one per line */}
        <Reveal
          delay={80}
          className="mt-8 rounded-3xl border border-navy/10 bg-white/70 p-6 sm:mt-10 sm:p-8"
        >
          <ul className="space-y-1.5 sm:space-y-2">
            {REAL_PROBLEM.symptoms.map((symptom) => (
              <li
                key={symptom}
                className="font-serif text-[19px] leading-snug text-navy/75 sm:text-[24px]"
              >
                {symptom}
              </li>
            ))}
          </ul>

          <p className="mt-6 border-t border-navy/10 pt-5 font-serif text-[18px] font-semibold leading-snug text-navy sm:text-[22px]">
            <span className="mark">{REAL_PROBLEM.symptomsVerdict}</span>
          </p>
        </Reveal>

        <div className="mt-8 space-y-4 sm:space-y-5">
          {REAL_PROBLEM.body.map((para, i) => (
            <Reveal
              key={para}
              delay={40 + i * 40}
              as="p"
              className={
                para.length < 90
                  ? 'font-serif text-[19px] leading-snug text-navy sm:text-[23px]'
                  : 'font-body text-[15.5px] leading-[1.7] text-navy/85 sm:text-[16.5px]'
              }
            >
              {para}
            </Reveal>
          ))}
        </div>

        {/* Comparison, two stacked panels */}
        <div className="mt-9 space-y-3.5 sm:mt-12 sm:space-y-4">
          <Reveal className="rounded-3xl border border-navy/12 bg-white/60 p-5 text-left sm:p-6">
            <p className="font-body text-[10.5px] font-bold uppercase tracking-[0.16em] text-navy/45 sm:text-[11.5px]">
              {REAL_PROBLEM.compare.other.label}
            </p>
            <p className="mt-2.5 font-body text-[14.5px] leading-[1.65] text-navy/65 sm:text-[15.5px]">
              {REAL_PROBLEM.compare.other.body}
            </p>
          </Reveal>

          <Reveal
            delay={90}
            className="relative overflow-hidden rounded-3xl bg-navy p-5 text-left shadow-card sm:p-6"
          >
            <span
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-coral-dark via-coral to-coral-dark"
            />
            <p className="font-body text-[10.5px] font-bold uppercase tracking-[0.16em] text-coral sm:text-[11.5px]">
              {REAL_PROBLEM.compare.ours.label}
            </p>
            <p className="mt-2.5 font-body text-[14.5px] leading-[1.65] text-white/90 sm:text-[15.5px]">
              {REAL_PROBLEM.compare.ours.body}
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
