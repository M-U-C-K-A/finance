// API pour consulter les logs de génération de rapports
import { NextRequest } from "next/server";
import { getUser } from "@/lib/auth-server";
import { readFile } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

export async function GET(request: NextRequest) {
  try {
    const user = await getUser();
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Seuls les admins peuvent voir les logs (optionnel - ajustez selon vos besoins)
    // if (!user.isAdmin) {
    //   return Response.json({ error: "Forbidden" }, { status: 403 });
    // }

    const { searchParams } = new URL(request.url);
    const lines = parseInt(searchParams.get('lines') || '50');
    const filter = searchParams.get('filter') || 'all'; // all, success, error

    const logPath = path.join(process.cwd(), 'finanalytics_reports.log');
    
    if (!existsSync(logPath)) {
      return Response.json({ 
        logs: [], 
        stats: { total: 0, success: 0, errors: 0, success_rate: 0 },
        message: "Aucun log disponible"
      });
    }

    const logContent = await readFile(logPath, 'utf-8');
    const allLines = logContent.trim().split('\n').filter(line => line.length > 0);
    
    // Récupérer les dernières lignes
    const recentLines = allLines.slice(-lines);
    
    // Filtrer selon le type
    let filteredLines = recentLines;
    if (filter === 'success') {
      filteredLines = recentLines.filter(line => line.includes('✅ SUCCÈS'));
    } else if (filter === 'error') {
      filteredLines = recentLines.filter(line => line.includes('❌ ÉCHEC'));
    }

    // Calculer les statistiques
    const total = allLines.filter(line => line.includes('🚀 DÉBUT')).length;
    const success = allLines.filter(line => line.includes('✅ SUCCÈS')).length;
    const errors = allLines.filter(line => line.includes('❌ ÉCHEC')).length;
    const successRate = total > 0 ? Math.round((success / total) * 100) : 0;

    // Parser les logs pour une meilleure structure
    const parsedLogs = filteredLines.map(line => {
      const parts = line.split(' | ');
      if (parts.length >= 2) {
        return {
          timestamp: parts[0],
          type: parts[1],
          details: parts.slice(2).join(' | '),
          raw: line
        };
      }
      return { raw: line };
    });

    return Response.json({
      logs: parsedLogs,
      stats: {
        total,
        success,
        errors,
        success_rate: successRate
      },
      filter,
      lines: filteredLines.length
    });

  } catch (error) {
    console.error("Error reading logs:", error);
    return Response.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}