// components/dashboard/reports-table.tsx
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
import { 
  FileText,
  Download, 
  Eye, 
  CheckCircle2,
  AlertCircle,
  Loader2,
  Clock
} from "lucide-react";

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
    case 'completed': return <CheckCircle2 className="h-4 w-4 text-green-600" />;
    case 'processing': return <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />;
    case 'pending': return <Clock className="h-4 w-4 text-yellow-600" />;
    case 'error': return <AlertCircle className="h-4 w-4 text-red-600" />;
    default: return null;
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'completed': return 'Terminé';
    case 'processing': return 'En cours';
    case 'pending': return 'En attente';
    case 'error': return 'Erreur';
    default: return status;
  }
};

const getTypeLabel = (type: string) => {
  switch (type) {
    case 'daily': return 'Quotidien';
    case 'weekly': return 'Hebdomadaire';
    case 'monthly': return 'Mensuel';
    default: return type;
  }
};

export function ReportsTable({ reports }: ReportsTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Rapports récents
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Rapport</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Marché</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Date création</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reports.map((report) => (
              <TableRow key={report.id}>
                <TableCell className="font-medium">
                  <div>
                    <div>{report.title}</div>
                    <div className="text-sm text-muted-foreground">{report.symbol}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {getTypeLabel(report.type)}
                  </Badge>
                </TableCell>
                <TableCell>{report.market}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(report.status)}
                    <span className="text-sm">{getStatusLabel(report.status)}</span>
                  </div>
                </TableCell>
                <TableCell className="text-sm">
                  {formatDate(report.createdAt)}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    {report.status === 'completed' && report.downloadUrl ? (
                      <Button size="sm" variant="outline">
                        <Download className="h-3 w-3 mr-1" />
                        Télécharger
                      </Button>
                    ) : (
                      <Button size="sm" variant="outline" disabled>
                        <Eye className="h-3 w-3 mr-1" />
                        Voir
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
  );
}

