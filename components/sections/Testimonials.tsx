import { Section, SectionHeading } from '@/components/ui/Section';
import Reveal from '@/components/ui/Reveal';
import { Quote } from 'lucide-react';
import TestimonialsCarousel from './TestimonialsCarousel';
import {
  TESTIMONIALS_HEAD,
  TESTIMONIALS_INTRO,
  TESTIMONIALS,
  TESTIMONIALS_LINE,
  TESTIMONIALS_PRIVACY,
} from '@/lib/content';

export default function Testimonials() {
  return (
    <Section tint>
      <div className="container-page">
        <SectionHeading eyebrow="In their words" title={TESTIMONIALS_HEAD} lede={TESTIMONIALS_INTRO} />

        {/* Desktop / tablet — static grid (unchanged) */}
        <div className="mx-auto mt-10 hidden max-w-5xl gap-5 sm:grid lg:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.by} delay={i * 90} className="h-full">
              <figure className="group flex h-full flex-col rounded-2xl border border-navy/10 bg-white p-6 shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:border-coral/40 hover:shadow-card sm:p-7">
                <Quote
                  className="h-7 w-7 text-coral transition-transform duration-300 group-hover:scale-110"
                  aria-hidden="true"
                />
                <blockquote className="mt-4 grow font-body text-[15px] leading-relaxed text-navy/85">
                  {t.quote}
                </blockquote>
                <figcaption className="mt-5 font-body text-[13px] font-semibold uppercase tracking-[0.1em] text-navy/55">
                  {t.by}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>

        {/* Mobile — swipeable, snap-to-card carousel (readable, one quote at a time) */}
        <TestimonialsCarousel items={TESTIMONIALS} />

        <Reveal className="mt-8 text-center">
          <p className="font-serif text-[20px] italic text-navy sm:text-[24px]">{TESTIMONIALS_LINE}</p>
        </Reveal>

        {/* Privacy note — Sonali's personal promise, set apart in a softer script feel */}
        <Reveal className="mx-auto mt-10 max-w-2xl rounded-2xl border border-navy/10 bg-white px-6 py-7 text-center shadow-soft sm:px-10">
          <p className="font-serif text-[16px] italic leading-relaxed text-navy/80 sm:text-[17.5px]">
            {TESTIMONIALS_PRIVACY}
          </p>
          <p className="mt-4 font-body text-[13px] font-semibold uppercase tracking-[0.12em] text-coral-dark">
            A note from Sonali
          </p>
        </Reveal>
      </div>
    </Section>
  );
}
