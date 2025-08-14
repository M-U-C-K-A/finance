// Page principale - dashboard/page.tsx
import { getUser } from "@/lib/auth-server";
import { Card, CardContent } from "@/components/ui/card";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { MarketOverview } from "@/components/dashboard/market-overview";
import { ReportsTable } from "@/components/dashboard/reports-table";
import { QuickActions } from "@/components/dashboard/quick-actions";

// Types et données fictives
interface Report {
  id: string;
  title: string;
  type: 'monthly' | 'weekly' | 'daily';
  status: 'completed' | 'processing' | 'pending' | 'error';
  createdAt: string;
  completedAt?: string;
  downloadUrl?: string;
  symbol: string;
  market: string;
}


interface MarketData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  lastUpdate: string;
}

const mockReports: Report[] = [
  {
    id: '1',
    title: 'Analyse Mensuelle - Apple Inc.',
    type: 'monthly',
    status: 'completed',
    createdAt: '2024-08-10T10:00:00Z',
    completedAt: '2024-08-10T10:15:00Z',
    downloadUrl: '/reports/apple-monthly-aug2024.pdf',
    symbol: 'AAPL',
    market: 'NASDAQ'
  },
  {
    id: '2',
    title: 'Rapport Hebdomadaire - CAC 40',
    type: 'weekly',
    status: 'processing',
    createdAt: '2024-08-13T08:30:00Z',
    symbol: 'CAC40',
    market: 'Euronext Paris'
  },
  {
    id: '3',
    title: 'Analyse Quotidienne - Tesla',
    type: 'daily',
    status: 'completed',
    createdAt: '2024-08-12T16:00:00Z',
    completedAt: '2024-08-12T16:05:00Z',
    downloadUrl: '/reports/tesla-daily-aug12.pdf',
    symbol: 'TSLA',
    market: 'NASDAQ'
  },
  {
    id: '4',
    title: 'Rapport Mensuel - Microsoft',
    type: 'monthly',
    status: 'error',
    createdAt: '2024-08-09T14:20:00Z',
    symbol: 'MSFT',
    market: 'NASDAQ'
  },
  {
    id: '5',
    title: 'Analyse Hebdo - S&P 500',
    type: 'weekly',
    status: 'pending',
    createdAt: '2024-08-13T09:45:00Z',
    symbol: 'SPX',
    market: 'NYSE'
  }
];

const mockCreditsInfo = {
  balance: 287,
  monthlyCredits: 500,
  lastRecharge: new Date('2024-08-15T00:00:00Z'),
  plan: 'PROFESSIONAL' as const,
  apiAccess: true,
  isActiveSubscription: true,
  renewsAt: new Date('2024-09-15T00:00:00Z')
};

const mockMarketData: MarketData[] = [
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    price: 225.77,
    change: 2.34,
    changePercent: 1.05,
    lastUpdate: '2024-08-13T16:00:00Z'
  },
  {
    symbol: 'TSLA',
    name: 'Tesla Inc.',
    price: 248.50,
    change: -5.23,
    changePercent: -2.06,
    lastUpdate: '2024-08-13T16:00:00Z'
  },
  {
    symbol: 'MSFT',
    name: 'Microsoft Corp.',
    price: 425.61,
    change: 8.94,
    changePercent: 2.15,
    lastUpdate: '2024-08-13T16:00:00Z'
  }
];

export default async function Dashboard() {
  const user = await getUser();

  if (!user) {
    return (
      <div className="flex items-center justify-center h-full">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">
              Veuillez vous connecter pour accéder au dashboard.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const completedReports = mockReports.filter(r => r.status === 'completed').length;

  return (
    <div className="space-y-8 p-8">
      <DashboardHeader user={user} />
      <StatsCards creditsInfo={mockCreditsInfo} completedReports={completedReports} />
      <MarketOverview marketData={mockMarketData} />
      <ReportsTable reports={mockReports} />
      <QuickActions creditsInfo={mockCreditsInfo} />
    </div>
  );
}
