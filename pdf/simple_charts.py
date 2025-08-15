#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
Module simplifié de génération des graphiques
"""

import os
import matplotlib.pyplot as plt
import pandas as pd
import numpy as np
from datetime import datetime

def create_simple_charts(data, output_dir='temp_charts'):
    """Crée des graphiques simples pour le rapport"""
    
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
    
    ticker = data['ticker']
    hist = data['history']
    
    if hist.empty:
        return None
    
    # Configuration du style
    plt.style.use('default')
    
    # 1. Graphique des prix
    plt.figure(figsize=(12, 8))
    
    # Subplot 1: Prix de clôture
    plt.subplot(2, 1, 1)
    plt.plot(hist.index, hist['Close'], color='blue', linewidth=2)
    plt.title(f'{ticker} - Évolution du Prix de Clôture', fontsize=14, fontweight='bold')
    plt.ylabel('Prix ($)', fontsize=12)
    plt.grid(True, alpha=0.3)
    
    # Ajouter moyenne mobile simple
    if len(hist) >= 50:
        ma50 = hist['Close'].rolling(window=50).mean()
        plt.plot(hist.index, ma50, color='orange', linestyle='--', alpha=0.7, label='MA 50')
        plt.legend()
    
    # Subplot 2: Volume
    plt.subplot(2, 1, 2)
    plt.bar(hist.index, hist['Volume'], color='gray', alpha=0.6)
    plt.title('Volume des Transactions', fontsize=14, fontweight='bold')
    plt.ylabel('Volume', fontsize=12)
    plt.xlabel('Date', fontsize=12)
    plt.grid(True, alpha=0.3)
    
    plt.tight_layout()
    
    # Sauvegarder
    chart_path = os.path.join(output_dir, f'{ticker}_price_volume.png')
    plt.savefig(chart_path, dpi=300, bbox_inches='tight')
    plt.close()
    
    # 2. Graphique des rendements
    plt.figure(figsize=(12, 6))
    
    returns = hist['Close'].pct_change().dropna()
    
    plt.subplot(1, 2, 1)
    plt.hist(returns, bins=50, alpha=0.7, color='blue', edgecolor='black')
    plt.title(f'{ticker} - Distribution des Rendements Quotidiens', fontsize=12, fontweight='bold')
    plt.xlabel('Rendement (%)')
    plt.ylabel('Fréquence')
    plt.grid(True, alpha=0.3)
    
    plt.subplot(1, 2, 2)
    cumulative_returns = (1 + returns).cumprod()
    plt.plot(hist.index[1:], cumulative_returns, color='green', linewidth=2)
    plt.title('Rendements Cumulatifs', fontsize=12, fontweight='bold')
    plt.ylabel('Rendement Cumulatif')
    plt.xlabel('Date')
    plt.grid(True, alpha=0.3)
    
    plt.tight_layout()
    
    returns_path = os.path.join(output_dir, f'{ticker}_returns.png')
    plt.savefig(returns_path, dpi=300, bbox_inches='tight')
    plt.close()
    
    # Retourner les chemins des graphiques créés
    return {
        'price_volume': chart_path,
        'returns': returns_path
    }

def create_charts(data):
    """Interface compatible avec l'ancien système"""
    return create_simple_charts(data)