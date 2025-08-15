#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
FinAnalytics PDF System - Système simplifié et robuste
Un seul script pour tout gérer : scraping, traitement et interface
"""

import os
import sys
import time
import json
import logging
import argparse
import threading
from datetime import datetime
from pathlib import Path

# Configuration automatique de l'environnement
def setup_environment():
    """Configure automatiquement l'environnement"""
    
    # Créer les dossiers nécessaires
    dirs = ['data', 'temp_charts', 'generated_reports', '../public/reports']
    for d in dirs:
        Path(d).mkdir(parents=True, exist_ok=True)
    
    # Récupérer l'URL de la base de données
    db_url = None
    for env_file in ['.env', '../.env']:
        if os.path.exists(env_file):
            with open(env_file, 'r') as f:
                for line in f:
                    if line.startswith('DATABASE_URL='):
                        db_url = line.split('=', 1)[1].strip().strip('"')
                        break
    
    if not db_url:
        db_url = 'postgresql://admin:@localhost:5433/finance'
    
    # Créer le fichier .env local
    with open('.env', 'w') as f:
        f.write(f'DATABASE_URL="{db_url}"\n')
    
    return db_url

# Logging configuration
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('finanalytics.log'),
        logging.StreamHandler()
    ]
)

logger = logging.getLogger(__name__)

class FinAnalyticsSystem:
    
    def __init__(self):
        self.db_url = setup_environment()
        self.running = False
        logger.info("🚀 FinAnalytics PDF System initialisé")
        logger.info(f"📊 Base de données: {self.db_url}")
    
    def test_system(self):
        """Test rapide du système"""
        logger.info("🧪 Tests système...")
        
        try:
            # Test base de données
            import psycopg2
            conn = psycopg2.connect(self.db_url)
            cursor = conn.cursor()
            cursor.execute('SELECT COUNT(*) FROM "reports"')
            count = cursor.fetchone()[0]
            conn.close()
            logger.info(f"✅ Base de données OK - {count} rapports")
        except Exception as e:
            logger.error(f"❌ Base de données: {e}")
            return False
        
        try:
            # Test scraping
            import yfinance as yf
            ticker = yf.Ticker("AAPL")
            info = ticker.info
            if info:
                logger.info("✅ Scraping OK")
            else:
                raise Exception("Pas de données")
        except Exception as e:
            logger.error(f"❌ Scraping: {e}")
            return False
        
        try:
            # Test PDF
            from reportlab.lib.pagesizes import A4
            from reportlab.platypus import SimpleDocTemplate
            test_file = "test.pdf"
            doc = SimpleDocTemplate(test_file, pagesize=A4)
            doc.build([])
            os.remove(test_file)
            logger.info("✅ PDF OK")
        except Exception as e:
            logger.error(f"❌ PDF: {e}")
            return False
        
        logger.info("🎉 Tous les tests OK!")
        return True
    
    def scrape_data(self):
        """Scrape les données de marché"""
        logger.info("📊 Début du scraping...")
        
        try:
            import yfinance as yf
            import pandas as pd
            
            # Tickers principaux
            tickers = ['AAPL', 'MSFT', 'GOOGL', '^GSPC', '^DJI', 'BTC-USD', 'ETH-USD']
            
            today = datetime.now().strftime("%Y-%m-%d")
            data_dir = Path('data') / today
            data_dir.mkdir(exist_ok=True)
            
            success = 0
            for ticker in tickers:
                try:
                    stock = yf.Ticker(ticker)
                    hist = stock.history(period="5d")
                    info = stock.info
                    
                    if not hist.empty:
                        hist.to_csv(data_dir / f"{ticker}_history.csv")
                        
                    if info:
                        with open(data_dir / f"{ticker}_info.json", 'w') as f:
                            json.dump(info, f, indent=2, default=str)
                    
                    success += 1
                    logger.info(f"✅ {ticker} OK")
                    time.sleep(1)  # Rate limiting
                    
                except Exception as e:
                    logger.error(f"❌ {ticker}: {e}")
            
            logger.info(f"📊 Scraping terminé: {success}/{len(tickers)} OK")
            return success > 0
            
        except Exception as e:
            logger.error(f"❌ Erreur scraping: {e}")
            return False
    
    def process_reports(self):
        """Traite les rapports en attente"""
        logger.info("🔄 Début du traitement des rapports...")
        
        try:
            import psycopg2
            import psycopg2.extras
            
            conn = psycopg2.connect(self.db_url)
            cursor = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
            
            # Récupérer les rapports PENDING
            cursor.execute("""
                SELECT id, "userId", "assetSymbol", title, "reportType"
                FROM "reports" 
                WHERE status = 'PENDING'
                ORDER BY "createdAt" ASC
                LIMIT 10
            """)
            
            reports = cursor.fetchall()
            
            if not reports:
                logger.info("📋 Aucun rapport en attente")
                conn.close()
                return True
            
            for report in reports:
                try:
                    logger.info(f"🔄 Traitement rapport {report['id']} ({report['assetSymbol']})")
                    
                    # Marquer comme en cours
                    cursor.execute("""
                        UPDATE "reports" 
                        SET status = 'PROCESSING', "processingStartedAt" = NOW(), "updatedAt" = NOW()
                        WHERE id = %s
                    """, (report['id'],))
                    conn.commit()
                    
                    # Générer le PDF réel
                    pdf_path = self.generate_real_pdf(report)
                    
                    if not pdf_path:
                        raise Exception("Échec de génération PDF")
                    
                    cursor.execute("""
                        UPDATE "reports" 
                        SET status = 'COMPLETED', "completedAt" = NOW(), "pdfPath" = %s, "updatedAt" = NOW()
                        WHERE id = %s
                    """, (pdf_path, report['id']))
                    conn.commit()
                    
                    logger.info(f"✅ Rapport {report['id']} terminé")
                    
                except Exception as e:
                    logger.error(f"❌ Erreur rapport {report['id']}: {e}")
                    cursor.execute("""
                        UPDATE "reports" 
                        SET status = 'FAILED', "failureReason" = %s, "updatedAt" = NOW()
                        WHERE id = %s
                    """, (str(e), report['id']))
                    conn.commit()
            
            conn.close()
            logger.info(f"🔄 Traitement terminé: {len(reports)} rapports traités")
            return True
            
        except Exception as e:
            logger.error(f"❌ Erreur traitement: {e}")
            return False
    
    def run_daemon(self):
        """Lance le daemon de traitement"""
        logger.info("🚀 Démarrage du daemon FinAnalytics")
        self.running = True
        
        last_scrape = 0
        scrape_interval = 6 * 3600  # 6 heures
        
        while self.running:
            try:
                # Traitement des rapports (toutes les 30 secondes)
                self.process_reports()
                
                # Scraping (toutes les 6 heures)
                now = time.time()
                if now - last_scrape > scrape_interval:
                    self.scrape_data()
                    last_scrape = now
                
                time.sleep(30)
                
            except KeyboardInterrupt:
                logger.info("🛑 Arrêt demandé par l'utilisateur")
                self.running = False
            except Exception as e:
                logger.error(f"❌ Erreur daemon: {e}")
                time.sleep(60)  # Attendre avant de retry
    
    def generate_real_pdf(self, report):
        """Génère un PDF selon le type de rapport demandé"""
        try:
            # Déterminer le type de rapport
            report_type = report.get('reportType', 'SIMPLE')
            symbol = report['assetSymbol']
            
            logger.info(f"📄 Génération PDF type {report_type} pour {symbol}")
            
            # Générer le timestamp et nom de fichier
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            
            # Nom de fichier selon le type
            type_prefix = {
                'SIMPLE': 'SIMPLE_RAPPORT',
                'COMPLETE': 'ULTRA_RAPPORT', 
                'BENCHMARK': 'BENCHMARK_RAPPORT',
                'PRICER': 'PRICER_RAPPORT'
            }
            
            pdf_filename = f"{type_prefix.get(report_type, 'RAPPORT')}_{symbol}_{timestamp}.pdf"
            
            # Créer dans le dossier public pour que l'API puisse le servir
            public_reports_dir = Path("../public/reports")
            public_reports_dir.mkdir(parents=True, exist_ok=True)
            
            pdf_path = public_reports_dir / pdf_filename
            
            # Sélectionner le générateur approprié
            if report_type == 'SIMPLE':
                success = self.generate_simple_pdf(report, str(pdf_path))
            elif report_type == 'COMPLETE':
                from ultra_premium_pdf_generator import UltraPremiumPDFGenerator
                generator = UltraPremiumPDFGenerator(symbol, str(pdf_path))
                success = generator.run_complete_analysis()
            elif report_type == 'BENCHMARK':
                success = self.generate_benchmark_pdf(report, str(pdf_path))
            elif report_type == 'PRICER':
                success = self.generate_pricer_pdf(report, str(pdf_path))
            else:
                # Fallback au générateur complet
                from ultra_premium_pdf_generator import UltraPremiumPDFGenerator
                generator = UltraPremiumPDFGenerator(symbol, str(pdf_path))
                success = generator.run_complete_analysis()
            
            if not success:
                raise Exception(f"Échec de l'analyse {report_type}")
            
            # Vérifier que le fichier a été créé
            if not pdf_path.exists():
                raise Exception("Le fichier PDF n'a pas été créé")
            
            logger.info(f"✅ PDF {report_type} généré: {pdf_filename}")
            logger.info(f"📊 Taille du fichier: {pdf_path.stat().st_size / 1024 / 1024:.2f} MB")
            
            # Retourner le nom du fichier (pas le chemin complet)
            return pdf_filename
            
        except Exception as e:
            logger.error(f"❌ Erreur génération PDF ultra-complet: {e}")
            
            # Fallback vers l'ancien système si nécessaire
            try:
                logger.info("🔄 Fallback vers l'ancien générateur...")
                return self.generate_fallback_pdf(report)
            except:
                return None

    def generate_fallback_pdf(self, report):
        """Générateur PDF de secours (ancien système)"""
        try:
            import yfinance as yf
            from simple_charts import create_charts
            from simple_pdf import generate_pdf_report
            
            symbol = report['assetSymbol']
            logger.info(f"📄 Génération PDF fallback pour {symbol}")
            
            # Récupérer les données
            stock = yf.Ticker(symbol)
            hist = stock.history(period="5y")
            info = stock.info
            
            if hist.empty:
                raise Exception(f"Pas de données pour {symbol}")
            
            # Données pour le rapport
            data = {
                'ticker': symbol,
                'info': info,
                'history': hist,
                'financials': None,
                'balance_sheet': None,
                'cashflow': None
            }
            
            # Essayer de récupérer les données financières (optionnel)
            try:
                data['financials'] = stock.financials
                data['balance_sheet'] = stock.balance_sheet
                data['cashflow'] = stock.cashflow
            except:
                pass  # Pas grave si ça échoue
            
            # Créer les graphiques
            charts_path = create_charts(data)
            
            # Générer le PDF
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            pdf_filename = f"rapport_fallback_{symbol}_{timestamp}.pdf"
            
            # Créer dans le dossier public pour que l'API puisse le servir
            public_reports_dir = Path("../public/reports")
            public_reports_dir.mkdir(parents=True, exist_ok=True)
            
            pdf_path = public_reports_dir / pdf_filename
            
            # Générer le PDF
            report_data = {
                'symbol': symbol,
                'company_name': info.get('longName', symbol),
                'report_date': datetime.now().strftime("%d/%m/%Y"),
                'current_price': float(hist['Close'].iloc[-1]),
                'charts_path': charts_path,
                'period_return': ((hist['Close'].iloc[-1] / hist['Close'].iloc[0]) - 1) * 100
            }
            
            generate_pdf_report(report_data, str(pdf_path))
            
            logger.info(f"✅ PDF fallback généré: {pdf_filename}")
            
            # Retourner le nom du fichier (pas le chemin complet)
            return pdf_filename
            
        except Exception as e:
            logger.error(f"❌ Erreur génération PDF fallback: {e}")
            return None
    
    def generate_simple_pdf(self, report, pdf_path):
        """Génère un rapport simple (8-10 pages)"""
        try:
            from premium_pdf_generator import PremiumPDFGenerator
            
            symbol = report['assetSymbol']
            logger.info(f"📄 Génération PDF SIMPLE pour {symbol}")
            
            # Utiliser le générateur premium mais en mode simple
            generator = PremiumPDFGenerator(symbol, pdf_path)
            return generator.run_simple_analysis()
            
        except Exception as e:
            logger.error(f"❌ Erreur génération PDF simple: {e}")
            return False
    
    def generate_benchmark_pdf(self, report, pdf_path):
        """Génère un rapport avec comparaisons benchmark"""
        try:
            from ultra_premium_pdf_generator import UltraPremiumPDFGenerator
            
            symbol = report['assetSymbol']
            selected_benchmarks = report.get('selectedBenchmarks', [])
            
            logger.info(f"📄 Génération PDF BENCHMARK pour {symbol} vs {selected_benchmarks}")
            
            # Créer le générateur avec benchmarks
            generator = UltraPremiumPDFGenerator(symbol, pdf_path)
            return generator.run_benchmark_analysis(selected_benchmarks)
            
        except Exception as e:
            logger.error(f"❌ Erreur génération PDF benchmark: {e}")
            return False
    
    def generate_pricer_pdf(self, report, pdf_path):
        """Génère un rapport avec modèles de pricing avancés"""
        try:
            from ultra_premium_pdf_generator import UltraPremiumPDFGenerator
            
            symbol = report['assetSymbol']
            pricing_params = report.get('customPricingParams', {})
            
            logger.info(f"📄 Génération PDF PRICER pour {symbol}")
            
            # Créer le générateur avec paramètres de pricing
            generator = UltraPremiumPDFGenerator(symbol, pdf_path)
            return generator.run_pricer_analysis(pricing_params)
            
        except Exception as e:
            logger.error(f"❌ Erreur génération PDF pricer: {e}")
            return False
    
    def show_status(self):
        """Affiche le statut du système"""
        logger.info("📋 Statut du système FinAnalytics")
        
        try:
            import psycopg2
            conn = psycopg2.connect(self.db_url)
            cursor = conn.cursor()
            
            # Statistiques des rapports
            cursor.execute("""
                SELECT status, COUNT(*) 
                FROM "reports" 
                GROUP BY status
            """)
            stats = cursor.fetchall()
            
            logger.info("📊 Statistiques des rapports:")
            for status, count in stats:
                logger.info(f"  {status}: {count}")
            
            # Derniers rapports
            cursor.execute("""
                SELECT id, "assetSymbol", status, "createdAt"
                FROM "reports" 
                ORDER BY "createdAt" DESC 
                LIMIT 5
            """)
            recent = cursor.fetchall()
            
            logger.info("📋 Derniers rapports:")
            for row in recent:
                logger.info(f"  {row[1]} ({row[2]}) - {row[3]}")
            
            conn.close()
            
        except Exception as e:
            logger.error(f"❌ Erreur statut: {e}")

def main():
    parser = argparse.ArgumentParser(description='FinAnalytics PDF System')
    parser.add_argument('action', choices=['test', 'scrape', 'process', 'daemon', 'status'], 
                       help='Action à exécuter')
    
    args = parser.parse_args()
    
    system = FinAnalyticsSystem()
    
    if args.action == 'test':
        success = system.test_system()
        sys.exit(0 if success else 1)
    
    elif args.action == 'scrape':
        success = system.scrape_data()
        sys.exit(0 if success else 1)
    
    elif args.action == 'process':
        success = system.process_reports()
        sys.exit(0 if success else 1)
    
    elif args.action == 'daemon':
        system.run_daemon()
    
    elif args.action == 'status':
        system.show_status()

if __name__ == "__main__":
    main()