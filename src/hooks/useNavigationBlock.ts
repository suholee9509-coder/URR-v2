import { useState, useEffect, useCallback } from 'react'

/**
 * Lightweight navigation blocker for BrowserRouter (non-data router).
 * - Blocks browser back/forward/close via `beforeunload`
 * - Provides a manual `requestLeave` / `cancelLeave` / `confirmLeave` API
 *   for in-app navigation blocking (sidebar clicks, etc.)
 */
export function useNavigationBlock(shouldBlock: boolean) {
  const [showPrompt, setShowPrompt] = useState(false)

  // Block browser-level navigation (back, forward, close tab)
  useEffect(() => {
    if (!shouldBlock) return

    function handleBeforeUnload(e: BeforeUnloadEvent) {
      e.preventDefault()
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [shouldBlock])

  const requestLeave = useCallback(() => {
    if (shouldBlock) {
      setShowPrompt(true)
    }
  }, [shouldBlock])

  const cancelLeave = useCallback(() => {
    setShowPrompt(false)
  }, [])

  const confirmLeave = useCallback(() => {
    setShowPrompt(false)
  }, [])

  return { showPrompt, requestLeave, cancelLeave, confirmLeave }
}
