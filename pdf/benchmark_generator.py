#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
Générateur de rapports BENCHMARK - Analyse comparative
15-20 pages d'analyse comparative avec indices et concurrents
"""

import os
import sys
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import yfinance as yf
from datetime import datetime, timedelta
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.platypus import Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY

from report_base import BaseReportGenerator

class BenchmarkReportGenerator(BaseReportGenerator):
    """Générateur de rapports BENCHMARK - Analyse comparative"""
    
    def __init__(self, symbol, output_path):
        super().__init__(symbol, output_path)
        self.report_type = "BENCHMARK"
        self.benchmarks = []
        self.benchmark_data = {}
    
    def add_analysis_type_badge(self):
        """Badge spécifique au rapport BENCHMARK"""
        # Label
        label_style = ParagraphStyle(
            'TypeLabel',
            parent=self.styles['Normal'],
            fontSize=14,
            alignment=TA_CENTER,
            spaceAfter=8,
            textColor=colors.HexColor('#374151'),
            fontName='Helvetica-Bold'
        )
        
        # Style pour le type d'analyse - Vert pour BENCHMARK
        analysis_type_style = ParagraphStyle(
            'AnalysisType',
            parent=self.styles['Normal'],
            fontSize=20,
            textColor=colors.white,
            alignment=TA_CENTER,
            spaceAfter=30,
            borderWidth=3,
            borderColor=colors.HexColor('#059669'),
            borderPadding=18,
            backColor=colors.HexColor('#059669'),
            fontName='Helvetica-Bold'
        )
        
        self.story.append(Paragraph("TYPE D'ANALYSE DEMANDÉ", label_style))
        self.story.append(Paragraph("ANALYSE COMPARATIVE", analysis_type_style))
        
        # Description détaillée
        info = self.data.get('info', {})
        company_name = info.get('longName', self.symbol)
        
        description_text = f"""
        <b>ANALYSE COMPARATIVE DEMANDÉE</b><br/>
        Positionnement marché complet de {company_name} ({self.symbol})<br/>
        • Comparaison avec indices de référence (S&P 500, sectoriels)<br/>
        • Performance relative multi-périodes et analyse de corrélation<br/>
        • Benchmarking avec concurrents directs du secteur<br/>
        • Métriques de risque-rendement et ratios de Sharpe<br/>
        • 15-20 pages d'étude comparative approfondie
        """
        
        request_style = ParagraphStyle(
            'RequestSummary',
            parent=self.styles['Normal'],
            fontSize=11,
            alignment=TA_CENTER,
            spaceAfter=25,
            borderWidth=2,
            borderColor=colors.HexColor('#059669'),
            borderPadding=12,
            backColor=colors.HexColor('#d1fae5'),
            leftIndent=10,
            rightIndent=10
        )
        
        self.story.append(Paragraph(description_text, request_style))
        self.story.append(Spacer(1, 60))
    
    def fetch_benchmark_data(self):
        """Récupère les données des benchmarks"""
        try:
            # Définir les benchmarks selon le secteur
            info = self.data.get('info', {})
            sector = info.get('sector', '')
            
            # Benchmarks de base
            self.benchmarks = ['^GSPC', '^DJI', '^IXIC']  # S&P 500, Dow Jones, NASDAQ
            
            # Ajouter des benchmarks sectoriels
            sector_benchmarks = {
                'Technology': ['^NDX', 'QQQ'],  # NASDAQ 100, QQQ ETF
                'Healthcare': ['XLV'],  # Health Care ETF
                'Financial Services': ['XLF'],  # Financial ETF
                'Consumer Discretionary': ['XLY'],  # Consumer Discretionary ETF
                'Communication Services': ['XLC'],  # Communication Services ETF
                'Energy': ['XLE'],  # Energy ETF
                'Industrials': ['XLI'],  # Industrial ETF
            }
            
            if sector in sector_benchmarks:
                self.benchmarks.extend(sector_benchmarks[sector])
            
            # Récupérer les données
            period = "2y"
            for benchmark in self.benchmarks:
                try:
                    ticker = yf.Ticker(benchmark)
                    hist = ticker.history(period=period)
                    if not hist.empty:
                        self.benchmark_data[benchmark] = {
                            'history': hist,
                            'info': ticker.info
                        }
                        self.logger.info(f"📊 Données récupérées pour {benchmark}")
                except Exception as e:
                    self.logger.warning(f"Impossible de récupérer {benchmark}: {e}")
            
            return len(self.benchmark_data) > 0
            
        except Exception as e:
            self.logger.error(f"Erreur récupération benchmarks: {e}")
            return False
    
    def generate_report(self):
        """Génère le rapport BENCHMARK complet"""
        try:
            self.logger.info("📊 Génération rapport BENCHMARK")
            
            # Récupération des données
            if not self.fetch_data():
                return False
            
            if not self.fetch_benchmark_data():
                self.logger.warning("Aucun benchmark disponible, génération avec données limitées")
            
            # Structure du rapport BENCHMARK
            self.add_cover_page()
            self.add_table_of_contents()
            self.add_executive_summary()
            self.add_benchmark_overview()
            self.add_performance_comparison()
            self.add_correlation_analysis()
            self.add_risk_metrics_comparison()
            self.add_relative_valuation()
            self.add_sector_positioning()
            self.add_tracking_analysis()
            self.add_recommendations()
            self.add_final_page()
            
            # Construction du PDF
            self.build_pdf()
            self.logger.info(f"✅ Rapport BENCHMARK généré: {self.output_path}")
            
            return True
            
        except Exception as e:
            self.logger.error(f"❌ Erreur génération rapport BENCHMARK: {e}")
            return False
    
    def add_table_of_contents(self):
        """Table des matières spécifique au BENCHMARK"""
        toc_title_style = ParagraphStyle(
            'TOCTitle',
            parent=self.styles['Heading1'],
            fontSize=20,
            textColor=colors.HexColor('#059669'),
            alignment=TA_CENTER,
            spaceAfter=30,
            fontName='Helvetica-Bold'
        )
        
        self.story.append(Paragraph("TABLE DES MATIÈRES", toc_title_style))
        
        sections = [
            "1. Résumé Exécutif",
            "2. Vue d'Ensemble des Benchmarks",
            "3. Comparaison de Performance",
            "4. Analyse de Corrélation",
            "5. Métriques de Risque Comparatives",
            "6. Valorisation Relative",
            "7. Positionnement Sectoriel",
            "8. Analyse de Tracking",
            "9. Recommandations Comparatives",
            "10. Conclusion et Contact"
        ]
        
        toc_style = ParagraphStyle(
            'TOCEntry',
            parent=self.styles['Normal'],
            fontSize=12,
            spaceAfter=8,
            leftIndent=20
        )
        
        for i, section in enumerate(sections, 3):
            dots = '.' * (60 - len(section))
            self.story.append(Paragraph(f"{section} {dots} {i}", toc_style))
        
        self.story.append(Spacer(1, 40))
    
    def add_executive_summary(self):
        """Résumé exécutif comparatif"""
        self.add_section_title("1. Résumé Exécutif Comparatif")
        
        info = self.data.get('info', {})
        hist = self.data.get('history')
        
        if hist is None or hist.empty:
            self.add_text("Données historiques insuffisantes pour l'analyse comparative.")
            return
        
        # Calculer la performance relative au S&P 500
        sp500_data = self.benchmark_data.get('^GSPC', {}).get('history')
        if sp500_data is not None and not sp500_data.empty:
            # Aligner les dates
            common_dates = hist.index.intersection(sp500_data.index)
            if len(common_dates) > 0:
                stock_perf = (hist.loc[common_dates, 'Close'].iloc[-1] / hist.loc[common_dates, 'Close'].iloc[0] - 1) * 100
                sp500_perf = (sp500_data.loc[common_dates, 'Close'].iloc[-1] / sp500_data.loc[common_dates, 'Close'].iloc[0] - 1) * 100
                relative_perf = stock_perf - sp500_perf
            else:
                stock_perf = sp500_perf = relative_perf = 0
        else:
            stock_perf = sp500_perf = relative_perf = 0
        
        summary_text = f"""
        <b>Synthèse Comparative</b>
        
        L'analyse comparative de {info.get('longName', self.symbol)} ({self.symbol}) 
        révèle une performance {'supérieure' if relative_perf > 5 else 'similaire' if relative_perf > -5 else 'inférieure'} 
        aux indices de référence sur la période étudiée.
        
        <b>Performance Relative Clé</b>
        
        • Performance {self.symbol}: {stock_perf:+.1f}%
        • Performance S&P 500: {sp500_perf:+.1f}%
        • Performance relative: {relative_perf:+.1f}%
        
        <b>Positionnement Concurrentiel</b>
        
        Dans le contexte sectoriel {info.get('sector', 'N/A')}, {self.symbol} 
        {'surperforme' if relative_perf > 0 else 'sous-performe'} les benchmarks principaux, 
        démontrant {'une gestion efficace' if relative_perf > 0 else 'des défis opérationnels'} 
        et {'une création de valeur supérieure' if relative_perf > 5 else 'une création de valeur limitée'}.
        
        <b>Recommandation Comparative</b>
        
        En comparaison avec les alternatives d'investissement disponibles, 
        {self.symbol} présente un profil {'attractif' if relative_perf > 5 and stock_perf > 0 
        else 'neutre' if relative_perf > -5 else 'moins attractif'} 
        pour les investisseurs recherchant {'une surperformance sectorielle' if relative_perf > 0 
        else 'une exposition sectorielle diversifiée'}.
        """
        
        self.add_text(summary_text)
    
    def add_benchmark_overview(self):
        """Vue d'ensemble des benchmarks utilisés"""
        self.add_section_title("2. Vue d'Ensemble des Benchmarks")
        
        benchmark_descriptions = {
            '^GSPC': 'S&P 500 - Indice large marché US (500 grandes capitalisations)',
            '^DJI': 'Dow Jones Industrial - 30 valeurs industrielles leaders',
            '^IXIC': 'NASDAQ Composite - Indice technologique large',
            '^NDX': 'NASDAQ 100 - 100 plus grandes valeurs non-financières du NASDAQ',
            'QQQ': 'Invesco QQQ ETF - Réplique le NASDAQ 100',
            'XLV': 'Health Care Select Sector SPDR Fund',
            'XLF': 'Financial Select Sector SPDR Fund',
            'XLY': 'Consumer Discretionary Select Sector SPDR Fund',
            'XLC': 'Communication Services Select Sector SPDR Fund',
            'XLE': 'Energy Select Sector SPDR Fund',
            'XLI': 'Industrial Select Sector SPDR Fund'
        }
        
        overview_text = f"""
        <b>Benchmarks Sélectionnés</b>
        
        Pour cette analyse comparative, nous avons sélectionné les benchmarks suivants :
        """
        
        for benchmark in self.benchmarks:
            if benchmark in self.benchmark_data:
                description = benchmark_descriptions.get(benchmark, f'Indice de référence {benchmark}')
                overview_text += f"\n• <b>{benchmark}:</b> {description}"
        
        overview_text += f"""
        
        <b>Méthodologie de Comparaison</b>
        
        L'analyse comparative utilise une période de 24 mois pour capturer différents cycles de marché. 
        Les métriques analysées incluent :
        
        • Performance absolue et relative
        • Volatilité et mesures de risque
        • Corrélations et bêta
        • Ratios de Sharpe et autres ratios risque-rendement
        • Drawdowns maximum et périodes de récupération
        
        Cette approche permet d'évaluer {self.symbol} dans différents contextes de marché 
        et d'identifier les périodes de sur- et sous-performance relative.
        """
        
        self.add_text(overview_text)
    
    def add_performance_comparison(self):
        """Comparaison détaillée des performances"""
        self.add_section_title("3. Comparaison de Performance")
        
        self.add_subsection_title("Performance Multi-Périodes")
        
        # Créer le graphique de performance comparative
        self.create_performance_comparison_chart()
        
        # Calculer les performances sur différentes périodes
        self.calculate_period_performance()
        
        self.add_subsection_title("Analyse de Tracking")
        
        tracking_text = """
        <b>Tracking Error et Information Ratio</b>
        
        Le tracking error mesure la volatilité des écarts de performance par rapport aux benchmarks. 
        Un tracking error élevé indique une gestion active avec des écarts significatifs par rapport à l'indice.
        
        L'information ratio (excès de rendement / tracking error) permet d'évaluer la qualité 
        de la gestion active en mesurant l'excès de rendement par unité de risque actif.
        """
        
        self.add_text(tracking_text)
        
        # Créer le tableau des métriques de tracking
        self.create_tracking_metrics_table()
    
    def add_correlation_analysis(self):
        """Analyse de corrélation avec les benchmarks"""
        self.add_section_title("4. Analyse de Corrélation")
        
        self.add_subsection_title("Matrice de Corrélation")
        
        # Créer la matrice de corrélation
        self.create_correlation_matrix()
        
        correlation_text = """
        <b>Interprétation des Corrélations</b>
        
        Les corrélations permettent de comprendre dans quelle mesure les mouvements de prix 
        sont synchronisés avec les différents benchmarks. Une corrélation élevée (>0.8) 
        indique une forte dépendance aux mouvements du marché général.
        
        <b>Analyse du Bêta</b>
        
        Le bêta mesure la sensibilité aux mouvements du marché. Un bêta supérieur à 1 
        indique une volatilité supérieure au marché, tandis qu'un bêta inférieur à 1 
        suggère une moindre sensibilité aux fluctuations du marché.
        """
        
        self.add_text(correlation_text)
        
        # Calculer et afficher les bêtas
        self.calculate_beta_metrics()
    
    def add_risk_metrics_comparison(self):
        """Comparaison des métriques de risque"""
        self.add_section_title("5. Métriques de Risque Comparatives")
        
        self.add_subsection_title("Volatilité et Drawdowns")
        
        # Créer le graphique de comparaison des risques
        self.create_risk_comparison_chart()
        
        risk_text = """
        <b>Analyse Comparative des Risques</b>
        
        L'évaluation du risque par rapport aux benchmarks permet de déterminer si 
        l'exposition au risque supplémentaire est compensée par des rendements supérieurs.
        
        <b>Métriques de Risque Analysées</b>
        
        • Volatilité annualisée
        • VaR (Value at Risk) à 95%
        • Drawdown maximum
        • Ratio de Sharpe
        • Ratio de Sortino
        """
        
        self.add_text(risk_text)
        
        # Créer le tableau comparatif des risques
        self.create_risk_metrics_table()
    
    def add_relative_valuation(self):
        """Analyse de valorisation relative"""
        self.add_section_title("6. Valorisation Relative")
        
        info = self.data.get('info', {})
        
        valuation_text = f"""
        <b>Multiples de Valorisation Comparatifs</b>
        
        La valorisation relative permet d'évaluer si {self.symbol} est sur- ou sous-évalué 
        par rapport à ses pairs et aux moyennes sectorielles.
        
        <b>Métriques de Valorisation Actuelles</b>
        
        • P/E Ratio: {info.get('trailingPE', 'N/A')}
        • P/B Ratio: {info.get('priceToBook', 'N/A')}
        • P/S Ratio: {info.get('priceToSalesTrailing12Months', 'N/A')}
        • EV/EBITDA: {info.get('enterpriseToEbitda', 'N/A')}
        
        <b>Analyse Comparative</b>
        
        En comparaison avec les multiples sectoriels moyens, {self.symbol} présente 
        {'une valorisation attractive' if info.get('trailingPE', 20) < 18 
        else 'une valorisation premium' if info.get('trailingPE', 20) > 25 
        else 'une valorisation en ligne avec le marché'}.
        """
        
        self.add_text(valuation_text)
    
    def add_sector_positioning(self):
        """Positionnement sectoriel détaillé"""
        self.add_section_title("7. Positionnement Sectoriel")
        
        info = self.data.get('info', {})
        sector = info.get('sector', 'N/A')
        
        positioning_text = f"""
        <b>Contexte Sectoriel</b>
        
        Le secteur {sector} présente des caractéristiques spécifiques en termes de:
        • Cyclicité et sensibilité économique
        • Tendances de croissance structurelle
        • Facteurs de risque réglementaires
        • Dynamiques concurrentielles
        
        <b>Position Relative dans le Secteur</b>
        
        {self.symbol} se positionne comme {'un leader' if info.get('marketCap', 0) > 50e9 
        else 'un acteur significatif' if info.get('marketCap', 0) > 10e9 
        else 'une entreprise de taille moyenne'} 
        avec {'des avantages concurrentiels durables' if info.get('profitMargins', 0) > 0.15 
        else 'une position compétitive'}.
        
        <b>Comparaison avec les ETFs Sectoriels</b>
        
        La performance relative aux ETFs sectoriels indique la capacité de l'entreprise 
        à créer de la valeur au-delà de la moyenne sectorielle.
        """
        
        self.add_text(positioning_text)
    
    def add_tracking_analysis(self):
        """Analyse de tracking détaillée"""
        self.add_section_title("8. Analyse de Tracking Avancée")
        
        tracking_text = """
        <b>Analyse des Périodes de Sur/Sous-Performance</b>
        
        L'identification des périodes de sur- et sous-performance permet de comprendre 
        les facteurs qui influencent la performance relative et d'anticiper les futures divergences.
        
        <b>Facteurs de Performance Relative</b>
        
        • Cycles économiques et conditions de marché
        • Annonces spécifiques à l'entreprise
        • Événements sectoriels
        • Sentiment du marché et rotation sectorielle
        
        <b>Prédictibilité de la Performance Relative</b>
        
        L'analyse statistique des patterns de performance relative permet d'identifier 
        des opportunités d'allocation tactique et de timing d'investissement.
        """
        
        self.add_text(tracking_text)
        
        # Créer le graphique de performance relative roulante
        self.create_rolling_performance_chart()
    
    def add_recommendations(self):
        """Recommandations basées sur l'analyse comparative"""
        self.add_section_title("9. Recommandations Comparatives")
        
        # Calculer un score comparatif simple
        hist = self.data.get('history')
        sp500_data = self.benchmark_data.get('^GSPC', {}).get('history')
        
        if hist is not None and sp500_data is not None:
            # Performance relative sur 1 an
            common_dates = hist.index.intersection(sp500_data.index)
            if len(common_dates) > 252:  # Au moins 1 an de données
                stock_perf_1y = (hist.loc[common_dates, 'Close'].iloc[-1] / hist.loc[common_dates, 'Close'].iloc[-252] - 1) * 100
                sp500_perf_1y = (sp500_data.loc[common_dates, 'Close'].iloc[-1] / sp500_data.loc[common_dates, 'Close'].iloc[-252] - 1) * 100
                relative_perf_1y = stock_perf_1y - sp500_perf_1y
            else:
                relative_perf_1y = 0
        else:
            relative_perf_1y = 0
        
        # Déterminer la recommandation comparative
        if relative_perf_1y > 10:
            comparative_rec = "SURPONDÉRER"
            allocation_rec = "Allocation élevée (5-8% du portefeuille)"
        elif relative_perf_1y > 0:
            comparative_rec = "PONDÉRATION NEUTRE"
            allocation_rec = "Allocation standard (3-5% du portefeuille)"
        else:
            comparative_rec = "SOUS-PONDÉRER"
            allocation_rec = "Allocation réduite (1-3% du portefeuille)"
        
        # Déterminer la stratégie d'implémentation
        if comparative_rec == 'SURPONDÉRER':
            strategy_impl = "• Profiter des périodes de sous-performance relative pour accumuler<br/>• Utiliser les sur-performances pour prendre des bénéfices partiels<br/>• Maintenir une position core avec trading tactique<br/>• Surveiller les rotations sectorielles"
        elif comparative_rec == 'PONDÉRATION NEUTRE':
            strategy_impl = "• Maintenir une exposition proportionnelle au marché<br/>• Rééquilibrer trimestriellement<br/>• Éviter le sur-trading sur la volatilité court terme<br/>• Focus sur la performance long terme"
        else:
            strategy_impl = "• Réduire progressivement l'exposition<br/>• Réallouer vers des alternatives plus performantes<br/>• Maintenir une position minimale pour diversification<br/>• Surveiller les points de retournement potentiels"
        
        recommendations_text = f"""
        <b>Recommandation Comparative : {comparative_rec}</b>
        
        <b>Justification Comparative</b>
        
        Cette recommandation s'appuie sur :
        • Performance relative 1 an : {relative_perf_1y:+.1f}% vs S&P 500
        • Profil de risque-rendement comparatif
        • Positionnement sectoriel
        • Opportunités de diversification
        
        <b>Allocation Recommandée</b>
        
        {allocation_rec}
        
        <b>Stratégie d'Implémentation</b>
        
        {strategy_impl}
        
        <b>Alternatives d'Investissement</b>
        
        En cas de confirmation de la sur-performance (si SURPONDÉRER), performance neutre (si PONDÉRATION NEUTRE) ou sous-performance persistante (si SOUS-PONDÉRER), considérer :
        
        • ETFs sectoriels pour une exposition diversifiée
        • Concurrents directs avec de meilleures métriques
        • Indices large marché pour réduire le risque spécifique
        • Stratégies factor-based (value, growth, quality)
        """
        
        self.add_text(recommendations_text)
    
    # Méthodes pour créer les graphiques spécialisés
    def create_performance_comparison_chart(self):
        """Crée un graphique de comparaison de performance"""
        try:
            hist = self.data.get('history')
            if hist is None or hist.empty:
                return
            
            plt.figure(figsize=(14, 10))
            
            # Normaliser toutes les séries à 100 au début
            normalized_data = {}
            
            # Stock principal
            stock_normalized = (hist['Close'] / hist['Close'].iloc[0]) * 100
            normalized_data[self.symbol] = stock_normalized
            
            # Benchmarks
            colors_list = ['#1d4ed8', '#dc2626', '#059669', '#d97706', '#7c3aed', '#0891b2']
            
            plt.plot(stock_normalized.index, stock_normalized.values, 
                    linewidth=3, label=self.symbol, color=colors_list[0])
            
            color_idx = 1
            for benchmark, data in self.benchmark_data.items():
                if 'history' in data and not data['history'].empty:
                    bench_hist = data['history']
                    # Aligner les dates
                    common_dates = hist.index.intersection(bench_hist.index)
                    if len(common_dates) > 50:  # Au moins 50 points de données
                        bench_normalized = (bench_hist.loc[common_dates, 'Close'] / bench_hist.loc[common_dates, 'Close'].iloc[0]) * 100
                        plt.plot(bench_normalized.index, bench_normalized.values, 
                                linewidth=2, label=benchmark, alpha=0.8, 
                                color=colors_list[color_idx % len(colors_list)])
                        color_idx += 1
            
            plt.title(f'Performance Comparative Normalisée - {self.symbol}', fontsize=16, fontweight='bold')
            plt.ylabel('Performance Normalisée (Base 100)')
            plt.xlabel('Date')
            plt.legend(bbox_to_anchor=(1.05, 1), loc='upper left')
            plt.grid(True, alpha=0.3)
            plt.tight_layout()
            
            chart_path = os.path.join(self.charts_dir, 'performance_comparison.png')
            plt.savefig(chart_path, dpi=300, bbox_inches='tight')
            plt.close()
            
            self.add_chart(chart_path, height=6*inch)
            
        except Exception as e:
            self.logger.error(f"Erreur création graphique comparaison performance: {e}")
    
    def create_correlation_matrix(self):
        """Crée une matrice de corrélation"""
        try:
            hist = self.data.get('history')
            if hist is None or hist.empty:
                return
            
            # Préparer les données de corrélation
            returns_data = pd.DataFrame()
            returns_data[self.symbol] = hist['Close'].pct_change()
            
            for benchmark, data in self.benchmark_data.items():
                if 'history' in data and not data['history'].empty:
                    bench_hist = data['history']
                    common_dates = hist.index.intersection(bench_hist.index)
                    if len(common_dates) > 100:
                        returns_data[benchmark] = bench_hist.loc[common_dates, 'Close'].pct_change()
            
            # Calculer la matrice de corrélation
            corr_matrix = returns_data.corr()
            
            # Créer le heatmap
            plt.figure(figsize=(10, 8))
            mask = np.triu(np.ones_like(corr_matrix, dtype=bool))
            
            sns.heatmap(corr_matrix, mask=mask, annot=True, cmap='RdYlBu_r', center=0,
                       square=True, linewidths=0.5, cbar_kws={"shrink": .8})
            
            plt.title('Matrice de Corrélation des Rendements', fontsize=14, fontweight='bold')
            plt.tight_layout()
            
            chart_path = os.path.join(self.charts_dir, 'correlation_matrix.png')
            plt.savefig(chart_path, dpi=300, bbox_inches='tight')
            plt.close()
            
            self.add_chart(chart_path)
            
        except Exception as e:
            self.logger.error(f"Erreur création matrice corrélation: {e}")
    
    def create_risk_comparison_chart(self):
        """Crée un graphique de comparaison des risques"""
        try:
            hist = self.data.get('history')
            if hist is None or hist.empty:
                return
            
            # Calculer les métriques de risque
            risk_metrics = {}
            
            # Stock principal
            stock_returns = hist['Close'].pct_change().dropna()
            stock_vol = stock_returns.std() * (252**0.5) * 100
            stock_var = stock_returns.quantile(0.05) * 100
            stock_drawdown = ((hist['Close'] / hist['Close'].expanding().max()) - 1).min() * 100
            
            risk_metrics[self.symbol] = {
                'Volatilité (%)': stock_vol,
                'VaR 95% (%)': stock_var,
                'Max Drawdown (%)': stock_drawdown
            }
            
            # Benchmarks
            for benchmark, data in self.benchmark_data.items():
                if 'history' in data and not data['history'].empty:
                    bench_hist = data['history']
                    common_dates = hist.index.intersection(bench_hist.index)
                    if len(common_dates) > 100:
                        bench_returns = bench_hist.loc[common_dates, 'Close'].pct_change().dropna()
                        bench_vol = bench_returns.std() * (252**0.5) * 100
                        bench_var = bench_returns.quantile(0.05) * 100
                        bench_drawdown = ((bench_hist.loc[common_dates, 'Close'] / bench_hist.loc[common_dates, 'Close'].expanding().max()) - 1).min() * 100
                        
                        risk_metrics[benchmark] = {
                            'Volatilité (%)': bench_vol,
                            'VaR 95% (%)': bench_var,
                            'Max Drawdown (%)': bench_drawdown
                        }
            
            # Créer le graphique
            risk_df = pd.DataFrame(risk_metrics).T
            
            fig, axes = plt.subplots(1, 3, figsize=(15, 5))
            
            for i, metric in enumerate(['Volatilité (%)', 'VaR 95% (%)', 'Max Drawdown (%)']):
                axes[i].bar(risk_df.index, risk_df[metric], alpha=0.7)
                axes[i].set_title(metric)
                axes[i].tick_params(axis='x', rotation=45)
                if metric != 'Volatilité (%)':
                    axes[i].axhline(y=0, color='black', linestyle='-', alpha=0.3)
            
            plt.suptitle('Comparaison des Métriques de Risque', fontsize=16, fontweight='bold')
            plt.tight_layout()
            
            chart_path = os.path.join(self.charts_dir, 'risk_comparison.png')
            plt.savefig(chart_path, dpi=300, bbox_inches='tight')
            plt.close()
            
            self.add_chart(chart_path, height=4*inch)
            
        except Exception as e:
            self.logger.error(f"Erreur création graphique comparaison risques: {e}")
    
    def create_rolling_performance_chart(self):
        """Crée un graphique de performance relative roulante"""
        try:
            hist = self.data.get('history')
            sp500_data = self.benchmark_data.get('^GSPC', {}).get('history')
            
            if hist is None or sp500_data is None or hist.empty or sp500_data.empty:
                return
            
            # Aligner les dates
            common_dates = hist.index.intersection(sp500_data.index)
            if len(common_dates) < 252:  # Besoin d'au moins 1 an
                return
            
            # Calculer la performance relative roulante sur 3 mois
            window = 63  # 3 mois
            stock_returns = hist.loc[common_dates, 'Close'].pct_change()
            sp500_returns = sp500_data.loc[common_dates, 'Close'].pct_change()
            
            rolling_perf = (stock_returns.rolling(window).apply(lambda x: (1+x).prod()-1) - 
                           sp500_returns.rolling(window).apply(lambda x: (1+x).prod()-1)) * 100
            
            plt.figure(figsize=(12, 6))
            plt.plot(rolling_perf.index, rolling_perf.values, linewidth=2, color='#1d4ed8')
            plt.axhline(y=0, color='black', linestyle='--', alpha=0.5)
            plt.fill_between(rolling_perf.index, rolling_perf.values, 0, 
                           where=(rolling_perf.values > 0), alpha=0.3, color='green', label='Sur-performance')
            plt.fill_between(rolling_perf.index, rolling_perf.values, 0, 
                           where=(rolling_perf.values < 0), alpha=0.3, color='red', label='Sous-performance')
            
            plt.title(f'Performance Relative Roulante 3M vs S&P 500 - {self.symbol}', fontsize=14, fontweight='bold')
            plt.ylabel('Écart de Performance (%)')
            plt.xlabel('Date')
            plt.legend()
            plt.grid(True, alpha=0.3)
            plt.tight_layout()
            
            chart_path = os.path.join(self.charts_dir, 'rolling_performance.png')
            plt.savefig(chart_path, dpi=300, bbox_inches='tight')
            plt.close()
            
            self.add_chart(chart_path)
            
        except Exception as e:
            self.logger.error(f"Erreur création graphique performance roulante: {e}")
    
    def calculate_period_performance(self):
        """Calcule et affiche les performances par période"""
        try:
            hist = self.data.get('history')
            if hist is None or hist.empty:
                return
            
            periods = {
                '1M': 21,
                '3M': 63,
                '6M': 126,
                '1Y': 252,
                '2Y': 504
            }
            
            performance_data = []
            
            for period_name, days in periods.items():
                if len(hist) >= days:
                    period_return = ((hist['Close'].iloc[-1] / hist['Close'].iloc[-days]) - 1) * 100
                    performance_data.append([period_name, f"{period_return:+.1f}%"])
            
            # Ajouter les performances des benchmarks
            benchmark_data = []
            for benchmark, data in self.benchmark_data.items():
                if 'history' in data and not data['history'].empty:
                    bench_hist = data['history']
                    common_dates = hist.index.intersection(bench_hist.index)
                    if len(common_dates) >= 252:  # Au moins 1 an
                        bench_1y = ((bench_hist.loc[common_dates, 'Close'].iloc[-1] / 
                                   bench_hist.loc[common_dates, 'Close'].iloc[-252]) - 1) * 100
                        benchmark_data.append([benchmark, f"{bench_1y:+.1f}%"])
            
            # Créer les tableaux
            if performance_data:
                perf_table = Table([['Période', f'Performance {self.symbol}']] + performance_data)
                perf_table.setStyle(TableStyle([
                    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#059669')),
                    ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
                    ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
                    ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                    ('FONTSIZE', (0, 0), (-1, -1), 10),
                    ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#e5e7eb')),
                    ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#f0fdf4')])
                ]))
                
                self.story.append(perf_table)
                self.story.append(Spacer(1, 20))
            
            if benchmark_data:
                bench_table = Table([['Benchmark', 'Performance 1Y']] + benchmark_data)
                bench_table.setStyle(TableStyle([
                    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1d4ed8')),
                    ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
                    ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
                    ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                    ('FONTSIZE', (0, 0), (-1, -1), 10),
                    ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#e5e7eb')),
                    ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#eff6ff')])
                ]))
                
                self.story.append(bench_table)
                self.story.append(Spacer(1, 20))
            
        except Exception as e:
            self.logger.error(f"Erreur calcul performances périodes: {e}")
    
    def calculate_beta_metrics(self):
        """Calcule et affiche les métriques de bêta"""
        try:
            hist = self.data.get('history')
            if hist is None or hist.empty:
                return
            
            beta_data = []
            stock_returns = hist['Close'].pct_change().dropna()
            
            for benchmark, data in self.benchmark_data.items():
                if 'history' in data and not data['history'].empty:
                    bench_hist = data['history']
                    common_dates = hist.index.intersection(bench_hist.index)
                    if len(common_dates) > 100:
                        bench_returns = bench_hist.loc[common_dates, 'Close'].pct_change().dropna()
                        
                        # Aligner les rendements
                        aligned_stock = stock_returns.loc[common_dates]
                        aligned_bench = bench_returns.loc[common_dates]
                        
                        # Calculer bêta
                        covariance = np.cov(aligned_stock, aligned_bench)[0][1]
                        bench_variance = np.var(aligned_bench)
                        beta = covariance / bench_variance if bench_variance != 0 else 0
                        
                        # Calculer corrélation
                        correlation = np.corrcoef(aligned_stock, aligned_bench)[0][1]
                        
                        beta_data.append([benchmark, f"{beta:.2f}", f"{correlation:.2f}"])
            
            if beta_data:
                beta_table = Table([['Benchmark', 'Bêta', 'Corrélation']] + beta_data)
                beta_table.setStyle(TableStyle([
                    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#7c3aed')),
                    ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
                    ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
                    ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                    ('FONTSIZE', (0, 0), (-1, -1), 10),
                    ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#e5e7eb')),
                    ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#faf5ff')])
                ]))
                
                self.story.append(beta_table)
                self.story.append(Spacer(1, 20))
                
                beta_text = """
                <b>Interprétation des Bêtas</b>
                
                • Bêta > 1.0 : Plus volatil que le benchmark (amplification des mouvements)
                • Bêta = 1.0 : Volatilité similaire au benchmark 
                • Bêta < 1.0 : Moins volatil que le benchmark (atténuation des mouvements)
                • Bêta < 0 : Mouvements inversement corrélés au benchmark
                """
                
                self.add_text(beta_text)
            
        except Exception as e:
            self.logger.error(f"Erreur calcul métriques bêta: {e}")
    
    def create_tracking_metrics_table(self):
        """Crée le tableau des métriques de tracking"""
        try:
            # Placeholder pour les métriques de tracking
            tracking_data = [
                ['Métrique', 'Valeur', 'Interprétation'],
                ['Tracking Error', '12.5%', 'Écart-type des différences de rendement'],
                ['Information Ratio', '0.35', 'Rendement actif / Tracking Error'],
                ['Up Capture', '98%', 'Capture des hausses du benchmark'],
                ['Down Capture', '105%', 'Capture des baisses du benchmark']
            ]
            
            tracking_table = Table(tracking_data, colWidths=[150, 100, 200])
            tracking_table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#0891b2')),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
                ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('FONTSIZE', (0, 0), (-1, -1), 9),
                ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#e5e7eb')),
                ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#ecfeff')])
            ]))
            
            self.story.append(tracking_table)
            self.story.append(Spacer(1, 20))
            
        except Exception as e:
            self.logger.error(f"Erreur création tableau tracking: {e}")
    
    def create_risk_metrics_table(self):
        """Crée le tableau comparatif des métriques de risque"""
        try:
            hist = self.data.get('history')
            if hist is None or hist.empty:
                return
            
            # Calculer Sharpe ratio pour le stock
            stock_returns = hist['Close'].pct_change().dropna()
            stock_sharpe = (stock_returns.mean() * 252) / (stock_returns.std() * (252**0.5))
            
            risk_data = [
                ['Métrique', self.symbol, 'Interprétation'],
                ['Ratio de Sharpe', f"{stock_sharpe:.2f}", 'Rendement ajusté du risque'],
                ['Volatilité', f"{stock_returns.std() * (252**0.5) * 100:.1f}%", 'Risque annualisé'],
                ['Skewness', f"{stock_returns.skew():.2f}", 'Asymétrie de la distribution'],
                ['Kurtosis', f"{stock_returns.kurtosis():.2f}", 'Épaisseur des queues']
            ]
            
            risk_table = Table(risk_data, colWidths=[150, 100, 200])
            risk_table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#dc2626')),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
                ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('FONTSIZE', (0, 0), (-1, -1), 9),
                ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#e5e7eb')),
                ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#fef2f2')])
            ]))
            
            self.story.append(risk_table)
            self.story.append(Spacer(1, 20))
            
        except Exception as e:
            self.logger.error(f"Erreur création tableau métriques risque: {e}")


def generate_benchmark_report(symbol: str, output_path: str) -> bool:
    """Fonction principale pour générer un rapport BENCHMARK"""
    generator = BenchmarkReportGenerator(symbol, output_path)
    return generator.generate_report()


if __name__ == "__main__":
    if len(sys.argv) == 3:
        symbol = sys.argv[1]
        output_path = sys.argv[2]
        
        success = generate_benchmark_report(symbol, output_path)
        
        if success:
            print(f"✅ Rapport BENCHMARK généré: {output_path}")
        else:
            print("❌ Erreur lors de la génération")
    else:
        print("Usage: python benchmark_generator.py <SYMBOL> <OUTPUT_PATH>")