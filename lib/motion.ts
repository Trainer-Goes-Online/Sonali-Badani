/**
 * Shared Framer Motion primitives.
 *
 * The site's CSS already handles scroll-reveals (see `.reveal` in globals.css)
 * and list staggering (see Checklist + Reveal) very cheaply, so those stay as
 * they are. Framer Motion is reserved for the interactive moments CSS can't do
 * well: the swipeable testimonials carousel and the checkout micro-interactions.
 *
 * Easing tuples mirror the CSS custom curves so JS and CSS motion feel identical.
 */
import type { Variants } from 'framer-motion';

/** Mirrors `--ease-out-expo` in globals.css. */
export const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;
/** Mirrors `--ease-out-quart` in globals.css. */
export const EASE_OUT_QUART = [0.25, 1, 0.5, 1] as const;

/** Soft fade-up, matched to the CSS `.reveal` timing. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE_OUT_EXPO } },
};

/**
 * Horizontal shake for an invalid form submission. Transform-only so it stays
 * on the GPU. Kept short and decisive (no elastic), consistent with the site's
 * "no bounce" motion rule.
 */
export const shake = {
  x: [0, -8, 8, -6, 6, -3, 0],
  transition: { duration: 0.42, ease: 'easeInOut' as const },
};

/** Snap transition for the testimonials carousel track. */
export const carouselSpring = { type: 'spring' as const, stiffness: 300, damping: 34 };
