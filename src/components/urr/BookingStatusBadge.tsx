import { cn } from '@/lib/utils'
import type { BookingStatus } from '@/types'
import { BOOKING_STATUS_LABELS } from '@/types'

const statusStyles: Record<BookingStatus, string> = {
  open: 'bg-booking-open/10 text-booking-open',
  upcoming: 'bg-booking-upcoming/10 text-booking-upcoming',
  soldout: 'bg-muted text-muted-foreground',
  closed: 'bg-muted text-muted-foreground opacity-70',
}

interface BookingStatusBadgeProps {
  status: BookingStatus
  className?: string
}

export function BookingStatusBadge({ status, className }: BookingStatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold shrink-0',
        statusStyles[status],
        className,
      )}
    >
      <span className={cn(
        'size-1.5 rounded-full',
        status === 'open' && 'bg-booking-open',
        status === 'upcoming' && 'bg-booking-upcoming',
        status === 'soldout' && 'bg-muted-foreground',
        status === 'closed' && 'bg-muted-foreground',
      )} />
      {BOOKING_STATUS_LABELS[status]}
    </span>
  )
}
