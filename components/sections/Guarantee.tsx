import Reveal from '@/components/ui/Reveal';
import Sparkle from '@/components/ui/Sparkle';
import { ShieldCheck } from 'lucide-react';
import { GUARANTEE_PARAS } from '@/lib/content';

const CHIPS = ['14-day window', 'Every rupee back', 'No questions asked'];

export default function Guarantee() {
  return (
    <section className="bg-navy py-16 text-white sm:py-20 lg:py-24">
      <div className="container-reading">
        <Reveal className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 text-center sm:p-12">
          {/* Glowing shield seal */}
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-coral text-navy shadow-[0_0_34px_rgba(245,144,117,0.65)]">
            <ShieldCheck className="h-8 w-8" strokeWidth={2.2} />
          </div>

          <span className="mt-6 inline-flex items-center gap-2 rounded-pill border border-coral/40 bg-coral/10 px-4 py-1.5 font-body text-[11.5px] font-bold uppercase tracking-[0.2em] text-coral">
            <Sparkle twinkle className="h-3 w-3" />
            Risk-free
          </span>

          <h2 className="mt-5 text-[26px] font-semibold text-white sm:text-[34px]">
            The Full Reset Guarantee
          </h2>

          <p className="mx-auto mt-5 max-w-xl font-body text-[15.5px] leading-relaxed text-white/80 sm:text-[16.5px]">
            {GUARANTEE_PARAS[0]}
          </p>

          <div className="mt-7 flex flex-wrap justify-center gap-3">
            {CHIPS.map((c) => (
              <span
                key={c}
                className="rounded-pill border border-white/15 bg-white/[0.06] px-4 py-2 font-body text-[13px] font-semibold text-white"
              >
                {c}
              </span>
            ))}
          </div>

          <p className="mt-8 font-serif text-[19px] italic leading-snug text-coral sm:text-[23px]">
            {GUARANTEE_PARAS[1]}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
