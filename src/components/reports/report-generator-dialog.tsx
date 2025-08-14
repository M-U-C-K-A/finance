// Composant dialog pour génération de rapports avec calcul en temps réel
"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  FileText, 
  Coins, 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp,
  BarChart3,
  Zap,
  Calculator
} from "lucide-react";
import { calculateReportCost, CREDIT_COSTS } from "@/lib/credits";
import { toast } from "sonner";

interface ReportGeneratorDialogProps {
  trigger: React.ReactNode;
  userCredits: {
    balance: number;
    apiAccess: boolean;
  };
  onReportGenerated?: (reportId: string) => void;
}

interface ReportConfig {
  title: string;
  assetType: 'ETF' | 'INDEX' | 'STOCK' | 'MARKET';
  assetSymbol: string;
  reportType: 'BASELINE' | 'DEEP_ANALYSIS' | 'PRICER' | 'BENCHMARK';
  includeBenchmark: boolean;
  includeApiExport: boolean;
}

const assetTypes = [
  { value: 'ETF', label: 'ETF', icon: '📊' },
  { value: 'INDEX', label: 'Indice', icon: '📈' },
  { value: 'STOCK', label: 'Action', icon: '💼' },
  { value: 'MARKET', label: 'Marché', icon: '🌍' }
];

const reportTypes = [
  { value: 'BASELINE', label: 'Rapport Standard', description: 'Analyse de base complète' },
  { value: 'DEEP_ANALYSIS', label: 'Analyse Approfondie', description: 'Analyse détaillée avancée' },
  { value: 'PRICER', label: 'Pricer', description: 'Évaluation et pricing' },
  { value: 'BENCHMARK', label: 'Benchmark', description: 'Comparaisons de marché' }
];

const popularSymbols = {
  ETF: ['SPY', 'QQQ', 'VTI', 'IWDA', 'VXUS'],
  INDEX: ['CAC40', 'DAX', 'FTSE100', 'NIKKEI', 'NASDAQ'],
  STOCK: ['AAPL', 'MSFT', 'GOOGL', 'TSLA', 'NVDA'],
  MARKET: ['US_MARKET', 'EU_MARKET', 'ASIA_MARKET']
};

export function ReportGeneratorDialog({ trigger, userCredits, onReportGenerated }: ReportGeneratorDialogProps) {
  const [open, setOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [config, setConfig] = useState<ReportConfig>({
    title: '',
    assetType: 'STOCK',
    assetSymbol: '',
    reportType: 'BASELINE',
    includeBenchmark: false,
    includeApiExport: false
  });

  const cost = calculateReportCost({
    includeBenchmark: config.includeBenchmark,
    includeApiExport: config.includeApiExport
  });

  const canGenerate = config.assetSymbol && config.title && userCredits.balance >= cost;
  const needsApiAccess = config.includeApiExport && !userCredits.apiAccess;

  const handleGenerateReport = async () => {
    if (!canGenerate) return;

    setIsGenerating(true);
    try {
      const response = await fetch('/api/reports/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(config)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erreur lors de la génération');
      }

      const result = await response.json();
      
      toast.success("Rapport en cours de génération", {
        description: `${cost} crédits débités. Vous serez notifié une fois terminé.`
      });
      
      setOpen(false);
      setConfig({
        title: '',
        assetType: 'STOCK',
        assetSymbol: '',
        reportType: 'BASELINE',
        includeBenchmark: false,
        includeApiExport: false
      });
      
      if (onReportGenerated) {
        onReportGenerated(result.reportId);
      }
      
    } catch (error: any) {
      toast.error("Erreur de génération", {
        description: error.message
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Générer un nouveau rapport
          </DialogTitle>
          <DialogDescription>
            Configurez votre rapport d'analyse. Le coût sera calculé en temps réel selon vos options.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Configuration de base */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Titre du rapport</Label>
                <Input
                  id="title"
                  placeholder="ex: Analyse Apple Q3 2024"
                  value={config.title}
                  onChange={(e) => setConfig(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Type d'actif</Label>
                <Select value={config.assetType} onValueChange={(value: any) => setConfig(prev => ({ ...prev, assetType: value, assetSymbol: '' }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {assetTypes.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.icon} {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Symbole</Label>
                <Input
                  placeholder="ex: AAPL, CAC40..."
                  value={config.assetSymbol}
                  onChange={(e) => setConfig(prev => ({ ...prev, assetSymbol: e.target.value.toUpperCase() }))}
                />
                <div className="flex flex-wrap gap-1 mt-2">
                  {popularSymbols[config.assetType]?.map(symbol => (
                    <Badge
                      key={symbol}
                      variant="outline"
                      className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                      onClick={() => setConfig(prev => ({ ...prev, assetSymbol: symbol }))}
                    >
                      {symbol}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Type de rapport</Label>
                <Select value={config.reportType} onValueChange={(value: any) => setConfig(prev => ({ ...prev, reportType: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {reportTypes.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        <div>
                          <div>{type.label}</div>
                          <div className="text-xs text-muted-foreground">{type.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Options avancées */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Options avancées</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="benchmark"
                  checked={config.includeBenchmark}
                  onCheckedChange={(checked) => setConfig(prev => ({ ...prev, includeBenchmark: !!checked }))}
                />
                <div className="flex-1">
                  <Label htmlFor="benchmark" className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    Module Benchmark
                    <Badge variant="outline">+{CREDIT_COSTS.BENCHMARK_MODULE} crédits</Badge>
                  </Label>
                  <p className="text-sm text-muted-foreground">Comparaisons détaillées avec indices de référence</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="api-export"
                  checked={config.includeApiExport}
                  onCheckedChange={(checked) => setConfig(prev => ({ ...prev, includeApiExport: !!checked }))}
                  disabled={!userCredits.apiAccess}
                />
                <div className="flex-1">
                  <Label htmlFor="api-export" className="flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    Export API
                    <Badge variant="outline">+{CREDIT_COSTS.API_EXPORT} crédits</Badge>
                    {!userCredits.apiAccess && <Badge variant="secondary">Abonnés uniquement</Badge>}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Données structurées accessibles via API
                    {!userCredits.apiAccess && " (nécessite un abonnement)"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Résumé et coût */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Calculator className="h-4 w-4" />
                Résumé de la commande
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Rapport {reportTypes.find(t => t.value === config.reportType)?.label}</span>
                  <span>{CREDIT_COSTS.BASELINE_REPORT} crédits</span>
                </div>
                {config.includeBenchmark && (
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>+ Module Benchmark</span>
                    <span>{CREDIT_COSTS.BENCHMARK_MODULE} crédits</span>
                  </div>
                )}
                {config.includeApiExport && (
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>+ Export API</span>
                    <span>{CREDIT_COSTS.API_EXPORT} crédits</span>
                  </div>
                )}
                <div className="border-t pt-2">
                  <div className="flex justify-between font-medium">
                    <span>Total</span>
                    <span className="flex items-center gap-1">
                      <Coins className="h-4 w-4 text-orange-600" />
                      {cost} crédits
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Vos crédits disponibles</span>
                  <span className="font-medium">{userCredits.balance} crédits</span>
                </div>
                <Progress value={(userCredits.balance / Math.max(userCredits.balance, cost)) * 100} />
                <div className="flex justify-between text-sm">
                  <span>Après génération</span>
                  <span className={userCredits.balance >= cost ? 'text-green-600' : 'text-red-600'}>
                    {userCredits.balance - cost} crédits
                  </span>
                </div>
              </div>

              {/* Alertes */}
              {needsApiAccess && (
                <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <Zap className="h-4 w-4 text-blue-600" />
                  <div className="text-sm">
                    <div className="font-medium text-blue-800">Export API indisponible</div>
                    <div className="text-blue-700">Souscrivez à un abonnement pour accéder à cette fonctionnalité</div>
                  </div>
                </div>
              )}

              {userCredits.balance < cost && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <div className="text-sm">
                    <div className="font-medium text-red-800">Crédits insuffisants</div>
                    <div className="text-red-700">Il vous manque {cost - userCredits.balance} crédits pour générer ce rapport</div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Boutons d'action */}
          <div className="flex gap-3">
            <Button
              onClick={handleGenerateReport}
              disabled={!canGenerate || isGenerating}
              className="flex-1"
              size="lg"
            >
              {isGenerating ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent mr-2" />
                  Génération...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Générer le rapport ({cost} crédits)
                </>
              )}
            </Button>
            
            {userCredits.balance < cost && (
              <Button variant="outline" asChild>
                <a href="/plan/buy-credits">
                  <Coins className="h-4 w-4 mr-2" />
                  Acheter crédits
                </a>
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}