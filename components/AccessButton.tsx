import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * The single repeating landing CTA. Always the same label and destination:
 * it sends her to the dedicated checkout page (Landing → Checkout → ...).
 */
export default function AccessButton({
  label = 'Get Instant Access',
  className,
  showArrow = true,
}: {
  label?: string;
  className?: string;
  showArrow?: boolean;
}) {
  return (
    <Link href="/checkout" className={cn('btn-primary', className)}>
      {label}
      {showArrow && <ArrowRight className="h-5 w-5 shrink-0" />}
    </Link>
  );
}
