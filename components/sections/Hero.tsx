import { ShieldCheck, PlayCircle } from 'lucide-react';
import AccessButton from '@/components/AccessButton';
import Sparkle from '@/components/ui/Sparkle';
import { HERO } from '@/lib/content';
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
    <section className="relative overflow-hidden pt-10 pb-16 sm:pt-14 sm:pb-20">
      {/* Atmosphere: soft coral orbs + drifting brand sparkles (accent only). */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-coral/20 blur-3xl sm:h-96 sm:w-96" />
        <div className="absolute top-40 -right-16 h-72 w-72 rounded-full bg-navy/[0.06] blur-3xl" />
        <Sparkle twinkle className="absolute left-[8%] top-[22%] h-4 w-4 text-coral/70" />
        <Sparkle twinkle className="absolute right-[12%] top-[14%] h-5 w-5 text-coral/60" />
        <Sparkle twinkle className="absolute left-[16%] bottom-[16%] h-3.5 w-3.5 text-coral/50" />
      </div>

      <div className="container-page relative">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          {/* 1 · Markie */}
          <span
            {...up(0)}
            className="glow-chip inline-flex items-center gap-2 rounded-pill border border-coral/30 bg-coral/[0.08] px-4 py-1.5 font-body text-[11.5px] font-bold uppercase tracking-[0.2em] text-coral-dark animate-fade-up"
          >
            <Sparkle twinkle className="h-3.5 w-3.5 text-coral" />
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

          {/* 5 · Image / video */}
          <div {...up(400)} className="relative mt-10 w-full max-w-sm sm:max-w-md">
            <div className="halo pointer-events-none absolute -inset-4 rounded-[2rem] bg-coral/25 blur-2xl" aria-hidden="true" />
            <div className="drift relative aspect-[4/5] overflow-hidden rounded-[1.75rem] border border-white/70 bg-warm shadow-card ring-1 ring-navy/[0.06]">
              {/* Replace this block with Sonali's real photo or a looping video.
                  e.g. <Image src="/sonali-hero.jpg" alt="Sonali Badani" fill className="object-cover" /> */}
              <div className="grid h-full place-items-center px-6 text-center">
                <div>
                  <PlayCircle className="mx-auto h-12 w-12 text-coral" strokeWidth={1.4} />
                  <p className="mt-4 font-serif text-2xl text-navy">Sonali Badani</p>
                  <p className="mt-2 font-body text-[11.5px] uppercase tracking-[0.18em] text-navy/45">
                    Hero photo or video → /public/sonali-hero
                  </p>
                </div>
              </div>
            </div>
            <Sparkle twinkle className="absolute -left-3 top-10 h-5 w-5 text-coral" />
            <Sparkle twinkle className="absolute -right-2 bottom-14 h-4 w-4 text-coral/80" />
          </div>

          {/* 6 · Offer + button */}
          <p {...up(480)} className="mt-9 font-body text-[15px] font-semibold text-navy">
            Get instant access today for <span className="mark">₹497</span>. Everything below is included.
          </p>
          <div {...up(540)} className="mt-4">
            <AccessButton label={HERO.cta} />
          </div>
          <p
            {...up(600)}
            className="mt-3 flex items-center gap-2 font-body text-[13.5px] text-navy/60"
          >
            <ShieldCheck className="h-4 w-4 text-coral-dark" />
            {HERO.guarantee}
          </p>

          <p
            {...up(660)}
            className="mt-7 flex items-center gap-3 border-t border-navy/10 pt-5 font-body text-[12.5px] font-semibold uppercase tracking-[0.14em] text-navy/55"
          >
            {HERO.trustBar}
          </p>
        </div>
      </div>
    </section>
  );
}
