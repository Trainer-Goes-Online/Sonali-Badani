import Reveal from '@/components/ui/Reveal';
import AccessButton from '@/components/AccessButton';
import Sparkle from '@/components/ui/Sparkle';
import { ShieldCheck, Flame } from 'lucide-react';
import { CLOSE_PARAS, CLOSE_BOLD, CLOSE_PRICE, CLOSE_SCARCITY } from '@/lib/content';

export default function FinalClose() {
  return (
    <section className="py-16 sm:py-20 lg:py-24">
      <div className="container-reading text-center">
        <Reveal>
          <p className="eyebrow mb-4">Before you decide</p>
          <h2 className="text-balance text-[26px] font-semibold leading-[1.16] sm:text-[34px] lg:text-[40px]">
            {CLOSE_PARAS[0]}
          </h2>
        </Reveal>

        <Reveal className="mt-6 space-y-4">
          <p className="lede">{CLOSE_PARAS[1]}</p>
          <p className="lede">{CLOSE_PARAS[2]}</p>
        </Reveal>

        <Reveal className="mt-7">
          <p className="font-serif text-[21px] font-semibold leading-snug text-navy sm:text-[26px]">
            {CLOSE_BOLD}
          </p>
        </Reveal>

        {/* Dark offer card (reference: finish-strong), our navy + coral theme */}
        <Reveal className="mx-auto mt-10 max-w-md overflow-hidden rounded-[1.75rem] bg-navy p-8 text-center shadow-[0_30px_70px_-24px_rgba(32,63,92,0.7)]">
          <span className="inline-flex items-center gap-2 rounded-pill border border-coral/40 bg-coral/15 px-4 py-1.5 font-body text-[11px] font-bold uppercase tracking-[0.2em] text-coral">
            <Sparkle twinkle className="h-3 w-3" />
            Founding price
          </span>

          <div className="mt-5 flex items-end justify-center gap-3">
            <span className="font-serif text-[22px] leading-none text-white/40 line-through">₹997</span>
            <span className="font-serif text-[52px] leading-none text-white">₹497</span>
          </div>
          <p className="mt-3 font-body text-[13.5px] leading-relaxed text-white/70">{CLOSE_PRICE}</p>

          <div className="mt-6">
            <AccessButton label="Get Instant Access" className="w-full" />
          </div>

          <p className="mt-4 flex items-center justify-center gap-2 font-body text-[12.5px] text-white/65">
            <ShieldCheck className="h-4 w-4 text-coral" />
            The Full Reset Guarantee
          </p>

          <div className="mt-6 flex items-start gap-2.5 rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 text-left">
            <Flame className="mt-0.5 h-4 w-4 shrink-0 text-coral" aria-hidden="true" />
            <p className="font-body text-[13px] leading-relaxed text-white/80">{CLOSE_SCARCITY}</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
