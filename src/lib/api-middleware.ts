// ===================================================================
// 🛡️ MIDDLEWARE API - Vérification crédits et accès selon AGENT.md
// ===================================================================

import { NextRequest, NextResponse } from "next/server";
import { getUser } from "./auth-server";
import { hasEnoughCredits, hasApiAccess, calculateReportCost } from "./credits";

export type ApiMiddlewareOptions = {
  requireApiAccess?: boolean;
  requireCredits?: boolean;
  reportOptions?: {
    includeBenchmark?: boolean;
    includeApiExport?: boolean;
  };
};

/**
 * Middleware pour vérifier l'authentification, l'accès API et les crédits
 * Selon le workflow AGENT.md
 */
export async function withApiMiddleware(
  request: NextRequest,
  options: ApiMiddlewareOptions = {}
) {
  const { requireApiAccess = false, requireCredits = false, reportOptions } = options;

  try {
    // 1. Vérification authentification
    const user = await getUser();
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // 2. Vérification accès API si requis
    if (requireApiAccess) {
      const hasAccess = await hasApiAccess(user.id);
      if (!hasAccess) {
        return NextResponse.json(
          { 
            error: "API access requires subscription",
            message: "L'accès API est exclusif aux abonnés. Upgrader votre plan.",
            upgradeUrl: "/plan/upgrade"
          },
          { status: 403 }
        );
      }
    }

    // 3. Vérification crédits si requis
    if (requireCredits && reportOptions) {
      const requiredCredits = calculateReportCost(reportOptions);
      const hasCredits = await hasEnoughCredits(user.id, requiredCredits);
      
      if (!hasCredits) {
        return NextResponse.json(
          { 
            error: "Payment Required",
            message: `Crédits insuffisants. ${requiredCredits} crédits requis.`,
            requiredCredits,
            buyCreditsUrl: "/plan/buy-credits",
            upgradeUrl: "/plan/upgrade"
          },
          { status: 402 }
        );
      }
    }

    // Middleware réussi, continuer
    return null;
  } catch (error) {
    console.error("API Middleware Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

/**
 * Helper pour créer des handlers API avec middleware
 */
export function createApiHandler(
  handler: (request: NextRequest, context: { user: any; params?: any }) => Promise<NextResponse>,
  options: ApiMiddlewareOptions = {}
) {
  return async (request: NextRequest, { params }: { params?: any } = {}) => {
    // Appliquer le middleware
    const middlewareResult = await withApiMiddleware(request, options);
    if (middlewareResult) {
      return middlewareResult; // Erreur du middleware
    }

    // Récupérer l'utilisateur (on sait qu'il existe car middleware OK)
    const user = await getUser();
    
    // Appeler le handler principal
    return handler(request, { user, params });
  };
}

/**
 * Exemple d'utilisation dans un route handler
 * 
 * export const POST = createApiHandler(
 *   async (request, { user }) => {
 *     // Logique de génération de rapport
 *     return NextResponse.json({ success: true });
 *   },
 *   {
 *     requireApiAccess: true,
 *     requireCredits: true,
 *     reportOptions: {
 *       includeBenchmark: true,
 *       includeApiExport: true
 *     }
 *   }
 * );
 */