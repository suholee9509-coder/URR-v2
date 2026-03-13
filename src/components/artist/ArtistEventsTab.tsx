import { Link } from 'react-router-dom'
import { Calendar } from 'lucide-react'
import { EventCard } from '@/components/urr/EventCard'
import { EmptyState } from '@/components/urr/EmptyState'
import type { Event } from '@/types'

interface ArtistEventsTabProps {
  upcoming: Event[]
  past: Event[]
  artistName: string
}

export function ArtistEventsTab({ upcoming, past, artistName }: ArtistEventsTabProps) {
  const hasEvents = upcoming.length > 0 || past.length > 0

  if (!hasEvents) {
    return <EmptyState icon={Calendar} description="등록된 공연이 없습니다" />
  }

  return (
    <div className="space-y-8">
      {/* Upcoming events */}
      {upcoming.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-lg font-bold">다가오는 공연</h2>
          <div className="space-y-3">
            {upcoming.map((event) => (
              <Link key={event.id} to={`/events/${event.id}/detail`} className="block">
                <EventCard event={event} artistName={artistName} />
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Past events */}
      {past.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-muted-foreground">지난 공연</h2>
          <div className="space-y-3 opacity-60">
            {past.map((event) => (
              <Link key={event.id} to={`/events/${event.id}/detail`} className="block">
                <EventCard event={event} artistName={artistName} />
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
