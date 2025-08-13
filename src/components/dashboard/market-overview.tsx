
// components/dashboard/market-overview.tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { DollarSign, TrendingUp, TrendingDown } from "lucide-react";

interface MarketData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  lastUpdate: string;
}

interface MarketOverviewProps {
  marketData: MarketData[];
}

export function MarketOverview({ marketData }: MarketOverviewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Aperçu du marché
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {marketData.map((stock) => (
            <div key={stock.symbol} className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <div className="font-semibold">{stock.symbol}</div>
                <div className="text-sm text-muted-foreground">{stock.name}</div>
              </div>
              <div className="text-right">
                <div className="font-bold">${stock.price}</div>
                <div className={`text-sm flex items-center gap-1 ${
                  stock.change >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stock.change >= 0 ? 
                    <TrendingUp className="h-3 w-3" /> : 
                    <TrendingDown className="h-3 w-3" />
                  }
                  {stock.change >= 0 ? '+' : ''}{stock.changePercent}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

