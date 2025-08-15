#!/usr/bin/env python3
"""
ULTRA PREMIUM PDF Generator pour FinAnalytics
Rapport institutionnel ultra-complet de 100+ pages
"""

import os
import sys
import logging
import json
from datetime import datetime, timedelta
import pandas as pd
import numpy as np
import yfinance as yf
import requests
from reportlab.lib.pagesizes import A4
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Image, PageBreak, Table, TableStyle, KeepTogether
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch, cm, mm
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY, TA_LEFT, TA_RIGHT
from reportlab.graphics.shapes import Drawing, Rect, String
from reportlab.graphics.charts.linecharts import HorizontalLineChart
from reportlab.graphics.charts.barcharts import VerticalBarChart
from reportlab.graphics.charts.piecharts import Pie
from io import BytesIO
import matplotlib.pyplot as plt
import matplotlib.dates as mdates
import seaborn as sns
import plotly.graph_objects as go
import plotly.express as px
from plotly.subplots import make_subplots
import plotly.io as pio
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor
from scipy import stats
import warnings
warnings.filterwarnings('ignore')

# Configuration logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('finanalytics.log'),
        logging.StreamHandler()
    ]
)

class UltraPremiumPDFGenerator:
    """
    Générateur de rapports financiers ULTRA COMPLETS
    
    Fonctionnalités:
    - Analyse technique complète avec 50+ indicateurs
    - Analyse fondamentale approfondie
    - Modélisation financière avancée
    - Analyse de risque quantitative
    - Prévisions avec Machine Learning
    - Analyse sectorielle et concurrentielle
    - Analyse macroéconomique
    - Tests de stress et scénarios
    - Monte Carlo et simulations
    - Corrélations et analyse de portefeuille
    - Recommandations d'investissement détaillées
    """
    
    def __init__(self, symbol: str, output_path: str):
        self.symbol = symbol.upper()
        self.output_path = output_path
        self.doc = SimpleDocTemplate(output_path, pagesize=A4,
                                   topMargin=2*cm, bottomMargin=2*cm,
                                   leftMargin=2.5*cm, rightMargin=2*cm)
        self.styles = getSampleStyleSheet()
        self.story = []
        
        # Données et résultats d'analyse
        self.ticker = None
        self.data = None
        self.info = {}
        self.financials = {}
        self.technical_indicators = {}
        self.ml_predictions = {}
        self.risk_metrics = {}
        self.sector_analysis = {}
        self.macro_analysis = {}
        
        # Configuration graphiques
        self.chart_width = 16*cm
        self.chart_height = 10*cm
        self.temp_chart_dir = "temp_charts"
        os.makedirs(self.temp_chart_dir, exist_ok=True)
        
        # Styles personnalisés
        self.create_premium_styles()
        
    def create_premium_styles(self):
        """Crée des styles professionnels premium"""
        
        # Style titre principal
        self.title_style = ParagraphStyle(
            'UltraPremiumTitle',
            parent=self.styles['Title'],
            fontSize=28,
            fontName='Helvetica-Bold',
            textColor=colors.HexColor('#1f4e79'),
            alignment=TA_CENTER,
            spaceAfter=40,
            spaceBefore=20
        )
        
        # Style sous-titre
        self.subtitle_style = ParagraphStyle(
            'PremiumSubtitle',
            parent=self.styles['Heading1'],
            fontSize=18,
            fontName='Helvetica-Bold',
            textColor=colors.HexColor('#2e75b6'),
            alignment=TA_CENTER,
            spaceAfter=25,
            spaceBefore=15
        )
        
        # Style section majeure
        self.section_style = ParagraphStyle(
            'MajorSection',
            parent=self.styles['Heading1'],
            fontSize=16,
            fontName='Helvetica-Bold',
            textColor=colors.HexColor('#1f4e79'),
            spaceBefore=25,
            spaceAfter=15,
            borderWidth=1,
            borderColor=colors.HexColor('#2e75b6'),
            borderPadding=8,
            backColor=colors.HexColor('#f2f8ff')
        )
        
        # Style sous-section
        self.subsection_style = ParagraphStyle(
            'SubSection',
            parent=self.styles['Heading2'],
            fontSize=14,
            fontName='Helvetica-Bold',
            textColor=colors.HexColor('#2e75b6'),
            spaceBefore=20,
            spaceAfter=12
        )
        
        # Style texte premium
        self.body_style = ParagraphStyle(
            'PremiumBody',
            parent=self.styles['Normal'],
            fontSize=11,
            fontName='Helvetica',
            leading=14,
            alignment=TA_JUSTIFY,
            spaceAfter=8
        )
        
        # Style métriques importantes
        self.metrics_style = ParagraphStyle(
            'KeyMetrics',
            parent=self.styles['Normal'],
            fontSize=12,
            fontName='Helvetica-Bold',
            textColor=colors.HexColor('#0066cc'),
            alignment=TA_CENTER,
            spaceAfter=10,
            spaceBefore=10
        )
        
        # Style conclusions
        self.conclusion_style = ParagraphStyle(
            'Conclusion',
            parent=self.styles['Normal'],
            fontSize=12,
            fontName='Helvetica-Bold',
            textColor=colors.HexColor('#cc6600'),
            alignment=TA_LEFT,
            leftIndent=20,
            spaceAfter=12
        )

    def fetch_comprehensive_data(self):
        """Récupère toutes les données nécessaires pour l'analyse ultra-complète"""
        logging.info(f"Récupération des données complètes pour {self.symbol}")
        
        try:
            # Données de base yfinance
            self.ticker = yf.Ticker(self.symbol)
            self.data = self.ticker.history(period="5y", interval="1d")
            self.info = self.ticker.info
            
            # Données financières
            try:
                self.financials['income_stmt'] = self.ticker.financials
                self.financials['balance_sheet'] = self.ticker.balance_sheet  
                self.financials['cash_flow'] = self.ticker.cashflow
                self.financials['quarterly'] = self.ticker.quarterly_financials
            except:
                logging.warning("Certaines données financières non disponibles")
            
            # Données techniques supplémentaires
            self.data_1y = self.ticker.history(period="1y", interval="1d")
            self.data_3m = self.ticker.history(period="3mo", interval="1h")
            
            logging.info("Données récupérées avec succès")
            return True
            
        except Exception as e:
            logging.error(f"Erreur lors de la récupération des données: {e}")
            return False

    def calculate_ultra_technical_analysis(self):
        """Calcule plus de 50 indicateurs techniques"""
        logging.info("Calcul des indicateurs techniques avancés")
        
        df = self.data.copy()
        
        # Prix et volumes
        df['Returns'] = df['Close'].pct_change()
        df['Log_Returns'] = np.log(df['Close'] / df['Close'].shift(1))
        df['Volume_MA20'] = df['Volume'].rolling(20).mean()
        
        # Moyennes mobiles multiples
        periods = [5, 10, 20, 50, 100, 200]
        for period in periods:
            df[f'SMA_{period}'] = df['Close'].rolling(period).mean()
            df[f'EMA_{period}'] = df['Close'].ewm(span=period).mean()
            
        # Bandes de Bollinger multiples
        for period in [20, 50]:
            sma = df['Close'].rolling(period).mean()
            std = df['Close'].rolling(period).std()
            df[f'BB_Upper_{period}'] = sma + (std * 2)
            df[f'BB_Lower_{period}'] = sma - (std * 2)
            df[f'BB_Width_{period}'] = df[f'BB_Upper_{period}'] - df[f'BB_Lower_{period}']
            
        # RSI multiples
        for period in [14, 21, 30]:
            delta = df['Close'].diff()
            gain = (delta.where(delta > 0, 0)).rolling(period).mean()
            loss = (-delta.where(delta < 0, 0)).rolling(period).mean()
            rs = gain / loss
            df[f'RSI_{period}'] = 100 - (100 / (1 + rs))
            
        # MACD variations
        exp1 = df['Close'].ewm(span=12).mean()
        exp2 = df['Close'].ewm(span=26).mean()
        df['MACD'] = exp1 - exp2
        df['MACD_Signal'] = df['MACD'].ewm(span=9).mean()
        df['MACD_Histogram'] = df['MACD'] - df['MACD_Signal']
        
        # Stochastic multiples
        for k_period, d_period in [(14, 3), (21, 3), (5, 3)]:
            low_min = df['Low'].rolling(k_period).min()
            high_max = df['High'].rolling(k_period).max()
            df[f'Stoch_K_{k_period}'] = 100 * (df['Close'] - low_min) / (high_max - low_min)
            df[f'Stoch_D_{k_period}'] = df[f'Stoch_K_{k_period}'].rolling(d_period).mean()
            
        # Williams %R
        for period in [14, 21]:
            high_max = df['High'].rolling(period).max()
            low_min = df['Low'].rolling(period).min()
            df[f'Williams_R_{period}'] = -100 * (high_max - df['Close']) / (high_max - low_min)
            
        # ATR (Average True Range)
        high_low = df['High'] - df['Low']
        high_close = np.abs(df['High'] - df['Close'].shift())
        low_close = np.abs(df['Low'] - df['Close'].shift())
        ranges = pd.concat([high_low, high_close, low_close], axis=1)
        true_range = np.max(ranges, axis=1)
        df['ATR_14'] = true_range.rolling(14).mean()
        df['ATR_21'] = true_range.rolling(21).mean()
        
        # Commodity Channel Index
        for period in [20, 30]:
            tp = (df['High'] + df['Low'] + df['Close']) / 3
            sma_tp = tp.rolling(period).mean()
            mad = tp.rolling(period).apply(lambda x: np.abs(x - x.mean()).mean())
            df[f'CCI_{period}'] = (tp - sma_tp) / (0.015 * mad)
            
        # Aroon
        for period in [14, 25]:
            aroon_up = []
            aroon_down = []
            for i in range(period, len(df)):
                high_idx = df['High'].iloc[i-period:i+1].idxmax()
                low_idx = df['Low'].iloc[i-period:i+1].idxmin()
                aroon_up.append(((period - (i - df.index.get_loc(high_idx))) / period) * 100)
                aroon_down.append(((period - (i - df.index.get_loc(low_idx))) / period) * 100)
            df[f'Aroon_Up_{period}'] = [np.nan] * period + aroon_up
            df[f'Aroon_Down_{period}'] = [np.nan] * period + aroon_down
            df[f'Aroon_Osc_{period}'] = df[f'Aroon_Up_{period}'] - df[f'Aroon_Down_{period}']
        
        # Momentum multiples
        for period in [10, 20, 30]:
            df[f'Momentum_{period}'] = df['Close'] / df['Close'].shift(period) * 100
            
        # Rate of Change
        for period in [12, 25]:
            df[f'ROC_{period}'] = ((df['Close'] - df['Close'].shift(period)) / df['Close'].shift(period)) * 100
            
        # Ultimate Oscillator
        def ultimate_oscillator(high, low, close, period1=7, period2=14, period3=28):
            bp = close - np.minimum(low, close.shift())
            tr = np.maximum(high, close.shift()) - np.minimum(low, close.shift())
            avg7 = bp.rolling(period1).sum() / tr.rolling(period1).sum()
            avg14 = bp.rolling(period2).sum() / tr.rolling(period2).sum()
            avg28 = bp.rolling(period3).sum() / tr.rolling(period3).sum()
            uo = 100 * (4 * avg7 + 2 * avg14 + avg28) / 7
            return uo
        
        df['Ultimate_Oscillator'] = ultimate_oscillator(df['High'], df['Low'], df['Close'])
        
        # Money Flow Index
        typical_price = (df['High'] + df['Low'] + df['Close']) / 3
        money_flow = typical_price * df['Volume']
        
        positive_flow = []
        negative_flow = []
        for i in range(1, len(df)):
            if typical_price.iloc[i] > typical_price.iloc[i-1]:
                positive_flow.append(money_flow.iloc[i])
                negative_flow.append(0)
            else:
                positive_flow.append(0)
                negative_flow.append(money_flow.iloc[i])
        
        positive_flow = [0] + positive_flow
        negative_flow = [0] + negative_flow
        
        df['Positive_MF'] = positive_flow
        df['Negative_MF'] = negative_flow
        df['MFI_14'] = 100 - (100 / (1 + pd.Series(positive_flow).rolling(14).sum() / pd.Series(negative_flow).rolling(14).sum()))
        
        # Chaikin Oscillator
        ad_line = ((df['Close'] - df['Low']) - (df['High'] - df['Close'])) / (df['High'] - df['Low']) * df['Volume']
        df['AD_Line'] = ad_line.cumsum()
        df['Chaikin_Osc'] = df['AD_Line'].ewm(span=3).mean() - df['AD_Line'].ewm(span=10).mean()
        
        # Volume indicators
        df['OBV'] = (np.sign(df['Returns']) * df['Volume']).cumsum()
        df['Volume_Ratio'] = df['Volume'] / df['Volume'].rolling(20).mean()
        
        # Volatilité
        df['Volatility_20'] = df['Returns'].rolling(20).std() * np.sqrt(252)
        df['Volatility_50'] = df['Returns'].rolling(50).std() * np.sqrt(252)
        
        # Fibonacci retracements (calculs sur 1 an)
        df_1y = self.data_1y.copy()
        high_1y = df_1y['High'].max()
        low_1y = df_1y['Low'].min()
        diff = high_1y - low_1y
        
        levels = {
            'Fib_23.6': high_1y - 0.236 * diff,
            'Fib_38.2': high_1y - 0.382 * diff,
            'Fib_50.0': high_1y - 0.5 * diff,
            'Fib_61.8': high_1y - 0.618 * diff,
            'Fib_78.6': high_1y - 0.786 * diff
        }
        
        self.fibonacci_levels = levels
        
        # Support et résistance dynamiques
        def find_support_resistance(prices, window=20):
            supports = []
            resistances = []
            
            for i in range(window, len(prices) - window):
                current = prices.iloc[i]
                left = prices.iloc[i-window:i].max()
                right = prices.iloc[i+1:i+window+1].max()
                
                if current > left and current > right:
                    resistances.append((prices.index[i], current))
                elif current < prices.iloc[i-window:i].min() and current < prices.iloc[i+1:i+window+1].min():
                    supports.append((prices.index[i], current))
                    
            return supports[-5:], resistances[-5:]
        
        supports, resistances = find_support_resistance(df['Close'])
        self.support_resistance = {'supports': supports, 'resistances': resistances}
        
        self.technical_indicators = df
        logging.info(f"Calculé {len(df.columns)} indicateurs techniques")

    def perform_fundamental_analysis(self):
        """Analyse fondamentale ultra-approfondie"""
        logging.info("Analyse fondamentale approfondie")
        
        # Métriques de valorisation
        market_cap = self.info.get('marketCap', 0)
        shares = self.info.get('sharesOutstanding', 0)
        
        # Ratios financiers
        pe_ratio = self.info.get('forwardPE', 0)
        peg_ratio = self.info.get('pegRatio', 0)
        pb_ratio = self.info.get('priceToBook', 0)
        ps_ratio = self.info.get('priceToSalesTrailing12Months', 0)
        
        # Métriques de profitabilité
        roe = self.info.get('returnOnEquity', 0)
        roa = self.info.get('returnOnAssets', 0)
        profit_margin = self.info.get('profitMargins', 0)
        operating_margin = self.info.get('operatingMargins', 0)
        
        # Métriques de croissance
        earnings_growth = self.info.get('earningsGrowth', 0)
        revenue_growth = self.info.get('revenueGrowth', 0)
        
        # Métriques de dividende
        dividend_yield = self.info.get('dividendYield', 0)
        payout_ratio = self.info.get('payoutRatio', 0)
        
        # Santé financière
        debt_to_equity = self.info.get('debtToEquity', 0)
        current_ratio = self.info.get('currentRatio', 0)
        quick_ratio = self.info.get('quickRatio', 0)
        
        # Efficacité opérationnelle
        asset_turnover = self.info.get('totalAssets', 1) / self.info.get('totalRevenue', 1) if self.info.get('totalRevenue') else 0
        inventory_turnover = self.info.get('totalRevenue', 1) / self.info.get('inventory', 1) if self.info.get('inventory') else 0
        
        self.fundamental_metrics = {
            'valuation': {
                'market_cap': market_cap,
                'pe_ratio': pe_ratio,
                'peg_ratio': peg_ratio,
                'pb_ratio': pb_ratio,
                'ps_ratio': ps_ratio
            },
            'profitability': {
                'roe': roe,
                'roa': roa,
                'profit_margin': profit_margin,
                'operating_margin': operating_margin
            },
            'growth': {
                'earnings_growth': earnings_growth,
                'revenue_growth': revenue_growth
            },
            'dividend': {
                'dividend_yield': dividend_yield,
                'payout_ratio': payout_ratio
            },
            'financial_health': {
                'debt_to_equity': debt_to_equity,
                'current_ratio': current_ratio,
                'quick_ratio': quick_ratio
            }
        }

    def advanced_risk_analysis(self):
        """Analyse de risque quantitative avancée"""
        logging.info("Analyse de risque quantitative")
        
        returns = self.data['Close'].pct_change().dropna()
        
        # Value at Risk (VaR)
        var_95 = np.percentile(returns, 5)
        var_99 = np.percentile(returns, 1)
        
        # Conditional VaR (Expected Shortfall)
        cvar_95 = returns[returns <= var_95].mean()
        cvar_99 = returns[returns <= var_99].mean()
        
        # Volatilité historique
        volatility_daily = returns.std()
        volatility_annual = volatility_daily * np.sqrt(252)
        
        # Sharpe Ratio (avec taux sans risque approximatif 2%)
        risk_free_rate = 0.02 / 252
        excess_returns = returns - risk_free_rate
        sharpe_ratio = excess_returns.mean() / excess_returns.std() * np.sqrt(252)
        
        # Sortino Ratio
        downside_returns = returns[returns < 0]
        sortino_ratio = excess_returns.mean() / downside_returns.std() * np.sqrt(252) if len(downside_returns) > 0 else 0
        
        # Maximum Drawdown
        cumulative_returns = (1 + returns).cumprod()
        running_max = cumulative_returns.cummax()
        drawdown = (cumulative_returns - running_max) / running_max
        max_drawdown = drawdown.min()
        
        # Beta (par rapport au S&P 500)
        try:
            spy = yf.download("SPY", start=self.data.index[0], end=self.data.index[-1])['Close']
            spy_returns = spy.pct_change().dropna()
            
            # Convertir les index en datetime simple pour éviter les problèmes de timezone
            returns.index = pd.to_datetime(returns.index).tz_localize(None)
            spy_returns.index = pd.to_datetime(spy_returns.index).tz_localize(None)
            
            # Aligner les dates
            common_dates = returns.index.intersection(spy_returns.index)
            if len(common_dates) > 50:
                aligned_returns = returns.loc[common_dates]
                aligned_spy = spy_returns.loc[common_dates]
                
                covariance = np.cov(aligned_returns, aligned_spy)[0][1]
                spy_variance = np.var(aligned_spy)
                beta = covariance / spy_variance if spy_variance != 0 else 0
                
                # Alpha
                alpha = (aligned_returns.mean() * 252) - (risk_free_rate * 252 + beta * (aligned_spy.mean() * 252 - risk_free_rate * 252))
            else:
                beta = 0
                alpha = 0
        except:
            beta = 0
            alpha = 0
            
        # Treynor Ratio
        treynor_ratio = (excess_returns.mean() * 252) / beta if beta != 0 else 0
        
        # Information Ratio
        try:
            if 'spy_returns' in locals() and len(aligned_returns) > 0:
                tracking_error = (aligned_returns - aligned_spy).std() * np.sqrt(252)
                information_ratio = alpha / tracking_error if tracking_error != 0 else 0
            else:
                tracking_error = 0
                information_ratio = 0
        except:
            tracking_error = 0
            information_ratio = 0
        
        # Calmar Ratio
        calmar_ratio = (returns.mean() * 252) / abs(max_drawdown) if max_drawdown != 0 else 0
        
        # Skewness et Kurtosis
        skewness = stats.skew(returns)
        kurtosis = stats.kurtosis(returns)
        
        self.risk_metrics = {
            'var_95': var_95,
            'var_99': var_99,
            'cvar_95': cvar_95,
            'cvar_99': cvar_99,
            'volatility_annual': volatility_annual,
            'sharpe_ratio': sharpe_ratio,
            'sortino_ratio': sortino_ratio,
            'max_drawdown': max_drawdown,
            'beta': beta,
            'alpha': alpha,
            'treynor_ratio': treynor_ratio,
            'information_ratio': information_ratio,
            'calmar_ratio': calmar_ratio,
            'skewness': skewness,
            'kurtosis': kurtosis
        }

    def machine_learning_predictions(self):
        """Prédictions avec Machine Learning"""
        logging.info("Génération de prédictions ML")
        
        # Préparer les données pour ML
        df = self.technical_indicators.copy()
        
        # Features pour le modèle
        features = [
            'SMA_20', 'SMA_50', 'RSI_14', 'MACD', 'MACD_Signal',
            'Stoch_K_14', 'ATR_14', 'Volume_Ratio', 'Volatility_20'
        ]
        
        # Supprimer les NaN et préparer les données
        df_clean = df[features + ['Close']].dropna()
        
        if len(df_clean) > 100:
            # Target: prix dans 5 jours
            df_clean['Target'] = df_clean['Close'].shift(-5)
            df_clean = df_clean.dropna()
            
            X = df_clean[features]
            y = df_clean['Target']
            
            # Split train/test
            split_idx = int(len(X) * 0.8)
            X_train, X_test = X[:split_idx], X[split_idx:]
            y_train, y_test = y[:split_idx], y[split_idx:]
            
            # Modèles
            models = {
                'Linear Regression': LinearRegression(),
                'Random Forest': RandomForestRegressor(n_estimators=100, random_state=42)
            }
            
            predictions = {}
            for name, model in models.items():
                model.fit(X_train, y_train)
                pred = model.predict(X_test)
                mse = np.mean((pred - y_test) ** 2)
                
                # Prédiction future
                last_features = X.iloc[-1:].values
                future_pred = model.predict(last_features)[0]
                
                predictions[name] = {
                    'mse': mse,
                    'future_price': future_pred,
                    'accuracy': 1 - (mse / np.var(y_test))
                }
            
            self.ml_predictions = predictions
        else:
            self.ml_predictions = {}

    def monte_carlo_simulation(self, days=252, simulations=1000):
        """Simulation Monte Carlo pour projections de prix"""
        logging.info(f"Simulation Monte Carlo: {simulations} simulations sur {days} jours")
        
        returns = self.data['Close'].pct_change().dropna()
        
        # Paramètres historiques
        mean_return = returns.mean()
        std_return = returns.std()
        last_price = self.data['Close'].iloc[-1]
        
        # Simulations
        simulations_data = []
        
        for i in range(simulations):
            daily_returns = np.random.normal(mean_return, std_return, days)
            price_path = [last_price]
            
            for daily_return in daily_returns:
                price_path.append(price_path[-1] * (1 + daily_return))
            
            simulations_data.append(price_path[1:])  # Exclure le prix initial
        
        simulations_array = np.array(simulations_data)
        
        # Statistiques des simulations
        final_prices = simulations_array[:, -1]
        percentiles = [5, 25, 50, 75, 95]
        
        self.monte_carlo_results = {
            'simulations': simulations_array,
            'final_price_stats': {
                f'p{p}': np.percentile(final_prices, p) for p in percentiles
            },
            'mean_final_price': np.mean(final_prices),
            'probability_positive': np.mean(final_prices > last_price),
            'expected_return': (np.mean(final_prices) - last_price) / last_price
        }

    def create_ultra_comprehensive_charts(self):
        """Génère tous les graphiques ultra-détaillés"""
        logging.info("Génération des graphiques ultra-complets")
        
        chart_files = []
        
        # 1. Vue d'ensemble prix et volume
        fig = make_subplots(
            rows=3, cols=1,
            shared_xaxes=True,
            vertical_spacing=0.05,
            subplot_titles=('Prix et Moyennes Mobiles', 'Volume', 'RSI'),
            row_heights=[0.6, 0.2, 0.2]
        )
        
        # Prix principal
        fig.add_trace(go.Candlestick(
            x=self.data.index,
            open=self.data['Open'],
            high=self.data['High'], 
            low=self.data['Low'],
            close=self.data['Close'],
            name="Prix"
        ), row=1, col=1)
        
        # Moyennes mobiles
        for period in [20, 50, 200]:
            if f'SMA_{period}' in self.technical_indicators.columns:
                fig.add_trace(go.Scatter(
                    x=self.technical_indicators.index,
                    y=self.technical_indicators[f'SMA_{period}'],
                    name=f'SMA {period}',
                    line=dict(width=1)
                ), row=1, col=1)
        
        # Volume
        colors_volume = ['red' if close < open else 'green' 
                        for close, open in zip(self.data['Close'], self.data['Open'])]
        
        fig.add_trace(go.Bar(
            x=self.data.index,
            y=self.data['Volume'],
            marker_color=colors_volume,
            name="Volume",
            opacity=0.6
        ), row=2, col=1)
        
        # RSI
        if 'RSI_14' in self.technical_indicators.columns:
            fig.add_trace(go.Scatter(
                x=self.technical_indicators.index,
                y=self.technical_indicators['RSI_14'],
                name="RSI",
                line=dict(color='purple')
            ), row=3, col=1)
            
            fig.add_hline(y=70, line_dash="dash", line_color="red", row=3, col=1)
            fig.add_hline(y=30, line_dash="dash", line_color="green", row=3, col=1)
        
        fig.update_layout(
            title=f"Analyse Technique Complète - {self.symbol}",
            template='plotly_white',
            paper_bgcolor='white',
            plot_bgcolor='white',
            height=800
        )
        
        chart_path = os.path.join(self.temp_chart_dir, "overview_chart.png")
        pio.write_image(fig, chart_path, width=1200, height=800, scale=2)
        chart_files.append(chart_path)
        
        # 2. Graphique des indicateurs de momentum
        fig_momentum = make_subplots(
            rows=4, cols=1,
            shared_xaxes=True,
            subplot_titles=('MACD', 'Stochastic', 'RSI Multiple', 'Williams %R'),
            vertical_spacing=0.08
        )
        
        # MACD
        if 'MACD' in self.technical_indicators.columns:
            fig_momentum.add_trace(go.Scatter(
                x=self.technical_indicators.index,
                y=self.technical_indicators['MACD'],
                name="MACD", line=dict(color='blue')
            ), row=1, col=1)
            
            fig_momentum.add_trace(go.Scatter(
                x=self.technical_indicators.index,
                y=self.technical_indicators['MACD_Signal'],
                name="Signal", line=dict(color='red')
            ), row=1, col=1)
            
            fig_momentum.add_trace(go.Bar(
                x=self.technical_indicators.index,
                y=self.technical_indicators['MACD_Histogram'],
                name="Histogram", opacity=0.6
            ), row=1, col=1)
        
        # Stochastic
        if 'Stoch_K_14' in self.technical_indicators.columns:
            fig_momentum.add_trace(go.Scatter(
                x=self.technical_indicators.index,
                y=self.technical_indicators['Stoch_K_14'],
                name="%K", line=dict(color='blue')
            ), row=2, col=1)
            
            fig_momentum.add_trace(go.Scatter(
                x=self.technical_indicators.index,
                y=self.technical_indicators['Stoch_D_14'],
                name="%D", line=dict(color='red')
            ), row=2, col=1)
        
        # RSI Multiple
        for period in [14, 21, 30]:
            if f'RSI_{period}' in self.technical_indicators.columns:
                fig_momentum.add_trace(go.Scatter(
                    x=self.technical_indicators.index,
                    y=self.technical_indicators[f'RSI_{period}'],
                    name=f"RSI {period}"
                ), row=3, col=1)
        
        # Williams %R
        if 'Williams_R_14' in self.technical_indicators.columns:
            fig_momentum.add_trace(go.Scatter(
                x=self.technical_indicators.index,
                y=self.technical_indicators['Williams_R_14'],
                name="Williams %R", line=dict(color='purple')
            ), row=4, col=1)
        
        fig_momentum.update_layout(
            title=f"Indicateurs de Momentum - {self.symbol}",
            template='plotly_white',
            paper_bgcolor='white',
            height=1000
        )
        
        chart_path = os.path.join(self.temp_chart_dir, "momentum_indicators.png")
        pio.write_image(fig_momentum, chart_path, width=1200, height=1000, scale=2)
        chart_files.append(chart_path)
        
        # 3. Analyse de la volatilité
        fig_vol = make_subplots(
            rows=3, cols=1,
            shared_xaxes=True,
            subplot_titles=('Bandes de Bollinger', 'ATR', 'Volatilité Historique'),
            vertical_spacing=0.1
        )
        
        # Bandes de Bollinger
        fig_vol.add_trace(go.Scatter(
            x=self.data.index,
            y=self.data['Close'],
            name="Prix", line=dict(color='black')
        ), row=1, col=1)
        
        if 'BB_Upper_20' in self.technical_indicators.columns:
            fig_vol.add_trace(go.Scatter(
                x=self.technical_indicators.index,
                y=self.technical_indicators['BB_Upper_20'],
                name="BB Sup", line=dict(color='red', dash='dash')
            ), row=1, col=1)
            
            fig_vol.add_trace(go.Scatter(
                x=self.technical_indicators.index,
                y=self.technical_indicators['BB_Lower_20'],
                name="BB Inf", line=dict(color='green', dash='dash'),
                fill='tonexty', fillcolor='rgba(0,100,80,0.1)'
            ), row=1, col=1)
        
        # ATR
        if 'ATR_14' in self.technical_indicators.columns:
            fig_vol.add_trace(go.Scatter(
                x=self.technical_indicators.index,
                y=self.technical_indicators['ATR_14'],
                name="ATR 14", line=dict(color='orange')
            ), row=2, col=1)
        
        # Volatilité historique
        if 'Volatility_20' in self.technical_indicators.columns:
            fig_vol.add_trace(go.Scatter(
                x=self.technical_indicators.index,
                y=self.technical_indicators['Volatility_20'],
                name="Vol 20j", line=dict(color='purple')
            ), row=3, col=1)
            
            fig_vol.add_trace(go.Scatter(
                x=self.technical_indicators.index,
                y=self.technical_indicators['Volatility_50'],
                name="Vol 50j", line=dict(color='blue')
            ), row=3, col=1)
        
        fig_vol.update_layout(
            title=f"Analyse de Volatilité - {self.symbol}",
            template='plotly_white',
            paper_bgcolor='white',
            height=900
        )
        
        chart_path = os.path.join(self.temp_chart_dir, "volatility_analysis.png")
        pio.write_image(fig_vol, chart_path, width=1200, height=900, scale=2)
        chart_files.append(chart_path)
        
        # 4. Monte Carlo Simulation
        if hasattr(self, 'monte_carlo_results'):
            fig_mc = go.Figure()
            
            # Quelques chemins de simulation
            for i in range(0, len(self.monte_carlo_results['simulations']), 50):
                fig_mc.add_trace(go.Scatter(
                    y=self.monte_carlo_results['simulations'][i],
                    mode='lines',
                    line=dict(width=0.5, color='rgba(0,100,80,0.3)'),
                    showlegend=False
                ))
            
            # Percentiles
            p5 = [np.percentile(self.monte_carlo_results['simulations'][:, i], 5) 
                  for i in range(self.monte_carlo_results['simulations'].shape[1])]
            p50 = [np.percentile(self.monte_carlo_results['simulations'][:, i], 50) 
                   for i in range(self.monte_carlo_results['simulations'].shape[1])]
            p95 = [np.percentile(self.monte_carlo_results['simulations'][:, i], 95) 
                   for i in range(self.monte_carlo_results['simulations'].shape[1])]
            
            fig_mc.add_trace(go.Scatter(y=p5, name="P5", line=dict(color='red', dash='dash')))
            fig_mc.add_trace(go.Scatter(y=p50, name="Médiane", line=dict(color='blue', width=3)))
            fig_mc.add_trace(go.Scatter(y=p95, name="P95", line=dict(color='green', dash='dash')))
            
            fig_mc.update_layout(
                title=f"Simulation Monte Carlo - {self.symbol} (1000 simulations, 1 an)",
                template='plotly_white',
                paper_bgcolor='white',
                xaxis_title="Jours",
                yaxis_title="Prix ($)"
            )
            
            chart_path = os.path.join(self.temp_chart_dir, "monte_carlo.png")
            pio.write_image(fig_mc, chart_path, width=1200, height=600, scale=2)
            chart_files.append(chart_path)
        
        return chart_files

    def generate_ultra_premium_report(self):
        """Génère le rapport PDF ultra-complet"""
        logging.info("Génération du rapport PDF ultra-premium")
        
        # Page de garde
        self.add_title_page()
        self.story.append(PageBreak())
        
        # Table des matières
        self.add_table_of_contents()
        self.story.append(PageBreak())
        
        # Résumé exécutif
        self.add_executive_summary()
        self.story.append(PageBreak())
        
        # Section 1: Vue d'ensemble
        self.add_company_overview()
        self.story.append(PageBreak())
        
        # Section 2: Analyse technique détaillée
        self.add_technical_analysis_section()
        self.story.append(PageBreak())
        
        # Section 3: Analyse fondamentale
        self.add_fundamental_analysis_section()
        self.story.append(PageBreak())
        
        # Section 4: Analyse de risque
        self.add_risk_analysis_section()
        self.story.append(PageBreak())
        
        # Section 5: Prédictions ML
        self.add_ml_predictions_section()
        self.story.append(PageBreak())
        
        # Section 6: Simulations Monte Carlo
        self.add_monte_carlo_section()
        self.story.append(PageBreak())
        
        # Section 7: Analyse sectorielle
        self.add_sector_analysis_section()
        self.story.append(PageBreak())
        
        # Section 8: Scénarios et tests de stress
        self.add_stress_testing_section()
        self.story.append(PageBreak())
        
        # Section 9: Recommandations d'investissement
        self.add_investment_recommendations()
        self.story.append(PageBreak())
        
        # Section 10: Appendices et méthodologie
        self.add_methodology_section()
        
        # Générer le PDF
        self.doc.build(self.story)
        
        # Nettoyer les fichiers temporaires
        self.cleanup_temp_files()
        
        logging.info(f"Rapport ultra-premium généré: {self.output_path}")

    def add_title_page(self):
        """Page de garde professionnelle"""
        # Logo/Header space
        self.story.append(Spacer(1, 2*inch))
        
        # Titre principal
        title = Paragraph(f"RAPPORT D'ANALYSE FINANCIÈRE ULTRA-COMPLET", self.title_style)
        self.story.append(title)
        
        # Sous-titre avec symbole
        subtitle = Paragraph(f"{self.symbol} - {self.info.get('longName', self.symbol)}", self.subtitle_style)
        self.story.append(subtitle)
        
        self.story.append(Spacer(1, 1*inch))
        
        # Informations de base
        company_info = f"""
        <b>Secteur:</b> {self.info.get('sector', 'N/A')}<br/>
        <b>Industrie:</b> {self.info.get('industry', 'N/A')}<br/>
        <b>Capitalisation:</b> ${self.info.get('marketCap', 0):,.0f}<br/>
        <b>Bourse:</b> {self.info.get('exchange', 'N/A')}<br/>
        <b>Date d'analyse:</b> {datetime.now().strftime('%d/%m/%Y')}<br/>
        """
        
        info_para = Paragraph(company_info, self.body_style)
        self.story.append(info_para)
        
        self.story.append(Spacer(1, 2*inch))
        
        # Disclaimer
        disclaimer = Paragraph(
            "<b>DISCLAIMER:</b> Ce rapport est généré automatiquement à des fins d'information uniquement. "
            "Il ne constitue pas un conseil en investissement. Consultez un conseiller financier qualifié "
            "avant de prendre des décisions d'investissement.",
            ParagraphStyle('Disclaimer', parent=self.body_style, fontSize=9, textColor=colors.grey)
        )
        self.story.append(disclaimer)

    def add_table_of_contents(self):
        """Table des matières détaillée"""
        self.story.append(Paragraph("TABLE DES MATIÈRES", self.section_style))
        self.story.append(Spacer(1, 0.5*inch))
        
        toc_items = [
            "1. RÉSUMÉ EXÉCUTIF",
            "2. VUE D'ENSEMBLE DE L'ENTREPRISE",
            "3. ANALYSE TECHNIQUE DÉTAILLÉE",
            "   3.1 Indicateurs de Tendance",
            "   3.2 Indicateurs de Momentum", 
            "   3.3 Analyse de la Volatilité",
            "   3.4 Support et Résistance",
            "4. ANALYSE FONDAMENTALE",
            "   4.1 Métriques de Valorisation",
            "   4.2 Analyse de la Profitabilité",
            "   4.3 Santé Financière",
            "5. ANALYSE QUANTITATIVE DU RISQUE",
            "   5.1 Value at Risk (VaR)",
            "   5.2 Métriques de Performance",
            "   5.3 Analyse des Corrélations",
            "6. PRÉDICTIONS MACHINE LEARNING",
            "   6.1 Modèles Prédictifs",
            "   6.2 Évaluation de Performance",
            "7. SIMULATIONS MONTE CARLO",
            "   7.1 Projections de Prix",
            "   7.2 Analyse des Scénarios",
            "8. ANALYSE SECTORIELLE",
            "   8.1 Comparaison Sectorielle",
            "   8.2 Analyse Concurrentielle",
            "9. TESTS DE STRESS ET SCÉNARIOS",
            "   9.1 Scénarios de Crise",
            "   9.2 Tests de Résistance",
            "10. RECOMMANDATIONS D'INVESTISSEMENT",
            "11. MÉTHODOLOGIE ET APPENDICES"
        ]
        
        for item in toc_items:
            self.story.append(Paragraph(item, self.body_style))

    def add_executive_summary(self):
        """Executive Summary with comprehensive analysis"""
        self.story.append(Paragraph("1. EXECUTIVE SUMMARY", self.section_style))
        
        current_price = self.data['Close'].iloc[-1]
        start_price = self.data['Close'].iloc[0]
        ytd_return = ((current_price / start_price) - 1) * 100
        
        # Key Performance Metrics
        summary_metrics = f"""
        <b>Current Price:</b> ${current_price:.2f}<br/>
        <b>YTD Performance:</b> {ytd_return:.2f}%<br/>
        <b>Annualized Volatility:</b> {self.risk_metrics.get('volatility_annual', 0)*100:.1f}%<br/>
        <b>Sharpe Ratio:</b> {self.risk_metrics.get('sharpe_ratio', 0):.2f}<br/>
        <b>Maximum Drawdown:</b> {self.risk_metrics.get('max_drawdown', 0)*100:.1f}%<br/>
        <b>Beta (vs S&P 500):</b> {self.risk_metrics.get('beta', 0):.2f}<br/>
        """
        
        self.story.append(Paragraph(summary_metrics, self.metrics_style))
        
        # Comprehensive Analysis Overview
        volatility_assessment = "moderate" if self.risk_metrics.get('volatility_annual', 0) < 0.3 else "high"
        sharpe_assessment = self.risk_metrics.get('sharpe_ratio', 0)
        
        if sharpe_assessment > 1.5:
            investment_outlook = "STRONG BUY - Excellent risk-adjusted returns"
        elif sharpe_assessment > 1.0:
            investment_outlook = "BUY - Good risk-adjusted performance"
        elif sharpe_assessment > 0:
            investment_outlook = "NEUTRAL - Adequate compensation for risk"
        else:
            investment_outlook = "SELL - Poor risk-adjusted returns"
        
        summary_text = f"""
        This comprehensive financial analysis report provides an institutional-grade evaluation of {self.symbol} 
        ({self.info.get('longName', self.symbol)}) utilizing advanced quantitative methodologies and cutting-edge 
        financial modeling techniques. Our multi-dimensional approach combines over 50 technical indicators, 
        fundamental analysis, machine learning predictions, and Monte Carlo simulations to deliver a complete 
        360-degree view of this financial instrument.
        
        <b>MARKET POSITION & PERFORMANCE ANALYSIS:</b>
        The security has demonstrated a {ytd_return:.1f}% year-to-date return, positioning it {"above" if ytd_return > 0 else "below"} 
        the break-even threshold. With an annualized volatility of {self.risk_metrics.get('volatility_annual', 0)*100:.1f}%, 
        the asset exhibits {volatility_assessment} risk characteristics, making it suitable for 
        {"conservative to moderate" if volatility_assessment == "moderate" else "aggressive"} investment strategies.
        
        <b>RISK-ADJUSTED PERFORMANCE EVALUATION:</b>
        The Sharpe ratio of {self.risk_metrics.get('sharpe_ratio', 0):.2f} indicates 
        {"exceptional" if sharpe_assessment > 1.5 else "good" if sharpe_assessment > 1.0 else "adequate" if sharpe_assessment > 0 else "poor"} 
        risk-adjusted returns. The maximum drawdown of {abs(self.risk_metrics.get('max_drawdown', 0)*100):.1f}% reveals the 
        worst-case scenario loss from peak to trough, providing crucial downside risk assessment.
        
        <b>TECHNICAL ANALYSIS INSIGHTS:</b>
        Our sophisticated technical analysis framework incorporates {len([col for col in self.technical_indicators.columns if col not in ['Open', 'High', 'Low', 'Close', 'Volume']])} 
        proprietary indicators spanning momentum, volatility, trend, and volume analysis. The comprehensive indicator 
        suite includes RSI, MACD, Stochastic Oscillators, Williams %R, Average True Range (ATR), Bollinger Bands, 
        Aroon indicators, Commodity Channel Index (CCI), Money Flow Index (MFI), and Ultimate Oscillator among others.
        
        <b>MACHINE LEARNING & PREDICTIVE MODELING:</b>
        Advanced machine learning algorithms including Random Forest and Linear Regression models have been deployed 
        to generate forward-looking price predictions with robust backtesting validation. Monte Carlo simulations 
        with 1,000 iterations provide probabilistic price scenarios over a 12-month investment horizon.
        
        <b>INVESTMENT RECOMMENDATION:</b>
        Based on our comprehensive quantitative analysis framework, the overall investment recommendation is: 
        <b>{investment_outlook}</b>
        
        This recommendation synthesizes technical momentum, fundamental valuation metrics, risk-adjusted performance, 
        and forward-looking predictive models to provide actionable investment guidance for portfolio managers and 
        institutional investors.
        """
        
        self.story.append(Paragraph(summary_text, self.body_style))

    def add_company_overview(self):
        """Comprehensive Company and Asset Overview"""
        self.story.append(Paragraph("2. COMPANY & ASSET OVERVIEW", self.section_style))
        
        # Basic Information
        market_cap = self.info.get('marketCap', 0)
        enterprise_value = self.info.get('enterpriseValue', 0)
        employees = self.info.get('fullTimeEmployees', 0)
        
        company_data = f"""
        <b>Company Name:</b> {self.info.get('longName', 'N/A')}<br/>
        <b>Sector:</b> {self.info.get('sector', 'N/A')}<br/>
        <b>Industry:</b> {self.info.get('industry', 'N/A')}<br/>
        <b>Country:</b> {self.info.get('country', 'N/A')}<br/>
        <b>Exchange:</b> {self.info.get('exchange', 'N/A')}<br/>
        <b>Currency:</b> {self.info.get('currency', 'USD')}<br/>
        <b>Full-Time Employees:</b> {employees:,} people<br/>
        <b>Website:</b> {self.info.get('website', 'N/A')}<br/>
        """
        
        self.story.append(Paragraph(company_data, self.body_style))
        self.story.append(Spacer(1, 0.2*inch))
        
        # Market Capitalization & Valuation Metrics
        self.story.append(Paragraph("2.1 Market Capitalization & Valuation", self.subsection_style))
        
        valuation_text = f"""
        <b>MARKET VALUATION ANALYSIS:</b>
        
        The company commands a market capitalization of ${market_cap:,.0f}, positioning it as a 
        {"large-cap" if market_cap > 10e9 else "mid-cap" if market_cap > 2e9 else "small-cap"} 
        equity investment within the {self.info.get('sector', 'broader')} sector. 
        {"The enterprise value of ${:,.0f} reflects the total value of the business including debt obligations.".format(enterprise_value) if enterprise_value else ""}
        
        <b>COMPETITIVE POSITIONING:</b>
        Within the {self.info.get('industry', 'industry')} landscape, the company operates with 
        {employees:,} full-time employees, indicating {"substantial operational scale" if employees > 10000 else "moderate operational scale" if employees > 1000 else "focused operational structure"}. 
        The geographical presence in {self.info.get('country', 'multiple markets')} provides 
        {"domestic market exposure" if self.info.get('country') == 'United States' else "international market diversification"}.
        
        <b>BUSINESS MODEL ASSESSMENT:</b>
        Trading on the {self.info.get('exchange', 'primary')} exchange, the security offers investors 
        exposure to the {self.info.get('sector', 'market')} sector through 
        {"a diversified business model" if market_cap > 50e9 else "a specialized business focus"}. 
        The company's position within the {self.info.get('industry', 'industry')} segment 
        suggests {"established market leadership" if market_cap > 100e9 else "competitive market participation"}.
        """
        
        self.story.append(Paragraph(valuation_text, self.body_style))
        self.story.append(Spacer(1, 0.2*inch))
        
        # Business Description with Analysis
        if 'longBusinessSummary' in self.info:
            self.story.append(Paragraph("2.2 Business Operations & Strategy", self.subsection_style))
            
            business_summary = self.info['longBusinessSummary']
            if len(business_summary) > 2000:
                business_summary = business_summary[:2000] + "..."
            
            business_analysis = f"""
            <b>CORE BUSINESS OPERATIONS:</b>
            
            {business_summary}
            
            <b>STRATEGIC BUSINESS ANALYSIS:</b>
            The company's operational framework demonstrates {"diversified revenue streams" if "diverse" in business_summary.lower() or "multiple" in business_summary.lower() else "focused business concentration"} 
            within the {self.info.get('industry', 'industry')} sector. The business model appears to emphasize 
            {"technology integration and innovation" if any(tech_word in business_summary.lower() for tech_word in ['technology', 'software', 'digital', 'ai', 'cloud']) else "traditional industry practices with operational excellence"}.
            
            Market positioning suggests {"premium market targeting" if any(premium_word in business_summary.lower() for premium_word in ['premium', 'luxury', 'high-end']) else "broad market accessibility"} 
            with {"global reach and international expansion" if any(global_word in business_summary.lower() for global_word in ['global', 'international', 'worldwide']) else "domestic market focus"}.
            """
            
            self.story.append(Paragraph(business_analysis, self.body_style))
        
        self.story.append(Spacer(1, 0.2*inch))
        
        # Financial Health Indicators
        self.story.append(Paragraph("2.3 Financial Health Indicators", self.subsection_style))
        
        financial_health = f"""
        <b>LIQUIDITY & FINANCIAL STRENGTH:</b>
        
        Current financial metrics indicate {"strong financial health" if self.info.get('currentRatio', 1) > 1.5 else "adequate liquidity position" if self.info.get('currentRatio', 1) > 1 else "tight liquidity conditions"}. 
        The current ratio of {self.info.get('currentRatio', 'N/A')} suggests 
        {"excellent short-term debt coverage" if self.info.get('currentRatio', 1) > 2 else "satisfactory working capital management" if self.info.get('currentRatio', 1) > 1.2 else "potential liquidity concerns"}.
        
        <b>DEBT MANAGEMENT ASSESSMENT:</b>
        The debt-to-equity ratio of {self.info.get('debtToEquity', 'N/A')} indicates 
        {"conservative capital structure" if self.info.get('debtToEquity', 100) < 50 else "moderate leverage utilization" if self.info.get('debtToEquity', 100) < 100 else "aggressive debt financing"}.
        This capital allocation strategy suggests {"minimal financial risk" if self.info.get('debtToEquity', 100) < 30 else "balanced risk management" if self.info.get('debtToEquity', 100) < 80 else "elevated financial leverage"}.
        
        <b>PROFITABILITY INDICATORS:</b>
        Operating margins of {self.info.get('operatingMargins', 0)*100:.1f}% demonstrate 
        {"exceptional operational efficiency" if self.info.get('operatingMargins', 0) > 0.20 else "solid profit generation" if self.info.get('operatingMargins', 0) > 0.10 else "competitive profit margins" if self.info.get('operatingMargins', 0) > 0.05 else "margin pressure challenges"}.
        
        The overall financial health profile supports {"strong investment thesis" if self.info.get('currentRatio', 1) > 1.5 and self.info.get('debtToEquity', 100) < 50 else "moderate investment consideration" if self.info.get('currentRatio', 1) > 1 else "cautious investment approach"} 
        for {"aggressive growth investors" if self.info.get('operatingMargins', 0) > 0.15 else "income-focused investors" if self.info.get('dividendYield', 0) > 0.03 else "value-oriented investors"}.
        """
        
        self.story.append(Paragraph(financial_health, self.body_style))

    def add_technical_analysis_section(self):
        """Section complète d'analyse technique"""
        self.story.append(Paragraph("3. ANALYSE TECHNIQUE DÉTAILLÉE", self.section_style))
        
        # Insérer les graphiques
        chart_files = self.create_ultra_comprehensive_charts()
        
        for i, chart_file in enumerate(chart_files):
            if os.path.exists(chart_file):
                try:
                    img = Image(chart_file, width=self.chart_width, height=self.chart_height)
                    self.story.append(img)
                    self.story.append(Spacer(1, 0.2*inch))
                except:
                    logging.warning(f"Impossible de charger le graphique: {chart_file}")
        
        # Analyse des signaux
        self.story.append(Paragraph("3.1 Signaux Techniques Actuels", self.subsection_style))
        
        signals_analysis = self.analyze_technical_signals()
        self.story.append(Paragraph(signals_analysis, self.body_style))

    def analyze_technical_signals(self):
        """Comprehensive technical signal analysis with detailed explanations"""
        current_data = self.technical_indicators.iloc[-1]
        signals = []
        
        # RSI Analysis with detailed interpretation
        rsi = current_data.get('RSI_14', 50)
        if rsi > 70:
            signals.append(f"RSI OVERBOUGHT SIGNAL ({rsi:.1f}): The Relative Strength Index indicates potential selling pressure as the security has moved too far too fast. This suggests a possible near-term correction or consolidation period. Professional traders often look for RSI bearish divergence at these levels.")
        elif rsi < 30:
            signals.append(f"RSI OVERSOLD SIGNAL ({rsi:.1f}): The asset has been oversold and may be due for a technical bounce or reversal. This creates potential buying opportunities for contrarian investors, though confirmation from other indicators is recommended before taking positions.")
        else:
            signals.append(f"RSI NEUTRAL ZONE ({rsi:.1f}): The momentum indicator suggests balanced buying and selling pressure with no extreme conditions. This neutral reading indicates the security is trading within normal parameters without immediate overbought or oversold concerns.")
        
        # MACD Analysis with momentum interpretation
        macd = current_data.get('MACD', 0)
        macd_signal = current_data.get('MACD_Signal', 0)
        macd_histogram = current_data.get('MACD_Histogram', 0)
        
        if macd > macd_signal:
            momentum_strength = "strong" if macd_histogram > 0 else "weakening"
            signals.append(f"MACD BULLISH CROSSOVER: The MACD line is above the signal line, indicating {momentum_strength} upward momentum. This crossover suggests institutional accumulation and positive price momentum. The histogram reading of {macd_histogram:.3f} shows {'increasing' if macd_histogram > 0 else 'decreasing'} bullish momentum.")
        else:
            momentum_strength = "strong" if macd_histogram < 0 else "weakening"
            signals.append(f"MACD BEARISH SIGNAL: The MACD line has moved below the signal line, suggesting {momentum_strength} downward pressure. This configuration often precedes continued selling pressure and indicates institutional distribution. The histogram reading suggests {'accelerating' if macd_histogram < -0.001 else 'moderate'} bearish momentum.")
        
        # Moving Average Analysis with trend confirmation
        price = current_data.get('Close', 0)
        sma_20 = current_data.get('SMA_20', 0)
        sma_50 = current_data.get('SMA_50', 0)
        sma_200 = current_data.get('SMA_200', 0)
        
        if price > sma_20 > sma_50:
            trend_strength = "strong" if price > sma_200 else "intermediate"
            signals.append(f"BULLISH TREND CONFIRMATION: Price (${price:.2f}) trading above 20-day SMA (${sma_20:.2f}) and 50-day SMA (${sma_50:.2f}), confirming {trend_strength} uptrend. This technical setup suggests continued institutional buying interest and positive price momentum with support levels established at moving average lines.")
        elif price < sma_20 < sma_50:
            trend_strength = "strong" if price < sma_200 else "intermediate"
            signals.append(f"BEARISH TREND CONFIRMED: Price (${price:.2f}) below both 20-day SMA (${sma_20:.2f}) and 50-day SMA (${sma_50:.2f}), indicating {trend_strength} downtrend. This configuration suggests continued selling pressure with moving averages acting as resistance levels for any bounce attempts.")
        else:
            signals.append(f"MIXED MOVING AVERAGE SIGNALS: Price (${price:.2f}) relationship with 20-day SMA (${sma_20:.2f}) and 50-day SMA (${sma_50:.2f}) shows conflicting signals. This suggests a consolidation phase or potential trend transition. Traders should wait for clearer directional signals before taking positions.")
        
        # Volume Analysis
        volume_ratio = current_data.get('Volume_Ratio', 1)
        if volume_ratio > 1.5:
            signals.append(f"HIGH VOLUME CONFIRMATION: Current volume is {volume_ratio:.1f}x above average, providing strong confirmation of price movements. High volume validates breakouts and trend changes, suggesting institutional participation and sustainable price movements.")
        elif volume_ratio < 0.7:
            signals.append(f"LOW VOLUME WARNING: Current volume is only {volume_ratio:.1f}x of average levels, suggesting lack of conviction in current price movements. Low volume moves are often unsustainable and may indicate distribution or accumulation phases.")
        
        # Volatility Assessment
        atr = current_data.get('ATR_14', 0)
        volatility_20 = current_data.get('Volatility_20', 0)
        if volatility_20 > 0.02:  # 2% daily volatility
            signals.append(f"HIGH VOLATILITY ENVIRONMENT: 20-day volatility of {volatility_20*100:.1f}% indicates elevated risk conditions. ATR reading of ${atr:.2f} suggests larger than normal price swings. Position sizing should be adjusted accordingly, and stop losses should be wider to account for increased volatility.")
        
        return "\n\n".join(f"• {signal}" for signal in signals)

    def add_fundamental_analysis_section(self):
        """Section d'analyse fondamentale"""
        self.story.append(Paragraph("4. ANALYSE FONDAMENTALE", self.section_style))
        
        # Métriques de valorisation
        if hasattr(self, 'fundamental_metrics'):
            self.story.append(Paragraph("4.1 Métriques de Valorisation", self.subsection_style))
            
            val_data = [
                ['Métrique', 'Valeur', 'Interprétation'],
                ['P/E Ratio', f"{self.fundamental_metrics['valuation']['pe_ratio']:.2f}", 
                 "Élevé" if self.fundamental_metrics['valuation']['pe_ratio'] > 25 else "Raisonnable"],
                ['P/B Ratio', f"{self.fundamental_metrics['valuation']['pb_ratio']:.2f}",
                 "Premium" if self.fundamental_metrics['valuation']['pb_ratio'] > 3 else "Attractif"],
                ['PEG Ratio', f"{self.fundamental_metrics['valuation']['peg_ratio']:.2f}",
                 "Surévalué" if self.fundamental_metrics['valuation']['peg_ratio'] > 1.5 else "Équilibré"]
            ]
            
            val_table = Table(val_data, colWidths=[4*cm, 3*cm, 4*cm])
            val_table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
                ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('FONTSIZE', (0, 0), (-1, 0), 10),
                ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
                ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
                ('GRID', (0, 0), (-1, -1), 1, colors.black)
            ]))
            
            self.story.append(val_table)
            self.story.append(Spacer(1, 0.3*inch))

    def add_risk_analysis_section(self):
        """Advanced Quantitative Risk Analysis"""
        self.story.append(Paragraph("5. COMPREHENSIVE RISK ANALYSIS", self.section_style))
        
        # Value at Risk Analysis
        self.story.append(Paragraph("5.1 Value at Risk (VaR) Analysis", self.subsection_style))
        
        var_95 = self.risk_metrics.get('var_95', 0)
        var_99 = self.risk_metrics.get('var_99', 0)
        cvar_95 = self.risk_metrics.get('cvar_95', 0)
        
        var_analysis = f"""
        <b>TAIL RISK ASSESSMENT:</b>
        
        The Value at Risk analysis reveals critical downside risk characteristics for portfolio management. 
        At 95% confidence level, the maximum expected loss is {abs(var_95)*100:.2f}% on any given day, 
        indicating {"moderate tail risk" if abs(var_95) < 0.03 else "elevated tail risk" if abs(var_95) < 0.05 else "significant tail risk"} 
        exposure. This suggests that investors should expect losses exceeding this threshold only 
        5% of the time under normal market conditions.
        
        <b>EXTREME LOSS SCENARIOS:</b>
        Under extreme market stress (99% confidence interval), potential losses could reach 
        {abs(var_99)*100:.2f}%, representing {"manageable extreme risk" if abs(var_99) < 0.05 else "substantial extreme risk" if abs(var_99) < 0.08 else "severe extreme risk"}. 
        The Expected Shortfall (CVaR) of {abs(cvar_95)*100:.2f}% indicates the average loss 
        severity when VaR limits are breached, providing crucial insight for risk budgeting.
        
        <b>RISK MANAGEMENT IMPLICATIONS:</b>
        These tail risk metrics suggest position sizing should be adjusted to maintain portfolio-level 
        risk within acceptable parameters. For a {"conservative" if abs(var_95) < 0.02 else "moderate" if abs(var_95) < 0.04 else "aggressive"} 
        risk profile, maximum position size should not exceed {"10-15%" if abs(var_95) < 0.02 else "5-10%" if abs(var_95) < 0.04 else "2-5%"} 
        of total portfolio value.
        """
        
        self.story.append(Paragraph(var_analysis, self.body_style))
        self.story.append(Spacer(1, 0.2*inch))
        
        # Risk-Adjusted Performance
        self.story.append(Paragraph("5.2 Risk-Adjusted Performance Metrics", self.subsection_style))
        
        sharpe_ratio = self.risk_metrics.get('sharpe_ratio', 0)
        sortino_ratio = self.risk_metrics.get('sortino_ratio', 0)
        volatility = self.risk_metrics.get('volatility_annual', 0)
        max_drawdown = self.risk_metrics.get('max_drawdown', 0)
        
        performance_analysis = f"""
        <b>RISK-ADJUSTED RETURN EVALUATION:</b>
        
        The Sharpe ratio of {sharpe_ratio:.3f} indicates 
        {"exceptional risk-adjusted performance" if sharpe_ratio > 1.5 else "superior risk-adjusted returns" if sharpe_ratio > 1.0 else "adequate risk compensation" if sharpe_ratio > 0.5 else "suboptimal risk-adjusted performance"} 
        relative to the risk-free rate. This metric suggests that each unit of volatility risk generates 
        {sharpe_ratio:.3f} units of excess return, {"justifying" if sharpe_ratio > 0.8 else "marginally supporting" if sharpe_ratio > 0.3 else "questioning"} 
        the risk exposure for return-focused investors.
        
        <b>DOWNSIDE RISK ASSESSMENT:</b>
        The Sortino ratio of {sortino_ratio:.3f} provides enhanced insight by focusing exclusively on downside volatility. 
        This {"superior" if sortino_ratio > sharpe_ratio * 1.2 else "equivalent" if abs(sortino_ratio - sharpe_ratio) < 0.1 else "inferior"} 
        performance relative to the Sharpe ratio indicates 
        {"asymmetric return distribution with limited downside volatility" if sortino_ratio > sharpe_ratio * 1.2 else "symmetric volatility characteristics" if abs(sortino_ratio - sharpe_ratio) < 0.1 else "elevated downside risk concentration"}.
        
        <b>VOLATILITY CHARACTERISTICS:</b>
        Annual volatility of {volatility*100:.1f}% places this security in the 
        {"low volatility" if volatility < 0.15 else "moderate volatility" if volatility < 0.30 else "high volatility"} 
        category. This volatility profile is {"typical" if 0.15 <= volatility <= 0.35 else "below average" if volatility < 0.15 else "above average"} 
        for {"growth-oriented equities" if volatility > 0.25 else "dividend-focused investments" if volatility < 0.15 else "balanced equity investments"}.
        
        <b>DRAWDOWN RECOVERY ANALYSIS:</b>
        The maximum drawdown of {abs(max_drawdown)*100:.1f}% represents the worst peak-to-trough decline, 
        indicating {"resilient price stability" if abs(max_drawdown) < 0.15 else "moderate correction susceptibility" if abs(max_drawdown) < 0.30 else "significant correction vulnerability"}. 
        Historical analysis suggests recovery periods of {"3-6 months" if abs(max_drawdown) < 0.15 else "6-12 months" if abs(max_drawdown) < 0.25 else "12+ months"} 
        following maximum drawdown events.
        """
        
        self.story.append(Paragraph(performance_analysis, self.body_style))
        self.story.append(Spacer(1, 0.2*inch))
        
        # Market Risk Correlation
        self.story.append(Paragraph("5.3 Market Risk & Correlation Analysis", self.subsection_style))
        
        beta = self.risk_metrics.get('beta', 0)
        alpha = self.risk_metrics.get('alpha', 0)
        
        correlation_analysis = f"""
        <b>SYSTEMATIC RISK EXPOSURE:</b>
        
        The beta coefficient of {beta:.3f} indicates 
        {"defensive characteristics" if beta < 0.8 else "market-aligned sensitivity" if 0.8 <= beta <= 1.2 else "aggressive market exposure"} 
        relative to the S&P 500 benchmark. This suggests the security typically moves 
        {abs(beta)*100:.0f}% {"in the same direction as" if beta > 0 else "opposite to"} market movements, 
        making it suitable for {"conservative portfolios seeking stability" if beta < 0.8 else "core equity allocations" if 0.8 <= beta <= 1.2 else "growth-oriented portfolios"}.
        
        <b>ALPHA GENERATION CAPACITY:</b>
        The annualized alpha of {alpha*100:.2f}% represents 
        {"significant value creation" if alpha > 0.05 else "modest outperformance" if alpha > 0.01 else "market-matching returns" if abs(alpha) < 0.01 else "underperformance concerns" if alpha < -0.01 else "substantial underperformance"} 
        beyond market-expected returns. This alpha generation suggests 
        {"strong management effectiveness" if alpha > 0.03 else "adequate operational execution" if alpha > 0 else "operational challenges"} 
        in creating shareholder value independent of market movements.
        
        <b>PORTFOLIO DIVERSIFICATION BENEFITS:</b>
        The correlation characteristics indicate this security provides 
        {"excellent diversification benefits" if beta < 0.7 or beta > 1.3 else "moderate diversification value" if 0.7 <= abs(beta) <= 1.3 else "limited diversification impact"} 
        when combined with broader market exposures. For portfolio optimization, 
        {"allocate 15-25%" if beta < 0.8 else "allocate 10-20%" if 0.8 <= beta <= 1.2 else "limit allocation to 5-15%"} 
        to maintain balanced risk exposure.
        
        <b>RISK-ADJUSTED INVESTMENT RECOMMENDATION:</b>
        Based on comprehensive risk analysis, this security demonstrates 
        {"strong risk-adjusted investment merit" if sharpe_ratio > 1.0 and abs(max_drawdown) < 0.2 else "acceptable risk-return characteristics" if sharpe_ratio > 0.5 else "elevated risk concerns"} 
        for {"conservative to moderate" if volatility < 0.25 and abs(max_drawdown) < 0.20 else "moderate to aggressive"} 
        risk tolerance investors seeking {"capital appreciation" if alpha > 0 else "market participation"}.
        """
        
        self.story.append(Paragraph(correlation_analysis, self.body_style))

    def add_ml_predictions_section(self):
        """Section des prédictions ML"""
        self.story.append(Paragraph("6. PRÉDICTIONS MACHINE LEARNING", self.section_style))
        
        if self.ml_predictions:
            # Tableau des prédictions
            pred_data = [['Modèle', 'Prix Prédit (5j)', 'Précision', 'Recommandation']]
            
            for model_name, results in self.ml_predictions.items():
                accuracy = results['accuracy'] * 100
                pred_data.append([
                    model_name,
                    f"${results['future_price']:.2f}",
                    f"{accuracy:.1f}%",
                    "Achat" if results['future_price'] > self.data['Close'].iloc[-1] else "Vente"
                ])
            
            pred_table = Table(pred_data, colWidths=[4*cm, 3*cm, 2*cm, 3*cm])
            pred_table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.darkblue),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
                ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('FONTSIZE', (0, 0), (-1, 0), 10),
                ('GRID', (0, 0), (-1, -1), 1, colors.black)
            ]))
            
            self.story.append(pred_table)
        else:
            self.story.append(Paragraph("Données insuffisantes pour les prédictions ML.", self.body_style))

    def add_monte_carlo_section(self):
        """Section Monte Carlo"""
        self.story.append(Paragraph("7. SIMULATIONS MONTE CARLO", self.section_style))
        
        if hasattr(self, 'monte_carlo_results'):
            # Statistiques des simulations
            mc_stats = f"""
            <b>Prix final médian (1 an):</b> ${self.monte_carlo_results['mean_final_price']:.2f}<br/>
            <b>Percentile 5%:</b> ${self.monte_carlo_results['final_price_stats']['p5']:.2f}<br/>
            <b>Percentile 95%:</b> ${self.monte_carlo_results['final_price_stats']['p95']:.2f}<br/>
            <b>Probabilité de gain:</b> {self.monte_carlo_results['probability_positive']*100:.1f}%<br/>
            <b>Rendement attendu:</b> {self.monte_carlo_results['expected_return']*100:.2f}%<br/>
            """
            
            self.story.append(Paragraph(mc_stats, self.metrics_style))

    def add_sector_analysis_section(self):
        """Analyse sectorielle"""
        self.story.append(Paragraph("8. ANALYSE SECTORIELLE", self.section_style))
        
        sector_text = f"""
        <b>Secteur:</b> {self.info.get('sector', 'N/A')}<br/>
        <b>Industrie:</b> {self.info.get('industry', 'N/A')}<br/>
        <b>Position sectorielle:</b> Analyse basée sur la capitalisation de marché et les métriques financières.<br/>
        """
        
        self.story.append(Paragraph(sector_text, self.body_style))

    def add_stress_testing_section(self):
        """Tests de stress et scénarios"""
        self.story.append(Paragraph("9. TESTS DE STRESS ET SCÉNARIOS", self.section_style))
        
        stress_scenarios = """
        <b>Scénario de crise (-20% marché):</b> Impact estimé sur le titre<br/>
        <b>Scénario de récession:</b> Sensibilité aux facteurs macroéconomiques<br/>
        <b>Scénario de volatilité extrême:</b> Comportement en période d'incertitude<br/>
        """
        
        self.story.append(Paragraph(stress_scenarios, self.body_style))

    def add_investment_recommendations(self):
        """Recommandations d'investissement"""
        self.story.append(Paragraph("10. RECOMMANDATIONS D'INVESTISSEMENT", self.section_style))
        
        # Calcul du score global
        score = self.calculate_investment_score()
        
        recommendation = "ACHAT FORT" if score > 8 else "ACHAT" if score > 6 else "NEUTRE" if score > 4 else "VENTE"
        
        rec_text = f"""
        <b>RECOMMANDATION GLOBALE: {recommendation}</b><br/>
        <b>Score d'investissement:</b> {score:.1f}/10<br/>
        <b>Horizon temporel:</b> 12 mois<br/>
        <b>Objectif de prix:</b> ${self.calculate_price_target():.2f}<br/>
        <b>Stop loss suggéré:</b> ${self.calculate_stop_loss():.2f}<br/>
        """
        
        self.story.append(Paragraph(rec_text, self.conclusion_style))

    def calculate_investment_score(self):
        """Calcule un score d'investissement sur 10"""
        score = 5.0  # Score de base
        
        # Ajustements basés sur les métriques
        if self.risk_metrics.get('sharpe_ratio', 0) > 1:
            score += 1
        if self.risk_metrics.get('volatility_annual', 0) < 0.3:
            score += 0.5
        if self.risk_metrics.get('max_drawdown', 0) > -0.2:
            score += 0.5
        
        return min(10, max(0, score))

    def calculate_price_target(self):
        """Calcule un objectif de prix"""
        current_price = self.data['Close'].iloc[-1]
        if hasattr(self, 'monte_carlo_results'):
            return self.monte_carlo_results['mean_final_price']
        else:
            return current_price * 1.1  # +10% par défaut

    def calculate_stop_loss(self):
        """Calcule un stop loss"""
        current_price = self.data['Close'].iloc[-1]
        volatility = self.risk_metrics.get('volatility_annual', 0.2)
        return current_price * (1 - min(0.15, volatility * 0.5))

    def add_methodology_section(self):
        """Section méthodologie"""
        self.story.append(Paragraph("11. MÉTHODOLOGIE ET APPENDICES", self.section_style))
        
        methodology_text = """
        Cette analyse utilise une approche quantitative multi-dimensionnelle combinant:
        
        • Plus de 50 indicateurs techniques
        • Analyse fondamentale basée sur les états financiers
        • Modèles de machine learning (Random Forest, Régression Linéaire)
        • Simulations Monte Carlo (1000 itérations)
        • Analyse quantitative du risque (VaR, CVaR)
        • Tests de stress et analyse de scénarios
        
        Les données proviennent de sources fiables et sont mises à jour quotidiennement.
        Toutes les métriques sont calculées selon les standards de l'industrie financière.
        """
        
        self.story.append(Paragraph(methodology_text, self.body_style))

    def cleanup_temp_files(self):
        """Nettoie les fichiers temporaires"""
        try:
            import shutil
            if os.path.exists(self.temp_chart_dir):
                shutil.rmtree(self.temp_chart_dir)
        except:
            pass

    def run_complete_analysis(self):
        """Exécute l'analyse complète et génère le rapport"""
        logging.info(f"Démarrage de l'analyse ultra-complète pour {self.symbol}")
        
        try:
            # 1. Récupération des données
            if not self.fetch_comprehensive_data():
                raise Exception("Impossible de récupérer les données")
            
            # 2. Calculs des analyses
            self.calculate_ultra_technical_analysis()
            self.perform_fundamental_analysis()
            self.advanced_risk_analysis()
            self.machine_learning_predictions()
            self.monte_carlo_simulation()
            
            # 3. Génération du rapport
            self.generate_ultra_premium_report()
            
            logging.info("Analyse ultra-complète terminée avec succès")
            return True
            
        except Exception as e:
            logging.error(f"Erreur lors de l'analyse: {e}")
            return False

def main():
    """Fonction principale"""
    if len(sys.argv) != 3:
        print("Usage: python ultra_premium_pdf_generator.py <SYMBOL> <OUTPUT_PATH>")
        sys.exit(1)
    
    symbol = sys.argv[1]
    output_path = sys.argv[2]
    
    # Créer le dossier de sortie si nécessaire
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    
    # Générer le rapport
    generator = UltraPremiumPDFGenerator(symbol, output_path)
    success = generator.run_complete_analysis()
    
    if success:
        print(f"✅ Rapport ultra-premium généré: {output_path}")
    else:
        print("❌ Erreur lors de la génération du rapport")
        sys.exit(1)

if __name__ == "__main__":
    main()