import { cn } from '@/lib/utils'
import { VenueMap } from './VenueMap'

const SVG_VB = { w: 519.03, h: 566.63 }
const MINIMAP_W = 160
const MINIMAP_H = Math.round(MINIMAP_W * (SVG_VB.h / SVG_VB.w))

interface MinimapProps {
  selectedSectionId: string | null
  /** Render inline in a container instead of absolute-positioned overlay */
  embedded?: boolean
  /** Section click handler for switching sections via minimap */
  onSectionClick?: (sectionId: string) => void
  /** Dim the minimap and disable interaction (placeholder state) */
  dimmed?: boolean
}

export function Minimap({
  selectedSectionId,
  embedded = false,
  onSectionClick,
  dimmed = false,
}: MinimapProps) {
  return (
    <div
      className={cn(
        'rounded-lg overflow-hidden border border-border/50',
        embedded
          ? 'relative w-full'
          : 'minimap-container absolute top-3 right-3 z-20 shadow-md backdrop-blur-sm bg-white/70',
        dimmed ? 'bg-muted' : 'bg-white',
      )}
      style={!embedded ? { width: MINIMAP_W, height: MINIMAP_H } : undefined}
    >
      <div
        className={cn(
          'relative w-full',
          dimmed ? 'cursor-default' : 'cursor-pointer',
          !embedded && 'h-full',
        )}
        style={embedded ? { aspectRatio: `${SVG_VB.w} / ${SVG_VB.h}` } : undefined}
      >
        <div className={cn(dimmed && 'opacity-30')}>
          <VenueMap
            miniature
            interactive={!dimmed && !!onSectionClick}
            selectedSectionId={selectedSectionId}
            dimNonSelected={!dimmed && !!selectedSectionId}
            onSectionClick={dimmed ? undefined : onSectionClick}
            className="w-full h-full"
          />
        </div>

        {/* Dimmed overlay text */}
        {dimmed && (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-xs text-muted-foreground font-medium text-center px-4">
              구역을 선택하면 활성화됩니다
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
