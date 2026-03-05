import { cn } from '@/lib/utils'

type EventTagVariant = 'default' | 'hot' | 'highlight'

interface EventTagBadgeProps {
  tag: string
  variant?: EventTagVariant
  className?: string
}

function resolveVariant(tag: string): EventTagVariant {
  if (tag === 'HOT') return 'hot'
  if (tag === 'NEW' || tag === '선예매' || tag === '일반예매') return 'highlight'
  return 'default'
}

const variantStyles: Record<EventTagVariant, string> = {
  default: 'bg-muted text-foreground/70',
  hot: 'bg-destructive/10 text-destructive',
  highlight: 'bg-booking-upcoming/10 text-booking-upcoming',
}

export function EventTagBadge({ tag, variant, className }: EventTagBadgeProps) {
  const resolved = variant ?? resolveVariant(tag)

  return (
    <span
      className={cn(
        'text-[10px] font-semibold px-1.5 py-0.5 rounded shrink-0',
        variantStyles[resolved],
        className,
      )}
    >
      {tag}
    </span>
  )
}
