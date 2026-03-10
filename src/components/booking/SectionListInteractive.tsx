import { ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useBooking } from '@/hooks/useBooking'
import { PriceDisplay } from '@/components/urr'
import { Badge } from '@/components/ui/badge'

interface SectionListInteractiveProps {
  hoveredSectionId: string | null
  onSectionHover: (sectionId: string | null) => void
  onSectionClick: (sectionId: string) => void
  selectedSectionId?: string | null
}

const SECTION_COLORS: Record<string, string> = {
  'sec-vip': '#0080FF',
  'sec-r': '#FC68AF',
  'sec-s': '#8A07FD',
  'sec-a': '#02AD4A',
  'sec-b': '#EF4444',
  'sec-c': '#EF4444',
}

export function SectionListInteractive({
  hoveredSectionId,
  onSectionHover,
  onSectionClick,
  selectedSectionId,
}: SectionListInteractiveProps) {
  const { sectionsForDate } = useBooking()

  return (
    <div className="space-y-2">
      {sectionsForDate.map((section) => {
        const isSoldOut = section.remainingSeats === 0
        const isHovered = hoveredSectionId === section.id
        const isSelected = selectedSectionId === section.id
        const dotColor = SECTION_COLORS[section.id] ?? '#9CA3AF'

        return (
          <button
            key={section.id}
            className={cn(
              'w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-150 text-left',
              isSoldOut
                ? 'border-border bg-muted/30 opacity-50 cursor-not-allowed'
                : isSelected
                  ? 'border-primary bg-primary/5 shadow-sm'
                  : isHovered
                    ? 'border-border bg-accent/50 shadow-sm'
                    : 'border-border bg-white hover:bg-accent/30',
            )}
            disabled={isSoldOut}
            onMouseEnter={() => onSectionHover(section.id)}
            onMouseLeave={() => onSectionHover(null)}
            onClick={() => !isSoldOut && onSectionClick(section.id)}
          >
            {/* Color dot */}
            <span
              className="size-3 rounded-full shrink-0"
              style={{ backgroundColor: isSoldOut ? '#9CA3AF' : dotColor }}
            />

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold">{section.name}</span>
                {isSoldOut && (
                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                    매진
                  </Badge>
                )}
              </div>
              <PriceDisplay amount={section.price} size="sm" />
            </div>

            {/* Remaining seats badge */}
            <div className="flex items-center gap-2 shrink-0">
              {!isSoldOut && (
                <span className="text-xs text-muted-foreground tabular-nums">
                  {section.remainingSeats.toLocaleString()}석
                </span>
              )}
              {!isSoldOut && (
                <ChevronRight size={16} className="text-muted-foreground" />
              )}
            </div>
          </button>
        )
      })}
    </div>
  )
}
