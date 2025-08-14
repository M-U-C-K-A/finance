"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Bell, 
  Mail, 
  Smartphone,
  TrendingUp,
  FileText,
  CreditCard,
  Shield
} from "lucide-react";
import { toast } from "sonner";

interface NotificationsSectionProps {
  user: any;
}

export function NotificationsSection({ user }: NotificationsSectionProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState({
    // Notifications par email
    reportCompleted: true,
    reportFailed: true,
    creditsLow: true,
    monthlyRecharge: false,
    billingUpdates: true,
    securityAlerts: true,
    
    // Notifications push (future)
    pushEnabled: false,
    
    // Marketing
    productUpdates: false,
    marketingEmails: false,
  });

  const handleToggle = (key: keyof typeof settings) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // TODO: Implémenter l'API de sauvegarde des préférences de notifications
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulation
      toast.success("Préférences de notification mises à jour");
    } catch (error) {
      toast.error("Erreur lors de la sauvegarde");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Notifications par email */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Notifications par email
          </CardTitle>
          <CardDescription>
            Recevez des alertes importantes par email à {user.email}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <Label htmlFor="report-completed">Rapports terminés</Label>
                </div>
                <p className="text-sm text-muted-foreground">
                  Notification quand un rapport est prêt au téléchargement
                </p>
              </div>
              <Switch
                id="report-completed"
                checked={settings.reportCompleted}
                onCheckedChange={() => handleToggle('reportCompleted')}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  <Label htmlFor="report-failed">Échecs de génération</Label>
                </div>
                <p className="text-sm text-muted-foreground">
                  Alerte en cas d'erreur lors de la génération
                </p>
              </div>
              <Switch
                id="report-failed"
                checked={settings.reportFailed}
                onCheckedChange={() => handleToggle('reportFailed')}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  <Label htmlFor="credits-low">Crédits faibles</Label>
                </div>
                <p className="text-sm text-muted-foreground">
                  Alerte quand il reste moins de 20 crédits
                </p>
              </div>
              <Switch
                id="credits-low"
                checked={settings.creditsLow}
                onCheckedChange={() => handleToggle('creditsLow')}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  <Label htmlFor="monthly-recharge">Recharge mensuelle</Label>
                </div>
                <p className="text-sm text-muted-foreground">
                  Notification lors de la recharge automatique des crédits
                </p>
              </div>
              <Switch
                id="monthly-recharge"
                checked={settings.monthlyRecharge}
                onCheckedChange={() => handleToggle('monthlyRecharge')}
              />
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h4 className="font-medium">Administratif</h4>
            
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="billing-updates">Mises à jour de facturation</Label>
                <p className="text-sm text-muted-foreground">
                  Factures, changements de plan, problèmes de paiement
                </p>
              </div>
              <Switch
                id="billing-updates"
                checked={settings.billingUpdates}
                onCheckedChange={() => handleToggle('billingUpdates')}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="security-alerts">Alertes de sécurité</Label>
                <p className="text-sm text-muted-foreground">
                  Connexions suspectes, changements de mot de passe
                </p>
              </div>
              <Switch
                id="security-alerts"
                checked={settings.securityAlerts}
                onCheckedChange={() => handleToggle('securityAlerts')}
                disabled // Toujours activé pour la sécurité
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notifications push (future) */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            Notifications push
          </CardTitle>
          <CardDescription>
            Notifications instantanées sur vos appareils (bientôt disponible)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between opacity-50">
            <div className="space-y-1">
              <Label>Activer les notifications push</Label>
              <p className="text-sm text-muted-foreground">
                Recevez des notifications instantanées sur vos appareils
              </p>
            </div>
            <Switch disabled />
          </div>
        </CardContent>
      </Card>

      {/* Marketing et produit */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Communications marketing
          </CardTitle>
          <CardDescription>
            Nouvelles fonctionnalités et offres spéciales
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="product-updates">Mises à jour produit</Label>
              <p className="text-sm text-muted-foreground">
                Nouvelles fonctionnalités et améliorations
              </p>
            </div>
            <Switch
              id="product-updates"
              checked={settings.productUpdates}
              onCheckedChange={() => handleToggle('productUpdates')}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="marketing-emails">Offres et promotions</Label>
              <p className="text-sm text-muted-foreground">
                Offres spéciales et contenus marketing
              </p>
            </div>
            <Switch
              id="marketing-emails"
              checked={settings.marketingEmails}
              onCheckedChange={() => handleToggle('marketingEmails')}
            />
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isLoading}>
          {isLoading ? "Enregistrement..." : "Enregistrer les préférences"}
        </Button>
      </div>
    </div>
  );
}