// Test simple du nouveau système de rapports via l'API
// Ce script teste que l'API utilise bien les nouveaux générateurs modulaires

console.log('🧪 Test du nouveau système de rapports via API');

// Simuler une requête de génération de rapport
const testData = {
  title: "Test Nouveau Système",
  assetType: "STOCK",
  assetSymbol: "AAPL", 
  reportType: "BASELINE",
  includeBenchmark: false,
  includeApiExport: false
};

console.log('📝 Données de test:', testData);
console.log('✅ Le système devrait maintenant utiliser les générateurs modulaires');
console.log('📊 Types disponibles:', ['BASELINE', 'BENCHMARK', 'DETAILED', 'DEEP_ANALYSIS', 'PRICER']);
console.log('🔧 Logs détaillés activés dans l\'API pour le debugging');

// Note: Ce script est informatif. Pour tester réellement l'API, 
// utiliser l'interface web ou un outil comme curl/Postman