import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface EmptyStateProps {
  icon: LucideIcon
  /** Icon size — defaults to 40 */
  iconSize?: number
  /** Wrap icon in a rounded bg-muted circle */
  iconContainer?: boolean
  title?: string
  description?: string
  /** Optional call-to-action rendered below description */
  action?: React.ReactNode
  className?: string
}

export function EmptyState({
  icon: Icon,
  iconSize = 40,
  iconContainer = false,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center gap-3 py-16 text-center', className)}>
      {iconContainer ? (
        <div className="size-12 rounded-full bg-muted flex items-center justify-center">
          <Icon size={24} className="text-muted-foreground" />
        </div>
      ) : (
        <Icon size={iconSize} className="text-muted-foreground/40" />
      )}
      {title && <p className="text-base font-medium">{title}</p>}
      {description && <p className="text-sm text-muted-foreground">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  )
}
