#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
Module de génération des graphiques pour l'analyse financière
"""

import os
import matplotlib.pyplot as plt
import seaborn as sns
import pandas as pd
import numpy as np
from finta import TA

def create_charts(data, metrics, output_dir='temp_charts'):
    """Crée les graphiques pour le rapport"""
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    ticker = data['ticker']
    df = metrics['technical_data']
    charts = {}

    # 1. Graphique des prix avec SMA et Bollinger Bands
    plt.figure(figsize=(12, 6))
    plt.plot(df.index, df['Close'], label='Prix', color='blue', alpha=0.7)
    plt.plot(df.index, df['SMA_50'], label='SMA 50', color='orange', linestyle='--')
    plt.plot(df.index, df['SMA_200'], label='SMA 200', color='red', linestyle='--')
    plt.plot(df.index, df['BB_upper'], label='Bollinger Upper', color='green', alpha=0.5)
    plt.plot(df.index, df['BB_lower'], label='Bollinger Lower', color='purple', alpha=0.5)
    plt.fill_between(df.index, df['BB_upper'], df['BB_lower'], color='gray', alpha=0.1)
    plt.title(f'Évolution du prix de {ticker} avec indicateurs techniques')
    plt.xlabel('Date')
    plt.ylabel('Prix ($)')
    plt.legend()
    plt.grid(True, linestyle='--', alpha=0.7)
    charts['price_chart'] = os.path.join(output_dir, f'{ticker}_price.png')
    plt.savefig(charts['price_chart'], dpi=300, bbox_inches='tight')
    plt.close()

    # 2. Graphique RSI avec zones de surachat/survente
    plt.figure(figsize=(12, 4))
    plt.plot(df.index, df['RSI'], label='RSI', color='purple')
    plt.axhline(70, color='red', linestyle='--', alpha=0.7)
    plt.axhline(30, color='green', linestyle='--', alpha=0.7)
    plt.fill_between(df.index, 70, 30, where=(df['RSI']>=30) & (df['RSI']<=70), 
                    color='gray', alpha=0.1, interpolate=True)
    plt.title(f'Indicateur RSI pour {ticker}')
    plt.xlabel('Date')
    plt.ylabel('RSI')
    plt.ylim(0, 100)
    plt.legend()
    plt.grid(True, linestyle='--', alpha=0.7)
    charts['rsi_chart'] = os.path.join(output_dir, f'{ticker}_rsi.png')
    plt.savefig(charts['rsi_chart'], dpi=300, bbox_inches='tight')
    plt.close()

    # 3. Distribution des rendements journaliers
    returns = df['Close'].pct_change().dropna()
    plt.figure(figsize=(10, 6))
    sns.histplot(returns, kde=True, color='blue', bins=50)
    plt.title(f'Distribution des rendements journaliers de {ticker}')
    plt.xlabel('Rendement journalier')
    plt.ylabel('Fréquence')
    plt.grid(True, linestyle='--', alpha=0.7)
    charts['returns_dist'] = os.path.join(output_dir, f'{ticker}_returns_dist.png')
    plt.savefig(charts['returns_dist'], dpi=300, bbox_inches='tight')
    plt.close()

    # 4. Heatmap de corrélation des indicateurs
    corr_data = df[['Close', 'SMA_50', 'SMA_200', 'RSI', 'MACD']].corr()
    plt.figure(figsize=(8, 6))
    sns.heatmap(corr_data, annot=True, cmap='coolwarm', center=0)
    plt.title(f'Matrice de corrélation des indicateurs pour {ticker}')
    charts['corr_heatmap'] = os.path.join(output_dir, f'{ticker}_corr_heatmap.png')
    plt.savefig(charts['corr_heatmap'], dpi=300, bbox_inches='tight')
    plt.close()

    # 5. Graphique volume et prix
    fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(12, 8), sharex=True)
    ax1.plot(df.index, df['Close'], color='blue')
    ax1.set_ylabel('Prix ($)')
    ax1.set_title(f'Prix et volume de {ticker}')
    ax1.grid(True, linestyle='--', alpha=0.7)
    
    ax2.bar(df.index, df['Volume'], color='green', alpha=0.7)
    ax2.set_ylabel('Volume')
    ax2.grid(True, linestyle='--', alpha=0.7)
    
    charts['price_volume'] = os.path.join(output_dir, f'{ticker}_price_volume.png')
    plt.savefig(charts['price_volume'], dpi=300, bbox_inches='tight')
    plt.close()

    # 6. Graphique des ratios financiers
    if metrics['ratios']:
        ratios = {k: v for k, v in metrics['ratios'].items() 
                if not isinstance(v, pd.Series) and not pd.isna(v)}
        if ratios:
            plt.figure(figsize=(10, 6))
            plt.bar(ratios.keys(), ratios.values(), 
                   color=plt.cm.Paired(np.arange(len(ratios))))
            plt.title(f'Ratios financiers pour {ticker}')
            plt.ylabel('Valeur')
            plt.xticks(rotation=45, ha='right')
            plt.grid(True, linestyle='--', alpha=0.7)
            charts['ratios_chart'] = os.path.join(output_dir, f'{ticker}_ratios.png')
            plt.savefig(charts['ratios_chart'], dpi=300, bbox_inches='tight')
            plt.close()

    # 7. Graphique MACD
    if 'MACD' in df.columns:
        plt.figure(figsize=(12, 5))
        plt.plot(df.index, df['MACD'], label='MACD', color='blue')
        plt.axhline(0, color='gray', linestyle='--')
        plt.title(f'Indicateur MACD pour {ticker}')
        plt.xlabel('Date')
        plt.ylabel('MACD')
        plt.legend()
        plt.grid(True, linestyle='--', alpha=0.7)
        charts['macd_chart'] = os.path.join(output_dir, f'{ticker}_macd.png')
        plt.savefig(charts['macd_chart'], dpi=300, bbox_inches='tight')
        plt.close()

    return charts