import { cn } from '@/lib/utils'
import { Clock } from 'lucide-react'

interface QueueStatusCardProps {
  position: number
  totalInQueue: number
  estimatedWait: string
  probability: number
  className?: string
}

export function QueueStatusCard({ position, totalInQueue, estimatedWait, probability, className }: QueueStatusCardProps) {
  const probColor = probability >= 60
    ? 'text-success'
    : probability >= 20
      ? 'text-warning'
      : 'text-danger'

  return (
    <div className={cn(
      'rounded-xl bg-white/90 backdrop-blur p-6 shadow-xl border border-border space-y-4',
      className,
    )}>
      <p className="text-sm font-medium text-muted-foreground">대기 중</p>

      <div className="flex items-baseline gap-1">
        <span className="text-4xl font-bold text-primary tabular-nums">#{position}</span>
        <span className="text-sm text-muted-foreground">/ {totalInQueue.toLocaleString()}명</span>
      </div>

      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Clock size={16} />
        <span>예상 대기: {estimatedWait}</span>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">성공 확률:</span>
        <span className={cn('text-lg font-bold tabular-nums', probColor)}>
          {probability}%
        </span>
      </div>

      {probability < 20 && (
        <p className="text-xs text-danger">양도 마켓을 확인해보세요</p>
      )}
    </div>
  )
}
