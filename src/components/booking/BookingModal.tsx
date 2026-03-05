import { useEffect, useState, useCallback } from 'react'
import { Clock, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useBooking } from '@/hooks/useBooking'
import { useVQAQuiz } from '@/hooks/useVQAQuiz'
import { useQueueSimulation } from '@/hooks/useQueueSimulation'
import { useNavigationBlock } from '@/hooks/useNavigationBlock'
import { VQAOptionCard, type OptionState } from './VQAOptionCard'
import { VenueMap } from './VenueMap'
import { QueueLeaveModal } from './QueueLeaveModal'

// ── VQA Sub-components (extracted from VQAModal) ──────

function VQATimer({ seconds }: { seconds: number }) {
  const colorClass =
    seconds <= 5
      ? 'text-danger'
      : seconds <= 10
        ? 'text-warning'
        : 'text-foreground'

  return (
    <span
      className={cn(
        'font-mono font-bold text-lg tabular-nums transition-colors duration-300',
        colorClass,
        seconds <= 10 && 'animate-pulse-timer',
      )}
    >
      {seconds}
    </span>
  )
}

function ProgressDots({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex gap-1.5">
        {Array.from({ length: total }).map((_, i) => (
          <span
            key={i}
            className={cn(
              'size-2 rounded-full transition-colors duration-200',
              i <= current ? 'bg-primary' : 'bg-border',
            )}
          />
        ))}
      </div>
      <span className="text-sm font-medium text-muted-foreground tabular-nums">
        {current + 1}/{total}
      </span>
    </div>
  )
}

function VQAResultContent({
  resultType,
  correctCount,
  totalQuestions,
  attemptsUsed,
  maxAttempts,
  onRetry,
  onExit,
}: {
  resultType: 'passed' | 'failed-can-retry' | 'failed-exhausted'
  correctCount: number
  totalQuestions: number
  attemptsUsed: number
  maxAttempts: number
  onRetry: () => void
  onExit: () => void
}) {
  if (resultType === 'passed') {
    return (
      <div className="flex flex-col items-center gap-4 py-8 animate-in fade-in zoom-in-95 duration-300">
        <span className="text-5xl">🎉</span>
        <h3 className="text-xl font-bold">환영합니다, 진정한 팬!</h3>
        <p className="text-sm text-muted-foreground">{correctCount}/{totalQuestions} 정답</p>
        <p className="text-sm text-muted-foreground">대기열에 진입합니다...</p>
        <div className="w-32 h-1 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all ease-linear"
            style={{ width: '100%', transitionDuration: '2000ms' }}
          />
        </div>
      </div>
    )
  }

  if (resultType === 'failed-can-retry') {
    return (
      <div className="flex flex-col items-center gap-4 py-8 animate-in fade-in duration-200">
        <span className="text-4xl">😢</span>
        <h3 className="text-lg font-bold">아쉽네요! 다시 도전해보세요</h3>
        <p className="text-sm text-muted-foreground">{correctCount}/{totalQuestions} 정답</p>
        <p className="text-sm text-muted-foreground">
          남은 기회: <span className="font-semibold text-foreground">{maxAttempts - attemptsUsed}회</span>
        </p>
        <div className="flex gap-3 pt-2">
          <Button variant="ghost" onClick={onExit}>나가기</Button>
          <Button onClick={onRetry}>다시 도전하기</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-4 py-8 animate-in fade-in duration-200">
      <span className="text-4xl">💪</span>
      <h3 className="text-lg font-bold">모든 시도를 사용했습니다</h3>
      <p className="text-sm text-muted-foreground text-center leading-relaxed">
        더 많은 팬 활동으로 실력을 쌓아보세요!<br />
        다음 예매 회차에 다시 도전해주세요.
      </p>
      <Button onClick={onExit} className="mt-2">이벤트 페이지로 돌아가기</Button>
    </div>
  )
}

// ── VQA Phase Content ─────────────────────────────────

function VQAContent() {
  const {
    phase, currentQuestion, currentIndex, totalQuestions,
    timeRemaining, selectedIndex, isCorrect, correctCount,
    attemptsUsed, maxAttempts, resultType, selectAnswer, retry, exitQuiz,
  } = useVQAQuiz()

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && phase !== 'result') e.preventDefault()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [phase])

  function getOptionState(optionIndex: number): OptionState {
    if (phase === 'answering') return 'default'
    if (phase === 'evaluating') {
      const correctIdx = currentQuestion?.correctIndex ?? -1
      if (selectedIndex === null) {
        if (optionIndex === correctIdx) return 'revealed-correct'
        return 'disabled'
      }
      if (optionIndex === selectedIndex) return isCorrect ? 'selected-correct' : 'selected-incorrect'
      if (optionIndex === correctIdx && !isCorrect) return 'revealed-correct'
      return 'disabled'
    }
    return 'disabled'
  }

  return (
    <>
      <div className="text-center pt-8 pb-2 px-6">
        <h2 className="text-xl font-bold">🎤 팬 인증</h2>
        <p className="text-sm text-muted-foreground mt-1">
          진정한 팬만이 통과할 수 있는 아티스트 퀴즈
        </p>
      </div>

      {phase !== 'result' ? (
        <>
          <div className="flex items-center justify-between px-6 pt-4 pb-3">
            <ProgressDots current={currentIndex} total={totalQuestions} />
            <VQATimer seconds={timeRemaining} />
          </div>
          <div className="px-6 pb-3">
            <p className="text-base font-semibold leading-relaxed">{currentQuestion?.question}</p>
          </div>
          <div className="px-6 pb-8 space-y-3">
            {currentQuestion?.options.map((option, i) => (
              <VQAOptionCard
                key={`${currentIndex}-${i}`}
                label={option}
                index={i}
                state={getOptionState(i)}
                onSelect={() => selectAnswer(i)}
                disabled={phase !== 'answering'}
              />
            ))}
          </div>
        </>
      ) : (
        <div className="px-6 pb-6">
          {resultType && (
            <VQAResultContent
              resultType={resultType}
              correctCount={correctCount}
              totalQuestions={totalQuestions}
              attemptsUsed={attemptsUsed}
              maxAttempts={maxAttempts}
              onRetry={retry}
              onExit={exitQuiz}
            />
          )}
        </div>
      )}
    </>
  )
}

// ── Queue Phase Content ───────────────────────────────

/** Section label positions for percentage overlay on the venue map */
const SECTION_LABEL_POS: Record<string, { x: number; y: number }> = {
  'sec-vip': { x: 259, y: 200 },
  'sec-floor-r': { x: 259, y: 280 },
  'sec-r': { x: 259, y: 365 },
  'sec-s': { x: 100, y: 330 },
  'sec-a': { x: 80, y: 450 },
}

function QueueContent() {
  const { sectionsForDate, transitionTo, resetBooking } = useBooking()
  const {
    position, totalInQueue, estimatedWait, probability,
    phase, previousPosition, stayInQueue,
  } = useQueueSimulation(sectionsForDate)

  const { showPrompt, cancelLeave, confirmLeave } = useNavigationBlock(phase === 'waiting')

  // Simulated remaining ratio drain per section
  const [drainOffset, setDrainOffset] = useState(0)

  useEffect(() => {
    if (phase !== 'waiting') return
    const interval = setInterval(() => {
      setDrainOffset((prev) => prev + Math.floor(Math.random() * 3) + 1)
    }, 10_000)
    return () => clearInterval(interval)
  }, [phase])

  // Counter-roll animation
  const [isRolling, setIsRolling] = useState(false)
  useEffect(() => {
    if (previousPosition !== null && previousPosition !== position) {
      setIsRolling(true)
      const timeout = setTimeout(() => setIsRolling(false), 500)
      return () => clearTimeout(timeout)
    }
  }, [previousPosition, position])

  // Transition immediately on promotion (no celebration screen)
  useEffect(() => {
    if (phase !== 'promoted') return
    transitionTo('seats-section')
  }, [phase, transitionTo])

  const handleLeaveQueue = useCallback(() => {
    confirmLeave()
    resetBooking()
  }, [confirmLeave, resetBooking])

  const probColor = probability >= 60
    ? 'text-green-600'
    : probability >= 20
      ? 'text-amber-500'
      : 'text-red-500'

  const progressPercent = Math.max(0, 100 - (position / totalInQueue) * 100)

  // Compute remaining % per section (with drain simulation)
  const sectionPercentages = sectionsForDate.map((sec) => {
    const drained = Math.min(sec.remainingSeats, drainOffset * Math.ceil(sec.totalSeats / 200))
    const remaining = Math.max(0, sec.remainingSeats - drained)
    const pct = sec.totalSeats > 0 ? Math.round((remaining / sec.totalSeats) * 100) : 0
    return { id: sec.id, name: sec.name, pct, remaining }
  })

  // SVG overlay: wash out section colors + render large percentage badges
  const percentageOverlay = (
    <g style={{ pointerEvents: 'none' }} className="select-none">
      {/* White wash layer to desaturate section colors */}
      <rect x="0" y="0" width="519.03" height="566.63" fill="white" fillOpacity={0.55} />

      {/* Drop shadow filter */}
      <defs>
        <filter id="badge-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="1" stdDeviation="2" floodColor="#000" floodOpacity="0.12" />
        </filter>
      </defs>

      {sectionPercentages.map(({ id, pct }) => {
        const pos = SECTION_LABEL_POS[id]
        if (!pos) return null
        const color = pct === 0 ? '#9CA3AF' : pct > 30 ? '#16A34A' : pct > 10 ? '#EA580C' : '#DC2626'
        return (
          <g key={id} filter="url(#badge-shadow)">
            <rect
              x={pos.x - 32}
              y={pos.y - 16}
              width={64}
              height={32}
              rx={16}
              fill="white"
            />
            <text
              x={pos.x}
              y={pos.y + 1}
              textAnchor="middle"
              dominantBaseline="central"
              fill={color}
              fontSize="17"
              fontWeight="800"
            >
              {pct === 0 ? '매진' : `${pct}%`}
            </text>
          </g>
        )
      })}
    </g>
  )

  return (
    <>
      {/* Header */}
      <div className="px-6 pt-6 pb-2">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">대기열</p>
        <div className="flex items-baseline gap-2 mt-2">
          <span
            className={cn(
              'text-4xl font-bold text-primary tabular-nums',
              isRolling && 'animate-counter-roll',
            )}
          >
            #{position}
          </span>
          <span className="text-sm text-muted-foreground">/ {totalInQueue.toLocaleString()}명</span>
        </div>
      </div>

      {/* Status bar */}
      <div className="px-6 py-3 space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <Clock size={14} />
            예상 대기: {estimatedWait}
          </span>
          <span className="text-muted-foreground">
            성공 확률: <span className={cn('font-bold tabular-nums', probColor)}>{probability}%</span>
          </span>
        </div>
        {/* Progress bar */}
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-700 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Venue map with section remaining % */}
      <div className="px-6 flex-1 min-h-0 overflow-hidden flex flex-col">
        {/* Stage label */}
        <div className="flex justify-center mb-2 shrink-0">
          <div className="px-4 py-1 rounded-full bg-secondary text-white text-[10px] font-bold tracking-widest">
            STAGE
          </div>
        </div>

        <div className="flex-1 min-h-0 flex items-center justify-center">
          <VenueMap
            miniature
            seatOverlay={percentageOverlay}
            className="w-full h-full max-h-[380px]"
          />
        </div>

        {/* Section legend below map */}
        <div className="py-3 space-y-1.5 shrink-0">
          {sectionPercentages.map(({ id, name, pct, remaining }) => (
            <div key={id} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span
                  className="size-2 rounded-full shrink-0"
                  style={{
                    backgroundColor: pct === 0 ? '#9CA3AF' : pct > 30 ? '#22C55E' : pct > 10 ? '#F97316' : '#EF4444',
                  }}
                />
                <span className="font-medium">{name}</span>
              </div>
              <span className={cn('tabular-nums', pct === 0 ? 'text-muted-foreground' : 'text-foreground font-semibold')}>
                {pct === 0 ? '매진' : `${remaining.toLocaleString()}석 (${pct}%)`}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 pb-5 pt-2 border-t border-border">
        {phase === 'sold-out' ? (
          <div className="space-y-3">
            <p className="text-sm text-center text-muted-foreground">
              현재 잔여 좌석이 없습니다. 취소표가 나올 수 있으니 대기를 유지해보세요.
            </p>
            <div className="flex gap-3 justify-center">
              <Button variant="ghost" size="sm" onClick={handleLeaveQueue}>나가기</Button>
              <Button size="sm" onClick={stayInQueue}>대기 유지</Button>
            </div>
          </div>
        ) : (
          <Button
            variant="ghost"
            className="w-full text-muted-foreground"
            onClick={() => {
              if (phase === 'waiting') {
                handleLeaveQueue()
              }
            }}
          >
            대기열 나가기
          </Button>
        )}
      </div>

      {/* Leave confirmation modal */}
      {showPrompt && (
        <QueueLeaveModal
          onStay={cancelLeave}
          onLeave={handleLeaveQueue}
        />
      )}
    </>
  )
}

// ── Main BookingModal ─────────────────────────────────

export function BookingModal() {
  const { bookingState, resetBooking } = useBooking()

  return (
    <div className="fixed inset-0 z-40">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50" />

      {/* Modal container */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div
          className={cn(
            'relative w-full rounded-2xl bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200 flex flex-col',
            bookingState === 'vqa' ? 'max-w-[520px]' : 'max-w-[680px] max-h-[85vh]',
          )}
        >
          {/* Close button */}
          <button
            onClick={resetBooking}
            className="absolute top-4 right-4 z-10 p-1.5 rounded-md hover:bg-accent transition-colors"
            aria-label="닫기"
          >
            <X size={18} className="text-muted-foreground" />
          </button>

          {bookingState === 'vqa' ? <VQAContent /> : <QueueContent />}
        </div>
      </div>
    </div>
  )
}
