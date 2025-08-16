#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
Base class pour tous les générateurs de rapports FinAnalytics
"""

import os
import sys
import logging
import yfinance as yf
from datetime import datetime
from pathlib import Path

# ReportLab imports
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY, TA_LEFT
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak, Image, Table, TableStyle
from reportlab.lib.units import inch

class BaseReportGenerator:
    """Classe de base pour tous les générateurs de rapports"""
    
    def __init__(self, symbol, output_path):
        self.symbol = symbol.upper()
        self.output_path = output_path
        self.data = {}
        
        # Configuration des répertoires
        self.charts_dir = Path("temp_charts") / f"{self.symbol}_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        self.charts_dir.mkdir(parents=True, exist_ok=True)
        
        # Configuration PDF
        self.doc = SimpleDocTemplate(
            output_path,
            pagesize=A4,
            rightMargin=72,
            leftMargin=72,
            topMargin=72,
            bottomMargin=18
        )
        
        self.story = []
        self.styles = getSampleStyleSheet()
        self._setup_custom_styles()
        
        logging.basicConfig(level=logging.INFO)
        self.logger = logging.getLogger(__name__)
    
    def _setup_custom_styles(self):
        """Configure les styles personnalisés"""
        # Style titre principal
        self.title_style = ParagraphStyle(
            'CustomTitle',
            parent=self.styles['Title'],
            fontSize=24,
            textColor=colors.HexColor('#1d4ed8'),
            alignment=TA_CENTER,
            spaceAfter=30,
            fontName='Helvetica-Bold'
        )
        
        # Style section
        self.section_style = ParagraphStyle(
            'SectionTitle',
            parent=self.styles['Heading1'],
            fontSize=18,
            textColor=colors.HexColor('#1d4ed8'),
            spaceAfter=20,
            spaceBefore=30,
            fontName='Helvetica-Bold',
            borderWidth=2,
            borderColor=colors.HexColor('#1d4ed8'),
            borderPadding=10,
            backColor=colors.HexColor('#f0f9ff')
        )
        
        # Style sous-section
        self.subsection_style = ParagraphStyle(
            'SubsectionTitle',
            parent=self.styles['Heading2'],
            fontSize=14,
            textColor=colors.HexColor('#374151'),
            spaceAfter=15,
            spaceBefore=20,
            fontName='Helvetica-Bold'
        )
        
        # Style texte détaillé
        self.text_style = ParagraphStyle(
            'DetailedText',
            parent=self.styles['Normal'],
            fontSize=11,
            alignment=TA_JUSTIFY,
            spaceAfter=12,
            lineHeight=1.3
        )
    
    def fetch_data(self):
        """Récupère les données de base pour l'action"""
        try:
            self.logger.info(f"📊 Récupération des données pour {self.symbol}")
            
            ticker = yf.Ticker(self.symbol)
            
            # Données de base
            self.data['info'] = ticker.info
            self.data['history'] = ticker.history(period="2y", interval="1d")
            
            # Données financières
            try:
                self.data['financials'] = ticker.financials
                self.data['balance_sheet'] = ticker.balance_sheet
                self.data['cashflow'] = ticker.cashflow
            except:
                self.logger.warning("Données financières indisponibles")
                self.data['financials'] = None
                self.data['balance_sheet'] = None
                self.data['cashflow'] = None
            
            return True
            
        except Exception as e:
            self.logger.error(f"❌ Erreur récupération données: {e}")
            return False
    
    def add_cover_page(self):
        """Ajoute une page de garde professionnelle"""
        info = self.data.get('info', {})
        company_name = info.get('longName', self.symbol)
        
        # En-tête FinAnalytics
        header_style = ParagraphStyle(
            'HeaderStyle',
            parent=self.styles['Normal'],
            fontSize=24,
            textColor=colors.HexColor('#1d4ed8'),
            alignment=TA_CENTER,
            spaceAfter=20,
            fontName='Helvetica-Bold'
        )
        
        self.story.append(Paragraph("FinAnalytics", header_style))
        
        subtitle_style = ParagraphStyle(
            'SubtitleStyle',
            parent=self.styles['Normal'],
            fontSize=12,
            textColor=colors.HexColor('#6b7280'),
            alignment=TA_CENTER,
            spaceAfter=60,
            fontStyle='italic'
        )
        
        self.story.append(Paragraph("Intelligence Financière & Analyse Quantitative", subtitle_style))
        
        # Titre principal
        title = f"RAPPORT D'ANALYSE FINANCIÈRE"
        self.story.append(Paragraph(title, self.title_style))
        self.story.append(Spacer(1, 20))
        
        # Nom de l'entreprise
        company_style = ParagraphStyle(
            'CompanyStyle',
            parent=self.styles['Normal'],
            fontSize=28,
            textColor=colors.HexColor('#111827'),
            alignment=TA_CENTER,
            spaceAfter=10,
            fontName='Helvetica-Bold'
        )
        
        if company_name != self.symbol:
            self.story.append(Paragraph(company_name, company_style))
        
        # Symbole boursier
        symbol_style = ParagraphStyle(
            'SymbolStyle',
            parent=self.styles['Normal'],
            fontSize=18,
            textColor=colors.HexColor('#374151'),
            alignment=TA_CENTER,
            spaceAfter=50,
            fontName='Helvetica'
        )
        
        self.story.append(Paragraph(f"({self.symbol})", symbol_style))
        
        # Type d'analyse (à surcharger dans les classes filles)
        self.add_analysis_type_badge()
        
        # Informations clés
        self.add_key_info_table()
        
        # Footer et disclaimer
        self.add_cover_footer()
        
        self.story.append(PageBreak())
    
    def add_analysis_type_badge(self):
        """À surcharger dans les classes filles"""
        pass
    
    def add_key_info_table(self):
        """Ajoute le tableau d'informations clés"""
        info = self.data.get('info', {})
        current_price = info.get('currentPrice', 'N/A')
        market_cap = info.get('marketCap', 'N/A')
        if isinstance(market_cap, (int, float)):
            market_cap = f"${market_cap:,.0f}"
        
        data = [
            ['Prix actuel', f"${current_price}"],
            ['Capitalisation boursière', market_cap],
            ['Secteur d\'activité', info.get('sector', 'N/A')],
            ['Industrie', info.get('industry', 'N/A')],
            ['Pays', info.get('country', 'N/A')],
            ['Monnaie', info.get('currency', 'USD')]
        ]
        
        table = Table(data, colWidths=[200, 200])
        table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#f8fafc')),
            ('TEXTCOLOR', (0, 0), (-1, -1), colors.black),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
            ('FONTNAME', (1, 0), (1, -1), 'Helvetica'),
            ('FONTSIZE', (0, 0), (-1, -1), 11),
            ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#e5e7eb')),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('ROWBACKGROUNDS', (0, 0), (-1, -1), [colors.white, colors.HexColor('#f9fafb')])
        ]))
        
        self.story.append(table)
        self.story.append(Spacer(1, 60))
    
    def add_cover_footer(self):
        """Ajoute le footer de la page de garde"""
        footer_style = ParagraphStyle(
            'FooterStyle',
            parent=self.styles['Normal'],
            fontSize=10,
            textColor=colors.HexColor('#6b7280'),
            alignment=TA_CENTER,
            spaceAfter=20
        )
        
        date_str = datetime.now().strftime('%d/%m/%Y à %H:%M')
        self.story.append(Paragraph(f"Rapport généré le {date_str}", footer_style))
        self.story.append(Paragraph("© FinAnalytics - Intelligence Financière", footer_style))
        
        # Disclaimer
        disclaimer_style = ParagraphStyle(
            'DisclaimerStyle',
            parent=self.styles['Normal'],
            fontSize=8,
            textColor=colors.HexColor('#9ca3af'),
            alignment=TA_JUSTIFY,
            spaceAfter=20,
            leftIndent=40,
            rightIndent=40
        )
        
        disclaimer_text = """
        AVERTISSEMENT : Ce rapport est fourni à des fins d'information uniquement et ne constitue pas un conseil en investissement. 
        Les performances passées ne garantissent pas les résultats futurs. Tout investissement comporte des risques de perte. 
        Consultez un conseiller financier qualifié avant de prendre des décisions d'investissement.
        """
        
        self.story.append(Paragraph(disclaimer_text, disclaimer_style))
    
    def add_section_title(self, title):
        """Ajoute un titre de section"""
        self.story.append(Paragraph(title, self.section_style))
    
    def add_subsection_title(self, title):
        """Ajoute un sous-titre de section"""
        self.story.append(Paragraph(title, self.subsection_style))
    
    def add_text(self, content):
        """Ajoute du texte avec style professionnel"""
        paragraphs = content.split('\n\n')
        for paragraph in paragraphs:
            if paragraph.strip():
                self.story.append(Paragraph(paragraph.strip(), self.text_style))
    
    def add_chart(self, chart_path, width=7*inch, height=4*inch):
        """Ajoute un graphique au rapport"""
        if os.path.exists(chart_path):
            self.story.append(Image(chart_path, width=width, height=height))
            self.story.append(Spacer(1, 15))
    
    def add_final_page(self):
        """Ajoute une page finale professionnelle"""
        self.story.append(PageBreak())
        
        final_title_style = ParagraphStyle(
            'FinalTitle',
            parent=self.styles['Title'],
            fontSize=24,
            textColor=colors.HexColor('#1d4ed8'),
            alignment=TA_CENTER,
            spaceAfter=40,
            fontName='Helvetica-Bold'
        )
        
        self.story.append(Paragraph("Conclusion & Contact", final_title_style))
        
        conclusion_text = """
        Ce rapport d'analyse financière a été généré par FinAnalytics, notre plateforme d'intelligence 
        financière avancée. L'analyse présentée est basée sur les données les plus récentes disponibles 
        et utilise des modèles quantitatifs sophistiqués pour fournir des insights approfondis.
        """
        
        self.add_text(conclusion_text)
        self.story.append(Spacer(1, 40))
        
        # Contact
        contact_style = ParagraphStyle(
            'ContactStyle',
            parent=self.styles['Normal'],
            fontSize=11,
            spaceAfter=30
        )
        
        contact_info = """
        <b>FinAnalytics</b><br/>
        Email: contact@finanalytics.com<br/>
        Web: www.finanalytics.com<br/>
        Support: support@finanalytics.com<br/>
        """
        
        self.story.append(Paragraph(contact_info, contact_style))
        
        # Disclaimer final
        disclaimer_final_style = ParagraphStyle(
            'DisclaimerFinal',
            parent=self.styles['Normal'],
            fontSize=9,
            textColor=colors.HexColor('#6b7280'),
            alignment=TA_JUSTIFY,
            leftIndent=20,
            rightIndent=20,
            borderWidth=1,
            borderColor=colors.HexColor('#e5e7eb'),
            borderPadding=15,
            backColor=colors.HexColor('#f9fafb')
        )
        
        disclaimer_text = """
        <b>Avertissement final :</b> Ce rapport est fourni uniquement à des fins d'information et 
        d'éducation. Il ne constitue pas un conseil en investissement. Les investisseurs doivent 
        consulter un conseiller financier qualifié avant de prendre toute décision d'investissement.
        """
        
        self.story.append(Paragraph(disclaimer_text, disclaimer_final_style))
    
    def generate_report(self):
        """Méthode à surcharger dans les classes filles"""
        raise NotImplementedError("Cette méthode doit être implémentée dans les classes filles")
    
    def build_pdf(self):
        """Construit le PDF final"""
        self.doc.build(self.story)
        self.cleanup_charts()
    
    def cleanup_charts(self):
        """Nettoie les graphiques temporaires"""
        try:
            import shutil
            if os.path.exists(self.charts_dir):
                shutil.rmtree(self.charts_dir)
        except Exception as e:
            self.logger.warning(f"Impossible de nettoyer {self.charts_dir}: {e}")