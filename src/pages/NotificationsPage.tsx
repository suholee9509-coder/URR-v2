import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell } from 'lucide-react'
import { NotificationCard } from '@/components/urr'
import { useNotifications } from '@/hooks/useNotifications'

export default function NotificationsPage() {
  const { notifications, unreadCount, markAllAsRead } = useNotifications()
  const navigate = useNavigate()

  // Mark all as read when page mounts
  useEffect(() => {
    if (unreadCount > 0) {
      markAllAsRead()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (notifications.length === 0) {
    return (
      <div className="max-w-[800px] mx-auto space-y-6">
        <h1 className="text-2xl font-bold">알림</h1>
        <div className="flex flex-col items-center gap-3 py-20 text-center">
          <Bell size={48} strokeWidth={1.5} className="text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">아직 알림이 없습니다.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-[800px] mx-auto space-y-6">
      <h1 className="text-2xl font-bold">알림</h1>
      <div className="divide-y divide-border rounded-xl border border-border overflow-hidden">
        {notifications.map((notification) => (
          <NotificationCard
            key={notification.id}
            notification={notification}
            isUnread={!notification.isRead}
            onClick={() => navigate(notification.link)}
          />
        ))}
      </div>
    </div>
  )
}
