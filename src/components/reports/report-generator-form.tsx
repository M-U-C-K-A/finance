"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, FileText, Coins, AlertTriangle, CheckCircle } from "lucide-react";
import { calculateReportCost } from "@/lib/credits";
import { toast } from "sonner";

interface ReportGeneratorFormProps {
  userCredits: number;
  hasApiAccess: boolean;
}

export function ReportGeneratorForm({ userCredits, hasApiAccess }: ReportGeneratorFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    assetType: "",
    assetSymbol: "",
    reportType: "BASELINE",
    includeBenchmark: false,
    includeApiExport: false
  });

  // Calcul du coût en temps réel
  const creditsCost = calculateReportCost({
    includeBenchmark: formData.includeBenchmark,
    includeApiExport: formData.includeApiExport && hasApiAccess
  });

  const canAfford = userCredits >= creditsCost;
  const canGenerateReport = formData.title && formData.assetType && formData.assetSymbol && canAfford;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!canGenerateReport) {
      toast.error("Veuillez remplir tous les champs et vérifier votre solde de crédits");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/reports/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.title,
          assetType: formData.assetType,
          assetSymbol: formData.assetSymbol.toUpperCase(),
          reportType: formData.reportType,
          includeBenchmark: formData.includeBenchmark,
          includeApiExport: formData.includeApiExport && hasApiAccess,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("Rapport mis en file de génération !");
        // Reset form
        setFormData({
          title: "",
          assetType: "",
          assetSymbol: "",
          reportType: "BASELINE",
          includeBenchmark: false,
          includeApiExport: false
        });
        // Redirection vers l'historique
        setTimeout(() => {
          window.location.href = "/reports/history";
        }, 1500);
      } else {
        if (response.status === 402) {
          toast.error("Crédits insuffisants pour générer ce rapport");
        } else {
          toast.error(result.message || "Erreur lors de la génération du rapport");
        }
      }
    } catch (error) {
      toast.error("Erreur de connexion. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Informations de base */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Titre du rapport *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="ex: Analyse Q4 2024 - Apple Inc."
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="assetSymbol">Symbole de l'actif *</Label>
          <Input
            id="assetSymbol"
            value={formData.assetSymbol}
            onChange={(e) => setFormData({ ...formData, assetSymbol: e.target.value.toUpperCase() })}
            placeholder="ex: AAPL, MSFT, CAC40"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="assetType">Type d'actif *</Label>
          <Select
            value={formData.assetType}
            onValueChange={(value) => setFormData({ ...formData, assetType: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="STOCK">Action (Stock)</SelectItem>
              <SelectItem value="ETF">ETF</SelectItem>
              <SelectItem value="INDEX">Indice</SelectItem>
              <SelectItem value="MARKET">Marché</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="reportType">Type de rapport</Label>
          <Select
            value={formData.reportType}
            onValueChange={(value) => setFormData({ ...formData, reportType: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="BASELINE">Rapport de base</SelectItem>
              <SelectItem value="DEEP_ANALYSIS">Analyse approfondie</SelectItem>
              <SelectItem value="PRICER">Pricer</SelectItem>
              <SelectItem value="BENCHMARK">Benchmark</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Options */}
      <div className="space-y-4">
        <h3 className="font-medium">Options supplémentaires</h3>
        
        <div className="flex items-center space-x-2">
          <Checkbox
            id="includeBenchmark"
            checked={formData.includeBenchmark}
            onCheckedChange={(checked) => 
              setFormData({ ...formData, includeBenchmark: checked as boolean })
            }
          />
          <Label htmlFor="includeBenchmark" className="flex items-center gap-2">
            Inclure module benchmark
            <Badge variant="outline">+12 crédits</Badge>
          </Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="includeApiExport"
            checked={formData.includeApiExport}
            onCheckedChange={(checked) => 
              setFormData({ ...formData, includeApiExport: checked as boolean })
            }
            disabled={!hasApiAccess}
          />
          <Label htmlFor="includeApiExport" className="flex items-center gap-2">
            Export API (CSV)
            <Badge variant="outline">+5 crédits</Badge>
            {!hasApiAccess && (
              <Badge variant="destructive">Abonnement requis</Badge>
            )}
          </Label>
        </div>
      </div>

      {/* Résumé des coûts */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Coins className="h-5 w-5" />
              <span className="font-medium">Coût total :</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={canAfford ? "default" : "destructive"}>
                {creditsCost} crédits
              </Badge>
              {canAfford ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <AlertTriangle className="h-4 w-4 text-red-600" />
              )}
            </div>
          </div>
          
          {!canAfford && (
            <Alert className="mt-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Crédits insuffisants. Vous avez {userCredits} crédits, 
                mais {creditsCost} sont nécessaires.
                <a href="/plan/buy-credits" className="font-medium underline ml-1">
                  Recharger le solde
                </a>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Bouton de soumission */}
      <Button
        type="submit"
        disabled={!canGenerateReport || isLoading}
        className="w-full"
        size="lg"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Génération en cours...
          </>
        ) : (
          <>
            <FileText className="h-4 w-4 mr-2" />
            Générer le rapport ({creditsCost} crédits)
          </>
        )}
      </Button>

      <p className="text-sm text-muted-foreground text-center">
        La génération peut prendre 3 à 10 minutes. Vous serez notifié une fois terminé.
      </p>
    </form>
  );
}