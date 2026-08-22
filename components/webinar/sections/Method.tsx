import Reveal from '@/components/ui/Reveal';
import Sparkle from '@/components/ui/Sparkle';
import { METHOD, PHILOSOPHY } from '@/lib/webinar-content';

/**
 * The named framework, plus the brand philosophy underneath it.
 *
 * Reset, Rewire, Redesign was already the spine of the session. Giving it a
 * name and a numbered three step layout is what turns it from three good words
 * into something she can recognise, remember and ask for later. The philosophy
 * block below states the deeper promise once, plainly: the hero headline sells
 * saving the marriage, this says what that actually means.
 */
export default function Method() {
  return (
    <section className="relative overflow-hidden bg-navy-deep py-14 sm:py-20 lg:py-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 top-0 h-80 w-80 rounded-full bg-coral/10 blur-3xl"
      />

      <div className="container-page relative">
        <div className="mx-auto max-w-[860px]">
          <Reveal className="flex items-center justify-center gap-2">
            <Sparkle twinkle className="h-3 w-3 text-gold" />
            <span className="eyebrow">{METHOD.eyebrow}</span>
          </Reveal>

          <Reveal delay={80}>
            <h2 className="mt-4 text-center font-serif text-[28px] font-semibold uppercase leading-[1.1] text-white sm:text-[38px] lg:text-[44px]">
              {METHOD.name}
              <sup className="ml-1 align-super font-body text-[11px] font-bold tracking-normal text-coral sm:text-[13px]">
                {METHOD.mark}
              </sup>
            </h2>
          </Reveal>

          <Reveal delay={140}>
            <p className="mx-auto mt-5 max-w-[560px] text-center font-body text-[15px] leading-[1.62] text-white/70 sm:text-[16.5px]">
              {METHOD.promise}
            </p>
          </Reveal>

          {/* The three moves */}
          <div className="mx-auto mt-9 grid max-w-[380px] gap-3.5 sm:mt-12 sm:max-w-[440px] sm:gap-4 lg:max-w-none lg:grid-cols-3 lg:gap-5">
            {METHOD.steps.map((step, i) => (
              <Reveal
                key={step.n}
                delay={i * 90}
                className="group relative h-full overflow-hidden rounded-2xl border border-white/25 bg-white/[0.06] px-5 py-5 backdrop-blur-sm transition-all duration-300 hover:border-coral/50 hover:bg-white/[0.09] sm:rounded-3xl sm:px-6 sm:py-6 lg:hover:-translate-y-1"
              >
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-coral to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                />
                <span className="font-serif text-[13px] font-semibold tracking-[0.18em] text-coral">
                  {step.n}
                </span>
                <h3 className="mt-2 font-serif text-[21px] font-semibold uppercase leading-none text-white sm:text-[26px]">
                  {step.title}
                </h3>
                <p className="mt-3 font-body text-[13.5px] leading-[1.65] text-white/70 sm:text-[14.5px]">
                  {step.body}
                </p>
              </Reveal>
            ))}
          </div>

          {/* Philosophy */}
          <Reveal delay={120} className="mt-12 text-center sm:mt-16">
            <span aria-hidden="true" className="mx-auto block h-px w-20 bg-coral/50" />
            <h3 className="mt-8 font-serif text-[24px] font-semibold leading-[1.2] text-white sm:text-[32px] lg:text-[38px]">
              <span className="block text-white/60">{PHILOSOPHY.heading.line1}</span>
              <span className="mt-1 block">
                <span className="hl">{PHILOSOPHY.heading.line2}</span>
              </span>
            </h3>

            <div className="mx-auto mt-7 max-w-[440px] space-y-1.5">
              {PHILOSOPHY.lines.map((line) => (
                <p
                  key={line}
                  className="font-body text-[14px] leading-relaxed text-white/65 sm:text-[15.5px]"
                >
                  {line}
                </p>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
