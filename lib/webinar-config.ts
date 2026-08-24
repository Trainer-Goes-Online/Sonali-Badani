/**
 * The Love Legacy Masterclass — event configuration.
 *
 * ONE variable sets the whole event:
 *
 *   NEXT_PUBLIC_WEBINAR_DATETIME="13 September 2026 at 8:00 PM"
 *
 * Written the way a person would write it, always read as IST. The weekday is
 * never typed: it is worked out from the date, so "Sunday" can never end up
 * sitting next to a Tuesday. From that single value the funnel derives the
 * weekday, the date label, the time label, the countdown target and the
 * add-to-calendar window, and uses them on the landing page, the OTO, all three
 * thank-you pages and the terms page.
 *
 * Also configurable:
 *   NEXT_PUBLIC_MASTERCLASS_NAME  "The Love Legacy Masterclass"
 *   NEXT_PUBLIC_WEBINAR_DURATION  "90 minutes"
 *   NEXT_PUBLIC_WEBINAR_SEATS     "300"
 *   NEXT_PUBLIC_WHATSAPP_COMMUNITY_URL
 *
 * Everything is formatted with an explicit `Asia/Kolkata` time zone, so the
 * server prerender and the browser always produce identical strings and there
 * is never a hydration mismatch, whatever time zone the host runs in.
 */

const IST = 'Asia/Kolkata';
/** India is UTC+5:30, with no daylight saving, so this offset is always right. */
const IST_OFFSET = '+05:30';

function env(value: string | undefined, fallback: string): string {
  const v = (value ?? '').trim();
  return v.length > 0 ? v : fallback;
}

/** Placeholder. Set NEXT_PUBLIC_WEBINAR_DATETIME to the real date before launch. */
const FALLBACK_DATETIME = '13 September 2026 at 8:00 PM';

const DATETIME_INPUT = env(process.env.NEXT_PUBLIC_WEBINAR_DATETIME, FALLBACK_DATETIME);

const MONTHS: Record<string, number> = {
  jan: 1, january: 1,
  feb: 2, february: 2,
  mar: 3, march: 3,
  apr: 4, april: 4,
  may: 5,
  jun: 6, june: 6,
  jul: 7, july: 7,
  aug: 8, august: 8,
  sep: 9, sept: 9, september: 9,
  oct: 10, october: 10,
  nov: 11, november: 11,
  dec: 12, december: 12,
};

/**
 * Parse "13 September 2026 at 8:00 PM" into a Date, reading it as IST.
 *
 * Deliberately forgiving about the things a human varies: the word "at" and the
 * comma are optional, the month may be abbreviated, minutes may be omitted
 * ("8 PM"), and 24-hour time works too ("20:00"). Returns null when the value
 * genuinely cannot be understood, so callers can fall back rather than render a
 * wrong date.
 */
function parseHumanDateTime(input: string): Date | null {
  const cleaned = input.trim().replace(/,/g, ' ').replace(/\s+/g, ' ');

  const match = cleaned.match(
    /^(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})(?:\s+at)?\s+(\d{1,2})(?::(\d{2}))?\s*([AaPp][Mm])?$/
  );
  if (!match) return null;

  const [, dayStr, monthStr, yearStr, hourStr, minuteStr, meridiem] = match;

  const month = MONTHS[monthStr.toLowerCase()];
  if (!month) return null;

  const day = Number(dayStr);
  const year = Number(yearStr);
  let hour = Number(hourStr);
  const minute = Number(minuteStr ?? '0');

  if (day < 1 || day > 31 || minute > 59) return null;

  if (meridiem) {
    const isPm = meridiem.toLowerCase() === 'pm';
    if (hour < 1 || hour > 12) return null;
    if (isPm && hour !== 12) hour += 12;
    if (!isPm && hour === 12) hour = 0;
  } else if (hour > 23) {
    return null;
  }

  const pad = (n: number) => String(n).padStart(2, '0');
  const iso = `${year}-${pad(month)}-${pad(day)}T${pad(hour)}:${pad(minute)}:00${IST_OFFSET}`;
  const ms = Date.parse(iso);
  if (!Number.isFinite(ms)) return null;

  // Guards against a real-looking but impossible date such as "31 April 2026",
  // which would otherwise roll silently into the next month.
  const check = new Date(ms);
  const istDay = new Intl.DateTimeFormat('en-GB', { timeZone: IST, day: 'numeric' }).format(check);
  if (Number(istDay) !== day) return null;

  return check;
}

/**
 * The event moment. Tries the human format first, then falls back to anything
 * Date.parse understands (so a raw ISO timestamp still works), then to the
 * placeholder above.
 */
const parsed: Date | null = (() => {
  const human = parseHumanDateTime(DATETIME_INPUT);
  if (human) return human;

  const ms = Date.parse(DATETIME_INPUT);
  if (Number.isFinite(ms)) return new Date(ms);

  return parseHumanDateTime(FALLBACK_DATETIME);
})();

function fmt(options: Intl.DateTimeFormatOptions): string {
  if (!parsed) return '';
  return new Intl.DateTimeFormat('en-GB', { timeZone: IST, ...options }).format(parsed);
}

/** "Sunday" — derived from the date, never typed. */
function derivedDay(): string {
  return fmt({ weekday: 'long' });
}

/** "Sunday, 13 September" */
function derivedDate(): string {
  const weekday = fmt({ weekday: 'long' });
  const dayMonth = fmt({ day: 'numeric', month: 'long' });
  return weekday && dayMonth ? `${weekday}, ${dayMonth}` : '';
}

/** "8:00 PM" (Intl renders "pm" lowercase; the brand style is uppercase). */
function derivedTime(): string {
  const t = fmt({ hour: 'numeric', minute: '2-digit', hour12: true });
  return t.replace(/\s*(am|pm)$/i, (_m, p: string) => ` ${p.toUpperCase()}`);
}

export const WEBINAR = {
  /** "Sunday" — used mid sentence, e.g. "See you on Sunday." */
  day: derivedDay() || 'Sunday',
  /** "Sunday, 13 September" — the full date label. */
  date: derivedDate() || 'Sunday, 13 September',
  /** "13 September 2026" — the long form, for the terms page. */
  dateLong: fmt({ day: 'numeric', month: 'long', year: 'numeric' }) || '13 September 2026',
  /** "8:00 PM" — rendered with " IST" appended where needed. */
  time: derivedTime() || '8:00 PM',
  /** "90 minutes" */
  duration: env(process.env.NEXT_PUBLIC_WEBINAR_DURATION, '90 minutes'),
  /** Seat cap used in the scarcity bar. */
  seats: env(process.env.NEXT_PUBLIC_WEBINAR_SEATS, '300'),
  /**
   * The masterclass group. Everyone who registers joins this one: it is where
   * the Zoom link and the reminders go.
   */
  whatsappUrl: env(process.env.NEXT_PUBLIC_WHATSAPP_COMMUNITY_URL, ''),
  /**
   * The private One Partner Reset community, for buyers only. Shown on the two
   * post-purchase pages alongside the masterclass group, never on /welcome.
   */
  whatsappResetUrl: env(process.env.NEXT_PUBLIC_WHATSAPP_RESET_COMMUNITY_URL, ''),
} as const;

/**
 * The name of the masterclass, everywhere it is said.
 *
 * Set NEXT_PUBLIC_MASTERCLASS_NAME and it changes across the whole site: page
 * titles and social cards, the hero lockup, the comparison panel, the legal
 * pages, the footer disclaimer, the calendar invite, and the Meta/GA event
 * names.
 *
 * Careful when renaming: this is the EVENT only. "The Love Legacy Manifesto",
 * "The Love Legacy Visualization" and "The Private Love Legacy Community" are
 * separate products that happen to share the words, and they are deliberately
 * not wired to this value.
 */
export const MASTERCLASS_NAME = env(
  process.env.NEXT_PUBLIC_MASTERCLASS_NAME,
  'The Love Legacy Masterclass'
);

/**
 * The same name without a leading "The", for the places where an article reads
 * wrong: mid sentence after another article, and technical identifiers such as
 * the calendar PRODID.
 */
export const MASTERCLASS_NAME_BARE = MASTERCLASS_NAME.replace(/^the\s+/i, '');

/**
 * URL and filename safe form, e.g. "love-legacy-masterclass". Used for the
 * calendar invite's UID and the .ics filename, so a rename produces a sensible
 * download rather than a stale slug from a previous event.
 */
export const MASTERCLASS_SLUG =
  MASTERCLASS_NAME_BARE.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'masterclass';

/**
 * The brand sub-heading, shown wherever the masterclass name is shown.
 *
 * Set NEXT_PUBLIC_MASTERCLASS_TAGLINE and it changes with the name: the hero
 * lockup, the brand anchor under the hero, the OTO header, the final close and
 * the footer.
 */
export const MASTERCLASS_TAGLINE = env(
  process.env.NEXT_PUBLIC_MASTERCLASS_TAGLINE,
  'Stop Surviving. Start Designing.'
);

/**
 * The tagline split at its first sentence break, for the places that set it on
 * two lines with the halves styled differently.
 *
 * "Stop Surviving. Start Designing." -> ["Stop Surviving.", "Start Designing."]
 *
 * Falls back to the whole string in the first slot if there is no sentence
 * break, so a one-clause tagline still renders rather than half-disappearing.
 */
export const MASTERCLASS_TAGLINE_PARTS: readonly [string, string] = (() => {
  const match = MASTERCLASS_TAGLINE.trim().match(/^(.*?[.!?])\s+(.+)$/);
  return match
    ? ([match[1].trim(), match[2].trim()] as const)
    : ([MASTERCLASS_TAGLINE.trim(), ''] as const);
})();

/** "8:00 PM IST" */
export const TIME_IST = `${WEBINAR.time} IST`;
/** "Sunday, 8:00 PM IST" */
export const DAY_TIME_IST = `${WEBINAR.day}, ${TIME_IST}`;
/** "Sunday, 13 September · 8:00 PM IST" */
export const DATE_TIME_IST = `${WEBINAR.date} · ${TIME_IST}`;
/** "Sunday, 13 September 2026 at 8:00 PM IST" */
export const DATE_AT_TIME_IST = `${WEBINAR.day}, ${WEBINAR.dateLong} at ${TIME_IST}`;

/** Epoch ms the countdown targets, or null when the value is unusable. */
export function deadlineMs(): number | null {
  return parsed ? parsed.getTime() : null;
}

/**
 * Calendar event window, derived from the same moment so the add-to-calendar
 * buttons never drift from the countdown. Duration is parsed out of
 * WEBINAR.duration ("90 minutes" -> 90), defaulting to 90.
 */
export function calendarWindow(): { start: Date; end: Date } | null {
  if (!parsed) return null;
  const minutes = Number.parseInt(WEBINAR.duration, 10);
  const span = Number.isFinite(minutes) && minutes > 0 ? minutes : 90;
  return { start: parsed, end: new Date(parsed.getTime() + span * 60_000) };
}
