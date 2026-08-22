import type { Metadata } from 'next';
import WelcomeResetContent from '@/components/webinar/WelcomeResetContent';

export const metadata: Metadata = {
  title: 'Your seat is saved and your Reset is unlocked | Sonali Badani',
  robots: { index: false, follow: false },
};

/**
 * P3A · /welcome-reset  ·  bought The One Partner Reset on its own.
 *
 * Point TagMango's post-payment redirect for the Reset-only product here.
 * Buyers who also took the Love Legacy Visualization go to
 * /welcome-reset-plus instead.
 */
export default function WelcomeResetPage() {
  return <WelcomeResetContent />;
}
