import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { Progress } from '@/components/ui/progress'
import {
  TierBadge,
  BookingStatusBadge,
  TransferStatusBadge,
  SeatStatusLegend,
  TimerDisplay,
  PriceDisplay,
  FaceValueBadge,
  EventCard,
  EventTagBadge,
  ArtistCard,
  TicketCard,
  TransferCard,
  NotificationCard,
  PostCard,
  QueueStatusCard,
  FilterChip,
  ViewToggle,
} from '@/components/urr'
import type { CommunityPost } from '@/data/mock-community'
import type {
  TierLevel,
  BookingStatus,
  TransferStatus,
  SeatStatus,
  Event,
  Artist,
  Ticket,
  TransferListing,
  Notification,
} from '@/types'
import { TIER_LABELS, BOOKING_STATUS_LABELS, TRANSFER_STATUS_LABELS, SEAT_STATUS_LABELS } from '@/types'
import {
  Search,
  Plus,
  Bell,
  Home,
  Calendar,
  Users,
  MapPin,
  Clock,
  QrCode,
  ArrowLeftRight,
  Crown,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Heart,
  CreditCard,
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  Settings,
  Music,
  X,
  Check,
} from 'lucide-react'

// ---------------------------------------------------------------------------
// Sample Data
// ---------------------------------------------------------------------------

const sampleEvent: Event = {
  id: 'e1', artistId: 'G-Dragon', title: 'G-DRAGON 2026 WORLD TOUR [COUP D\'ETAT]',
  venue: '잠실종합운동장 올림픽주경기장', poster: '',
  dates: [{ id: 'd1', date: '2026-04-15T19:00:00', bookingWindows: [
    { tier: 'diamond' as TierLevel, opensAt: '2026-04-01T12:00:00', fee: 0 },
    { tier: 'gold' as TierLevel, opensAt: '2026-04-02T12:00:00', fee: 3000 },
  ], totalSeats: 50000, remainingSeats: 12450 }],
  status: 'open',
}

const sampleEventUpcoming: Event = {
  ...sampleEvent, id: 'e2', title: 'aespa LIVE TOUR - SYNK',
  venue: 'KSPO DOME', status: 'upcoming',
}

const sampleEventSoldout: Event = {
  ...sampleEvent, id: 'e3', title: 'BTS YET TO COME IN BUSAN',
  venue: '부산 아시아드 주경기장', status: 'soldout',
}

const sampleArtists: Artist[] = [
  { id: 'a1', name: 'G-Dragon', avatar: '', banner: '', bio: 'K-POP King', followerCount: 342000, category: 'solo' },
  { id: 'a2', name: 'aespa', avatar: '', banner: '', bio: 'Next Level', followerCount: 518000, category: 'girlgroup' },
  { id: 'a3', name: 'BTS', avatar: '', banner: '', bio: 'Dynamite', followerCount: 1200000, category: 'boygroup' },
  { id: 'a4', name: 'NewJeans', avatar: '', banner: '', bio: 'Attention', followerCount: 890000, category: 'girlgroup' },
]

const sampleTicket: Ticket & { event: Event } = {
  id: 'tk1', eventId: 'e1', section: 'A구역', row: '3', seatNumber: '15',
  price: 165000, tierFee: 0, qrCode: '', isTransferable: true, isUpcoming: true,
  event: sampleEvent,
}

const sampleTransfer: TransferListing & { event: Event } = {
  id: 'tr1', ticketId: 'tk2', eventId: 'e1', sellerId: 'u2',
  sellerTier: 'gold', sellerTransactionCount: 12,
  price: 180000, faceValue: 165000, section: 'B구역', seatInfo: '5열 22번',
  status: 'listed', createdAt: '2026-03-01T09:00:00',
  event: sampleEvent,
}

const sampleNotifications: Notification[] = [
  { id: 'n1', type: 'booking', title: 'G-DRAGON 월드투어 예매 오픈', description: 'Diamond 등급 예매가 시작되었습니다. 지금 예매하세요!', timestamp: new Date(Date.now() - 30 * 60000).toISOString(), isRead: false, link: '/events/e1' },
  { id: 'n2', type: 'transfer', title: '양도 거래 완료', description: 'aespa LIVE TOUR 티켓 양도가 완료되었습니다.', timestamp: new Date(Date.now() - 3 * 3600000).toISOString(), isRead: false, link: '/my-page' },
  { id: 'n3', type: 'tier', title: '등급 업그레이드!', description: 'Silver → Gold 등급으로 승급되었습니다. 축하합니다!', timestamp: new Date(Date.now() - 24 * 3600000).toISOString(), isRead: true, link: '/my-page' },
  { id: 'n4', type: 'payment', title: '결제 확인', description: '165,000원 결제가 완료되었습니다.', timestamp: new Date(Date.now() - 48 * 3600000).toISOString(), isRead: true, link: '/my-page' },
]

const samplePosts: CommunityPost[] = [
  {
    id: 'cp1', artistId: 'gdragon', authorName: 'G-Dragon 공식', authorAvatar: '',
    isOfficial: true,
    content: '2026 MAMA DOME TOUR 서울 공연이 6월 1일, 2일 양일간 KSPO DOME에서 진행됩니다. 많은 관심과 사랑 부탁드립니다.',
    images: [], likeCount: 24500, commentCount: 1820,
    createdAt: new Date(Date.now() - 2 * 3600000).toISOString(),
  },
  {
    id: 'cp2', artistId: 'gdragon', authorName: '빅뱅사랑해', authorAvatar: '',
    isOfficial: false,
    content: '어제 콘서트 다녀왔는데 정말 미쳤어요... 세트리스트도 완벽하고 무대 연출도 대박이었어요 ㅠㅠ 다음 공연도 꼭 가고 싶다!',
    images: ['img1', 'img2'], likeCount: 342, commentCount: 47,
    createdAt: new Date(Date.now() - 18 * 3600000).toISOString(),
  },
]

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
  { id: 'tier-badge', number: '06', title: 'TierBadge' },
  { id: 'booking-badge', number: '07', title: 'BookingStatusBadge' },
  { id: 'transfer-badge', number: '08', title: 'TransferStatusBadge' },
  { id: 'seat-legend', number: '09', title: 'SeatStatusLegend' },
  { id: 'timer', number: '10', title: 'TimerDisplay' },
  { id: 'price', number: '11', title: 'PriceDisplay · FaceValueBadge' },
  { id: 'event-card', number: '12', title: 'EventCard' },
  { id: 'artist-card', number: '13', title: 'ArtistCard' },
  { id: 'ticket-card', number: '14', title: 'TicketCard' },
  { id: 'transfer-card', number: '15', title: 'TransferCard' },
  { id: 'notification', number: '16', title: 'NotificationCard' },
  { id: 'queue-card', number: '17', title: 'QueueStatusCard' },
  { id: 'post-card', number: '18', title: 'PostCard' },
  { id: 'event-tag', number: '19', title: 'EventTagBadge' },
  { id: 'input', number: '20', title: '입력 필드' },
  { id: 'card-base', number: '21', title: '기본 카드' },
  { id: 'skeleton', number: '22', title: '스켈레톤 · 프로그레스' },
  { id: 'icons', number: '23', title: '아이콘 시스템' },
  { id: 'sidebar-preview', number: '24', title: '사이드바 프리뷰' },
  { id: 'filter-chip', number: '25', title: 'FilterChip · ViewToggle' },
]

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function StyleGuidePage() {
  const [activeSection, setActiveSection] = useState('colors')
  const [selectedArtists, setSelectedArtists] = useState<Set<string>>(new Set(['a1']))

  const [demoFilter, setDemoFilter] = useState('all')
  const [demoView, setDemoView] = useState<'grid' | 'list'>('grid')

  const toggleArtist = (id: string) => {
    setSelectedArtists(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Sidebar TOC */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-56 flex-col border-r border-border bg-card lg:flex">
        <div className="flex h-14 items-center border-b border-border px-5">
          <span className="text-sm font-semibold">Style Guide</span>
          <Badge variant="secondary" className="ml-auto text-[10px]">v1.2</Badge>
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
          <span className="text-[11px] text-muted-foreground">URR Design System v1.2</span>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 lg:pl-56">
        <header className="sticky top-0 z-30 flex h-14 items-center border-b border-border bg-background/95 px-6 backdrop-blur-sm">
          <h1 className="text-lg font-semibold">URR (우르르) — Design System</h1>
          <span className="ml-3 text-xs text-muted-foreground">Pretendard · shadcn/ui · Tailwind v4</span>
        </header>

        <div className="mx-auto max-w-4xl space-y-16 px-6 py-10">

          {/* ============================================================ */}
          {/* 01. Color Tokens */}
          {/* ============================================================ */}
          <Section id="colors" number="01" title="색상 토큰 (Color Tokens)">
            <p className="text-sm text-muted-foreground mb-6">oklch 기반 시맨틱 토큰. 8개 카테고리: 시맨틱, 사이드바, 등급, 좌석, 예매, 양도, 시스템 피드백, 정가 대비.</p>

            <SubSection title="시맨틱 컬러 (Semantic)">
              <div className="flex flex-wrap gap-4">
                <Swatch label="Background" className="bg-background" />
                <Swatch label="Foreground" className="bg-foreground" />
                <Swatch label="Primary" className="bg-primary" />
                <Swatch label="Primary FG" className="bg-primary-foreground" />
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

            <SubSection title="사이드바 (White Pattern)">
              <div className="flex flex-wrap gap-4">
                <Swatch label="Sidebar BG" className="bg-sidebar" />
                <Swatch label="Sidebar FG" className="bg-sidebar-foreground" />
                <Swatch label="Sidebar Primary" className="bg-sidebar-primary" />
                <Swatch label="Sidebar Accent" className="bg-sidebar-accent" />
                <Swatch label="Sidebar Border" className="bg-sidebar-border" />
              </div>
            </SubSection>

            <SubSection title="등급 (Tier)">
              <div className="flex flex-wrap gap-4">
                <Swatch label="Diamond" className="bg-tier-diamond" />
                <Swatch label="Diamond BG" className="bg-tier-diamond-bg" />
                <Swatch label="Gold" className="bg-tier-gold" />
                <Swatch label="Gold BG" className="bg-tier-gold-bg" />
                <Swatch label="Silver" className="bg-tier-silver" />
                <Swatch label="Silver BG" className="bg-tier-silver-bg" />
                <Swatch label="Bronze" className="bg-tier-bronze" />
                <Swatch label="Bronze BG" className="bg-tier-bronze-bg" />
              </div>
            </SubSection>

            <SubSection title="좌석 상태 (Seat)">
              <div className="flex flex-wrap gap-4">
                <Swatch label="Available" className="bg-seat-available" />
                <Swatch label="Selected" className="bg-seat-selected" />
                <Swatch label="Taken" className="bg-seat-taken" />
                <Swatch label="Locked" className="bg-seat-locked" />
              </div>
            </SubSection>

            <SubSection title="예매 상태 (Booking)">
              <div className="flex flex-wrap gap-4">
                <Swatch label="Open" className="bg-booking-open" />
                <Swatch label="Upcoming" className="bg-booking-upcoming" />
                <Swatch label="Soldout" className="bg-booking-soldout" />
                <Swatch label="Closed" className="bg-booking-closed" />
              </div>
            </SubSection>

            <SubSection title="양도 상태 (Transfer)">
              <div className="flex flex-wrap gap-4">
                <Swatch label="Listed" className="bg-transfer-listed" />
                <Swatch label="Sold" className="bg-transfer-sold" />
                <Swatch label="Cancelled" className="bg-transfer-cancelled" />
              </div>
            </SubSection>

            <SubSection title="시스템 피드백 (System Feedback)">
              <div className="flex flex-wrap gap-4">
                <Swatch label="Success" className="bg-success" />
                <Swatch label="Warning" className="bg-warning" />
                <Swatch label="Danger" className="bg-danger" />
                <Swatch label="Info" className="bg-info" />
              </div>
            </SubSection>
          </Section>

          {/* ============================================================ */}
          {/* 02. Typography */}
          {/* ============================================================ */}
          <Section id="typography" number="02" title="타이포그래피 (Typography)">
            <p className="text-sm text-muted-foreground mb-6">Pretendard Variable · 자간 -1.5% 전역 적용. Title / Body / Caption / Timer 4단계.</p>

            <SubSection title="Title (leading-tight)">
              <div className="space-y-4">
                <div className="flex items-baseline gap-4">
                  <span className="w-12 text-xs text-muted-foreground shrink-0">T1</span>
                  <span className="text-2xl font-bold">24px Bold · 페이지 타이틀, 가격 총합</span>
                </div>
                <div className="flex items-baseline gap-4">
                  <span className="w-12 text-xs text-muted-foreground shrink-0">T2</span>
                  <span className="text-xl font-semibold">20px SemiBold · 섹션 헤더, 이벤트 제목</span>
                </div>
                <div className="flex items-baseline gap-4">
                  <span className="w-12 text-xs text-muted-foreground shrink-0">T3</span>
                  <span className="text-lg font-semibold">18px SemiBold · 카드 제목, 아티스트명</span>
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
                  <span className="text-base">16px · 본문 텍스트, VQA 질문</span>
                </div>
                <div className="flex items-baseline gap-4">
                  <span className="w-12 text-xs text-muted-foreground shrink-0">B2</span>
                  <span className="text-sm font-medium">14px Medium · Button, 카드 상세 정보</span>
                </div>
                <div className="flex items-baseline gap-4">
                  <span className="w-12 text-xs text-muted-foreground shrink-0">B3</span>
                  <span className="text-sm">14px · Input, 필드 값</span>
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
                  <span className="text-xs font-semibold">12px SemiBold · Badge 라벨, 상태 텍스트</span>
                </div>
                <div className="flex items-baseline gap-4">
                  <span className="w-12 text-xs text-muted-foreground shrink-0">C2</span>
                  <span className="text-xs font-medium">12px Medium · 타임스탬프, 메타데이터, 잔여석</span>
                </div>
                <div className="flex items-baseline gap-4">
                  <span className="w-12 text-xs text-muted-foreground shrink-0">C3</span>
                  <span className="text-[11px]">11px · 캡션, 힌트, 범례 텍스트</span>
                </div>
                <div className="flex items-baseline gap-4">
                  <span className="w-12 text-xs text-muted-foreground shrink-0">C4</span>
                  <span className="text-[10px] font-medium">10px Medium · 키보드 힌트, 마이크로 라벨</span>
                </div>
              </div>
            </SubSection>

            <SubSection title="Timer (Monospace — JetBrains Mono)">
              <div className="space-y-4">
                <div className="flex items-baseline gap-4">
                  <span className="w-16 text-xs text-muted-foreground shrink-0">Timer-lg</span>
                  <span className="text-[28px] font-bold font-mono tabular-nums">02:27</span>
                  <span className="text-xs text-muted-foreground">28px Bold · 좌석 선택 타이머</span>
                </div>
                <div className="flex items-baseline gap-4">
                  <span className="w-16 text-xs text-muted-foreground shrink-0">Timer-md</span>
                  <span className="text-xl font-semibold font-mono tabular-nums">04:30</span>
                  <span className="text-xs text-muted-foreground">20px SemiBold · VQA 타이머</span>
                </div>
                <div className="flex items-baseline gap-4">
                  <span className="w-16 text-xs text-muted-foreground shrink-0">Timer-sm</span>
                  <span className="text-sm font-medium font-mono tabular-nums">0:45</span>
                  <span className="text-xs text-muted-foreground">14px Medium · 버튼 내 카운트다운</span>
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
                  { label: 'rounded-sm', cls: 'rounded-sm' },
                  { label: 'rounded-md', cls: 'rounded-md' },
                  { label: 'rounded-lg', cls: 'rounded-lg' },
                  { label: 'rounded-xl', cls: 'rounded-xl' },
                  { label: 'rounded-2xl', cls: 'rounded-2xl' },
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
                  { label: 'shadow-xl', cls: 'shadow-xl' },
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
                <p><code className="bg-muted px-1.5 py-0.5 rounded text-xs">z-0</code> Content Area</p>
                <p><code className="bg-muted px-1.5 py-0.5 rounded text-xs">z-10</code> GNB Sidebar / Top Bar</p>
                <p><code className="bg-muted px-1.5 py-0.5 rounded text-xs">z-20</code> Booking Left Panel</p>
                <p><code className="bg-muted px-1.5 py-0.5 rounded text-xs">z-30</code> Queue Overlay Card</p>
                <p><code className="bg-muted px-1.5 py-0.5 rounded text-xs">z-40</code> Modal / VQA / Payment</p>
                <p><code className="bg-muted px-1.5 py-0.5 rounded text-xs">z-50</code> Toast Notification</p>
              </div>
            </SubSection>
          </Section>

          {/* ============================================================ */}
          {/* 04. Button */}
          {/* ============================================================ */}
          <Section id="button" number="04" title="버튼 (Button)">
            <p className="text-sm text-muted-foreground mb-6">6가지 Variant, 8가지 Size. class-variance-authority 기반. Primary = Indigo.</p>

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
                <DemoBox label="예매 CTA">
                  <Button size="lg" className="w-full gap-2">
                    지금 예매하기
                  </Button>
                </DemoBox>
                <DemoBox label="Booking 액션">
                  <div className="flex gap-3">
                    <Button className="flex-1">선택 완료</Button>
                    <Button variant="outline" className="flex-1">초기화</Button>
                  </div>
                </DemoBox>
                <DemoBox label="Search Input">
                  <div className="flex gap-2">
                    <Input placeholder="아티스트, 공연 검색..." className="flex-1" />
                    <Button size="icon"><Search size={16} /></Button>
                  </div>
                </DemoBox>
              </div>
            </SubSection>
          </Section>

          {/* ============================================================ */}
          {/* 05. Badge */}
          {/* ============================================================ */}
          <Section id="badge" number="05" title="뱃지 (Badge)">
            <p className="text-sm text-muted-foreground mb-6">shadcn/ui Badge 기반. 상태/카테고리 인라인 라벨.</p>

            <SubSection title="Variants">
              <div className="flex flex-wrap gap-3 items-center">
                {(['default', 'secondary', 'destructive', 'outline'] as const).map((v) => (
                  <Badge key={v} variant={v}>{v}</Badge>
                ))}
              </div>
            </SubSection>

            <SubSection title="도메인 활용">
              <div className="flex flex-wrap gap-3 items-center">
                <Badge variant="secondary">K-POP</Badge>
                <Badge variant="secondary">콘서트</Badge>
                <Badge variant="secondary">팬미팅</Badge>
                <Badge variant="secondary">페스티벌</Badge>
              </div>
            </SubSection>
          </Section>

          {/* ============================================================ */}
          {/* 06. TierBadge */}
          {/* ============================================================ */}
          <Section id="tier-badge" number="06" title="TierBadge (등급 배지)">
            <p className="text-sm text-muted-foreground mb-6">
              4개 등급: Diamond, Gold, Silver, Bronze. 이모지 + 라벨 구조. 읽기 전용 (클릭 불가).
            </p>

            <SubSection title="Default 사이즈">
              <div className="flex flex-wrap gap-4 items-center">
                {(Object.keys(TIER_LABELS) as TierLevel[]).map((t) => (
                  <TierBadge key={t} tier={t} />
                ))}
              </div>
            </SubSection>

            <SubSection title="Small 사이즈">
              <div className="flex flex-wrap gap-4 items-center">
                {(Object.keys(TIER_LABELS) as TierLevel[]).map((t) => (
                  <TierBadge key={t} tier={t} size="sm" />
                ))}
              </div>
            </SubSection>

            <SubSection title="Large 사이즈">
              <div className="flex flex-wrap gap-4 items-center">
                {(Object.keys(TIER_LABELS) as TierLevel[]).map((t) => (
                  <TierBadge key={t} tier={t} size="lg" />
                ))}
              </div>
            </SubSection>

            <SubSection title="Emoji Only (접근성: tooltip/aria-label 필수)">
              <div className="flex flex-wrap gap-4 items-center">
                {(Object.keys(TIER_LABELS) as TierLevel[]).map((t) => (
                  <TierBadge key={t} tier={t} showLabel={false} />
                ))}
              </div>
            </SubSection>

            <SubSection title="실제 사용 예시">
              <DemoBox label="사이드바 프로필 영역">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-full bg-muted flex items-center justify-center text-sm text-muted-foreground">JK</div>
                  <div>
                    <p className="text-sm font-medium">김수호</p>
                    <TierBadge tier="diamond" size="sm" />
                  </div>
                </div>
              </DemoBox>
            </SubSection>
          </Section>

          {/* ============================================================ */}
          {/* 07. BookingStatusBadge */}
          {/* ============================================================ */}
          <Section id="booking-badge" number="07" title="BookingStatusBadge (예매 상태)">
            <p className="text-sm text-muted-foreground mb-6">
              예매 상태 4종: 예매 오픈 / 오픈 예정 / 매진 / 종료. Dot + Label pill 스타일.
            </p>

            <SubSection title="모든 상태">
              <div className="flex flex-wrap gap-4 items-center">
                {(Object.keys(BOOKING_STATUS_LABELS) as BookingStatus[]).map((s) => (
                  <BookingStatusBadge key={s} status={s} />
                ))}
              </div>
            </SubSection>

            <SubSection title="실제 사용 예시">
              <DemoBox label="이벤트 카드 내 배치">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold">G-DRAGON WORLD TOUR</span>
                  <BookingStatusBadge status="open" />
                </div>
              </DemoBox>
            </SubSection>
          </Section>

          {/* ============================================================ */}
          {/* 08. TransferStatusBadge */}
          {/* ============================================================ */}
          <Section id="transfer-badge" number="08" title="TransferStatusBadge (양도 상태)">
            <p className="text-sm text-muted-foreground mb-6">
              양도 상태 4종: 등록 중 / 판매 완료 / 양도 완료 / 취소됨. Dot + Label pill 스타일.
            </p>

            <SubSection title="모든 상태">
              <div className="flex flex-wrap gap-4 items-center">
                {(Object.keys(TRANSFER_STATUS_LABELS) as TransferStatus[]).map((s) => (
                  <TransferStatusBadge key={s} status={s} />
                ))}
              </div>
            </SubSection>
          </Section>

          {/* ============================================================ */}
          {/* 09. SeatStatusLegend */}
          {/* ============================================================ */}
          <Section id="seat-legend" number="09" title="SeatStatusLegend (좌석 상태 범례)">
            <p className="text-sm text-muted-foreground mb-6">
              좌석맵에 반드시 포함. 4개 상태 수평 나열: 선택 가능 / 내 선택 / 판매 완료 / 타인 점유.
            </p>

            <SubSection title="Default">
              <SeatStatusLegend />
            </SubSection>

            <SubSection title="Compact">
              <SeatStatusLegend compact />
            </SubSection>

            <SubSection title="좌석 상태 원형 프리뷰">
              <div className="flex gap-3">
                {(Object.keys(SEAT_STATUS_LABELS) as SeatStatus[]).map((s) => (
                  <div key={s} className="flex flex-col items-center gap-2">
                    <div className={`size-8 rounded-full border-2 ${
                      s === 'available' ? 'bg-seat-available/20 border-seat-available' :
                      s === 'selected' ? 'bg-seat-selected/20 border-seat-selected' :
                      s === 'taken' ? 'bg-seat-taken/20 border-seat-taken' :
                      'bg-seat-locked/20 border-seat-locked'
                    }`} />
                    <span className="text-[11px] text-muted-foreground">{SEAT_STATUS_LABELS[s]}</span>
                  </div>
                ))}
              </div>
            </SubSection>
          </Section>

          {/* ============================================================ */}
          {/* 10. TimerDisplay */}
          {/* ============================================================ */}
          <Section id="timer" number="10" title="TimerDisplay (카운트다운 타이머)">
            <p className="text-sm text-muted-foreground mb-6">
              JetBrains Mono. 자동 색상 변경: 기본 → 60초 이하 앰버 → 30초 이하 빨강+펄스.
            </p>

            <SubSection title="Size 별">
              <div className="flex flex-wrap gap-8 items-center">
                <div className="flex flex-col items-center gap-2">
                  <TimerDisplay seconds={147} size="lg" />
                  <span className="text-[11px] text-muted-foreground">lg (28px)</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <TimerDisplay seconds={270} />
                  <span className="text-[11px] text-muted-foreground">default (20px)</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <TimerDisplay seconds={45} size="sm" />
                  <span className="text-[11px] text-muted-foreground">sm (14px)</span>
                </div>
              </div>
            </SubSection>

            <SubSection title="색상 변경 (시간에 따른 자동 적용)">
              <div className="flex flex-wrap gap-8 items-center">
                <div className="flex flex-col items-center gap-2">
                  <TimerDisplay seconds={147} />
                  <span className="text-[11px] text-muted-foreground">{'>'}60s: 기본</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <TimerDisplay seconds={45} />
                  <span className="text-[11px] text-muted-foreground">{'<'}60s: 앰버</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <TimerDisplay seconds={15} />
                  <span className="text-[11px] text-muted-foreground">{'<'}30s: 빨강+펄스</span>
                </div>
              </div>
            </SubSection>

            <SubSection title="아이콘 숨김">
              <TimerDisplay seconds={90} showIcon={false} />
            </SubSection>
          </Section>

          {/* ============================================================ */}
          {/* 11. PriceDisplay & FaceValueBadge */}
          {/* ============================================================ */}
          <Section id="price" number="11" title="PriceDisplay · FaceValueBadge">
            <p className="text-sm text-muted-foreground mb-6">
              가격 표시: 숫자 + 원 (천단위 콤마). 정가 대비 Badge: 100% 이하 초록, 130% 이하 앰버, 초과 빨강.
            </p>

            <SubSection title="PriceDisplay Sizes">
              <div className="flex flex-wrap gap-8 items-baseline">
                <div className="flex flex-col items-center gap-2">
                  <PriceDisplay amount={165000} size="lg" />
                  <span className="text-[11px] text-muted-foreground">lg</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <PriceDisplay amount={165000} />
                  <span className="text-[11px] text-muted-foreground">default</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <PriceDisplay amount={165000} size="sm" />
                  <span className="text-[11px] text-muted-foreground">sm</span>
                </div>
              </div>
            </SubSection>

            <SubSection title="FaceValueBadge (정가 대비 %)">
              <div className="flex flex-wrap gap-4 items-center">
                <FaceValueBadge percentage={95} />
                <FaceValueBadge percentage={115} />
                <FaceValueBadge percentage={145} />
              </div>
            </SubSection>

            <SubSection title="실제 사용 예시">
              <DemoBox label="양도 카드 내 가격 영역">
                <div className="flex items-center gap-3">
                  <PriceDisplay amount={180000} />
                  <FaceValueBadge percentage={109} />
                </div>
              </DemoBox>
            </SubSection>
          </Section>

          {/* ============================================================ */}
          {/* 12. EventCard */}
          {/* ============================================================ */}
          <Section id="event-card" number="12" title="EventCard (이벤트 카드)">
            <p className="text-sm text-muted-foreground mb-6">
              이벤트 정보를 표시하는 카드. Default (가로) / Compact (세로 그리드용) 두 가지 변형.
            </p>

            <SubSection title="Default (가로 배치)">
              <div className="space-y-3">
                <EventCard event={sampleEvent} />
                <EventCard event={sampleEventUpcoming} />
                <EventCard event={sampleEventSoldout} />
              </div>
            </SubSection>

            <SubSection title="Compact (세로 그리드)">
              <div className="grid grid-cols-3 gap-4">
                <EventCard event={sampleEvent} variant="compact" />
                <EventCard event={sampleEventUpcoming} variant="compact" />
                <EventCard event={sampleEventSoldout} variant="compact" />
              </div>
            </SubSection>
          </Section>

          {/* ============================================================ */}
          {/* 13. ArtistCard */}
          {/* ============================================================ */}
          <Section id="artist-card" number="13" title="ArtistCard (아티스트 카드)">
            <p className="text-sm text-muted-foreground mb-6">
              아티스트 프로필 카드. Default (세로) / Compact (가로). 온보딩 아티스트 선택에서 selected 상태 사용.
            </p>

            <SubSection title="Default (세로 — 온보딩 아티스트 선택)">
              <div className="grid grid-cols-4 gap-4">
                {sampleArtists.map((a) => (
                  <ArtistCard
                    key={a.id}
                    artist={a}
                    selected={selectedArtists.has(a.id)}
                    onClick={() => toggleArtist(a.id)}
                  />
                ))}
              </div>
            </SubSection>

            <SubSection title="Compact (가로)">
              <div className="grid grid-cols-2 gap-3 max-w-lg">
                {sampleArtists.slice(0, 2).map((a) => (
                  <ArtistCard key={a.id} artist={a} variant="compact" />
                ))}
              </div>
            </SubSection>
          </Section>

          {/* ============================================================ */}
          {/* 14. TicketCard */}
          {/* ============================================================ */}
          <Section id="ticket-card" number="14" title="TicketCard (내 티켓 카드)">
            <p className="text-sm text-muted-foreground mb-6">
              My Page 티켓 목록. Upcoming: QR보기 + 양도등록 버튼. Past: 전체 opacity 처리.
            </p>

            <SubSection title="Upcoming (다가오는 공연)">
              <TicketCard ticket={sampleTicket} onViewQR={() => {}} onTransfer={() => {}} />
            </SubSection>

            <SubSection title="Past (지난 공연)">
              <TicketCard ticket={{ ...sampleTicket, isUpcoming: false }} variant="past" />
            </SubSection>
          </Section>

          {/* ============================================================ */}
          {/* 15. TransferCard */}
          {/* ============================================================ */}
          <Section id="transfer-card" number="15" title="TransferCard (양도 리스팅 카드)">
            <p className="text-sm text-muted-foreground mb-6">
              양도 마켓 카드 그리드 아이템. 포스터 + 좌석 정보 + 가격 + FaceValueBadge + 판매자 TierBadge.
            </p>

            <SubSection title="카드 그리드">
              <div className="grid grid-cols-3 gap-4">
                <TransferCard listing={sampleTransfer} onClick={() => {}} />
                <TransferCard listing={{
                  ...sampleTransfer, id: 'tr2', price: 165000, sellerTier: 'diamond',
                  sellerTransactionCount: 45, section: 'VIP구역', seatInfo: '1열 3번',
                }} onClick={() => {}} />
                <TransferCard listing={{
                  ...sampleTransfer, id: 'tr3', price: 220000, sellerTier: 'silver',
                  sellerTransactionCount: 3, section: 'C구역', seatInfo: '12열 7번',
                }} onClick={() => {}} />
              </div>
            </SubSection>
          </Section>

          {/* ============================================================ */}
          {/* 16. NotificationCard */}
          {/* ============================================================ */}
          <Section id="notification" number="16" title="NotificationCard (알림 카드)">
            <p className="text-sm text-muted-foreground mb-6">
              알림 목록 아이템. 타입별 아이콘, 읽지 않음 blue dot, 상대 시간 표시.
            </p>

            <SubSection title="알림 리스트">
              <div className="rounded-lg border border-border divide-y divide-border">
                {sampleNotifications.map((n) => (
                  <NotificationCard key={n.id} notification={n} isUnread={!n.isRead} />
                ))}
              </div>
            </SubSection>
          </Section>

          {/* ============================================================ */}
          {/* 17. QueueStatusCard */}
          {/* ============================================================ */}
          <Section id="queue-card" number="17" title="QueueStatusCard (대기열 상태 카드)">
            <p className="text-sm text-muted-foreground mb-6">
              예매 대기열 오버레이 카드. 순번, 전체 대기자, 예상 대기 시간, 성공 확률 표시.
            </p>

            <SubSection title="확률별 색상 변화">
              <div className="grid grid-cols-3 gap-4">
                <QueueStatusCard position={47} totalInQueue={1200} estimatedWait="2분 15초" probability={92} />
                <QueueStatusCard position={523} totalInQueue={1200} estimatedWait="12분 30초" probability={45} />
                <QueueStatusCard position={1150} totalInQueue={1200} estimatedWait="28분" probability={8} />
              </div>
            </SubSection>
          </Section>

          {/* ============================================================ */}
          {/* 18. PostCard */}
          {/* ============================================================ */}
          <Section id="post-card" number="18" title="PostCard (커뮤니티 게시글)">
            <p className="text-sm text-muted-foreground mb-6">
              아티스트 소통 탭 커뮤니티 게시글 카드. Default (전체) / Compact (축소) 변형. 공식 계정 BadgeCheck 지원.
            </p>

            <SubSection title="Default">
              <div className="space-y-4 max-w-lg">
                {samplePosts.map((p) => (
                  <PostCard key={p.id} post={p} />
                ))}
              </div>
            </SubSection>

            <SubSection title="Compact">
              <div className="space-y-3 max-w-md">
                {samplePosts.map((p) => (
                  <PostCard key={p.id} post={p} variant="compact" />
                ))}
              </div>
            </SubSection>
          </Section>

          {/* ============================================================ */}
          {/* 19. EventTagBadge */}
          {/* ============================================================ */}
          <Section id="event-tag" number="19" title="EventTagBadge (이벤트 태그)">
            <p className="text-sm text-muted-foreground mb-6">
              이벤트 카드에 붙는 태그 pill. HOT(빨강), NEW/선예매(파랑), 기본(회색) 3가지 variant 자동 결정.
            </p>

            <SubSection title="모든 태그 유형">
              <div className="flex flex-wrap gap-3 items-center">
                <EventTagBadge tag="HOT" />
                <EventTagBadge tag="NEW" />
                <EventTagBadge tag="선예매" />
                <EventTagBadge tag="일반예매" />
                <EventTagBadge tag="콘서트" />
                <EventTagBadge tag="팬미팅" />
              </div>
            </SubSection>

            <SubSection title="실제 사용 예시">
              <DemoBox label="이벤트 리스트 아이템 내 태그">
                <div className="flex items-center gap-2">
                  <EventTagBadge tag="HOT" />
                  <span className="text-sm font-semibold">G-DRAGON 2026 WORLD TOUR</span>
                  <EventTagBadge tag="선예매" />
                </div>
              </DemoBox>
            </SubSection>
          </Section>

          {/* ============================================================ */}
          {/* 20. Input */}
          {/* ============================================================ */}
          <Section id="input" number="20" title="입력 필드 (Input)">
            <p className="text-sm text-muted-foreground mb-6">shadcn/ui Input 기반. 검색, 가격, 인증코드 등.</p>

            <SubSection title="기본 입력">
              <div className="space-y-3 max-w-sm">
                <Input placeholder="기본 입력" />
                <Input placeholder="비활성" disabled />
              </div>
            </SubSection>

            <SubSection title="실제 사용 예시">
              <div className="space-y-3">
                <DemoBox label="검색 필드">
                  <div className="flex gap-2 max-w-md">
                    <div className="relative flex-1">
                      <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <Input placeholder="아티스트, 공연 검색..." className="pl-9" />
                    </div>
                  </div>
                </DemoBox>
                <DemoBox label="양도 가격 입력">
                  <div className="max-w-xs">
                    <label className="text-sm font-medium mb-1.5 block">양도 가격</label>
                    <div className="relative">
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">원</span>
                      <Input placeholder="165,000" className="pr-8 text-right" />
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-1">정가: 165,000원</p>
                  </div>
                </DemoBox>
                <DemoBox label="VQA 인증코드 입력 (monospace)">
                  <div className="max-w-xs">
                    <Input placeholder="인증코드 6자리" className="font-mono text-center tracking-[0.3em] text-lg" maxLength={6} />
                  </div>
                </DemoBox>
              </div>
            </SubSection>
          </Section>

          {/* ============================================================ */}
          {/* 21. Card Base */}
          {/* ============================================================ */}
          <Section id="card-base" number="21" title="기본 카드 (Card)">
            <p className="text-sm text-muted-foreground mb-6">shadcn/ui Card 기반. 정보 그룹핑 레이아웃.</p>

            <div className="grid gap-6 md:grid-cols-2">
              <DemoBox label="기본 카드">
                <Card>
                  <CardHeader>
                    <CardTitle>G-Dragon 멤버십</CardTitle>
                    <CardDescription>현재 등급 및 혜택 정보</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-3">
                      <TierBadge tier="diamond" size="lg" />
                      <div>
                        <p className="text-2xl font-bold">Diamond</p>
                        <p className="text-xs text-muted-foreground">2026.12.31 만료</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button size="sm" variant="outline">혜택 보기</Button>
                  </CardFooter>
                </Card>
              </DemoBox>

              <DemoBox label="통계 카드">
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader>
                    <CardTitle>양도 마켓</CardTitle>
                    <CardDescription>현재 등록된 양도 티켓</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">128</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      <span className="text-success font-medium">+12</span> 오늘 등록
                    </p>
                  </CardContent>
                </Card>
              </DemoBox>
            </div>
          </Section>

          {/* ============================================================ */}
          {/* 22. Skeleton & Progress */}
          {/* ============================================================ */}
          <Section id="skeleton" number="22" title="스켈레톤 · 프로그레스">

            <SubSection title="Skeleton (로딩 플레이스홀더)">
              <div className="space-y-4">
                <DemoBox label="카드 로딩">
                  <div className="flex gap-4">
                    <Skeleton className="h-[140px] w-[100px] rounded-lg" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-4 w-2/3" />
                      <Skeleton className="h-4 w-1/3" />
                    </div>
                  </div>
                </DemoBox>
                <DemoBox label="텍스트 로딩">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-4/5" />
                    <Skeleton className="h-4 w-3/5" />
                  </div>
                </DemoBox>
              </div>
            </SubSection>

            <SubSection title="Progress (진행률)">
              <div className="space-y-4 max-w-md">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">VQA 진행</span>
                    <span className="font-medium">2/3</span>
                  </div>
                  <Progress value={66} />
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">온보딩 스텝</span>
                    <span className="font-medium">1/4</span>
                  </div>
                  <Progress value={25} />
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">완료</span>
                    <span className="font-medium">4/4</span>
                  </div>
                  <Progress value={100} />
                </div>
              </div>
            </SubSection>
          </Section>

          {/* ============================================================ */}
          {/* 23. Icon System */}
          {/* ============================================================ */}
          <Section id="icons" number="23" title="아이콘 시스템 (Lucide Icons)">
            <p className="text-sm text-muted-foreground mb-6">Lucide React 전용. 도메인별 아이콘 매핑.</p>

            <SubSection title="네비게이션 아이콘">
              <div className="flex flex-wrap gap-6">
                {[
                  { icon: Home, label: '홈' },
                  { icon: Calendar, label: '공연' },
                  { icon: Users, label: '아티스트' },
                  { icon: Search, label: '검색' },
                  { icon: Bell, label: '알림' },
                  { icon: Settings, label: '설정' },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex flex-col items-center gap-2">
                    <div className="size-10 rounded-lg bg-muted flex items-center justify-center">
                      <Icon size={20} />
                    </div>
                    <span className="text-[11px] text-muted-foreground">{label}</span>
                  </div>
                ))}
              </div>
            </SubSection>

            <SubSection title="도메인 아이콘">
              <div className="flex flex-wrap gap-6">
                {[
                  { icon: MapPin, label: '장소' },
                  { icon: Clock, label: '타이머' },
                  { icon: QrCode, label: 'QR' },
                  { icon: ArrowLeftRight, label: '양도' },
                  { icon: Crown, label: '멤버십' },
                  { icon: Music, label: '멜론 연동' },
                  { icon: Heart, label: '팔로우' },
                  { icon: CreditCard, label: '결제' },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex flex-col items-center gap-2">
                    <div className="size-10 rounded-lg bg-muted flex items-center justify-center">
                      <Icon size={20} />
                    </div>
                    <span className="text-[11px] text-muted-foreground">{label}</span>
                  </div>
                ))}
              </div>
            </SubSection>

            <SubSection title="액션/피드백 아이콘">
              <div className="flex flex-wrap gap-6">
                {[
                  { icon: Check, label: '체크' },
                  { icon: X, label: '닫기' },
                  { icon: ChevronLeft, label: '접기' },
                  { icon: ChevronRight, label: '펼기' },
                  { icon: ChevronDown, label: '서브메뉴' },
                  { icon: CheckCircle, label: '성공', cls: 'text-success' },
                  { icon: AlertCircle, label: '에러', cls: 'text-danger' },
                  { icon: AlertTriangle, label: '경고', cls: 'text-warning' },
                ].map(({ icon: Icon, label, cls }) => (
                  <div key={label} className="flex flex-col items-center gap-2">
                    <div className="size-10 rounded-lg bg-muted flex items-center justify-center">
                      <Icon size={20} className={cls} />
                    </div>
                    <span className="text-[11px] text-muted-foreground">{label}</span>
                  </div>
                ))}
              </div>
            </SubSection>
          </Section>

          {/* ============================================================ */}
          {/* 24. Sidebar Preview */}
          {/* ============================================================ */}
          <Section id="sidebar-preview" number="24" title="사이드바 프리뷰 (Warm Off-White Pattern)">
            <p className="text-sm text-muted-foreground mb-6">
              화이트 사이드바 + 콘텐츠 영역 조합. 240px 기본 / 64px 접힘.
            </p>

            <SubSection title="GNB Sidebar Mock">
              <div className="rounded-xl overflow-hidden border border-border">
                <div className="flex h-[520px]">
                  {/* White Sidebar */}
                  <div className="w-[240px] bg-card text-foreground flex flex-col shrink-0 border-r border-border">
                    {/* Logo */}
                    <div className="flex h-14 items-center px-5 border-b border-border">
                      <span className="text-base font-bold text-primary">URR</span>
                      <span className="text-[11px] ml-1.5 text-muted-foreground">우르르</span>
                    </div>

                    {/* Membership */}
                    <div className="px-4 py-3 border-b border-border">
                      <div className="flex items-center gap-3">
                        <div className="size-9 rounded-full bg-muted flex items-center justify-center text-xs text-muted-foreground">SH</div>
                        <div>
                          <p className="text-sm font-medium">김수호</p>
                          <TierBadge tier="diamond" size="sm" />
                        </div>
                      </div>
                    </div>

                    {/* Nav Items */}
                    <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">
                      {[
                        { icon: Home, label: '홈', active: true },
                        { icon: Calendar, label: '공연', active: false },
                        { icon: Users, label: '아티스트', active: false },
                      ].map(({ icon: Icon, label, active }) => (
                        <div
                          key={label}
                          className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                            active ? 'bg-accent text-foreground font-medium' : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
                          }`}
                        >
                          <Icon size={18} />
                          <span>{label}</span>
                        </div>
                      ))}

                      <Separator className="!my-3" />

                      <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">MY ARTISTS</p>

                      {/* Artist Tree */}
                      <div className="space-y-0.5 mt-2">
                        <div className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm bg-accent text-foreground font-medium">
                          <ChevronDown size={14} />
                          <span>G-Dragon</span>
                        </div>
                        {['홈', '공연', '양도'].map((sub) => (
                          <div key={sub} className="flex items-center gap-2 rounded-lg pl-9 pr-3 py-1.5 text-sm text-muted-foreground hover:bg-accent/50 hover:text-foreground">
                            <span>{sub}</span>
                          </div>
                        ))}
                        <div className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-accent/50 hover:text-foreground">
                          <ChevronRight size={14} />
                          <span>BTS</span>
                        </div>
                        <div className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-accent/50 hover:text-foreground">
                          <ChevronRight size={14} />
                          <span>aespa</span>
                        </div>
                      </div>
                    </nav>

                    {/* Bottom */}
                    <div className="border-t border-border px-4 py-3">
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <Settings size={16} />
                        <span>설정</span>
                      </div>
                    </div>
                  </div>

                  {/* Content Area (warm beige) */}
                  <div className="flex-1 bg-background">
                    <div className="flex h-14 items-center border-b border-border px-6 gap-4">
                      <span className="text-sm text-muted-foreground">홈 / G-Dragon</span>
                      <div className="ml-auto flex gap-2">
                        <Button size="icon-sm" variant="ghost"><Search size={16} /></Button>
                        <Button size="icon-sm" variant="ghost"><Bell size={16} /></Button>
                      </div>
                    </div>
                    <div className="p-6">
                      <h2 className="text-xl font-semibold mb-4">Welcome to URR</h2>
                      <p className="text-sm text-muted-foreground">사이드바: White (220px)</p>
                      <p className="text-sm text-muted-foreground mt-1">콘텐츠: Warm Beige (#E8E5E1)</p>
                    </div>
                  </div>
                </div>
              </div>
            </SubSection>
          </Section>

          {/* ============================================================ */}
          {/* 25. FilterChip · ViewToggle */}
          {/* ============================================================ */}
          <Section id="filter-chip" number="25" title="FilterChip · ViewToggle">
            <p className="text-sm text-muted-foreground mb-6">
              카테고리 필터 칩과 그리드/리스트 뷰 전환 토글. 아티스트 탭, 공연 탭 등에서 공용 사용. 높이 32px 통일.
            </p>

            <SubSection title="FilterChip (카테고리 필터)">
              <div className="space-y-4">
                <DemoBox label="아티스트 탭 예시">
                  <FilterChip
                    options={[
                      { value: 'all', label: '전체' },
                      { value: 'group', label: '그룹' },
                      { value: 'solo', label: '솔로' },
                      { value: 'new', label: 'NEW' },
                    ]}
                    value={demoFilter}
                    onChange={setDemoFilter}
                  />
                </DemoBox>
                <DemoBox label="공연 탭 예시">
                  <FilterChip
                    options={[
                      { value: 'all', label: '전체' },
                      { value: 'concert', label: '콘서트' },
                      { value: 'fanmeeting', label: '팬미팅' },
                      { value: 'domestic', label: '내한공연' },
                      { value: 'festival', label: '페스티벌' },
                    ]}
                    value="all"
                    onChange={() => {}}
                  />
                </DemoBox>
              </div>
            </SubSection>

            <SubSection title="ViewToggle (뷰 전환)">
              <DemoBox label="그리드/리스트 토글">
                <ViewToggle value={demoView} onChange={setDemoView} />
              </DemoBox>
            </SubSection>

            <SubSection title="조합 사용 (실제 레이아웃)">
              <DemoBox label="공연 탭 필터 바">
                <div className="flex items-center justify-between">
                  <FilterChip
                    options={[
                      { value: 'all', label: '전체' },
                      { value: 'concert', label: '콘서트' },
                      { value: 'fanmeeting', label: '팬미팅' },
                    ]}
                    value="all"
                    onChange={() => {}}
                  />
                  <ViewToggle value={demoView} onChange={setDemoView} />
                </div>
              </DemoBox>
            </SubSection>
          </Section>

          {/* Footer */}
          <div className="border-t border-border pt-8 pb-16 text-center">
            <p className="text-sm text-muted-foreground">URR (우르르) Design System v1.2</p>
            <p className="text-xs text-muted-foreground mt-1">Pretendard Variable · shadcn/ui · Tailwind CSS v4 · oklch</p>
          </div>

        </div>
      </main>
    </div>
  )
}
