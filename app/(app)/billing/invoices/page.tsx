"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Download, 
  FileText, 
  CreditCard, 
  Calendar,
  Euro,
  Coins,
  Receipt
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface Invoice {
  id: string;
  type: 'CREDIT_PURCHASE' | 'REPORT_GENERATION';
  description: string;
  amount: number;
  credits: number;
  date: string;
  invoiceType: string;
  downloadUrl: string;
}

interface Subscription {
  plan: string;
  status: string;
  currentPeriodEnd: string;
}

interface InvoicesData {
  invoices: Invoice[];
  subscription: Subscription | null;
}

export default function InvoicesPage() {
  const [data, setData] = useState<InvoicesData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const response = await fetch('/api/invoices');
      if (response.ok) {
        const result = await response.json();
        setData(result);
      }
    } catch (error) {
      console.error('Error fetching invoices:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadInvoice = (url: string) => {
    window.open(url, '_blank');
  };

  const getInvoiceIcon = (type: string) => {
    switch (type) {
      case 'CREDIT_PURCHASE':
        return <CreditCard className="h-4 w-4" />;
      case 'REPORT_GENERATION':
        return <FileText className="h-4 w-4" />;
      default:
        return <Receipt className="h-4 w-4" />;
    }
  };

  const getInvoiceColor = (type: string) => {
    switch (type) {
      case 'CREDIT_PURCHASE':
        return 'bg-blue-50 border-blue-200';
      case 'REPORT_GENERATION':
        return 'bg-green-50 border-green-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-20 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const creditPurchases = data?.invoices.filter(inv => inv.type === 'CREDIT_PURCHASE') || [];
  const reportInvoices = data?.invoices.filter(inv => inv.type === 'REPORT_GENERATION') || [];

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Receipt className="h-8 w-8" />
            Facturation
          </h1>
          <p className="text-muted-foreground mt-2">
            Consultez et téléchargez vos factures et reçus
          </p>
        </div>

        {/* Statut abonnement */}
        {data?.subscription && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Abonnement Actuel
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <Badge variant="default" className="text-sm">
                    {data.subscription.plan}
                  </Badge>
                  <p className="text-sm text-muted-foreground mt-1">
                    Statut: {data.subscription.status}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">
                    Prochaine facturation
                  </p>
                  <p className="font-medium">
                    {format(new Date(data.subscription.currentPeriodEnd), 'PPP', { locale: fr })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Achats de crédits/tokens */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Euro className="h-5 w-5" />
              Achats de Crédits
            </CardTitle>
            <CardDescription>
              Factures pour vos achats de crédits et abonnements
            </CardDescription>
          </CardHeader>
          <CardContent>
            {creditPurchases.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <CreditCard className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Aucun achat de crédits</p>
              </div>
            ) : (
              <div className="space-y-3">
                {creditPurchases.map((invoice) => (
                  <div
                    key={invoice.id}
                    className={`p-4 rounded-lg border-2 ${getInvoiceColor(invoice.type)}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getInvoiceIcon(invoice.type)}
                        <div>
                          <h4 className="font-medium">{invoice.description}</h4>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(invoice.date), 'PPP', { locale: fr })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-semibold">{invoice.amount.toFixed(2)} €</p>
                          <p className="text-sm text-muted-foreground">
                            {invoice.invoiceType}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => downloadInvoice(invoice.downloadUrl)}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Télécharger
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Reçus de services (rapports) */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Coins className="h-5 w-5" />
              Utilisation de Crédits
            </CardTitle>
            <CardDescription>
              Reçus pour vos générations de rapports (payés en crédits)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {reportInvoices.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Aucun rapport généré</p>
              </div>
            ) : (
              <div className="space-y-3">
                {reportInvoices.map((invoice) => (
                  <div
                    key={invoice.id}
                    className={`p-4 rounded-lg border-2 ${getInvoiceColor(invoice.type)}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getInvoiceIcon(invoice.type)}
                        <div>
                          <h4 className="font-medium">{invoice.description}</h4>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(invoice.date), 'PPP', { locale: fr })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-semibold">{invoice.credits} crédits</p>
                          <p className="text-sm text-muted-foreground">
                            Service numérique
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => downloadInvoice(invoice.downloadUrl)}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Reçu
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Note légale */}
        <Card className="bg-muted/50">
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground space-y-2">
              <p><strong>Note importante :</strong></p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Les <strong>achats de crédits</strong> sont facturés en euros avec TVA</li>
                <li>Les <strong>générations de rapports</strong> sont des services payés en crédits (pas de facturation en euros)</li>
                <li>Seuls les achats de crédits nécessitent une facture comptable</li>
                <li>Les reçus de services sont fournis à titre informatif</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}