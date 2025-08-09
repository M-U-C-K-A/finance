// middleware.ts
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("next-auth.session-token")?.value;
  // ou vérifie un token ou session d’une autre façon

  // Si pas connecté, affiche un toast
  if (!token) {
    // Code pour afficher un toast côté client peut être ajouté ici
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/settings/:path*",
    "/billing/:path*",
  ],
};

