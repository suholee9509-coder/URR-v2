import { useMemo, useState } from 'react'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useBooking } from '@/hooks/useBooking'
import { cn } from '@/lib/utils'

interface SectionPath {
  d: string
  label: string
  cx: number
  cy: number
}

// KSPO DOME-style geometric venue layout
// Stage at bottom center, sections fan outward
const SECTION_PATHS: Record<string, SectionPath> = {
  'sec-vip': {
    d: 'M 320,340 L 480,340 L 500,290 L 300,290 Z',
    label: 'VIP',
    cx: 400,
    cy: 315,
  },
  'sec-r': {
    d: 'M 280,290 L 520,290 L 555,225 L 245,225 Z',
    label: 'R석',
    cx: 400,
    cy: 258,
  },
  'sec-s': {
    d: 'M 230,225 L 570,225 L 600,160 L 200,160 Z',
    label: 'S석',
    cx: 400,
    cy: 193,
  },
  'sec-a': {
    d: 'M 190,160 L 610,160 L 640,100 L 160,100 Z',
    label: 'A석',
    cx: 400,
    cy: 130,
  },
  'sec-b': {
    d: 'M 150,100 L 650,100 L 670,55 L 130,55 Z',
    label: 'B석',
    cx: 400,
    cy: 78,
  },
  'sec-c': {
    d: 'M 120,55 L 680,55 L 695,20 L 105,20 Z',
    label: 'C석',
    cx: 400,
    cy: 38,
  },
}

function getAvailabilityColor(remaining: number, total: number): string {
  if (remaining === 0) return '#9CA3AF'
  const ratio = remaining / total
  if (ratio > 0.3) return '#22C55E'
  if (ratio > 0.1) return '#F97316'
  return '#EF4444'
}

interface SectionMapProps {
  className?: string
  interactive?: boolean
  selectedSectionId?: string | null
  onSectionClick?: (sectionId: string) => void
  onSectionHover?: (sectionId: string | null) => void
  externalHoveredId?: string | null
}

export function SectionMap({
  className,
  interactive = false,
  selectedSectionId,
  onSectionClick,
  onSectionHover,
  externalHoveredId,
}: SectionMapProps) {
  const { sectionsForDate } = useBooking()
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  const activeHoveredId = externalHoveredId ?? hoveredId

  const sectionLookup = useMemo(() => {
    const map = new Map<string, { remaining: number; total: number }>()
    for (const s of sectionsForDate) {
      map.set(s.id, { remaining: s.remainingSeats, total: s.totalSeats })
    }
    return map
  }, [sectionsForDate])

  function handleMouseEnter(sectionId: string) {
    setHoveredId(sectionId)
    onSectionHover?.(sectionId)
  }

  function handleMouseLeave() {
    setHoveredId(null)
    onSectionHover?.(null)
  }

  function handleClick(sectionId: string) {
    if (!interactive) return
    const data = sectionLookup.get(sectionId)
    if (data && data.remaining === 0) return
    onSectionClick?.(sectionId)
  }

  return (
    <div className={cn('flex-1 min-h-0 flex items-center justify-center', className)}>
      <svg
        viewBox="0 0 800 420"
        className="w-full h-full max-h-full"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Sections */}
        {Object.entries(SECTION_PATHS).map(([sectionId, path]) => {
          const data = sectionLookup.get(sectionId)
          const color = data
            ? getAvailabilityColor(data.remaining, data.total)
            : '#9CA3AF'
          const section = sectionsForDate.find((s) => s.id === sectionId)
          const isHovered = activeHoveredId === sectionId
          const isSelected = selectedSectionId === sectionId
          const isSoldOut = data ? data.remaining === 0 : true

          const cursor = interactive
            ? isSoldOut
              ? 'cursor-not-allowed'
              : 'cursor-pointer'
            : 'cursor-default'

          return (
            <Tooltip key={sectionId}>
              <TooltipTrigger asChild>
                <g
                  className={cn('transition-opacity duration-150', cursor)}
                  style={{ opacity: isHovered ? 0.8 : 1 }}
                  onMouseEnter={() => handleMouseEnter(sectionId)}
                  onMouseLeave={handleMouseLeave}
                  onClick={() => handleClick(sectionId)}
                >
                  <path
                    d={path.d}
                    fill={color}
                    stroke={isSelected ? 'var(--color-primary)' : 'white'}
                    strokeWidth={isSelected ? 4 : 2.5}
                    rx={4}
                  />
                  <text
                    x={path.cx}
                    y={path.cy}
                    textAnchor="middle"
                    dominantBaseline="central"
                    className="text-[13px] font-semibold fill-white pointer-events-none select-none"
                  >
                    {path.label}
                  </text>
                </g>
              </TooltipTrigger>
              <TooltipContent side="top" className="text-sm">
                {section
                  ? `${section.name}구역 — 잔여 ${section.remainingSeats.toLocaleString()}석`
                  : path.label}
              </TooltipContent>
            </Tooltip>
          )
        })}

        {/* Stage */}
        <rect
          x={310}
          y={370}
          width={180}
          height={36}
          rx={18}
          fill="var(--color-secondary)"
        />
        <text
          x={400}
          y={388}
          textAnchor="middle"
          dominantBaseline="central"
          className="text-[13px] font-bold fill-white pointer-events-none select-none tracking-widest"
        >
          STAGE
        </text>
      </svg>
    </div>
  )
}
