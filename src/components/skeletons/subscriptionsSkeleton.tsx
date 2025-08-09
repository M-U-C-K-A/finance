import { Skeleton } from "@/components/ui/skeleton"

export default function SubscriptionsSkeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-4xl space-y-6">
        {/* Header skeleton */}
        <Skeleton className="h-10 w-40 rounded" />
        <Skeleton className="h-14 w-full rounded" />
        <Skeleton className="h-6 w-full rounded" />

        {/* Tabs skeleton */}
        <Skeleton className="mt-10 h-12 w-full max-w-md rounded" />

        {/* Cards skeleton grid */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-72 rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  )
}

