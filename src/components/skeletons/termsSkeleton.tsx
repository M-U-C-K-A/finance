import { Skeleton } from "@/components/ui/skeleton";

export default function TermsSkeleton() {
  return (
    <Skeleton className="animate-pulse space-y-6 py-1">
      <Skeleton className="h-2 rounded col-span-2" />
      <Skeleton className="h-2 rounded" />
      <Skeleton className="h-2 rounded col-span-1" />
      <Skeleton className="h-2 rounded col-span-2" />
      <Skeleton className="h-2 rounded" />
      <Skeleton className="h-2 rounded col-span-1" />
      <Skeleton className="h-2 rounded col-span-2" />
      <Skeleton className="h-2 rounded" />
      <Skeleton className="h-2 rounded col-span-1" />
      <Skeleton className="h-2 rounded col-span-2" />
      <Skeleton className="h-2 rounded" />
      <Skeleton className="h-2 rounded col-span-1" />
    </Skeleton>
  );
}
