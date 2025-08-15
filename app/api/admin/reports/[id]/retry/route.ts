import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/admin";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const adminAccess = await isAdmin();
  if (!adminAccess) {
    return NextResponse.json({ error: "Access denied" }, { status: 403 });
  }

  try {
    const { id: reportId } = await params;

    // Check if report exists and is in FAILED status
    const report = await prisma.report.findUnique({
      where: { id: reportId },
    });

    if (!report) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    if (report.status !== "FAILED") {
      return NextResponse.json(
        { error: "Only failed reports can be retried" },
        { status: 400 }
      );
    }

    // Update report status to PENDING for retry
    await prisma.report.update({
      where: { id: reportId },
      data: {
        status: "PENDING",
        completedAt: null,
      },
    });

    return NextResponse.json({ success: true, message: "Report queued for retry" });
  } catch (error) {
    console.error("Failed to retry report:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}