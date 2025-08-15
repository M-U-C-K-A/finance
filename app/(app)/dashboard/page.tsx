// Page principale - dashboard/page.tsx
import { getUser } from "@/lib/auth-server";
import { Card, CardContent } from "@/components/ui/card";
import { DashboardClient } from "@/components/dashboard/dashboard-client";

export const metadata = {
  title: 'Dashboard - FinAnalytics',
  description: 'Your financial analytics dashboard with real-time market data and reports.',
};

export default async function Dashboard() {
  const user = await getUser();

  if (!user) {
    return (
      <div className="flex items-center justify-center h-full">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">
              Please log in to access the dashboard.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <DashboardClient user={user} />;
}
