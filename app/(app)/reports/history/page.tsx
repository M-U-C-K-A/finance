
// 6. Page historique - reports/history/page.tsx
'use client';

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { ReportsHistorySkeleton } from "@/components/reports/reports-history-skeleton";
import { PDFViewerModal } from "@/components/reports/pdf-viewer-modal";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Download,
  Eye,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  Loader2,
  CreditCard,
  Crown
} from "lucide-react";

interface ReportRequest {
  id: string;
  assetId: string;
  frequency: string;
  type: string;
  assetName?: string;
  assetSymbol?: string;
  assetType?: string;
  reportType?: string;
  date?: string;
  status: string;
  creditsUsed?: number;
  paymentMethod: string;
  createdAt: string;
  completedAt?: string;
  downloadUrl?: string;
  pdfPath?: string;
  config: Record<string, unknown>;
}


// Function to map asset symbols to company domains
const getCompanyDomain = (symbol: string): string => {
  const domains: Record<string, string> = {
    'AAPL': 'apple.com',
    'MSFT': 'microsoft.com',
    'GOOGL': 'google.com',
    'AMZN': 'amazon.com',
    'TSLA': 'tesla.com',
    'META': 'meta.com',
    'NFLX': 'netflix.com',
    'NVDA': 'nvidia.com',
    'CRM': 'salesforce.com',
    'ORCL': 'oracle.com',
  };
  return domains[symbol] || `${symbol.toLowerCase()}.com`;
};

export default function ReportHistoryPage() {
  const [reports, setReports] = useState<ReportRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [downloading, setDownloading] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');
  const [pdfViewerOpen, setPdfViewerOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<{ id: string; title: string } | null>(null);

  useEffect(() => {
    fetchReports();
  }, []);

  // Auto-refresh pour les rapports pending
  useEffect(() => {
    const hasPendingReports = reports.some(report => report.status === 'PENDING');
    
    if (hasPendingReports) {
      const interval = setInterval(() => {
        fetchReports();
      }, 5000); // Refresh toutes les 5 secondes

      return () => clearInterval(interval);
    }
  }, [reports]);

  const fetchReports = async () => {
    try {
      const response = await fetch('/api/reports/history');
      if (response.ok) {
        const data = await response.json();
        setReports(data.reports || []);
      } else {
        toast.error("Failed to fetch reports");
      }
    } catch {
      toast.error("Error fetching reports");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (reportId: string) => {
    try {
      setDownloading(reportId);
      
      const response = await fetch(`/api/reports/${reportId}/download`);
      
      if (!response.ok) {
        throw new Error('Failed to download report');
      }
      
      // Récupérer le blob du PDF
      const blob = await response.blob();
      
      // Créer une URL temporaire pour le blob
      const url = window.URL.createObjectURL(blob);
      
      // Créer un lien temporaire et le cliquer pour déclencher le téléchargement
      const link = document.createElement('a');
      link.href = url;
      link.download = `rapport_${reportId}.pdf`;
      document.body.appendChild(link);
      link.click();
      
      // Nettoyer
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success('Report downloaded successfully');
      
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download report');
    } finally {
      setDownloading(null);
    }
  };

  const handleViewPDF = (reportId: string, title: string) => {
    setSelectedReport({ id: reportId, title });
    setPdfViewerOpen(true);
  };

  const closePDFViewer = () => {
    setPdfViewerOpen(false);
    setSelectedReport(null);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case 'processing': return <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />;
      case 'pending': return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'failed': return <AlertCircle className="h-4 w-4 text-red-600" />;
      default: return null;
    }
  };

  if (loading) {
    return <ReportsHistorySkeleton />;
  }

  return (
    <div className="space-y-6 p-8">
      <div>
        <h1 className="text-3xl font-bold">Report History</h1>
        <p className="text-muted-foreground">
          View and download all your generated reports
        </p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{reports.length}</div>
            <p className="text-sm text-muted-foreground">Total Reports</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">
              {reports.filter(r => r.status === 'completed').length}
            </div>
            <p className="text-sm text-muted-foreground">Completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">
              {reports.filter(r => r.status === 'processing').length}
            </div>
            <p className="text-sm text-muted-foreground">Processing</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">
              {reports.filter(r => r.paymentMethod === 'credits').reduce((sum, r) => sum + (r.creditsUsed || 0), 0)}
            </div>
            <p className="text-sm text-muted-foreground">Credits Used</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="relative flex-1 min-w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search reports..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={paymentFilter} onValueChange={setPaymentFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Payment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Methods</SelectItem>
                <SelectItem value="subscription">Subscription</SelectItem>
                <SelectItem value="credits">Credits</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Reports Table */}
      <Card>
        <CardHeader>
          <CardTitle>Your Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Asset</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Frequency</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img 
                        src={`https://logo.clearbit.com/${getCompanyDomain(report.assetSymbol || '')}`}
                        alt={report.assetSymbol}
                        className="w-8 h-8 rounded object-contain bg-white dark:bg-gray-800 p-1 border dark:border-gray-700"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = `https://ui-avatars.com/api/?name=${report.assetSymbol}&background=3b82f6&color=fff&size=32`;
                        }}
                      />
                      <div>
                        <div className="font-medium">{report.assetSymbol || 'N/A'}</div>
                        <div className="text-sm text-muted-foreground">
                          {report.assetName || 'Financial Asset'}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={report.type === 'one-time' ? 'default' : 'secondary'}>
                      {report.type === 'one-time' ? 'One-time' : 'Recurring'}
                    </Badge>
                  </TableCell>
                  <TableCell className="capitalize">{report.frequency}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {report.paymentMethod === 'subscription' ? (
                        <Crown className="h-4 w-4 text-primary" />
                      ) : (
                        <CreditCard className="h-4 w-4 text-orange-600" />
                      )}
                      <span>{report.paymentMethod}</span>
                      {report.creditsUsed && (
                        <Badge variant="outline" className="text-xs">
                          -{report.creditsUsed} credits
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(report.status)}
                      <span className="capitalize">{report.status}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {new Date(report.createdAt).toLocaleDateString('fr-FR', {
                      day: '2-digit',
                      month: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {report.status === 'completed' && report.pdfPath ? (
                        <>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleViewPDF(report.id, `${report.assetSymbol} - ${report.reportType}`)}
                            title="Voir le PDF"
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            Voir
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleDownload(report.id)}
                            disabled={downloading === report.id}
                            title="Télécharger le PDF"
                          >
                            {downloading === report.id ? (
                              <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                            ) : (
                              <Download className="h-3 w-3 mr-1" />
                            )}
                            {downloading === report.id ? 'En cours...' : 'Télécharger'}
                          </Button>
                        </>
                      ) : (
                        <Button size="sm" variant="outline" disabled>
                          <Eye className="h-3 w-3 mr-1" />
                          Non disponible
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* PDF Viewer Modal */}
      {selectedReport && (
        <PDFViewerModal
          isOpen={pdfViewerOpen}
          onClose={closePDFViewer}
          reportId={selectedReport.id}
          reportTitle={selectedReport.title}
        />
      )}
    </div>
  );
}
