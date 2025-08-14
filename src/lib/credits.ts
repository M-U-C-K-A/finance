// ===================================================================
// 💳 SYSTÈME DE CRÉDITS - Logique métier selon AGENT.md
// ===================================================================

import { prisma } from "./prisma";
import { SubscriptionPlan, TransactionType } from "@prisma/client";

// Coûts selon AGENT.md
export const CREDIT_COSTS = {
  BASELINE_REPORT: 20,
  BENCHMARK_MODULE: 12,
  API_EXPORT: 5,
} as const;

// Plans et leurs crédits mensuels selon AGENT.md  
export const SUBSCRIPTION_CREDITS = {
  FREE: 0,
  STARTER: 100,      // 29€/mois
  PROFESSIONAL: 500, // 99€/mois  
  ENTERPRISE: 2000,  // 299€/mois
} as const;

// Prix des packs de crédits selon AGENT.md
export const CREDIT_PACK_PRICES = {
  100: 69,   // 100 crédits - 69€
  500: 299,  // 500 crédits - 299€  
  2000: 1099, // 2000 crédits - 1099€
} as const;

/**
 * Calcule le coût total d'un rapport selon ses options
 */
export function calculateReportCost(options: {
  includeBenchmark?: boolean;
  includeApiExport?: boolean;
}): number {
  let cost = CREDIT_COSTS.BASELINE_REPORT;
  
  if (options.includeBenchmark) {
    cost += CREDIT_COSTS.BENCHMARK_MODULE;
  }
  
  if (options.includeApiExport) {
    cost += CREDIT_COSTS.API_EXPORT;
  }
  
  return cost;
}

/**
 * Vérifie si un utilisateur a suffisamment de crédits
 */
export async function hasEnoughCredits(userId: string, requiredCredits: number): Promise<boolean> {
  const credits = await prisma.credits.findUnique({
    where: { userId }
  });
  
  return credits ? credits.balance >= requiredCredits : false;
}

/**
 * Vérifie si un utilisateur a accès à l'API (abonnés uniquement)
 */
export async function hasApiAccess(userId: string): Promise<boolean> {
  const subscription = await prisma.subscription.findUnique({
    where: { userId }
  });
  
  return subscription ? subscription.apiAccess && subscription.isActive : false;
}

/**
 * Récupérer le nombre de crédits actuels d'un utilisateur
 */
export async function getUserCredits(userId: string): Promise<number> {
  const credits = await prisma.credits.findUnique({
    where: { userId }
  });
  
  return credits?.balance || 0;
}

/**
 * Débite les crédits d'un utilisateur pour un rapport
 */
export async function debitCredits(
  userId: string, 
  amount: number, 
  description: string,
  reportId?: string
): Promise<void> {
  await prisma.$transaction(async (tx) => {
    // Récupérer le solde actuel
    const credits = await tx.credits.findUnique({
      where: { userId }
    });
    
    if (!credits || credits.balance < amount) {
      throw new Error("Insufficient credits");
    }
    
    const newBalance = credits.balance - amount;
    
    // Mettre à jour le solde
    await tx.credits.update({
      where: { userId },
      data: { balance: newBalance }
    });
    
    // Créer la transaction
    await tx.creditTransaction.create({
      data: {
        userId,
        type: TransactionType.REPORT_USAGE,
        amount: -amount,
        description,
        balanceAfter: newBalance,
        reportId
      }
    });
  });
}

/**
 * Ajoute des crédits (achat pack ou recharge abonnement)
 */
export async function addCredits(
  userId: string,
  amount: number,
  type: TransactionType,
  description: string,
  externalId?: string
): Promise<void> {
  await prisma.$transaction(async (tx) => {
    // Récupérer ou créer l'entrée crédits
    const credits = await tx.credits.upsert({
      where: { userId },
      create: {
        userId,
        balance: amount
      },
      update: {
        balance: { increment: amount }
      }
    });
    
    const newBalance = credits.balance + amount;
    
    // Créer la transaction
    await tx.creditTransaction.create({
      data: {
        userId,
        type,
        amount,
        description,
        balanceAfter: newBalance,
        externalId
      }
    });
  });
}

/**
 * Recharge les crédits mensuels pour les abonnés
 */
export async function rechargeMonthlyCredits(userId: string): Promise<void> {
  const subscription = await prisma.subscription.findUnique({
    where: { userId }
  });
  
  if (!subscription || !subscription.isActive) {
    return;
  }
  
  const monthlyCredits = SUBSCRIPTION_CREDITS[subscription.plan];
  if (monthlyCredits > 0) {
    await addCredits(
      userId,
      monthlyCredits,
      TransactionType.SUBSCRIPTION_RECHARGE,
      `Recharge mensuelle ${subscription.plan}`,
      subscription.polarSubscriptionId || undefined
    );
    
    // Mettre à jour la date de dernière recharge
    await prisma.credits.update({
      where: { userId },
      data: { 
        monthlyCredits,
        lastRecharge: new Date()
      }
    });
  }
}

/**
 * Récupère les informations complètes de crédits et abonnement
 */
export async function getUserCreditsInfo(userId: string) {
  const [credits, subscription] = await Promise.all([
    prisma.credits.findUnique({
      where: { userId }
    }),
    prisma.subscription.findUnique({
      where: { userId }
    })
  ]);
  
  return {
    balance: credits?.balance || 0,
    monthlyCredits: credits?.monthlyCredits || 0,
    lastRecharge: credits?.lastRecharge,
    plan: subscription?.plan || SubscriptionPlan.FREE,
    apiAccess: subscription?.apiAccess || false,
    isActiveSubscription: subscription?.isActive || false,
    renewsAt: subscription?.renewsAt
  };
}

/**
 * Calcule les économies par rapport aux packs de crédits
 */
export function calculateSubscriptionSavings(plan: SubscriptionPlan): {
  monthlyCredits: number;
  equivalentPackValue: number;
  savingsPercent: number;
} {
  const monthlyCredits = SUBSCRIPTION_CREDITS[plan];
  
  // Trouve le pack le plus proche pour calculer l'équivalent
  let equivalentPackValue = 0;
  if (monthlyCredits <= 100) {
    equivalentPackValue = CREDIT_PACK_PRICES[100];
  } else if (monthlyCredits <= 500) {
    equivalentPackValue = CREDIT_PACK_PRICES[500];
  } else {
    equivalentPackValue = CREDIT_PACK_PRICES[2000];
  }
  
  // Prix des plans (en euros selon AGENT.md)
  const planPrices = {
    FREE: 0,
    STARTER: 29,
    PROFESSIONAL: 99,
    ENTERPRISE: 299
  };
  
  const planPrice = planPrices[plan];
  const savingsPercent = planPrice > 0 ? Math.round(((equivalentPackValue - planPrice) / equivalentPackValue) * 100) : 0;
  
  return {
    monthlyCredits,
    equivalentPackValue,
    savingsPercent
  };
}