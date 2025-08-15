// Main Admin Dashboard with global metrics
import { isAdmin } from "@/lib/admin";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Users, 
  FileText, 
  CreditCard, 
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign
} from "lucide-react";

export const metadata = {
  title: 'Admin Dashboard - FinAnalytics',
  description: 'Administrative dashboard with platform metrics and management tools.',
};

async function getAdminStats() {
  const [
    totalUsers,
    totalReports,
    activeSubscriptions,
    pendingReports,
    recentUsers,
    recentReports,
    subscriptionStats,
    revenueStats
  ] = await Promise.all([
    prisma.user.count(),
    prisma.report.count(),
    prisma.subscription.count({ where: { isActive: true } }),
    prisma.report.count({ where: { status: 'PENDING' } }),
    prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: { id: true, name: true, email: true, createdAt: true, role: true }
    }),
    prisma.report.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { name: true, email: true } } }
    }),
    prisma.subscription.groupBy({
      by: ['plan'],
      _count: { plan: true },
      where: { isActive: true }
    }),
    // Revenue simulation (normally calculated from transactions)
    Promise.resolve({ monthly: 2840, total: 18650 })
  ]);

  return {
    totalUsers,
    totalReports,
    activeSubscriptions,
    pendingReports,
    recentUsers,
    recentReports,
    subscriptionStats,
    revenueStats
  };
}

export default async function AdminDashboard() {
  // Admin verification with specific ID from .env
  const adminAccess = await isAdmin();
  if (!adminAccess) {
    redirect("/dashboard");
  }
  
  try {
    const stats = await getAdminStats();
    
    const conversionRate = stats.totalUsers > 0 ? (stats.activeSubscriptions / stats.totalUsers * 100).toFixed(1) : '0';

    return (
      <div className="space-y-8 p-8">
        <div>
          <h1 className="text-3xl font-bold">Admin Panel</h1>
          <p className="text-muted-foreground">FinAnalytics platform overview</p>
        </div>

        {/* Main metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">
                {stats.recentUsers.length} new this week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Subscriptions</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeSubscriptions}</div>
              <p className="text-xs text-muted-foreground">
                {conversionRate}% conversion rate
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Reports</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalReports}</div>
              <p className="text-xs text-muted-foreground">
                {stats.pendingReports} pending
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue (MRR)</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.revenueStats.monthly}€</div>
              <p className="text-xs text-muted-foreground">
                Total: {stats.revenueStats.total}€
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Subscription distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Subscription Distribution</CardTitle>
              <CardDescription>Distribution by plan</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {stats.subscriptionStats.map((stat) => {
                const percentage = stats.activeSubscriptions > 0 ? 
                  (stat._count.plan / stats.activeSubscriptions * 100).toFixed(1) : '0';
                
                const planColors = {
                  STARTER: 'bg-blue-500',
                  PROFESSIONAL: 'bg-purple-500', 
                  ENTERPRISE: 'bg-amber-500'
                };
                
                return (
                  <div key={stat.plan} className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">{stat.plan}</span>
                      <span className="text-sm text-muted-foreground">
                        {stat._count.plan} ({percentage}%)
                      </span>
                    </div>
                    <Progress 
                      value={parseFloat(percentage)} 
                      className="h-2"
                    />
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Recent activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Users</CardTitle>
              <CardDescription>Latest registrations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.recentUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-muted-foreground">{user.email}</div>
                    </div>
                    <div className="text-right">
                      <Badge variant={user.role === 'ADMIN' ? 'default' : 'secondary'}>
                        {user.role}
                      </Badge>
                      <div className="text-xs text-muted-foreground">
                        {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent reports */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Reports</CardTitle>
            <CardDescription>Latest generation activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentReports.map((report) => (
                <div key={report.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      <FileText className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">{report.title}</div>
                      <div className="text-sm text-muted-foreground">
                        by {report.user.name} • {report.assetSymbol}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={
                      report.status === 'COMPLETED' ? 'default' :
                      report.status === 'PROCESSING' ? 'secondary' :
                      report.status === 'FAILED' ? 'destructive' : 'outline'
                    }>
                      {report.status === 'COMPLETED' && <CheckCircle className="h-3 w-3 mr-1" />}
                      {report.status === 'PROCESSING' && <Clock className="h-3 w-3 mr-1" />}
                      {report.status === 'FAILED' && <AlertTriangle className="h-3 w-3 mr-1" />}
                      {report.status}
                    </Badge>
                    <div className="text-sm text-muted-foreground">
                      {report.creditsCost} credits
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
    
  } catch {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Access Denied</h3>
            <p className="text-muted-foreground">
              You must have administrator rights to access this page.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }
}