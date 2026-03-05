import { memo, useMemo } from 'react'
import type { Seat } from '@/types'

// 16×16 chair SVG path data from provided assets
const CHAIR_BODY = 'M2.14364 8.78439C1.43973 8.78439 0.870605 9.35352 0.870605 10.0574V13.2395C0.870605 13.9434 1.43973 14.5125 2.14364 14.5125H13.857C14.5609 14.5125 15.13 13.9434 15.13 13.2395V10.0574C15.13 9.35352 14.5609 8.78439 13.857 8.78439H2.14364Z'
const CHAIR_BACK_X = 2.02344
const CHAIR_BACK_Y = 1.48828
const CHAIR_BACK_W = 11.9531
const CHAIR_BACK_H = 6.29688
const CHAIR_BACK_RX = 1.97664

const COLORS = {
  enabled: '#FF5E32',
  selected: '#1F2792',
  disabled: '#C4BDB5',
}

interface SeatOverlayProps {
  seats: Seat[]
  rows: number
  seatsPerRow: number
  bbox: { x: number; y: number; w: number; h: number }
  selectedSeatIds: string[]
  onSeatClick: (seatId: string) => void
}

function rowLabel(index: number): string {
  if (index < 26) return String.fromCharCode(65 + index)
  return (
    String.fromCharCode(65 + Math.floor(index / 26) - 1) +
    String.fromCharCode(65 + (index % 26))
  )
}

function SeatOverlayInner({
  seats,
  rows,
  seatsPerRow,
  bbox,
  selectedSeatIds,
  onSeatClick,
}: SeatOverlayProps) {
  const selectedSet = useMemo(() => new Set(selectedSeatIds), [selectedSeatIds])

  // Reserve ~5% left margin for row labels
  const labelMargin = bbox.w * 0.05
  const seatAreaX = bbox.x + labelMargin
  const seatAreaW = bbox.w - labelMargin
  const cellW = seatAreaW / seatsPerRow
  const cellH = bbox.h / rows
  const iconScale = Math.min(cellW, cellH) * 0.82 / 16

  function getColor(seat: Seat): string {
    if (selectedSet.has(seat.id)) return COLORS.selected
    if (seat.status === 'available') return COLORS.enabled
    return COLORS.disabled
  }

  function isClickable(seat: Seat): boolean {
    return seat.status === 'available' || selectedSet.has(seat.id)
  }

  return (
    <g>
      {/* White background over section area */}
      <rect
        x={bbox.x - 2}
        y={bbox.y - 2}
        width={bbox.w + 4}
        height={bbox.h + 4}
        fill="white"
        fillOpacity={0.93}
        rx={3}
      />

      {/* Row labels */}
      {Array.from({ length: rows }, (_, r) => (
        <text
          key={`rl-${r}`}
          x={bbox.x + labelMargin * 0.45}
          y={bbox.y + r * cellH + cellH / 2}
          textAnchor="middle"
          dominantBaseline="central"
          fill="#9CA3AF"
          fontSize={Math.min(cellH * 0.5, 4)}
          fontFamily="monospace"
          style={{ pointerEvents: 'none' }}
        >
          {rowLabel(r)}
        </text>
      ))}

      {/* Seat icons */}
      {seats.map((seat, i) => {
        const row = Math.floor(i / seatsPerRow)
        const col = i % seatsPerRow
        const cx = seatAreaX + col * cellW + cellW / 2
        const cy = bbox.y + row * cellH + cellH / 2
        const x = cx - iconScale * 8
        const y = cy - iconScale * 8
        const color = getColor(seat)
        const clickable = isClickable(seat)

        return (
          <g
            key={seat.id}
            transform={`translate(${x}, ${y}) scale(${iconScale})`}
            onClick={clickable ? () => onSeatClick(seat.id) : undefined}
            style={{ cursor: clickable ? 'pointer' : 'default' }}
          >
            <rect
              x={CHAIR_BACK_X}
              y={CHAIR_BACK_Y}
              width={CHAIR_BACK_W}
              height={CHAIR_BACK_H}
              rx={CHAIR_BACK_RX}
              fill={color}
            />
            <path d={CHAIR_BODY} fill={color} />
          </g>
        )
      })}
    </g>
  )
}

export const SeatOverlay = memo(SeatOverlayInner)
