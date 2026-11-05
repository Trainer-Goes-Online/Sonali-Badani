'use client';

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { CircleCheck, DoorOpen, Maximize, UserCheck } from 'lucide-react';

import Logo from '@/components/ui/Logo';
import dynamic from 'next/dynamic';
import ReplayPlayer, { type ReplayPlayerHandle } from '@/components/webinar/ReplayPlayer';
import { flushOptinRetry, hasOptedIn } from '@/lib/recorded-optin';
import { LIVE_ROOM } from '@/lib/webinar-content';
import { MASTERCLASS_NAME_PARTS, REPLAY, REPLAY_CLASHES_WITH_LIVE } from '@/lib/webinar-config';
import { isProductionBrowser } from '@/lib/production-gate';
import {
  countdownParts,
  crowdAt,
  phaseAt,
  rollCrowd,
  type CrowdSeed,
  type Phase,
} from '@/lib/live-room';

/**
 * /live · the recorded masterclass, played as if live. See lib/live-room.ts
 * for the phases and the head count rules.
 *
 * The clock is the SERVER's (read once from the Date header), not the phone's,
 * so a phone set a few minutes wrong still starts with everybody else.
 *
 * Team preview, locked by a key: `?preview=-6&secret=<PREVIEW_SECRET>` drops
 * you into the room six minutes before the start (`-90` an hour and a half
 * before, `3` three minutes in), and the clock runs on from there. The key is
 * checked on the server (/api/live-preview), so it never appears in the page's
 * code; without the right key, `preview` is ignored and the real clock is used.
 */

// The opt-in pulls in the phone number library and the flag set, so it loads
// on its own, only for a woman who has not opted in yet.
const LiveOptin = dynamic(() => import('@/components/webinar/LiveOptin'), { ssr: false });

const PAD = (n: number) => String(n).padStart(2, '0');

function useRoomClock(startMs: number | null) {
  const [offset, setOffset] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    const finish = (value: number) => {
      if (!cancelled) setOffset(value);
    };

    const realClock = () => {
      const sentAt = Date.now();
      fetch(window.location.pathname, { method: 'HEAD', cache: 'no-store' })
        .then((res) => {
          const header = res.headers.get('date');
          const server = header ? Date.parse(header) : NaN;
          if (!Number.isFinite(server)) return finish(0);
          // Half the round trip, so the estimate lands in the middle of it.
          const midpoint = sentAt + (Date.now() - sentAt) / 2;
          const skew = server - midpoint;
          // The header only has whole seconds: ignore anything that small.
          finish(Math.abs(skew) > 2000 ? skew : 0);
        })
        .catch(() => finish(0));
    };

    // Team time travel, only with the right key. Anything else, including a
    // wrong key or a failed check, falls through to the real clock.
    const params = new URLSearchParams(window.location.search);
    const preview = params.get('preview');
    const secret = params.get('secret');
    const mins = preview === null ? NaN : Number(preview);
    if (secret && startMs !== null && Number.isFinite(mins)) {
      // Read the clock now, so the time spent checking the key is not lost.
      const requestedAt = Date.now();
      fetch('/api/live-preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secret }),
        cache: 'no-store',
      })
        .then((res) => res.json() as Promise<{ ok?: boolean }>)
        .then((data) => {
          if (data.ok) finish(startMs + mins * 60_000 - requestedAt);
          else realClock();
        })
        .catch(realClock);
    } else {
      realClock();
    }

    return () => {
      cancelled = true;
    };
  }, [startMs]);

  const now = useCallback(() => Date.now() + (offset ?? 0), [offset]);
  return { ready: offset !== null, now };
}

/* ── Pieces ───────────────────────────────────────────────────────────────── */

function CountdownCells({ nowMs, startMs, tone }: { nowMs: number; startMs: number; tone: 'navy' | 'gold' }) {
  const p = countdownParts(nowMs, startMs);
  const cells = [
    ...(p.days > 0 ? [{ v: PAD(p.days), l: 'Days' }] : []),
    ...(p.days > 0 || p.hours > 0 ? [{ v: PAD(p.hours), l: 'Hrs' }] : []),
    { v: PAD(p.mins), l: 'Min' },
    { v: PAD(p.secs), l: 'Sec' },
  ];
  const cellCls =
    tone === 'gold'
      ? 'border-gold/45 bg-gold/[0.12]'
      : 'border-coral/35 bg-white/[0.06]';

  return (
    <div
      className={`mx-auto mt-2.5 grid gap-2 sm:mt-4 sm:gap-3 ${
        cells.length === 4
          ? 'max-w-[420px] grid-cols-4'
          : cells.length === 3
            ? 'max-w-[320px] grid-cols-3'
            : 'max-w-[220px] grid-cols-2'
      }`}
    >
      {cells.map((c) => (
        <div
          key={c.l}
          className={`rounded-xl border px-1 py-2 text-center backdrop-blur-sm sm:rounded-2xl sm:py-4 ${cellCls}`}
        >
          <span className="block font-serif text-[22px] font-semibold leading-none tabular-nums text-white sm:text-[34px]">
            {c.v}
          </span>
          <span className="mt-1 block font-body text-[8.5px] font-bold uppercase tracking-[0.14em] text-white/55 sm:mt-1.5 sm:text-[10px]">
            {c.l}
          </span>
        </div>
      ))}
    </div>
  );
}

function CrowdChip({ n, live }: { n: number; live: boolean }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-pill border border-white/15 bg-navy-deep/70 px-2.5 py-1 font-body text-[10.5px] font-semibold text-white/85 backdrop-blur sm:gap-2 sm:px-3 sm:py-1.5 sm:text-[12.5px]">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-coral opacity-70 motion-reduce:animate-none" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-coral" />
      </span>
      <span className="tabular-nums">{live ? LIVE_ROOM.watching(n) : LIVE_ROOM.waiting(n)}</span>
    </span>
  );
}

/* ── The room ─────────────────────────────────────────────────────────────── */

export default function LiveRoom({ sections, footer }: { sections: ReactNode; footer: ReactNode }) {
  const startMs = REPLAY.startMs;
  const { ready, now } = useRoomClock(startMs);

  const [nowMs, setNowMs] = useState<number | null>(null);
  const [seed, setSeed] = useState<CrowdSeed | null>(null);
  // The recording's own length, once the video has told us. Null until then.
  const [durationSec, setDurationSec] = useState<number | null>(null);
  const [ended, setEnded] = useState(false);
  const [playing, setPlaying] = useState(false);
  // The browser would not start with sound (no tap on the page yet), so the
  // video is waiting for one. It is never played muted instead.
  const [soundBlocked, setSoundBlocked] = useState(false);
  const [soundArmed, setSoundArmed] = useState(false);
  const [canFullscreen, setCanFullscreen] = useState(false);
  const [showClash, setShowClash] = useState(false);
  // Null until read from this browser's cookie, so the form never flashes up
  // for a woman who has already opted in.
  const [optedIn, setOptedIn] = useState<boolean | null>(null);

  const playerRef = useRef<ReplayPlayerHandle | null>(null);
  const frameRef = useRef<HTMLDivElement | null>(null);
  const firstPhase = useRef<Phase | null>(null);

  // A fresh head count on every visit and every refresh.
  useEffect(() => {
    setSeed(rollCrowd());
    setCanFullscreen(Boolean(document.fullscreenEnabled));
    // The team sees a misconfigured date; visitors on the real site never do.
    setShowClash(REPLAY_CLASHES_WITH_LIVE && !isProductionBrowser());
    setOptedIn(hasOptedIn());
    void flushOptinRetry();
  }, []);

  // One tick a second drives the countdown, the head count and the phase.
  useEffect(() => {
    if (!ready) return;
    setNowMs(now());
    const id = window.setInterval(() => setNowMs(now()), 1000);
    return () => window.clearInterval(id);
  }, [ready, now]);

  const phase: Phase | null =
    nowMs === null ? null : ended ? 'ended' : phaseAt(nowMs, startMs, durationSec);

  if (phase && firstPhase.current === null) firstPhase.current = phase;

  // Everybody's page switches into the gold room together, as it crosses into
  // the last five minutes. This is an in-place refresh, deliberately NOT a
  // browser reload: a reload makes the browser forget every tap she has made
  // on the page, and without a tap no browser will start the video with sound.
  useEffect(() => {
    if (phase !== 'final' || firstPhase.current !== 'waiting') return;
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [phase]);

  /* ── Not ready, or nothing scheduled ─────────────────────────────────────── */

  if (phase === null || seed === null) {
    return <div className="min-h-[100svh] bg-navy-deep" aria-busy="true" />;
  }

  if (phase === 'unscheduled' || startMs === null) {
    return (
      <>
        <div className="grid min-h-[70svh] place-items-center bg-navy-deep px-5 text-center">
          <div>
            <Logo height={36} />
            <h1 className="mt-8 font-serif text-[26px] font-semibold text-white sm:text-[34px]">
              {LIVE_ROOM.notScheduled.heading}
            </h1>
            <p className="mx-auto mt-3 max-w-[420px] font-body text-[15px] text-white/70">
              {LIVE_ROOM.notScheduled.body}
            </p>
          </div>
        </div>
        {footer}
      </>
    );
  }

  const crowd = crowdAt(nowMs as number, startMs, seed);
  const isLive = phase === 'live';
  const showOverlay = !(isLive && playing);

  /* ── The player frame, shared by every phase ─────────────────────────────── */

  const overlayBody = (() => {
    if (phase === 'ended') {
      return (
        <div className="px-6 text-center">
          <h2 className="font-serif text-[24px] font-semibold text-white sm:text-[32px]">
            {LIVE_ROOM.ended.heading}
          </h2>
          <p className="mx-auto mt-3 max-w-[420px] font-body text-[14px] leading-relaxed text-white/70 sm:text-[15.5px]">
            {LIVE_ROOM.ended.body}
          </p>
        </div>
      );
    }
    if (isLive && soundBlocked) {
      // One tap starts it with sound, from wherever the room has reached.
      return (
        <div className="px-6 text-center">
          <button
            type="button"
            onClick={() => playerRef.current?.join()}
            className="btn-primary !min-h-[52px] !text-[15px] sm:!text-[17px]"
          >
            <DoorOpen className="relative z-[3] h-[18px] w-[18px]" strokeWidth={2.2} />
            <span className="relative z-[3]">{LIVE_ROOM.joinCta}</span>
          </button>
          <p className="mx-auto mt-3.5 max-w-[300px] text-center font-body text-[12.5px] font-semibold leading-snug text-white/80 sm:max-w-none sm:text-[14px]">
            {/* Inline, so the live dot stays on the first line when it wraps. */}
            <span className="relative mr-2 inline-flex h-2 w-2 align-middle">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-coral opacity-70 motion-reduce:animate-none" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-coral" />
            </span>
            {LIVE_ROOM.joinNote}
          </p>
        </div>
      );
    }
    if (isLive) {
      // Live, but the first frame has not painted yet. Words, never a spinner.
      return (
        <p className="font-serif text-[22px] font-semibold text-white sm:text-[30px]">
          {firstPhase.current === 'live' ? LIVE_ROOM.joining : LIVE_ROOM.startingNow}
        </p>
      );
    }
    return (
      <div className="w-full px-4 pt-7 text-center sm:pt-0">
        <p className="font-body text-[10.5px] font-bold uppercase tracking-[0.2em] text-coral sm:text-[12px]">
          {phase === 'final' ? LIVE_ROOM.finalLabel : LIVE_ROOM.countdownLabel}
        </p>
        <CountdownCells nowMs={nowMs as number} startMs={startMs} tone={phase === 'final' ? 'gold' : 'navy'} />
        {phase === 'final' && (
          <button
            type="button"
            onClick={() => setSoundArmed(true)}
            disabled={soundArmed}
            className="mx-auto mt-3 flex max-w-[300px] items-center gap-2 rounded-pill border border-white/25 bg-white/10 px-3.5 py-1.5 text-left font-body text-[11.5px] font-semibold leading-snug text-white sm:max-w-none transition-colors hover:bg-white/15 disabled:cursor-default disabled:border-coral/40 disabled:bg-coral/15 sm:mt-5 sm:text-[13px]"
          >
            {soundArmed ? (
              <CircleCheck className="h-4 w-4 shrink-0 text-coral" strokeWidth={2.2} />
            ) : (
              <UserCheck className="h-4 w-4 shrink-0" strokeWidth={2.2} />
            )}
            {soundArmed ? LIVE_ROOM.soundReady : LIVE_ROOM.soundCta}
          </button>
        )}
      </div>
    );
  })();

  const frame = (
    <div
      ref={frameRef}
      onContextMenu={(e) => e.preventDefault()}
      className={`relative aspect-video w-full select-none overflow-hidden bg-navy-deep shadow-[0_30px_80px_-30px_rgba(21,41,60,0.8)] ring-1 ring-white/10 [&:fullscreen]:rounded-none ${
        phase === 'waiting' ? 'rounded-2xl sm:rounded-3xl' : 'rounded-none sm:rounded-2xl'
      }`}
    >
      {/* The video exists from the final five minutes on, buffering quietly. */}
      {(phase === 'final' || isLive) && REPLAY.videoUrl && (
        <ReplayPlayer
          ref={playerRef}
          src={REPLAY.videoUrl}
          startMs={startMs}
          now={now}
          active={isLive}
          onPlaying={() => setPlaying(true)}
          onEnded={() => setEnded(true)}
          onDuration={(s) => setDurationSec(s)}
          onSoundBlocked={setSoundBlocked}
        />
      )}

      {/* Countdown / starting / ended layer. Fades away once the picture plays. */}
      <div
        aria-hidden={!showOverlay}
        className={`absolute inset-0 grid place-items-center bg-[radial-gradient(70%_80%_at_50%_0%,rgba(245,144,117,0.22),transparent_70%),linear-gradient(180deg,#203F5C,#15293C)] transition-opacity duration-700 ${
          showOverlay ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        {overlayBody}
      </div>

      {/* Head count, top right of the player, while the room is counting down. */}
      {(phase === 'waiting' || phase === 'final') && (
        <div className="absolute right-3 top-3 z-10 sm:right-4 sm:top-4">
          <CrowdChip n={crowd} live={false} />
        </div>
      )}

      {/*
        Live chrome: the LIVE badge, the head count and full screen. Nothing
        else: no progress bar, no play or pause, no volume. Sound is the
        browser's business, like any real broadcast.
      */}
      {isLive && playing && (
        <>
          <div className="absolute left-3 top-3 z-10 flex items-center gap-2 sm:left-4 sm:top-4">
            <span className="inline-flex items-center gap-1.5 rounded-md bg-coral px-2 py-1 font-body text-[10.5px] font-bold uppercase tracking-[0.14em] text-navy sm:text-[11.5px]">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-navy motion-reduce:animate-none" />
              {LIVE_ROOM.live}
            </span>
            <CrowdChip n={crowd} live />
          </div>

          {canFullscreen && (
            <button
              type="button"
              aria-label="Full screen"
              onClick={() => {
                if (document.fullscreenElement) void document.exitFullscreen();
                else void frameRef.current?.requestFullscreen();
              }}
              className="absolute bottom-3 right-3 z-10 grid h-10 w-10 place-items-center rounded-full bg-navy-deep/70 text-white backdrop-blur transition-colors hover:bg-navy-deep/90 sm:bottom-4 sm:right-4"
            >
              <Maximize className="h-[18px] w-[18px]" />
            </button>
          )}

        </>
      )}
    </div>
  );

  /* ── Final five minutes, live and ended: the gold room ───────────────────── */

  const clashBanner = showClash ? (
    <div role="alert" className="bg-coral px-4 py-2.5 text-center font-body text-[12.5px] font-bold leading-snug text-navy">
      {LIVE_ROOM.clashWarning}
    </div>
  ) : null;

  // The mandatory opt-in, over every phase where she can still get into the
  // room. Submitting it is also the tap that lets the video start with sound.
  const optinModal =
    optedIn === false && phase !== 'ended' ? (
      <LiveOptin
        nowMs={nowMs as number}
        startMs={startMs}
        live={isLive}
        onDone={() => {
          setOptedIn(true);
          setSoundArmed(true);
          // Already live: the tap that submitted the form starts the picture.
          if (isLive) playerRef.current?.join();
        }}
      />
    ) : null;

  // Theatre mode, from the last five minutes on: the player takes the largest
  // 16:9 the screen allows (edge to edge on a phone), on the gold room.
  if (phase !== 'waiting') {
    return (
      <>
        {clashBanner}
        {optinModal}
        <main className="flex min-h-[100svh] items-center justify-center bg-[#C2A36B] sm:p-4">
          <div className="w-full sm:w-[min(100%,calc((100svh-2rem)*16/9))]">{frame}</div>
        </main>
      </>
    );
  }

  /* ── Waiting room ────────────────────────────────────────────────────────── */

  const [first, second] = MASTERCLASS_NAME_PARTS;

  return (
    <>
      {clashBanner}
      {optinModal}
      <header className="border-b border-navy/10 bg-cream">
        <div className="container-page flex h-14 items-center justify-center sm:h-16">
          <Logo height={32} />
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden bg-navy-deep pb-12 pt-9 sm:pb-16 sm:pt-12">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-[360px] bg-[radial-gradient(55%_60%_at_50%_0%,rgba(245,144,117,0.18),transparent_70%)]"
          />
          <div className="container-page relative">
            <div className="text-center">
              <span className="inline-flex items-center gap-2 rounded-pill border border-coral/35 bg-coral/10 px-3.5 py-1.5 font-body text-[10.5px] font-bold uppercase tracking-[0.18em] text-coral sm:text-[11.5px]">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-coral opacity-70 motion-reduce:animate-none" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-coral" />
                </span>
                {LIVE_ROOM.eyebrow}
              </span>
              <h1 className="mt-4 font-serif text-[30px] font-semibold uppercase leading-[1.08] sm:text-[44px] lg:text-[52px]">
                <span className={`block ${second ? 'text-white/60' : 'text-white'}`}>{first}</span>
                {second && <span className="block text-coral">{second}</span>}
              </h1>
              {REPLAY.date && (
                <p className="mt-3 font-body text-[14px] text-white/70 sm:text-[16px]">
                  {LIVE_ROOM.startsPrefix} {REPLAY.date} · {REPLAY.time} IST
                </p>
              )}
            </div>

            <div className="mx-auto mt-7 max-w-[960px] sm:mt-9">{frame}</div>

            <p className="mx-auto mt-4 max-w-[520px] text-center font-body text-[12.5px] leading-relaxed text-white/55 sm:text-[13.5px]">
              {LIVE_ROOM.note}
            </p>
          </div>
        </section>

        {sections}
      </main>

      {footer}
    </>
  );
}
