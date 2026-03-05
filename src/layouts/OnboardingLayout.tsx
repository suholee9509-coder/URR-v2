import { Outlet } from 'react-router-dom'

export function OnboardingLayout() {
  return (
    <div className="h-screen overflow-y-auto bg-background">
      <Outlet />
    </div>
  )
}
