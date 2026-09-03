import type Lenis from 'lenis';

/**
 * A handle on the site-wide Lenis instance, so overlays can switch it off.
 *
 * Lenis does not scroll the page the way the browser does. It listens for the
 * wheel globally, calls preventDefault, and moves the page itself. Two things
 * follow from that, and both were live bugs:
 *
 *   1. A scrollable panel inside a modal could not be scrolled with a mouse.
 *      The wheel event never reached it. Touch was unaffected, which is why it
 *      only showed up on desktop.
 *
 *   2. `document.body.style.overflow = 'hidden'` does not lock the page while a
 *      modal is open, because Lenis is not using native scrolling in the first
 *      place. The page kept moving behind the overlay.
 *
 * `data-lenis-prevent` fixes the first on its own, but not the second. Stopping
 * Lenis outright fixes both, and it is the honest thing to do: while a modal
 * owns the screen, the page underneath should not be scrolling at all.
 */

let instance: Lenis | null = null;
/** Nested overlays: only the last one to close may resume scrolling. */
let locks = 0;

export function registerLenis(lenis: Lenis | null) {
  instance = lenis;
  // A modal that opened before Lenis finished initialising still wins.
  if (instance && locks > 0) instance.stop();
}

/** Stop smooth scrolling. Safe to call when Lenis never started. */
export function pauseSmoothScroll() {
  locks += 1;
  instance?.stop();
}

/** Release one lock, resuming only when every overlay has closed. */
export function resumeSmoothScroll() {
  locks = Math.max(0, locks - 1);
  if (locks === 0) instance?.start();
}
