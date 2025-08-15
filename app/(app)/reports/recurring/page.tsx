
// 4. Page rapports récurrents - reports/recurring/page.tsx
'use client';

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Repeat,
  Calendar,
  Clock,
  TrendingUp,
  Pause,
  Play,
  Settings,
  Trash2
} from "lucide-react";

interface RecurringReport {
  id: string;
  assetId: string;
  frequency: string;
  isActive: boolean;
  assetName?: string;
  assetSymbol?: string;
  assetType?: string;
  reportType?: string;
  nextRun?: string;
  nextRunAt?: string;
  lastRun?: string;
  creditsPerRun?: number;
  totalReports?: number;
  createdAt: string;
  config?: Record<string, unknown>;
  paymentMethod?: string;
}

const mockRecurringReports: RecurringReport[] = [
  {
    id: '1',
    assetId: '1',
    frequency: 'weekly',
    isActive: true,
    nextRunAt: '2024-08-20T09:00:00Z',
    config: {},
    paymentMethod: 'subscription',
    createdAt: '2024-07-15T10:00:00Z'
  },
  {
    id: '2',
    assetId: '2',
    frequency: 'monthly',
    isActive: false,
    nextRunAt: '2024-09-01T09:00:00Z',
    config: {},
    paymentMethod: 'credits',
    createdAt: '2024-06-10T14:30:00Z'
  }
];

export default function RecurringReportsPage() {
  const [recurringReports, setRecurringReports] = useState(mockRecurringReports);

  const toggleReport = (reportId: string) => {
    setRecurringReports(prev => 
      prev.map(report => 
        report.id === reportId 
          ? { ...report, isActive: !report.isActive }
          : report
      )
    );
  };

  const getFrequencyIcon = (frequency: string) => {
    switch (frequency) {
      case 'daily': return Clock;
      case 'weekly': return Calendar;
      case 'monthly': return TrendingUp;
      default: return Calendar;
    }
  };

  return (
    <div className="space-y-6 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Recurring Reports</h1>
          <p className="text-muted-foreground">
            Manage your automated report schedules
          </p>
        </div>
        <Button>
          <Repeat className="h-4 w-4 mr-2" />
          Setup New Recurring Report
        </Button>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{recurringReports.length}</div>
            <p className="text-sm text-muted-foreground">Total Recurring</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">
              {recurringReports.filter(r => r.isActive).length}
            </div>
            <p className="text-sm text-muted-foreground">Active</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">
              {recurringReports.filter(r => !r.isActive).length}
            </div>
            <p className="text-sm text-muted-foreground">Paused</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">
              {recurringReports.filter(r => r.paymentMethod === 'subscription').length}
            </div>
            <p className="text-sm text-muted-foreground">Using Subscription</p>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Your Recurring Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Asset</TableHead>
                <TableHead>Frequency</TableHead>
                <TableHead>Payment Method</TableHead>
                <TableHead>Next Run</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recurringReports.map((report) => {
                const FrequencyIcon = getFrequencyIcon(report.frequency);
                return (
                  <TableRow key={report.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <img 
                          src={`https://logo.clearbit.com/${report.assetId === '1' ? 'apple.com' : 'tesla.com'}`}
                          alt="Asset"
                          className="w-8 h-8"
                        />
                        <div>
                          <div className="font-medium">{report.assetId === '1' ? 'AAPL' : 'TSLA'}</div>
                          <div className="text-sm text-muted-foreground">
                            {report.assetId === '1' ? 'Apple Inc.' : 'Tesla Inc.'}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <FrequencyIcon className="h-4 w-4" />
                        <span className="capitalize">{report.frequency}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={report.paymentMethod === 'subscription' ? 'default' : 'secondary'}>
                        {report.paymentMethod === 'subscription' ? 'Subscription' : 'Credits'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {report.nextRunAt ? new Date(report.nextRunAt).toLocaleDateString('fr-FR', {
                        day: '2-digit',
                        month: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit'
                      }) : 'N/A'}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={report.isActive}
                          onCheckedChange={() => toggleReport(report.id)}
                        />
                        <Badge variant={report.isActive ? 'default' : 'secondary'}>
                          {report.isActive ? 'Active' : 'Paused'}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline">
                          <Settings className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline" className="text-destructive">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
