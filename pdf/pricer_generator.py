#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
Générateur de rapport PRICER - Évaluation et pricing d'options
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

class PricerReportGenerator(BaseReportGenerator):
    """Générateur de rapports de pricing et évaluation d'options"""
    
    def __init__(self, symbol, output_path):
        super().__init__(symbol, output_path)
        self.report_type = "PRICER"
        
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
            backColor=colors.HexColor('#dc2626'),
            borderWidth=2,
            borderColor=colors.HexColor('#dc2626'),
            borderPadding=15,
            borderRadius=10
        )
        
        request_summary = f"Évaluation et pricing d'options sur {self.symbol}"
        self.story.append(Paragraph(f"Type d'Analyse : PRICER", badge_style))
        
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
        """Génère le rapport de pricing"""
        self.logger.info(f"📊 Génération rapport PRICER")
        
        # Récupération des données
        if not self.fetch_options_data():
            return False
        
        # Construction du rapport
        self.add_cover_page()
        self.add_table_of_contents()
        self.add_executive_summary()
        self.add_underlying_analysis()
        self.add_volatility_analysis()
        self.add_options_pricing_models()
        self.add_greeks_analysis()
        self.add_strategy_recommendations()
        self.add_risk_scenarios()
        self.add_market_making_insights()
        self.add_final_page()
        
        # Construction du PDF
        self.build_pdf()
        self.logger.info(f"✅ Rapport PRICER généré: {self.output_path}")
        return True
    
    def fetch_options_data(self):
        """Récupère les données d'options et de volatilité"""
        try:
            self.logger.info(f"📊 Récupération données options pour {self.symbol}")
            
            # Données de base
            if not self.fetch_data():
                return False
            
            ticker = yf.Ticker(self.symbol)
            
            # Données d'options
            try:
                self.data['options_dates'] = ticker.options
                if self.data['options_dates']:
                    # Prendre la première date d'expiration disponible
                    first_expiry = self.data['options_dates'][0]
                    options_chain = ticker.option_chain(first_expiry)
                    self.data['calls'] = options_chain.calls
                    self.data['puts'] = options_chain.puts
                    self.data['expiry_date'] = first_expiry
                else:
                    self.data['calls'] = pd.DataFrame()
                    self.data['puts'] = pd.DataFrame()
            except:
                self.logger.warning("Données d'options indisponibles")
                self.data['calls'] = pd.DataFrame()
                self.data['puts'] = pd.DataFrame()
            
            # Calcul de la volatilité historique
            hist = self.data.get('history')
            if hist is not None and not hist.empty:
                returns = hist['Close'].pct_change().dropna()
                self.data['historical_volatility'] = returns.std() * np.sqrt(252)
            else:
                self.data['historical_volatility'] = 0.25  # Default
            
            return True
            
        except Exception as e:
            self.logger.error(f"❌ Erreur récupération données options: {e}")
            return False
    
    def add_table_of_contents(self):
        """Ajoute une table des matières"""
        self.add_section_title("Table des Matières")
        
        toc_data = [
            ["1.", "Résumé Exécutif", "3"],
            ["2.", "Analyse du Sous-Jacent", "4"],
            ["3.", "Analyse de Volatilité", "6"],
            ["4.", "Modèles de Pricing", "8"],
            ["5.", "Analyse des Greeks", "11"],
            ["6.", "Recommandations Stratégiques", "14"],
            ["7.", "Scénarios de Risque", "16"],
            ["8.", "Insights Market Making", "18"]
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
        current_price = info.get('currentPrice', 0)
        historical_vol = self.data.get('historical_volatility', 0)
        
        summary_text = f"""
        <b>Analyse de Pricing d'Options - {self.symbol}</b>
        
        Cette analyse de pricing se concentre sur l'évaluation des options sur {info.get('longName', self.symbol)} 
        en utilisant des modèles quantitatifs sophistiqués et l'analyse de la microstructure des options.
        
        <b>Métriques Clés du Sous-Jacent</b>
        
        • Prix actuel : ${current_price:.2f}
        • Volatilité historique (1 an) : {historical_vol*100:.1f}%
        • Secteur : {info.get('sector', 'N/A')}
        • Capitalisation : ${info.get('marketCap', 0):,.0f}
        
        <b>Objectifs de l'Analyse</b>
        
        • **Évaluation Fair Value** : Pricing théorique vs prix de marché
        • **Opportunités d'Arbitrage** : Identification de mispricing
        • **Stratégies Optimales** : Recommandations tactiques selon market conditions
        • **Gestion du Risque** : Hedging et Greeks management
        
        <b>Méthodologie</b>
        
        Cette analyse utilise les modèles Black-Scholes, binomial trees, et Monte Carlo 
        pour fournir une évaluation complète du pricing des options et identifier 
        les opportunités de trading optimales.
        
        <b>Horizon d'Analyse</b>
        
        Focus sur les options avec échéances de 1 à 6 mois, optimales pour les 
        stratégies de trading actif et de hedging tactique.
        """
        
        self.add_text(summary_text)
        self.story.append(PageBreak())
    
    def add_underlying_analysis(self):
        """Ajoute l'analyse du sous-jacent"""
        self.add_section_title("2. Analyse du Sous-Jacent")
        
        info = self.data.get('info', {})
        hist = self.data.get('history')
        
        # Calculs pour l'analyse du sous-jacent
        current_price = info.get('currentPrice', 0)
        beta = info.get('beta', 1.0)
        
        underlying_text = f"""
        <b>Caractéristiques du Sous-Jacent</b>
        
        • **Symbole** : {self.symbol}
        • **Prix Spot** : ${current_price:.2f}
        • **Beta** : {beta:.2f}
        • **Secteur** : {info.get('sector', 'N/A')}
        • **Industrie** : {info.get('industry', 'N/A')}
        
        <b>Analyse de Liquidité</b>
        
        La liquidité du sous-jacent est cruciale pour l'évaluation des options :
        
        • **Volume moyen quotidien** : Indicateur de liquidité primaire
        • **Bid-Ask Spread** : Coût de transaction et market impact
        • **Market Cap** : ${info.get('marketCap', 0):,.0f}
        • **Float** : Actions disponibles pour le trading
        
        <b>Patterns de Trading</b>
        
        • **Horaires de liquidité** : Sessions les plus actives
        • **Saisonnalité** : Patterns récurrents mensuels/trimestriels
        • **Corporate Events** : Earnings, dividendes, splits
        • **News Sensitivity** : Réaction aux annonces et événements
        
        <b>Implications pour le Pricing d'Options</b>
        
        • **Liquidité élevée** : Spreads serrés, pricing efficace
        • **Volatilité prévisible** : Modèles de pricing plus fiables
        • **Événements programmés** : Ajustements de volatilité implicite
        • **Correlation patterns** : Impact sur les stratégies spread
        """
        
        self.add_text(underlying_text)
        self.story.append(PageBreak())
    
    def add_volatility_analysis(self):
        """Ajoute l'analyse de volatilité"""
        self.add_section_title("3. Analyse de Volatilité")
        
        historical_vol = self.data.get('historical_volatility', 0)
        
        # Calculs de volatilité avancés
        hist = self.data.get('history')
        if hist is not None and not hist.empty:
            returns = hist['Close'].pct_change().dropna()
            vol_30d = returns.tail(30).std() * np.sqrt(252) if len(returns) >= 30 else historical_vol
            vol_90d = returns.tail(90).std() * np.sqrt(252) if len(returns) >= 90 else historical_vol
        else:
            vol_30d = vol_90d = historical_vol
        
        volatility_text = f"""
        <b>Structure de Volatilité</b>
        
        • **Volatilité Historique 30j** : {vol_30d*100:.1f}%
        • **Volatilité Historique 90j** : {vol_90d*100:.1f}%
        • **Volatilité Historique 252j** : {historical_vol*100:.1f}%
        
        <b>Volatilité Implicite vs Historique</b>
        
        La comparaison entre volatilité implicite (prix des options) et volatilité 
        historique (mouvement réel du sous-jacent) révèle des opportunités :
        
        • **IV > HV** : Options potentiellement surévaluées (vente attractive)
        • **IV < HV** : Options potentiellement sous-évaluées (achat attractive)
        • **IV Skew** : Différences entre calls et puts (sentiment directionnel)
        • **Term Structure** : Volatilité selon les échéances
        
        <b>Modèles de Volatilité</b>
        
        • **GARCH Models** : Prévision de volatilité conditionnelle
        • **Stochastic Volatility** : Heston, Bates models
        • **Realized Volatility** : Mesures haute fréquence
        • **Jump Diffusion** : Modèles avec sauts de prix
        
        <b>Volatility Trading Strategies</b>
        
        • **Long Volatility** : Straddles, strangles sur événements
        • **Short Volatility** : Vente d'options sur volatilité élevée
        • **Volatility Arbitrage** : Exploitation des différences IV vs HV
        • **Calendar Spreads** : Exploitation term structure volatilité
        """
        
        self.add_text(volatility_text)
        self.story.append(PageBreak())
    
    def add_options_pricing_models(self):
        """Ajoute les modèles de pricing"""
        self.add_section_title("4. Modèles de Pricing")
        
        self.add_subsection_title("4.1 Modèle Black-Scholes")
        
        black_scholes_text = """
        <b>Modèle Black-Scholes-Merton</b>
        
        Le modèle fondamental pour le pricing d'options européennes :
        
        **Hypothèses du modèle :**
        • Prix du sous-jacent suit un mouvement brownien géométrique
        • Volatilité et taux d'intérêt constants
        • Pas de dividendes (ou dividendes connus)
        • Marchés liquides et sans friction
        
        **Formule Call Option :**
        C = S₀N(d₁) - Ke^(-rT)N(d₂)
        
        **Formule Put Option :**
        P = Ke^(-rT)N(-d₂) - S₀N(-d₁)
        
        **Avantages :**
        • Simplicité et rapidité de calcul
        • Benchmark universellement accepté
        • Base théorique solide
        
        **Limitations :**
        • Volatilité constante irréaliste
        • Ignore les sauts de prix
        • Options européennes uniquement
        """
        
        self.add_text(black_scholes_text)
        
        self.add_subsection_title("4.2 Modèles Binomiaux")
        
        binomial_text = """
        <b>Arbres Binomiaux (Cox-Ross-Rubinstein)</b>
        
        Modèle discret permettant le pricing d'options américaines :
        
        **Principe :**
        • Discrétisation du temps en périodes
        • Prix peut monter (u) ou descendre (d) à chaque période
        • Probabilité risque-neutre p = (e^(rΔt) - d)/(u - d)
        
        **Avantages :**
        • Options américaines (exercice anticipé)
        • Dividendes discrets facilement intégrés
        • Flexibilité dans la modélisation
        • Convergence vers Black-Scholes
        
        **Applications Pratiques :**
        • Pricing d'options américaines
        • Calcul des Greeks par différences finies
        • Stratégies d'exercice optimal
        • Exotic options avec barrières
        """
        
        self.add_text(binomial_text)
        
        self.add_subsection_title("4.3 Simulations Monte Carlo")
        
        monte_carlo_text = """
        <b>Méthodes Monte Carlo</b>
        
        Simulation stochastique pour options complexes :
        
        **Principe :**
        • Génération de milliers de chemins de prix aléatoires
        • Calcul du payoff moyen actualisé
        • Convergence vers la valeur théorique
        
        **Processus Stochastiques :**
        • Mouvement Brownien Géométrique (GBM)
        • Processus de Heston (volatilité stochastique)
        • Modèles à sauts (Merton, Kou)
        • Processus multi-facteurs
        
        **Applications :**
        • Options path-dependent (asiatiques, lookback)
        • Options à barrières multiples
        • Options sur paniers d'actifs
        • Calcul de Greeks complexes
        """
        
        self.add_text(monte_carlo_text)
        self.story.append(PageBreak())
    
    def add_greeks_analysis(self):
        """Ajoute l'analyse des Greeks"""
        self.add_section_title("5. Analyse des Greeks")
        
        greeks_text = """
        <b>Les Greeks - Mesures de Sensibilité</b>
        
        Les Greeks quantifient la sensibilité du prix des options aux facteurs de marché.
        """
        
        self.add_text(greeks_text)
        
        self.add_subsection_title("5.1 Delta")
        
        delta_text = """
        <b>Delta (Δ) - Sensibilité au Prix du Sous-Jacent</b>
        
        • **Définition** : ∂C/∂S - Variation du prix de l'option pour $1 de variation du sous-jacent
        • **Range** : Calls [0,1], Puts [-1,0]
        • **At-the-Money** : ≈ 0.5 pour calls, ≈ -0.5 pour puts
        • **Applications** : Hedging ratio, équivalent en actions
        
        **Delta Hedging :**
        • Position delta-neutre : Δ_portfolio = 0
        • Rebalancing dynamique selon les mouvements
        • Gamma risk : Δ change quand S change
        
        **Interprétation Pratique :**
        • Delta 0.30 call : +$0.30 si action +$1
        • Delta -0.40 put : +$0.40 si action -$1
        • Probabilité approximative d'expirer ITM
        """
        
        self.add_text(delta_text)
        
        self.add_subsection_title("5.2 Gamma")
        
        gamma_text = """
        <b>Gamma (Γ) - Sensibilité du Delta</b>
        
        • **Définition** : ∂²C/∂S² - Variation du delta pour $1 de variation du sous-jacent
        • **Maximum** : ATM options, surtout proche expiration
        • **Même valeur** : Calls et puts même strike/expiration
        • **Décroissance** : Avec le temps et distance de ATM
        
        **Gamma Trading :**
        • Long gamma : Profits sur gros mouvements (volatilité)
        • Short gamma : Profits sur stabilité (theta farming)
        • Gamma scalping : Trading delta-hedge profits
        
        **Risk Management :**
        • Gamma élevé = rebalancing fréquent
        • Gamma risk particulièrement important près expiration
        • Position sizing selon gamma exposure
        """
        
        self.add_text(gamma_text)
        
        self.add_subsection_title("5.3 Theta")
        
        theta_text = """
        <b>Theta (Θ) - Sensibilité au Temps</b>
        
        • **Définition** : ∂C/∂t - Variation du prix pour 1 jour écoulé
        • **Toujours négatif** : Pour les long options (time decay)
        • **Accélération** : Près de l'expiration, surtout ATM
        • **Weekend effect** : Decay sur 3 jours le vendredi
        
        **Theta Strategies :**
        • Selling premium : Iron condors, covered calls
        • Calendar spreads : Long terme/short proche expiration
        • Time decay profiling : Maximiser theta collection
        
        **Gestion du Time Decay :**
        • Monitoring accéléré dernières semaines
        • Rolling strategies avant expiration
        • Theta/Gamma trade-off optimization
        """
        
        self.add_text(theta_text)
        
        self.add_subsection_title("5.4 Vega")
        
        vega_text = """
        <b>Vega (ν) - Sensibilité à la Volatilité</b>
        
        • **Définition** : ∂C/∂σ - Variation pour 1% de changement de volatilité
        • **Toujours positif** : Long options profitent de hausse volatilité
        • **Maximum** : ATM options avec temps restant
        • **Corrélation** : Souvent corrélé négativement avec S&P 500
        
        **Vega Trading :**
        • Long vega : Anticipation événements/volatilité
        • Short vega : Farming premium en périodes calmes
        • Volatility term structure arbitrage
        
        **Volatility Risk :**
        • IV crush post-earnings : Chute brutale volatilité implicite
        • VIX spikes : Impact sur toutes les options
        • Correlation breakdown : Vega risk non-diversifiable
        """
        
        self.add_text(vega_text)
        self.story.append(PageBreak())
    
    def add_strategy_recommendations(self):
        """Ajoute les recommandations stratégiques"""
        self.add_section_title("6. Recommandations Stratégiques")
        
        historical_vol = self.data.get('historical_volatility', 0)
        
        strategies_text = f"""
        <b>Stratégies Optimales par Environnement</b>
        
        <b>1. Environnement Faible Volatilité (IV < {historical_vol*100*.8:.0f}%)</b>
        
        **Stratégies Recommandées :**
        • **Long Straddles/Strangles** : Acheter volatilité sous-évaluée
        • **Calendar Spreads** : Long terme/short proche expiration
        • **Butterfly Spreads** : Profit si prix reste dans range
        • **Iron Condors** : Vente premium avec protection
        
        **Rationale :**
        • IV probablement sous-évaluée historiquement
        • Anticipation retour vers volatilité moyenne
        • Structures asymétriques favorables
        
        <b>2. Environnement Haute Volatilité (IV > {historical_vol*100*1.2:.0f}%)</b>
        
        **Stratégies Recommandées :**
        • **Short Straddles/Strangles** : Vendre volatilité surévaluée
        • **Credit Spreads** : Bull/bear spreads selon direction
        • **Covered Calls** : Income generation sur positions long
        • **Cash-Secured Puts** : Acquisition ciblée avec premium
        
        **Rationale :**
        • IV probablement surévaluée temporairement
        • Mean reversion attendue vers volatilité normale
        • Time decay favorable aux vendeurs premium
        
        <b>3. Stratégies Directionnelles</b>
        
        **Bullish Outlook :**
        • **Call Debit Spreads** : Exposition directionnelle limitée
        • **Put Credit Spreads** : Profit si prix monte ou stable
        • **Covered Calls** : Income sur positions existantes
        
        **Bearish Outlook :**
        • **Put Debit Spreads** : Protection downside efficace
        • **Call Credit Spreads** : Profit si prix baisse ou stable
        • **Protective Puts** : Assurance sur positions long
        
        <b>4. Market Neutral Strategies</b>
        
        • **Iron Butterflies** : Profit maximum si prix = strike central
        • **Iron Condors** : Profit si prix reste dans range
        • **Calendar Spreads** : Exploitation time decay différentiel
        • **Volatility Arbitrage** : Long/short selon mispricing
        """
        
        self.add_text(strategies_text)
        self.story.append(PageBreak())
    
    def add_risk_scenarios(self):
        """Ajoute les scénarios de risque"""
        self.add_section_title("7. Scénarios de Risque")
        
        info = self.data.get('info', {})
        current_price = info.get('currentPrice', 0)
        
        risk_scenarios_text = f"""
        <b>Analyse de Scénarios et Stress Testing</b>
        
        <b>Scénario 1 : Mouvement Modéré (+/-10%)</b>
        
        • **Prix cible** : ${current_price*0.9:.2f} - ${current_price*1.1:.2f}
        • **Impact Delta** : Changement linéaire selon Greeks
        • **Impact Gamma** : Réajustement delta, rebalancing nécessaire
        • **Impact Theta** : Decay normal selon profil temporel
        • **Stratégies optimales** : Structures delta-hedge, spreads
        
        <b>Scénario 2 : Mouvement Important (+/-25%)</b>
        
        • **Prix cible** : ${current_price*0.75:.2f} - ${current_price*1.25:.2f}
        • **Gamma impact** : Non-linéarité significative, gaps possibles
        • **Volatility impact** : IV spike probable, vega exposure critique
        • **Liquidité** : Bid-ask spreads élargis, slippage
        • **Stratégies** : Long volatility, protective strategies
        
        <b>Scénario 3 : Volatility Spike (VIX +50%)</b>
        
        • **Impact sur IV** : Hausse généralisée volatilité implicite
        • **Corrélations** : Breakdown des corrélations historiques
        • **Vega explosion** : Long vega très profitable
        • **Liquidité** : Market makers élargissent spreads
        • **Actions** : Prendre profits long vega, éviter short vega
        
        <b>Scénario 4 : Event Risk (Earnings, FDA, etc.)</b>
        
        • **Volatility crush** : Chute IV post-événement même si mouvement
        • **Binary outcome** : Gap up/down significatif possible
        • **Volume surge** : Liquidité temporairement améliorée
        • **Strategies** : Long straddles pre-event, short post-event
        
        <b>Risk Management Framework</b>
        
        • **Position limits** : Max exposition par strategy/underlying
        • **Greeks limits** : Delta, gamma, vega, theta maximums
        • **Scenario P&L** : Stress testing quotidien
        • **Liquidity buffers** : Capacité de liquidation rapide
        • **Correlation monitoring** : Surveillance corrélations positions
        """
        
        self.add_text(risk_scenarios_text)
        self.story.append(PageBreak())
    
    def add_market_making_insights(self):
        """Ajoute les insights de market making"""
        self.add_section_title("8. Insights Market Making")
        
        market_making_text = """
        <b>Perspective Market Maker</b>
        
        <b>1. Bid-Ask Spread Dynamics</b>
        
        • **Factors influencing spreads** :
          - Volatilité du sous-jacent
          - Time to expiration
          - Moneyness (ITM/ATM/OTM)
          - Volume et open interest
          - Market conditions générales
        
        • **Spread components** :
          - Order processing costs
          - Inventory holding costs
          - Adverse selection costs
          - Competition entre market makers
        
        <b>2. Inventory Management</b>
        
        • **Delta hedging** : Couverture exposition directionnelle
        • **Gamma risk** : Gestion convexité, rebalancing costs
        • **Vega hedging** : Couverture risque volatilité
        • **Portfolio optimization** : Diversification Greeks exposure
        
        <b>3. Pricing Inefficiencies</b>
        
        **Opportunités pour traders retail :**
        
        • **Wide spreads** : Négociation entre bid/ask
        • **Stale quotes** : Prix non-mis-à-jour rapidement
        • **Cross-market arbitrage** : Différences entre exchanges
        • **Pin risk** : Expiration proche du strike
        
        **Timing optimal :**
        
        • **Market open** : Spreads plus larges, volatilité élevée
        • **Mid-session** : Spreads normalisés, conditions optimales
        • **Close** : Risk management MM, opportunités
        • **Low volume periods** : Spreads élargis
        
        <b>4. Information Flow</b>
        
        • **Order flow toxicity** : Informed vs uninformed trading
        • **Pin risk management** : Expiration day dynamics
        • **Volatility forecasting** : Anticipation moves post-events
        • **Correlation trading** : Exploitation relationships inter-assets
        
        <b>Best Practices pour Traders</b>
        
        • **Avoid market orders** : Utiliser limit orders
        • **Time your trades** : Éviter périodes faible liquidité
        • **Understand the Greeks** : Impact avant trading
        • **Monitor implied volatility** : Relative value assessment
        • **Size appropriately** : Position sizing selon Greeks
        """
        
        self.add_text(market_making_text)
    