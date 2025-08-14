// components/dashboard/stats-cards.tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  CreditCard,
  Coins,
  CheckCircle2,
  Calendar,
  Zap
} from "lucide-react";

interface UserCreditsInfo {
  balance: number;
  monthlyCredits: number;
  lastRecharge?: Date | null;
  plan: 'FREE' | 'STARTER' | 'PROFESSIONAL' | 'ENTERPRISE';
  apiAccess: boolean;
  isActiveSubscription: boolean;
  renewsAt?: Date | null;
}

interface StatsCardsProps {
  creditsInfo: UserCreditsInfo;
  completedReports: number;
}

const getPlanColor = (plan: string) => {
  switch (plan) {
    case 'FREE': return 'bg-gray-100 text-gray-800';
    case 'STARTER': return 'bg-blue-100 text-blue-800';
    case 'PROFESSIONAL': return 'bg-purple-100 text-purple-800';
    case 'ENTERPRISE': return 'bg-amber-100 text-amber-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getPlanLabel = (plan: string) => {
  switch (plan) {
    case 'FREE': return 'Gratuit';
    case 'STARTER': return 'Starter';
    case 'PROFESSIONAL': return 'Professional';
    case 'ENTERPRISE': return 'Enterprise';
    default: return plan;
  }
};

export function StatsCards({ creditsInfo, completedReports }: StatsCardsProps) {
  const usedCredits = creditsInfo.monthlyCredits - creditsInfo.balance;
  const usagePercentage = creditsInfo.monthlyCredits > 0 ? (usedCredits / creditsInfo.monthlyCredits) * 100 : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Plan</CardTitle>
          <CreditCard className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{getPlanLabel(creditsInfo.plan)}</div>
          <div className="flex items-center gap-2 mt-1">
            <Badge className={getPlanColor(creditsInfo.plan)} variant="secondary">
              {creditsInfo.isActiveSubscription ? 'Actif' : 'Inactif'}
            </Badge>
            {creditsInfo.apiAccess && (
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                <Zap className="h-3 w-3 mr-1" />
                API
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Crédits</CardTitle>
          <Coins className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{creditsInfo.balance}</div>
          <div className="text-sm text-muted-foreground">
            {creditsInfo.monthlyCredits > 0 ? `sur ${creditsInfo.monthlyCredits} mensuels` : 'crédits disponibles'}
          </div>
          {creditsInfo.monthlyCredits > 0 && (
            <Progress
              value={usagePercentage}
              className="mt-2"
              aria-label="Utilisation des crédits"
            />
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Rapports terminés</CardTitle>
          <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{completedReports}</div>
          <p className="text-xs text-muted-foreground">Ce mois-ci</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Renouvellement</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {creditsInfo.renewsAt ? (
            <div className="text-2xl font-bold">
              {new Date(creditsInfo.renewsAt).getDate()} {new Date(creditsInfo.renewsAt).toLocaleString('fr-FR', { month: 'short' })}
            </div>
          ) : (
            <div className="text-2xl font-bold">-</div>
          )}
          <p className="text-xs text-muted-foreground">
            {creditsInfo.renewsAt ? 'Prochain paiement' : 'Aucun abonnement'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
