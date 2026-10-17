import type { Metadata } from 'next';

import Logo from '@/components/ui/Logo';
import Footer from '@/components/Footer';
import Reveal from '@/components/ui/Reveal';
import SuccessMark from '@/components/ui/SuccessMark';
import StepCard from '@/components/webinar/StepCard';
import WhatsAppButton from '@/components/webinar/WhatsAppButton';
import GiftStickyBar from '@/components/webinar/GiftStickyBar';
import GiftSection from '@/components/webinar/GiftSection';
import { WELCOME } from '@/lib/webinar-content';
import { MASTERCLASS_NAME } from '@/lib/webinar-config';

export const metadata: Metadata = {
  title: `Your seat is saved | ${MASTERCLASS_NAME}`,
  robots: { index: false, follow: false },
};

/**
 * P3B · /welcome  ·  every registration lands here first.
 *
 * Two jobs, in this order. Get her into the WhatsApp group, because that is
 * where the Zoom link and the reminders go and show up rate is won there. Then
 * the fixed gift bar, which leads on to the one time offer at
 * /masterclass/upgrade. No purchase webhook fires here: this woman has not
 * bought anything.
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
                hideNumber
                badge={WELCOME.firstBadge}
              >
                {step.cta && (
                  <WhatsAppButton label={step.cta} page="welcome" className="mt-5" />
                )}
              </StepCard>
            ))}

            <GiftSection />
          </div>
        </div>
      </main>

      <Footer />

      <GiftStickyBar />
    </>
  );
}
