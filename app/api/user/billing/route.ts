// API pour récupérer les données de facturation
import { NextRequest } from "next/server";
import { getUser } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const user = await getUser();
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Récupérer l'abonnement actuel
    const subscription = await prisma.subscription.findUnique({
      where: { userId: user.id }
    });

    // Récupérer les transactions de crédits (achats et rechargements)
    const creditTransactions = await prisma.creditTransaction.findMany({
      where: { 
        userId: user.id,
        type: { in: ['PACK_PURCHASE', 'SUBSCRIPTION_RECHARGE'] }
      },
      orderBy: { createdAt: 'desc' },
      take: 20
    });

    // Récupérer les rapports générés (qui consomment des crédits)
    const reports = await prisma.report.findMany({
      where: { 
        userId: user.id,
        status: { in: ['COMPLETED', 'PENDING', 'PROCESSING'] }
      },
      orderBy: { createdAt: 'desc' },
      take: 20
    });

    // Créer les factures pour les achats de crédits
    const creditInvoices = creditTransactions.map((transaction, index) => ({
      id: `INV-CREDIT-${String(Date.now() + index).slice(-6)}`,
      date: transaction.createdAt.toISOString(),
      amount: transaction.type === 'SUBSCRIPTION_RECHARGE' ? 
        (subscription?.plan === 'STARTER' ? 29 :
         subscription?.plan === 'PROFESSIONAL' ? 99 :
         subscription?.plan === 'ENTERPRISE' ? 299 : 0) :
        Math.ceil(transaction.amount * 0.69), // Estimation du prix basé sur les crédits
      status: 'paid',
      description: transaction.description,
      type: transaction.type,
      category: 'CREDIT_PURCHASE',
      transactionId: transaction.id,
      downloadUrl: `/api/invoices/${transaction.id}.pdf`
    }));

    // Créer les factures pour les rapports générés
    const reportInvoices = reports.map((report, index) => {
      const reportTypeNames = {
        'BASELINE': 'Rapport Baseline',
        'DETAILED': 'Analyse Détaillée',
        'DEEP_ANALYSIS': 'Analyse Approfondie',
        'CUSTOM': 'Rapport Personnalisé',
        'PRICER': 'Modèle de Pricing',
        'BENCHMARK': 'Analyse Comparative'
      };

      const baseAmount = report.creditsCost * 0.69; // Prix estimé par crédit
      
      return {
        id: `INV-REPORT-${String(Date.now() + index + 1000).slice(-6)}`,
        date: report.createdAt.toISOString(),
        amount: Math.ceil(baseAmount),
        status: 'paid',
        description: `${reportTypeNames[report.reportType as keyof typeof reportTypeNames] || report.reportType} - ${report.assetSymbol}`,
        type: 'REPORT_GENERATION',
        category: 'REPORT',
        reportType: report.reportType,
        assetSymbol: report.assetSymbol,
        creditsCost: report.creditsCost,
        transactionId: report.id,
        downloadUrl: `/api/invoices/report-${report.id}.pdf`
      };
    });

    // Combiner toutes les factures et les trier par date
    const allInvoices = [...creditInvoices, ...reportInvoices].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    return Response.json({
      subscription: subscription ? {
        plan: subscription.plan,
        amount: subscription.plan === 'STARTER' ? 29 :
               subscription.plan === 'PROFESSIONAL' ? 99 :
               subscription.plan === 'ENTERPRISE' ? 299 : 0,
        nextBilling: subscription.renewsAt?.toISOString(),
        isActive: subscription.isActive,
        paymentMethod: "**** **** **** 4242" // Simulé
      } : null,
      invoices: allInvoices
    });

  } catch (error) {
    console.error("Billing API error:", error);
    return Response.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}