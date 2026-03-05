import { useState, useEffect, useRef, useCallback } from 'react'
import type { Section } from '@/types'

export type QueuePhase = 'waiting' | 'promoted' | 'sold-out'

interface UseQueueSimulationReturn {
  position: number
  totalInQueue: number
  estimatedWait: string
  probability: number
  phase: QueuePhase
  previousPosition: number | null
  stayInQueue: () => void
}

const INITIAL_POSITION = 8
const INITIAL_TOTAL = 1200
const UPDATE_INTERVAL_MS = 3_000

export function useQueueSimulation(sectionsForDate: Section[]): UseQueueSimulationReturn {
  const [position, setPosition] = useState(INITIAL_POSITION)
  const [totalInQueue, setTotalInQueue] = useState(INITIAL_TOTAL)
  const [previousPosition, setPreviousPosition] = useState<number | null>(null)
  const [phase, setPhase] = useState<QueuePhase>('waiting')
  const positionRef = useRef(INITIAL_POSITION)

  const totalRemaining = sectionsForDate.reduce((sum, s) => sum + s.remainingSeats, 0)

  // Simulation tick — decrease position every 10s
  useEffect(() => {
    if (phase !== 'waiting') return

    const interval = setInterval(() => {
      setPosition((prev) => {
        setPreviousPosition(prev)
        const drop = Math.floor(Math.random() * 5) + 3 // 3-7 per tick
        const next = Math.max(1, prev - drop)
        positionRef.current = next

        if (next <= 1) {
          setPhase('promoted')
        }
        return next
      })

      setTotalInQueue((prev) => {
        const drop = Math.floor(Math.random() * 8) + 2
        return Math.max(positionRef.current, prev - drop)
      })
    }, UPDATE_INTERVAL_MS)

    return () => clearInterval(interval)
  }, [phase])

  // Sold-out detection
  useEffect(() => {
    if (totalRemaining <= 0 && phase === 'waiting') {
      setPhase('sold-out')
    }
  }, [totalRemaining, phase])

  const probability = totalRemaining > 0
    ? Math.min(100, Math.round((totalRemaining / position) * 100))
    : 0

  const estimatedWait = `약 ${Math.max(1, Math.ceil((position * 10) / 60))}분`

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
