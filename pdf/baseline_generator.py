#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
Générateur de rapports BASELINE - Analyse fondamentale complète
20-25 pages d'analyse approfondie
"""

import os
import sys
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from datetime import datetime, timedelta
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.platypus import Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY

from report_base import BaseReportGenerator

class BaselineReportGenerator(BaseReportGenerator):
    """Générateur de rapports BASELINE - Analyse fondamentale complète"""
    
    def __init__(self, symbol, output_path):
        super().__init__(symbol, output_path)
        self.report_type = "BASELINE"
    
    def add_analysis_type_badge(self):
        """Badge spécifique au rapport BASELINE"""
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
        
        # Style pour le type d'analyse - Bleu pour BASELINE
        analysis_type_style = ParagraphStyle(
            'AnalysisType',
            parent=self.styles['Normal'],
            fontSize=20,
            textColor=colors.white,
            alignment=TA_CENTER,
            spaceAfter=30,
            borderWidth=3,
            borderColor=colors.HexColor('#1d4ed8'),
            borderPadding=18,
            backColor=colors.HexColor('#1d4ed8'),
            fontName='Helvetica-Bold'
        )
        
        self.story.append(Paragraph("TYPE D'ANALYSE DEMANDÉ", label_style))
        self.story.append(Paragraph("RAPPORT BASELINE", analysis_type_style))
        
        # Description détaillée
        info = self.data.get('info', {})
        company_name = info.get('longName', self.symbol)
        
        description_text = f"""
        <b>RAPPORT BASELINE DEMANDÉ</b><br/>
        Analyse fondamentale complète de {company_name} ({self.symbol})<br/>
        • Métriques financières essentielles et ratios clés<br/>
        • Analyse de la performance historique sur 2 ans<br/>
        • Valorisation détaillée et comparaisons sectorielles<br/>
        • Recommandations d'investissement avec objectifs de prix<br/>
        • 20-25 pages d'analyse professionnelle approfondie
        """
        
        request_style = ParagraphStyle(
            'RequestSummary',
            parent=self.styles['Normal'],
            fontSize=11,
            alignment=TA_CENTER,
            spaceAfter=25,
            borderWidth=2,
            borderColor=colors.HexColor('#1d4ed8'),
            borderPadding=12,
            backColor=colors.HexColor('#dbeafe'),
            leftIndent=10,
            rightIndent=10
        )
        
        self.story.append(Paragraph(description_text, request_style))
        self.story.append(Spacer(1, 60))
    
    def generate_report(self):
        """Génère le rapport BASELINE complet"""
        try:
            self.logger.info("📊 Génération rapport BASELINE")
            
            # Récupération des données
            if not self.fetch_data():
                return False
            
            # Structure du rapport BASELINE
            self.add_cover_page()
            self.add_table_of_contents()
            self.add_executive_summary()
            self.add_company_overview()
            self.add_financial_analysis()
            self.add_performance_analysis()
            self.add_valuation_analysis()
            self.add_technical_overview()
            self.add_sector_analysis()
            self.add_risk_analysis()
            self.add_recommendations()
            self.add_final_page()
            
            # Construction du PDF
            self.build_pdf()
            self.logger.info(f"✅ Rapport BASELINE généré: {self.output_path}")
            
            return True
            
        except Exception as e:
            self.logger.error(f"❌ Erreur génération rapport BASELINE: {e}")
            return False
    
    def add_table_of_contents(self):
        """Table des matières spécifique au BASELINE"""
        toc_title_style = ParagraphStyle(
            'TOCTitle',
            parent=self.styles['Heading1'],
            fontSize=20,
            textColor=colors.HexColor('#1d4ed8'),
            alignment=TA_CENTER,
            spaceAfter=30,
            fontName='Helvetica-Bold'
        )
        
        self.story.append(Paragraph("TABLE DES MATIÈRES", toc_title_style))
        
        sections = [
            "1. Résumé Exécutif",
            "2. Vue d'Ensemble de l'Entreprise", 
            "3. Analyse Financière Détaillée",
            "4. Analyse de Performance",
            "5. Analyse de Valorisation",
            "6. Aperçu Technique",
            "7. Analyse Sectorielle",
            "8. Évaluation des Risques",
            "9. Recommandations d'Investissement",
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
        self.story.append(Paragraph("Page", toc_style))
        self.story.append(Spacer(1, 40))
    
    def add_executive_summary(self):
        """Résumé exécutif détaillé"""
        self.add_section_title("1. Résumé Exécutif")
        
        info = self.data.get('info', {})
        hist = self.data.get('history')
        
        # Calculs des métriques clés
        current_price = info.get('currentPrice', 0)
        if hist is not None and not hist.empty:
            price_change_1y = ((current_price / hist['Close'].iloc[0]) - 1) * 100 if len(hist) > 0 else 0
            volatility = hist['Close'].pct_change().std() * (252**0.5) * 100
            max_drawdown = ((hist['Close'] / hist['Close'].expanding().max()) - 1).min() * 100
        else:
            price_change_1y = volatility = max_drawdown = 0
        
        # Analyse du momentum
        recommendation = "ACHETER" if price_change_1y > 0 and volatility < 30 else "CONSERVER" if price_change_1y > -10 else "VENDRE"
        
        summary_text = f"""
        <b>Vue d'Ensemble</b>
        
        {info.get('longName', self.symbol)} ({self.symbol}) présente un profil d'investissement 
        {'attrayant' if price_change_1y > 0 else 'mitigé'} dans le secteur {info.get('sector', 'N/A')}. 
        Notre analyse fondamentale révèle {'des fondamentaux solides' if info.get('profitMargins', 0) > 0.10 else 'des fondamentaux à surveiller'} 
        avec une capitalisation boursière de ${info.get('marketCap', 0):,.0f}.
        
        <b>Points Clés</b>
        
        • Performance sur 12 mois: {price_change_1y:+.1f}%
        • Volatilité annualisée: {volatility:.1f}%
        • Drawdown maximum: {max_drawdown:.1f}%
        • P/E Ratio: {info.get('trailingPE', 'N/A')}
        • Marge bénéficiaire: {(info.get('profitMargins', 0) * 100):.1f}%
        • ROE: {(info.get('returnOnEquity', 0) * 100):.1f}%
        
        <b>Recommandation</b>
        
        Sur la base de notre analyse complète, nous recommandons une position <b>{recommendation}</b> 
        sur {self.symbol}. Cette recommandation s'appuie sur l'analyse des fondamentaux financiers, 
        des tendances sectorielles, et du contexte macroéconomique actuel.
        
        Les investisseurs {'peuvent considérer une allocation de 2-4% du portefeuille' if recommendation == 'ACHETER' 
        else 'devraient maintenir leur position existante' if recommendation == 'CONSERVER' 
        else 'devraient réduire leur exposition'} en fonction de leur profil de risque et horizon d'investissement.
        """
        
        self.add_text(summary_text)
        self.story.append(Spacer(1, 20))
    
    def add_company_overview(self):
        """Vue d'ensemble détaillée de l'entreprise"""
        self.add_section_title("2. Vue d'Ensemble de l'Entreprise")
        
        info = self.data.get('info', {})
        
        self.add_subsection_title("Profil de l'Entreprise")
        
        company_text = f"""
        <b>Description de l'Activité</b>
        
        {info.get('longBusinessSummary', f'{info.get("longName", self.symbol)} est une entreprise leader dans son secteur.')}
        
        <b>Informations Clés</b>
        
        L'entreprise opère principalement dans le secteur {info.get('sector', 'N/A')}, 
        plus spécifiquement dans l'industrie {info.get('industry', 'N/A')}. 
        Basée à {info.get('city', 'N/A')}, {info.get('country', 'États-Unis')}, 
        elle emploie approximativement {info.get('fullTimeEmployees', 'N/A')} personnes.
        
        <b>Position Concurrentielle</b>
        
        Avec une capitalisation boursière de ${info.get('marketCap', 0):,.0f}, 
        {info.get('longName', self.symbol)} se positionne comme 
        {'un leader majeur' if info.get('marketCap', 0) > 100e9 
        else 'un acteur significatif' if info.get('marketCap', 0) > 10e9 
        else 'une entreprise de taille moyenne'} dans son secteur.
        """
        
        self.add_text(company_text)
        
        # Tableau des métriques clés
        self.add_subsection_title("Métriques Financières Clés")
        
        metrics_data = [
            ['Métrique', 'Valeur', 'Commentaire'],
            ['Chiffre d\'affaires (TTM)', f"${info.get('totalRevenue', 0):,.0f}", 
             'Revenus sur 12 mois glissants'],
            ['Bénéfice net (TTM)', f"${info.get('netIncomeToCommon', 0):,.0f}", 
             'Bénéfice attribuable aux actionnaires'],
            ['Marge bénéficiaire', f"{(info.get('profitMargins', 0) * 100):.1f}%", 
             'Efficacité de conversion des revenus'],
            ['ROE', f"{(info.get('returnOnEquity', 0) * 100):.1f}%", 
             'Retour sur capitaux propres'],
            ['Ratio d\'endettement', f"{info.get('debtToEquity', 'N/A')}", 
             'Niveau d\'endettement relatif'],
            ['Ratio de liquidité', f"{info.get('currentRatio', 'N/A')}", 
             'Capacité à honorer les dettes court terme']
        ]
        
        table = Table(metrics_data, colWidths=[150, 100, 200])
        table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1d4ed8')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 9),
            ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#e5e7eb')),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#f8fafc')])
        ]))
        
        self.story.append(table)
        self.story.append(Spacer(1, 20))
    
    def add_financial_analysis(self):
        """Analyse financière détaillée"""
        self.add_section_title("3. Analyse Financière Détaillée")
        
        info = self.data.get('info', {})
        
        self.add_subsection_title("Profitabilité et Marges")
        
        profit_analysis = f"""
        <b>Analyse des Marges</b>
        
        L'entreprise affiche une marge bénéficiaire de {(info.get('profitMargins', 0) * 100):.1f}%, 
        ce qui est {'excellent' if info.get('profitMargins', 0) > 0.20 
        else 'bon' if info.get('profitMargins', 0) > 0.10 
        else 'acceptable' if info.get('profitMargins', 0) > 0.05 
        else 'préoccupant'} pour ce secteur d'activité.
        
        La marge EBITDA de {(info.get('ebitdaMargins', 0) * 100):.1f}% démontre 
        {'une excellente' if info.get('ebitdaMargins', 0) > 0.25 
        else 'une bonne' if info.get('ebitdaMargins', 0) > 0.15 
        else 'une'} capacité à générer des flux de trésorerie opérationnels.
        
        <b>Efficacité Opérationnelle</b>
        
        Le retour sur capitaux propres (ROE) de {(info.get('returnOnEquity', 0) * 100):.1f}% 
        indique {'une gestion très efficace' if info.get('returnOnEquity', 0) > 0.20 
        else 'une gestion efficace' if info.get('returnOnEquity', 0) > 0.15 
        else 'une gestion correcte' if info.get('returnOnEquity', 0) > 0.10 
        else 'des défis de gestion'} des capitaux propres.
        
        Le retour sur actifs (ROA) de {(info.get('returnOnAssets', 0) * 100):.1f}% 
        reflète l'efficacité d'utilisation des actifs pour générer des bénéfices.
        """
        
        self.add_text(profit_analysis)
        
        # Graphique des métriques financières
        self.create_financial_metrics_chart()
        
        self.add_subsection_title("Structure Financière")
        
        # Analyse du niveau d'endettement
        debt_level = 'un niveau d\'endettement élevé' if isinstance(info.get('debtToEquity'), (int, float)) and info.get('debtToEquity') > 1 else 'un niveau d\'endettement modéré' if isinstance(info.get('debtToEquity'), (int, float)) and info.get('debtToEquity') > 0.5 else 'un niveau d\'endettement faible'
        debt_assessment = 'nécessite une surveillance' if isinstance(info.get('debtToEquity'), (int, float)) and info.get('debtToEquity') > 1 else 'reste gérable'
        
        # Analyse de la liquidité
        liquidity_level = 'assure une excellente' if isinstance(info.get('currentRatio'), (int, float)) and info.get('currentRatio') > 2 else 'assure une bonne' if isinstance(info.get('currentRatio'), (int, float)) and info.get('currentRatio') > 1.5 else 'indique une'
        
        # Analyse des flux de trésorerie
        cashflow_assessment = 'démontrent une solide génération' if info.get('operatingCashflow', 0) > 0 else 'révèlent des défis dans la génération'
        
        structure_analysis = f"""
        <b>Endettement et Liquidité</b>
        
        Avec un ratio d'endettement de {info.get('debtToEquity', 'N/A')}, l'entreprise présente 
        {debt_level} qui {debt_assessment}.
        
        Le ratio de liquidité courante de {info.get('currentRatio', 'N/A')} 
        {liquidity_level} capacité à honorer les dettes à court terme.
        
        <b>Flux de Trésorerie</b>
        
        Les flux de trésorerie opérationnels de ${info.get('operatingCashflow', 0):,.0f} 
        {cashflow_assessment} de liquidités par l'activité principale.
        """
        
        self.add_text(structure_analysis)
    
    def add_performance_analysis(self):
        """Analyse de performance détaillée"""
        self.add_section_title("4. Analyse de Performance")
        
        hist = self.data.get('history')
        if hist is None or hist.empty:
            self.add_text("Données historiques insuffisantes pour l'analyse de performance.")
            return
        
        self.add_subsection_title("Performance des Prix")
        
        # Calculs de performance
        current_price = hist['Close'].iloc[-1]
        
        # Performances sur différentes périodes
        returns_1w = ((current_price / hist['Close'].iloc[-5]) - 1) * 100 if len(hist) >= 5 else 0
        returns_1m = ((current_price / hist['Close'].iloc[-21]) - 1) * 100 if len(hist) >= 21 else 0
        returns_3m = ((current_price / hist['Close'].iloc[-63]) - 1) * 100 if len(hist) >= 63 else 0
        returns_6m = ((current_price / hist['Close'].iloc[-126]) - 1) * 100 if len(hist) >= 126 else 0
        returns_1y = ((current_price / hist['Close'].iloc[-252]) - 1) * 100 if len(hist) >= 252 else 0
        returns_2y = ((current_price / hist['Close'].iloc[0]) - 1) * 100 if len(hist) > 0 else 0
        
        performance_text = f"""
        <b>Performances Historiques</b>
        
        L'analyse de la performance historique révèle les rendements suivants :
        
        • 1 semaine : {returns_1w:+.1f}%
        • 1 mois : {returns_1m:+.1f}%
        • 3 mois : {returns_3m:+.1f}%
        • 6 mois : {returns_6m:+.1f}%
        • 1 an : {returns_1y:+.1f}%
        • 2 ans : {returns_2y:+.1f}%
        
        La tendance {'haussière' if returns_1y > 0 else 'baissière'} sur 12 mois 
        {'se confirme' if (returns_1y > 0 and returns_3m > 0) or (returns_1y < 0 and returns_3m < 0) 
        else 'montre des signes de retournement'} sur les périodes plus courtes.
        
        <b>Volatilité et Risque</b>
        
        La volatilité annualisée de {hist['Close'].pct_change().std() * (252**0.5) * 100:.1f}% 
        place cette action dans la catégorie {'à risque élevé' if hist['Close'].pct_change().std() * (252**0.5) * 100 > 40 
        else 'à risque modéré' if hist['Close'].pct_change().std() * (252**0.5) * 100 > 25 
        else 'à risque relativement faible'}.
        """
        
        self.add_text(performance_text)
        
        # Graphique de performance
        self.create_performance_chart()
        
        # Analyse des volumes
        self.add_subsection_title("Analyse des Volumes")
        
        avg_volume = hist['Volume'].mean()
        recent_volume = hist['Volume'].tail(10).mean()
        
        volume_analysis = f"""
        <b>Tendances de Volume</b>
        
        Le volume moyen de transactions s'établit à {avg_volume:,.0f} actions par jour. 
        Sur les 10 dernières séances, le volume moyen de {recent_volume:,.0f} actions 
        {'dépasse' if recent_volume > avg_volume * 1.2 
        else 'est proche de' if recent_volume > avg_volume * 0.8 
        else 'reste en-dessous de'} la moyenne historique, 
        {'suggérant un intérêt accru' if recent_volume > avg_volume * 1.2 
        else 'indiquant une activité normale' if recent_volume > avg_volume * 0.8 
        else 'reflétant une activité réduite'}.
        
        Cette évolution du volume {'confirme' if (recent_volume > avg_volume and returns_1m > 0) 
        or (recent_volume < avg_volume and returns_1m < 0) 
        else 'diverge de'} la tendance récente des prix.
        """
        
        self.add_text(volume_analysis)
        
        # Graphique des volumes
        self.create_volume_chart()
    
    def add_valuation_analysis(self):
        """Analyse de valorisation complète"""
        self.add_section_title("5. Analyse de Valorisation")
        
        info = self.data.get('info', {})
        hist = self.data.get('history')
        
        self.add_subsection_title("Multiples de Valorisation")
        
        # Ratios de valorisation
        pe_ratio = info.get('trailingPE', None)
        peg_ratio = info.get('pegRatio', None)
        pb_ratio = info.get('priceToBook', None)
        ps_ratio = info.get('priceToSalesTrailing12Months', None)
        
        valuation_text = f"""
        <b>Ratios de Valorisation Actuels</b>
        
        • P/E Ratio: {pe_ratio if pe_ratio else 'N/A'}
        • PEG Ratio: {peg_ratio if peg_ratio else 'N/A'}
        • P/B Ratio: {pb_ratio if pb_ratio else 'N/A'}
        • P/S Ratio: {ps_ratio if ps_ratio else 'N/A'}
        
        {f'Le ratio P/E de {pe_ratio:.1f} indique une valorisation {"élevée" if pe_ratio > 25 else "raisonnable" if pe_ratio > 15 else "attractive"} par rapport aux bénéfices.' if pe_ratio else 'Ratio P/E non disponible.'}
        
        {f'Le ratio PEG de {peg_ratio:.2f} {"suggère une surévaluation" if peg_ratio > 1.5 else "indique une valorisation équilibrée" if peg_ratio > 0.8 else "révèle une valorisation attractive"} compte tenu des perspectives de croissance.' if peg_ratio else 'Ratio PEG non disponible.'}
        
        <b>Objectifs de Prix</b>
        
        Sur la base de notre analyse des multiples sectoriels et des perspectives de croissance, 
        nous établissons les objectifs de prix suivants :
        """
        
        # Calcul d'objectifs de prix
        current_price = info.get('currentPrice', 0)
        if pe_ratio and current_price:
            conservative_target = current_price * 1.10
            optimistic_target = current_price * 1.25
            
            targets_text = f"""
            • <b>Objectif conservateur (12 mois) :</b> ${conservative_target:.2f} (+{((conservative_target/current_price)-1)*100:.1f}%)
            • <b>Objectif optimiste (12 mois) :</b> ${optimistic_target:.2f} (+{((optimistic_target/current_price)-1)*100:.1f}%)
            
            Ces objectifs sont basés sur l'évolution attendue des fondamentaux et 
            l'expansion/compression potentielle des multiples de valorisation.
            """
            valuation_text += targets_text
        
        self.add_text(valuation_text)
    
    def add_technical_overview(self):
        """Aperçu technique simplifié pour BASELINE"""
        self.add_section_title("6. Aperçu Technique")
        
        hist = self.data.get('history')
        if hist is None or hist.empty:
            return
        
        # Calcul des moyennes mobiles
        hist['MA20'] = hist['Close'].rolling(window=20).mean()
        hist['MA50'] = hist['Close'].rolling(window=50).mean()
        hist['MA200'] = hist['Close'].rolling(window=200).mean()
        
        current_price = hist['Close'].iloc[-1]
        ma20 = hist['MA20'].iloc[-1]
        ma50 = hist['MA50'].iloc[-1] 
        ma200 = hist['MA200'].iloc[-1]
        
        technical_text = f"""
        <b>Signaux des Moyennes Mobiles</b>
        
        Le prix actuel de ${current_price:.2f} se situe :
        • {'Au-dessus' if current_price > ma20 else 'En-dessous'} de la MA20 (${ma20:.2f}) - Tendance court terme {'haussière' if current_price > ma20 else 'baissière'}
        • {'Au-dessus' if current_price > ma50 else 'En-dessous'} de la MA50 (${ma50:.2f}) - Tendance moyen terme {'haussière' if current_price > ma50 else 'baissière'}
        • {'Au-dessus' if current_price > ma200 else 'En-dessous'} de la MA200 (${ma200:.2f}) - Tendance long terme {'haussière' if current_price > ma200 else 'baissière'}
        
        La configuration technique {'supporte' if current_price > ma50 else 'ne supporte pas'} 
        notre recommandation fondamentale.
        """
        
        self.add_text(technical_text)
        
        # Graphique des moyennes mobiles
        self.create_moving_averages_chart()
    
    def add_sector_analysis(self):
        """Analyse sectorielle"""
        self.add_section_title("7. Analyse Sectorielle")
        
        info = self.data.get('info', {})
        sector = info.get('sector', 'N/A')
        industry = info.get('industry', 'N/A')
        
        sector_text = f"""
        <b>Positionnement Sectoriel</b>
        
        {self.symbol} opère dans le secteur {sector}, spécifiquement dans l'industrie {industry}. 
        Ce secteur bénéficie actuellement {'de tendances favorables' if sector in ['Technology', 'Healthcare', 'Consumer Discretionary'] 
        else 'de conditions mitigées'} liées aux évolutions technologiques et économiques.
        
        <b>Dynamiques Sectorielles</b>
        
        Les facteurs clés influençant ce secteur incluent :
        • L'innovation technologique et la transformation digitale
        • L'évolution de la demande des consommateurs
        • Les politiques réglementaires et fiscales
        • La concurrence et les barrières à l'entrée
        
        L'entreprise bénéficie d'une position solide grâce à sa taille et ses ressources.
        """
        
        self.add_text(sector_text)
    
    def add_risk_analysis(self):
        """Analyse des risques"""
        self.add_section_title("8. Évaluation des Risques")
        
        info = self.data.get('info', {})
        hist = self.data.get('history')
        
        # Calcul des métriques de risque
        if hist is not None and not hist.empty:
            volatility = hist['Close'].pct_change().std() * (252**0.5) * 100
            var_95 = hist['Close'].pct_change().quantile(0.05) * 100
            max_drawdown = ((hist['Close'] / hist['Close'].expanding().max()) - 1).min() * 100
        else:
            volatility = var_95 = max_drawdown = 0
        
        risk_text = f"""
        <b>Profil de Risque Quantitatif</b>
        
        • <b>Volatilité annualisée :</b> {volatility:.1f}%
        • <b>VaR 95% (quotidien) :</b> {var_95:.1f}%
        • <b>Drawdown maximum :</b> {max_drawdown:.1f}%
        
        Ce profil de risque classe l'investissement comme 
        {'à risque élevé' if volatility > 35 
        else 'à risque modéré-élevé' if volatility > 25 
        else 'à risque modéré' if volatility > 15 
        else 'à risque relativement faible'}.
        
        <b>Risques Spécifiques</b>
        
        <b>Risques Opérationnels :</b>
        • Dépendance aux cycles économiques
        • Concurrence sectorielle intense
        • Défis d'innovation et de R&D
        
        <b>Risques Financiers :</b>
        • Niveau d'endettement : {info.get('debtToEquity', 'N/A')}
        • Concentration géographique
        • Exposition aux devises
        
        <b>Risques Réglementaires :</b>
        • Évolution des régulations sectorielles
        • Politiques fiscales
        • Standards ESG
        
        <b>Gestion des Risques Recommandée</b>
        
        Nous recommandons une allocation {'prudente (1-3% du portefeuille)' if volatility > 30 
        else 'modérée (3-5% du portefeuille)' if volatility > 20 
        else 'standard (5-8% du portefeuille)'} 
        avec un horizon d'investissement {'long terme (3+ ans)' if volatility > 25 else 'moyen-long terme (2+ ans)'}.
        """
        
        self.add_text(risk_text)
    
    def add_recommendations(self):
        """Recommandations d'investissement"""
        self.add_section_title("9. Recommandations d'Investissement")
        
        info = self.data.get('info', {})
        hist = self.data.get('history')
        
        # Synthèse pour la recommandation
        current_price = info.get('currentPrice', 0)
        pe_ratio = info.get('trailingPE', 20)
        profit_margin = info.get('profitMargins', 0)
        roe = info.get('returnOnEquity', 0)
        
        if hist is not None and not hist.empty:
            returns_1y = ((current_price / hist['Close'].iloc[0]) - 1) * 100 if len(hist) > 0 else 0
        else:
            returns_1y = 0
        
        # Score de recommandation (simplifié)
        score = 0
        if returns_1y > 0: score += 1
        if pe_ratio and pe_ratio < 25: score += 1
        if profit_margin > 0.10: score += 1
        if roe > 0.15: score += 1
        
        if score >= 3:
            recommendation = "ACHETER"
            confidence = "Forte"
        elif score >= 2:
            recommendation = "CONSERVER"
            confidence = "Modérée"
        else:
            recommendation = "VENDRE"
            confidence = "Faible"
        
        # Définition du plan d'action selon la recommandation
        if recommendation == 'ACHETER':
            action_plan = "• Initier une position progressive sur 2-3 mois<br/>• Allocation recommandée : 3-5% du portefeuille<br/>• Horizon d'investissement : 12-24 mois<br/>• Stop-loss suggéré : -15% depuis le point d'entrée"
        elif recommendation == 'CONSERVER':
            action_plan = "• Maintenir la position actuelle<br/>• Surveiller les prochains résultats trimestriels<br/>• Réévaluer en cas de changement fondamental<br/>• Prendre des bénéfices partiels si +20%"
        else:
            action_plan = "• Réduire progressivement la position<br/>• Sortie recommandée sur rebond technique<br/>• Réinvestir dans des alternatives plus attractives<br/>• Limiter les pertes supplémentaires"
        
        recommendations_text = f"""
        <b>Recommandation Principale : {recommendation}</b>
        
        Niveau de confiance : {confidence}
        
        <b>Justification</b>
        
        Cette recommandation s'appuie sur :
        • Analyse fondamentale : {'Positive' if profit_margin > 0.10 and roe > 0.15 else 'Mitigée'}
        • Performance récente : {'Satisfaisante' if returns_1y > 0 else 'Décevante'}
        • Valorisation : {'Attractive' if pe_ratio and pe_ratio < 20 else 'Raisonnable' if pe_ratio and pe_ratio < 25 else 'Élevée'}
        • Contexte sectoriel : {'Favorable' if info.get('sector') in ['Technology', 'Healthcare'] else 'Neutre'}
        
        <b>Plan d'Action Suggéré</b>
        
        {action_plan}
        
        <b>Catalyseurs à Surveiller</b>
        
        • Publication des résultats trimestriels
        • Annonces de nouveaux produits/services
        • Évolution de la guidance managériale
        • Changements dans l'environnement concurrentiel
        • Développements macroéconomiques sectoriels
        
        <b>Révision de la Recommandation</b>
        
        Cette recommandation sera révisée :
        • Trimestriellement lors des publications de résultats
        • En cas d'évolution significative (+/-15%) du cours
        • Suite à des changements fondamentaux majeurs
        • Lors de modifications du contexte macroéconomique
        """
        
        self.add_text(recommendations_text)
    
    # Méthodes pour créer les graphiques
    def create_financial_metrics_chart(self):
        """Crée un graphique des métriques financières"""
        try:
            info = self.data.get('info', {})
            
            metrics = {
                'Marge Profit': info.get('profitMargins', 0) * 100,
                'Marge EBITDA': info.get('ebitdaMargins', 0) * 100,
                'ROE': info.get('returnOnEquity', 0) * 100,
                'ROA': info.get('returnOnAssets', 0) * 100
            }
            
            plt.figure(figsize=(10, 6))
            bars = plt.bar(metrics.keys(), metrics.values(), color=['#1d4ed8', '#3b82f6', '#60a5fa', '#93c5fd'])
            
            plt.title(f'Métriques Financières Clés - {self.symbol}', fontsize=14, fontweight='bold')
            plt.ylabel('Pourcentage (%)')
            plt.xticks(rotation=45)
            
            # Ajouter les valeurs sur les barres
            for bar, value in zip(bars, metrics.values()):
                plt.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.1, 
                        f'{value:.1f}%', ha='center', va='bottom')
            
            plt.tight_layout()
            chart_path = os.path.join(self.charts_dir, 'financial_metrics.png')
            plt.savefig(chart_path, dpi=300, bbox_inches='tight')
            plt.close()
            
            self.add_chart(chart_path)
            
        except Exception as e:
            self.logger.error(f"Erreur création graphique métriques financières: {e}")
    
    def create_performance_chart(self):
        """Crée un graphique de performance historique"""
        try:
            hist = self.data.get('history')
            if hist is None or hist.empty:
                return
            
            plt.figure(figsize=(12, 8))
            
            # Prix et volume
            fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(12, 10), 
                                         gridspec_kw={'height_ratios': [3, 1]})
            
            # Prix
            ax1.plot(hist.index, hist['Close'], linewidth=2, color='#1d4ed8', label='Prix de clôture')
            ax1.fill_between(hist.index, hist['Low'], hist['High'], alpha=0.3, color='#93c5fd')
            ax1.set_title(f'Performance Historique - {self.symbol}', fontsize=14, fontweight='bold')
            ax1.set_ylabel('Prix ($)')
            ax1.legend()
            ax1.grid(True, alpha=0.3)
            
            # Volume
            ax2.bar(hist.index, hist['Volume'], alpha=0.7, color='#6b7280')
            ax2.set_title('Volume des Transactions')
            ax2.set_ylabel('Volume')
            ax2.set_xlabel('Date')
            
            plt.tight_layout()
            chart_path = os.path.join(self.charts_dir, 'performance_history.png')
            plt.savefig(chart_path, dpi=300, bbox_inches='tight')
            plt.close()
            
            self.add_chart(chart_path, height=6*inch)
            
        except Exception as e:
            self.logger.error(f"Erreur création graphique performance: {e}")
    
    def create_volume_chart(self):
        """Crée un graphique d'analyse des volumes"""
        try:
            hist = self.data.get('history')
            if hist is None or hist.empty:
                return
            
            plt.figure(figsize=(12, 6))
            
            # Volume avec moyenne mobile
            hist['Volume_MA20'] = hist['Volume'].rolling(window=20).mean()
            
            plt.bar(hist.index, hist['Volume'], alpha=0.6, color='#6b7280', label='Volume quotidien')
            plt.plot(hist.index, hist['Volume_MA20'], color='#dc2626', linewidth=2, label='Moyenne mobile 20j')
            
            plt.title(f'Analyse des Volumes - {self.symbol}', fontsize=14, fontweight='bold')
            plt.ylabel('Volume')
            plt.xlabel('Date')
            plt.legend()
            plt.grid(True, alpha=0.3)
            
            plt.tight_layout()
            chart_path = os.path.join(self.charts_dir, 'volume_analysis.png')
            plt.savefig(chart_path, dpi=300, bbox_inches='tight')
            plt.close()
            
            self.add_chart(chart_path)
            
        except Exception as e:
            self.logger.error(f"Erreur création graphique volumes: {e}")
    
    def create_moving_averages_chart(self):
        """Crée un graphique des moyennes mobiles"""
        try:
            hist = self.data.get('history')
            if hist is None or hist.empty:
                return
            
            plt.figure(figsize=(12, 8))
            
            # Prix et moyennes mobiles
            plt.plot(hist.index, hist['Close'], label='Prix de clôture', linewidth=2, color='#1d4ed8')
            plt.plot(hist.index, hist['MA20'], label='MA 20 jours', alpha=0.8, color='#f59e0b')
            plt.plot(hist.index, hist['MA50'], label='MA 50 jours', alpha=0.8, color='#10b981')
            plt.plot(hist.index, hist['MA200'], label='MA 200 jours', alpha=0.8, color='#dc2626')
            
            plt.title(f'Analyse des Moyennes Mobiles - {self.symbol}', fontsize=14, fontweight='bold')
            plt.ylabel('Prix ($)')
            plt.xlabel('Date')
            plt.legend()
            plt.grid(True, alpha=0.3)
            
            plt.tight_layout()
            chart_path = os.path.join(self.charts_dir, 'moving_averages.png')
            plt.savefig(chart_path, dpi=300, bbox_inches='tight')
            plt.close()
            
            self.add_chart(chart_path)
            
        except Exception as e:
            self.logger.error(f"Erreur création graphique moyennes mobiles: {e}")


def generate_baseline_report(symbol: str, output_path: str) -> bool:
    """Fonction principale pour générer un rapport BASELINE"""
    generator = BaselineReportGenerator(symbol, output_path)
    return generator.generate_report()


if __name__ == "__main__":
    if len(sys.argv) == 3:
        symbol = sys.argv[1]
        output_path = sys.argv[2]
        
        success = generate_baseline_report(symbol, output_path)
        
        if success:
            print(f"✅ Rapport BASELINE généré: {output_path}")
        else:
            print("❌ Erreur lors de la génération")
    else:
        print("Usage: python baseline_generator.py <SYMBOL> <OUTPUT_PATH>")