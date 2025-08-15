# 📊 FinAnalytics PDF - Système Simplifié et Robuste

Un système simple, robuste et efficace pour la génération automatique de rapports financiers PDF.

## 🚀 Démarrage Ultra-Simple

```bash
cd pdf
./start
```

C'est tout ! Le script s'occupe de tout :
- Configuration automatique
- Installation des dépendances
- Menu interactif

## 📋 Menu Principal

```
1) 🧪 Tester le système
2) 📊 Scraper les données  
3) 🔄 Traiter les rapports
4) 🚀 Lancer le daemon complet
5) 📋 Voir le statut
6) ❌ Quitter
```

## 🏗️ Architecture Simplifiée

```
pdf/
├── start                   # 🚀 Script de démarrage unique
├── run.py                  # 🐍 Système Python unifié
├── main.py                 # 📄 Générateur PDF existant
├── charts.py               # 📈 Génération graphiques
├── pdf.py                  # 📋 Création PDF
├── requirements.txt        # 📦 Dépendances
├── venv/                   # 🐍 Environnement Python
├── data/                   # 💾 Données de marché
├── temp_charts/            # 📊 Graphiques temporaires
├── generated_reports/      # 📄 Rapports générés
└── ../public/reports/      # 🌐 Rapports web
```

## 🔧 Fonctionnalités

### 🧪 Tests Système
- ✅ Test de connexion PostgreSQL
- ✅ Test du scraping Yahoo Finance
- ✅ Test de génération PDF

### 📊 Scraping Automatique
- Indices principaux (S&P 500, Dow Jones, NASDAQ)
- Actions populaires (AAPL, MSFT, GOOGL)
- Cryptomonnaies (BTC, ETH)
- Données historiques et informations
- Cache quotidien dans `data/YYYY-MM-DD/`

### 🔄 Traitement des Rapports
- Surveillance continue de la base de données
- Traitement séquentiel des rapports PENDING
- Mise à jour automatique des statuts
- Gestion d'erreurs robuste

### 🚀 Daemon Complet
- Scraping automatique toutes les 6 heures
- Traitement des rapports toutes les 30 secondes
- Logs détaillés dans `finanalytics.log`
- Arrêt propre avec Ctrl+C

## ⚙️ Configuration

Le système se configure automatiquement :

1. **Base de données** : Récupère l'URL depuis `.env` ou `../.env`
2. **Dossiers** : Crée automatiquement tous les dossiers requis
3. **Dépendances** : Installation automatique au premier lancement

## 🐍 Utilisation Avancée

```bash
# Tests
venv/bin/python run.py test

# Scraping unique
venv/bin/python run.py scrape

# Traitement unique
venv/bin/python run.py process

# Daemon background
venv/bin/python run.py daemon

# Statut système
venv/bin/python run.py status
```

## 📊 Workflow Complet

1. **Génération web** : L'utilisateur crée un rapport via l'interface → statut PENDING
2. **Détection** : Le daemon détecte le nouveau rapport
3. **Traitement** : 
   - Statut → PROCESSING
   - Génération du PDF via `main.py`
   - Statut → COMPLETED
4. **Téléchargement** : Rapport disponible via l'API `/api/reports/[id]/download`

## 🔍 Logs et Monitoring

- **Logs système** : `finanalytics.log`
- **Logs temps réel** : Affichage console pendant l'exécution
- **Statut base** : `./start` → option 5

## 🛠️ Dépendances

Installation automatique :
- `yfinance` - Données financières
- `pandas` - Manipulation données
- `psycopg2-binary` - PostgreSQL
- `reportlab` - Génération PDF
- `matplotlib` - Graphiques
- `pillow` - Images
- `requests` - Requêtes HTTP

## 🎯 Avantages du Nouveau Système

- **Simple** : Un seul script `./start`
- **Robuste** : Gestion d'erreurs complète
- **Automatique** : Configuration zéro
- **Léger** : Suppression des dépendances Go/Gum
- **Fiable** : Tests intégrés
- **Portable** : Pure Python

## 🚨 Résolution de Problèmes

### Base de données inaccessible
```bash
./start
# Option 1: Tester le système
# → Affiche l'erreur exacte
```

### Dépendances manquantes
Le script les installe automatiquement au premier lancement.

### Rapports bloqués
```bash
./start
# Option 5: Voir le statut
# → Affiche les rapports en cours
```

---

**Système testé et opérationnel** ✅  
**Prêt pour la production** 🚀