# PRD Clarification Session

**Source PRD**: prd.md
**Session Started**: 2026-03-03
**Depth Selected**: Medium
**Total Questions**: 10
**Progress**: 10/10

---

## Session Log

## Question 1
**Category**: Business Rules / Functional Requirements
**Ambiguity Identified**: PRD F03 only mentions "Melon OAuth → tier assignment" without defining scoring criteria or tier thresholds.
**Question Asked**: What specific streaming metrics determine each tier threshold?
**User Response**: Provided a complete **Fan Trust Score (FTS)** system — a 100-point composite score with 6 weighted factors:
- Ticket activity (30%): booking count, actual attendance rate, official transfer usage
- Streaming consumption (20%): Melon streaming count, music purchases, comeback concentration
- MD purchases (15%): physical album, official merch, comeback-season purchase pattern
- Platform activity (15%): community engagement, moderation history, official event participation
- Fan behavior trust (10%): anomaly detection (multi-account/macro), payment reliability, account stability
- Membership tenure (10%): duration, consecutive renewal

**Tier thresholds**: Diamond ≥85, Gold 66–84, Silver 0–65, Bronze = default (signup only).
**Gate conditions**: Upper tiers require minimum activity thresholds beyond score (e.g., Diamond needs 2+ concert attendances, 80%+ attendance rate, trust score avg ≥3).
**Score timing**: Confirmed at annual membership renewal; scores accumulate continuously but tier is locked per season.
**Bronze retroactive scoring**: When a Bronze user purchases membership, last 12 months of activity are retroactively scored for immediate tier assignment.

**Requirement Clarified**: Tier verification is NOT a simple Melon-only check. It's a multi-factor Fan Trust Score. PRD needs significant update to F03/F04 to reflect this comprehensive scoring model. MVP scope question: which factors are implementable in demo vs. deferred.

---

## Question 2
**Category**: Scope Boundaries / Functional Requirements
**Ambiguity Identified**: Fan Trust Score has 6 factors but MVP has limited data sources (no community, no MD store). Which factors are in MVP scope?
**Question Asked**: Fan Trust Score의 6개 평가 요소 중, MVP 단계에서 실제로 구현할 범위는?
**User Response**: **스트리밍(멜론)만.** 앨범 시리얼 인증은 검증이 어려워서 MVP에서 제외하기로 결정.
**Requirement Clarified**: MVP tier verification = Melon streaming data ONLY. Album serial (F04) is removed from MVP scope. PRD must update:
- F03: Melon streaming only → tier assignment
- F04: Move to post-MVP / production phase
- Tier thresholds in MVP: based on streaming factor alone (re-scaled to 100 points from the 20% weight)
- Full FTS (6 factors) is the production-grade system documented separately

---

## Question 3
**Category**: Edge Cases / Dependencies
**Ambiguity Identified**: Melon is the sole tier verification method in MVP. What happens when Melon API is unavailable or user doesn't use Melon?
**Question Asked**: 멜론 연동이 유일한 등급 산정 수단인데, 멜론 미사용자나 API 접근 불가 시 처리 방법은?
**User Response**: **브론즈 유지.** 멜론 미연동 시 브론즈(기본 등급)로 유지. 멜론 연동 완료 시에만 상위 등급 가능.
**Requirement Clarified**: No fallback verification in MVP. Melon link = only path to upper tiers. No screenshot review, no other platforms. Simple binary: Melon linked → scored → tier assigned / Not linked → Bronze stays. This simplifies F03 significantly for MVP.

---

## Question 4
**Category**: Technical Constraints / Scope Boundaries
**Ambiguity Identified**: Melon API integration requires partnership. How will demo handle this?
**Question Asked**: 멜론 스트리밍 데이터 연동 방식은? 카카오 OAuth → 멜론 자동 접근은 파트너십 없이 어렵다.
**User Response**: **데모는 Mock 데이터로 시뮬레이션.** 실제 멜론 연동 구현은 개발자 역할. 본인(Claude)의 역할은 **프론트엔드 퍼블리싱까지** 진행하여 개발자에게 전달하는 것.
**Requirement Clarified**:
- Demo/MVP = mock Melon data. No real API integration needed.
- Project scope for Claude: **UI/UX design + frontend publishing (HTML/CSS/React components)**. Not backend implementation.
- PRD serves as spec handoff to developers. Frontend deliverable is the visual prototype with mock data flows.
- This reframes the entire project: Claude builds the frontend shell, developers wire up real backends.

---

## Question 5
**Category**: Functional Requirements / UX
**Ambiguity Identified**: SVG seat map requires venue data. How realistic should the demo seat map be?
**Question Asked**: 데모에서 좌석맵은 실제 공연장 기반인지, 가상 공연장인지?
**User Response**: **실제 공연장 기반 (15,000석+ 규모)으로 SVG 제작 시도.** 완성도가 낮으면 사용자가 PNG 이미지를 제공할 예정. 이미지 위에 구역을 클릭 가능한 영역(image map 방식)으로 매핑하여 다음 단계로 진행.
**Requirement Clarified**:
- Seat map approach: SVG first (real venue reference, 15K+ seats) → fallback to PNG image map if SVG quality is insufficient
- 2-step interaction maintained: section click on overview → individual seat selection in zoomed view
- For PNG fallback: clickable regions (HTML image map or overlay divs) on the venue image
- User will provide venue image assets if needed

---

## Question 6
**Category**: Business Rules
**Ambiguity Identified**: Transfer market buyer eligibility is not defined. Can non-members buy transfer tickets?
**Question Asked**: 양도 티켓 구매 시 해당 아티스트 멤버십이 필수인가?
**User Response**: **멤버십 필수.** 양도 구매도 해당 아티스트 멤버십 보유자만 가능.
**Requirement Clarified**: Transfer market is a closed ecosystem — both seller and buyer must hold active membership for the artist. Non-members cannot access transfer listings. PRD F19 needs update to add membership check as prerequisite for purchase.

---

## Question 7
**Category**: Scope Boundaries / UX
**Ambiguity Identified**: Notification page is in the IA (GNB Sidebar) but push notifications are out of MVP scope. What about in-app notifications?
**Question Asked**: 알림 페이지 자체는 MVP에 포함하나요?
**User Response**: **UI만 포함.** 알림 페이지 UI는 있지만 Mock 데이터로 표시. 실제 알림 트리거는 미구현.
**Requirement Clarified**: Notification page = UI shell with mock data only. No real event triggers, no push. GNB notification icon stays with a badge. Page shows sample notifications (booking open, transfer complete, etc.) as static/mock data. This is a frontend-only deliverable.

---

## Question 8
**Category**: Scope Boundaries / Non-Functional Requirements
**Ambiguity Identified**: PRD says "mobile-first responsive" but Claude's deliverable is frontend publishing. Is mobile layout in scope?
**Question Asked**: 프론트엔드 퍼블리싱 시 모바일 레이아웃도 함께 구현하나요?
**User Response**: **데스크톱만.**
**Requirement Clarified**: Frontend publishing scope = desktop only. No mobile responsive layout. No mobile-specific components (bottom tab bar, compact views, etc.). This simplifies the deliverable significantly — GNB Sidebar layout + 2-Panel booking + standard desktop widths only.

---

## Question 9
**Category**: Functional Requirements / Data Requirements
**Ambiguity Identified**: VQA question types include image/video-based questions. Copyright and content sourcing for demo unclear.
**Question Asked**: 데모에서 실제 아티스트 콘텐츠(사진/영상)를 사용하나요?
**User Response**: **텍스트 질문만.** 이미지/영상 없이 텍스트 기반 질문만 구현.
**Requirement Clarified**: VQA in demo = text-only questions (e.g., lyrics completion, trivia, contextual questions). No image recognition, no video clips. Simplifies F09 significantly — no media storage, no copyright concerns. "Visual" in VQA name is aspirational for production; demo is text-based quiz only.

---

## Question 10
**Category**: Scope Boundaries / Acceptance Criteria
**Ambiguity Identified**: Deliverable fidelity is undefined — is it static pages or a working interactive prototype?
**Question Asked**: 정적 UI만 만드나요? 아니면 Mock 데이터로 상태 전환이 실제로 작동하는 인터랙티브 프로토타입을 만드나요?
**User Response**: **인터랙티브 프로토타입.**
**Requirement Clarified**: Deliverable = fully interactive React prototype with mock data. State transitions work (idle → vqa → queue → seats → payment). Buttons trigger actual navigation. Timers count down. Mock data populates all screens. This is NOT a static Figma-like export — it's a working frontend application that developers can extend with real APIs.

---

## Session Summary

### Key Clarifications (10 items)

1. **Tier scoring = Fan Trust Score (FTS)**: 6-factor composite (100pts) with gate conditions. NOT simple Melon check.
2. **MVP tier verification = Melon streaming ONLY**: Album serial removed from MVP scope.
3. **No Melon fallback**: Non-linked users stay Bronze. No screenshot review, no other platforms.
4. **Demo = Mock data**: Melon integration simulated. Claude's role = frontend publishing, not backend.
5. **Seat map**: Real venue reference (15K+ seats) SVG → fallback to PNG image map if needed.
6. **Transfer market = membership required**: Both seller and buyer must hold active artist membership.
7. **Notifications = UI shell only**: Page exists with mock data, no real triggers.
8. **Desktop only**: No mobile responsive layout in scope.
9. **VQA = text-only questions**: No image/video in demo. Text trivia only.
10. **Deliverable = interactive React prototype**: Working state transitions with mock data, not static pages.

### Remaining Ambiguities

1. **FTS threshold re-scaling for MVP**: With only streaming factor (20% weight in full system), how are Diamond/Gold/Silver thresholds re-scaled to 100 points?
2. **Specific Melon mock data structure**: What fields are simulated for the streaming history?
3. **Venue selection**: Which specific venue (KSPO Dome? Gocheok Dome?) for the seat map reference?
4. **Seed data volume**: How many artists, events, and VQA questions for the demo?

### Priority for Unresolved Items

1. Venue selection → needed before seat map SVG work
2. FTS re-scaling → needed before tier assignment UI logic
3. Seed data volume → needed before mock data creation
4. Melon mock data structure → can be defined during implementation
