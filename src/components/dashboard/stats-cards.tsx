// components/dashboard/stats-cards.tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  CreditCard,
  BarChart3,
  CheckCircle2,
  Calendar
} from "lucide-react";

interface Subscription {
  plan: 'free' | 'basic' | 'premium' | 'enterprise';
  reportsUsed: number;
  reportsLimit: number;
  renewsAt: string;
  isActive: boolean;
}

interface StatsCardsProps {
  subscription: Subscription;
  completedReports: number;
}

const getPlanColor = (plan: string) => {
  switch (plan) {
    case 'free': return 'bg-gray-100 text-gray-800';
    case 'basic': return 'bg-blue-100 text-blue-800';
    case 'premium': return 'bg-purple-100 text-purple-800';
    case 'enterprise': return 'bg-gold-100 text-gold-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getPlanLabel = (plan: string) => {
  switch (plan) {
    case 'free': return 'Gratuit';
    case 'basic': return 'Basique';
    case 'premium': return 'Premium';
    case 'enterprise': return 'Entreprise';
    default: return plan;
  }
};

export function StatsCards({ subscription, completedReports }: StatsCardsProps) {
  const usagePercentage = (subscription.reportsUsed / subscription.reportsLimit) * 100;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Abonnement</CardTitle>
          <CreditCard className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{getPlanLabel(subscription.plan)}</div>
          <Badge className={getPlanColor(subscription.plan)} variant="secondary">
            {subscription.isActive ? 'Actif' : 'Inactif'}
          </Badge>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Rapports utilisés</CardTitle>
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{subscription.reportsUsed}/{subscription.reportsLimit}</div>
          <Progress
            value={usagePercentage}
            className="mt-2"
            aria-label="Utilisation des rapports"
          />
          <p className="text-xs text-muted-foreground mt-1">
            {Math.round(usagePercentage)}% utilisé ce mois
          </p>
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
          <div className="text-2xl font-bold">
            {new Date(subscription.renewsAt).getDate()} Sept
          </div>
          <p className="text-xs text-muted-foreground">Prochain paiement</p>
        </CardContent>
      </Card>
    </div>
  );
}
