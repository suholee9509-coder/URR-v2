# UX Specification: URR (우르르)

> Source PRD: prd.md v1.1 | UX Brainstorming: ux-brainstorming.md | Date: 2026-03-03
> Deliverable: Interactive React prototype, desktop only, light mode, mock data

---

## Pass 1: Mental Model

### Primary User Intent

**"I want to get concert tickets at face value for artists I love, and the system should recognize and reward my dedication as a real fan."**

The user's core mental model is transactional fairness: they've paid for membership, they've proven their fandom, and they expect the system to give them a fair shot — not a lottery against bots.

### Likely Misconceptions

| # | Misconception | Reality | UX Correction |
|---|--------------|---------|---------------|
| M1 | "Higher tier = guaranteed ticket" | Higher tier = earlier access window + VQA skip. Not a guaranteed seat. Queue position still matters. | Show success **probability** (not certainty) in queue. Label tier benefit as "Priority Access" not "Guaranteed." |
| M2 | "VQA is a punishment for lower tiers" | VQA is anti-bot protection. Diamond/Gold earned VQA exemption through verified fandom. | Frame VQA as "Fan Verification" not "Quiz Gate." Celebrate pass with "Welcome, real fan!" |
| M3 | "Linking Melon is required to use the platform" | Melon linking is optional — it's the path to upgrade from Bronze. All tiers can book. | Make Melon linking a CTA ("Unlock higher tier") not a gate. Bronze users should feel included, not second-class. |
| M4 | "Transfer market is resale/scalping" | Transfer is a controlled, fair-price ecosystem. Price caps (0.5x–1.5x) prevent scalping. Both parties must be members. | Show "Official Transfer" branding with price-vs-face-value %. Distinguish from external resale via trust signals (seller tier badge, transaction count). |
| M5 | "All booking windows open at the same time" | Each tier has a separate window (Diamond first, then Gold +1h, Silver +2 days, Bronze +1h after Silver). | Display tier-specific booking schedule prominently. Show "Your window opens in..." countdown tied to user's tier. |
| M6 | "I can take my time selecting seats" | 3-minute lock timer. Auto-release if payment not completed. | Make timer unmissable (countdown in info panel). Show time running low with urgency indicators. |
| M7 | "Seat map colors are decoration" | Colors encode real-time availability status (green/blue/gray/yellow). | Include text legend for seat colors. Don't rely on color alone. |

### UX Principle to Reinforce

**Transparent fairness through visible system status.** At every stage — tier assignment, queue position, seat availability, price breakdown — the user should feel the system is being honest with them. Opacity breeds distrust; URR's differentiation IS transparency.

---

## Pass 2: Information Architecture

### All User-Visible Concepts

1. Artists (followed, popular, searchable)
2. Events (upcoming, past, bookable, sold-out)
3. Tiers (Diamond, Gold, Silver, Bronze) + badge
4. Membership (per artist, ₩30K/year, active/expired)
5. Booking windows (tier-specific schedules)
6. VQA quiz (3 questions, timer, score)
7. Queue (position, wait time, probability)
8. Seat map (sections, individual seats, availability status)
9. Seat lock (3-min timer, max 4 seats)
10. Payment (ticket price + tier fee + total)
11. QR ticket (unique ID, event details, wallet storage)
12. Transfer listing (price, section, seller info, face-value %)
13. Transfer escrow (funds held → ownership swap → payout)
14. Notifications (booking open, transfer update, tier change)
15. Search results (artists, events)
16. Onboarding steps (auth, identity, terms, artists, membership, verification)
17. User profile (name, email, tier, membership list)

### Grouped Structure

#### Navigation Shell
- **GNB Sidebar**: Primary (always visible)
  - Home, Events (global), Artists (global), Search, Notifications, My Page
  - MY ARTISTS section: tree structure (Artist → Home | Events | Transfer)
- **Top bar**: Secondary (breadcrumb + search icon + notification icon)
- Rationale: Sidebar provides persistent context for multi-artist navigation. Top bar adds quick access without leaving current page.

#### Discovery (Home + Search + Artist Page)
- Hero banner carousel: Primary
- Popular Artists: Primary
- Trending Events: Primary
- Search (dedicated /search page): Primary
- Artist page tabs (Home | Events | Transfer): Primary
- Event cards (poster, date, venue, status badge): Primary
- Rationale: Discovery is the entry funnel. Everything here drives toward booking or transfer.

#### Identity & Membership
- Tier badge (💎🥇🥈🥉): Primary (visible everywhere)
- Tier verification (Melon linking): Secondary (prompted, not required)
- Membership status (active/expired, per artist): Secondary (visible in My Page, sidebar)
- Onboarding (auth → CI → terms → artists → membership → verification): Primary (first-time only)
- Rationale: Tier is the platform's core identity signal. Verification is voluntary but incentivized.

#### Booking Flow (2-Panel)
- Left Panel (event info, sticky, collapsible): Primary
  - Poster, event name, venue, date dropdown, price table, tier booking schedule, user tier info, [Book Now] CTA
- Right Main — State machine: Primary
  - idle: Section overview + section price list
  - VQA: Modal overlay (3 text questions)
  - Queue: Seat map (read-only) + queue overlay (position, wait, probability)
  - Seats: Section → individual seats (panel replace) + selection info panel + timer + [Pay Now]
  - Payment: Toss Payments modal/popup
  - Confirmation: QR code + event details + "View in Ticket Wallet"
- Rationale: 2-Panel keeps context (left) while action progresses (right). States are mutually exclusive — user is always in exactly one state.

#### Post-Booking (My Page + Transfer)
- My Page tabs: Primary
  - Membership tab: artist memberships, tier badges, renewal dates
  - Ticket Wallet tab: upcoming + past tickets, QR display
  - Transfer History tab: sold + purchased listings, status
- Transfer Market (artist page > Transfer tab): Primary
  - Card grid: concert, section, seats, price, face-value %, seller tier, transactions
  - Detail view: seat location on map + seller info + [Purchase]
- Rationale: My Page is the post-booking hub. Transfer is artist-scoped (not a global marketplace).

#### System Feedback
- Notifications page (UI shell, mock data): Hidden (accessible but not pushed)
- Toast messages (tier verified, payment complete): Secondary (ephemeral)
- Error modals (seat expired, payment failed, VQA exhausted): Secondary (contextual)
- Rationale: Feedback is contextual and transient. Notification page exists for review but doesn't drive behavior in demo.

---

## Pass 3: Affordances

### Action Map

| Action | Element | Visual/Interaction Signal |
|--------|---------|---------------------------|
| Navigate to page | Sidebar menu item | Highlighted on hover, active state (background fill + bold text). Icon + label. |
| Expand/collapse artist sub-menu | Sidebar artist row chevron | Chevron rotates (▸ → ▾). Sub-items slide in/out. |
| Collapse sidebar | Sidebar toggle button | « icon at top of sidebar. Sidebar animates to icon-only mode. |
| Open event detail | Event card (Home, Artist page) | Card hover: subtle elevation/shadow. Cursor: pointer. Click → page navigation. |
| Select date | Date dropdown (booking left panel) | Dropdown chevron. Disabled dates are grayed + not clickable. Selected date highlighted. |
| Start booking | [Book Now] button | Primary filled button (accent color). Disabled state: grayed + countdown timer text. Enabled: full color. |
| Answer VQA question | Answer option card (VQA modal) | 4 cards with text. Hover: border highlight. Click: selected state (filled). Correct: green flash. Wrong: red shake. |
| Select section on map | Section polygon (seat map) | Hover: opacity increase + tooltip (section name + remaining count). Click: triggers drill-down. Sold-out sections: dimmed, cursor: not-allowed. |
| Select individual seat | Seat circle (grape view) | Available: green fill, hover: blue outline. Click: turns blue (selected). Gray: taken (no interaction). Yellow: others' lock (no interaction). |
| Deselect seat | Selected seat (blue circle) | Click again → reverts to green. Or click "×" in selection info panel. |
| Confirm payment | [Pay Now] button | Primary filled button. Disabled until ≥1 seat selected. Shows total price. Click → Toss Payments modal. |
| Collapse left panel | Left panel collapse toggle | « icon on panel edge. Panel slides to narrow strip (event name + tier badge only). Click to expand. |
| List ticket for transfer | [List for Transfer] button | Secondary button on ticket card in wallet. Only visible on transferable tickets. |
| Set transfer price | Price input field | Number input with ₩ prefix. System shows recommended range. Bounds enforced (red border if out of range). |
| Purchase transfer ticket | [Purchase] button | Primary button on transfer detail. Disabled if no active membership. Shows escrow notice. |
| Search | Search input | Magnifying glass icon. Focus: expands. Results appear below as-you-type. |
| Follow artist (onboarding) | Artist card | Unselected: outline. Selected: filled with checkmark. Tap toggles. |
| Agree to terms | Checkbox | Standard checkbox. "Agree to All" master checkbox controls sub-items. |

### Affordance Rules

- If it has a **filled accent-color background**, it's a primary action (commit).
- If it has an **outline/border**, it's a secondary action (optional, cancel, skip).
- If it's **grayed out**, it's disabled — the user cannot interact (show why via tooltip or adjacent text).
- If it **changes color on hover**, it's interactive.
- **SVG map elements** with hover effects (opacity, tooltip) are clickable sections/seats.
- **Cards with elevation on hover** are navigable (click to go somewhere).
- **Countdown timers** are read-only indicators, not interactive.
- **Badges** (tier emoji) are read-only identity signals — never clickable.

---

## Pass 4: Cognitive Load

### Friction Points

| # | Moment | Type | Location | Simplification |
|---|--------|------|----------|----------------|
| F1 | Which date to book? | Choice | Booking left panel date dropdown | Default to earliest available date. Only bookable dates are selectable. Show remaining seats per date. |
| F2 | Should I link Melon? | Choice | Onboarding step 7 / My Page | Show concrete benefit: "Link Melon to check if you qualify for Diamond tier." [Later] is always available. No pressure. |
| F3 | Which section to pick? | Choice | Seat map (section overview) | Color-code by availability (green = many, orange = few, red = almost sold out). Show remaining count on each section. Sort right-side list by availability. |
| F4 | Which specific seats? | Choice | Seat map (grape view) | Highlight best available cluster. Show adjacent seat suggestions. Max 4 seats limit is pre-stated. |
| F5 | Am I going to get tickets? | Uncertainty | Queue state | Show **probability percentage** + position + estimated wait. Update every 10s. Probability < 20% → suggest Transfer tab as backup. |
| F6 | Is my payment going through? | Waiting | Payment (Toss modal) | Show "Processing..." spinner. On success: instant celebration (confetti + QR). On failure: immediate error with retry. No ambiguous states. |
| F7 | VQA — what if I fail? | Uncertainty | VQA modal | Show retry count upfront: "3 questions. 2 retries if you fail." Show progress (1/3, 2/3, 3/3). Per-question timer visible. |
| F8 | What does each tier get? | Uncertainty | Onboarding membership intro / event page | Visual comparison table: tier name, badge, booking window, fee, VQA status. Always accessible. |
| F9 | Is this transfer price fair? | Choice | Transfer listing (buyer) | Show face-value comparison %. Green: ≤100%, Yellow: 101-130%, Red: >130% (flagged). Seller tier badge builds trust. |
| F10 | Phone verification — why? | Uncertainty | Onboarding step 2 | Show brief explanation: "1인 1계정 인증으로 봇과 매크로를 방지합니다." Keep it to one line. |
| F11 | What artist to follow? | Choice | Onboarding artist selection | Category tabs narrow choices. Search bar for direct lookup. Show popular artists first. Minimum 1 required — CTA says "1명 이상 선택해주세요." |
| F12 | Timer running out during seats | Urgency | Seat selection timer | Timer changes color at 1:00 (yellow) and 0:30 (red). Sub-30s: subtle pulse animation. But no audio or full-screen alert — reduce panic while maintaining urgency. |

### Defaults Introduced

| Default | Rationale |
|---------|-----------|
| Date: earliest bookable date pre-selected | Most users want the soonest show. Reduces one decision. |
| Tier: Bronze assigned on signup | No action required. User starts participating immediately. |
| Onboarding: membership skippable | Don't gate platform exploration behind payment. Let user see value first. |
| Transfer price: face value pre-filled | Reduces pricing friction. User can adjust within bounds. |
| Terms: "Agree to All" as first option | One-tap completion for majority who agree. Individual checkboxes still visible for granularity. |
| Booking window: user's tier schedule shown first | Don't make user search for their schedule among 4 tiers. Highlight "Your window." |

---

## Pass 5: State Design

### Booking Right Main (State Machine)

| State | User Sees | User Understands | User Can Do |
|-------|-----------|------------------|-------------|
| **idle** | Section overview map + section price/remaining list + [Book Now] (disabled/countdown or active) | "This is the event. Booking opens at [time]. I can see available sections." | Browse sections (read-only), select date, wait for window, click [Book Now] |
| **idle (window open)** | Same + [Book Now] active (accent color) | "Booking is open now. I can start." | Click [Book Now] |
| **vqa (modal)** | Modal overlay: question text + 4 answer options + progress (1/3) + 30s timer | "I need to prove I'm a real fan. 3 questions, 30 seconds each." | Select answer, wait for next question |
| **vqa-pass** | Modal: "Welcome, real fan!" + transition to queue | "I passed! Entering the queue." | Wait (auto-transition) |
| **vqa-fail** | Modal: "Incorrect. [N] retries remaining." + [Retry] / [Leave] | "I failed. I have [N] chances left." | Retry quiz or leave booking |
| **vqa-exhausted** | Modal: "All attempts used. Try next booking window." + [Return to Event] | "I can't book this time." | Return to event page |
| **queue** | Seat map (read-only, sections with real-time counts) + queue overlay (position #, wait time, probability %) | "I'm in line. [N] people ahead of me. [X]% chance of success." | Wait (auto-promoted when front reached). Sidebar collapsed. |
| **queue (sold out)** | Queue overlay: probability 0%, "Sold Out" label | "No seats left. I didn't make it." | [Leave] or stay in queue (cancellations may open seats) |
| **seats-section** | Section overview map (interactive, clickable sections) + right panel: section list with remaining counts | "I can now pick a section. Timer hasn't started yet." | Click a section to drill in |
| **seats-individual** | Grape-style seat map for selected section + right panel: selection info + 3-min timer + price summary + [Pay Now] | "I'm selecting seats. I have [MM:SS] left. Selected [N] seats for ₩[total]." | Tap seats (max 4), deselect, go back to sections, click [Pay Now] |
| **seats-expired** | Modal: "Time's up. Seats released." + [Return to section map] / [Leave] | "I took too long. My seats are gone." | Try section selection again or leave |
| **payment** | Toss Payments modal/popup (external) | "I'm paying. Standard checkout flow." | Complete payment or cancel |
| **confirmation** | QR code + event details + "Saved to Ticket Wallet" + [View in Wallet] | "I got my ticket! Here's my QR code." | View wallet, share, go home |
| **payment-failed** | Error: "Payment failed. Seats held for 60s." + [Retry] + countdown | "Something went wrong but I still have time." | Retry payment within 60s |

### VQA Modal

| State | User Sees | User Understands | User Can Do |
|-------|-----------|------------------|-------------|
| **question** | Question text + 4 text options + timer (30s) + progress (N/3) | "Answer this fan question in 30 seconds." | Tap one of 4 options |
| **correct** | Option turns green + "Correct!" indicator | "I got it right." | Wait for next question (auto-advance) |
| **incorrect** | Option turns red + shake + correct answer highlighted | "I got it wrong." | Wait for next question (auto-advance) |
| **timeout** | Timer hits 0 → treated as incorrect | "I ran out of time on this question." | Wait for next question (auto-advance) |

### Home Page

| State | User Sees | User Understands | User Can Do |
|-------|-----------|------------------|-------------|
| **loading** | Skeleton cards (hero banner shimmer + event card placeholders) | "Page is loading." | Wait |
| **populated** | Hero banner + Popular Artists + Trending Events | "Here's what's happening on the platform." | Browse events, click cards, search |
| **empty (no follows)** | Hero banner + Popular Artists + "Follow artists to see personalized events" CTA | "I need to follow artists to get recommendations." | Browse popular artists, click to follow |

### My Page — Ticket Wallet Tab

| State | User Sees | User Understands | User Can Do |
|-------|-----------|------------------|-------------|
| **loading** | Skeleton cards | "Loading my tickets." | Wait |
| **has tickets** | Ticket cards (upcoming first, then past). Each: event name, date, venue, section, seat, QR expand button, [List for Transfer] if eligible | "Here are my tickets. I can view QR or list for transfer." | Expand QR, list for transfer, view past tickets |
| **no tickets** | "No tickets yet. Browse upcoming events!" + [Explore Events] | "I haven't booked anything." | Navigate to discover events |
| **QR expanded** | Full-screen QR code overlay + event details | "This is my entry pass." | Close overlay, screenshot QR |

### Transfer Listing (Seller)

| State | User Sees | User Understands | User Can Do |
|-------|-----------|------------------|-------------|
| **price-input** | Recommended price, bounds (0.5x–1.5x), fee preview by tier, price input | "I need to set a price within the allowed range." | Enter price, see fee breakdown, confirm |
| **confirming** | Price + fee + net payout summary + [Confirm Listing] | "This is what I'll receive after fees." | Confirm or go back |
| **listed** | "Your ticket is now listed on [Artist]'s Transfer tab." + [View Listing] | "It's live. Buyers can now see it." | View listing, edit price, delist |
| **sold** | "Your ticket has been sold! Payout: ₩[amount]" | "Someone bought it. I'm getting paid." | View transfer history |

### Transfer Detail (Buyer)

| State | User Sees | User Understands | User Can Do |
|-------|-----------|------------------|-------------|
| **browsing** | Card grid: event, section, seats, price, face-value %, seller badge | "These are available transfers for this artist." | Filter, sort, click card |
| **detail** | Seat location on map + seller tier + transaction count + price breakdown + [Purchase] | "This is the specific ticket. The seller is verified." | Purchase or go back |
| **no-membership** | [Purchase] disabled + "Active membership required" notice | "I need a membership to buy transfer tickets." | Navigate to join membership |
| **escrow-processing** | "Processing transfer..." spinner | "Payment is being held while ownership transfers." | Wait |
| **complete** | "Ticket transferred! New QR in your wallet." + [View Ticket] | "I got the ticket!" | View in wallet |

### Search Page

| State | User Sees | User Understands | User Can Do |
|-------|-----------|------------------|-------------|
| **empty** | Search input + trending/recent searches | "I can search for artists or events." | Type query |
| **typing** | Input with text + instant results grouped (Artists / Events) | "Results are appearing as I type." | Click result, modify query |
| **no-results** | "No results found for '[query]'. Try a different keyword." | "Nothing matches my search." | Modify query, browse suggested |
| **results** | Grouped sections: Artists (avatar + name + follower count) + Events (poster + name + date + status) | "Here are matching artists and events." | Click to navigate to artist/event |

### Onboarding

| State | User Sees | User Understands | User Can Do |
|-------|-----------|------------------|-------------|
| **auth** | Login/signup screen: Kakao, Naver, Email options | "I need to create an account or log in." | Tap social login or email signup |
| **identity** | Phone verification form: carrier, name, DOB, phone, [Send Code] | "I need to verify my identity (1인 1계정)." | Fill form, send code, enter code |
| **identity-duplicate** | Popup: "Account exists (signed up via: Kakao)" | "I already have an account." | Go to login |
| **identity-code-sent** | Code input + 3-min timer + [Resend Code] (disabled until timer ends) | "Code sent. I have 3 minutes." | Enter code |
| **terms** | Checkbox list: Agree All, TOS, Privacy, Marketing | "I need to agree to terms." | Check boxes, proceed |
| **artist-selection** | Category tabs + search + artist card grid | "I pick artists I like." | Select 1+, search, browse categories |
| **membership-intro** | Tier comparison visual + [Join ₩30K/year] / [Skip] | "I can pay for membership or skip for now." | Join or skip |
| **tier-verification** | [Link Melon] / [Later] | "I can verify my fan level or do it later." | Link or skip |
| **complete** | Redirect to personalized Home | "I'm in! Here's my Home." | Explore platform |

### Notification Page

| State | User Sees | User Understands | User Can Do |
|-------|-----------|------------------|-------------|
| **populated (mock)** | List of notification cards: icon + title + description + timestamp. Types: booking open, transfer complete, tier upgrade, etc. Unread: bold/dot indicator. | "These are things that happened on the platform." | Read notifications, click to navigate to related page |
| **empty** | "No notifications yet." | "Nothing to see." | Wait |

---

## Pass 6: Flow Integrity

### Flow Risks

| # | Risk | Where | Mitigation |
|---|------|-------|------------|
| R1 | User navigates away during queue, loses position | Queue state | Warn on navigation attempt: "Leaving will forfeit your queue position. Are you sure?" Sidebar collapsed to reduce accidental navigation. |
| R2 | User doesn't notice timer during seat selection | Seats-individual state | Timer in right info panel, visible without scrolling. Color changes at 1:00 (yellow) and 0:30 (red). |
| R3 | User selects wrong date, books wrong show | Booking left panel | Show selected date prominently in left panel AND in payment summary. Require no separate date confirmation since it's pre-selected. |
| R4 | User can't find their QR ticket at venue entrance | My Page > Ticket Wallet | QR expand button is the largest tap target on the ticket card. Full-screen overlay for easy scanning. |
| R5 | New user abandons during phone verification | Onboarding identity step | Show "왜 필요한가요?" explanation tooltip. Keep form minimal. "Almost done!" progress indicator. |
| R6 | User sets transfer price too high and gets flagged | Transfer listing | Pre-fill face value. Show "Recommended range" visually. >1.3x shows warning: "Listings above 130% face value are flagged for review." |
| R7 | Buyer discovers they need membership AFTER finding a transfer ticket | Transfer detail view | Show membership requirement early: on Transfer tab header "멤버십 회원 전용" label. On card hover if not a member: "[Join Membership] to purchase." |
| R8 | VQA feels punishing rather than fun | VQA modal | Fan-positive framing: "Fan Verification" title. Celebratory pass message. Questions should feel like trivia, not an exam. |
| R9 | User doesn't understand tier booking windows | Event page, idle state | Show all 4 tier windows in left panel as a visual timeline. Highlight "Your tier" row. "Opens in [countdown]" tied to user's specific tier. |
| R10 | Sidebar tree gets long with many followed artists | Sidebar MY ARTISTS section | Limit visible artists to 5, then "Show more" toggle. Currently active artist always visible at top. |
| R11 | First-time user doesn't know what "idle" state means on booking page | idle state | Contextual microcopy: "Select a date and wait for your booking window to open." Clear countdown on [Book Now] button. |
| R12 | User accidentally closes browser during payment | Payment state | On return: detect pending booking state. If seat lock still active, resume payment. If expired, show "Session expired" message. |

### Visibility Decisions

**Must be visible (at all times during relevant context):**
- Tier badge (everywhere)
- Queue position + probability (queue state)
- Seat selection timer countdown (seats-individual state)
- Price breakdown: ticket price + tier fee = total (seats + payment)
- Selected date (booking left panel)
- Remaining seat count per section (idle + queue states)
- User's tier-specific booking window countdown (idle state)

**Can be implied (shown on demand or progressively):**
- Full tier comparison table (available on hover/click, not always shown)
- Transfer fee structure (shown during listing flow, not on browse)
- Seat legend (color meanings — shown as collapsible legend, not permanent overlay)
- Past booking history (in My Page, not on Home)
- Notification count (badge on icon, details on click)
- Onboarding progress (implied by step sequence, no explicit "step 3 of 7" unless needed)

### UX Constraints for Visual Phase

1. **One primary action per state.** Booking state machine must have exactly one CTA button active at a time (Book Now → Answer → Wait → Pay Now).
2. **No horizontal scrolling.** All content fits within desktop viewport width. Seat map uses zoom/pan instead.
3. **Sidebar collapse animation < 300ms.** Must feel instant, not sluggish.
4. **Left panel collapse animation < 200ms.** Quick toggle, no elaborate transitions.
5. **VQA modal must block background interaction.** Backdrop overlay prevents accidental seat map clicks.
6. **Queue overlay must not obscure section labels on seat map.** Position info in a semi-transparent card, not full-screen overlay.
7. **Timer countdown must use monospace font.** Prevents digit-width jitter during countdown.
8. **All prices in ₩ Korean won format with comma thousands separator.** ₩165,000 not ₩165000.
9. **Tier badge emoji must accompany tier text label.** Never emoji alone (accessibility).
10. **Toast notifications auto-dismiss after 5 seconds.** No manual close required (but close button available).
11. **All modals closable via Escape key and backdrop click** (except VQA during active question and payment).
12. **Card hover states: elevation change + subtle border.** No drastic color changes that look like selection.

---

## Visual Specifications

> All 6 passes complete. Visual specifications are informed by the foundational analysis above.

### Global Layout

```
┌──────────────────────────────────────────────────────────────┐
│  GNB Sidebar (240px)  │  Main Content Area (remaining)       │
│  ┌──────────────────┐ │  ┌──────────────────────────────────┐│
│  │ URR Logo         │ │  │ Top Bar (breadcrumb + search     ││
│  │ [Membership CTA] │ │  │  + notification icon)            ││
│  │                  │ │  ├──────────────────────────────────┤│
│  │ 홈               │ │  │                                  ││
│  │ 공연             │ │  │  Page Content                    ││
│  │ 아티스트         │ │  │  (varies by route)               ││
│  │                  │ │  │                                  ││
│  │ MY ARTISTS       │ │  │                                  ││
│  │  ▾ G-Dragon      │ │  │                                  ││
│  │    아티스트 홈   │ │  │                                  ││
│  │    공연          │ │  │                                  ││
│  │    양도  Lv.2    │ │  │                                  ││
│  │  ▸ BTS           │ │  │                                  ││
│  │  ▸ aespa         │ │  │                                  ││
│  │                  │ │  │                                  ││
│  │ ─────────────── │ │  │                                  ││
│  │ 👤 User Profile  │ │  │                                  ││
│  └──────────────────┘ │  └──────────────────────────────────┘│
└──────────────────────────────────────────────────────────────┘
```

- **Sidebar width**: 240px expanded, 64px collapsed (icon-only)
- **Sidebar collapse**: Toggle button (« / ») at top. Auto-collapses on booking [Book Now].
- **MY ARTISTS**: Accordion tree. Max 5 visible; "Show more" if >5. Active artist expanded, others collapsed.
- **User profile**: Bottom of sidebar. Avatar + name + email.
- **Top bar height**: 56px. Breadcrumb (left), search icon + notification bell (right).

### Booking Page Layout (2-Panel)

```
┌──────────────────────────────────────────────────────────────┐
│ Sidebar │ Left Panel (360px, collapsible) │ Right Main       │
│ (64px   │ ┌────────────────────────────┐  │ ┌──────────────┐│
│  when   │ │ [Poster Image]             │  │ │              ││
│  collapsed)│ │ Artist > Events > Title    │  │ │  Seat Map    ││
│         │ │ 공연명: DETOX ASIA TOUR    │  │ │  (Section    ││
│         │ │ 장소: 잠실실내체육관       │  │ │   overview)  ││
│         │ │                            │  │ │              ││
│         │ │ [Date Dropdown]            │  │ │              ││
│         │ │                            │  │ ├──────────────┤│
│         │ │ 좌석/가격 테이블           │  │ │ Section List ││
│         │ │                            │  │ │ or           ││
│         │ │ 등급별 예매 일정           │  │ │ Selection    ││
│         │ │ 💎 Diamond — Opens in 8:42 │  │ │ Info Panel   ││
│         │ │ 🥇 Gold    — 09:00         │  │ │ + Timer      ││
│         │ │ 🥈 Silver  — Mar 5         │  │ │ + [Pay Now]  ││
│         │ │ 🥉 Bronze  — Mar 5 10:00   │  │ │              ││
│         │ │                            │  │ │              ││
│         │ │ 내 등급: 💎 Diamond        │  │ │              ││
│         │ │                            │  │ │              ││
│         │ │ [Book Now] or countdown    │  │ │              ││
│         │ └────────────────────────────┘  │ └──────────────┘│
└──────────────────────────────────────────────────────────────┘
```

- **Left Panel width**: 360px (expanded), ~48px collapsed (event name strip + toggle)
- **Left Panel**: Sticky position. Collapse toggle (« icon on right edge).
- **Right Main**: Fills remaining width. Two zones:
  - Upper: Seat map area (flexible height)
  - Lower: Section list (idle/queue) → Selection info panel (seats)
- **During immersive booking** (queue/seats/payment): Sidebar = 64px (collapsed), Left Panel = collapsible. Maximum space for seat map.

### Page-by-Page Specs

#### Home Page
- **Hero banner**: Full-width carousel (3-5 events). Auto-rotate 5s. Dots indicator. Click → event page.
- **Popular Artists**: Horizontal scroll of artist cards (avatar + name + follower count). Click → artist page.
- **Trending Events**: Vertical card list (poster thumbnail + event name + date + venue + status badge). Click → event page.
- **Layout**: Single column within content area, max-width 1200px centered.

#### Artist Page
- **Header**: Artist banner image + name + follower count + membership status badge.
- **Tabs**: 홈 | 공연 | 양도 (underline indicator for active tab).
- **홈 tab**: Artist info summary + next upcoming event card + membership CTA.
- **공연 tab**: Event cards (poster + date + venue + booking status badge). Upcoming first, past below.
- **양도 tab**: Filter bar (date, section, price, sort) + card grid (2-3 columns).

#### My Page
- **Tabs**: 멤버십 | 티켓 월렛 | 양도 내역 (3 tabs).
- **멤버십**: Artist membership cards (artist avatar + name + tier badge + renewal date + [Manage]).
- **티켓 월렛**: Ticket cards. Upcoming: event name + date + venue + section/seat + [QR] + [Transfer]. Past: same but grayed, no actions.
- **양도 내역**: Two sub-sections (sold / purchased). Status badge on each (listed / sold / completed / cancelled).

#### Search Page
- **Search input**: Top of page, full-width, autofocus.
- **Results**: Two sections — "Artists" (avatar + name + follower count) + "Events" (poster + name + date + venue).
- **Empty state**: Trending searches as tag chips.

#### Onboarding (Full-screen, no sidebar)
- **Auth**: Centered card. Social login buttons (Kakao yellow, Naver green) + email option.
- **Identity verification**: Form card. Step progress indicator at top.
- **Terms**: Checkbox list card. [Continue] button disabled until required items checked.
- **Artist selection**: Full-screen grid. Category tabs at top. Search bar. Cards with selection state.
- **Membership intro**: Split layout — left: tier comparison visual, right: CTA + skip.
- **Complete**: Transition animation to personalized Home.

#### Notification Page
- **List**: Vertical notification cards. Icon (type) + title + description + timestamp.
- **Unread indicator**: Blue dot or bold text.
- **Click**: Navigates to related page (event, transfer, tier verification).

### Interaction Specs

| Interaction | Animation | Duration |
|------------|-----------|----------|
| Sidebar collapse/expand | Slide left/right | 250ms ease-out |
| Left panel collapse/expand | Slide left/right | 200ms ease-out |
| Page navigation | Content fade-in | 150ms |
| Modal open | Fade + scale from 95% to 100% | 200ms ease-out |
| Modal close | Fade + scale to 95% | 150ms ease-in |
| VQA correct answer | Green flash on selected option | 300ms |
| VQA incorrect answer | Red flash + horizontal shake (3px, 3 cycles) | 400ms |
| Queue position update | Number counter animation (roll) | 500ms |
| Seat hover | Border highlight + tooltip fade-in | 100ms |
| Seat selection | Fill color transition (green → blue) | 150ms |
| Timer color change (1:00) | Smooth color transition to yellow | 300ms |
| Timer color change (0:30) | Smooth color transition to red + subtle pulse | 300ms + 1s loop |
| Payment success | Confetti particle animation + QR slide-up | 800ms |
| Toast notification | Slide in from top-right + auto-dismiss | 300ms in, 5s visible, 200ms out |
| Card hover | Box-shadow increase + 1px translateY | 150ms |
| Skeleton loading | Shimmer gradient animation | 1.5s loop |

### Component System (shadcn/ui based)

| Component | Usage | Variant Notes |
|-----------|-------|---------------|
| Button | CTAs, actions | Primary (filled accent), Secondary (outline), Destructive (red), Ghost (text-only) |
| Card | Event, artist, ticket, transfer, notification | Hover: elevation. Click: navigation or expand. |
| Dialog/Modal | VQA, seat expired, payment failed, transfer confirm | Centered overlay with backdrop. Close via X, Esc, backdrop (context-dependent). |
| Dropdown | Date selection, filters | Standard shadcn Select. Disabled options grayed. |
| Input | Search, price, verification code, email/password | With label, placeholder, validation state (error border + message). |
| Checkbox | Terms agreement, filters | Standard + "Check All" variant for terms. |
| Badge | Tier, booking status, notification count, transfer status | Tier: emoji + text. Status: colored dot + text. |
| Tabs | Artist page, My Page | Underline active indicator. |
| Toast | Success, error, info notifications | Top-right stack. Auto-dismiss 5s. |
| Tooltip | Seat map hover, tier info, price explanation | Delay 300ms. Position: auto (avoid edge clipping). |
| Progress | VQA (1/3), onboarding steps, timer bar | Linear bar or step dots. |
| Skeleton | Loading states for all cards/lists | Shimmer animation matching card dimensions. |
| Avatar | User profile, artist cards, seller info | Circle with image or initials fallback. |

---

## Source References

- **PRD**: `Docs/prd.md` v1.1 (Post-Clarification)
- **MVP PRD**: `Docs/mvp.md`
- **UX Brainstorming**: `Docs/ux-brainstorming.md`
- **Clarification Session**: `Docs/prd-clarification-session.md`
- **Design Reference**: Suno AI (layout) + shadcn/ui (components)
- **Constraints**: Desktop only, light mode, mock data, React prototype
