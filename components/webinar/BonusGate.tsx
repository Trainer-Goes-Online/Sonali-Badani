'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Lock, Unlock } from 'lucide-react';

import Reveal from '@/components/ui/Reveal';
import Sparkle from '@/components/ui/Sparkle';
import BonusContent from '@/components/webinar/BonusContent';
import { BONUS } from '@/lib/webinar-content';
import { BONUS_CODE, BONUS_CODE_LENGTH } from '@/lib/webinar-config';

const STORAGE_KEY = 'llm_bonus_unlocked';

/**
 * The lock from the deck: "The page is locked. You need a four letter word."
 *
 * One box per character rather than a single text field, because the deck hands
 * the word out a letter at a time and separate slots make that visible before
 * she types anything. Auto advance forward, backspace walks back, and a paste of
 * the whole word fills every box at once. Every keystroke is uppercased on the
 * way in, so the boxes always read as capitals whatever case she typed.
 *
 * The word itself is NEXT_PUBLIC_BONUS_CODE, so it can change per cohort. The
 * number of boxes and the copy that says "the four letter word" are both derived
 * from that value and cannot drift from it.
 *
 * Deliberately forgiving. There is no attempt limit and no lockout: a woman who
 * sat through 90 minutes and mistyped one letter must never feel shut out of
 * something she was already promised. The unlock is remembered, so coming back
 * next month for the Pattern Score does not mean finding the notebook again.
 *
 * BonusContent is rendered here rather than accepted as `children`, so the
 * locked page never carries the bonuses in its markup. See the note in
 * app/bonus/page.tsx for how far this gate actually goes.
 */
export default function BonusGate() {
  // null while we read localStorage, so the locked state never flashes for
  // someone who already unlocked it on a previous visit.
  const [unlocked, setUnlocked] = useState<boolean | null>(null);
  const [letters, setLetters] = useState<string[]>(Array(BONUS_CODE_LENGTH).fill(''));
  const [wrong, setWrong] = useState(false);
  const inputs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    let saved = false;
    try {
      saved = window.localStorage.getItem(STORAGE_KEY) === '1';
    } catch {
      // Private mode or blocked storage. She types the word, which is fine.
    }
    setUnlocked(saved);
  }, []);

  const open = useCallback(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, '1');
    } catch {
      // Not being able to remember it is not a reason to withhold the page.
    }
    setUnlocked(true);
  }, []);

  /** Checks on every change, so a correct word opens without pressing anything. */
  const commit = useCallback(
    (next: string[]) => {
      setLetters(next);
      setWrong(false);
      if (next.every(Boolean)) {
        // Both sides are already capitals: every keystroke is uppercased on the
        // way in, and BONUS_CODE is normalised in webinar-config. The extra
        // toUpperCase here is belt and braces, so no future edit to either side
        // can make case the reason she is turned away.
        if (next.join('').toUpperCase() === BONUS_CODE.toUpperCase()) open();
        else setWrong(true);
      }
    },
    [open]
  );

  function handleChange(i: number, raw: string) {
    // A paste lands here as the whole word, so spread it across the boxes.
    // Uppercased below, so typing, pasting and autocorrect all end up in caps
    // whatever case she used.
    const clean = raw.replace(/[^a-zA-Z0-9]/g, '');
    if (!clean) return commit(letters.map((l, k) => (k === i ? '' : l)));

    const next = [...letters];
    for (let k = 0; k < clean.length && i + k < BONUS_CODE_LENGTH; k += 1) {
      next[i + k] = clean[k].toUpperCase();
    }
    commit(next);
    inputs.current[Math.min(i + clean.length, BONUS_CODE_LENGTH - 1)]?.focus();
  }

  function handleKeyDown(i: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace' && !letters[i] && i > 0) {
      e.preventDefault();
      const next = [...letters];
      next[i - 1] = '';
      commit(next);
      inputs.current[i - 1]?.focus();
    }
    if (e.key === 'ArrowLeft' && i > 0) inputs.current[i - 1]?.focus();
    if (e.key === 'ArrowRight' && i < BONUS_CODE_LENGTH - 1) inputs.current[i + 1]?.focus();
  }

  // Nothing painted until we know, so the page never flashes locked then open.
  // The whole gate needs JavaScript to work at all, so a visitor without it
  // gets told plainly rather than left watching a sparkle forever.
  if (unlocked === null) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-5 text-center">
        <Sparkle twinkle className="h-5 w-5 text-gold/60" aria-hidden="true" />
        <noscript>
          <p className="font-body text-[14.5px] leading-relaxed text-navy/70">
            This page needs JavaScript to unlock your bonuses. Turn it on and reload, or ask in
            the WhatsApp group and we will send the three PDFs straight to you.
          </p>
        </noscript>
      </div>
    );
  }

  if (unlocked) return <BonusContent />;

  const ready = letters.every(Boolean);

  return (
    <section className="relative overflow-hidden bg-navy-deep py-16 sm:py-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[380px] bg-[radial-gradient(55%_60%_at_50%_0%,rgba(245,144,117,0.18),transparent_70%)]"
      />

      <div className="container-reading relative text-center">
        <Reveal className="flex items-center justify-center gap-2">
          <Sparkle twinkle className="h-3 w-3 text-gold" />
          <span className="eyebrow">{BONUS.gate.eyebrow}</span>
        </Reveal>

        <Reveal delay={80}>
          <span className="mt-7 inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-white/15 bg-white/[0.06] text-coral glow-chip">
            <Lock className="h-6 w-6" strokeWidth={1.8} />
          </span>
        </Reveal>

        <Reveal delay={130}>
          <h1 className="mt-6 font-serif text-[30px] font-semibold leading-[1.14] text-white sm:text-[40px]">
            {BONUS.gate.heading}
          </h1>
        </Reveal>

        <Reveal delay={180}>
          <p className="mx-auto mt-4 max-w-[440px] font-body text-[15px] leading-relaxed text-white/70 sm:text-[16.5px]">
            {BONUS.gate.sub}
          </p>
        </Reveal>

        {/* One slot per character of the code */}
        <Reveal delay={230}>
          <form
            className="mt-9"
            onSubmit={(e) => {
              e.preventDefault();
              commit(letters);
            }}
          >
            <fieldset>
              <legend className="sr-only">{BONUS.gate.label}</legend>

              {/* Boxes flex rather than sit at a fixed width, so a longer code
                  than the deck's four letters shrinks to fit instead of running
                  off the right edge of a 390px phone. The cap keeps four boxes
                  at the size they were designed at. */}
              <div
                className={`mx-auto flex max-w-[340px] justify-center gap-2 sm:max-w-[400px] sm:gap-3 ${
                  wrong ? 'shake' : ''
                }`}
              >
                {letters.map((letter, i) => (
                  <input
                    key={i}
                    ref={(el) => {
                      inputs.current[i] = el;
                    }}
                    value={letter}
                    onChange={(e) => handleChange(i, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(i, e)}
                    onFocus={(e) => e.target.select()}
                    type="text"
                    inputMode="text"
                    autoCapitalize="characters"
                    autoComplete="off"
                    autoCorrect="off"
                    spellCheck={false}
                    aria-label={`Letter ${i + 1} of ${BONUS_CODE_LENGTH}`}
                    aria-invalid={wrong}
                    className={`h-[68px] min-w-0 max-w-[58px] flex-1 basis-0 rounded-2xl border bg-white/[0.06] text-center font-serif text-[30px] font-semibold uppercase text-white
                                transition-colors duration-200 focus:outline-none focus:ring-4 focus:ring-coral/30 sm:h-[76px] sm:max-w-[66px] sm:text-[34px]
                                ${wrong ? 'border-coral' : letter ? 'border-coral/60' : 'border-white/20 focus:border-coral/60'}`}
                  />
                ))}
              </div>

              <p
                className={`mt-4 font-body text-[13px] ${wrong ? 'text-coral' : 'text-white/45'}`}
                role={wrong ? 'alert' : undefined}
              >
                {wrong ? BONUS.gate.error : BONUS.gate.hint}
              </p>

              {/*
                Two separate looks rather than a disabled modifier on
                .btn-primary. That class carries a gradient background and a
                breathing pulse from an unlayered rule, so a `disabled:bg-*`
                utility loses to it and the button would sit there pulsing at a
                woman who cannot press it yet. Waiting is a flat neutral chip;
                ready lights up coral the moment the fourth letter lands.
              */}
              <button
                type="submit"
                className={
                  ready
                    ? 'btn-primary mt-6 w-full max-w-[340px] sm:w-auto'
                    : 'mt-6 inline-flex min-h-[56px] w-full max-w-[340px] cursor-not-allowed items-center justify-center gap-2 rounded-pill border border-white/15 bg-white/[0.06] px-6 py-4 font-body text-[15px] font-bold text-white/40 sm:w-auto sm:px-8 sm:text-[16px]'
                }
                disabled={!ready}
              >
                <Unlock className="h-[18px] w-[18px]" strokeWidth={2.2} />
                {BONUS.gate.button}
              </button>
            </fieldset>
          </form>
        </Reveal>

        <Reveal delay={280}>
          <p className="mx-auto mt-8 max-w-[420px] border-t border-white/10 pt-6 font-body text-[12.5px] leading-relaxed text-white/45">
            {BONUS.gate.footnote}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
