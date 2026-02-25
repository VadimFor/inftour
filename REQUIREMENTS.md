# INFTOUR — Client Requirements Document

This document describes the **minimal product** currently delivered and the **requirements to complete or extend** the project for the client.

---

## 1. Current Scope (Minimal Baseline)

### 1.1 Global

- **Languages:** English, Spanish, Russian (stored in `app/lib/langStore.ts`, persisted in `localStorage`).
- **Layout:** Fixed top bar (weather, sea temp, webcam link) → Sticky nav → Page content → Footer.
- **Nav:** Five items (Direct booking, Experiences, Services, Magazine, Lobby) + AI chat button + language switcher. Bottom gold bar on hover and on active page.
- **Footer:** Tagline, license line, navigation links, contact (phone, email, address with Google Maps link).

### 1.2 Pages

| Page | Route | Content (minimal) |
|------|--------|-------------------|
| **Direct booking** | `/` | Embedded booking iframe (e.g. bookonline.pro). Placeholder “loading” state. |
| **Experiences** | `/experiencias` | Hero (“Ecosystem of rest”) + 6 section cards: AI guide, Gastronomy, Nature, Family, Relax, Sport — each with subsections and translations. |
| **Services** | `/services` | Hero + 3 alternating image/text blocks (rentals, concierge, support) + Practical info (police, medical, transfers, car rental, supermarket delivery, bike rental) + Activities (hiking, boating, diving, cycling, wine, beaches). |
| **Magazine** | `/revista` | If `MAGAZINE_PDF_PATH` is set in `app/config/magazine.ts`: PDF viewer + download link. Else: placeholder cover + 3 spreads (rental themes). |
| **Lobby** | `/lobby` | About us + team (4 placeholder people) + office images + Google Maps embed + AI chat blurb + contact form (dark card) + Policies & legal links + FAQ (centered, accordion). |

### 1.3 Contact & Back-end

- **Contact form (Lobby):** POST `/api/contact` with `{ email, message }`. Validation and 200 response; submissions are **logged only**. No real email sending yet (TODO in code).
- **Webcam:** Link in top bar to external URL; optional API route for proxying exists but is unused.

### 1.4 Content & Assets

- **Copy:** All UI and page text in `langStore.ts` (eng/esp/ru). Team names, policies, FAQ, services, experiences, etc. are editable there.
- **Images:** Services/Experiencias/Revista use Unsplash URLs; Lobby team and office use placeholders. Magazine PDF path is config-driven (`app/config/magazine.ts` + `public/magazine/`).

---

## 2. Requirements for the Client (To Do / Optional)

### 2.1 Must-have (to go live)

- [ ] **Contact form → real email**  
  Wire `/api/contact` to an email provider (e.g. Resend, Nodemailer) so messages reach `booking@inftour.com` (or client’s chosen address). Remove or replace `console.log` submission.

- [ ] **Real content**  
  Replace placeholder team names, photos, and office images with real data. Update `langStore` and, if needed, replace images in `public/team/` or update URLs in components.

- [ ] **Policies & legal links**  
  Lobby links (cancellation, payment, terms, privacy) currently point to `#`. Create actual pages or PDFs and set correct `href`s (or use external URLs).

- [ ] **Magazine (if used)**  
  If the client publishes a PDF magazine: add the file under `public/magazine/` and set `MAGAZINE_PDF_PATH` in `app/config/magazine.ts`. Otherwise leave as placeholder or remove section.

- [ ] **Booking engine**  
  Confirm the embedded iframe URL and parameters (e.g. `bookonline.pro`) with the client. Ensure correct property, language, and any legal/cookie requirements.

- [ ] **License / legal text**  
  Replace placeholder footer license (e.g. `EGVT-XXX-A`) with the real tour operator license and any required disclaimers.

### 2.2 Should-have (UX & trust)

- [ ] **AI chat behaviour**  
  Current AI chat is UI-only (placeholder replies). Decide: keep as “contact” CTA, or integrate a real chatbot/API and update copy in Lobby and nav.

- [ ] **Calpe webcam**  
  Top bar link goes to external webcam. If the client wants an in-page player (e.g. HLS), the existing `CalpeWebcam` component and/or webcam API route can be wired in; otherwise keep as external link.

- [ ] **SEO & meta**  
  Add or refine `metadata` (title, description, OG tags) per route in `app/layout.tsx` or per-page. Consider sitemap and robots if needed.

- [ ] **Analytics & consent**  
  If the client wants analytics (e.g. Google Analytics), add script and, if required in the EU, a cookie/consent banner and document in requirements.

### 2.3 Nice-to-have (future)

- [ ] **Real-time weather/sea**  
  Weather and sea temperature are already fetched server-side; confirm data source and fallbacks with the client.

- [ ] **Experiences / Services CMS**  
  If content will change often, consider moving copy (or parts of it) to a CMS or JSON/MD and loading dynamically instead of only in `langStore`.

- [ ] **Accessibility & performance**  
  Run Lighthouse (a11y, performance), fix critical issues, and add any missing ARIA or keyboard support.

- [ ] **Error and loading states**  
  Add generic error boundaries and, where relevant, loading UIs (e.g. for booking iframe, PDF, or future API calls).

---

## 3. Technical Notes for Developers

- **Stack:** Next.js (App Router), React, TypeScript, Tailwind CSS, Zustand (lang store).
- **Config:** Magazine path → `app/config/magazine.ts`. Contact recipient → `app/api/contact/route.ts` (`TO_EMAIL`).
- **Translations:** Single source in `app/lib/langStore.ts`; keys used across Nav, Footer, and all page content.
- **Deployment:** Build and run as a standard Next.js app (e.g. Vercel). Ensure env vars are set if an email provider or external API is added.

---

## 4. Summary

The current codebase is a **minimal but complete shell**: multi-language, all main pages (booking, experiences, services, magazine, lobby), contact form API, and configurable magazine and contact email.  

**To hand over to the client for production:** implement real contact email, replace placeholders (team, office, policies, license), and confirm booking + magazine behaviour. Optional: AI chat integration, webcam in-page, SEO, analytics, and CMS-driven content.
