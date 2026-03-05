# URR — Demo PRD

> Version: v1.1 | Date: 2026-03-03 | Status: Demo-Grade Spec (Post-Clarification)

---

## 1. One-Sentence Problem

> Loyal K-POP fans struggle to purchase concert tickets at face value because bots and resellers dominate pre-sale queues, resulting in repeated failures and forced overpayment at 2–3x markup on resale markets.

---

## 2. Demo Goal (What Success Looks Like)

**The demo is successful when**:
- A user can sign up, verify their fan tier (Diamond/Gold/Silver/Bronze), and see their tier badge reflected across the platform.
- A Silver/Bronze user completes a VQA quiz before entering the booking queue; a Diamond/Gold user skips directly to the queue.
- A user navigates the full 2-Panel booking flow: idle → VQA (if applicable) → queue → seat selection → payment → QR ticket issued.
- The queue displays real-time position, estimated wait time, and success probability with visible WebSocket updates.
- The seat map renders interactively: section overview → grape-style individual seats → selection with a 3-minute countdown timer.
- A user can search for artists and events by keyword and find results instantly.
- A user who can no longer attend can list their ticket for transfer; a buyer can browse, purchase, and receive ownership — all within the platform via escrow.
- A first-time user completes onboarding (artist selection → membership intro → payment or skip) and lands on a personalized Home within 3 minutes.

**What the demo clearly communicates**:
- Higher fan loyalty = earlier access and smoother path. The tier system visibly rewards dedication.
- VQA is a natural, engaging fan gate — not a frustrating CAPTCHA. Bots cannot pass.
- The entire flow from discovery to QR ticket happens on one platform with zero page transitions during booking.
- Failed ticketing fans stay on-platform via the official transfer market instead of leaving for external resale.
- New users are guided from zero to personalized Home in under 3 minutes — low friction, high intent capture.

**Deliverable type**: Interactive React prototype with mock data. All state transitions work (idle → VQA → queue → seats → payment). Buttons trigger actual navigation. Timers count down. Mock data populates all screens. This is a working frontend application that developers extend with real API integrations.

**Non-Goals (intentionally out of scope)**:
- Community feed or social features
- Push notifications or real notification triggers (notification page exists as UI shell with mock data)
- Admin panel for event/VQA management (seed data only)
- Mobile responsive layout — **desktop only**
- Real API integrations — all external data (Melon, Toss, phone verification) is mock/simulated
- Album serial verification (deferred to post-MVP)

---

## 3. Target User (Role-Based)

| | |
|---|---|
| **Role** | Active K-POP fan club member who participates in concert ticket pre-sales |
| **Context** | Pays ₩30K/year for official fan club membership; attempts ticketing 2–3 times/month across multiple artists |
| **Skill level** | Digitally fluent; experienced with Kakao/Naver login and online payment flows |
| **Key constraint** | Time pressure — booking windows are narrow (minutes), competition is extreme (10,000+ concurrent users), and every second of friction reduces success probability |

---

## 4. Core Use Case (Happy Path)

**Start condition**: User has an active URR membership for Artist X. A concert event is scheduled with a Diamond pre-pre-sale opening in 10 minutes.

**Flow**:

1. User opens URR → Home shows "Upcoming: Artist X Concert" card with countdown timer and their Diamond badge.
2. User taps the event card → navigates to `/events/:eventId` (2-Panel layout).
3. **Left Panel** displays: poster, event name, venue, date dropdown (selects Feb 22 evening show), seat/price table, tier-based booking schedule showing "💎 Diamond — Opens in 8:42", and their current tier info.
4. **Right Main (idle)**: Section layout preview shows remaining seat counts per section. [Book Now] button is disabled with countdown. When the window opens, the button activates.
5. User clicks [Book Now]. System detects Diamond tier → **VQA is skipped** → user enters queue directly.
6. **Right Main (queue)**: Displays position (#47 / 1,200), estimated wait (2 min 15s), success probability (92%), section-level remaining seats. Updates every 10 seconds via WebSocket.
7. Queue position reaches the front → user is promoted to seat selection.
8. **Right Main (seats)**: Section overview map appears. User taps "A Section" → grape-style individual seat map zooms in. 3-minute timer starts. User selects 2 adjacent seats (max 4). Selected seats turn blue; others' locked seats show yellow in real-time.
9. User confirms selection → **Right Main (payment)**: Toss Payments checkout. Ticket price + ₩1K Diamond fee displayed. User completes payment.
10. Payment success → QR code generated → ticket saved to My Page > Ticket Wallet. Confirmation screen with event details + QR.

**End condition**: User holds a valid QR ticket in their wallet. Booking took under 5 minutes from window open to confirmation.

**Alternate path (Silver/Bronze)**: After step 5, user enters VQA state instead. 3 random text-based artist-knowledge questions appear (lyrics completion, trivia, contextual questions — 30s each). No image or video content. Pass (2/3 correct) → queue entry. Fail → retry (max 2). Exhaust retries → session ends with "Try again next booking window" message.

### Onboarding Flow (First-Time User)

**Start condition**: User opens URR for the first time (no account).

**Phase 1 — Signup & Identity Verification**:

1. Landing page → taps [Get Started] → login/signup selection.
   - Social login buttons: Kakao, Naver
   - Email signup button (with "Find ID / Reset Password" links)
2. **Phone identity verification** (required for all signup paths — 1-person-1-account via CI):
   - Select carrier (SKT / KT / LGU+ / MVNO)
   - Input: full name, date of birth (8 digits), gender / domestic-or-foreign, phone number
   - Tap [Send Code] → SMS verification code input (3-minute timer)
   - System checks CI hash against existing accounts → if duplicate, block and show existing account info
3. **Terms agreement**:
   - "Agree to All" master checkbox
   - [Required] Terms of Service — detail view link
   - [Required] Privacy Policy — detail view link
   - [Optional] Marketing consent (push, SMS) — detail view link
4. Signup complete → system assigns **Bronze (Lv.1)** tier immediately.

**Phase 2 — Personalization**:

5. Artist selection screen: search or browse artist cards → select 1+ artists to follow.
6. Membership intro: tier benefits explained (Diamond → Bronze) with visual comparison. [Join Membership — ₩30K/year] or [Skip for now].
7. If joined → tier verification prompt: [Link Melon] or [Later]. (Album serial verification deferred to post-MVP.)
8. Redirect to Home → personalized with selected artists, upcoming events, and tier badge (or "Verify to unlock higher tier" CTA).

**End condition**: User lands on a personalized Home in under 3 minutes with Bronze tier. If membership purchased, booking is unlocked immediately.

**Key business logic**:
- **1-person-1-account (CI-based)**: On successful phone verification, the returned CI (Connecting Information) hash is checked against existing records. If a match exists, new signup is blocked and the user is guided to their existing account.
- **Anti-bot foundation**: Mandatory identity verification structurally prevents automated account creation.
- **Tier assignment**: Upon signup completion, user record is immediately set to Bronze (Lv.1).

### Transfer Market Flow (Seller → Buyer)

**Start condition (Seller)**: User holds a QR ticket they can no longer use.

1. My Page → Ticket Wallet → selects ticket → taps [List for Transfer].
2. System shows recommended price (face value ±10%) and price bounds (floor 0.5x, cap 1.5x). Seller sets price within bounds.
3. System shows tier-based fee preview (Diamond/Gold 5%, Silver/Bronze 10%). Seller confirms → listing goes live on Artist page > Transfer tab.

**Start condition (Buyer)**: User wants to attend but missed ticketing.

4. Artist page → Transfer tab → browse listings. Each card shows: section, seat(s), price, price-vs-face-value %, seller tier badge, seller transaction history count.
5. Buyer taps a listing → detail view with seat location on map + seller info → [Purchase].
6. Escrow payment via Toss Payments → funds held.
7. Ownership transfer: seller's QR invalidated → new QR issued to buyer → ticket appears in buyer's wallet.
8. Seller receives payout (price minus fee) after transfer completes.

**End condition**: Buyer holds a valid QR ticket; seller receives payout. Platform earns transfer fee.

---

## 5. Functional Decisions (What It Must Do)

| ID | Function | Notes |
|----|----------|-------|
| F01 | Signup & Login | Kakao/Naver OAuth + email signup. Phone identity verification (CI-based) required for all paths — enforces 1-person-1-account policy as anti-bot foundation. Supabase Auth. |
| F02 | Membership purchase (per artist) | Toss Payments, ₩30K/year. Unlocks booking for that artist. |
| F03 | Tier verification — streaming (MVP: Melon only) | Melon OAuth linking → streaming history lookup → tier assignment based on streaming score (re-scaled to 100 points from the 20% weight in the full Fan Trust Score). No fallback in MVP — users who don't link Melon remain Bronze. Demo uses mock Melon data. |
| F04 | ~~Tier verification — album~~ | **Deferred to post-MVP.** Album serial verification removed from demo scope. Production system will include this as part of the full 6-factor Fan Trust Score. |
| F05 | Tier badge display | Badge (💎🥇🥈🥉) shown on profile, event pages, and queue. Tier determines booking window + fee + VQA path. |
| F06 | Home discovery | Hero banner carousel (3–5 events) + my artists list (badge + next event) + trending events. |
| F07 | Artist page — events tab | List of upcoming + past events. Card: poster, date, venue, booking status (open/upcoming/closed). |
| F08 | 2-Panel booking page | Left: fixed event info + date dropdown. Right: state machine (idle → vqa → queue → seats → payment). |
| F09 | VQA quiz gate | 3 random **text-only** questions from 50+ pool (lyrics completion, trivia, contextual questions). 30s/question, 2/3 to pass, max 2 retries. Silver/Bronze only. No image or video content in demo. |
| F10 | Real-time queue | Redis sorted set. Display: position, estimated wait, success probability. WebSocket 10s refresh. |
| F11 | Seat map (SVG / PNG fallback) | Real venue reference (15,000+ seats). Primary: SVG-based 2-step (section overview → grape-style individual seats). Fallback: PNG venue image with clickable region overlays (image map style). Color-coded: available (green), my pick (blue), taken (gray), others' lock (yellow). |
| F12 | Seat lock + timer | 3-minute TTL via Redis distributed lock. Max 4 seats. Timer visible; auto-release on expiry. |
| F13 | Payment | Toss Payments integration. Amount = ticket price + tier-based fee. |
| F14 | QR ticket issuance | On payment success: generate unique QR → save to ticket wallet in My Page. |
| F15 | My Page | Sections: membership info (tier + badge + artist), ticket wallet (upcoming + past, QR display), transfer history (sold + purchased). |
| F16 | Search | Global search across artists and events. Instant results as-you-type. Accessible from GNB Sidebar and top bar. |
| F17 | Onboarding flow | First-time user: login/signup → phone identity verification (CI) → terms agreement → artist selection → membership intro (join/skip) → tier verification prompt → personalized Home. Bronze tier assigned immediately on completion. Target: < 3 minutes. |
| F18 | Transfer — seller listing | My Page > Ticket Wallet > [List for Transfer]. Price input with recommended range (face ±10%, cap 1.5x, floor 0.5x). Fee preview by tier. |
| F19 | Transfer — buyer purchase | Artist page > Transfer tab. **Buyer must hold active membership for the artist** (closed ecosystem). Browse listings (filter by date/price/section). Escrow payment via Toss. Ownership transfer: old QR invalidated → new QR issued. |
| F20 | Transfer — escrow + settlement | Funds held until ownership transfer completes. Seller payout = price − tier fee (5% or 10%). Anomaly detection: flag listings > 1.3x face value. |
| F21 | Notification page (UI shell) | GNB notification icon with badge count. Page displays sample notifications (booking open, transfer complete, tier upgrade, etc.) as **mock data only**. No real event triggers or push in demo. |

---

## 6. UX Decisions (What the Experience Is Like)

### 6.1 Entry Point

- **First visit**: Landing page → social login → **onboarding** (artist selection → membership intro → verification prompt) → personalized Home.
- **Returning user**: Opens directly to Home. My artists section shows upcoming events with booking status.
- **Booking entry**: Home event card or Artist page event card → `/events/:eventId` (2-Panel).
- **Search**: GNB Sidebar search icon or top bar → type keyword → instant results (artists + events).
- **Transfer (sell)**: My Page > Ticket Wallet > [List for Transfer].
- **Transfer (buy)**: Artist page > Transfer tab → browse → purchase.

### 6.2 Inputs

| Input | Where | Details |
|-------|-------|---------|
| Login / Signup | Auth | Kakao or Naver OAuth tap, or email + password |
| Phone identity verification | Onboarding | Carrier select, full name, DOB, gender, phone number, SMS verification code (3-min timer) |
| Terms agreement | Onboarding | Checkboxes: TOS (required), Privacy (required), Marketing (optional) |
| Membership payment | Artist page | Toss Payments sheet, ₩30K/year |
| Tier verification | My Page or onboarding prompt | Melon link (OAuth) only. Album serial deferred to post-MVP. |
| Date selection | Booking left panel | Dropdown — only open dates are tappable |
| VQA answers | Booking right panel | Tap one of 4 text options per question (text-only, no image/video) |
| Seat selection | Booking right panel | Tap section → tap individual seats on SVG map |
| Payment confirmation | Booking right panel | Toss Payments checkout |
| Search query | GNB Sidebar / top bar | Text input, instant results as-you-type |
| Onboarding artist selection | Onboarding screen | Tap artist cards (1+ required) |
| Transfer listing price | My Page > Ticket Wallet | Number input within system bounds (0.5x–1.5x face value) |
| Transfer purchase | Artist page > Transfer tab | Tap listing → confirm → Toss Payments escrow |

### 6.3 Outputs

| Output | Form | Where |
|--------|------|-------|
| Tier badge | Visual badge (💎🥇🥈🥉) | Profile, event pages, queue, My Page |
| Queue status | Live counter + progress bar | Booking right panel (queue state) |
| Seat availability | Color-coded SVG map | Booking right panel (seats state) |
| Timer | Countdown overlay (MM:SS) | Booking right panel during seat selection |
| QR ticket | Rendered QR code + event details | Payment confirmation + My Page ticket wallet |
| Search results | Grouped list (artists + events) | Dropdown overlay or dedicated results page |
| Transfer listing | Card with section, price, seller badge | Artist page > Transfer tab |
| Transfer confirmation | New QR for buyer, payout notice for seller | Buyer ticket wallet + seller payout notification |

### 6.4 Feedback & States

| State | Feedback |
|-------|----------|
| **Loading** | Skeleton UI for cards/lists. Seat map shows shimmer placeholder. Queue shows "Connecting..." spinner. |
| **Success** | Tier verified → badge animation + toast. Payment complete → confetti + QR reveal. VQA passed → "Welcome, real fan!" transition. Transfer complete → "Ticket transferred!" confirmation for both parties. Onboarding done → personalized Home reveal. |
| **Failure** | VQA failed → "Incorrect. [N] retries remaining" with shake animation. Payment failed → inline error + retry button. Seat expired → "Time's up. Seats released." modal with return-to-queue option. Transfer payment failed → "Payment could not be completed. Listing is still available." |
| **Partial / Waiting** | Queue → live position counter with pulse animation. Seat lock → yellow flash on other users' selections. Booking window not yet open → countdown timer on disabled button. Transfer escrow pending → "Processing transfer..." spinner. |

### 6.5 Errors (Minimum Viable Handling)

| Scenario | Handling |
|----------|----------|
| ~~Invalid album serial~~ | **Deferred to post-MVP.** Album serial verification not in demo scope. |
| WebSocket disconnect in queue | Auto-reconnect with exponential backoff. Show "Reconnecting..." banner. Position preserved server-side. |
| Seat lock expired (3 min) | Modal: "Your selection time expired. Seats have been released." [Return to section map] button. |
| Payment timeout / failure | "Payment could not be completed. Your seats are held for 60 more seconds." [Retry] button. After 60s, seats released. |
| VQA retries exhausted | "You've used all attempts for this session. You can try again in the next booking window." [Return to event page]. |
| No seats remaining | Queue state updates to show "Sold Out" with probability dropping to 0%. User can stay or exit. |
| Search returns no results | "No artists or events found for '[query]'. Try a different keyword." |
| Transfer listing price out of bounds | Inline validation: "Price must be between ₩[floor] and ₩[cap]." Slider snaps to nearest valid value. |
| Transfer escrow failure | "Transfer could not be completed. No charges were made." Listing remains active. |
| Onboarding skipped (no artist selected) | Block progression: "Select at least one artist to continue." Highlight artist grid. |
| Duplicate CI (existing account) | Popup: "An account already exists with this identity. (Signed up via: Kakao)" → redirect to login screen. |
| Verification code expired (3 min) | Inline error below input: "Verification code has expired. Please try again." [Resend Code] button re-activates. |
| Minor signup attempt (under 14) | "Users under 14 require parental consent." Branch to legal guardian consent flow or block signup per policy. |
| Network error during signup | On reconnect: detect in-progress signup state → "You have an incomplete registration. Resuming from terms agreement." Resume from last completed step. |

---

## 7. Data & Logic (At a Glance)

### 7.1 Inputs

| Source | Data |
|--------|------|
| **User** | Social login or email credentials, phone identity info (name/DOB/phone/carrier), terms consent, seat selections, payment info, search queries, transfer listing price, onboarding artist selections |
| **Phone verification provider** | CI (Connecting Information) hash — unique per individual, used for 1-person-1-account enforcement |
| **Kakao OAuth → Melon (mock)** | Streaming history (artist play counts, listening duration) → tier calculation. **Demo uses mock Melon data — no real API integration.** |
| **Toss Payments API** | Payment authorization, transaction confirmation |
| **Admin seed data** | Artists, events, event dates, seat maps (SVG), VQA question pools, sale configs (tier windows/fees) |
| **Redis (runtime)** | Queue positions, seat locks, session state |

### 7.2 Processing

```
Tier Assignment (MVP — Melon streaming only):
  Mock Melon streaming data → scoring algorithm (streaming factor re-scaled to 100pts) → tier threshold check → assign Diamond/Gold/Silver/Bronze
  No Melon link → user remains Bronze (no fallback verification)
  Album serial verification → deferred to post-MVP (part of full 6-factor Fan Trust Score)

Booking Flow:
  [Book Now] → check tier → Fast Track (skip VQA) or Standard (VQA gate)
  → VQA: random 3 text-only questions from pool → evaluate answers → pass/fail
  → Queue: Redis ZADD with timestamp → WebSocket broadcast position every 10s
  → Seat Selection: user taps → Redis SETNX lock (3-min TTL) → confirm or expire
  → Payment: Toss API call → on success: release lock → write Ticket row → generate QR

Queue Metrics:
  Position = ZRANK in sorted set
  Wait time = (position - processed count) × avg processing time
  Probability = remaining seats / (current position + estimated new entries) × tier weight

Search:
  Query input → fuzzy match against artists (name, aliases) + events (title, venue) → ranked results → UI

Transfer:
  Seller: select ticket → set price (validated against 0.5x–1.5x bounds) → create Transfer listing
  Buyer: must hold active artist membership → browse listings → select → Toss escrow payment → funds held
  System: on payment confirmed → invalidate seller QR → generate new buyer QR → write new Ticket row → release payout to seller (price − fee)

Onboarding:
  Login/signup (social or email) → phone identity verification → CI hash check (duplicate? → block + show existing account)
  → terms agreement (required TOS + privacy, optional marketing)
  → signup complete → assign Bronze (Lv.1) → write User row (ci_hash, auth_provider, tier_id=1, is_marketing_agreed)
  → artist selection (write user_artist follows) → membership prompt → optional payment → optional tier verification → redirect to personalized Home
```

### 7.3 Outputs

| Destination | Data | Persistence |
|-------------|------|-------------|
| **UI (real-time)** | Queue position, seat map state, timer, VQA results | Ephemeral (WebSocket) |
| **Database (Supabase)** | User (incl. ci_hash, auth_provider, is_marketing_agreed), Membership, Ticket, Payment, TierVerification, Transfer, UserArtistFollow | Persistent |
| **Redis** | Queue entries, seat locks, VQA session state | TTL-based (minutes to hours) |
| **QR code** | Unique ticket identifier → rendered client-side | Stored as ticket metadata in DB |

---

## Assumptions (Labeled)

- **[A1]** Demo uses **mock Melon streaming data** for tier calculation. No real Melon OAuth integration needed. Users who don't "link Melon" (simulated) remain Bronze — no fallback verification path.
- **[A2]** Album serial verification is **deferred to post-MVP**. Production will include it as part of the full 6-factor Fan Trust Score (FTS): ticket activity 30%, streaming 20%, MD purchases 15%, platform activity 15%, fan behavior trust 10%, membership tenure 10%.
- **[A3]** Demo uses seed data for artists, events, and VQA questions — no admin CRUD panel needed.
- **[A4]** Toss Payments test mode is sufficient for demo. No real transactions.
- **[A5]** Queue and seat lock can be simulated with a small concurrent user count (50–100) for demo credibility.
- **[A6]** Seat maps reference real venues (15,000+ seats). Primary: SVG. Fallback: PNG image with clickable region overlays. Pre-built per venue, no dynamic generation.
- **[A7]** Search uses simple text matching (PostgreSQL full-text or ILIKE) against seed data. No external search engine needed for demo scale.
- **[A8]** Transfer market escrow uses Toss Payments test mode. Payout settlement is simulated (instant) rather than real T+N banking settlement.
- **[A9]** Onboarding flow: phone identity verification (CI) and terms agreement are mandatory; artist selection is required; membership payment and tier verification are skippable. CI duplicate check uses exact hash match. Phone verification provider integration is simulated with mock data for demo.
- **[A10]** **Desktop only.** No mobile responsive layout. GNB Sidebar layout + 2-Panel booking + standard desktop widths only.
- **[A11]** **Deliverable = interactive React prototype.** Working state transitions with mock data. Developers extend with real API integrations. This is NOT a static export.
- **[A12]** **Transfer market is a closed ecosystem.** Both seller and buyer must hold active artist membership. Non-members cannot access transfer listings.

---

*Design Reference: Suno AI layout + shadcn/ui component system — GNB Sidebar, card-based content, light mode, polished minimal UI, desktop only*
*Tech Stack: React 19 + Vite / Next.js 15 / Tailwind v4 + shadcn/ui / Supabase / Redis (Upstash) / Toss Payments / Vercel*
*Deliverable: Interactive React prototype with mock data — frontend publishing for developer handoff*
*Clarification Source: prd-clarification-session.md (10 questions, 2026-03-03)*
