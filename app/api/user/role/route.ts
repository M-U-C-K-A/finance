import { getUser } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const user = await getUser();
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Récupérer le rôle de l'utilisateur depuis la DB
    const userInfo = await prisma.user.findUnique({
      where: { id: user.id },
      select: { role: true }
    });

    if (!userInfo) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ role: userInfo.role });
  } catch (error) {
    console.error("Error checking user role:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}