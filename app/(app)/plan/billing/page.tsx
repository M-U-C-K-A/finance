// Page facturation selon AGENT.md - plan/billing
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Download,
  CreditCard,
  Calendar,
  Receipt,
  FileText,
  AlertTriangle
} from "lucide-react";
import { toast } from "sonner";

interface BillingData {
  subscription: {
    plan: string;
    amount: number;
    nextBilling?: string;
    isActive: boolean;
    paymentMethod: string;
  } | null;
  invoices: Array<{
    id: string;
    date: string;
    amount: number;
    status: string;
    description: string;
    downloadUrl: string;
  }>;
}

export default function BillingPage() {
  const [billingData, setBillingData] = useState<BillingData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBillingData() {
      try {
        const response = await fetch('/api/user/billing');
        if (!response.ok) {
          throw new Error('Erreur lors du chargement des données');
        }
        const data = await response.json();
        setBillingData(data);
      } catch (error: any) {
        setError(error.message);
        toast.error('Impossible de charger les données de facturation');
      } finally {
        setIsLoading(false);
      }
    }

    fetchBillingData();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6 p-8">
        <div className="text-center space-y-4">
          <Skeleton className="h-8 w-64 mx-auto" />
          <Skeleton className="h-4 w-96 mx-auto" />
        </div>
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Erreur de chargement</h3>
            <p className="text-muted-foreground">{error}</p>
            <Button 
              className="mt-4" 
              onClick={() => window.location.reload()}
            >
              Réessayer
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Facturation</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Gérez vos factures, votre mode de paiement et votre historique de facturation.
        </p>
      </div>

      {/* Abonnement actuel */}
      {billingData?.subscription && (
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-6 w-6" />
              Abonnement actuel
            </CardTitle>
            <CardDescription>
              Détails de votre abonnement et prochain prélèvement
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="text-2xl font-bold">{billingData.subscription.plan}</div>
                <div className="text-sm text-muted-foreground">Plan actuel</div>
              </div>
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="text-2xl font-bold">{billingData.subscription.amount}€</div>
                <div className="text-sm text-muted-foreground">par mois</div>
              </div>
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="text-2xl font-bold">
                  {billingData.subscription.nextBilling ? 
                    new Date(billingData.subscription.nextBilling).toLocaleDateString("fr-FR") 
                    : 'N/A'}
                </div>
                <div className="text-sm text-muted-foreground">Prochain prélèvement</div>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-blue-600" />
                <span className="font-medium">Mode de paiement</span>
                <span className="text-muted-foreground">{billingData.subscription.paymentMethod}</span>
              </div>
              <Button variant="outline" size="sm">
                Modifier
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Historique des factures */}
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="h-6 w-6" />
            Historique des factures
          </CardTitle>
          <CardDescription>
            Toutes vos factures et reçus d'achat
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {billingData?.invoices.map((invoice) => (
              <div key={invoice.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">{invoice.id}</div>
                    <div className="text-sm text-muted-foreground">{invoice.description}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="font-medium">{invoice.amount}€</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(invoice.date).toLocaleDateString("fr-FR")}
                    </div>
                  </div>
                  
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    Payée
                  </Badge>
                  
                  <Button variant="outline" size="sm" asChild>
                    <a href={invoice.downloadUrl} download>
                      <Download className="h-4 w-4 mr-2" />
                      PDF
                    </a>
                  </Button>
                </div>
              </div>
            ))}
            
            {(!billingData?.invoices || billingData.invoices.length === 0) && (
              <div className="text-center py-8 text-muted-foreground">
                <Receipt className="h-8 w-8 mx-auto mb-4 opacity-50" />
                <p>Aucune facture disponible</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Informations de facturation */}
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Informations importantes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <div className="flex items-start gap-2">
            <Calendar className="h-4 w-4 mt-0.5" />
            <div>
              <strong>Facturation mensuelle :</strong> Votre abonnement est facturé le 15 de chaque mois.
            </div>
          </div>
          <div className="flex items-start gap-2">
            <CreditCard className="h-4 w-4 mt-0.5" />
            <div>
              <strong>Paiements sécurisés :</strong> Tous les paiements sont traités de manière sécurisée via Polar.
            </div>
          </div>
          <div className="flex items-start gap-2">
            <FileText className="h-4 w-4 mt-0.5" />
            <div>
              <strong>Conservation :</strong> Vos factures sont conservées et accessibles pendant 7 ans.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
