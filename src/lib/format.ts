const krFormatter = new Intl.NumberFormat('ko-KR')

export function formatPrice(amount: number): string {
  return `${krFormatter.format(amount)}원`
}

export function formatTimer(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

export function parseSeatDisplay(seatId: string, sectionName: string): string {
  const parts = seatId.split('-')
  const row = parts[parts.length - 2]
  const number = parts[parts.length - 1]
  return `${sectionName} ${row}열 ${number}번`
}

export function formatCountdown(seconds: number): string {
  if (seconds <= 0) return '0:00'
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  if (h > 0) {
    return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }
  return `${m}:${s.toString().padStart(2, '0')}`
}
