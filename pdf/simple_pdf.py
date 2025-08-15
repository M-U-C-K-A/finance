#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
Module simplifié de génération PDF
"""

from reportlab.lib.pagesizes import A4
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Image, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib import colors
from datetime import datetime
import os

def generate_simple_pdf_report(report_data, output_path):
    """Génère un rapport PDF simplifié"""
    
    doc = SimpleDocTemplate(output_path, pagesize=A4)
    styles = getSampleStyleSheet()
    story = []
    
    # Style personnalisé pour le titre
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=20,
        spaceAfter=30,
        textColor=colors.darkblue,
        alignment=1  # Center
    )
    
    # En-tête
    title = f"Rapport d'Analyse Financière - {report_data['symbol']}"
    story.append(Paragraph(title, title_style))
    story.append(Spacer(1, 20))
    
    # Informations générales
    company_name = report_data.get('company_name', report_data['symbol'])
    story.append(Paragraph(f"<b>Entreprise:</b> {company_name}", styles['Normal']))
    story.append(Paragraph(f"<b>Symbole:</b> {report_data['symbol']}", styles['Normal']))
    story.append(Paragraph(f"<b>Date du rapport:</b> {report_data['report_date']}", styles['Normal']))
    story.append(Paragraph(f"<b>Prix actuel:</b> ${report_data['current_price']:.2f}", styles['Normal']))
    
    if 'period_return' in report_data:
        color = 'green' if report_data['period_return'] >= 0 else 'red'
        story.append(Paragraph(f"<b>Performance période:</b> <font color='{color}'>{report_data['period_return']:.2f}%</font>", styles['Normal']))
    
    story.append(Spacer(1, 20))
    
    # Section graphiques
    story.append(Paragraph("Analyse Graphique", styles['Heading2']))
    story.append(Spacer(1, 12))
    
    # Ajouter les graphiques s'ils existent
    charts_path = report_data.get('charts_path')
    if charts_path and isinstance(charts_path, dict):
        for chart_name, chart_file in charts_path.items():
            if os.path.exists(chart_file):
                # Redimensionner l'image pour qu'elle tienne sur la page
                img = Image(chart_file, width=6*inch, height=4*inch)
                story.append(img)
                story.append(Spacer(1, 12))
    
    # Métriques de base (si disponibles)
    story.append(Paragraph("Métriques Clés", styles['Heading2']))
    story.append(Spacer(1, 12))
    
    # Tableau des métriques
    metrics_data = [
        ['Métrique', 'Valeur'],
        ['Prix Actuel', f"${report_data['current_price']:.2f}"],
        ['Symbole', report_data['symbol']],
        ['Date d\'Analyse', report_data['report_date']]
    ]
    
    if 'period_return' in report_data:
        metrics_data.append(['Performance Période', f"{report_data['period_return']:.2f}%"])
    
    metrics_table = Table(metrics_data)
    metrics_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 14),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
        ('GRID', (0, 0), (-1, -1), 1, colors.black)
    ]))
    
    story.append(metrics_table)
    story.append(Spacer(1, 20))
    
    # Pied de page
    footer_style = ParagraphStyle(
        'Footer',
        parent=styles['Normal'],
        fontSize=10,
        textColor=colors.grey,
        alignment=1
    )
    
    story.append(Spacer(1, 30))
    story.append(Paragraph("Rapport généré par FinAnalytics", footer_style))
    story.append(Paragraph(f"Généré le {datetime.now().strftime('%d/%m/%Y à %H:%M')}", footer_style))
    
    # Construire le PDF
    doc.build(story)
    
    return output_path

def generate_pdf_report(report_data, output_path):
    """Interface compatible avec l'ancien système"""
    return generate_simple_pdf_report(report_data, output_path)