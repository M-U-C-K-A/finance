// API pour lister les factures de l'utilisateur
import { NextRequest } from "next/server";
import { getUser } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const user = await getUser();
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Récupérer les transactions de crédits (achats de tokens)
    const creditTransactions = await prisma.creditTransaction.findMany({
      where: {
        userId: user.id,
        type: {
          in: ['CREDIT_PURCHASE', 'SUBSCRIPTION_RECHARGE']
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 50
    });

    // Récupérer les rapports générés (pour facturation de services)
    const reports = await prisma.report.findMany({
      where: {
        userId: user.id,
        status: 'COMPLETED'
      },
      orderBy: { createdAt: 'desc' },
      take: 50
    });

    // Récupérer l'abonnement pour les détails
    const subscription = await prisma.subscription.findUnique({
      where: { userId: user.id }
    });

    // Formater les factures
    const invoices = [
      // Factures d'achat de crédits/tokens
      ...creditTransactions.map(transaction => ({
        id: transaction.id,
        type: 'CREDIT_PURCHASE' as const,
        description: transaction.description,
        amount: transaction.amount,
        credits: transaction.amount, // pour les achats de crédits
        date: transaction.createdAt,
        invoiceType: transaction.type === 'SUBSCRIPTION_RECHARGE' ? 'Abonnement mensuel' : 'Achat de crédits',
        downloadUrl: `/api/invoices/${transaction.id}.pdf`
      })),
      
      // Factures de génération de rapports (pour les utilisateurs sans abonnement)
      ...reports
        .filter(report => report.creditsCost > 0) // Seulement si des crédits ont été déduits
        .map(report => ({
          id: `report-${report.id}`,
          type: 'REPORT_GENERATION' as const,
          description: `Rapport ${report.reportType} - ${report.assetSymbol}`,
          amount: 0, // Pas de montant en euros pour les rapports (payés en crédits)
          credits: report.creditsCost,
          date: report.createdAt,
          invoiceType: 'Génération de rapport',
          downloadUrl: `/api/invoices/report-${report.id}.pdf`
        }))
    ];

    // Trier par date décroissante
    invoices.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return Response.json({
      invoices,
      subscription: subscription ? {
        plan: subscription.plan,
        status: subscription.status,
        currentPeriodEnd: subscription.currentPeriodEnd
      } : null
    });

  } catch (error) {
    console.error("Error fetching invoices:", error);
    return Response.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}