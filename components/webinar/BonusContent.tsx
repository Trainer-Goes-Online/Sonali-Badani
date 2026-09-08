'use client';

import { Download, Printer } from 'lucide-react';

import Reveal from '@/components/ui/Reveal';
import Sparkle from '@/components/ui/Sparkle';
import WhatsAppButton from '@/components/webinar/WhatsAppButton';
import { BONUS } from '@/lib/webinar-content';

/**
 * Everything behind the lock.
 *
 * Deliberately a client component rather than `children` passed into the gate.
 * Server-rendered children are serialised into the RSC payload whatever the
 * gate decides, so a locked page would still carry the whole thing, download
 * links included, in view-source. Keeping it this side of the boundary means
 * the locked page ships the lock and nothing else.
 *
 * Worth being straight about the limit: the PDFs live in /public, so anyone who
 * knows a URL can fetch one directly. This is the deck's "stay to the end"
 * ceremony, not an access control system. See the note in app/bonus/page.tsx.
 *
 * Structure follows the deck: "Three things I am giving you" as three numbered
 * cards with a value on each, then how to actually use them, then the safety
 * line she says once, then the close.
 */
export default function BonusContent() {
  return (
      <main>
        {/* Opening, on navy: the deck's title slide treatment */}
        <section className="relative overflow-hidden bg-navy-deep py-14 text-center sm:py-20">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-[360px] bg-[radial-gradient(55%_60%_at_50%_0%,rgba(245,144,117,0.2),transparent_70%)]"
          />

          <div className="container-reading relative">
            <Reveal className="flex items-center justify-center gap-2">
              <Sparkle twinkle className="h-3 w-3 text-gold" />
              <span className="eyebrow">{BONUS.eyebrow}</span>
            </Reveal>

            <Reveal delay={90}>
              <h1 className="mt-5 font-serif text-[31px] font-semibold leading-[1.12] text-white sm:text-[44px]">
                {BONUS.heading}
              </h1>
            </Reveal>

            <span
              aria-hidden="true"
              className="mx-auto mt-6 block h-px w-24 bg-gradient-to-r from-transparent via-coral/60 to-transparent"
            />

            <Reveal delay={150}>
              <p className="mx-auto mt-6 max-w-[480px] font-body text-[15px] leading-relaxed text-white/70 sm:text-[16.5px]">
                {BONUS.sub}
              </p>
            </Reveal>
          </div>
        </section>

        {/* The three bonuses */}
        <section className="bg-cream py-12 sm:py-16 lg:py-20">
          <div className="container-page">
            <div className="mx-auto grid max-w-[420px] gap-4 sm:max-w-[520px] lg:max-w-none lg:grid-cols-3 lg:gap-5">
              {BONUS.items.map((item, i) => (
                <Reveal
                  key={item.n}
                  delay={i * 90}
                  className="group flex h-full flex-col rounded-3xl border border-navy/10 bg-warm p-6 transition-shadow duration-300 hover:shadow-card sm:p-7"
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="font-serif text-[13px] font-semibold tracking-[0.18em] text-coral">
                      {item.n}
                    </span>
                    <span className="rounded-pill bg-navy/[0.06] px-2.5 py-1 font-body text-[10.5px] font-bold uppercase tracking-[0.12em] text-navy/55">
                      Value {item.value}
                    </span>
                  </div>

                  <h2 className="mt-3 font-serif text-[23px] font-semibold leading-tight text-navy sm:text-[25px]">
                    {item.name}
                    {item.tm && (
                      <sup className="ml-0.5 align-super font-body text-[9px] font-bold tracking-normal text-navy/45">
                        TM
                      </sup>
                    )}
                  </h2>

                  <p className="mt-3 font-serif text-[16px] italic leading-snug text-navy/70 sm:text-[17px]">
                    {item.pull}
                  </p>

                  <p className="mt-4 font-body text-[14px] leading-[1.68] text-navy/80 sm:text-[14.5px]">
                    {item.body}
                  </p>

                  {/* mt-auto pins the actions to the bottom, so all three
                      cards line up however long the copy runs. */}
                  <div className="mt-auto pt-6">
                    <a
                      href={item.file}
                      download={item.download}
                      className="btn-primary w-full !px-4 text-[14px] sm:text-[15px]"
                    >
                      <Download className="h-[17px] w-[17px]" strokeWidth={2.2} />
                      Download the PDF
                    </a>

                    <a
                      href={item.file}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2.5 flex items-center justify-center gap-1.5 font-body text-[12.5px] font-semibold text-navy/55 underline decoration-navy/20 underline-offset-4 transition-colors hover:text-navy hover:decoration-navy/50"
                    >
                      <Printer className="h-[13px] w-[13px]" strokeWidth={2.2} />
                      Open it to print
                    </a>
                  </div>
                </Reveal>
              ))}
            </div>

            {/* Value stack, the deck's totalling slide in one quiet line */}
            <Reveal
              delay={120}
              className="mx-auto mt-7 flex max-w-[420px] flex-col items-center gap-1 rounded-3xl border border-gold/30 bg-gold-soft/40 px-6 py-5 text-center sm:mt-9 sm:max-w-[520px] lg:max-w-[640px]"
            >
              <p className="font-body text-[10.5px] font-bold uppercase tracking-[0.16em] text-navy/50">
                {BONUS.stack.label}
              </p>
              <p className="font-serif text-[28px] font-semibold leading-none text-navy sm:text-[32px]">
                {BONUS.stack.total}
              </p>
              <p className="mt-1 font-body text-[13px] text-navy/65">{BONUS.stack.note}</p>
            </Reveal>
          </div>
        </section>

        {/* How to use them */}
        <section className="bg-warm py-12 sm:py-16">
          <div className="container-reading">
            <Reveal className="flex items-center justify-center gap-2">
              <Sparkle twinkle className="h-3 w-3 text-gold" />
              <span className="eyebrow">Before you close this</span>
            </Reveal>

            <Reveal delay={80}>
              <h2 className="mt-4 text-center font-serif text-[25px] font-semibold leading-tight text-navy sm:text-[32px]">
                {BONUS.howTo.heading}
              </h2>
            </Reveal>

            <ol className="mx-auto mt-8 max-w-[560px] space-y-3.5">
              {BONUS.howTo.steps.map((step, i) => (
                <Reveal
                  key={step}
                  delay={i * 80}
                  as="li"
                  className="flex items-start gap-4 rounded-2xl border border-navy/10 bg-white/70 p-5"
                >
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-navy font-body text-[12px] font-bold text-white">
                    {i + 1}
                  </span>
                  <p className="font-body text-[14.5px] leading-[1.68] text-navy/85 sm:text-[15.5px]">
                    {step}
                  </p>
                </Reveal>
              ))}
            </ol>

            <Reveal delay={120}>
              <p className="mx-auto mt-8 max-w-[560px] border-t border-navy/10 pt-6 text-center font-body text-[12.5px] leading-relaxed text-navy/55">
                {BONUS.safety}
              </p>
            </Reveal>
          </div>
        </section>

        {/* Close */}
        <section className="relative overflow-hidden bg-navy py-14 text-center sm:py-[72px]">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-[300px] bg-[radial-gradient(60%_70%_at_50%_100%,rgba(245,144,117,0.18),transparent_70%)]"
          />

          <div className="container-reading relative">
            <Reveal>
              <h2 className="font-serif text-[26px] font-semibold leading-[1.2] text-white sm:text-[34px]">
                {BONUS.close.heading}
              </h2>
            </Reveal>

            <Reveal delay={90}>
              <p className="mx-auto mt-5 max-w-[460px] font-body text-[15px] leading-relaxed text-white/70 sm:text-[16px]">
                {BONUS.close.body}
              </p>
            </Reveal>

            <Reveal delay={150} className="mt-8">
              <WhatsAppButton label={BONUS.close.cta} page="bonus" />
            </Reveal>
          </div>
        </section>
      </main>
  );
}
