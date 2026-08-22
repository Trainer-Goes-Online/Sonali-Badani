import type { Metadata, Viewport } from 'next';
import { Fraunces, Mulish } from 'next/font/google';
import Script from 'next/script';
import SmoothScroll from '@/components/SmoothScroll';
import MetaPixel from '@/components/MetaPixel';
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

const DESCRIPTION =
  'A live 90 minute session for married women. See the pattern quietly ruining your marriage, and the first shift you can make from your side alone.';

export const metadata: Metadata = {
  metadataBase: new URL('https://sonalibadani.com'),
  title: {
    default: 'The Love Legacy Masterclass | Sonali Badani',
    template: '%s',
  },
  description: DESCRIPTION,
  openGraph: {
    type: 'website',
    title: 'The Love Legacy Masterclass | Sonali Badani',
    description: DESCRIPTION,
    siteName: 'Sonali Badani · The Soul Space',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Love Legacy Masterclass | Sonali Badani',
    description: DESCRIPTION,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  // Lets the page paint edge to edge behind the notch on iOS, which matters
  // because the sticky CTA sits in the home-indicator zone.
  viewportFit: 'cover',
  themeColor: '#203F5C',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <body className="font-body bg-cream text-navy antialiased">
        <SmoothScroll />
        <MetaPixel />

        {/* Google Analytics 4 (gtag.js) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-TZDBVYV1RL"
          strategy="afterInteractive"
        />
        <Script id="ga4-init" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-TZDBVYV1RL');`}
        </Script>

        {/* Microsoft Clarity */}
        <Script id="ms-clarity" strategy="afterInteractive">
          {`(function(c,l,a,r,i,t,y){
c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
})(window, document, "clarity", "script", "x9tpa5d1pf");`}
        </Script>

        {children}
      </body>
    </html>
  );
}
