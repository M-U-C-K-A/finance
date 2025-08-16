#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
Smart Report Generator - Router vers les générateurs spécialisés
"""

import os
import sys
import logging
import time
from datetime import datetime

# Import des générateurs spécialisés
from baseline_generator import BaselineReportGenerator
from benchmark_generator import BenchmarkReportGenerator
from detailed_generator import DetailedReportGenerator
from deep_analysis_generator import DeepAnalysisReportGenerator
from pricer_generator import PricerReportGenerator

# Import du système de logs
from report_logger import log_generation_start, log_generation_success, log_generation_error

# Configuration des logs
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class SmartReportGenerator:
    """Router intelligent vers les générateurs spécialisés"""
    
    # Mapping des types de rapports vers les générateurs
    GENERATORS = {
        'BASELINE': BaselineReportGenerator,
        'BENCHMARK': BenchmarkReportGenerator,
        'DETAILED': DetailedReportGenerator,
        'DEEP_ANALYSIS': DeepAnalysisReportGenerator,
        'PRICER': PricerReportGenerator
    }
    
    @staticmethod
    def generate_report(symbol: str, report_type: str, output_path: str, user_id: str = None) -> bool:
        """
        Génère un rapport en utilisant le générateur spécialisé approprié
        
        Args:
            symbol: Symbole boursier
            report_type: Type de rapport (BASELINE, BENCHMARK, DETAILED, DEEP_ANALYSIS, PRICER)
            output_path: Chemin de sortie du PDF
            user_id: ID utilisateur (optionnel)
            
        Returns:
            bool: True si succès, False sinon
        """
        start_time = time.time()
        
        # Log du début
        log_generation_start(symbol, report_type, user_id)
        
        try:
            logger.info(f"🚀 Génération rapport {report_type} pour {symbol}")
            logger.info(f"📁 Chemin de sortie: {output_path}")
            logger.info(f"📂 Répertoire de travail: {os.getcwd()}")
            
            # Validation du type de rapport
            if report_type not in SmartReportGenerator.GENERATORS:
                error_msg = f"Type de rapport non supporté: {report_type}"
                logger.error(f"❌ {error_msg}")
                logger.info(f"Types supportés: {list(SmartReportGenerator.GENERATORS.keys())}")
                log_generation_error(symbol, report_type, error_msg, time.time() - start_time, user_id)
                return False
            
            # Validation du symbole
            if not symbol or len(symbol) < 1:
                error_msg = f"Symbole invalide: {symbol}"
                logger.error(f"❌ {error_msg}")
                log_generation_error(symbol, report_type, error_msg, time.time() - start_time, user_id)
                return False
            
            # Validation du chemin de sortie
            output_dir = os.path.dirname(output_path)
            if output_dir and not os.path.exists(output_dir):
                logger.info(f"📁 Création du répertoire: {output_dir}")
                os.makedirs(output_dir, exist_ok=True)
            
            # Récupération du générateur approprié
            logger.info(f"🏭 Utilisation du générateur: {SmartReportGenerator.GENERATORS[report_type].__name__}")
            generator_class = SmartReportGenerator.GENERATORS[report_type]
            
            # Création et exécution du générateur
            logger.info(f"🔨 Création de l'instance du générateur...")
            generator = generator_class(symbol, output_path)
            
            logger.info(f"⚙️ Lancement de la génération...")
            success = generator.generate_report()
            
            duration = time.time() - start_time
            
            if success:
                # Vérification que le fichier a bien été créé
                if os.path.exists(output_path):
                    file_size = os.path.getsize(output_path)
                    logger.info(f"✅ Rapport {report_type} généré avec succès: {output_path} ({file_size} bytes)")
                    log_generation_success(symbol, report_type, output_path, file_size, duration, user_id)
                else:
                    error_msg = "Le fichier PDF n'a pas été créé"
                    logger.error(f"❌ {error_msg}: {output_path}")
                    log_generation_error(symbol, report_type, error_msg, duration, user_id)
                    return False
            else:
                error_msg = "Échec génération rapport"
                logger.error(f"❌ {error_msg} {report_type}")
                log_generation_error(symbol, report_type, error_msg, duration, user_id)
                
            return success
            
        except ImportError as e:
            error_msg = f"Erreur d'importation: {e}"
            logger.error(f"❌ {error_msg}")
            logger.error("Vérifiez que toutes les dépendances sont installées (pip install -r requirements.txt)")
            log_generation_error(symbol, report_type, error_msg, time.time() - start_time, user_id)
            return False
        except Exception as e:
            error_msg = f"Erreur génération: {e}"
            logger.error(f"❌ {error_msg}")
            logger.error(f"Type d'erreur: {type(e).__name__}")
            import traceback
            logger.error(f"Traceback: {traceback.format_exc()}")
            log_generation_error(symbol, report_type, error_msg, time.time() - start_time, user_id)
            return False
    
    @staticmethod
    def get_available_types():
        """Retourne la liste des types de rapports disponibles"""
        return list(SmartReportGenerator.GENERATORS.keys())
    
    @staticmethod
    def get_type_description(report_type: str) -> str:
        """Retourne la description d'un type de rapport"""
        descriptions = {
            'BASELINE': 'Analyse fondamentale complète (20-25 pages)',
            'BENCHMARK': 'Analyse comparative avec benchmarks (15-20 pages)',
            'DETAILED': 'Analyse technique et fondamentale détaillée (25-30 pages)',
            'DEEP_ANALYSIS': 'Recherche quantitative exhaustive (30-35 pages)',
            'PRICER': 'Évaluation et pricing d\'options (15-20 pages)'
        }
        return descriptions.get(report_type, 'Description non disponible')

def main():
    """Point d'entrée principal pour l'exécution en ligne de commande"""
    if len(sys.argv) < 4 or len(sys.argv) > 5:
        print("Usage: python smart_report_generator.py <SYMBOL> <TYPE> <OUTPUT_PATH> [USER_ID]")
        print(f"Types disponibles: {SmartReportGenerator.get_available_types()}")
        sys.exit(1)
    
    symbol = sys.argv[1]
    report_type = sys.argv[2].upper()
    output_path = sys.argv[3]
    user_id = sys.argv[4] if len(sys.argv) > 4 else None
    
    # Génération du rapport
    success = SmartReportGenerator.generate_report(symbol, report_type, output_path, user_id)
    
    if success:
        print(f"✅ Rapport généré avec succès: {output_path}")
        sys.exit(0)
    else:
        print(f"❌ Échec de la génération du rapport")
        sys.exit(1)

if __name__ == "__main__":
    main()