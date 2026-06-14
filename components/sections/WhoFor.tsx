import { Section } from '@/components/ui/Section';
import Reveal from '@/components/ui/Reveal';
import { Heart, X, LifeBuoy } from 'lucide-react';
import { WHO_FOR } from '@/lib/content';

const COLS = [
  { label: 'This is for you', body: WHO_FOR.forYou, Icon: Heart, tone: 'coral' as const },
  { label: "This isn't for you", body: WHO_FOR.notForYou, Icon: X, tone: 'navy' as const },
  { label: 'If things feel unsafe', body: WHO_FOR.safety, Icon: LifeBuoy, tone: 'coral' as const },
];

export default function WhoFor() {
  return (
    <Section>
      <div className="container-page">
        <div className="mx-auto grid max-w-5xl gap-5 sm:grid-cols-3">
          {COLS.map((c, i) => (
            <Reveal
              key={c.label}
              delay={i * 90}
              className="flex h-full flex-col rounded-2xl border border-navy/10 bg-white p-6 text-center shadow-soft transition-all duration-300 hover:border-coral/40 hover:shadow-card sm:p-7"
            >
              <span
                className={`mx-auto grid h-12 w-12 place-items-center rounded-2xl ${
                  c.tone === 'coral' ? 'glow-chip bg-coral/15' : 'bg-navy/[0.08]'
                }`}
              >
                <c.Icon
                  className={`h-6 w-6 ${c.tone === 'coral' ? 'text-coral-dark' : 'text-navy'}`}
                  strokeWidth={2.4}
                />
              </span>
              <p className="mt-4 font-body text-[12px] font-bold uppercase tracking-[0.16em] text-coral-dark">
                {c.label}
              </p>
              <p className="mt-3 font-body text-[15px] leading-relaxed text-navy/85">{c.body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}
