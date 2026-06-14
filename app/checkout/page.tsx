import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowLeft } from 'lucide-react';
import Logo from '@/components/ui/Logo';
import Footer from '@/components/Footer';
import CheckoutClient from '@/components/checkout/CheckoutClient';

export const metadata: Metadata = {
  title: 'Checkout · The One Partner Reset | Sonali Badani',
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return (
    <>
      <header className="border-b border-navy/10">
        <div className="container-page flex h-16 items-center justify-between">
          <Link href="/" aria-label="Sonali Badani, home" className="flex items-center">
            <Logo height={38} />
          </Link>
          <Link
            href="/"
            className="flex items-center gap-1.5 font-body text-[14px] font-semibold text-navy/70 hover:text-navy"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </Link>
        </div>
      </header>

      <main className="container-page py-12 sm:py-16">
        <div className="mx-auto max-w-4xl">
          <p className="eyebrow mb-3">Almost there</p>
          <h1 className="text-balance text-[28px] font-semibold leading-tight sm:text-[36px]">
            You&rsquo;re one step from your first shift
          </h1>
          <p className="lede mt-4 max-w-reading">
            Enter your details, choose your options, and you&rsquo;ll get instant access plus a link
            to book your 15 minutes with Sonali.
          </p>

          <div className="mt-10">
            <CheckoutClient />
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
