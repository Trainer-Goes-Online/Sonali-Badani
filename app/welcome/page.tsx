import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import Logo from '@/components/ui/Logo';
import Footer from '@/components/Footer';
import Reveal from '@/components/ui/Reveal';
import Sparkle from '@/components/ui/Sparkle';
import SuccessMark from '@/components/ui/SuccessMark';
import StepCard from '@/components/webinar/StepCard';
import AddToCalendar from '@/components/webinar/AddToCalendar';
import WhatsAppButton from '@/components/webinar/WhatsAppButton';
import { WELCOME } from '@/lib/webinar-content';

export const metadata: Metadata = {
  title: 'Your seat is saved | The Love Legacy Masterclass',
  robots: { index: false, follow: false },
};

/**
 * P3B · /welcome  ·  registered, seat only.
 *
 * One job: get her into the WhatsApp group. That is where the Zoom link and the
 * reminders go, and show up rate is won there.
 *
 * The second chance card is deliberately quiet and sits last. It is a courtesy
 * for the woman who changed her mind, not a second pitch. No purchase webhook
 * fires here: this woman did not buy.
 */
export default function WelcomePage() {
  return (
    <>
      <header className="border-b border-navy/10 bg-cream">
        <div className="container-page flex h-14 items-center justify-center sm:h-16">
          <Logo height={32} />
        </div>
      </header>

      <main className="pb-14 sm:pb-20">
        {/* Confirmation */}
        <section className="relative overflow-hidden bg-navy-deep py-12 text-center sm:py-16">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-[320px] bg-[radial-gradient(55%_60%_at_50%_0%,rgba(245,144,117,0.2),transparent_70%)]"
          />
          <div className="container-reading relative">
            <Reveal>
              <SuccessMark size={56} />
            </Reveal>
            <Reveal delay={90}>
              <h1 className="mt-6 font-serif text-[30px] font-semibold leading-[1.14] text-white sm:text-[40px]">
                {WELCOME.heading}
              </h1>
            </Reveal>
            <Reveal delay={150}>
              <p className="mx-auto mt-4 max-w-[480px] font-body text-[15px] leading-relaxed text-white/70 sm:text-[16.5px]">
                {WELCOME.sub}
              </p>
            </Reveal>
          </div>
        </section>

        {/* Steps */}
        <div className="container-page -mt-6 sm:-mt-8">
          <div className="mx-auto max-w-[600px] space-y-3.5 sm:space-y-4">
            {WELCOME.steps.map((step, i) => (
              <StepCard
                key={step.n}
                n={step.n}
                title={step.title}
                body={step.body}
                delay={i * 90}
                highlight={i === 0}
              >
                {step.cta && (
                  <WhatsAppButton label={step.cta} page="welcome" className="mt-5" />
                )}
                {i === 1 && (
                  <div className="mt-5">
                    <AddToCalendar page="welcome" />
                  </div>
                )}
              </StepCard>
            ))}

            {/* Second chance, deliberately quiet */}
            <Reveal
              delay={120}
              className="rounded-3xl border border-dashed border-navy/25 bg-warm p-5 sm:p-6"
            >
              <h2 className="font-body text-[14px] font-bold text-navy sm:text-[15.5px]">
                {WELCOME.secondChance.heading}
              </h2>
              <p className="mt-2.5 font-body text-[13.5px] leading-[1.65] text-navy/70 sm:text-[14.5px]">
                {WELCOME.secondChance.body}
              </p>
              <Link
                href="/masterclass/upgrade"
                className="mt-4 flex min-h-[50px] w-full items-center justify-center gap-2 rounded-pill border border-navy/35 bg-transparent px-6 py-3 font-body text-[14px] font-semibold text-navy transition-colors duration-200 hover:border-navy hover:bg-navy hover:text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-navy/20 sm:text-[15px]"
              >
                {WELCOME.secondChance.cta}
                <ArrowRight className="h-4 w-4 shrink-0" />
              </Link>
            </Reveal>

            {/* Closing */}
            <Reveal delay={150} className="pt-4 text-center">
              <Sparkle twinkle className="mx-auto h-4 w-4 text-gold" />
              <p className="mt-3 font-serif text-[16px] italic text-navy/75 sm:text-[18px]">
                {WELCOME.closing}
              </p>
            </Reveal>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
