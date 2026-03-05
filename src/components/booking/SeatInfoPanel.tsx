import { X, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { TimerDisplay, PriceDisplay, SeatStatusLegend } from '@/components/urr'
import { formatPrice, parseSeatDisplay } from '@/lib/format'
import { TIER_EMOJIS, TIER_LABELS } from '@/types'
import type { Section, EventDate, TierLevel } from '@/types'

interface SeatInfoPanelProps {
  // State flags
  hasSection: boolean
  sectionName: string

  // Timer
  timerSeconds: number

  // Selection
  selectedSeatIds: string[]
  maxSeats: number
  onRemoveSeat: (seatId: string) => void

  // Price
  section: Section | null
  selectedDate: EventDate | null
  userTier: TierLevel

  // Actions
  onPay: () => void
}

export function SeatInfoPanel({
  hasSection,
  sectionName,
  timerSeconds,
  selectedSeatIds,
  maxSeats,
  onRemoveSeat,
  section,
  selectedDate,
  userTier,
  onPay,
}: SeatInfoPanelProps) {
  const seatCount = selectedSeatIds.length
  const tierFee = selectedDate?.bookingWindows.find((w) => w.tier === userTier)?.fee ?? 0
  const subtotal = section ? section.price * seatCount : 0
  const feeTotal = tierFee * seatCount
  const total = subtotal + feeTotal

  // Section not selected yet
  if (!hasSection) {
    return (
      <div className="w-[320px] shrink-0 border-l border-border bg-white flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 border-b border-border">
          <h3 className="text-sm font-semibold">좌석 선택</h3>
        </div>

        {/* Empty state */}
        <div className="flex-1 flex flex-col items-center justify-center gap-3 px-6 text-center">
          <div className="w-12 h-12 rounded-full bg-muted/60 flex items-center justify-center">
            <MapPin size={20} className="text-muted-foreground" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">구역을 선택해주세요</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              좌측 좌석 배치도에서 원하는 구역을<br />클릭하면 좌석을 고를 수 있어요
            </p>
          </div>
        </div>

        {/* Legend */}
        <div className="px-5 py-3 border-t border-border">
          <SeatStatusLegend compact className="justify-center" />
        </div>
      </div>
    )
  }

  // Section selected — full panel
  return (
    <div className="w-[320px] shrink-0 border-l border-border bg-white flex flex-col">
      {/* Timer */}
      <div className="px-5 py-4 border-b border-border flex items-center justify-center">
        <TimerDisplay seconds={timerSeconds} size="lg" />
      </div>

      {/* Selected seats list */}
      <div className="flex-1 min-h-0 overflow-y-auto px-5 py-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold">선택 좌석</h3>
          <span className="text-xs text-muted-foreground tabular-nums">
            {seatCount}/{maxSeats}석 선택됨
          </span>
        </div>

        {seatCount >= maxSeats && (
          <div className="mb-3 px-3 py-2 rounded-lg bg-warning/10 border border-warning/20">
            <p className="text-xs font-medium text-warning">
              최대 선택 수에 도달했습니다
            </p>
          </div>
        )}

        {seatCount === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            좌석을 선택해주세요
          </p>
        ) : (
          <div className="space-y-2">
            {selectedSeatIds.map((seatId) => (
              <div
                key={seatId}
                className="flex items-center justify-between px-3 py-2 rounded-lg bg-muted/50 border border-border"
              >
                <span className="text-sm font-medium">
                  {parseSeatDisplay(seatId, sectionName)}
                </span>
                <button
                  onClick={() => onRemoveSeat(seatId)}
                  className="p-1 rounded-md hover:bg-accent transition-colors"
                  aria-label="좌석 제거"
                >
                  <X size={14} className="text-muted-foreground" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Price breakdown */}
      <div className="px-5 py-4 border-t border-border space-y-2">
        {seatCount > 0 && section && (
          <>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">티켓</span>
              <span className="tabular-nums">
                {formatPrice(section.price)} × {seatCount}
              </span>
            </div>
            {tierFee > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-1">
                  <span>{TIER_EMOJIS[userTier]}</span>
                  <span>{TIER_LABELS[userTier]} 수수료</span>
                </span>
                <span className="tabular-nums">
                  {formatPrice(tierFee)} × {seatCount}
                </span>
              </div>
            )}
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold">총 결제 금액</span>
              <PriceDisplay amount={total} size="lg" />
            </div>
          </>
        )}
      </div>

      {/* Pay button */}
      <div className="px-5 pb-5 pt-2 shrink-0">
        <Button
          size="lg"
          className="w-full"
          disabled={seatCount === 0}
          onClick={onPay}
        >
          {seatCount > 0 ? `${formatPrice(total)} 결제하기` : '좌석을 선택해주세요'}
        </Button>
      </div>
    </div>
  )
}
