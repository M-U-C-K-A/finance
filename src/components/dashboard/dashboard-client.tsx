"use client";

import { useState, useEffect } from "react";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { MarketOverview } from "@/components/dashboard/market-overview";
import { ReportsTable } from "@/components/dashboard/reports-table";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { DashboardSkeleton } from "@/components/dashboard/dashboard-skeleton";
import { toast } from "sonner";

interface DashboardData {
  creditsInfo: {
    balance: number;
    monthlyCredits: number;
    lastRecharge: string | null;
    plan: string;
    apiAccess: boolean;
    isActiveSubscription: boolean;
    renewsAt: string | null;
  };
  reports: Array<{
    id: string;
    title: string;
    type: string;
    status: string;
    createdAt: string;
    completedAt?: string;
    downloadUrl?: string;
    symbol: string;
    market: string;
    creditsCost: number;
  }>;
  completedReports: number;
  marketData: Array<{
    symbol: string;
    name: string;
    price: number;
    change: number;
    changePercent: number;
    lastUpdate: string;
  }>;
}

interface User {
  id: string;
  name: string;
  email: string;
}

interface DashboardClientProps {
  user: User;
}

export function DashboardClient({ user }: DashboardClientProps) {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/dashboard');
      if (response.ok) {
        const dashboardData = await response.json();
        setData(dashboardData);
      } else {
        toast.error("Failed to load dashboard data");
      }
    } catch {
      toast.error("Error loading dashboard");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Failed to load dashboard data</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-8">
      <DashboardHeader user={user} />
      <StatsCards creditsInfo={data.creditsInfo} completedReports={data.completedReports} />
      <MarketOverview marketData={data.marketData} />
      <ReportsTable reports={data.reports} />
      <QuickActions creditsInfo={data.creditsInfo} />
    </div>
  );
}