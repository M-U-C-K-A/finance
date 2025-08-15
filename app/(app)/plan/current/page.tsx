// Page plan actuel selon AGENT.md - plan/current
"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Calendar,
  CreditCard,
  Coins,
  Zap,
  ArrowRight,
  AlertCircle,
  CheckCircle
} from "lucide-react";

// Données mockées basées sur AGENT.md
const mockPlanData = {
  user: {
    plan: "PROFESSIONAL", // FREE, STARTER, PROFESSIONAL, ENTERPRISE
    isActive: true,
    apiAccess: true,
    renewsAt: "2024-09-15T00:00:00Z",
    startedAt: "2024-08-15T00:00:00Z"
  },
  credits: {
    balance: 287,
    monthlyCredits: 500,
    lastRecharge: "2024-08-15T00:00:00Z",
    usedThisMonth: 213
  }
};

const planDetails = {
  FREE: { name: "Free", price: 0, credits: 0, features: [] },
  STARTER: { 
    name: "Starter", 
    price: 29, 
    credits: 100, 
    features: ["100 crédits/mois", "Charts & export PDF", "Mises à jour mensuelles", "SAV Standard"] 
  },
  PROFESSIONAL: { 
    name: "Professional", 
    price: 99, 
    credits: 500, 
    features: ["500 crédits/mois", "CSV & API access", "Alertes hebdo", "Benchmarks avancés", "SAV Prioritaire"] 
  },
  ENTERPRISE: { 
    name: "Enterprise", 
    price: 299, 
    credits: 2000, 
    features: ["2000 crédits/mois", "SSO, SLA, auditing", "Team workspaces", "API + SAV VIP 24/7"] 
  }
};

export default function CurrentPlanPage() {
  const { user, credits } = mockPlanData;
  const currentPlan = planDetails[user.plan as keyof typeof planDetails];
  const usagePercent = credits.monthlyCredits > 0 ? Math.round((credits.usedThisMonth / credits.monthlyCredits) * 100) : 0;
  const daysUntilRenewal = Math.ceil((new Date(user.renewsAt).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="space-y-6 p-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Mon Plan</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Gérez votre abonnement, suivez votre consommation de crédits et votre facturation.
        </p>
      </div>

      {/* Plan actuel */}
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-6 w-6" />
                Plan {currentPlan.name}
                {user.isActive && (
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Actif
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>
                {user.plan === "FREE" ? "Plan gratuit" : `${currentPlan.price}€/mois • Renouvelé le ${new Date(user.renewsAt).toLocaleDateString("fr-FR")}`}
              </CardDescription>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{currentPlan.price}€</div>
              <div className="text-sm text-muted-foreground">par mois</div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Accès API */}
          {user.plan !== "FREE" && (
            <div className="flex items-center gap-2 bg-blue-50 text-blue-700 p-3 rounded-lg">
              <Zap className="h-5 w-5" />
              <span className="font-medium">Accès API activé</span>
              <span className="text-sm">• Intégration programmatique disponible</span>
            </div>
          )}

          {/* Utilisation des crédits */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Coins className="h-5 w-5" />
                Crédits ce mois
              </h3>
              <div className="text-right">
                <div className="text-lg font-bold">{credits.balance} restants</div>
                <div className="text-sm text-muted-foreground">sur {credits.monthlyCredits} mensuels</div>
              </div>
            </div>
            
            <Progress value={usagePercent} className="h-3" />
            
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-xl font-bold text-green-600">{credits.monthlyCredits - credits.usedThisMonth}</div>
                <div className="text-sm text-muted-foreground">Disponibles</div>
              </div>
              <div>
                <div className="text-xl font-bold text-orange-600">{credits.usedThisMonth}</div>
                <div className="text-sm text-muted-foreground">Utilisés</div>
              </div>
              <div>
                <div className="text-xl font-bold">{credits.monthlyCredits}</div>
                <div className="text-sm text-muted-foreground">Total mensuel</div>
              </div>
            </div>
          </div>

          {/* Renouvellement */}
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-4 w-4" />
              <span className="font-medium">Prochain renouvellement</span>
            </div>
            <div className="text-sm text-muted-foreground">
              Dans {daysUntilRenewal} jours • {new Date(user.renewsAt).toLocaleDateString("fr-FR", { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
          </div>

          {/* Fonctionnalités */}
          <div>
            <h4 className="font-medium mb-3">Fonctionnalités incluses</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {currentPlan.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button asChild className="flex-1">
              <a href="/plan/upgrade">
                <ArrowRight className="h-4 w-4 mr-2" />
                Mettre à niveau
              </a>
            </Button>
            <Button variant="outline" asChild>
              <a href="/plan/buy-credits">
                <Coins className="h-4 w-4 mr-2" />
                Acheter crédits
              </a>
            </Button>
            <Button variant="outline" asChild>
              <a href="/plan/billing">
                <CreditCard className="h-4 w-4 mr-2" />
                Facturation
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Alertes crédits faibles */}
      {usagePercent > 80 && (
        <Card className="max-w-4xl mx-auto border-orange-200 bg-orange-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-orange-600" />
              <div>
                <div className="font-medium text-orange-800">Crédits bientôt épuisés</div>
                <div className="text-sm text-orange-700">
                  Il vous reste {credits.balance} crédits sur {credits.monthlyCredits}. 
                  Considérez un plan supérieur ou l'achat de crédits supplémentaires.
                </div>
              </div>
              <Button size="sm" className="ml-auto" asChild>
                <a href="/plan/upgrade">Voir les options</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}