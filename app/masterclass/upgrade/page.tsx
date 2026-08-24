import type { Metadata } from 'next';
import { Suspense } from 'react';

import Logo from '@/components/ui/Logo';
import Footer from '@/components/Footer';
import ScrollProgress from '@/components/ui/ScrollProgress';
import UpgradeClient from '@/components/webinar/UpgradeClient';
import { MASTERCLASS_NAME } from '@/lib/webinar-config';

export const metadata: Metadata = {
  title: `One small decision | ${MASTERCLASS_NAME}`,
  // Never indexed: this page is only meaningful straight after a registration.
  robots: { index: false, follow: false },
};

/**
 * P2 · /masterclass/upgrade
 *
 * The one time offer, shown the instant she registers. The client component
 * holds the decision, the access gate and the checkout hop; this shell provides
 * the chrome so the header and footer render on the server.
 */
export default function UpgradePage() {
  return (
    <>
      <ScrollProgress />

      <header className="border-b border-navy/10 bg-cream">
        <div className="container-page flex h-14 items-center justify-center sm:h-16">
          <Logo height={32} />
        </div>
      </header>

      <Suspense
        fallback={
          <div className="grid min-h-[60vh] place-items-center px-5">
            <span
              aria-label="Loading"
              className="h-7 w-7 animate-spin rounded-full border-2 border-navy/20 border-t-coral"
            />
          </div>
        }
      >
        <UpgradeClient />
      </Suspense>

      <Footer />
    </>
  );
}
