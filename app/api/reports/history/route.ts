import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/auth-server";

export async function GET(request: NextRequest) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const reports = await prisma.report.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        assetSymbol: true,
        assetType: true,
        reportType: true,
        status: true,
        creditsCost: true,
        pdfPath: true,
        createdAt: true,
        completedAt: true,
      }
    });

    // Transform to match the interface expected by the frontend
    const transformedReports = reports.map(report => ({
      id: report.id,
      assetId: report.id, // Using report ID as assetId for now
      frequency: 'one-time',
      type: 'one-time',
      assetName: report.title,
      assetSymbol: report.assetSymbol,
      assetType: report.assetType,
      reportType: report.reportType,
      status: report.status.toLowerCase(),
      creditsUsed: report.creditsCost,
      paymentMethod: 'credits', // Default to credits for now
      createdAt: report.createdAt.toISOString(),
      completedAt: report.completedAt?.toISOString(),
      pdfPath: report.pdfPath,
      downloadUrl: report.status === 'COMPLETED' ? `/api/reports/${report.id}/download` : undefined,
      config: {}
    }));

    return NextResponse.json({ reports: transformedReports });
  } catch (error) {
    console.error("Failed to fetch report history:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}