import type { Metadata } from 'next';
import WelcomeResetContent from '@/components/webinar/WelcomeResetContent';

export const metadata: Metadata = {
  title: 'Your seat is saved and everything is unlocked | Sonali Badani',
  robots: { index: false, follow: false },
};

/**
 * P3A+ · /welcome-reset-plus  ·  bought The One Partner Reset AND the Love
 * Legacy Visualization.
 *
 * Point TagMango's post-payment redirect for the bundle product here. It is the
 * same page as /welcome-reset plus a Visualization block, an extra line in the
 * inbox list, and the add-on named in the "what's waiting inside" list, so she
 * can see both things she paid for confirmed back to her.
 */
export default function WelcomeResetPlusPage() {
  return <WelcomeResetContent withAddon />;
}
