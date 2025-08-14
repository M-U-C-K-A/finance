
// 5. Page achat ponctuel - reports/purchase/page.tsx
'use client';

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { 
  ShoppingCart,
  Coins,
  CreditCard,
  Calculator,
  Search
} from "lucide-react";


const mockAssets: Asset[] = [
  {
    id: '1',
    symbol: 'AAPL',
    name: 'Apple Inc.',
    description: 'Technologie, smartphones et services numériques',
    logo: 'https://logo.clearbit.com/apple.com',
    type: 'stock',
    market: 'NASDAQ'
  },
  {
    id: '2',
    symbol: 'TSLA',
    name: 'Tesla Inc.',
    description: 'Véhicules électriques et énergie propre',
    logo: 'https://logo.clearbit.com/tesla.com',
    type: 'stock',
    market: 'NASDAQ'
  },
  {
	id: '3',
	symbol: 'MSFT',
	name: 'Microsoft Corporation',
	description: 'Technologie, logiciels et services',
	logo: 'https://logo.clearbit.com/microsoft.com',
	type: 'stock',
	market: 'NASDAQ'
  },
  {
	id: '4',
	symbol: 'GOOGL',
	name: 'Alphabet Inc.',
	description: 'Technologie, services et contenu',
	logo: 'https://logo.clearbit.com/google.com',
	type: 'stock',
	market: 'NASDAQ'
  },
  {
	id: '5',
	symbol: 'META',
	name: 'Meta Platforms, Inc.',
	description: 'Technologie, services et contenu',
	logo: 'https://logo.clearbit.com/facebook.com',
	type: 'stock',
	market: 'NASDAQ'
  },
  {
	id: '6',
	symbol: 'AMZN',
	name: 'Amazon.com, Inc.',
	description: 'Technologie, services et contenu',
	logo: 'https://logo.clearbit.com/amazon.com',
	type: 'stock',
	market: 'NASDAQ'
  },
  {
	id: '7',
	symbol: 'AAPL',
	name: 'Apple Inc.',
	description: 'Technologie, smartphones et services numériques',
	logo: 'https://logo.clearbit.com/apple.com',
	type: 'stock',
	market: 'NASDAQ'
  },
  {
	id: '8',
	symbol: 'TSLA',
	name: 'Tesla Inc.',
	description: 'Véhicules électriques et énergie propre',
	logo: 'https://logo.clearbit.com/tesla.com',
	type: 'stock',
	market: 'NASDAQ'
  },
  {
    id: '9',
    symbol: 'SPY',
    name: 'SPDR S&P 500 ETF',
    description: 'Exchange-traded fund tracking the S&P 500',
    logo: 'https://logo.clearbit.com/spdrs.com',
    type: 'etf',
    market: 'NYSE Arca'
  },
  {
	id: '10',
	symbol: 'DIA',
	name: 'Dow Jones Industrial Average',
	description: 'Index tracking the Dow Jones Industrial Average',
	logo: 'https://logo.clearbit.com/dowjones.com',
	type: 'index',
	market: 'NYSE Arca'
  },
  {
	id: '11',
	symbol: 'NDX',
	name: 'Nasdaq Composite',
	description: 'Index tracking the Nasdaq Composite',
	logo: 'https://logo.clearbit.com/nasdaq.com',
	type: 'index',
	market: 'NYSE Arca'
  },
  {
	id: '12',
	symbol: 'IXIC',
	name: 'NASDAQ Composite',
	description: 'Index tracking the Nasdaq Composite',
	logo: 'https://logo.clearbit.com/nasdaq.com',
	type: 'index',
	market: 'NYSE Arca'
  }
];

export default function PurchaseReportPage() {
  const [selectedAssets, setSelectedAssets] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const creditPrices = {
    basic: 20,
    advanced: 35,
    premium: 50
  };

  const calculateTotal = () => {
    return selectedAssets.length * creditPrices.basic;
  };

  return (
    <div className="space-y-6 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Purchase Reports</h1>
          <p className="text-muted-foreground">
            Buy individual reports with credits - no subscription needed
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-orange-600">45 credits</div>
          <p className="text-sm text-muted-foreground">Available balance</p>
        </div>
      </div>

      {/* Pricing info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Pricing Guide
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold">{creditPrices.basic}</div>
              <p className="text-sm text-muted-foreground">Basic Analysis</p>
              <p className="text-xs">Standard metrics & charts</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold">{creditPrices.advanced}</div>
              <p className="text-sm text-muted-foreground">Advanced Analysis</p>
              <p className="text-xs">+ Risk metrics & comparisons</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold">{creditPrices.premium}</div>
              <p className="text-sm text-muted-foreground">Premium Analysis</p>
              <p className="text-xs">+ AI insights & forecasts</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Asset selection */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Select Reports to Purchase</CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search assets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockAssets.slice(0, 4).map((asset) => (
              <Card 
                key={asset.id} 
                className={`cursor-pointer transition-all ${
                  selectedAssets.includes(asset.id) ? 'ring-2 ring-primary' : 'hover:shadow-md'
                }`}
                onClick={() => {
                  setSelectedAssets(prev => 
                    prev.includes(asset.id) 
                      ? prev.filter(id => id !== asset.id)
                      : [...prev, asset.id]
                  );
                }}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <img 
                        src={asset.logo} 
                        alt={asset.name}
                        className="w-10 h-10 rounded"
                      />
                      <div>
                        <div className="font-semibold">{asset.symbol}</div>
                        <div className="text-sm text-muted-foreground">{asset.name}</div>
                      </div>
                    </div>
                    {selectedAssets.includes(asset.id) && (
                      <Badge>Selected</Badge>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">{asset.type.toUpperCase()}</Badge>
                    <span className="font-bold text-orange-600">{creditPrices.basic} credits</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Cart/Checkout */}
      {selectedAssets.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Purchase Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>{selectedAssets.length} report(s) selected</span>
                <span>{calculateTotal()} credits</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold">
                <span>Total Cost</span>
                <span className="text-orange-600">{calculateTotal()} credits</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Remaining balance after purchase</span>
                <span>{45 - calculateTotal()} credits</span>
              </div>
              <Button className="w-full" size="lg" disabled={calculateTotal() > 45}>
                <CreditCard className="h-4 w-4 mr-2" />
                Purchase Reports ({calculateTotal()} credits)
              </Button>
              {calculateTotal() > 45 && (
                <p className="text-sm text-destructive text-center">
                  Insufficient credits. <Button variant="link" className="p-0 h-auto">Buy more credits</Button>
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
