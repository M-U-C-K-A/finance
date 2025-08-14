// Script pour peupler la base de données avec des données de test
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Données de test
const SYMBOLS = [
  'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'META', 'NVDA', 'NFLX',
  'SPY', 'QQQ', 'VTI', 'IVV',
  'CAC40', 'DAX', 'FTSE', 'NIKKEI'
];

const USER_NAMES = [
  'Alice Dupont', 'Bob Martin', 'Claire Bernard', 'David Leroy',
  'Emma Wilson', 'François Garcia', 'Grace Chen', 'Hugo Martinez',
  'Isabelle Rodriguez', 'Jean-Pierre Dubois'
];

function randomChoice(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomDate(days = 365) {
  return new Date(Date.now() - randomInt(1, days) * 24 * 60 * 60 * 1000);
}

async function seedUsers(count = 10) {
  console.log('🔄 Création des utilisateurs...');
  
  const users = [];
  for (let i = 0; i < count; i++) {
    const name = i < USER_NAMES.length ? USER_NAMES[i] : `User ${i + 1}`;
    const email = `${name.toLowerCase().replace(' ', '.')}@test.com`;
    
    const user = await prisma.user.create({
      data: {
        name,
        email,
        emailVerified: Math.random() > 0.3, // 70% verified
        image: `https://i.pravatar.cc/150?u=${email}`,
        role: 'USER',
        createdAt: randomDate(365),
        updatedAt: new Date()
      }
    });
    
    users.push(user);
  }
  
  console.log(`✅ ${users.length} utilisateurs créés`);
  return users;
}

async function seedSubscriptionsAndCredits(users) {
  console.log('🔄 Création des abonnements et crédits...');
  
  for (const user of users) {
    // 70% des utilisateurs ont un abonnement
    if (Math.random() < 0.7) {
      const plan = randomChoice(['STARTER', 'PROFESSIONAL', 'ENTERPRISE']);
      const apiAccess = ['PROFESSIONAL', 'ENTERPRISE'].includes(plan);
      
      await prisma.subscription.create({
        data: {
          userId: user.id,
          plan,
          billingCycle: 'MONTHLY',
          apiAccess,
          isActive: Math.random() > 0.2, // 80% actifs
          startedAt: randomDate(90),
          renewsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // +30 jours
        }
      });
    }
    
    // Créer un compte crédits pour chaque utilisateur
    const monthlyCredits = randomChoice([0, 100, 500, 2000]);
    const balance = randomInt(0, 500);
    
    await prisma.credits.create({
      data: {
        userId: user.id,
        balance,
        monthlyCredits,
        lastRecharge: Math.random() > 0.2 ? randomDate(30) : null,
      }
    });
  }
  
  console.log('✅ Abonnements et crédits créés');
}

async function seedCreditTransactions(users, count = 100) {
  console.log('🔄 Création des transactions de crédits...');
  
  const transactionTypes = ['SUBSCRIPTION_RECHARGE', 'PACK_PURCHASE', 'REPORT_USAGE', 'BONUS'];
  
  for (let i = 0; i < count; i++) {
    const user = randomChoice(users);
    const type = randomChoice(transactionTypes);
    
    let amount;
    if (type === 'REPORT_USAGE') {
      amount = -randomChoice([20, 32, 37]); // Coût des rapports
    } else {
      amount = randomChoice([100, 500, 2000]); // Recharges
    }
    
    await prisma.creditTransaction.create({
      data: {
        userId: user.id,
        type,
        amount,
        description: `${type.replace('_', ' ')} - ${Math.abs(amount)} crédits`,
        balanceAfter: randomInt(0, 500),
        createdAt: randomDate(90)
      }
    });
  }
  
  console.log(`✅ ${count} transactions créées`);
}

async function seedReports(users, count = 50) {
  console.log('🔄 Création des rapports...');
  
  for (let i = 0; i < count; i++) {
    const user = randomChoice(users);
    const symbol = randomChoice(SYMBOLS);
    const assetType = randomChoice(['STOCK', 'ETF', 'INDEX', 'MARKET']);
    const status = randomChoice(['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED']);
    const createdAt = randomDate(30);
    
    const reportData = {
      userId: user.id,
      title: `Analyse ${symbol} - ${new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}`,
      assetType,
      assetSymbol: symbol,
      reportType: randomChoice(['BASELINE', 'DEEP_ANALYSIS', 'PRICER', 'BENCHMARK']),
      includeBenchmark: Math.random() > 0.6,
      includeApiExport: Math.random() > 0.7,
      creditsCost: randomChoice([20, 32, 37]),
      status,
      createdAt,
      updatedAt: new Date()
    };
    
    // Ajouter des dates selon le statut
    if (status === 'PROCESSING') {
      reportData.processingStartedAt = new Date(createdAt.getTime() + randomInt(1, 5) * 60 * 1000);
    } else if (['COMPLETED', 'FAILED'].includes(status)) {
      reportData.processingStartedAt = new Date(createdAt.getTime() + randomInt(1, 5) * 60 * 1000);
      reportData.completedAt = new Date(reportData.processingStartedAt.getTime() + randomInt(3, 15) * 60 * 1000);
      
      if (status === 'COMPLETED') {
        reportData.pdfPath = `/reports/${symbol.toLowerCase()}-${Date.now()}.pdf`;
        if (reportData.includeApiExport) {
          reportData.csvPath = `/reports/${symbol.toLowerCase()}-${Date.now()}.csv`;
        }
      } else {
        reportData.failureReason = 'Erreur lors de l\'analyse des données de marché';
      }
    }
    
    await prisma.report.create({ data: reportData });
  }
  
  console.log(`✅ ${count} rapports créés`);
}

async function main() {
  console.log('🚀 Début du peuplement de la base de données FinAnalytics\n');
  
  try {
    // Créer les utilisateurs
    const users = await seedUsers(15);
    
    // Créer les abonnements et crédits
    await seedSubscriptionsAndCredits(users);
    
    // Créer les transactions
    await seedCreditTransactions(users, 100);
    
    // Créer les rapports
    await seedReports(users, 50);
    
    console.log('\n✅ Peuplement terminé avec succès!');
    console.log('📊 Données créées:');
    console.log('   - 15 utilisateurs');
    console.log('   - ~10 abonnements');
    console.log('   - 15 comptes crédits');
    console.log('   - 100 transactions');
    console.log('   - 50 rapports');
    
  } catch (error) {
    console.error('❌ Erreur lors du peuplement:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch(console.error);