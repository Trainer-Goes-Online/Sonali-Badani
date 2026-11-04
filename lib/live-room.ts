/**
 * The timing rules behind /live, kept free of React so they read as a spec.
 *
 * Phases, all measured against ONE start moment (NEXT_PUBLIC_REPLAY_DATETIME):
 *
 *   waiting   more than 5 minutes to go     the waiting room, with sections below
 *   final     the last 5 minutes            gold room, only the countdown on the player
 *   live      from the start to the end     the recording, synced to the wall clock
 *   ended     after the recording ends      a short closing message
 *             (its length is read from the video file, not configured)
 *
 * Every page switches into `final` in place, all at the same moment, so the
 * whole room arrives in the gold countdown together. In place, not a browser
 * reload: a reload wipes the tap that lets the video start with sound.
 */

export type Phase = 'unscheduled' | 'waiting' | 'final' | 'live' | 'ended';

export const FINAL_WINDOW_MS = 5 * 60_000;

/**
 * `durationSec` is the recording's own length, read from the video file. Until
 * it is known (null), anything after the start counts as live: the player is
 * already loading, and the moment the length arrives a visitor who came too
 * late is moved to `ended`.
 */
export function phaseAt(nowMs: number, startMs: number | null, durationSec: number | null): Phase {
  if (startMs === null) return 'unscheduled';
  if (nowMs < startMs - FINAL_WINDOW_MS) return 'waiting';
  if (nowMs < startMs) return 'final';
  if (durationSec === null || nowMs < startMs + durationSec * 1000) return 'live';
  return 'ended';
}

/**
 * The made up head count. Rolled fresh on every visit and every refresh, then
 * held for the life of the page so it moves gently instead of flickering.
 */
export type CrowdSeed = {
  /** Anything earlier than an hour out. Small, so the room fills up later. */
  early: number;
  /** One hour out: 45 to 55. */
  hourOut: number;
  /** The exact start: 75 to 80. */
  atStart: number;
};

const randInt = (min: number, max: number) => min + Math.floor(Math.random() * (max - min + 1));

export function rollCrowd(): CrowdSeed {
  return { early: randInt(14, 28), hourOut: randInt(45, 55), atStart: randInt(75, 80) };
}

/**
 * How many women the room says are waiting (or watching, once live).
 *
 *   more than 60 min out   `early`
 *   60 to 15 min out       `hourOut`, plus 5 at every 15 minute step
 *                          (T-60: 45 to 55 · T-45: +5 · T-30: +10)
 *   last 15 minutes        rises steadily from `hourOut + 15` to `atStart`
 *   live                   `atStart`, plus one every 10 minutes, capped at +6,
 *                          the way late joiners trickle in
 */
export function crowdAt(nowMs: number, startMs: number, seed: CrowdSeed): number {
  const minsOut = (startMs - nowMs) / 60_000;

  if (minsOut > 60) return seed.early;

  if (minsOut > 15) {
    return seed.hourOut + 5 * Math.floor((60 - minsOut) / 15);
  }

  if (minsOut > 0) {
    const from = seed.hourOut + 15;
    const progress = (15 - minsOut) / 15;
    return Math.round(from + (seed.atStart - from) * progress);
  }

  const minsIn = -minsOut;
  return seed.atStart + Math.min(6, Math.floor(minsIn / 10));
}

/** Days, hours, minutes, seconds until `startMs`, never negative. */
export function countdownParts(nowMs: number, startMs: number) {
  const total = Math.max(0, Math.floor((startMs - nowMs) / 1000));
  return {
    days: Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    mins: Math.floor((total % 3600) / 60),
    secs: total % 60,
  };
}
