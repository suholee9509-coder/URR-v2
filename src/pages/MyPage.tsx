import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { mockUser } from '@/data/mock-user'
import { getMyTickets, getMyTransferRecords } from '@/data/mock-my-page'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { MyPageHeader } from '@/components/my-page/MyPageHeader'
import { MyPageSkeleton } from '@/components/my-page/MyPageSkeleton'
import { MembershipTab } from '@/components/my-page/MembershipTab'
import { TicketWalletTab } from '@/components/my-page/TicketWalletTab'
import { TransferHistoryTab } from '@/components/my-page/TransferHistoryTab'
import { SettingsTab } from '@/components/my-page/SettingsTab'
import type { User } from '@/types'

export default function MyPage() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<User>(() => ({ ...mockUser }))

  const activeTab = pathname.endsWith('/wallet')
    ? 'wallet'
    : pathname.endsWith('/transfers')
      ? 'transfers'
      : pathname.endsWith('/settings')
        ? 'settings'
        : 'membership'

  const handleTabChange = (value: string) => {
    navigate(value === 'membership' ? '/my-page' : `/my-page/${value}`)
  }

  const handleUpdateUser = (updates: Partial<Pick<User, 'name' | 'email'>>) => {
    setUser((prev) => ({ ...prev, ...updates }))
  }

  const handleCancelMembership = (membershipId: string) => {
    setUser((prev) => ({
      ...prev,
      memberships: prev.memberships.map((m) =>
        m.id === membershipId ? { ...m, isActive: false } : m
      ),
    }))
  }

  const handleNicknameChange = (membershipId: string, nickname: string) => {
    setUser((prev) => ({
      ...prev,
      memberships: prev.memberships.map((m) =>
        m.id === membershipId ? { ...m, nickname } : m
      ),
    }))
  }

  useEffect(() => {
    setIsLoading(true)
    const timer = setTimeout(() => setIsLoading(false), 1200)
    return () => clearTimeout(timer)
  }, [])

  if (isLoading) return <MyPageSkeleton />

  const tickets = getMyTickets()
  const transferRecords = getMyTransferRecords()

  return (
    <div>
      <MyPageHeader user={user} />

      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList variant="line" className="w-full justify-start mt-8 border-b border-border">
          <TabsTrigger value="membership" className="flex-none">멤버십</TabsTrigger>
          <TabsTrigger value="wallet" className="flex-none">티켓 월렛</TabsTrigger>
          <TabsTrigger value="transfers" className="flex-none">양도 내역</TabsTrigger>
          <TabsTrigger value="settings" className="flex-none">설정</TabsTrigger>
        </TabsList>

        <TabsContent value="membership" className="pt-6">
          <MembershipTab
            memberships={user.memberships}
            onCancelMembership={handleCancelMembership}
            onNicknameChange={handleNicknameChange}
          />
        </TabsContent>

        <TabsContent value="wallet" className="pt-6">
          <TicketWalletTab tickets={tickets} user={user} />
        </TabsContent>

        <TabsContent value="transfers" className="pt-6">
          <TransferHistoryTab records={transferRecords} />
        </TabsContent>

        <TabsContent value="settings" className="pt-6">
          <SettingsTab user={user} onUpdateUser={handleUpdateUser} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
