import { useContext } from 'react'
import { LayoutContext } from '@/contexts/LayoutContext'
import type { LayoutContextValue } from '@/contexts/LayoutContext'

export function useLayout(): LayoutContextValue {
  const context = useContext(LayoutContext)
  if (!context) {
    throw new Error('useLayout must be used within a LayoutProvider')
  }
  return context
}
