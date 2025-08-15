# API Documentation - FinAnalytics

## Architecture API

FinAnalytics propose une API REST complète permettant l'intégration dans des systèmes tiers et l'automatisation des analyses financières.

### 🔑 Authentification

L'API utilise un système d'authentification basé sur des clés API et la vérification d'abonnement.

```typescript
// Headers requis
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json
```

### 📊 Endpoints Principaux

#### Génération de Rapports

**POST** `/api/reports/generate`
```json
{
  "assetSymbol": "AAPL",
  "assetType": "STOCK", 
  "reportType": "DEEP",
  "options": {
    "includeBenchmark": true,
    "includeApiExport": true
  }
}
```

**Réponse:**
```json
{
  "id": "cuid_report_id",
  "status": "PENDING",
  "estimatedTime": "2-3 minutes",
  "creditsCost": 5
}
```

#### Récupération de Rapports

**GET** `/api/reports/{id}`
```json
{
  "id": "cuid_report_id",
  "status": "COMPLETED",
  "assetSymbol": "AAPL",
  "reportType": "DEEP",
  "pdfPath": "rapport_AAPL_20250815.pdf",
  "data": {
    "currentPrice": 175.43,
    "marketCap": "2.75T",
    "peRatio": 29.8,
    "analysis": "...",
    "signals": [...]
  }
}
```

**GET** `/api/reports/{id}/download`
- Télécharge le PDF du rapport
- Content-Type: `application/pdf`

#### Historique des Rapports

**GET** `/api/reports/history?limit=50&status=COMPLETED`
```json
{
  "reports": [...],
  "totalCount": 150,
  "stats": {
    "completed": 145,
    "pending": 3,
    "failed": 2
  }
}
```

#### Gestion des Crédits

**GET** `/api/user/credits`
```json
{
  "balance": 45,
  "plan": "PROFESSIONAL",
  "apiAccess": true,
  "usage": {
    "thisMonth": 15,
    "allTime": 234
  }
}
```

### 🔧 Types de Données

#### AssetType
```typescript
type AssetType = "STOCK" | "ETF" | "INDEX" | "CRYPTO" | "FOREX" | "COMMODITY"
```

#### ReportType
```typescript
type ReportType = "BASELINE" | "DETAILED" | "DEEP" | "CUSTOM"
```

#### Status
```typescript
type ReportStatus = "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED"
```

### 📈 Tarification API

| Plan | Crédits/mois | API Access | Coût par rapport |
|------|-------------|-------------|------------------|
| FREE | 10 | ❌ | - |
| STARTER | 100 | ✅ | 1-3 crédits |
| PRO | 500 | ✅ | 1-5 crédits |
| ENTERPRISE | Illimité | ✅ | 1-5 crédits |

### ⚡ Rate Limiting

- **Limite générale**: 100 requêtes/minute
- **Génération rapports**: 10 requêtes/minute
- **Téléchargements**: 50 requêtes/minute

### 🛡️ Codes d'Erreur

| Code | Description |
|------|-------------|
| 401 | Non authentifié |
| 402 | Crédits insuffisants |
| 403 | Accès API requis (abonnement) |
| 429 | Rate limit dépassé |
| 500 | Erreur serveur |

### 📝 Exemples d'Usage

#### Python
```python
import requests

headers = {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
}

# Générer un rapport
response = requests.post(
    'https://api.finanalytics.app/api/reports/generate',
    headers=headers,
    json={
        'assetSymbol': 'AAPL',
        'assetType': 'STOCK',
        'reportType': 'DEEP'
    }
)

report_id = response.json()['id']

# Télécharger le PDF
pdf_response = requests.get(
    f'https://api.finanalytics.app/api/reports/{report_id}/download',
    headers=headers
)

with open('rapport_aapl.pdf', 'wb') as f:
    f.write(pdf_response.content)
```

#### JavaScript/Node.js
```javascript
const axios = require('axios');

const api = axios.create({
  baseURL: 'https://api.finanalytics.app',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  }
});

// Générer et télécharger un rapport
async function generateReport(symbol) {
  try {
    const report = await api.post('/api/reports/generate', {
      assetSymbol: symbol,
      assetType: 'STOCK',
      reportType: 'DETAILED'
    });
    
    console.log(`Rapport ${report.data.id} en cours de génération...`);
    return report.data.id;
  } catch (error) {
    console.error('Erreur:', error.response.data);
  }
}
```

### 🔄 Webhooks (Bientôt disponible)

Configuration de webhooks pour recevoir des notifications en temps réel lors de la completion des rapports.

```json
{
  "url": "https://your-app.com/webhooks/finanalytics",
  "events": ["report.completed", "report.failed"],
  "secret": "webhook_secret"
}
```