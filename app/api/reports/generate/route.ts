// API Route pour générer des rapports selon AGENT.md
import { NextRequest } from "next/server";
import { createApiHandler } from "@/lib/api-middleware";
import { prisma } from "@/lib/prisma";
import { debitCredits, calculateReportCost } from "@/lib/credits";
import { ReportStatus, AssetType, ReportType } from "@prisma/client";

interface GenerateReportBody {
  title: string;
  assetType: AssetType;
  assetSymbol: string;
  reportType: ReportType;
  includeBenchmark: boolean;
  includeApiExport: boolean;
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

      // Calcul du coût
      const creditsCost = calculateReportCost({
        includeBenchmark: body.includeBenchmark,
        includeApiExport: body.includeApiExport
      });

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
          }
        });

        return newReport;
      });

      // TODO: Ici on enverrait le rapport à générer au worker Python
      // Pour le moment on simule avec un délai
      setTimeout(async () => {
        try {
          await prisma.report.update({
            where: { id: report.id },
            data: {
              status: ReportStatus.PROCESSING,
              processingStartedAt: new Date()
            }
          });

          // Simule la génération (3-10 secondes)
          setTimeout(async () => {
            try {
              await prisma.report.update({
                where: { id: report.id },
                data: {
                  status: ReportStatus.COMPLETED,
                  completedAt: new Date(),
                  pdfPath: `/reports/${report.id}-${body.assetSymbol.toLowerCase()}.pdf`,
                  csvPath: body.includeApiExport ? `/reports/${report.id}-${body.assetSymbol.toLowerCase()}.csv` : undefined
                }
              });
            } catch (error) {
              console.error("Error completing report:", error);
              await prisma.report.update({
                where: { id: report.id },
                data: {
                  status: ReportStatus.FAILED,
                  failureReason: "Erreur lors de la génération"
                }
              });
            }
          }, Math.random() * 7000 + 3000); // 3-10 secondes

        } catch (error) {
          console.error("Error processing report:", error);
        }
      }, 1000);

      return Response.json({
        success: true,
        reportId: report.id,
        message: "Report queued for generation",
        estimatedTime: "3-10 minutes",
        creditsCost
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