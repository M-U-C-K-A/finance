import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/auth-server";

export async function GET(request: NextRequest) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch user's credits info
    const [creditsInfo, subscription, recentReports, completedReportsCount] = await Promise.all([
      prisma.credits.findUnique({
        where: { userId: user.id },
      }),
      prisma.subscription.findUnique({
        where: { userId: user.id },
      }),
      prisma.report.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
          id: true,
          title: true,
          assetSymbol: true,
          assetType: true,
          reportType: true,
          status: true,
          createdAt: true,
          completedAt: true,
          creditsCost: true,
        }
      }),
      prisma.report.count({
        where: { 
          userId: user.id,
          status: 'COMPLETED',
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) // This month
          }
        }
      })
    ]);

    // Format credits info
    const formattedCreditsInfo = {
      balance: creditsInfo?.balance || 0,
      monthlyCredits: creditsInfo?.monthlyCredits || 0,
      lastRecharge: creditsInfo?.updatedAt || null,
      plan: subscription?.plan || 'FREE',
      apiAccess: subscription?.apiAccess || false,
      isActiveSubscription: subscription?.isActive || false,
      renewsAt: subscription?.updatedAt || null
    };

    // Format reports (matching interface structure)
    const formattedReports = recentReports.map(report => ({
      id: report.id,
      title: report.title,
      assetSymbol: report.assetSymbol,
      assetType: report.assetType,
      reportType: report.reportType,
      status: report.status, // Keep uppercase format
      createdAt: report.createdAt.toISOString(),
      completedAt: report.completedAt?.toISOString(),
      pdfPath: report.status === 'COMPLETED' ? `/reports/${report.id}.pdf` : undefined,
      creditsCost: report.creditsCost
    }));

    // Mock market data for now (would be from real API in production)
    const marketData = [
      {
        symbol: 'AAPL',
        name: 'Apple Inc.',
        price: 225.77,
        change: 2.34,
        changePercent: 1.05,
        lastUpdate: new Date().toISOString()
      },
      {
        symbol: 'TSLA',
        name: 'Tesla Inc.',
        price: 248.50,
        change: -5.23,
        changePercent: -2.06,
        lastUpdate: new Date().toISOString()
      },
      {
        symbol: 'MSFT',
        name: 'Microsoft Corp.',
        price: 425.61,
        change: 8.94,
        changePercent: 2.15,
        lastUpdate: new Date().toISOString()
      }
    ];

    return NextResponse.json({
      creditsInfo: formattedCreditsInfo,
      reports: formattedReports,
      completedReports: completedReportsCount,
      marketData
    });

  } catch (error) {
    console.error("Failed to fetch dashboard data:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}