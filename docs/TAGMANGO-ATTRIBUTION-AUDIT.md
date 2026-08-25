# TagMango attribution audit + purchase architecture

> ## ⛔ STATUS: the server-to-server design is BLOCKED, and not by anything here
>
> TagMango's **"New Order" trigger on Pabbly requires their Pro Plus plan**.
> Confirmed with TagMango support after two real orders completed and neither
> reached the trigger. The client has decided not to upgrade for now.
>
> **What shipped instead:** `Purchase` + `sales` fire from `/welcome-reset` and
> `/welcome-reset-plus` on page load, and the purchase webhook is posted from
> there too. See §6 for what was built and what it costs.
>
> Everything in §1 to §3 below stays true and stays valuable: it is the finished
> audit, and it is what §4's design would be built on **the day the plan is
> upgraded**. Do not repeat those probes; each cost a real order.

Section 3 of `PORTABLE-ATTRIBUTION-SPEC.md`, run against the live checkout on
2026-08-25. Findings below are empirical (real browser, real page, cleared
localStorage between probes) plus a read of TagMango's shipped bundle
`app/web/checkout/[mangoId]/page-6edf844c399b1630.js`.

Read this before writing any code. **The headline result inverts the spec's
assumed design: TagMango cannot prefill a custom field at all, so `ref_id1` /
`ref_id2` are unusable as carriers. A different and better carrier exists.**

---

## 1. Audit results

| Question | Answer for TagMango |
|---|---|
| Custom fields prefillable from URL? | **NO.** Not by any spelling. |
| Prefill query-param key format | n/a for custom fields |
| Character set accepted | untested (moot, see below) |
| Prefill length ceiling | untested (moot) |
| **Submit length ceiling** | **must be tested** on the carriers in §3 |
| Webhook payload path to the field | **must be tested** (Pabbly trigger) |
| Webhook signature scheme | n/a, Pabbly is the trigger, not us |
| Account shared with other products? | **Solved already** — the Pabbly trigger is scoped per-mango |
| Buyer fields the checkout collects | Name, Email, Phone (+dial code), City, State |

### 1.1 Custom fields do not prefill

The two fields exist and are correctly configured:

```json
"customFields": [
  {"fieldType":"text","fieldName":"City",   "fieldTextToShow":"City",   "_id":"6a22a1d1013d5bc0d2a3b13b"},
  {"fieldType":"text","fieldName":"ref_id1","fieldTextToShow":"ref_id1","optional":true,
   "helpText":"Filled in automatically please leave as is.","_id":"6a8d5774fead3b65bcd97f27"},
  {"fieldType":"text","fieldName":"ref_id2","fieldTextToShow":"ref_id2","optional":true,
   "helpText":"Filled in automatically please leave as is.","_id":"6a8d5774fead3b65bcd97f28"}
]
```

Note they are named **`ref_id1`** and `ref_id2`, not `ref_id`/`ref_id2`.

Twelve candidate key spellings were tried, each with a distinct marker value, on a
cleared browser:

```
ref_id1  refId1  REF_ID1  ref-id1  cf_ref_id1  custom_ref_id1
customField_ref_id1  customFields[ref_id1]  cf[ref_id1]
6a8d5774fead3b65bcd97f27      (the field _id)
fields[6a8d5774fead3b65bcd97f27]
City                          (the OTHER custom field, as a control)
```

**Every one produced an empty field.** The `City` control is what makes this
conclusive: no custom field of any kind is reachable from the URL, so this is not
a naming problem to keep guessing at.

The bundle confirms it. State initialises as `customFieldsObj: {}` and the only
code that ever seeds it reads `fieldType === "hidden"` and uses the field's
`staticFieldValue`, which is one fixed value configured per product, not per
buyer:

```js
customFieldsObj:{}, billingFields:{name:"",phone:"",email:""}
// ...
if (t?.fieldType === "hidden") { a = {...a, [t.fieldName]: t.staticFieldValue ?? ""} }
```

There is no URL read anywhere in the custom-field path.

**Consequence:** `PORTABLE-ATTRIBUTION-SPEC.md` §4 (the chunked base62 token in
`ref_id`/`ref_id2`) cannot be ported as written. §8 fallback 2 ("short pointer +
a store") also fails, because the pointer has nowhere to live either. The two
`ref_id` fields should be **deleted from both checkouts** so buyers do not see
two permanently blank boxes labelled "Filled in automatically".

### 1.2 Billing fields DO prefill

`?name=X&email=Y&phone=Z` populates Name, Email and Phone. Verified on a cleared
browser.

**`city` does NOT prefill** — because City is a custom field, not a billing
field. So [lib/oto-config.ts](../lib/oto-config.ts) `prefill.keys.city` is dead
config and should be removed. City is a *required* custom field, so the buyer
types it and it arrives on the order anyway.

**Gotcha found while probing:** TagMango caches billing details in localStorage
under `billingFields_<mangoId>`. A second page load shows the previous buyer's
values even with no query params. Any manual retest must clear localStorage
first or it will report a false pass.

---

## 2. The carrier that does work

The checkout parses this exact param list off `window.location.search`:

```js
let {redirectUri, trackerId, hidePaymentButton, couponcode, preferredPaymentGateway,
     sessionToken, affiliate, slotId, eventId, allowedToBook, slotDate,
     rneId, fbr, phone, email, name, webinarReferral,
     utm_source, utm_medium, utm_campaign, utm_content, utm_term,
     fbclid, utm_id, laitrap} = qs.parse(window.location.search)
```

and merges several of them into the body it POSTs to its own create-order API:

```js
trackerId && (ed = {...ed, trackerId})
affiliate && (ed = {...ed, affiliate})
rneId     && (ed = {...ed, rneId})
fbr       && (ed = {...ed, fbr})
webinarReferral && (ed = {...ed, webinarReferral})
utm_source && {utm_source: String(...)}   // and the rest of the utm_* set
```

So TagMango natively carries **`utm_source`, `utm_medium`, `utm_campaign`,
`utm_content`, `utm_term`, `utm_id`, `fbclid`** onto the order, plus what looked
like five free-form slots.

### 2.1 Two of those five are NOT free-form (tested, T1 attempt 1)

The first live ₹50 probe carried all five. Two are validated server-side against
real database records and must never be used as carriers:

| Param | Result | Verdict |
|---|---|---|
| `rneId` | **Hard failure at payment.** `Cast to ObjectId failed for value "RNEID_MARKER_02" (type string) at path "user" for model "refernearnproduct"` | **Unusable.** Must be a 24-char Mongo ObjectId pointing at a real refer-and-earn record. Blocks the sale. |
| `affiliate` | Blocking browser dialog: *"The payment link contains invalid Affiliate ID, click on OK to continue with the payment."* Appeared twice. | **Unusable.** Even though it lets you through, no buyer may ever see that dialog. |
| `trackerId` | **Hard failure at payment** (attempt 2). `order validation failed: trackerId: Cast to ObjectId failed for value "0001ABCD..." (type string) at path "trackerId" because of "BSONError"` | **Unusable.** Also an ObjectId. |
| `fbr` | untested, **suspect** | same family, assume ObjectId until proven otherwise |
| `webinarReferral` | untested, **suspect** | same family, assume ObjectId |

The pattern is now unambiguous: **every param TagMango named after one of its own
entities is a Mongo ObjectId reference**, dereferenced at order-validation time,
and passing a string rejects the order outright. `rneId`, `affiliate` and
`trackerId` are all confirmed. `fbr` and `webinarReferral` should be treated as
the same and never probed, because each probe costs a failed order.

### 2.2 The `utm_*` family is the real carrier

The bundle settles it without another payment. The marketing params are
explicitly `String()` cast, with no lookup of any kind:

```js
ey.utm_source ? {
  utm_source:   String(ey.utm_source),
  utm_medium:   String(ey.utm_medium   ?? ""),
  utm_campaign: String(ey.utm_campaign ?? ""),
  utm_content:  String(ey.utm_content  ?? ""),
  utm_term:     String(ey.utm_term     ?? ""),
  fbclid:       String(ey.fbclid       ?? ""),
  gclid:        String(ey.gclid        ?? ""),
  utm_id:       String(ey.utm_id       ?? "")
} : void 0
```

That is **eight** free-text slots: the five `utm_*`, plus `utm_id`, `fbclid` and
`gclid` (the last is accepted in the payload even though it is absent from the
top-level destructure).

**⚠️ The whole block is gated on `ey.utm_source`.** If `utm_source` is absent or
empty, TagMango sends `undefined` and **every one of the eight is dropped,
including `fbclid`**. `/go` must therefore always set `utm_source`, falling back
to something like `direct` for organic traffic. This is the single easiest way to
silently lose all attribution and it would not error.

`redirectUri` is how we route ₹299 buyers to `/welcome-reset` and ₹498 buyers to
`/welcome-reset-plus`.

---

## 3. What must be tested, exactly

Everything above is settled. These five are not, and each needs one real ₹50
order through the live checkout with the Pabbly workflow watching.

### T1 · Which params reach the Pabbly "New Order" trigger, and under what keys

**The single most important test.** Being merged into TagMango's create-order
call is not the same as surfacing in Pabbly's trigger payload.

**Attempt 1 failed** on `rneId` before an order was created (see §2.1). Attempt 2
drops the two validated params and merges T1 and T2 into a single payment, by
making `trackerId` a 512-character self-describing ruler. One ₹50 order then
answers both "does it survive" and "where does it truncate".

The ruler is 64 blocks of `NNNNABCD`, so any block tells you its own offset:
block `0043ABCD` sits at character 43 × 8 = 344. Alphanumeric only, matching the
base62 alphabet the real token will use.

Ready-to-paste URL is in §3.1 below.

Pay ₹50, then open the Pabbly trigger's captured response with **Response Format
set to Raw**, not Simple — Simple flattens and may drop keys. Record:

- whether `trackerId` arrives, and its exact JSON path
- whether it arrives **whole** (ends `...0064ABCD`) or truncated (note the last
  intact block, multiply by 8 for the ceiling)
- the exact paths of all six `utm_*` and `fbclid`

Per the spec's hardest-won lesson, **prefill length and submit length are
different limits and Razorpay's disagreed by 233 characters, with the shorter one
failing live payments.** There is no rendered field here, so only the submit
limit exists and only a completed payment reveals it. The design needs ~350 to
400 characters, so a clean 512 means we are done and `fbr` / `webinarReferral`
never have to be risked.

If `trackerId` truncates below ~400, probe `fbr` next **on its own** (never
alongside `webinarReferral`, which may be another ObjectId reference and would
fail the order the way `rneId` did).

### T1/T2 · The URL to pay through (attempt 3)

Attempts 1 and 2 both died on ObjectId validation (`rneId`, then `trackerId`).
Attempt 3 drops every entity-named param and uses only the `String()`-cast
marketing slots. `utm_content` carries a 128-character ruler, which is far more
than the final design needs (see §4, the pointer is 22 characters) but proves the
headroom in one payment.

```
https://coaching.sonalibadani.com/web/checkout/6a1ff0c64efcc9d88dec2633?name=Probe%20Three&email=probe3@example.com&phone=9000000003&utm_source=UTMSOURCE_06&utm_medium=UTMMEDIUM_07&utm_campaign=UTMCAMPAIGN_08&utm_content=0001ABCD0002ABCD0003ABCD0004ABCD0005ABCD0006ABCD0007ABCD0008ABCD0009ABCD0010ABCD0011ABCD0012ABCD0013ABCD0014ABCD0015ABCD0016ABCD&utm_term=UTMTERM_10&utm_id=UTMID_11&gclid=GCLID_MARKER_13&fbclid=FBCLID_MARKER_12
```

This one should complete. If it still fails validation, the `utm_*` route is out
too and the design falls back to §4.2 (join on email).

### Superseded · attempt 2 (trackerId ruler, failed)

```
https://coaching.sonalibadani.com/web/checkout/6a1ff0c64efcc9d88dec2633?name=Probe%20Two&email=probe2@example.com&phone=9000000002&trackerId=0001ABCD0002ABCD0003ABCD0004ABCD0005ABCD0006ABCD0007ABCD0008ABCD0009ABCD0010ABCD0011ABCD0012ABCD0013ABCD0014ABCD0015ABCD0016ABCD0017ABCD0018ABCD0019ABCD0020ABCD0021ABCD0022ABCD0023ABCD0024ABCD0025ABCD0026ABCD0027ABCD0028ABCD0029ABCD0030ABCD0031ABCD0032ABCD0033ABCD0034ABCD0035ABCD0036ABCD0037ABCD0038ABCD0039ABCD0040ABCD0041ABCD0042ABCD0043ABCD0044ABCD0045ABCD0046ABCD0047ABCD0048ABCD0049ABCD0050ABCD0051ABCD0052ABCD0053ABCD0054ABCD0055ABCD0056ABCD0057ABCD0058ABCD0059ABCD0060ABCD0061ABCD0062ABCD0063ABCD0064ABCD&utm_source=UTMSOURCE_06&utm_medium=UTMMEDIUM_07&utm_campaign=UTMCAMPAIGN_08&utm_content=UTMCONTENT_09&utm_term=UTMTERM_10&utm_id=UTMID_11&fbclid=FBCLID_MARKER_12
```

No `rneId`, no `affiliate`, no `fbr`, no `webinarReferral`. There should be no
dialog before the checkout loads this time; if one appears, stop and report it.

### T3 · Transaction id, amount and status field names

From the same T1 capture, record the exact keys for:

- the **transaction / order id** → becomes `purchase_event_id`, the Meta dedup key
- the **amount paid** → becomes `value` on Purchase and sales
- the **status** → the trigger is already filtered to `Completed`, but confirm
- **name, email, phone, City, State** → the buyer fields for the CRM row

### T4 · `redirectUri`

Confirm `&redirectUri=https://www.sonalibadani.com/welcome-reset` actually lands
the buyer there after payment, and that the ₹498 product can be pointed at
`/welcome-reset-plus`. If `redirectUri` is ignored, set the post-payment redirect
per-product in the TagMango dashboard instead.

### T5 · Both products

Repeat T1 against the ₹498 checkout
(`6a310c71a33ece80e6a62572`) and confirm its Pabbly workflow captures the same
shape. The two workflows are separate, so a field that maps in one is not
automatically mapped in the other.

---

## 4. The architecture these tests unlock

```
P1 /masterclass
  registration modal submits
    -> POST /api/register  (Vercel)
         mirrors lead to a COOKIE, not just localStorage   <- required change
         fires CAPI CompleteRegistration + Lead
         forwards to PABBLY_REGISTRATION_WEBHOOK_URL
    -> router.push('/masterclass/upgrade')

P2 /masterclass/upgrade
  add-on toggled on   -> CAPI oto_reset_plus_add   + GA4
  decline             -> CAPI oto_decline          + GA4 -> /welcome
  YES  -> window.location = /go?p=reset | reset-plus

/go   (Vercel route, force-dynamic, 302)          <- the whole design turns on this
  reads _fbp / _fbc / attribution from the COOKIE header
  reads the REAL client IP + user agent off THIS request   <- last moment they exist
  rebuilds fbc as cookie ?? `fb.1.<ts>.<fbclid>`
  mints ONE uuid = event_id = lead_id = purchase_event_id
  AWAITS CAPI oto_reset_cta | oto_reset_plus_cta            + GA4 fired on P2
  packs {uuid, _fbp, _fbc, ip, ua} into a base62 token
  302 -> TagMango checkout with:
           trackerId=<token>   (+ rneId/fbr/webinarReferral if T2 forces a split)
           utm_* and fbclid passed natively
           name / email / phone prefilled from the cookie
           redirectUri -> /welcome-reset or /welcome-reset-plus

payment succeeds
  -> Pabbly "TagMango · New Order · Completed" (already scoped per-mango)
  -> step 2: "API by Pabbly Connect" POST -> https://sonalibadani.com/api/tagmango/order
       body: the whole trigger payload + a shared secret
  -> Vercel verifies the secret, decodes the token, and:
       fires CAPI Purchase + sales   (value from the order, event_id = the uuid)
       RESPONDS with a FLAT, EXPLODED object, one key per CRM column
  -> step 3: Google Sheets "Add Row", mapped from the API response

/welcome, /welcome-reset, /welcome-reset-plus
  fire NOTHING. Pure display.
```

Why the response-mapping trick in the last step: Pabbly cannot base62-decode or
brotli-decompress, and it must not be asked to. Our route returns the finished
flat row and Pabbly's field picker maps it one-to-one into the sheet. One round
trip, no second webhook.

**This is what makes `NEXT_PUBLIC_PABBLY_WEBHOOK_URL` and all page-load firing on
the welcome pages redundant, and it is what stops the team's own visits from ever
producing a Purchase.** Nothing fires unless money actually moved.

### 4.1 A pointer, not a token

The spec's chunked base62 blob is now the **wrong** design here, and the ObjectId
failures are what make that clear. With only free-text `utm_*` slots available
and a user agent that alone runs 120 to 160 characters, we would be squeezing a
~350-character compressed blob into marketing fields we also want to use for real
ad data.

Take §8 option 2 instead — **short pointer plus a store**:

```
/go   mints a 22-char base62 id
      writes {uuid, _fbp, _fbc, client_ip, user_agent, utm_*, referrer, landing_url}
        to Upstash Redis under that id, 30-day TTL
      302 -> checkout with utm_id=<the 22-char id>
              utm_source/medium/campaign/term  = the REAL ad values, untouched
              fbclid = the real fbclid, natively
              gclid  = the real gclid,  natively

/api/tagmango/order   reads utm_id off the order, fetches the blob back,
                      fires CAPI with full fidelity
```

Why this is better than the token here:

- **No length ceiling to design around.** 22 characters always fits. The whole
  T2 class of risk, the one that failed live Razorpay payments, disappears.
- **Full fidelity.** User agent and IP survive intact rather than being
  compressed and chunked.
- **The real UTMs stay readable.** `utm_source`, `utm_medium`, `utm_campaign` and
  `utm_term` reach the CRM as themselves, so the sheet is legible without
  decoding anything. Only `utm_id` is spent on the pointer.
- **No codec.** No brotli, no base62 big-integer maths, no chunk/join, none of
  the leading-zero sentinel subtlety. Materially less that can silently break.

Cost is one Upstash Redis dependency and roughly one write plus one read per
sale. Note the spec's own warning: Vercel KV was sunset in Dec 2024 and is now
Upstash; **Vercel Blob is the wrong tool** (file storage, no TTL).

PII stays out of the store's critical path regardless — TagMango collects name,
email, phone and City itself and they come back on the order.

### 4.2 Fallback if the store is unwanted

Join on email (spec §8 option 3). The order payload carries the buyer's email and
the registration row already has her `_fbp`/`_fbc`/IP/UA. Weakest option: a buyer
who registers with one email and pays with another breaks the join, and there is
no way to detect it. Only reach for this if Upstash is genuinely off the table.

### Required code changes before any of this works

1. **Mirror the lead to a cookie** in [lib/registration.ts](../lib/registration.ts).
   A server route cannot read localStorage, and today the funnel is localStorage
   only. Without this, `/go` has nothing to read and the design is impossible.
2. **Move every Meta event to CAPI.** [lib/events.ts](../lib/events.ts) currently
   fires `fbq('track', ...)` for all of them; the pixel keeps `PageView` only.
   GA4 stays exactly where it is, browser-side, minus Purchase and sales.
3. **Delete the dead Razorpay path** in
   [components/welcome/FunnelWebhook.tsx](../components/welcome/FunnelWebhook.tsx),
   which reads `razorpay_payment_id` off the URL and can never fire correctly.
4. **Remove `prefill.keys.city`** from [lib/oto-config.ts](../lib/oto-config.ts).
5. **Delete `ref_id1` / `ref_id2`** from both TagMango checkouts.

### Ownership gate

Spec §7 warned that an account-level webhook receives every product's sales. That
risk does not apply here: the Pabbly trigger has "Select Mango" set to the
specific product, and there is one workflow per product. Keep it that way. Add
the amount canary anyway — warn, do not reject, when a payment arrives at an
unexpected amount, so a price change is caught before a whole cohort is charged
wrongly.

---

## 5. What is needed from outside the codebase

- **`META_CAPI_ACCESS_TOKEN`** in Vercel, **without** the `NEXT_PUBLIC_` prefix
  so it never reaches the browser.
- **A shared secret** for `/api/tagmango/order`, set in both Vercel and the
  Pabbly HTTP step.
- **`META_TEST_EVENT_CODE`** in Vercel while testing, cleared before launch.
- The **T1 raw capture** from Pabbly. Nothing downstream can be written until
  the field names are known.

---

## 6. What actually shipped

Because the Pabbly TagMango trigger is paywalled, there is no server-to-server
signal that a payment succeeded. The post-checkout page is the only moment we
hear about a sale, so that is where it fires.

```
P1 /masterclass
  CTA tapped        -> CAPI AddToCart              + GA4
  3s dwell          -> CAPI ViewContent            + GA4
  form submitted    -> registration webhook (all 22 fields, raw + sha256)
                    -> CAPI CompleteRegistration   + GA4
                    -> CAPI Lead                   + GA4
                    -> /masterclass/upgrade

P2 /masterclass/upgrade
  add-on ON         -> CAPI oto_reset_plus_add     + GA4
  yes at base price -> CAPI oto_reset_cta          + GA4
  yes with add-on   -> CAPI oto_reset_plus_cta     + GA4
  decline           -> CAPI oto_decline            + GA4  -> /welcome
  (the purchase_event_id is minted HERE, before the checkout hop)

P3 /welcome-reset  |  /welcome-reset-plus
  -> CAPI Purchase + sales, value 299 or 498, Meta ONLY, never GA4
  -> purchase webhook, all 23 fields, raw + sha256
```

Transport: **every Meta event except `PageView` goes through `/api/capi`**, which
is the only place the access token exists. The browser pixel sets `_fbp` / `_fbc`
and fires `PageView`, nothing more.

### 6.1 Why EMQ is still high

Nothing is lost by firing from the browser here, because the buyer is back on our
own domain when it happens:

| Signal | Source |
|---|---|
| `em`, `ph`, `fn`, `ln`, `ct`, `country`, `external_id` | the registration cache, hashed **server-side only**, in `lib/meta-capi-server.ts` |
| `fbp`, `fbc` | read live from the first-party cookies on every call, never trusted from the cache |
| `client_ip_address` | read off the real request inside `/api/capi`, never from the request body |
| `client_user_agent` | the real `User-Agent` header on that same request |

Eleven signals on a complete call. `event_source_url` is always sent without its
query string, so Meta is never handed the UTMs and `fbclid` on every event.

### 6.2 The three defences against a false Purchase

This is the honest cost of losing the server-to-server path: **the page cannot
verify that money moved.** A reload, a shared link or a team member opening the
URL is indistinguishable from a buyer. Three layers reduce that to something
small. Only a real webhook removes it.

1. **Registration gate.** Nothing fires unless a cached lead with an email
   exists. Someone who never went through the funnel has no cache, so the team
   opening either page fires nothing at all. This is also the honest gate:
   without an email there is no `external_id` and no match key, so both the CRM
   row and the Meta event would be worthless anyway.
2. **Local dedupe.** The purchase id is claimed in `localStorage` synchronously,
   before any `await`, so a reload, a back button, a second tab and React Strict
   Mode's double mount all find the claim and stop.
3. **Meta dedupe.** `event_id` is deterministic, minted on P2 before the checkout
   hop, so it survives the TagMango round trip. Even fired twice from two
   devices, Meta collapses matching `event_name` + `event_id` for 48 hours.

A failed webhook **releases** the claim, so the next load of that page retries
rather than losing the sale silently.

Keep the Pabbly duplicate filter on email regardless. These are layers, not
alternatives.

### 6.3 Verified

Executed against the real modules, not asserted:

- 10/10 hashing and normalisation checks (email lowercased and trimmed, phone as
  country code + national digits, city whitespace stripped, `fbc`/`fbp` never
  hashed, empty fields omitted rather than sent as the hash of an empty string)
- direct visit with no registration: zero network calls, nothing fired
- registered buyer: exactly 2 Meta events, exactly 1 webhook, all 23 CRM fields
  present and populated, correct value on both `/welcome-reset` (299) and
  `/welcome-reset-plus` (498)
- reload, third visit, and the other purchase page: all silent
- webhook failure: reported, and the claim released for retry
- registration: all 22 fields, marriage duration carried, `external_id` correct
- all four `oto_*` events plus `CompleteRegistration` and `Lead` reach both
  Meta and GA4; `Purchase` and `sales` reach **neither** GA4 path
- the access token appears in **no** client bundle
- in a real browser, the landing CTA opens the modal and fires `AddToCart`

### 6.4 If the plan is ever upgraded

Delete `PurchaseDispatcher` from both welcome pages and build §4. Everything
needed is already audited: the carriers in §2.2, the `utm_source` gate that
silently drops all eight fields, and the pointer design in §4.1.
