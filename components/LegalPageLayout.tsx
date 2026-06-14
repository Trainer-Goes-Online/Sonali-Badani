import Link from 'next/link';
import type { ReactNode } from 'react';
import { ArrowLeft } from 'lucide-react';
import Logo from './ui/Logo';
import Footer from './Footer';

/**
 * Shared shell for Privacy / Terms / Refund. The `.legal` styles below restore
 * normal heading + list rendering inside the prose block.
 */
export default function LegalPageLayout({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <>
      <header className="border-b border-navy/10">
        <div className="container-page flex h-16 items-center justify-between">
          <Link href="/" aria-label="Sonali Badani, home" className="flex items-center">
            <Logo height={36} />
          </Link>
          <Link
            href="/"
            className="flex items-center gap-1.5 font-body text-[14px] font-semibold text-navy/70 hover:text-navy"
          >
            <ArrowLeft className="h-4 w-4" /> Back to home
          </Link>
        </div>
      </header>

      <main className="container-reading py-14 sm:py-20">
        <p className="eyebrow mb-3">Legal</p>
        <h1 className="text-[30px] font-semibold sm:text-[38px]">{title}</h1>
        <p className="mt-3 font-body text-[14px] text-navy/55">Last updated: {updated}</p>

        <div className="legal mt-9 font-body text-[15.5px] leading-relaxed text-navy/85">
          {children}
        </div>
      </main>

      <Footer />
    </>
  );
}
