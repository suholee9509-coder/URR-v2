import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

interface SectionHeaderProps {
  title: string
  /** Link button on the right (pill-shaped with chevron) */
  linkHref?: string
  linkLabel?: string
  /** Static text label on the right (non-interactive) */
  periodLabel?: string
}

export function SectionHeader({ title, linkHref, linkLabel, periodLabel }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-xl font-bold">{title}</h2>
      {linkHref && linkLabel && (
        <Link
          to={linkHref}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors border border-border rounded-full pl-4 pr-3 py-1.5 flex items-center gap-1"
        >
          {linkLabel}
          <ChevronRight size={14} />
        </Link>
      )}
      {periodLabel && (
        <span className="text-xs text-muted-foreground">{periodLabel}</span>
      )}
    </div>
  )
}
