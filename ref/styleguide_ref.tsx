import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarGroup } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { LabelBadge } from '@/components/ui/label-badge'
import { CompletionBadge } from '@/components/ui/completion-badge'
import { ToggleChip } from '@/components/ui/toggle-chip'
import { FilterDropdown } from '@/components/issues/FilterDropdown'
import {
  StatusBadge,
  PriorityBadge,
  AiBadge,
  ProgressRing,
  MilestoneNode,
  TaskCard,
  TaskRow,
} from '@/components/subtask'
import type { IssueStatus, IssuePriority, Issue, Milestone } from '@/types'
import { STATUS_LABELS, PRIORITY_LABELS } from '@/types'
import {
  Search,
  Plus,
  Settings,
  LayoutDashboard,
  ListTodo,
  GitBranch,
  FileText,
  Users,
  Inbox,
  Calendar,
  Sparkles,
  Home,
} from 'lucide-react'

// ---------------------------------------------------------------------------
// Sample Data
// ---------------------------------------------------------------------------

const sampleMember = { id: 'm1', name: 'John Kim', team: 'FE' }
const sampleMember2 = { id: 'm2', name: 'Sarah Lee', team: 'Design' }
const sampleMember3 = { id: 'm3', name: 'Mike Park', team: 'BE' }

const sampleTasks: Issue[] = [
  {
    id: 't1', title: 'Design login page wireframe', status: 'done', priority: 'high',
    assignee: sampleMember2, dueDate: 'Mar 5', labels: ['Design'], isAiGenerated: false,
    completionPercent: 100,
  },
  {
    id: 't2', title: 'Implement authentication API', status: 'in_progress', priority: 'urgent',
    assignee: sampleMember3, dueDate: 'Mar 8', labels: ['Backend', 'Auth'], isAiGenerated: true,
    completionPercent: 60,
  },
  {
    id: 't3', title: 'Build login form component', status: 'in_progress', priority: 'high',
    assignee: sampleMember, dueDate: 'Mar 10', labels: ['Frontend'], isAiGenerated: true,
    completionPercent: 40,
  },
  {
    id: 't4', title: 'Write unit tests for auth flow', status: 'todo', priority: 'medium',
    assignee: sampleMember, dueDate: 'Mar 12', labels: ['QA'], isAiGenerated: false,
  },
  {
    id: 't5', title: 'Set up OAuth2 provider config', status: 'todo', priority: 'low',
    dueDate: 'Mar 15', labels: ['DevOps'], isAiGenerated: false,
  },
  {
    id: 't6', title: 'Create password reset flow', status: 'todo', priority: 'medium',
    assignee: sampleMember3, labels: ['Backend'], isAiGenerated: true,
  },
]

const sampleMilestone: Milestone = {
  id: 'ms1',
  title: 'User Authentication',
  tasks: sampleTasks,
  completionPercent: 35,
  activityTrend: [2, 5, 3, 8, 6, 4, 7, 9, 5, 3],
  departmentRatio: [
    { department: 'Design', ratio: 20, color: 'oklch(0.7 0.15 330)' },
    { department: 'FE', ratio: 35, color: 'oklch(0.55 0.2 260)' },
    { department: 'BE', ratio: 30, color: 'oklch(0.6 0.17 152)' },
    { department: 'QA', ratio: 15, color: 'oklch(0.75 0.15 84)' },
  ],
  taskCount: { done: 1, total: 6 },
}

const sampleMilestoneDone: Milestone = {
  id: 'ms2',
  title: 'Project Setup',
  tasks: sampleTasks.slice(0, 2).map(t => ({ ...t, status: 'done' as IssueStatus, completionPercent: 100 })),
  completionPercent: 100,
  activityTrend: [8, 9, 7, 6, 5, 3, 2, 1, 1, 0],
  departmentRatio: [
    { department: 'FE', ratio: 50, color: 'oklch(0.55 0.2 260)' },
    { department: 'BE', ratio: 50, color: 'oklch(0.6 0.17 152)' },
  ],
  taskCount: { done: 2, total: 2 },
}

// ---------------------------------------------------------------------------
// Layout Helpers
// ---------------------------------------------------------------------------

function Section({ id, number, title, children }: { id: string; number: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-20">
      <div className="mb-6">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{number}</span>
        <h2 className="text-2xl font-bold mt-1">{title}</h2>
      </div>
      {children}
    </section>
  )
}

function SubSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      {children}
    </div>
  )
}

function Swatch({ label, className, textClass }: { label: string; className: string; textClass?: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className={`h-14 w-14 rounded-lg border border-border ${className}`} />
      <span className={`text-[11px] text-center leading-tight max-w-16 ${textClass ?? 'text-muted-foreground'}`}>{label}</span>
    </div>
  )
}

function DemoBox({ label, children }: { label?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-dashed border-border p-4">
      {label && <p className="text-xs text-muted-foreground mb-3 font-medium">{label}</p>}
      {children}
    </div>
  )
}

// ---------------------------------------------------------------------------
// TOC
// ---------------------------------------------------------------------------

const TOC = [
  { id: 'colors', number: '01', title: '색상 토큰' },
  { id: 'typography', number: '02', title: '타이포그래피' },
  { id: 'spacing', number: '03', title: '간격 · 라디우스 · 그림자' },
  { id: 'button', number: '04', title: '버튼' },
  { id: 'badge', number: '05', title: '뱃지' },
  { id: 'status-badge', number: '06', title: 'StatusBadge' },
  { id: 'priority-badge', number: '07', title: 'PriorityBadge' },
  { id: 'card', number: '08', title: '카드' },
  { id: 'avatar-progress', number: '09', title: '아바타 · ProgressRing' },
  { id: 'milestone-node', number: '10', title: 'MilestoneNode' },
  { id: 'task-components', number: '11', title: 'TaskCard · TaskRow' },
  { id: 'edge-styles', number: '12', title: '엣지 스타일' },
  { id: 'sidebar', number: '13', title: '사이드바 컴포넌트' },
  { id: 'input', number: '14', title: '입력 필드' },
  { id: 'label-badge', number: '15', title: 'LabelBadge' },
  { id: 'completion-badge', number: '16', title: 'CompletionBadge' },
  { id: 'toggle-chip', number: '17', title: 'ToggleChip' },
  { id: 'filter-dropdown', number: '18', title: 'FilterDropdown' },
]

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function StyleGuidePage() {
  const [activeSection, setActiveSection] = useState('colors')

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Sidebar TOC */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-56 flex-col border-r border-border bg-background lg:flex">
        <div className="flex h-14 items-center border-b border-border px-5">
          <span className="text-sm font-semibold">Style Guide</span>
          <Badge variant="secondary" className="ml-auto text-[10px]">v1.0</Badge>
        </div>
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {TOC.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={() => setActiveSection(item.id)}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-foreground ${
                activeSection === item.id ? 'bg-accent text-foreground font-medium' : 'text-muted-foreground'
              }`}
            >
              <span className="text-xs font-mono text-muted-foreground/60 w-5">{item.number}</span>
              {item.title}
            </a>
          ))}
        </nav>
        <div className="border-t border-border px-5 py-3">
          <span className="text-[11px] text-muted-foreground">SubTask Design System v1.0</span>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 lg:pl-56">
        <header className="sticky top-0 z-30 flex h-14 items-center border-b border-border bg-background/95 px-6 backdrop-blur-sm">
          <h1 className="text-lg font-semibold">SubTask — Design System</h1>
          <span className="ml-3 text-xs text-muted-foreground">Pretendard · shadcn/ui · Tailwind v4</span>
        </header>

        <div className="mx-auto max-w-4xl space-y-16 px-6 py-10">

          {/* ============================================================ */}
          {/* 01. Color Tokens */}
          {/* ============================================================ */}
          <Section id="colors" number="01" title="색상 토큰 (Color Tokens)">
            <p className="text-sm text-muted-foreground mb-6">oklch 기반 시맨틱 토큰. 5개 카테고리: 시맨틱, 상태, 우선순위, 엣지, AI.</p>

            <SubSection title="시맨틱 컬러">
              <div className="flex flex-wrap gap-4">
                <Swatch label="Background" className="bg-background" />
                <Swatch label="Foreground" className="bg-foreground" />
                <Swatch label="Primary" className="bg-primary" />
                <Swatch label="Secondary" className="bg-secondary" />
                <Swatch label="Muted" className="bg-muted" />
                <Swatch label="Accent" className="bg-accent" />
                <Swatch label="Destructive" className="bg-destructive" />
                <Swatch label="Border" className="bg-border" />
                <Swatch label="Input" className="bg-input" />
                <Swatch label="Ring" className="bg-ring" />
                <Swatch label="Card" className="bg-card" />
              </div>
            </SubSection>

            <SubSection title="이슈 상태 컬러">
              <div className="flex flex-wrap gap-4">
                <Swatch label="To Do" className="bg-status-todo" />
                <Swatch label="In Progress" className="bg-status-in-progress" />
                <Swatch label="Done" className="bg-status-done" />
              </div>
            </SubSection>

            <SubSection title="우선순위 컬러">
              <div className="flex flex-wrap gap-4">
                <Swatch label="Low" className="bg-priority-low" />
                <Swatch label="Medium" className="bg-priority-medium" />
                <Swatch label="High" className="bg-priority-high" />
                <Swatch label="Urgent" className="bg-priority-urgent" />
              </div>
            </SubSection>

            <SubSection title="엣지 컬러 (Progress View)">
              <div className="flex flex-wrap gap-4">
                <Swatch label="Flow Order (실선)" className="bg-edge-flow" />
                <Swatch label="Dependency (점선)" className="bg-edge-dependency" />
              </div>
            </SubSection>

            <SubSection title="AI · 사이드바">
              <div className="flex flex-wrap gap-4">
                <Swatch label="AI Background" className="bg-ai-bg" />
                <Swatch label="AI Text" className="bg-ai-text" />
                <Swatch label="Sidebar BG" className="bg-sidebar" />
                <Swatch label="Sidebar FG" className="bg-sidebar-foreground" />
                <Swatch label="Sidebar Accent" className="bg-sidebar-accent" />
                <Swatch label="Sidebar Border" className="bg-sidebar-border" />
              </div>
            </SubSection>
          </Section>

          {/* ============================================================ */}
          {/* 02. Typography */}
          {/* ============================================================ */}
          <Section id="typography" number="02" title="타이포그래피 (Typography)">
            <p className="text-sm text-muted-foreground mb-6">Pretendard Variable · 자간 -1.5% 전역 적용. Title / Body / Caption 3단계.</p>

            <SubSection title="Title (leading-tight)">
              <div className="space-y-4">
                <div className="flex items-baseline gap-4">
                  <span className="w-12 text-xs text-muted-foreground shrink-0">T1</span>
                  <span className="text-2xl font-bold">24px Bold · 페이지 타이틀, 대시보드 숫자</span>
                </div>
                <div className="flex items-baseline gap-4">
                  <span className="w-12 text-xs text-muted-foreground shrink-0">T2</span>
                  <span className="text-xl font-semibold">20px SemiBold · 섹션 헤더</span>
                </div>
                <div className="flex items-baseline gap-4">
                  <span className="w-12 text-xs text-muted-foreground shrink-0">T3</span>
                  <span className="text-lg font-semibold">18px SemiBold · 카드/패널 제목</span>
                </div>
                <div className="flex items-baseline gap-4">
                  <span className="w-12 text-xs text-muted-foreground shrink-0">T4</span>
                  <span className="text-base font-semibold">16px SemiBold · 사이드바 섹션 라벨</span>
                </div>
              </div>
            </SubSection>

            <SubSection title="Body (leading-normal)">
              <div className="space-y-4">
                <div className="flex items-baseline gap-4">
                  <span className="w-12 text-xs text-muted-foreground shrink-0">B1</span>
                  <span className="text-base">16px · 본문 텍스트</span>
                </div>
                <div className="flex items-baseline gap-4">
                  <span className="w-12 text-xs text-muted-foreground shrink-0">B2</span>
                  <span className="text-sm font-medium">14px Medium · Button, 카드 상세</span>
                </div>
                <div className="flex items-baseline gap-4">
                  <span className="w-12 text-xs text-muted-foreground shrink-0">B3</span>
                  <span className="text-sm">14px · Input, 필드 값 (기본 바디)</span>
                </div>
                <div className="flex items-baseline gap-4">
                  <span className="w-12 text-xs text-muted-foreground shrink-0">B4</span>
                  <span className="text-[13px]">13px · 보조 텍스트, 설명</span>
                </div>
              </div>
            </SubSection>

            <SubSection title="Caption (leading-tight)">
              <div className="space-y-4">
                <div className="flex items-baseline gap-4">
                  <span className="w-12 text-xs text-muted-foreground shrink-0">C1</span>
                  <span className="text-xs font-semibold">12px SemiBold · Badge, StatusBadge</span>
                </div>
                <div className="flex items-baseline gap-4">
                  <span className="w-12 text-xs text-muted-foreground shrink-0">C2</span>
                  <span className="text-xs font-medium">12px Medium · 타임스탬프, 메타데이터</span>
                </div>
                <div className="flex items-baseline gap-4">
                  <span className="w-12 text-xs text-muted-foreground shrink-0">C3</span>
                  <span className="text-[11px]">11px · AiBadge, 캡션, 힌트</span>
                </div>
                <div className="flex items-baseline gap-4">
                  <span className="w-12 text-xs text-muted-foreground shrink-0">C4</span>
                  <span className="text-[10px] font-medium">10px Medium · 단축키 힌트, 라벨 태그</span>
                </div>
              </div>
            </SubSection>
          </Section>

          {/* ============================================================ */}
          {/* 03. Spacing & Radius & Shadows */}
          {/* ============================================================ */}
          <Section id="spacing" number="03" title="간격 · 라디우스 · 그림자">

            <SubSection title="보더 라디우스">
              <div className="flex flex-wrap gap-6 items-end">
                {[
                  { label: 'rounded-sm (4px)', cls: 'rounded-sm' },
                  { label: 'rounded-md (6px)', cls: 'rounded-md' },
                  { label: 'rounded-lg (8px)', cls: 'rounded-lg' },
                  { label: 'rounded-xl (12px)', cls: 'rounded-xl' },
                  { label: 'rounded-2xl (16px)', cls: 'rounded-2xl' },
                  { label: 'rounded-full', cls: 'rounded-full' },
                ].map((r) => (
                  <div key={r.label} className="flex flex-col items-center gap-2">
                    <div className={`h-14 w-14 border-2 border-foreground/20 bg-muted ${r.cls}`} />
                    <span className="text-[11px] text-muted-foreground text-center">{r.label}</span>
                  </div>
                ))}
              </div>
            </SubSection>

            <SubSection title="그림자 (Border 기반 분리 우선)">
              <div className="flex flex-wrap gap-6 items-end">
                {[
                  { label: 'shadow-xs', cls: 'shadow-xs' },
                  { label: 'shadow-sm', cls: 'shadow-sm' },
                  { label: 'shadow (default)', cls: 'shadow' },
                  { label: 'shadow-md', cls: 'shadow-md' },
                  { label: 'shadow-lg', cls: 'shadow-lg' },
                ].map((s) => (
                  <div key={s.label} className="flex flex-col items-center gap-2">
                    <div className={`h-14 w-14 rounded-lg bg-card border border-border ${s.cls}`} />
                    <span className="text-[11px] text-muted-foreground">{s.label}</span>
                  </div>
                ))}
              </div>
            </SubSection>

            <SubSection title="Z-Index 레이어">
              <div className="text-sm text-muted-foreground space-y-1">
                <p><code className="bg-muted px-1.5 py-0.5 rounded text-xs">z-0</code> Canvas / Content</p>
                <p><code className="bg-muted px-1.5 py-0.5 rounded text-xs">z-10</code> Sidebar / Bottom bar</p>
                <p><code className="bg-muted px-1.5 py-0.5 rounded text-xs">z-20</code> Right panel overlay</p>
                <p><code className="bg-muted px-1.5 py-0.5 rounded text-xs">z-30</code> Chatbot panel</p>
                <p><code className="bg-muted px-1.5 py-0.5 rounded text-xs">z-40</code> Modal / Dropdown</p>
                <p><code className="bg-muted px-1.5 py-0.5 rounded text-xs">z-50</code> Toast</p>
              </div>
            </SubSection>
          </Section>

          {/* ============================================================ */}
          {/* 04. Button */}
          {/* ============================================================ */}
          <Section id="button" number="04" title="버튼 (Button)">
            <p className="text-sm text-muted-foreground mb-6">6가지 Variant, icon 포함 7가지 Size. class-variance-authority 기반.</p>

            <SubSection title="Variants">
              <div className="flex flex-wrap gap-3 items-center">
                {(['default', 'secondary', 'outline', 'ghost', 'destructive', 'link'] as const).map((v) => (
                  <Button key={v} variant={v}>{v}</Button>
                ))}
              </div>
            </SubSection>

            <SubSection title="Sizes">
              <div className="flex flex-wrap gap-3 items-center">
                {(['xs', 'sm', 'default', 'lg'] as const).map((s) => (
                  <Button key={s} size={s}>Button {s}</Button>
                ))}
                <Button size="icon"><Plus size={16} /></Button>
                <Button size="icon-sm"><Plus size={14} /></Button>
              </div>
            </SubSection>

            <SubSection title="States">
              <div className="flex flex-wrap gap-3 items-center">
                <Button>Default</Button>
                <Button disabled>Disabled</Button>
              </div>
            </SubSection>

            <SubSection title="실제 사용 예시">
              <div className="space-y-3">
                <DemoBox label="Sidebar CTA">
                  <Button size="lg" className="w-full gap-2">
                    <Plus size={16} />
                    New Task
                  </Button>
                </DemoBox>
                <DemoBox label="Issue Detail 액션">
                  <div className="flex gap-3">
                    <Button className="flex-1">Save Changes</Button>
                    <Button variant="outline" className="flex-1">Cancel</Button>
                  </div>
                </DemoBox>
                <DemoBox label="AI Prompt 전송">
                  <div className="flex gap-2">
                    <Input placeholder="Describe tasks to create…" className="flex-1" />
                    <Button size="icon"><Sparkles size={16} /></Button>
                  </div>
                </DemoBox>
              </div>
            </SubSection>
          </Section>

          {/* ============================================================ */}
          {/* 05. Badge */}
          {/* ============================================================ */}
          <Section id="badge" number="05" title="뱃지 (Badge)">
            <p className="text-sm text-muted-foreground mb-6">상태나 카테고리를 나타내는 인라인 라벨. 6가지 Variant + AI 뱃지.</p>

            <SubSection title="Variants">
              <div className="flex flex-wrap gap-3 items-center">
                {(['default', 'secondary', 'destructive', 'outline', 'ghost', 'link'] as const).map((v) => (
                  <Badge key={v} variant={v}>{v}</Badge>
                ))}
              </div>
            </SubSection>

            <SubSection title="AI 뱃지">
              <div className="flex flex-wrap gap-3 items-center">
                <AiBadge />
                <AiBadge label="AI Generated" />
              </div>
            </SubSection>

            <SubSection title="도메인 활용">
              <div className="flex flex-wrap gap-3 items-center">
                <Badge variant="secondary">Frontend</Badge>
                <Badge variant="secondary">Backend</Badge>
                <Badge variant="secondary">Design</Badge>
                <Badge variant="secondary">QA</Badge>
                <span className="text-xs text-muted-foreground font-medium">+2</span>
              </div>
            </SubSection>
          </Section>

          {/* ============================================================ */}
          {/* 06. StatusBadge */}
          {/* ============================================================ */}
          <Section id="status-badge" number="06" title="StatusBadge (이슈 상태 전용)">
            <p className="text-sm text-muted-foreground mb-6">
              Linear 스타일 커스텀 SVG 아이콘. Icon-only (카드/행에서 사용) 및 Icon+Label 두 가지 모드 지원.
            </p>

            <SubSection title="Icon Only (카드/행 기본)">
              <div className="flex flex-wrap gap-6 items-center">
                {(Object.keys(STATUS_LABELS) as IssueStatus[]).map((s) => (
                  <div key={s} className="flex flex-col items-center gap-2">
                    <StatusBadge status={s} iconOnly />
                    <span className="text-[11px] text-muted-foreground">{STATUS_LABELS[s]}</span>
                  </div>
                ))}
              </div>
            </SubSection>

            <SubSection title="Icon + Label (Default)">
              <div className="flex flex-wrap gap-6 items-center">
                {(Object.keys(STATUS_LABELS) as IssueStatus[]).map((s) => (
                  <StatusBadge key={s} status={s} />
                ))}
              </div>
            </SubSection>

            <SubSection title="Small 사이즈 (Icon + Label)">
              <div className="flex flex-wrap gap-6 items-center">
                {(Object.keys(STATUS_LABELS) as IssueStatus[]).map((s) => (
                  <StatusBadge key={s} status={s} size="sm" />
                ))}
              </div>
            </SubSection>

            <SubSection title="Pill 스타일 (칩)">
              <div className="flex flex-wrap gap-3 items-center">
                {(Object.keys(STATUS_LABELS) as IssueStatus[]).map((s) => (
                  <span
                    key={s}
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                      s === 'todo' ? 'bg-status-todo/10 text-status-todo' :
                      s === 'in_progress' ? 'bg-status-in-progress/10 text-status-in-progress' :
                      'bg-status-done/10 text-status-done'
                    }`}
                  >
                    <span className={`size-1.5 rounded-full ${
                      s === 'todo' ? 'bg-status-todo' :
                      s === 'in_progress' ? 'bg-status-in-progress' :
                      'bg-status-done'
                    }`} />
                    {STATUS_LABELS[s]}
                  </span>
                ))}
              </div>
            </SubSection>
          </Section>

          {/* ============================================================ */}
          {/* 07. PriorityBadge */}
          {/* ============================================================ */}
          <Section id="priority-badge" number="07" title="PriorityBadge (우선순위 전용)">
            <p className="text-sm text-muted-foreground mb-6">우선순위를 바 아이콘 + 라벨로 표시. 4단계: Low → Urgent.</p>

            <SubSection title="Default 사이즈">
              <div className="flex flex-wrap gap-6 items-center">
                {(Object.keys(PRIORITY_LABELS) as IssuePriority[]).map((p) => (
                  <PriorityBadge key={p} priority={p} />
                ))}
              </div>
            </SubSection>

            <SubSection title="Small 사이즈">
              <div className="flex flex-wrap gap-6 items-center">
                {(Object.keys(PRIORITY_LABELS) as IssuePriority[]).map((p) => (
                  <PriorityBadge key={p} priority={p} size="sm" />
                ))}
              </div>
            </SubSection>
          </Section>

          {/* ============================================================ */}
          {/* 08. Card */}
          {/* ============================================================ */}
          <Section id="card" number="08" title="카드 (Card)">
            <p className="text-sm text-muted-foreground mb-6">정보를 그룹핑하는 레이아웃 컴포넌트. shadcn/ui Card 기반.</p>

            <div className="grid gap-6 md:grid-cols-2">
              <DemoBox label="기본 카드">
                <Card>
                  <CardHeader>
                    <CardTitle>마일스톤 현황</CardTitle>
                    <CardDescription>User Authentication 진행률</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4">
                      <ProgressRing percent={35} size={48} strokeWidth={4} />
                      <div>
                        <p className="text-2xl font-bold">35%</p>
                        <p className="text-xs text-muted-foreground">1/6 tasks completed</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button size="sm" variant="outline">View Details</Button>
                  </CardFooter>
                </Card>
              </DemoBox>

              <DemoBox label="통계 카드 (Overview용)">
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader>
                    <CardTitle>Active Tasks</CardTitle>
                    <CardDescription>현재 진행중인 태스크</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">24</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      <span className="text-status-done font-medium">+3</span> completed today
                    </p>
                  </CardContent>
                </Card>
              </DemoBox>
            </div>
          </Section>

          {/* ============================================================ */}
          {/* 09. Avatar & ProgressRing */}
          {/* ============================================================ */}
          <Section id="avatar-progress" number="09" title="아바타 · ProgressRing">

            <SubSection title="Avatar Sizes">
              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex flex-col items-center gap-2">
                  <Avatar size="sm"><AvatarFallback>JK</AvatarFallback></Avatar>
                  <span className="text-[11px] text-muted-foreground">sm (24px)</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <Avatar><AvatarFallback>SL</AvatarFallback></Avatar>
                  <span className="text-[11px] text-muted-foreground">default (32px)</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <Avatar size="lg"><AvatarFallback>MP</AvatarFallback></Avatar>
                  <span className="text-[11px] text-muted-foreground">lg (40px)</span>
                </div>
              </div>
            </SubSection>

            <SubSection title="Avatar Group">
              <AvatarGroup>
                <Avatar><AvatarFallback>JK</AvatarFallback></Avatar>
                <Avatar><AvatarFallback>SL</AvatarFallback></Avatar>
                <Avatar><AvatarFallback>MP</AvatarFallback></Avatar>
                <Avatar><AvatarFallback>+3</AvatarFallback></Avatar>
              </AvatarGroup>
            </SubSection>

            <SubSection title="ProgressRing">
              <div className="flex flex-wrap gap-6 items-center">
                {[0, 25, 50, 75, 100].map((p) => (
                  <div key={p} className="flex flex-col items-center gap-2">
                    <ProgressRing percent={p} size={40} strokeWidth={3} />
                    <span className="text-[11px] text-muted-foreground">{p}%</span>
                  </div>
                ))}
              </div>
            </SubSection>

            <SubSection title="ProgressRing Sizes">
              <div className="flex flex-wrap gap-6 items-center">
                {[
                  { size: 20, sw: 2, label: '20px' },
                  { size: 28, sw: 2.5, label: '28px' },
                  { size: 32, sw: 3, label: '32px (default)' },
                  { size: 48, sw: 4, label: '48px' },
                ].map((s) => (
                  <div key={s.size} className="flex flex-col items-center gap-2">
                    <ProgressRing percent={65} size={s.size} strokeWidth={s.sw} />
                    <span className="text-[11px] text-muted-foreground">{s.label}</span>
                  </div>
                ))}
              </div>
            </SubSection>
          </Section>

          {/* ============================================================ */}
          {/* 10. MilestoneNode */}
          {/* ============================================================ */}
          <Section id="milestone-node" number="10" title="MilestoneNode (Progress View)">
            <p className="text-sm text-muted-foreground mb-6">
              Progress View의 핵심 노드. Collapsed: 트렌드+부서바+완료율+태스크수. Expanded: 태스크 카드 리스트 (5개 페이지네이션).
            </p>

            <SubSection title="Collapsed (기본 상태)">
              <div className="flex gap-6 items-start p-8 bg-muted/30 rounded-xl overflow-x-auto">
                <div className="relative">
                  <MilestoneNode milestone={sampleMilestone} />
                </div>
                <div className="relative">
                  <MilestoneNode milestone={sampleMilestoneDone} />
                </div>
              </div>
            </SubSection>

            <SubSection title="Expanded (펼침 상태)">
              <div className="p-8 bg-muted/30 rounded-xl overflow-x-auto">
                <div className="relative">
                  <MilestoneNode milestone={sampleMilestone} defaultExpanded />
                </div>
              </div>
            </SubSection>
          </Section>

          {/* ============================================================ */}
          {/* 11. TaskCard & TaskRow */}
          {/* ============================================================ */}
          <Section id="task-components" number="11" title="TaskCard · TaskRow">

            <SubSection title="TaskCard (Issue Preview / 일반 카드)">
              <div className="space-y-2">
                {sampleTasks.slice(0, 4).map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            </SubSection>

            <SubSection title="TaskRow (List View 테이블)">
              <div className="rounded-lg border border-border overflow-hidden">
                {/* Table header */}
                <div className="grid grid-cols-[1fr_100px_120px_100px_80px_60px] items-center gap-2 border-b border-border bg-muted/50 px-4 py-2 text-xs font-medium text-muted-foreground">
                  <span>Title</span>
                  <span>Status</span>
                  <span>Assignee</span>
                  <span>Due Date</span>
                  <span>Priority</span>
                  <span className="text-center">Progress</span>
                </div>
                {/* Rows */}
                {sampleTasks.map((task) => (
                  <TaskRow key={task.id} task={task} />
                ))}
              </div>
            </SubSection>
          </Section>

          {/* ============================================================ */}
          {/* 12. Edge Styles */}
          {/* ============================================================ */}
          <Section id="edge-styles" number="12" title="엣지 스타일 (Edge Styles)">
            <p className="text-sm text-muted-foreground mb-6">
              Progress View 연결선. 실선(Flow order, 순서) vs 점선(Dependency, 종속성). 양쪽 원형 엔드포인트, bezier curve. n8n 참조.
            </p>

            <SubSection title="Flow Order (실선 · 원형 엔드포인트)">
              <DemoBox label="마일스톤 간 순서를 나타내는 연결선 — 방향성이 아닌 연결 관계를 암시">
                <svg width="400" height="60" className="w-full max-w-md">
                  <circle cx="20" cy="30" r="4" fill="currentColor" className="text-edge-flow" />
                  <path d="M 24 30 C 120 30, 280 30, 376 30" stroke="currentColor" strokeWidth="2" fill="none" className="text-edge-flow" />
                  <circle cx="380" cy="30" r="4" fill="currentColor" className="text-edge-flow" />
                  <text x="200" y="55" textAnchor="middle" className="fill-muted-foreground text-[11px]">solid · 2px · gray · circle endpoints</text>
                </svg>
              </DemoBox>
            </SubSection>

            <SubSection title="Dependency (점선 · 원형 엔드포인트)">
              <DemoBox label="태스크 간 차단 관계 — Task B는 Task A 완료 후 시작 가능">
                <svg width="400" height="60" className="w-full max-w-md">
                  <circle cx="20" cy="30" r="4" fill="currentColor" className="text-edge-dependency" />
                  <path d="M 24 30 C 120 10, 280 50, 376 30" stroke="currentColor" strokeWidth="2" strokeDasharray="6 4" fill="none" className="text-edge-dependency" />
                  <circle cx="380" cy="30" r="4" fill="currentColor" className="text-edge-dependency" />
                  <text x="200" y="55" textAnchor="middle" className="fill-muted-foreground text-[11px]">dashed · 2px · primary · circle endpoints</text>
                </svg>
              </DemoBox>
            </SubSection>

            <SubSection title="비교: 두 엣지 동시 표시">
              <DemoBox label="노드 확장 시 실선(순서) + 점선(종속) 동시 표시 예시">
                <svg width="400" height="100" className="w-full max-w-md">
                  {/* Flow order (solid) */}
                  <circle cx="20" cy="35" r="4" fill="currentColor" className="text-edge-flow" />
                  <path d="M 24 35 C 120 35, 280 35, 376 35" stroke="currentColor" strokeWidth="2" fill="none" className="text-edge-flow" />
                  <circle cx="380" cy="35" r="4" fill="currentColor" className="text-edge-flow" />
                  <text x="30" y="25" className="fill-muted-foreground text-[10px]">flow order</text>

                  {/* Dependency (dashed) */}
                  <circle cx="20" cy="70" r="4" fill="currentColor" className="text-edge-dependency" />
                  <path d="M 24 70 C 120 50, 280 90, 376 70" stroke="currentColor" strokeWidth="2" strokeDasharray="6 4" fill="none" className="text-edge-dependency" />
                  <circle cx="380" cy="70" r="4" fill="currentColor" className="text-edge-dependency" />
                  <text x="30" y="93" className="fill-muted-foreground text-[10px]">dependency</text>
                </svg>
              </DemoBox>
            </SubSection>
          </Section>

          {/* ============================================================ */}
          {/* 13. Sidebar Components */}
          {/* ============================================================ */}
          <Section id="sidebar" number="13" title="사이드바 컴포넌트">
            <p className="text-sm text-muted-foreground mb-6">
              2-tier 사이드바: Icon Rail (60px) + Context Sidebar (220px). Discord/Slack 프로젝트 전환 패턴.
            </p>

            <DemoBox label="2-Tier 사이드바 미리보기">
              <div className="flex rounded-xl overflow-hidden border border-border h-[420px]">
                {/* Workspace header spanning both tiers */}
                <div className="flex flex-col">
                  {/* Header bar */}
                  <div className="flex h-12 items-center bg-sidebar border-b border-sidebar-border">
                    <div className="w-[60px] flex items-center justify-center">
                      <div className="size-7 rounded-lg bg-sidebar-primary flex items-center justify-center text-sidebar-primary-foreground text-xs font-bold">S</div>
                    </div>
                    <div className="w-[220px] px-3">
                      <span className="text-sm font-semibold text-sidebar-foreground">SubTask</span>
                    </div>
                  </div>

                  <div className="flex flex-1">
                    {/* Tier 1: Icon Rail */}
                    <div className="w-[60px] bg-sidebar border-r border-sidebar-border flex flex-col items-center py-3 gap-2">
                      {/* Project icons */}
                      {['P1', 'P2', 'P3'].map((p, i) => (
                        <button
                          key={p}
                          className={`size-9 rounded-lg flex items-center justify-center text-xs font-semibold transition-colors ${
                            i === 0
                              ? 'bg-sidebar-primary text-sidebar-primary-foreground ring-2 ring-sidebar-primary/50'
                              : 'bg-sidebar-accent text-sidebar-foreground hover:bg-sidebar-accent/80'
                          }`}
                        >
                          {p}
                        </button>
                      ))}
                      <Separator className="my-1 w-6 bg-sidebar-border" />
                      <button className="size-9 rounded-lg flex items-center justify-center text-sidebar-foreground/50 hover:bg-sidebar-accent transition-colors">
                        <Plus size={16} />
                      </button>

                      {/* Profile (bottom) */}
                      <div className="mt-auto">
                        <div className="size-8 rounded-full bg-sidebar-accent flex items-center justify-center text-[11px] font-medium text-sidebar-foreground">
                          JK
                        </div>
                      </div>
                    </div>

                    {/* Tier 2: Context Sidebar */}
                    <div className="w-[220px] bg-sidebar flex flex-col">
                      {/* Search */}
                      <div className="px-3 py-3">
                        <div className="flex items-center gap-2 rounded-md bg-sidebar-accent px-2.5 py-1.5 text-xs text-sidebar-foreground/60">
                          <Search size={13} />
                          <span>Search…</span>
                          <kbd className="ml-auto rounded border border-sidebar-border bg-sidebar px-1 py-0.5 text-[10px]">⌘K</kbd>
                        </div>
                      </div>

                      {/* Common section */}
                      <div className="px-2 space-y-0.5">
                        {[
                          { icon: Home, label: 'Daily Briefing', active: false },
                          { icon: ListTodo, label: 'My Issues', active: false },
                          { icon: Inbox, label: 'Inbox', active: false, badge: '3' },
                        ].map((item) => (
                          <button
                            key={item.label}
                            className={`flex w-full items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm transition-colors ${
                              item.active ? 'bg-sidebar-accent text-sidebar-accent-foreground' : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
                            }`}
                          >
                            <item.icon size={15} />
                            <span>{item.label}</span>
                            {'badge' in item && item.badge && (
                              <span className="ml-auto text-[10px] rounded-full bg-sidebar-primary px-1.5 py-0.5 text-sidebar-primary-foreground font-medium">
                                {item.badge}
                              </span>
                            )}
                          </button>
                        ))}
                      </div>

                      <Separator className="my-2 mx-3 bg-sidebar-border" />

                      {/* Project section */}
                      <div className="px-2">
                        <p className="px-2.5 py-1 text-[11px] font-medium text-sidebar-foreground/40 uppercase tracking-wider">Project</p>
                        {[
                          { icon: LayoutDashboard, label: 'Overview', active: false },
                          { icon: ListTodo, label: 'Issues', active: true },
                          { icon: GitBranch, label: 'Progress', active: false },
                          { icon: FileText, label: 'Documents', active: false },
                        ].map((item) => (
                          <button
                            key={item.label}
                            className={`flex w-full items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm transition-colors ${
                              item.active ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium' : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
                            }`}
                          >
                            <item.icon size={15} />
                            <span>{item.label}</span>
                          </button>
                        ))}
                      </div>

                      <Separator className="my-2 mx-3 bg-sidebar-border" />

                      {/* Team section */}
                      <div className="px-2">
                        <p className="px-2.5 py-1 text-[11px] font-medium text-sidebar-foreground/40 uppercase tracking-wider">Teams</p>
                        {['Design', 'Frontend', 'Backend', 'QA'].map((team) => (
                          <button
                            key={team}
                            className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-colors"
                          >
                            <Users size={15} />
                            <span>{team}</span>
                          </button>
                        ))}
                      </div>

                      {/* Settings (bottom) */}
                      <div className="mt-auto border-t border-sidebar-border px-2 py-2">
                        <button className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm text-sidebar-foreground/50 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-colors">
                          <Settings size={15} />
                          <span>Settings</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content area (preview) */}
                <div className="flex-1 bg-background p-6">
                  <p className="text-sm text-muted-foreground">Content Area</p>
                  <p className="text-xs text-muted-foreground/50 mt-1">메인 콘텐츠 영역. 사이드바와 분리.</p>
                </div>
              </div>
            </DemoBox>
          </Section>

          {/* ============================================================ */}
          {/* 14. Input */}
          {/* ============================================================ */}
          <Section id="input" number="14" title="입력 필드 (Input)">
            <p className="text-sm text-muted-foreground mb-6">h-9 (36px). Border: border-input. Focus: ring-[3px].</p>

            <div className="grid gap-6 md:grid-cols-2">
              <DemoBox label="Default">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold">Task Title</label>
                  <Input placeholder="Enter task title" />
                </div>
              </DemoBox>

              <DemoBox label="Disabled">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold">Auto Generated</label>
                  <Input placeholder="AI will fill this" disabled />
                </div>
              </DemoBox>

              <DemoBox label="검색 (Global Search)">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="Search issues, projects, docs…" className="pl-9 pr-10" />
                  <kbd className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 inline-flex items-center rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">⌘K</kbd>
                </div>
              </DemoBox>

              <DemoBox label="AI Prompt Input">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold">AI Task Generation</label>
                  <div className="flex gap-2">
                    <Input placeholder="Break this into FE and BE tasks, assign @John to FE…" className="flex-1" />
                    <Button size="icon" className="shrink-0"><Sparkles size={16} /></Button>
                  </div>
                </div>
              </DemoBox>
            </div>
          </Section>

          {/* ============================================================ */}
          {/* 15. LabelBadge */}
          {/* ============================================================ */}
          <Section id="label-badge" number="15" title="LabelBadge (라벨 태그)">
            <p className="text-sm text-muted-foreground mb-6">
              태스크/이슈에 부착되는 소형 라벨 태그. 10px, muted 배경 기본. className으로 색상 변경 가능.
            </p>

            <SubSection title="기본 스타일 (Muted)">
              <div className="flex flex-wrap gap-2 items-center">
                {['Frontend', 'Backend', 'Design', 'QA', 'DevOps', 'Auth', 'API'].map((label) => (
                  <LabelBadge key={label} label={label} />
                ))}
              </div>
            </SubSection>

            <SubSection title="Secondary 변형">
              <div className="flex flex-wrap gap-2 items-center">
                {['Frontend', 'Backend', 'Design'].map((label) => (
                  <LabelBadge key={label} label={label} className="bg-secondary text-secondary-foreground" />
                ))}
              </div>
            </SubSection>

            <SubSection title="실제 사용 예시">
              <div className="space-y-3">
                <DemoBox label="타임라인 사이드바 행">
                  <div className="flex items-center gap-2">
                    <StatusBadge status="in_progress" size="sm" iconOnly />
                    <span className="text-xs truncate">Implement authentication API</span>
                    <span className="text-[10px] text-muted-foreground tabular-nums">Feb 20 – Feb 25</span>
                    <div className="flex items-center gap-0.5">
                      <LabelBadge label="Auth" />
                      <LabelBadge label="API" />
                    </div>
                  </div>
                </DemoBox>
                <DemoBox label="TaskCard 내부 라벨">
                  <div className="flex gap-1">
                    <LabelBadge label="Backend" className="bg-secondary text-secondary-foreground" />
                    <LabelBadge label="Auth" className="bg-secondary text-secondary-foreground" />
                  </div>
                </DemoBox>
              </div>
            </SubSection>
          </Section>

          {/* ============================================================ */}
          {/* 16. CompletionBadge */}
          {/* ============================================================ */}
          <Section id="completion-badge" number="16" title="CompletionBadge (완료 수)">
            <p className="text-sm text-muted-foreground mb-6">
              마일스톤/섹션의 완료 태스크 수를 "done/total" 형태로 표시. done 숫자는 bold foreground, total은 muted.
            </p>

            <SubSection title="다양한 비율">
              <div className="flex flex-wrap gap-6 items-center">
                {[
                  { done: 0, total: 6 },
                  { done: 2, total: 6 },
                  { done: 4, total: 7 },
                  { done: 6, total: 6 },
                ].map((item) => (
                  <div key={`${item.done}-${item.total}`} className="flex flex-col items-center gap-2">
                    <CompletionBadge done={item.done} total={item.total} />
                    <span className="text-[10px] text-muted-foreground">
                      {item.done === item.total ? 'Complete' : `${Math.round((item.done / item.total) * 100)}%`}
                    </span>
                  </div>
                ))}
              </div>
            </SubSection>

            <SubSection title="크기 변형 (className)">
              <div className="flex flex-wrap gap-6 items-center">
                <div className="flex flex-col items-center gap-2">
                  <CompletionBadge done={3} total={6} className="text-[11px]" />
                  <span className="text-[10px] text-muted-foreground">11px (타임라인)</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <CompletionBadge done={3} total={6} />
                  <span className="text-[10px] text-muted-foreground">12px (기본)</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <CompletionBadge done={3} total={6} className="text-sm" />
                  <span className="text-[10px] text-muted-foreground">14px (디테일)</span>
                </div>
              </div>
            </SubSection>

            <SubSection title="실제 사용 예시">
              <DemoBox label="마일스톤 노드 / 사이드바">
                <div className="flex items-center gap-3">
                  <ProgressRing percent={50} size={28} strokeWidth={2.5} />
                  <span className="text-sm font-semibold">User Authentication</span>
                  <CompletionBadge done={3} total={6} />
                </div>
              </DemoBox>
            </SubSection>
          </Section>

          {/* ============================================================ */}
          {/* 17. ToggleChip */}
          {/* ============================================================ */}
          <Section id="toggle-chip" number="17" title="ToggleChip (토글 칩)">
            <p className="text-sm text-muted-foreground mb-6">
              Pill 형태의 토글 칩. Scope 전환, 필터 그룹 등에 사용. CVA 기반 active/inactive 2-state + size variant.
            </p>

            <SubSection title="상태별 표시">
              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex flex-col items-center gap-2">
                  <ToggleChip label="Active" active />
                  <span className="text-[10px] text-muted-foreground">active: true</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <ToggleChip label="Inactive" active={false} />
                  <span className="text-[10px] text-muted-foreground">active: false</span>
                </div>
              </div>
            </SubSection>

            <SubSection title="사이즈">
              <div className="flex flex-wrap gap-4 items-end">
                <div className="flex flex-col items-center gap-2">
                  <ToggleChip label="Default" active size="default" />
                  <span className="text-[10px] text-muted-foreground">size: default</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <ToggleChip label="Small" active size="sm" />
                  <span className="text-[10px] text-muted-foreground">size: sm</span>
                </div>
              </div>
            </SubSection>

            <SubSection title="실사용 예시">
              <DemoBox label="Documents Scope 탭">
                <div className="flex gap-2">
                  <ToggleChip label="All Documents" active />
                  <ToggleChip label="My Documents" />
                  <ToggleChip label="Team Library" />
                </div>
              </DemoBox>
              <DemoBox label="필터 그룹 (sm)">
                <div className="flex gap-1.5 mt-3">
                  <ToggleChip label="FE" active size="sm" />
                  <ToggleChip label="BE" active size="sm" />
                  <ToggleChip label="Design" size="sm" />
                  <ToggleChip label="QA" size="sm" />
                  <ToggleChip label="DevOps" size="sm" />
                </div>
              </DemoBox>
            </SubSection>
          </Section>

          {/* ============================================================ */}
          {/* 18. FilterDropdown */}
          {/* ============================================================ */}
          <Section id="filter-dropdown" number="18" title="FilterDropdown (필터 드롭다운)">
            <p className="text-sm text-muted-foreground mb-6">
              Popover + Command 기반 멀티 셀렉트 필터. 아이콘 옵션 지원. Issues List 및 Timeline에서 공유.
            </p>

            <SubSection title="Status 필터 (아이콘 포함)">
              <DemoBox label="Issues List / Timeline 공용">
                <FilterDropdown
                  label="Status"
                  options={[
                    { value: 'todo', label: 'To Do', icon: <StatusBadge status="todo" size="sm" iconOnly /> },
                    { value: 'in_progress', label: 'In Progress', icon: <StatusBadge status="in_progress" size="sm" iconOnly /> },
                    { value: 'done', label: 'Done', icon: <StatusBadge status="done" size="sm" iconOnly /> },
                  ]}
                  selected={[]}
                  onChange={() => {}}
                />
              </DemoBox>
            </SubSection>

            <SubSection title="텍스트 전용 필터">
              <DemoBox label="라벨 필터 예시">
                <FilterDropdown
                  label="Labels"
                  options={[
                    { value: 'frontend', label: 'Frontend' },
                    { value: 'backend', label: 'Backend' },
                    { value: 'design', label: 'Design' },
                    { value: 'qa', label: 'QA' },
                  ]}
                  selected={[]}
                  onChange={() => {}}
                />
              </DemoBox>
            </SubSection>
          </Section>

          {/* Footer */}
          <footer className="border-t border-border pt-8 pb-16 text-center">
            <p className="text-sm text-muted-foreground">
              SubTask Design System v1.0 · Pretendard · shadcn/ui · Tailwind CSS v4 (oklch) · Lucide Icons
            </p>
          </footer>
        </div>
      </main>
    </div>
  )
}
