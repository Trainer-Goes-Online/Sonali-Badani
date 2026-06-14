/**
 * Confirmation checkmark for the thank-you / welcome pages: the coral disc
 * scales in and the tick draws itself once. A deliberate "first-time delight"
 * moment (seen exactly once, right after a purchase).
 *
 * Pure CSS (see `.success-mark` in globals.css) so these post-purchase pages
 * stay JS-light, matching the site's reveal approach. The global
 * prefers-reduced-motion rule collapses it to a static, fully-drawn mark.
 */
export default function SuccessMark({ size = 64 }: { size?: number }) {
  const tick = Math.round(size * 0.46);

  return (
    <span
      aria-hidden="true"
      style={{ width: size, height: size }}
      className="success-mark mx-auto grid place-items-center rounded-full bg-coral/15 text-coral-dark"
    >
      <svg width={tick} height={tick} viewBox="0 0 24 24" fill="none">
        <path
          className="success-mark__tick"
          d="M4 12.5l5 5 11-11"
          stroke="currentColor"
          strokeWidth={2.6}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}
