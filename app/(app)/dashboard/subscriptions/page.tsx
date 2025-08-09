"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Check, MoveRight, PhoneCall } from "lucide-react"

export default function SubscriptionsPage() {
  const [tab, setTab] = useState<"abos" | "credits">("abos")

  return (
    <div 
      id="subscriptions" 
      className="h-full bg-background flex flex-col py-10 lg:py-20"
    >
      <div className="container mx-auto flex flex-col items-center gap-4 px-4 sm:px-6 lg:px-8 max-w-7xl">
        <Badge className="mb-4">Subscriptions</Badge>
        <div className="flex gap-2 flex-col max-w-xl text-center">
          <h2 className="text-3xl md:text-5xl tracking-tighter font-regular">
            Choose the best plan for your needs
          </h2>
          <p className="text-lg leading-relaxed tracking-tight text-muted-foreground">
            Easily switch between subscriptions and credit packs to fit your workflow.
          </p>
        </div>

        <div className="mt-10 mb-12 w-full max-w-md">
          <Tabs 
            value={tab} 
            onValueChange={(v: string) => setTab(v as any)} 
            className="w-full"
          >
            <TabsList className="grid grid-cols-2 w-full rounded-lg border bg-muted">
              <TabsTrigger value="abos" className="rounded-l-lg">
                Subscriptions
              </TabsTrigger>
              <TabsTrigger value="credits" className="rounded-r-lg">
                Credits
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="w-full flex-1">
          {tab === "abos" ? <SubscriptionPlans /> : <CreditPacks />}
        </div>
      </div>
    </div>
  )
}

function SubscriptionPlans() {
  const tiers = [
    {
      name: "Starter",
      price: "29",
      cadence: "month",
      features: [
        { title: "5 full reports/month", desc: "Generate up to 5 comprehensive financial reports" },
        { title: "Charts & PDF exports", desc: "Download in multiple formats" },
        { title: "Monthly data updates", desc: "Fresh financial data every month" },
      ],
      cta: "Get started",
      highlighted: false,
    },
    {
      name: "Professional",
      price: "99",
      cadence: "month",
      features: [
        { title: "30 reports/month", desc: "Enhanced capacity for professional use" },
        { title: "CSV & API access", desc: "Raw data for deeper analysis" },
        { title: "Weekly alerts", desc: "Key metric notifications" },
        { title: "Advanced benchmarks", desc: "In-depth comparison tools" },
      ],
      cta: "Try Professional",
      highlighted: true,
      badge: "Popular",
    },
    {
      name: "Enterprise",
      price: "299",
      cadence: "month",
      features: [
        { title: "150 reports/month", desc: "High-volume for organizations" },
        { title: "SSO, SLA, auditing", desc: "Enterprise-grade features" },
        { title: "Team workspaces", desc: "Collaboration with permissions" },
        { title: "Priority support", desc: "Dedicated assistance" },
      ],
      cta: "Contact sales",
      highlighted: false,
    },
  ]

  return (
    <div className="grid pt-6 text-left grid-cols-1 lg:grid-cols-3 w-full gap-8 max-w-full">
      {tiers.map((tier) => (
        <Card
          key={tier.name}
          className={`w-full max-w-full rounded-lg transition-shadow hover:shadow-lg border ${
            tier.highlighted ? "border-primary shadow-lg" : "border-muted"
          }`}
        >
          <CardHeader>
            <CardTitle>
              <span className="flex flex-row gap-4 items-center font-normal">
                {tier.name}
                {tier.badge && (
                  <Badge variant="secondary" className="bg-primary text-primary-foreground">
                    {tier.badge}
                  </Badge>
                )}
              </span>
            </CardTitle>
            <CardDescription>
              {tier.name === "Enterprise"
                ? "For large organizations"
                : tier.name === "Professional"
                ? "For finance teams"
                : "Perfect to start"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-8 justify-start">
              <p className="flex flex-row items-center gap-2 text-xl">
                <span className="text-4xl font-medium">${tier.price}</span>
                <span className="text-sm text-muted-foreground">/ {tier.cadence}</span>
              </p>
              <div className="flex flex-col gap-4 justify-start">
                {tier.features.map((feature, i) => (
                  <div key={i} className="flex flex-row gap-4">
                    <Check className="w-4 h-4 mt-1 text-primary" />
                    <div className="flex flex-col">
                      <p>{feature.title}</p>
                      <p className="text-muted-foreground text-sm">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Button
                className="gap-4 mt-4"
                variant={tier.highlighted ? "default" : "outline"}
              >
                {tier.cta}
                {tier.name === "Enterprise" ? (
                  <PhoneCall className="w-4 h-4" />
                ) : (
                  <MoveRight className="w-4 h-4" />
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function CreditPacks() {
  const packs = [
    {
      name: "100 credits",
      price: "79",
      note: "Valid for 12 months",
      features: [
        { title: "Full report = 20 credits", desc: "Standard consumption per analysis" },
        { title: "Benchmark module +12 credits", desc: "Comparative analysis option" },
        { title: "API export +5 credits", desc: "Programmatic data access" },
      ],
      highlighted: false,
    },
    {
      name: "500 credits",
      price: "349",
      note: "Valid for 12 months",
      features: [
        { title: "Best price per credit", desc: "Save 30% compared to basic pack" },
        { title: "Priority processing", desc: "Faster report generation" },
        { title: "Unlimited PDF/CSV exports", desc: "Download without restrictions" },
      ],
      highlighted: true,
      badge: "Best value",
    },
    {
      name: "2000 credits",
      price: "1199",
      note: "Valid for 12 months",
      features: [
        { title: "Extended API access", desc: "Higher API call limits" },
        { title: "Unlimited alerts", desc: "Configure as many as needed" },
        { title: "Priority support", desc: "Dedicated technical assistance" },
      ],
      highlighted: false,
    },
  ]

  return (
    <div className="grid pt-6 text-left grid-cols-1 lg:grid-cols-3 w-full gap-8 max-w-full">
      {packs.map((pack) => (
        <Card
          key={pack.name}
          className={`w-full max-w-full rounded-lg transition-shadow hover:shadow-lg border ${
            pack.highlighted ? "border-primary shadow-lg" : "border-muted"
          }`}
        >
          <CardHeader>
            <CardTitle>
              <span className="flex flex-row gap-4 items-center font-normal">
                {pack.name} pack
                {pack.badge && (
                  <Badge variant="secondary" className="bg-primary text-primary-foreground">
                    {pack.badge}
                  </Badge>
                )}
              </span>
            </CardTitle>
            <CardDescription>
              {pack.highlighted ? "Optimal cost efficiency" : "Flexible pay-as-you-go"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-8 justify-start">
              <div>
                <p className="flex flex-row items-center gap-2 text-xl">
                  <span className="text-4xl font-medium">${pack.price}</span>
                  <span className="text-sm text-muted-foreground">/ pack</span>
                </p>
                <p className="text-sm text-muted-foreground mt-1">{pack.note}</p>
              </div>
              <div className="flex flex-col gap-4 justify-start">
                {pack.features.map((feature, i) => (
                  <div key={i} className="flex flex-row gap-4">
                    <Check className="w-4 h-4 mt-1 text-primary" />
                    <div className="flex flex-col">
                      <p>{feature.title}</p>
                      <p className="text-muted-foreground text-sm">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Button className="gap-4 mt-4" variant={pack.highlighted ? "default" : "outline"}>
                Buy now <MoveRight className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
