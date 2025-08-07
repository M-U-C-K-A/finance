#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
Module de génération du PDF pour l'analyse financière
"""

import json
import numpy as np
from datetime import datetime
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, Image
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

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

def create_cover_page(profile):
    """Crée la page de garde du rapport"""
    elements = []
    
    # Titre principal
    elements.append(Paragraph("RAPPORT D'ANALYSE FINANCIÈRE", styles['Titre1']))
    elements.append(Spacer(1, 0.5 * inch))
    
    # Sous-titre avec le nom de l'entreprise
    elements.append(Paragraph(f"Analyse approfondie de {profile['name']}", styles['Titre2']))
    elements.append(Spacer(1, 0.5 * inch))
    
    # Informations sur l'entreprise
    company_info = f"""
        <b>Secteur :</b> {profile['sector']}<br/>
        <b>Industrie :</b> {profile['industry']}<br/>
        <b>Pays :</b> {profile['country']}<br/>
        <b>Employés :</b> {profile['employees']}<br/>
        <b>Site web :</b> <a href="{profile['website']}">{profile['website']}</a>
    """
    elements.append(Paragraph(company_info, styles['NormalCenter']))
    
    # Date de génération du rapport
    date_str = datetime.now().strftime("%d %B %Y")
    elements.append(Spacer(1, 0.5 * inch))
    elements.append(Paragraph(f"Date de génération : {date_str}", styles['NormalCenter']))
    
    return elements

def create_footer(canvas, doc):
    """Crée le pied de page pour chaque page"""
    canvas.saveState()
    canvas.setFont('Helvetica', 8)
    canvas.drawString(1 * inch, 0.75 * inch, "Rapport d'analyse financière - Page %d" % doc.page)
    canvas.restoreState()

def create_table_of_contents():
    """Crée la table des matières"""
    elements = []
    
    elements.append(Paragraph("TABLE DES MATIÈRES", styles['Titre2']))
    elements.append(Spacer(1, 0.5 * inch))
    
    toc = [
        ["1. Analyse Technique Approfondie", "3"],
        ["2. Analyse Fondamentale Approfondie", "5"],
        ["3. Analyse des Risques", "7"],
        ["4. Stratégie d'Investissement", "8"],
        ["Annexes Techniques", "9"]
    ]
    
    toc_table = Table(toc, colWidths=[4*inch, 1*inch])
    toc_table.setStyle(TableStyle([
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (-1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 0), (-1, -1), 11),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('LINEABOVE', (0, 0), (-1, 0), 1, colors.black),
        ('LINEBELOW', (0, -1), (-1, -1), 1, colors.black),
        ('LINEBELOW', (0, 0), (0, -1), 0.5, colors.grey),
    ]))
    elements.append(toc_table)
    elements.append(PageBreak())
    
    return elements

def create_technical_analysis(data, metrics, charts):
    """Crée la section complète d'analyse technique"""
    elements = []
    
    # Titre principal
    elements.append(Paragraph("1. ANALYSE TECHNIQUE APPROFONDIE", styles['Titre2']))
    elements.append(Spacer(1, 0.3 * inch))

    # 1.1 Vue d'ensemble des prix
    elements.append(Paragraph("1.1 Évolution des prix et indicateurs clés", styles['Titre3']))
    elements.append(Spacer(1, 0.2 * inch))
    
    # Tableau des indicateurs
    price_data = [
        ["Dernier prix", f"{metrics['last_price']:.2f}$"],
        ["52 semaines haut", f"{metrics['52w_high']:.2f}$"],
        ["52 semaines bas", f"{metrics['52w_low']:.2f}$"],
        ["Variation 52 semaines", f"{(metrics['last_price'] - metrics['52w_low']) / (metrics['52w_high'] - metrics['52w_low']) * 100:.1f}%"],
        ["Volatilité (écart-type)", f"{metrics['technical_data']['Close'].pct_change().std()*100:.2f}%"]
    ]
    
    price_table = Table(price_data, colWidths=[2*inch, 2*inch])
    price_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#2c3e50')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('GRID', (0, 0), (-1, -1), 1, colors.black),
    ]))
    elements.append(price_table)
    elements.append(Spacer(1, 0.3 * inch))
    
    # Texte d'analyse
    analysis_text = texts['price_analysis'].format(
        ticker=data['ticker'],
        last_price=metrics['last_price'],
        high=metrics['52w_high'],
        low=metrics['52w_low']
    )
    elements.append(Paragraph(analysis_text, styles['Normal']))
    elements.append(Spacer(1, 0.3 * inch))
    
    # Graphique prix
    img = Image(charts['price_chart'], width=6.5*inch, height=4*inch)
    elements.append(img)
    elements.append(Spacer(1, 0.2 * inch))
    
    # 1.2 Analyse des volumes
    elements.append(Paragraph("1.2 Analyse des volumes de transaction", styles['Titre3']))
    elements.append(Spacer(1, 0.2 * inch))
    
    if 'price_volume' in charts:
        img = Image(charts['price_volume'], width=6.5*inch, height=5*inch)
        elements.append(img)
        elements.append(Spacer(1, 0.2 * inch))
        elements.append(Paragraph(texts['volume_analysis'], styles['Normal']))
        elements.append(Spacer(1, 0.3 * inch))
    
    # 1.3 Indicateurs techniques
    elements.append(Paragraph("1.3 Indicateurs techniques avancés", styles['Titre3']))
    elements.append(Spacer(1, 0.2 * inch))
    
    # RSI
    if 'rsi_chart' in charts:
        img = Image(charts['rsi_chart'], width=6.5*inch, height=3.5*inch)
        elements.append(img)
        elements.append(Spacer(1, 0.2 * inch))
        elements.append(Paragraph(texts['rsi_analysis'], styles['Normal']))
        elements.append(Spacer(1, 0.3 * inch))
    
    # MACD
    if 'macd_chart' in charts:
        img = Image(charts['macd_chart'], width=6.5*inch, height=3.5*inch)
        elements.append(img)
        elements.append(Spacer(1, 0.2 * inch))
        elements.append(Paragraph(texts['macd_analysis'], styles['Normal']))
        elements.append(Spacer(1, 0.3 * inch))
    
    # 1.4 Distribution des rendements
    elements.append(Paragraph("1.4 Analyse des rendements journaliers", styles['Titre3']))
    elements.append(Spacer(1, 0.2 * inch))
    
    if 'returns_dist' in charts:
        img = Image(charts['returns_dist'], width=5*inch, height=4*inch)
        elements.append(img)
        elements.append(Spacer(1, 0.2 * inch))
        
        returns = metrics['technical_data']['Close'].pct_change().dropna()
        skewness = returns.skew()
        kurtosis = returns.kurtosis()
        
        returns_text = texts['returns_analysis'].format(
            mean=returns.mean()*100,
            std=returns.std()*100,
            skew=skewness,
            kurt=kurtosis
        )
        elements.append(Paragraph(returns_text, styles['Normal']))
        elements.append(Spacer(1, 0.3 * inch))
    
    # 1.5 Corrélations entre indicateurs
    elements.append(Paragraph("1.5 Corrélations entre indicateurs", styles['Titre3']))
    elements.append(Spacer(1, 0.2 * inch))
    
    if 'corr_heatmap' in charts:
        img = Image(charts['corr_heatmap'], width=5*inch, height=4*inch)
        elements.append(img)
        elements.append(Spacer(1, 0.2 * inch))
        elements.append(Paragraph(texts['correlation_analysis'], styles['Normal']))
    
    elements.append(PageBreak())
    return elements

def create_fundamental_analysis(data, metrics, charts):
    """Crée la section d'analyse fondamentale enrichie"""
    elements = []
    
    # Titre principal
    elements.append(Paragraph("2. ANALYSE FONDAMENTALE APPROFONDIE", styles['Titre2']))
    elements.append(Spacer(1, 0.3 * inch))
    
    # 2.1 Profil de l'entreprise
    elements.append(Paragraph("2.1 Profil de l'entreprise", styles['Titre3']))
    elements.append(Spacer(1, 0.2 * inch))
    
    profile = generate_company_profile(data)
    profile_text = texts['company_profile'].format(
        name=profile['name'],
        sector=profile['sector'],
        industry=profile['industry'],
        employees=profile['employees'],
        country=profile['country'],
        summary=profile['summary']
    )
    elements.append(Paragraph(profile_text, styles['Normal']))
    elements.append(Spacer(1, 0.3 * inch))
    
    # 2.2 Ratios de valorisation
    elements.append(Paragraph("2.2 Ratios de Valorisation", styles['Titre3']))
    elements.append(Spacer(1, 0.2 * inch))
    
    # Tableau des ratios    
    valuation_data = [
        ["Ratio", "Valeur", "Interprétation", "Secteur"],
        ["P/E (PER)", 
         f"{metrics['ratios'].get('PER', 'N/A')}", 
         texts['pe_interpretation'],
         "15-25"],
        ["P/B (Price/Book)", 
         f"{metrics['ratios'].get('P/B', 'N/A')}", 
         texts['pb_interpretation'],
         "1-3"],
        ["EV/EBITDA", 
         f"{metrics['ratios'].get('EV/EBITDA', 'N/A')}", 
         texts['ev_interpretation'],
         "8-12"],
        ["Dividend Yield", 
         f"{metrics['ratios'].get('Dividend Yield', 0)*100:.2f}%" if isinstance(metrics['ratios'].get('Dividend Yield', 0), (int, float)) else "N/A", 
         texts['dy_interpretation'],
         "2-4%"]
    ]
    
    valuation_table = Table(valuation_data, colWidths=[1.2*inch, 0.8*inch, 2.5*inch, 0.8*inch])
    valuation_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#2c3e50')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 9),
        ('GRID', (0, 0), (-1, -1), 1, colors.black),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('ALIGN', (2, 1), (2, -1), 'LEFT'),
    ]))
    elements.append(valuation_table)
    elements.append(Spacer(1, 0.3 * inch))
    
    # 2.3 Ratios financiers
    elements.append(Paragraph("2.3 Ratios Financiers", styles['Titre3']))
    elements.append(Spacer(1, 0.2 * inch))
    
    def format_percentage(value):
        if isinstance(value, (int, float)) and not np.isnan(value):
            return f"{value:.2%}"
        return "N/A"
    
    def format_decimal(value):
        if isinstance(value, (int, float)) and not np.isnan(value):
            return f"{value:.2f}"
        return "N/A"
    
    financial_data = [
        ["Ratio", "Valeur", "Interprétation", "Cible"],
        ["Marge brute", 
         format_percentage(metrics['ratios'].get('Marge brute', 'N/A')), 
         texts['gross_margin_interpretation'],
         ">40%"],
        ["Marge nette", 
         format_percentage(metrics['ratios'].get('Marge nette', 'N/A')), 
         texts['net_margin_interpretation'],
         ">10%"],
        ["ROE", 
         format_percentage(metrics['ratios'].get('ROE', 'N/A')), 
         texts['roe_interpretation'],
         ">15%"],
        ["Dette/Equity", 
         format_decimal(metrics['ratios'].get('Dette/Equity', 'N/A')), 
         texts['debt_interpretation'],
         "<1.0"],
        ["Liquidité générale", 
         format_decimal(metrics['ratios'].get('Liquidité générale', 'N/A')), 
         texts['liquidity_interpretation'],
         ">1.5"]
    ]
    
    financial_table = Table(financial_data, colWidths=[1.2*inch, 0.8*inch, 2.5*inch, 0.8*inch])
    financial_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#2c3e50')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 9),
        ('GRID', (0, 0), (-1, -1), 1, colors.black),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('ALIGN', (2, 1), (2, -1), 'LEFT'),
    ]))
    elements.append(financial_table)
    elements.append(Spacer(1, 0.3 * inch))
    
    # 2.4 Graphique des ratios
    if 'ratios_chart' in charts and charts['ratios_chart']:
        elements.append(Paragraph("2.4 Visualisation des ratios clés", styles['Titre3']))
        elements.append(Spacer(1, 0.2 * inch))
        img = Image(charts['ratios_chart'], width=6*inch, height=4*inch)
        elements.append(img)
        elements.append(Spacer(1, 0.2 * inch))
        elements.append(Paragraph(texts['ratios_visualization'], styles['Normal']))
    
    elements.append(PageBreak())
    return elements

def create_risk_analysis(data, metrics):
    """Crée une section d'analyse des risques"""
    elements = []
    
    elements.append(Paragraph("3. ANALYSE DES RISQUES", styles['Titre2']))
    elements.append(Spacer(1, 0.3 * inch))
    
    # 3.1 Risques marché
    elements.append(Paragraph("3.1 Risques de marché", styles['Titre3']))
    elements.append(Spacer(1, 0.2 * inch))
    elements.append(Paragraph(texts['market_risk'], styles['Normal']))
    elements.append(Spacer(1, 0.3 * inch))
    
    # 3.2 Risques sectoriels
    elements.append(Paragraph("3.2 Risques sectoriels", styles['Titre3']))
    elements.append(Spacer(1, 0.2 * inch))
    elements.append(Paragraph(texts['sector_risk'], styles['Normal']))
    elements.append(Spacer(1, 0.3 * inch))
    
    # 3.3 Risques spécifiques
    elements.append(Paragraph("3.3 Risques spécifiques à l'entreprise", styles['Titre3']))
    elements.append(Spacer(1, 0.2 * inch))
    elements.append(Paragraph(texts['company_specific_risk'], styles['Normal']))
    
    elements.append(PageBreak())
    return elements

def create_investment_strategy():
    """Crée une section sur la stratégie d'investissement"""
    elements = []
    
    elements.append(Paragraph("4. STRATÉGIE D'INVESTISSEMENT", styles['Titre2']))
    elements.append(Spacer(1, 0.3 * inch))
    
    # 4.1 Approche recommandée
    elements.append(Paragraph("4.1 Approche recommandée", styles['Titre3']))
    elements.append(Spacer(1, 0.2 * inch))
    elements.append(Paragraph(texts['investment_approach'], styles['Normal']))
    elements.append(Spacer(1, 0.3 * inch))
    
    # 4.2 Horizon temporel
    elements.append(Paragraph("4.2 Horizon temporel", styles['Titre3']))
    elements.append(Spacer(1, 0.2 * inch))
    elements.append(Paragraph(texts['time_horizon'], styles['Normal']))
    elements.append(Spacer(1, 0.3 * inch))
    
    # 4.3 Gestion des risques
    elements.append(Paragraph("4.3 Gestion des risques", styles['Titre3']))
    elements.append(Spacer(1, 0.2 * inch))
    elements.append(Paragraph(texts['risk_management'], styles['Normal']))
    
    elements.append(PageBreak())
    return elements

def create_appendices(data, metrics):
    """Crée les annexes techniques"""
    elements = []
    
    elements.append(Paragraph("ANNEXES TECHNIQUES", styles['Titre2']))
    elements.append(Spacer(1, 0.3 * inch))
    
    # A. Méthodologie
    elements.append(Paragraph("A. Méthodologie d'analyse", styles['Titre3']))
    elements.append(Spacer(1, 0.2 * inch))
    elements.append(Paragraph(texts['methodology'], styles['Normal']))
    elements.append(Spacer(1, 0.3 * inch))
    
    # B. Glossaire
    elements.append(Paragraph("B. Glossaire des termes techniques", styles['Titre3']))
    elements.append(Spacer(1, 0.2 * inch))
    
    glossary_items = [
        ["TERME", "DÉFINITION"],
        ["P/E (PER)", "Ratio cours/bénéfice - Prix de l'action divisé par le bénéfice par action"],
        ["P/B", "Ratio cours/valeur comptable - Prix de l'action divisé par la valeur comptable par action"],
        ["RSI", "Relative Strength Index - Indicateur de momentum qui mesure la vitesse et l'ampleur des mouvements de prix"],
        ["MACD", "Moving Average Convergence Divergence - Indicateur de tendance suivant la relation entre deux moyennes mobiles"],
        ["Bollinger Bands", "Bandes de volatilité placées à +2 et -2 écarts-types d'une moyenne mobile"]
    ]
    
    glossary_table = Table(glossary_items, colWidths=[2*inch, 4*inch])
    glossary_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#2c3e50')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 9),
        ('GRID', (0, 0), (-1, -1), 1, colors.black),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
    ]))
    elements.append(glossary_table)
    
    return elements

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

def generate_pdf_report(data, metrics, charts, output_file):
    """Génère le rapport PDF complet avec toutes les sections"""
    # Profil de l'entreprise
    profile = generate_company_profile(data)

    # Création du PDF
    doc = SimpleDocTemplate(
        output_file,
        pagesize=A4,
        rightMargin=36,  # Réduire les marges pour plus d'espace
        leftMargin=36,
        topMargin=36,
        bottomMargin=36,
        title=f"Rapport d'analyse approfondie - {data['ticker']}"
    )

    # Construction du rapport
    elements = []

    # Page de garde
    elements.extend(create_cover_page(profile))

    # Table des matières
    elements.extend(create_table_of_contents())

    # Analyse technique
    elements.extend(create_technical_analysis(data, metrics, charts))

    # Analyse fondamentale
    elements.extend(create_fundamental_analysis(data, metrics, charts))

    # Analyse des risques
    elements.extend(create_risk_analysis(data, metrics))

    # Stratégie d'investissement
    elements.extend(create_investment_strategy())

    # Annexes techniques
    elements.extend(create_appendices(data, metrics))

    # Génération du PDF
    doc.build(elements, onFirstPage=create_footer, onLaterPages=create_footer)
