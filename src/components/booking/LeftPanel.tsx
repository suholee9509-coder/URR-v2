import { ChevronLeft, MapPin } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useBooking } from '@/hooks/useBooking'
import { useCountdown } from '@/hooks/useCountdown'
import { formatCountdown } from '@/lib/format'
import { TierBadge, PriceDisplay } from '@/components/urr'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { TIER_LABELS, TIER_EMOJIS } from '@/types'
import type { TierLevel } from '@/types'
import { LeftPanelCollapsed } from './LeftPanelCollapsed'

const TIER_ORDER: TierLevel[] = ['diamond', 'gold', 'silver', 'bronze']

function formatCompactDate(isoDate: string): string {
  const d = new Date(isoDate)
  return new Intl.DateTimeFormat('ko-KR', {
    month: 'numeric',
    day: 'numeric',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(d)
}

function formatWindowDate(isoDate: string): string {
  const d = new Date(isoDate)
  return new Intl.DateTimeFormat('ko-KR', {
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(d)
}

// Sub-component: Tier schedule row
function TierScheduleRow({
  tier,
  opensAt,
  isUserTier,
}: {
  tier: TierLevel
  opensAt: string
  isUserTier: boolean
}) {
  const isOpen = new Date(opensAt).getTime() <= Date.now()

  return (
    <div
      className={cn(
        'flex items-center justify-between py-1.5 px-2.5 rounded-lg text-sm',
        isUserTier && 'bg-white/80 shadow-[0_0_0_1px_rgba(0,0,0,0.04)]',
      )}
    >
      <span className="flex items-center gap-1.5 font-medium">
        <span>{TIER_EMOJIS[tier]}</span>
        <span>{TIER_LABELS[tier]}</span>
      </span>
      <span
        className={cn(
          'text-xs tabular-nums',
          isOpen ? 'text-booking-open font-semibold' : 'text-muted-foreground',
        )}
      >
        {isOpen ? '오픈됨' : formatWindowDate(opensAt)}
      </span>
    </div>
  )
}

// Loading skeleton for left panel
function LeftPanelSkeleton() {
  return (
    <div className="p-5 space-y-4">
      <Skeleton className="w-full h-[200px] rounded-xl" />
      <Skeleton className="w-3/5 h-3" />
      <Skeleton className="w-full h-6" />
      <Skeleton className="w-2/5 h-4" />
      <Separator />
      <div className="space-y-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="w-full h-4" />
        ))}
      </div>
      <Separator />
      <div className="space-y-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="w-full h-8" />
        ))}
      </div>
      <Separator />
      <Skeleton className="w-full h-10 rounded-md" />
    </div>
  )
}

export function LeftPanel() {
  const {
    event,
    isLeftPanelExpanded,
    isLoading,
    selectedDateId,
    selectedDate,
    sectionsForDate,
    userTier,
    bookingState,
    isWindowOpen,
    isSoldOut,
    userWindowOpensAt,
    selectDate,
    toggleLeftPanel,
    startBooking,
  } = useBooking()

  const isBookingActive = bookingState !== 'idle'

  const countdownToOpen = useCountdown(isWindowOpen ? null : userWindowOpensAt)

  return (
    <div
      className={cn(
        'h-full border-r border-border bg-white shrink-0 transition-[width] duration-200 ease-out z-20 flex flex-col',
        isLeftPanelExpanded ? 'w-[360px]' : 'w-12',
      )}
    >
      {/* Collapsed view */}
      {!isLeftPanelExpanded && <LeftPanelCollapsed />}

      {/* Expanded content */}
      {isLeftPanelExpanded && (
        <>
          {/* Top control bar: Date selector + Collapse toggle */}
          <div className="flex items-center gap-2 px-4 h-12 border-b border-border shrink-0">
            <select
              value={selectedDateId ?? ''}
              onChange={(e) => selectDate(e.target.value)}
              className="flex-1 min-w-0 h-8 px-2.5 rounded-md border border-border bg-white text-sm font-medium focus:outline-none focus:ring-1 focus:ring-ring transition-colors truncate cursor-pointer"
            >
              {event?.dates.map((d) => (
                <option key={d.id} value={d.id}>
                  {formatCompactDate(d.date)} — 잔여 {d.remainingSeats.toLocaleString()}석
                </option>
              ))}
            </select>
            <button
              onClick={toggleLeftPanel}
              className="p-1.5 rounded-md hover:bg-accent transition-colors shrink-0"
              aria-label="패널 접기"
            >
              <ChevronLeft size={16} className="text-muted-foreground" />
            </button>
          </div>

          {/* Scrollable body */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden">
            {isLoading ? (
              <LeftPanelSkeleton />
            ) : event ? (
              <div className="p-5 space-y-4">
                {/* 1. Poster */}
                <div className="w-full h-[200px] rounded-xl bg-muted overflow-hidden relative">
                  {event.poster ? (
                    <img src={event.poster} alt={event.title} className="absolute inset-0 w-full h-full object-cover" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-muted-foreground text-sm">포스터</span>
                    </div>
                  )}
                </div>

                {/* 2. Chip tags */}
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="secondary" className="text-[11px]">단독 공연</Badge>
                  <Badge variant="outline" className="text-[11px]">DOME TOUR</Badge>
                </div>

                {/* 3. Event title */}
                <h2 className="text-xl font-semibold leading-snug line-clamp-2">
                  {event.title}
                </h2>

                {/* 4. Venue */}
                <div className="flex items-center gap-1.5 text-[13px] text-muted-foreground">
                  <MapPin size={14} className="shrink-0" />
                  <span>{event.venue}</span>
                </div>

                {/* 5. Price table */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1 pb-1">
                    <span>구역</span>
                    <span>가격</span>
                  </div>
                  {sectionsForDate.map((section) => (
                    <div
                      key={section.id}
                      className="flex items-center justify-between py-1.5 px-1 text-sm"
                    >
                      <span className="font-medium">{section.name}</span>
                      <PriceDisplay amount={section.price} size="sm" />
                    </div>
                  ))}
                </div>

                {/* 6. Tier booking schedule — filled card */}
                <div className="rounded-xl bg-muted/50 p-4 space-y-3">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    등급별 예매 일정
                  </h4>
                  <div className="space-y-0.5">
                    {selectedDate &&
                      TIER_ORDER.map((tier) => {
                        const window = selectedDate.bookingWindows.find(
                          (w) => w.tier === tier,
                        )
                        if (!window) return null
                        return (
                          <TierScheduleRow
                            key={tier}
                            tier={tier}
                            opensAt={window.opensAt}
                            isUserTier={tier === userTier}
                          />
                        )
                      })}
                  </div>
                  {/* My tier info */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-muted-foreground">
                      내 등급:
                    </span>
                    <TierBadge tier={userTier} size="sm" />
                  </div>
                </div>

                <Separator />

                {/* 8. Book Now button */}
                <div className="pb-2 pt-1">
                  {isSoldOut ? (
                    <Button disabled className="w-full" size="lg">
                      매진
                    </Button>
                  ) : isBookingActive ? (
                    <Button disabled className="w-full" size="lg">
                      예매 진행 중
                    </Button>
                  ) : isWindowOpen ? (
                    <Button
                      className="w-full"
                      size="lg"
                      onClick={startBooking}
                    >
                      예매하기
                    </Button>
                  ) : (
                    <Button disabled className="w-full" size="lg">
                      <span className="tabular-nums">
                        예매 오픈까지 {formatCountdown(countdownToOpen)}
                      </span>
                    </Button>
                  )}
                </div>
              </div>
            ) : null}
          </div>
        </>
      )}
    </div>
  )
}
