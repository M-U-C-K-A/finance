// app/(app)/dashboard/subscriptions/page.tsx
"use client"

import { useState } from "react"
import { toast } from "sonner"
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
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleSubscribe = async (planName: string) => {
    if (planName === "Enterprise") {
      // For enterprise, just show a message or redirect to contact
      toast.info("Please contact sales for Enterprise plan pricing and setup.");
      return;
    }

    setIsLoading(planName);
    try {
      const response = await fetch('/api/checkout/subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: planName.toUpperCase() })
      });

      if (response.ok) {
        const data = await response.json();
        window.location.href = data.checkout_url;
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to create checkout');
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsLoading(null);
    }
  };

  const tiers = [
    {
      name: "Starter",
      price: "29",
      cadence: "month",
      features: [
        { title: "100 credits/month", desc: "Enough for ~5 standard reports" },
        { title: "Reports included in plan", desc: "No extra purchase needed unless you exceed your credits" },
        { title: "Charts & PDF exports", desc: "Visual and downloadable reports" },
        { title: "Monthly data updates", desc: "Fresh datasets each month" },
      ],
      note: "Equivalent credit value: ~69€ — Save 58% vs buying credits",
      cta: "Get started",
      highlighted: false,
    },
    {
      name: "Professional",
      price: "99",
      cadence: "month",
      features: [
        { title: "500 credits/month", desc: "For ~25 standard reports or API usage" },
        { title: "CSV & API access", desc: "Programmatic access to data — API exclusive to subscribers" },
        { title: "Weekly alerts", desc: "Key metrics delivered to your inbox" },
        { title: "Advanced benchmarks", desc: "In-depth market comparisons" },
      ],
      note: "Equivalent credit value: ~299€ — Save 67% vs buying credits",
      cta: "Try Professional",
      highlighted: true,
      badge: "Most popular",
    },
    {
      name: "Enterprise",
      price: "299",
      cadence: "month",
      features: [
        { title: "2000 credits/month", desc: "For heavy usage, API integrations, and teams" },
        { title: "SSO, SLA, auditing", desc: "Enterprise-grade compliance" },
        { title: "Team workspaces", desc: "Collaborate with permissions" },
        { title: "Priority support", desc: "24/7 assistance" },
      ],
      note: "Equivalent credit value: ~1099€ — Save 73% vs buying credits",
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
                onClick={() => handleSubscribe(tier.name)}
                disabled={isLoading === tier.name}
              >
                {isLoading === tier.name ? 'Processing...' : tier.cta}
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
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handlePurchase = async (packName: string) => {
    const credits = parseInt(packName.split(' ')[0]); // Extract credits number from pack name
    
    setIsLoading(packName);
    try {
      const response = await fetch('/api/checkout/credits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credits })
      });

      if (response.ok) {
        const data = await response.json();
        window.location.href = data.checkout_url;
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to create checkout');
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsLoading(null);
    }
  };

  const packs = [
    {
      name: "100 credits",
      price: "69",
      note: "Valid for 12 months — One-time purchase",
      features: [
        { title: "Full report = 20 credits", desc: "Standard report cost" },
        { title: "Benchmark module +12 credits", desc: "Optional detailed comparison" },
        { title: "No API access", desc: "Upgrade to a subscription for API" },
      ],
      highlighted: false,
    },
    {
      name: "500 credits",
      price: "299",
      note: "Valid for 12 months — One-time purchase",
      features: [
        { title: "Save 13% vs basic pack", desc: "Lower cost per credit" },
        { title: "Priority processing", desc: "Faster report generation" },
        { title: "No API access", desc: "API exclusive to subscribers" },
      ],
      highlighted: true,
      badge: "Best value",
    },
    {
      name: "2000 credits",
      price: "1099",
      note: "Valid for 12 months — One-time purchase",
      features: [
        { title: "For high-volume needs", desc: "Best for occasional but heavy usage" },
        { title: "Unlimited alerts", desc: "Configure multiple alerts" },
        { title: "No API access", desc: "Switch to Enterprise subscription for API" },
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
              <Button 
                className="gap-4 mt-4" 
                variant={pack.highlighted ? "default" : "outline"}
                onClick={() => handlePurchase(pack.name)}
                disabled={isLoading === pack.name}
              >
                {isLoading === pack.name ? 'Processing...' : 'Buy now'} 
                <MoveRight className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )

}
