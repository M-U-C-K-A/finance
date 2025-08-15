import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface FormSkeletonProps {
  title?: boolean;
  description?: boolean;
  fields?: number;
  submitButton?: boolean;
}

export function FormSkeleton({ 
  title = true, 
  description = true, 
  fields = 4, 
  submitButton = true 
}: FormSkeletonProps) {
  return (
    <Card>
      {(title || description) && (
        <CardHeader>
          {title && <Skeleton className="h-6 w-48" />}
          {description && <Skeleton className="h-4 w-64 mt-2" />}
        </CardHeader>
      )}
      <CardContent className="space-y-4">
        {Array.from({ length: fields }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
        {submitButton && (
          <Skeleton className="h-10 w-32 mt-6" />
        )}
      </CardContent>
    </Card>
  );
}

export function SettingsPageSkeleton() {
  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-4 w-48 mt-2" />
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-4 border-b">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-20" />
        ))}
      </div>

      {/* Form Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FormSkeleton title={true} description={true} fields={3} />
        <FormSkeleton title={true} description={true} fields={4} />
      </div>
    </div>
  );
}