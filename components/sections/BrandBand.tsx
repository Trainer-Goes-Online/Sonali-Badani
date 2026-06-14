import Reveal from '@/components/ui/Reveal';
import Sparkle from '@/components/ui/Sparkle';
import { BRAND_BAND } from '@/lib/content';

export default function BrandBand() {
  return (
    <section className="border-y border-navy/10 bg-warm py-16 sm:py-20">
      <div className="container-reading text-center">
        <Reveal>
          <p className="font-serif text-[24px] font-semibold leading-snug text-navy sm:text-[32px] lg:text-[38px]">
            Stop surviving your marriage. Start designing your{' '}
            <span className="mark">Love Legacy.</span>
          </p>
        </Reveal>

        {/* Sparkle divider — the brand star motif */}
        <Reveal delay={100} className="my-6 flex items-center justify-center gap-3">
          <span className="h-px w-10 bg-navy/15" />
          <Sparkle twinkle className="h-4 w-4 text-coral" />
          <span className="h-px w-10 bg-navy/15" />
        </Reveal>

        <Reveal delay={160}>
          <p className="mx-auto max-w-2xl font-serif text-[17px] italic leading-relaxed text-navy/75 sm:text-[20px]">
            {BRAND_BAND.line2}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
