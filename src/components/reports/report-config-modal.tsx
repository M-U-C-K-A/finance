// components/reports/report-config-modal.tsx
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle 
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Settings, 
  DollarSign, 
  TrendingUp, 
  BarChart3, 
  PieChart,
  Activity,
  Target,
  Zap
} from "lucide-react";

interface Asset {
  id: string;
  title: string;
  description: string;
  logo: string;
  type: 'stock' | 'etf' | 'index';
  symbol: string;
}

interface ReportConfigModalProps {
  asset: Asset | null;
  frequency: 'daily' | 'weekly' | 'monthly';
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (config: ReportConfig) => void;
  userPlan: 'starter' | 'professional' | 'enterprise' | 'credits';
}

interface ReportConfig {
  customPricer: boolean;
  specificPricers: string[];
  analysisTypes: string[];
  benchmarks: boolean;
  apiExport: boolean;
  totalCredits?: number;
}

const analysisOptions = [
  { id: 'technical', label: 'Analyse technique', icon: TrendingUp, credits: 5 },
  { id: 'fundamental', label: 'Analyse fondamentale', icon: BarChart3, credits: 8 },
  { id: 'sentiment', label: 'Analyse sentiment', icon: Activity, credits: 6 },
  { id: 'risk', label: 'Analyse des risques', icon: Target, credits: 7 },
  { id: 'volatility', label: 'Analyse volatilité', icon: Zap, credits: 4 },
];

const pricerOptions = [
  'Bloomberg Terminal',
  'Refinitiv Eikon', 
  'Yahoo Finance',
  'Alpha Vantage',
  'Quandl',
  'IEX Cloud'
];

export function ReportConfigModal({ 
  asset, 
  frequency, 
  isOpen, 
  onClose, 
  onGenerate, 
  userPlan 
}: ReportConfigModalProps) {
  const [config, setConfig] = useState<ReportConfig>({
    customPricer: false,
    specificPricers: [],
    analysisTypes: ['technical'],
    benchmarks: false,
    apiExport: false,
    totalCredits: 0
  });

  const baseCredits = frequency === 'daily' ? 15 : frequency === 'weekly' ? 18 : 20;
  
  const calculateTotalCredits = () => {
    let total = baseCredits;
    
    // Coût des analyses sélectionnées
    config.analysisTypes.forEach(type => {
      const analysis = analysisOptions.find(a => a.id === type);
      if (analysis) total += analysis.credits;
    });
    
    // Coûts additionnels
    if (config.customPricer) total += 8;
    if (config.specificPricers.length > 0) total += config.specificPricers.length * 3;
    if (config.benchmarks) total += 12;
    if (config.apiExport) total += 5;
    
    return total;
  };

  const totalCredits = calculateTotalCredits();

  const handleGenerate = () => {
    onGenerate({ ...config, totalCredits });
    onClose();
  };

  if (!asset) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <img src={asset.logo} alt={asset.title} className="w-8 h-8" />
            Configuration du rapport - {asset.title}
          </DialogTitle>
          <DialogDescription>
            Rapport {frequency === 'daily' ? 'quotidien' : frequency === 'weekly' ? 'hebdomadaire' : 'mensuel'} 
            • {asset.symbol} • {asset.type.toUpperCase()}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Résumé des coûts */}
          <Card className="border-2 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Résumé des coûts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <span>Coût total estimé :</span>
                <Badge variant="secondary" className="text-lg font-bold">
                  {userPlan === 'credits' ? `${totalCredits} crédits` : 'Inclus dans l\'abonnement'}
                </Badge>
              </div>
              {userPlan === 'credits' && (
                <p className="text-sm text-muted-foreground mt-2">
                  Rapport de base : {baseCredits} crédits • Options : {totalCredits - baseCredits} crédits
                </p>
              )}
            </CardContent>
          </Card>

          {/* Types d'analyses */}
          <div className="space-y-3">
            <Label className="text-base font-semibold flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Types d'analyses incluses
            </Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {analysisOptions.map((analysis) => (
                <Card key={analysis.id} className="cursor-pointer hover:bg-muted/50">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id={analysis.id}
                        checked={config.analysisTypes.includes(analysis.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setConfig(prev => ({
                              ...prev,
                              analysisTypes: [...prev.analysisTypes, analysis.id]
                            }));
                          } else {
                            setConfig(prev => ({
                              ...prev,
                              analysisTypes: prev.analysisTypes.filter(t => t !== analysis.id)
                            }));
                          }
                        }}
                      />
                      <analysis.icon className="h-4 w-4" />
                      <div className="flex-1">
                        <Label htmlFor={analysis.id} className="cursor-pointer">
                          {analysis.label}
                        </Label>
                        {userPlan === 'credits' && (
                          <Badge variant="outline" className="ml-2">
                            +{analysis.credits} crédits
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <Separator />

          {/* Options de pricing */}
          <div className="space-y-4">
            <Label className="text-base font-semibold flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Options de pricing
            </Label>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="custom-pricer">Utiliser notre pricer personnalisé</Label>
                  <p className="text-sm text-muted-foreground">
                    Algorithme propriétaire pour une valorisation précise
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {userPlan === 'credits' && (
                    <Badge variant="outline">+8 crédits</Badge>
                  )}
                  <Switch
                    id="custom-pricer"
                    checked={config.customPricer}
                    onCheckedChange={(checked) => 
                      setConfig(prev => ({ ...prev, customPricer: checked }))
                    }
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label>Sources de données spécifiques</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {pricerOptions.map((pricer) => (
                    <div key={pricer} className="flex items-center space-x-2">
                      <Checkbox
                        id={pricer}
                        checked={config.specificPricers.includes(pricer)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setConfig(prev => ({
                              ...prev,
                              specificPricers: [...prev.specificPricers, pricer]
                            }));
                          } else {
                            setConfig(prev => ({
                              ...prev,
                              specificPricers: prev.specificPricers.filter(p => p !== pricer)
                            }));
                          }
                        }}
                      />
                      <Label htmlFor={pricer} className="text-sm">
                        {pricer}
                        {userPlan === 'credits' && (
                          <Badge variant="outline" className="ml-2 text-xs">
                            +3 crédits
                          </Badge>
                        )}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Options avancées */}
          <div className="space-y-4">
            <Label className="text-base font-semibold">Options avancées</Label>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="benchmarks">Comparaisons avec benchmarks</Label>
                  <p className="text-sm text-muted-foreground">
                    Comparer avec les indices sectoriels et de marché
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {userPlan === 'credits' && (
                    <Badge variant="outline">+12 crédits</Badge>
                  )}
                  <Switch
                    id="benchmarks"
                    checked={config.benchmarks}
                    onCheckedChange={(checked) => 
                      setConfig(prev => ({ ...prev, benchmarks: checked }))
                    }
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="api-export">Export API / CSV</Label>
                  <p className="text-sm text-muted-foreground">
                    Accès aux données brutes via API
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {userPlan === 'credits' && (
                    <Badge variant="outline">+5 crédits</Badge>
                  )}
                  <Switch
                    id="api-export"
                    checked={config.apiExport}
                    onCheckedChange={(checked) => 
                      setConfig(prev => ({ ...prev, apiExport: checked }))
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button onClick={handleGenerate}>
            Générer le rapport 
            {userPlan === 'credits' && ` (${totalCredits} crédits)`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
