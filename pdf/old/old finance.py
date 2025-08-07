#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
Générateur de Rapport d'Analyse Financière avec Données Réelles
"""

import json
import os
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from datetime import datetime
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, Image
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
import yfinance as yf
from finta import TA
import textwrap

# Chargement des configurations
with open('settings.json') as f:
    settings = json.load(f)

# Chargement des textes
with open('texts.json', encoding='utf-8') as f:
    texts = json.load(f)

# Enregistrement des polices
try:
    pdfmetrics.registerFont(TTFont('Helvetica', 'Helvetica.ttf'))
    pdfmetrics.registerFont(TTFont('Helvetica-Bold', 'Helvetica-Bold.ttf'))
except:
    print("Polices Helvetica non trouvées, utilisation des polices par défaut")

# Styles
styles = getSampleStyleSheet()
styles.add(ParagraphStyle(name='Titre1', fontSize=16, leading=20, alignment=TA_CENTER, spaceAfter=12, fontName='Helvetica-Bold'))
styles.add(ParagraphStyle(name='Titre2', fontSize=14, leading=18, alignment=TA_CENTER, spaceAfter=10, fontName='Helvetica-Bold'))
styles.add(ParagraphStyle(name='Titre3', fontSize=12, leading=16, alignment=TA_CENTER, spaceAfter=8, fontName='Helvetica-Bold'))
styles.add(ParagraphStyle(name='NormalCenter', fontSize=10, leading=12, alignment=TA_CENTER, fontName='Helvetica'))
styles.add(ParagraphStyle(name='Footer', fontSize=8, leading=10, alignment=TA_CENTER, fontName='Helvetica'))
styles.add(ParagraphStyle(name='Header', fontSize=8, leading=10, alignment=TA_CENTER, fontName='Helvetica'))

def fetch_financial_data(ticker):
    """Récupère les données financières depuis Yahoo Finance"""
    stock = yf.Ticker(ticker)

    # Données historiques
    hist = stock.history(period="5y")

    # Données fondamentales
    try:
        financials = stock.financials
        balance_sheet = stock.balance_sheet
        cashflow = stock.cashflow
    except:
        financials = pd.DataFrame()
        balance_sheet = pd.DataFrame()
        cashflow = pd.DataFrame()

    return {
        'ticker': ticker,
        'info': stock.info,
        'history': hist,
        'financials': financials,
        'balance_sheet': balance_sheet,
        'cashflow': cashflow
    }

def calculate_metrics(data):
    """Calcule les métriques financières"""
    if data['history'].empty:
        return {}

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

    # Ratios financiers
    ratios = {}
    try:
        # Profitabilité
        if not data['financials'].empty:
            revenues = data['financials'].loc['Total Revenue']
            gross_profit = data['financials'].loc['Gross Profit']
            net_income = data['financials'].loc['Net Income']

            ratios['Marge brute'] = gross_profit.iloc[0] / revenues.iloc[0]
            ratios['Marge nette'] = net_income.iloc[0] / revenues.iloc[0]
            ratios['Croissance revenus'] = (revenues.iloc[0] - revenues.iloc[1]) / revenues.iloc[1]

        # Liquidité
        if not data['balance_sheet'].empty:
            current_assets = data['balance_sheet'].loc['Total Current Assets']
            current_liab = data['balance_sheet'].loc['Total Current Liabilities']
            total_assets = data['balance_sheet'].loc['Total Assets']
            total_liab = data['balance_sheet'].loc['Total Liab']
            equity = data['balance_sheet'].loc['Total Stockholder Equity']

            ratios['Liquidité générale'] = current_assets.iloc[0] / current_liab.iloc[0]
            ratios['Dette/Equity'] = total_liab.iloc[0] / equity.iloc[0]
            ratios['ROE'] = net_income.iloc[0] / equity.iloc[0]

        # Valorisation
        info = data['info']
        ratios['PER'] = info.get('trailingPE', np.nan)
        ratios['P/B'] = info.get('priceToBook', np.nan)
        ratios['EV/EBITDA'] = info.get('enterpriseToEbitda', np.nan)
        ratios['Dividend Yield'] = info.get('dividendYield', 0)

    except Exception as e:
        print(f"Erreur dans le calcul des ratios: {e}")

    return {
        'technical_data': df,
        'ratios': ratios,
        'last_price': df['Close'].iloc[-1],
        '52w_high': df['High'].max(),
        '52w_low': df['Low'].min()
    }

def create_charts(data, metrics, output_dir='temp_charts'):
    """Crée les graphiques pour le rapport"""
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    ticker = data['ticker']
    df = metrics['technical_data']

    # Graphique des prix
    plt.figure(figsize=(10, 6))
    plt.plot(df.index, df['Close'], label='Prix', color='blue')
    plt.plot(df.index, df['SMA_50'], label='SMA 50', color='orange', linestyle='--')
    plt.plot(df.index, df['SMA_200'], label='SMA 200', color='red', linestyle='--')
    plt.title(f'Évolution du prix de {ticker} avec moyennes mobiles')
    plt.xlabel('Date')
    plt.ylabel('Prix ($)')
    plt.legend()
    plt.grid(True, linestyle='--', alpha=0.7)
    price_chart = os.path.join(output_dir, f'{ticker}_price.png')
    plt.savefig(price_chart, dpi=300, bbox_inches='tight')
    plt.close()

    # Graphique RSI
    plt.figure(figsize=(10, 4))
    plt.plot(df.index, df['RSI'], label='RSI', color='purple')
    plt.axhline(70, color='red', linestyle='--')
    plt.axhline(30, color='green', linestyle='--')
    plt.title(f'Indicateur RSI pour {ticker}')
    plt.xlabel('Date')
    plt.ylabel('RSI')
    plt.ylim(0, 100)
    plt.legend()
    plt.grid(True, linestyle='--', alpha=0.7)
    rsi_chart = os.path.join(output_dir, f'{ticker}_rsi.png')
    plt.savefig(rsi_chart, dpi=300, bbox_inches='tight')
    plt.close()

    # Graphique des ratios
    if metrics['ratios']:
        ratios = {k: v for k, v in metrics['ratios'].items() if not isinstance(v, pd.Series)}
        plt.figure(figsize=(8, 5))
        plt.bar(ratios.keys(), ratios.values(), color=['blue', 'green', 'red', 'cyan', 'purple', 'orange'])
        plt.title(f'Ratios financiers pour {ticker}')
        plt.ylabel('Valeur')
        plt.xticks(rotation=45)
        plt.grid(True, linestyle='--', alpha=0.7)
        ratios_chart = os.path.join(output_dir, f'{ticker}_ratios.png')
        plt.savefig(ratios_chart, dpi=300, bbox_inches='tight')
        plt.close()
    else:
        ratios_chart = None

    return {
        'price_chart': price_chart,
        'rsi_chart': rsi_chart,
        'ratios_chart': ratios_chart
    }

def generate_company_profile(data):
    """Génère le profil de l'entreprise"""
    info = data['info']

    profile = {
        'name': info.get('longName', data['ticker']),
        'sector': info.get('sector', 'Non disponible'),
        'industry': info.get('industry', 'Non disponible'),
        'employees': info.get('fullTimeEmployees', 'Non disponible'),
        'country': info.get('country', 'Non disponible'),
        'summary': info.get('longBusinessSummary', texts['default_summary']),
        'website': info.get('website', 'Non disponible')
    }

    return profile

def create_cover_page(profile):
    """Crée la page de garde"""
    elements = []

    elements.append(Spacer(1, 2 * inch))

    title = Paragraph(f"RAPPORT D'ANALYSE FINANCIÈRE: {profile['name']}", styles['Titre1'])
    elements.append(title)

    elements.append(Spacer(1, 1.5 * inch))

    subtitle = Paragraph("Analyse Complète des Performances Financières et Boursières", styles['Titre2'])
    elements.append(subtitle)

    elements.append(Spacer(1, 2 * inch))

    company_info = [
        ["Secteur:", profile['sector']],
        ["Industrie:", profile['industry']],
        ["Pays:", profile['country']],
        ["Employés:", str(profile['employees'])],
        ["Site web:", profile['website']],
        ["Date du rapport:", datetime.now().strftime("%d %B %Y")]
    ]

    company_table = Table(company_info, colWidths=[2*inch, 3*inch])
    company_table.setStyle(TableStyle([
        ('FONTNAME', (0, 0), (-1, -1), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 12),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('ALIGN', (0, 0), (0, -1), 'RIGHT'),
        ('ALIGN', (1, 0), (1, -1), 'LEFT'),
    ]))
    elements.append(company_table)

    elements.append(Spacer(1, 3 * inch))

    confidential = Paragraph("CONFIDENTIEL - À l'usage exclusif du destinataire", styles['NormalCenter'])
    elements.append(confidential)

    elements.append(PageBreak())

    return elements

def create_price_analysis(data, metrics, charts):
    """Crée la section d'analyse des prix"""
    elements = []

    title = Paragraph("1. ANALYSE TECHNIQUE ET COURSIÈRE", styles['Titre2'])
    elements.append(title)

    elements.append(Spacer(1, 0.3 * inch))

    # Données de prix
    price_data = [
        ["Dernier prix", f"{metrics['last_price']:.2f}$"],
        ["52 semaines haut", f"{metrics['52w_high']:.2f}$"],
        ["52 semaines bas", f"{metrics['52w_low']:.2f}$"],
        ["Variation 52 semaines", f"{(metrics['last_price'] - metrics['52w_low']) / (metrics['52w_high'] - metrics['52w_low']) * 100:.1f}%"]
    ]

    price_table = Table(price_data, colWidths=[2*inch, 2*inch])
    price_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('GRID', (0, 0), (-1, -1), 1, colors.black),
    ]))
    elements.append(price_table)

    elements.append(Spacer(1, 0.3 * inch))

    # Graphique des prix
    img = Image(charts['price_chart'], width=6*inch, height=4*inch)
    elements.append(img)

    elements.append(Spacer(1, 0.2 * inch))

    # Analyse technique
    analysis_text = texts['price_analysis'].format(
        ticker=data['ticker'],
        last_price=metrics['last_price'],
        high=metrics['52w_high'],
        low=metrics['52w_low']
    )
    elements.append(Paragraph(analysis_text, styles['Normal']))

    elements.append(Spacer(1, 0.3 * inch))

    # Graphique RSI
    img = Image(charts['rsi_chart'], width=6*inch, height=3*inch)
    elements.append(img)

    elements.append(Spacer(1, 0.2 * inch))

    # Analyse RSI
    rsi_text = texts['rsi_analysis']
    elements.append(Paragraph(rsi_text, styles['Normal']))

    elements.append(PageBreak())

    return elements

def create_fundamental_analysis(data, metrics, charts):

    """Crée la section d'analyse fondamentale"""
    elements = []

    title = Paragraph("2. ANALYSE FONDAMENTALE", styles['Titre2'])
    elements.append(title)

    elements.append(Spacer(1, 0.3 * inch))

    # Ratios de valorisation
    valuation_title = Paragraph("2.1 Ratios de Valorisation", styles['Titre3'])
    elements.append(valuation_title)

    elements.append(Spacer(1, 0.2 * inch))

    valuation_data = [
        ["Ratio", "Valeur", "Interprétation"],
        ["P/E (PER)", f"{metrics['ratios'].get('PER', 'N/A')}", texts['pe_interpretation']],
        ["P/B (Price/Book)", f"{metrics['ratios'].get('P/B', 'N/A')}", texts['pb_interpretation']],
        ["EV/EBITDA", f"{metrics['ratios'].get('EV/EBITDA', 'N/A')}", texts['ev_interpretation']],
        ["Dividend Yield", f"{metrics['ratios'].get('Dividend Yield', 0)*100:.2f}%" if isinstance(metrics['ratios'].get('Dividend Yield', 0), (int, float)) else "N/A", texts['dy_interpretation']]
    ]

    valuation_table = Table(valuation_data, colWidths=[1.5*inch, 1*inch, 3*inch])
    valuation_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('GRID', (0, 0), (-1, -1), 1, colors.black),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('ALIGN', (2, 1), (2, -1), 'LEFT'),
    ]))
    elements.append(valuation_table)

    elements.append(Spacer(1, 0.3 * inch))

    # Ratios financiers
    financial_title = Paragraph("2.2 Ratios Financiers", styles['Titre3'])
    elements.append(financial_title)

    elements.append(Spacer(1, 0.2 * inch))

    # Helper function to format percentage values
    def format_percentage(value):
        if isinstance(value, (int, float)) and not np.isnan(value):
            return f"{value:.2%}"
        return "N/A"

    def format_decimal(value):
        if isinstance(value, (int, float)) and not np.isnan(value):
            return f"{value:.2f}"
        return "N/A"

    financial_data = [
        ["Ratio", "Valeur", "Interprétation"],
        ["Marge brute", format_percentage(metrics['ratios'].get('Marge brute', 'N/A')), texts['gross_margin_interpretation']],
        ["Marge nette", format_percentage(metrics['ratios'].get('Marge nette', 'N/A')), texts['net_margin_interpretation']],
        ["ROE", format_percentage(metrics['ratios'].get('ROE', 'N/A')), texts['roe_interpretation']],
        ["Dette/Equity", format_decimal(metrics['ratios'].get('Dette/Equity', 'N/A')), texts['debt_interpretation']]
    ]

    financial_table = Table(financial_data, colWidths=[1.5*inch, 1*inch, 3*inch])
    financial_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('GRID', (0, 0), (-1, -1), 1, colors.black),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('ALIGN', (2, 1), (2, -1), 'LEFT'),
    ]))
    elements.append(financial_table)

    elements.append(Spacer(1, 0.3 * inch))

    # Graphique des ratios
    if 'ratios_chart' in charts and charts['ratios_chart']:
        img = Image(charts['ratios_chart'], width=6*inch, height=4*inch)
        elements.append(img)

    elements.append(PageBreak())

    return elements

def create_recommendations_section(profile, metrics):
    """Crée la section des recommandations"""
    elements = []

    title = Paragraph("3. RECOMMANDATIONS D'INVESTISSEMENT", styles['Titre2'])
    elements.append(title)

    elements.append(Spacer(1, 0.3 * inch))

    # Analyse SWOT simplifiée
    swot_title = Paragraph("Analyse SWOT", styles['Titre3'])
    elements.append(swot_title)

    elements.append(Spacer(1, 0.2 * inch))

    swot_data = [
        ["Forces", texts['strengths']],
        ["Faiblesses", texts['weaknesses']],
        ["Opportunités", texts['opportunities']],
        ["Menaces", texts['threats']]
    ]

    swot_table = Table(swot_data, colWidths=[1.5*inch, 4.5*inch])
    swot_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (0, -1), colors.lightgrey),
        ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('GRID', (0, 0), (-1, -1), 1, colors.black),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
    ]))
    elements.append(swot_table)

    elements.append(Spacer(1, 0.3 * inch))

    # Recommandations
    reco_title = Paragraph("Recommandations", styles['Titre3'])
    elements.append(reco_title)

    elements.append(Spacer(1, 0.2 * inch))

    pe_ratio = metrics['ratios'].get('PER', 0)
    if pe_ratio != 'N/A':
        if pe_ratio < 15:
            pe_text = texts['low_pe_reco']
        elif pe_ratio > 25:
            pe_text = texts['high_pe_reco']
        else:
            pe_text = texts['normal_pe_reco']
    else:
        pe_text = texts['no_pe_data']

    elements.append(Paragraph(pe_text, styles['Normal']))

    elements.append(Spacer(1, 0.2 * inch))

    # Score d'investissement
    score = 0
    if metrics['ratios'].get('ROE', 0) > 0.15: score += 1
    if metrics['ratios'].get('Dette/Equity', 1) < 1: score += 1
    if metrics['ratios'].get('Marge brute', 0) > 0.4: score += 1
    if metrics['ratios'].get('Dividend Yield', 0) > 0.02: score += 1

    score_text = texts['investment_score'].format(
        score=score,
        max_score=4,
        company=profile['name']
    )
    elements.append(Paragraph(score_text, styles['Normal']))

    elements.append(PageBreak())

    return elements

def create_footer(canvas, doc):
    """Pied de page"""
    canvas.saveState()
    footer = Paragraph(f"Rapport d'analyse financière - {datetime.now().strftime('%d/%m/%Y')} - Page {doc.page}", styles['Footer'])
    footer.wrapOn(canvas, doc.width, doc.bottomMargin)
    footer.drawOn(canvas, doc.leftMargin, doc.bottomMargin/2)
    canvas.restoreState()

def generate_report(ticker):
    """Génère le rapport complet pour un ticker"""
    print(f"Génération du rapport pour {ticker}...")

    # Récupération des données
    data = fetch_financial_data(ticker)
    if data['history'].empty:
        print(f"Erreur: Aucune donnée disponible pour {ticker}")
        return

    # Calcul des métriques
    metrics = calculate_metrics(data)

    # Création des graphiques
    charts = create_charts(data, metrics)

    # Profil de l'entreprise
    profile = generate_company_profile(data)

    # Création du PDF
    output_file = f"Rapport_Analyse_{ticker}.pdf"
    doc = SimpleDocTemplate(
        output_file,
        pagesize=A4,
        rightMargin=72,
        leftMargin=72,
        topMargin=72,
        bottomMargin=72,
        title=f"Rapport d'analyse {ticker}"
    )

    # Construction du rapport
    elements = []

    # Page de garde
    elements.extend(create_cover_page(profile))

    # Analyse des prix
    elements.extend(create_price_analysis(data, metrics, charts))

    # Analyse fondamentale
    elements.extend(create_fundamental_analysis(data, metrics, charts))
    # Recommandations
    elements.extend(create_recommendations_section(profile, metrics))

    # Génération du PDF
    doc.build(elements, onFirstPage=create_footer, onLaterPages=create_footer)

    print(f"Rapport généré: {output_file}")

if __name__ == "__main__":
    for ticker in settings['tickers']:
        generate_report(ticker)
