/**
 * Stop Surviving. Start Designing. — all funnel copy (P1, P2, P3A, P3B).
 *
 * Copy is verbatim from the approved TGO build spec v1.0. House rule, locked:
 * NO em dashes and NO en dashes anywhere in visible copy. Use periods, commas,
 * or the word "to" for ranges. The middot "·" is a separator, not a dash, and
 * is allowed.
 *
 * Dates, times and seat counts interpolate from lib/webinar-config.ts and
 * prices from lib/pricing.ts, both env-driven, so nothing here goes stale when
 * the event moves or a price changes.
 */
import {
  COURSE_PRICE_LABEL,
  VISUALIZATION_PRICE_LABEL,
  ANCHOR_PRICE_LABEL,
} from './pricing';
import {
  WEBINAR,
  TIME_IST,
  DAY_TIME_IST,
  DATE_TIME_IST,
  MASTERCLASS_NAME,
  MASTERCLASS_NAME_PARTS,
  MASTERCLASS_PROSE_CAP,
} from './webinar-config';

/* ────────────────────────────────────────────────────────────────────────────
 * P1 · REGISTRATION LANDING PAGE  ·  /masterclass
 * ────────────────────────────────────────────────────────────────────────── */

export const ANNOUNCEMENT = ['Live on Zoom', 'Seats are limited', 'Free to attend'];

export const HERO = {
  eyebrow: 'For married women who have tried everything and nothing has changed',
  /**
   * The brand promise. "Stop surviving" rather than "save your marriage":
   * the page is honest that nothing changes overnight and that she cannot fix
   * him, so the headline must promise the thing she can actually have.
   */
  headline: {
    before: "You don't need ",
    highlight: 'his permission',
    after: ' to stop surviving your marriage',
  },
  deck: 'In 90 minutes, discover the hidden pattern keeping your marriage stuck, and the first shift you can make without waiting for him to change.',
  credential: [
    'Hosted by Sonali Badani, Marriage Architect and founder of The Soul Space.',
  ],
  countdownLabel: 'The room opens in',
  countdownClosed: 'Registration closes today',
  lockup: {
    chip: 'Free live masterclass',
    title: MASTERCLASS_NAME,
  },
  tiles: [
    { label: 'Date', value: WEBINAR.date },
    { label: 'Time', value: `${TIME_IST} · ${WEBINAR.duration}` },
    { label: 'Where', value: 'Live on Zoom, from anywhere' },
    { label: "Who it's for", value: 'Married women, 25 to 65' },
  ],
  /**
   * No struck-through anchor price. Nobody has ever been charged for this
   * masterclass, so showing "₹999" crossed out would imply a former price that
   * never existed. "Free live masterclass" is the honest version of the same
   * message and reads more confidently.
   */
  price: { pill: 'Free live masterclass' },
  cta: 'Save my seat',
  scarcity: `Only ${WEBINAR.seats} seats in the live room. Registration closes when it fills.`,
};

/**
 * The brand narrative, given its own anchor immediately under the hero.
 *
 * "Stop surviving, start designing" is the thread the whole site hangs on, so
 * it gets stated once, at scale, before anything else competes for attention.
 * The three step strip underneath names the mechanism in one line each; the
 * full explanation lives in the Method section further down and is not repeated
 * here.
 */
export const SURVIVING_TO_DESIGNING = {
  eyebrow: 'The shift',
  /** Both halves of the tagline, set on two lines. */
  from: MASTERCLASS_NAME_PARTS[0],
  to: MASTERCLASS_NAME_PARTS[1],
  body: [
    'You do not need to wait for him to change.',
    'You need to understand the pattern, rewire your response, and start creating your relationship by choice.',
  ],
  stripLabel: 'How that happens',
  steps: [
    { n: '01', title: 'Reset', body: 'See the pattern you have been living inside.' },
    { n: '02', title: 'Rewire', body: 'Change the reaction that keeps repeating.' },
    {
      n: '03',
      title: 'Redesign',
      body: 'Start creating your marriage consciously instead of by default.',
    },
  ],
};

/**
 * Copy shared by every call to action.
 *
 * `labels` vary the microcopy by placement so six buttons never read as the
 * same button six times, while all of them open the same registration modal.
 * `reassurance` sits under each one and answers the objections this audience
 * actually has: being exposed, and needing him to agree.
 *
 * "Camera on" is stated here, at the CTA, on purpose. Sonali wants a room she
 * can speak to face to face rather than a wall of black squares, and a woman
 * who only discovers that after she has registered feels ambushed. Said up
 * front it is an invitation; said late it is a bait and switch.
 */
export const CTA = {
  primary: 'Yes, I want to stop surviving my marriage',
  /** Shorter forms, so the promise still fits on a narrow phone. */
  primaryShort: 'Yes, I want to stop surviving',
  primaryTiny: 'Stop surviving. Start designing.',
  labels: {
    hero: 'Yes, I want to stop surviving my marriage',
    afterPain: 'Yes, show me the pattern',
    afterMethod: 'Yes, show me how to redesign my marriage',
    afterOutcome: 'Save my seat for the masterclass',
    afterProof: 'Yes, I want this for my marriage',
    final: 'Yes, I want to stop surviving my marriage',
  },
  details: ['Free', 'Live on Zoom', WEBINAR.duration, 'Camera on'],
  /**
   * Deliberately does NOT repeat "Camera on" from the details row directly
   * above it. It sits there once, and this row answers what follows from it.
   *
   * Not "a private room": with her camera on, in a room of other women, that
   * is simply not true, and a promise she can see through at the door costs
   * more than it buys. The honest reassurance is that everyone in there is in
   * the same position she is, and that nobody will make her speak.
   */
  reassurance: [
    'A room of women like you',
    'Nobody is put on the spot',
    "Husband doesn't need to attend",
  ],
};

/**
 * Credibility, surfaced early rather than left to the Meet Sonali section two
 * thirds down the page. A cold visitor decides whether to trust the promise
 * long before she reaches a founder story.
 */
export const CREDIBILITY = {
  stats: [
    { value: '2,000+', label: 'Private sessions with married women' },
    { value: 'Since 2023', label: 'Doing only this work' },
    { value: 'Not one', label: 'Of them started with the husband in the room' },
  ],
};

export const WHO_FOR = {
  eyebrow: 'Who this is for',
  heading: "You're doing everything right. So why does your marriage still feel wrong?",
  /**
   * The recognition lines used to sit in their own section under the hero and
   * again, in different words, in the hero itself. Said once, here, at the top
   * of the pain section, they land harder and the page is shorter for it.
   */
  recognition: {
    lines: ["You don't hate him.", "You don't necessarily want to leave."],
    emphasis: "You just don't know how to keep living like this.",
  },
  sub: 'Four different houses. The same silence. Read the one that sounds like yours.',
  cards: [
    {
      title: "You're doing everything right",
      points: [
        'You run the house, the children, the calendar, the in laws, and most of the emotional weight',
        'You have read the books, watched the videos, tried the date nights',
        'You have explained the same thing so many times you have stopped hearing yourself say it',
      ],
      pull: 'You do not need to try harder. You need to try somewhere else.',
    },
    {
      title: "You've stopped bringing it up",
      points: [
        'The fights stopped, and somehow that felt worse',
        'You share a house, a bed, a bank account, and almost nothing else',
        'You edit yourself before you speak, just to keep the evening calm',
      ],
      pull: 'Walking on eggshells is not peace. It is a pattern.',
    },
    {
      title: "You're not sure if you want to leave",
      points: [
        'Some nights you plan the whole thing out in your head',
        'The next morning you make his tea anyway',
        'You have 99 reasons to leave. You are still looking for the 1 reason to stay',
      ],
      pull: 'You deserve to make that decision from clarity, not exhaustion.',
    },
    {
      // Softened from guilt to responsibility. The old version leaned on what
      // her children have already absorbed, which lands as "you have failed
      // them". This version keeps the same urgency but points it forward, at
      // what she still gets to change. That is the brand's posture: she is the
      // architect, not the culprit.
      title: 'Your children are learning from this',
      points: [
        'They read the room before they walk into it',
        'They are quietly learning what love is supposed to feel like',
        'They will carry your rhythm into their own homes one day',
      ],
      pull: 'Your children are learning what love feels like by watching you. And you have the power to change what they learn.',
    },
  ],
  transition: 'But if some part of you still believes there is something here worth rebuilding...',
  // Rendered uppercase by the component, so they are written in sentence case here.
  identities: [
    'The architect of her own life',
    'The designer of her own destiny',
    'The woman who chose her own life',
    'The author of her own story',
    'The one who designed her own future',
    'The woman who lived by choice',
  ],
};

/**
 * The signature metaphor. Given full display weight because it is the single
 * idea that separates this session from every "communicate better" class: the
 * fights are not the problem, they are what the problem looks like from the
 * outside.
 */
export const REAL_PROBLEM = {
  eyebrow: 'The honest starting point',
  heading: {
    line1: "The problem isn't the latest fight.",
    line2: 'The crack is in the foundation.',
  },
  intro: [
    'Imagine you notice a crack in your wall. You paint over it. For a few weeks it looks beautiful. Then the crack comes back. So you paint again. It comes back. Eventually you tell people the house is broken.',
    'The house is not broken. The foundation is.',
  ],
  /** The symptoms, set as a list so each one lands separately. */
  symptoms: [
    'Arguments.',
    'Silence.',
    'Distance.',
    'Criticism.',
    'Walking on eggshells.',
    'Feeling alone beside someone you love.',
  ],
  symptomsVerdict: "Those aren't the foundation. They're the symptoms.",
  body: [
    'Every piece of advice you have been given so far was a fresh coat of paint. Communicate better. Give him space. Be patient. Plan a holiday. Every one of those hands the thing you want most to the one person you cannot control.',
    'That is why nothing changed. Not because you did not try hard enough.',
  ],
  compare: {
    other: {
      label: 'Every other relationship class',
      body: 'Tips for talking to him. Advice that only works if he cooperates. A promise that things improve once he finally understands.',
    },
    ours: {
      label: MASTERCLASS_NAME,
      body: 'The pattern underneath the fights, named out loud, and the first move you can make tonight without telling him you are making it.',
    },
  },
};

/**
 * The named framework.
 *
 * Reset, Rewire, Redesign was already the spine of the session. Naming it turns
 * it from three good words into something she can recognise, remember and ask
 * for by name, which is the difference between another coach with advice and
 * someone with a method.
 */
export const METHOD = {
  eyebrow: 'The framework',
  name: 'The Rewired Love Method',
  /** Rendered as a superscript beside the name. */
  mark: '™',
  promise:
    'Three moves, in the order they actually work. You will be walked through all three in the room, on your own marriage, in real time.',
  steps: [
    {
      n: '01',
      title: 'Reset',
      body: 'See the pattern you have been living inside. You cannot change a rhythm you cannot name.',
    },
    {
      n: '02',
      title: 'Rewire',
      body: 'Change the reaction you keep having. This is the part that needs nobody else to agree to it.',
    },
    {
      n: '03',
      title: 'Redesign',
      body: 'Build the marriage on purpose instead of by accident, one deliberate move at a time.',
    },
  ],
};

export const WHAT_WE_COVER = {
  eyebrow: 'What we cover',
  heading: `${MASTERCLASS_PROSE_CAP}, live in ${WEBINAR.duration}`,
  sub: 'Every part is something you can use the same night. You leave with a plan, not notes.',
  steps: [
    {
      title: "Why everything you've tried keeps failing",
      body: 'An honest look at the last few years. The talking. The space. The patience. The silence. We name exactly why each one failed, and it has nothing to do with how much you love him.',
    },
    {
      title: 'The invisible pattern running your house',
      body: 'Every marriage runs on an operating system nobody can see. Yours was written long before you met him. You will watch me trace where it came from, and you will recognise yours in real time.',
    },
    {
      title: "The one shift that doesn't require his participation",
      body: 'The part most women do not believe until they see it. Why a marriage is one system and not two separate people, and how one person changing her rhythm changes the whole dance. This is the shift that does not need his permission.',
    },
    {
      title: `Reset. Rewire. Redesign. Inside ${METHOD.name}`,
      body: 'The three moves, in the order they actually work. Reset what you can finally see. Rewire the reaction you keep having. Redesign the marriage on purpose instead of by accident.',
    },
    {
      title: 'Your first 30 days',
      body: 'You leave with one pattern named, one move to make this week, and a simple map for the next thirty days. Written down, not remembered.',
    },
  ],
  /**
   * The outcome, folded into this section rather than repeated in one of its
   * own. It used to be said three times on the page: a takeaway strip here, a
   * Clarity / Control / Plan section below, and again in the final close.
   * Once, here, immediately after the five teaching points.
   */
  outcome: {
    eyebrow: 'The outcome',
    heading: 'In 90 minutes, you will leave with',
    items: [
      {
        n: '01',
        title: 'Clarity',
        body: 'The pattern underneath your recurring conflict, named out loud for the first time.',
      },
      {
        n: '02',
        title: 'A shift',
        body: 'One change you can make without waiting for him, and without a conversation about it.',
      },
      {
        n: '03',
        title: 'A 30 day map',
        body: 'A simple first plan to start changing the dynamic, written down rather than remembered.',
      },
    ],
  },
  qa: {
    title: 'Bring your hardest moment',
    body: 'In the last part of the session, bring the situation you keep replaying. The one you have never said out loud. Type it in the chat and we work through it live, with the room. No names shown. No judgement.',
  },
};

/**
 * The expectation-setter, made visual.
 *
 * The spec's disqualifier said the same thing in a paragraph. Two columns of
 * crosses and ticks does the job in about two seconds, and for a woman whose
 * fear is being sold a manipulation script, seeing "not a script to make him
 * change" listed under NOT is the thing that lets her register.
 */
export const NOT_THIS = {
  eyebrow: 'Before you register',
  heading: 'Let me be very clear about what this is',
  not: {
    label: 'This is not',
    items: [
      'A class on how to manipulate your husband',
      'A script to make him change',
      'Couples therapy',
      'More "just communicate better" advice',
      'A promise that your marriage changes overnight',
    ],
  },
  is: {
    label: 'This is',
    items: [
      'Understanding your relationship pattern',
      'Rewiring your own responses',
      'Learning what you can actually influence',
      'Creating a different emotional dynamic',
      'Getting clarity about your next step',
    ],
  },
};

/**
 * Shortened from seven paragraphs to four.
 *
 * This section is not a biography. It answers two questions: why Sonali cares
 * about this, and why she can be trusted with a marriage. The grandparents,
 * the loss, the question it raised and the mission that followed are the whole
 * emotional core, so everything around them has been cut.
 */
export const MEET_SONALI = {
  eyebrow: 'Meet your host',
  heading: 'The woman behind the Love Legacy',
  body: [
    'I learned what love looked like by watching my grandparents. A love marriage in a generation where that was rare. What made them extraordinary was not that they fell in love. It was that they kept choosing each other, every single day.',
    'During Covid they both fell ill. I never got to say goodbye. They passed away two days apart, because after a lifetime together they could not bear to stay apart for long.',
    'Standing in that grief I asked one question. If that kind of love exists, why are so many marriages quietly falling apart?',
    'I have spent the years since answering it, in private sessions with married women. Not one of them started with the husband in the room. And the women whose marriages changed all stopped asking when will he change, and started asking who do I need to become.',
  ],
  /** Kept deliberately short. Unrelated credentials dilute the ones that matter. */
  credential: {
    name: 'Sonali Badani',
    lines: [
      ['Marriage Architect', 'Founder, The Soul Space'],
      ['Certified NLP Practitioner', '2,000+ private sessions'],
    ],
  },
};

/**
 * Proof slots stay as specced placeholders. Per the build spec, real client
 * quotes are supplied and approved by Sonali. Do not invent testimonial copy.
 * Replace `quote` and `attribution` here when the approved text arrives, and
 * set `approved: true` so the slot renders as a real testimonial.
 */
/**
 * Real client messages, as the screenshots they arrived in.
 *
 * Nothing here is retyped or paraphrased. Per the spec's rule that testimonials
 * are never invented, these are the unedited WhatsApp messages from Sonali's
 * private coaching clients, shown as images so a reader can see they are real.
 * Attribution is by descriptor only, never a name, which is the same privacy
 * standard the note at the bottom of the section promises.
 *
 * `summary` is not displayed. It is the alt text, so the section still means
 * something to a screen reader and to anyone whose images fail to load.
 */
export const PROOF = {
  eyebrow: 'Proof',
  heading: 'Women who stopped waiting',
  sub: 'Real messages from women who did this work. Shared with permission, names held back.',
  items: [
    {
      src: '/testimonials/testimonial-1.webp',
      blurDataURL:
        'data:image/webp;base64,UklGRmAAAABXRUJQVlA4IFQAAADwAwCdASoMABYAPu1oqk6ppiQiMAgBMB2JaQAAXK+HmXUFCwC/J08AAP7Q2beUChDJPjtokoBGmW0hnPXBQRDu2AZ9NFa4+efILtvI3m86X9xoQAA=',
      width: 559,
      height: 1000,
      attribution: 'Private coaching client · after twelve sessions',
      before: 'Negative mindset, stuck in the same patterns',
      after: 'Marriage stronger than ever',
      pull: 'Today, my marriage is stronger than ever.',
      summary:
        'Her twelve coaching sessions completely transformed her life. She learned to understand herself better, manage her emotions, and approach her relationship with a new perspective. Today her marriage is stronger than ever, and she has rediscovered love and appreciation for both her husband and her life. The negative mindset that once controlled her has been replaced with hope, gratitude and positivity.',
    },
    {
      src: '/testimonials/testimonial-2.webp',
      blurDataURL:
        'data:image/webp;base64,UklGRjwAAABXRUJQVlA4IDAAAADQAQCdASoMAA0AA4BaJaQAAudMuqGTAAD+5m4iHaC2bK/WVnlRuzh+EEgD6E7gAAA=',
      width: 950,
      height: 1000,
      attribution: 'Private coaching client · marriage was close to ending',
      before: 'Marriage close to breaking down, thinking about divorce',
      after: 'Came through the hardest phase',
      pull: 'My marriage was on the verge of breaking down.',
      summary:
        'She is deeply grateful to Sonali Badani for helping her through one of the most challenging phases of her life. When she started, she was struggling in her relationship, her marriage was on the verge of breaking down, and she was overwhelmed with negativity and constantly thinking about divorce.',
    },
    {
      src: '/testimonials/testimonial-3.webp',
      blurDataURL:
        'data:image/webp;base64,UklGRkAAAABXRUJQVlA4IDQAAADQAQCdASoMAAwAA4BaJaQAAudMub3oAAD+6jGqdgg3AY6UxQiUVSA2udC+bJEcx3wQAAAA',
      width: 951,
      height: 981,
      attribution: 'Private coaching client · on rebuilding the relationship',
      before: 'Confidence gone, relationship coming apart',
      after: 'Rebuilt connection, confidence back',
      pull: 'The transformation I experienced has been life changing.',
      summary:
        'The transformation she experienced has been life changing. She cannot thank Sonali enough for helping her rebuild her relationship, regain her confidence, and create a happier, healthier life, and she wholeheartedly recommends her to anyone seeking positive change and personal growth.',
    },
    {
      src: '/testimonials/testimonial-4.webp',
      blurDataURL:
        'data:image/webp;base64,UklGRkAAAABXRUJQVlA4IDQAAADQAQCdASoMAA0AA4BaJaQAAu18ehvAAAD+3e+AdfZ9kvDXcmGaR/Zx3vaJMIBsfODzmwAA',
      width: 894,
      height: 1000,
      attribution: 'Private coaching client · after one session',
      before: 'Struggling to connect for a long time',
      after: 'A shift in behaviour and energy',
      pull: 'I could see a shift after just one session.',
      summary:
        'She thanks Sonali for the cord connect process, which worked wonders in helping her connect with her partner after struggling for a long time. She could see a shift in behaviour and energy after just one session, and it made her believe in the power of these processes.',
    },
  ],
  privacy:
    'The women I work with care deeply about protecting the privacy of their marriages and their families. Some names and details here have been changed or held back. Every story is shared with permission, and the privacy around it stays protected. Because saving a marriage should never mean putting it on display.',
};

export const FAQ = {
  eyebrow: 'Questions',
  items: [
    {
      q: 'Is this really free?',
      a: 'Yes. There is nothing to pay to attend. At the end I will tell you about the programme I run, and you are completely free to ignore it and take the session for what it is.',
    },
    {
      q: 'Do I need my husband to join?',
      a: 'No. This session is built for you alone. That is the entire point of it. He does not need to know you attended.',
    },
    {
      q: 'Will anyone see me or hear me?',
      a: 'Sonali asks you to keep your camera on, so she is speaking to you face to face rather than to a screen of black squares. Everyone in that room is a married woman in the same place you are, and you will never be put on the spot or asked to say anything you do not want to say. You can listen the whole way through if that is what you need.',
    },
    {
      q: 'Is this therapy or counselling?',
      a: 'No. This is coaching. If you are in a situation that is physically unsafe, please reach out to a qualified professional. This work is for a marriage that has gone quiet, not one that has become dangerous.',
    },
    {
      q: 'What if I cannot attend live?',
      a: 'Register anyway. If you cannot make it, we will send a replay for a limited window. But the live room is where the Q&A happens, and that is usually the part women remember.',
    },
    {
      q: 'How long is it?',
      a: 'Ninety minutes, plus live questions at the end.',
    },
  ],
};

export const FINAL_CLOSE = {
  /** The brand line, closing the page on the same words it opened with. */
  heading: {
    line1: MASTERCLASS_NAME_PARTS[0],
    line2: MASTERCLASS_NAME_PARTS[1],
  },
  quote:
    "The relationship didn't break overnight. And it won't change overnight. But it can start changing from your side first.",
  signature: 'Sonali Badani',
  fine: `${DATE_TIME_IST} · Live on Zoom · Free`,
};

export const STICKY = {
  title: 'Free live masterclass',
  sub: DAY_TIME_IST,
  cta: 'Save my seat',
};

/* ────────────────────────────────────────────────────────────────────────────
 * REGISTRATION FORM (stepwise modal, opened by every CTA on P1)
 * ────────────────────────────────────────────────────────────────────────── */

export const FORM = {
  heading: 'Save your seat',
  /**
   * This line used to promise "The Zoom link comes to your WhatsApp straight
   * away", which is why only two registrants in ten were joining the group:
   * she believed the link was coming to her privately, so the group looked
   * optional. It is not. The link is posted in the group and nowhere else, and
   * the form now says so from the first screen.
   */
  sub: `${DAY_TIME_IST}. The Zoom link is posted in the WhatsApp group, so joining it is how you get in.`,
  steps: [
    { key: 'name', label: 'Your name', hint: 'So Sonali knows who is in the room.' },
    {
      key: 'contact',
      label: 'Where to send it',
      hint: 'For your reminders. The Zoom link itself comes in the WhatsApp group.',
    },
    { key: 'city', label: 'Where you are', hint: 'It helps us plan the timing of the room.' },
    {
      key: 'duration',
      label: 'One last thing',
      hint: 'So Sonali knows what the room is walking in with.',
    },
  ],
  fields: {
    firstName: { label: 'First name', placeholder: 'Your first name' },
    lastName: { label: 'Last name', placeholder: 'Your last name' },
    email: { label: 'Email address', placeholder: 'you@example.com' },
    phone: { label: 'WhatsApp number', placeholder: '98765 43210' },
    city: { label: 'City', placeholder: 'Where you live' },
    duration: {
      label: 'How long has your marriage felt this way?',
      options: [
        'Less than 6 months',
        '6 months to 2 years',
        '2 to 5 years',
        'More than 5 years',
      ],
    },
  },
  errors: {
    firstName: 'Please enter your first name.',
    lastName: 'Please enter your last name.',
    email: 'Please enter a valid email address.',
    phone: 'Please enter your WhatsApp number.',
    city: 'Please enter your city.',
    duration: 'Please choose one so we know where to begin.',
  },
  /**
   * Shown on the last step, immediately above the button.
   *
   * Registration was never the problem: eight in ten women were registering and
   * then never arriving in the group, so they never got the Zoom link. Two
   * things caused it. She thought the link would come to her privately, and she
   * closed the tab at the offer page without realising the group link was one
   * screen further on. This block says both things out loud at the last moment
   * she is still paying attention.
   */
  finalNotice: {
    title: 'Please read this before you finish',
    points: [
      'After you save your seat you will see one short offer page. Take it or skip it, either is completely fine.',
      'Keep going until you reach the page with the WhatsApp group button. Do not close this window before you get there.',
      'Joining the WhatsApp group is compulsory. Your Zoom link is posted there and nowhere else.',
      'Every reminder and every update comes in that group. We do not send the link to anyone individually.',
    ],
    /**
     * A required tick, not a decorative one. Reading the four points above is
     * passive; ticking this is the woman saying it back to herself, and it is
     * the last chance to convert a passive registrant into someone who knows
     * she has to do one more thing.
     */
    confirm:
      'I understand I need to join the WhatsApp group to get my Zoom link and all other updates.',
    confirmError: 'Please tick this so we know you have seen where your Zoom link goes.',
  },
  next: 'Continue',
  back: 'Back',
  submit: 'Save my seat',
  submitting: 'Saving your seat, please wait...',
  privacy: 'We will only contact you about this session. No spam, ever.',
};

/* ────────────────────────────────────────────────────────────────────────────
 * P2 · THE ONE TIME OFFER  ·  /masterclass/upgrade
 * ────────────────────────────────────────────────────────────────────────── */

export const UPGRADE = {
  alert: 'Wait. Your seat is saved, but you are not done yet.',
  progressLabel: 'Registration 70% complete',
  heading: 'Before you join the WhatsApp group, one small decision.',
  deck: 'The women who get the most out of this masterclass are not the ones who show up. They are the ones who walk in already knowing their pattern.',
  /** The same brand line the landing page opens and closes on. */
  brandLine: MASTERCLASS_NAME,
  body: [
    `On ${WEBINAR.date} I am going to name the pattern ruining your marriage. Ninety minutes is enough to see it. It is not always enough to sit with it.`,
    'So I want to give you a head start. Something you can begin tonight, on your own, before the room even opens.',
  ],
  product: {
    badge: 'One time offer',
    name: 'The One Partner Reset',
    tagline:
      'A 45 minute breakthrough experience, plus everything that goes with it, that you can start tonight.',
    includes: [
      'The One Partner Reset Experience, 45 minutes, watch tonight',
      'The One Partner Blueprint, with a simple 30 day path',
      'The Hidden Needs Discovery Workbook',
      'The Conscious Response Playbook',
      'The Relationship Emergency Reset, for the nights it gets loud',
      '50 Marriage Affirmations',
      'The Love Legacy Manifesto',
      'The Relationship Clarity Assessment',
      'The Happiness Blueprint',
      'The Private Love Legacy Community',
    ],
    struck: ANCHOR_PRICE_LABEL,
    price: COURSE_PRICE_LABEL,
    priceNote: 'On this page only. This offer is not shown again.',
  },
  addon: {
    flag: 'Most women add this',
    kicker: 'Guided meditation',
    name: 'The Love Legacy Visualization',
    price: VISUALIZATION_PRICE_LABEL,
    meta: ['10 minutes', 'Video and audio', "In Sonali's voice"],
    tagline:
      "A guided meditation in Sonali's own voice that walks you one year into your future, so you can feel the marriage you are about to create, tonight, before you open a single module.",
    points: [
      'Set down the old arguments, the old fears, and the old stories, all in one sitting',
      'Walk into your future home and feel safe, chosen, and deeply loved again',
      'Begin from calm and hope, not from the day you have just had',
    ],
    quote: 'I choose you. Every day. I choose us.',
    quoteCaption: 'From the meditation',
    valueNote: 'Yours to keep for life',
    addLabel: `Yes, add the Love Legacy Visualization for ${VISUALIZATION_PRICE_LABEL}`,
    addedLabel: 'Added. Sonali will guide you the moment you begin.',
  },
  cta: {
    /**
     * The price on the button always matches the live total, so it moves with
     * the add-on toggle: ₹299 on its own, ₹498 with the Visualization kept. A
     * button that promises one number and charges another is the fastest way to
     * lose the trust this page depends on.
     */
    yes: (priceLabel: string) => `Yes, add The One Partner Reset for ${priceLabel}`,
    /** Shorter label for the sticky bar, where the row is tight on a phone. */
    yesShort: (priceLabel: string) => `Yes, add the Reset for ${priceLabel}`,
    /** Shortest form, for the narrowest phones. */
    yesTiny: (priceLabel: string) => `Add the Reset · ${priceLabel}`,
    note: 'One time payment. Secure checkout.',
    /** Sticky-bar opt-in for the companion add-on, mirrors the checkbox above. */
    addonToggle: (priceLabel: string) => `Add the Love Legacy Visualization for ${priceLabel}`,
    addonToggleOn: 'Visualization added',
    decline: 'No thank you, I will just take my seat',
    /** Sticky-bar wording for the decline, kept as a real, visible button. */
    declineShort: 'Just my seat',
  },
  compare: {
    eyebrow: 'The two ways in',
    columns: ['Just my seat', 'Seat + Reset'],
    recommended: 'Recommended',
    rows: [
      { label: `Live seat on ${WEBINAR.date}`, seat: true, reset: true },
      { label: 'Zoom link and reminders', seat: true, reset: true },
      { label: 'WhatsApp group access', seat: true, reset: true },
      { label: 'Start tonight instead of waiting', seat: false, reset: true },
      { label: 'The 45 minute Reset Experience', seat: false, reset: true },
      { label: 'Blueprint, Workbook, Playbook', seat: false, reset: true },
      { label: 'The Private Love Legacy Community', seat: false, reset: true },
      { label: 'Walk in already knowing your pattern', seat: false, reset: true },
    ],
  },
  why: {
    heading: 'Why I am offering this here',
    body: [
      'Because the gap between watching something and doing something is where most women lose the momentum. If you have already sat with your own pattern for a week before the session, everything I teach lands on ground that is already prepared.',
      'That is the whole reason this exists. Nothing more complicated than that.',
    ],
  },
  guarantee: {
    heading: 'The Full Reset Guarantee',
    body: 'Fourteen days. If you go through it and it does not give you something you can use, write to us and we will return your money. No forms, no explanation needed.',
  },
  closing:
    'Whichever you choose, join the WhatsApp group on the next page. That is where the Zoom link and the reminders go.',
  retryBanner:
    'That payment did not go through. Your seat is still saved. You can try again below.',
};

/* ────────────────────────────────────────────────────────────────────────────
 * P3A · CONFIRMED AND UNLOCKED  ·  /welcome-reset   (buyers)
 * ────────────────────────────────────────────────────────────────────────── */

export const WELCOME_RESET = {
  heading: 'Your seat is saved. And your Reset is unlocked.',
  sub: `${DAY_TIME_IST}. Here is exactly what to do now, in order.`,
  steps: [
    {
      n: '01',
      // Buyers get two groups, so this step is worded for both.
      title: 'Join your WhatsApp groups',
      body: 'The masterclass group is where your Zoom link goes and where the reminders come from. The Love Legacy community is where the women doing The One Partner Reset talk to each other. Join both.',
      cta: 'Join the WhatsApp group',
    },
    {
      n: '02',
      title: 'Check your email',
      body: 'Your login for The One Partner Reset is in your inbox already. If it is not there in five minutes, check promotions and spam, then write to us.',
    },
    {
      n: '03',
      title: 'Watch the first part tonight',
      body: 'It is 45 minutes. Do it before the session and you will walk into that room ahead of almost everybody in it.',
    },
  ],
  emailNote: {
    heading: 'What lands in your inbox',
    items: [
      'Your login link for The One Partner Reset, sent to the email address you registered with',
      'A receipt for your order, with the amount and the date',
      'Your Zoom link for the masterclass, sent again closer to the day',
    ],
    fine: 'Nothing arrived? Check promotions and spam first, then write to us and we will resend it by hand.',
  },
  course: {
    heading: "What's waiting inside",
    sub: 'Everything below is unlocked the moment your login arrives. Start with the first one tonight.',
  },
  /** Labels for the two groups shown together on the buyer pages. */
  groups: {
    masterclass: {
      label: 'Masterclass group',
      note: 'Your Zoom link and reminders',
      cta: 'Join the masterclass group',
    },
    reset: {
      label: 'Love Legacy community',
      note: 'Private, for One Partner Reset members',
      cta: 'Join the private community',
    },
  },
  calendarHeading: 'Add it to your calendar',
  closing: `See you on ${WEBINAR.day}. Come as you are.`,

  /**
   * Everything below is added only on the bundle page, /welcome-reset-plus,
   * which TagMango sends the buyers who also took the Love Legacy
   * Visualization. The Reset-only page never renders it.
   */
  addon: {
    heading: 'Your Love Legacy Visualization is included',
    badge: 'Both unlocked',
    sub: `A guided meditation in Sonali's own voice, ${VISUALIZATION_PRICE_LABEL}, now part of your order. Watch it once with her, then keep the audio for life.`,
    steps: [
      {
        title: 'Watch it once',
        body: 'Press play and let Sonali guide you through it, face to face, the very first time.',
      },
      {
        title: 'Then keep it for life',
        body: 'After that the audio is yours, to close your eyes and return to any morning or any hard night, as often as you need.',
      },
    ],
    points: [
      'Set down the old arguments, the old fears, and the old stories, all in one sitting',
      'Walk into your future home and feel safe, chosen, and deeply loved again',
      'Begin from calm and hope, not from the day you have just had',
    ],
    quote: 'I choose you. Every day. I choose us.',
    quoteCaption: 'From the meditation',
    delivery:
      'The Visualization arrives by email alongside your Reset login, as a video you can watch and an audio file you can keep. If you would rather begin with it tonight, start there and come to the Reset tomorrow. There is no wrong order.',
  },
};

/**
 * The two headings and sub-lines that differ between the Reset-only thank-you
 * page and the bundle one. Everything else on those two pages is identical and
 * comes from WELCOME_RESET above.
 */
export const WELCOME_RESET_PLUS = {
  heading: 'Your seat is saved. And everything you bought is unlocked.',
  sub: `${DAY_TIME_IST}. Here is exactly what to do now, in order.`,
  emailHeading: 'What lands in your inbox',
  emailItems: [
    'Your login link for The One Partner Reset, sent to the email address you registered with',
    'The Love Legacy Visualization, as a video to watch and an audio file to keep for life',
    'A receipt for your order, with the amount and the date',
    'Your Zoom link for the masterclass, sent again closer to the day',
  ],
};

/* ────────────────────────────────────────────────────────────────────────────
 * P3B · CONFIRMED, SEAT ONLY  ·  /welcome   (non-buyers)
 * ────────────────────────────────────────────────────────────────────────── */

export const WELCOME = {
  heading: 'Your seat is saved.',
  sub: `${DAY_TIME_IST}. Three things to do now, and they take a minute.`,
  steps: [
    {
      n: '01',
      title: 'Join the WhatsApp group',
      body: 'This is where your Zoom link goes, and where the reminders come from. If you skip this step you will probably miss the session.',
      cta: 'Join the WhatsApp group',
    },
    {
      n: '02',
      title: 'Add it to your calendar',
      body: `${DAY_TIME_IST}. Ninety minutes. Block it like you would block anything that matters.`,
    },
    {
      n: '03',
      title: 'Come with your camera on',
      body: 'Sonali runs this face to face, not to a screen of black squares. Everyone in the room is a married woman in the same place you are, and nobody is put on the spot. Find somewhere quiet, and use headphones if the house is busy.',
    },
  ],
  secondChance: {
    heading: 'Still want the head start?',
    body: `The One Partner Reset is 45 minutes you can watch tonight, so you walk into the session already knowing your pattern. It stays at ${COURSE_PRICE_LABEL} until the room opens.`,
    cta: 'Add The One Partner Reset',
  },
  closing: `See you on ${WEBINAR.day}. Come as you are.`,
};
