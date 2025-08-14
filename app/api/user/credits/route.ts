// API Route pour gérer les crédits utilisateur
import { NextRequest } from "next/server";
import { getUser } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";
import { getUserCredits } from "@/lib/credits";

export async function GET(request: NextRequest) {
  try {
    const user = await getUser();
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Récupérer les crédits actuels
    const credits = await getUserCredits(user.id);
    
    // Récupérer l'historique des transactions récentes
    const transactions = await prisma.creditTransaction.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 20
    });

    // Récupérer les statistiques d'utilisation
    const [
      totalSpent,
      monthlySpent,
      reportCount,
      monthlyReportCount
    ] = await Promise.all([
      prisma.creditTransaction.aggregate({
        where: {
          userId: user.id,
          type: { in: ['REPORT_GENERATION', 'API_EXPORT'] }
        },
        _sum: { amount: true }
      }),
      
      prisma.creditTransaction.aggregate({
        where: {
          userId: user.id,
          type: { in: ['REPORT_GENERATION', 'API_EXPORT'] },
          createdAt: {
            gte: new Date(new Date().setDate(new Date().getDate() - 30))
          }
        },
        _sum: { amount: true }
      }),
      
      prisma.report.count({
        where: { userId: user.id }
      }),
      
      prisma.report.count({
        where: {
          userId: user.id,
          createdAt: {
            gte: new Date(new Date().setDate(new Date().getDate() - 30))
          }
        }
      })
    ]);

    return Response.json({
      currentCredits: credits,
      usage: {
        totalSpent: Math.abs(totalSpent._sum.amount || 0),
        monthlySpent: Math.abs(monthlySpent._sum.amount || 0),
        totalReports: reportCount,
        monthlyReports: monthlyReportCount
      },
      transactions: transactions.map(tx => ({
        id: tx.id,
        type: tx.type,
        amount: tx.amount,
        description: tx.description,
        createdAt: tx.createdAt
      }))
    });

  } catch (error) {
    console.error("Credits API error:", error);
    return Response.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getUser();
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { action, package: packageType } = await request.json();

    if (action === 'purchase' && packageType) {
      // Simulation d'achat de pack de crédits
      let credits: number;
      let price: number;
      
      switch (packageType) {
        case 'small':
          credits = 100;
          price = 69;
          break;
        case 'medium':
          credits = 500;
          price = 299;
          break;
        case 'large':
          credits = 2000;
          price = 1099;
          break;
        default:
          return Response.json(
            { error: "Invalid package type" },
            { status: 400 }
          );
      }

      // TODO: Intégrer avec Polar pour le paiement réel
      // Pour l'instant, on simule l'achat
      
      await prisma.$transaction(async (tx) => {
        // Ajouter les crédits
        await tx.creditTransaction.create({
          data: {
            userId: user.id,
            type: 'PACK_PURCHASE',
            amount: credits,
            description: `Achat pack ${credits} crédits - ${price}€`,
            reference: `PACK-${Date.now()}`
          }
        });
      });

      return Response.json({
        success: true,
        message: `${credits} crédits ajoutés avec succès`,
        credits
      });
    }

    return Response.json(
      { error: "Invalid action" },
      { status: 400 }
    );

  } catch (error) {
    console.error("Credits purchase error:", error);
    return Response.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}