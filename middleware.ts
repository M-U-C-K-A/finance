// middleware.ts
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("next-auth.session-token")?.value;

  // Si on est sur une route protégée, et pas de token, on redirige vers /signin
  if (req.nextUrl.pathname.startsWith("/admin")) {
    if (!token) {
      // Redirige vers page de connexion
      const signInUrl = new URL("/auth", req.url);
      return NextResponse.redirect(signInUrl);
    }
  }

  // Sinon on continue normalement
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",  // protège toutes les routes sous /admin
  ],
};
