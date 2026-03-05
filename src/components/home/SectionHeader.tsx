import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

interface SectionHeaderProps {
  title: string
  linkHref: string
  linkLabel: string
}

export function SectionHeader({ title, linkHref, linkLabel }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-xl font-bold">{title}</h2>
      <Link
        to={linkHref}
        className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
      >
        {linkLabel}
        <ChevronRight size={16} />
      </Link>
    </div>
  )
}
