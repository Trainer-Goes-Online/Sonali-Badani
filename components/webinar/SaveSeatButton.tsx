'use client';

import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRegistration } from './RegistrationProvider';
import { HERO } from '@/lib/webinar-content';

/**
 * The one CTA on the landing page. Every instance opens the same stepwise
 * registration modal, so there is no scroll-to-form jump and no separate inline
 * form to fall out of sync.
 */
export default function SaveSeatButton({
  label = HERO.cta,
  className,
  showArrow = true,
}: {
  label?: string;
  className?: string;
  showArrow?: boolean;
}) {
  const { open } = useRegistration();

  return (
    <button type="button" onClick={open} className={cn('btn-primary', className)}>
      <span className="relative z-[3]">{label}</span>
      {showArrow && <ArrowRight className="relative z-[3] h-5 w-5 shrink-0" />}
    </button>
  );
}
