
// components/reports/asset-card.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

interface Asset {
  id: string;
  title: string;
  description: string;
  logo: string;
  type: 'stock' | 'etf' | 'index';
  symbol: string;
}

interface AssetCardProps {
  asset: Asset;
  frequency: 'daily' | 'weekly' | 'monthly';
  isEnabled: boolean;
  onToggle: (assetId: string, enabled: boolean) => void;
  onConfigure: (asset: Asset) => void;
}

export function AssetCard({ asset, frequency, isEnabled, onToggle, onConfigure }: AssetCardProps) {
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'stock': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'etf': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'index': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  const getFrequencyLabel = () => {
    switch (frequency) {
      case 'daily': return 'Quotidien';
      case 'weekly': return 'Hebdomadaire';
      case 'monthly': return 'Mensuel';
    }
  };

  return (
    <Card 
      className={`cursor-pointer transition-all hover:shadow-md ${
        isEnabled ? 'ring-2 ring-primary/50' : ''
      }`}
      onClick={() => onConfigure(asset)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <img 
              src={asset.logo} 
              alt={asset.title}
              className="w-10 h-10 rounded-lg object-contain bg-white dark:bg-gray-800 p-1 border dark:border-gray-700"
            />
            <div>
              <CardTitle className="text-lg">{asset.title}</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge className={getTypeColor(asset.type)} variant="secondary">
                  {asset.type.toUpperCase()}
                </Badge>
                <span className="text-sm text-muted-foreground">{asset.symbol}</span>
              </div>
            </div>
          </div>
          <Switch
            checked={isEnabled}
            onCheckedChange={(checked) => {
              onToggle(asset.id, checked);
              // Empêcher la propagation pour éviter d'ouvrir la modal
              event?.stopPropagation();
            }}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className="mb-3">
          {asset.description}
        </CardDescription>
        <div className="flex items-center justify-between">
          <Badge variant="outline">
            Rapport {getFrequencyLabel()}
          </Badge>
          <span className="text-sm text-primary font-medium">
            Configurer →
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

