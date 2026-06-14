import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';
import Reveal from './Reveal';
import Sparkle from './Sparkle';

/**
 * Standard vertical rhythm for a content section. `tint` adds a faint navy wash
 * (a tint of the locked navy — not a new colour) to gently separate sections.
 */
export function Section({
  id,
  children,
  tint = false,
  className,
}: {
  id?: string;
  children: ReactNode;
  tint?: boolean;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={cn(
        'py-16 sm:py-20 lg:py-24',
        tint && 'bg-warm',
        className
      )}
    >
      {children}
    </section>
  );
}

/** Eyebrow + serif heading + optional lede, centered. */
export function SectionHeading({
  eyebrow,
  title,
  lede,
  align = 'center',
}: {
  eyebrow?: string;
  title: ReactNode;
  lede?: ReactNode;
  align?: 'center' | 'left';
}) {
  return (
    <Reveal className={cn(align === 'center' ? 'text-center' : 'text-left')}>
      {eyebrow && (
        <p className={cn('mb-4 flex items-center gap-2', align === 'center' && 'justify-center')}>
          <Sparkle twinkle className="h-3 w-3 text-coral" />
          <span className="eyebrow">{eyebrow}</span>
        </p>
      )}
      <h2 className="text-balance text-[28px] font-semibold leading-[1.1] tracking-tight sm:text-[36px] lg:text-[42px]">
        {title}
      </h2>
      {lede && (
        <p className={cn('lede mt-5', align === 'center' && 'mx-auto max-w-reading')}>{lede}</p>
      )}
    </Reveal>
  );
}
