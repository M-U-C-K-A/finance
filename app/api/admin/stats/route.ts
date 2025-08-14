// API Route pour les statistiques admin selon AGENT.md
import { NextRequest } from "next/server";
import { isAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    // Vérification admin avec ID spécifique depuis .env
    const adminAccess = await isAdmin();
    if (!adminAccess) {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '7d'; // 7d, 30d, 90d, 1y

    // Calculer la date de début selon la période
    const now = new Date();
    const startDate = new Date();
    
    switch (period) {
      case '7d':
        startDate.setDate(now.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(now.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(now.getDate() - 90);
        break;
      case '1y':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
    }

    // Statistiques utilisateurs
    const [
      totalUsers,
      activeUsers,
      newUsers,
      usersByPlan,
      totalReports,
      reportsThisPeriod,
      totalRevenue,
      revenueThisPeriod,
      reportsByStatus,
      topUsers
    ] = await Promise.all([
      // Total utilisateurs
      prisma.user.count(),
      
      // Utilisateurs actifs (ayant créé un rapport dans la période)
      prisma.user.count({
        where: {
          reports: {
            some: {
              createdAt: {
                gte: startDate
              }
            }
          }
        }
      }),
      
      // Nouveaux utilisateurs dans la période
      prisma.user.count({
        where: {
          createdAt: {
            gte: startDate
          }
        }
      }),
      
      // Répartition par plan
      prisma.subscription.groupBy({
        by: ['plan'],
        where: {
          isActive: true
        },
        _count: {
          plan: true
        }
      }),
      
      // Total rapports
      prisma.report.count(),
      
      // Rapports créés dans la période
      prisma.report.count({
        where: {
          createdAt: {
            gte: startDate
          }
        }
      }),
      
      // Revenus total (approximatif basé sur les crédits achetés)
      prisma.creditTransaction.aggregate({
        where: {
          type: { in: ['PACK_PURCHASE', 'SUBSCRIPTION_RECHARGE'] }
        },
        _sum: {
          amount: true
        }
      }),
      
      // Revenus de la période
      prisma.creditTransaction.aggregate({
        where: {
          type: { in: ['PACK_PURCHASE', 'SUBSCRIPTION_RECHARGE'] },
          createdAt: {
            gte: startDate
          }
        },
        _sum: {
          amount: true
        }
      }),
      
      // Rapports par statut
      prisma.report.groupBy({
        by: ['status'],
        _count: {
          status: true
        }
      }),
      
      // Top utilisateurs par nombre de rapports
      prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
          _count: {
            select: {
              reports: true
            }
          }
        },
        orderBy: {
          reports: {
            _count: 'desc'
          }
        },
        take: 10
      })
    ]);

    // Calculer les revenus estimés (approximatif)
    const estimatedTotalRevenue = Math.round((totalRevenue._sum.amount || 0) * 0.69 / 100); // 0.69€ par crédit
    const estimatedPeriodRevenue = Math.round((revenueThisPeriod._sum.amount || 0) * 0.69 / 100);

    // Formatage des statistiques par plan
    const planStats = usersByPlan.reduce((acc, stat) => {
      acc[stat.plan.toLowerCase()] = stat._count.plan;
      return acc;
    }, {} as Record<string, number>);

    // Formatage des statistiques par statut
    const statusStats = reportsByStatus.reduce((acc, stat) => {
      acc[stat.status.toLowerCase()] = stat._count.status;
      return acc;
    }, {} as Record<string, number>);

    // Évolution des utilisateurs (données simulées pour le graphique)
    const userGrowth = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      return {
        date: date.toISOString().split('T')[0],
        users: Math.floor(totalUsers * (0.7 + (i / 29) * 0.3)) + Math.floor(Math.random() * 5)
      };
    });

    return Response.json({
      period,
      users: {
        total: totalUsers,
        active: activeUsers,
        new: newUsers,
        growth: userGrowth,
        byPlan: {
          free: totalUsers - Object.values(planStats).reduce((sum, count) => sum + count, 0),
          starter: planStats.starter || 0,
          professional: planStats.professional || 0,
          enterprise: planStats.enterprise || 0
        }
      },
      reports: {
        total: totalReports,
        period: reportsThisPeriod,
        byStatus: {
          pending: statusStats.pending || 0,
          processing: statusStats.processing || 0,
          completed: statusStats.completed || 0,
          failed: statusStats.failed || 0
        }
      },
      revenue: {
        total: estimatedTotalRevenue,
        period: estimatedPeriodRevenue,
        currency: 'EUR'
      },
      topUsers: topUsers.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        reportsCount: user._count.reports,
        joinedAt: user.createdAt
      }))
    });

  } catch (error: any) {
    console.error("Admin stats error:", error);
    return Response.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}