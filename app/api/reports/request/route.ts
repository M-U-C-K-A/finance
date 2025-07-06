// app/api/reports/request/route.ts

import { prisma } from "@/lib/prisma";
import { verifyAuth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const auth = await verifyAuth(req);
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { tickers, params } = await req.json();

  if (!tickers || tickers.length === 0) {
    return NextResponse.json({ error: "Missing tickers" }, { status: 400 });
  }

  const request = await prisma.reportRequest.create({
    data: {
      userId: auth.userId,
      tickers: tickers.join(','),
      params: JSON.stringify(params),
    },
  });

  return NextResponse.json({ message: "Report requested", requestId: request.id });
}
