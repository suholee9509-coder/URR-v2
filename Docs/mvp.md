# URR — MVP PRD

> Version: v1.0 | Date: 2026-03-03 | Status: MVP Scope Locked

---

## 1. Executive Summary

**Elevator Pitch**: A fan membership platform that blocks bots via tier-based verification and guarantees fair concert ticket access for real fans.

**Problem Statement**: Loyal K-POP fans who pay for official fan club memberships (₩30K/year) still fail repeatedly at ticketing — queue numbers reach 30,000+ due to bots and resellers. Pre-sale pools alone sell out entire venues, pushing failed fans into resale markets at 2–3x markup. Existing platforms only manage the "moment of purchase" with no mechanism to distinguish real fans from scalpers.

**Target User**: Official fan club members (₩30K/year), attempting ticketing 2–3 times/month. Mobile-first users who repeatedly fail to purchase at face value despite active membership.

**Proposed Solution**: A 4-tier fan verification system (streaming/album-based) combined with VQA (Visual Question Authentication) bot prevention, integrated into a single ticketing platform. Higher tiers get earlier access; quizzes filter out automation.

**MVP Success Metric**: Diamond/Gold member booking success rate > 60% (existing platforms < 20%)

---

## 2. Key Features (Max 3)

### Feature 1: Fan Membership & Tier Verification

**User Story**: As a loyal fan, I want to verify my tier using my streaming history or album purchases, so that I can receive booking priority and benefits matching my dedication.

**Acceptance Criteria**:
- Given a user completes Kakao social login, when they link Melon or enter an album serial number, then the system assigns a tier (Diamond/Gold/Silver/Bronze) and grants the badge immediately.
- Given a user skips verification, when they only complete membership payment, then they receive Bronze (default) and can participate in booking.

**Tier Structure**:

| Tier | Booking Window | Fee | Ticketing Path |
|------|---------------|-----|----------------|
| 💎 Diamond | Pre-pre-sale 1 (highest priority) | +₩1K / transfer 5% | Fast Track (VQA exempt) |
| 🥇 Gold | Pre-pre-sale 2 (+1h) | +₩2K / transfer 5% | Fast Track (VQA exempt) |
| 🥈 Silver | Pre-sale 1 (+2 days) | +₩3K / transfer 10% | Standard Path (VQA required) |
| 🥉 Bronze | Pre-sale 2 (+1h) | +₩4K / transfer 10% | Standard Path (VQA required) |

**Priority**: P0 — The tier system IS the product. Without it, there's no differentiation from existing platforms.

**Dependencies / Risks**:
- Melon API OAuth scope access required. Fallback: screenshot-based manual verification.
- No album serial verification DB exists. Fallback: purchase receipt for temporary verification → 14-day window for physical serial.

---

### Feature 2: Ticketing System (2-Panel Booking)

**User Story**: As a membership fan, I want to browse event details and select seats on a single page, so that I can complete my booking quickly without page transitions.

**Acceptance Criteria**:
- Given the booking window opens, when a user clicks [Book Now], then the system routes them to queue or VQA based on their tier path (Fast Track / Standard).
- Given a user enters seat selection, when they pick a section → individual seats, then a 3-minute timer starts with a max of 4 seats before proceeding to payment.

**2-Panel Layout** (Desktop):
- **Left Panel (fixed)**: Poster + event name + date dropdown + seat/price table + tier-specific booking schedule + my tier info
- **Right Main (state machine)**: `idle` → `vqa` → `queue` → `seats` → `payment`

**Right Main State Flow**:

| State | Content |
|-------|---------|
| idle | Section layout preview (remaining seats) + [Book Now] CTA |
| vqa | Quiz (Silver/Bronze only) |
| queue | Queue (position + estimated wait + success probability, 10s WebSocket refresh) |
| seats | Section select → grape-style seat map (3-min timer, max 4 seats) |
| payment | Toss Payments → QR issuance + ticket wallet save |

**Priority**: P0 — Ticket purchase is the core action. No product validation without this flow.

**Dependencies / Risks**:
- 10,000+ concurrent queue handling: Redis sorted set + WebSocket.
- Seat lock conflicts: Redis distributed lock (3-min TTL) + DB unique constraint.

---

### Feature 3: VQA (Visual Question Authentication)

**User Story**: As a platform operator, I want to present artist-knowledge quizzes at booking entry, so that bots are blocked and only real fans enter the queue.

**Acceptance Criteria**:
- Given a Silver/Bronze member clicks [Book Now], when they answer 2+ out of 3 questions correctly, then queue entry is granted.
- Given a Diamond/Gold member clicks [Book Now], when the system detects their tier, then VQA is skipped and they enter the queue immediately.

**Quiz Rules**:
- Pool of 50+ questions per artist → 3 random questions → 30s per question → 2/3 correct to pass
- Max 2 retries; failure ends booking attempt for that session
- Question types: stage photo recognition, video clip questions, contextual questions, lyrics completion

**Priority**: P0 — Bot prevention is the platform's reason for existence. Differentiated security layer vs. CAPTCHA.

**Dependencies / Risks**:
- Minimum 50 questions per artist required. Initial sourcing via manual curation.
- Human farm (proxy test-taking) risk. MVP relies on tier + VQA dual-layer defense.

---

## 3. Requirements Overview

### Functional (Core Flows)
- **Auth**: Kakao/Naver OAuth → Supabase Auth
- **Membership payment**: Toss Payments integration (₩30K/year, per artist)
- **Tier verification**: Melon OAuth linking or album serial input → tier assignment
- **Event discovery**: Home discovery (banners + artist list + trending events) → artist page → events tab
- **Booking flow**: 2-Panel → VQA branch → queue → seat selection → payment → QR issuance
- **Queue**: Redis sorted set, WebSocket 10s refresh (position / time / probability)
- **Seat map**: SVG-based 2-step (section → grape-style seats), real-time occupancy display

### Non-Functional (MVP-Critical)
- Home load < 2s, seat map render < 1s (5,000 seats)
- Queue update < 500ms (WebSocket)
- Concurrent queue capacity: 10,000 users/event
- Supabase Auth + RLS-based authorization

### UX Requirements
- Suno AI-style layout + shadcn/ui polished component system: left GNB Sidebar + card-based content, light mode default.
- **Must-have**: (1) Immersive booking — strip unnecessary UI on booking entry, info + action on a single screen (2) Instant feedback — queue position, seat occupancy, and timer reflected in real-time

---

## 4. Validation Plan

**Core Hypothesis**: Combining fan-verification tiers with VQA bot prevention will increase real fan ticket purchase success rate by 3x or more versus existing platforms.

**Key Assumption**: Loyal fans will willingly participate in tier verification (streaming/album) and perceive VQA quizzes as "fun fan validation" rather than friction. Trust, not churn.

**Next Step**: Pilot with 1 mid-tier idol group — 500 early adopters on free membership → 1 real concert ticketing event → measure success rate by tier + VQA pass rate / drop-off analysis.

---

## 5. Critical Questions Checklist

**1. What is the most important problem this MVP solves?**
Loyal fans pay membership fees yet repeatedly lose to bots/resellers for face-value tickets — a structural unfairness.

**2. Who uses this MVP, and why?**
Fans already spending money on official fan clubs. They want fair access and transparent queue information.

**3. What is the first success metric to measure?**
Diamond/Gold member booking success rate > 60%. Secondary: VQA real-fan pass rate > 85%.

**4. What assumption, if wrong, kills this MVP?**
Fans find the tier verification process too burdensome and churn, or perceive VQA as a barrier instead of a feature.

**5. What feature gets added first after MVP?**
Official Transfer Market (F6) — prevents churn from fans who fail at face-value purchase and absorbs resale demand into the platform.

---

## MVP Scope Boundary

**IN**: Home discovery, membership signup/payment, tier verification, artist page (events tab + transfer tab), 2-panel booking, VQA, queue, seat selection, payment/QR, my page (membership + ticket wallet + transfer history), search (artists/events), transfer market (listing + escrow purchase), onboarding flow

**OUT**: Community feed, advanced AI consulting, push notifications, announcement tab

---

*Design Reference: Suno AI layout + shadcn/ui component system — GNB Sidebar, card-based content, light mode, polished minimal UI*
*Tech Stack: React 19 + Vite / Next.js 15 / Tailwind v4 + shadcn/ui / Supabase / Redis (Upstash) / Toss Payments / Vercel*
