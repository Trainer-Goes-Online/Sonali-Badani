import type { Metadata } from 'next';
import Link from 'next/link';

import Logo from '@/components/ui/Logo';
import Footer from '@/components/Footer';
import Reveal from '@/components/ui/Reveal';
import Sparkle from '@/components/ui/Sparkle';
import OtoClient from '@/components/oto/OtoClient';
import { OTO } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Your Offer | The One Partner Reset',
  robots: { index: false, follow: false },
};

export default function OtoPage() {
  return (
    <>
      <header className="border-b border-navy/10">
        <div className="container-page flex h-16 items-center justify-center">
          <Link href="/" aria-label="Sonali Badani, home" className="flex items-center">
            <Logo height={42} />
          </Link>
        </div>
      </header>

      <main className="pb-28 lg:pb-0">
        {/* Intro — kept compact so the offer is near the top of the first screen */}
        <section className="container-page pt-7 pb-5 text-center sm:pt-10 sm:pb-7">
          <Reveal as="p" className="mb-3 flex items-center justify-center gap-2">
            <Sparkle twinkle className="h-3 w-3 text-gold" />
            <span className="eyebrow">{OTO.eyebrow}</span>
          </Reveal>
          <Reveal as="h1" className="text-balance text-[26px] font-semibold leading-[1.12] sm:text-[36px]">
            {OTO.heading}
          </Reveal>
          <Reveal as="p" delay={120} className="mx-auto mt-3 hidden max-w-reading font-body text-[15px] leading-relaxed text-navy/80 sm:block sm:text-[16.5px]">
            {OTO.sub}
          </Reveal>
        </section>

        {/* Offer + decision */}
        <section className="container-page pb-14 sm:pb-16">
          <OtoClient />
        </section>
      </main>

      <Footer />
    </>
  );
}
