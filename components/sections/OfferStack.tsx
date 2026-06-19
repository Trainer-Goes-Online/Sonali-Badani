import Image from 'next/image';
import { Section, SectionHeading } from '@/components/ui/Section';
import Reveal from '@/components/ui/Reveal';
import SectionMedia from '@/components/ui/SectionMedia';
import CountUp from '@/components/ui/CountUp';
import Sparkle from '@/components/ui/Sparkle';
import AccessButton from '@/components/AccessButton';
import { Check, Gift } from 'lucide-react';
import { OFFER_CORE, OFFER_BONUSES, OFFER_INCLUDED, VALUE_STACK } from '@/lib/content';
import { COURSE_PRICE_LABEL } from '@/lib/pricing';
import { OFFER_VARIANT } from '@/lib/flags';

// Numeric value behind the displayed "₹12,500" total, for the count-up.
const VALUE_TOTAL_NUM = Number(VALUE_STACK.total.replace(/[^\d]/g, ''));

// Bonus cover images (user-provided). Mapped to each bonus BY CONTENT, not by
// filename: the sonali-bonus-N files do not line up with the bonus numbers
// (bonus-3.png is the Happiness Blueprint = bonus 4; bonus-4.jpeg is the
// Relationship Clarity Assessment = bonus 3). next/image encodes the URL itself,
// so these use literal spaces (not %20).
const BONUS_IMAGES: Record<number, { src: string }> = {
  1: { src: '/Solani Bonuses/Affirmations.png' }, // 50 Marriage Affirmations
  2: { src: '/Solani Bonuses/sonali-bonus-2.png' }, // The Love Legacy Manifesto
  3: { src: '/Solani Bonuses/sonali-bonus-4.jpeg' }, // The Relationship Clarity Assessment
  4: { src: '/Solani Bonuses/sonali-bonus-3.png' }, // The Happiness Blueprint
  5: { src: '/Solani Bonuses/sonali-bonus-5.jpeg' }, // The Private Love Legacy Community
};

// Map each bonus to its rupee value from the value stack (matched by name).
const bonusValue = (name: string) =>
  VALUE_STACK.items.find((it) => it.name.includes(name))?.value;

function BonusCard({ b, index }: { b: (typeof OFFER_BONUSES)[number]; index: number }) {
  const img = BONUS_IMAGES[b.n];
  const value = bonusValue(b.name);
  return (
    <Reveal
      delay={Math.min(index * 70, 280)}
      className={`flex flex-col overflow-hidden rounded-3xl bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_28px_70px_-24px_rgba(32,63,92,0.45)] ${
        b.marquee ? 'border-2 border-coral/60' : 'border border-navy/10'
      }`}
    >
      {/* Cover panel — the cover fills the entire box, edge to edge, with the
          same center alignment on every card. */}
      <div className="relative aspect-[16/9] overflow-hidden border-b border-navy/[0.06] bg-cream">
        {img ? (
          <Image
            src={img.src}
            alt={b.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover object-center"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-navy/30">
            <Gift className="h-8 w-8" strokeWidth={1.4} aria-hidden="true" />
            <span className="font-body text-[10.5px] font-semibold uppercase tracking-[0.16em]">
              Cover coming soon
            </span>
          </div>
        )}
        {b.marquee && (
          <span className="absolute left-3 top-3 rounded-full bg-coral px-2.5 py-1 font-body text-[10px] font-bold uppercase tracking-[0.12em] text-navy shadow-cta">
            Most loved
          </span>
        )}
      </div>

      {/* Body */}
      <div className="flex grow flex-col p-5 sm:p-6">
        <p className="font-body text-[11px] font-bold uppercase tracking-[0.16em] text-coral-dark">
          Bonus · 0{b.n}
        </p>
        <h4 className="mt-2 font-serif text-[18px] font-semibold leading-snug text-navy sm:text-[20px]">
          {b.name}
        </h4>
        <p className="mt-2 grow font-body text-[14px] leading-relaxed text-navy/70">{b.body}</p>
        {value && (
          <div className="mt-4 flex items-center gap-2.5">
            <span className="rounded-full border border-gold/40 bg-gold/10 px-3 py-1 font-body text-[10.5px] font-bold uppercase tracking-[0.12em] text-gold-deep">
              Included
            </span>
            <span className="font-body text-[13px] text-navy/45">
              <span className="line-through decoration-navy/25">{value}</span> value
            </span>
          </div>
        )}
      </div>
    </Reveal>
  );
}

function TierLabel({ children }: { children: React.ReactNode }) {
  return (
    <Reveal className="mb-5 flex items-center gap-3">
      <span className="font-body text-[13px] font-bold uppercase tracking-[0.18em] text-coral-dark">
        {children}
      </span>
      <span className="h-px grow bg-navy/[0.12]" />
    </Reveal>
  );
}

function VersionBStack() {
  return (
    <div className="mx-auto mt-12 max-w-4xl">
      {/* The core experience. Only the first item is shown (all viewports);
          the bonuses begin right after it. */}
      <TierLabel>The core experience</TierLabel>
      <div className="space-y-3.5">
        {OFFER_CORE.slice(0, 1).map((item, i) => (
          <Reveal
            key={item.name}
            delay={Math.min(i * 50, 250)}
            className="flex gap-4 rounded-2xl border border-navy/10 bg-warm p-5 shadow-soft transition-all duration-300 hover:border-coral/40 hover:shadow-card sm:p-6"
          >
            <span className="glow-chip mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-coral/15">
              <Check className="h-4 w-4 text-coral-dark" strokeWidth={3} />
            </span>
            <div>
              <h3 className="font-body text-[16px] font-bold leading-snug text-navy sm:text-[17px]">
                {item.name}
              </h3>
              <p className="mt-1.5 font-body text-[14.5px] leading-relaxed text-navy/75">{item.body}</p>
            </div>
          </Reveal>
        ))}
      </div>

      {/* Your bonuses — static grid of image-topped cards (covers on top). */}
      <div className="mt-12">
        <TierLabel>Your bonuses</TierLabel>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {OFFER_BONUSES.map((b, i) => (
            <BonusCard key={b.name} b={b} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

function VersionAStack() {
  return (
    <Reveal className="mx-auto mt-10 max-w-2xl overflow-hidden rounded-3xl border border-navy/[0.12] bg-warm shadow-card">
      <ul>
        {VALUE_STACK.items.map((item) => (
          <li
            key={item.name}
            className="flex items-center justify-between gap-4 border-b border-navy/10 px-5 py-3.5 sm:px-7"
          >
            <span className="font-body text-[14.5px] text-navy/85 sm:text-[15.5px]">{item.name}</span>
            <span className="shrink-0 font-body text-[14.5px] font-semibold text-navy/55 line-through decoration-navy/25">
              {item.value}
            </span>
          </li>
        ))}
        <li className="flex items-center justify-between gap-4 bg-warm px-5 py-4 sm:px-7">
          <span className="font-body text-[15px] font-bold text-navy">Total value</span>
          <span className="font-serif text-[20px] text-navy/60 line-through">
            <CountUp end={VALUE_TOTAL_NUM} prefix="₹" separator="," />
          </span>
        </li>
        <li className="flex items-center justify-between gap-4 bg-navy px-5 py-5 text-white sm:px-7">
          <span className="font-body text-[15px] font-bold">Today</span>
          <span className="font-serif text-[24px] font-semibold text-coral sm:text-[27px]">
            {VALUE_STACK.today}
          </span>
        </li>
      </ul>
    </Reveal>
  );
}

export default function OfferStack() {
  const isA = OFFER_VARIANT === 'A';
  return (
    <Section>
      <div className="container-page">
        <SectionHeading
          eyebrow="Everything you get"
          title={isA ? "Here's everything you get today." : 'Everything inside the One Partner Reset'}
        />

        {/* The whole suite, shown in full — every book and tool you receive today. */}
        <SectionMedia
          src="/Section-Images/section-image10.png"
          alt="The One Partner Reset book suite laid out in full"
          aspect="aspect-[3/2]"
          sizes="(max-width: 1024px) 100vw, 880px"
          className="mx-auto mt-10 w-full max-w-3xl"
        />

        {isA ? <VersionAStack /> : <VersionBStack />}

        {/* The included 15-minute call — lands here as a surprise, not a hero promise */}
        {!isA && (
          <Reveal
            variant="scale"
            className="relative mx-auto mt-10 max-w-2xl overflow-hidden rounded-2xl border border-coral/40 bg-warm px-6 py-7 text-center shadow-card ring-1 ring-coral/20 sm:px-10"
          >
            <Sparkle twinkle className="absolute right-4 top-4 h-4 w-4 text-gold/70" aria-hidden="true" />
            <p className="font-serif text-[18px] leading-snug text-navy sm:text-[21px]">{OFFER_INCLUDED}</p>
          </Reveal>
        )}

        <Reveal className="mt-9 flex flex-col items-center gap-3">
          <AccessButton label={`Get Instant Access · ${COURSE_PRICE_LABEL} one time`} className="w-full sm:w-auto" />
          <p className="font-body text-[13.5px] text-navy/60">14-day money-back guarantee.</p>
        </Reveal>
      </div>
    </Section>
  );
}
