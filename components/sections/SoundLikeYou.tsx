import { Section, SectionHeading } from '@/components/ui/Section';
import Reveal from '@/components/ui/Reveal';
import Checklist from '@/components/ui/Checklist';
import { SOUND_LIKE_YOU, SOUND_LIKE_YOU_CLOSE } from '@/lib/content';

export default function SoundLikeYou() {
  return (
    <Section>
      <div className="container-reading">
        <SectionHeading eyebrow="The quiet signs" title="Does this sound like you" />
        <div className="mt-9">
          <Checklist items={SOUND_LIKE_YOU} />
        </div>
        <Reveal className="mt-9 text-center">
          <p className="font-serif text-[19px] italic leading-snug text-navy sm:text-[23px]">
            {SOUND_LIKE_YOU_CLOSE}
          </p>
        </Reveal>
      </div>
    </Section>
  );
}
