import { NextRequest, NextResponse } from "next/server";
import { createApiHandler } from "@/lib/api-middleware";
import { prisma } from "@/lib/prisma";
import { readFile } from "fs/promises";
import path from "path";

export const GET = createApiHandler(
  async (request: NextRequest, { user, params }) => {
    try {
      const reportId = params.id as string;

      // Vérifier que le rapport appartient à l'utilisateur
      const report = await prisma.report.findFirst({
        where: {
          id: reportId,
          userId: user.id,
          status: "COMPLETED"
        }
      });

      if (!report) {
        return NextResponse.json(
          { error: "Report not found or not completed" },
          { status: 404 }
        );
      }

      if (!report.pdfPath) {
        return NextResponse.json(
          { error: "PDF file not available" },
          { status: 404 }
        );
      }

      // Construire le chemin complet du fichier
      const publicDir = path.join(process.cwd(), "public", "reports");
      const filePath = path.join(publicDir, report.pdfPath);

      console.log("Download debug:", {
        reportId,
        pdfPath: report.pdfPath,
        publicDir,
        filePath,
        fileExists: require('fs').existsSync(filePath)
      });

      try {
        // Lire le fichier PDF
        const fileBuffer = await readFile(filePath);
        
        // Générer un nom de fichier approprié
        const filename = `rapport_${report.assetSymbol || report.assetId}_${new Date().toISOString().split('T')[0]}.pdf`;

        // Créer la réponse avec les bons headers
        const response = new NextResponse(fileBuffer);
        
        response.headers.set('Content-Type', 'application/pdf');
        response.headers.set('Content-Disposition', `attachment; filename="${filename}"`);
        response.headers.set('Content-Length', fileBuffer.length.toString());
        
        return response;

      } catch (fileError) {
        console.error("Error reading PDF file:", fileError);
        return NextResponse.json(
          { error: "PDF file not accessible" },
          { status: 500 }
        );
      }

    } catch (error) {
      console.error("Download error:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  }
);