#!/usr/bin/env python3
"""
Script de test pour vérifier les différents types de rapports
"""

import os
import time
import psycopg2
import psycopg2.extras
from datetime import datetime
import secrets
import string

# URL de la base de données
DATABASE_URL = os.getenv('DATABASE_URL', 'postgresql://admin:@localhost:5433/finance')

def generate_cuid():
    """Génère un CUID simple"""
    return ''.join(secrets.choice(string.ascii_letters + string.digits) for _ in range(25))

def create_test_reports():
    """Crée des rapports de test pour différents types"""
    
    try:
        conn = psycopg2.connect(DATABASE_URL)
        cursor = conn.cursor()
        
        # Types de rapports à tester
        report_types = [
            ('BASELINE', 'Test Baseline Report', 15),
            ('DETAILED', 'Test Detailed Report', 25), 
            ('DEEP_ANALYSIS', 'Test Deep Analysis Report', 35),
            ('BENCHMARK', 'Test Benchmark Report', 20),
            ('PRICER', 'Test Pricer Report', 30)
        ]
        
        # Récupérer un utilisateur de test (prendre le premier)
        cursor.execute('SELECT id FROM "user" LIMIT 1')
        user_id = cursor.fetchone()
        
        if not user_id:
            print("❌ Aucun utilisateur trouvé dans la base")
            return
            
        user_id = user_id[0]
        print(f"📋 Utilisateur de test: {user_id}")
        
        created_reports = []
        
        for report_type, title, credits in report_types:
            # Générer un ID unique
            report_id = generate_cuid()
            
            # Créer le rapport
            cursor.execute("""
                INSERT INTO "reports" (
                    id, "userId", title, "assetType", "assetSymbol", 
                    "reportType", "includeBenchmark", "includeApiExport",
                    "creditsCost", status, "createdAt", "updatedAt"
                ) VALUES (
                    %s, %s, %s, 'STOCK', 'AAPL',
                    %s, false, false,
                    %s, 'PENDING', NOW(), NOW()
                )
            """, (report_id, user_id, title, report_type, credits))
            created_reports.append((report_id, report_type, title))
            print(f"✅ Rapport {report_type} créé: {report_id}")
        
        conn.commit()
        conn.close()
        
        print(f"\n🎯 {len(created_reports)} rapports de test créés")
        print("📋 Liste des rapports:")
        for report_id, report_type, title in created_reports:
            print(f"  - {report_id}: {report_type} ({title})")
        
        print("\n⏳ Attendez quelques minutes que les rapports soient traités...")
        print("💡 Consultez les logs avec: tail -f /Users/admin/Desktop/FinAnalytics/pdf/finanalytics.log")
        
        return created_reports
        
    except Exception as e:
        print(f"❌ Erreur: {e}")
        return []

def check_report_status():
    """Vérifie le statut des rapports"""
    try:
        conn = psycopg2.connect(DATABASE_URL)
        cursor = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
        
        cursor.execute("""
            SELECT id, title, "reportType", status, "pdfPath", "createdAt"
            FROM "reports" 
            WHERE title LIKE 'Test%'
            ORDER BY "createdAt" DESC
            LIMIT 10
        """)
        
        reports = cursor.fetchall()
        
        print(f"\n📊 Statut des rapports de test ({len(reports)} trouvés):")
        for report in reports:
            status_emoji = {
                'PENDING': '⏳',
                'PROCESSING': '🔄', 
                'COMPLETED': '✅',
                'FAILED': '❌'
            }.get(report['status'], '❓')
            
            print(f"  {status_emoji} {report['id']}: {report['reportType']} - {report['status']}")
            if report['pdfPath']:
                print(f"      📄 PDF: {report['pdfPath']}")
        
        conn.close()
        
    except Exception as e:
        print(f"❌ Erreur: {e}")

def check_pdf_sizes():
    """Vérifie les tailles des PDFs générés"""
    try:
        reports_dir = "/Users/admin/Desktop/FinAnalytics/public/reports"
        
        if not os.path.exists(reports_dir):
            print(f"❌ Dossier {reports_dir} introuvable")
            return
        
        print(f"\n📁 PDFs dans {reports_dir}:")
        
        pdf_files = [f for f in os.listdir(reports_dir) if f.endswith('.pdf')]
        pdf_files.sort(key=lambda x: os.path.getmtime(os.path.join(reports_dir, x)), reverse=True)
        
        for pdf_file in pdf_files[:10]:  # 10 plus récents
            file_path = os.path.join(reports_dir, pdf_file)
            file_size = os.path.getsize(file_path) / (1024 * 1024)  # MB
            mod_time = datetime.fromtimestamp(os.path.getmtime(file_path))
            
            # Extraire le type du nom de fichier
            report_type = "UNKNOWN"
            if "BASELINE" in pdf_file:
                report_type = "BASELINE"
            elif "DETAILED" in pdf_file:
                report_type = "DETAILED"
            elif "DEEP_ANALYSIS" in pdf_file:
                report_type = "DEEP_ANALYSIS"
            elif "BENCHMARK" in pdf_file:
                report_type = "BENCHMARK"
            elif "PRICER" in pdf_file:
                report_type = "PRICER"
            
            print(f"  📄 {pdf_file}")
            print(f"      Type: {report_type} | Taille: {file_size:.2f} MB | Modifié: {mod_time}")
            print()
        
    except Exception as e:
        print(f"❌ Erreur: {e}")

if __name__ == "__main__":
    print("🧪 Test des types de rapports FinAnalytics")
    print("=" * 50)
    
    # Créer les rapports de test
    created_reports = create_test_reports()
    
    if created_reports:
        print("\n⏳ Patientez 2-3 minutes pour le traitement...")
        time.sleep(10)  # Attendre un peu
        
        # Vérifier le statut
        check_report_status()
        
        # Vérifier les tailles des PDFs
        check_pdf_sizes()
        
        print("\n💡 Pour surveiller en temps réel:")
        print("    tail -f /Users/admin/Desktop/FinAnalytics/pdf/finanalytics.log")