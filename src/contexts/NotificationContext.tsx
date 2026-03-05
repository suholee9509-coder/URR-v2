import { createContext, useState, useCallback, useMemo } from 'react'
import type { ReactNode } from 'react'
import type { Notification } from '@/types'
import { mockNotifications } from '@/data/mock-notifications'

export interface NotificationContextValue {
  notifications: Notification[]
  unreadCount: number
  markAllAsRead: () => void
}

export const NotificationContext = createContext<NotificationContextValue | null>(null)

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.isRead).length,
    [notifications],
  )

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) =>
      prev.map((n) => (n.isRead ? n : { ...n, isRead: true })),
    )
  }, [])

  const value: NotificationContextValue = {
    notifications,
    unreadCount,
    markAllAsRead,
  }

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  )
}
