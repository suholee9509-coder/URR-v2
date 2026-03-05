import { ChevronRight } from 'lucide-react'
import { useBooking } from '@/hooks/useBooking'
import { TierBadge } from '@/components/urr'
import { cn } from '@/lib/utils'

interface LeftPanelCollapsedProps {
  className?: string
}

export function LeftPanelCollapsed({ className }: LeftPanelCollapsedProps) {
  const { event, userTier, toggleLeftPanel } = useBooking()

  return (
    <div
      className={cn(
        'flex flex-col items-center py-3 gap-3 h-full',
        className,
      )}
    >
      <button
        onClick={toggleLeftPanel}
        className="p-1.5 rounded-md hover:bg-accent transition-colors shrink-0"
        aria-label="패널 펼치기"
      >
        <ChevronRight size={16} className="text-muted-foreground" />
      </button>

      {/* Vertical event title */}
      <div className="flex-1 min-h-0 flex items-center">
        <span
          className="text-xs font-medium text-muted-foreground truncate"
          style={{
            writingMode: 'vertical-rl',
            textOrientation: 'mixed',
            maxHeight: '100%',
          }}
        >
          {event?.title ?? ''}
        </span>
      </div>

      {/* Tier badge (emoji only) */}
      <div className="shrink-0">
        <TierBadge tier={userTier} size="sm" showLabel={false} />
      </div>
    </div>
  )
}
