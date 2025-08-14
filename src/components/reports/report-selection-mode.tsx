// components/reports/report-selection-mode.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Crown, Coins, Zap, Shield } from "lucide-react";

interface ReportSelectionModeProps {
  userPlanType: 'subscription' | 'credits' | 'free';
  onSubscriptionMode: () => void;
  onCreditsMode: () => void;
}

export function ReportSelectionMode({ userPlanType, onSubscriptionMode, onCreditsMode }: ReportSelectionModeProps) {
  if (userPlanType !== 'free') return null;

  return (
    <div className="grid md:grid-cols-2 gap-6 mb-8">
      <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={onSubscriptionMode}>
        <CardHeader className="text-center">
          <Crown className="h-12 w-12 mx-auto text-primary mb-4" />
          <CardTitle className="flex items-center justify-center gap-2">
            Rapports d'abonnement
            <Badge variant="secondary">Recommandé</Badge>
          </CardTitle>
          <CardDescription>
            Usage régulier avec quota mensuel
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-green-600" />
              <span>Rapports inclus dans l'abonnement</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-green-600" />
              <span>Accès à toutes les analyses</span>
            </div>
            <div className="flex items-center gap-2">
              <Crown className="h-4 w-4 text-green-600" />
              <span>Meilleur prix par rapport</span>
            </div>
          </div>
          <Button className="w-full">
            Choisir un abonnement
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            À partir de 29€/mois • 5 rapports inclus
          </p>
        </CardContent>
      </Card>

      <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={onCreditsMode}>
        <CardHeader className="text-center">
          <Coins className="h-12 w-12 mx-auto text-orange-600 mb-4" />
          <CardTitle>Achat à la carte</CardTitle>
          <CardDescription>
            Flexibilité maximale, payez à l'usage
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-orange-600" />
              <span>Aucun engagement mensuel</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-orange-600" />
              <span>Payez uniquement ce que vous utilisez</span>
            </div>
            <div className="flex items-center gap-2">
              <Coins className="h-4 w-4 text-orange-600" />
              <span>Crédits valables 12 mois</span>
            </div>
          </div>
          <Button variant="outline" className="w-full border-orange-200 hover:bg-orange-50">
            Acheter des crédits
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            À partir de 79€ • 100 crédits • ~5 rapports
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
