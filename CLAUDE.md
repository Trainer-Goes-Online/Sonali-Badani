# The Love Legacy Masterclass — working rules

## Self-review before handoff (agent-browser)

**Rule:** For any visual/UI change, do NOT tell the user "ready to review" until you
have looked at it yourself and are **>95% confident** it is correct and looks great.

The loop:
1. Make the change in localhost.
2. Use **agent-browser** to drive a real browser and capture screenshots at the
   viewports that matter — **mobile (390px) first, then 360px, 430px, and
   desktop (≈1440px)**. Scroll to and capture every section you touched.
3. Review the screenshots yourself. Check: layout/alignment, spacing, palette
   fidelity (navy / coral / cream / gold only), image fit/crop, responsive
   behavior, text legibility, motion/reveal, no overflow or clipping.
4. If anything is below bar, fix and re-capture. **Iterate until you are >95%
   confident.**
5. Only then surface it to the user for review, and say what you verified.

Two gotchas learned the hard way:
- **Never run `npm run build` while `npm run dev` is running.** They share
  `.next` and the build leaves the dev server serving unstyled pages. Stop dev
  first, or build, then `rm -rf .next` and restart dev.
- **Full-page screenshots do not fire the scroll reveals.** `.reveal` elements
  below the fold stay at opacity 0 in a `--full` capture. Scroll in steps with
  a ~1.2s settle before each shot instead.

agent-browser install:
```bash
npm i -g agent-browser
agent-browser install
agent-browser skills get core   # workflow reference
```

## The funnel

Four pages, one flow. Do not treat them as separate projects.

| Page | Route | Job |
|---|---|---|
| P1 | `/masterclass` | Convert cold Meta traffic into a registration. Target 50%+. |
| P2 | `/masterclass/upgrade` | Sell The One Partner Reset as a head start, not a second product. |
| P3A | `/welcome-reset` | Buyers. Push to WhatsApp, confirm email + course access. |
| P3B | `/welcome` | Non-buyers. Push to WhatsApp. |

```
Meta ad -> /masterclass
  -> stepwise modal (First name, Last name, Email, WhatsApp, City)
     -> registration webhook fires, Meta `Lead` fires
     -> INSTANT router.push to /masterclass/upgrade (no interstitial, ever)
        -> YES -> checkout link (with or without the add-on) -> /welcome-reset
        -> NO  -> /welcome
```

`/` redirects to `/masterclass`. The retired direct-sale routes (`/oto`,
`/checkout`, `/thank-you`) redirect too, so old links never 404.

## Non negotiables

1. **Mobile first.** Design at 390px. Over 90% of this traffic is a woman on a
   phone, often at night. Desktop is a centred column with more padding, never a
   desktop layout shrunk down.
2. **P1 loads in under 2 seconds on 4G.** The registration modal is
   `next/dynamic` with `ssr: false` specifically to keep libphonenumber-js and
   the country flag set out of the first load. Do not un-split it.
3. **No em dashes or en dashes in visible copy.** Not in copy, not in
   placeholders. Commas, periods, or the word "to" for ranges. The middot "·" is
   a separator and is allowed. Audit the built HTML before shipping.
4. **Do not change approved copy.** It lives in `lib/webinar-content.ts`. If
   something does not fit the layout, change the layout.
5. **Testimonials are never invented.** `PROOF.slots` stay `approved: false`
   until Sonali supplies real client words.
6. **The decline button on P2 is never disguised**, never shrunk, never below
   the fold. Trust is the actual asset at this price point.

## Design constraints (locked)

- **Palette:** navy `#203F5C`, navy-deep `#15293C`, coral `#F59075` /
  coral-dark `#E5795C`, cream `#FBF7F1` page base, warm sand `#F8ECE0`
  (`.bg-warm`) for alternating sections, gold `#C2A36B` for decorative
  flourishes only. No new hues. Coral is the action colour and is never a large
  flat background block; gold is never a CTA.
- **Type:** serif (`--font-serif`) for display headings/wordmark only;
  `font-body` (Gangjiem → humanist fallback) for everything else.
- **Photos:** `next/image` only. Note that everything in `/public/Hero-Image/`
  except `sonali-main-hero-image.JPG` is a One Partner Reset product creative
  carrying a `₹497` badge and is unusable on this funnel.
- **Motion:** CSS `.reveal` + IntersectionObserver, Lenis smooth scroll. Respect
  `prefers-reduced-motion`.
- **Tailwind:** the default spacing scale has no `4.5`/`5.5`. Use arbitrary
  values (`h-[18px]`) instead, or the class is silently dropped.

## Configuration

Everything environmental lives in `.env.local` (see `.env.example`). Dates,
times, seat count, prices, checkout links and both webhooks are env-driven, so
moving the webinar or changing a price is a one-line change plus a redeploy.
Read `lib/webinar-config.ts` and `lib/pricing.ts` before hardcoding anything.

Two Pabbly webhooks, deliberately separate:
- `NEXT_PUBLIC_PABBLY_REGISTRATION_WEBHOOK_URL` — new, fires on form submit.
- `NEXT_PUBLIC_PABBLY_WEBHOOK_URL` — existing, unchanged, fires only after a
  purchase on `/welcome-reset`.

## Project

Next.js 16 App Router + Tailwind + Lenis. Run locally: `npm run dev`.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
