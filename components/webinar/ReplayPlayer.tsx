'use client';

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';

/**
 * The recording, played as if live.
 *
 * - No `controls`, so there is no progress bar, no scrubber, and no browser
 *   loading spinner (the spinner belongs to the native controls).
 * - Nobody can pause or seek. The position always follows the wall clock:
 *   a late joiner lands where the room already is, and a phone that drifts
 *   (a stall, a locked screen) is pulled back into step.
 * - It starts loading while the room is still counting down (`preload`), so at
 *   the start moment the first frames are already buffered.
 * - HLS (.m3u8) is played through hls.js wherever Media Source exists, and
 *   natively only where it does not (iPhone Safari). hls.js is imported only
 *   when an HLS link is actually configured.
 */

export type ReplayPlayerHandle = {
  /**
   * Play from the current wall clock position, with sound. Safe to call
   * repeatedly. Called from a tap, it always succeeds.
   */
  join: () => void;
};

type Props = {
  src: string;
  startMs: number;
  /** The synced clock, in epoch ms. */
  now: () => number;
  /** True from the start moment on. Before that the video only buffers. */
  active: boolean;
  onPlaying: () => void;
  onEnded: () => void;
  onDuration: (seconds: number) => void;
  /**
   * The browser refused to start with sound because nobody has tapped this
   * page yet. The video is NOT played muted instead: it waits for one tap.
   */
  onSoundBlocked: (blocked: boolean) => void;
};

/** How far the picture may drift from the room before it is pulled back. */
const MAX_DRIFT_S = 8;

const ReplayPlayer = forwardRef<ReplayPlayerHandle, Props>(function ReplayPlayer(
  { src, startMs, now, active, onPlaying, onEnded, onDuration, onSoundBlocked },
  ref
) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const activeRef = useRef(active);
  activeRef.current = active;
  const [ready, setReady] = useState(false);

  // Callbacks change identity on every parent render; read them through a ref.
  const cb = useRef({ onPlaying, onEnded, onDuration, onSoundBlocked, now });
  cb.current = { onPlaying, onEnded, onDuration, onSoundBlocked, now };

  const elapsedS = () => Math.max(0, (cb.current.now() - startMs) / 1000);

  /* ── Source ─────────────────────────────────────────────────────────────── */

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;

    let destroyed = false;
    let hls: { destroy: () => void } | null = null;
    const isHls = /\.m3u8(\?|$)/i.test(src);

    const attach = async () => {
      // hls.js wherever Media Source works, native HLS only as the fallback
      // (iPhone Safari). Newer Chrome claims native HLS too ("maybe"), but its
      // native path stalls after a seek, which is exactly what a late joiner does.
      if (isHls) {
        const { default: Hls } = await import('hls.js');
        if (destroyed) return;
        if (Hls.isSupported()) {
          const instance = new Hls({
            // Buffer from wherever the room is, so a late joiner does not
            // download the opening minutes only to skip them.
            startPosition: elapsedS(),
            maxBufferLength: 30,
          });
          instance.loadSource(src);
          instance.attachMedia(video);
          hls = instance;
          setReady(true);
          return;
        }
      }
      video.src = src;
      video.load();
      setReady(true);
    };

    void attach();
    return () => {
      destroyed = true;
      hls?.destroy();
      video.removeAttribute('src');
      video.load();
    };
    // `startMs` and `src` are fixed for the life of the page.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src]);

  /* ── Playing ────────────────────────────────────────────────────────────── */

  const syncPosition = (video: HTMLVideoElement, force = false) => {
    if (video.readyState < 1) return;
    const target = elapsedS();
    if (Number.isFinite(video.duration) && target >= video.duration) {
      cb.current.onEnded();
      return;
    }
    if (force ? Math.abs(video.currentTime - target) > 1 : Math.abs(video.currentTime - target) > MAX_DRIFT_S) {
      video.currentTime = target;
    }
  };

  const join = async () => {
    const video = videoRef.current;
    if (!video || !activeRef.current) return;

    if (video.readyState < 1) {
      video.addEventListener('loadedmetadata', () => void join(), { once: true });
      return;
    }

    syncPosition(video, true);
    if (!video.paused) return;

    // Always with sound, never muted. Every browser refuses sound until the
    // page has had a tap; when that happens the video waits, unplayed, and the
    // room asks for one tap. That tap calls join() again, which re-syncs to
    // the live point first, so nothing she missed while waiting is replayed.
    try {
      video.muted = false;
      await video.play();
      cb.current.onSoundBlocked(false);
    } catch {
      cb.current.onSoundBlocked(true);
    }
  };

  useImperativeHandle(ref, () => ({
    join: () => void join(),
  }));

  useEffect(() => {
    if (active && ready) void join();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, ready]);

  /* ── Keeping it live ────────────────────────────────────────────────────── */

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onMeta = () => {
      if (Number.isFinite(video.duration)) cb.current.onDuration(video.duration);
    };
    const onPlayingEv = () => cb.current.onPlaying();
    const onEndedEv = () => cb.current.onEnded();
    // There is no pause button, so a pause is the system's doing (a locked
    // phone, a call). Carry on as soon as the page is looked at again.
    const onPause = () => {
      if (activeRef.current && !video.ended && document.visibilityState === 'visible') {
        void join();
      }
    };
    const onVisible = () => {
      if (document.visibilityState === 'visible' && activeRef.current) {
        syncPosition(video, true);
        void join();
      }
    };

    video.addEventListener('loadedmetadata', onMeta);
    video.addEventListener('playing', onPlayingEv);
    video.addEventListener('ended', onEndedEv);
    video.addEventListener('pause', onPause);
    document.addEventListener('visibilitychange', onVisible);

    const drift = window.setInterval(() => {
      if (activeRef.current && !video.seeking && !video.paused) syncPosition(video);
    }, 5000);

    return () => {
      video.removeEventListener('loadedmetadata', onMeta);
      video.removeEventListener('playing', onPlayingEv);
      video.removeEventListener('ended', onEndedEv);
      video.removeEventListener('pause', onPause);
      document.removeEventListener('visibilitychange', onVisible);
      window.clearInterval(drift);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <video
      ref={videoRef}
      playsInline
      preload="auto"
      disablePictureInPicture
      disableRemotePlayback
      controlsList="nodownload nofullscreen noremoteplayback noplaybackrate"
      onContextMenu={(e) => e.preventDefault()}
      className="pointer-events-none absolute inset-0 h-full w-full bg-navy-deep object-contain"
    />
  );
});

export default ReplayPlayer;
