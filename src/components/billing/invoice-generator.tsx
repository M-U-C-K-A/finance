"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { toast } from "sonner";
import jsPDF from 'jspdf';

interface InvoiceData {
  id: string;
  date: string;
  amount: number;
  status: string;
  description: string;
  type: string;
}

interface User {
  name?: string;
  email: string;
}

interface InvoiceGeneratorProps {
  invoice: InvoiceData;
  user: User;
}

export function InvoiceGenerator({ invoice, user }: InvoiceGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const generatePDF = async () => {
    setIsGenerating(true);
    
    try {
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // Configuration des polices et couleurs
      const primaryColor = '#2563eb';
      const textColor = '#374151';
      const lightGray = '#f3f4f6';
      
      // Informations de l'entreprise
      const companyInfo = {
        name: "FinAnalytics SAS",
        address: "123 Avenue des Champs-Élysées",
        postalCode: "75008",
        city: "Paris",
        country: "France",
        vat: "FR12345678901",
        siret: "12345678901234"
      };

      let yPosition = 20;

      // En-tête de l'entreprise
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(20);
      pdf.setTextColor(primaryColor);
      pdf.text(companyInfo.name, 20, yPosition);
      
      yPosition += 10;
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(10);
      pdf.setTextColor(textColor);
      pdf.text(companyInfo.address, 20, yPosition);
      yPosition += 5;
      pdf.text(`${companyInfo.postalCode} ${companyInfo.city}`, 20, yPosition);
      yPosition += 5;
      pdf.text(companyInfo.country, 20, yPosition);
      
      yPosition += 10;
      pdf.text(`SIRET: ${companyInfo.siret}`, 20, yPosition);
      yPosition += 5;
      pdf.text(`TVA: ${companyInfo.vat}`, 20, yPosition);

      // Titre FACTURE à droite
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(18);
      pdf.setTextColor(primaryColor);
      pdf.text('FACTURE', 150, 30);
      
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(10);
      pdf.setTextColor(textColor);
      pdf.text(`N°: ${invoice.id}`, 150, 40);
      pdf.text(`Date: ${new Date(invoice.date).toLocaleDateString('fr-FR')}`, 150, 45);

      // Ligne de séparation
      yPosition = 60;
      pdf.setDrawColor(229, 231, 235);
      pdf.setLineWidth(0.5);
      pdf.line(20, yPosition, 190, yPosition);
      
      yPosition += 15;

      // Informations client
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(12);
      pdf.text('Facturé à:', 20, yPosition);
      
      yPosition += 8;
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(10);
      pdf.text(user.name || user.email, 20, yPosition);
      yPosition += 5;
      pdf.text(user.email, 20, yPosition);

      yPosition += 20;

      // Détails de la facture
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(12);
      pdf.text('Détails de la facture', 20, yPosition);
      
      yPosition += 10;

      // Tableau des détails
      const tableHeaders = ['Description', 'Type', 'Montant HT', 'TVA (20%)', 'Montant TTC'];
      const columnWidths = [60, 40, 25, 25, 25];
      let xPosition = 20;

      // En-têtes du tableau
      pdf.setFillColor(243, 244, 246);
      pdf.rect(20, yPosition, 170, 8, 'F');
      
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(9);
      
      tableHeaders.forEach((header, index) => {
        pdf.text(header, xPosition + 2, yPosition + 5);
        xPosition += columnWidths[index];
      });

      yPosition += 8;

      // Ligne du produit
      xPosition = 20;
      pdf.setFont('helvetica', 'normal');
      
      const amountHT = (invoice.amount / 1.2).toFixed(2);
      const vatAmount = (invoice.amount * 0.2 / 1.2).toFixed(2);
      const typeText = invoice.type === 'SUBSCRIPTION_RECHARGE' ? 'Abonnement' : 'Crédits';
      
      const rowData = [
        invoice.description,
        typeText,
        `${amountHT} €`,
        `${vatAmount} €`,
        `${invoice.amount.toFixed(2)} €`
      ];

      rowData.forEach((data, index) => {
        pdf.text(data, xPosition + 2, yPosition + 5);
        xPosition += columnWidths[index];
      });

      yPosition += 15;

      // Total
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(14);
      pdf.setTextColor(primaryColor);
      pdf.text(`Total TTC: ${invoice.amount.toFixed(2)} €`, 120, yPosition);

      yPosition += 20;

      // Statut de paiement
      pdf.setFillColor(236, 253, 245);
      pdf.rect(20, yPosition, 170, 15, 'F');
      
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(10);
      pdf.setTextColor('#059669');
      pdf.text('✓ Paiement confirmé', 25, yPosition + 7);
      
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(textColor);
      pdf.text(`Cette facture a été payée le ${new Date(invoice.date).toLocaleDateString('fr-FR')} via Polar Payment.`, 25, yPosition + 12);

      yPosition += 25;

      // Pied de page
      pdf.setDrawColor(229, 231, 235);
      pdf.line(20, yPosition, 190, yPosition);
      
      yPosition += 10;
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(8);
      pdf.setTextColor('#6b7280');
      
      pdf.text('Conditions de paiement: Paiement immédiat par carte bancaire', 20, yPosition);
      yPosition += 4;
      pdf.text('Délai de livraison: Immédiat (services numériques)', 20, yPosition);
      yPosition += 4;
      pdf.text('Support: support@finanalytics.fr', 20, yPosition);
      
      yPosition += 8;
      pdf.text('Merci de votre confiance. Pour toute question concernant cette facture,', 20, yPosition);
      yPosition += 4;
      pdf.text('contactez notre service client à support@finanalytics.fr', 20, yPosition);

      // Télécharger le PDF
      pdf.save(`facture-${invoice.id}.pdf`);
      
      toast.success('Facture téléchargée avec succès');
      
    } catch (error) {
      console.error('Erreur lors de la génération de la facture:', error);
      toast.error('Erreur lors de la génération de la facture');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={generatePDF}
      disabled={isGenerating}
    >
      {isGenerating ? (
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
      ) : (
        <Download className="h-4 w-4 mr-2" />
      )}
      PDF
    </Button>
  );
}