// 7. Page d'achat de crédits - credits/buy/page.tsx
'use client';

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { 
  Coins,
  CreditCard,
  Zap,
  Star,
  Calculator
} from "lucide-react";

const creditPacks = [
  {
	id: 'small',
	name: "100 credits",
	price: 69,
	credits: 100,
	pricePerCredit: 0.69,
	note: "Valid for 12 months",
	features: [
	  "Full report = 20 credits",
	  "Benchmark module +12 credits", 
	  "No API access"
	],
	highlighted: false,
  },
  {
	id: 'medium',
	name: "500 credits",
	price: 299,
	credits: 500,
	pricePerCredit: 0.598,
	note: "Valid for 12 months",
	savings: "Save 13%",
	features: [
	  "Best price per credit",
	  "Priority processing",
	  "Unlimited PDF/CSV exports",
	  "No API access"
	],
	highlighted: true,
	badge: "Best value",
  },
  {
	id: 'large',
	name: "2000 credits",
	price: 1099,
	credits: 2000,
	pricePerCredit: 0.55,
	note: "Valid for 12 months",
	savings: "Save 20%",
	features: [
	  "For high-volume needs",
	  "Unlimited alerts",
	  "Priority support",
	  "No API access"
	],
	highlighted: false,
  }
];

export default function BuyCreditsPage() {
  const [selectedPack, setSelectedPack] = useState('medium');
  const [currentBalance] = useState(45);

  const selectedPackData = creditPacks.find(pack => pack.id === selectedPack);

  return (
	<div className="space-y-6 p-8">
	  <div className="text-center space-y-4">
		<h1 className="text-3xl font-bold">Buy Credits</h1>
		<p className="text-muted-foreground max-w-2xl mx-auto">
		  Purchase credits to generate reports on-demand. No monthly commitment, 
		  credits are valid for 12 months from purchase date.
		</p>
		<div className="inline-flex items-center gap-2 bg-amber-50 text-amber-700 px-4 py-2 rounded-lg border border-amber-200 max-w-2xl mx-auto">
		  <span className="text-sm">
			⚠️ <strong>API access is exclusive to subscribers.</strong> Credit packs do not include API access.
		  </span>
		</div>
		<div className="inline-flex items-center gap-2 bg-orange-50 text-orange-700 px-4 py-2 rounded-lg">
		  <Coins className="h-5 w-5" />
		  <span>Current balance: <strong>{currentBalance} credits</strong></span>
		</div>
	  </div>

	  {/* Credit calculator */}
	  <Card className="max-w-2xl mx-auto">
		<CardHeader>
		  <CardTitle className="flex items-center gap-2">
			<Calculator className="h-5 w-5" />
			Credit Calculator
		  </CardTitle>
		</CardHeader>
		<CardContent>
		  <div className="grid md:grid-cols-3 gap-4 text-center">
			<div className="p-4 border rounded-lg">
			  <div className="text-2xl font-bold">20</div>
			  <p className="text-sm">Basic Report</p>
			  <p className="text-xs text-muted-foreground">Standard analysis</p>
			</div>
			<div className="p-4 border rounded-lg">
			  <div className="text-2xl font-bold">32</div>
			  <p className="text-sm">With Benchmarks</p>
			  <p className="text-xs text-muted-foreground">+12 credits</p>
			</div>
			<div className="p-4 border rounded-lg">
			  <div className="text-2xl font-bold">37</div>
			  <p className="text-sm">Full Package</p>
			  <p className="text-xs text-muted-foreground">+API export</p>
			</div>
		  </div>
		</CardContent>
	  </Card>

	  {/* Credit packs */}
	  <div className="max-w-6xl mx-auto">
		<h2 className="text-2xl font-bold text-center mb-8">Choose Your Credit Pack</h2>
		<RadioGroup value={selectedPack} onValueChange={setSelectedPack}>
		  <div className="grid md:grid-cols-3 gap-6">
			{creditPacks.map((pack) => (
			  <Card 
				key={pack.id} 
				className={`cursor-pointer transition-all ${
				  pack.highlighted ? 'ring-2 ring-primary shadow-lg' : ''
				} ${selectedPack === pack.id ? 'ring-2 ring-orange-500' : 'hover:shadow-md'}`}
				onClick={() => setSelectedPack(pack.id)}
			  >
				<CardHeader className="text-center relative">
				  {pack.badge && (
					<Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-primary">
					  <Star className="h-3 w-3 mr-1" />
					  {pack.badge}
					</Badge>
				  )}
				  <RadioGroupItem value={pack.id} id={pack.id} className="mx-auto mb-4" />
				  <CardTitle className="text-xl">{pack.name}</CardTitle>
				  <div className="space-y-2">
					<div className="text-3xl font-bold">${pack.price}</div>
					<div className="text-sm text-muted-foreground">{pack.note}</div>
					{pack.savings && (
					  <Badge variant="secondary" className="bg-green-100 text-green-700">
						{pack.savings}
					  </Badge>
					)}
				  </div>
				</CardHeader>
				<CardContent>
				  <div className="space-y-3 mb-4">
					<div className="flex justify-between text-sm">
					  <span>Credits:</span>
					  <span className="font-bold">{pack.credits}</span>
					</div>
					<div className="flex justify-between text-sm">
					  <span>Price per credit:</span>
					  <span>${pack.pricePerCredit}</span>
					</div>
					<div className="flex justify-between text-sm">
					  <span>~Reports possible:</span>
					  <span>{Math.floor(pack.credits / 20)}</span>
					</div>
				  </div>
				  <ul className="space-y-2">
					{pack.features.map((feature, index) => (
					  <li key={index} className="text-sm flex items-start gap-2">
						<span className="text-green-600">•</span>
						<span>{feature}</span>
					  </li>
					))}
				  </ul>
				</CardContent>
			  </Card>
			))}
		  </div>
		</RadioGroup>
	  </div>

	  {/* Checkout */}
	  {selectedPackData && (
		<Card className="max-w-md mx-auto">
		  <CardHeader>
			<CardTitle className="flex items-center gap-2">
			  <CreditCard className="h-5 w-5" />
			  Purchase Summary
			</CardTitle>
		  </CardHeader>
		  <CardContent className="space-y-4">
			<div className="space-y-2">
			  <div className="flex justify-between">
				<span>{selectedPackData.name}</span>
				<span>${selectedPackData.price}</span>
			  </div>
			  <div className="flex justify-between text-sm text-muted-foreground">
				<span>Current balance:</span>
				<span>{currentBalance} credits</span>
			  </div>
			  <div className="flex justify-between text-sm text-muted-foreground">
				<span>After purchase:</span>
				<span className="font-bold text-orange-600">
				  {currentBalance + selectedPackData.credits} credits
				</span>
			  </div>
			</div>
			<Button className="w-full" size="lg">
			  <Zap className="h-4 w-4 mr-2" />
			  Purchase {selectedPackData.name}
			</Button>
			<p className="text-xs text-center text-muted-foreground">
			  Secure payment via Stripe • Credits valid for 12 months
			</p>
		  </CardContent>
		</Card>
	  )}
	</div>
  );
}
