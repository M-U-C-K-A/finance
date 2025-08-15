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
    const { isActive } = await request.json();
    const { id: subscriptionId } = await params;

    // Check if subscription exists
    const subscription = await prisma.subscription.findUnique({
      where: { id: subscriptionId },
    });

    if (!subscription) {
      return NextResponse.json({ error: "Subscription not found" }, { status: 404 });
    }

    // Update subscription status
    await prisma.subscription.update({
      where: { id: subscriptionId },
      data: {
        isActive: isActive,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({ 
      success: true, 
      message: `Subscription ${isActive ? 'activated' : 'deactivated'} successfully` 
    });
  } catch (error) {
    console.error("Failed to toggle subscription status:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}