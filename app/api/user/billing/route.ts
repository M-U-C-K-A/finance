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

    // Récupérer les transactions de crédits (simule les factures)
    const transactions = await prisma.creditTransaction.findMany({
      where: { 
        userId: user.id,
        type: { in: ['PACK_PURCHASE', 'SUBSCRIPTION_RECHARGE'] }
      },
      orderBy: { createdAt: 'desc' },
      take: 10
    });

    // Simuler des factures basées sur les transactions
    const invoices = transactions.map((transaction, index) => ({
      id: `INV-2024-${String(index + 1).padStart(3, '0')}`,
      date: transaction.createdAt.toISOString(),
      amount: transaction.type === 'SUBSCRIPTION_RECHARGE' ? 
        (subscription?.plan === 'STARTER' ? 29 :
         subscription?.plan === 'PROFESSIONAL' ? 99 :
         subscription?.plan === 'ENTERPRISE' ? 299 : 0) :
        Math.ceil(transaction.amount * 0.69), // Estimation du prix basé sur les crédits
      status: 'paid',
      description: transaction.description,
      type: transaction.type,
      downloadUrl: `/api/invoices/${transaction.id}.pdf`
    }));

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
      invoices
    });

  } catch (error) {
    console.error("Billing API error:", error);
    return Response.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}