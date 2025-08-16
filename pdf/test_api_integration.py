#!/usr/bin/env python3
"""
Script de test pour diagnostiquer l'intégration API du nouveau système de rapports
"""

import os
import sys
import subprocess
import json
from datetime import datetime

def test_report_generation():
    """Test la génération de rapports comme l'API le ferait"""
    
    print("🔍 Test d'intégration API du système de rapports")
    print(f"📂 Répertoire de travail: {os.getcwd()}")
    
    # Paramètres de test
    symbol = "AAPL"
    report_type = "BASELINE"
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    output_path = f"public/reports/TEST_{report_type}_{symbol}_{timestamp}.pdf"
    
    print(f"🎯 Test: {report_type} pour {symbol}")
    print(f"📁 Sortie: {output_path}")
    
    # S'assurer que le répertoire existe
    os.makedirs("public/reports", exist_ok=True)
    
    # Test 1: Vérifier que smart_report_generator.py existe
    smart_gen_path = "pdf/smart_report_generator.py"
    if not os.path.exists(smart_gen_path):
        print(f"❌ Fichier non trouvé: {smart_gen_path}")
        return False
    
    print(f"✅ Fichier trouvé: {smart_gen_path}")
    
    # Test 2: Vérifier les imports
    print("🔍 Test des imports...")
    try:
        sys.path.insert(0, 'pdf')
        from smart_report_generator import SmartReportGenerator
        print("✅ Import SmartReportGenerator réussi")
        
        # Tester les générateurs spécialisés
        from baseline_generator import BaselineReportGenerator
        from benchmark_generator import BenchmarkReportGenerator
        print("✅ Import générateurs spécialisés réussi")
        
    except ImportError as e:
        print(f"❌ Erreur import: {e}")
        return False
    
    # Test 3: Tester la génération via la classe
    print("🔨 Test génération via classe...")
    try:
        success = SmartReportGenerator.generate_report(symbol, report_type, output_path)
        if success:
            print("✅ Génération via classe réussie")
            if os.path.exists(output_path):
                size = os.path.getsize(output_path)
                print(f"📄 Fichier créé: {output_path} ({size} bytes)")
            else:
                print(f"❌ Fichier non créé: {output_path}")
                return False
        else:
            print("❌ Génération via classe échouée")
            return False
    except Exception as e:
        print(f"❌ Erreur génération classe: {e}")
        return False
    
    # Test 4: Tester via subprocess (comme l'API)
    print("🔄 Test génération via subprocess...")
    try:
        result = subprocess.run([
            'python3', 
            smart_gen_path,
            symbol,
            report_type,
            f"public/reports/SUBPROCESS_{report_type}_{symbol}_{timestamp}.pdf"
        ], 
        cwd=os.getcwd(),
        capture_output=True,
        text=True,
        timeout=120
        )
        
        print(f"🔍 Code de retour: {result.returncode}")
        if result.stdout:
            print(f"📊 STDOUT:\n{result.stdout}")
        if result.stderr:
            print(f"❌ STDERR:\n{result.stderr}")
            
        if result.returncode == 0:
            print("✅ Génération via subprocess réussie")
        else:
            print(f"❌ Génération via subprocess échouée (code {result.returncode})")
            return False
            
    except subprocess.TimeoutExpired:
        print("❌ Timeout du subprocess")
        return False
    except Exception as e:
        print(f"❌ Erreur subprocess: {e}")
        return False
    
    print("🎉 Tous les tests sont passés avec succès!")
    return True

def check_environment():
    """Vérifie l'environnement Python"""
    print("🔍 Vérification de l'environnement...")
    
    # Version Python
    print(f"🐍 Python: {sys.version}")
    
    # Modules requis
    required_modules = [
        'yfinance', 'pandas', 'numpy', 'matplotlib', 'seaborn', 
        'reportlab', 'sklearn', 'scipy'
    ]
    
    for module in required_modules:
        try:
            __import__(module)
            print(f"✅ {module}")
        except ImportError:
            print(f"❌ {module} (manquant)")
    
    # Répertoires
    dirs_to_check = ['pdf', 'public', 'public/reports']
    for dir_path in dirs_to_check:
        if os.path.exists(dir_path):
            print(f"✅ Répertoire: {dir_path}")
        else:
            print(f"❌ Répertoire manquant: {dir_path}")

if __name__ == "__main__":
    print("=" * 60)
    print("🧪 TEST D'INTÉGRATION SYSTÈME DE RAPPORTS")
    print("=" * 60)
    
    # Vérification environnement
    check_environment()
    print("\n" + "=" * 60)
    
    # Test génération
    success = test_report_generation()
    
    print("\n" + "=" * 60)
    if success:
        print("🎉 TOUS LES TESTS SONT PASSÉS!")
    else:
        print("❌ CERTAINS TESTS ONT ÉCHOUÉ!")
    print("=" * 60)