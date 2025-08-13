// Page principale - reports/new/page.tsx
'use client';

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search, TrendingUp, Calendar, Clock } from "lucide-react";
import { AssetCard } from "@/components/reports/asset-card";
import { ReportConfigModal } from "@/components/reports/report-config-modal";

interface Asset {
  id: string;
  title: string;
  description: string;
  logo: string;
  type: 'stock' | 'etf' | 'index';
  symbol: string;
}

interface ReportConfig {
  customPricer: boolean;
  specificPricers: string[];
  analysisTypes: string[];
  benchmarks: boolean;
  apiExport: boolean;
  totalCredits?: number;
}

// Données fictives des assets
const mockAssets: Asset[] = [
  {
    id: '1',
    title: 'Apple Inc.',
    description: 'Technologie, smartphones et services numériques',
    logo: 'https://logo.clearbit.com/apple.com',
    type: 'stock',
    symbol: 'AAPL'
  },
  {
    id: '2',
    title: 'Microsoft Corporation',
    description: 'Logiciels, cloud computing et services',
    logo: 'https://logo.clearbit.com/microsoft.com',
    type: 'stock',
    symbol: 'MSFT'
  },
  {
    id: '3',
    title: 'Tesla, Inc.',
    description: 'Véhicules électriques et énergie propre',
    logo: 'https://logo.clearbit.com/tesla.com',
    type: 'stock',
    symbol: 'TSLA'
  },
  {
    id: '4',
    title: 'SPDR S&P 500 ETF',
    description: 'ETF suivant l\'indice S&P 500',
    logo: 'https://logo.clearbit.com/spdrs.com',
    type: 'etf',
    symbol: 'SPY'
  },
  {
    id: '5',
    title: 'Invesco QQQ Trust',
    description: 'ETF suivant le NASDAQ-100',
    logo: 'https://logo.clearbit.com/invesco.com',
    type: 'etf',
    symbol: 'QQQ'
  },
  {
    id: '6',
    title: 'CAC 40',
    description: 'Indice des 40 plus grandes capitalisations françaises',
    logo: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=100&h=100&fit=crop&crop=center',
    type: 'index',
    symbol: 'CAC40'
  },
  {
    id: '7',
    title: 'Alphabet Inc.',
    description: 'Moteurs de recherche, publicité en ligne et cloud',
    logo: 'https://logo.clearbit.com/google.com',
    type: 'stock',
    symbol: 'GOOGL'
  },
  {
    id: '8',
    title: 'Amazon.com Inc.',
    description: 'Commerce électronique et services cloud',
    logo: 'https://logo.clearbit.com/amazon.com',
    type: 'stock',
    symbol: 'AMZN'
  },
  {
    id: '9',
    title: 'NVIDIA Corporation',
    description: 'Semi-conducteurs et intelligence artificielle',
    logo: 'https://logo.clearbit.com/nvidia.com',
    type: 'stock',
    symbol: 'NVDA'
  },
  {
    id: '10',
    title: 'Vanguard Total Stock Market ETF',
    description: 'ETF diversifié sur l\'ensemble du marché US',
    logo: 'https://logo.clearbit.com/vanguard.com',
    type: 'etf',
    symbol: 'VTI'
  },
  {
    id: '11',
    title: 'Meta Platforms Inc.',
    description: 'Réseaux sociaux et métavers',
    logo: 'https://logo.clearbit.com/meta.com',
    type: 'stock',
    symbol: 'META'
  },
  {
    id: '12',
    title: 'NASDAQ Composite',
    description: 'Indice composite du marché NASDAQ',
    logo: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=100&h=100&fit=crop&crop=center',
    type: 'index',
    symbol: 'IXIC'
  }
];

export default function NewReportPage() {
  const [activeTab, setActiveTab] = useState<'daily' | 'weekly' | 'monthly'>('monthly');
  const [searchTerm, setSearchTerm] = useState('');
  const [enabledAssets, setEnabledAssets] = useState<Record<string, boolean>>({});
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  
  // Simulation du plan utilisateur (à remplacer par les vraies données)
  const userPlan = 'credits'; // ou 'starter', 'professional', 'enterprise'

  const filteredAssets = mockAssets.filter(asset =>
    asset.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asset.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asset.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleAsset = (assetId: string, enabled: boolean) => {
    setEnabledAssets(prev => ({
      ...prev,
      [assetId]: enabled
    }));
  };

  const handleConfigureAsset = (asset: Asset) => {
    setSelectedAsset(asset);
    setIsConfigModalOpen(true);
  };

  const handleGenerateReport = (config: ReportConfig) => {
    console.log('Generating report with config:', {
      asset: selectedAsset,
      frequency: activeTab,
      config
    });
    // Ici vous ajouteriez la logique pour générer le rapport
  };

  const getTabIcon = (tab: string) => {
    switch (tab) {
      case 'daily': return Clock;
      case 'weekly': return Calendar;
      case 'monthly': return TrendingUp;
      default: return Calendar;
    }
  };

  const getTabLabel = (tab: string) => {
    switch (tab) {
      case 'daily': return 'Quotidien';
      case 'weekly': return 'Hebdomadaire';
      case 'monthly': return 'Mensuel';
      default: return tab;
    }
  };

  return (
    <div className="space-y-6 p-8">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold">Nouveau rapport d'analyse</h1>
        <p className="text-muted-foreground">
          Sélectionnez les actifs pour lesquels vous souhaitez générer des rapports d'analyse financière.
        </p>
      </div>

      {/* Barre de recherche */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Rechercher par nom, symbole ou description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Onglets de fréquence */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'daily' | 'weekly' | 'monthly')}>
        <TabsList className="grid w-full grid-cols-3">
          {['daily', 'weekly', 'monthly'].map((tab) => {
            const Icon = getTabIcon(tab);
            return (
              <TabsTrigger key={tab} value={tab} className="flex items-center gap-2">
                <Icon className="h-4 w-4" />
                {getTabLabel(tab)}
              </TabsTrigger>
            );
          })}
        </TabsList>

        {['daily', 'weekly', 'monthly'].map((frequency) => (
          <TabsContent key={frequency} value={frequency} className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredAssets.map((asset) => (
                <AssetCard
                  key={`${asset.id}-${frequency}`}
                  asset={asset}
                  frequency={frequency as 'daily' | 'weekly' | 'monthly'}
                  isEnabled={enabledAssets[`${asset.id}-${frequency}`] || false}
                  onToggle={(assetId, enabled) => handleToggleAsset(`${assetId}-${frequency}`, enabled)}
                  onConfigure={handleConfigureAsset}
                />
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Modal de configuration */}
      <ReportConfigModal
        asset={selectedAsset}
        frequency={activeTab}
        isOpen={isConfigModalOpen}
        onClose={() => {
          setIsConfigModalOpen(false);
          setSelectedAsset(null);
        }}
        onGenerate={handleGenerateReport}
        userPlan={userPlan}
      />
    </div>
  );
}
