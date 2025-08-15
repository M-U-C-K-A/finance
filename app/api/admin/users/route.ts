import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/admin";

export async function GET(request: NextRequest) {
  const adminAccess = await isAdmin();
  if (!adminAccess) {
    return NextResponse.json({ error: "Access denied" }, { status: 403 });
  }

  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        emailVerified: true,
        createdAt: true,
        credits: {
          select: {
            balance: true,
            monthlyCredits: true,
          }
        },
        subscription: {
          select: {
            plan: true,
            isActive: true,
            apiAccess: true,
          }
        },
        _count: {
          select: {
            reports: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ users });
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}