// components/dashboard/reports-table.tsx
"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PDFViewerModal } from "@/components/reports/pdf-viewer-modal";
import { 
  FileText,
  Download, 
  Eye, 
  CheckCircle2,
  AlertCircle,
  Loader2,
  Clock,
  CreditCard,
  Crown,
  Search,
  Filter,
  TrendingUp
} from "lucide-react";

interface Report {
  id: string;
  title: string;
  assetSymbol: string;
  assetType?: string;
  reportType?: string;
  status: 'COMPLETED' | 'PROCESSING' | 'PENDING' | 'FAILED';
  createdAt: string;
  completedAt?: string;
  pdfPath?: string;
  creditsCost: number;
}

interface ReportsTableProps {
  reports: Report[];
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const getStatusIcon = (status: string) => {
  switch (status.toLowerCase()) {
    case 'completed': return <CheckCircle2 className="h-4 w-4 text-green-600" />;
    case 'processing': return <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />;
    case 'pending': return <Clock className="h-4 w-4 text-yellow-600" />;
    case 'failed': return <AlertCircle className="h-4 w-4 text-red-600" />;
    default: return null;
  }
};

const getCompanyDomain = (symbol: string): string => {
  // Handle undefined/null symbol
  if (!symbol) return 'example.com';
  
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

export function ReportsTable({ reports: initialReports }: ReportsTableProps) {
  const [reports, setReports] = useState(initialReports);
  const [pdfViewerOpen, setPdfViewerOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<{ id: string; title: string } | null>(null);
  const [downloading, setDownloading] = useState<string | null>(null);
  
  // Filtres et recherche (exactement comme dans history)
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  // Auto-refresh for pending reports (same as reports/history)
  useEffect(() => {
    const hasPendingReports = reports.some(report => 
      report.status === 'PENDING' || report.status === 'PROCESSING'
    );
    
    if (hasPendingReports) {
      const interval = setInterval(async () => {
        try {
          const response = await fetch('/api/dashboard');
          if (response.ok) {
            const dashboardData = await response.json();
            setReports(dashboardData.reports);
          }
        } catch (error) {
          console.error('Error refreshing reports:', error);
        }
      }, 3000); // Refresh every 3 seconds

      return () => clearInterval(interval);
    }
  }, [reports]);

  // Update reports when props change
  useEffect(() => {
    setReports(initialReports);
  }, [initialReports]);

  const handleViewPDF = (reportId: string, title: string) => {
    setSelectedReport({ id: reportId, title });
    setPdfViewerOpen(true);
  };

  const closePDFViewer = () => {
    setPdfViewerOpen(false);
    setSelectedReport(null);
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
      
    } catch (error) {
      console.error('Download error:', error);
    } finally {
      setDownloading(null);
    }
  };

  // Analysis types mapping (exactement comme dans history)
  const analysisTypes = {
    'BASELINE': { label: 'Baseline', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' },
    'DETAILED': { label: 'Technique Avancée', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300' },
    'DEEP_ANALYSIS': { label: 'Recherche Exhaustive', color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' },
    'BENCHMARK': { label: 'Analyse Comparative', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' },
    'PRICER': { label: 'Modèle Valorisation', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300' },
    'CUSTOM': { label: 'Personnalisé', color: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300' }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Recent Reports
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Filters & Search - exactement comme dans history */}
          <div className="mb-6 space-y-4">
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
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Analyse" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous types</SelectItem>
                  <SelectItem value="BASELINE">Baseline</SelectItem>
                  <SelectItem value="DETAILED">Technique Avancée</SelectItem>
                  <SelectItem value="DEEP_ANALYSIS">Recherche Exhaustive</SelectItem>
                  <SelectItem value="BENCHMARK">Analyse Comparative</SelectItem>
                  <SelectItem value="PRICER">Modèle Valorisation</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Asset</TableHead>
                <TableHead>Analyse</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Credits</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports
                .filter(report => {
                  const matchesSearch = (report.assetSymbol?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                                      (report.title?.toLowerCase() || '').includes(searchTerm.toLowerCase());
                  const matchesStatus = statusFilter === 'all' || report.status.toLowerCase() === statusFilter;
                  const matchesType = typeFilter === 'all' || report.reportType === typeFilter;
                  
                  return matchesSearch && matchesStatus && matchesType;
                })
                .map((report) => (
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
                            {report.title || 'Financial Asset'}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {(() => {
                        const analysisType = analysisTypes[report.reportType as keyof typeof analysisTypes] || { label: report.reportType || 'N/A', color: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300' };
                        return (
                          <Badge className={`${analysisType.color} border-0`}>
                            {analysisType.label}
                          </Badge>
                        );
                      })()}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(report.status)}
                        <span className="capitalize">{report.status.toLowerCase()}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <CreditCard className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm">{report.creditsCost}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(report.createdAt)}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {(report.status === 'COMPLETED' || report.status.toLowerCase() === 'completed') ? (
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
              {reports
                .filter(report => {
                  const matchesSearch = (report.assetSymbol?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                                      (report.title?.toLowerCase() || '').includes(searchTerm.toLowerCase());
                  const matchesStatus = statusFilter === 'all' || report.status.toLowerCase() === statusFilter;
                  const matchesType = typeFilter === 'all' || report.reportType === typeFilter;
                  
                  return matchesSearch && matchesStatus && matchesType;
                }).length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <TrendingUp className="h-12 w-12 text-muted-foreground" />
                      <div className="space-y-1 text-center">
                        <h3 className="font-semibold text-muted-foreground">
                          {reports.length === 0 ? 'Aucun rapport généré' : 'Aucun rapport trouvé'}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {reports.length === 0 
                            ? 'Commencez par générer votre premier rapport d\'analyse financière'
                            : 'Essayez de modifier vos filtres de recherche'
                          }
                        </p>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              )}
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
    </>
  );
}
