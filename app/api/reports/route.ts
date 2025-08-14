// API Route pour récupérer les rapports de l'utilisateur
import { NextRequest } from "next/server";
import { getUser } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const user = await getUser();
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Construire la requête avec filtres
    const where: any = { userId: user.id };
    if (status && status !== 'all') {
      where.status = status.toUpperCase();
    }

    // Récupérer les rapports
    const [reports, totalCount] = await Promise.all([
      prisma.report.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
        include: {
          _count: {
            select: {
              apiRequests: true
            }
          }
        }
      }),
      prisma.report.count({ where })
    ]);

    // Statistiques sur les rapports
    const stats = await prisma.report.groupBy({
      by: ['status'],
      where: { userId: user.id },
      _count: { status: true }
    });

    const statsFormatted = stats.reduce((acc, stat) => {
      acc[stat.status.toLowerCase()] = stat._count.status;
      return acc;
    }, {} as Record<string, number>);

    return Response.json({
      reports: reports.map(report => ({
        id: report.id,
        title: report.title,
        assetType: report.assetType,
        assetSymbol: report.assetSymbol,
        reportType: report.reportType,
        status: report.status,
        creditsCost: report.creditsCost,
        includeBenchmark: report.includeBenchmark,
        includeApiExport: report.includeApiExport,
        createdAt: report.createdAt,
        processingStartedAt: report.processingStartedAt,
        completedAt: report.completedAt,
        failureReason: report.failureReason,
        pdfPath: report.pdfPath,
        csvPath: report.csvPath,
        apiRequestsCount: report._count.apiRequests
      })),
      pagination: {
        total: totalCount,
        limit,
        offset,
        hasMore: offset + limit < totalCount
      },
      stats: {
        total: totalCount,
        pending: statsFormatted.pending || 0,
        processing: statsFormatted.processing || 0,
        completed: statsFormatted.completed || 0,
        failed: statsFormatted.failed || 0
      }
    });

  } catch (error) {
    console.error("Get reports error:", error);
    return Response.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}