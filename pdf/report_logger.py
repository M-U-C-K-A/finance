#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
Système de logs formaté pour les rapports FinAnalytics
"""

import os
import json
import logging
from datetime import datetime
from pathlib import Path

class ReportLogger:
    """Logger spécialisé pour les rapports avec format propre"""
    
    def __init__(self, log_file="finanalytics_reports.log"):
        self.log_file = Path(log_file)
        self.setup_logger()
    
    def setup_logger(self):
        """Configure le logger"""
        # Créer le répertoire de logs s'il n'existe pas
        self.log_file.parent.mkdir(parents=True, exist_ok=True)
        
        # Configuration du logger principal
        self.logger = logging.getLogger('FinAnalytics')
        self.logger.setLevel(logging.INFO)
        
        # Supprimer les handlers existants
        for handler in self.logger.handlers[:]:
            self.logger.removeHandler(handler)
        
        # Handler pour fichier avec format personnalisé
        file_handler = logging.FileHandler(self.log_file, encoding='utf-8')
        file_handler.setLevel(logging.INFO)
        
        # Format personnalisé pour le fichier
        file_formatter = logging.Formatter(
            '%(asctime)s | %(message)s',
            datefmt='%Y-%m-%d %H:%M:%S'
        )
        file_handler.setFormatter(file_formatter)
        
        self.logger.addHandler(file_handler)
    
    def log_generation_start(self, symbol: str, report_type: str, user_id: str = None):
        """Log le début d'une génération"""
        message = f"🚀 DÉBUT | {report_type} | {symbol}"
        if user_id:
            message += f" | User: {user_id}"
        self.logger.info(message)
    
    def log_generation_success(self, symbol: str, report_type: str, output_path: str, 
                             file_size: int, duration: float, user_id: str = None):
        """Log une génération réussie"""
        size_mb = file_size / (1024 * 1024)
        message = f"✅ SUCCÈS | {report_type} | {symbol} | {size_mb:.1f}MB | {duration:.1f}s | {output_path}"
        if user_id:
            message += f" | User: {user_id}"
        self.logger.info(message)
    
    def log_generation_error(self, symbol: str, report_type: str, error: str, 
                           duration: float = None, user_id: str = None):
        """Log une erreur de génération"""
        message = f"❌ ÉCHEC | {report_type} | {symbol} | Erreur: {error}"
        if duration:
            message += f" | {duration:.1f}s"
        if user_id:
            message += f" | User: {user_id}"
        self.logger.info(message)
    
    def log_api_request(self, endpoint: str, user_id: str, params: dict):
        """Log une requête API"""
        params_str = json.dumps(params, ensure_ascii=False)
        message = f"📡 API | {endpoint} | User: {user_id} | Params: {params_str}"
        self.logger.info(message)
    
    def log_credit_deduction(self, user_id: str, credits: int, report_type: str, symbol: str):
        """Log une déduction de crédits"""
        message = f"💳 CRÉDITS | -{credits} | {report_type} | {symbol} | User: {user_id}"
        self.logger.info(message)
    
    def log_system_info(self, message: str):
        """Log une information système"""
        self.logger.info(f"ℹ️ SYSTÈME | {message}")
    
    def log_warning(self, message: str):
        """Log un avertissement"""
        self.logger.info(f"⚠️ ATTENTION | {message}")
    
    def get_recent_logs(self, lines: int = 50) -> list:
        """Récupère les logs récents"""
        try:
            if not self.log_file.exists():
                return []
            
            with open(self.log_file, 'r', encoding='utf-8') as f:
                all_lines = f.readlines()
                return [line.strip() for line in all_lines[-lines:]]
        except Exception as e:
            return [f"Erreur lecture logs: {e}"]
    
    def get_success_stats(self, hours: int = 24) -> dict:
        """Récupère les statistiques de succès sur les dernières heures"""
        try:
            if not self.log_file.exists():
                return {"total": 0, "success": 0, "errors": 0, "success_rate": 0}
            
            now = datetime.now()
            cutoff = now.timestamp() - (hours * 3600)
            
            total = 0
            success = 0
            errors = 0
            
            with open(self.log_file, 'r', encoding='utf-8') as f:
                for line in f:
                    try:
                        # Extraire le timestamp
                        timestamp_str = line.split(' | ')[0]
                        log_time = datetime.strptime(timestamp_str, '%Y-%m-%d %H:%M:%S')
                        
                        if log_time.timestamp() >= cutoff:
                            if "DÉBUT |" in line:
                                total += 1
                            elif "✅ SUCCÈS |" in line:
                                success += 1
                            elif "❌ ÉCHEC |" in line:
                                errors += 1
                    except:
                        continue
            
            success_rate = (success / total * 100) if total > 0 else 0
            
            return {
                "total": total,
                "success": success,
                "errors": errors,
                "success_rate": round(success_rate, 1)
            }
        except Exception as e:
            return {"error": str(e)}

# Instance globale
report_logger = ReportLogger()

def log_generation_start(symbol: str, report_type: str, user_id: str = None):
    """Fonction helper pour log début"""
    report_logger.log_generation_start(symbol, report_type, user_id)

def log_generation_success(symbol: str, report_type: str, output_path: str, 
                         file_size: int, duration: float, user_id: str = None):
    """Fonction helper pour log succès"""
    report_logger.log_generation_success(symbol, report_type, output_path, file_size, duration, user_id)

def log_generation_error(symbol: str, report_type: str, error: str, 
                       duration: float = None, user_id: str = None):
    """Fonction helper pour log erreur"""
    report_logger.log_generation_error(symbol, report_type, error, duration, user_id)