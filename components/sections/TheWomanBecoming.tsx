import { Section, SectionHeading } from '@/components/ui/Section';
import Reveal from '@/components/ui/Reveal';
import { THE_WOMAN_PARAS } from '@/lib/content';

/** 3b · Identity beat. Quiet, white, centered. She buys the change in herself first. */
export default function TheWomanBecoming() {
  return (
    <Section tint>
      <div className="container-reading text-center">
        <SectionHeading eyebrow="This is about you" title="The woman you've been becoming" />

        <Reveal className="mt-7 space-y-5">
          <p className="lede">{THE_WOMAN_PARAS[0]}</p>
          <p className="lede">{THE_WOMAN_PARAS[1]}</p>
          <p className="lede">{THE_WOMAN_PARAS[2]}</p>
        </Reveal>

        <Reveal className="mt-8">
          <p className="font-serif text-[20px] italic leading-snug text-navy sm:text-[25px]">
            {THE_WOMAN_PARAS[3]}
          </p>
        </Reveal>
      </div>
    </Section>
  );
}
