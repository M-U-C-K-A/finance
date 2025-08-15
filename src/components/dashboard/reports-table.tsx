// components/dashboard/reports-table.tsx
"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  Crown
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
  switch (status) {
    case 'COMPLETED': return <CheckCircle2 className="h-4 w-4 text-green-600" />;
    case 'PROCESSING': return <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />;
    case 'PENDING': return <Clock className="h-4 w-4 text-yellow-600" />;
    case 'FAILED': return <AlertCircle className="h-4 w-4 text-red-600" />;
    default: return null;
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'COMPLETED': return 'Completed';
    case 'PROCESSING': return 'Processing';
    case 'PENDING': return 'Pending';
    case 'FAILED': return 'Failed';
    default: return status;
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
  };
  return domains[symbol] || `${symbol.toLowerCase()}.com`;
};

export function ReportsTable({ reports: initialReports }: ReportsTableProps) {
  const [reports, setReports] = useState(initialReports);
  const [pdfViewerOpen, setPdfViewerOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<{ id: string; title: string } | null>(null);
  const [downloading, setDownloading] = useState<string | null>(null);

  // Auto-refresh for pending reports (same as reports/history)
  useEffect(() => {
    const hasPendingReports = reports.some(report => report.status === 'PENDING' || report.status === 'PROCESSING');
    
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
      }, 5000); // Refresh every 5 seconds

      return () => clearInterval(interval);
    }
  }, [reports]);

  // Update reports when props change
  useEffect(() => {
    setReports(initialReports);
  }, [initialReports]);

  const handleViewReport = (report: Report) => {
    if (report.status === 'COMPLETED' && report.pdfPath) {
      setSelectedReport({
        id: report.id,
        title: `${report.assetSymbol} - ${report.title}`
      });
      setPdfViewerOpen(true);
    }
  };

  const handleDownload = async (report: Report) => {
    if (report.status === 'COMPLETED' && report.pdfPath) {
      setDownloading(report.id);
      try {
        const response = await fetch(`/api/reports/download/${report.id}`);
        if (response.ok) {
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${report.assetSymbol}_Report_${new Date(report.createdAt).toISOString().split('T')[0]}.pdf`;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
        }
      } catch (error) {
        console.error('Download error:', error);
      } finally {
        setDownloading(null);
      }
    }
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Asset & Report</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Credits</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                    No reports generated yet
                  </TableCell>
                </TableRow>
              ) : (
                reports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0">
                          <img 
                            src={`https://logo.clearbit.com/${getCompanyDomain(report.assetSymbol)}`}
                            alt={`${report.assetSymbol} logo`}
                            className="h-8 w-8 rounded object-contain"
                            onError={(e) => {
                              e.currentTarget.src = `data:image/svg+xml;base64,${btoa(`<svg width="32" height="32" xmlns="http://www.w3.org/2000/svg"><rect width="32" height="32" fill="#e5e7eb"/><text x="16" y="20" font-family="Arial" font-size="10" fill="#6b7280" text-anchor="middle">${report.assetSymbol}</text></svg>`)}`;
                            }}
                          />
                        </div>
                        <div>
                          <div className="font-medium">{report.title}</div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span className="font-mono">{report.assetSymbol}</span>
                            <Badge variant="outline" className="text-xs">
                              {report.assetType}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {report.reportType}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(report.status)}
                        <span className="text-sm">{getStatusLabel(report.status)}</span>
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
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleViewReport(report)}
                          disabled={report.status !== 'COMPLETED'}
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleDownload(report)}
                          disabled={report.status !== 'COMPLETED' || downloading === report.id}
                        >
                          {downloading === report.id ? (
                            <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                          ) : (
                            <Download className="h-3 w-3 mr-1" />
                          )}
                          Download
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {selectedReport && (
        <PDFViewerModal
          isOpen={pdfViewerOpen}
          onClose={() => {
            setPdfViewerOpen(false);
            setSelectedReport(null);
          }}
          reportId={selectedReport.id}
          reportTitle={selectedReport.title}
        />
      )}
    </>
  );
}

