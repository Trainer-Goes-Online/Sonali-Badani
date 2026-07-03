import { ShieldCheck, Zap, Lock, Film } from 'lucide-react';
import AccessButton from '@/components/AccessButton';
import Sparkle from '@/components/ui/Sparkle';
import SectionMedia from '@/components/ui/SectionMedia';
import Reveal from '@/components/ui/Reveal';
import { HERO, BRAND_BAND } from '@/lib/content';
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

// Icons paired to HERO.badges, in order.
const BADGE_ICONS = [ShieldCheck, Film, Zap, Lock];

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-4 pb-16 sm:pt-6 sm:pb-20">
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
          {/* [1] Audience + format tag */}
          <span
            {...up(0)}
            className="glow-chip inline-flex items-center gap-1.5 whitespace-nowrap rounded-pill border border-coral/30 bg-coral/[0.08] px-3.5 py-1.5 font-body text-[10px] font-bold uppercase tracking-[0.1em] text-coral-dark animate-fade-up sm:gap-2 sm:px-4 sm:text-[11.5px] sm:tracking-[0.18em]"
          >
            <Sparkle twinkle className="h-3 w-3 text-gold sm:h-3.5 sm:w-3.5" />
            {HERO.audienceTag}
          </span>

          {/* [2] Headline (locked) */}
          <h1
            {...up(90)}
            className="mt-5 text-balance font-semibold leading-[1.1] text-navy [font-size:clamp(27px,6vw,54px)]"
          >
            <Headline />
          </h1>

          {/* [3] Outcome + format promise (the winner's headline role) */}
          <p
            {...up(180)}
            className="mt-4 max-w-2xl text-balance font-body text-[14px] font-medium leading-relaxed text-navy/85 sm:mt-5 sm:text-[18.5px]"
          >
            {HERO.outcome}
          </p>

          {/* [4] Sonali photo + credibility card (moved above the CTA) */}
          <div {...up(280)} className="relative mt-5 w-full max-w-2xl animate-fade-up sm:mt-9">
            <SectionMedia
              src="/Hero-Image/sonali-hero-image8.png"
              alt="Sonali Badani with The One Partner Reset book suite"
              aspect="aspect-[3/2]"
              priority
              reveal={false}
              sizes="(max-width: 768px) 100vw, 720px"
              className="drift w-full"
            />
            {/* Credibility card overlaps the photo, like the winner's credentials overlay.
                Kept compact so the CTA reaches the first screen on mobile. */}
            <div className="relative z-10 mx-auto -mt-9 w-[92%] max-w-md rounded-2xl border border-navy/10 bg-white/95 p-3.5 text-center shadow-card backdrop-blur sm:-mt-12 sm:p-5">
              <p className="font-serif text-[14px] font-semibold leading-snug text-navy sm:text-[18px]">
                {HERO.credibility.lead}
              </p>
              <p className="mt-0.5 font-body text-[11.5px] leading-snug text-navy/70 sm:mt-1 sm:text-[13px]">
                {HERO.credibility.role}
              </p>
              {/* Stat pills — raised 3D look with a coral accent + tactile hover/press.
                  Compact on mobile so both fit one row and the CTA stays in view. */}
              <div className="mt-2.5 flex flex-nowrap items-center justify-center gap-1.5 sm:mt-3.5 sm:flex-wrap sm:gap-2">
                {HERO.credibility.stats.map((stat) => (
                  <span
                    key={stat}
                    className="inline-flex items-center gap-1 whitespace-nowrap rounded-pill border border-coral/30 bg-white px-2.5 py-1 font-body text-[10.5px] font-semibold text-navy shadow-[0_3px_0_0_rgba(229,121,92,0.35),0_7px_14px_-6px_rgba(32,63,92,0.3)] transition-all duration-200 hover:-translate-y-0.5 hover:border-coral/50 hover:shadow-[0_5px_0_0_rgba(229,121,92,0.45),0_12px_20px_-8px_rgba(32,63,92,0.4)] active:translate-y-0 active:shadow-[0_2px_0_0_rgba(229,121,92,0.35)] sm:gap-1.5 sm:px-3 sm:py-1.5 sm:text-[12.5px]"
                  >
                    <span className="h-1 w-1 shrink-0 rounded-full bg-coral sm:h-1.5 sm:w-1.5" aria-hidden="true" />
                    {stat}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* [5] Shortened subhead (keeps the verbatim Point A opening) */}
          <p
            {...up(380)}
            className="mt-5 max-w-2xl font-body text-[14px] leading-relaxed text-navy/85 sm:mt-8 sm:text-[17px]"
          >
            {HERO.sub}
          </p>

          {/* [6] Primary CTA, with a glowing gold line beneath (our palette) */}
          <div {...up(460)} className="mt-5 w-full max-w-md sm:mt-8">
            <AccessButton
              label={HERO.cta}
              className="w-full !whitespace-normal px-6 py-4 text-[15px] leading-tight sm:py-6 sm:text-[17px]"
            />
            <div
              aria-hidden="true"
              className="mx-auto mt-7 h-[1.5px] w-4/5 max-w-xs rounded-full bg-gradient-to-r from-transparent via-gold to-transparent shadow-[0_0_26px_4px_rgba(194,163,107,0.8)]"
            />
          </div>

          {/* [7] Trust badge row (format clarity replaces soft badges). Centered,
              compact 2-up grid on mobile; a single flowing row on desktop. */}
          <ul
            {...up(540)}
            className="mx-auto mt-6 grid max-w-[330px] grid-cols-2 gap-x-4 gap-y-3 font-body text-[11.5px] leading-tight text-navy/70 sm:mt-5 sm:max-w-none sm:flex sm:flex-wrap sm:items-center sm:justify-center sm:gap-x-5 sm:text-[12.5px] sm:text-navy/65"
          >
            {HERO.badges.map((badge, i) => {
              const Icon = BADGE_ICONS[i] ?? ShieldCheck;
              return (
                <li key={badge} className="flex items-center gap-1.5">
                  <Icon className="h-3.5 w-3.5 shrink-0 text-coral-dark sm:h-4 sm:w-4" />
                  <span>{badge}</span>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Hero closing — the brand crescendo (kept). */}
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
