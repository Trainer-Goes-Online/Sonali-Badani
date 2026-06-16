import type { Metadata } from 'next';
import { CalendarHeart } from 'lucide-react';

import Logo from '@/components/ui/Logo';
import Footer from '@/components/Footer';
import Reveal from '@/components/ui/Reveal';
import Checklist from '@/components/ui/Checklist';
import CalendlyEmbed from '@/components/CalendlyEmbed';
import SuccessMark from '@/components/ui/SuccessMark';
import FunnelWebhook from '@/components/welcome/FunnelWebhook';

export const metadata: Metadata = {
  title: 'Book Your 15 Minutes With Sonali | The One Partner Reset',
  robots: { index: false, follow: false },
};

const CALL_COVERS = [
  'Understand the specific pattern that is keeping your marriage stuck right now',
  'See the loop underneath the same argument that keeps coming back',
  'Get clarity on what you can begin to shift from your side, tonight',
  'Know your next best step inside the One Partner Reset',
];

export default function WelcomePage() {
  return (
    <>
      <FunnelWebhook />
      <header className="border-b border-navy/10">
        <div className="container-page flex h-16 items-center justify-center">
          <Logo height={42} />
        </div>
      </header>

      <main className="pb-24 md:pb-0">
        {/* 1 · Confirmation + offer of the call */}
        <section className="container-reading pt-14 pb-10 text-center sm:pt-20">
          <Reveal>
            <SuccessMark size={56} />
            <p className="eyebrow mt-6">You're in</p>
            <h1 className="mt-3 text-balance text-[30px] font-semibold leading-[1.12] sm:text-[42px]">
              You&rsquo;ve taken the first step
            </h1>
            <p className="lede mx-auto mt-6 max-w-reading">
              Welcome to the One Partner Reset. Your access details are on their way to your inbox.
              Before you begin, claim the part most women say changes everything:{' '}
              <span className="font-semibold text-navy">your private 15-minute Marriage Assessment
              Call with Sonali.</span> It is already included with your order. This is your moment to
              look at your own situation, one to one, with someone who has sat with thousands of women
              exactly where you are.
            </p>
            <div className="mt-8">
              <a href="#book" className="btn-primary">
                <CalendarHeart className="h-5 w-5" />
                Book Your Call
              </a>
            </div>
          </Reveal>
        </section>

        <hr className="rule" />

        {/* 2 · What the call covers */}
        <section className="container-page py-14 sm:py-16">
          <div className="mx-auto max-w-3xl">
            <Reveal className="text-center">
              <p className="eyebrow mb-3">Your 15 minutes</p>
              <h2 className="text-[26px] font-semibold sm:text-[32px]">What we&rsquo;ll look at together</h2>
            </Reveal>
            <div className="mt-9">
              <Checklist items={CALL_COVERS} columns />
            </div>
          </div>
        </section>

        {/* 3 · No pressure */}
        <section className="bg-warm py-14 sm:py-16">
          <div className="container-reading text-center">
            <Reveal>
              <h2 className="text-[24px] font-semibold sm:text-[30px]">
                A clarity conversation, not a pitch
              </h2>
              <p className="lede mt-6">
                There is no pressure here. The aim is to help you see your situation more clearly, not
                to push you into anything. Come exactly as you are, with complete honesty about where
                things are right now.
              </p>
            </Reveal>
          </div>
        </section>

        {/* 4 · Booking — the only way forward */}
        <section id="book" className="scroll-mt-20 py-14 sm:py-20">
          <div className="container-page">
            <Reveal className="text-center">
              <p className="eyebrow mb-3">Booking</p>
              <h2 className="text-[26px] font-semibold sm:text-[32px]">
                Book your 15 minutes with Sonali
              </h2>
              <p className="lede mx-auto mt-4 max-w-reading">
                Pick a time that works for you below. This is your next step. Once your call is
                booked, you&rsquo;ll be taken straight through to your access instructions.
              </p>
            </Reveal>
            <div className="mt-10">
              <CalendlyEmbed />
            </div>
          </div>
        </section>
      </main>

      {/* Mobile sticky — jumps to the booking section */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-navy/10 bg-white/95 p-3 backdrop-blur md:hidden">
        <a href="#book" className="btn-primary w-full">
          <CalendarHeart className="h-5 w-5" />
          Book Your Call
        </a>
      </div>

      <Footer />
    </>
  );
}
