import { memo } from 'react'
import type { Seat } from '@/types'
import { cn } from '@/lib/utils'

interface SeatGridProps {
  seats: Seat[]
  rows: number
  seatsPerRow: number
  interactive?: boolean
  onSeatClick?: (seatId: string) => void
  selectedSeatIds?: string[]
  dotSize?: number
  gap?: number
  compact?: boolean
  showRowLabels?: boolean
  className?: string
}

const COLORS = {
  available: 'var(--seat-available)',
  selected: 'var(--seat-selected)',
  taken: 'var(--seat-taken)',
  locked: 'var(--seat-locked)',
}

function SeatGridInner({
  seats,
  rows,
  seatsPerRow,
  interactive = false,
  onSeatClick,
  selectedSeatIds = [],
  dotSize: dotSizeProp,
  gap: gapProp,
  compact = false,
  showRowLabels = false,
  className,
}: SeatGridProps) {
  const dotSize = dotSizeProp ?? (compact ? 1.5 : 3)
  const gap = gapProp ?? (compact ? 0.5 : 1.5)
  const cellSize = dotSize * 2 + gap
  const labelWidth = showRowLabels ? 20 : 0

  const width = labelWidth + seatsPerRow * cellSize
  const height = rows * cellSize

  const selectedSet = new Set(selectedSeatIds)

  function getFill(seat: Seat): string {
    if (selectedSet.has(seat.id)) return COLORS.selected
    switch (seat.status) {
      case 'available': return COLORS.available
      case 'taken': return COLORS.taken
      case 'locked': return COLORS.locked
      case 'selected': return COLORS.selected
      default: return COLORS.taken
    }
  }

  function getCursor(seat: Seat): string {
    if (!interactive) return 'default'
    if (seat.status === 'available' || selectedSet.has(seat.id)) return 'pointer'
    return 'default'
  }

  function handleClick(seat: Seat) {
    if (!interactive || !onSeatClick) return
    if (seat.status === 'available' || selectedSet.has(seat.id)) {
      onSeatClick(seat.id)
    }
  }

  // Convert row index to label
  function rowLabel(index: number): string {
    if (index < 26) return String.fromCharCode(65 + index)
    return String.fromCharCode(65 + Math.floor(index / 26) - 1) + String.fromCharCode(65 + (index % 26))
  }

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={cn('w-full h-auto', className)}
      preserveAspectRatio="xMidYMid meet"
    >
      {showRowLabels && Array.from({ length: rows }, (_, r) => (
        <text
          key={`label-${r}`}
          x={8}
          y={r * cellSize + dotSize + 1}
          textAnchor="middle"
          dominantBaseline="central"
          className="fill-muted-foreground"
          fontSize={compact ? 3 : 6}
          fontFamily="monospace"
        >
          {rowLabel(r)}
        </text>
      ))}
      {seats.map((seat, i) => {
        const row = Math.floor(i / seatsPerRow)
        const col = i % seatsPerRow
        const cx = labelWidth + col * cellSize + dotSize
        const cy = row * cellSize + dotSize

        return (
          <circle
            key={seat.id}
            cx={cx}
            cy={cy}
            r={dotSize}
            fill={getFill(seat)}
            className={interactive && seat.status === 'available' && !selectedSet.has(seat.id) ? 'seat-interactive' : undefined}
            style={{ transition: 'fill 300ms ease', cursor: getCursor(seat) }}
            onClick={() => handleClick(seat)}
          />
        )
      })}
    </svg>
  )
}

export const SeatGrid = memo(SeatGridInner)
