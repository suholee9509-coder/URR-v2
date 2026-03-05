# SubTask Design System v1.1

> Single Source of Truth for SubTask UI development.
> All components, tokens, and patterns documented here must be referenced during every build phase.

---

## 1. Design Principles

| Principle | Description |
|---|---|
| **Minimal · High-density** | Linear/ClickUp 레퍼런스. 불필요한 장식 배제, 정보 밀도 극대화 |
| **Selective Color** | 색상은 **상태(Status)** 와 **우선순위(Priority)** 에만 사용. 나머지는 모노크롬 |
| **Functional First** | 모든 시각적 요소는 기능적 목적이 있어야 함. 장식 금지 |
| **Border over Shadow** | 요소 분리는 그림자가 아닌 border 우선 |
| **Grid Alignment** | 리스트/카드에서 메타데이터 열은 고정 너비 grid로 정렬 |

**Font**: Pretendard Variable (영문/한글 통합)
**Letter-spacing**: -0.015em (전역)
**Color Format**: oklch

---

## 2. Color Tokens

### 2.1 Semantic (Base)

| CSS Variable | Light Value | Dark Value | Tailwind Class | Usage |
|---|---|---|---|---|
| `--background` | `oklch(1 0 0)` | `oklch(0.13 0.005 268)` | `bg-background` | 메인 콘텐츠 배경 |
| `--foreground` | `oklch(0.145 0 0)` | `oklch(0.985 0 0)` | `text-foreground` | 기본 텍스트 |
| `--card` | `oklch(1 0 0)` | `oklch(0.17 0.008 268)` | `bg-card` | 카드/패널 배경 |
| `--primary` | `oklch(0.49 0.22 268)` | `oklch(0.65 0.2 268)` | `bg-primary` | CTA, 활성 상태, 링크 (인디고) |
| `--primary-foreground` | `oklch(0.985 0 0)` | `oklch(0.15 0.01 268)` | `text-primary-foreground` | Primary 위 텍스트 |
| `--secondary` | `oklch(0.968 0.003 264)` | `oklch(0.22 0.008 268)` | `bg-secondary` | 보조 인터랙티브 배경 |
| `--muted` | `oklch(0.968 0.003 264)` | `oklch(0.22 0.008 268)` | `bg-muted` | 비활성/배경 레이어 |
| `--muted-foreground` | `oklch(0.556 0 0)` | `oklch(0.65 0 0)` | `text-muted-foreground` | 보조 텍스트, 힌트, 메타데이터 |
| `--accent` | `oklch(0.955 0.005 264)` | `oklch(0.25 0.01 268)` | `bg-accent` | hover/selected 배경 |
| `--destructive` | `oklch(0.577 0.245 27)` | `oklch(0.704 0.191 22)` | `bg-destructive` | 에러, 삭제 액션 |
| `--border` | `oklch(0.922 0.004 264)` | `oklch(1 0 0 / 10%)` | `border-border` | 기본 border |
| `--input` | `oklch(0.922 0.004 264)` | `oklch(1 0 0 / 15%)` | `border-input` | Input border |
| `--ring` | `oklch(0.49 0.22 268)` | `oklch(0.65 0.2 268)` | `ring-ring` | Focus ring |

### 2.2 Sidebar (Dark Pattern)

| CSS Variable | Light Value | Tailwind Class | Usage |
|---|---|---|---|
| `--sidebar` | `oklch(0.155 0.012 268)` | `bg-sidebar` | Icon Rail + Context Sidebar 배경 |
| `--sidebar-foreground` | `oklch(0.82 0 0)` | `text-sidebar-foreground` | 사이드바 텍스트 |
| `--sidebar-primary` | `oklch(0.62 0.2 268)` | `bg-sidebar-primary` | 활성 프로젝트 아이콘 |
| `--sidebar-accent` | `oklch(0.22 0.015 268)` | `bg-sidebar-accent` | hover/active 아이템 배경 |
| `--sidebar-border` | `oklch(1 0 0 / 8%)` | `border-sidebar-border` | 사이드바 내 구분선 |

### 2.3 Status

| CSS Variable | Light Value | Tailwind Class | Usage |
|---|---|---|---|
| `--status-todo` | `oklch(0.63 0.024 264)` | `text-status-todo` | To Do 상태 (회색) |
| `--status-in-progress` | `oklch(0.55 0.2 260)` | `text-status-in-progress` | In Progress 상태 (파랑) |
| `--status-done` | `oklch(0.55 0.17 152)` | `text-status-done` | Done 상태 (초록) |

배경 사용 시 opacity: `bg-status-todo/10`, `bg-status-in-progress/10`, `bg-status-done/10`

### 2.4 Priority

| CSS Variable | Light Value | Tailwind Class | Usage |
|---|---|---|---|
| `--priority-low` | `oklch(0.63 0.024 264)` | `text-priority-low` | Low (회색) |
| `--priority-medium` | `oklch(0.8 0.15 84)` | `text-priority-medium` | Medium (앰버) |
| `--priority-high` | `oklch(0.7 0.18 50)` | `text-priority-high` | High (오렌지) |
| `--priority-urgent` | `oklch(0.577 0.245 27)` | `text-priority-urgent` | Urgent (빨강) |

### 2.5 Edge (Progress View)

| CSS Variable | Light Value | Tailwind Class | Usage |
|---|---|---|---|
| `--edge-flow` | `oklch(0.82 0.005 264)` | `text-edge-flow` | 실선 — 마일스톤 순서 연결 |
| `--edge-dependency` | `oklch(0.49 0.22 268)` | `text-edge-dependency` | 점선 — 태스크 종속 관계 |

### 2.6 AI

| CSS Variable | Light Value | Tailwind Class | Usage |
|---|---|---|---|
| `--ai-bg` | `oklch(0.94 0.04 295)` | `bg-ai-bg` | AI 뱃지/영역 배경 (바이올렛) |
| `--ai-text` | `oklch(0.42 0.15 295)` | `text-ai-text` | AI 뱃지/영역 텍스트 |

---

## 3. Typography Scale

**Font Family**: `'Pretendard Variable', 'Pretendard', -apple-system, ...sans-serif`
**Letter Spacing**: `-0.015em` (전역, body에 적용)

### Title (leading-tight)

| Token | Size | Weight | Tailwind | Usage |
|---|---|---|---|---|
| T1 | 24px | Bold (700) | `text-2xl font-bold` | 페이지 타이틀, 대시보드 숫자 |
| T2 | 20px | SemiBold (600) | `text-xl font-semibold` | 섹션 헤더 |
| T3 | 18px | SemiBold (600) | `text-lg font-semibold` | 카드/패널 제목 |
| T4 | 16px | SemiBold (600) | `text-base font-semibold` | 사이드바 섹션 라벨 |

### Body (leading-normal)

| Token | Size | Weight | Tailwind | Usage |
|---|---|---|---|---|
| B1 | 16px | Regular (400) | `text-base` | 본문 텍스트 |
| B2 | 14px | Medium (500) | `text-sm font-medium` | Button, 카드 상세 |
| B3 | 14px | Regular (400) | `text-sm` | Input, 필드 값 (기본 바디) |
| B4 | 13px | Regular (400) | `text-[13px]` | 보조 텍스트, 설명 |

### Caption (leading-tight)

| Token | Size | Weight | Tailwind | Usage |
|---|---|---|---|---|
| C1 | 12px | SemiBold (600) | `text-xs font-semibold` | Badge, StatusBadge 라벨 |
| C2 | 12px | Medium (500) | `text-xs font-medium` | 타임스탬프, 메타데이터 |
| C3 | 11px | Regular (400) | `text-[11px]` | AiBadge, 캡션, 힌트 |
| C4 | 10px | Medium (500) | `text-[10px] font-medium` | 단축키 힌트, 라벨 태그 |

---

## 4. Spacing, Radius & Shadows

### Border Radius

| Token | Value | Tailwind | Usage |
|---|---|---|---|
| sm | `calc(0.5rem - 4px)` = 4px | `rounded-sm` | 뱃지 내부, 작은 요소 |
| md | `calc(0.5rem - 2px)` = 6px | `rounded-md` | 버튼, 인풋 |
| lg | `0.5rem` = 8px | `rounded-lg` | 카드, 패널 |
| xl | `calc(0.5rem + 4px)` = 12px | `rounded-xl` | MilestoneNode, 모달 |
| full | 9999px | `rounded-full` | 아바타, pill badge |

### Shadows

> **원칙: Border 기반 분리를 우선하고, 깊이감이 필요한 경우에만 shadow 사용.**

| Token | Tailwind | Usage |
|---|---|---|
| xs | `shadow-xs` | 미세한 구분 (버튼) |
| sm | `shadow-sm` | 카드 기본 |
| default | `shadow` | 드롭다운 |
| md | `shadow-md` | 호버 시 카드 승격 |
| lg | `shadow-lg` | 모달, 패널 |

### Z-Index Layers

| Z-Index | Tailwind | Usage |
|---|---|---|
| 0 | `z-0` | Canvas / Content |
| 10 | `z-10` | Sidebar / Bottom bar |
| 20 | `z-20` | Right panel overlay |
| 30 | `z-30` | Chatbot panel |
| 40 | `z-40` | Modal / Dropdown |
| 50 | `z-50` | Toast |

---

## 5. Component Catalog

### 5.1 StatusBadge

**File**: `src/components/subtask/StatusBadge.tsx`

| Prop | Type | Default | Description |
|---|---|---|---|
| `status` | `IssueStatus` | required | `'todo' \| 'in_progress' \| 'done'` |
| `size` | `'default' \| 'sm'` | `'default'` | 아이콘 크기: default=16px, sm=14px |
| `iconOnly` | `boolean` | `false` | `true`: 아이콘만 표시 (카드/행에서 사용) |
| `className` | `string` | — | 추가 클래스 |

**Icons**: Linear 스타일 커스텀 SVG
- Todo: 빈 원형 (strokeWidth 2)
- In Progress: 반원 채움 (우측 반원 fill)
- Done: 완전 채움 원형 + 흰색 체크마크

**Usage Rule**: TaskCard, TaskRow, MilestoneNode 내에서는 항상 `iconOnly` 사용

```tsx
<StatusBadge status="in_progress" />           // 아이콘 + 라벨
<StatusBadge status="done" iconOnly size="sm" /> // 카드/행에서 아이콘만
```

### 5.2 PriorityBadge

**File**: `src/components/subtask/PriorityBadge.tsx`

| Prop | Type | Default | Description |
|---|---|---|---|
| `priority` | `IssuePriority` | required | `'low' \| 'medium' \| 'high' \| 'urgent'` |
| `size` | `'default' \| 'sm'` | `'default'` | default=12px bars, sm=10px bars |
| `className` | `string` | — | 추가 클래스 |

**Icons**: 4개 bar SVG (1~4개 활성화, 비활성 bar는 opacity 0.2)

```tsx
<PriorityBadge priority="high" size="sm" />
```

### 5.3 AiBadge

**File**: `src/components/subtask/AiBadge.tsx`

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | `string` | `'AI'` | 표시 텍스트 |
| `className` | `string` | — | 추가 클래스 |

스타일: `bg-ai-bg text-ai-text`, Sparkles 아이콘 (11px), 텍스트 11px

```tsx
<AiBadge />                    // "AI"
<AiBadge label="AI Generated" /> // 커스텀 라벨
```

### 5.4 ProgressRing

**File**: `src/components/subtask/ProgressRing.tsx`

| Prop | Type | Default | Description |
|---|---|---|---|
| `percent` | `number` | required | 0~100 진행률 |
| `size` | `number` | `32` | SVG 크기 (px) |
| `strokeWidth` | `number` | `3` | 선 두께 |
| `showLabel` | `boolean` | `true` | 중앙 퍼센트 숫자 표시 |
| `className` | `string` | — | 추가 클래스 |

**Color Logic**:
- 0~49%: `text-muted-foreground`
- 50~99%: `text-status-in-progress`
- 100%: `text-status-done`

```tsx
<ProgressRing percent={65} size={28} strokeWidth={2.5} />
<ProgressRing percent={100} size={24} strokeWidth={2} showLabel={false} /> // 카드 내
```

### 5.5 MilestoneNode

**File**: `src/components/subtask/MilestoneNode.tsx`

| Prop | Type | Default | Description |
|---|---|---|---|
| `milestone` | `Milestone` | required | 마일스톤 데이터 |
| `defaultExpanded` | `boolean` | `false` | 초기 펼침 상태 |
| `className` | `string` | — | 추가 클래스 |

**Layout**: 260px 고정 너비, rounded-xl, border + shadow-sm
**Collapsed 표시**: Chevron + Title + ProgressRing + Sparkline + TaskCount + DepartmentBar
**Expanded 표시**: + TaskCardInner 리스트 (5개 페이지네이션)
**Connection Handles**: 좌/우 3px 원형 (border-2 border-edge-flow)

**Internal Sub-components** (외부 미노출):
- `Sparkline`: 활동 트렌드 SVG 라인 차트 (80x24)
- `DepartmentBar`: 부서별 수평 스택 바 (h-1.5, rounded-full)
- `TaskCardInner`: 간소화된 태스크 카드 (StatusBadge iconOnly + title + avatar)

### 5.6 TaskCard

**File**: `src/components/subtask/TaskCard.tsx`

| Prop | Type | Default | Description |
|---|---|---|---|
| `task` | `Issue` | required | 이슈 데이터 |
| `className` | `string` | — | 추가 클래스 |

**Grid Layout**: `grid-cols-[20px_1fr_80px_32px_28px_56px]`

| Column | Width | Content |
|---|---|---|
| 1 | 20px | StatusBadge (iconOnly) |
| 2 | 1fr | Title + AiBadge + Labels |
| 3 | 80px | PriorityBadge (right-aligned) |
| 4 | 32px | ProgressRing (centered) |
| 5 | 28px | Assignee Avatar (centered) |
| 6 | 56px | Due Date (right-aligned) |

스타일: `rounded-lg border bg-card px-4 py-3 hover:bg-accent/50`

### 5.7 TaskRow

**File**: `src/components/subtask/TaskRow.tsx`

| Prop | Type | Default | Description |
|---|---|---|---|
| `task` | `Issue` | required | 이슈 데이터 |
| `className` | `string` | — | 추가 클래스 |

**Grid Layout**: `grid-cols-[1fr_100px_120px_100px_80px_60px]`

| Column | Width | Content |
|---|---|---|
| 1 | 1fr | StatusBadge (iconOnly) + Title + AiBadge |
| 2 | 100px | Status Pill (bg-status-*/10 칩) |
| 3 | 120px | Assignee (Avatar + Name) |
| 4 | 100px | Due Date |
| 5 | 80px | PriorityBadge |
| 6 | 60px | ProgressRing (centered) |

**Table Header** (StyleGuidePage에서 사용):
```
grid-cols-[1fr_100px_120px_100px_80px_60px] bg-muted/50
```

### 5.8 Layout Components

**Directory**: `src/components/layout/`
**Barrel Export**: `src/components/layout/index.ts`

| Component | File | Description |
|---|---|---|
| `IconRail` | `IconRail.tsx` | Tier 1: 프로젝트 전환 (60px, full viewport height) |
| `ContextSidebar` | `ContextSidebar.tsx` | Tier 2: 네비게이션 (220px, full viewport height, 접기/펼기) |
| `SidebarNavItem` | `SidebarNavItem.tsx` | 재사용 네비 버튼 (URL 기반 active 판단) |
| `TeamSection` | `TeamSection.tsx` | 팀 아코디언 (CSS Grid accordion) |
| `BottomBar` | `BottomBar.tsx` | AI Assistant 바 (h-12, Content Area 내부에만 배치) |
| `RightPanelSlot` | `RightPanelSlot.tsx` | 우측 패널 슬롯 (420px, 현재 비활성) |
| `ContentArea` | `ContentArea.tsx` | React Router `<Outlet />` 래퍼 |
| `WorkspaceHeader` | `WorkspaceHeader.tsx` | 미사용 — 로고/이름이 IconRail/ContextSidebar 상단에 통합됨 |

#### IconRail

- 너비: `w-[60px]`, 배경: `bg-sidebar`, 우측 `border-r border-sidebar-border`
- 로고: `size-10 rounded-lg bg-sidebar-primary` (상단 고정)
- 프로젝트 아이콘: `size-10 rounded-lg`, Active 시 `ring-2 ring-sidebar-primary/50`
- Tooltip: shadcn Tooltip (`side="right"`, `sideOffset={8}`)
- 사이드바 토글: `PanelLeft` 아이콘 → `dispatch({ type: 'TOGGLE_SIDEBAR' })`
- 프로필: `size-10 rounded-full bg-sidebar-accent` (하단 고정)

#### ContextSidebar

- 너비: `w-[220px]` ↔ `w-0` (`transition-[width] duration-250 ease-in-out`)
- 내부 고정: `w-[220px] min-w-[220px]` (접힐 때 reflow 방지)
- 상단: 워크스페이스명 "SubTask" (`h-[52px]`, `text-sm font-semibold`)
- 우측 border: 펼침 시 `border-r border-sidebar-border`, 접힘 시 `border-r-0`
- 섹션: Search → Common Nav → Separator → Project Nav → Separator → Teams Accordion → Settings

#### SidebarNavItem

| Prop | Type | Default | Description |
|---|---|---|---|
| `icon` | `LucideIcon` | required | 아이콘 컴포넌트 |
| `label` | `string` | required | 표시 텍스트 |
| `path` | `string` | required | 라우트 경로 |
| `badge` | `string \| number` | — | 알림 뱃지 (pill, `bg-sidebar-primary`) |
| `indent` | `boolean` | `false` | 들여쓰기 `pl-8` (팀 하위 메뉴) |
| `className` | `string` | — | 추가 클래스 |

Active 판단: `pathname === path || pathname.startsWith(path + '/')`
Active 스타일: `bg-sidebar-accent text-sidebar-accent-foreground font-medium`

#### TeamSection

| Prop | Type | Description |
|---|---|---|
| `team` | `Team` | 팀 데이터 |
| `isExpanded` | `boolean` | 펼침 상태 |
| `onToggle` | `() => void` | 토글 콜백 |

- Chevron: `ChevronRight` → 펼침 시 `rotate-90` (`transition-transform duration-200`)
- 아코디언: `grid-rows-[0fr]` ↔ `grid-rows-[1fr]` (`transition-[grid-template-rows] duration-200`)
- 첫 펼침 시 자동 `/team/:teamId/issues` 네비게이션

#### BottomBar

- Content Area 하단 고정 (`h-12 shrink-0 border-t border-border bg-card`)
- 사이드바(IconRail + ContextSidebar) 영역에는 배치되지 않음
- 스타일: n8n AI Assistant 레퍼런스 (MessageSquare 아이콘 + "AI Assistant" + 힌트 텍스트)

### 5.9 shadcn/ui Base Components

| Component | File | Key Variants |
|---|---|---|
| Button | `ui/button.tsx` | 6 variants (default/secondary/outline/ghost/destructive/link), 8 sizes |
| Badge | `ui/badge.tsx` | 6 variants |
| Card | `ui/card.tsx` | CardHeader, CardTitle, CardDescription, CardContent, CardFooter |
| Input | `ui/input.tsx` | h-9 (36px), focus ring-[3px] |
| Avatar | `ui/avatar.tsx` | sm/default/lg sizes, AvatarGroup |
| Separator | `ui/separator.tsx` | horizontal/vertical |
| Tabs | `ui/tabs.tsx` | TabsList, TabsTrigger, TabsContent |
| Tooltip | `ui/tooltip.tsx` | TooltipProvider, TooltipTrigger, TooltipContent (Radix) |

신규 shadcn 컴포넌트 추가: `npx shadcn@latest add <component-name>`

---

## 6. Layout Patterns

### 6.1 App Shell (2-Tier Sidebar)

```
┌───────┬──────────┬───────────────────────┐
│ [S]   │ SubTask  │                       │
│ Logo  │ Name     │                       │
│───────│──────────│    Content Area       │
│ ST    │ Search   │    (flex-1)           │
│ MS    │ Nav      │    bg-background      │
│ MA    │ Teams    │    overflow-y-auto    │
│ +     │ ...      ├───────────────────────┤
│ ≡     │ Settings │  AI Assistant (h-12)  │
│ (JK)  │          │  bg-card, border-t    │
├───────┼──────────┼───────────────────────┤
│ 60px  │ 220px    │       flex-1          │
│ full  │ full     │ Content + BottomBar   │
│height │ height   │                       │
└───────┴──────────┴───────────────────────┘
```

**구조 원칙:**
- **IconRail + ContextSidebar**: 각각 full viewport height (사이드바 위에 수평 헤더 없음)
- **BottomBar**: Content Area 열 내부에만 배치 (사이드바 아래로 확장되지 않음)
- **RightPanelSlot**: Content Area 우측에 조건부 표시 (420px)
- Icon Rail: 로고 + 프로젝트 전환 (Discord/Slack 패턴)
- Context Sidebar: 워크스페이스명 + 내비게이션, 접기/펼기 애니메이션
- Content Area: 메인 콘텐츠 (`<Outlet />`) + Right Panel overlay

**MainLayout 구조** (`src/layouts/MainLayout.tsx`):
```tsx
<LayoutProvider>
  <TooltipProvider>
    <div className="flex h-screen w-screen overflow-hidden">
      <IconRail />          {/* full height */}
      <ContextSidebar />    {/* full height */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="flex flex-1 overflow-hidden">
          <ContentArea />   {/* flex-1, scrollable */}
          <RightPanelSlot /> {/* conditional 420px */}
        </div>
        <BottomBar />       {/* h-12, content area only */}
      </div>
    </div>
  </TooltipProvider>
</LayoutProvider>
```

### 6.2 Progress View (n8n-style)

```
[Milestone A] ——solid—— [Milestone B] ——solid—— [Milestone C]
                 |                        |
              dashed                   dashed
                 |                        |
            [Task dep]              [Task dep]
```

- 좌→우 가로 배치
- 실선 (solid 2px, edge-flow): 마일스톤 순서
- 점선 (dashed 2px, edge-dependency): 태스크 종속
- 양쪽 원형 엔드포인트 (화살표 X)

### 6.3 List View (Notion DB Style)

TaskRow grid + sticky table header. 정렬/필터 지원.

### 6.4 Routing Structure

```
/style-guide              → StyleGuidePage (앱 셸 밖, 독립)
/                         → redirect → /briefing

<MainLayout>              (앱 셸 적용)
  /briefing               → DailyBriefingPage
  /my-issues              → MyIssuesPage
  /inbox                  → InboxPage
  /project/:projectId
    /overview             → ProjectOverviewPage
    /issues               → ProjectIssuesPage
    /progress             → ProjectProgressPage
    /documents            → ProjectDocumentsPage
  /team/:teamId
    /issues               → TeamPage
    /progress             → TeamPage
</MainLayout>
```

네비게이션 active 상태는 React Router `useLocation()`으로 URL 기반 판단 (Context에 중복 저장하지 않음).

### 6.5 Animation Patterns

> **원칙: CSS/Tailwind transition만 사용. Framer Motion 사용 안 함.**

| 인터랙션 | 방법 | Duration |
|---|---|---|
| 사이드바 접기/펼기 | `transition-[width] duration-250 ease-in-out` | 250ms |
| 팀 아코디언 | `grid-rows-[0fr]/[1fr]` + `transition-[grid-template-rows] duration-200` | 200ms |
| Chevron 회전 | `transition-transform duration-200` + `rotate-90` | 200ms |
| 프로젝트 active ring | `transition-all duration-200` | 200ms |
| 네비 active 색상 | `transition-colors duration-150` | 150ms |

### 6.6 State Management (LayoutContext)

**File**: `src/contexts/LayoutContext.tsx`
**Hook**: `src/hooks/useLayout.ts`

```typescript
interface LayoutState {
  sidebarState: 'expanded' | 'collapsed'
  activeProjectId: string | null
  expandedTeamIds: Set<string>
  rightPanelOpen: boolean      // 현재 false (준비만)
  chatbotPanelOpen: boolean    // 현재 false (준비만)
}
```

| Action | Payload | Description |
|---|---|---|
| `TOGGLE_SIDEBAR` | — | expanded ↔ collapsed 전환 |
| `SET_SIDEBAR` | `SidebarState` | 직접 설정 |
| `SET_ACTIVE_PROJECT` | `string \| null` | 활성 프로젝트 변경 |
| `TOGGLE_TEAM` | `string` (teamId) | 팀 아코디언 토글 |
| `SET_RIGHT_PANEL` | `boolean` | 우측 패널 열기/닫기 |
| `SET_CHATBOT_PANEL` | `boolean` | AI 챗봇 패널 열기/닫기 |

---

## 7. Icon System

### Status Icons (Custom SVG)

| Status | Icon | Description |
|---|---|---|
| Todo | 빈 원형 | `<circle>` strokeWidth=2, fill=none |
| In Progress | 반원 채움 | `<circle>` + `<path>` 우측 반원 fill |
| Done | 채움+체크 | `<circle>` fill + 흰색 체크마크 path |

정의 위치: `src/components/subtask/StatusBadge.tsx` 내 TodoIcon, InProgressIcon, DoneIcon

### Priority Icon (Custom SVG)

4개 bar, 높이 비례 증가. 활성 bar = opacity 1, 비활성 = opacity 0.2
정의 위치: `src/components/subtask/PriorityBadge.tsx` 내 PriorityBars

### General Icons

Lucide React 사용. 주요 아이콘:
- Navigation: `Home`, `ListTodo`, `GitBranch`, `FileText`, `LayoutDashboard`, `Inbox`, `Calendar`
- Actions: `Plus`, `Search`, `Settings`, `Sparkles`
- UI: `ChevronDown`, `ChevronRight`, `Users`, `PanelLeft`, `MessageSquare`

---

## 8. Type System

### 8.1 Domain Types

**File**: `src/types/index.ts`

```typescript
type IssueStatus = 'todo' | 'in_progress' | 'done'
type IssuePriority = 'low' | 'medium' | 'high' | 'urgent'
type EdgeType = 'flow_order' | 'dependency'

interface Member { id, name, avatar?, team? }
interface Issue { id, title, status, priority, assignee?, dueDate?, labels[], isAiGenerated?, children?, completionPercent?, milestone? }
interface DepartmentRatio { department, ratio, color }
interface Milestone { id, title, tasks[], completionPercent, activityTrend[], departmentRatio[], taskCount }
```

Label Constants: `STATUS_LABELS`, `PRIORITY_LABELS`, `EDGE_LABELS`

### 8.2 Layout Types

**File**: `src/types/layout.ts`

```typescript
type SidebarState = 'expanded' | 'collapsed'

interface Project { id: string; name: string; initial: string }
interface Team { id: string; name: string }
interface NavItem { id: string; label: string; icon: LucideIcon; path: string; badge?: string | number }
interface ProjectNavItem { id: string; label: string; icon: LucideIcon; path: string }
```

### 8.3 Mock Data

**File**: `src/data/mock-layout.ts`

| Export | Type | Description |
|---|---|---|
| `MOCK_PROJECTS` | `Project[]` | 3개 프로젝트 (SubTask MVP, Marketing Site, Mobile App) |
| `MOCK_TEAMS` | `Team[]` | 4개 팀 (Design, Frontend, Backend, QA) |
| `COMMON_NAV_ITEMS` | `NavItem[]` | Daily Briefing, My Issues, Inbox(badge:3) |
| `PROJECT_NAV_ITEMS` | `ProjectNavItem[]` | Overview, Issues, Progress, Documents |
| `TEAM_SUB_NAV` | `ProjectNavItem[]` | Issues, Progress |
| `CURRENT_USER` | `object` | { id, name, initials } |

---

## 9. Rules (Do's & Don'ts)

### Do

- CSS 변수 토큰만 사용 (`bg-primary`, `text-status-done` 등)
- 컴포넌트 variant는 CVA (class-variance-authority)로 정의
- 클래스 병합은 `cn()` (`src/lib/utils.ts`)
- 카드/행 내 StatusBadge는 `iconOnly` 사용
- 새 도메인 컴포넌트는 `src/components/subtask/`에 생성하고 `index.ts` barrel export 업데이트
- 새 레이아웃 컴포넌트는 `src/components/layout/`에 생성하고 `index.ts` barrel export 업데이트
- 리스트/카드 열은 고정 너비 grid로 정렬
- shadcn/ui 기존 컴포넌트 우선 활용 → 커스텀은 최후 수단
- 애니메이션은 CSS/Tailwind transition만 사용 (Framer Motion 금지)
- 네비게이션 active 상태는 `useLocation()` URL 기반 판단 (Context 중복 저장 금지)
- IconRail + ContextSidebar는 반드시 full viewport height 유지
- BottomBar는 Content Area 열 내부에만 배치 (사이드바 아래로 확장 금지)

### Don't

- 하드코딩 색상값 사용 금지 (e.g., `bg-blue-500`, `#3B82F6`)
- 상태/우선순위 외 장식적 색상 사용 금지
- flex gap으로 메타데이터 정렬 금지 → grid 고정 열 사용
- 컴포넌트 내 직접 oklch 값 사용 금지 → CSS 변수 참조
- Lucide 외 아이콘 라이브러리 추가 금지
- StatusBadge에서 Lucide 아이콘 사용 금지 → 커스텀 SVG 아이콘 사용
- 사이드바 위에 수평 헤더 행 배치 금지 → 로고/이름은 각 사이드바 상단에 통합
- Framer Motion 등 외부 애니메이션 라이브러리 추가 금지

---

## File Structure

```
src/
├── components/
│   ├── ui/                    # shadcn/ui base (8 components)
│   │   ├── avatar.tsx
│   │   ├── badge.tsx
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── separator.tsx
│   │   ├── tabs.tsx
│   │   └── tooltip.tsx
│   ├── subtask/               # Domain components (7 components)
│   │   ├── index.ts
│   │   ├── StatusBadge.tsx
│   │   ├── PriorityBadge.tsx
│   │   ├── AiBadge.tsx
│   │   ├── ProgressRing.tsx
│   │   ├── MilestoneNode.tsx
│   │   ├── TaskCard.tsx
│   │   └── TaskRow.tsx
│   └── layout/                # Layout components (8 components)
│       ├── index.ts
│       ├── IconRail.tsx
│       ├── ContextSidebar.tsx
│       ├── SidebarNavItem.tsx
│       ├── TeamSection.tsx
│       ├── BottomBar.tsx
│       ├── RightPanelSlot.tsx
│       ├── ContentArea.tsx
│       └── WorkspaceHeader.tsx  # (미사용, 참조용 보관)
├── contexts/
│   └── LayoutContext.tsx       # Sidebar state (useReducer)
├── hooks/
│   └── useLayout.ts           # LayoutContext convenience hook
├── layouts/
│   └── MainLayout.tsx         # App shell (2-tier sidebar + content)
├── types/
│   ├── index.ts               # Domain types
│   └── layout.ts              # Layout types (Project, Team, NavItem, ...)
├── data/
│   └── mock-layout.ts         # Demo projects, teams, nav items
├── lib/
│   └── utils.ts               # cn() utility
├── pages/
│   ├── StyleGuidePage.tsx     # Visual demo (14 sections)
│   ├── DailyBriefingPage.tsx  # Placeholder
│   ├── MyIssuesPage.tsx       # Placeholder
│   ├── InboxPage.tsx          # Placeholder
│   ├── ProjectOverviewPage.tsx
│   ├── ProjectIssuesPage.tsx
│   ├── ProjectProgressPage.tsx
│   ├── ProjectDocumentsPage.tsx
│   └── TeamPage.tsx           # Placeholder
├── index.css                  # Design tokens (oklch, light/dark)
└── App.tsx                    # Router (nested routes)
```
