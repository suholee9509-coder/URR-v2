import { LeftPanel } from './LeftPanel'
import { RightMain } from './RightMain'

export function BookingLayout() {
  return (
    <div className="flex h-full">
      <LeftPanel />
      <RightMain />
    </div>
  )
}
