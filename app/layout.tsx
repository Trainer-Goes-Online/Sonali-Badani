import type { Metadata, Viewport } from 'next';
import { Fraunces, Mulish } from 'next/font/google';
import Script from 'next/script';
import { CHECKOUT_CONFIG } from '@/lib/checkout-config';
import './globals.css';

/**
 * Two fonts, per brand: a serif for the wordmark + display headlines, and a
 * warm humanist sans for everything else. Mulish stands in for the licensed
 * Gangjiem Regular until its font file is dropped into /public/fonts.
 */
const serif = Fraunces({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-serif',
  display: 'swap',
});

const sans = Mulish({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://sonalibadani.com'),
  title: 'The One Partner Reset | Sonali Badani',
  description: `Your marriage isn't broken. You're simply repeating a pattern that's slowly pulling you apart. The One Partner Reset shows you the pattern, and how one shift on your side can begin to change the whole thing, even if he never changes. ₹${CHECKOUT_CONFIG.basePriceRupees}, 14-day money-back guarantee.`,
  openGraph: {
    type: 'website',
    title: 'The One Partner Reset | Sonali Badani',
    description: `Stop surviving your marriage. Start designing your Love Legacy. One shift on your side can begin to change the whole thing. ₹${CHECKOUT_CONFIG.basePriceRupees}.`,
    siteName: 'Sonali Badani · The Soul Space',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The One Partner Reset | Sonali Badani',
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#203F5C',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <body className="font-body bg-white text-ink antialiased">
        {children}

        {/* Razorpay checkout — lazy-loaded so it never blocks first paint. */}
        <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      </body>
    </html>
  );
}
