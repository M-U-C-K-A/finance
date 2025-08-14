// API simple pour vérifier le statut admin côté client
import { isAdmin } from "@/lib/admin";

export async function GET() {
  try {
    const adminAccess = await isAdmin();
    
    if (adminAccess) {
      return Response.json({ admin: true });
    } else {
      return Response.json({ admin: false }, { status: 403 });
    }
  } catch (error) {
    return Response.json({ admin: false }, { status: 403 });
  }
}