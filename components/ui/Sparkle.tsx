import { cn } from '@/lib/utils';

/**
 * The brand 4-point star (the sparkle inside the logo "o"): guidance, hope, new
 * beginnings. Reused as the decorative motif across the site.
 */
export default function Sparkle({
  className,
  twinkle = false,
}: {
  className?: string;
  twinkle?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={cn('inline-block', twinkle && 'twinkle', className)}
    >
      <path
        d="M12 0c.6 6.3 5.7 11.4 12 12-6.3.6-11.4 5.7-12 12-.6-6.3-5.7-11.4-12-12C6.3 11.4 11.4 6.3 12 0Z"
        fill="currentColor"
      />
    </svg>
  );
}
