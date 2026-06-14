import { Section, SectionHeading } from '@/components/ui/Section';
import Reveal from '@/components/ui/Reveal';
import CountUp from '@/components/ui/CountUp';
import Sparkle from '@/components/ui/Sparkle';
import AccessButton from '@/components/AccessButton';
import { Check, Users, Gift } from 'lucide-react';
import { OFFER_CORE, OFFER_BONUSES, OFFER_INCLUDED, VALUE_STACK } from '@/lib/content';
import { OFFER_VARIANT } from '@/lib/flags';

// Numeric value behind the displayed "₹12,500" total, for the count-up.
const VALUE_TOTAL_NUM = Number(VALUE_STACK.total.replace(/[^\d]/g, ''));

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
      {/* The core experience */}
      <TierLabel>The core experience</TierLabel>
      <div className="space-y-3.5">
        {OFFER_CORE.map((item, i) => (
          <Reveal
            key={item.name}
            delay={Math.min(i * 50, 250)}
            className="flex gap-4 rounded-2xl border border-navy/10 bg-white p-5 shadow-soft transition-all duration-300 hover:border-coral/40 hover:shadow-card sm:p-6"
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

      {/* Your bonuses — sticky-stacking cards: each sticks and the next slides
          over it while the heading of the one behind stays peeking (ref: dr aditya). */}
      <div className="mt-12">
        <TierLabel>Your bonuses</TierLabel>
        <div className="mx-auto max-w-3xl pb-8">
          {OFFER_BONUSES.map((b, i) => (
            <div
              key={b.name}
              style={{ top: `calc(5rem + ${i * 3.5}rem)` }}
              className={`sticky mb-5 min-h-[150px] overflow-hidden rounded-3xl bg-white px-6 pb-6 pt-4 shadow-card sm:px-8 sm:pb-8 ${
                b.marquee ? 'border-2 border-coral' : 'border border-navy/10'
              }`}
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-7 right-1 font-serif text-[120px] font-semibold leading-none text-coral/10"
              >
                0{b.n}
              </span>
              <div className="relative flex items-center gap-2.5">
                <span className="glow-chip grid h-8 w-8 shrink-0 place-items-center rounded-full bg-coral/15">
                  {b.marquee ? (
                    <Users className="h-4 w-4 text-coral-dark" />
                  ) : (
                    <Gift className="h-4 w-4 text-coral-dark" />
                  )}
                </span>
                <span className="font-body text-[12px] font-bold uppercase tracking-[0.14em] text-coral-dark">
                  Bonus {b.n}
                </span>
              </div>
              <h3 className="relative mt-3 font-body text-[17px] font-bold leading-snug text-navy sm:text-[19px]">
                {b.name}
              </h3>
              <p className="relative mt-2 max-w-xl font-body text-[14.5px] leading-relaxed text-navy/75">
                {b.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function VersionAStack() {
  return (
    <Reveal className="mx-auto mt-10 max-w-2xl overflow-hidden rounded-3xl border border-navy/[0.12] bg-white shadow-card">
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
    <Section tint>
      <div className="container-page">
        <SectionHeading
          eyebrow="Everything you get"
          title={isA ? "Here's everything you get today." : 'Everything inside the One Partner Reset'}
        />

        {isA ? <VersionAStack /> : <VersionBStack />}

        {/* The included 15-minute call — lands here as a surprise, not a hero promise */}
        {!isA && (
          <Reveal
            variant="scale"
            className="relative mx-auto mt-10 max-w-2xl overflow-hidden rounded-2xl border border-coral/40 bg-white px-6 py-7 text-center shadow-card ring-1 ring-coral/20 sm:px-10"
          >
            <Sparkle twinkle className="absolute right-4 top-4 h-4 w-4 text-coral/70" aria-hidden="true" />
            <p className="font-serif text-[18px] leading-snug text-navy sm:text-[21px]">{OFFER_INCLUDED}</p>
          </Reveal>
        )}

        <Reveal className="mt-9 flex flex-col items-center gap-3">
          <AccessButton label="Get Instant Access · ₹497 one time" className="w-full sm:w-auto" />
          <p className="font-body text-[13.5px] text-navy/60">14-day money-back guarantee.</p>
        </Reveal>
      </div>
    </Section>
  );
}
