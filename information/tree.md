# 🌳 FinAnalytics - Project Structure

## 📋 Table des Matières
- [Vue d'ensemble](#vue-densemble)
- [Structure détaillée](#structure-détaillée)
- [Description des dossiers](#description-des-dossiers)
- [Fichiers de configuration](#fichiers-de-configuration)
- [Conventions de nommage](#conventions-de-nommage)

---

## 🏗️ Vue d'ensemble

**Architecture** : Next.js 15 App Router + PostgreSQL + Python Backend  
**Pattern** : Monorepo avec services découplés  
**Deployment** : Vercel (Frontend) + VPS (Backend)

```
FinAnalytics/
├── 🎨 Frontend (Next.js)        # Interface utilisateur web
├── 🗄️ Database (Prisma)         # Schéma et migrations
├── 🐍 Backend (Python)          # Génération PDF et scraping
├── 📄 Documentation             # Guides et spécifications
└── ⚙️ Configuration             # Settings et environnement
```

---

## 📁 Structure Détaillée

```
FinAnalytics/
│
├── 📱 app/                           # Next.js 15 App Router
│   ├── (app)/                       # Routes protégées (dashboard)
│   │   ├── admin/                   # Interface admin
│   │   │   ├── access/              # Gestion accès utilisateurs
│   │   │   ├── reports/             # Supervision rapports
│   │   │   └── page.tsx            # Dashboard admin principal
│   │   ├── api/                     # Routes API publiques
│   │   │   ├── access/             # API gestion accès
│   │   │   └── page.tsx           # API explorer
│   │   ├── credits/                 # Gestion crédits
│   │   │   ├── loading.tsx         # Skeleton credits
│   │   │   └── page.tsx           # Page crédits
│   │   ├── plan/                    # Abonnements et tarifs
│   │   │   ├── buy-credits/        # Achat crédits one-time
│   │   │   ├── manage/             # Gestion abonnement
│   │   │   └── page.tsx           # Sélection de plan
│   │   ├── reports/                 # Gestion des rapports
│   │   │   ├── generate/           # Création nouveau rapport
│   │   │   ├── history/            # Historique et téléchargements
│   │   │   └── schedule/           # Programmation automatique
│   │   ├── settings/                # Paramètres utilisateur
│   │   │   ├── api-keys/           # Gestion clés API
│   │   │   ├── profile/            # Profil utilisateur
│   │   │   └── page.tsx           # Settings généraux
│   │   ├── layout.tsx              # Layout dashboard avec navigation
│   │   ├── loading.tsx             # Loading global dashboard
│   │   └── page.tsx               # Dashboard principal
│   │
│   ├── (home)/                      # Routes publiques (landing)
│   │   ├── auth/                   # Authentification
│   │   │   ├── reset-password/     # Réinitialisation mot de passe
│   │   │   ├── signin/             # Connexion
│   │   │   ├── signup/             # Inscription
│   │   │   └── verify-email/       # Vérification email
│   │   ├── legal/                  # Pages légales
│   │   │   ├── privacy/            # Politique de confidentialité
│   │   │   ├── terms/              # Conditions d'utilisation
│   │   │   └── cookies/            # Politique cookies
│   │   ├── demo/                   # Démonstration produit
│   │   ├── pricing/                # Page tarifs publique
│   │   ├── layout.tsx              # Layout public avec header/footer
│   │   └── page.tsx               # Landing page principale
│   │
│   ├── api/                         # API Routes Server-Side
│   │   ├── auth/                   # Better Auth endpoints
│   │   │   └── [...auth]/          # Gestion auth complète
│   │   ├── reports/                # API rapports
│   │   │   ├── [id]/               # Actions sur rapport spécifique
│   │   │   │   ├── download/       # Téléchargement PDF sécurisé
│   │   │   │   └── route.ts       # CRUD rapport individuel
│   │   │   ├── generate/           # Création nouveau rapport
│   │   │   ├── history/            # Historique utilisateur
│   │   │   └── schedule/           # Gestion programmation
│   │   ├── credits/                # API gestion crédits
│   │   │   ├── balance/            # Consultation solde
│   │   │   ├── purchase/           # Achat crédits
│   │   │   └── transactions/       # Historique transactions
│   │   ├── subscriptions/          # API abonnements
│   │   │   ├── create/             # Création abonnement
│   │   │   ├── manage/             # Gestion/annulation
│   │   │   └── webhooks/           # Webhooks Polar
│   │   ├── users/                  # API utilisateurs
│   │   │   ├── profile/            # Gestion profil
│   │   │   ├── preferences/        # Préférences utilisateur
│   │   │   └── api-keys/           # Gestion clés API
│   │   └── health/                 # Health check API
│   │
│   ├── globals.css                 # Styles globaux Tailwind
│   ├── layout.tsx                  # Root layout avec providers
│   ├── loading.tsx                 # Loading page global
│   ├── not-found.tsx              # Page 404 custom
│   └── error.tsx                  # Error boundary global
│
├── 🧩 src/                          # Code source partagé
│   ├── components/                 # Composants React réutilisables
│   │   ├── ui/                     # shadcn/ui base components
│   │   │   ├── button.tsx          # Bouton personnalisé
│   │   │   ├── card.tsx            # Cartes et containers
│   │   │   ├── form.tsx            # Composants formulaires
│   │   │   ├── input.tsx           # Champs de saisie
│   │   │   ├── select.tsx          # Sélecteurs
│   │   │   ├── table.tsx           # Tableaux
│   │   │   ├── toast.tsx           # Notifications
│   │   │   └── ...                 # Autres composants UI
│   │   ├── auth/                   # Composants authentification
│   │   │   ├── signin-form.tsx     # Formulaire connexion
│   │   │   ├── signup-form.tsx     # Formulaire inscription
│   │   │   ├── reset-form.tsx      # Reset password
│   │   │   └── auth-provider.tsx   # Context auth
│   │   ├── dashboard/              # Composants dashboard
│   │   │   ├── sidebar.tsx         # Navigation latérale
│   │   │   ├── stats-cards.tsx     # Cartes statistiques
│   │   │   ├── recent-reports.tsx  # Rapports récents
│   │   │   └── activity-feed.tsx   # Flux d'activité
│   │   ├── reports/                # Composants rapports
│   │   │   ├── report-generator-form.tsx  # Formulaire création
│   │   │   ├── reports-history.tsx        # Historique avec filtres
│   │   │   ├── report-card.tsx            # Carte rapport
│   │   │   ├── download-button.tsx        # Bouton téléchargement
│   │   │   └── status-badge.tsx           # Badge statut
│   │   ├── credits/                # Composants crédits
│   │   │   ├── balance-display.tsx # Affichage solde
│   │   │   ├── purchase-modal.tsx  # Modal achat
│   │   │   └── transaction-list.tsx # Liste transactions
│   │   ├── home/                   # Composants landing page
│   │   │   ├── header.tsx          # En-tête navigation
│   │   │   ├── hero.tsx            # Section héro classique
│   │   │   ├── animated-hero.tsx   # Hero avec animations GSAP
│   │   │   ├── animated-stats.tsx  # Statistiques animées
│   │   │   ├── animated-features.tsx # Features avec animations
│   │   │   ├── testimonials.tsx    # Témoignages clients
│   │   │   ├── pricing.tsx         # Section tarifs
│   │   │   ├── faq.tsx             # Questions fréquentes
│   │   │   ├── contact.tsx         # Formulaire contact
│   │   │   └── footer.tsx          # Pied de page
│   │   └── admin/                  # Composants admin
│   │       ├── user-management.tsx # Gestion utilisateurs
│   │       ├── analytics-dashboard.tsx # Analytics admin
│   │       └── system-health.tsx   # Santé système
│   │
│   ├── lib/                        # Utilitaires et configuration
│   │   ├── auth.ts                 # Configuration Better Auth server
│   │   ├── auth-client.ts          # Client auth hooks
│   │   ├── auth-server.ts          # Server auth utilities
│   │   ├── prisma.ts               # Client Prisma configuré
│   │   ├── polar.ts                # Configuration Polar SDK
│   │   ├── credits.ts              # Logique gestion crédits
│   │   ├── api-middleware.ts       # Middleware API commun
│   │   ├── validations.ts          # Schémas Zod validation
│   │   ├── utils.ts                # Fonctions utilitaires
│   │   ├── constants.ts            # Constantes application
│   │   └── types.ts                # Types TypeScript
│   │
│   └── styles/                     # Styles CSS
│       ├── globals.css             # Styles globaux
│       └── components.css          # Styles composants
│
├── 🗄️ prisma/                       # Base de données
│   ├── schema.prisma               # Schéma principal unifié
│   ├── seed.ts                     # Données de développement
│   └── migrations/                 # Migrations versionnées
│       ├── 20240807221403_init/    # Migration initiale
│       ├── 20240810233903_better_auth/ # Better Auth setup
│       └── 20240815030202_fix_user_role/ # Fix rôles utilisateur
│
├── 🐍 pdf/                          # Backend Python
│   ├── run.py                      # Système unifié principal
│   ├── start                       # Script démarrage simplifié
│   ├── simple_charts.py            # Génération graphiques
│   ├── simple_pdf.py               # Génération PDF
│   ├── requirements.txt            # Dépendances Python
│   ├── venv/                       # Environnement virtuel
│   ├── data/                       # Données scrapées
│   │   └── YYYY-MM-DD/            # Par date
│   ├── temp_charts/                # Graphiques temporaires
│   ├── generated_reports/          # PDFs temporaires
│   ├── finanalytics.log           # Logs système
│   ├── README.md                   # Documentation backend
│   └── SYSTEM_STATUS.md           # Statut du système
│
├── 📄 information/                  # Documentation projet
│   ├── roadmap.md                  # Roadmap et fonctionnalités
│   ├── database.md                 # Architecture base de données
│   ├── tree.md                     # Structure projet (ce fichier)
│   ├── api.md                      # Documentation API
│   └── deployment.md               # Guide de déploiement
│
├── 🌐 public/                       # Assets statiques
│   ├── reports/                    # PDFs générés publics
│   ├── images/                     # Images et illustrations
│   ├── icons/                      # Icônes et logos
│   ├── favicon.ico                 # Favicon
│   ├── robots.txt                  # Robots SEO
│   ├── sitemap.xml                 # Sitemap automatique
│   └── manifest.json              # PWA manifest
│
├── ⚙️ Configuration files
│   ├── package.json                # Dépendances Node.js
│   ├── pnpm-lock.yaml             # Lock file pnpm
│   ├── tsconfig.json               # Configuration TypeScript
│   ├── tailwind.config.ts          # Configuration Tailwind CSS
│   ├── next.config.js              # Configuration Next.js
│   ├── .env                        # Variables d'environnement
│   ├── .env.example                # Template environnement
│   ├── .gitignore                  # Fichiers ignorés Git
│   ├── .eslintrc.json              # Configuration ESLint
│   ├── .prettierrc                 # Configuration Prettier
│   └── README.md                   # Documentation principale
│
└── 📝 Metadata files
    ├── CLAUDE.md                   # Instructions Claude Code
    ├── LICENSE                     # Licence du projet
    └── CHANGELOG.md                # Historique des versions
```

---

## 📖 Description des Dossiers

### 🎨 **Frontend (app/ + src/)**

#### **App Router Structure**
- **(app)/** : Routes protégées nécessitant authentification
- **(home)/** : Routes publiques accessibles à tous
- **api/** : API Routes server-side pour logique métier

#### **Components Organization**
- **ui/** : Composants UI réutilisables (Design System)
- **feature/** : Composants métier spécifiques (auth, reports, etc.)
- **layout/** : Composants de mise en page

#### **Lib Structure**
- **Configuration** : Auth, DB, external services
- **Business Logic** : Credits, validations, utilities
- **Types** : TypeScript definitions

### 🗄️ **Database (prisma/)**

#### **Schema Management**
- **schema.prisma** : Source unique de vérité
- **migrations/** : Changements versionnés automatiques
- **seed.ts** : Données de développement et tests

### 🐍 **Backend Python (pdf/)**

#### **Simplified Architecture**
- **run.py** : Point d'entrée unifié (600 lignes)
- **Modules** : Charts, PDF generation, data scraping
- **Data** : Structured by date, automatic cleanup
- **Logs** : Structured logging with rotation

### 📄 **Documentation (information/)**

#### **Comprehensive Guides**
- **Technical** : Architecture, database, API
- **Business** : Roadmap, features, requirements
- **Operational** : Deployment, monitoring, troubleshooting

---

## 🔧 Fichiers de Configuration

### **Frontend Configuration**
```typescript
// next.config.js
{
  experimental: { appDir: true },
  images: { domains: ['logo.clearbit.com'] },
  env: { POLAR_ACCESS_TOKEN: process.env.POLAR_ACCESS_TOKEN }
}

// tailwind.config.ts
{
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: { extend: { colors: { primary: "..." } } }
}
```

### **Database Configuration**
```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgres"
  url      = env("DATABASE_URL")
}
```

### **Backend Configuration**
```python
# pdf/requirements.txt
yfinance>=0.2.18
pandas>=2.0.0
psycopg2-binary>=2.9.0
reportlab>=4.0.0
matplotlib>=3.7.0
```

---

## 📏 Conventions de Nommage

### **Files & Folders**
- **kebab-case** : Dossiers et fichiers (`user-profile`, `api-keys`)
- **PascalCase** : Composants React (`UserProfile.tsx`)
- **camelCase** : Fonctions et variables (`getUserCredits`)
- **UPPER_CASE** : Constantes (`API_BASE_URL`)

### **Database**
- **camelCase** : Champs Prisma (`userId`, `createdAt`)
- **PascalCase** : Modèles (`User`, `Report`)
- **UPPER_CASE** : Enums (`USER_ROLE`, `REPORT_STATUS`)

### **API Routes**
- **RESTful** : `/api/reports/{id}/download`
- **Hierarchical** : `/api/users/{id}/credits/transactions`
- **Versioning** : `/api/v1/reports` (pour futures versions)

### **Git Commits**
```
feat: add user profile management
fix: resolve PDF download issue
docs: update API documentation
refactor: simplify auth middleware
test: add unit tests for credits
chore: update dependencies
```

---

## 🚀 Performance & Optimization

### **Frontend**
- **Code Splitting** : Automatic par route
- **Image Optimization** : Next.js Image component
- **Bundle Analysis** : `@next/bundle-analyzer`
- **Caching** : SWR pour data fetching

### **Backend**
- **Database** : Index optimisés, requêtes N+1 évitées
- **API** : Response caching, rate limiting
- **Files** : CDN pour assets statiques
- **Monitoring** : Structured logging, health checks

### **Build Process**
```bash
# Development
pnpm dev          # Hot reload frontend
cd pdf && ./start # Backend avec interface

# Production
pnpm build        # Optimized build
pnpm start        # Production server
```

---

## 📊 Metrics & Monitoring

### **Key Directories to Monitor**
- **`public/reports/`** : Taille des PDFs générés
- **`pdf/data/`** : Cache des données de marché
- **`prisma/migrations/`** : Évolution du schéma
- **`app/api/`** : Performance des endpoints

### **Log Locations**
- **Frontend** : Vercel logs ou stdout local
- **Backend** : `pdf/finanalytics.log`
- **Database** : PostgreSQL logs
- **Système** : journalctl ou logs serveur

---

*Dernière mise à jour : Août 2025*  
*Version : 1.0.0*  
*Généré automatiquement avec Claude Code*