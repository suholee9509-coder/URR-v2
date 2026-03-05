import { useMemo, useState, useEffect, useCallback, useRef } from 'react'
import { ArrowLeft, X, ZoomIn, ZoomOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useBooking } from '@/hooks/useBooking'
import { useSeatTimer } from '@/hooks/useSeatTimer'
import { generateSeatsForSection, getSectionLayout } from '@/data/mock-seats'
import { SeatGrid } from './SeatGrid'
import { TimerExpiryModal } from './TimerExpiryModal'
import { TimerDisplay, PriceDisplay, SeatStatusLegend } from '@/components/urr'
import { formatPrice, parseSeatDisplay } from '@/lib/format'
import { TIER_EMOJIS, TIER_LABELS } from '@/types'
import type { Seat } from '@/types'

export function SeatSelectionView() {
  const {
    sectionsForDate,
    selectedSectionId,
    selectedSeatIds,
    selectedDate,
    userTier,
    maxSeats,
    toggleSeat,
    transitionTo,
    resetBooking,
    seatTimerSecondsLeft,
    setSeatTimerSecondsLeft,
  } = useBooking()

  const timer = useSeatTimer(seatTimerSecondsLeft ?? 180)
  const [showExpiryModal, setShowExpiryModal] = useState(false)
  const [zoomLevel, setZoomLevel] = useState(1)
  const selectedSeatIdsRef = useRef(selectedSeatIds)

  // Keep ref in sync for lock simulation
  useEffect(() => {
    selectedSeatIdsRef.current = selectedSeatIds
  }, [selectedSeatIds])

  const section = useMemo(
    () => sectionsForDate.find((s) => s.id === selectedSectionId) ?? null,
    [sectionsForDate, selectedSectionId],
  )

  const layout = useMemo(() => {
    if (!selectedSectionId) return { rows: 0, seatsPerRow: 0 }
    return getSectionLayout(selectedSectionId)
  }, [selectedSectionId])

  // Initial seats from generator
  const initialSeats = useMemo(() => {
    if (!section) return []
    return generateSeatsForSection(section, userTier)
  }, [section, userTier])

  // Mutable seat state for lock simulation
  const [seats, setSeats] = useState<Seat[]>(initialSeats)

  // Reset seats when section changes
  useEffect(() => {
    setSeats(initialSeats)
  }, [initialSeats])

  // Start timer on mount
  useEffect(() => {
    timer.start()
    return () => timer.reset()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Watch for timer expiry
  useEffect(() => {
    if (timer.isExpired && !showExpiryModal) {
      setShowExpiryModal(true)
    }
  }, [timer.isExpired, showExpiryModal])

  // Lock simulation: every 15-30s, randomly lock 1-3 available seats
  useEffect(() => {
    if (!timer.isRunning) return

    let timeoutId: ReturnType<typeof setTimeout>

    function scheduleNextLock() {
      const delay = (Math.random() * 15 + 15) * 1000 // 15-30s
      timeoutId = setTimeout(() => {
        setSeats((prev) => {
          const selectedSet = new Set(selectedSeatIdsRef.current)
          const available = prev
            .map((s, i) => ({ s, i }))
            .filter(({ s }) => s.status === 'available' && !selectedSet.has(s.id))
          if (available.length === 0) return prev
          const lockCount = Math.min(available.length, Math.floor(Math.random() * 3) + 1)
          const toLock = new Set<number>()
          while (toLock.size < lockCount) {
            toLock.add(available[Math.floor(Math.random() * available.length)].i)
          }
          return prev.map((s, i) =>
            toLock.has(i) ? { ...s, status: 'locked' as const } : s,
          )
        })
        scheduleNextLock()
      }, delay)
    }

    scheduleNextLock()
    return () => clearTimeout(timeoutId)
  }, [timer.isRunning])

  const handleSeatClick = useCallback(
    (seatId: string) => {
      toggleSeat(seatId)
    },
    [toggleSeat],
  )

  // Zoom handlers
  const handleZoomIn = useCallback(() => {
    setZoomLevel((prev) => Math.min(3, prev + 0.25))
  }, [])

  const handleZoomOut = useCallback(() => {
    setZoomLevel((prev) => Math.max(0.5, prev - 0.25))
  }, [])

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault()
    setZoomLevel((prev) => {
      const delta = e.deltaY > 0 ? -0.15 : 0.15
      return Math.min(3, Math.max(0.5, prev + delta))
    })
  }, [])

  // Back to sections
  const handleBack = useCallback(() => {
    transitionTo('seats-section')
  }, [transitionTo])

  // Timer expiry handlers
  const handleReturnToSections = useCallback(() => {
    setShowExpiryModal(false)
    transitionTo('seats-section')
  }, [transitionTo])

  const handleExitBooking = useCallback(() => {
    setShowExpiryModal(false)
    resetBooking()
  }, [resetBooking])

  // Payment
  const handlePay = useCallback(() => {
    setSeatTimerSecondsLeft(timer.secondsLeft)
    timer.pause()
    transitionTo('payment')
  }, [timer, transitionTo, setSeatTimerSecondsLeft])

  // Price calculations
  const tierFee = selectedDate?.bookingWindows.find((w) => w.tier === userTier)?.fee ?? 0
  const seatCount = selectedSeatIds.length
  const subtotal = section ? section.price * seatCount : 0
  const feeTotal = tierFee * seatCount
  const total = subtotal + feeTotal

  if (!section) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-muted-foreground text-sm">구역을 먼저 선택해주세요</p>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="px-6 pt-5 pb-3 border-b border-border shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={handleBack}
            className="p-1.5 rounded-md hover:bg-accent transition-colors"
            aria-label="구역 선택으로 돌아가기"
          >
            <ArrowLeft size={18} className="text-muted-foreground" />
          </button>
          <div className="flex-1">
            <h2 className="text-lg font-bold">{section.name} — 좌석 선택</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              최대 {maxSeats}석까지 선택 가능
            </p>
          </div>
        </div>
      </div>

      {/* Main content: left seat grid + right info panel */}
      <div className="flex-1 min-h-0 flex">
        {/* Left: Seat grid area */}
        <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
          {/* Stage label */}
          <div className="flex justify-center pt-4 pb-2 shrink-0">
            <div className="px-5 py-1.5 rounded-full bg-secondary text-white text-[11px] font-bold tracking-widest">
              STAGE
            </div>
          </div>

          {/* Zoom controls */}
          <div className="relative flex-1 min-h-0 overflow-hidden" onWheel={handleWheel}>
            <div className="absolute top-2 right-4 z-10 flex flex-col gap-1">
              <button
                onClick={handleZoomIn}
                className="p-1.5 rounded-md bg-white/90 border border-border shadow-sm hover:bg-accent transition-colors"
                aria-label="확대"
              >
                <ZoomIn size={16} className="text-muted-foreground" />
              </button>
              <button
                onClick={handleZoomOut}
                className="p-1.5 rounded-md bg-white/90 border border-border shadow-sm hover:bg-accent transition-colors"
                aria-label="축소"
              >
                <ZoomOut size={16} className="text-muted-foreground" />
              </button>
              {zoomLevel !== 1 && (
                <span className="text-[10px] text-muted-foreground text-center tabular-nums">
                  {Math.round(zoomLevel * 100)}%
                </span>
              )}
            </div>

            {/* Zoomable seat grid */}
            <div className="h-full overflow-auto px-4 pb-4">
              <div
                style={{
                  transform: `scale(${zoomLevel})`,
                  transformOrigin: 'top center',
                  transition: 'transform 150ms ease',
                }}
              >
                <SeatGrid
                  seats={seats}
                  rows={layout.rows}
                  seatsPerRow={layout.seatsPerRow}
                  interactive
                  onSeatClick={handleSeatClick}
                  selectedSeatIds={selectedSeatIds}
                  showRowLabels
                />
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="shrink-0 border-t border-border py-2 px-4">
            <SeatStatusLegend compact className="justify-center" />
          </div>
        </div>

        {/* Right: Info panel */}
        <div className="w-[320px] shrink-0 border-l border-border bg-white flex flex-col">
          {/* Timer */}
          <div className="px-5 py-4 border-b border-border flex items-center justify-center">
            <TimerDisplay seconds={timer.secondsLeft} size="lg" />
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
                      {parseSeatDisplay(seatId, section.name)}
                    </span>
                    <button
                      onClick={() => toggleSeat(seatId)}
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
            {seatCount > 0 && (
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
              onClick={handlePay}
            >
              {seatCount > 0 ? `${formatPrice(total)} 결제하기` : '좌석을 선택해주세요'}
            </Button>
          </div>
        </div>
      </div>

      {/* Timer expiry modal */}
      {showExpiryModal && (
        <TimerExpiryModal
          onReturnToSections={handleReturnToSections}
          onExitBooking={handleExitBooking}
        />
      )}
    </div>
  )
}
