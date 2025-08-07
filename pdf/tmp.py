import yfinance as yf
import seaborn as sns
import matplotlib.pyplot as plt
import pandas as pd
import numpy as np
from matplotlib.ticker import FuncFormatter

# Configuration initiale
plt.rcParams['figure.figsize'] = [14, 8]
plt.rcParams['font.size'] = 13
sns.set_theme(style="whitegrid", palette="husl")

# Fonction pour obtenir les données corrigée
def get_stock_data(ticker, start, end):
    data = yf.download(ticker, start=start, end=end, progress=False)
    data = data.reset_index()
    
    # Conversion en types simples
    data = pd.DataFrame({
        'Date': pd.to_datetime(data['Date']),
        'Open': data['Open'].astype(float),
        'High': data['High'].astype(float),
        'Low': data['Low'].astype(float),
        'Close': data['Close'].astype(float),
        'Volume': data['Volume'].astype(float)
    })
    
    # Calculs supplémentaires
    data['Daily Return'] = data['Close'].pct_change()
    data['Cumulative Return'] = (1 + data['Daily Return']).cumprod()
    data['MA20'] = data['Close'].rolling(20).mean()
    data['MA50'] = data['Close'].rolling(50).mean()
    data['MA200'] = data['Close'].rolling(200).mean()
    data['Year'] = data['Date'].dt.year
    data['Month'] = data['Date'].dt.month_name()
    data['Weekday'] = data['Date'].dt.day_name()
    
    return data

# Récupération des données
aapl = get_stock_data('AAPL', '2020-01-01', '2023-12-31')

# Vérification des données
print(aapl.head())
print(aapl.dtypes)

# 1. Graphique des prix (version corrigée)
def plot_price_trend():
    plt.figure()
    # Conversion explicite en numpy array
    sns.lineplot(x=aapl['Date'].values, y=aapl['Close'].values, 
                label='Prix de clôture', linewidth=2, color='royalblue')
    sns.lineplot(x=aapl['Date'].values, y=aapl['MA20'].values, 
                label='MM20', alpha=0.7)
    sns.lineplot(x=aapl['Date'].values, y=aapl['MA50'].values, 
                label='MM50', alpha=0.7)
    sns.lineplot(x=aapl['Date'].values, y=aapl['MA200'].values, 
                label='MM200', alpha=0.7)
    
    plt.title('Évolution du cours AAPL avec moyennes mobiles', fontsize=16)
    plt.xlabel('Date')
    plt.ylabel('Prix ($)')
    plt.legend()
    plt.fill_between(aapl['Date'].values, 
                    aapl['MA50'].values, 
                    aapl['MA200'].values,
                    where=(aapl['MA50'] > aapl['MA200']),
                    color='green', alpha=0.2)
    plt.fill_between(aapl['Date'].values,
                    aapl['MA50'].values,
                    aapl['MA200'].values,
                    where=(aapl['MA50'] <= aapl['MA200']),
                    color='red', alpha=0.2)
    plt.tight_layout()
    plt.show()

plot_price_trend()

# 2. Histogramme des rendements
def plot_returns_distribution():
    plt.figure()
    sns.histplot(aapl['Daily Return'].dropna().values, 
                kde=True, color='teal', bins=50)
    plt.title('Distribution des rendements quotidiens')
    plt.xlabel('Rendement quotidien')
    plt.ylabel('Fréquence')
    plt.axvline(aapl['Daily Return'].mean(), color='red', linestyle='--')
    plt.show()

plot_returns_distribution()

# 3. Heatmap de corrélation
def plot_correlation_heatmap():
    corr = aapl[['Open', 'High', 'Low', 'Close', 'Volume']].corr()
    mask = np.triu(np.ones_like(corr, dtype=bool))
    plt.figure(figsize=(10, 8))
    sns.heatmap(corr, mask=mask, annot=True, cmap='coolwarm', center=0,
               fmt=".2f", linewidths=.5)
    plt.title('Corrélations entre variables', pad=20)
    plt.tight_layout()
    plt.show()

plot_correlation_heatmap()
