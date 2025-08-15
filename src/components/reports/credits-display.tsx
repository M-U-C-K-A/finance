// Composant UserPlanHeader selon AGENT.md pour affichage crédits/plan
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Coins, 
  Zap, 
  AlertTriangle,
  ArrowRight,
  CreditCard
} from "lucide-react";
import Link from "next/link";

interface UserPlanHeaderProps {
  creditsInfo: {
    balance: number;
    monthlyCredits: number;
    plan: 'FREE' | 'STARTER' | 'PROFESSIONAL' | 'ENTERPRISE';
    apiAccess: boolean;
    isActiveSubscription: boolean;
  };
  showActions?: boolean;
}

const planDetails = {
  FREE: { name: "Gratuit", color: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200" },
  STARTER: { name: "Starter", color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200" },
  PROFESSIONAL: { name: "Professional", color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200" },
  ENTERPRISE: { name: "Enterprise", color: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200" }
};

export function UserPlanHeader({ creditsInfo, showActions = true }: UserPlanHeaderProps) {
  const usedCredits = creditsInfo.monthlyCredits - creditsInfo.balance;
  const usagePercent = creditsInfo.monthlyCredits > 0 ? 
    Math.round((usedCredits / creditsInfo.monthlyCredits) * 100) : 0;
  
  const isLowCredits = creditsInfo.balance < 40; // Moins de 2 rapports standards
  const plan = planDetails[creditsInfo.plan];

  return (
    <Card className={`mb-6 ${isLowCredits ? 'border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950' : ''}`}>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Plan et badges */}
            <div className="flex items-center gap-2">
              <Badge className={plan.color} variant="secondary">
                {plan.name}
              </Badge>
              {creditsInfo.apiAccess && (
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800">
                  <Zap className="h-3 w-3 mr-1" />
                  API
                </Badge>
              )}
            </div>

            {/* Informations crédits */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Coins className="h-5 w-5 text-orange-600" />
                <div>
                  <div className="font-semibold">{creditsInfo.balance} crédits</div>
                  <div className="text-sm text-muted-foreground">
                    {creditsInfo.monthlyCredits > 0 ? `sur ${creditsInfo.monthlyCredits} mensuels` : 'disponibles'}
                  </div>
                </div>
              </div>

              {/* Barre de progression pour les abonnés */}
              {creditsInfo.monthlyCredits > 0 && (
                <div className="w-32">
                  <Progress value={usagePercent} className="h-2" />
                  <div className="text-xs text-muted-foreground mt-1">
                    {usagePercent}% utilisé
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Actions rapides */}
          {showActions && (
            <div className="flex items-center gap-2">
              {isLowCredits && (
                <div className="flex items-center gap-2 text-amber-700 dark:text-amber-300 mr-4">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="text-sm font-medium">Crédits faibles</span>
                </div>
              )}
              
              <Button variant="outline" size="sm" asChild>
                <Link href="/plan/buy-credits">
                  <Coins className="h-4 w-4 mr-1" />
                  Acheter
                </Link>
              </Button>
              
              <Button variant="outline" size="sm" asChild>
                <Link href="/plan/upgrade">
                  <CreditCard className="h-4 w-4 mr-1" />
                  Upgrade
                </Link>
              </Button>
            </div>
          )}
        </div>

        {/* Alerte crédits faibles */}
        {isLowCredits && (
          <div className="mt-4 p-3 bg-amber-100 border border-amber-200 rounded-lg dark:bg-amber-950 dark:border-amber-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                <div className="text-sm">
                  <div className="font-medium text-amber-800 dark:text-amber-200">Attention : Crédits insuffisants</div>
                  <div className="text-amber-700 dark:text-amber-300">
                    Il vous reste {creditsInfo.balance} crédits. Un rapport standard coûte 20 crédits.
                  </div>
                </div>
              </div>
              <Button size="sm" asChild>
                <Link href="/plan/buy-credits">
                  Recharger <ArrowRight className="h-3 w-3 ml-1" />
                </Link>
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}