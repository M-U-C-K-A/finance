// app/api/reports/history/route.ts

import { prisma } from "@/lib/prisma";
import { verifyAuth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const auth = await verifyAuth(req);
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const reports = await prisma.reportRequest.findMany({
    where: { userId: auth.userId },
    include: { report: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ reports });
}
