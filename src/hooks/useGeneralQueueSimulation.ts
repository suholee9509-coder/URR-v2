import { useState, useEffect, useRef } from 'react'

export type GeneralQueuePhase = 'waiting' | 'promoted'

interface UseGeneralQueueSimulationReturn {
  position: number
  totalInQueue: number
  estimatedWait: string
  phase: GeneralQueuePhase
  previousPosition: number | null
}

const UPDATE_INTERVAL_MS = 3_000

export function useGeneralQueueSimulation(
  initialPosition = 4588,
  initialTotal = 4620,
): UseGeneralQueueSimulationReturn {
  const [position, setPosition] = useState(initialPosition)
  const [totalInQueue, setTotalInQueue] = useState(initialTotal)
  const [previousPosition, setPreviousPosition] = useState<number | null>(null)
  const [phase, setPhase] = useState<GeneralQueuePhase>('waiting')
  const positionRef = useRef(initialPosition)

  useEffect(() => {
    if (phase !== 'waiting') return

    const interval = setInterval(() => {
      setPosition((prev) => {
        setPreviousPosition(prev)
        const drop = Math.floor(Math.random() * 80) + 40 // 40-119 per tick (faster for general queue)
        const next = Math.max(1, prev - drop)
        positionRef.current = next

        if (next <= 1) {
          setPhase('promoted')
        }
        return next
      })

      setTotalInQueue((prev) => {
        const drop = Math.floor(Math.random() * 60) + 30
        return Math.max(positionRef.current, prev - drop)
      })
    }, UPDATE_INTERVAL_MS)

    return () => clearInterval(interval)
  }, [phase])

  const estimatedWait = `약 ${Math.max(1, Math.ceil((position * 3) / 60))}분`

  return {
    position,
    totalInQueue,
    estimatedWait,
    phase,
    previousPosition,
  }
}
