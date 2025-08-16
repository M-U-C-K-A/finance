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

export const metadata = {
  title: 'Generate Report - FinAnalytics',
  description: 'Generate detailed financial analysis reports for stocks, ETFs, and market indices.',
};

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

  const hasLowCredits = creditsInfo.balance < 52; // Moins qu'un rapport complet possible
  const processingReports = userInfo.reports;

  return (
    <div className="w-full max-w-none py-8 px-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <FileText className="h-8 w-8" />
            Generate Report
          </h1>
          <p className="text-muted-foreground mt-2">
            Create detailed financial analysis with our specialized AI.
          </p>
        </div>

        {/* Statut crédits */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Coins className="h-5 w-5" />
              Credit Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{creditsInfo.balance}</div>
                <p className="text-sm text-muted-foreground">Available Credits</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{creditsInfo.monthlyCredits}</div>
                <p className="text-sm text-muted-foreground">Monthly Credits</p>
              </div>
              <div className="text-center">
                <Badge variant={creditsInfo.isActiveSubscription ? "default" : "secondary"}>
                  {creditsInfo.plan}
                </Badge>
                <p className="text-sm text-muted-foreground mt-1">Current Plan</p>
              </div>
            </div>

            {hasLowCredits && (
              <Alert className="mt-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Warning: You have less than 52 credits remaining. 
                  <a href="/plan/buy-credits" className="font-medium underline ml-1">
                    Recharge your balance
                  </a> to continue generating reports.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Rapports en cours */}
        {processingReports.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Reports in Progress</CardTitle>
              <CardDescription>
                {processingReports.length} report(s) being generated
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
                    <Badge variant="outline">Processing...</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Formulaire de génération */}
        <Card>
          <CardHeader>
            <CardTitle>New Report</CardTitle>
            <CardDescription>
              Configure your personalized financial analysis
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
            <CardTitle>Pricing</CardTitle>
            <CardDescription>
              Credit cost for different options
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 border rounded">
                <div className="text-lg font-semibold">15 crédits</div>
                <p className="text-sm text-muted-foreground">Baseline Report</p>
              </div>
              <div className="text-center p-4 border rounded">
                <div className="text-lg font-semibold">25 crédits</div>
                <p className="text-sm text-muted-foreground">Detailed Analysis</p>
              </div>
              <div className="text-center p-4 border rounded">
                <div className="text-lg font-semibold">35 crédits</div>
                <p className="text-sm text-muted-foreground">Deep Analysis</p>
              </div>
              <div className="text-center p-4 border rounded">
                <div className="text-lg font-semibold">30 crédits</div>
                <p className="text-sm text-muted-foreground">Custom Pricer</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="text-center p-4 border rounded">
                <div className="text-lg font-semibold">+12 crédits</div>
                <p className="text-sm text-muted-foreground">Benchmark Module</p>
              </div>
              <div className="text-center p-4 border rounded">
                <div className="text-lg font-semibold">+5 crédits</div>
                <p className="text-sm text-muted-foreground">API Export (CSV)</p>
              </div>
            </div>
            <div className="mt-4 text-center">
              <div className="text-xl font-bold">52 credits maximum</div>
              <p className="text-sm text-muted-foreground">
                For a deep analysis with all options
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}