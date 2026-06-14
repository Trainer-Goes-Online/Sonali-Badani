import { Section, SectionHeading } from '@/components/ui/Section';
import Reveal from '@/components/ui/Reveal';
import Checklist from '@/components/ui/Checklist';
import { ANOTHER_VERSION_PARAS, OUTCOMES_INTRO, OUTCOMES } from '@/lib/content';

export default function AnotherVersion() {
  return (
    <Section tint>
      <div className="container-reading">
        <SectionHeading eyebrow="Thirty days from now" title="There's another version of this" />

        <Reveal className="mt-8 space-y-5">
          <p className="lede">{ANOTHER_VERSION_PARAS[0]}</p>
          <p className="font-serif text-[20px] italic text-navy sm:text-[24px]">
            {ANOTHER_VERSION_PARAS[1]}
          </p>
          <p className="lede">{ANOTHER_VERSION_PARAS[2]}</p>
        </Reveal>

        <Reveal className="mt-9">
          <p className="font-body text-[15px] font-semibold uppercase tracking-wide text-navy/60">
            {OUTCOMES_INTRO}
          </p>
        </Reveal>
        <div className="mt-5">
          <Checklist items={OUTCOMES} columns />
        </div>
      </div>
    </Section>
  );
}
