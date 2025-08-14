// Logique d'administration sécurisée
import { getUser } from "@/lib/auth-server";

/**
 * Vérifie si l'utilisateur actuel est l'admin défini dans .env.local
 */
export async function isAdmin(): Promise<boolean> {
  try {
    const user = await getUser();
    if (!user) return false;

    const adminUserId = process.env.ADMIN_USER_ID;
    if (!adminUserId || adminUserId === "admin_user_id_here") {
      console.warn("ADMIN_USER_ID not properly configured in .env.local");
      return false;
    }

    return user.id === adminUserId;
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
}

/**
 * Middleware pour protéger les routes admin
 */
export async function requireAdmin() {
  const adminStatus = await isAdmin();
  if (!adminStatus) {
    throw new Error("Access denied: Admin privileges required");
  }
  return true;
}