import { Skeleton } from '@/components/ui/skeleton'

export function HomePageSkeleton() {
  return (
    <div className="space-y-10">
      {/* Hero banner */}
      <Skeleton className="w-full h-[360px] rounded-2xl" />

      {/* Popular artists */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-7 w-32" />
          <Skeleton className="h-5 w-16" />
        </div>
        <div className="flex gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-2 w-[100px] shrink-0">
              <Skeleton className="size-[72px] rounded-full" />
              <Skeleton className="h-3.5 w-14" />
            </div>
          ))}
        </div>
      </div>

      {/* Today's ticketing */}
      <div className="space-y-4">
        <Skeleton className="h-7 w-32" />
        <div className="flex gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="w-[160px] shrink-0 space-y-2">
              <Skeleton className="w-full aspect-[4/5] rounded-lg" />
              <Skeleton className="h-3.5 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          ))}
        </div>
      </div>

      {/* Performance ranking */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-7 w-32" />
          <Skeleton className="h-8 w-20 rounded-md" />
        </div>
        <div className="grid grid-cols-2 gap-x-8 gap-y-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 h-12">
              <Skeleton className="h-5 w-4" />
              <Skeleton className="size-10 rounded-full" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-3.5 w-3/5" />
                <Skeleton className="h-3 w-2/5" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pre-sale opening soon */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-7 w-36" />
          <Skeleton className="h-8 w-40 rounded-full" />
        </div>
        <div className="grid grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex gap-3 p-3 rounded-lg border border-border">
              <Skeleton className="w-[80px] h-[100px] rounded-md shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3.5 w-full" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
