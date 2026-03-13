import { useEffect, useState, useCallback } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useGeneralQueueSimulation } from '@/hooks/useQueueSimulation'
import { useNavigationBlock } from '@/hooks/useNavigationBlock'
import logo from '@/assets/로고_최종.svg'

// ── Leave Confirmation Dialog ─────────────────────────
function LeaveDialog({
  onStay,
  onLeave,
}: {
  onStay: () => void
  onLeave: () => void
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/40" onClick={onStay} />
      <div className="relative bg-white rounded-xl shadow-lg p-6 max-w-sm w-full mx-4 animate-in fade-in zoom-in-95 duration-200">
        <h3 className="text-lg font-semibold text-foreground">
          대기열을 나가시겠습니까?
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          대기열을 나가면 현재 대기순서가 초기화됩니다.
          다시 접속 시 새로운 순서를 받게 됩니다.
        </p>
        <div className="mt-5 flex gap-3 justify-end">
          <Button variant="outline" size="sm" onClick={onStay}>
            대기 유지
          </Button>
          <Button
            size="sm"
            className="bg-destructive text-white hover:bg-destructive/90"
            onClick={onLeave}
          >
            나가기
          </Button>
        </div>
      </div>
    </div>
  )
}

// ── Main Queue Page ───────────────────────────────────
export default function QueuePage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const redirectUrl = searchParams.get('redirect') || '/'
  const pageTitle = searchParams.get('title') || ''

  const {
    position,
    totalInQueue,
    estimatedWait,
    phase,
    previousPosition,
  } = useGeneralQueueSimulation()

  const { showPrompt, requestLeave, cancelLeave, confirmLeave } =
    useNavigationBlock(phase === 'waiting')

  // Counter-roll animation
  const [isRolling, setIsRolling] = useState(false)
  useEffect(() => {
    if (previousPosition !== null && previousPosition !== position) {
      setIsRolling(true)
      const timeout = setTimeout(() => setIsRolling(false), 500)
      return () => clearTimeout(timeout)
    }
  }, [previousPosition, position])

  // Auto-redirect on promotion
  useEffect(() => {
    if (phase !== 'promoted') return
    const timeout = setTimeout(() => {
      navigate(redirectUrl, { replace: true })
    }, 800)
    return () => clearTimeout(timeout)
  }, [phase, navigate, redirectUrl])

  const handleLeave = useCallback(() => {
    confirmLeave()
    navigate('/', { replace: true })
  }, [confirmLeave, navigate])

  // Progress: how far the user has moved from initial position
  const initialPosition = 4588
  const progressPercent = Math.min(
    100,
    Math.max(0, ((initialPosition - position) / initialPosition) * 100),
  )

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-10">
      {/* Promoted overlay */}
      {phase === 'promoted' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="text-center">
            <div className="size-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <p className="text-xl font-semibold text-foreground">접속이 완료되었습니다</p>
            <p className="text-sm text-muted-foreground mt-1">페이지로 이동합니다...</p>
          </div>
        </div>
      )}

      {/* Logo */}
      <img src={logo} alt="URR" className="h-10 mb-10" />

      {/* Title area */}
      <div className="text-center mb-2">
        <h1 className="text-[22px] font-bold text-foreground leading-tight">
          접속 인원이 많아 대기 중입니다.
        </h1>
        <p className="text-base font-semibold text-primary mt-1">
          조금만 기다려주세요.
        </p>
      </div>

      {/* Destination label */}
      {pageTitle && (
        <p className="text-sm text-muted-foreground mb-6">{pageTitle}</p>
      )}

      {/* Queue Info Card */}
      <div className="w-full max-w-[480px] bg-white border border-border rounded-xl shadow-sm p-6 mb-6">
        {/* Position */}
        <div className="text-center mb-5">
          <p className="text-sm font-medium text-muted-foreground mb-2">
            나의 대기순서
          </p>
          <p
            className={cn(
              'text-[56px] font-bold text-foreground leading-none tabular-nums tracking-tight',
              isRolling && 'animate-counter-roll',
            )}
          >
            {position.toLocaleString()}
          </p>
        </div>

        {/* Progress bar */}
        <div className="relative h-2 bg-muted rounded-full overflow-hidden mb-5">
          {/* Track */}
          <div
            className="absolute inset-y-0 left-0 bg-primary rounded-full transition-all duration-700 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
          {/* Indicator dot */}
          <div
            className="absolute top-1/2 -translate-y-1/2 size-4 rounded-full bg-primary border-2 border-white shadow-md transition-all duration-700 ease-out"
            style={{ left: `calc(${progressPercent}% - 8px)` }}
          />
        </div>

        {/* Stats */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">현재 대기인원</span>
            <span className="font-semibold text-foreground tabular-nums">
              {totalInQueue.toLocaleString()}명
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">예상 대기시간</span>
            <span className="font-semibold text-foreground">
              {estimatedWait}
            </span>
          </div>
        </div>
      </div>

      {/* Notice */}
      <div className="w-full max-w-[480px] space-y-1.5 mb-8">
        <p className="text-[13px] text-muted-foreground leading-relaxed">
          · 잠시만 기다려주시면, 페이지로 연결됩니다.
        </p>
        <p className="text-[13px] text-muted-foreground leading-relaxed">
          · 새로고침 하거나 재접속 하시면 대기순서가 초기화 되어
          대기시간이 더 길어집니다.
        </p>
      </div>

      {/* Leave button */}
      <Button
        variant="ghost"
        className="text-muted-foreground hover:text-foreground cursor-pointer"
        onClick={requestLeave}
      >
        대기열 나가기
      </Button>

      {/* Branding footer */}
      <div className="mt-12 w-full max-w-[480px] rounded-xl bg-accent/60 overflow-hidden">
        <div className="px-6 py-5 flex items-center gap-4">
          <img src={logo} alt="URR" className="h-8 opacity-80" />
          <div>
            <p className="text-sm font-semibold text-foreground">
              공정한 티켓팅의 시작, URR에서!
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              진짜 팬이 먼저, 공정하게.
            </p>
          </div>
        </div>
      </div>

      {/* Leave confirmation dialog */}
      {showPrompt && (
        <LeaveDialog onStay={cancelLeave} onLeave={handleLeave} />
      )}
    </div>
  )
}
