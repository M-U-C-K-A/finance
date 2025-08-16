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
import { Loader2, FileText, Coins, AlertTriangle, CheckCircle, TrendingUp, DollarSign } from "lucide-react";
import { toast } from "sonner";

interface ReportGeneratorFormProps {
  userCredits: number;
  hasApiAccess: boolean;
}

// Categories d'assets avec plus d'options
const ASSET_CATEGORIES = {
  "US_TECH": {
    label: "🇺🇸 US Tech Giants",
    assets: [
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
        symbol: "AMZN",
        name: "Amazon.com Inc.",
        type: "STOCK",
        logo: "https://logo.clearbit.com/amazon.com",
        description: "E-commerce, cloud computing and AI"
      },
      {
        symbol: "META",
        name: "Meta Platforms",
        type: "STOCK",
        logo: "https://logo.clearbit.com/facebook.com",
        description: "Social media and metaverse technology"
      },
      {
        symbol: "NVDA",
        name: "NVIDIA Corporation",
        type: "STOCK",
        logo: "https://logo.clearbit.com/nvidia.com",
        description: "AI chips, graphics cards and data centers"
      },
      {
        symbol: "TSLA",
        name: "Tesla Inc.",
        type: "STOCK",
        logo: "https://logo.clearbit.com/tesla.com",
        description: "Electric vehicles and clean energy"
      },
      {
        symbol: "NFLX",
        name: "Netflix Inc.",
        type: "STOCK",
        logo: "https://logo.clearbit.com/netflix.com",
        description: "Streaming entertainment and content"
      },
      {
        symbol: "ADBE",
        name: "Adobe Inc.",
        type: "STOCK",
        logo: "https://logo.clearbit.com/adobe.com",
        description: "Creative software and digital marketing"
      },
      {
        symbol: "CRM",
        name: "Salesforce Inc.",
        type: "STOCK",
        logo: "https://logo.clearbit.com/salesforce.com",
        description: "Customer relationship management cloud"
      },
      {
        symbol: "ORCL",
        name: "Oracle Corporation",
        type: "STOCK",
        logo: "https://logo.clearbit.com/oracle.com",
        description: "Enterprise database and cloud computing"
      },
      {
        symbol: "INTC",
        name: "Intel Corporation",
        type: "STOCK",
        logo: "https://logo.clearbit.com/intel.com",
        description: "Semiconductor chips and processors"
      },
      {
        symbol: "AMD",
        name: "Advanced Micro Devices",
        type: "STOCK",
        logo: "https://logo.clearbit.com/amd.com",
        description: "Computer processors and graphics cards"
      }
    ]
  },
  "US_STOCKS": {
    label: "🇺🇸 Major US Stocks",
    assets: [
      {
        symbol: "BRK-B",
        name: "Berkshire Hathaway",
        type: "STOCK",
        logo: "https://logo.clearbit.com/berkshirehathaway.com",
        description: "Warren Buffett's investment conglomerate"
      },
      {
        symbol: "JPM",
        name: "JPMorgan Chase",
        type: "STOCK",
        logo: "https://logo.clearbit.com/jpmorgan.com",
        description: "Investment banking and financial services"
      },
      {
        symbol: "JNJ",
        name: "Johnson & Johnson",
        type: "STOCK",
        logo: "https://logo.clearbit.com/jnj.com",
        description: "Pharmaceuticals and medical devices"
      },
      {
        symbol: "V",
        name: "Visa Inc.",
        type: "STOCK",
        logo: "https://logo.clearbit.com/visa.com",
        description: "Global payments technology"
      },
      {
        symbol: "PG",
        name: "Procter & Gamble",
        type: "STOCK",
        logo: "https://logo.clearbit.com/pg.com",
        description: "Consumer goods and household products"
      },
      {
        symbol: "HD",
        name: "Home Depot",
        type: "STOCK",
        logo: "https://logo.clearbit.com/homedepot.com",
        description: "Home improvement and construction retail"
      },
      {
        symbol: "MA",
        name: "Mastercard Inc.",
        type: "STOCK",
        logo: "https://logo.clearbit.com/mastercard.com",
        description: "Payment processing technology"
      },
      {
        symbol: "BAC",
        name: "Bank of America",
        type: "STOCK",
        logo: "https://logo.clearbit.com/bankofamerica.com",
        description: "Commercial banking and financial services"
      },
      {
        symbol: "WMT",
        name: "Walmart Inc.",
        type: "STOCK",
        logo: "https://logo.clearbit.com/walmart.com",
        description: "Retail and consumer goods"
      },
      {
        symbol: "UNH",
        name: "UnitedHealth Group",
        type: "STOCK",
        logo: "https://logo.clearbit.com/unitedhealthgroup.com",
        description: "Healthcare insurance and services"
      },
      {
        symbol: "DIS",
        name: "Walt Disney Company",
        type: "STOCK",
        logo: "https://logo.clearbit.com/disney.com",
        description: "Entertainment and media conglomerate"
      },
      {
        symbol: "KO",
        name: "Coca-Cola Company",
        type: "STOCK",
        logo: "https://logo.clearbit.com/coca-cola.com",
        description: "Beverages and soft drinks"
      }
    ]
  },
  "CRYPTO": {
    label: "₿ Cryptocurrency",
    assets: [
      {
        symbol: "BTC-USD",
        name: "Bitcoin",
        type: "CRYPTO",
        logo: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiByeD0iMzIiIGZpbGw9IiNGN0E2MDAiLz4KPHA+PHBhdGggZD0iTTMyIDQ4QzQxLjMyOTQgNDggNDguOTgxIDQwLjMzNzMgNDguOTgxIDMxQzQ4Ljk4MSAyMS42NjI3IDQxLjMyOTQgMTQgMzIgMTRDMjIuNjcwNiAxNCA5MTUuMDE5IDIxLjY2MjcgMTUuMDE5IDMxQzE1LjAxOSA0MC4zMzczIDIyLjY3MDYgNDggMzIgNDhaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4=",
        description: "Leading cryptocurrency and store of value"
      },
      {
        symbol: "ETH-USD",
        name: "Ethereum",
        type: "CRYPTO",
        logo: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiByeD0iMzIiIGZpbGw9IiMzQzNDM0QiLz4KPHA+PHBhdGggZD0iTTMyIDEyTDQ1IDMwTDMyIDM4TDE5IDMwTDMyIDEyWiIgZmlsbD0id2hpdGUiLz4KPHBhdGggZD0iTTMyIDQwTDQ1IDMyTDMyIDUyTDE5IDMyTDMyIDQwWiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+",
        description: "Smart contracts and decentralized applications"
      },
      {
        symbol: "COIN",
        name: "Coinbase Global",
        type: "STOCK",
        logo: "https://logo.clearbit.com/coinbase.com",
        description: "Cryptocurrency exchange platform"
      },
      {
        symbol: "SQ",
        name: "Block Inc. (Square)",
        type: "STOCK",
        logo: "https://logo.clearbit.com/squareup.com",
        description: "Digital payments and financial services"
      },
      {
        symbol: "PYPL",
        name: "PayPal Holdings",
        type: "STOCK",
        logo: "https://logo.clearbit.com/paypal.com",
        description: "Digital payments and money transfers"
      },
      {
        symbol: "ADA-USD",
        name: "Cardano",
        type: "CRYPTO",
        logo: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiByeD0iMzIiIGZpbGw9IiMwMDMzQUQiLz4KPHA+PHBhdGggZD0iTTMyIDQ4QzQxLjMyOTQgNDggNDguOTgxIDQwLjMzNzMgNDguOTgxIDMxQzQ4Ljk4MSAyMS42NjI3IDQxLjMyOTQgMTQgMzIgMTRDMjIuNjcwNiAxNCA5MTUuMDE5IDIxLjY2MjcgMTUuMDE5IDMxQzE1LjAxOSA0MC4zMzczIDIyLjY3MDYgNDggMzIgNDhaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4=",
        description: "Proof-of-stake blockchain platform"
      },
      {
        symbol: "SOL-USD",
        name: "Solana",
        type: "CRYPTO",
        logo: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiByeD0iMzIiIGZpbGw9IiM5OTQ1RkYiLz4KPHA+PHBhdGggZD0iTTMyIDQ4QzQxLjMyOTQgNDggNDguOTgxIDQwLjMzNzMgNDguOTgxIDMxQzQ4Ljk4MSAyMS42NjI3IDQxLjMyOTQgMTQgMzIgMTRDMjIuNjcwNiAxNCA5MTUuMDE5IDIxLjY2MjcgMTUuMDE5IDMxQzE1LjAxOSA0MC4zMzczIDIyLjY3MDYgNDggMzIgNDhaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4=",
        description: "High-performance blockchain platform"
      },
      {
        symbol: "MSTR",
        name: "MicroStrategy",
        type: "STOCK",
        logo: "https://logo.clearbit.com/microstrategy.com",
        description: "Business intelligence and Bitcoin treasury"
      }
    ]
  },
  "ETFS": {
    label: "📊 ETFs",
    assets: [
      {
        symbol: "SPY",
        name: "SPDR S&P 500 ETF",
        type: "ETF",
        logo: "https://logo.clearbit.com/spdrs.com",
        description: "S&P 500 tracking ETF"
      },
      {
        symbol: "QQQ",
        name: "Invesco QQQ ETF",
        type: "ETF",
        logo: "https://logo.clearbit.com/invesco.com",
        description: "NASDAQ-100 technology ETF"
      },
      {
        symbol: "VTI",
        name: "Vanguard Total Stock Market",
        type: "ETF",
        logo: "https://logo.clearbit.com/vanguard.com",
        description: "Total US stock market exposure"
      },
      {
        symbol: "IWM",
        name: "iShares Russell 2000 ETF",
        type: "ETF",
        logo: "https://logo.clearbit.com/ishares.com",
        description: "Small-cap US stocks ETF"
      },
      {
        symbol: "EFA",
        name: "iShares MSCI EAFE ETF",
        type: "ETF",
        logo: "https://logo.clearbit.com/ishares.com",
        description: "International developed markets"
      },
      {
        symbol: "EEM",
        name: "iShares MSCI Emerging Markets",
        type: "ETF",
        logo: "https://logo.clearbit.com/ishares.com",
        description: "Emerging markets exposure"
      },
      {
        symbol: "GLD",
        name: "SPDR Gold Trust",
        type: "ETF",
        logo: "https://logo.clearbit.com/spdrs.com",
        description: "Gold commodity exposure"
      },
      {
        symbol: "SLV",
        name: "iShares Silver Trust",
        type: "ETF",
        logo: "https://logo.clearbit.com/ishares.com",
        description: "Silver commodity exposure"
      },
      {
        symbol: "USO",
        name: "United States Oil Fund",
        type: "ETF",
        logo: "https://logo.clearbit.com/uscf.com",
        description: "Crude oil commodity exposure"
      },
      {
        symbol: "TLT",
        name: "iShares 20+ Year Treasury",
        type: "ETF",
        logo: "https://logo.clearbit.com/ishares.com",
        description: "Long-term US Treasury bonds"
      },
      {
        symbol: "HYG",
        name: "iShares High Yield Corporate",
        type: "ETF",
        logo: "https://logo.clearbit.com/ishares.com",
        description: "High-yield corporate bonds"
      }
    ]
  },
  "INDICES": {
    label: "📈 Market Indices",
    assets: [
      {
        symbol: "^GSPC",
        name: "S&P 500 Index",
        type: "INDEX",
        logo: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiByeD0iOCIgZmlsbD0iIzAwNDI5NCIvPgo8cGF0aCBkPSJNMTYgMzJMMzIgMjBMNDggMzJMMzIgNDRMMTYgMzJaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4=",
        description: "US large-cap stock market index"
      },
      {
        symbol: "^DJI",
        name: "Dow Jones Industrial",
        type: "INDEX",
        logo: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiByeD0iOCIgZmlsbD0iIzAwODAwMCIvPgo8cGF0aCBkPSJNMTYgMjhIMzJWMzZIMTZWMjhaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMzYgMjRINDhWNDBIMzZWMjRaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4=",
        description: "30 major US industrial companies"
      },
      {
        symbol: "^IXIC",
        name: "NASDAQ Composite",
        type: "INDEX",
        logo: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiByeD0iOCIgZmlsbD0iI0ZGNjAwMCIvPgo8cGF0aCBkPSJNMjAgMjBIMjhWMzJIMjBWMjBaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMzIgMTZINDBWMzZIMzJWMTZaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNNDQgMjRINTJWNDRINDRWMjRaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4=",
        description: "NASDAQ technology-heavy index"
      },
      {
        symbol: "VIX",
        name: "CBOE Volatility Index",
        type: "INDEX",
        logo: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiByeD0iOCIgZmlsbD0iI0ZGMzMzMyIvPgo8cGF0aCBkPSJNMjAgMjBIMjhWNDRIMjBWMjBaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMzYgMTZINDRWNDRIMzZWMTZaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4=",
        description: "Market fear and volatility index"
      },
      {
        symbol: "CAC40",
        name: "CAC 40 Index",
        type: "INDEX",
        logo: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiByeD0iOCIgZmlsbD0iIzAwMzg3NSIvPgo8cGF0aCBkPSJNMTYgMjRIMjRWNDBIMTZWMjRaIiBmaWxsPSIjRkZGRkZGIi8+CjxwYXRoIGQ9Ik0yOCAyMEgzNlYzMkgyOFYyMFoiIGZpbGw9IiNGRkZGRkYiLz4KPHA9CjxwYXRoIGQ9Ik00MCAyOEg0OFY0MEg0MFYyOFoiIGZpbGw9IiNGRkZGRkYiLz4KPC9zdmc+",
        description: "French stock market index (CAC 40)"
      },
      {
        symbol: "^FTSE",
        name: "FTSE 100",
        type: "INDEX",
        logo: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiByeD0iOCIgZmlsbD0iIzAwNTVBNSIvPgo8cGF0aCBkPSJNMTYgMjBIMzJWMzZIMTZWMjBaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMzYgMjhINTJWNDRIMzZWMjhaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4=",
        description: "UK leading stock market index"
      }
    ]
  },
  "EUROPEAN": {
    label: "🇪🇺 European Stocks",
    assets: [
      {
        symbol: "ASML",
        name: "ASML Holding NV",
        type: "STOCK",
        logo: "https://logo.clearbit.com/asml.com",
        description: "Semiconductor equipment manufacturer"
      },
      {
        symbol: "SAP",
        name: "SAP SE",
        type: "STOCK",
        logo: "https://logo.clearbit.com/sap.com",
        description: "Enterprise software solutions"
      },
      {
        symbol: "MC.PA",
        name: "LVMH",
        type: "STOCK",
        logo: "https://logo.clearbit.com/lvmh.com",
        description: "Luxury goods conglomerate"
      },
      {
        symbol: "NESN.SW",
        name: "Nestlé SA",
        type: "STOCK",
        logo: "https://logo.clearbit.com/nestle.com",
        description: "Food and beverages multinational"
      },
      {
        symbol: "NOVO-B.CO",
        name: "Novo Nordisk",
        type: "STOCK",
        logo: "https://logo.clearbit.com/novonordisk.com",
        description: "Pharmaceutical diabetes care"
      },
      {
        symbol: "TTE",
        name: "TotalEnergies",
        type: "STOCK",
        logo: "https://logo.clearbit.com/totalenergies.com",
        description: "Energy and oil company"
      },
      {
        symbol: "OR.PA",
        name: "L'Oréal",
        type: "STOCK",
        logo: "https://logo.clearbit.com/loreal.com",
        description: "Cosmetics and beauty products"
      }
    ]
  }
};

// Benchmarks disponibles
const AVAILABLE_BENCHMARKS = [
  { symbol: "^GSPC", name: "S&P 500", type: "Market Index" },
  { symbol: "^DJI", name: "Dow Jones", type: "Market Index" },
  { symbol: "^IXIC", name: "NASDAQ", type: "Technology Index" },
  { symbol: "QQQ", name: "QQQ ETF", type: "Tech ETF" },
  { symbol: "SPY", name: "SPY ETF", type: "Market ETF" },
  { symbol: "VTI", name: "Total Market", type: "Broad Market" },
  { symbol: "CAC40", name: "CAC 40", type: "European Index" },
  { symbol: "VIX", name: "Volatility Index", type: "Risk Indicator" }
];

export function ReportGeneratorForm({ userCredits, hasApiAccess }: ReportGeneratorFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<any>(null);
  const [customAsset, setCustomAsset] = useState({ symbol: "", type: "" });
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("US_TECH");
  const [formData, setFormData] = useState({
    title: "",
    reportType: "BASELINE",
    includeBenchmark: false,
    includeApiExport: false,
    pricerDCF: false,
    pricerMultiples: false,
    pricerComparable: false,
    pricerMonteCarlo: false,
    pricerCustom: false,
    customPricingParams: {},
    selectedCharts: [] as string[],
    benchmarkTypes: [] as string[],
    customBenchmarks: [] as string[],
    customBenchmarks: [] as string[]
  });

  // Calcul du coût en temps réel basé sur le type de rapport
  const getReportCost = () => {
    const baseCosts = {
      "BASELINE": 15,
      "DETAILED": 25,
      "DEEP_ANALYSIS": 35,
      "CUSTOM": 20,
      "PRICER": 30,
      "BENCHMARK": 20
    };
    
    let cost = baseCosts[formData.reportType as keyof typeof baseCosts] || 15;
    
    if (formData.includeBenchmark) cost += 12;
    if (formData.includeApiExport && hasApiAccess) cost += 5;
    
    return cost;
  };

  const creditsCost = getReportCost();
  const canAfford = userCredits >= creditsCost;
  const assetSelected = selectedAsset || (customAsset.symbol && customAsset.type);
  const canGenerateReport = formData.title && assetSelected && canAfford;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!canGenerateReport) {
      toast.error("Please fill in all fields and check your credit balance");
      return;
    }

    // Vérification des benchmarks si type BENCHMARK
    if (formData.reportType === "BENCHMARK" && formData.customBenchmarks.length === 0) {
      toast.error("Please select at least one benchmark for comparison");
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
          customBenchmarks: formData.customBenchmarks,
          // Paramètres de pricing
          pricingModel: formData.pricerCustom ? "CUSTOM" : 
                      formData.pricerDCF ? "BLACK_SCHOLES" :
                      formData.pricerMonteCarlo ? "MONTE_CARLO" :
                      formData.pricerMultiples ? "BINOMIAL_TREE" :
                      formData.pricerComparable ? "HESTON" : undefined,
          customPricingParams: formData.pricerCustom ? formData.customPricingParams : undefined,
          selectedCharts: formData.selectedCharts,
          benchmarkTypes: formData.benchmarkTypes,
          customBenchmarks: formData.customBenchmarks,
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
          pricerMonteCarlo: false,
          pricerCustom: false,
          customPricingParams: {},
          selectedCharts: [],
          benchmarkTypes: [],
          customBenchmarks: [],
          customBenchmarks: []
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
        
        {/* Asset Categories Selector */}
        <div className="flex flex-wrap gap-2 mb-4">
          {Object.entries(ASSET_CATEGORIES).map(([key, category]) => (
            <Button
              key={key}
              variant={selectedCategory === key ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(key)}
              className="text-sm"
              type="button"
            >
              {category.label}
            </Button>
          ))}
        </div>
        
        {/* Assets Grid with Scrollbar */}
        <div className="max-h-80 overflow-y-auto border rounded-lg p-4 bg-gray-50/50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {ASSET_CATEGORIES[selectedCategory as keyof typeof ASSET_CATEGORIES].assets.map((asset) => {
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
                  <CardContent className="p-3">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        <img 
                          src={asset.logo} 
                          alt={`${asset.name} logo`}
                          className="h-8 w-8 rounded object-contain"
                          onError={(e) => {
                            e.currentTarget.src = `data:image/svg+xml;base64,${btoa(`<svg width="32" height="32" xmlns="http://www.w3.org/2000/svg"><rect width="32" height="32" fill="#e5e7eb"/><text x="16" y="20" font-family="Arial" font-size="10" fill="#6b7280" text-anchor="middle">${asset.symbol}</text></svg>`)}`;
                          }}
                        />
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
                  <SelectItem value="CRYPTO">Crypto</SelectItem>
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
          <Label className="text-base font-medium">Report Type *</Label>
          <p className="text-sm text-muted-foreground">Choose the type and depth of analysis you need</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card 
            className={`cursor-pointer transition-colors duration-200 hover:shadow-md ${
              formData.reportType === "BASELINE" ? 'ring-2 ring-primary bg-primary/5' : 'hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
            onClick={(e) => {
              e.preventDefault();
              setFormData(prev => ({ ...prev, reportType: "BASELINE" }));
            }}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold">Rapport Baseline</h4>
                  <p className="text-sm text-muted-foreground">Analyse financière de base avec métriques essentielles</p>
                  <div className="flex gap-1 mt-1">
                    <Badge variant="outline" className="text-xs">15 crédits</Badge>
                    <Badge variant="secondary" className="text-xs">8-10 pages</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card 
            className={`cursor-pointer transition-colors duration-200 hover:shadow-md ${
              formData.reportType === "DETAILED" ? 'ring-2 ring-primary bg-primary/5' : 'hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
            onClick={(e) => {
              e.preventDefault();
              setFormData(prev => ({ ...prev, reportType: "DETAILED" }));
            }}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-purple-600 dark:text-purple-300" />
                </div>
                <div>
                  <h4 className="font-semibold">Analyse Technique Avancée</h4>
                  <p className="text-sm text-muted-foreground">Analyse technique poussée avec indicateurs complexes</p>
                  <div className="flex gap-1 mt-1">
                    <Badge variant="outline" className="text-xs">25 crédits</Badge>
                    <Badge variant="secondary" className="text-xs">15-20 pages</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card 
            className={`cursor-pointer transition-colors duration-200 hover:shadow-md ${
              formData.reportType === "BENCHMARK" ? 'ring-2 ring-primary bg-primary/5' : 'hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
            onClick={(e) => {
              e.preventDefault();
              setFormData(prev => ({ ...prev, reportType: "BENCHMARK" }));
            }}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-semibold">Analyse Comparative</h4>
                  <p className="text-sm text-muted-foreground">Comparaison détaillée avec des indices de référence</p>
                  <div className="flex gap-1 mt-1">
                    <Badge variant="outline" className="text-xs">20 crédits</Badge>
                    <Badge variant="secondary" className="text-xs">12-15 pages</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card 
            className={`cursor-pointer transition-colors duration-200 hover:shadow-md ${
              formData.reportType === "PRICER" ? 'ring-2 ring-primary bg-primary/5' : 'hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
            onClick={(e) => {
              e.preventDefault();
              setFormData(prev => ({ ...prev, reportType: "PRICER" }));
            }}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <h4 className="font-semibold">Modèle de Pricing</h4>
                  <p className="text-sm text-muted-foreground">Évaluation avancée avec modèles quantitatifs</p>
                  <div className="flex gap-1 mt-1">
                    <Badge variant="outline" className="text-xs">30 crédits</Badge>
                    <Badge variant="secondary" className="text-xs">20-25 pages</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card 
            className={`cursor-pointer transition-colors duration-200 hover:shadow-md ${
              formData.reportType === "DEEP_ANALYSIS" ? 'ring-2 ring-primary bg-primary/5' : 'hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
            onClick={(e) => {
              e.preventDefault();
              setFormData(prev => ({ ...prev, reportType: "DEEP_ANALYSIS" }));
            }}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center">
                  <FileText className="h-5 w-5 text-red-600 dark:text-red-300" />
                </div>
                <div>
                  <h4 className="font-semibold">Recherche Exhaustive</h4>
                  <p className="text-sm text-muted-foreground">Étude complète avec ESG, macro et secteur</p>
                  <div className="flex gap-1 mt-1">
                    <Badge variant="outline" className="text-xs">35 crédits</Badge>
                    <Badge variant="secondary" className="text-xs">25-30 pages</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card 
            className="opacity-60 cursor-not-allowed bg-gray-100 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600"
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                  <FileText className="h-5 w-5 text-gray-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-500 dark:text-gray-400">Rapport Personnalisé</h4>
                  <p className="text-sm text-gray-400 dark:text-gray-500">Configuration sur mesure selon vos besoins</p>
                  <div className="flex gap-1 mt-1">
                    <Badge className="text-xs bg-orange-500 text-white border-0">BIENTÔT</Badge>
                    <Badge variant="secondary" className="text-xs opacity-50">Variable</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Report Content Details */}
        <Card className="bg-gray-50 border-gray-200">
          <CardContent className="p-4">
            <h5 className="font-semibold mb-3">Contenu du rapport sélectionné</h5>
            {formData.reportType === "BASELINE" && (
              <div className="text-sm text-gray-700 space-y-2">
                <p className="font-medium">📊 Rapport Baseline - Analyse fondamentale</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Métriques financières clés (P/E, ROE, ROA, etc.)</li>
                  <li>Analyse des revenus et de la rentabilité</li>
                  <li>Positions concurrentielles et sectorielles</li>
                  <li>Recommandations d'investissement de base</li>
                </ul>
              </div>
            )}
            {formData.reportType === "DETAILED" && (
              <div className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
                <p className="font-medium">📊 Analyse Technique Avancée - Indicateurs complexes</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Tous les éléments du rapport Baseline</li>
                  <li>20+ indicateurs techniques avancés (Ichimoku, Elliott Wave, etc.)</li>
                  <li>Analyse des patterns de chandeliers japonais</li>
                  <li>Détection automatique de supports/résistances</li>
                  <li>Analyse de volume et flux financiers</li>
                  <li>Signaux d'entrée/sortie optimisés</li>
                </ul>
              </div>
            )}
            {formData.reportType === "BENCHMARK" && (
              <div className="text-sm text-gray-700 space-y-2">
                <p className="font-medium">📈 Analyse Comparative - Positionnement marché</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Comparaison avec indices de référence sélectionnés</li>
                  <li>Performance relative sur différentes périodes</li>
                  <li>Analyse de corrélation et volatilité</li>
                  <li>Score de surperformance/sous-performance</li>
                  <li>Recommandations d'allocation d'actifs</li>
                </ul>
              </div>
            )}
            {formData.reportType === "PRICER" && (
              <div className="text-sm text-gray-700 space-y-2">
                <p className="font-medium">🧮 Modèle de Pricing - Évaluation quantitative</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Modèles de valorisation avancés (DCF, Black-Scholes, etc.)</li>
                  <li>Simulations Monte Carlo pour la gestion des risques</li>
                  <li>Arbres binomiaux pour les options</li>
                  <li>Modèles de volatilité stochastique</li>
                  <li>Prix théorique et fourchettes de valorisation</li>
                  <li>Recommandations de trading algorithmique</li>
                </ul>
              </div>
            )}
            {formData.reportType === "DEEP_ANALYSIS" && (
              <div className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
                <p className="font-medium">🔬 Recherche Exhaustive - Étude complète multi-dimensionnelle</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Analyse sectorielle complète et positionnement concurrentiel</li>
                  <li>Évaluation ESG détaillée et score de durabilité</li>
                  <li>Analyse macro-économique et impact géopolitique</li>
                  <li>Modélisation de scénarios de stress-testing</li>
                  <li>Simulation Monte Carlo et tests de sensibilité</li>
                  <li>Recommandations stratégiques long terme (3-5 ans)</li>
                  <li>Intelligence artificielle pour détection de patterns</li>
                </ul>
              </div>
            )}
            {formData.reportType === "CUSTOM" && (
              <div className="text-sm text-gray-700 space-y-2">
                <p className="font-medium">⚙️ Rapport Personnalisé - Sur mesure</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Configuration modulaire selon vos besoins spécifiques</li>
                  <li>Choix des sections et profondeur d'analyse</li>
                  <li>Métriques personnalisées et KPIs sur mesure</li>
                  <li>Intégration de données propriétaires</li>
                  <li>Format et présentation adaptés</li>
                  <li>Livraison selon votre calendrier</li>
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Benchmark Selection for BENCHMARK type */}
        {formData.reportType === "BENCHMARK" && (
          <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
            <CardContent className="p-4">
              <h5 className="font-semibold mb-3 text-green-800 dark:text-green-200">Sélectionner les Indices de Comparaison</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto">
                {AVAILABLE_BENCHMARKS.map((benchmark) => (
                  <div key={benchmark.symbol} className="flex items-center space-x-2">
                    <Checkbox
                      id={`benchmark-${benchmark.symbol}`}
                      checked={formData.customBenchmarks.includes(benchmark.symbol)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setFormData({
                            ...formData,
                            customBenchmarks: [...formData.customBenchmarks, benchmark.symbol]
                          });
                        } else {
                          setFormData({
                            ...formData,
                            customBenchmarks: formData.customBenchmarks.filter(b => b !== benchmark.symbol)
                          });
                        }
                      }}
                    />
                    <Label htmlFor={`benchmark-${benchmark.symbol}`} className="text-sm flex-1">
                      <div>
                        <span className="font-medium">{benchmark.name}</span>
                        <div className="text-xs text-muted-foreground">{benchmark.type}</div>
                      </div>
                    </Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
        
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
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="custom"
                    checked={formData.pricerCustom || false}
                    onCheckedChange={(checked) => 
                      setFormData({ ...formData, pricerCustom: checked as boolean })
                    }
                  />
                  <Label htmlFor="custom" className="text-sm flex items-center gap-1">
                    Custom Model
                    <Badge variant="secondary" className="text-xs">Premium</Badge>
                  </Label>
                </div>
              </div>
              
              {/* Paramètres custom */}
              {formData.pricerCustom && (
                <div className="mt-4 p-3 bg-white rounded border">
                  <Label className="text-sm font-medium mb-2 block">Custom Pricing Parameters</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="volatility" className="text-xs">Volatility (%)</Label>
                      <Input
                        id="volatility"
                        type="number"
                        placeholder="25.5"
                        step="0.1"
                        className="text-sm"
                        onChange={(e) => 
                          setFormData({ 
                            ...formData, 
                            customPricingParams: { 
                              ...formData.customPricingParams, 
                              volatility: parseFloat(e.target.value) || 0 
                            }
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="riskFreeRate" className="text-xs">Risk-Free Rate (%)</Label>
                      <Input
                        id="riskFreeRate"
                        type="number"
                        placeholder="4.5"
                        step="0.1"
                        className="text-sm"
                        onChange={(e) => 
                          setFormData({ 
                            ...formData, 
                            customPricingParams: { 
                              ...formData.customPricingParams, 
                              riskFreeRate: parseFloat(e.target.value) || 0 
                            }
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="timeToExpiry" className="text-xs">Time to Expiry (years)</Label>
                      <Input
                        id="timeToExpiry"
                        type="number"
                        placeholder="1.0"
                        step="0.1"
                        className="text-sm"
                        onChange={(e) => 
                          setFormData({ 
                            ...formData, 
                            customPricingParams: { 
                              ...formData.customPricingParams, 
                              timeToExpiry: parseFloat(e.target.value) || 0 
                            }
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="dividendYield" className="text-xs">Dividend Yield (%)</Label>
                      <Input
                        id="dividendYield"
                        type="number"
                        placeholder="2.0"
                        step="0.1"
                        className="text-sm"
                        onChange={(e) => 
                          setFormData({ 
                            ...formData, 
                            customPricingParams: { 
                              ...formData.customPricingParams, 
                              dividendYield: parseFloat(e.target.value) || 0 
                            }
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
              )}
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