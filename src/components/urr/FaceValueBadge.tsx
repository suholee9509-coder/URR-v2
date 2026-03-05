import { cn } from '@/lib/utils'

interface FaceValueBadgeProps {
  percentage: number
  className?: string
}

export function FaceValueBadge({ percentage, className }: FaceValueBadgeProps) {
  const style =
    percentage <= 100
      ? 'text-success bg-muted'
      : percentage <= 130
        ? 'text-warning bg-muted'
        : 'text-danger bg-muted'

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium shrink-0',
        style,
        className,
      )}
    >
      정가 대비 {percentage}%
    </span>
  )
}
