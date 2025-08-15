# Guide de Déploiement - FinAnalytics

## 🚀 Déploiement Production

### Prérequis

- Node.js 18+ 
- PostgreSQL 14+
- Python 3.9+ (pour le générateur PDF)
- Domaine avec certificat SSL
- Service email (Resend recommandé)

### 📋 Checklist de Déploiement

#### 1. Variables d'Environnement

```bash
# Base de données
DATABASE_URL="postgresql://user:password@host:5432/finanalytics"

# Authentification
NEXTAUTH_SECRET="your-secret-key-32-chars"
NEXTAUTH_URL="https://your-domain.com"

# OAuth Providers
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-secret"
GITHUB_ID="your-github-client-id"
GITHUB_SECRET="your-github-secret"

# Email (Resend)
RESEND_API_KEY="re_your-resend-key"

# Paiements (Polar)
POLAR_ACCESS_TOKEN="your-polar-token"
POLAR_WEBHOOK_SECRET="your-webhook-secret"

# APIs Externes
ALPHA_VANTAGE_API_KEY="your-alphavantage-key"
FINANCIAL_MODELING_PREP_KEY="your-fmp-key"

# AI/ML
OPENAI_API_KEY="your-openai-key"  # Optional
ANTHROPIC_API_KEY="your-anthropic-key"  # Optional
```

#### 2. Base de Données

```bash
# Migration initiale
pnpm prisma migrate deploy
pnpm prisma generate

# Seed data (optionnel)
pnpm prisma db seed
```

#### 3. Build et Tests

```bash
# Tests unitaires
pnpm test

# Tests d'intégration
pnpm test:e2e

# Build production
pnpm build

# Vérification des types
pnpm type-check
```

### 🌐 Plateformes de Déploiement

#### Vercel (Recommandé)

```bash
# Installation Vercel CLI
npm i -g vercel

# Configuration
vercel --prod

# Variables d'environnement
vercel env add DATABASE_URL production
vercel env add NEXTAUTH_SECRET production
# ... autres variables
```

**vercel.json:**
```json
{
  "env": {
    "DATABASE_URL": "@database-url"
  },
  "build": {
    "env": {
      "NEXT_TELEMETRY_DISABLED": "1"
    }
  },
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 30
    }
  }
}
```

#### Docker

**Dockerfile:**
```dockerfile
FROM node:18-alpine AS base

# Dependencies
FROM base AS deps
WORKDIR /app
COPY package*.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile

# Build
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm install -g pnpm && \
    pnpm prisma generate && \
    pnpm build

# Runtime
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT=3000

CMD ["node", "server.js"]
```

**docker-compose.yml:**
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/finanalytics
      - NEXTAUTH_URL=https://your-domain.com
    depends_on:
      - db
      - redis

  db:
    image: postgres:14-alpine
    environment:
      POSTGRES_DB: finanalytics
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  pdf-worker:
    build:
      context: .
      dockerfile: pdf/Dockerfile
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/finanalytics
    depends_on:
      - db
    volumes:
      - ./public/reports:/app/public/reports

volumes:
  postgres_data:
```

#### Railway

```bash
# Installation Railway CLI
npm install -g @railway/cli

# Login et déploiement
railway login
railway project create
railway add --database postgresql
railway deploy
```

### 🐍 Déploiement PDF Worker

Le service Python pour la génération PDF peut être déployé séparément.

**pdf/Dockerfile:**
```dockerfile
FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

ENV PYTHONPATH=/app
ENV DATABASE_URL=""

CMD ["python", "run.py"]
```

**Déploiement sur Railway/Render:**
```bash
# Variables d'environnement PDF Worker
DATABASE_URL="same-as-main-app"
REPORTS_PATH="/app/public/reports"
LOG_LEVEL="INFO"
```

### 📊 Monitoring et Observabilité

#### Sentry (Erreurs)

```javascript
// sentry.client.config.ts
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 0.1,
  environment: process.env.NODE_ENV,
});
```

#### OpenTelemetry (Métriques)

```javascript
// instrumentation.ts
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('./instrumentation.node')
  }
}
```

#### Health Checks

```typescript
// app/api/health/route.ts
export async function GET() {
  const checks = {
    database: await checkDatabase(),
    pdfWorker: await checkPdfWorker(),
    externalApis: await checkExternalApis()
  };
  
  const healthy = Object.values(checks).every(Boolean);
  
  return Response.json(checks, { 
    status: healthy ? 200 : 503 
  });
}
```

### 🔐 Sécurité Production

#### Rate Limiting

```typescript
// middleware.ts
import { Ratelimit } from "@upstash/ratelimit";

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const ip = request.ip ?? '127.0.0.1';
    const { success } = await ratelimit.limit(ip);
    
    if (!success) {
      return new Response('Too Many Requests', { status: 429 });
    }
  }
}
```

#### Headers de Sécurité

```javascript
// next.config.js
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  }
];
```

### 📈 Performance

#### Optimisations Build

```javascript
// next.config.js
module.exports = {
  experimental: {
    turbo: true,
    serverComponentsExternalPackages: ['prisma']
  },
  images: {
    domains: ['avatars.githubusercontent.com'],
    formats: ['image/avif', 'image/webp']
  },
  compress: true,
  poweredByHeader: false
};
```

#### CDN et Cache

- Utiliser Vercel Edge Network ou CloudFlare
- Cache statique: 1 an pour assets
- Cache API: 5 minutes pour données publiques
- Cache PDF: 24h avec invalidation

### 🔄 CI/CD Pipeline

**GitHub Actions (.github/workflows/deploy.yml):**

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 18
      - run: npm install -g pnpm
      - run: pnpm install
      - run: pnpm prisma generate
      - run: pnpm lint
      - run: pnpm type-check
      - run: pnpm test

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm install -g pnpm
      - run: pnpm install
      - run: pnpm build
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-args: '--prod'
```

### 📝 Checklist Final

- [ ] Variables d'environnement configurées
- [ ] Base de données migrée
- [ ] DNS pointé vers l'application  
- [ ] SSL/HTTPS activé
- [ ] Monitoring configuré (Sentry, logs)
- [ ] Sauvegardes automatiques DB
- [ ] Rate limiting activé
- [ ] Worker PDF déployé
- [ ] Tests de bout en bout passés
- [ ] Documentation mise à jour