import { Section, SectionHeading } from '@/components/ui/Section';
import Reveal from '@/components/ui/Reveal';
import { LOOP_PARAS } from '@/lib/content';

export default function TheLoop() {
  return (
    <Section>
      <div className="container-reading">
        <SectionHeading eyebrow="The hidden loop" title="The loop nobody showed you" />

        <Reveal className="mt-8 space-y-5">
          <p className="font-serif text-[21px] italic leading-snug text-navy sm:text-[25px]">
            {LOOP_PARAS[0]}
          </p>
          <p className="lede">{LOOP_PARAS[1]}</p>
          <p className="font-body text-[16px] font-semibold leading-relaxed text-navy sm:text-[17px]">
            {LOOP_PARAS[2]}
          </p>
          <p className="lede">{LOOP_PARAS[3]}</p>
        </Reveal>

        <Reveal className="mt-8 rounded-2xl border border-coral/40 bg-warm px-6 py-6 text-center sm:px-10">
          <p className="font-serif text-[19px] leading-snug text-navy sm:text-[23px]">
            {LOOP_PARAS[4]}
          </p>
        </Reveal>
      </div>
    </Section>
  );
}
