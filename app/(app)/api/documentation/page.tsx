"use client"

import { useState } from "react"
import Link from "next/link"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Code, H1, H2, H3, P, List, MultilineCode, Table, Td, Th, Tr } from "@/components/ui/typography"

export default function ApiDocumentationPage() {
  const [activeSection, setActiveSection] = useState("introduction")

  const sections = [
    { id: "introduction", title: "Introduction" },
    { id: "quickstart", title: "Démarrage Rapide" },
    { id: "auth", title: "Authentification" },
    { id: "rate-limits", title: "Limites de Requêtes" },
    { id: "errors", title: "Gestion des Erreurs" },
    { id: "endpoints", title: "Endpoints" },
    { id: "report-types", title: "Types de Rapports" },
    { id: "examples", title: "Exemples Complets" },
    { id: "webhooks", title: "Notifications Webhook" },
    { id: "support", title: "Support Technique" },
  ]

  return (
    <div className="flex h-screen max-h-[calc(100vh-64px)]">
      {/* Navigation latérale */}
      <aside className="hidden lg:block w-64 border-r bg-muted/30 p-4 flex-shrink-0">
        <H2 className="text-lg font-semibold mb-4">Documentation API</H2>
        <div className="h-[calc(100vh-120px)] overflow-y-auto">
          <List className="space-y-2">
            {sections.map((s) => (
              <li key={s.id}>
                <Link 
                  href={`#${s.id}`} 
                  className={`block px-2 py-1 rounded hover:bg-muted transition ${
                    activeSection === s.id ? "bg-muted font-semibold" : ""
                  }`}
                  onClick={() => setActiveSection(s.id)}
                >
                  {s.title}
                </Link>
              </li>
            ))}
          </List>
        </div>
      </aside>

      {/* Contenu principal */}
      <ScrollArea className="flex-1 h-screen">
        <main className="p-8 mx-auto">
          <section id="introduction">
            <H1>API FinAnalytics v2</H1>
            <P className="text-lg">
              API moderne pour l'accès programmatique aux analyses financières, rapports personnalisés et données de marché.
            </P>
            
            <div className="bg-card border p-4 rounded-lg mt-6">
              <H3 className="mt-0">Fonctionnalités Clés</H3>
              <List>
                <li>Génération de rapports PDF/Excel en temps réel</li>
                <li>Accès à 50+ indicateurs financiers standardisés</li>
                <li>Analyse comparative sectorielle</li>
                <li>Synchronisation des données boursières en temps réel</li>
                <li>Système de crédits flexible</li>
              </List>
            </div>

            <P className="mt-6">URL de Base :</P>
            <MultilineCode><Code>https://api.finanalytics.com/v2</Code></MultilineCode>
          </section>

          <section id="quickstart" className="pt-12">
            <H2>Démarrage Rapide</H2>
            <P>Commencez en 3 étapes :</P>
            <ol>
              <li>Obtenez votre clé API dans le dashboard</li>
              <li>Configurez l'en-tête d'authentification</li>
              <li>Envoyez votre première requête</li>
            </ol>

            <MultilineCode><Code>{`curl -X GET "https://api.finanalytics.com/v2/credits" \\
  -H "Authorization: Bearer YOUR_API_KEY"`}</Code></MultilineCode>
          </section>

          <section id="auth" className="pt-12">
            <H2>Authentification</H2>
            <P>Toutes les requêtes nécessitent :</P>
            <MultilineCode><Code>Authorization: Bearer YOUR_API_KEY</Code></MultilineCode>
            
            <H3 className="mt-6">Permissions</H3>
            <Table className="w-full mt-2">
              <thead>
                <Tr>
                  <Th>Type de Compte</Th>
                  <Th>Accès</Th>
                </Tr>
              </thead>
              <tbody>
                <Tr>
                  <Td>Starter</Td>
                  <Td>Données basiques, 3 rapports/mois</Td>
                </Tr>
                <Tr>
                  <Td>Pro</Td>
                  <Td>Données avancées, rapports illimités</Td>
                </Tr>
                <Tr>
                  <Td>Enterprise</Td>
                  <Td>API complète + endpoints privés</Td>
                </Tr>
              </tbody>
            </Table>
          </section>

          <section id="rate-limits" className="pt-12">
            <H2>Limites de Requêtes</H2>
            <P><strong>Par défaut :</strong> 120 requêtes/minute, 5000/jour</P>
            <P>Les headers de réponse incluent :</P>
            <MultilineCode><Code>{`X-RateLimit-Limit: 120
X-RateLimit-Remaining: 117
X-RateLimit-Reset: 60`}</Code></MultilineCode>
          </section>

          <section id="errors" className="pt-12">
            <H2>Gestion des Erreurs</H2>
            <P>Format standard des erreurs :</P>
            <MultilineCode><Code>{`{
  "error": {
    "code": "invalid_parameter",
    "message": "Le paramètre 'symbol' est requis",
    "details": {
      "parameter": "symbol"
    }
  }
}`}</Code></MultilineCode>

            <H3 className="mt-6">Codes d'Erreur</H3>
            <Table className="w-full mt-2">
              <thead>
                <Tr>
                  <Th>Code HTTP</Th>
                  <Th>Signification</Th>
                </Tr>
              </thead>
              <tbody>
                <Tr>
                  <Td><Code>400</Code></Td>
                  <Td>Requête malformée</Td>
                </Tr>
                <Tr>
                  <Td><Code>402</Code></Td>
                  <Td>Crédits insuffisants</Td>
                </Tr>
                <Tr>
                  <Td><Code>429</Code></Td>
                  <Td>Limite de requêtes dépassée</Td>
                </Tr>
                <Tr>
                  <Td><Code>500</Code></Td>
                  <Td>Erreur serveur</Td>
                </Tr>
              </tbody>
            </Table>
          </section>

          <section id="endpoints" className="pt-12">
            <H2>Endpoints Principaux</H2>

            <H3 className="mt-6">GET /v2/credits</H3>
            <P>Vérifiez votre solde de crédits.</P>
            <MultilineCode><Code>GET /v2/credits</Code></MultilineCode>

            <H3 className="mt-6">POST /v2/reports</H3>
            <P>Créez un nouveau rapport financier.</P>
            <MultilineCode><Code>{`POST /v2/reports
Content-Type: application/json

{
  "symbol": "AAPL",
  "type": "full_analysis",
  "format": "pdf",
  "parameters": {
    "period": "5y",
    "currency": "EUR",
    "compare_to": ["MSFT", "GOOGL"]
  }
}`}</Code></MultilineCode>

            <H3 className="mt-6">GET /v2/reports/{'{report_id}'}</H3>
            <P>Téléchargez un rapport généré.</P>
            <MultilineCode><Code>GET /v2/reports/rep_abc123def456</Code></MultilineCode>

            <H3 className="mt-6">GET /v2/market/sectors</H3>
            <P>Analyse sectorielle.</P>
            <MultilineCode><Code>GET /v2/market/sectors?region=US</Code></MultilineCode>
          </section>

          <section id="report-types" className="pt-12">
            <H2>Types de Rapports Disponibles</H2>
            <Table className="w-full mt-4">
              <thead>
                <Tr>
                  <Th>Type</Th>
                  <Th>Coût</Th>
                  <Th>Description</Th>
                </Tr>
              </thead>
              <tbody>
                <Tr>
                  <Td><Code>quick_analysis</Code></Td>
                  <Td>15 crédits</Td>
                  <Td>Vue d'ensemble avec 5 indicateurs clés</Td>
                </Tr>
                <Tr>
                  <Td><Code>full_analysis</Code></Td>
                  <Td>40 crédits</Td>
                  <Td>Analyse complète avec 20+ métriques</Td>
                </Tr>
                <Tr>
                  <Td><Code>valuation</Code></Td>
                  <Td>30 crédits</Td>
                  <Td>Modèles DCF, comparables et multiples</Td>
                </Tr>
                <Tr>
                  <Td><Code>esg</Code></Td>
                  <Td>25 crédits</Td>
                  <Td>Score ESG détaillé par critère</Td>
                </Tr>
              </tbody>
            </Table>
          </section>

          <section id="examples" className="pt-12">
            <H2>Exemples Complets</H2>

            <H3 className="mt-6">Analyse d'Entreprise</H3>
            <MultilineCode><Code>{`curl -X POST "https://api.finanalytics.com/v2/reports" \\
  -H "Authorization: Bearer sk_live_abc123" \\
  -H "Content-Type: application/json" \\
  -d '{
    "symbol": "TSLA",
    "type": "full_analysis",
    "parameters": {
      "period": "3y",
      "include_forecast": true
    }
  }'`}</Code></MultilineCode>

            <H3 className="mt-6">Comparaison Sectorielle</H3>
            <MultilineCode><Code>{`curl -X GET "https://api.finanalytics.com/v2/market/sectors?industry=automotive&metrics=pe_ratio,ev_ebitda" \\
  -H "Authorization: Bearer sk_live_abc123"`}</Code></MultilineCode>
          </section>

          <section id="webhooks" className="pt-12">
            <H2>Notifications Webhook</H2>
            <P>Configurez des endpoints pour recevoir des événements en temps réel.</P>

            <H3 className="mt-6">Événements Disponibles</H3>
            <List>
              <li><Code>report.completed</Code> - Rapport prêt au téléchargement</li>
              <li><Code>credit.threshold</Code> - Seuil de crédits atteint</li>
              <li><Code>subscription.updated</Code> - Changement d'abonnement</li>
            </List>

            <H3 className="mt-6">Exemple de Payload</H3>
            <MultilineCode><Code>{`{
  "event": "report.completed",
  "data": {
    "report_id": "rep_abc123",
    "symbol": "AAPL",
    "type": "full_analysis",
    "expires_at": "2025-12-31T23:59:59Z"
  }
}`}</Code></MultilineCode>
          </section>

          <section id="support" className="pt-12 pb-20">
            <H2>Support Technique</H2>
            <P>Email : <a href="mailto:api-support@finanalytics.com" className="text-primary">api-support@finanalytics.com</a></P>
            <P className="mt-2">Réponse garantie sous 2 heures ouvrées pour les comptes Pro et Enterprise.</P>
          </section>
        </main>
      </ScrollArea>
    </div>
  )
}
