// Middleware pour vérifier les droits admin
import { getUser } from "./auth-server";
import { prisma } from "./prisma";

export async function requireAdmin() {
  const user = await getUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { role: true }
  });

  if (!dbUser || dbUser.role !== "ADMIN") {
    throw new Error("Admin access required");
  }

  return user;
}

export async function isAdmin(userId?: string): Promise<boolean> {
  if (!userId) {
    const user = await getUser();
    if (!user) return false;
    userId = user.id;
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true }
  });

  return dbUser?.role === "ADMIN";
}