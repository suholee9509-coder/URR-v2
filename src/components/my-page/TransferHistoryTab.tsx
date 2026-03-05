import { ArrowLeftRight, Calendar } from 'lucide-react'
import { TransferStatusBadge } from '@/components/urr/TransferStatusBadge'
import { PriceDisplay } from '@/components/urr/PriceDisplay'
import { formatPrice } from '@/lib/format'
import type { MyTransferRecord } from '@/data/mock-my-page'
import type { Event } from '@/types'

// ── Individual transfer record card ──────────────────────

interface TransferHistoryCardProps {
  record: MyTransferRecord & { event: Event }
}

function TransferHistoryCard({ record }: TransferHistoryCardProps) {
  const firstDate = record.event.dates[0]?.date ?? ''
  const dateStr = firstDate
    ? new Date(firstDate).toLocaleDateString('ko-KR', {
        month: 'long',
        day: 'numeric',
        weekday: 'short',
      })
    : ''

  const netPayout = record.price - record.platformFee

  return (
    <div className="rounded-lg border border-border bg-card p-4 space-y-3">
      {/* Header: event + status */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h4 className="text-sm font-semibold line-clamp-1">{record.event.title}</h4>
          <div className="flex items-center gap-1.5 mt-1 text-[13px] text-muted-foreground">
            <Calendar size={12} />
            <span>{dateStr}</span>
          </div>
        </div>
        <TransferStatusBadge status={record.status} />
      </div>

      {/* Seat info */}
      <p className="text-sm font-medium">{record.section} · {record.seatInfo}</p>

      {/* Price breakdown */}
      <div className="flex items-center gap-4 text-sm">
        {record.role === 'seller' ? (
          <>
            <div>
              <span className="text-muted-foreground">등록가: </span>
              <PriceDisplay amount={record.price} size="sm" />
            </div>
            <div>
              <span className="text-muted-foreground">수수료: </span>
              <span className="text-sm font-medium text-red-500">-{formatPrice(record.platformFee)}</span>
            </div>
            <div>
              <span className="text-muted-foreground">정산금: </span>
              <span className="text-sm font-semibold">{formatPrice(netPayout)}</span>
            </div>
          </>
        ) : (
          <>
            <div>
              <span className="text-muted-foreground">구매가: </span>
              <PriceDisplay amount={record.price} size="sm" />
            </div>
            {record.counterpartyName && (
              <div>
                <span className="text-muted-foreground">판매자: </span>
                <span className="text-sm font-medium">{record.counterpartyName}</span>
              </div>
            )}
          </>
        )}
      </div>

      {/* Date */}
      <p className="text-xs text-muted-foreground">
        {new Date(record.createdAt).toLocaleDateString('ko-KR', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        })}
      </p>
    </div>
  )
}

// ── Tab content ──────────────────────────────────────────

interface TransferHistoryTabProps {
  records: (MyTransferRecord & { event: Event })[]
}

export function TransferHistoryTab({ records }: TransferHistoryTabProps) {
  const sellerRecords = records.filter((r) => r.role === 'seller')
  const buyerRecords = records.filter((r) => r.role === 'buyer')

  if (records.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-center">
        <div className="size-12 rounded-full bg-muted flex items-center justify-center">
          <ArrowLeftRight size={24} className="text-muted-foreground" />
        </div>
        <p className="text-base font-medium">양도 내역이 없습니다.</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Sold */}
      {sellerRecords.length > 0 && (
        <section>
          <h3 className="text-base font-semibold mb-3">판매 내역</h3>
          <div className="space-y-3">
            {sellerRecords.map((r) => (
              <TransferHistoryCard key={r.id} record={r} />
            ))}
          </div>
        </section>
      )}

      {/* Purchased */}
      {buyerRecords.length > 0 && (
        <section>
          <h3 className="text-base font-semibold mb-3">구매 내역</h3>
          <div className="space-y-3">
            {buyerRecords.map((r) => (
              <TransferHistoryCard key={r.id} record={r} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
