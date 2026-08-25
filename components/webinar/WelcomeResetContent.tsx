import Image from 'next/image';
import { Check, Headphones, Mail, Play } from 'lucide-react';

import Logo from '@/components/ui/Logo';
import Footer from '@/components/Footer';
import Reveal from '@/components/ui/Reveal';
import Sparkle from '@/components/ui/Sparkle';
import SuccessMark from '@/components/ui/SuccessMark';
import StepCard from '@/components/webinar/StepCard';
import AddToCalendar from '@/components/webinar/AddToCalendar';
import WhatsAppButton from '@/components/webinar/WhatsAppButton';
import PurchaseDispatcher from '@/components/webinar/PurchaseDispatcher';
import { OTO_CONFIG } from '@/lib/oto-config';
import { WEBINAR } from '@/lib/webinar-config';
import { COURSE_PRICE_RUPEES, BUNDLE_PRICE_RUPEES } from '@/lib/pricing';
import { WELCOME_RESET, WELCOME_RESET_PLUS, UPGRADE } from '@/lib/webinar-content';

/**
 * The post-purchase thank-you page, in two flavours.
 *
 *   withAddon = false  ->  /welcome-reset        The One Partner Reset only.
 *   withAddon = true   ->  /welcome-reset-plus   Reset + Love Legacy Visualization.
 *
 * TagMango decides which one a buyer lands on, based on which product she
 * bought. Everything except the headline, the inbox list and the Visualization
 * block is identical, so both routes render this one component and the copy
 * stays in a single place.
 *
 * PurchaseDispatcher fires Meta Purchase + sales and the purchase webhook on
 * both, with the amount decided by which page rendered.
 */
export default function WelcomeResetContent({ withAddon = false }: { withAddon?: boolean }) {
  const heading = withAddon ? WELCOME_RESET_PLUS.heading : WELCOME_RESET.heading;
  const sub = withAddon ? WELCOME_RESET_PLUS.sub : WELCOME_RESET.sub;
  const emailItems = withAddon
    ? WELCOME_RESET_PLUS.emailItems
    : WELCOME_RESET.emailNote.items;
  const addon = WELCOME_RESET.addon;
  const page = withAddon ? 'welcome-reset-plus' : 'welcome-reset';

  return (
    <>
      <PurchaseDispatcher
        amount={withAddon ? BUNDLE_PRICE_RUPEES : COURSE_PRICE_RUPEES}
      />

      <header className="border-b border-navy/10 bg-cream">
        <div className="container-page flex h-14 items-center justify-center sm:h-16">
          <Logo height={32} />
        </div>
      </header>

      <main className="pb-14 sm:pb-20">
        {/* Confirmation */}
        <section className="relative overflow-hidden bg-navy-deep py-12 text-center sm:py-16">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-[320px] bg-[radial-gradient(55%_60%_at_50%_0%,rgba(245,144,117,0.2),transparent_70%)]"
          />
          <div className="container-reading relative">
            <Reveal>
              <SuccessMark size={56} />
            </Reveal>
            {withAddon && (
              <Reveal delay={60} className="mt-5 flex justify-center">
                <span className="inline-flex items-center gap-1.5 rounded-pill border border-coral/40 bg-coral/15 px-4 py-1.5 font-body text-[10px] font-bold uppercase tracking-[0.14em] text-coral sm:text-[11px]">
                  <Sparkle twinkle className="h-3 w-3 text-gold" />
                  {addon.badge}
                </span>
              </Reveal>
            )}
            <Reveal delay={90}>
              <h1 className="mt-5 text-balance font-serif text-[27px] font-semibold leading-[1.16] text-white sm:text-[36px]">
                {heading}
              </h1>
            </Reveal>
            <Reveal delay={150}>
              <p className="mx-auto mt-4 max-w-[500px] font-body text-[15px] leading-relaxed text-white/70 sm:text-[16.5px]">
                {sub}
              </p>
            </Reveal>
          </div>
        </section>

        <div className="container-page -mt-6 sm:-mt-8">
          <div className="mx-auto max-w-[600px] space-y-3.5 sm:space-y-4">
            {/* The three ordered steps. WhatsApp is highlighted and first,
                because nothing else matters if she misses the Zoom link. */}
            {WELCOME_RESET.steps.map((step, i) => (
              <StepCard
                key={step.n}
                n={step.n}
                title={step.title}
                body={step.body}
                delay={i * 90}
                highlight={i === 0}
              >
                {/*
                  Buyers belong to two groups, and both live in this one card so
                  she does not have to hunt for the second. The masterclass group
                  stays the loud primary because missing the Zoom link is the
                  only failure that actually costs her the session; the private
                  community sits underneath as the quieter second action.
                */}
                {'cta' in step && step.cta && (
                  <div className="mt-5 space-y-3">
                    <WhatsAppButton
                      label={WELCOME_RESET.groups.masterclass.cta}
                      page={page}
                      group="masterclass"
                    />
                    <WhatsAppButton
                      label={WELCOME_RESET.groups.reset.cta}
                      page={page}
                      group="reset-community"
                      url={WEBINAR.whatsappResetUrl}
                      variant="secondary"
                    />
                    <dl className="grid gap-1.5 pt-1 sm:grid-cols-2 sm:gap-3">
                      <div>
                        <dt className="font-body text-[10px] font-bold uppercase tracking-[0.12em] text-coral-dark">
                          {WELCOME_RESET.groups.masterclass.label}
                        </dt>
                        <dd className="font-body text-[12px] text-navy/60">
                          {WELCOME_RESET.groups.masterclass.note}
                        </dd>
                      </div>
                      <div>
                        <dt className="font-body text-[10px] font-bold uppercase tracking-[0.12em] text-coral-dark">
                          {WELCOME_RESET.groups.reset.label}
                        </dt>
                        <dd className="font-body text-[12px] text-navy/60">
                          {WELCOME_RESET.groups.reset.note}
                        </dd>
                      </div>
                    </dl>
                  </div>
                )}
              </StepCard>
            ))}

            {/* The Visualization, bundle page only */}
            {withAddon && (
              <Reveal
                delay={60}
                className="relative overflow-hidden rounded-3xl border-2 border-coral/40 bg-white p-5 shadow-card sm:p-6"
              >
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-coral-dark via-coral to-coral-dark"
                />

                <span className="flex items-center gap-1.5 font-body text-[10px] font-bold uppercase tracking-[0.14em] text-coral-dark sm:text-[10.5px]">
                  <Headphones className="h-3.5 w-3.5 shrink-0" strokeWidth={2.2} />
                  {UPGRADE.addon.kicker}
                </span>
                <h2 className="mt-2 font-serif text-[19px] font-semibold leading-snug text-navy sm:text-[22px]">
                  {addon.heading}
                </h2>
                <p className="mt-2 font-body text-[13.5px] leading-relaxed text-navy/70 sm:text-[14.5px]">
                  {addon.sub}
                </p>

                <div className="mt-5 grid grid-cols-[110px_1fr] items-start gap-4 sm:grid-cols-[130px_1fr]">
                  <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl border border-white/70 bg-cream shadow-soft ring-1 ring-gold/20">
                    <Image
                      src={OTO_CONFIG.images.addon}
                      alt="The Love Legacy Visualization guided meditation"
                      fill
                      sizes="(max-width: 640px) 110px, 130px"
                      className="object-cover object-center"
                    />
                    <span className="absolute inset-0 grid place-items-center">
                      <span className="play-pulse grid h-10 w-10 place-items-center rounded-full border-[3px] border-white/75 bg-coral text-white">
                        <Play className="ml-0.5 h-3.5 w-3.5 fill-current" strokeWidth={0} />
                      </span>
                    </span>
                    <Sparkle twinkle className="absolute -right-1.5 -top-1.5 h-4 w-4 text-gold" />
                  </div>

                  <div className="min-w-0 space-y-2.5">
                    {addon.steps.map((s) => (
                      <div key={s.title} className="rounded-xl border border-navy/[0.06] bg-cream p-3">
                        <p className="font-body text-[12px] font-bold text-navy">{s.title}</p>
                        <p className="mt-1 font-body text-[11.5px] leading-relaxed text-navy/65">
                          {s.body}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <ul className="mt-4 space-y-1.5">
                  {addon.points.map((p) => (
                    <li
                      key={p}
                      className="flex items-start gap-2 font-body text-[12.5px] leading-relaxed text-navy/80 sm:text-[13.5px]"
                    >
                      <span className="glow-chip mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-coral/15">
                        <Check className="h-2.5 w-2.5 text-coral-dark" strokeWidth={3} />
                      </span>
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>

                <figure className="relative mt-4 rounded-xl border border-gold/25 bg-warm px-4 py-3">
                  <Sparkle className="absolute -left-1.5 -top-1.5 h-3.5 w-3.5 text-gold" />
                  <blockquote className="font-serif text-[14.5px] italic leading-snug text-navy/85 sm:text-[15.5px]">
                    {addon.quote}
                  </blockquote>
                  <figcaption className="mt-1 font-body text-[10px] uppercase tracking-[0.14em] text-navy/45">
                    {addon.quoteCaption}
                  </figcaption>
                </figure>

                <p className="mt-4 border-t border-navy/10 pt-3.5 font-body text-[12.5px] leading-relaxed text-navy/65 sm:text-[13.5px]">
                  {addon.delivery}
                </p>
              </Reveal>
            )}

            {/* Email notification details */}
            <Reveal delay={60} className="rounded-3xl border border-navy/10 bg-warm p-5 sm:p-6">
              <div className="flex items-center gap-3">
                <span className="glow-chip grid h-9 w-9 shrink-0 place-items-center rounded-full bg-coral/15 text-coral-dark">
                  <Mail className="h-4 w-4" strokeWidth={2.2} />
                </span>
                <h2 className="font-serif text-[18px] font-semibold text-navy sm:text-[20px]">
                  {WELCOME_RESET.emailNote.heading}
                </h2>
              </div>

              <ul className="mt-4 space-y-2.5">
                {emailItems.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2.5 font-body text-[13.5px] leading-[1.6] text-navy/80 sm:text-[14.5px]"
                  >
                    <span className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-coral/20">
                      <Check className="h-2.5 w-2.5 text-coral-dark" strokeWidth={3} />
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <p className="mt-4 border-t border-navy/10 pt-3.5 font-body text-[12.5px] leading-relaxed text-navy/60 sm:text-[13.5px]">
                {WELCOME_RESET.emailNote.fine}
              </p>
            </Reveal>

            {/* Course details */}
            <Reveal
              delay={80}
              className="rounded-3xl border border-navy/10 bg-white p-5 shadow-card sm:p-6"
            >
              <h2 className="font-serif text-[18px] font-semibold text-navy sm:text-[21px]">
                {WELCOME_RESET.course.heading}
              </h2>
              <p className="mt-2 font-body text-[13.5px] leading-relaxed text-navy/65 sm:text-[14.5px]">
                {WELCOME_RESET.course.sub}
              </p>

              <ul className="mt-4 grid gap-2">
                {UPGRADE.product.includes.map((item, i) => (
                  <li
                    key={item}
                    className={`flex items-start gap-2.5 rounded-xl px-3 py-2.5 font-body text-[13.5px] leading-snug sm:text-[14.5px] ${
                      i === 0 ? 'bg-coral/[0.12] font-semibold text-navy' : 'bg-cream text-navy/80'
                    }`}
                  >
                    <span className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-coral/25">
                      <Check className="h-2.5 w-2.5 text-coral-dark" strokeWidth={3} />
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
                {withAddon && (
                  <li className="flex items-start gap-2.5 rounded-xl border border-coral/35 bg-coral/[0.12] px-3 py-2.5 font-body text-[13.5px] font-semibold leading-snug text-navy sm:text-[14.5px]">
                    <span className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-coral/30">
                      <Check className="h-2.5 w-2.5 text-coral-dark" strokeWidth={3} />
                    </span>
                    <span>{UPGRADE.addon.name}</span>
                  </li>
                )}
              </ul>
            </Reveal>

            {/* Calendar */}
            <Reveal
              delay={100}
              className="rounded-3xl border border-navy/10 bg-white p-5 shadow-card sm:p-6"
            >
              <h2 className="font-body text-[13.5px] font-bold uppercase tracking-[0.1em] text-navy sm:text-[15px]">
                {WELCOME_RESET.calendarHeading}
              </h2>
              <div className="mt-4">
                <AddToCalendar page={page} />
              </div>
            </Reveal>

            {/* Closing */}
            <Reveal delay={130} className="pt-4 text-center">
              <Sparkle twinkle className="mx-auto h-4 w-4 text-gold" />
              <p className="mt-3 font-serif text-[16px] italic text-navy/75 sm:text-[18px]">
                {WELCOME_RESET.closing}
              </p>
            </Reveal>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
