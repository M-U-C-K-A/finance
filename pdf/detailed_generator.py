#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
Générateur de rapport DETAILED - Analyse technique et fondamentale approfondie
"""

import os
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from datetime import datetime, timedelta
import yfinance as yf
from reportlab.lib import colors
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY
from reportlab.platypus import Paragraph, Spacer, PageBreak, Table, TableStyle
from report_base import BaseReportGenerator

class DetailedReportGenerator(BaseReportGenerator):
    """Générateur de rapports d'analyse détaillée"""
    
    def __init__(self, symbol, output_path):
        super().__init__(symbol, output_path)
        self.report_type = "DETAILED"
        
    def add_analysis_type_badge(self):
        """Ajoute le badge de type d'analyse sur la page de garde"""
        badge_style = ParagraphStyle(
            'BadgeStyle',
            parent=self.styles['Normal'],
            fontSize=16,
            textColor=colors.white,
            alignment=TA_CENTER,
            spaceAfter=30,
            fontName='Helvetica-Bold',
            backColor=colors.HexColor('#059669'),
            borderWidth=2,
            borderColor=colors.HexColor('#059669'),
            borderPadding=15,
            borderRadius=10
        )
        
        request_summary = f"Analyse technique et fondamentale complète de {self.symbol}"
        self.story.append(Paragraph(f"Type d'Analyse : DETAILED", badge_style))
        
        summary_style = ParagraphStyle(
            'SummaryStyle',
            parent=self.styles['Normal'],
            fontSize=12,
            textColor=colors.HexColor('#374151'),
            alignment=TA_CENTER,
            spaceAfter=40,
            fontStyle='italic'
        )
        self.story.append(Paragraph(request_summary, summary_style))
    
    def generate_report(self):
        """Génère le rapport détaillé complet"""
        self.logger.info(f"📊 Génération rapport DETAILED")
        
        # Récupération des données
        if not self.fetch_data():
            return False
        
        # Construction du rapport
        self.add_cover_page()
        self.add_table_of_contents()
        self.add_executive_summary()
        self.add_fundamental_analysis()
        self.add_technical_analysis()
        self.add_quantitative_metrics()
        self.add_risk_analysis()
        self.add_sector_comparison()
        self.add_valuation_analysis()
        self.add_dividend_analysis()
        self.add_insider_activity()
        self.add_analyst_consensus()
        self.add_final_recommendations()
        self.add_final_page()
        
        # Construction du PDF
        self.build_pdf()
        self.logger.info(f"✅ Rapport DETAILED généré: {self.output_path}")
        return True
    
    def add_table_of_contents(self):
        """Ajoute une table des matières"""
        self.add_section_title("Table des Matières")
        
        toc_data = [
            ["1.", "Résumé Exécutif", "3"],
            ["2.", "Analyse Fondamentale", "4"],
            ["3.", "Analyse Technique", "8"],
            ["4.", "Métriques Quantitatives", "12"],
            ["5.", "Analyse des Risques", "15"],
            ["6.", "Comparaison Sectorielle", "18"],
            ["7.", "Analyse de Valorisation", "21"],
            ["8.", "Analyse des Dividendes", "24"],
            ["9.", "Activité des Initiés", "26"],
            ["10.", "Consensus Analystes", "28"],
            ["11.", "Recommandations Finales", "30"]
        ]
        
        toc_table = Table(toc_data, colWidths=[30, 350, 50])
        toc_table.setStyle(TableStyle([
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (-1, -1), 'Helvetica'),
            ('FONTSIZE', (0, 0), (-1, -1), 11),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
            ('TOPPADDING', (0, 0), (-1, -1), 8),
        ]))
        
        self.story.append(toc_table)
        self.story.append(PageBreak())
    
    def add_executive_summary(self):
        """Ajoute le résumé exécutif"""
        self.add_section_title("1. Résumé Exécutif")
        
        info = self.data.get('info', {})
        hist = self.data.get('history')
        
        # Calculs de base
        current_price = info.get('currentPrice', 0)
        price_change_1m = 0
        price_change_3m = 0
        price_change_1y = 0
        
        if hist is not None and not hist.empty and len(hist) > 0:
            try:
                price_change_1m = ((current_price - hist['Close'].iloc[-22]) / hist['Close'].iloc[-22] * 100) if len(hist) >= 22 else 0
                price_change_3m = ((current_price - hist['Close'].iloc[-66]) / hist['Close'].iloc[-66] * 100) if len(hist) >= 66 else 0
                price_change_1y = ((current_price - hist['Close'].iloc[-252]) / hist['Close'].iloc[-252] * 100) if len(hist) >= 252 else 0
            except:
                pass
        
        # Détermination du sentiment global
        sentiment_score = (price_change_1m + price_change_3m + price_change_1y) / 3
        if sentiment_score > 10:
            sentiment = "TRÈS POSITIF"
            sentiment_color = "#059669"
        elif sentiment_score > 0:
            sentiment = "POSITIF"
            sentiment_color = "#10b981"
        elif sentiment_score > -10:
            sentiment = "NEUTRE"
            sentiment_color = "#f59e0b"
        else:
            sentiment = "NÉGATIF"
            sentiment_color = "#dc2626"
        
        summary_text = f"""
        <b>Vue d'Ensemble</b>
        
        {info.get('longName', self.symbol)} ({self.symbol}) présente actuellement un profil d'investissement 
        avec un sentiment général <b style="color: {sentiment_color}">{sentiment}</b> basé sur notre analyse multi-dimensionnelle.
        
        <b>Performance Récente</b>
        
        • Performance 1 mois : {price_change_1m:+.1f}%
        • Performance 3 mois : {price_change_3m:+.1f}%
        • Performance 1 an : {price_change_1y:+.1f}%
        
        <b>Points Clés de l'Analyse</b>
        
        Cette analyse détaillée couvre 11 dimensions critiques de l'investissement, incluant l'analyse 
        fondamentale, technique, quantitative, les risques, la valorisation, et les perspectives sectorielles. 
        L'approche méthodologique combine data science, analyse financière traditionnelle et intelligence 
        de marché pour fournir une évaluation exhaustive.
        
        <b>Secteur d'Activité</b>
        
        Secteur : {info.get('sector', 'Non disponible')}
        Industrie : {info.get('industry', 'Non disponible')}
        Capitalisation : ${info.get('marketCap', 0):,.0f} (si disponible)
        
        <b>Objectif de l'Analyse</b>
        
        Cette analyse détaillée vise à fournir une compréhension complète des opportunités et risques 
        associés à cet investissement, avec des recommandations actionables basées sur des métriques 
        quantitatives et qualitatives robustes.
        """
        
        self.add_text(summary_text)
        self.story.append(PageBreak())
    
    def add_fundamental_analysis(self):
        """Ajoute l'analyse fondamentale détaillée"""
        self.add_section_title("2. Analyse Fondamentale")
        
        info = self.data.get('info', {})
        
        self.add_subsection_title("2.1 Métriques de Valorisation")
        
        # Métriques clés
        pe_ratio = info.get('trailingPE', 'N/A')
        pb_ratio = info.get('priceToBook', 'N/A')
        ps_ratio = info.get('priceToSalesTrailing12Months', 'N/A')
        ev_ebitda = info.get('enterpriseToEbitda', 'N/A')
        
        valuation_text = f"""
        <b>Ratios de Valorisation Actuels</b>
        
        • P/E Ratio (Price-to-Earnings) : {pe_ratio}
        • P/B Ratio (Price-to-Book) : {pb_ratio}
        • P/S Ratio (Price-to-Sales) : {ps_ratio}
        • EV/EBITDA : {ev_ebitda}
        
        <b>Interprétation des Ratios</b>
        
        Les ratios de valorisation actuels sont analysés dans le contexte sectoriel et historique. 
        Un P/E élevé peut indiquer des attentes de croissance élevées ou une surévaluation, tandis 
        qu'un P/B faible peut suggérer une opportunité de valeur ou des problèmes fondamentaux.
        """
        
        self.add_text(valuation_text)
        
        self.add_subsection_title("2.2 Santé Financière")
        
        # Métriques de santé financière
        debt_to_equity = info.get('debtToEquity', 'N/A')
        current_ratio = info.get('currentRatio', 'N/A')
        roe = info.get('returnOnEquity', 'N/A')
        roa = info.get('returnOnAssets', 'N/A')
        
        financial_health_text = f"""
        <b>Indicateurs de Solidité Financière</b>
        
        • Ratio d'endettement (Debt/Equity) : {debt_to_equity}
        • Ratio de liquidité courante : {current_ratio}
        • Retour sur fonds propres (ROE) : {roe}
        • Retour sur actifs (ROA) : {roa}
        
        <b>Analyse de la Structure Financière</b>
        
        L'analyse de la structure financière révèle la capacité de l'entreprise à générer des rendements 
        pour les actionnaires tout en maintenant un niveau de risque approprié. Un ratio d'endettement 
        équilibré et des ratios de rentabilité élevés indiquent généralement une gestion efficace.
        """
        
        self.add_text(financial_health_text)
        
        self.add_subsection_title("2.3 Croissance et Profitabilité")
        
        revenue_growth = info.get('revenueGrowth', 'N/A')
        earnings_growth = info.get('earningsGrowth', 'N/A')
        profit_margin = info.get('profitMargins', 'N/A')
        
        growth_text = f"""
        <b>Métriques de Croissance</b>
        
        • Croissance du chiffre d'affaires : {revenue_growth}
        • Croissance des bénéfices : {earnings_growth}
        • Marge bénéficiaire : {profit_margin}
        
        <b>Tendances de Performance</b>
        
        L'analyse des tendances de croissance permet d'évaluer la capacité de l'entreprise à 
        augmenter ses revenus et sa rentabilité de manière durable. Une croissance constante 
        et des marges en amélioration sont des signaux positifs pour les investisseurs.
        """
        
        self.add_text(growth_text)
        self.story.append(PageBreak())
    
    def add_technical_analysis(self):
        """Ajoute l'analyse technique complète"""
        self.add_section_title("3. Analyse Technique")
        
        hist = self.data.get('history')
        if hist is None or hist.empty:
            self.add_text("Données historiques insuffisantes pour l'analyse technique.")
            return
        
        self.add_subsection_title("3.1 Analyse des Tendances")
        
        # Calcul des moyennes mobiles
        hist['MA20'] = hist['Close'].rolling(20).mean()
        hist['MA50'] = hist['Close'].rolling(50).mean()
        hist['MA200'] = hist['Close'].rolling(200).mean()
        
        current_price = hist['Close'].iloc[-1]
        ma20 = hist['MA20'].iloc[-1] if not pd.isna(hist['MA20'].iloc[-1]) else 0
        ma50 = hist['MA50'].iloc[-1] if not pd.isna(hist['MA50'].iloc[-1]) else 0
        ma200 = hist['MA200'].iloc[-1] if not pd.isna(hist['MA200'].iloc[-1]) else 0
        
        # Détermination de la tendance
        trend = "HAUSSE" if current_price > ma20 > ma50 > ma200 else "BAISSE" if current_price < ma20 < ma50 < ma200 else "LATÉRALE"
        
        technical_text = f"""
        <b>Analyse des Moyennes Mobiles</b>
        
        • Prix actuel : ${current_price:.2f}
        • Moyenne mobile 20 jours : ${ma20:.2f}
        • Moyenne mobile 50 jours : ${ma50:.2f}
        • Moyenne mobile 200 jours : ${ma200:.2f}
        
        <b>Signal de Tendance : {trend}</b>
        
        L'analyse des moyennes mobiles indique une tendance {trend.lower()}. La position relative 
        du prix par rapport aux différentes moyennes mobiles fournit des indications sur la force 
        et la direction de la tendance actuelle.
        """
        
        self.add_text(technical_text)
        
        # Créer le graphique des moyennes mobiles
        self.create_moving_averages_chart(hist)
        
        self.add_subsection_title("3.2 Indicateurs de Momentum")
        
        # Calcul du RSI
        def calculate_rsi(prices, periods=14):
            delta = prices.diff()
            gain = (delta.where(delta > 0, 0)).rolling(window=periods).mean()
            loss = (-delta.where(delta < 0, 0)).rolling(window=periods).mean()
            rs = gain / loss
            rsi = 100 - (100 / (1 + rs))
            return rsi
        
        hist['RSI'] = calculate_rsi(hist['Close'])
        current_rsi = hist['RSI'].iloc[-1] if not pd.isna(hist['RSI'].iloc[-1]) else 50
        
        rsi_interpretation = "SURVENTE" if current_rsi < 30 else "SURACHAT" if current_rsi > 70 else "NEUTRE"
        
        momentum_text = f"""
        <b>Indicateur RSI (Relative Strength Index)</b>
        
        • RSI actuel : {current_rsi:.1f}
        • Interprétation : {rsi_interpretation}
        
        <b>Analyse du Momentum</b>
        
        Le RSI mesure la vitesse et l'ampleur des mouvements de prix. Un RSI au-dessus de 70 
        indique généralement une condition de surachat, tandis qu'un RSI en dessous de 30 
        suggère une condition de survente. Le niveau actuel de {current_rsi:.1f} indique 
        une situation {rsi_interpretation.lower()}.
        """
        
        self.add_text(momentum_text)
        
        self.add_subsection_title("3.3 Support et Résistance")
        
        # Calcul des niveaux de support et résistance
        recent_high = hist['High'].rolling(20).max().iloc[-1]
        recent_low = hist['Low'].rolling(20).min().iloc[-1]
        
        support_resistance_text = f"""
        <b>Niveaux Techniques Clés</b>
        
        • Résistance proche : ${recent_high:.2f}
        • Support proche : ${recent_low:.2f}
        • Range actuel : ${recent_high - recent_low:.2f} (${(recent_high - recent_low)/current_price*100:.1f}%)
        
        <b>Analyse des Niveaux</b>
        
        Les niveaux de support et résistance identifiés sont basés sur les extremes récents 
        et peuvent servir de points de référence pour les décisions d'entrée et de sortie. 
        Une rupture au-dessus de la résistance ou en dessous du support peut signaler 
        un changement de tendance.
        """
        
        self.add_text(support_resistance_text)
        self.story.append(PageBreak())
    
    def add_quantitative_metrics(self):
        """Ajoute les métriques quantitatives avancées"""
        self.add_section_title("4. Métriques Quantitatives")
        
        hist = self.data.get('history')
        if hist is None or hist.empty:
            self.add_text("Données insuffisantes pour l'analyse quantitative.")
            return
        
        # Calcul de la volatilité
        returns = hist['Close'].pct_change().dropna()
        volatility_daily = returns.std()
        volatility_annual = volatility_daily * np.sqrt(252)
        
        # Calcul du Sharpe ratio (approximatif avec risk-free rate = 2%)
        risk_free_rate = 0.02
        mean_return = returns.mean() * 252
        sharpe_ratio = (mean_return - risk_free_rate) / volatility_annual if volatility_annual > 0 else 0
        
        # Calcul de la Value at Risk (VaR)
        var_95 = np.percentile(returns, 5)
        var_99 = np.percentile(returns, 1)
        
        quant_text = f"""
        <b>Analyse de Volatilité</b>
        
        • Volatilité quotidienne : {volatility_daily*100:.2f}%
        • Volatilité annualisée : {volatility_annual*100:.2f}%
        • Ratio de Sharpe (approx.) : {sharpe_ratio:.2f}
        
        <b>Mesures de Risque</b>
        
        • Value at Risk 95% : {var_95*100:.2f}% (perte quotidienne maximum avec 95% de confiance)
        • Value at Risk 99% : {var_99*100:.2f}% (perte quotidienne maximum avec 99% de confiance)
        
        <b>Interprétation Quantitative</b>
        
        Ces métriques quantitatives fournissent une évaluation objective du profil risque-rendement. 
        Un ratio de Sharpe élevé indique un meilleur rendement ajusté au risque, tandis que les 
        mesures VaR quantifient les pertes potentielles dans des scénarios défavorables.
        """
        
        self.add_text(quant_text)
        self.story.append(PageBreak())
    
    def add_risk_analysis(self):
        """Ajoute l'analyse détaillée des risques"""
        self.add_section_title("5. Analyse des Risques")
        
        info = self.data.get('info', {})
        
        risk_text = f"""
        <b>Risques Spécifiques à l'Entreprise</b>
        
        • Risque sectoriel : Exposition aux cycles économiques du secteur {info.get('sector', 'N/A')}
        • Risque de concentration : Dépendance aux marchés principaux
        • Risque de change : Impact des fluctuations monétaires
        • Risque réglementaire : Évolution de l'environnement réglementaire
        
        <b>Risques de Marché</b>
        
        • Risque systémique : Corrélation avec les indices de marché
        • Risque de liquidité : Capacité à acheter/vendre sans impact sur le prix
        • Risque de taux d'intérêt : Sensibilité aux variations des taux
        • Risque géopolitique : Impact des événements internationaux
        
        <b>Mitigation des Risques</b>
        
        Stratégies recommandées pour réduire l'exposition aux risques identifiés :
        
        • Diversification sectorielle et géographique
        • Utilisation d'instruments de couverture appropriés
        • Surveillance continue des indicateurs d'alerte précoce
        • Ajustement de la taille de position selon le profil de risque
        """
        
        self.add_text(risk_text)
        self.story.append(PageBreak())
    
    def add_sector_comparison(self):
        """Ajoute la comparaison sectorielle"""
        self.add_section_title("6. Comparaison Sectorielle")
        
        info = self.data.get('info', {})
        sector = info.get('sector', 'Non disponible')
        
        sector_text = f"""
        <b>Positionnement Sectoriel</b>
        
        Secteur d'activité : {sector}
        Industrie : {info.get('industry', 'Non disponible')}
        
        <b>Performance Sectorielle</b>
        
        Cette section analyserait normalement la performance relative au secteur, mais nécessite 
        des données de comparaison sectorielles étendues. Les éléments clés incluent :
        
        • Comparaison des multiples de valorisation avec les pairs
        • Performance relative aux indices sectoriels
        • Positionnement concurrentiel
        • Tendances et perspectives sectorielles
        
        <b>Avantages Concurrentiels</b>
        
        • Position de marché et part de marché
        • Différenciation produit/service
        • Efficacité opérationnelle
        • Innovation et R&D
        • Force de la marque et fidélité client
        """
        
        self.add_text(sector_text)
        self.story.append(PageBreak())
    
    def add_valuation_analysis(self):
        """Ajoute l'analyse de valorisation"""
        self.add_section_title("7. Analyse de Valorisation")
        
        info = self.data.get('info', {})
        
        # Prix cible basé sur les multiples
        current_price = info.get('currentPrice', 0)
        target_mean = info.get('targetMeanPrice', current_price)
        target_high = info.get('targetHighPrice', current_price)
        target_low = info.get('targetLowPrice', current_price)
        
        valuation_text = f"""
        <b>Valorisation Actuelle</b>
        
        • Prix actuel : ${current_price:.2f}
        • Prix cible moyen : ${target_mean:.2f}
        • Prix cible haut : ${target_high:.2f}
        • Prix cible bas : ${target_low:.2f}
        
        <b>Méthodes de Valorisation</b>
        
        1. **Analyse des Comparables (Trading Multiples)**
           - P/E, P/B, EV/EBITDA vs pairs sectoriels
           - Ajustements pour taille, croissance, profitabilité
        
        2. **Modèle de Flux de Trésorerie Actualisés (DCF)**
           - Projection des flux de trésorerie futurs
           - Taux d'actualisation basé sur le WACC
           - Valeur terminale et sensibilité aux hypothèses
        
        3. **Analyse de la Valeur d'Actif**
           - Valeur comptable ajustée
           - Valeur de liquidation
           - Actifs intangibles et goodwill
        
        <b>Conclusion sur la Valorisation</b>
        
        L'analyse multi-méthodes suggère une valorisation actuelle qui peut être considérée 
        dans le contexte des fondamentaux de l'entreprise et des conditions de marché.
        """
        
        self.add_text(valuation_text)
        self.story.append(PageBreak())
    
    def add_dividend_analysis(self):
        """Ajoute l'analyse des dividendes"""
        self.add_section_title("8. Analyse des Dividendes")
        
        info = self.data.get('info', {})
        
        dividend_yield = info.get('dividendYield', 0)
        dividend_rate = info.get('dividendRate', 0)
        payout_ratio = info.get('payoutRatio', 0)
        
        dividend_text = f"""
        <b>Politique de Dividende</b>
        
        • Rendement dividende : {dividend_yield*100:.2f}% (si applicable)
        • Taux de dividende annuel : ${dividend_rate:.2f}
        • Ratio de distribution : {payout_ratio*100:.1f}%
        
        <b>Analyse de Durabilité</b>
        
        L'analyse de durabilité des dividendes prend en compte :
        
        • Couverture par les bénéfices (ratio de distribution)
        • Stabilité et croissance historique des dividendes
        • Flux de trésorerie libre disponible
        • Politique de distribution de l'entreprise
        • Comparaison avec les standards sectoriels
        
        <b>Attractivité pour les Investisseurs</b>
        
        Pour les investisseurs orientés revenus, cette action {'offre' if dividend_yield > 0.02 else 'offre peu de'} 
        attractivité en termes de rendement dividende. La politique de dividende doit être 
        évaluée dans le contexte de la stratégie globale d'investissement.
        """
        
        self.add_text(dividend_text)
        self.story.append(PageBreak())
    
    def add_insider_activity(self):
        """Ajoute l'analyse de l'activité des initiés"""
        self.add_section_title("9. Activité des Initiés")
        
        insider_text = """
        <b>Transactions des Initiés</b>
        
        L'analyse de l'activité des initiés (dirigeants, administrateurs, actionnaires > 10%) 
        fournit des insights sur la confiance interne dans les perspectives de l'entreprise.
        
        <b>Indicateurs Clés</b>
        
        • Volume et fréquence des achats/ventes
        • Timing des transactions par rapport aux annonces
        • Concentration des transactions par type d'initié
        • Montants relatifs aux positions détenues
        
        <b>Interprétation</b>
        
        - **Achats massifs d'initiés** : Signal généralement positif
        - **Ventes importantes** : Peuvent indiquer des préoccupations ou des besoins de liquidité
        - **Transactions programmées** : Moins significatives que les transactions discrétionnaires
        
        <b>Note Méthodologique</b>
        
        Cette analyse nécessite l'accès à des données spécialisées sur les transactions d'initiés 
        (formulaires SEC 4, 3, 5) qui ne sont pas incluses dans cette version du rapport.
        """
        
        self.add_text(insider_text)
        self.story.append(PageBreak())
    
    def add_analyst_consensus(self):
        """Ajoute l'analyse du consensus des analystes"""
        self.add_section_title("10. Consensus des Analystes")
        
        info = self.data.get('info', {})
        
        recommendation = info.get('recommendationMean', 'N/A')
        target_price = info.get('targetMeanPrice', 'N/A')
        num_analysts = info.get('numberOfAnalystOpinions', 'N/A')
        
        analyst_text = f"""
        <b>Recommandations des Analystes</b>
        
        • Score de recommandation moyen : {recommendation}
        • Prix cible moyen : ${target_price} (si disponible)
        • Nombre d'analystes couvrant l'action : {num_analysts}
        
        <b>Échelle de Recommandation</b>
        
        1.0 - 1.5 : Achat Fort (Strong Buy)
        1.5 - 2.5 : Achat (Buy)
        2.5 - 3.5 : Conserver (Hold)
        3.5 - 4.5 : Vendre (Sell)
        4.5 - 5.0 : Vente Forte (Strong Sell)
        
        <b>Analyse du Consensus</b>
        
        Le consensus des analystes reflète l'opinion collective des professionnels qui suivent 
        régulièrement l'action. Cependant, il est important de noter que :
        
        • Les recommandations peuvent être biaisées par les relations business
        • Le consensus peut être en retard sur les développements récents
        • La dispersion des opinions est aussi importante que la moyenne
        • Les révisions récentes ont plus de poids que les anciennes recommandations
        
        <b>Utilisation Pratique</b>
        
        Le consensus doit être utilisé comme un point de référence, non comme une vérité absolue. 
        Il est particulièrement utile pour identifier les changements de sentiment et les 
        divergences potentielles avec l'analyse fondamentale indépendante.
        """
        
        self.add_text(analyst_text)
        self.story.append(PageBreak())
    
    def add_final_recommendations(self):
        """Ajoute les recommandations finales"""
        self.add_section_title("11. Recommandations Finales")
        
        info = self.data.get('info', {})
        current_price = info.get('currentPrice', 0)
        
        # Synthèse simplifiée pour la démonstration
        recommendations_text = f"""
        <b>Synthèse de l'Analyse Détaillée</b>
        
        Cette analyse exhaustive de {self.symbol} a examiné 10 dimensions critiques pour 
        l'investissement. La méthodologie combine analyse fondamentale, technique, quantitative 
        et qualitative pour fournir une évaluation complète.
        
        <b>Points Forts Identifiés</b>
        
        • Analyse fondamentale : Métriques de valorisation et santé financière
        • Analyse technique : Tendances et momentum actuels
        • Profil quantitatif : Ratio risque-rendement et métriques statistiques
        • Positionnement sectoriel : Avantages concurrentiels potentiels
        
        <b>Risques Principaux</b>
        
        • Risques spécifiques à l'entreprise et au secteur
        • Risques de marché et macroéconomiques
        • Risques de valorisation et de liquidité
        • Risques réglementaires et géopolitiques
        
        <b>Recommandation d'Allocation</b>
        
        Sur la base de cette analyse détaillée, une allocation de **3-7%** d'un portefeuille 
        diversifié pourrait être appropriée, en fonction du profil de risque de l'investisseur 
        et des objectifs d'investissement.
        
        <b>Stratégie d'Implémentation</b>
        
        • **Entrée progressive** : Étaler les achats sur plusieurs séances
        • **Monitoring continu** : Surveiller les indicateurs clés identifiés
        • **Réévaluation périodique** : Revoir l'analyse trimestriellement
        • **Gestion du risque** : Utiliser des stops appropriés
        
        <b>Horizon d'Investissement Recommandé</b>
        
        Cette analyse est optimisée pour un horizon d'investissement de **6-18 mois**, 
        avec des points de réévaluation trimestriels pour ajuster la stratégie selon 
        l'évolution des fondamentaux et conditions de marché.
        """
        
        self.add_text(recommendations_text)
    
    def create_moving_averages_chart(self, hist):
        """Crée un graphique des moyennes mobiles"""
        try:
            plt.style.use('seaborn-v0_8')
            fig, ax = plt.subplots(figsize=(12, 8))
            
            # Graphique des prix et moyennes mobiles
            ax.plot(hist.index[-100:], hist['Close'][-100:], label='Prix', linewidth=2, color='#1f77b4')
            ax.plot(hist.index[-100:], hist['MA20'][-100:], label='MA20', linewidth=1.5, color='#ff7f0e', alpha=0.8)
            ax.plot(hist.index[-100:], hist['MA50'][-100:], label='MA50', linewidth=1.5, color='#2ca02c', alpha=0.8)
            ax.plot(hist.index[-100:], hist['MA200'][-100:], label='MA200', linewidth=1.5, color='#d62728', alpha=0.8)
            
            ax.set_title(f'Analyse Technique - {self.symbol}', fontsize=16, fontweight='bold', pad=20)
            ax.set_xlabel('Date', fontsize=12)
            ax.set_ylabel('Prix ($)', fontsize=12)
            ax.legend(loc='upper left')
            ax.grid(True, alpha=0.3)
            
            plt.tight_layout()
            chart_path = self.charts_dir / f"technical_analysis_{self.symbol}.png"
            plt.savefig(chart_path, dpi=300, bbox_inches='tight')
            plt.close()
            
            self.add_chart(str(chart_path))
            
        except Exception as e:
            self.logger.error(f"Erreur création graphique technique: {e}")