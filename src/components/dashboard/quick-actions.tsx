// components/dashboard/quick-actions.tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { FileText, BarChart3 } from "lucide-react";

interface Subscription {
  plan: 'free' | 'basic' | 'premium' | 'enterprise';
  reportsUsed: number;
  reportsLimit: number;
  renewsAt: string;
  isActive: boolean;
}

interface QuickActionsProps {
  subscription: Subscription;
}

export function QuickActions({ subscription }: QuickActionsProps) {
  const usagePercentage = (subscription.reportsUsed / subscription.reportsLimit) * 100;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Actions rapides</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button className="w-full" size="lg">
            <FileText className="h-4 w-4 mr-2" />
            Nouveau rapport
          </Button>
          <Button variant="outline" className="w-full">
            <BarChart3 className="h-4 w-4 mr-2" />
            Voir l'historique
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Utilisation du quota</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span>Rapports utilisés ce mois</span>
              <span>{subscription.reportsUsed}/{subscription.reportsLimit}</span>
            </div>
            <Progress value={usagePercentage} 
            aria-label="Utilisation des rapports" />
            {usagePercentage > 80 && (
              <div className="text-sm text-amber-600">
                ⚠️ Vous approchez de votre limite mensuelle
              </div>
            )}
            <Button variant="link" className="p-0 h-auto text-sm">
              Mettre à niveau mon abonnement →
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

