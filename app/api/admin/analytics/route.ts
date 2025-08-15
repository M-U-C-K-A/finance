import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/admin";

export async function GET(request: NextRequest) {
  const adminAccess = await isAdmin();
  if (!adminAccess) {
    return NextResponse.json({ error: "Access denied" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const range = searchParams.get("range") || "30d";

  // Calculate date range
  const now = new Date();
  const daysMap = { "7d": 7, "30d": 30, "90d": 90, "1y": 365 };
  const days = daysMap[range as keyof typeof daysMap] || 30;
  const startDate = new Date(now);
  startDate.setDate(now.getDate() - days);

  try {
    const [
      userGrowth,
      reportsByType, 
      topAssets,
      subscriptionTrends,
      revenueByMonth
    ] = await Promise.all([
      // User growth data
      prisma.user.findMany({
        where: { createdAt: { gte: startDate } },
        select: { createdAt: true },
        orderBy: { createdAt: 'asc' }
      }),

      // Reports by type
      prisma.report.groupBy({
        by: ['reportType'],
        _count: { reportType: true },
        where: { createdAt: { gte: startDate } }
      }),

      // Top assets
      prisma.report.groupBy({
        by: ['assetSymbol'],
        _count: { assetSymbol: true },
        where: { createdAt: { gte: startDate } },
        orderBy: { _count: { assetSymbol: 'desc' } },
        take: 10
      }),

      // Subscription trends
      prisma.subscription.groupBy({
        by: ['plan'],
        _count: { plan: true },
        where: { isActive: true }
      }),

      // Mock revenue data (would be calculated from actual transactions)
      Promise.resolve([
        { month: 'Jan 2024', revenue: 2840 },
        { month: 'Feb 2024', revenue: 3250 },
        { month: 'Mar 2024', revenue: 2950 },
        { month: 'Apr 2024', revenue: 3840 },
      ])
    ]);

    // Format user growth data by day
    const userGrowthData = userGrowth.reduce((acc, user) => {
      const date = user.createdAt.toISOString().split('T')[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const formattedUserGrowth = Object.entries(userGrowthData).map(([date, count]) => ({
      date,
      count
    }));

    // Format reports by type
    const formattedReportsByType = reportsByType.map(item => ({
      type: item.reportType,
      count: item._count.reportType
    }));

    // Format top assets
    const formattedTopAssets = topAssets.map(item => ({
      symbol: item.assetSymbol,
      count: item._count.assetSymbol
    }));

    // Format subscription trends with mock growth data
    const formattedSubscriptionTrends = subscriptionTrends.map(item => ({
      plan: item.plan,
      count: item._count.plan,
      growth: Math.floor(Math.random() * 20) - 5 // Mock growth percentage
    }));

    return NextResponse.json({
      userGrowth: formattedUserGrowth,
      reportsByType: formattedReportsByType,
      topAssets: formattedTopAssets,
      subscriptionTrends: formattedSubscriptionTrends,
      revenueByMonth
    });

  } catch (error) {
    console.error("Failed to fetch analytics:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}