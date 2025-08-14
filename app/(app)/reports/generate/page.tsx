// Page génération de rapports - fonctionnelle
import { getUser } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ReportGeneratorForm } from "@/components/reports/report-generator-form";
import { getUserCreditsInfo } from "@/lib/credits";
import { Badge } from "@/components/ui/badge";
import { Coins, FileText, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default async function GenerateReportPage() {
  const user = await getUser();
  
  if (!user) {
    redirect("/auth");
  }

  // Récupérer les informations utilisateur complètes
  const [userInfo, creditsInfo] = await Promise.all([
    prisma.user.findUnique({
      where: { id: user.id },
      include: {
        subscription: true,
        reports: {
          where: { status: "PROCESSING" },
          take: 5
        }
      }
    }),
    getUserCreditsInfo(user.id)
  ]);

  if (!userInfo) {
    redirect("/auth");
  }

  const hasLowCredits = creditsInfo.balance < 40; // Moins de 2 rapports possibles
  const processingReports = userInfo.reports;

  return (
    <div className="container mx-auto max-w-4xl py-8 px-4">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <FileText className="h-8 w-8" />
            Générer un rapport
          </h1>
          <p className="text-muted-foreground mt-2">
            Créez des analyses financières détaillées avec notre IA spécialisée.
          </p>
        </div>

        {/* Statut crédits */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Coins className="h-5 w-5" />
              Statut des crédits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{creditsInfo.balance}</div>
                <p className="text-sm text-muted-foreground">Crédits disponibles</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{creditsInfo.monthlyCredits}</div>
                <p className="text-sm text-muted-foreground">Crédits mensuels</p>
              </div>
              <div className="text-center">
                <Badge variant={creditsInfo.isActiveSubscription ? "default" : "secondary"}>
                  {creditsInfo.plan}
                </Badge>
                <p className="text-sm text-muted-foreground mt-1">Plan actuel</p>
              </div>
            </div>

            {hasLowCredits && (
              <Alert className="mt-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Attention : Il vous reste moins de 40 crédits. 
                  <a href="/plan/buy-credits" className="font-medium underline ml-1">
                    Rechargez votre solde
                  </a> pour continuer à générer des rapports.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Rapports en cours */}
        {processingReports.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Rapports en cours de traitement</CardTitle>
              <CardDescription>
                {processingReports.length} rapport(s) en cours de génération
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {processingReports.map((report) => (
                  <div key={report.id} className="flex items-center justify-between p-2 border rounded">
                    <div>
                      <span className="font-medium">{report.title}</span>
                      <Badge variant="secondary" className="ml-2">
                        {report.assetSymbol}
                      </Badge>
                    </div>
                    <Badge variant="outline">En cours...</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Formulaire de génération */}
        <Card>
          <CardHeader>
            <CardTitle>Nouveau rapport</CardTitle>
            <CardDescription>
              Configurez votre analyse financière personnalisée
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ReportGeneratorForm 
              userCredits={creditsInfo.balance}
              hasApiAccess={creditsInfo.apiAccess}
            />
          </CardContent>
        </Card>

        {/* Tarification */}
        <Card>
          <CardHeader>
            <CardTitle>Tarification</CardTitle>
            <CardDescription>
              Coût en crédits des différentes options
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 border rounded">
                <div className="text-lg font-semibold">20 crédits</div>
                <p className="text-sm text-muted-foreground">Rapport de base</p>
              </div>
              <div className="text-center p-4 border rounded">
                <div className="text-lg font-semibold">+12 crédits</div>
                <p className="text-sm text-muted-foreground">Module benchmark</p>
              </div>
              <div className="text-center p-4 border rounded">
                <div className="text-lg font-semibold">+5 crédits</div>
                <p className="text-sm text-muted-foreground">Export API (CSV)</p>
              </div>
            </div>
            <div className="mt-4 text-center">
              <div className="text-xl font-bold">37 crédits maximum</div>
              <p className="text-sm text-muted-foreground">
                Pour un rapport complet avec toutes les options
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}