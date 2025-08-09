import { Skeleton } from "@/components/ui/skeleton";

export function GenericSkeleton() {
	return (
		<div className="animate-pulse space-y-6 py-1">
			<Skeleton className="h-2 rounded" />
			<div className="space-y-3">
				<div className="grid grid-cols-3 gap-4">
					<Skeleton className="h-2 rounded col-span-2" />
					<Skeleton className="h-2 rounded col-span-1" />
				</div>
				<Skeleton className="h-2 rounded" />
			</div>
		</div>
	);
}

