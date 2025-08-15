#!/usr/bin/env python3
"""
Module de génération de graphiques avancés pour FinAnalytics
Créé pour démontrer les capacités de visualisation de données complexes
"""

import matplotlib.pyplot as plt
import matplotlib.dates as mdates
import seaborn as sns
import numpy as np
import pandas as pd
from datetime import datetime, timedelta
import warnings
from typing import Dict, List, Tuple, Optional
from matplotlib.patches import Rectangle
from matplotlib.collections import LineCollection
from mpl_toolkits.axes_grid1 import make_axes_locatable
import plotly.graph_objects as go
import plotly.express as px
from plotly.subplots import make_subplots
import plotly.offline as pyo

warnings.filterwarnings('ignore')

# Configuration du style
plt.style.use('seaborn-v0_8-darkgrid')
sns.set_palette("husl")

class AdvancedChartsGenerator:
    """Générateur de graphiques avancés pour l'analyse financière"""
    
    def __init__(self, symbol: str, data: pd.DataFrame):
        self.symbol = symbol
        self.data = data.copy()
        self.prepare_data()
        
    def prepare_data(self):
        """Prépare les données pour l'analyse technique"""
        # Conversion de l'index en datetime si nécessaire
        if not isinstance(self.data.index, pd.DatetimeIndex):
            self.data.index = pd.to_datetime(self.data.index)
            
        # Calcul des indicateurs techniques
        self.calculate_technical_indicators()
        
    def calculate_technical_indicators(self):
        """Calcule tous les indicateurs techniques nécessaires"""
        close = self.data['Close']
        high = self.data['High']
        low = self.data['Low']
        volume = self.data['Volume']
        
        # Moyennes mobiles
        self.data['SMA_20'] = close.rolling(window=20).mean()
        self.data['SMA_50'] = close.rolling(window=50).mean()
        self.data['SMA_200'] = close.rolling(window=200).mean()
        self.data['EMA_12'] = close.ewm(span=12).mean()
        self.data['EMA_26'] = close.ewm(span=26).mean()
        
        # MACD
        self.data['MACD'] = self.data['EMA_12'] - self.data['EMA_26']
        self.data['MACD_signal'] = self.data['MACD'].ewm(span=9).mean()
        self.data['MACD_histogram'] = self.data['MACD'] - self.data['MACD_signal']
        
        # RSI
        delta = close.diff()
        gain = (delta.where(delta > 0, 0)).rolling(window=14).mean()
        loss = (-delta.where(delta < 0, 0)).rolling(window=14).mean()
        rs = gain / loss
        self.data['RSI'] = 100 - (100 / (1 + rs))
        
        # Bollinger Bands
        bb_period = 20
        bb_std = 2
        self.data['BB_Middle'] = close.rolling(window=bb_period).mean()
        bb_std_dev = close.rolling(window=bb_period).std()
        self.data['BB_Upper'] = self.data['BB_Middle'] + (bb_std_dev * bb_std)
        self.data['BB_Lower'] = self.data['BB_Middle'] - (bb_std_dev * bb_std)
        self.data['BB_Width'] = self.data['BB_Upper'] - self.data['BB_Lower']
        self.data['BB_Position'] = (close - self.data['BB_Lower']) / (self.data['BB_Upper'] - self.data['BB_Lower'])
        
        # Stochastic
        lowest_low = low.rolling(window=14).min()
        highest_high = high.rolling(window=14).max()
        self.data['Stoch_K'] = ((close - lowest_low) / (highest_high - lowest_low)) * 100
        self.data['Stoch_D'] = self.data['Stoch_K'].rolling(window=3).mean()
        
        # Volume indicators
        self.data['Volume_SMA'] = volume.rolling(window=20).mean()
        self.data['Volume_Ratio'] = volume / self.data['Volume_SMA']
        
        # Volatilité
        self.data['Returns'] = close.pct_change()
        self.data['Volatility'] = self.data['Returns'].rolling(window=20).std() * np.sqrt(252)
        
        # Support et résistance (approximation)
        self.data['Support'] = low.rolling(window=20, center=True).min()
        self.data['Resistance'] = high.rolling(window=20, center=True).max()

    def create_advanced_candlestick_chart(self, output_path: str, period_days: int = 90):
        """Crée un graphique en chandelier avancé avec indicateurs"""
        # Filtrer les données pour la période spécifiée
        end_date = self.data.index[-1]
        start_date = end_date - timedelta(days=period_days)
        filtered_data = self.data[self.data.index >= start_date].copy()
        
        # Configuration de la figure avec subplots
        fig = make_subplots(
            rows=4, cols=1,
            shared_xaxes=True,
            vertical_spacing=0.05,
            row_heights=[0.5, 0.2, 0.15, 0.15],
            subplot_titles=[
                f'{self.symbol} - Analyse Technique Avancée',
                'MACD',
                'RSI',
                'Volume'
            ]
        )
        
        # 1. Graphique principal - Chandeliers avec Bollinger Bands
        fig.add_trace(
            go.Candlestick(
                x=filtered_data.index,
                open=filtered_data['Open'],
                high=filtered_data['High'],
                low=filtered_data['Low'],
                close=filtered_data['Close'],
                name='Price',
                increasing_line_color='#00ff88',
                decreasing_line_color='#ff4444'
            ),
            row=1, col=1
        )
        
        # Bollinger Bands
        fig.add_trace(
            go.Scatter(
                x=filtered_data.index,
                y=filtered_data['BB_Upper'],
                mode='lines',
                name='BB Upper',
                line=dict(color='rgba(173, 204, 255, 0.8)', width=1),
                fill=None
            ),
            row=1, col=1
        )
        
        fig.add_trace(
            go.Scatter(
                x=filtered_data.index,
                y=filtered_data['BB_Lower'],
                mode='lines',
                name='BB Lower',
                line=dict(color='rgba(173, 204, 255, 0.8)', width=1),
                fill='tonexty',
                fillcolor='rgba(173, 204, 255, 0.1)'
            ),
            row=1, col=1
        )
        
        # Moyennes mobiles
        fig.add_trace(
            go.Scatter(
                x=filtered_data.index,
                y=filtered_data['SMA_20'],
                mode='lines',
                name='SMA 20',
                line=dict(color='orange', width=2)
            ),
            row=1, col=1
        )
        
        fig.add_trace(
            go.Scatter(
                x=filtered_data.index,
                y=filtered_data['SMA_50'],
                mode='lines',
                name='SMA 50',
                line=dict(color='blue', width=2)
            ),
            row=1, col=1
        )
        
        # 2. MACD
        fig.add_trace(
            go.Scatter(
                x=filtered_data.index,
                y=filtered_data['MACD'],
                mode='lines',
                name='MACD',
                line=dict(color='blue', width=2)
            ),
            row=2, col=1
        )
        
        fig.add_trace(
            go.Scatter(
                x=filtered_data.index,
                y=filtered_data['MACD_signal'],
                mode='lines',
                name='Signal',
                line=dict(color='red', width=2)
            ),
            row=2, col=1
        )
        
        # Histogramme MACD
        colors = ['green' if x >= 0 else 'red' for x in filtered_data['MACD_histogram']]
        fig.add_trace(
            go.Bar(
                x=filtered_data.index,
                y=filtered_data['MACD_histogram'],
                name='MACD Histogram',
                marker_color=colors,
                opacity=0.6
            ),
            row=2, col=1
        )
        
        # 3. RSI
        fig.add_trace(
            go.Scatter(
                x=filtered_data.index,
                y=filtered_data['RSI'],
                mode='lines',
                name='RSI',
                line=dict(color='purple', width=2)
            ),
            row=3, col=1
        )
        
        # Lignes de référence RSI
        fig.add_hline(y=70, line_dash="dash", line_color="red", opacity=0.7, row=3, col=1)
        fig.add_hline(y=30, line_dash="dash", line_color="green", opacity=0.7, row=3, col=1)
        fig.add_hline(y=50, line_dash="dash", line_color="gray", opacity=0.5, row=3, col=1)
        
        # 4. Volume
        volume_colors = ['green' if filtered_data['Close'].iloc[i] >= filtered_data['Open'].iloc[i] else 'red' 
                        for i in range(len(filtered_data))]
        
        fig.add_trace(
            go.Bar(
                x=filtered_data.index,
                y=filtered_data['Volume'],
                name='Volume',
                marker_color=volume_colors,
                opacity=0.7
            ),
            row=4, col=1
        )
        
        # Volume moyenne
        fig.add_trace(
            go.Scatter(
                x=filtered_data.index,
                y=filtered_data['Volume_SMA'],
                mode='lines',
                name='Volume Average',
                line=dict(color='orange', width=2)
            ),
            row=4, col=1
        )
        
        # Configuration de la mise en page
        fig.update_layout(
            title=f'Analyse Technique Complète - {self.symbol}',
            xaxis_title='Date',
            height=1200,
            showlegend=True,
            template='plotly_white',
            font=dict(size=12),
            paper_bgcolor='white',
            plot_bgcolor='white'
        )
        
        # Masquer les barres de navigation inutiles
        fig.update_layout(xaxis4_rangeslider_visible=False)
        
        # Sauvegarder
        fig.write_html(output_path.replace('.png', '_interactive.html'))
        fig.write_image(output_path, width=1400, height=1200, scale=2)
        
        return output_path

    def create_correlation_heatmap(self, comparison_data: Dict[str, pd.DataFrame], output_path: str):
        """Crée une heatmap de corrélation entre plusieurs actifs"""
        # Préparer les données de corrélation
        returns_data = {}
        returns_data[self.symbol] = self.data['Returns'].dropna()
        
        for symbol, data in comparison_data.items():
            if 'Close' in data.columns:
                returns_data[symbol] = data['Close'].pct_change().dropna()
        
        # Créer un DataFrame avec tous les rendements
        returns_df = pd.DataFrame(returns_data)
        returns_df = returns_df.dropna()
        
        # Calculer la matrice de corrélation
        correlation_matrix = returns_df.corr()
        
        # Créer la heatmap avec plotly
        fig = go.Figure(data=go.Heatmap(
            z=correlation_matrix.values,
            x=correlation_matrix.columns,
            y=correlation_matrix.columns,
            colorscale='RdBu',
            zmid=0,
            text=correlation_matrix.round(3).values,
            texttemplate='%{text}',
            textfont={"size": 12},
            hoverongaps=False
        ))
        
        fig.update_layout(
            title=f'Matrice de Corrélation - {self.symbol} vs Indices/Actifs',
            width=800,
            height=800,
            template='plotly_white',
            paper_bgcolor='white',
            plot_bgcolor='white'
        )
        
        fig.write_image(output_path, width=800, height=800, scale=2)
        return output_path

    def create_volatility_surface(self, output_path: str):
        """Crée une surface de volatilité 3D"""
        # Calculer la volatilité sur différentes fenêtres
        windows = [5, 10, 20, 30, 60, 90, 120]
        volatilities = []
        
        for window in windows:
            vol = self.data['Returns'].rolling(window=window).std() * np.sqrt(252)
            volatilities.append(vol.dropna())
        
        # Créer les données pour la surface
        dates = volatilities[0].index
        x = np.arange(len(dates))
        y = windows
        z = np.array([vol.values for vol in volatilities])
        
        # Créer la surface 3D
        fig = go.Figure(data=[go.Surface(
            x=x,
            y=y,
            z=z,
            colorscale='Viridis',
            name='Volatility Surface'
        )])
        
        fig.update_layout(
            title=f'Surface de Volatilité - {self.symbol}',
            scene=dict(
                xaxis_title='Temps',
                yaxis_title='Fenêtre (jours)',
                zaxis_title='Volatilité (%)',
                camera=dict(eye=dict(x=1.5, y=1.5, z=1.5))
            ),
            width=1000,
            height=800,
            template='plotly_white',
            paper_bgcolor='white',
            plot_bgcolor='white'
        )
        
        fig.write_image(output_path, width=1000, height=800, scale=2)
        return output_path

    def create_risk_return_scatter(self, comparison_data: Dict[str, pd.DataFrame], output_path: str):
        """Crée un scatter plot risque/rendement"""
        risk_return_data = []
        
        # Calcul pour l'actif principal
        returns = self.data['Returns'].dropna()
        annual_return = returns.mean() * 252
        annual_volatility = returns.std() * np.sqrt(252)
        sharpe_ratio = annual_return / annual_volatility if annual_volatility > 0 else 0
        
        risk_return_data.append({
            'Symbol': self.symbol,
            'Annual_Return': annual_return * 100,
            'Annual_Volatility': annual_volatility * 100,
            'Sharpe_Ratio': sharpe_ratio,
            'Type': 'Target'
        })
        
        # Calcul pour les actifs de comparaison
        for symbol, data in comparison_data.items():
            if 'Close' in data.columns:
                returns = data['Close'].pct_change().dropna()
                annual_return = returns.mean() * 252
                annual_volatility = returns.std() * np.sqrt(252)
                sharpe_ratio = annual_return / annual_volatility if annual_volatility > 0 else 0
                
                risk_return_data.append({
                    'Symbol': symbol,
                    'Annual_Return': annual_return * 100,
                    'Annual_Volatility': annual_volatility * 100,
                    'Sharpe_Ratio': sharpe_ratio,
                    'Type': 'Benchmark'
                })
        
        df = pd.DataFrame(risk_return_data)
        
        # Créer le scatter plot
        fig = px.scatter(
            df,
            x='Annual_Volatility',
            y='Annual_Return',
            color='Type',
            size='Sharpe_Ratio',
            hover_data=['Symbol', 'Sharpe_Ratio'],
            text='Symbol',
            title=f'Profil Risque/Rendement - {self.symbol} vs Benchmarks',
            labels={
                'Annual_Volatility': 'Volatilité Annuelle (%)',
                'Annual_Return': 'Rendement Annuel (%)'
            }
        )
        
        fig.update_traces(textposition='top center')
        fig.update_layout(
            width=1000,
            height=700,
            template='plotly_white',
            showlegend=True,
            paper_bgcolor='white',
            plot_bgcolor='white'
        )
        
        # Ajouter des lignes de référence
        fig.add_hline(y=0, line_dash="dash", line_color="gray", opacity=0.5)
        
        fig.write_image(output_path, width=1000, height=700, scale=2)
        return output_path

    def create_fibonacci_retracement(self, output_path: str, period_days: int = 90):
        """Crée un graphique avec retracements de Fibonacci"""
        # Filtrer les données
        end_date = self.data.index[-1]
        start_date = end_date - timedelta(days=period_days)
        filtered_data = self.data[self.data.index >= start_date].copy()
        
        # Trouver les points hauts et bas
        high_price = filtered_data['High'].max()
        low_price = filtered_data['Low'].min()
        
        # Calculer les niveaux de Fibonacci
        diff = high_price - low_price
        levels = {
            '0.0%': high_price,
            '23.6%': high_price - 0.236 * diff,
            '38.2%': high_price - 0.382 * diff,
            '50.0%': high_price - 0.5 * diff,
            '61.8%': high_price - 0.618 * diff,
            '100.0%': low_price
        }
        
        # Créer le graphique
        fig = go.Figure()
        
        # Ajouter les chandeliers
        fig.add_trace(go.Candlestick(
            x=filtered_data.index,
            open=filtered_data['Open'],
            high=filtered_data['High'],
            low=filtered_data['Low'],
            close=filtered_data['Close'],
            name='Price'
        ))
        
        # Ajouter les niveaux de Fibonacci
        colors = ['red', 'orange', 'yellow', 'green', 'blue', 'purple']
        for i, (level, price) in enumerate(levels.items()):
            fig.add_hline(
                y=price,
                line_dash="dash",
                line_color=colors[i % len(colors)],
                annotation_text=f"Fib {level}: ${price:.2f}",
                annotation_position="right"
            )
        
        fig.update_layout(
            title=f'Retracements de Fibonacci - {self.symbol}',
            yaxis_title='Prix ($)',
            xaxis_title='Date',
            width=1200,
            height=800,
            template='plotly_white',
            paper_bgcolor='white',
            plot_bgcolor='white'
        )
        
        fig.write_image(output_path, width=1200, height=800, scale=2)
        return output_path

    def create_ichimoku_cloud(self, output_path: str, period_days: int = 120):
        """Crée un graphique avec le nuage d'Ichimoku"""
        # Filtrer les données
        end_date = self.data.index[-1]
        start_date = end_date - timedelta(days=period_days)
        filtered_data = self.data[self.data.index >= start_date].copy()
        
        # Calculer les composants Ichimoku
        high_9 = filtered_data['High'].rolling(window=9).max()
        low_9 = filtered_data['Low'].rolling(window=9).min()
        filtered_data['Tenkan_sen'] = (high_9 + low_9) / 2
        
        high_26 = filtered_data['High'].rolling(window=26).max()
        low_26 = filtered_data['Low'].rolling(window=26).min()
        filtered_data['Kijun_sen'] = (high_26 + low_26) / 2
        
        filtered_data['Senkou_span_A'] = ((filtered_data['Tenkan_sen'] + filtered_data['Kijun_sen']) / 2).shift(26)
        
        high_52 = filtered_data['High'].rolling(window=52).max()
        low_52 = filtered_data['Low'].rolling(window=52).min()
        filtered_data['Senkou_span_B'] = ((high_52 + low_52) / 2).shift(26)
        
        filtered_data['Chikou_span'] = filtered_data['Close'].shift(-26)
        
        # Créer le graphique
        fig = go.Figure()
        
        # Prix
        fig.add_trace(go.Scatter(
            x=filtered_data.index,
            y=filtered_data['Close'],
            mode='lines',
            name='Prix',
            line=dict(color='black', width=2)
        ))
        
        # Tenkan-sen (ligne de conversion)
        fig.add_trace(go.Scatter(
            x=filtered_data.index,
            y=filtered_data['Tenkan_sen'],
            mode='lines',
            name='Tenkan-sen',
            line=dict(color='red', width=1)
        ))
        
        # Kijun-sen (ligne de base)
        fig.add_trace(go.Scatter(
            x=filtered_data.index,
            y=filtered_data['Kijun_sen'],
            mode='lines',
            name='Kijun-sen',
            line=dict(color='blue', width=1)
        ))
        
        # Senkou Span A et B (nuage)
        fig.add_trace(go.Scatter(
            x=filtered_data.index,
            y=filtered_data['Senkou_span_A'],
            mode='lines',
            name='Senkou Span A',
            line=dict(color='green', width=1),
            fill=None
        ))
        
        fig.add_trace(go.Scatter(
            x=filtered_data.index,
            y=filtered_data['Senkou_span_B'],
            mode='lines',
            name='Senkou Span B',
            line=dict(color='red', width=1),
            fill='tonexty',
            fillcolor='rgba(0,255,0,0.1)'
        ))
        
        # Chikou Span
        fig.add_trace(go.Scatter(
            x=filtered_data.index,
            y=filtered_data['Chikou_span'],
            mode='lines',
            name='Chikou Span',
            line=dict(color='purple', width=1)
        ))
        
        fig.update_layout(
            title=f'Nuage d\'Ichimoku - {self.symbol}',
            yaxis_title='Prix ($)',
            xaxis_title='Date',
            width=1400,
            height=800,
            template='plotly_white',
            paper_bgcolor='white',
            plot_bgcolor='white'
        )
        
        fig.write_image(output_path, width=1400, height=800, scale=2)
        return output_path

def generate_all_advanced_charts(symbol: str, data: pd.DataFrame, output_dir: str) -> List[str]:
    """Génère tous les graphiques avancés pour un symbole"""
    
    generator = AdvancedChartsGenerator(symbol, data)
    generated_files = []
    
    try:
        # 1. Graphique chandelier avancé
        candlestick_path = f"{output_dir}/{symbol}_advanced_candlestick.png"
        generator.create_advanced_candlestick_chart(candlestick_path)
        generated_files.append(candlestick_path)
        
        # 2. Surface de volatilité
        volatility_path = f"{output_dir}/{symbol}_volatility_surface.png"
        generator.create_volatility_surface(volatility_path)
        generated_files.append(volatility_path)
        
        # 3. Retracements de Fibonacci
        fibonacci_path = f"{output_dir}/{symbol}_fibonacci.png"
        generator.create_fibonacci_retracement(fibonacci_path)
        generated_files.append(fibonacci_path)
        
        # 4. Nuage d'Ichimoku
        ichimoku_path = f"{output_dir}/{symbol}_ichimoku.png"
        generator.create_ichimoku_cloud(ichimoku_path)
        generated_files.append(ichimoku_path)
        
        print(f"✅ Générés {len(generated_files)} graphiques avancés pour {symbol}")
        
    except Exception as e:
        print(f"❌ Erreur lors de la génération des graphiques avancés: {e}")
    
    return generated_files

# Test du module
if __name__ == "__main__":
    # Exemple d'utilisation
    import yfinance as yf
    
    # Télécharger des données test
    symbol = "AAPL"
    ticker = yf.Ticker(symbol)
    data = ticker.history(period="1y")
    
    # Générer les graphiques
    charts = generate_all_advanced_charts(symbol, data, "temp_charts")
    print(f"Graphiques générés: {charts}")