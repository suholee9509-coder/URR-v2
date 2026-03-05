import { Outlet } from 'react-router-dom'
import { AppSidebar, TopBar, ContentArea } from '@/components/layout'
import { useLayout } from '@/hooks/useLayout'

export function MainLayout() {
  const { isSidebarExpanded } = useLayout()

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <AppSidebar />
      <div
        className="flex flex-1 flex-col min-w-0 transition-[margin-left] duration-250 ease-out"
        style={{ marginLeft: isSidebarExpanded ? 220 : 64 }}
      >
        <TopBar />
        <ContentArea>
          <Outlet />
        </ContentArea>
      </div>
    </div>
  )
}
