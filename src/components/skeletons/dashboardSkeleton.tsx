import { Skeleton } from "@/components/ui/skeleton";

export function DashboardSkeleton() {
  return (
    <div className="mx-auto max-w-3xl w-full flex items-center justify-center h-full px-4 sm:px-6 lg:max-w-7xl lg:px-8 py-12">
      <div className="flex flex-col items-center justify-center gap-8 w-full max-w-2xl">
        <div className="animate-pulse w-full border rounded-lg p-6 space-y-6">
          <div className="flex items-center gap-4">
            <div className="rounded-full h-12 w-12"></div>
            <div className="flex flex-col gap-2 flex-1">
              <Skeleton className="h-6 rounded w-1/2"></Skeleton>
              <Skeleton className="h-4 rounded w-1/3"></Skeleton>
            </div>
          </div>

          <Skeleton className="rounded-lg border h-20"></Skeleton>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Skeleton className="h-10 rounded w-full"></Skeleton>
            <Skeleton className="h-10 rounded w-full"></Skeleton>
          </div>
        </div>
      </div>
    </div>
  );
}

