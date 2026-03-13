import { useState, useEffect } from 'react'
import { SKELETON_LOAD_DELAY } from '@/lib/constants'

/**
 * Simulates a loading delay for skeleton screens.
 * Returns `true` while loading, `false` after the delay.
 *
 * @param deps - dependency array; loading resets when any dep changes
 * @param delay - loading duration in ms (defaults to SKELETON_LOAD_DELAY)
 */
export function usePageLoading(deps: unknown[] = [], delay = SKELETON_LOAD_DELAY): boolean {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)
    const timer = setTimeout(() => setIsLoading(false), delay)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return isLoading
}
