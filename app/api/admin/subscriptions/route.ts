import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/admin";

export async function GET(request: NextRequest) {
  const adminAccess = await isAdmin();
  if (!adminAccess) {
    return NextResponse.json({ error: "Access denied" }, { status: 403 });
  }

  try {
    const [subscriptions, stats] = await Promise.all([
      prisma.subscription.findMany({
        select: {
          id: true,
          plan: true,
          isActive: true,
          apiAccess: true,
          createdAt: true,
          updatedAt: true,
          user: {
            select: {
              name: true,
              email: true,
            }
          }
        },
        orderBy: { createdAt: 'desc' },
      }),
      
      // Get subscription statistics
      Promise.all([
        prisma.subscription.count(),
        prisma.subscription.count({ where: { isActive: true } }),
        prisma.subscription.count({ where: { isActive: false } }),
        prisma.subscription.count({ where: { plan: 'STARTER', isActive: true } }),
        prisma.subscription.count({ where: { plan: 'PROFESSIONAL', isActive: true } }),
        prisma.subscription.count({ where: { plan: 'ENTERPRISE', isActive: true } }),
      ])
    ]);

    const [total, active, inactive, starter, professional, enterprise] = stats;

    return NextResponse.json({ 
      subscriptions,
      stats: {
        total,
        active,
        inactive,
        starter,
        professional,
        enterprise
      }
    });
  } catch (error) {
    console.error("Failed to fetch subscriptions:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}