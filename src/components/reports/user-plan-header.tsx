// components/reports/user-plan-header.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Crown, 
  Coins, 
  Calendar,
  AlertTriangle,
  ArrowRight 
} from "lucide-react";

interface UserPlan {
  type: 'subscription' | 'credits' | 'free';
  plan?: 'starter' | 'professional' | 'enterprise';
  reportsUsed?: number;
  reportsLimit?: number;
  creditsBalance?: number;
  renewsAt?: string;
}

interface UserPlanHeaderProps {
  userPlan: UserPlan;
  onUpgrade: () => void;
  onBuyCredits: () => void;
}

export function UserPlanHeader({ userPlan, onUpgrade, onBuyCredits }: UserPlanHeaderProps) {
  if (userPlan.type === 'subscription') {
    const usage = userPlan.reportsUsed || 0;
    const limit = userPlan.reportsLimit || 0;
    const percentage = limit > 0 ? (usage / limit) * 100 : 0;

    return (
      <Card className="mb-6 border-2 border-primary/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Crown className="h-6 w-6 text-primary" />
              <div>
                <CardTitle className="flex items-center gap-2">
                  Plan {userPlan.plan?.charAt(0).toUpperCase() + userPlan.plan?.slice(1)}
                  <Badge variant="secondary">Abonnement actif</Badge>
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Rapports inclus dans votre abonnement mensuel
                </p>
              </div>
            </div>
            <Button variant="outline" onClick={onUpgrade}>
              <ArrowRight className="h-4 w-4 mr-2" />
              Upgrader
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>Rapports utilisés ce mois</span>
              <span className="font-medium">{usage}/{limit}</span>
            </div>
            <Progress value={percentage} className="h-2" />
            {percentage > 80 && (
              <div className="flex items-center gap-2 text-sm text-amber-600">
                <AlertTriangle className="h-4 w-4" />
                Vous approchez de votre limite mensuelle
              </div>
            )}
            <div className="flex items-center justify-between pt-2">
              <span className="text-sm text-muted-foreground">
                Renouvellement : {userPlan.renewsAt && new Date(userPlan.renewsAt).toLocaleDateString('fr-FR')}
              </span>
              <Button variant="link" className="h-auto p-0 text-sm" onClick={onBuyCredits}>
                Besoin de plus ? Acheter des crédits →
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (userPlan.type === 'credits') {
    return (
      <Card className="mb-6 border-2 border-orange-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Coins className="h-6 w-6 text-orange-600" />
              <div>
                <CardTitle className="flex items-center gap-2">
                  Mode Crédits
                  <Badge variant="outline" className="bg-orange-50 text-orange-700">
                    Pay-per-report
                  </Badge>
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Payez uniquement pour les rapports que vous générez
                </p>
              </div>
            </div>
            <Button onClick={onBuyCredits}>
              <Coins className="h-4 w-4 mr-2" />
              Acheter des crédits
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-orange-600">
                {userPlan.creditsBalance || 0} crédits
              </div>
              <p className="text-sm text-muted-foreground">Solde disponible</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground mb-1">Prix indicatif</div>
              <div className="text-sm">Rapport standard : ~20 crédits</div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Free plan
  return (
    <Card className="mb-6 border-2 border-gray-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Compte gratuit</CardTitle>
            <p className="text-sm text-muted-foreground">
              Choisissez un plan pour commencer à générer des rapports
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onBuyCredits}>
              <Coins className="h-4 w-4 mr-2" />
              Acheter des crédits
            </Button>
            <Button onClick={onUpgrade}>
              <Calendar className="h-4 w-4 mr-2" />
              S'abonner
            </Button>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}

