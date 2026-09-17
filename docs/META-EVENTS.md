# Meta events: what fires, when, and where

Reference for analysing Meta event data from the **Stop Surviving. Start Designing.** masterclass funnel at `www.sonalibadani.com`. Read the whole file before drawing conclusions: section 5 lists the quirks that will otherwise produce wrong insights.

---

## 1. The funnel

```
Meta ad
  └─ /masterclass                       landing page, registration form (4-step modal)
       └─ /masterclass/upgrade          one-time offer (OTO)
            ├─ YES  → TagMango checkout (external) → /welcome-reset        paid ₹299
            │                                      → /welcome-reset-plus   paid ₹498
            └─ NO   → /welcome                                              free only
```

**The offer on `/masterclass/upgrade`:**

| Item | Price |
|---|---|
| The One Partner Reset (course) | ₹299 |
| The Love Legacy Visualization (optional add-on) | +₹199 |
| Both | ₹498 |

The add-on starts **unticked**. There is one "Yes" button whose price label changes with the add-on: ₹299 without it, ₹498 with it.

---

## 2. Quick reference

All URLs below are on `https://www.sonalibadani.com`. The `event_source_url` Meta receives is the page URL **with the query string removed**, so UTMs never appear in it.

| Your label | Meta event name | Fires when | Page | Value (INR) |
|---|---|---|---|---|
| Add to Cart | `AddToCart` | The registration form is opened, from any button including the sticky bar | `/masterclass` | 0 |
| 299 Purchase CTA | `oto_reset_cta` | "Yes" tapped with the add-on **off** | `/masterclass/upgrade` | 299 |
| Add 199 CTA | `oto_reset_plus_add` | The add-on is switched **on** | `/masterclass/upgrade` | 498 |
| 498 Purchase CTA | `oto_reset_plus_cta` | "Yes" tapped with the add-on **on** | `/masterclass/upgrade` | 498 |
| Add-on Decline CTA | `oto_decline` | "No thank you, I will just take my seat" tapped | `/masterclass/upgrade` | none |
| Whatsapp Join CTA | `whatsapp_join` | A WhatsApp group button is tapped | `/welcome`, `/welcome-reset`, `/welcome-reset-plus` | none |
| sales | `sales` | A purchase thank-you page loads | `/welcome-reset` or `/welcome-reset-plus` | 299 or 498 |

Context events, needed for funnel ratios:

| Meta event name | Fires when | Page | Value |
|---|---|---|---|
| `PageView` | Every page load (browser pixel) | every page | none |
| `ViewContent` | 3 seconds after landing (a bounce does not count) | `/masterclass` | none |
| `CompleteRegistration` | Registration form submitted successfully | `/masterclass` | 0 |
| `Lead` | Same moment as `CompleteRegistration`, fired alongside it | `/masterclass` | 0 |
| `Purchase` | Same moment as `sales`, fired alongside it | `/welcome-reset` or `/welcome-reset-plus` | 299 or 498 |

---

## 3. Each event in detail

### `AddToCart`  (Add to Cart)

- **Page:** `/masterclass`
- **Trigger:** the registration form opens. Every way in fires it: the in-page buttons in the Hero, Method, What We Cover, Who This Is For, Proof and Final Close sections, and the sticky "Save my seat" bar at the bottom of the screen. One event per open.
- **Before 17 Sept 2026 the sticky bar did not fire it.** See quirk 5.1.
- **Meaning:** intent to register. It is not a cart and nothing is being bought; the masterclass is free.
- **custom_data:** `content_name: "Stop Surviving. Start Designing. registration"`, `content_type: product`, `currency: INR`, `value: 0`
- **event_id:** `<lead_id>_atc` for someone who has registered before; a **new random id on every tap** for a first-time visitor. See quirk 5.3.

### `oto_reset_cta`  (299 Purchase CTA)

- **Page:** `/masterclass/upgrade`
- **Trigger:** she taps "Yes, add The One Partner Reset for ₹299" while the add-on is **not** selected. The button appears in the page and in a sticky bottom bar; both fire this.
- **What happens next:** she is sent to the ₹299 TagMango checkout. **This is a click, not a purchase.** She may abandon at checkout.
- **custom_data:** `content_name: "The One Partner Reset"`, `currency: INR`, `value: 299`
- **event_id:** `<lead_id>_otoreset`

### `oto_reset_plus_add`  (Add 199 CTA)

- **Page:** `/masterclass/upgrade`
- **Trigger:** the Love Legacy Visualization add-on changes from **off to on**. Either add-on control fires it (the add-on card button, or the checkbox in the order summary).
- **Does NOT fire** when the add-on is switched off. Toggling off and on again fires again, but see event_id.
- **Meaning:** interest in the add-on. It is **not** a commitment to buy; she can still switch it off, decline, or abandon.
- **custom_data:** `currency: INR`, `value: 498` (the new total, not 199)
- **event_id:** `<lead_id>_otoadd`, identical on every toggle, so Meta counts it once per person per 48 hours.

### `oto_reset_plus_cta`  (498 Purchase CTA)

- **Page:** `/masterclass/upgrade`
- **Trigger:** she taps the "Yes" button while the add-on **is** selected. Label reads "Yes, add The One Partner Reset for ₹498".
- **What happens next:** she is sent to the ₹498 TagMango checkout. **A click, not a purchase.**
- **custom_data:** `content_name: "The One Partner Reset + Love Legacy Visualization"`, `currency: INR`, `value: 498`
- **event_id:** `<lead_id>_otoresetplus`
- **Exactly one** of `oto_reset_cta` or `oto_reset_plus_cta` fires per "Yes" tap, never both.

### `oto_decline`  (Add-on Decline CTA)

- **Page:** `/masterclass/upgrade`
- **Trigger:** she taps "No thank you, I will just take my seat".
- **Important:** despite the label, this declines the **entire paid offer**, not only the add-on. Unticking the add-on fires nothing at all. After this event she goes to `/welcome` and has bought nothing.
- **custom_data:** none
- **event_id:** `<lead_id>_otodecline`

### `whatsapp_join`  (Whatsapp Join CTA)

- **Pages and buttons:**

  | Page | Who lands here | Buttons | `group` value |
  |---|---|---|---|
  | `/welcome` | Registered, declined the offer | 1 | `masterclass` |
  | `/welcome-reset` | Bought ₹299 | 2 | `masterclass`, `reset-community` |
  | `/welcome-reset-plus` | Bought ₹498 | 2 | `masterclass`, `reset-community` |

- **Trigger:** she taps a button that opens the WhatsApp group invite in a new tab.
- **`masterclass` group** is where the Zoom link and every reminder are posted. It is compulsory for attending. **`reset-community`** is the private community for course buyers only.
- **This is a tap, not a confirmed join.** We cannot see whether she actually joined inside WhatsApp.
- **custom_data:** `page` (`welcome`, `welcome-reset` or `welcome-reset-plus`), `group` (`masterclass` or `reset-community`)
- **event_id:** `<lead_id>_wa_<page>_<group>`. Repeat taps on the same button collapse to one at Meta within 48 hours.
- **Why it matters:** only about 2 in 10 registrants were joining the masterclass group before 3 Sept 2026, which meant 8 in 10 never received a Zoom link. See section 6.

### `sales` and `Purchase`

- **Pages:** `/welcome-reset` (value 299) and `/welcome-reset-plus` (value 498). TagMango redirects the buyer to one of these after a successful payment.
- **Trigger:** the page **loads**. Both events fire together, once.
- **Value is decided by which page loaded**, not by what she clicked on the upgrade page.
- **custom_data (both):** `content_name: "The One Partner Reset"`, `content_type: product`, `currency: INR`, `value: 299` or `498`
- **event_id:** `Purchase` → `pur_<uuid>`, `sales` → `pur_<uuid>_sales`. The same `pur_<uuid>` appears as `purchase_event_id` in the CRM, so a Meta purchase and a CRM row can be joined on it.
- **Guards, in order.** It fires only if all pass:
  1. the host is the production domain;
  2. the browser holds a registration with an email (someone who opens the URL directly without registering fires nothing);
  3. this purchase id has not already fired in this browser (reloads fire nothing).
- **Not payment-verified.** See quirk 5.4.

---

## 4. What every event carries

**Transport:** every event except `PageView` is sent **server-side through the Conversions API**. Only `PageView` comes from the browser pixel. Expect `action_source: website` on all of them.

**user_data** (hashed fields are SHA-256, normalised before hashing):

| Key | Contents | Present |
|---|---|---|
| `em` | email | after registration |
| `ph` | country code + phone | after registration |
| `fn`, `ln` | first and last name | after registration |
| `ct` | city, spaces removed | after registration |
| `country` | ISO country, e.g. `in` | after registration |
| `external_id` | normalised email | after registration |
| `fbc` | Meta click id cookie, unhashed | if she arrived from a Meta ad click |
| `fbp` | Meta browser id cookie, unhashed | almost always |
| `client_ip_address` | real IP, read server-side | always |
| `client_user_agent` | real user agent, read server-side | always |

Before registration, only `fbp`, `fbc`, IP and user agent exist. So **`ViewContent` and a first-time visitor's `AddToCart` have much weaker matching** than everything after the form. That is expected, not a defect.

**GA4** receives the same event names in parallel, **except `Purchase` and `sales`**, which are Meta only. GA4 does not deduplicate on event id, so GA4 counts will run higher than Meta counts for the same event.

---

## 5. Quirks that will distort analysis

### 5.1 `AddToCart` undercounted before 17 Sept 2026

Until 17 Sept 2026 the sticky "Save my seat" bar pinned to the bottom of the landing page opened the form **without firing `AddToCart`**. Only the in-page buttons fired it. The bar is visible on phones and desktops for most of the scroll, so a meaningful share of registrations produced no `AddToCart`.

Consequence for data **before** that date: `CompleteRegistration` can exceed `AddToCart`, and "form open to completion" rates computed from `AddToCart` are inflated. From 17 Sept every form open fires it once, so expect a visible step up in `AddToCart` volume on that date that is a tracking fix, not a change in behaviour.

### 5.2 CTA clicks are not purchases

`oto_reset_cta` and `oto_reset_plus_cta` fire when she leaves for the external TagMango checkout. Whatever happens on TagMango is invisible. The drop between these clicks and `sales` is checkout abandonment plus any payment failure.

### 5.3 Deduplication differs by event

Meta collapses events with the same `event_name` + `event_id` within 48 hours.

- **After registration**, every event id is built from her `lead_id`, so repeat taps by the same person inside 48 hours count once.
- **Before registration** there is no `lead_id`, so a first-time visitor's `ViewContent` and `AddToCart` get a **fresh random id each time**. Three taps by one woman are three `AddToCart` events.
- Consequence: pre-registration events **count actions**, post-registration events **approximate people**. Do not compare the two as if they measured the same thing.

### 5.4 Purchases are page loads, not verified payments

TagMango's server-to-server order webhook requires a paid plan that is not active, so there is no confirmation that money moved. `sales` fires when the thank-you page loads. The three guards in section 3 remove the common false positives (reloads, and team members opening the link without registering), but they do not make it proof of payment.

Consequence: `sales` should be **reconciled against TagMango's own order records** before being treated as revenue. If `sales` exceeds TagMango orders for a period, the gap is false positives.

### 5.5 A second purchase from the same browser does not fire

The purchase id is created once, when she first taps "Yes", and is not reset after a purchase. If the same woman on the same browser buys twice (for example ₹299, then later returns and buys again), the second thank-you page sees an id that has already fired and **sends nothing**. Expect this to be rare, but repeat purchases are undercounted.

### 5.6 The upgrade page only exists for registrants

`/masterclass/upgrade` sends anyone without a registration back to `/masterclass`. Every OTO event therefore comes from someone who registered. The denominator for OTO rates is `CompleteRegistration`, not traffic.

### 5.7 Nothing fires outside production

Events fire only on `www.sonalibadani.com` and `sonalibadani.com`. Local development and Vercel preview deployments send nothing to Meta.

### 5.8 Data only exists once the access token was live

All Conversions API events depend on `META_CAPI_ACCESS_TOKEN` being set in Vercel. For any period before it was set, only `PageView` exists. Check the first date `CompleteRegistration` appears before analysing trends; an apparent step-change on that date is the token going live, not a change in behaviour.

---

## 6. Funnel changes to account for

Dates are when the change was committed. Deployment may have followed shortly after. Treat these as candidate breakpoints when comparing periods.

| Date | Change | Likely effect on the data |
|---|---|---|
| 2026-08-24 | Landing copy reworked around "Stop Surviving. Start Designing." | Landing to registration rate |
| 2026-08-25 | All Meta events moved to server-side CAPI; `oto_*` event names introduced; production-only gate added | Event names before and after this date are not comparable. Earlier data used browser-pixel events and a different set of names |
| 2026-08-25 | Fixed a bug where returning to the upgrade page from checkout left the "Yes" button dead until reload | `oto_reset_plus_cta` and `oto_reset_cta` from returning visitors were undercounted before this |
| 2026-08-25 | New hero image on the landing page | Landing engagement, `ViewContent`, `AddToCart` |
| 2026-09-03 | Registration form now states the WhatsApp group is compulsory and that the Zoom link is posted only there | Expected rise in `whatsapp_join` (group `masterclass`) per registration |
| 2026-09-03 | Form step 4 now requires a tick confirming she will join the WhatsApp group | Same, and possibly a small drop in `CompleteRegistration` |
| 2026-09-03 | Fixed desktop mouse scrolling on form step 4, which previously could not be scrolled | Desktop `CompleteRegistration` was likely suppressed before this |
| 2026-09-03 | "Camera off" reassurance replaced with a request to keep cameras on | Possible drop in `CompleteRegistration`; the old copy answered a privacy objection |
| 2026-09-17 | Sticky "Save my seat" bar now fires `AddToCart` | `AddToCart` rises from this date as a tracking fix. Do not compare `AddToCart` across it |

---

## 7. Useful ratios

Suggested starting points. Each uses a denominator that section 5 supports.

| Question | Calculation | Watch out for |
|---|---|---|
| Landing to registration | `CompleteRegistration` ÷ landing `PageView` | PageView includes repeat visits |
| Offer take-up | (`oto_reset_cta` + `oto_reset_plus_cta`) ÷ `CompleteRegistration` | Clicks, not purchases (5.2) |
| Offer decline | `oto_decline` ÷ `CompleteRegistration` | Some registrants close the tab and fire neither |
| Add-on interest | `oto_reset_plus_add` ÷ `CompleteRegistration` | Interest, not intent to buy |
| Add-on conversion at the button | `oto_reset_plus_cta` ÷ (`oto_reset_cta` + `oto_reset_plus_cta`) | |
| Checkout completion | `sales` ÷ (`oto_reset_cta` + `oto_reset_plus_cta`) | Reconcile `sales` with TagMango (5.4) |
| Average order value | sum of `sales` value ÷ count of `sales` | Only 299 or 498 are possible |
| WhatsApp join, free path | `whatsapp_join` where `page = welcome` ÷ `oto_decline` | A tap is not a confirmed join |
| WhatsApp join, buyers | `whatsapp_join` where `group = masterclass` and page is a `welcome-reset*` page ÷ `sales` | |
| Masterclass group reach, overall | `whatsapp_join` where `group = masterclass` ÷ `CompleteRegistration` | The single number that decides attendance |
