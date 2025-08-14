"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  CreditCard, 
  Coins, 
  TrendingUp,
  Calendar,
  ExternalLink
} from "lucide-react";
import Link from "next/link";

interface BillingSectionProps {
  user: any;
}

export function BillingSection({ user }: BillingSectionProps) {
  const subscription = user.subscription;
  const credits = user.credits;
  
  const planInfo = {
    FREE: { name: "Gratuit", price: "0€", credits: 0, color: "secondary" },
    STARTER: { name: "Starter", price: "29€", credits: 100, color: "default" },
    PROFESSIONAL: { name: "Professional", price: "99€", credits: 500, color: "default" },
    ENTERPRISE: { name: "Enterprise", price: "299€", credits: 2000, color: "default" }
  };

  const currentPlan = subscription?.plan || "FREE";
  const plan = planInfo[currentPlan as keyof typeof planInfo];
  
  const creditsBalance = credits?.balance || 0;
  const monthlyCredits = credits?.monthlyCredits || 0;
  const usedCredits = monthlyCredits > 0 ? monthlyCredits - creditsBalance : 0;
  const usagePercentage = monthlyCredits > 0 ? (usedCredits / monthlyCredits) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Plan actuel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Plan actuel
          </CardTitle>
          <CardDescription>
            Gérez votre abonnement et votre facturation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold">{plan.name}</h3>
              <p className="text-muted-foreground">
                {plan.price}/mois {plan.credits > 0 && `• ${plan.credits} crédits inclus`}
              </p>
            </div>
            <Badge variant={plan.color as any}>
              {currentPlan}
            </Badge>
          </div>

          {subscription && subscription.isActive && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Prochain renouvellement</span>
                <span>
                  {subscription.renewsAt 
                    ? new Date(subscription.renewsAt).toLocaleDateString("fr-FR")
                    : "N/A"
                  }
                </span>
              </div>
              {subscription.apiAccess && (
                <div className="flex items-center gap-2 text-sm">
                  <Badge variant="outline" className="text-xs">
                    Accès API inclus
                  </Badge>
                </div>
              )}
            </div>
          )}

          <div className="flex gap-2 pt-4">
            {currentPlan === "FREE" ? (
              <Button asChild>
                <Link href="/plan/upgrade">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Passer Pro
                </Link>
              </Button>
            ) : (
              <Button variant="outline" asChild>
                <Link href="/plan/upgrade">
                  Changer de plan
                </Link>
              </Button>
            )}
            <Button variant="outline" asChild>
              <Link href="/plan/billing">
                Voir la facturation
                <ExternalLink className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Crédits */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Coins className="h-5 w-5" />
            Crédits disponibles
          </CardTitle>
          <CardDescription>
            Solde actuel et utilisation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <div className="text-3xl font-bold">{creditsBalance}</div>
            <p className="text-muted-foreground">crédits disponibles</p>
          </div>

          {monthlyCredits > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Utilisés ce mois</span>
                <span>{usedCredits}/{monthlyCredits}</span>
              </div>
              <Progress value={usagePercentage} className="h-2" />
            </div>
          )}

          {credits?.lastRecharge && (
            <div className="text-sm text-muted-foreground text-center">
              Dernière recharge : {new Date(credits.lastRecharge).toLocaleDateString("fr-FR")}
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <Button variant="outline" className="flex-1" asChild>
              <Link href="/plan/buy-credits">
                <Coins className="h-4 w-4 mr-2" />
                Acheter des crédits
              </Link>
            </Button>
            <Button variant="outline" className="flex-1" asChild>
              <Link href="/api/user/credits">
                Historique
                <ExternalLink className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Coûts des opérations */}
      <Card>
        <CardHeader>
          <CardTitle>Tarification</CardTitle>
          <CardDescription>
            Coût en crédits des différentes opérations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span>Rapport de base</span>
              <Badge variant="outline">20 crédits</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>Module benchmark</span>
              <Badge variant="outline">+12 crédits</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>Export API (CSV)</span>
              <Badge variant="outline">+5 crédits</Badge>
            </div>
            <div className="pt-2 border-t">
              <div className="flex justify-between items-center font-medium">
                <span>Rapport complet</span>
                <Badge>37 crédits</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}