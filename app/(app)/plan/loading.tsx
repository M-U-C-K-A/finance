import { FormSkeleton } from "@/components/ui/form-skeleton";

export default function PlanLoading() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        <div className="h-4 w-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mt-2" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <FormSkeleton fields={3} />
        <FormSkeleton fields={4} />
        <FormSkeleton fields={2} />
      </div>
    </div>
  );
}