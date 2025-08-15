import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/admin";
import { UserRole } from "@prisma/client";

export async function POST(request: NextRequest) {
  const adminAccess = await isAdmin();
  if (!adminAccess) {
    return NextResponse.json({ error: "Access denied" }, { status: 403 });
  }

  try {
    const { userId, role } = await request.json();

    if (!userId || !role || !Object.values(UserRole).includes(role)) {
      return NextResponse.json({ error: "Invalid parameters" }, { status: 400 });
    }

    await prisma.user.update({
      where: { id: userId },
      data: { role: role as UserRole },
    });

    return NextResponse.json({ success: true, message: `User role updated to ${role}` });
  } catch (error) {
    console.error("Failed to update user role:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}