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
import { Loader2, FileText, Coins, AlertTriangle, CheckCircle, Building2, TrendingUp, DollarSign } from "lucide-react";
import { calculateReportCost } from "@/lib/credits";
import { toast } from "sonner";

interface ReportGeneratorFormProps {
  userCredits: number;
  hasApiAccess: boolean;
}

// Popular assets with company logos
const POPULAR_ASSETS = [
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    type: "STOCK",
    logo: "https://logo.clearbit.com/apple.com",
    description: "Technology, smartphones and digital services"
  },
  {
    symbol: "MSFT",
    name: "Microsoft Corporation",
    type: "STOCK",
    logo: "https://logo.clearbit.com/microsoft.com",
    description: "Technology, software and cloud services"
  },
  {
    symbol: "GOOGL",
    name: "Alphabet Inc.",
    type: "STOCK",
    logo: "https://logo.clearbit.com/google.com",
    description: "Search engine, advertising and technology"
  },
  {
    symbol: "TSLA",
    name: "Tesla Inc.",
    type: "STOCK",
    logo: "https://logo.clearbit.com/tesla.com",
    description: "Electric vehicles and clean energy"
  },
  {
    symbol: "META",
    name: "Meta Platforms",
    type: "STOCK",
    logo: "https://logo.clearbit.com/facebook.com",
    description: "Social media and metaverse technology"
  },
  {
    symbol: "AMZN",
    name: "Amazon.com Inc.",
    type: "STOCK",
    logo: "https://logo.clearbit.com/amazon.com",
    description: "E-commerce, cloud computing and AI"
  },
  {
    symbol: "SPY",
    name: "SPDR S&P 500 ETF",
    type: "ETF",
    logo: "https://logo.clearbit.com/spdrs.com",
    description: "S&P 500 tracking ETF"
  },
  {
    symbol: "CAC40",
    name: "CAC 40 Index",
    type: "INDEX",
    logo: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiByeD0iOCIgZmlsbD0iIzAwMzg3NSIvPgo8cGF0aCBkPSJNMTYgMjRIMjRWNDBIMTZWMjRaIiBmaWxsPSIjRkZGRkZGIi8+CjxwYXRoIGQ9Ik0yOCAyMEgzNlYzMkgyOFYyMFoiIGZpbGw9IiNGRkZGRkYiLz4KPHA9CjxwYXRoIGQ9Ik00MCAyOEg0OFY0MEg0MFYyOFoiIGZpbGw9IiNGRkZGRkYiLz4KPC9zdmc+",
    description: "French stock market index"
  }
];

export function ReportGeneratorForm({ userCredits, hasApiAccess }: ReportGeneratorFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<typeof POPULAR_ASSETS[0] | null>(null);
  const [customAsset, setCustomAsset] = useState({ symbol: "", type: "" });
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    reportType: "BASELINE",
    includeBenchmark: false,
    includeApiExport: false,
    pricerDCF: false,
    pricerMultiples: false,
    pricerComparable: false,
    pricerMonteCarlo: false
  });

  // Calcul du coût en temps réel
  const creditsCost = calculateReportCost({
    includeBenchmark: formData.includeBenchmark,
    includeApiExport: formData.includeApiExport && hasApiAccess
  });

  const canAfford = userCredits >= creditsCost;
  const assetSelected = selectedAsset || (customAsset.symbol && customAsset.type);
  const canGenerateReport = formData.title && assetSelected && canAfford;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!canGenerateReport) {
      toast.error("Please fill in all fields and check your credit balance");
      return;
    }

    const finalAsset = selectedAsset || { symbol: customAsset.symbol, type: customAsset.type };

    setIsLoading(true);

    try {
      const response = await fetch("/api/reports/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.title,
          assetType: finalAsset.type,
          assetSymbol: finalAsset.symbol.toUpperCase(),
          reportType: formData.reportType,
          includeBenchmark: formData.includeBenchmark,
          includeApiExport: formData.includeApiExport && hasApiAccess,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("Report queued for generation!");
        // Reset form
        setFormData({
          title: "",
          reportType: "BASELINE",
          includeBenchmark: false,
          includeApiExport: false,
          pricerDCF: false,
          pricerMultiples: false,
          pricerComparable: false,
          pricerMonteCarlo: false
        });
        setSelectedAsset(null);
        setCustomAsset({ symbol: "", type: "" });
        setShowCustomInput(false);
        // Redirect to history
        setTimeout(() => {
          window.location.href = "/reports/history";
        }, 1500);
      } else {
        if (response.status === 402) {
          toast.error("Insufficient credits to generate this report");
        } else {
          toast.error(result.message || "Error generating report");
        }
      }
    } catch {
      toast.error("Connection error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Asset Selection */}
      <div className="space-y-4">
        <div>
          <Label className="text-base font-medium">Select Asset *</Label>
          <p className="text-sm text-muted-foreground">Choose from popular assets or enter a custom symbol</p>
        </div>
        
        {/* Popular Assets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {POPULAR_ASSETS.map((asset) => {
            const Icon = asset.icon;
            const isSelected = selectedAsset?.symbol === asset.symbol;
            
            return (
              <Card 
                key={asset.symbol}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  isSelected ? 'ring-2 ring-primary bg-primary/5' : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
                onClick={() => {
                  setSelectedAsset(asset);
                  setShowCustomInput(false);
                  setFormData({ ...formData, title: `${asset.name} Analysis` });
                }}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      <img 
                        src={asset.logo} 
                        alt={`${asset.name} logo`}
                        className="h-8 w-8 rounded object-contain"
                        onError={(e) => {
                          // Fallback to icon if logo fails to load
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling.style.display = 'block';
                        }}
                      />
                      <Building2 className="h-8 w-8 text-primary" style={{display: 'none'}} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm">{asset.symbol}</span>
                        <Badge variant="outline" className="text-xs">{asset.type}</Badge>
                      </div>
                      <p className="font-medium text-sm text-gray-900 truncate">{asset.name}</p>
                      <p className="text-xs text-muted-foreground">{asset.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
        
        {/* Custom Asset Option */}
        <Card 
          className={`cursor-pointer transition-all hover:shadow-md ${
            showCustomInput ? 'ring-2 ring-primary bg-primary/5' : 'hover:bg-gray-50 dark:hover:bg-gray-800'
          }`}
          onClick={() => {
            setShowCustomInput(true);
            setSelectedAsset(null);
          }}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                <FileText className="h-8 w-8 text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm">Custom Asset</p>
                <p className="text-xs text-muted-foreground">Enter your own symbol and type</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Custom Asset Inputs */}
        {showCustomInput && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <div className="space-y-2">
              <Label htmlFor="customSymbol">Asset Symbol *</Label>
              <Input
                id="customSymbol"
                value={customAsset.symbol}
                onChange={(e) => setCustomAsset({ ...customAsset, symbol: e.target.value.toUpperCase() })}
                placeholder="e.g., NVDA, QQQ, FTSE"
                required={showCustomInput}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="customType">Asset Type *</Label>
              <Select
                value={customAsset.type}
                onValueChange={(value) => setCustomAsset({ ...customAsset, type: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="STOCK">Stock</SelectItem>
                  <SelectItem value="ETF">ETF</SelectItem>
                  <SelectItem value="INDEX">Index</SelectItem>
                  <SelectItem value="MARKET">Market</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </div>
      
      {/* Report Title */}
      <div className="space-y-2">
        <Label htmlFor="title">Report Title *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="e.g., Q4 2024 Analysis - Apple Inc."
          required
        />
      </div>

      {/* Report Type - Enhanced */}
      <div className="space-y-4">
        <div>
          <Label className="text-base font-medium">Analysis Type *</Label>
          <p className="text-sm text-muted-foreground">Choose the depth and type of analysis you need</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card 
            className={`cursor-pointer transition-all hover:shadow-md ${
              formData.reportType === "BASELINE" ? 'ring-2 ring-primary bg-primary/5' : 'hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
            onClick={() => setFormData({ ...formData, reportType: "BASELINE" })}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold">Basic Report</h4>
                  <p className="text-sm text-muted-foreground">Standard financial analysis</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card 
            className={`cursor-pointer transition-all hover:shadow-md ${
              formData.reportType === "DEEP_ANALYSIS" ? 'ring-2 ring-primary bg-primary/5' : 'hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
            onClick={() => setFormData({ ...formData, reportType: "DEEP_ANALYSIS" })}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-semibold">Deep Analysis</h4>
                  <p className="text-sm text-muted-foreground">Comprehensive analysis with trends</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card 
            className={`cursor-pointer transition-all hover:shadow-md ${
              formData.reportType === "BENCHMARK" ? 'ring-2 ring-primary bg-primary/5' : 'hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
            onClick={() => setFormData({ ...formData, reportType: "BENCHMARK" })}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-semibold">Benchmark</h4>
                  <p className="text-sm text-muted-foreground">Comparison with market indices</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card 
            className={`cursor-pointer transition-all hover:shadow-md ${
              formData.reportType === "PRICER" ? 'ring-2 ring-primary bg-primary/5' : 'hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
            onClick={() => setFormData({ ...formData, reportType: "PRICER" })}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <h4 className="font-semibold">Pricer Analysis</h4>
                  <p className="text-sm text-muted-foreground">Valuation and pricing models</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Enhanced Pricer Options */}
        {formData.reportType === "PRICER" && (
          <Card className="bg-orange-50 border-orange-200">
            <CardContent className="p-4">
              <h5 className="font-semibold mb-3 text-orange-800">Pricer Analysis Options</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="dcf"
                    checked={formData.pricerDCF || false}
                    onCheckedChange={(checked) => 
                      setFormData({ ...formData, pricerDCF: checked as boolean })
                    }
                  />
                  <Label htmlFor="dcf" className="text-sm">DCF Model</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="multiples"
                    checked={formData.pricerMultiples || false}
                    onCheckedChange={(checked) => 
                      setFormData({ ...formData, pricerMultiples: checked as boolean })
                    }
                  />
                  <Label htmlFor="multiples" className="text-sm">Trading Multiples</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="comparable"
                    checked={formData.pricerComparable || false}
                    onCheckedChange={(checked) => 
                      setFormData({ ...formData, pricerComparable: checked as boolean })
                    }
                  />
                  <Label htmlFor="comparable" className="text-sm">Comparable Analysis</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="montecarlo"
                    checked={formData.pricerMonteCarlo || false}
                    onCheckedChange={(checked) => 
                      setFormData({ ...formData, pricerMonteCarlo: checked as boolean })
                    }
                  />
                  <Label htmlFor="montecarlo" className="text-sm">Monte Carlo Simulation</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Options */}
      <div className="space-y-4">
        <h3 className="font-medium">Additional Options</h3>
        
        <div className="flex items-center space-x-2">
          <Checkbox
            id="includeBenchmark"
            checked={formData.includeBenchmark}
            onCheckedChange={(checked) => 
              setFormData({ ...formData, includeBenchmark: checked as boolean })
            }
          />
          <Label htmlFor="includeBenchmark" className="flex items-center gap-2">
            Include benchmark module
            <Badge variant="outline">+12 credits</Badge>
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
            <Badge variant="outline">+5 credits</Badge>
            {!hasApiAccess && (
              <Badge variant="destructive">Subscription required</Badge>
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
              <span className="font-medium">Total cost:</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={canAfford ? "default" : "destructive"}>
                {creditsCost} credits
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
                Insufficient credits. You have {userCredits} credits, 
                but {creditsCost} are required.
                <a href="/plan/buy-credits" className="font-medium underline ml-1">
                  Recharge balance
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
            Generating...
          </>
        ) : (
          <>
            <FileText className="h-4 w-4 mr-2" />
            Generate Report ({creditsCost} credits)
          </>
        )}
      </Button>

      <p className="text-sm text-muted-foreground text-center">
        Generation may take 3 to 10 minutes. You will be notified once completed.
      </p>
    </form>
  );
}
