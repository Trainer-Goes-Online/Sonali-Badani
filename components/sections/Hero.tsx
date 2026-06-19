import { ShieldCheck, Zap, Lock } from 'lucide-react';
import AccessButton from '@/components/AccessButton';
import Sparkle from '@/components/ui/Sparkle';
import SectionMedia from '@/components/ui/SectionMedia';
import Reveal from '@/components/ui/Reveal';
import { HERO, BRAND_BAND } from '@/lib/content';
import { COURSE_PRICE_LABEL } from '@/lib/pricing';
import { HEADLINE_VARIANT } from '@/lib/flags';

function Headline() {
  if (HEADLINE_VARIANT === 'A') {
    return (
      <>
        He&rsquo;s right there beside you. And you&rsquo;ve{' '}
        <span className="mark">never felt more alone.</span>
      </>
    );
  }
  return (
    <>
      Your marriage isn&rsquo;t broken. You&rsquo;re simply repeating a{' '}
      <span className="mark">pattern that&rsquo;s slowly pulling you apart.</span>
    </>
  );
}

/** Staggered fade-up helper. */
const up = (delay: number) => ({
  className: 'animate-fade-up',
  style: { animationDelay: `${delay}ms` },
});

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-14 pb-16 sm:pt-20 sm:pb-20">
      {/* Atmosphere: soft coral orbs + drifting brand sparkles (accent only). */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-coral/20 blur-3xl sm:h-96 sm:w-96" />
        <div className="absolute top-40 -right-16 h-72 w-72 rounded-full bg-navy/[0.06] blur-3xl" />
        <Sparkle twinkle className="absolute left-[8%] top-[22%] h-4 w-4 text-gold/70" />
        <Sparkle twinkle className="absolute right-[12%] top-[14%] h-5 w-5 text-gold/60" />
        <Sparkle twinkle className="absolute left-[16%] bottom-[16%] h-3.5 w-3.5 text-gold/50" />
      </div>

      <div className="container-page relative">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          {/* 1 · Markie */}
          <span
            {...up(0)}
            className="glow-chip inline-flex items-center gap-2 rounded-pill border border-coral/30 bg-coral/[0.08] px-4 py-1.5 font-body text-[11.5px] font-bold uppercase tracking-[0.2em] text-coral-dark animate-fade-up"
          >
            <Sparkle twinkle className="h-3.5 w-3.5 text-gold" />
            The One Partner Reset
          </span>

          {/* 2 · Eyebrow */}
          <p
            {...up(90)}
            className="mt-5 font-body text-[14px] font-medium leading-snug text-navy/70 sm:text-[15px]"
          >
            {HERO.callout}
          </p>

          {/* 3 · Title */}
          <h1
            {...up(170)}
            className="mt-4 text-balance font-semibold leading-[1.1] text-navy [font-size:clamp(31px,6vw,54px)]"
          >
            <Headline />
          </h1>

          {/* 4 · Subheading */}
          <p
            {...up(260)}
            className="mt-5 max-w-2xl font-body text-[15.5px] leading-relaxed text-navy/85 sm:text-[17.5px]"
          >
            {HERO.sub}
          </p>
          <p
            {...up(320)}
            className="mt-3 font-body text-[14px] font-semibold leading-relaxed text-navy/65"
          >
            {HERO.without}
          </p>

          {/* 5 · One big CTA, with a glowing gold line beneath (hierarchy ref;
              our palette). The offer line is gone; the price rides on the button. */}
          <div {...up(420)} className="mt-9 w-full max-w-md">
            <AccessButton
              label={`Get Instant Access · ${COURSE_PRICE_LABEL}`}
              className="w-full px-8 py-5 text-[16.5px] sm:py-6 sm:text-[18px]"
            />
            <div
              aria-hidden="true"
              className="mx-auto mt-7 h-[1.5px] w-4/5 max-w-xs rounded-full bg-gradient-to-r from-transparent via-gold to-transparent shadow-[0_0_26px_4px_rgba(194,163,107,0.8)]"
            />
          </div>

          {/* 6 · Trust badges row (hierarchy ref; our facts + palette) */}
          <ul
            {...up(520)}
            className="mt-5 grid grid-cols-2 gap-x-5 gap-y-2.5 font-body text-[12.5px] text-navy/60 sm:flex sm:flex-wrap sm:items-center sm:justify-center sm:gap-x-5"
          >
            <li className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 shrink-0 text-coral-dark" />
              <span>
                <span className="font-semibold text-navy">14-day</span> guarantee
              </span>
            </li>
            <li className="flex items-center gap-1.5">
              <Zap className="h-4 w-4 shrink-0 text-coral-dark" />
              <span>
                <span className="font-semibold text-navy">Instant</span> access
              </span>
            </li>
            <li className="flex items-center gap-1.5">
              <Lock className="h-4 w-4 shrink-0 text-coral-dark" />
              <span>Secure checkout</span>
            </li>
            <li className="flex items-center gap-1.5">
              <Sparkle className="h-3.5 w-3.5 shrink-0 text-gold" />
              <span>
                <span className="font-semibold text-navy">Launch price</span> · first 100
              </span>
            </li>
          </ul>

          {/* 7 · Hero image — landscape product shot (mobile + desktop) */}
          <SectionMedia
            src="/Hero-Image/sonali-hero-image8.png"
            alt="Sonali Badani with The One Partner Reset book suite"
            aspect="aspect-[3/2]"
            priority
            reveal={false}
            sizes="(max-width: 768px) 100vw, 720px"
            className="drift mt-11 w-full max-w-2xl"
          />

          {/* 8 · Volume trust bar */}
          <p
            {...up(660)}
            className="mt-9 flex items-center gap-3 border-t border-navy/10 pt-5 font-body text-[12.5px] font-semibold uppercase tracking-[0.14em] text-navy/55"
          >
            {HERO.trustBar}
          </p>
        </div>

        {/* Hero closing — the brand crescendo. Was its own band; now it lives
            inside the hero on white, so it reads as the hero's final line, not
            a separate section. */}
        <div className="mx-auto mt-16 max-w-3xl text-center sm:mt-20">
          <Reveal>
            <p className="font-serif text-[24px] font-semibold leading-snug text-navy sm:text-[32px] lg:text-[38px]">
              Stop surviving your marriage. Start designing your{' '}
              <span className="mark">Love Legacy.</span>
            </p>
          </Reveal>

          <Reveal delay={100} className="my-6 flex items-center justify-center gap-3">
            <span className="h-px w-10 bg-navy/15" />
            <Sparkle twinkle className="h-4 w-4 text-gold" />
            <span className="h-px w-10 bg-navy/15" />
          </Reveal>

          <Reveal delay={160}>
            <p className="mx-auto max-w-2xl font-serif text-[17px] italic leading-relaxed text-navy/75 sm:text-[20px]">
              {BRAND_BAND.line2}
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
