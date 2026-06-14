import { Check, X } from 'lucide-react';
import Reveal from './Reveal';

/**
 * Reusable checklist. `variant="yes"` shows coral checks, `variant="no"` shows
 * navy crosses (used by the qualify-out section). Items stagger in on scroll.
 */
export default function Checklist({
  items,
  variant = 'yes',
  columns = false,
}: {
  items: string[];
  variant?: 'yes' | 'no';
  columns?: boolean;
}) {
  const Icon = variant === 'yes' ? Check : X;

  return (
    <ul
      className={
        columns
          ? 'grid gap-x-8 gap-y-4 sm:grid-cols-2'
          : 'space-y-4'
      }
    >
      {items.map((item, i) => (
        <Reveal as="li" key={item} delay={Math.min(i * 60, 360)} className="check-item">
          <span
            className={
              variant === 'yes'
                ? 'mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-coral/15'
                : 'mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-navy/10'
            }
            aria-hidden="true"
          >
            <Icon
              className={variant === 'yes' ? 'h-3.5 w-3.5 text-coral-dark' : 'h-3.5 w-3.5 text-navy'}
              strokeWidth={3}
            />
          </span>
          <span>{item}</span>
        </Reveal>
      ))}
    </ul>
  );
}
