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
  selectedBenchmarks?: string[];
  // Nouveaux paramètres de configuration
  pricingModel?: PricingModel;
  customPricingParams?: any;
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
          "SIMPLE": 15,
          "COMPLETE": 25,
          "BENCHMARK": 20,
          "PRICER": 30
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
            selectedBenchmarks: body.selectedBenchmarks || [],
          }
        });

        return newReport;
      });

      // Le rapport reste en statut PENDING
      // Il sera traité par le script report_processor.py qui tourne en arrière-plan
      console.log(`Rapport ${report.id} créé et ajouté à la queue de traitement`);

      return Response.json({
        success: true,
        reportId: report.id,
        message: "Report queued for generation",
        estimatedTime: "5-15 minutes",
        creditsCost,
        status: "PENDING"
      });

    } catch (error: any) {
      console.error("Generate report error:", error);
      
      if (error.message === "Insufficient credits") {
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