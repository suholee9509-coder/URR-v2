import { Check, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export type OptionState =
  | 'default'
  | 'selected-correct'
  | 'selected-incorrect'
  | 'revealed-correct'
  | 'disabled'

interface VQAOptionCardProps {
  label: string
  index: number
  state: OptionState
  onSelect: () => void
  disabled: boolean
}

const optionLetters = ['A', 'B', 'C', 'D']

export function VQAOptionCard({ label, index, state, onSelect, disabled }: VQAOptionCardProps) {
  const isInteractive = state === 'default' && !disabled

  return (
    <button
      type="button"
      onClick={isInteractive ? onSelect : undefined}
      disabled={!isInteractive}
      className={cn(
        'flex items-center gap-3 w-full min-h-[48px] px-4 py-3 rounded-lg border-2 text-left transition-colors duration-150 relative',
        // Default
        state === 'default' && !disabled &&
          'bg-white border-border hover:border-primary/30 hover:bg-accent/30 cursor-pointer',
        // Disabled (other options while evaluating)
        state === 'disabled' &&
          'bg-white border-border opacity-50 cursor-default',
        // Selected correct
        state === 'selected-correct' &&
          'bg-green-50 border-green-500 animate-flash-green',
        // Selected incorrect
        state === 'selected-incorrect' &&
          'bg-red-50 border-red-500 animate-shake',
        // Revealed correct (shown when user picked wrong answer)
        state === 'revealed-correct' &&
          'bg-green-50/70 border-green-400',
      )}
    >
      {/* Letter badge */}
      <span
        className={cn(
          'flex items-center justify-center size-7 rounded-md text-xs font-bold shrink-0',
          state === 'selected-correct' || state === 'revealed-correct'
            ? 'bg-green-500 text-white'
            : state === 'selected-incorrect'
              ? 'bg-red-500 text-white'
              : 'bg-muted text-muted-foreground',
        )}
      >
        {state === 'selected-correct' || state === 'revealed-correct' ? (
          <Check size={14} strokeWidth={3} />
        ) : state === 'selected-incorrect' ? (
          <X size={14} strokeWidth={3} />
        ) : (
          optionLetters[index]
        )}
      </span>

      {/* Label */}
      <span
        className={cn(
          'text-sm font-medium flex-1',
          (state === 'selected-correct' || state === 'revealed-correct') && 'text-green-700',
          state === 'selected-incorrect' && 'text-red-700',
        )}
      >
        {label}
      </span>
    </button>
  )
}
