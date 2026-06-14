'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Section, SectionHeading } from '@/components/ui/Section';
import { FAQS } from '@/lib/content';

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <Section tint>
      <div className="container-reading">
        <SectionHeading eyebrow="Honest answers" title="Questions women ask before they start" />

        <div className="mt-10 divide-y divide-navy/10 border-y border-navy/10">
          {FAQS.map((faq, i) => {
            const isOpen = open === i;
            return (
              <div key={faq.q}>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="group flex w-full items-center justify-between gap-4 py-5 text-left"
                >
                  <span className="font-body text-[16px] font-semibold text-navy transition-colors group-hover:text-coral-dark sm:text-[17.5px]">
                    {faq.q}
                  </span>
                  <Plus
                    className={`h-5 w-5 shrink-0 text-coral-dark transition-transform duration-300 group-hover:scale-110 ${
                      isOpen ? 'rotate-45' : ''
                    }`}
                    aria-hidden="true"
                  />
                </button>
                <div
                  className={`grid transition-all duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    isOpen ? 'grid-rows-[1fr] pb-5 opacity-100' : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="font-body text-[15.5px] leading-relaxed text-navy/80">
                      {faq.boldLead ? (
                        <>
                          <span className="font-bold text-navy">{faq.boldLead}</span>{' '}
                          {faq.a.slice(faq.boldLead.length + 1)}
                        </>
                      ) : (
                        faq.a
                      )}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
