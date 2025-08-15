import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/admin";

export async function GET(request: NextRequest) {
  const adminAccess = await isAdmin();
  if (!adminAccess) {
    return NextResponse.json({ error: "Access denied" }, { status: 403 });
  }

  try {
    const [reports, stats] = await Promise.all([
      prisma.report.findMany({
        select: {
          id: true,
          title: true,
          assetSymbol: true,
          assetType: true,
          reportType: true,
          status: true,
          creditsCost: true,
          createdAt: true,
          completedAt: true,
          user: {
            select: {
              name: true,
              email: true,
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 100, // Limit to recent 100 reports
      }),
      
      // Get statistics
      Promise.all([
        prisma.report.count(),
        prisma.report.count({ where: { status: 'PENDING' } }),
        prisma.report.count({ where: { status: 'PROCESSING' } }),
        prisma.report.count({ where: { status: 'COMPLETED' } }),
        prisma.report.count({ where: { status: 'FAILED' } }),
      ])
    ]);

    const [total, pending, processing, completed, failed] = stats;

    return NextResponse.json({ 
      reports,
      stats: {
        total,
        pending,
        processing,
        completed,
        failed
      }
    });
  } catch (error) {
    console.error("Failed to fetch reports:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}