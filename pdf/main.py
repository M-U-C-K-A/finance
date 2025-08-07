#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
Script principal pour la génération de rapports d'analyse financière
"""

import json
import yfinance as yf
from finta import TA
import pandas as pd
import numpy as np
from datetime import datetime
from charts import create_charts
from pdf import generate_pdf_report

# Chargement des configurations
with open('settings.json') as f:
    settings = json.load(f)

def fetch_financial_data(ticker):
    """Récupère les données financières depuis Yahoo Finance avec gestion d'erreurs améliorée"""
    try:
        stock = yf.Ticker(ticker)
        
        # Vérifier si le ticker existe
        if not stock.info:
            print(f"Erreur: Ticker {ticker} non trouvé")
            return None

        # Données historiques
        hist = stock.history(period="5y")
        if hist.empty:
            print(f"Erreur: Pas de données historiques pour {ticker}")
            return None

        # Données fondamentales
        financials = stock.financials
        balance_sheet = stock.balance_sheet
        cashflow = stock.cashflow

        return {
            'ticker': ticker,
            'info': stock.info,
            'history': hist,
            'financials': financials,
            'balance_sheet': balance_sheet,
            'cashflow': cashflow
        }
    except Exception as e:
        print(f"Erreur lors de la récupération des données pour {ticker}: {str(e)}")
        return None

def calculate_metrics(data):
    """Calcule les métriques financières avec gestion d'erreurs"""
    metrics = {
        'technical_data': pd.DataFrame(),
        'ratios': {},
        'last_price': 0,
        '52w_high': 0,
        '52w_low': 0
    }
    
    if data is None or data['history'].empty:
        return metrics

    try:
        # Calcul des indicateurs techniques
        df = data['history'].copy()
        df['SMA_50'] = TA.SMA(df, 50)
        df['SMA_200'] = TA.SMA(df, 200)
        df['RSI'] = TA.RSI(df)
        df['MACD'] = TA.MACD(df)['MACD']
        
        bb_result = TA.BBANDS(df)
        df['BB_upper'] = bb_result['BB_UPPER']
        df['BB_middle'] = bb_result['BB_MIDDLE'] 
        df['BB_lower'] = bb_result['BB_LOWER']

        metrics['technical_data'] = df
        metrics['last_price'] = df['Close'].iloc[-1]
        metrics['52w_high'] = df['High'].max()
        metrics['52w_low'] = df['Low'].min()

        # Ratios financiers
        ratios = {}
        
        # Profitabilité
        if not data['financials'].empty:
            try:
                revenues = data['financials'].loc['Total Revenue']
                gross_profit = data['financials'].loc['Gross Profit']
                net_income = data['financials'].loc['Net Income']
                
                ratios['Marge brute'] = gross_profit.iloc[0] / revenues.iloc[0]
                ratios['Marge nette'] = net_income.iloc[0] / revenues.iloc[0]
                ratios['Croissance revenus'] = (revenues.iloc[0] - revenues.iloc[1]) / revenues.iloc[1] if len(revenues) > 1 else np.nan
            except KeyError:
                pass

        # Liquidité
        if not data['balance_sheet'].empty:
            try:
                current_assets = data['balance_sheet'].loc['Total Current Assets']
                current_liab = data['balance_sheet'].loc['Total Current Liabilities']
                total_assets = data['balance_sheet'].loc['Total Assets']
                total_liab = data['balance_sheet'].loc['Total Liab']
                equity = data['balance_sheet'].loc['Total Stockholder Equity']
                
                ratios['Liquidité générale'] = current_assets.iloc[0] / current_liab.iloc[0]
                ratios['Dette/Equity'] = total_liab.iloc[0] / equity.iloc[0]
                if 'net_income' in locals() and 'equity' in locals():
                    ratios['ROE'] = net_income.iloc[0] / equity.iloc[0]
            except KeyError:
                pass

        # Valorisation
        info = data['info']
        ratios['PER'] = info.get('trailingPE', np.nan)
        ratios['P/B'] = info.get('priceToBook', np.nan)
        ratios['EV/EBITDA'] = info.get('enterpriseToEbitda', np.nan)
        ratios['Dividend Yield'] = info.get('dividendYield', 0)

        metrics['ratios'] = {k: v for k, v in ratios.items() if not pd.isna(v)}

    except Exception as e:
        print(f"Erreur dans le calcul des métriques: {str(e)}")

    return metrics

def generate_report(ticker):
    """Génère le rapport complet pour un ticker"""
    print(f"\nGénération du rapport pour {ticker}...")
    
    # Récupération des données
    data = fetch_financial_data(ticker)
    if data is None:
        print(f"Impossible de générer le rapport pour {ticker} - données indisponibles")
        return

    # Calcul des métriques
    metrics = calculate_metrics(data)
    print(" - Métriques calculées")

    # Création des graphiques
    print(" - Création des graphiques...")
    charts = create_charts(data, metrics)
    print(" - Graphiques générés")

    # Génération du PDF
    output_file = f"Rapport_Analyse_Approfondie_{ticker}.pdf"
    print(f" - Génération du PDF {output_file}...")
    generate_pdf_report(data, metrics, charts, output_file)
    print(f"Rapport généré avec succès: {output_file}\n")

if __name__ == "__main__":
    for ticker in settings['tickers']:
        generate_report(ticker)
