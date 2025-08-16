// API Route pour générer des rapports selon AGENT.md
import { NextRequest } from "next/server";
import { createApiHandler } from "@/lib/api-middleware";
import { prisma } from "@/lib/prisma";
import { debitCredits, calculateReportCost } from "@/lib/credits";
import { ReportStatus, AssetType, ReportType, PricingModel, ChartType, BenchmarkType } from "@prisma/client";

interface GenerateReportBody {
  title: string;
  assetType: AssetType;
  assetSymbol: string;
  reportType: ReportType;
  includeBenchmark: boolean;
  includeApiExport: boolean;
  // Nouveaux paramètres de configuration
  pricingModel?: PricingModel;
  customPricingParams?: Record<string, unknown>;
  selectedCharts?: ChartType[];
  benchmarkTypes?: BenchmarkType[];
  customBenchmarks?: string[];
}

export const POST = createApiHandler(
  async (request: NextRequest, { user }) => {
    try {
      const body: GenerateReportBody = await request.json();
      
      // Validation des données
      if (!body.title || !body.assetType || !body.assetSymbol) {
        return Response.json(
          { error: "Missing data", message: "Title, asset type and symbol are required" },
          { status: 400 }
        );
      }

      // Calcul du coût basé sur le type de rapport
      const getReportCost = () => {
        const baseCosts = {
          "BASELINE": 15,
          "DETAILED": 25,
          "DEEP_ANALYSIS": 35,
          "CUSTOM": 20,
          "PRICER": 30,
          "BENCHMARK": 20
        };
        
        let cost = baseCosts[body.reportType as keyof typeof baseCosts] || 15;
        
        if (body.includeBenchmark) cost += 12;
        if (body.includeApiExport) cost += 5;
        
        return cost;
      };

      const creditsCost = getReportCost();

      // Vérifier si l'utilisateur a assez de crédits
      const userCredits = await prisma.credits.findUnique({
        where: { userId: user.id }
      });

      if (!userCredits || userCredits.balance < creditsCost) {
        return Response.json(
          { 
            error: "Insufficient credits", 
            message: `You need ${creditsCost} credits but only have ${userCredits?.balance || 0}`,
            requiredCredits: creditsCost,
            currentCredits: userCredits?.balance || 0,
            buyCreditsUrl: "/plan/buy-credits"
          },
          { status: 402 }
        );
      }

      // Création du rapport dans la base
      const report = await prisma.$transaction(async (tx) => {
        // Débiter les crédits
        await debitCredits(
          user.id,
          creditsCost,
          `Rapport ${body.title} - ${body.assetSymbol}`
        );

        // Créer le rapport
        const newReport = await tx.report.create({
          data: {
            userId: user.id,
            title: body.title,
            assetType: body.assetType,
            assetSymbol: body.assetSymbol,
            reportType: body.reportType,
            includeBenchmark: body.includeBenchmark,
            includeApiExport: body.includeApiExport,
            creditsCost,
            status: ReportStatus.PENDING,
            // Nouveaux paramètres de configuration
            pricingModel: body.pricingModel,
            customPricingParams: body.customPricingParams || {},
            selectedCharts: body.selectedCharts || [],
            benchmarkTypes: body.benchmarkTypes || [],
            customBenchmarks: body.customBenchmarks || [],
          }
        });

        return newReport;
      });

      // Le rapport reste en statut PENDING
      // Il sera traité par le script report_processor.py qui tourne en arrière-plan
      console.log(`Rapport ${report.id} créé et ajouté à la queue de traitement`);
      
      // Pour les tests, on peut déclencher la génération immédiatement
      if (process.env.NODE_ENV === 'development') {
        try {
          const { spawn } = require('child_process');
          const timestamp = new Date().toISOString().slice(0,19).replace(/:/g,'').replace(/-/g,'');
          const outputPath = `public/reports/${body.reportType}_${body.assetSymbol}_${timestamp}.pdf`;
          
          console.log(`🚀 Lancement génération rapport: ${body.reportType} pour ${body.assetSymbol}`);
          console.log(`📁 Chemin de sortie: ${outputPath}`);
          console.log(`📂 Répertoire de travail: ${process.cwd()}`);
          
          console.log(`🔧 Arguments Python:`, [
            'pdf/smart_report_generator.py',
            body.assetSymbol,
            body.reportType,
            outputPath
          ]);
          
          const pythonProcess = spawn('python3', [
            'pdf/smart_report_generator.py',
            body.assetSymbol,
            body.reportType,
            outputPath,
            user.id  // Ajout de l'user_id pour les logs
          ], {
            cwd: process.cwd(),
            stdio: ['ignore', 'pipe', 'pipe']
          });
          
          pythonProcess.stdout.on('data', (data) => {
            console.log(`📊 Python stdout: ${data.toString()}`);
          });
          
          pythonProcess.stderr.on('data', (data) => {
            console.error(`❌ Python stderr: ${data.toString()}`);
          });
          
          pythonProcess.on('close', (code) => {
            console.log(`✅ Processus Python terminé avec le code ${code}`);
            if (code === 0) {
              console.log(`📄 Rapport généré avec succès: ${outputPath}`);
              // Mettre à jour le statut du rapport en base
              prisma.report.update({
                where: { id: report.id },
                data: { 
                  status: ReportStatus.COMPLETED,
                  downloadUrl: `/${outputPath}`,
                  completedAt: new Date()
                }
              }).catch(err => console.error('Erreur mise à jour statut:', err));
            } else {
              console.error(`❌ Échec génération rapport avec code ${code}`);
              // Marquer le rapport comme échoué
              prisma.report.update({
                where: { id: report.id },
                data: { 
                  status: ReportStatus.FAILED,
                  error: `Process exited with code ${code}`
                }
              }).catch(err => console.error('Erreur mise à jour statut échec:', err));
            }
          });
          
          pythonProcess.on('error', (error) => {
            console.error(`❌ Erreur processus Python:`, error);
            // Marquer le rapport comme échoué
            prisma.report.update({
              where: { id: report.id },
              data: { 
                status: ReportStatus.FAILED,
                error: error.message
              }
            }).catch(err => console.error('Erreur mise à jour statut erreur:', err));
          });
          
        } catch (error) {
          console.error('❌ Erreur déclenchement génération:', error);
        }
      }

      return Response.json({
        success: true,
        reportId: report.id,
        message: "Report queued for generation",
        estimatedTime: "5-15 minutes",
        creditsCost,
        status: "PENDING"
      });

    } catch (error: unknown) {
      console.error("Generate report error:", error);
      
      if (error instanceof Error && error.message === "Insufficient credits") {
        return Response.json(
          { 
            error: "Payment Required", 
            message: "Insufficient credits",
            buyCreditsUrl: "/plan/buy-credits"
          },
          { status: 402 }
        );
      }

      return Response.json(
        { error: "Internal Server Error", message: "Error during generation" },
        { status: 500 }
      );
    }
  }
);