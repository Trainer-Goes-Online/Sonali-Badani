# The One Partner Reset — Funnel Enhancement Plan

**Goal:** take every section of the funnel from its current (already-solid) state to a **200% version** using the plugins and skills now installed in this project.

**Prepared:** 2026-06-11 · Stack: Next.js 14.2 · React 18 · Tailwind 3.4 · framer-motion 11 · Razorpay · Calendly

---

## 0. What got installed, and how to use it

Everything you listed is installed. Marketplace plugins are pinned to **this project** (`.claude/settings.json`); design skills live in **`.claude/skills/`**; `get-shit-done` installed globally to `~/.claude`.

| # | What | Type | Where it lives | Status |
|---|------|------|----------------|--------|
| 1 | **superpowers** | plugin (project scope) | `~/.claude/plugins/cache/claude-plugins-official/superpowers/5.1.0` | ✅ enabled |
| 2 | **get-shit-done** (67 skills + hooks) | global system | `~/.claude/get-shit-done` + `~/.claude/skills` | ✅ installed |
| 3 | **context-mode** | plugin (project scope) | `~/.claude/plugins/marketplaces/context-mode` | ✅ enabled |
| 4 | **claude-mem** | plugin (project scope) | `~/.claude/plugins/marketplaces/thedotmack` | ✅ enabled |
| 5 | **frontend-design** | plugin (project scope) | `~/.claude/plugins/cache/claude-plugins-official/frontend-design` | ✅ enabled |
| 6 | **impeccable** | skill | `.claude/skills/impeccable` | ✅ installed |
| 7 | **taste-skill** | skill | `.claude/skills/taste-skill` | ✅ installed |
| 8 | **motion-framer** | skill | `.claude/skills/motion-framer` | ✅ installed |
| 9 | **ui-ux-pro-max** (+ 6 companions) | skill bundle | `.claude/skills/{ui-ux-pro-max,design,design-system,ui-styling,brand,banner-design,slides}` | ✅ installed |
| 10 | **emil-design-eng** | skill | `.claude/skills/emil-design-eng` | ✅ installed |
| 11 | **agent-browser** | skill (+ CLI) | `.claude/skills/agent-browser` | ⚠️ skill installed; CLI needs one command (below) |

**To activate the plugins as slash-commands:** restart Claude Code (the plugin skills load at session start). Then `/superpowers`, `/context-mode:ctx-*`, claude-mem's `mem-search` / `design-is`, and the GSD `/gsd:*` commands become available. The design skills in `.claude/skills/` are invoked by name (e.g. "use the taste-skill", "/impeccable polish").

**Two caveats to fix before relying on them:**
1. **agent-browser** needs its engine: `npm i -g agent-browser && agent-browser install` (downloads Chrome for Testing; no Playwright/Node runtime needed). Deterministic commands need no API key; only the optional `chat` mode needs `AI_GATEWAY_API_KEY`.
2. **ui-ux-pro-max**: in this clone the `data/` and `scripts/` symlinks point at a `src/ui-ux-pro-max/` folder that wasn't included, so the **rule corpus in `SKILL.md` is fully usable but the live Python search CLI is not runnable as-is**. We use it as a checklist/ruleset, not as a live search tool (or re-clone with the `src/` payload if you want the CLI).

> Unrelated but worth noting from install: `npm audit` flagged a security advisory on `next@14.2.13`. Bump to the latest patched 14.2.x once the app is confirmed running.

---

# OUTPUT 1 — Plugin / Skill Catalog (what each does + where it fits the funnel)

Grouped by the job they do. "Funnel fit" names the exact section(s) or concern each one serves.

## A. Orchestration & engineering discipline (the "how we work" layer)

### 1. superpowers
**What it is:** A complete agentic dev methodology delivered as auto-firing skills — `brainstorming` → `writing-plans` (2–5 min tasks with exact file paths) → `subagent-driven-development` (fresh reviewed subagent per task) → `test-driven-development` (RED-GREEN-REFACTOR) → `verification-before-completion` → `requesting-code-review`. Plus `using-git-worktrees` and `dispatching-parallel-agents`.
**Funnel fit:** The **methodology driver** for risky work. Use TDD + verification on the **Razorpay checkout / verify route** (the one place a bug = lost revenue), and worktrees to build independent sections (FAQ, Testimonials, Guarantee) in parallel with built-in review.

### 2. get-shit-done (GSD)
**What it is:** Spec-driven meta-system. Pipeline `/gsd:new-project → spec-phase → discuss-phase → ui-phase → plan-phase → execute-phase → verify-work → ship`, with `/gsd:sketch` (2–3 throwaway HTML layout variants), `/gsd:ui-review` (6-pillar visual audit, scored), `/gsd:add-tests` (Playwright E2E), `/gsd:secure-phase` (threat audit).
**Funnel fit:** The **project-level orchestrator** if you want full spec→ship traceability. `/gsd:sketch` for Hero/Offer/CTA layout A/B/C before coding; `/gsd:ui-review` as the polish gate; `/gsd:add-tests` for the checkout→thank-you path; `/gsd:secure-phase` for Razorpay keys + signature verification.

### 3. context-mode
**What it is:** MCP server + hooks that run big commands/reads in a sandbox and index output into an FTS5 search DB — only summaries enter context (~98% saving). Tools: `ctx_execute`, `ctx_fetch_and_index`, `ctx_search`; skills `/context-mode:ctx-stats|ctx-doctor|ctx-search`.
**Funnel fit:** **Context hygiene** so you can edit many sections in one long session without compaction. `ctx_fetch_and_index` the **Razorpay** + **Calendly** docs once, then `ctx_search` snippets instead of re-pasting while wiring checkout. Keeps `npm run build` / Tailwind logs out of the window.

### 4. claude-mem
**What it is:** Persistent cross-session memory — auto-captures decisions into a knowledge graph and re-injects them next session. Skills: `mem-search` ("how did we wire the payment callback?"), `make-plan` + `do`, and a UI-relevant **`design-is`** (audits a design against Dieter Rams' 10 principles → emits a fix plan).
**Funnel fit:** Remembers **brand voice, the locked navy/coral palette, copy rules (no em/en dashes), and Razorpay config** across days so you never re-explain. `design-is` audits each section and hands off a concrete fix prompt.

> **Overlap warning:** superpowers, GSD, and claude-mem all ship plan/execute skills. Pick **one** as the methodology driver (recommendation below) so competing planners don't fire together. Use claude-mem for *memory* and context-mode for *context* only.

## B. Design taste & craft (the "make it not look templated" layer)

### 5. frontend-design (Anthropic)
**What it is:** Forces a "Design Thinking" pass (purpose → one BOLD direction → one memorable differentiator) before coding, and bans generic AI aesthetics (no Inter/Roboto, no purple-gradient-on-white). Explicitly recommends the Motion library + staggered reveals.
**Funnel fit:** **Hero** art direction and the overall aesthetic commitment — keeps the page from reading as a templated landing page.

### 6. impeccable
**What it is:** Command-driven craft system (`/impeccable craft|polish|animate|bolder`). Register-aware (brand vs product), runs an "AI slop test" on itself, enforces WCAG contrast, typography (65–75ch, paired fonts), motion (ease-out, no bounce, reduced-motion mandatory), and the **eight interactive states** (default/hover/focus/active/disabled/loading/error/success).
**Funnel fit:** **Whole-page final polish pass**, and the **checkout** interaction-state wiring (focus rings, labels-not-placeholders, errors with `aria-describedby`, loading state on Pay).

### 7. taste-skill
**What it is:** Anti-slop skill **scoped exactly to landing pages** on **Next.js + Tailwind + Motion** (your stack). Declares a "Design Read", sets three dials — `DESIGN_VARIANCE`, `MOTION_INTENSITY`, `VISUAL_DENSITY` — then enforces hero discipline (≤4 text elements, headline ≤2 lines, no trust-strip in hero), CTA locks (one label per intent, contrast/wrap checks), copy self-audit (em-dash ban — already your house rule), and section-layout-repetition bans.
**Funnel fit:** The **single most on-target skill**. Governs **Hero discipline, CTA consistency across all sections, testimonial credibility, and copy/motion guardrails** end to end.

### 8. emil-design-eng
**What it is:** Emil Kowalski's micro-interaction craft. The **Animation Decision Framework** (should this animate? what's its purpose? how often is it seen?), custom easing (never `ease-in` on UI), durations <300ms, springs for gestures, perceived-performance tricks, and a hard rule that reviews come back as a Before/After/Why table.
**Funnel fit:** **CTA + checkout micro-interactions**, **FAQ accordion**, **testimonial swipe**, and the **thank-you/welcome "delight" moment** (the one place its framework permits richer motion). Also flags your current infinite CTA pulse for reconsideration.

## C. Design systems, UI implementation & assets (the "build it" layer)

### 9. ui-ux-pro-max (flagship)
**What it is:** Design-intelligence ruleset — 50+ styles, 161 palettes, 57 font pairings, landing-page structures, and a 10-priority rule system (accessibility → charts) with a pre-delivery checklist (contrast 4.5:1, ≥44px targets, focus rings, reduced-motion, CLS<0.1, 150–300ms timing, semantic tokens not raw hex). `--persist` writes a `MASTER.md` + per-page overrides.
**Funnel fit:** The **QA checklist + design-system source of truth**. Run its checklist against checkout and every section. (CLI caveat above — use as ruleset.)

### 10. design (orchestrator)
**What it is:** Router that delegates brand→`brand`, tokens→`design-system`, code→`ui-styling`, plus built-in asset generators (logo, corporate identity, SVG icons, social photos via Gemini/HTML→screenshot).
**Funnel fit:** Single entry point for a full redesign; generates **consistent SVG icons** for Mechanism/Offer/WhatHappensNext (replacing generic lucide glyphs) and **social share assets** for thank-you/welcome.

### 11. design-system
**What it is:** Token architecture specialist — three-layer model (primitive → semantic → component), generates `tokens.css`, maps to Tailwind, and `validate-tokens.cjs` flags hardcoded hex.
**Funnel fit:** Promote your locked palette in `tailwind.config.ts` + `globals.css` into a **formal semantic token layer** (`--surface`, `--foreground`, `--cta`, `--cta-hover`) so every section themes from one source; run the validator to catch stray hex.

### 12. ui-styling
**What it is:** Hands-on React/Next.js + Tailwind + shadcn implementation: accessible Radix components, responsive utilities, dark mode, and a ready-made **react-hook-form + Zod** validated form pattern.
**Funnel fit:** Rebuild the **FAQ as an accessible Accordion**, and refactor the **checkout** onto react-hook-form + Zod with on-blur validation and labels.

### 13. brand
**What it is:** Brand source-of-truth: voice, messaging frameworks (Mission→Vision→Value Prop→Positioning→Key Messages→**Proof Points**), and `sync-brand-to-tokens.cjs`.
**Funnel fit:** Codify Sonali's **"Love Legacy" voice** and proof points so every section (Hero value prop → Testimonials proof → Guarantee) stays on-voice; feeds tokens downstream.

### 14. banner-design
**What it is:** Generates hero/ad visuals (AI image + HTML/CSS overlay) at exact platform sizes; 22 art-direction styles; safe-zone/CTA rules.
**Funnel fit:** Produce the **Hero background/portrait treatment** (currently a placeholder) and matching **Meta/Google ad creatives** that feed cold traffic in — visually consistent with the landing Hero.

### 15. slides
**What it is:** Strategic-deck skill whose real value here is its **25 copywriting formulas mapped to emotion arcs** — PAS, Cost-of-Inaction, Before-After-Bridge, Value Stack, AIDA/Urgency.
**Funnel fit:** A **copy-structure lens** that maps 1:1 onto your sections (PAS → SoundLikeYou/TheLoop; Before-After-Bridge → AnotherVersion; Value Stack → OfferStack; AIDA/Urgency → FinalClose/Checkout). Can also generate a VSL/webinar lead magnet upstream.

## D. Motion & QA

### 16. motion-framer
**What it is:** Deep framer-motion patterns — variant orchestration (`staggerChildren`, `delayChildren`), `whileInView` scroll reveals, `AnimatePresence` (carousels, accordions), `useScroll`/`useTransform` (parallax, progress, scroll-counters), `layout`/`layoutId`, spring physics, and `useReducedMotion`.
**Funnel fit:** **Every section's entrance + the interactive ones.** Note: framer-motion is installed but your reveals are currently hand-rolled CSS+IntersectionObserver (`Reveal.tsx`) — see the upgrade strategy in Output 2.

### 17. agent-browser
**What it is:** Fast Rust browser-automation CLI — a11y-tree snapshots with `@eN` refs, screenshots, form-fill, `batch` flows, network mocking, multi-viewport/device emulation.
**Funnel fit:** **Automated visual QA** (screenshot Hero→FAQ at 375/768/1440px), **conversion-flow testing** (script CTA→checkout→thank-you, mocking Razorpay with `network route --abort/--body` so you exercise the success path without a real charge), and a11y-tree checks that every CTA/control is labelled.

---

# OUTPUT 2 — The 200% Plan: exact skill → section → changes

## Strategy in one paragraph
The funnel is already well-built (locked palette, careful copy, sticky-stack offer, A/B flags). "200%" doesn't mean a rewrite — it means: **(1)** lay a real design spine (`brand` voice → `design-system` semantic tokens → `taste-skill` dials), **(2)** upgrade motion from hand-rolled CSS to **orchestrated `motion-framer`** where it adds persuasion (and keep CSS where it protects Lighthouse), **(3)** apply **`emil-design-eng` + `impeccable`** craft to the conversion-critical surfaces (Hero, CTA, checkout), **(4)** fix the real assets gap (Hero photo/video + `banner-design`), and **(5)** gate it with **`agent-browser` QA + `gsd:ui-review`**. Drive the whole thing with **one** methodology (recommendation below), with claude-mem holding memory and context-mode holding context.

### Recommended methodology driver
Use **superpowers** as the driver for this existing-codebase enhancement (lighter than full GSD: brainstorm → tiny plans → TDD on checkout → code review). Reserve **GSD** for two specific high-value tools — `/gsd:sketch` (Hero/Offer layout variants) and `/gsd:ui-review` (final 6-pillar audit). Keep **claude-mem** for memory and **context-mode** for docs/context only. Don't run all three planners at once.

### Global dial settings (taste-skill) — set these once, applied everywhere
- `DESIGN_VARIANCE = 4` — calm, premium, mostly symmetric with deliberate breaks (this is an emotional/trust sale to women in distress, not a flashy SaaS).
- `MOTION_INTENSITY = 4` — present and reassuring, never cinematic/distracting.
- `VISUAL_DENSITY = 3` — airy, generous whitespace, one idea per screen.

---

## The design spine (do this first — it makes every section change cheaper)

| Step | Skill | Exact change |
|------|-------|--------------|
| S1 | **brand** | Write `docs/brand-guidelines.md`: lock the "Love Legacy" voice, the value prop ("change your side of the pattern, change the marriage"), and 5 Proof Points (2,000+ sessions, Soul Space since 2023, the testimonial outcomes). This becomes the source for all copy decisions. |
| S2 | **design-system** | Promote `tailwind.config.ts` + `globals.css` vars into a 3-layer token set: primitives (navy/coral/white/black + tints) → semantic (`--surface`, `--surface-warm`, `--foreground`, `--foreground-muted`, `--cta`, `--cta-hover`, `--ring`) → component. Run `validate-tokens.cjs` to flag any raw hex in components (e.g. the inline `#203F5C` Razorpay theme color). |
| S3 | **taste-skill** | Record the dials above and the "Design Read" one-liner at the top of the plan; this gates every layout/motion/density decision below. |
| S4 | **motion-framer** | Create a shared `lib/motion.ts` exporting variant presets (`fadeUp`, `staggerParent`, `scaleIn`) + a `<Reveal>` v2 that wraps `motion` with `whileInView`/`viewport={{ once: true }}` and honors `useReducedMotion()`. Keep the existing CSS `.reveal` for text-only blocks (Lighthouse), use motion variants for orchestrated/interactive ones. |

---

## Section-by-section (in page order)

> Format: **Primary skill** + supporting · **Before → After** · concrete changes.

### Header + nav
**Skills:** taste-skill, emil-design-eng
**Before → After:** static bar → trust-calibrated, one-line nav with a scroll-aware condensed state.
- taste-skill nav rule: keep to one line ≤80px, **one CTA label** matching the global lock (see CTA section).
- emil: on-scroll shrink/elevate the header with a 150–200ms `transform`/`backdrop-blur` transition (not height animation).

### 1 · Hero — *highest leverage; spend the most here*
**Skills:** taste-skill (lead) + frontend-design + banner-design + motion-framer + impeccable
**Before → After:** centered text + **placeholder portrait** + eyebrow + callout + trust bar (6 stacked text elements) → a disciplined, image-led hero that passes the slop test.
- **Fix the asset gap (banner-design + real media):** the portrait is a literal placeholder (`/public/sonali-hero` TODO in `Hero.tsx`). Add Sonali's real photo or a looping muted video; use `banner-design` to generate the atmospheric coral-orb backdrop treatment as an optimized asset instead of pure CSS blur. *Both taste-skill and impeccable treat zero-imagery as a bug.*
- **Apply hero discipline (taste-skill):** you currently stack Markie chip + callout + H1 + sub + without-line + offer-line + CTA + guarantee + trust bar. taste-skill caps the hero at ~4 text elements and **bans the trust-strip inside the hero**. Move `trustBar` ("2,000+ transformation sessions · The Soul Space") to a slim **BrandBand-adjacent strip just below the fold**, and fold `without` into the sub. Result: a cleaner first screen that fits `min-h-[100dvh]` without scrolling on mobile.
- **Motion (motion-framer):** replace the CSS `animate-fade-up` delay-laddering with a **variant container using `staggerChildren: 0.08`** so headline → sub → CTA reveal as one orchestrated sequence; add a subtle `useScroll`+`useTransform` parallax on the portrait only. Honor `useReducedMotion`.
- **Craft (impeccable):** keep the `.mark` highlighter (it's a nice differentiator) but verify body contrast — `text-navy/70` callout on white passes, but check the `text-navy/45` placeholder label and any gray-on-tint. Strip the eyebrow-on-every-section pattern (slop tell) down the page.

### 1b · BrandBand
**Skills:** slides (copy), motion-framer
**Before → After:** static two-line statement → a memorable, well-paced brand promise.
- slides "Before-After-Bridge" framing already matches line 2 (one woman → family → generation). Keep copy; set it on the warm surface token with a single `whileInView` fade and tight `tracking-tight leading-none` display type (taste-skill bias-correction).
- This is the natural home for the **trust-strip relocated from the Hero**.

### 2 · SoundLikeYou (Does this sound like you)
**Skills:** slides (PAS) + motion-framer + impeccable
**Before → After:** flat list of 6 pains → a rhythmic, staggered "problem-agitation" beat that builds recognition.
- slides **PAS** formula confirms the structure; keep the 6 verbatim lines.
- motion-framer: stagger the 6 items in on scroll (`staggerChildren`, 60–80ms) so each lands like a heartbeat instead of all at once.
- impeccable layout rule: these are **not cards** — render as a typographic list with rhythm (vary spacing), avoid the identical-card-grid slop tell.

### 3b · TheWomanBecoming (identity)
**Skills:** taste-skill (copy density) + motion-framer
**Before → After:** 4 paragraphs → an intimate identity beat with one emphasized turn.
- taste-skill copy rule: ≤25-word paragraphs; the 4 paras are fine — emphasize the pivot line ("It's about finding her again") with the `.mark` or a serif pull-quote, not bold-everything.
- Gentle blur-up reveal (`reveal--blur` already exists; port to a motion `filter` variant capped per reduced-motion).

### 4 · TheLoop
**Skills:** emil-design-eng + motion-framer + ui-ux-pro-max
**Before → After:** a wall of prose describing the loop → a **visualized loop** the reader *sees*.
- This is the mechanism's emotional core. Build a small **scroll-driven loop diagram** (sting → story → react → cold → stored → heavier) using `useScroll` + a connected SVG path that draws as you scroll (motion-framer scroll-reveal pattern).
- emil: keep it transform/opacity only, motivated motion, reduced-motion fallback = static diagram.
- ui-ux-pro-max: ensure the diagram has text fallback + contrast for accessibility.

### 5 · Mechanism (The One Partner Pivot)
**Skills:** design (icons) + slides + motion-framer
**Before → After:** 3 paragraphs + a pull-quote → a crisp "named mechanism" with a supporting visual.
- `design` skill: generate a simple, on-brand **SVG glyph for "The One Partner Pivot"** (one figure shifting a shared pattern) — gives the mechanism a memorable mark.
- motion-framer: animate `MECHANISM_PULL` ("Most women feel the first shift before they reach the end") as a `whileInView` emphasized line.

### 6 · ThirdOption
**Skills:** slides + taste-skill
**Before → After:** prose → a clear three-way visual contrast (keep quiet / leave / **the third way**).
- slides framing: present the two old options muted, the third option in coral emphasis — a glanceable contrast, not a paragraph. taste-skill section-layout-repetition rule: make this layout distinct from neighbors.

### 7 · AnotherVersion (30-day outcomes)
**Skills:** slides (Before-After-Bridge) + motion-framer
**Before → After:** intro + 6-item outcomes list → an aspirational, checkmarked "future state" that animates in.
- slides **Before-After-Bridge** is the exact formula. Render `OUTCOMES` as a staggered checklist (the `Checklist` UI component already exists) with coral checks revealing in sequence.

### 8 · Community
**Skills:** banner-design / design (social proof) + motion-framer
**Before → After:** 2 paragraphs → a warm "you're not alone" visual (tasteful representation of the private circle + the monthly live call).
- Generate an on-brand visual motif (avoid literal stock faces — privacy is a stated value); a soft "circle of women" abstract works. One gentle reveal.

### 9 · Testimonials — *credibility is conversion here*
**Skills:** taste-skill (lead) + emil-design-eng + motion-framer
**Before → After:** 3 quotes (currently a mobile CSS marquee) + anonymized attributions → credible, glanceable social proof that survives interaction.
- taste-skill: quotes ≤3 visible lines with full attribution; the anonymized bylines ("Marriage Transformation Client") are honest given the stated privacy policy — keep, but add a small "shared with permission · details changed for privacy" line (you already have `TESTIMONIALS_PRIVACY`; surface it prominently so anonymization *reads as integrity*, not weakness).
- emil + motion-framer: replace the infinite CSS `marquee` (no pause, can feel cheap and is hard to read) with an **`AnimatePresence` swipeable carousel** — spring-based, velocity-dismissible on mobile (`useMotionValue`), arrows on desktop. Motion has a clear purpose (browse), per emil's framework.
- taste-skill section-repetition: don't render as 3 identical white cards — vary.

### 9b · WhatHappensNext (5 steps)
**Skills:** ui-styling + design (icons) + motion-framer
**Before → After:** 5 text steps → a clear numbered process timeline that reduces "what do I actually get" anxiety.
- design: one consistent icon per step (See pattern / Assessment / Book call / Blueprint / Community).
- motion-framer: connected vertical timeline with `whileInView` step-by-step reveal; this directly de-risks the purchase.

### 10 · OfferStack — *already strong; refine, don't replace*
**Skills:** slides (Value Stack) + motion-framer + ui-ux-pro-max + emil-design-eng
**Before → After:** sticky-stacking bonus cards + value table → the same great structure with quantified, animated value.
- Keep the sticky-stack (it's a genuine differentiator). 
- slides **Value Stack** formula + your existing `VALUE_STACK` (₹12,500 → ₹497): in Version A, **animate the total with the existing `CountUp` component** on scroll-into-view, and visually weight the "Today ₹497" row (it's good already — push contrast).
- ui-ux-pro-max: ensure the strikethrough values keep 4.5:1 contrast (currently `text-navy/55 line-through` — verify).
- emil: the included-call reveal ("a private 15-minute call… included") is a rare, high-impact moment — give it a slightly richer reveal than the surrounding cards.

### 11 · MeetSonali
**Skills:** brand (voice) + banner-design + impeccable
**Before → After:** bio paragraphs → an authority section with a real portrait and a quantified credibility anchor.
- banner-design / real photo: add Sonali's professional portrait.
- brand: tighten the bio to the proof points; the `callAnchor` (₹15,000 sessions vs ₹497) is strong price-anchoring — keep and emphasize with `.mark`.
- impeccable polish: typography pairing (serif display + body), contrast pass.

### 12 · Guarantee
**Skills:** impeccable + design (seal) + motion-framer
**Before → After:** 2 paragraphs (a `GuaranteeSeal` component exists) → a confidence-radiating risk-reversal block.
- design: refine the guarantee seal/badge as a clean SVG (14-day, money-back).
- emil/motion: a single subtle scale-in on the seal when it enters view (rare element → a little delight is allowed).
- impeccable: this is a trust moment — strong contrast, no gray-on-tint.

### 13 · WhoFor (flagged optional)
**Skills:** taste-skill + ui-styling
**Before → After:** for/not-for/safety text → a clear two-column qualifier (for you / not for you) + a visually distinct safety note.
- taste-skill: distinct layout family from neighbors; the safety note must be calm and unmissable (ethical priority given the audience). Keep behind its flag but make it production-quality.

### 14 · FAQ
**Skills:** ui-styling (Accordion) + emil-design-eng + motion-framer
**Before → After:** 7 Q&A → an accessible, smoothly-animated accordion.
- ui-styling: rebuild as an accessible Radix/shadcn **Accordion** (keyboard + `aria-expanded`).
- emil + motion-framer: animate open/close with the **`layout` + `AnimatePresence` height-auto** pattern and a rotating chevron — interruptible CSS-transition timing (~200–250ms, custom ease-out), **not** an instant toggle and **not** animating raw `height`.
- Honor the `boldLead` field on the "scared the problem is me" answer as an emphasized first line.

### 15 · FinalClose
**Skills:** slides (AIDA/Urgency) + taste-skill + motion-framer
**Before → After:** closing paragraphs + price + scarcity → a focused final CTA with honest urgency.
- slides AIDA/Urgency: the `CLOSE_SCARCITY` ("first 100 women at ₹497, then ₹997") is real scarcity — present it as a small, credible badge, not a flashing banner (taste-skill: motivated, calm). 
- taste-skill CTA lock: this CTA uses the one global label/color.

### Sticky mobile CTA
**Skills:** emil-design-eng + motion-framer
**Before → After:** always-present bar → a bar that reveals on scroll-past-hero with buttery motion.
- emil: slide from its own height via `translateY(100%)`, full `transform` string (not framer `y` shorthand — the skill notes the shorthand isn't hardware-accelerated), reduced-motion = appear without slide.

---

## Checkout flow — *the revenue-critical surface; treat with the most rigor*

**Skills:** superpowers (TDD) + ui-styling (form) + impeccable (states) + emil-design-eng (feedback) + motion-framer + ui-ux-pro-max (checklist) + context-mode (Razorpay docs) + agent-browser (flow test)

**Current state (read from `CheckoutClient.tsx`):** validation on submit only; **placeholders used as labels**; errors render below; Razorpay theme color hardcoded `#203F5C`; bump + coupon logic solid.

**Before → After (200%):**
1. **Labels, not placeholders (impeccable + taste-skill + ui-ux-pro-max all flag this):** add visible `<label>` above every field; keep placeholder as hint only. Biggest single accessibility + conversion fix here.
2. **Validate on blur, not just submit (impeccable):** show field errors as the user leaves each field with `aria-describedby` wiring; you already clear-on-change — add validate-on-blur.
3. **react-hook-form + Zod (ui-styling ships this exact pattern):** refactor the hand-rolled `useState`/`validate` into RHF+Zod for robustness and less code; keep `libphonenumber-js` for the phone rule.
4. **Pay-button feedback (emil-design-eng):** `scale(0.97)` on `:active`, a fast spinner in the loading state ("Opening secure checkout…" already exists — make it feel instant), and **blur-masked** content swap. Note emil's rule: *no optimistic UI for payments* — keep the real verify step.
5. **Error motion (motion-framer):** shake (`x:[-8,8,-8,8,0]`) + `AnimatePresence` on the inline error line; animate the summary total when bump/coupon changes.
6. **Trust amplification (ui-ux-pro-max):** the `reassurance` list (secure checkout / guarantee / instant access) is good — pin it nearer the button and add a small lock/Razorpay-secured mark.
7. **Correctness gate (superpowers TDD):** write tests around `validate()`, `applyCoupon`, the 100%-off free path (`order.free → successPath`), and the verify handler before refactoring — this path must not regress.
8. **Docs without context bloat (context-mode):** `ctx_fetch_and_index` the Razorpay Checkout + webhook-signature docs once; `ctx_search` while wiring.
9. **Flow QA (agent-browser):** `batch` script Hero→CTA→checkout→fill→pay, mocking `/api/razorpay/order` + `verify` via `network route --body` so you exercise **thank-you + welcome** without a real charge; screenshot at 375/768/1440.

---

## Thank-you + Welcome pages
**Skills:** emil-design-eng (lead) + motion-framer + design (assets)
**Before → After:** flat confirmation → a genuine "you did it" moment + clear next step (book the 15-min call / Calendly).
- emil: this is the **rare, first-time moment its framework explicitly allows delight** — a checkmark draw or subtle celebration tuned to the program's warmth (not confetti-spam).
- motion-framer: staggered reveal of the onboarding steps; if you want route-level polish, `AnimatePresence mode="wait"` page transition checkout→thank-you.
- Make the Calendly booking the single clear CTA; `design` can produce a small share/welcome asset.

---

## Cross-cutting passes (run after sections are built)

| Pass | Skill | What it does |
|------|-------|--------------|
| P1 · Polish | **impeccable `polish`** | Whole-page: unify CTA styling, token-only spacing, all 8 interactive states, WCAG-AA contrast, copy/casing consistency, every empty/error/loading state. |
| P2 · Slop test | **taste-skill Pre-Flight + frontend-design** | Run the mechanical anti-slop checklist; strip eyebrow-on-every-section, identical card grids, any em/en dashes (house rule), fake-precise numbers. |
| P3 · Motion review | **emil-design-eng** | Review every animation "the next day / in slow motion"; deliver Before/After/Why table. Reconsider the **infinite CTA pulse** (constant motion on a frequently-seen element is exactly what emil's frequency rule cautions against — test pulse-on-idle-only vs always). |
| P4 · Accessibility/perf | **ui-ux-pro-max checklist** | Contrast 4.5:1, ≥44px targets, focus-visible rings, reduced-motion, CLS<0.1, 150–300ms timing, no raw hex. |
| P5 · Visual + flow QA | **agent-browser** | Multi-viewport screenshots Hero→FAQ; full conversion-flow batch test with Razorpay mocked. |
| P6 · Scored audit | **gsd:ui-review** | 6-pillar scored audit (Typography, Spacing, Hierarchy, Contrast, Responsiveness, Motion/brand) as the final gate. |
| P7 · Security | **gsd:secure-phase** | Audit Razorpay key handling + signature verification in `app/api/razorpay/*`. |

---

## Suggested execution order (so changes compound, not collide)

1. **Spine first:** S1–S4 (brand voice → semantic tokens → dials → `lib/motion.ts`). *Half a day; everything after is cheaper.*
2. **Hero + checkout** (highest leverage / highest risk) with superpowers driving and TDD on checkout.
3. **Persuasion sections in page order** (SoundLikeYou → FinalClose), parallelizable via worktrees since they're independent components.
4. **Thank-you/welcome** delight moment.
5. **Cross-cutting passes P1–P7** as the launch gate.
6. **`/gsd:add-tests`** for the checkout→thank-you E2E before driving paid traffic.

claude-mem runs throughout (remembers decisions); context-mode runs throughout (keeps docs/build logs out of context).

---

## A note on honesty / scope
- This plan **honors your existing locked palette, copy rules, and A/B flags** — it refines, it doesn't rip out. The biggest *new* wins are: real Hero/Sonali imagery, motion orchestration upgrade, checkout labels+on-blur validation, and the QA/test gates.
- Skills you listed that are **collections** were installed as their primary skill but ship companions you may want later: `taste-skill`'s repo also has `brandkit`/`minimalist`/`redesign` variants; `motion-framer`'s repo (freshtechbro) also has `gsap-scrolltrigger`, `scroll-reveal-libraries`, and `modern-web-design` — all relevant if you want to go further. Say the word and I'll add them.
- `ui-ux-pro-max` live CLI and `agent-browser` engine each need the one fix noted in §0 before they're fully operational.
