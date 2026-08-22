'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';

import Reveal from '@/components/ui/Reveal';
import Sparkle from '@/components/ui/Sparkle';
import { FAQ as FAQ_CONTENT } from '@/lib/webinar-content';

/**
 * Accordion, all closed by default, one open at a time (per the spec). The
 * answer animates on grid-template-rows so it opens smoothly without needing a
 * measured pixel height, which is what breaks when copy wraps differently on a
 * narrow phone.
 */
export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="bg-warm py-14 sm:py-20 lg:py-24">
      <div className="container-reading">
        <Reveal className="flex items-center justify-center gap-2">
          <Sparkle twinkle className="h-3 w-3 text-gold" />
          <span className="eyebrow">{FAQ_CONTENT.eyebrow}</span>
        </Reveal>

        <div className="mt-6 sm:mt-8">
          {FAQ_CONTENT.items.map((item, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={item.q} delay={i * 45} className="border-b border-navy/12">
                <h3>
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="group flex w-full items-start justify-between gap-4 py-4 text-left transition-colors sm:py-5"
                  >
                    <span className="font-body text-[15px] font-bold leading-snug text-navy transition-colors group-hover:text-coral-dark sm:text-[16.5px]">
                      {item.q}
                    </span>
                    <span
                      aria-hidden="true"
                      className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full text-coral-dark transition-all duration-300 ${
                        isOpen ? 'rotate-45 bg-coral/20' : 'bg-coral/10 group-hover:bg-coral/20'
                      }`}
                    >
                      <Plus className="h-3.5 w-3.5" strokeWidth={2.6} />
                    </span>
                  </button>
                </h3>

                <div
                  className={`grid transition-[grid-template-rows,opacity] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="pb-5 pr-8 font-body text-[14.5px] leading-[1.7] text-navy/75 sm:text-[15.5px]">
                      {item.a}
                    </p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
