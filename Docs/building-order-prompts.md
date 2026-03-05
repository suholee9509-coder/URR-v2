# Build-Order Prompts: URR (우르르)

## Overview

URR is a K-POP fan membership concert ticketing platform with tier-based booking priority, VQA anti-bot verification, interactive seat maps, and an in-platform transfer market. The deliverable is an interactive React prototype (desktop only, light mode, mock data) built with Next.js 15 + Tailwind v4 + shadcn/ui for developer handoff.

## Build Sequence

1. **Foundation — Design Tokens & Global Styles** — Tailwind config, color palette, typography, spacing, tier system tokens, shadcn/ui theme
2. **Layout Shell — GNB Sidebar + Top Bar** — Persistent navigation frame, sidebar collapse, MY ARTISTS tree, routing structure
3. **Home Page** — Hero banner carousel, Popular Artists, Trending Events, loading/empty states
4. **Search Page** — Dedicated /search with grouped instant results, trending searches, states
5. **Artist Page (3 Tabs)** — Artist header, 홈/공연/양도 tabs, event cards, transfer card grid
6. **My Page (3 Tabs)** — 멤버십/티켓 월렛/양도 내역 tabs, membership cards, ticket cards with QR
7. **Notification Page** — UI shell with mock notification list, unread indicators
8. **Onboarding Flow** — Auth → phone verification → terms → artist selection → membership intro → tier verification → complete
9. **Booking: 2-Panel Layout + Idle State** — Left Panel (sticky, collapsible), Right Main idle, section overview, [Book Now] with countdown
10. **Booking: VQA Modal** — 3-question fan verification modal, progress, timer, pass/fail/exhausted states
11. **Booking: Queue State** — Seat map (read-only) + queue overlay, position/wait/probability, real-time updates
12. **Booking: Seat Selection** — Section drill-down, grape-style seats, selection info panel, 3-min timer, [Pay Now]
13. **Booking: Payment + Confirmation** — Toss Payments trigger, processing, success (confetti + QR), failure + retry
14. **Transfer: Seller Listing** — Price input with bounds, fee preview, confirmation, listed state
15. **Transfer: Buyer Purchase** — Transfer detail, membership gate, escrow, ownership transfer, confirmation
16. **Global States & Feedback** — Skeleton loading, empty states, error modals, toast notifications
17. **Animation & Interaction Polish** — All transition durations, hover states, timer animations, confetti, shimmer

---

## Prompt 1: Foundation — Design Tokens & Global Styles

### Context

URR (우르르) is a K-POP fan membership concert ticketing platform. This prompt establishes all shared design tokens, theme configuration, and TypeScript types that every subsequent component and page depends on. The app is desktop-only, light mode, built with Next.js 15, Tailwind v4, and shadcn/ui.

### Requirements

**Tech Setup:**
- Next.js 15 (App Router) + React 19
- Tailwind CSS v4 with CSS variables approach
- shadcn/ui component library (New York style variant recommended)
- TypeScript strict mode

**Color Palette (Light Mode Only):**
- Background: white (`#FFFFFF`)
- Surface/Card: `#FAFAFA` or subtle gray
- Primary/Accent: Choose a vibrant but professional accent color suitable for a K-POP ticketing platform (suggest deep violet or electric blue — not red, to avoid conflict with error states)
- Text Primary: `#0F172A` (slate-900)
- Text Secondary: `#64748B` (slate-500)
- Border: `#E2E8F0` (slate-200)
- Success: `#22C55E` (green-500)
- Error/Destructive: `#EF4444` (red-500)
- Warning: `#F59E0B` (amber-500)

**Tier System Tokens:**
- Diamond 💎: `#A78BFA` (violet-400) — premium purple
- Gold 🥇: `#F59E0B` (amber-500) — gold
- Silver 🥈: `#94A3B8` (slate-400) — silver
- Bronze 🥉: `#D97706` (amber-600) — bronze/copper

**Seat Map Tokens:**
- Available: `#22C55E` (green)
- My Selection: `#3B82F6` (blue)
- Taken/Sold: `#9CA3AF` (gray)
- Others' Lock: `#FACC15` (yellow)

**Typography:**
- Font family: Pretendard (Korean) with Inter fallback (Latin)
- Heading scale: 2xl (24px), xl (20px), lg (18px), base (16px), sm (14px), xs (12px)
- Font weights: 400 (regular), 500 (medium), 600 (semibold), 700 (bold)
- Timer countdown: monospace font (e.g., `JetBrains Mono` or `SF Mono`) — prevents digit-width jitter

**Spacing:**
- Base unit: 4px
- Common spacings: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64
- Card padding: 16px or 20px
- Section gap: 24px or 32px
- Page padding: 32px

**Elevation/Shadows:**
- Card default: `shadow-sm` (subtle)
- Card hover: `shadow-md` + `translateY(-1px)` (lift effect)
- Modal backdrop: `bg-black/50` overlay
- Sidebar: `shadow-lg` on right edge (when overlapping content)

**Border Radius:**
- Cards: 12px (`rounded-xl`)
- Buttons: 8px (`rounded-lg`)
- Inputs: 8px (`rounded-lg`)
- Badges: full (`rounded-full`)
- Avatar: full (`rounded-full`)

**Shared TypeScript Types:**

```typescript
type TierLevel = 'diamond' | 'gold' | 'silver' | 'bronze'
type TierEmoji = '💎' | '🥇' | '🥈' | '🥉'
type BookingState = 'idle' | 'vqa' | 'queue' | 'seats-section' | 'seats-individual' | 'payment' | 'confirmation'
type TransferStatus = 'listed' | 'sold' | 'completed' | 'cancelled'
type SeatStatus = 'available' | 'selected' | 'taken' | 'locked'

interface Artist {
  id: string
  name: string
  avatar: string
  banner: string
  followerCount: number
}

interface Event {
  id: string
  artistId: string
  title: string
  venue: string
  dates: EventDate[]
  poster: string
  status: 'upcoming' | 'open' | 'closed' | 'sold-out'
}

interface EventDate {
  id: string
  date: string // ISO
  bookingWindows: TierWindow[]
  remainingSeats: number
}

interface TierWindow {
  tier: TierLevel
  opensAt: string // ISO
  fee: number // ₩
}

interface Ticket {
  id: string
  eventId: string
  section: string
  row: string
  seatNumber: string
  qrCode: string
  isTransferable: boolean
}

interface TransferListing {
  id: string
  ticketId: string
  sellerId: string
  sellerTier: TierLevel
  sellerTransactionCount: number
  price: number
  faceValue: number
  section: string
  seatInfo: string
  status: TransferStatus
}

interface Membership {
  id: string
  artistId: string
  tier: TierLevel
  expiresAt: string
  isActive: boolean
}

interface User {
  id: string
  name: string
  email: string
  avatar: string
  tier: TierLevel
  memberships: Membership[]
}
```

**Price Formatting:**
- All prices in Korean won (₩) with comma thousands separator
- Example: `₩165,000` not `₩165000`
- Helper: `new Intl.NumberFormat('ko-KR').format(amount)`

**UI Rules:**
- Tier badge emojis (💎🥇🥈🥉) are read-only identity signals — NEVER clickable. No hover effect, no cursor pointer, no click handler. Always pair emoji with text label (e.g., "💎 Diamond") for accessibility.
- Tooltips: 300ms delay before showing, auto-position to avoid edge clipping.
- One primary action per state — never show competing CTAs.

### Constraints

- Light mode only — no dark mode tokens needed
- Desktop only — no mobile breakpoints
- No actual API integrations — all data comes from mock/seed
- Do not build any UI components yet — tokens and types only
- Pretendard font should be loaded via CDN or local file

---

## Prompt 2: Layout Shell — GNB Sidebar + Top Bar

### Context

URR uses a persistent GNB Sidebar (left) + Top Bar (top of content area) + Content Area (right) layout inspired by Suno AI. The sidebar provides multi-artist navigation — critical because K-POP fans follow 2–5 artists and switch between them frequently. This shell wraps all pages except Onboarding (which is full-screen with no sidebar).

### Requirements

**Overall Layout:**
```
┌─────────────────────────────────────────────────────────────┐
│ GNB Sidebar (240px)  │  Content Area (remaining width)      │
│                      │  ┌─────────────────────────────────┐ │
│                      │  │ Top Bar (56px height)           │ │
│                      │  ├─────────────────────────────────┤ │
│                      │  │                                 │ │
│                      │  │  Page Content (scrollable)      │ │
│                      │  │                                 │ │
│                      │  └─────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

**GNB Sidebar (240px expanded / 64px collapsed):**
- Fixed position (sticky), full viewport height
- Background: white with right border (`border-r`)
- Top section:
  - URR logo (clickable → Home)
  - [멤버십 가입] CTA button (secondary outline style) — shown if user has no active membership
- Navigation items (icon + label):
  - 홈 (Home icon)
  - 공연 (Calendar/ticket icon) — global events listing
  - 아티스트 (Users icon) — global artist directory
- Divider line
- **MY ARTISTS** section header (bold, small caps):
  - Accordion tree structure for each followed artist
  - Each artist row: artist avatar (24px circle) + name + chevron (▸/▾)
  - Expanded sub-items (indented): 아티스트 홈 | 공연 | 양도
  - Max 5 artists visible; if more than 5, show "더 보기" toggle link at bottom
  - Currently active artist always visible (pinned to top of the list if scrolled)
  - Active item: background fill (accent/5 opacity) + bold text + accent left border (3px)
  - Hover: subtle background highlight
- Bottom section (pinned to bottom):
  - Divider
  - User profile row: avatar (32px) + name + tier badge emoji

**Sidebar Collapse Behavior:**
- Toggle button at top of sidebar: `«` (collapse) / `»` (expand)
- Collapsed state (64px width): icons only, no labels. MY ARTISTS shows avatars only. Tooltips on hover.
- Collapse animation: slide left/right, 250ms ease-out
- Sidebar state persists across page navigation
- Auto-collapses when user clicks [Book Now] on booking page (immersive mode)

**Top Bar (56px height):**
- Left side: Breadcrumb navigation (e.g., "아티스트 > G-Dragon > 공연")
- Right side: Search icon (magnifying glass, click → navigate to /search) + Notification bell icon (click → /notifications) with unread badge (red dot + count)
- Background: white, bottom border (`border-b`)
- Breadcrumb items are clickable links

**Content Area:**
- Takes remaining viewport width after sidebar
- Vertically scrollable (independent of sidebar)
- Page content renders here based on route
- Max content width: 1200px centered within the area (for Home, Artist, My Page, Search, Notifications)
- Booking page uses full width (no max-width constraint)

**Routing Structure:**
- `/` — Home
- `/search` — Search page
- `/events` — Global events listing
- `/artists` — Artist directory
- `/artists/:artistId` — Artist page (tabs: home/events/transfer)
- `/events/:eventId` — Booking page (2-Panel)
- `/my-page` — My Page (tabs: membership/wallet/transfers)
- `/notifications` — Notification page
- `/onboarding` — Onboarding flow (full-screen, no sidebar/top bar)

### States

- **Sidebar expanded (default):** 240px, full labels + avatars + tree
- **Sidebar collapsed:** 64px, icons + small avatars only, tooltips
- **No followed artists:** MY ARTISTS section shows "아직 팔로우한 아티스트가 없습니다" message with [아티스트 찾기] link
- **Many followed artists (>5):** First 5 visible + "더 보기 (+N)" toggle

### Interactions

- Click sidebar nav item → navigate to page, update active state
- Click artist chevron → toggle expand/collapse sub-items (animation: slide down/up, 200ms)
- Click sidebar toggle → collapse/expand sidebar (250ms ease-out)
- Click breadcrumb item → navigate to that level
- Click search icon → navigate to /search
- Click notification bell → navigate to /notifications
- Hover sidebar item → subtle background highlight
- Keyboard: no keyboard shortcuts required for MVP

### Constraints

- Sidebar is NOT rendered on /onboarding route
- Sidebar auto-collapse on booking is triggered externally (booking page controls it)
- Do not implement page content — only the layout shell and navigation
- User data (name, tier, followed artists) comes from mock context/store
- No mobile responsive behavior — desktop only (min-width: 1280px assumed)

---

## Prompt 3: Home Page

### Context

The Home page is the default landing page for logged-in URR users. It serves as a discovery hub showing featured events, popular artists, and trending concerts. Home does NOT include a "My Artists" section — the sidebar handles artist-specific navigation. The page sits inside the GNB Sidebar + Top Bar layout shell.

### Requirements

**Page Structure** (single column, max-width 1200px, centered):

1. **Hero Banner Carousel:**
   - Full content-area width, ~360px height
   - 3–5 featured event banners with poster image as background
   - Each banner: event title (large white text with text-shadow), artist name, date, venue, status badge
   - Auto-rotate every 5 seconds
   - Dot indicators at bottom center
   - Click anywhere on banner → navigate to `/events/:eventId`
   - Navigation arrows (left/right) on hover

2. **Popular Artists Section:**
   - Section header: "인기 아티스트" with "더 보기 →" link (→ /artists)
   - Horizontal scrollable row of artist cards
   - Each artist card: avatar image (80px circle) + artist name (below) + follower count (small, secondary text)
   - Card width: ~120px. Gap: 16px.
   - Click card → navigate to `/artists/:artistId`
   - Hover: subtle elevation increase

3. **Trending Events Section:**
   - Section header: "지금 뜨는 공연" with "더 보기 →" link (→ /events)
   - Vertical list of event cards (2-3 columns grid)
   - Each event card: poster thumbnail (left, ~120px width), event title, artist name, date, venue, status badge (top-right corner)
   - Status badges: "예매 오픈" (accent, for open), "오픈 예정" (blue), "매진" (gray), "종료" (muted)
   - Click card → navigate to `/events/:eventId`
   - Hover: elevation + subtle border

**Mock Data:**
- 4 banner events (mix of open/upcoming)
- 8-10 popular artists with avatars
- 6-8 trending events with posters

### States

- **Loading:** Skeleton UI — hero banner shimmer (full width, 360px height), artist card circles shimmer, event card rectangles shimmer. 1.5s shimmer loop.
- **Populated:** Full content as described above.
- **Empty (no followed artists):** Same as populated (Home shows popular/trending, not personalized), but add a subtle CTA banner below hero: "아티스트를 팔로우하고 맞춤 공연 정보를 받아보세요" with [아티스트 찾기] button.

### Interactions

- Click hero banner → navigate to event page
- Click hero dot indicator → jump to that banner
- Click hero arrow → next/prev banner
- Scroll horizontally on Popular Artists row
- Click artist card → navigate to artist page
- Click event card → navigate to event booking page
- Click "더 보기 →" → navigate to full listing page

### Constraints

- No "My Artists" or "Upcoming for You" section — sidebar handles artist-specific navigation
- Desktop only — no responsive breakpoints
- All data is mock/seed data
- Do not build the sidebar or top bar — they are part of the layout shell
- Hero carousel: CSS-based or lightweight library (no heavy carousel packages)
- Section gap between hero/artists/events: 32px

---

## Prompt 4: Search Page

### Context

URR has a dedicated search page at `/search` (not a dropdown overlay). Users reach it by clicking the search icon in the top bar or GNB sidebar. Search covers two entity types: Artists and Events. Results appear as-you-type with instant filtering against mock data. The page sits inside the standard layout shell.

### Requirements

**Layout** (max-width 1200px, centered):

1. **Search Input:**
   - Full-width at top of page, large size (48px height)
   - Magnifying glass icon (left), text input (center), clear button "×" (right, visible when text entered)
   - Autofocus on page load
   - Placeholder: "아티스트 또는 공연을 검색하세요"

2. **Results Area** (below input, grouped):
   - **Artists section:** "아티스트" header + result cards
     - Each card: avatar (48px circle) + artist name (bold) + follower count (secondary text)
     - Horizontal layout (avatar left, text right)
     - Click → navigate to `/artists/:artistId`
   - **Events section:** "공연" header + result cards
     - Each card: poster thumbnail (60px, rounded) + event title (bold) + artist name + date + venue + status badge
     - Click → navigate to `/events/:eventId`
   - Results appear as user types (filter on keystroke with 200ms debounce)
   - Max 5 results per section initially, "더 보기" to show all

3. **Trending Searches (empty state):**
   - Shown when input is empty
   - "인기 검색어" header
   - Tag chips (rounded pill buttons) with trending artist/event names
   - Click chip → populate search input with that term

**Mock Data:**
- 10-15 searchable artists
- 10-15 searchable events
- 8-10 trending search terms

### States

- **Empty (initial):** Search input (empty) + trending search tag chips below.
- **Typing:** Input with text + instant results grouped by Artists / Events. Results filter in real-time.
- **No results:** "검색 결과가 없습니다" message + "'[query]'에 대한 결과를 찾을 수 없습니다. 다른 키워드로 검색해보세요." + trending searches below as fallback.
- **Results:** Grouped sections with matching artists and events.

### Interactions

- Type in search input → results update (200ms debounce)
- Click "×" clear button → clear input, show trending searches
- Click trending tag chip → fill input with term, trigger search
- Click artist result → navigate to artist page
- Click event result → navigate to event booking page
- Press Escape → clear input

### Constraints

- Simple client-side text matching against mock data (no search engine)
- Match against: artist name, artist aliases, event title, venue name
- Case-insensitive, Korean + Latin support
- Do not build global search dropdown — this is a full dedicated page
- Desktop only, max-width 1200px

---

## Prompt 5: Artist Page (3 Tabs)

### Context

Each artist has a dedicated page at `/artists/:artistId` with three tabs: 홈 (Home), 공연 (Events), and 양도 (Transfer). The sidebar's MY ARTISTS sub-items (아티스트 홈, 공연, 양도) navigate to these same tabs. This page is the primary hub for artist-specific information, event discovery, and transfer browsing. The page sits inside the standard layout shell.

### Requirements

**Artist Header (top of page, always visible across tabs):**
- Banner image: full content-width, ~200px height, artist photo/banner (gradient placeholder if no image)
- Below banner: artist name (h1, 24px bold), follower count ("팔로워 N명", secondary text), membership status badge
- Membership badge: if active → tier emoji + "멤버십 활성" (green); if none → [멤버십 가입 — ₩30,000/년] button (secondary)
- [팔로우] / [팔로우 중] toggle button (right-aligned with name)

**Tab Bar (below header):**
- Three tabs: 홈 | 공연 | 양도
- Active tab: underline indicator (accent color, 2px bottom border) + bold text
- Inactive tab: regular weight, secondary text color
- Tabs are URL-driven: `/artists/:id`, `/artists/:id/events`, `/artists/:id/transfer`

**홈 Tab Content:**
- Artist info summary: short bio (2-3 lines), debut date, agency, genre tags
- "다음 공연" card: next upcoming event (poster + title + date + venue + [예매하기] button). If no upcoming event: "예정된 공연이 없습니다."
- Membership CTA: if not a member, show tier benefits comparison card with [멤버십 가입] button

**공연 Tab Content:**
- Section: "다가오는 공연" — event cards for upcoming/open events
- Section: "지난 공연" — event cards for past events (muted styling)
- Each event card: poster image (left, 100px), event title, date(s), venue, status badge (top-right)
- Status badges: "예매 오픈" (accent, filled), "오픈 예정" (blue, outline), "매진" (gray), "종료" (muted)
- Click card → navigate to `/events/:eventId`
- Empty state: "등록된 공연이 없습니다."

**양도 Tab Content:**
- Filter bar at top: date dropdown, section dropdown, price range (min-max inputs), sort by dropdown (최신순/가격 낮은순/가격 높은순)
- Card grid (2-3 columns):
  - Each card: concert poster thumbnail (small), concert name + date, section + seat info, price (₩ formatted, bold), face-value comparison (e.g., "정가 대비 105%", color-coded: ≤100% green, 101-130% yellow, >130% red), seller tier badge (emoji + tier name), seller transaction count ("거래 N회")
  - Click card → opens transfer detail view (placeholder click handler for now; the detail view is a separate deliverable)
- Membership requirement notice at top: "멤버십 회원 전용 양도 마켓" label if user is not a member → "[멤버십 가입] 후 양도 티켓을 구매할 수 있습니다" message
- Empty state: "현재 양도 가능한 티켓이 없습니다."

**Mock Data:**
- 2-3 artists with full data (banner, bio, events, transfers)
- 3-5 events per artist
- 5-8 transfer listings per artist

### States

- **Loading:** Skeleton for header (banner shimmer + text placeholders) + tab content skeleton (card rectangles)
- **Populated:** Full content per tab
- **No events (공연 tab):** "등록된 공연이 없습니다" + illustration or icon
- **No transfers (양도 tab):** "현재 양도 가능한 티켓이 없습니다"
- **Non-member viewing transfer tab:** Transfer cards visible but [구매] is disabled with "멤버십 필요" tooltip

### Interactions

- Click tab → switch tab content (no page reload, URL updates)
- Click event card → navigate to booking page
- Click transfer card → show transfer detail (placeholder for now)
- Click [팔로우] → toggle follow state (filled/outline button swap)
- Click [멤버십 가입] → trigger membership purchase flow (mock)
- Filter/sort changes on 양도 tab → re-filter card grid instantly

### Constraints

- Sidebar sub-items (아티스트 홈/공연/양도) must map to the same tabs
- Transfer card click opens a transfer detail view — for this prompt, implement only the card grid; the detail view is a separate deliverable
- Desktop only, max-width 1200px for content
- All data mock — no real APIs
- Artist banner image can be a placeholder gradient if no image

---

## Prompt 6: My Page (3 Tabs)

### Context

My Page at `/my-page` is the user's personal hub for managing memberships, viewing tickets (with QR codes), and tracking transfer activity. It uses a tab layout with three sections. Users access it from the sidebar (bottom profile area) or direct navigation. This is a critical post-booking page — fans need quick access to their QR ticket at venue entry. The page sits inside the standard layout shell.

### Requirements

**Page Header:**
- User name (h1, 24px bold) + tier badge (emoji + tier name, e.g., "💎 Diamond")
- User email (secondary text)
- Avatar (64px circle, left of name)

**Tab Bar (below header):**
- Three tabs: 멤버십 | 티켓 월렛 | 양도 내역
- Active tab: underline indicator (accent color) + bold text
- URL-driven: `/my-page`, `/my-page/wallet`, `/my-page/transfers`

**멤버십 Tab:**
- Artist membership cards (vertical list):
  - Each card: artist avatar (48px) + artist name + tier badge (emoji + level) + membership status ("활성" green / "만료" red) + renewal date + [관리] button
  - Click [관리] → expand card to show: tier verification status, [멜론 연동] button (if not linked), [갱신] button (if near expiry)
- Empty state: "가입한 멤버십이 없습니다. 아티스트 페이지에서 멤버십에 가입하세요!" + [아티스트 찾기] button
- [멜론 연동] button: secondary style. If already linked: "멜론 연동 완료 ✓" (disabled, green text)

**티켓 월렛 Tab:**
- Two sections: "다가오는 공연" (upcoming) and "지난 공연" (past)
- Each ticket card:
  - Event poster thumbnail (small, left)
  - Event title, date, venue
  - Section + row + seat number (e.g., "A구역 3열 15번")
  - [QR 보기] button — largest tap target on the card (primary style)
  - [양도 등록] button — secondary style, only visible on transferable upcoming tickets
  - Past tickets: same info but grayed/muted, no action buttons
- **QR Expanded View:**
  - Full-screen overlay (modal) with dark backdrop
  - Large QR code image (centered, ~300px)
  - Event name, date, venue, section/seat info below QR
  - [닫기] button or click backdrop to close
  - Optimized for venue scanning
- Empty state: "아직 예매한 티켓이 없습니다. 공연을 둘러보세요!" + [공연 찾기] button

**양도 내역 Tab:**
- Two sub-sections: "판매 내역" and "구매 내역"
- Each listing card:
  - Event name + date, section + seat, price (₩), status badge
  - Status badges: "등록 중" (blue), "판매 완료" (green), "양도 완료" (green), "취소됨" (gray)
  - Seller cards: show listing price + fee deduction + net payout
  - Buyer cards: show purchase price + ticket transfer status
- Empty state: "양도 내역이 없습니다."

**Mock Data:**
- 2-3 artist memberships (mix of active/expired)
- 3-5 tickets (2 upcoming, 1-2 past)
- 2-3 transfer records (1 sold, 1 purchased, 1 active listing)

### States

- **Loading:** Skeleton cards for each tab
- **멤버십 — has memberships:** Membership cards listed
- **멤버십 — empty:** Empty state message + CTA
- **티켓 월렛 — has tickets:** Upcoming + past sections
- **티켓 월렛 — empty:** Empty state message + CTA
- **티켓 월렛 — QR expanded:** Full-screen QR overlay
- **양도 내역 — has records:** Sold + purchased sub-sections
- **양도 내역 — empty:** Empty state message

### Interactions

- Click tab → switch content (URL updates)
- Click [QR 보기] → open full-screen QR overlay
- Click backdrop or [닫기] on QR overlay → close overlay
- Press Escape on QR overlay → close
- Click [양도 등록] → navigate to the transfer listing flow (not implemented in this prompt — [양도 등록] serves as an entry point only)
- Click [관리] on membership card → expand/collapse management section
- Click [멜론 연동] → mock Melon OAuth flow (simulate success after 1s delay)

### Constraints

- QR codes are mock-generated (e.g., placeholder QR image or generated via a QR library from ticket ID)
- Melon linking is simulated — show loading spinner for 1s, then success state
- Desktop only
- Past tickets are read-only — no actions
- Do not implement the transfer listing flow here — [양도 등록] serves as an entry point for a separate flow

---

## Prompt 7: Notification Page

### Context

The Notification page at `/notifications` is a UI shell with mock notification data. There are no real event triggers or push notifications in the demo — this page demonstrates what the notification experience will look like. Users reach it by clicking the notification bell icon in the top bar. The page sits inside the standard layout shell.

### Requirements

**Layout** (max-width 800px, centered — narrower for readability):

- Page header: "알림" (h1)
- Notification list (vertical):
  - Each notification card: type icon (left, 40px), title (bold), description (secondary text, 1-2 lines), timestamp ("2시간 전", "어제", "3일 전")
  - Card background: white (read) or very subtle accent tint (unread)
  - Unread indicator: blue dot (8px) on left edge of card, or bold title text
  - Click card → navigate to related page (e.g., event page, transfer detail, my page)

- **Notification Types (mock):**

  | Type | Icon | Example Title | Example Description |
  |------|------|---------------|---------------------|
  | Booking Open | 🎫 | "G-Dragon DETOX 예매 오픈" | "💎 Diamond 예매가 3월 5일 09:00에 오픈됩니다." |
  | Transfer Complete | 🔄 | "양도 완료" | "A구역 3열 15번 티켓이 성공적으로 양도되었습니다." |
  | Tier Upgrade | ⬆️ | "등급 업그레이드" | "축하합니다! Gold 등급으로 승급되었습니다. 🥇" |
  | Payment Confirm | ✅ | "결제 완료" | "DETOX ASIA TOUR 티켓 결제가 완료되었습니다." |
  | Membership Expiry | ⚠️ | "멤버십 만료 예정" | "G-Dragon 멤버십이 7일 후 만료됩니다. 갱신하세요." |

- Mock data: 8-12 notifications, mix of types, 3-4 unread

**Top Bar Integration:**
- Notification bell icon shows red badge with unread count (e.g., "3")
- Badge disappears when all read (or after visiting /notifications page)

### States

- **Populated:** List of notification cards with unread indicators
- **Empty:** "아직 알림이 없습니다." with bell icon illustration

### Interactions

- Click notification card → navigate to related page (mock: just navigate to relevant route)
- Visiting the page marks all as read (unread dots disappear, top bar badge clears)

### Constraints

- All notifications are mock/seed data — no real triggers
- No notification preferences or settings
- No infinite scroll — all mock notifications fit on one page
- Desktop only
- Keep it simple — this is a UI shell, not a full notification system

---

## Prompt 8: Onboarding Flow

### Context

The onboarding flow at `/onboarding` is a full-screen, multi-step experience for first-time users. It has NO sidebar or top bar — it's an isolated flow. The goal is to take a user from zero to a personalized Home with a Bronze tier in under 3 minutes. The flow includes: authentication → phone identity verification (CI-based, 1-person-1-account) → terms agreement → artist selection → membership introduction → tier verification prompt → redirect to Home.

### Requirements

**Global Onboarding UI:**
- Full-screen, centered content (max-width 480px for form steps, full-width for artist selection)
- Clean white background
- Step progress indicator at top: dots or thin progress bar showing advancement
- URR logo at top center (small, links to nothing during onboarding)

**Step 1 — Authentication:**
- Centered card (max-width 400px)
- Title: "URR에 오신 것을 환영합니다"
- Subtitle: "K-POP 팬을 위한 공정한 티켓팅 플랫폼"
- Social login buttons (full-width, stacked):
  - 카카오 로그인 (yellow `#FEE500` background, dark text, Kakao icon)
  - 네이버 로그인 (green `#03C75A` background, white text, Naver icon)
- Divider: "또는"
- Email signup section: email input + password input + [회원가입] button
- Below: "이미 계정이 있으신가요? [로그인]" link
- Mock behavior: any login/signup → proceed to Step 2

**Step 2 — Phone Identity Verification:**
- Title: "본인 인증"
- Subtitle: "1인 1계정 인증으로 봇과 매크로를 방지합니다."
- Form fields:
  - 통신사 (carrier): select dropdown — SKT / KT / LGU+ / 알뜰폰
  - 이름 (name): text input
  - 생년월일 (DOB): 8-digit input (YYYYMMDD) with format hint
  - 성별: radio — 남성 / 여성
  - 내/외국인: radio — 내국인 / 외국인
  - 휴대폰 번호: phone number input (010-XXXX-XXXX format)
- [인증번호 발송] button (primary)
- After send: verification code input (6 digits) + 3-minute countdown timer (monospace) + [재발송] button (disabled until timer expires)
- [다음] button (disabled until code verified)

- **Duplicate CI state:** Modal popup: "이미 가입된 계정이 있습니다. (가입 경로: 카카오)" + [로그인 하기] button
- **Code expired state:** Inline error: "인증번호가 만료되었습니다." + [재발송] button re-activates
- Mock behavior: any 6-digit code → success after 1s delay

**Step 3 — Terms Agreement:**
- Title: "약관 동의"
- Checkbox list:
  - ☑ 전체 동의 (master checkbox, bold) — checks/unchecks all below
  - ☐ [필수] 서비스 이용약관 — with [보기] link (opens detail modal)
  - ☐ [필수] 개인정보 처리방침 — with [보기] link
  - ☐ [선택] 마케팅 정보 수신 동의 — with [보기] link
- [다음] button: disabled until both required items checked

**Step 4 — Artist Selection:**
- Title: "좋아하는 아티스트를 선택하세요"
- Subtitle: "1명 이상 선택해주세요"
- Category tabs at top: 전체 | 보이그룹 | 걸그룹 | 솔로 | 밴드
- Search bar below tabs (icon + input, "아티스트 검색")
- Card grid (responsive, 3-4 columns):
  - Each card: artist avatar (large, 80px circle) + name below
  - Unselected: outline border, muted
  - Selected: filled accent background/border + white checkmark overlay on avatar
  - Click toggles selection
- Selection counter at bottom: "N명 선택됨"
- [다음] button: disabled if 0 selected, active if 1+
- Full content-width for this step (max-width 800px)

**Step 5 — Membership Introduction:**
- Split layout (or stacked):
  - Left/top: Tier comparison visual table:
    | Tier | Badge | Booking Window | Fee | VQA |
    |------|-------|---------------|-----|-----|
    | 💎 Diamond | 우선 예매 | 개별 오픈 | ₩1,000 | 면제 |
    | 🥇 Gold | 우선 예매 | Diamond +1시간 | ₩2,000 | 면제 |
    | 🥈 Silver | 일반 예매 | Gold +2일 | ₩3,000 | 필수 |
    | 🥉 Bronze | 일반 예매 | Silver +1시간 | ₩5,000 | 필수 |
  - Right/bottom: [멤버십 가입 — ₩30,000/년] primary button + [건너뛰기] ghost button
- Subtitle: "멤버십에 가입하면 아티스트별 예매 자격이 부여됩니다"
- Mock behavior: [가입] → simulate payment success → proceed. [건너뛰기] → proceed.

**Step 6 — Tier Verification (shown only if membership purchased):**
- Title: "등급 인증"
- Subtitle: "멜론 연동으로 더 높은 등급을 받을 수 있습니다"
- Two buttons:
  - [멜론 연동하기] primary button — mock: 1s loading → success → "Gold 등급이 확인되었습니다! 🥇" message
  - [나중에 하기] ghost button → skip
- Explanation text: "멜론 스트리밍 기록을 기반으로 팬 등급이 산정됩니다. 연동하지 않으면 Bronze 등급으로 유지됩니다."

**Step 7 — Complete:**
- Celebratory screen: "환영합니다!" + user name + tier badge
- "맞춤 홈 화면이 준비되었습니다"
- Auto-redirect to Home after 2 seconds, or [홈으로 이동] button

### States

See each step above for inline states. Summary:
- Auth: default form | social login loading
- Identity: form | code sent (timer) | code expired | duplicate CI popup
- Terms: unchecked | partially checked | all required checked
- Artist selection: empty | partially selected | 1+ selected
- Membership: default | payment processing | skip
- Verification: default | linking (loading) | linked success | skip
- Complete: celebration + redirect

### Interactions

- Social login button → mock auth → Step 2
- Form inputs → standard validation (required fields)
- [인증번호 발송] → show code input + timer
- Master checkbox → toggle all child checkboxes
- [보기] on terms → open scrollable detail modal
- Artist card click → toggle selected state
- Category tab click → filter artist grid
- Search in artist selection → filter grid
- [가입] membership → mock payment → Step 6
- [건너뛰기] → skip to complete
- [멜론 연동하기] → 1s loading → success message

### Constraints

- Full-screen only — no sidebar, no top bar
- All verification is mock (any input accepted after delay)
- CI duplicate check is mock (never triggers unless you want to demo it with a specific test input)
- Timer for verification code: 3 minutes, monospace font
- Onboarding progress persists in local state (if user refreshes, restart from beginning is acceptable for demo)
- Target completion: under 3 minutes
- Desktop only (centered forms, generous whitespace)
- After onboarding complete, subsequent visits go directly to Home (store onboarding-complete flag in localStorage)

---

## Prompt 9: Booking — 2-Panel Layout + Idle State

### Context

The booking page at `/events/:eventId` is the core product experience of URR. It uses a unique 2-Panel layout (different from standard pages): Left Panel (event info, sticky, collapsible) + Right Main (state machine). This prompt builds the 2-Panel layout structure and the "idle" state — the first thing users see when they land on an event page. The sidebar auto-collapses to 64px when user clicks [Book Now] to create an immersive booking experience.

### Requirements

**2-Panel Layout Structure:**
```
┌─────────────────────────────────────────────────────────────┐
│ Sidebar │ Left Panel (360px)         │ Right Main            │
│ (64px   │ ┌────────────────────────┐ │ ┌──────────────────┐ │
│  or     │ │ [Poster Image]         │ │ │  Section Map     │ │
│  240px) │ │ Breadcrumb             │ │ │  (SVG overview)  │ │
│         │ │ Event Title            │ │ │                  │ │
│         │ │ Venue                  │ │ │                  │ │
│         │ │ [Date Dropdown]        │ │ ├──────────────────┤ │
│         │ │ Price Table            │ │ │  Section List    │ │
│         │ │ Tier Schedule          │ │ │  (prices +       │ │
│         │ │ My Tier Info           │ │ │   remaining)     │ │
│         │ │ [Book Now]             │ │ │                  │ │
│         │ └────────────────────────┘ │ └──────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

**Left Panel (360px expanded / ~48px collapsed):**
- Sticky position (fixed to left, full viewport height minus top bar)
- Scrollable if content overflows
- Collapse toggle: `«` icon on right edge → collapses to narrow strip showing only event name (vertical text or truncated horizontal) + tier badge + expand toggle `»`
- Collapse animation: 200ms ease-out

Content (top to bottom):
1. **Event poster image** (~200px height, rounded corners)
2. **Breadcrumb**: Artist Name > 공연 > Event Title (small, secondary)
3. **Event title** (h2, 20px bold)
4. **Venue**: venue name with map pin icon
5. **Date dropdown**: select from available dates. Default: earliest bookable date. Disabled dates grayed. Each option shows date + remaining seats count.
6. **Price table**: section-by-section pricing
   | 구역 | 가격 |
   |------|------|
   | VIP | ₩165,000 |
   | R석 | ₩143,000 |
   | S석 | ₩121,000 |
   | A석 | ₩99,000 |
7. **Tier booking schedule** (4 rows):
   - 💎 Diamond — [countdown or "오픈됨" or date/time]
   - 🥇 Gold — [countdown or date/time]
   - 🥈 Silver — [date/time]
   - 🥉 Bronze — [date/time]
   - User's own tier row: highlighted with accent background
   - If window not yet open: show "Opens in HH:MM:SS" countdown
   - If window open: show "오픈됨" in accent color
   - If window closed: show "마감" in gray
8. **My tier info**: "내 등급: 💎 Diamond" with badge
9. **[Book Now] button**: full-width, primary style
   - If booking window NOT open: disabled, shows countdown text "예매 오픈까지 HH:MM:SS"
   - If booking window open: active, accent color, "예매하기"
   - If sold out: disabled, "매진"

**Right Main — Idle State:**
- Fills remaining viewport width after sidebar + left panel
- Two zones:
  1. **Upper zone (~60% height): Section overview map**
     - SVG venue layout showing sections as colored polygons
     - Color-coded by availability density: green (many seats), orange (few remaining), red (almost sold out), gray (sold out)
     - Each section: hover → opacity increase + tooltip showing "A구역 — 잔여 342석"
     - Read-only in idle state (not clickable until seat selection)
     - Include a small seat legend: 🟢 여유 | 🟠 일부 잔여 | 🔴 거의 매진 | ⚫ 매진
  2. **Lower zone (~40%): Section price/remaining list**
     - Table or card list: section name, price (₩), remaining seats, status indicator (colored dot matching map)
     - Sorted by section name or by remaining seats

**Mock Data:**
- 1 event with poster, title, venue (e.g., KSPO Dome), 2-3 dates
- 4-6 sections with prices and seat counts
- Simple SVG section map (geometric shapes representing venue sections)

### States

- **idle (window not open):** Full layout visible. [Book Now] disabled with countdown. Section map read-only. Sidebar expanded (240px).
- **idle (window open):** Same but [Book Now] is active (accent color). Section map still read-only.
- **idle (sold out):** [Book Now] disabled showing "매진". Sections show gray. Remaining = 0.
- **Loading:** Left panel skeleton (poster shimmer + text placeholders). Right main skeleton (map placeholder + list shimmer).

### Interactions

- Click date dropdown → select different date, update remaining seats across map and list
- Hover section on map → tooltip with section name + remaining count
- Click [Book Now] (when active) → triggers the booking state machine transition (to VQA modal for Silver/Bronze, or directly to queue for Diamond/Gold). Set up the state transition logic but render only the idle state visually in this prompt. Also triggers sidebar auto-collapse to 64px.
- Click left panel collapse toggle → collapse/expand left panel (200ms)
- Click sidebar collapse toggle → collapse/expand sidebar (250ms)

### Constraints

- Right Main idle state is read-only — sections are NOT clickable (clicking is only enabled in seats-section state)
- The state machine (idle → vqa → queue → seats → payment → confirmation) is managed by a React state/context — set up the state management structure here, but only implement the idle state visually
- SVG map can be simplified (rectangles/polygons for sections) — doesn't need to be a real venue map for demo
- Left panel does NOT use the global content max-width (1200px) — it has its own fixed 360px width
- Desktop only, no horizontal scrolling
- All prices in ₩ with comma separators

---

## Prompt 10: Booking — VQA Modal

### Context

VQA (Visual Question Authentication) is URR's anti-bot fan verification gate. When Silver or Bronze tier users click [Book Now], a modal overlay appears with 3 text-based fan knowledge questions. Diamond and Gold users skip VQA entirely and go straight to the queue. VQA is framed as "Fan Verification" — a celebration of fandom, not a punishment. The modal appears on top of the booking page (which shows the 2-Panel layout behind it).

### Requirements

**Modal Structure:**
- Centered modal (max-width 520px, rounded-xl, white background)
- Dark backdrop (bg-black/50) — blocks background interaction
- NOT closable via backdrop click or Escape during active questions (prevents accidental exit)
- Title at top: "🎤 팬 인증" (centered, 20px bold)
- Subtitle: "진정한 팬만이 통과할 수 있는 아티스트 퀴즈" (secondary text)

**Progress Indicator:**
- Horizontal dots or step bar: ● ○ ○ → ● ● ○ → ● ● ●
- Text: "1/3", "2/3", "3/3"
- Below title, above question content

**Question Display:**
- Question text (16px, medium weight, centered or left-aligned)
- 4 answer option cards below (vertical stack):
  - Each card: text content, full-width, 48px min-height, rounded-lg border
  - Default: white bg, border (slate-200)
  - Hover: border changes to accent color, subtle background tint
  - Selected (clicked): accent border + accent background tint
  - Correct: green background flash (300ms) + ✓ icon
  - Incorrect: red background flash + horizontal shake animation (3px, 3 cycles, 400ms) + ✗ icon. Correct answer highlighted green.
- Per-question timer: "30" countdown (top-right or below progress), monospace font
  - Starts at 30, counts down every second
  - At 10s: timer text turns amber/warning color
  - At 5s: timer text turns red
  - At 0s: treated as incorrect answer, auto-advance

**Question Types (mock — text only, no images/video):**
- Lyrics completion: "다음 가사의 빈칸을 채우세요: '눈이 부시게 ____한 날'"
- Trivia: "이 아티스트의 데뷔곡은?"
- Contextual: "이 아티스트의 공식 팬덤 이름은?"

**After All 3 Questions:**
- **Pass (2/3+ correct):**
  - Modal content transitions to: "환영합니다, 진정한 팬! 🎉" (large text) + "대기열에 진입합니다..." (secondary)
  - Auto-transition to queue state after 2 seconds
  - Modal closes automatically

- **Fail (<2/3 correct):**
  - Modal content: "아쉽게도 통과하지 못했습니다." + score display (e.g., "1/3 정답")
  - If retries remaining: "재시도 가능 횟수: N회" + [다시 도전하기] button (primary) + [나가기] button (ghost)
  - [다시 도전하기] → reset quiz with new random questions
  - Max 2 retries total

- **Exhausted (all retries used):**
  - Modal content: "모든 시도를 사용했습니다." + "다음 예매 회차에 다시 도전해주세요."
  - [이벤트 페이지로 돌아가기] button (primary)
  - Click → close modal, return to idle state, reset sidebar to expanded

**Mock Data:**
- Pool of 15+ questions with 4 options each and correct answer marked
- Random selection of 3 per quiz attempt

### States

| State | User Sees | User Can Do |
|-------|-----------|-------------|
| question (1/3, 2/3, 3/3) | Question text + 4 options + timer + progress | Click one option |
| correct | Selected option turns green + ✓ | Wait 1.5s, auto-advance |
| incorrect | Selected turns red + shake, correct turns green | Wait 1.5s, auto-advance |
| timeout | Timer hits 0, treated as incorrect | Wait 1s, auto-advance |
| pass | "환영합니다, 진정한 팬!" celebration | Wait 2s (auto-transition to queue) |
| fail (retries left) | Score + retry count + [다시 도전하기] / [나가기] | Retry or leave |
| exhausted | "모든 시도를 사용했습니다" + [돌아가기] | Return to event page |

### Interactions

- Click answer option → lock selection (disable other options), evaluate correct/incorrect, show result animation, auto-advance after delay
- Timer countdown → if hits 0, treat as incorrect
- [다시 도전하기] → reset quiz with new questions, reset progress to 1/3
- [나가기] / [돌아가기] → close modal, return to idle state
- Cannot close modal via backdrop click during active question
- Cannot close modal via Escape during active question

### Constraints

- Text-only questions — no images, video, or audio
- VQA is ONLY for Silver and Bronze tiers — Diamond and Gold skip entirely
- VQA modal blocks all background interaction (seat map, left panel, sidebar)
- Questions are randomly selected from a pool — same quiz attempt should not repeat questions
- Timer is per-question (30s each), not total
- After VQA pass, the booking state transitions to "queue." The queue state rendering is a separate implementation
- Keep the tone fun and fan-positive, not punishing

---

## Prompt 11: Booking — Queue State

### Context

After passing VQA (or skipping it for Diamond/Gold), the user enters a real-time queue on the booking page. The queue state transforms the Right Main area to show the seat map (read-only, with real-time section occupancy) overlaid with queue status information. The sidebar is collapsed (64px, icon-only) and the left panel stays sticky but can be collapsed by the user. This is a waiting state — the user watches their position decrease until they reach the front and are promoted to seat selection.

### Requirements

**Right Main — Queue State Layout:**

1. **Seat map area (upper, ~65% height):**
   - Same SVG section overview from idle state, but now with real-time occupancy updates
   - Sections change color as they fill: green → orange → red → gray (sold out)
   - Remaining seat count overlaid on each section (or on hover tooltip)
   - Read-only — sections are NOT clickable during queue
   - Subtle pulse animation on sections as counts change

2. **Queue overlay card (centered on the seat map, semi-transparent background):**
   - Not a full-screen overlay — a card that sits on top of the seat map
   - Semi-transparent white background (bg-white/90 + backdrop-blur)
   - Rounded-xl, shadow-xl
   - Content:
     - "대기 중" header (16px, bold)
     - **Position**: Large number display — "#47" (36px, bold, accent color) + "/ 1,200명" (secondary)
     - **Estimated wait**: "예상 대기 시간: 2분 15초" with clock icon
     - **Success probability**: "예매 성공 확률: 92%" with color indicator (green ≥60%, yellow 20-59%, red <20%)
     - Small note: probability < 20% → show "양도 마켓을 확인해보세요" link (to artist transfer tab)
   - Position number updates every 10 seconds with counter roll animation (number scrolls to new value, 500ms)

3. **Navigation warning:**
   - If user attempts to click sidebar items or navigate away: modal alert — "대기열을 이탈하면 순번이 취소됩니다. 나가시겠습니까?" + [머무르기] (primary) + [나가기] (ghost)
   - Sidebar items dimmed/disabled during queue (except toggle button)

**Queue Promotion (reaching front):**
- When position reaches #1 (or front of queue):
  - Queue overlay card transitions: "순서가 되었습니다! 좌석을 선택하세요." (celebration)
  - Brief pulse animation on the card
  - Auto-transition to seats-section state after 1.5 seconds
  - Queue overlay card fades out, seat map becomes interactive

**Sold Out During Queue:**
- If all seats sell out while user is in queue:
  - Queue overlay updates: probability drops to 0%, "매진" label appears
  - Message: "현재 잔여 좌석이 없습니다. 취소표가 나올 수 있으니 대기를 유지하거나 양도 마켓을 확인해보세요."
  - [대기 유지] + [나가기] buttons

**Immersive Mode Reminder:**
- Sidebar is at 64px (collapsed, icon-only) — collapsed by [Book Now] in previous state
- Left panel is visible but collapsible — user can toggle it to minimize and maximize seat map viewing area
- Top bar remains visible

### States

| State | User Sees | User Can Do |
|-------|-----------|-------------|
| queue (active) | Seat map + queue overlay card (position, wait, probability) | Wait. Collapse/expand left panel. |
| queue (updating) | Position number rolling to new value | Wait (visual feedback of progress) |
| queue (low probability) | Probability <20%, transfer suggestion visible | Click transfer link or continue waiting |
| queue (sold out) | Probability 0%, "매진" label | Stay or leave |
| queue (promoted) | "순서가 되었습니다!" celebration | Wait 1.5s (auto-transition to seats) |
| queue (navigation attempt) | Warning modal | Confirm stay or leave |

### Interactions

- Position updates every 10 seconds (simulate with setInterval + mock decreasing position)
- Counter roll animation on position change (500ms)
- Click transfer suggestion link → navigate to artist transfer tab (exits queue)
- Attempt to navigate → warning modal
- Collapse/expand left panel → same behavior as idle state
- Queue promotion → auto-transition to seats-section

### Constraints

- Seat map is READ-ONLY during queue — no section clicking
- Queue status is simulated with mock data (setInterval that decreases position gradually)
- Navigation warning should fire on sidebar click, breadcrumb click, and browser back
- WebSocket simulation: use setInterval with randomized position decrements
- Probability calculation: mock formula — `Math.round((remainingSeats / position) * 100)`
- Do not implement actual WebSocket — simulate with timers
- Desktop only

---

## Prompt 12: Booking — Seat Selection

### Context

After being promoted from the queue, the user enters seat selection — the most interactive and time-pressured state of the booking flow. The center area becomes a fully interactive seat map with a 3-minute countdown timer, and a right side panel (360px) shows minimap, seat availability, selected seats, pricing, and the [Pay Now] button. Users first see a section overview (clickable sections), then view individual grape-style seats within a section (rendered directly on the venue map without zoom transition). The left panel auto-collapses when entering seat selection. Max 4 seats per booking.

### Requirements

**Right Main — Seats-Section State:**

1. **Section overview map (full right main area):**
   - Same SVG as idle/queue but now INTERACTIVE
   - Each section is a clickable polygon
   - Color-coded by availability: green (many), orange (few), red (almost sold out), gray (sold out / not clickable)
   - Hover: opacity increase + cursor pointer + tooltip ("A구역 — 잔여 342석 / ₩165,000")
   - Click: drills into individual seats for that section
   - Sold-out sections: cursor not-allowed, no hover effect, dimmed
   - Seat legend visible: 🟢 여유 | 🟠 일부 잔여 | 🔴 거의 매진 | ⚫ 매진

2. **No timer yet in seats-section state** — timer starts when first seat is selected (or upon entering seats-individual state)

**Right Main — Seats-Individual State (after section click):**

1. **Upper zone — Grape-style seat map:**
   - Individual seats rendered as small circles (12-16px diameter) arranged in curved rows (grape/arc pattern matching real venue section layout)
   - Each seat: color-coded by status
     - 🟢 Green: available — hover shows blue outline, cursor pointer
     - 🔵 Blue: my selection — filled blue
     - ⚫ Gray: taken (sold) — no interaction, cursor default
     - 🟡 Yellow: others' lock (another user holding) — no interaction, cursor not-allowed
   - Click available (green) seat → turns blue (selected). Click again → deselects (back to green).
   - Row labels on left (1열, 2열, 3열...)
   - Section name + "← 구역 선택으로 돌아가기" back link at top
   - Seats are rendered directly on the venue map (no zoom transition)

2. **Right side panel (BookingSidePanel, 360px width):**
   - **Selected seats summary:**
     - List of selected seats: "A구역 3열 15번" with [×] remove button each
     - Count: "N/4석 선택됨" (max 4)
     - If 4 selected: "최대 선택 수에 도달했습니다" notice. Additional seat clicks disabled.
   - **Timer:**
     - 3-minute countdown (MM:SS format, monospace font)
     - Large display (24px+, prominent position)
     - Color changes: default (accent/neutral) → 1:00 remaining (yellow/amber) → 0:30 remaining (red + subtle pulse animation, 1s loop)
     - Timer starts when user enters seats-individual state
   - **Price breakdown:**
     - Ticket price per seat × quantity
     - Tier fee (e.g., "💎 Diamond 수수료: ₩1,000 × N")
     - Total (bold, large): "총 ₩332,000"
     - All in ₩ with comma separators
   - **[결제하기] button:**
     - Full-width, primary style
     - Disabled until at least 1 seat selected
     - Shows total amount: "₩332,000 결제하기"
     - Click → triggers payment state (next prompt)

**Timer Expiration:**
- When timer reaches 0:00:
  - All selected seats automatically released
  - Modal: "선택 시간이 만료되었습니다. 좌석이 해제되었습니다." with sad/neutral icon
  - [구역 선택으로 돌아가기] button → returns to seats-section state (timer reset opportunity)
  - [예매 종료] button → returns to idle state
  - Sidebar re-expands to 240px

**Section → Individual Transition:**
- Panel replace animation (200ms): section overview fades out, individual seats fade in
- "← 구역 선택으로 돌아가기" visible at all times
- Going back preserves no seat selection (seats deselected on section change)

### States

| State | User Sees | User Can Do |
|-------|-----------|-------------|
| seats-section | Interactive section map, no timer | Click a section to drill in |
| seats-individual | Grape seat map + info panel + timer | Select/deselect seats (max 4), pay, go back |
| seats-individual (max reached) | 4 seats selected, "최대 도달" notice | Deselect to swap, pay |
| seats-individual (timer warning 1:00) | Timer turns yellow | Continue selecting, pay |
| seats-individual (timer warning 0:30) | Timer turns red + pulse | Urgency — select quickly and pay |
| seats-expired | Modal: "시간 만료" | Return to sections or leave |

### Interactions

- Click section polygon → drill into individual seats (panel replace)
- Click "← 구역 선택으로 돌아가기" → return to section overview
- Click available seat → select (green → blue), add to info panel
- Click selected seat → deselect (blue → green), remove from info panel
- Click [×] on seat in info panel → deselect that seat
- Click [결제하기] → pause timer, trigger payment state
- Timer countdown runs every second. Mock: 3 minutes = 180 seconds.
- Seat status changes (others' locks appearing as yellow) → simulate with random mock updates every 15-30s
- Seats rendered directly on venue map without zoom (no useMapTransform)

### Constraints

- Max 4 seats per booking — enforce at UI level
- Timer is 3 minutes from entering seats-individual state
- Timer uses monospace font to prevent digit-width jitter
- Seat grid should handle 200-500 seats per section (performance consideration — use virtualization or SVG grouping if needed)
- Grape-style layout: seats arranged in curved rows mimicking real venue seating
- Going back to section overview deselects all seats and resets timer
- Selected seats are shown in both the seat grid (blue) and the info panel (list)
- Desktop only, no zoom interaction (seats rendered inline on venue map)
- SVG seats can be simplified circles — doesn't need to be architecturally accurate

---

## Prompt 13: Booking — Payment + Confirmation

### Context

After selecting seats and clicking [결제하기], the booking flow enters the payment state. URR uses Toss Payments for checkout. On success, a QR ticket is generated and saved to the user's Ticket Wallet. On failure, the user gets a brief retry window before seats are released. This prompt covers the payment trigger, processing state, success celebration, and failure handling.

### Requirements

**Payment Trigger:**
- User clicks [결제하기] on seat selection info panel
- Timer pauses (does not continue counting down during payment)
- Toss Payments modal/popup opens with order details

**Payment Summary (shown before Toss Payments launches or within it):**
- Event name + date
- Selected seats list (section, row, seat number for each)
- Subtotal: ticket price × seat count (₩)
- Tier fee: fee per seat × count (₩) — label shows tier: "💎 Diamond 수수료"
- Total (bold, large): ₩ with comma separator
- Example:
  ```
  DETOX ASIA TOUR — 2026.03.22 (토) 19:00
  A구역 3열 15번, A구역 3열 16번

  티켓 가격: ₩165,000 × 2 = ₩330,000
  💎 Diamond 수수료: ₩1,000 × 2 = ₩2,000
  ─────────────────────────────
  총 결제 금액: ₩332,000
  ```

**Toss Payments Integration (Mock):**
- For demo: simulate Toss Payments with a mock payment modal
- Mock payment modal: shows order summary + [결제 완료] button + [취소] button
- Click [결제 완료] → 1-2s loading spinner → success
- Click [취소] → return to seat selection (timer resumes)

**Payment Success → Confirmation State:**
- Right Main transforms to confirmation view:
  1. **Confetti animation** (particle burst, 800ms duration, festive and brief)
  2. **"예매 완료!" heading** (large, centered, celebration style)
  3. **QR Code** (centered, ~200px, generated from ticket ID or mock image)
  4. **Event details card:**
     - Event name + date + venue
     - Section, row, seat numbers
     - Tier badge + membership info
     - Booking ID / confirmation number
  5. **Action buttons:**
     - [티켓 월렛에서 보기] primary button → navigate to My Page > Ticket Wallet
     - [홈으로 돌아가기] ghost button → navigate to Home
- Left panel: still shows event info (read-only now)
- Sidebar: re-expands to 240px

**Payment Failed State:**
- Right Main shows error card:
  - "결제에 실패했습니다." (error heading, red icon)
  - Error details (secondary text): "카드 승인이 거절되었습니다." (or generic message)
  - "좌석이 60초간 유지됩니다. 다시 시도해주세요."
  - 60-second countdown (monospace, prominent)
  - [다시 시도] primary button → re-open Toss Payments
  - [예매 종료] ghost button → release seats, return to idle
- If 60s expires: seats auto-released, show "좌석이 해제되었습니다" + [이벤트 페이지로 돌아가기]

### States

| State | User Sees | User Can Do |
|-------|-----------|-------------|
| payment (processing) | Mock Toss Payments modal with spinner | Wait or cancel |
| confirmation (success) | Confetti + QR + event details + buttons | View wallet or go home |
| payment-failed | Error message + 60s countdown + retry | Retry or leave |
| payment-failed (60s expired) | "좌석 해제됨" message | Return to event page |

### Interactions

- [결제 완료] in mock payment → 1-2s delay → success → confirmation
- [취소] in mock payment → return to seat selection, timer resumes
- Confetti animation plays once on success, auto-stops
- [티켓 월렛에서 보기] → navigate to `/my-page/wallet`
- [홈으로 돌아가기] → navigate to `/`
- [다시 시도] on failure → re-open payment modal
- [예매 종료] → release seats, return to idle, sidebar re-expands
- 60s retry countdown runs independently

### Constraints

- Toss Payments is MOCKED — do not integrate real Toss SDK for demo
- QR code: use a QR code generation library (e.g., `qrcode.react`) to generate from ticket ID, or use a static placeholder image
- Confetti: lightweight particle library (e.g., `canvas-confetti` or `react-confetti`) — keep it brief (800ms burst, not continuous)
- Seat timer pauses during payment and does NOT contribute to the 60s retry timer
- On success: seats are permanently assigned (mock — remove from available pool)
- On success: sidebar re-expands to normal state
- Desktop only
- All prices in ₩ with comma separators

---

## Prompt 14: Transfer — Seller Listing

### Context

When a user owns a ticket they can no longer use, they can list it for transfer on URR's in-platform market. The entry point is the [양도 등록] button on a ticket card in My Page > Ticket Wallet. This flow guides the seller through pricing (with enforced bounds) and fee disclosure, then publishes the listing to the relevant artist's Transfer tab. Both buyer and seller must be members — this is a closed ecosystem.

### Requirements

**Entry Point:**
- [양도 등록] button on an eligible ticket card in My Page > Ticket Wallet
- Only visible on upcoming, transferable tickets (not past, not already listed)

**Transfer Listing Flow (modal or dedicated view):**

1. **Step 1 — Price Input:**
   - Title: "양도 등록" (modal or page heading)
   - Ticket info display: event name, date, section, row, seat number
   - Face value display: "정가: ₩165,000" (read-only, for reference)
   - **Price input field:**
     - Number input with ₩ prefix
     - Pre-filled with face value (default)
     - Recommended range label: "권장 가격: ₩148,500 ~ ₩181,500" (face ±10%)
     - Hard bounds: floor = 0.5× face value, cap = 1.5× face value
     - Validation:
       - Below floor → red border + "최소 가격은 ₩[floor]입니다"
       - Above cap → red border + "최대 가격은 ₩[cap]입니다"
       - Above 1.3× face value → yellow warning: "정가의 130%를 초과하는 등록은 검토 대상입니다"
   - Face-value comparison: "정가 대비 105%" (dynamic, updates as price changes, color-coded: ≤100% green, 101-130% yellow, >130% red)

2. **Step 2 — Fee & Payout Preview:**
   - Fee calculation by tier:
     - Diamond/Gold: 5% fee
     - Silver/Bronze: 10% fee
   - Display:
     ```
     양도 가격:       ₩170,000
     💎 Diamond 수수료 (5%): -₩8,500
     ─────────────────────────
     예상 수령액:     ₩161,500
     ```
   - [등록하기] primary button + [취소] ghost button

3. **Step 3 — Confirmation:**
   - "양도 등록이 완료되었습니다!" success message
   - "아티스트의 양도 탭에서 등록 내역을 확인할 수 있습니다."
   - [등록 내역 보기] → navigate to artist page Transfer tab
   - [티켓 월렛으로 돌아가기] → back to My Page wallet

**After Listing:**
- Ticket card in wallet shows "양도 등록 중" badge (blue)
- [양도 등록] button changes to [양도 취소] (destructive/outline style)
- Listing appears in artist page > Transfer tab card grid

### States

| State | User Sees | User Can Do |
|-------|-----------|-------------|
| price-input | Ticket info + price field + recommended range | Enter price, validate |
| price-input (validation error) | Red border on input + error message | Fix price |
| price-input (high price warning) | Yellow warning about 130% threshold | Proceed or adjust |
| fee-preview | Price + fee + net payout summary | Confirm or cancel |
| confirming (loading) | [등록하기] shows spinner | Wait |
| listed (success) | "등록 완료!" message + navigation buttons | View listing or return |
| sold (async) | Ticket card in wallet shows "양도 완료" badge (green). Toast: "티켓이 판매되었습니다! 정산금: ₩[amount]". Transfer history shows "판매 완료" status. | View transfer history |

### Interactions

- Type price → real-time validation + face-value % update + fee calculation
- [등록하기] → 1s mock delay → success
- [취소] → close modal, return to ticket wallet
- [양도 취소] on listed ticket → confirmation dialog "양도 등록을 취소하시겠습니까?" → [확인] / [취소]

### Constraints

- Price bounds are hard limits — cannot submit outside 0.5x-1.5x face value
- Fee is tier-based: 5% (Diamond/Gold), 10% (Silver/Bronze)
- Face value pre-filled as default to reduce friction
- Transfer is only available for upcoming, unused tickets
- All prices in ₩ with comma separators
- Mock: listing just appears in the transfer card grid immediately (no real backend)
- Desktop only

---

## Prompt 15: Transfer — Buyer Purchase

### Context

Buyers browse transfer listings on an artist's Transfer tab card grid. When a buyer clicks a transfer card, they see a detail view with the seat's location on the venue map, seller information, and a [구매하기] button. Buyers MUST hold an active membership for the artist to purchase — this is a closed ecosystem. Payment uses escrow (Toss Payments mock), and on success, the seller's QR is invalidated and a new QR is issued to the buyer.

### Requirements

**Transfer Detail View (modal or slide-over panel):**
- Triggered by clicking a transfer card on the artist's Transfer tab

1. **Seat Location on Map:**
   - Small version of the venue section map (SVG)
   - The listed seat's section highlighted (accent color), other sections dimmed
   - Section name + seat info label: "A구역 3열 15번"

2. **Listing Information:**
   - Event name + date + venue
   - Section, row, seat number
   - Price: ₩ (large, bold)
   - Face-value comparison: "정가 대비 105%" (color-coded: ≤100% green, 101-130% yellow, >130% red)
   - Face value reference: "정가: ₩165,000" (secondary)

3. **Seller Information:**
   - Seller tier badge (emoji + tier name, e.g., "💎 Diamond")
   - Transaction count: "거래 12회" (trust signal)
   - Anonymous display (no real name — just tier + count)

4. **Purchase Section:**
   - Price breakdown:
     ```
     양도 가격: ₩170,000
     (정가 대비 103%)
     ```
   - Escrow notice: "결제 금액은 양도가 완료될 때까지 에스크로에 보관됩니다."
   - [구매하기] primary button (full-width)

5. **Membership Gate:**
   - If buyer does NOT have active membership for this artist:
     - [구매하기] button is DISABLED (grayed out)
     - Notice above button: "이 아티스트의 멤버십 가입이 필요합니다." (warning style)
     - [멤버십 가입하기] link/button below → navigates to artist page membership CTA
   - If buyer HAS active membership: button is active

**Purchase Flow (after clicking [구매하기]):**

1. **Toss Payments mock modal** (same pattern as booking payment):
   - Shows transfer price + [결제 완료] + [취소]
   - Mock: [결제 완료] → 1-2s loading → success

2. **Escrow Processing:**
   - Brief "양도 처리 중..." screen with spinner (1-2s mock delay)
   - "결제가 완료되었습니다. 티켓 소유권을 이전하고 있습니다..."

3. **Transfer Complete:**
   - "양도가 완료되었습니다! 🎉" success heading
   - "새로운 QR 티켓이 발급되었습니다."
   - Event details + section/seat info
   - [티켓 월렛에서 보기] primary button → navigate to My Page > Ticket Wallet
   - New QR ticket appears in buyer's wallet
   - Seller's QR invalidated (if viewing seller's wallet, shows "양도 완료" badge)

### States

| State | User Sees | User Can Do |
|-------|-----------|-------------|
| detail (browsing) | Seat map + listing info + seller info + [구매하기] | Review and purchase |
| detail (no membership) | Same but [구매하기] disabled + membership notice | Join membership first |
| payment (processing) | Mock Toss modal + spinner | Wait or cancel |
| escrow (processing) | "양도 처리 중..." spinner | Wait |
| complete | "양도 완료!" + new ticket info + [월렛 보기] | View ticket |
| payment-failed | "결제에 실패했습니다" error + [다시 시도] | Retry or leave |

### Interactions

- Click transfer card → open detail view
- Click [구매하기] → open mock payment → success/failure
- Click [결제 완료] in mock → escrow processing → transfer complete
- Click [취소] → return to transfer detail
- Click [멤버십 가입하기] → navigate to artist page
- Click [티켓 월렛에서 보기] → navigate to My Page Wallet
- Close detail view → return to transfer card grid

### Constraints

- Buyer must have active membership for the artist — enforce at UI level
- Escrow is fully mocked (instant processing after delay)
- Seller's QR invalidation is simulated (update mock data)
- New QR for buyer is generated (same mock QR approach as booking)
- All prices in ₩ with comma separators
- Transfer detail can be a modal, slide-over, or separate page — modal recommended for seamless browsing
- Desktop only

---

## Prompt 16: Global States & Feedback

### Context

URR needs consistent loading, empty, error, and success states across all pages and components. This prompt defines the shared state patterns and feedback components that are used application-wide. These patterns should be reusable and consistent, following shadcn/ui conventions.

### Requirements

**1. Skeleton Loading States:**
- Used on every page/component that loads data
- Pattern: gray shimmer rectangles matching the shape of real content
- Shimmer animation: gradient sweep from left to right, 1.5s loop, subtle
- Specific skeletons needed:
  - **Card skeleton**: rounded rectangle (~card dimensions), 2-3 text line placeholders below
  - **Hero banner skeleton**: full-width rectangle, ~360px height
  - **Avatar skeleton**: circle (matching avatar size)
  - **Text skeleton**: thin rectangles (80% width for titles, 60% for descriptions)
  - **Table skeleton**: multiple rows of thin rectangles
  - **Seat map skeleton**: large rectangle with subtle section outlines
- All skeletons use `animate-pulse` (Tailwind) or custom shimmer gradient

**2. Empty States:**
- Consistent pattern across all pages:
  - Centered illustration or large icon (muted color)
  - Title (medium, 18px): describes what's empty
  - Description (secondary text): explains what to do next
  - CTA button if applicable
- Specific empty states:

  | Location | Title | Description | CTA |
  |----------|-------|-------------|-----|
  | Home (no follows) | "아티스트를 팔로우해보세요" | "팔로우한 아티스트의 공연 정보를 받을 수 있습니다" | [아티스트 찾기] |
  | Ticket Wallet (empty) | "아직 예매한 티켓이 없습니다" | "공연을 둘러보고 예매해보세요!" | [공연 찾기] |
  | Transfer (no listings) | "현재 양도 가능한 티켓이 없습니다" | "새로운 양도 등록을 기다려주세요" | — |
  | Search (no results) | "검색 결과가 없습니다" | "'[query]'에 대한 결과를 찾을 수 없습니다" | — |
  | Notifications (empty) | "아직 알림이 없습니다" | "새로운 소식이 있으면 여기에 표시됩니다" | — |
  | Memberships (empty) | "가입한 멤버십이 없습니다" | "아티스트 페이지에서 멤버십에 가입하세요" | [아티스트 찾기] |

**3. Error Modals:**
- shadcn/ui Dialog component pattern
- Structure: icon (⚠️ or ❌) + title (bold) + description + action buttons
- Specific error modals:

  | Error | Title | Description | Actions |
  |-------|-------|-------------|---------|
  | Seat expired | "선택 시간이 만료되었습니다" | "좌석이 해제되었습니다." | [구역 선택으로] / [나가기] |
  | Payment failed | "결제에 실패했습니다" | Error reason + "좌석이 60초간 유지됩니다." | [다시 시도] / [나가기] |
  | VQA exhausted | "모든 시도를 사용했습니다" | "다음 예매 회차에 다시 도전해주세요." | [이벤트 페이지로] |
  | Queue exit | "대기열을 이탈하시겠습니까?" | "순번이 취소됩니다." | [머무르기] / [나가기] |
  | Duplicate CI | "이미 가입된 계정이 있습니다" | "가입 경로: [provider]" | [로그인 하기] |
  | Transfer escrow fail | "양도를 완료할 수 없습니다" | "결제가 이루어지지 않았습니다." | [확인] |
  | Network error | "연결에 문제가 발생했습니다" | "네트워크 상태를 확인해주세요." | [다시 시도] |

- All modals closable via Escape and backdrop click (EXCEPT VQA during question and queue exit — only closable via buttons)

**4. Toast Notifications:**
- Position: top-right of viewport, stacked
- Structure: icon (type) + message text + optional [×] close button
- Types:
  - Success (green icon): "멜론 연동이 완료되었습니다", "결제가 완료되었습니다"
  - Error (red icon): "오류가 발생했습니다"
  - Info (blue icon): "좌석이 선택되었습니다", "대기열에 진입했습니다"
  - Warning (amber icon): "좌석 선택 시간이 1분 남았습니다"
- Auto-dismiss: 5 seconds
- Animation: slide in from right (300ms), auto-dismiss fade out (200ms)
- Max 3 visible toasts stacked

**5. WebSocket Disconnection Banner (Queue):**
- Thin banner at top of content area (below top bar)
- Yellow/amber background: "연결이 끊어졌습니다. 재연결 중..." with spinner
- On reconnect: green flash → "연결되었습니다" → auto-dismiss after 2s
- Mock: toggle with a developer button or simulate random disconnect/reconnect

### States

All components above should be reusable React components:
- `<Skeleton variant="card|text|avatar|banner|table|map" />`
- `<EmptyState icon title description cta />`
- `<ErrorModal type onAction onClose />`
- `<Toast type message duration />`
- `<ConnectionBanner status="connected|disconnected|reconnecting" />`

### Constraints

- Follow shadcn/ui patterns and styling
- Toast uses shadcn/ui Toast or Sonner library
- Skeleton should be CSS-only (no JS animation libraries needed)
- All text in Korean
- Keep error messages human-readable and actionable
- Every error provides a recovery action — no dead ends
- Desktop only

---

## Prompt 17: Animation & Interaction Polish

### Context

This final prompt adds animation polish and interaction refinements across the entire URR application. All animations should feel smooth, purposeful, and fast — never sluggish. The platform handles time-pressured booking flows, so animations must enhance rather than obstruct the experience. Use CSS transitions and minimal JS animation (no heavy animation libraries).

### Requirements

**Transition Specifications:**

| Element | Animation | Duration | Easing | Trigger |
|---------|-----------|----------|--------|---------|
| Sidebar collapse/expand | Width slide (240px ↔ 64px) | 250ms | ease-out | Toggle button click |
| Left panel collapse/expand | Width slide (360px ↔ 48px) | 200ms | ease-out | Toggle button click |
| Page navigation content | Fade-in | 150ms | ease-in | Route change |
| Modal open | Fade + scale (95% → 100%) | 200ms | ease-out | Modal trigger |
| Modal close | Fade + scale (100% → 95%) | 150ms | ease-in | Close/backdrop/Escape |
| VQA correct answer | Green background flash on option | 300ms | — | Correct selection |
| VQA incorrect answer | Red flash + horizontal shake (±3px, 3 cycles) | 400ms | — | Wrong selection |
| Queue position update | Number counter roll (digit scroll) | 500ms | ease-in-out | Position data change |
| Tooltip show | Fade-in after delay | 300ms delay + 150ms fade | ease-out | Mouse enter (with 300ms hover delay) |
| Tooltip hide | Fade-out | 100ms | ease-in | Mouse leave |
| Seat hover | Blue border highlight + tooltip fade-in | 100ms | ease-out | Mouse enter |
| Seat selection | Fill color transition (green → blue) | 150ms | ease-out | Click |
| Seat deselection | Fill color transition (blue → green) | 150ms | ease-out | Click |
| Timer color (→ yellow at 1:00) | Smooth text color transition | 300ms | ease | Timer ≤ 60s |
| Timer color (→ red at 0:30) | Smooth color transition + pulse start | 300ms + 1s loop | ease | Timer ≤ 30s |
| Timer pulse (sub-30s) | Scale 1.0 → 1.05 → 1.0 | 1s | ease-in-out (loop) | Timer ≤ 30s |
| Payment success confetti | Particle burst from center-top | 800ms | — | Payment confirmed |
| Toast enter | Slide in from right | 300ms | ease-out | Toast created |
| Toast exit | Fade out | 200ms | ease-in | Auto-dismiss / close |
| Card hover | box-shadow increase + translateY(-1px) | 150ms | ease-out | Mouse enter |
| Card unhover | box-shadow decrease + translateY(0) | 150ms | ease-in | Mouse leave |
| Skeleton shimmer | Gradient sweep left-to-right | 1.5s | linear (loop) | Loading state |
| Tab switch content | Fade crossfade | 150ms | ease | Tab click |
| Artist sub-menu expand | Height slide down | 200ms | ease-out | Chevron click |
| Artist sub-menu collapse | Height slide up | 150ms | ease-in | Chevron click |
| Hero banner transition | Crossfade | 500ms | ease-in-out | Auto-rotate / dot click |
| Onboarding step transition | Slide left (outgoing) + slide right (incoming) | 300ms | ease-out | Next step |
| [Book Now] countdown | Timer text update (no animation) | — | — | Every second |
| Queue probability update | Number fade transition | 300ms | ease | Data update |

**Hover State Specifications:**

| Element | Hover Effect |
|---------|-------------|
| Sidebar nav item | Background: accent/5 (5% opacity), border-radius |
| Sidebar artist item | Background: accent/5 |
| Card (event, artist, transfer, ticket) | shadow-sm → shadow-md, translateY(-1px) |
| Button (primary) | Slightly darker shade (darken 10%) |
| Button (secondary/outline) | Background: accent/5 tint |
| Button (ghost) | Background: slate-100 |
| SVG section polygon | Opacity 0.7 → 1.0, cursor: pointer |
| SVG seat circle (available) | Blue outline (2px), cursor: pointer |
| Tab item | Text color darken |
| Link text | Underline |
| Transfer card | Same as card + subtle border-accent |

**Focus State Specifications (Accessibility):**
- All interactive elements: visible focus ring (2px offset, accent color outline)
- Input focus: border changes to accent color
- Button focus: accent outline ring (offset 2px)
- Modal: trap focus within modal when open

**Special Animations:**

1. **Confetti (payment success):**
   - Use `canvas-confetti` or `react-confetti` library
   - Single burst from top-center, ~50 particles
   - Colors: accent, gold, green (festive)
   - Duration: 800ms burst, particles fade over 2s
   - Do NOT loop — one burst only

2. **Queue position counter roll:**
   - When position number changes (e.g., #47 → #42):
   - Each digit rolls (slides up/down to new value)
   - Staggered per digit (tens digit first, then ones, 100ms stagger)
   - Total animation: 500ms

3. **VQA shake animation:**
   ```css
   @keyframes shake {
     0%, 100% { transform: translateX(0); }
     20%, 60% { transform: translateX(-3px); }
     40%, 80% { transform: translateX(3px); }
   }
   ```
   - Duration: 400ms, applied to the selected wrong answer card

4. **Timer pulse (sub-30s):**
   ```css
   @keyframes pulse-timer {
     0%, 100% { transform: scale(1); }
     50% { transform: scale(1.05); }
   }
   ```
   - Duration: 1s, infinite loop, only when timer ≤ 30s

**Performance Guidelines:**
- Use CSS transitions/animations wherever possible (GPU-accelerated: transform, opacity)
- Avoid animating layout properties (width, height, padding) except for sidebar/panel collapse (use transform: scaleX or width with will-change)
- Use `will-change: transform` on elements that animate frequently
- Skeleton shimmer: CSS gradient animation only (no JS)
- Confetti: use canvas-based library (not DOM particles)
- Seat map: SVG transitions (fill, opacity) are GPU-friendly

### Constraints

- No heavy animation libraries (Framer Motion is acceptable if already in project, but prefer CSS transitions)
- All animations must be able to be disabled via `prefers-reduced-motion` media query
- Confetti fires once per payment success — not on re-render
- Timer animations should not interfere with timer accuracy
- Sidebar/panel collapse must not cause content layout shift jank — use proper transition sizing
- Desktop only — no touch gesture animations
- Keep total animation JS bundle impact minimal

---

## Quality Checklist

- [x] Every measurement from spec captured (sidebar 240/64px, left panel 360/48px, top bar 56px, timer 3min, VQA 30s/question, max 4 seats, etc.)
- [x] Every state from spec captured (14 booking states, 4 VQA states, 3 home states, 4 wallet states, 4 seller states, 5 buyer states, 4 search states, 10 onboarding states, 2 notification states)
- [x] Every interaction from spec captured (sidebar collapse, seat selection, VQA answering, queue waiting, timer countdown, payment, transfer, search, onboarding)
- [x] No prompt references another prompt (each is self-contained with full context)
- [x] Build order respects dependencies (foundation → shell → pages → complex flows → states → polish)
- [x] Each prompt could be given to someone with no context about URR

---

## Source References

- **UX Spec**: `Docs/prd-ux-spec.md` (6-pass UX specification)
- **PRD**: `Docs/prd.md` v1.1 (Post-Clarification)
- **UX Brainstorming**: `Docs/ux-brainstorming.md`
- **Design Reference**: Suno AI (layout) + shadcn/ui (components)
- **Constraints**: Desktop only, light mode, mock data, React prototype
