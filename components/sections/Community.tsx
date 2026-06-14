import { Section, SectionHeading } from '@/components/ui/Section';
import Reveal from '@/components/ui/Reveal';
import { COMMUNITY_PARAS } from '@/lib/content';

export default function Community() {
  return (
    <Section>
      <div className="container-page">
        <div className="mx-auto max-w-3xl rounded-3xl border border-navy/10 bg-warm p-8 text-center shadow-card sm:p-12">
          <SectionHeading eyebrow="Your circle" title="You won't do this alone" />
          <Reveal className="mt-7 space-y-5">
            <p className="lede">{COMMUNITY_PARAS[0]}</p>
            <p className="lede">{COMMUNITY_PARAS[1]}</p>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
