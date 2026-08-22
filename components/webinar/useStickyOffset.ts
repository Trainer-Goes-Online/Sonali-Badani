'use client';

import { useEffect, useState } from 'react';

/**
 * Reserves room at the bottom of the page for a fixed sticky bar.
 *
 * The bar is `position: fixed`, so it sits outside the flow and would otherwise
 * cover the last thing on the page, which is always the footer (legal links,
 * copyright, the disclaimer). Measuring the bar and publishing its height as
 * `--sticky-h` lets the footer extend its own padding by exactly that much, so
 * the navy runs behind the bar and nothing is ever hidden underneath it.
 *
 * Returns a **callback ref**, not a RefObject, on purpose. The OTO renders a
 * spinner behind its access gate before the bar exists, so a plain ref would
 * still be null when the effect first ran and would never re-run once the bar
 * mounted. A callback ref re-runs the effect the moment the node attaches.
 *
 * A ResizeObserver keeps the value correct when the bar changes height: copy
 * wrapping at a narrow width, the desktop two-button row, or the iOS safe-area
 * inset appearing as the address bar collapses.
 */
export function useStickyOffset<T extends HTMLElement>() {
  const [node, setNode] = useState<T | null>(null);

  useEffect(() => {
    const root = document.documentElement;
    if (!node) {
      root.style.removeProperty('--sticky-h');
      return;
    }

    const apply = () => {
      root.style.setProperty('--sticky-h', `${Math.ceil(node.offsetHeight)}px`);
    };

    apply();

    const ro = new ResizeObserver(apply);
    ro.observe(node);
    window.addEventListener('resize', apply);
    window.addEventListener('orientationchange', apply);

    return () => {
      ro.disconnect();
      window.removeEventListener('resize', apply);
      window.removeEventListener('orientationchange', apply);
      root.style.removeProperty('--sticky-h');
    };
  }, [node]);

  return setNode;
}
