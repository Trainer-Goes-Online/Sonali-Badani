import type { Metadata } from 'next';

import Logo from '@/components/ui/Logo';
import Footer from '@/components/Footer';
import BonusGate from '@/components/webinar/BonusGate';
import { MASTERCLASS_NAME } from '@/lib/webinar-config';

export const metadata: Metadata = {
  title: `Your bonuses | ${MASTERCLASS_NAME}`,
  // Locked, and only meaningful to someone who sat through the session. It has
  // no business showing up in search results next to the registration page.
  robots: { index: false, follow: false },
};

/**
 * The bonus page Sonali points at from the stage.
 *
 * The deck locks this one on purpose: "The page is locked. You need a four
 * letter word", with L, O, V and E handed out across the session and the last
 * letter arriving right at the end. The lock is the reason she stays, so it is
 * a real gate rather than decoration.
 *
 * How far the lock actually goes: the page ships the lock and nothing else, so
 * the bonuses are not sitting in view-source. But the PDFs are static files in
 * /public, which means a direct URL still fetches one. That is the honest
 * boundary of a client side gate, and it is the right trade here, since these
 * are free bonuses and the word is a ceremony for the room rather than a
 * secret. If it ever needs to be airtight, the files move out of /public and
 * behind an API route that checks a signed cookie set at unlock.
 *
 * The shell stays a server component so the metadata and the chrome render
 * without waiting on JavaScript. Everything below the lock lives in
 * BonusContent, on the client side of the boundary.
 */
export default function BonusPage() {
  return (
    <>
      <header className="border-b border-navy/10 bg-cream">
        <div className="container-page flex h-14 items-center justify-center sm:h-16">
          <Logo height={32} />
        </div>
      </header>

      <BonusGate />

      <Footer />
    </>
  );
}
