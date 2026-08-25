'use client';

import { CalendarPlus } from 'lucide-react';
import {
  calendarWindow,
  WEBINAR,
  TIME_IST,
  MASTERCLASS_NAME,
  MASTERCLASS_NAME_BARE,
  MASTERCLASS_PROSE_CAP,
  MASTERCLASS_SLUG,
} from '@/lib/webinar-config';
import { trackCustom } from '@/lib/events';

// The event name is two full sentences, so `${NAME} with Sonali Badani` reads
// as a run-on in a calendar chip. The name leads, the host follows a separator.
const TITLE = `${MASTERCLASS_NAME} · Masterclass with Sonali Badani`;
const DETAILS = `Live on Zoom. ${WEBINAR.date}, ${TIME_IST}. Your Zoom link comes to your WhatsApp from the group.`;
const LOCATION = 'Live on Zoom';

/** Google and Outlook want UTC basic format: 20260913T143000Z. */
const utcBasic = (d: Date) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');

function googleUrl(start: Date, end: Date) {
  const p = new URLSearchParams({
    action: 'TEMPLATE',
    text: TITLE,
    dates: `${utcBasic(start)}/${utcBasic(end)}`,
    details: DETAILS,
    location: LOCATION,
  });
  return `https://calendar.google.com/calendar/render?${p.toString()}`;
}

function outlookUrl(start: Date, end: Date) {
  const p = new URLSearchParams({
    path: '/calendar/action/compose',
    rru: 'addevent',
    subject: TITLE,
    startdt: start.toISOString(),
    enddt: end.toISOString(),
    body: DETAILS,
    location: LOCATION,
  });
  return `https://outlook.live.com/calendar/0/deeplink/compose?${p.toString()}`;
}

/**
 * Apple Calendar has no web endpoint, so we hand the browser a .ics file. Built
 * as a Blob rather than a data: URI because iOS Safari refuses to open long
 * data: URIs, and this is the platform most of these women are on.
 */
function downloadIcs(start: Date, end: Date) {
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    `PRODID:-//The Soul Space//${MASTERCLASS_NAME_BARE}//EN`,
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${MASTERCLASS_SLUG}-${utcBasic(start)}@sonalibadani.com`,
    `DTSTAMP:${utcBasic(new Date())}`,
    `DTSTART:${utcBasic(start)}`,
    `DTEND:${utcBasic(end)}`,
    `SUMMARY:${TITLE}`,
    `DESCRIPTION:${DETAILS}`,
    `LOCATION:${LOCATION}`,
    'BEGIN:VALARM',
    'TRIGGER:-PT30M',
    'ACTION:DISPLAY',
    `DESCRIPTION:${MASTERCLASS_PROSE_CAP} starts in 30 minutes`,
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ];

  const blob = new Blob([lines.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
  const href = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = href;
  a.download = `${MASTERCLASS_SLUG}.ics`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  // Revoke on the next tick so Safari has finished reading the blob.
  window.setTimeout(() => URL.revokeObjectURL(href), 1000);
}

/**
 * Google, Apple and Outlook buttons. Renders nothing when the deadline env var
 * is unset or unparseable, rather than offering a calendar entry for a date we
 * cannot compute.
 */
export default function AddToCalendar({ page }: { page: string }) {
  const window_ = calendarWindow();
  if (!window_) return null;
  const { start, end } = window_;

  const track = (provider: string) => trackCustom('add_to_calendar', { provider, page });

  const cls =
    'flex min-h-[46px] flex-1 items-center justify-center gap-1.5 rounded-xl border border-navy/15 bg-white px-2 py-2.5 font-body text-[13px] font-semibold text-navy transition-all duration-200 hover:-translate-y-0.5 hover:border-coral hover:text-coral-dark focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-coral/25';

  return (
    <div className="flex items-stretch gap-2">
      <a
        href={googleUrl(start, end)}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => track('google')}
        className={cls}
      >
        <CalendarPlus className="h-3.5 w-3.5 shrink-0" />
        Google
      </a>
      <button
        type="button"
        onClick={() => {
          track('apple');
          downloadIcs(start, end);
        }}
        className={cls}
      >
        <CalendarPlus className="h-3.5 w-3.5 shrink-0" />
        Apple
      </button>
      <a
        href={outlookUrl(start, end)}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => track('outlook')}
        className={cls}
      >
        <CalendarPlus className="h-3.5 w-3.5 shrink-0" />
        Outlook
      </a>
    </div>
  );
}
