'use client';

import dynamic from 'next/dynamic';
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

/**
 * The modal is code-split and only fetched once a CTA is tapped.
 *
 * This matters: the phone field pulls in libphonenumber-js and the full country
 * flag set, which together are the single heaviest thing in this app. Keeping
 * them out of the landing page's first load is what holds P1 to the spec's
 * "under 2 seconds on 4G" and its Lighthouse target. `ssr: false` because the
 * modal is never part of the initial render anyway.
 */
const RegistrationModal = dynamic(() => import('./RegistrationModal'), { ssr: false });

type Ctx = {
  open: () => void;
  close: () => void;
  isOpen: boolean;
};

const RegistrationContext = createContext<Ctx | null>(null);

/**
 * Holds the single registration modal for the landing page and exposes
 * `openRegistration()` to every CTA below it. One modal instance, one piece of
 * state, so a button anywhere on the page opens the same form.
 */
export default function RegistrationProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  // Stays true after the first open, so closing and reopening is instant rather
  // than re-mounting (and refetching) the chunk each time.
  const [mounted, setMounted] = useState(false);

  const open = useCallback(() => {
    setMounted(true);
    setIsOpen(true);
  }, []);
  const close = useCallback(() => setIsOpen(false), []);

  const value = useMemo(() => ({ open, close, isOpen }), [open, close, isOpen]);

  return (
    <RegistrationContext.Provider value={value}>
      {children}
      {mounted && <RegistrationModal open={isOpen} onClose={close} />}
    </RegistrationContext.Provider>
  );
}

/**
 * Read the modal controls. Returns a no-op `open` outside the provider so a CTA
 * rendered on another page never throws.
 */
export function useRegistration(): Ctx {
  const ctx = useContext(RegistrationContext);
  return ctx ?? { open: () => {}, close: () => {}, isOpen: false };
}
