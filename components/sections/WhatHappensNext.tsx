import { Section, SectionHeading } from '@/components/ui/Section';
import Reveal from '@/components/ui/Reveal';
import { WHAT_NEXT_INTRO, WHAT_NEXT_STEPS } from '@/lib/content';

/** 9b · A calm schedule-style path (reference: ikore). Big serif step numbers,
 * coral category tags, divider rows. Single brand accent (coral), no rainbow. */
export default function WhatHappensNext() {
  return (
    <Section>
      <div className="container-page">
        <SectionHeading eyebrow="Your first five steps" title="A simple path from here" lede={WHAT_NEXT_INTRO} />

        <div className="mx-auto mt-12 max-w-3xl divide-y divide-navy/10 border-y border-navy/10">
          {WHAT_NEXT_STEPS.map((s, i) => (
            <Reveal
              key={s.title}
              variant="left"
              delay={Math.min(i * 70, 350)}
              className="grid grid-cols-[auto_1fr] items-start gap-5 py-7 sm:gap-9 sm:py-8"
            >
              {/* Left: STEP / big number / category tag */}
              <div className="flex w-16 flex-col items-center text-center sm:w-24">
                <span className="font-body text-[9.5px] font-bold uppercase tracking-[0.2em] text-navy/40">
                  Step
                </span>
                <span className="font-serif text-[42px] font-semibold leading-none text-coral sm:text-[58px]">
                  0{i + 1}
                </span>
                <span className="mt-2.5 rounded-md bg-coral/[0.12] px-2 py-1 font-body text-[9px] font-bold uppercase leading-tight tracking-[0.1em] text-coral-dark">
                  {s.tag}
                </span>
              </div>

              {/* Right: title + description */}
              <div className="pt-1">
                <h3 className="font-serif text-[20px] font-semibold leading-snug text-navy sm:text-[25px]">
                  {s.title}
                </h3>
                <p className="mt-2 font-body text-[15px] leading-relaxed text-navy/75 sm:text-[16.5px]">
                  {s.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}
