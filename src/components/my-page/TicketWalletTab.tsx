import { useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Ticket as TicketIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { TicketCard } from '@/components/urr/TicketCard'
import { QRCodeModal } from './QRCodeModal'
import { TransferListingModal } from './TransferListingModal'
import { addTransferListing } from '@/data/mock-artist-page'
import type { Ticket, Event, TierLevel, User } from '@/types'

interface TicketWalletTabProps {
  tickets: (Ticket & { event: Event })[]
  user: User
}

function getEffectiveTier(user: User, artistId: string): TierLevel {
  const membership = user.memberships.find(
    (m) => m.artistId === artistId && m.isActive,
  )
  return membership?.tier ?? user.tier
}

export function TicketWalletTab({ tickets, user }: TicketWalletTabProps) {
  const [selectedTicket, setSelectedTicket] = useState<(Ticket & { event: Event }) | null>(null)
  const [transferTicket, setTransferTicket] = useState<(Ticket & { event: Event }) | null>(null)
  const [listedTicketIds, setListedTicketIds] = useState<Set<string>>(new Set())

  const upcoming = tickets.filter((t) => t.isUpcoming)
  const past = tickets.filter((t) => !t.isUpcoming)

  const handleListed = useCallback((ticketId: string, price: number) => {
    setListedTicketIds((prev) => new Set(prev).add(ticketId))

    // Find the ticket to create a mock transfer listing
    const ticket = tickets.find((t) => t.id === ticketId)
    if (ticket) {
      const tier = getEffectiveTier(user, ticket.event.artistId)
      addTransferListing(ticket.event.artistId, {
        id: `tf-user-${Date.now()}`,
        ticketId: ticket.id,
        eventId: ticket.eventId,
        sellerId: user.id,
        sellerTier: tier,
        sellerTransactionCount: 3,
        price,
        faceValue: ticket.price,
        section: ticket.section,
        seatInfo: `${ticket.section} ${ticket.row}열 ${ticket.seatNumber}번`,
        status: 'listed',
        createdAt: new Date().toISOString(),
      })
    }
  }, [tickets, user])

  const handleCancelTransfer = useCallback((ticketId: string) => {
    if (window.confirm('양도 등록을 취소하시겠습니까?')) {
      setListedTicketIds((prev) => {
        const next = new Set(prev)
        next.delete(ticketId)
        return next
      })
    }
  }, [])

  if (tickets.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-center">
        <div className="size-12 rounded-full bg-muted flex items-center justify-center">
          <TicketIcon size={24} className="text-muted-foreground" />
        </div>
        <p className="text-base font-medium">아직 예매한 티켓이 없습니다.</p>
        <p className="text-sm text-muted-foreground">
          공연을 둘러보세요!
        </p>
        <Button asChild className="mt-2">
          <Link to="/events">공연 찾기</Link>
        </Button>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-8">
        {/* Upcoming */}
        {upcoming.length > 0 && (
          <section>
            <h3 className="text-base font-semibold mb-3">다가오는 공연</h3>
            <div className="space-y-3">
              {upcoming.map((ticket) => (
                <TicketCard
                  key={ticket.id}
                  ticket={ticket}
                  variant="upcoming"
                  isListed={listedTicketIds.has(ticket.id)}
                  onViewQR={() => setSelectedTicket(ticket)}
                  onTransfer={() => setTransferTicket(ticket)}
                  onCancelTransfer={() => handleCancelTransfer(ticket.id)}
                />
              ))}
            </div>
          </section>
        )}

        {/* Past */}
        {past.length > 0 && (
          <section>
            <h3 className="text-base font-semibold mb-3 text-muted-foreground">지난 공연</h3>
            <div className="space-y-3">
              {past.map((ticket) => (
                <TicketCard
                  key={ticket.id}
                  ticket={ticket}
                  variant="past"
                />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* QR Modal */}
      <QRCodeModal
        ticket={selectedTicket}
        open={!!selectedTicket}
        onClose={() => setSelectedTicket(null)}
      />

      {/* Transfer Listing Modal */}
      <TransferListingModal
        ticket={transferTicket}
        userTier={transferTicket ? getEffectiveTier(user, transferTicket.event.artistId) : 'bronze'}
        open={!!transferTicket}
        onClose={() => setTransferTicket(null)}
        onListed={handleListed}
      />
    </>
  )
}
