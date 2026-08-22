import Reveal from '@/components/ui/Reveal';
import Sparkle from '@/components/ui/Sparkle';
import { AFTER_NINETY } from '@/lib/webinar-content';

/**
 * The concrete takeaways, on navy so the section reads as a hard stop between
 * the two lighter halves of the page. Three numbered rows, hairline separated.
 */
export default function AfterNinety() {
  return (
    <section className="relative overflow-hidden bg-navy-deep py-14 sm:py-20 lg:py-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 top-0 h-80 w-80 rounded-full bg-coral/10 blur-3xl"
      />

      <div className="container-reading relative">
        <Reveal className="flex items-center justify-center gap-2">
          <Sparkle twinkle className="h-3 w-3 text-gold" />
          <span className="eyebrow">{AFTER_NINETY.eyebrow}</span>
        </Reveal>

        <Reveal delay={80}>
          <h2 className="mt-4 text-center font-serif text-[27px] font-semibold leading-[1.16] text-white sm:text-[36px] lg:text-[40px]">
            {AFTER_NINETY.heading}
          </h2>
        </Reveal>

        <dl className="mt-8 sm:mt-11">
          {AFTER_NINETY.items.map((item, i) => (
            <Reveal
              key={item.n}
              delay={i * 90}
              className="group flex items-start gap-4 border-t border-white/12 py-5 transition-colors duration-300 hover:border-coral/40 sm:gap-6 sm:py-7 [&:last-child]:border-b"
            >
              <span className="font-serif text-[26px] font-semibold leading-none text-coral transition-transform duration-300 group-hover:-translate-y-0.5 sm:text-[32px]">
                {item.n}
              </span>
              <div className="min-w-0">
                <dt className="font-body text-[13px] font-bold uppercase tracking-[0.14em] text-white sm:text-[14px]">
                  {item.title}
                </dt>
                <dd className="mt-2 font-body text-[14.5px] leading-[1.65] text-white/70 sm:text-[15.5px]">
                  {item.body}
                </dd>
              </div>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}
