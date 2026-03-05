# UX Brainstorming — URR (우르르)

> Version: v1.0 | Date: 2026-03-03 | Source PRD: prd.md (v1.1)

---

## 0. Inputs

**PRD**: `Docs/prd.md` v1.1 (Post-Clarification)
**Design Reference**: Suno AI layout (GNB Sidebar + content area) + shadcn/ui component system
**Mid-Fi Wireframe**: 2-Panel booking page with sidebar tab structure
**Mode**: Light mode, desktop only
**Deliverable**: Interactive React prototype with mock data

**Additional Notes**:
- Landing page is out of scope (provided separately by user)
- All external data (Melon, Toss, phone verification) is mock/simulated
- Mid-Fi wireframe is structural reference only — better UX directions encouraged

---

## 1. Feature Overview

### 1A. Global Layout & Navigation

**Feature Name**: GNB Sidebar + Content Area Layout
**Primary User Goal**: Navigate between Home, concerts, artists, and personal content with minimal friction.
**Success Criteria**: User can access any page within 2 clicks. Active context (which artist, which page) is always clear.
**Key Pain Points Solved**: K-POP fans follow multiple artists — navigation must handle multi-artist context without confusion.
**Primary Persona**: Fan club member following 2–5 artists, accessing booking/transfer for different artists in one session.

### 1B. Home Discovery

**Feature Name**: Home Page
**Primary User Goal**: See upcoming events for followed artists and discover trending concerts at a glance.
**Success Criteria**: User identifies the next bookable event within 5 seconds of landing on Home.
**Key Pain Points Solved**: Scattered event information across multiple fan cafes and ticketing platforms.
**Primary Persona**: Active fan checking "what's coming up" across their followed artists.

### 1C. Onboarding Flow

**Feature Name**: Signup → Identity Verification → Personalization
**Primary User Goal**: Go from zero to personalized Home with Bronze tier in under 3 minutes.
**Success Criteria**: Completion rate > 80%. User understands tier system value proposition before reaching Home.
**Key Pain Points Solved**: Account creation friction, bot prevention via CI verification, cold-start personalization.
**Primary Persona**: New user who heard about URR from a fan community, motivated to secure fair ticketing access.

### 1D. Artist Page

**Feature Name**: Artist Page (Home | Events | Transfer tabs)
**Primary User Goal**: View an artist's upcoming events, check booking status, and browse transfer listings.
**Success Criteria**: User can find and enter a bookable event within 3 clicks from artist page.
**Key Pain Points Solved**: Fragmented artist event information and separate resale platforms.
**Primary Persona**: Fan club member checking a specific artist's concert schedule and available transfers.

### 1E. 2-Panel Booking Flow

**Feature Name**: Event Booking (idle → VQA → Queue → Seats → Payment)
**Primary User Goal**: Secure concert tickets at face value during a narrow booking window.
**Success Criteria**: Diamond/Gold booking success rate > 60%. Full flow completes in under 5 minutes.
**Key Pain Points Solved**: Bot-dominated queues, opaque queue position, stressful multi-tab booking experience.
**Primary Persona**: Verified fan (any tier) entering a timed booking window under extreme time pressure.

### 1F. Transfer Market

**Feature Name**: Ticket Transfer (Seller Listing + Buyer Purchase)
**Primary User Goal**: Seller: recover value from unused tickets. Buyer: attend events missed during ticketing.
**Success Criteria**: Transfer completes within the platform. No need for external resale.
**Key Pain Points Solved**: Scalper-dominated resale markets, fraud risk in peer-to-peer transfers.
**Primary Persona**: Member who missed ticketing (buyer) or can no longer attend (seller).

### 1G. My Page

**Feature Name**: My Page (Membership | Ticket Wallet | Transfer History tabs)
**Primary User Goal**: Manage memberships, view/use QR tickets, and track transfer activity.
**Success Criteria**: User can find and display their QR ticket for venue entry within 10 seconds.
**Key Pain Points Solved**: Scattered ticket management across email confirmations and different apps.
**Primary Persona**: Fan heading to a concert venue needing quick access to their QR ticket.

### 1H. Search

**Feature Name**: Global Search
**Primary User Goal**: Find a specific artist or event by keyword.
**Success Criteria**: Relevant result appears in top 3 within 1 second of typing.
**Key Pain Points Solved**: Browsing-only discovery is slow when user knows what they want.
**Primary Persona**: User looking for a specific concert or checking if an artist is on the platform.

### 1I. Notification Page

**Feature Name**: Notification Page (UI Shell)
**Primary User Goal**: Review platform activity (booking opens, transfer updates, tier changes).
**Success Criteria**: User understands notification types and can identify unread items.
**Key Pain Points Solved**: Missing booking window openings, unaware of transfer status changes.
**Primary Persona**: Active member checking for booking schedule alerts.

---

## 2. UX Principles to Apply

### A. User-Centered Foundations
- **Job to be done**: Secure concert tickets fairly. Every UI element should serve this goal or get out of the way.
- **Mental model**: Fans think in terms of "my artists → upcoming events → booking." Navigation must mirror this hierarchy.
- **Progressive disclosure**: Booking flow complexity (VQA, queue, seats, payment) unfolds step-by-step. Never show all states at once.
- **Feedback & system status**: Queue position, seat availability, timer countdown — real-time feedback is critical in a time-pressured flow.
- **Error prevention**: Prevent accidental navigation away from booking. Warn before actions that lose queue position.

### B. Information & Interaction Design
- **Information architecture**: Artist-centric. Everything orbits around artists → events → tickets.
- **Hierarchy**: On booking page, the seat map and action buttons dominate. Event info supports but doesn't compete.
- **Affordances**: Clickable sections on seat map must look obviously interactive. Disabled states (sold-out sections, locked seats) must be visually distinct.
- **Consistency**: shadcn/ui components ensure consistent buttons, inputs, cards, modals across all pages.
- **Platform conventions**: Follows Korean ticketing platform patterns (Interpark, Yes24) — 2-panel booking, section → seat drill-down, timed seat lock.

### C. Process & Iteration
- Start with the booking flow (core product). Home/My Page/Search are supporting features.
- Design the smallest useful version — mock data, no real APIs, but full interaction paths.
- Iterate through the state machine first (idle → VQA → queue → seats → payment), then polish individual states.

### D. Accessibility & Inclusivity
- Color-coded seat map must include text labels (not color alone for status).
- Timer must show numerical countdown (not just a shrinking bar).
- VQA questions must be text-only with clear, tappable answer options.
- Error messages in Korean, human-readable, with clear recovery actions.

### E. Layout, Flow, and Spacing
- GNB Sidebar (left) + Content Area (right) is the persistent shell.
- Booking page: Left panel (event info, sticky, **collapsible** during booking to reduce distraction) + Right main (state machine, full height).
- Sidebar auto-collapses during booking to maximize seat map space. Left panel can also be minimized by user for full-width seat map focus.
- Generous whitespace on Home/Artist pages. Tighter spacing on booking page for information density.

### F. Edge, Loading & Empty States
- **Empty states**: New user with no followed artists → "Follow artists to see their events here."
- **Loading**: Skeleton UI for cards/lists. Seat map shimmer placeholder. Queue "Connecting..." spinner.
- **Offline**: Not applicable for demo, but queue WebSocket disconnect → auto-reconnect banner.
- **Power user**: Keyboard shortcuts for seat selection not in MVP, but consider for future.

### G. Readability & Content Strategy
- Microcopy guides actions: "Select a section on the map" → "Choose your seats (2:47 remaining)" → "Complete payment."
- Tier badge + emoji (💎🥇🥈🥉) used consistently as visual shorthand.
- Each booking state has ONE primary action. No competing CTAs.
- Prices always show ₩ format with tier fee breakdown.

### H. Performance & Perception
- Seat map must render instantly (< 1s). Use SVG with lazy loading for individual seat views.
- Queue updates every 10s — animate transitions between position numbers.
- Payment confirmation → immediate confetti + QR reveal (perceived instant success).
- Skeleton loading on all card-based pages (Home, Artist, Transfer, Search results).

---

## 3. User Journey Mapping

### Journey A: Booking Flow (Core Path)

#### Step 1: Entry Point
- User arrives from Home event card or Artist page > Events tab.
- **2-Panel layout loads**: Left panel (sticky event info, collapsible to minimize distraction during booking), Right main (idle state — section overview map + section list with prices/remaining seats).
- Sidebar is visible. Breadcrumb shows: Artist > Events > Event Name.
- [Book Now] button shows countdown timer if window not yet open, or is active if open.

#### Step 2: Task Execution
1. **[Book Now] clicked** → System checks tier.
   - Diamond/Gold: VQA skipped → queue entry directly.
   - Silver/Bronze: **VQA modal** opens over the page.
2. **VQA Modal** (Silver/Bronze only):
   - 3 text-only questions, 30s each, 4 answer options per question.
   - Progress indicator (1/3, 2/3, 3/3). Timer per question.
   - Pass (2/3) → modal closes, queue entry. Fail → retry prompt (max 2).
3. **Queue State**:
   - Sidebar auto-collapses. Seat map visible (read-only) with queue info overlay.
   - Displays: position (#47/1,200), estimated wait (2:15), success probability (92%).
   - Section-level remaining seats update in real-time on the map.
   - WebSocket updates every 10s with animated position transitions.
4. **Seat Selection State** (promoted from queue):
   - Seat map area: Section overview → user clicks section → **panel replaces** with grape-style individual seats.
   - "← Back to section overview" link at top.
   - Right section list area → transforms into: **selected seat info panel** (section, row, seat number, price) + **3-minute countdown timer** + **payment summary** + **[Pay Now] button**.
   - Max 4 seats selectable. Color-coded: green (available), blue (my pick), gray (taken), yellow (others' lock).
5. **Payment**:
   - [Pay Now] → Toss Payments modal/popup opens.
   - Amount: ticket price + tier-based fee. Breakdown visible.
   - On success → QR generated → confirmation screen.

#### Step 3: Completion / Exit
- **Success**: Confetti animation → QR code + event details displayed. "View in Ticket Wallet" link.
- **Seat timer expired**: Modal — "Time's up. Seats released." → [Return to section map] or [Leave booking].
- **Payment failed**: "Payment could not be completed. Seats held for 60 more seconds." → [Retry].
- **VQA failed (all retries)**: "Try again in the next booking window." → [Return to event page].

---

### Journey B: Onboarding Flow

#### Step 1: Entry Point
- User opens URR for the first time → redirected to login/signup page.
- Options: Kakao OAuth, Naver OAuth, Email signup.

#### Step 2: Task Execution
1. **Auth**: Social login tap or email + password.
2. **Phone identity verification** (all paths):
   - Carrier select → name, DOB, gender, phone number → [Send Code] → SMS code input (3-min timer).
   - CI hash check → duplicate = block + show existing account.
3. **Terms agreement**: "Agree to All" master checkbox + individual required/optional items.
4. **Signup complete** → Bronze (Lv.1) assigned.
5. **Artist selection**: Category tabs (보이그룹/걸그룹/솔로 etc.) + search bar + card grid. Select 1+.
6. **Membership intro**: Tier benefits visual comparison. [Join — ₩30K/year] or [Skip].
7. **Tier verification prompt** (if joined): [Link Melon] or [Later].
8. **Personalized Home** with followed artists and upcoming events.

#### Step 3: Completion / Exit
- **Success**: Personalized Home with tier badge (Bronze or higher). Target: < 3 minutes.
- **CI duplicate**: Popup with existing account info → redirect to login.
- **Skip all optional**: User lands on Home with Bronze tier, no membership, "Verify to unlock" CTA visible.

---

### Journey C: Transfer Market Flow

#### Step 1: Entry Point
- **Seller**: My Page > Ticket Wallet > select ticket > [List for Transfer].
- **Buyer**: Artist page > Transfer tab > browse card grid.

#### Step 2: Task Execution
**Seller**:
1. Select ticket → system shows recommended price (face ±10%) and bounds (0.5x–1.5x).
2. Set price (input within bounds). Fee preview by tier (5% or 10%).
3. Confirm → listing goes live on artist's Transfer tab.

**Buyer**:
1. Browse transfer card grid. Each card: concert name, section, seat(s), price, face-value %, seller tier badge.
2. Filter by date/price/section. Click card → detail view (seat location on map + seller info).
3. [Purchase] → Toss Payments escrow.
4. Ownership transfer: seller QR invalidated → new QR issued to buyer.

#### Step 3: Completion / Exit
- **Buyer success**: New QR in Ticket Wallet. "Ticket transferred!" confirmation.
- **Seller success**: Payout notification (price − fee).
- **Escrow failure**: "Transfer could not be completed. No charges made." Listing remains active.

---

## 4. UX Approaches

### Feature: 2-Panel Booking Flow

#### Approach 1: "Progressive Immersion"

**Core Idea**: The booking page starts as an informational overview and gradually becomes an immersive, focused experience as the user advances through states.

**Experience Flow**:
1. **idle**: Full layout visible — sidebar open, left panel shows complete event info, right main shows section overview + section price list. Feels like a product detail page.
2. **[Book Now] → VQA (if applicable)**: Modal overlay. Background dims. Quick 3-question gate. Feels like a checkpoint.
3. **Queue entry**: Sidebar auto-collapses. Seat map expands. Queue overlay appears on seat map with large position number + pulsing animation. Left panel stays sticky but feels secondary. Environment shifts to "waiting room."
4. **Seat selection**: Seat map replaces section overview with individual seats. Right panel becomes selection info + timer + payment. Timer creates urgency. Environment is fully focused — no distractions.
5. **Payment**: Toss Payments modal. Clean, standard checkout. On success → celebration (confetti + QR).

**Strengths**:
- Progressive disclosure: complexity unfolds naturally.
- Immersive when it matters: sidebar collapse + seat-focused layout during time-pressure states.
- Gentle transition: user isn't abruptly thrown into a different UI. States flow.
- Left panel (sticky, collapsible) provides persistent event context — user can minimize it during seat selection for maximum seat map space, reopen when needed for event details.

**Risks or Tradeoffs**:
- Multiple UI state changes in one page could confuse users unfamiliar with the flow.
- Sidebar collapse animation needs to be smooth; jarring transitions break immersion.
- Queue overlay on seat map could obscure section information if not carefully designed.

---

#### Approach 2: "Stadium Control Room"

**Core Idea**: Treat the booking page like a dashboard — all relevant information panels are visible simultaneously, and the user's focus naturally moves between panels as the state progresses.

**Experience Flow**:
1. **idle**: Three-zone layout — left (event info), center (seat map), right (section list/action panel). All visible.
2. **[Book Now] → VQA**: Modal overlay (same as Approach 1).
3. **Queue**: Center zone shows seat map with real-time occupancy. Right zone shows queue stats (position, wait, probability) in a compact card. Both visible simultaneously — user watches seats fill while waiting.
4. **Seat selection**: Center zone drills into individual seats. Right zone becomes seat selection summary + timer. Scrollable if needed.
5. **Payment**: Right zone transforms into payment summary. [Pay Now] triggers Toss modal.

**Strengths**:
- Information density: queue stats AND seat availability visible simultaneously.
- No major layout shifts — zones stay consistent, only content changes.
- "Control room" metaphor matches the high-stakes, time-sensitive nature of ticketing.
- Power users can process more information at once.

**Risks or Tradeoffs**:
- Higher cognitive load — three zones competing for attention.
- Less dramatic "immersion" effect. May feel more utilitarian than exciting.
- Right panel serving dual duty (section list → queue stats → seat summary) could be disorienting without clear transitions.

---

#### Approach 3: "Guided Funnel"

**Core Idea**: Each state completely owns the right panel. Clear step indicators show progress. The user is guided through a linear funnel with no ambiguity about what to do next.

**Experience Flow**:
1. **idle**: Left panel + right panel shows section overview with [Book Now] CTA prominently.
2. **[Book Now]**: Sidebar collapses. A horizontal **step indicator** appears at top of right panel: `VQA → Queue → Seats → Payment`. Diamond/Gold start at "Queue" step.
3. **VQA**: Full right panel = quiz interface. Clean, focused. Progress (1/3, 2/3). Step indicator shows "VQA" as active.
4. **Queue**: Full right panel = queue waiting screen (position, animation, probability). No seat map visible. Step indicator shows "Queue" as active.
5. **Seat selection**: Full right panel = section overview → individual seats. Timer prominent. Step "Seats" active.
6. **Payment**: Full right panel = order summary + [Pay]. Step "Payment" active. Toss modal for actual payment.

**Strengths**:
- Maximum clarity: one task per screen. Zero ambiguity.
- Step indicator provides complete flow awareness — user always knows where they are and what's next.
- Clean, uncluttered at every stage.
- Easiest to implement and test.

**Risks or Tradeoffs**:
- No seat map during queue = user can't see seats filling in real-time (less engagement during wait).
- Feels more transactional, less immersive.
- Step indicator may create anxiety ("4 steps to go") for time-pressured users.
- Full panel replacement per state = more drastic transitions.

---

### Feature: Home Page

#### Approach 1: "Event-First Feed"

**Core Idea**: Home is a vertical feed of event cards prioritized by relevance (upcoming bookings for followed artists first, then trending).

**Experience Flow**:
- Hero banner carousel (3–5 featured events) at top.
- "Upcoming for You" section: events from followed artists, sorted by booking window proximity.
- "Popular Artists" section: horizontal scroll of artist cards.
- "Trending Events" section: events with highest ticket demand.

**Strengths**: Immediately actionable. User sees "what to book next" without clicking into artist pages.

**Risks**: If user follows few artists, "Upcoming for You" may be sparse. Need strong empty/low-content state.

---

#### Approach 2: "Dashboard Overview"

**Core Idea**: Home is a dashboard with distinct card sections — a condensed view of everything the user cares about.

**Experience Flow**:
- Left column: "My Next Booking" card (countdown to next booking window) + "My Tickets" summary card (upcoming tickets count).
- Right column: Hero banner + "Popular Artists" grid + "Trending Events" cards.
- Compact, information-dense. One-glance overview.

**Strengths**: Personalized feel. User immediately sees their next action and their ticket status.

**Risks**: Dashboard density may feel overwhelming for casual users. More complex layout to implement.

---

### Feature: Transfer Market

#### Approach 1: "Marketplace Grid"

**Core Idea**: Transfer tab shows a filterable card grid, like a product listing page.

**Experience Flow**:
- Filter bar at top: date, section, price range, sort by.
- Card grid: each card shows concert poster (thumbnail), section, seat info, price, face-value %, seller tier badge, transaction count.
- Click card → detail modal or detail page with seat map location + purchase button.

**Strengths**: Familiar e-commerce pattern. Easy to scan and compare.

**Risks**: Card grid may not convey urgency (limited availability). Needs "X tickets remaining" indicators.

---

#### Approach 2: "Ticket Board"

**Core Idea**: Transfer tab shows listings grouped by event date, emphasizing availability urgency.

**Experience Flow**:
- Group by event date (closest first). Each date section shows listings as horizontal cards.
- Urgency indicators: "Only 3 transfers available" badge.
- Quick-buy button on each card (skips detail view for simple transactions).

**Strengths**: Date-grouped view matches how buyers think ("I want to go on Feb 22"). Urgency drives action.

**Risks**: Grouping may produce uneven sections (many listings for one date, few for another).

---

## 5. Summary and Direction

### Recommended Next Step

**Booking Flow**: **Approach 1 (Progressive Immersion)** — best balances immersion with information availability. The queue overlay on seat map keeps users engaged while waiting, and sidebar collapse creates natural focus. This aligns with the PRD's "immersive booking" requirement and leverages the 2-panel layout from the wireframe.

**Home Page**: **Approach 1 (Event-First Feed)** — simpler to implement, directly actionable, and aligns with the PRD's "Home discovery" definition (hero + artists + trending).

**Transfer Market**: **Approach 1 (Marketplace Grid)** — user confirmed card grid. Standard and effective.

### Validation Plan

1. **Prototype the booking flow first** — it's the core product. Build idle → VQA (modal) → queue (overlay) → seats (panel replace) → payment (Toss modal).
2. **Test the sidebar collapse transition** — must feel smooth and intentional, not jarring.
3. **Validate seat map interaction** — section click → individual seats must be responsive and intuitive.
4. **Test onboarding completion rate** — does the flow complete in under 3 minutes?
5. **Review transfer card design** — does the card convey enough information for a purchase decision?

### Open Questions (Remaining from Clarification Session)

1. **FTS threshold re-scaling for MVP**: How are Diamond/Gold/Silver thresholds mapped when only streaming data (20% weight) is available? (Needed for mock data generation.)
2. **Venue selection for seat map**: Which venue (KSPO Dome? Gocheok Dome? 잠실실내체육관?) for the demo seat map SVG?
3. **Seed data volume**: How many artists, events, and VQA questions for the demo?
4. **Mock Melon data structure**: What fields to simulate for streaming history?

---

## 6. UX Decisions Log (From Clarification Q&A)

| # | Decision | Source |
|---|----------|--------|
| 1 | GNB Sidebar: MY ARTISTS tree structure maintained | UX Q1 |
| 2 | Landing page: out of scope (user provides separately) | UX Q2 |
| 3 | VQA: modal overlay on booking page | UX Q3 |
| 4 | Queue: seat map (read-only) + queue info overlay | UX Q4 |
| 5 | Seat drill-down: full panel replace (section → individual seats) with back link | UX Q5 |
| 6 | Individual seat view: right panel becomes selected seat info + date/booking info + price + payment button | UX Q6 |
| 7 | My Page: 3 tabs (멤버십 \| 티켓 월렛 \| 양도 내역) with artist filtering | UX Q7 |
| 8 | Search: dedicated /search page | UX Q8 |
| 9 | Immersive booking: sidebar auto-collapses on [Book Now] (toggle to reopen) | UX Q9 |
| 10 | Seat selection timer: 3 minutes, displayed in right info panel | UX Q10–Q11 |
| 11 | Transfer tab: card grid layout | UX Q12 (Q11 in original) |
| 12 | Home: hero banner + trending events + popular artists (no "My Artists" — sidebar handles it) | UX Q12 |
| 13 | Onboarding artist selection: category tabs + search bar + card grid | UX Q13 |
| 14 | Artist page: internal tabs (홈 \| 공연 \| 양도), sidebar sub-items navigate to same page | UX Q14 |
| 15 | Booking Left Panel: sticky (fixed position), **collapsible during booking** (minimizes to reduce distraction, toggle to reopen) | UX Q15 + follow-up |

---

## Reference

**PRD**: `/Docs/prd.md` v1.1
**MVP PRD**: `/Docs/mvp.md`
**Clarification Session**: `/Docs/prd-clarification-session.md`
**Design Reference**: Suno AI (layout structure) + shadcn/ui (component system)
**Mid-Fi Wireframe**: 2-Panel booking page with sidebar (provided as screenshot)
**Constraints**: Desktop only, light mode, mock data, React prototype
