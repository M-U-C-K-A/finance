import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface AdminPageSkeletonProps {
  title?: string;
  showStats?: boolean;
  statsCount?: number;
  showTable?: boolean;
  tableRows?: number;
}

export function AdminPageSkeleton({ 
  title = "Loading...",
  showStats = true,
  statsCount = 5,
  showTable = true,
  tableRows = 5 
}: AdminPageSkeletonProps) {
  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-48" />
          </div>
          <Skeleton className="h-4 w-64 mt-2" />
        </div>
        <Skeleton className="h-10 w-24" />
      </div>

      {/* Stats Cards */}
      {showStats && (
        <div className={`grid grid-cols-1 md:grid-cols-${Math.min(statsCount, 6)} gap-4`}>
          {Array.from({ length: statsCount }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-20" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-32" />
      </div>

      {/* Main Content Table */}
      {showTable && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-6 w-16" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Table Header */}
              <div className="grid grid-cols-6 gap-4 py-3 border-b">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-4 w-16" />
                ))}
              </div>
              
              {/* Table Rows */}
              {Array.from({ length: tableRows }).map((_, i) => (
                <div key={i} className="grid grid-cols-6 gap-4 py-4 items-center">
                  {Array.from({ length: 6 }).map((_, j) => (
                    <div key={j}>
                      {j === 0 ? (
                        <div className="flex items-center gap-2">
                          <Skeleton className="h-8 w-8 rounded" />
                          <div className="space-y-1">
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-3 w-24" />
                          </div>
                        </div>
                      ) : j === 5 ? (
                        <Skeleton className="h-8 w-16" />
                      ) : (
                        <Skeleton className="h-4 w-16" />
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}