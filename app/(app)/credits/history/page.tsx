// 8. Page historique des crédits - credits/history/page.tsx
'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Plus,
  Minus,
  Coins,
  CreditCard,
  FileText,
  Calendar
} from "lucide-react";

interface CreditTransaction {
  id: string;
  type: 'purchase' | 'usage' | 'refund';
  amount: number;
  description: string;
  createdAt: string;
  balanceAfter: number;
  relatedReportId?: string;
}

const mockCreditHistory: CreditTransaction[] = [
  {
    id: '1',
    type: 'usage',
    amount: -25,
    description: 'Report: Tesla Inc. (TSLA) - Advanced Analysis',
    createdAt: '2024-08-13T14:30:00Z',
    balanceAfter: 45,
    relatedReportId: 'report_123'
  },
  {
    id: '2',
    type: 'purchase',
    amount: 100,
    description: '100 Credits Pack Purchase',
    createdAt: '2024-08-01T10:00:00Z',
    balanceAfter: 70
  },
  {
    id: '3',
    type: 'usage',
    amount: -20,
    description: 'Report: Apple Inc. (AAPL) - Basic Analysis',
    createdAt: '2024-07-28T16:45:00Z',
    balanceAfter: 45,
    relatedReportId: 'report_122'
  },
  {
    id: '4',
    type: 'refund',
    amount: 15,
    description: 'Refund: Failed report generation',
    createdAt: '2024-07-25T11:20:00Z',
    balanceAfter: 65
  }
];

export default function CreditHistoryPage() {
  const currentBalance = 45;
  const totalPurchased = mockCreditHistory
    .filter(t => t.type === 'purchase')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalUsed = Math.abs(mockCreditHistory
    .filter(t => t.type === 'usage')
    .reduce((sum, t) => sum + t.amount, 0));

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'purchase': return <Plus className="h-4 w-4 text-green-600" />;
      case 'usage': return <Minus className="h-4 w-4 text-red-600" />;
      case 'refund': return <Plus className="h-4 w-4 text-blue-600" />;
      default: return null;
    }
  };

  const getTransactionColor = (amount: number) => {
    return amount > 0 ? 'text-green-600' : 'text-red-600';
  };

  return (
    <div className="space-y-6 p-8">
      <div>
        <h1 className="text-3xl font-bold">Credit History</h1>
        <p className="text-muted-foreground">
          Track all your credit transactions and usage
        </p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Coins className="h-4 w-4 text-orange-600" />
              <span className="text-sm font-medium">Current Balance</span>
            </div>
            <div className="text-2xl font-bold text-orange-600">{currentBalance}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <CreditCard className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">Total Purchased</span>
            </div>
            <div className="text-2xl font-bold text-green-600">{totalPurchased}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium">Total Used</span>
            </div>
            <div className="text-2xl font-bold text-blue-600">{totalUsed}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium">Reports Generated</span>
            </div>
            <div className="text-2xl font-bold text-purple-600">
              {mockCreditHistory.filter(t => t.type === 'usage').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transaction History */}
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right">Balance After</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockCreditHistory.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>
                    {new Date(transaction.createdAt).toLocaleDateString('fr-FR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getTransactionIcon(transaction.type)}
                      <Badge variant={
                        transaction.type === 'purchase' ? 'default' :
                        transaction.type === 'usage' ? 'secondary' : 'outline'
                      }>
                        {transaction.type === 'purchase' ? 'Purchase' :
                         transaction.type === 'usage' ? 'Usage' : 'Refund'}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell className={`text-right font-mono ${getTransactionColor(transaction.amount)}`}>
                    {transaction.amount > 0 ? '+' : ''}{transaction.amount}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {transaction.balanceAfter}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
