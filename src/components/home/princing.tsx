"use client"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Check, Sparkles, MoveRight, PhoneCall } from 'lucide-react'

export function Pricing() {
  const [tab, setTab] = useState<"abos" | "credits">("abos")

  return (
    <div id="pricing" className="w-full py-10 lg:py-20">
      <div className="container mx-auto">
        <div className="flex text-center justify-center items-center gap-4 flex-col">
          <Badge className="mb-4">Pricing</Badge>
          <div className="flex gap-2 flex-col">
            <h2 className="text-3xl md:text-5xl tracking-tighter max-w-xl text-center font-regular">
              Straightforward pricing for every need
            </h2>
            <p className="text-lg leading-relaxed tracking-tight text-muted-foreground max-w-xl text-center">
              Switch between models anytime as your requirements evolve.
            </p>
          </div>

          <div className="mb-10 mt-8 flex justify-center w-full">
            <Tabs 
              value={tab} 
              onValueChange={(v: string) => setTab(v as any)} 
              className="w-full max-w-md"
            >
              <TabsList className="grid grid-cols-2 w-full">
                <TabsTrigger value="abos">Subscriptions</TabsTrigger>
                <TabsTrigger value="credits">Credits</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {tab === "abos" ? <AboPricing /> : <CreditPricing />}
        </div>
      </div>
    </div>
  )
}

function AboPricing() {
  const tiers = [
    {
      name: "Starter",
      price: "29",
      cadence: "month",
      features: [
        { 
          title: "5 full reports/month",
          desc: "Generate up to 5 comprehensive financial reports"
        },
        { 
          title: "Charts & PDF exports",
          desc: "Download in multiple formats"
        },
        { 
          title: "Monthly data updates",
          desc: "Fresh financial data every month"
        },
      ],
      cta: "Get started",
      highlighted: false,
    },
    {
      name: "Professional",
      price: "99",
      cadence: "month",
      features: [
        { 
          title: "30 reports/month",
          desc: "Enhanced capacity for professional use"
        },
        { 
          title: "CSV & API access",
          desc: "Raw data for deeper analysis"
        },
        { 
          title: "Weekly alerts",
          desc: "Key metric notifications"
        },
        { 
          title: "Advanced benchmarks",
          desc: "In-depth comparison tools"
        },
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
        { 
          title: "150 reports/month",
          desc: "High-volume for organizations"
        },
        { 
          title: "SSO, SLA, auditing",
          desc: "Enterprise-grade features"
        },
        { 
          title: "Team workspaces",
          desc: "Collaboration with permissions"
        },
        { 
          title: "Priority support",
          desc: "Dedicated assistance"
        },
      ],
      cta: "Contact sales",
      highlighted: false,
    },
  ]

  return (
    <div className="grid pt-10 text-left grid-cols-1 lg:grid-cols-3 w-full gap-8">
      {tiers.map((t) => (
        <Card
          key={t.name}
          className={`w-full rounded-lg transition-all hover:shadow-lg ${
            t.highlighted 
              ? "border-primary shadow-lg" 
              : "border-muted"
          }`}
        >
          <CardHeader>
            <CardTitle>
              <span className="flex flex-row gap-4 items-center font-normal">
                {t.name}
                {t.badge && (
                  <Badge variant="secondary" className="bg-primary text-primary-foreground">
                    {t.badge}
                  </Badge>
                )}
              </span>
            </CardTitle>
            <CardDescription>
              {t.name === "Enterprise" 
                ? "For large organizations" 
                : t.name === "Professional" 
                  ? "For finance teams" 
                  : "Perfect to start"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-8 justify-start">
              <p className="flex flex-row items-center gap-2 text-xl">
                <span className="text-4xl font-medium">${t.price}</span>
                <span className="text-sm text-muted-foreground">
                  / {t.cadence}
                </span>
              </p>
              <div className="flex flex-col gap-4 justify-start">
                {t.features.map((f, i) => (
                  <div key={i} className="flex flex-row gap-4">
                    <Check className="w-4 h-4 mt-1 text-primary" />
                    <div className="flex flex-col">
                      <p>{f.title}</p>
                      <p className="text-muted-foreground text-sm">
                        {f.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <Button 
                className="gap-4 mt-4" 
                variant={t.highlighted ? "default" : "outline"}
              >
                {t.cta} 
                {t.name === "Enterprise" ? (
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

function CreditPricing() {
  const packs = [
    {
      name: "100 credits",
      price: "79",
      note: "Valid for 12 months",
      features: [
        { 
          title: "Full report = 20 credits",
          desc: "Standard consumption per analysis"
        },
        { 
          title: "Benchmark module +12 credits",
          desc: "Comparative analysis option"
        },
        { 
          title: "API export +5 credits",
          desc: "Programmatic data access"
        },
      ],
      highlighted: false,
    },
    {
      name: "500 credits",
      price: "349",
      note: "Valid for 12 months",
      features: [
        { 
          title: "Best price per credit",
          desc: "Save 30% compared to basic pack"
        },
        { 
          title: "Priority processing",
          desc: "Faster report generation"
        },
        { 
          title: "Unlimited PDF/CSV exports",
          desc: "Download without restrictions"
        },
      ],
      highlighted: true,
      badge: "Best value",
    },
    {
      name: "2000 credits",
      price: "1199",
      note: "Valid for 12 months",
      features: [
        { 
          title: "Extended API access",
          desc: "Higher API call limits"
        },
        { 
          title: "Unlimited alerts",
          desc: "Configure as many as needed"
        },
        { 
          title: "Priority support",
          desc: "Dedicated technical assistance"
        },
      ],
      highlighted: false,
    },
  ]

  return (
    <div className="grid pt-10 text-left grid-cols-1 lg:grid-cols-3 w-full gap-8">
      {packs.map((p) => (
        <Card
          key={p.name}
          className={`w-full rounded-lg transition-all hover:shadow-lg ${
            p.highlighted 
              ? "border-primary shadow-lg" 
              : "border-muted"
          }`}
        >
          <CardHeader>
            <CardTitle>
              <span className="flex flex-row gap-4 items-center font-normal">
                {p.name} pack
                {p.badge && (
                  <Badge variant="secondary" className="bg-primary text-primary-foreground">
                    {p.badge}
                  </Badge>
                )}
              </span>
            </CardTitle>
            <CardDescription>
              {p.highlighted ? "Optimal cost efficiency" : "Flexible pay-as-you-go"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-8 justify-start">
              <div>
                <p className="flex flex-row items-center gap-2 text-xl">
                  <span className="text-4xl font-medium">${p.price}</span>
                  <span className="text-sm text-muted-foreground">
                    / pack
                  </span>
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {p.note}
                </p>
              </div>
              <div className="flex flex-col gap-4 justify-start">
                {p.features.map((f, i) => (
                  <div key={i} className="flex flex-row gap-4">
                    <Check className="w-4 h-4 mt-1 text-primary" />
                    <div className="flex flex-col">
                      <p>{f.title}</p>
                      <p className="text-muted-foreground text-sm">
                        {f.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <Button 
                className="gap-4 mt-4" 
                variant={p.highlighted ? "default" : "outline"}
              >
                Buy now <MoveRight className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
