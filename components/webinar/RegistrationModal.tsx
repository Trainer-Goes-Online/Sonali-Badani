'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Check, Lock, MessageCircle, X } from 'lucide-react';

import PhoneField from '@/components/checkout/PhoneField';
import Sparkle from '@/components/ui/Sparkle';
import { FORM } from '@/lib/webinar-content';
import { DAY_TIME_IST } from '@/lib/webinar-config';
import { submitRegistration } from '@/lib/registration';
import { trackRegistration, trackRegistrationStep } from '@/lib/events';
import { pauseSmoothScroll, resumeSmoothScroll } from '@/lib/smooth-scroll';

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
  /**
   * The step 4 acknowledgement. Kept out of `values` on purpose: it is not a
   * field we send anywhere, it is a gate on this device only, so it has no
   * business in the payload or the lead cache.
   */
  const [acknowledged, setAcknowledged] = useState(false);
  const [ackError, setAckError] = useState<string | undefined>();
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

    // Lenis moves the page itself, so an overflow lock alone leaves it
    // scrolling behind the overlay and swallows the wheel inside it.
    pauseSmoothScroll();

    const { overflow, paddingRight } = document.body.style;
    const rootOverflow = document.documentElement.style.overflow;
    // Compensate for the scrollbar so the page behind does not shift on desktop.
    const gap = window.innerWidth - document.documentElement.clientWidth;
    // Both elements, not just body: html is the scrolling element here, so
    // locking body alone left the page free to move behind the overlay.
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    if (gap > 0) document.body.style.paddingRight = `${gap}px`;
    return () => {
      document.documentElement.style.overflow = rootOverflow;
      document.body.style.overflow = overflow;
      document.body.style.paddingRight = paddingRight;
      resumeSmoothScroll();
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

    /**
     * On the last step BOTH the question and the tick are required, and both
     * are checked in the same pass on purpose. Validating them one at a time
     * would make her tap the button, fix the question, tap again, and only then
     * discover the tick: two rejections for one submit. She sees everything
     * that is missing at once.
     */
    const needsAck = step === LAST_STEP && !acknowledged;
    const hasFieldError = Object.keys(found).length > 0;

    if (hasFieldError || needsAck) {
      setErrors((prev) => ({ ...prev, ...found }));
      setAckError(needsAck ? FORM.finalNotice.confirmError : undefined);
      // Scroll to the tick only when it is the one thing missing; otherwise the
      // question is higher up the step and should keep the focus.
      if (needsAck && !hasFieldError) {
        document.getElementById('reg-ack')?.scrollIntoView({ block: 'center', behavior: 'smooth' });
      }
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

    // CompleteRegistration + Lead, both server side. Fired AFTER the lead is
    // cached, so the CAPI call has her email, phone and city to match on.
    trackRegistration(leadId || undefined);
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
        /*
          Lenis runs site wide and captures the wheel globally, scrolling its own
          virtual page rather than whatever container sits under the cursor. That
          made step 4 unscrollable with a mouse on desktop: the panel genuinely
          overflowed, but every wheel tick was swallowed before it arrived. Touch
          was unaffected, which is why it only showed up on desktop, and a
          programmatic scrollTop still worked, which is why measuring the panel
          made it look healthy.

          `data-lenis-prevent` is Lenis's documented opt out for nested scroll
          areas. The body overflow lock below stops the page moving behind the
          modal; it does nothing about the wheel, because Lenis never lets the
          event reach the DOM in the first place.
        */
        data-lenis-prevent
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
                {/*
                  ORDER MATTERS HERE, and it is the order she reads in:

                  1. The notice, so she learns the group is compulsory BEFORE
                     she is asked for anything.
                  2. The question, which is the only thing Sonali needs.
                  3. The tick, last, so the final act on this form is her
                     agreeing to the one thing that decides whether she ever
                     gets a Zoom link.

                  The details recap was removed from this step. It repeated
                  three fields she had typed seconds earlier and, with the
                  notice added, pushed the button off a desktop screen.
                */}
                <div className="rounded-2xl border-2 border-coral/45 bg-warm p-3.5">
                  <p className="flex items-center gap-2 font-body text-[12px] font-bold uppercase tracking-[0.12em] text-coral-dark">
                    <MessageCircle className="h-4 w-4 shrink-0" strokeWidth={2.4} />
                    {FORM.finalNotice.title}
                  </p>
                  <ul className="mt-2.5 space-y-2">
                    {FORM.finalNotice.points.map((point, i) => (
                      <li
                        key={point}
                        className="flex items-start gap-2.5 font-body text-[12.5px] leading-relaxed text-navy/85"
                      >
                        <span
                          aria-hidden="true"
                          className="mt-[3px] grid h-[18px] w-[18px] shrink-0 place-items-center rounded-full bg-coral/20 font-body text-[10px] font-bold text-coral-dark"
                        >
                          {i + 1}
                        </span>
                        {/* The compulsory line is the one that has to land. */}
                        <span className={i === 2 ? 'font-semibold text-navy' : undefined}>
                          {point}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <p className={`${labelCls} mt-5`}>{FORM.fields.duration.label}</p>
                {/* Tap targets rather than a native select: a select on a phone
                    opens an OS wheel that hides the question, and this is the
                    last thing between her and the seat. */}
                {/* One column on a phone, two from `sm` up. The four options were
                    the tallest thing on this step and stacking them was what
                    pushed the tick below the fold on a laptop. No tap target
                    shrinks: they get shorter only by sitting side by side. */}
                <div className="mt-1 grid gap-2 sm:grid-cols-2">
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

                {/*
                  A real label wrapping a real checkbox, so the whole row is the
                  tap target and screen readers announce it correctly. The input
                  is visually replaced by the box beside it but stays in the
                  tree, which is what keeps keyboard focus working.
                */}
                <label
                  id="reg-ack"
                  className={`mt-4 flex min-h-[52px] cursor-pointer items-start gap-3 rounded-xl border-2 p-3.5 transition-colors ${
                    ackError
                      ? 'border-coral-dark bg-white'
                      : acknowledged
                        ? 'border-coral bg-coral/[0.08]'
                        : 'border-navy/20 bg-white hover:border-coral/50'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={acknowledged}
                    aria-invalid={!!ackError}
                    onChange={(e) => {
                      setAcknowledged(e.target.checked);
                      if (e.target.checked) setAckError(undefined);
                    }}
                    className="sr-only"
                  />
                  <span
                    aria-hidden="true"
                    className={`mt-[1px] grid h-5 w-5 shrink-0 place-items-center rounded-[6px] border-2 transition-colors ${
                      acknowledged ? 'border-coral bg-coral text-white' : 'border-navy/30 bg-white'
                    }`}
                  >
                    {acknowledged && <Check className="h-3.5 w-3.5" strokeWidth={3.5} />}
                  </span>
                  <span className="font-body text-[13px] font-semibold leading-relaxed text-navy">
                    {FORM.finalNotice.confirm}
                  </span>
                </label>
                <ErrorLine msg={ackError} />
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
