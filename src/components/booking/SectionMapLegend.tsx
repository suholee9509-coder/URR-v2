import { cn } from '@/lib/utils'

const AVAILABILITY_LEVELS = [
  { label: '여유', color: '#22C55E' },
  { label: '일부 잔여', color: '#F97316' },
  { label: '거의 매진', color: '#EF4444' },
  { label: '매진', color: '#9CA3AF' },
]

interface SectionMapLegendProps {
  className?: string
}

export function SectionMapLegend({ className }: SectionMapLegendProps) {
  return (
    <div className={cn('flex items-center justify-center gap-6 py-3', className)}>
      {AVAILABILITY_LEVELS.map((level) => (
        <div key={level.label} className="flex items-center gap-1.5">
          <span
            className="size-2.5 rounded-full shrink-0"
            style={{ backgroundColor: level.color }}
          />
          <span className="text-xs text-muted-foreground">{level.label}</span>
        </div>
      ))}
    </div>
  )
}
