'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { ArrowRight, CalendarDays, Lock } from 'lucide-react';

import PhoneField from '@/components/checkout/PhoneField';
import { LIVE_ROOM } from '@/lib/webinar-content';
import { REPLAY } from '@/lib/webinar-config';
import { countdownParts } from '@/lib/live-room';
import { knownDetails, submitOptin } from '@/lib/recorded-optin';
import { pauseSmoothScroll, resumeSmoothScroll } from '@/lib/smooth-scroll';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PAD = (n: number) => String(n).padStart(2, '0');

type Errors = Partial<Record<'name' | 'email' | 'phone', string>>;

/**
 * The opt-in over /live. Mandatory: there is no close button, the backdrop
 * does nothing, and Escape does nothing. The room behind it keeps running.
 *
 * Bottom sheet on a phone, centred dialog from `sm` up. Submitting it is also
 * the tap every browser needs before it will play a video with sound, so a
 * woman who fills it in gets the session with sound, automatically.
 */
export default function LiveOptin({
  nowMs,
  startMs,
  live,
  onDone,
}: {
  nowMs: number;
  startMs: number;
  /** The session has already started. */
  live: boolean;
  onDone: () => void;
}) {
  const t = LIVE_ROOM.optin;
  const known = knownDetails();

  const [name, setName] = useState(known.name);
  const [email, setEmail] = useState(known.email);
  const [dialCode, setDialCode] = useState('+91');
  const [countryIso, setCountryIso] = useState('IN');
  const [phone, setPhone] = useState('');
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const nameRef = useRef<HTMLInputElement | null>(null);

  // Lock the page behind it, and stop Lenis scrolling it.
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    pauseSmoothScroll();
    if (!known.name) nameRef.current?.focus({ preventScroll: true });
    return () => {
      document.body.style.overflow = prev;
      resumeSmoothScroll();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const validate = (): Errors => ({
    name: name.trim().length >= 2 ? undefined : t.errors.name,
    email: EMAIL_RE.test(email.trim()) ? undefined : t.errors.email,
    phone: phone.replace(/\D/g, '').length >= 7 ? undefined : t.errors.phone,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    const next = validate();
    setErrors(next);
    if (next.name || next.email || next.phone) return;

    setSubmitting(true);
    try {
      await submitOptin({ name, email, dialCode, countryIso, phone });
    } catch {
      /* she is never kept out of the room by our infrastructure */
    }
    onDone();
  };

  const p = countdownParts(nowMs, startMs);
  const cells = [
    ...(p.days > 0 ? [{ v: PAD(p.days), l: 'Days' }] : []),
    { v: PAD(p.hours), l: 'Hrs' },
    { v: PAD(p.mins), l: 'Min' },
    { v: PAD(p.secs), l: 'Sec' },
  ];

  const fieldCls = (err?: string) =>
    `w-full rounded-xl border bg-white px-4 py-3 font-body text-[16px] text-navy outline-none transition-colors placeholder:text-navy/35 ${
      err
        ? 'border-coral-dark ring-2 ring-coral/20'
        : 'border-navy/15 focus:border-navy focus:ring-2 focus:ring-navy/10'
    }`;
  const labelCls = 'mb-1.5 block font-body text-[12.5px] font-semibold tracking-wide text-navy/70';
  const ErrorLine = ({ msg }: { msg?: string }) =>
    msg ? <p className="mt-1.5 font-body text-[12px] font-semibold text-coral-dark">{msg}</p> : null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="optin-title"
      className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center sm:p-6"
    >
      {/* Backdrop. Deliberately inert: tapping it does not close anything. */}
      <div aria-hidden="true" className="absolute inset-0 bg-navy-deep/80 backdrop-blur-sm [animation:fade-in_300ms_ease-out_both]" />

      <div
        data-lenis-prevent
        className="reg-panel themed-scroll relative max-h-[94svh] w-full overflow-y-auto overscroll-contain rounded-t-[28px] bg-cream shadow-[0_0_0_1.5px_rgba(245,144,117,0.55),0_0_48px_-6px_rgba(245,144,117,0.45),0_-20px_60px_-20px_rgba(0,0,0,0.6)] sm:max-w-[460px] sm:rounded-[28px] sm:shadow-[0_0_0_1.5px_rgba(245,144,117,0.55),0_0_70px_-8px_rgba(245,144,117,0.45),0_30px_80px_-20px_rgba(0,0,0,0.7)]"
      >
        {/* Header: when, and how long until */}
        <div className="relative overflow-hidden bg-navy px-5 pb-5 pt-6 text-center sm:px-7 sm:pt-7">
          <span
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-coral-dark via-coral to-coral-dark"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-[200px] bg-[radial-gradient(60%_70%_at_50%_0%,rgba(245,144,117,0.26),transparent_70%)]"
          />
          <p className="relative font-body text-[10.5px] font-bold uppercase tracking-[0.18em] text-coral sm:text-[11px]">
            {t.eyebrow}
          </p>
          <h2
            id="optin-title"
            className="relative mt-2 font-serif text-[24px] font-semibold leading-[1.15] text-white sm:text-[27px]"
          >
            {t.heading}
          </h2>

          {live ? (
            <p className="relative mt-4 inline-flex items-center gap-2 rounded-pill bg-coral/15 px-3.5 py-1.5 font-body text-[12.5px] font-bold text-coral">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-coral opacity-70 motion-reduce:animate-none" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-coral" />
              </span>
              {t.liveNow}
            </p>
          ) : (
            <div className="relative mt-4">
              <p className="font-body text-[9.5px] font-bold uppercase tracking-[0.18em] text-white/50">
                {t.startsIn}
              </p>
              <div
                className={`mx-auto mt-2 grid gap-1.5 ${
                  cells.length === 4 ? 'max-w-[280px] grid-cols-4' : 'max-w-[210px] grid-cols-3'
                }`}
              >
                {cells.map((c) => (
                  <div
                    key={c.l}
                    className="rounded-lg border border-coral/30 bg-white/[0.06] px-1 py-1.5"
                  >
                    <span className="block font-serif text-[20px] font-semibold leading-none tabular-nums text-white">
                      {c.v}
                    </span>
                    <span className="mt-1 block font-body text-[8px] font-bold uppercase tracking-[0.14em] text-white/50">
                      {c.l}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {REPLAY.date && (
            <p className="relative mt-3.5 flex items-center justify-center gap-1.5 font-body text-[12.5px] text-white/70">
              <CalendarDays className="h-3.5 w-3.5 shrink-0 text-coral" strokeWidth={2.2} />
              {REPLAY.date} · {REPLAY.time} IST
            </p>
          )}
        </div>

        {/* Who is guiding the session */}
        <div className="mx-5 -mt-px flex items-center gap-3 border-b border-navy/10 py-4 sm:mx-7">
          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full ring-2 ring-coral/40 ring-offset-2 ring-offset-cream">
            <Image
              src="/Hero-Image/sonali-main-hero-image.JPG"
              alt="Sonali Badani"
              fill
              sizes="48px"
              className="object-cover object-top"
            />
          </div>
          <div className="min-w-0 leading-tight">
            <p className="font-body text-[9.5px] font-bold uppercase tracking-[0.14em] text-coral-dark">
              {t.host.role}
            </p>
            <p className="mt-0.5 font-serif text-[16px] font-semibold text-navy">Sonali Badani</p>
            <p className="mt-0.5 font-body text-[11.5px] leading-snug text-navy/60">{t.host.line}</p>
          </div>
        </div>

        {/* The form */}
        <form onSubmit={handleSubmit} noValidate className="space-y-3.5 px-5 pb-6 pt-4 sm:px-7 sm:pb-7">
          <p className="font-body text-[13.5px] leading-snug text-navy/70">{t.sub}</p>

          <div>
            <label htmlFor="optin-name" className={labelCls}>
              {t.fields.name.label}
            </label>
            <input
              ref={nameRef}
              id="optin-name"
              type="text"
              autoComplete="name"
              placeholder={t.fields.name.placeholder}
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors((x) => ({ ...x, name: undefined }));
              }}
              className={fieldCls(errors.name)}
            />
            <ErrorLine msg={errors.name} />
          </div>

          <div>
            <label htmlFor="optin-email" className={labelCls}>
              {t.fields.email.label}
            </label>
            <input
              id="optin-email"
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder={t.fields.email.placeholder}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors((x) => ({ ...x, email: undefined }));
              }}
              className={fieldCls(errors.email)}
            />
            <ErrorLine msg={errors.email} />
          </div>

          <div>
            <p className={labelCls}>{t.fields.phone.label}</p>
            <PhoneField
              error={!!errors.phone}
              onParts={(parts) => {
                setDialCode(parts.dialCode);
                setCountryIso(parts.country);
                setPhone(parts.national);
                if (errors.phone) setErrors((x) => ({ ...x, phone: undefined }));
              }}
            />
            <ErrorLine msg={errors.phone} />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn-primary !mt-5 w-full disabled:cursor-wait disabled:opacity-80"
          >
            <span className="relative z-[3]">
              {submitting ? t.submitting : live ? t.submitLive : t.submit}
            </span>
            {!submitting && <ArrowRight className="relative z-[3] h-5 w-5 shrink-0" />}
          </button>

          <p className="flex items-center justify-center gap-1.5 text-center font-body text-[11.5px] text-navy/50">
            <Lock className="h-3 w-3 shrink-0" />
            {t.privacy}
          </p>
        </form>
      </div>
    </div>
  );
}
