// API pour télécharger les factures PDF
import { NextRequest } from "next/server";
import { getUser } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";

// Fonction pour générer le contenu HTML de la facture
function generateInvoiceHTML(invoice: any, user: any, subscription: any) {
  const invoiceDate = new Date(invoice.createdAt).toLocaleDateString('fr-FR');
  const companyInfo = {
    name: "FinAnalytics SAS",
    address: "123 Avenue des Champs-Élysées",
    postalCode: "75008",
    city: "Paris",
    country: "France",
    vat: "FR12345678901",
    siret: "12345678901234"
  };

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Facture ${invoice.id}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 20px;
          color: #333;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 40px;
          border-bottom: 2px solid #e5e7eb;
          padding-bottom: 20px;
        }
        .company-info {
          flex: 1;
        }
        .company-info h1 {
          color: #2563eb;
          margin: 0 0 10px 0;
          font-size: 24px;
        }
        .invoice-info {
          text-align: right;
          flex: 1;
        }
        .invoice-info h2 {
          color: #374151;
          margin: 0 0 10px 0;
        }
        .client-section {
          margin: 30px 0;
          padding: 20px;
          background-color: #f9fafb;
          border-radius: 8px;
        }
        .invoice-details {
          margin: 30px 0;
        }
        .details-table {
          width: 100%;
          border-collapse: collapse;
          margin: 20px 0;
        }
        .details-table th,
        .details-table td {
          padding: 12px;
          text-align: left;
          border-bottom: 1px solid #e5e7eb;
        }
        .details-table th {
          background-color: #f3f4f6;
          font-weight: 600;
        }
        .amount-section {
          text-align: right;
          margin: 30px 0;
        }
        .total-amount {
          font-size: 18px;
          font-weight: bold;
          color: #2563eb;
          background-color: #eff6ff;
          padding: 15px;
          border-radius: 8px;
          display: inline-block;
          min-width: 200px;
        }
        .footer {
          margin-top: 50px;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
          font-size: 12px;
          color: #6b7280;
        }
        .payment-info {
          margin: 20px 0;
          padding: 15px;
          background-color: #ecfdf5;
          border-radius: 8px;
          border-left: 4px solid #10b981;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="company-info">
          <h1>${companyInfo.name}</h1>
          <p>
            ${companyInfo.address}<br>
            ${companyInfo.postalCode} ${companyInfo.city}<br>
            ${companyInfo.country}
          </p>
          <p>
            <strong>SIRET:</strong> ${companyInfo.siret}<br>
            <strong>TVA:</strong> ${companyInfo.vat}
          </p>
        </div>
        <div class="invoice-info">
          <h2>FACTURE</h2>
          <p><strong>N°:</strong> ${invoice.id}</p>
          <p><strong>Date:</strong> ${invoiceDate}</p>
        </div>
      </div>

      <div class="client-section">
        <h3>Facturé à:</h3>
        <p>
          <strong>${user.name || user.email}</strong><br>
          ${user.email}
        </p>
      </div>

      <div class="invoice-details">
        <h3>Détails de la facture</h3>
        <table class="details-table">
          <thead>
            <tr>
              <th>Description</th>
              <th>Type</th>
              <th>Montant HT</th>
              <th>TVA (20%)</th>
              <th>Montant TTC</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>${invoice.description}</td>
              <td>${invoice.type === 'SUBSCRIPTION_RECHARGE' ? 'Abonnement mensuel' : 'Achat de crédits'}</td>
              <td>${(invoice.amount / 1.2).toFixed(2)} €</td>
              <td>${(invoice.amount * 0.2 / 1.2).toFixed(2)} €</td>
              <td>${invoice.amount.toFixed(2)} €</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="amount-section">
        <div class="total-amount">
          <strong>Total TTC: ${invoice.amount.toFixed(2)} €</strong>
        </div>
      </div>

      <div class="payment-info">
        <h4>✅ Paiement confirmé</h4>
        <p>Cette facture a été payée le ${invoiceDate} via Polar Payment.</p>
      </div>

      <div class="footer">
        <p>
          <strong>Conditions de paiement:</strong> Paiement immédiat par carte bancaire<br>
          <strong>Délai de livraison:</strong> Immédiat (services numériques)<br>
          <strong>Support:</strong> support@finanalytics.fr
        </p>
        <p style="margin-top: 15px;">
          Merci de votre confiance. Pour toute question concernant cette facture, 
          contactez notre service client à support@finanalytics.fr
        </p>
      </div>
    </body>
    </html>
  `;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getUser();
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Extraire l'ID de transaction du nom de fichier
    const fileName = params.id.replace('.pdf', '');
    const isReportInvoice = fileName.startsWith('report-');
    
    let transaction = null;
    let report = null;
    
    if (isReportInvoice) {
      // Facture de rapport
      const reportId = fileName.replace('report-', '');
      report = await prisma.report.findUnique({
        where: { 
          id: reportId,
          userId: user.id  // S'assurer que le rapport appartient à l'utilisateur
        }
      });
      
      if (!report) {
        return Response.json({ error: "Report invoice not found" }, { status: 404 });
      }
    } else {
      // Facture de transaction de crédit
      transaction = await prisma.creditTransaction.findUnique({
        where: { 
          id: fileName,
          userId: user.id  // S'assurer que la transaction appartient à l'utilisateur
        }
      });

      if (!transaction) {
        return Response.json({ error: "Invoice not found" }, { status: 404 });
      }
    }

    // Récupérer l'abonnement pour les détails de facturation
    const subscription = await prisma.subscription.findUnique({
      where: { userId: user.id }
    });

    // Générer les données de la facture
    let invoiceData;
    
    if (report) {
      // Facture pour un rapport généré
      const reportTypeNames = {
        'BASELINE': 'Rapport Baseline',
        'DETAILED': 'Analyse Détaillée', 
        'DEEP_ANALYSIS': 'Analyse Approfondie',
        'CUSTOM': 'Rapport Personnalisé',
        'PRICER': 'Modèle de Pricing',
        'BENCHMARK': 'Analyse Comparative'
      };
      
      invoiceData = {
        id: `INV-REPORT-${String(Date.now()).slice(-6)}`,
        amount: Math.ceil(report.creditsCost * 0.69),
        description: `${reportTypeNames[report.reportType as keyof typeof reportTypeNames] || report.reportType} - ${report.assetSymbol}`,
        type: 'REPORT_GENERATION',
        createdAt: report.createdAt
      };
    } else {
      // Facture pour achat de crédits
      invoiceData = {
        id: `INV-CREDIT-${String(Date.now()).slice(-6)}`,
        amount: transaction!.type === 'SUBSCRIPTION_RECHARGE' ? 
          (subscription?.plan === 'STARTER' ? 29 :
           subscription?.plan === 'PROFESSIONAL' ? 99 :
           subscription?.plan === 'ENTERPRISE' ? 299 : 0) :
          Math.ceil(transaction!.amount * 0.69),
        description: transaction!.description,
        type: transaction!.type,
        createdAt: transaction!.createdAt
      };
    }

    // Générer le HTML de la facture
    const htmlContent = generateInvoiceHTML(invoiceData, user, subscription);

    // Pour une solution simple, on retourne le HTML
    // Dans un environnement de production, on utiliserait Puppeteer ou une autre solution pour générer le PDF
    return new Response(htmlContent, {
      headers: {
        'Content-Type': 'text/html',
        'Content-Disposition': `attachment; filename="facture-${invoiceData.id}.html"`
      }
    });

  } catch (error) {
    console.error("Invoice generation error:", error);
    return Response.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}