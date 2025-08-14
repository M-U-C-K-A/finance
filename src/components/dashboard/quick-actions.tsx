// components/dashboard/quick-actions.tsx
"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { FileText, BarChart3, Coins, CreditCard } from "lucide-react";
import Link from "next/link";
import { ReportGeneratorDialog } from "@/components/reports/report-generator-dialog";

interface UserCreditsInfo {
  balance: number;
  monthlyCredits: number;
  lastRecharge?: Date | null;
  plan: 'FREE' | 'STARTER' | 'PROFESSIONAL' | 'ENTERPRISE';
  apiAccess: boolean;
  isActiveSubscription: boolean;
  renewsAt?: Date | null;
}

interface QuickActionsProps {
  creditsInfo: UserCreditsInfo;
}

export function QuickActions({ creditsInfo }: QuickActionsProps) {
  const usedCredits = creditsInfo.monthlyCredits - creditsInfo.balance;
  const usagePercentage = creditsInfo.monthlyCredits > 0 ? (usedCredits / creditsInfo.monthlyCredits) * 100 : 0;
  const hasLowCredits = creditsInfo.balance < 40; // Moins de 2 rapports possibles

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Actions rapides</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ReportGeneratorDialog
            trigger={
              <Button className="w-full" size="lg">
                <FileText className="h-4 w-4 mr-2" />
                Générer un rapport
              </Button>
            }
            userCredits={{
              balance: creditsInfo.balance,
              apiAccess: creditsInfo.apiAccess
            }}
            onReportGenerated={(reportId: string) => {
              // Optionnel: redirect vers l'historique ou rafraîchir
              if (typeof window !== 'undefined') {
                window.location.href = '/reports/history';
              }
            }}
          />
          <Button variant="outline" className="w-full" asChild>
            <Link href="/reports/history">
              <BarChart3 className="h-4 w-4 mr-2" />
              Voir l'historique
            </Link>
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Solde crédits</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span>Crédits disponibles</span>
              <span className="font-medium">{creditsInfo.balance}</span>
            </div>
            
            {creditsInfo.monthlyCredits > 0 && (
              <>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Utilisés ce mois</span>
                  <span>{usedCredits}/{creditsInfo.monthlyCredits}</span>
                </div>
                <Progress value={usagePercentage} aria-label="Utilisation des crédits" />
              </>
            )}
            
            {hasLowCredits && (
              <div className="text-sm text-amber-600 bg-amber-50 p-2 rounded">
                ⚠️ Crédits faibles - Rechargez pour continuer à générer des rapports
              </div>
            )}
            
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1" asChild>
                <Link href="/plan/buy-credits">
                  <Coins className="h-4 w-4 mr-1" />
                  Acheter
                </Link>
              </Button>
              <Button variant="outline" size="sm" className="flex-1" asChild>
                <Link href="/plan/upgrade">
                  <CreditCard className="h-4 w-4 mr-1" />
                  Upgrade
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

