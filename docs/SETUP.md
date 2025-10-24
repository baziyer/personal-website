# Personal Site PRD (Single‑Page, Next.js + Vercel)

Owner: Baz Iyer / Home Energy Foundry Ltd
Status: Enhanced Theme System v2
Domain: homeenergyfoundry.com

---

## 1) Objectives

* Generate inbound leads for fractional CPO, product coaching, and data/AI advisory.
* Showcase credibility via CV and testimonials.
* Enable fast contact and booking within 1–2 clicks.
* Ship a modern, dark theme, interactive, responsive site with tasteful animation.

**Primary KPI:** Contact conversions (form submits + calendar bookings).
**Secondary KPIs:** Time on page, section scroll depth, CTR on services.

---

## 2) Audience & JTBD

* **Founders / CEOs**: Need an objective product/data advisor or interim CPO. Want proof of execution and quick booking.
* **Heads of Product / Data**: Need coaching, audits, and delivery help that lands within weeks.
* **Investors / Advisors**: Need a credible operator to parachute into portfolio cos.

**Top tasks:** Skim profile → verify credibility → pick an engagement format → contact or book.

---

## 3) Information Architecture (Single Page)

1. **Hero** (value prop + CTA: “Book intro” + “Contact”).
2. **Services** (packages + outcomes + pricing signals/ranges).
3. **Engagements** (1h clinic, 1–2 day audit, 1–2 week sprint; what’s included, outputs).
4. **CV / Experience** (companies, responsibilities, outcomes; concise bullets + highlights).
5. **Testimonials** (carousel; placeholders until real quotes land).
6. **About** (approach, principles, tools).
7. **Contact / Book** (form + calendar embed + email + social).
8. **Footer** (legal, privacy, credits).

**Nav:** Persistent top bar. Instant scroll to section anchors. Active section highlight. “Book intro” sticky. Picker for base theme and color.

---

## 4) Content Requirements

### Hero

* Headline: “Fractional CPO & Product/Data Advisor”
* Sub: “I help teams ship, learn, and decide with data & AI.”
* CTAs: `Book 30‑min intro` and `Contact`.

### Services (high‑level)

* Fractional CPO / Product leadership support.
* Product & data analytics coaching.
* New product testing & GTM experiments.
* Independent advice for leadership.

**Pricing:** Start with “Contact me” (no public ranges at launch).

### Engagements (detailed packs)

* **1‑hour Clinic**: PRD + prototype with AI tools; focused upskilling. Output: draft PRD, prototype link, next‑step checklist.
* **1–2 Day Audit**: Product dev process + analytics/AI usage review. Output: scorecard, gaps, 30‑60‑90 plan.
* **1–2 Week Sprint**: Hands‑on delivery to validate a product bet. Output: instrumented experiment, results review, decision memo.

### CV / Experience

* For each role: Company, dates, role, responsibilities, measurable outcomes, stack.

### Testimonials

* Placeholders (3): Enzo Ottens — Founder, Ollie Purdue — Founder, Dave Sherwood — Founder. Include names and LinkedIn links once confirmed.

### About

* First‑person short bio only. No principles list.

### Contact / Book

* Contact form (name, email, company, message, optional budget & timeframe).
* Calendar embed for 30‑min intro using Calendly: `https://calendly.com/baz-iyer/30-min-catchup`.
* Social links.

---

## 5) Visual & Interaction

**Theme:** Dark default, optional Light toggle. High contrast. Futuristic, minimal.

**Home Energy Foundry Theme System (enhanced):**

* **Brand Colors:** Primary yellow (#FFD700, ~45°) and complementary blue (#0066CC, ~225°) from Home Energy Foundry Ltd
* **Palette model:** Base (`--bg`, `--fg`) + 3 accents (`--accent1`=brand primary, `--accent2`=H+30°, `--accent3`=H+180°). Each gets -600/-400/-200 ramps.
* **Generation:** Default to brand colors, seeded hue from `localStorage` (hash of UA+day). For dark base use HSL `(H,88%,60%)`; for light `(H,70%,45%)`. Derive `accent2`, `accent3` as above. Clamp and sanitize.
* **Accessibility:** Auto‑adjust L/S to meet AA contrast against base for text, borders, and focus rings. Fallback to safe palette on failure.
* **Tokens:** Exposed as CSS vars; Tailwind consumes vars. Components never hardcode colors.
* **Picker (header):** Base: Dark/Light. Randomize color. Mode: Static | Kaleidoscope (sinusoidal hue drift). "Copy theme" shares URL with `?base=dark&hue=45&mode=static`. Hue text input deferred.
* **Kaleidoscope mode:** Sinusoidal hue rotation with varying intensity; transitions ≤150ms; paused on scroll; disabled for `prefers-reduced-motion`.
* **Where color applies:** buttons (with fill animations), links, focus rings, section gradient dividers, subtle background grid tint, icon strokes, CTA glow, micro-interactions.
* **What stays fixed:** body text, headings, card surfaces, shadows.

**Background & Section Styling:**

* Subtle procedural grid (Canvas) at ≤4% opacity.
* Gradient dividers between sections (linear/conic) at low alpha.
* Light parallax on backgrounds (translate 2–6px).

**Motion:** Section reveal on scroll, micro‑interactions, button fill animations, CTA glow effects. No cursor trails. No Konami code.

**Enhanced Button Interactions:**
* Fill animations with accent colors on hover/click
* Glow effects around primary CTAs
* Smooth state transitions (scale, shadow, color)
* Micro-interactions for better user feedback

---

## 6) Tech Stack & Architecture

* **Framework:** Next.js App Router, React Server Components, TypeScript.
* **Hosting/CDN:** Vercel.
* **Styling:** Tailwind CSS + CSS variables tokens.
* **UI kit:** shadcn/ui; lucide‑react icons.
* **Content:** JSON seed for CV, services, testimonials (MDX optional later).
* **Forms:** None for MVP. Contact uses `mailto:` link to direct email. Add form later if needed.
* **Booking:** Calendly modal embed for `https://calendly.com/baz-iyer/30-min-catchup`; fallback new tab.
* **Analytics:** Optional Plausible basic pageview tracking at launch. Event goals can be added later.
* **SEO & Meta:** Next Metadata API (title, description, OG). **Favicon:** rocketship SVG + 32/192/512 PNGs.
* **Performance:** Next/Image, font optimize, dynamic imports, RSC.

---

## 7) Data Model (content layer)

```ts
// Experience
{
  company: string,
  role: string,
  start: string, // YYYY-MM
  end?: string, // YYYY-MM or 'present'
  responsibilities: string[],
  outcomes: string[], // quant results
  stack?: string[]
}

// Service
{
  id: string,
  title: string,
  summary: string,
  deliverables: string[],
  timeframe: '1h' | '1-2d' | '1-2w' | 'ongoing',
  priceHint?: string // optional range
}

// Testimonial
{
  person: string, // name optional at first
  title: string,
  company?: string,
  quote: string
}
```

---

## 8) Routing, Navigation & States

* Single route `/`. Hash anchors: `#services`, `#engagements`, `#cv`, `#testimonials`, `#about`, `#contact`.

* **Nav:** sticky top bar with anchor links; active link via IntersectionObserver scroll‑spy.

* **Header controls:** Theme picker (base, randomize, Static/Kaleidoscope mode). “Book intro” primary CTA. No command palette.

* **Scroll behavior:** smooth scroll with `scroll-margin-top`; instant scroll if `prefers-reduced-motion`.

* **Deep links:** URL hash updates on section enter; back/forward supported.

* **Modals:** booking, contact confirmation.

* **Loading states:** skeletons for carousels/modals.

---

## 9) Accessibility & Compliance

* Respect `prefers-reduced-motion`.
* Color contrast AA minimum.
* Keyboard focus rings visible. Command palette fully keyboard‑navigable.
* Form validation with ARIA live regions.
* Cookie banner not required if using Plausible without cookies. Privacy page present.

---

## 12) Copy Outline (first pass)

* Hero: Headline + sub + two CTAs.
* Services: Short outcome‑led bullets. Each card expands to show deliverables.
* Engagements: Three packages with inputs → outputs → timeline.
* CV: 4–6 roles. 3 bullets per role for outcomes.
* Testimonials: 3 placeholders.
* About: 5 principles + tool stack.
* Contact: short form and booking link.

---

## 13) Enhanced Implementation Plan

**Phase 1: Core Theme Fixes**
1. Fix kaleidoscope mode - ensure toggle actually updates colors
2. Set Home Energy Foundry brand colors as default (yellow #FFD700, blue #0066CC)
3. Implement sinusoidal animation for kaleidoscope mode

**Phase 2: Enhanced Interactions**
1. Add button fill animations with accent colors
2. Implement CTA glow effects
3. Add micro-interactions and smooth state transitions
4. Enhanced focus rings with dynamic accent colors

**Phase 3: Background Elements**
1. Add subtle procedural grid background (Canvas)
2. Implement gradient dividers between sections
3. Add light parallax effects on backgrounds

**Phase 4: Advanced Features**
1. Scroll-triggered animations
2. Intersection Observer for section reveals
3. Performance optimizations for animations

---

## 14) Delivery Plan

**Milestone 1: Foundation (Day 1–2)**
Repo, CI on Vercel, Tailwind, shadcn/ui, base layout, anchors, theme tokens.

**Milestone 2: Content & Sections (Day 3–6)**
Implement Services, Engagements, CV from JSON/MDX; Testimonial placeholders; About.

**Milestone 3: Interactions (Day 7–9)**
Scroll spy, command palette, carousel, modals, subtle particles, reduced‑motion handling.

**Milestone 4: Contact & Booking (Day 10–11)**
Form with validation + email, Calendly modal, success states, analytics events.

**Milestone 5: Perf/SEO/QA (Day 12–13)**
Image/OG, sitemap/robots, Lighthouse fixes, analytics goals, cross‑device QA.

**Milestone 6: Launch (Day 14)**
DNS, monitoring, post‑launch checklist, backlog triage.

---

## 14) Acceptance Criteria

* All sections present, navigable via sticky nav and anchors.
* Two primary CTAs always available.
* Form submit sends email and shows confirmation; spam protected.
* Booking modal loads and tracks events.
* Animations degrade with `prefers-reduced-motion`.
* Metrics logged in Plausible.
* Meets performance budget.

---

## 15) Risks & Mitigations

* **Animation bloat** → Cap bundle, use CSS/transforms, lazy‑load heavy bits.
* **Low conversion** → Iterate on copy, add proof, surface pricing hints, improve CTA placement.
* **Testimonial gaps** → Ship placeholders, swap in quotes when ready.

---

## 16) Open Questions / Inputs Needed

* Final list of roles and outcomes for CV.
* Price signals or “from” ranges for each package.
* Preferred calendar vendor and email routing.
* Branding tokens: font, accent color, logo mark.

---

## 17) Nice‑to‑Haves (Post‑MVP)

* Downloadable PDF CV generated on‑the‑fly.
* Blog/notes via MDX.
* CMS integration when content volume grows.
* Playground micro‑app behind command palette keyword (later).
