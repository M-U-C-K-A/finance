import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/admin";
import { addCredits } from "@/lib/credits";
import { TransactionType } from "@prisma/client";

export async function POST(request: NextRequest) {
  const adminAccess = await isAdmin();
  if (!adminAccess) {
    return NextResponse.json({ error: "Access denied" }, { status: 403 });
  }

  try {
    const { userId, amount, description } = await request.json();

    if (!userId || typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json({ error: "Invalid parameters" }, { status: 400 });
    }

    await addCredits(
      userId,
      amount,
      TransactionType.BONUS,
      description || `Admin credit bonus: ${amount} credits`,
    );

    return NextResponse.json({ success: true, message: `Added ${amount} credits to user` });
  } catch (error) {
    console.error("Failed to add credits:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

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
        credits: {
          select: {
            balance: true,
            monthlyCredits: true,
            lastRecharge: true,
          }
        },
        subscription: {
          select: {
            plan: true,
            isActive: true,
            apiAccess: true,
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