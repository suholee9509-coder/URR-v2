import { Skeleton } from '@/components/ui/skeleton'

export function ArtistPageSkeleton() {
  return (
    <div className="space-y-6">
      {/* Banner */}
      <Skeleton className="h-[200px] w-full rounded-xl" />

      {/* Avatar + name row */}
      <div className="flex items-center gap-4">
        <Skeleton className="size-16 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-7 w-40" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex gap-6">
        <Skeleton className="h-5 w-8" />
        <Skeleton className="h-5 w-8" />
        <Skeleton className="h-5 w-8" />
      </div>

      {/* Content cards */}
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-4">
            <Skeleton className="w-[100px] h-[140px] rounded-lg shrink-0" />
            <div className="flex-1 space-y-2 py-2">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-1/3" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
