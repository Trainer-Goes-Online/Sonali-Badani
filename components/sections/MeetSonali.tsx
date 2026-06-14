import { Section } from '@/components/ui/Section';
import Reveal from '@/components/ui/Reveal';
import Sparkle from '@/components/ui/Sparkle';
import { MEET_SONALI } from '@/lib/content';

export default function MeetSonali() {
  return (
    <Section>
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          {/* 1 · Eyebrow + title */}
          <Reveal>
            <p className="mb-3 flex items-center justify-center gap-2">
              <Sparkle twinkle className="h-3 w-3 text-coral" />
              <span className="eyebrow">Meet Sonali</span>
            </p>
            <h2 className="text-balance text-[28px] font-semibold leading-tight sm:text-[36px] lg:text-[40px]">
              {MEET_SONALI.name}
            </h2>
          </Reveal>

          {/* 2 · Image (portrait) with warm glow */}
          <Reveal className="relative mx-auto mt-8 w-full max-w-xs sm:max-w-sm">
            <div
              className="halo pointer-events-none absolute -inset-4 rounded-[2rem] bg-coral/20 blur-2xl"
              aria-hidden="true"
            />
            <div className="drift relative aspect-[4/5] overflow-hidden rounded-[1.75rem] border border-white/70 bg-warm shadow-card ring-1 ring-navy/[0.06]">
              {/* Replace with Sonali's real portrait:
                  <Image src="/sonali-portrait.jpg" alt="Sonali Badani" fill className="object-cover" /> */}
              <div className="grid h-full place-items-center px-6 text-center">
                <div>
                  <p className="font-serif text-2xl text-navy">Sonali Badani</p>
                  <p className="mt-2 font-body text-[11.5px] uppercase tracking-[0.18em] text-navy/45">
                    Add portrait → /public/sonali-portrait.jpg
                  </p>
                </div>
              </div>
            </div>
            <Sparkle twinkle className="absolute -left-3 top-8 h-5 w-5 text-coral" />
            <Sparkle twinkle className="absolute -right-2 bottom-12 h-4 w-4 text-coral/80" />
          </Reveal>

          {/* 3 · Sub heading */}
          <Reveal className="mt-7">
            <p className="font-body text-[15px] font-semibold text-coral-dark sm:text-[16.5px]">
              {MEET_SONALI.title}
            </p>
          </Reveal>

          {/* 4 · Description */}
          <Reveal className="mt-5 space-y-4 font-body text-[15.5px] leading-relaxed text-navy/85 sm:text-[16.5px]">
            {MEET_SONALI.paras.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </Reveal>

          {/* 5 · Call value anchor box */}
          <Reveal className="mt-8 rounded-2xl border border-coral/40 bg-warm px-6 py-5">
            <p className="font-body text-[15px] leading-relaxed text-navy/90">
              {MEET_SONALI.callAnchor}
            </p>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
