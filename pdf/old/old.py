#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
Générateur de Rapport d'Analyse Financière Complète
Auteur : [Votre Nom]
Date : [Date]
"""

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from datetime import datetime
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter, A4
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, Image
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
import os

# Enregistrer les polices (optionnel - pour les polices personnalisées)
try:
    pdfmetrics.registerFont(TTFont('Helvetica', 'Helvetica.ttf'))
    pdfmetrics.registerFont(TTFont('Helvetica-Bold', 'Helveticabd.ttf'))
except:
    print("Polices Helvetica non trouvées, utilisation des polices par défaut")

# Création des styles
styles = getSampleStyleSheet()
styles.add(ParagraphStyle(name='Titre1', fontSize=16, leading=20, alignment=TA_CENTER, spaceAfter=12, fontName='Helvetica-Bold'))
styles.add(ParagraphStyle(name='Titre2', fontSize=14, leading=18, alignment=TA_CENTER, spaceAfter=10, fontName='Helvetica-Bold'))
styles.add(ParagraphStyle(name='Titre3', fontSize=12, leading=16, alignment=TA_CENTER, spaceAfter=8, fontName='Helvetica-Bold'))
styles.add(ParagraphStyle(name='NormalCenter', fontSize=10, leading=12, alignment=TA_CENTER, fontName='Helvetica'))
styles.add(ParagraphStyle(name='Footer', fontSize=8, leading=10, alignment=TA_CENTER, fontName='Helvetica'))
styles.add(ParagraphStyle(name='Header', fontSize=8, leading=10, alignment=TA_CENTER, fontName='Helvetica'))

def generate_financial_data():
    """Génère des données financières aléatoires pour la démonstration"""
    np.random.seed(42)

    # Données de revenus
    months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc']
    revenus = np.random.normal(100000, 20000, 12).astype(int)
    depenses = np.random.normal(80000, 15000, 12).astype(int)
    profits = revenus - depenses

    # Données de bilan
    actifs = ['Trésorerie', 'Comptes clients', 'Stocks', 'Immobilisations']
    passifs = ['Comptes fournisseurs', 'Emprunts court terme', 'Emprunts long terme']
    valeurs_actifs = np.random.normal(500000, 100000, 4).astype(int)
    valeurs_passifs = np.random.normal(300000, 80000, 3).astype(int)

    # Ratios financiers
    ratios = {
        'Liquidité générale': np.random.uniform(1.2, 2.5),
        'Marge brute': np.random.uniform(0.25, 0.45),
        'ROE': np.random.uniform(0.1, 0.25),
        'Dette/Equity': np.random.uniform(0.5, 1.5)
    }

    return {
        'months': months,
        'revenus': revenus,
        'depenses': depenses,
        'profits': profits,
        'actifs': actifs,
        'passifs': passifs,
        'valeurs_actifs': valeurs_actifs,
        'valeurs_passifs': valeurs_passifs,
        'ratios': ratios
    }

def create_charts(data, output_dir='temp_charts'):
    """Crée des graphiques pour le rapport"""
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    # Graphique des revenus et dépenses
    plt.figure(figsize=(8, 5))
    plt.bar(data['months'], data['revenus'], label='Revenus', color='green', alpha=0.6)
    plt.bar(data['months'], data['depenses'], label='Dépenses', color='red', alpha=0.6)
    plt.plot(data['months'], data['profits'], label='Profits', marker='o', color='blue')
    plt.title('Revenus, Dépenses et Profits Mensuels')
    plt.xlabel('Mois')
    plt.ylabel('Montant (€)')
    plt.legend()
    plt.grid(True, linestyle='--', alpha=0.7)
    revenus_chart = os.path.join(output_dir, 'revenus_depenses.png')
    plt.savefig(revenus_chart, dpi=300, bbox_inches='tight')
    plt.close()

    # Graphique du bilan
    plt.figure(figsize=(8, 5))
    plt.subplot(1, 2, 1)
    plt.pie(data['valeurs_actifs'], labels=data['actifs'], autopct='%1.1f%%')
    plt.title('Actifs')

    plt.subplot(1, 2, 2)
    plt.pie(data['valeurs_passifs'], labels=data['passifs'], autopct='%1.1f%%')
    plt.title('Passifs')

    bilan_chart = os.path.join(output_dir, 'bilan.png')
    plt.savefig(bilan_chart, dpi=300, bbox_inches='tight')
    plt.close()

    # Graphique des ratios
    plt.figure(figsize=(8, 5))
    plt.bar(data['ratios'].keys(), data['ratios'].values(), color=['purple', 'orange', 'cyan', 'brown'])
    plt.title('Ratios Financiers Clés')
    plt.ylabel('Valeur')
    plt.grid(True, linestyle='--', alpha=0.7)
    ratios_chart = os.path.join(output_dir, 'ratios.png')
    plt.savefig(ratios_chart, dpi=300, bbox_inches='tight')
    plt.close()

    return {
        'revenus_chart': revenus_chart,
        'bilan_chart': bilan_chart,
        'ratios_chart': ratios_chart
    }

def create_cover_page():
    """Crée la page de garde du rapport"""
    elements = []

    # Ajouter un espace au début
    elements.append(Spacer(1, 2 * inch))

    # Titre principal
    title = Paragraph("RAPPORT D'ANALYSE FINANCIÈRE", styles['Titre1'])
    elements.append(title)

    elements.append(Spacer(1, 1.5 * inch))

    # Sous-titre
    subtitle = Paragraph("Analyse Complète de la Performance Financière", styles['Titre2'])
    elements.append(subtitle)

    elements.append(Spacer(1, 2 * inch))

    # Informations sur l'entreprise
    company_info = [
        ["Entreprise:", "NOM DE L'ENTREPRISE"],
        ["Période couverte:", f"1er Janvier {datetime.now().year} - 31 Décembre {datetime.now().year}"],
        ["Date du rapport:", datetime.now().strftime("%d %B %Y")],
        ["Préparé par:", "Service Financier"]
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

    # Note de confidentialité
    confidential = Paragraph("CONFIDENTIEL - À l'usage exclusif du destinataire", styles['NormalCenter'])
    elements.append(confidential)

    # Saut de page pour la suite
    elements.append(PageBreak())

    return elements

def create_table_of_contents():
    """Crée la table des matières"""
    elements = []

    title = Paragraph("TABLE DES MATIÈRES", styles['Titre1'])
    elements.append(title)

    elements.append(Spacer(1, 0.5 * inch))

    # Liste des sections
    toc_items = [
        ("1. PRÉAMBULE", "2"),
        ("2. RÉSULTATS FINANCIERS", "3"),
        ("2.1 Revenus et Dépenses", "3"),
        ("2.2 Analyse des Profits", "4"),
        ("3. ANALYSE DU BILAN", "5"),
        ("3.1 Actifs", "5"),
        ("3.2 Passifs", "6"),
        ("4. RATIOS FINANCIERS", "7"),
        ("5. RECOMMANDATIONS", "8"),
        ("6. ANNEXES", "9")
    ]

    for item, page in toc_items:
        # Créer une ligne avec le texte à gauche et la page à droite
        toc_line = Table([[Paragraph(item, styles['Normal']), Paragraph(page, styles['Normal'])]],
                         colWidths=[5*inch, 1*inch])
        toc_line.setStyle(TableStyle([
            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
            ('ALIGN', (1, 0), (1, 0), 'RIGHT'),
            ('LINEBELOW', (0, 0), (-1, -1), 0.5, colors.grey),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
        ]))
        elements.append(toc_line)
        elements.append(Spacer(1, 0.1 * inch))

    # Saut de page pour la suite
    elements.append(PageBreak())

    return elements

def create_preambule():
    """Crée la section préambule du rapport"""
    elements = []

    title = Paragraph("1. PRÉAMBULE", styles['Titre2'])
    elements.append(title)

    elements.append(Spacer(1, 0.3 * inch))

    # Texte d'introduction
    intro_text = """
    Ce rapport présente une analyse approfondie de la performance financière de [NOM DE L'ENTREPRISE] pour l'année [ANNÉE].
    L'objectif de cette analyse est de fournir une compréhension claire de la situation financière actuelle,
    d'identifier les tendances clés et de formuler des recommandations pour améliorer la performance future.
    """
    elements.append(Paragraph(intro_text, styles['Normal']))

    elements.append(Spacer(1, 0.2 * inch))

    # Portée de l'analyse
    scope_title = Paragraph("Portée de l'analyse:", styles['Titre3'])
    elements.append(scope_title)

    scope_text = """
    Cette analyse couvre les aspects suivants de la performance financière:
    - Analyse des revenus et dépenses mensuelles
    - Évaluation de la structure du bilan (actifs et passifs)
    - Calcul des ratios financiers clés
    - Analyse comparative avec les objectifs budgétaires
    - Recommandations stratégiques
    """
    elements.append(Paragraph(scope_text, styles['Normal']))

    elements.append(Spacer(1, 0.2 * inch))

    # Méthodologie
    method_title = Paragraph("Méthodologie:", styles['Titre3'])
    elements.append(method_title)

    method_text = """
    Les données utilisées dans ce rapport proviennent des systèmes comptables officiels de l'entreprise.
    Les analyses ont été réalisées selon les principes comptables généralement reconnus (PCGR).
    Les ratios financiers sont calculés selon les formules standards du secteur.
    """
    elements.append(Paragraph(method_text, styles['Normal']))

    # Saut de page pour la suite
    elements.append(PageBreak())

    return elements

def create_financial_results(data, charts):
    """Crée la section des résultats financiers"""
    elements = []

    title = Paragraph("2. RÉSULTATS FINANCIERS", styles['Titre2'])
    elements.append(title)

    elements.append(Spacer(1, 0.3 * inch))

    # Sous-section Revenus et Dépenses
    subtitle1 = Paragraph("2.1 Revenus et Dépenses", styles['Titre3'])
    elements.append(subtitle1)

    elements.append(Spacer(1, 0.2 * inch))

    # Texte d'analyse
    analysis_text = """
    La figure ci-dessous présente l'évolution des revenus, dépenses et profits sur la période analysée.
    On observe une [tendance à la hausse/baisse/stabilité] des revenus avec une moyenne de [MOYENNE]€ par mois.
    Les dépenses montrent une [tendance] avec des variations principalement dues à [raisons].
    """
    elements.append(Paragraph(analysis_text, styles['Normal']))

    elements.append(Spacer(1, 0.2 * inch))

    # Ajouter le graphique des revenus et dépenses
    img = Image(charts['revenus_chart'], width=6*inch, height=4*inch)
    elements.append(img)

    elements.append(Spacer(1, 0.2 * inch))

    # Tableau des données
    table_data = [['Mois', 'Revenus (€)', 'Dépenses (€)', 'Profits (€)']]
    for month, rev, dep, prof in zip(data['months'], data['revenus'], data['depenses'], data['profits']):
        table_data.append([month, f"{rev:,}", f"{dep:,}", f"{prof:,}"])

    # Ajouter les totaux
    table_data.append(['TOTAL', f"{sum(data['revenus']):,}", f"{sum(data['depenses']):,}", f"{sum(data['profits']):,}"])

    financial_table = Table(table_data, colWidths=[1*inch, 1.5*inch, 1.5*inch, 1.5*inch])
    financial_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 10),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('BACKGROUND', (0, -1), (-1, -1), colors.lightgrey),
        ('FONTNAME', (0, -1), (-1, -1), 'Helvetica-Bold'),
        ('GRID', (0, 0), (-1, -1), 1, colors.black),
    ]))
    elements.append(financial_table)

    elements.append(Spacer(1, 0.3 * inch))

    # Sous-section Analyse des Profits
    subtitle2 = Paragraph("2.2 Analyse des Profits", styles['Titre3'])
    elements.append(subtitle2)

    elements.append(Spacer(1, 0.2 * inch))

    # Texte d'analyse des profits
    profit_text = f"""
    Les profits mensuels montrent une [tendance] avec une moyenne de {np.mean(data['profits']):,.0f}€.
    Le mois le plus performant était {data['months'][np.argmax(data['profits'])]} avec un profit de {max(data['profits']):,.0f}€,
    tandis que le mois le moins performant était {data['months'][np.argmin(data['profits'])]} avec un profit de {min(data['profits']):,.0f}€.
    """
    elements.append(Paragraph(profit_text, styles['Normal']))

    # Saut de page pour la suite
    elements.append(PageBreak())

    return elements

def create_balance_sheet_analysis(data, charts):
    """Crée la section d'analyse du bilan"""
    elements = []

    title = Paragraph("3. ANALYSE DU BILAN", styles['Titre2'])
    elements.append(title)

    elements.append(Spacer(1, 0.3 * inch))

    # Sous-section Actifs
    subtitle1 = Paragraph("3.1 Actifs", styles['Titre3'])
    elements.append(subtitle1)

    elements.append(Spacer(1, 0.2 * inch))

    # Texte d'analyse des actifs
    assets_text = f"""
    La structure des actifs montre que [description de la répartition]. Les immobilisations représentent
    {(data['valeurs_actifs'][3]/sum(data['valeurs_actifs'])*100):.1f}% du total des actifs, ce qui indique [interprétation].
    """
    elements.append(Paragraph(assets_text, styles['Normal']))

    elements.append(Spacer(1, 0.2 * inch))

    # Tableau des actifs
    assets_data = [['Actif', 'Valeur (€)', '% du total']]
    for asset, value in zip(data['actifs'], data['valeurs_actifs']):
        assets_data.append([asset, f"{value:,}", f"{(value/sum(data['valeurs_actifs']))*100:.1f}%"])

    assets_data.append(['TOTAL ACTIFS', f"{sum(data['valeurs_actifs']):,}", "100%"])

    assets_table = Table(assets_data, colWidths=[2.5*inch, 1.5*inch, 1*inch])
    assets_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 10),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('BACKGROUND', (0, -1), (-1, -1), colors.lightgrey),
        ('FONTNAME', (0, -1), (-1, -1), 'Helvetica-Bold'),
        ('GRID', (0, 0), (-1, -1), 1, colors.black),
    ]))
    elements.append(assets_table)

    elements.append(Spacer(1, 0.2 * inch))

    # Sous-section Passifs
    subtitle2 = Paragraph("3.2 Passifs", styles['Titre3'])
    elements.append(subtitle2)

    elements.append(Spacer(1, 0.2 * inch))

    # Texte d'analyse des passifs
    liabilities_text = f"""
    La structure des passifs montre que [description de la répartition]. La dette à long terme représente
    {(data['valeurs_passifs'][2]/sum(data['valeurs_passifs'])*100):.1f}% du total des passifs, ce qui indique [interprétation].
    """
    elements.append(Paragraph(liabilities_text, styles['Normal']))

    elements.append(Spacer(1, 0.2 * inch))

    # Tableau des passifs
    liabilities_data = [['Passif', 'Valeur (€)', '% du total']]
    for liability, value in zip(data['passifs'], data['valeurs_passifs']):
        liabilities_data.append([liability, f"{value:,}", f"{(value/sum(data['valeurs_passifs']))*100:.1f}%"])

    liabilities_data.append(['TOTAL PASSIFS', f"{sum(data['valeurs_passifs']):,}", "100%"])

    liabilities_table = Table(liabilities_data, colWidths=[2.5*inch, 1.5*inch, 1*inch])
    liabilities_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 10),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('BACKGROUND', (0, -1), (-1, -1), colors.lightgrey),
        ('FONTNAME', (0, -1), (-1, -1), 'Helvetica-Bold'),
        ('GRID', (0, 0), (-1, -1), 1, colors.black),
    ]))
    elements.append(liabilities_table)

    elements.append(Spacer(1, 0.2 * inch))

    # Ajouter le graphique du bilan
    img = Image(charts['bilan_chart'], width=6*inch, height=3*inch)
    elements.append(img)

    # Saut de page pour la suite
    elements.append(PageBreak())

    return elements

def create_financial_ratios(data, charts):
    """Crée la section des ratios financiers"""
    elements = []

    title = Paragraph("4. RATIOS FINANCIERS", styles['Titre2'])
    elements.append(title)

    elements.append(Spacer(1, 0.3 * inch))

    # Texte d'introduction
    intro_text = """
    Les ratios financiers fournissent des indicateurs clés de la santé financière de l'entreprise.
    Les ratios présentés ci-dessous permettent de comparer la performance avec les standards du secteur.
    """
    elements.append(Paragraph(intro_text, styles['Normal']))

    elements.append(Spacer(1, 0.2 * inch))

    # Ajouter le graphique des ratios
    img = Image(charts['ratios_chart'], width=5*inch, height=3*inch)
    elements.append(img)

    elements.append(Spacer(1, 0.2 * inch))

    # Tableau des ratios avec interprétation
    ratios_data = [
        ['Ratio', 'Valeur', 'Interprétation'],
        ['Liquidité générale', f"{data['ratios']['Liquidité générale']:.2f}", "Mesure la capacité à payer les dettes court terme. >1.5 est idéal."],
        ['Marge brute', f"{data['ratios']['Marge brute']:.2%}", "Indique la profitabilité des ventes. >30% est bon."],
        ['ROE (Return on Equity)', f"{data['ratios']['ROE']:.2%}", "Rentabilité des capitaux propres. >15% est excellent."],
        ['Dette/Equity', f"{data['ratios']['Dette/Equity']:.2f}", "Niveau d'endettement. <1.0 est généralement prudent."]
    ]

    ratios_table = Table(ratios_data, colWidths=[1.5*inch, 1*inch, 3*inch])
    ratios_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 10),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('GRID', (0, 0), (-1, -1), 1, colors.black),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('ALIGN', (2, 1), (2, -1), 'LEFT'),
    ]))
    elements.append(ratios_table)

    # Saut de page pour la suite
    elements.append(PageBreak())

    return elements

def create_recommendations():
    """Crée la section des recommandations"""
    elements = []

    title = Paragraph("5. RECOMMANDATIONS", styles['Titre2'])
    elements.append(title)

    elements.append(Spacer(1, 0.3 * inch))

    # Liste des recommandations
    recommendations = [
        "Optimisation des coûts: Identifier et réduire les dépenses non essentielles sans compromettre la qualité.",
        "Gestion de trésorerie: Améliorer la gestion du fonds de roulement pour maintenir une liquidité adéquate.",
        "Investissements stratégiques: Allouer des ressources aux domaines générant le meilleur retour sur investissement.",
        "Contrôle des dettes: Maintenir un ratio d'endettement prudent tout en profitant des opportunités de croissance.",
        "Diversification des revenus: Explorer de nouvelles sources de revenus pour réduire la dépendance aux activités principales.",
        "Amélioration des marges: Renégocier avec les fournisseurs et optimiser les prix de vente.",
        "Tableaux de bord: Implémenter un système de suivi en temps réel des indicateurs clés de performance."
    ]

    for i, rec in enumerate(recommendations, 1):
        elements.append(Paragraph(f"{i}. {rec}", styles['Normal']))
        elements.append(Spacer(1, 0.1 * inch))

    # Saut de page pour la suite
    elements.append(PageBreak())

    return elements

def create_appendices():
    """Crée la section des annexes"""
    elements = []

    title = Paragraph("6. ANNEXES", styles['Titre2'])
    elements.append(title)

    elements.append(Spacer(1, 0.3 * inch))

    # Méthodologie détaillée
    subtitle1 = Paragraph("Méthodologie Détaillée", styles['Titre3'])
    elements.append(subtitle1)

    elements.append(Spacer(1, 0.2 * inch))

    method_text = """
    Les calculs et analyses présentés dans ce rapport ont été réalisés selon les méthodologies suivantes:

    <b>Revenus et Dépenses:</b> Basés sur les états financiers mensuels validés par le service comptable.

    <b>Ratios Financiers:</b>
    - Liquidité générale = Actifs courants / Passifs courants
    - Marge brute = (Revenus - Coût des ventes) / Revenus
    - ROE = Résultat net / Capitaux propres moyens
    - Dette/Equity = Dette totale / Capitaux propres

    <b>Analyse comparative:</b> Les résultats sont comparés aux benchmarks du secteur lorsque disponibles.
    """
    elements.append(Paragraph(method_text, styles['Normal']))

    elements.append(Spacer(1, 0.3 * inch))

    # Glossaire
    subtitle2 = Paragraph("Glossaire", styles['Titre3'])
    elements.append(subtitle2)

    elements.append(Spacer(1, 0.2 * inch))

    glossary_items = [
        ("Actifs", "Ressources économiques détenues par l'entreprise"),
        ("Passifs", "Obligations financières de l'entreprise"),
        ("ROE", "Return on Equity - Rentabilité des capitaux propres"),
        ("Liquidité générale", "Capacité à honorer les dettes à court terme"),
        ("Marge brute", "Pourcentage de profit après coût des ventes")
    ]

    for term, definition in glossary_items:
        elements.append(Paragraph(f"<b>{term}:</b> {definition}", styles['Normal']))
        elements.append(Spacer(1, 0.1 * inch))

    return elements

def create_footer(canvas, doc):
    """Crée le pied de page pour chaque page"""
    canvas.saveState()

    # Texte du pied de page
    footer_text = f"Rapport d'Analyse Financière - {datetime.now().strftime('%d/%m/%Y')} - Page {doc.page}"

    # Positionner le texte en bas au centre
    canvas.setFont('Helvetica', 8)
    canvas.drawCentredString(A4[0]/2, 0.5*inch, footer_text)

    canvas.restoreState()

def generate_financial_report(output_file="rapport_analyse_financiere.pdf"):
    """Génère le rapport financier complet"""
    # Générer les données
    data = generate_financial_data()

    # Créer les graphiques
    charts = create_charts(data)

    # Initialiser le document PDF
    doc = SimpleDocTemplate(
        output_file,
        pagesize=A4,
        rightMargin=72,
        leftMargin=72,
        topMargin=72,
        bottomMargin=72,
        title="Rapport d'Analyse Financière"
    )

    # Construire le rapport section par section
    elements = []

    # Page de garde
    elements.extend(create_cover_page())

    # Table des matières
    elements.extend(create_table_of_contents())

    # Préambule
    elements.extend(create_preambule())

    # Résultats financiers
    elements.extend(create_financial_results(data, charts))

    # Analyse du bilan
    elements.extend(create_balance_sheet_analysis(data, charts))

    # Ratios financiers
    elements.extend(create_financial_ratios(data, charts))

    # Recommandations
    elements.extend(create_recommendations())

    # Annexes
    elements.extend(create_appendices())

    # Générer le PDF
    doc.build(elements, onFirstPage=create_footer, onLaterPages=create_footer)

    print(f"Rapport généré avec succès: {output_file}")

if __name__ == "__main__":
    generate_financial_report()
