import { NavLink, Link, useLocation } from 'react-router-dom'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

interface SidebarNavItemProps {
  icon: React.ElementType
  label: string
  href: string
  collapsed: boolean
}

export function SidebarNavItem({ icon: Icon, label, href, collapsed }: SidebarNavItemProps) {
  const { pathname } = useLocation()

  if (collapsed) {
    const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href)

    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            to={href}
            className={cn(
              'flex items-center justify-center w-10 h-10 rounded-[10px] transition-colors duration-150',
              isActive
                ? 'bg-sidebar-accent font-semibold text-sidebar-accent-foreground'
                : 'text-sidebar-foreground hover:bg-sidebar-accent/50',
            )}
          >
            <Icon size={20} />
          </Link>
        </TooltipTrigger>
        <TooltipContent side="right" sideOffset={12}>
          {label}
        </TooltipContent>
      </Tooltip>
    )
  }

  return (
    <NavLink
      to={href}
      end={href === '/' || href === '/artists'}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-3 h-10 px-3 rounded-md transition-colors duration-150 relative',
          isActive
            ? 'bg-sidebar-accent font-semibold text-sidebar-accent-foreground'
            : 'text-sidebar-foreground hover:bg-sidebar-accent/50',
        )
      }
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-sidebar-primary rounded-r-full" />
          )}
          <Icon size={20} className="shrink-0" />
          <span className="text-sm truncate">{label}</span>
        </>
      )}
    </NavLink>
  )
}
