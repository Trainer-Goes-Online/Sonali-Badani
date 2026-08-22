'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Check, Lock, X } from 'lucide-react';

import PhoneField from '@/components/checkout/PhoneField';
import Sparkle from '@/components/ui/Sparkle';
import { FORM } from '@/lib/webinar-content';
import { DAY_TIME_IST } from '@/lib/webinar-config';
import { submitRegistration } from '@/lib/registration';
import { trackLead, trackRegistrationStep } from '@/lib/events';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Values = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  duration: string;
};
type FieldKey = keyof Values;
type Errors = Partial<Record<FieldKey, string>>;

/** Which fields belong to which step, so validation gates one step at a time. */
const STEP_FIELDS: FieldKey[][] = [
  ['firstName', 'lastName'],
  ['email', 'phone'],
  ['city'],
  ['duration'],
];
const LAST_STEP = STEP_FIELDS.length - 1;

const EMPTY: Values = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  city: '',
  duration: '',
};

/**
 * The registration form, as a four step modal.
 *
 * Step 1  First name, Last name
 * Step 2  Email, WhatsApp number
 * Step 3  City
 * Step 4  How long the marriage has felt this way, plus a recap
 *
 * Mobile is the design target: it opens as a bottom sheet that fills the screen
 * on a phone and becomes a centred dialog from `sm` up. One question group per
 * screen keeps the keyboard from ever covering the field in focus, which is the
 * failure mode that kills mobile form completion.
 *
 * On success it posts to the registration webhook, fires the Meta `Lead` event,
 * then routes straight to the OTO. Per the spec there is no interstitial and no
 * confirmation screen: a failed webhook still moves her forward.
 */
export default function RegistrationModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [dialCode, setDialCode] = useState('+91');
  const [countryIso, setCountryIso] = useState('IN');

  const panelRef = useRef<HTMLDivElement | null>(null);
  const firstFieldRef = useRef<HTMLInputElement | null>(null);
  // Guards against a double submit from a fast double tap on mobile.
  const submittedRef = useRef(false);

  /* ── Open/close side effects: scroll lock, reset, escape, focus ───────── */

  useEffect(() => {
    if (!open) return;
    const { overflow, paddingRight } = document.body.style;
    // Compensate for the scrollbar so the page behind does not shift on desktop.
    const gap = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = 'hidden';
    if (gap > 0) document.body.style.paddingRight = `${gap}px`;
    return () => {
      document.body.style.overflow = overflow;
      document.body.style.paddingRight = paddingRight;
    };
  }, [open]);

  useEffect(() => {
    if (open) {
      setStep(0);
      setErrors({});
      setSubmitting(false);
      submittedRef.current = false;
      trackRegistrationStep(1);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  // Focus the first input of each step, but not on touch devices, where forcing
  // focus yanks the keyboard open before she has read the question.
  useEffect(() => {
    if (!open) return;
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    if (isTouch) return;
    const t = window.setTimeout(() => firstFieldRef.current?.focus(), 220);
    return () => window.clearTimeout(t);
  }, [open, step]);

  /* ── Validation ───────────────────────────────────────────────────────── */

  const validateField = useCallback(
    (key: FieldKey, v: Values): string | undefined => {
      switch (key) {
        case 'firstName':
          return v.firstName.trim().length >= 2 ? undefined : FORM.errors.firstName;
        case 'lastName':
          return v.lastName.trim().length >= 1 ? undefined : FORM.errors.lastName;
        case 'email':
          return EMAIL_RE.test(v.email.trim()) ? undefined : FORM.errors.email;
        case 'phone':
          return v.phone.replace(/\D/g, '').length >= 7 ? undefined : FORM.errors.phone;
        case 'city':
          return v.city.trim().length >= 2 ? undefined : FORM.errors.city;
        case 'duration':
          return v.duration ? undefined : FORM.errors.duration;
      }
    },
    []
  );

  const validateStep = (index: number, v: Values): Errors => {
    const found: Errors = {};
    for (const key of STEP_FIELDS[index]) {
      const msg = validateField(key, v);
      if (msg) found[key] = msg;
    }
    return found;
  };

  const set = (key: FieldKey, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    // Clear on type, re-check on blur. Never validate on keypress.
    setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev));
  };

  const blur = (key: FieldKey) =>
    setErrors((prev) => ({ ...prev, [key]: validateField(key, values) }));

  /* ── Navigation ───────────────────────────────────────────────────────── */

  const goNext = async () => {
    const found = validateStep(step, values);
    if (Object.keys(found).length > 0) {
      setErrors((prev) => ({ ...prev, ...found }));
      return;
    }
    if (step < LAST_STEP) {
      const next = step + 1;
      setStep(next);
      trackRegistrationStep(next + 1);
      panelRef.current?.scrollTo({ top: 0 });
      return;
    }
    await handleSubmit();
  };

  const goBack = () => {
    if (step === 0) return;
    setStep((s) => s - 1);
  };

  const handleSubmit = async () => {
    if (submittedRef.current) return;
    submittedRef.current = true;
    setSubmitting(true);

    let leadId = '';
    try {
      leadId = await submitRegistration({
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        dialCode,
        countryIso,
        phone: values.phone,
        city: values.city,
        duration: values.duration,
      });
    } catch {
      // Deliberately swallowed. She is never blocked on our infrastructure.
    }

    trackLead(leadId || undefined);
    // Straight to the OTO. No interstitial: this is the single most common
    // build error on this funnel and it is what kills the one time offer.
    router.push('/masterclass/upgrade');
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (!submitting) void goNext();
    }
  };

  /* ── Field chrome ─────────────────────────────────────────────────────── */

  const fieldCls = (err?: string) =>
    `w-full rounded-xl border bg-white px-4 py-3.5 font-body text-[16px] text-navy outline-none transition-colors placeholder:text-navy/35 ${
      err
        ? 'border-coral-dark ring-2 ring-coral/20'
        : 'border-navy/15 focus:border-navy focus:ring-2 focus:ring-navy/10'
    }`;
  const labelCls = 'mb-1.5 block font-body text-[12.5px] font-semibold tracking-wide text-navy/70';

  const ErrorLine = ({ msg }: { msg?: string }) =>
    msg ? (
      <p role="alert" className="mt-1.5 font-body text-[12.5px] font-medium text-coral-dark">
        {msg}
      </p>
    ) : null;

  const progress = useMemo(() => ((step + 1) / STEP_FIELDS.length) * 100, [step]);

  if (!open) return null;

  const isLast = step === LAST_STEP;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="reg-heading"
      className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center"
    >
      {/* Scrim */}
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 animate-[fade-in_240ms_ease-out] bg-navy/60 backdrop-blur-sm"
      />

      {/* Panel — bottom sheet on phones, centred dialog from sm up */}
      <div
        ref={panelRef}
        className="reg-panel relative flex max-h-[92dvh] w-full max-w-[520px] flex-col overflow-y-auto rounded-t-[28px] bg-cream shadow-[0_-20px_60px_-20px_rgba(32,63,92,0.5)] sm:max-h-[90dvh] sm:rounded-[28px] sm:shadow-card"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 rounded-t-[28px] border-b border-navy/[0.08] bg-cream/95 px-5 pb-3 pt-4 backdrop-blur sm:px-7 sm:pt-5">
          {/* Grab handle, mobile affordance only */}
          <span
            aria-hidden="true"
            className="mx-auto mb-3 block h-1 w-10 rounded-full bg-navy/15 sm:hidden"
          />

          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="flex items-center gap-1.5">
                <Sparkle twinkle className="h-3 w-3 text-gold" />
                <span className="eyebrow !text-[11px]">
                  Step {step + 1} of {STEP_FIELDS.length}
                </span>
              </p>
              <h2
                id="reg-heading"
                className="mt-1.5 font-serif text-[21px] font-semibold leading-tight text-navy sm:text-[24px]"
              >
                {FORM.heading}
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="-mr-1 -mt-1 grid h-9 w-9 shrink-0 place-items-center rounded-full border border-navy/12 bg-white text-navy/50 transition-colors hover:border-navy/30 hover:text-navy"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <p className="mt-1.5 font-body text-[13px] leading-relaxed text-navy/60">{FORM.sub}</p>

          {/* Progress rail */}
          <div className="mt-3.5 h-1.5 w-full overflow-hidden rounded-full bg-navy/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-coral-dark to-coral transition-[width] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 px-5 py-5 sm:px-7 sm:py-6" onKeyDown={onKeyDown}>
          <p className="font-body text-[12px] font-semibold uppercase tracking-[0.16em] text-coral-dark">
            {FORM.steps[step].label}
          </p>
          <p className="mt-1 font-body text-[13.5px] leading-relaxed text-navy/60">
            {FORM.steps[step].hint}
          </p>

          {/* key forces a remount per step so the entrance animation replays */}
          <div key={step} className="reg-step mt-5 space-y-4">
            {step === 0 && (
              <>
                <div>
                  <label htmlFor="reg-first" className={labelCls}>
                    {FORM.fields.firstName.label}
                  </label>
                  <input
                    id="reg-first"
                    ref={firstFieldRef}
                    className={fieldCls(errors.firstName)}
                    placeholder={FORM.fields.firstName.placeholder}
                    value={values.firstName}
                    autoComplete="given-name"
                    autoCapitalize="words"
                    enterKeyHint="next"
                    aria-invalid={!!errors.firstName}
                    onChange={(e) => set('firstName', e.target.value)}
                    onBlur={() => blur('firstName')}
                  />
                  <ErrorLine msg={errors.firstName} />
                </div>
                <div>
                  <label htmlFor="reg-last" className={labelCls}>
                    {FORM.fields.lastName.label}
                  </label>
                  <input
                    id="reg-last"
                    className={fieldCls(errors.lastName)}
                    placeholder={FORM.fields.lastName.placeholder}
                    value={values.lastName}
                    autoComplete="family-name"
                    autoCapitalize="words"
                    enterKeyHint="next"
                    aria-invalid={!!errors.lastName}
                    onChange={(e) => set('lastName', e.target.value)}
                    onBlur={() => blur('lastName')}
                  />
                  <ErrorLine msg={errors.lastName} />
                </div>
              </>
            )}

            {step === 1 && (
              <>
                <div>
                  <label htmlFor="reg-email" className={labelCls}>
                    {FORM.fields.email.label}
                  </label>
                  <input
                    id="reg-email"
                    ref={firstFieldRef}
                    type="email"
                    inputMode="email"
                    className={fieldCls(errors.email)}
                    placeholder={FORM.fields.email.placeholder}
                    value={values.email}
                    autoComplete="email"
                    autoCapitalize="off"
                    autoCorrect="off"
                    spellCheck={false}
                    enterKeyHint="next"
                    aria-invalid={!!errors.email}
                    onChange={(e) => set('email', e.target.value)}
                    onBlur={() => blur('email')}
                  />
                  <ErrorLine msg={errors.email} />
                </div>
                <div>
                  <label className={labelCls}>{FORM.fields.phone.label}</label>
                  <PhoneField
                    error={!!errors.phone}
                    onParts={(p) => {
                      setDialCode(p.dialCode);
                      setCountryIso(p.country);
                      set('phone', p.national);
                    }}
                  />
                  <ErrorLine msg={errors.phone} />
                </div>
              </>
            )}

            {step === 2 && (
              <div>
                <label htmlFor="reg-city" className={labelCls}>
                  {FORM.fields.city.label}
                </label>
                <input
                  id="reg-city"
                  ref={firstFieldRef}
                  className={fieldCls(errors.city)}
                  placeholder={FORM.fields.city.placeholder}
                  value={values.city}
                  autoComplete="address-level2"
                  autoCapitalize="words"
                  enterKeyHint="done"
                  aria-invalid={!!errors.city}
                  onChange={(e) => set('city', e.target.value)}
                  onBlur={() => blur('city')}
                />
                <ErrorLine msg={errors.city} />
              </div>
            )}

            {step === 3 && (
              <div>
                <p className={labelCls}>{FORM.fields.duration.label}</p>
                {/* Tap targets rather than a native select: a select on a phone
                    opens an OS wheel that hides the question, and this is the
                    last thing between her and the seat. */}
                <div className="mt-1 grid gap-2">
                  {FORM.fields.duration.options.map((option) => {
                    const chosen = values.duration === option;
                    return (
                      <button
                        key={option}
                        type="button"
                        aria-pressed={chosen}
                        onClick={() => set('duration', option)}
                        className={`flex min-h-[52px] items-center gap-3 rounded-xl border-2 px-4 py-3 text-left font-body text-[15px] font-medium transition-colors ${
                          chosen
                            ? 'border-coral bg-coral/[0.12] text-navy'
                            : 'border-navy/15 bg-white text-navy/80 hover:border-coral/40'
                        }`}
                      >
                        <span
                          aria-hidden="true"
                          className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 transition-colors ${
                            chosen ? 'border-coral bg-coral text-navy' : 'border-navy/25 bg-white'
                          }`}
                        >
                          {chosen && <Check className="h-3 w-3" strokeWidth={3.5} />}
                        </span>
                        {option}
                      </button>
                    );
                  })}
                </div>
                <ErrorLine msg={errors.duration} />

                {/* A quiet recap, so the last step feels like an ending */}
                <dl className="mt-5 space-y-2 rounded-2xl border border-navy/[0.08] bg-white/70 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <dt className="font-body text-[12px] uppercase tracking-[0.12em] text-navy/45">
                      Name
                    </dt>
                    <dd className="text-right font-body text-[13.5px] font-semibold text-navy">
                      {values.firstName} {values.lastName}
                    </dd>
                  </div>
                  <div className="flex items-start justify-between gap-4">
                    <dt className="font-body text-[12px] uppercase tracking-[0.12em] text-navy/45">
                      Email
                    </dt>
                    <dd className="break-all text-right font-body text-[13.5px] font-semibold text-navy">
                      {values.email}
                    </dd>
                  </div>
                  <div className="flex items-start justify-between gap-4">
                    <dt className="font-body text-[12px] uppercase tracking-[0.12em] text-navy/45">
                      WhatsApp
                    </dt>
                    <dd className="text-right font-body text-[13.5px] font-semibold text-navy">
                      {dialCode} {values.phone}
                    </dd>
                  </div>
                </dl>
              </div>
            )}
          </div>
        </div>

        {/* Footer actions — sticky so the button never leaves the thumb zone */}
        <div className="sticky bottom-0 border-t border-navy/[0.08] bg-cream/95 px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3.5 backdrop-blur sm:rounded-b-[28px] sm:px-7 sm:pb-5">
          <div className="flex items-center gap-3">
            {step > 0 && (
              <button
                type="button"
                onClick={goBack}
                disabled={submitting}
                className="grid h-[54px] w-[54px] shrink-0 place-items-center rounded-pill border border-navy/20 bg-white text-navy transition-colors hover:border-navy hover:bg-navy hover:text-white disabled:opacity-50"
                aria-label={FORM.back}
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
            )}
            <button
              type="button"
              onClick={() => void goNext()}
              disabled={submitting}
              className="btn-primary flex-1 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {submitting ? (
                <>
                  <span
                    aria-hidden="true"
                    className="h-4 w-4 animate-spin rounded-full border-2 border-navy/30 border-t-navy"
                  />
                  {FORM.submitting}
                </>
              ) : (
                <>
                  {isLast ? FORM.submit : FORM.next}
                  {isLast ? (
                    <Check className="h-5 w-5 shrink-0" strokeWidth={2.5} />
                  ) : (
                    <ArrowRight className="h-5 w-5 shrink-0" />
                  )}
                </>
              )}
            </button>
          </div>

          <p className="mt-2.5 flex items-center justify-center gap-1.5 text-center font-body text-[11.5px] leading-relaxed text-navy/50">
            <Lock className="h-3 w-3 shrink-0" />
            {FORM.privacy}
          </p>
        </div>
      </div>
    </div>
  );
}
