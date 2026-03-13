import { useState, useEffect, useRef, useCallback } from 'react'
import type { Section } from '@/types'

export type QueuePhase = 'waiting' | 'promoted' | 'sold-out'

interface QueueSimulationConfig {
  initialPosition: number
  initialTotal: number
  positionDropRange: [number, number]   // [min, max] per tick
  totalDropRange: [number, number]
  waitMultiplier: number                // position * multiplier / 60 = estimated minutes
  intervalMs?: number
}

interface UseQueueSimulationReturn {
  position: number
  totalInQueue: number
  estimatedWait: string
  probability: number
  phase: QueuePhase
  previousPosition: number | null
  stayInQueue: () => void
}

const UPDATE_INTERVAL_MS = 3_000

function useQueueSimulationCore(
  config: QueueSimulationConfig,
  sectionsForDate?: Section[],
): UseQueueSimulationReturn {
  const {
    initialPosition,
    initialTotal,
    positionDropRange,
    totalDropRange,
    waitMultiplier,
    intervalMs = UPDATE_INTERVAL_MS,
  } = config

  const [position, setPosition] = useState(initialPosition)
  const [totalInQueue, setTotalInQueue] = useState(initialTotal)
  const [previousPosition, setPreviousPosition] = useState<number | null>(null)
  const [phase, setPhase] = useState<QueuePhase>('waiting')
  const positionRef = useRef(initialPosition)

  const totalRemaining = sectionsForDate
    ? sectionsForDate.reduce((sum, s) => sum + s.remainingSeats, 0)
    : -1 // -1 means no sold-out tracking

  // Simulation tick
  useEffect(() => {
    if (phase !== 'waiting') return

    const interval = setInterval(() => {
      setPosition((prev) => {
        setPreviousPosition(prev)
        const [min, max] = positionDropRange
        const drop = Math.floor(Math.random() * (max - min + 1)) + min
        const next = Math.max(1, prev - drop)
        positionRef.current = next

        if (next <= 1) {
          setPhase('promoted')
        }
        return next
      })

      setTotalInQueue((prev) => {
        const [min, max] = totalDropRange
        const drop = Math.floor(Math.random() * (max - min + 1)) + min
        return Math.max(positionRef.current, prev - drop)
      })
    }, intervalMs)

    return () => clearInterval(interval)
  }, [phase, intervalMs, positionDropRange, totalDropRange])

  // Sold-out detection (only when sectionsForDate is provided)
  useEffect(() => {
    if (totalRemaining === 0 && phase === 'waiting') {
      setPhase('sold-out')
    }
  }, [totalRemaining, phase])

  const probability = totalRemaining > 0
    ? Math.min(100, Math.round((totalRemaining / position) * 100))
    : 0

  const estimatedWait = `약 ${Math.max(1, Math.ceil((position * waitMultiplier) / 60))}분`

  const stayInQueue = useCallback(() => {
    if (phase === 'sold-out') {
      setPhase('waiting')
    }
  }, [phase])

  return {
    position,
    totalInQueue,
    estimatedWait,
    probability,
    phase,
    previousPosition,
    stayInQueue,
  }
}

// ── Booking queue (small position, slow drop, sold-out aware) ──

const BOOKING_CONFIG: QueueSimulationConfig = {
  initialPosition: 8,
  initialTotal: 1200,
  positionDropRange: [3, 7],
  totalDropRange: [2, 9],
  waitMultiplier: 10,
}

export function useQueueSimulation(sectionsForDate: Section[]): UseQueueSimulationReturn {
  return useQueueSimulationCore(BOOKING_CONFIG, sectionsForDate)
}

// ── General queue (large position, fast drop, no sold-out) ──

const GENERAL_CONFIG: QueueSimulationConfig = {
  initialPosition: 4588,
  initialTotal: 4620,
  positionDropRange: [40, 119],
  totalDropRange: [30, 89],
  waitMultiplier: 3,
}

export type GeneralQueuePhase = 'waiting' | 'promoted'

interface UseGeneralQueueSimulationReturn {
  position: number
  totalInQueue: number
  estimatedWait: string
  phase: GeneralQueuePhase
  previousPosition: number | null
}

export function useGeneralQueueSimulation(
  initialPosition = 4588,
  initialTotal = 4620,
): UseGeneralQueueSimulationReturn {
  const config: QueueSimulationConfig = initialPosition === GENERAL_CONFIG.initialPosition && initialTotal === GENERAL_CONFIG.initialTotal
    ? GENERAL_CONFIG
    : { ...GENERAL_CONFIG, initialPosition, initialTotal }

  const result = useQueueSimulationCore(config)

  return {
    position: result.position,
    totalInQueue: result.totalInQueue,
    estimatedWait: result.estimatedWait,
    phase: result.phase as GeneralQueuePhase,
    previousPosition: result.previousPosition,
  }
}
