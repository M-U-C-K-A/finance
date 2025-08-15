"use client";

import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  Download, 
  Zap, 
  Target,
  ArrowRight,
  CheckCircle,
  Clock,
  AlertTriangle
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export const InteractiveDemo = () => {
  const [activeTab, setActiveTab] = useState("analysis");
  const [progress, setProgress] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Animation d'entrée (optimized)
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Set will-change for better performance
      gsap.set(".demo-card", { willChange: "transform, opacity" });
      
      gsap.fromTo(".demo-card", 
        { opacity: 0, y: 40, rotationX: 8 }, // Reduced movement and rotation
        { 
          opacity: 1, 
          y: 0, 
          rotationX: 0, 
          duration: 0.8, // Reduced duration
          stagger: 0.1, // Reduced stagger
          ease: "back.out(1.4)", // Less dramatic ease
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 85%", // Earlier trigger
            toggleActions: "play none none reverse"
          },
          onComplete: () => {
            // Clear will-change after animation
            gsap.set(".demo-card", { clearProps: "will-change" });
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Simulation de génération de rapport
  const simulateGeneration = () => {
    setIsGenerating(true);
    setProgress(0);
    
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsGenerating(false);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 300);
  };

  const sampleData = {
    analysis: {
      title: "Apple Inc. (AAPL) - Deep Analysis",
      metrics: [
        { label: "Current Price", value: "$175.43", change: "+2.34%" },
        { label: "Market Cap", value: "$2.75T", change: "+1.2%" },
        { label: "P/E Ratio", value: "29.8", change: "-0.5%" },
        { label: "Beta", value: "1.24", change: "0.0%" }
      ],
      signals: [
        { type: "buy", text: "Strong fundamentals support", confidence: 85 },
        { type: "hold", text: "Technical resistance at $180", confidence: 72 },
        { type: "watch", text: "Earnings report next week", confidence: 90 }
      ]
    },
    charts: [
      { name: "Price Evolution", type: "line", data: "📈 Interactive chart" },
      { name: "Volume Analysis", type: "bar", data: "📊 Volume patterns" },
      { name: "Technical Indicators", type: "overlay", data: "🔄 RSI, MACD, Bollinger" }
    ]
  };

  return (
    <div ref={sectionRef} className="py-20 bg-gradient-to-br from-muted/30 to-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
            <Zap className="w-4 h-4 mr-2" />
            Interactive Demo
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            See <span className="text-primary">FinAnalytics</span> in Action
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Experience the power of AI-driven financial analysis. Generate a sample report 
            and explore our comprehensive insights dashboard.
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 items-start">
          
          {/* Interface de démonstration */}
          <Card className="demo-card bg-background/80 backdrop-blur-lg border-primary/20 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                Generate Sample Report
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {/* Sélection d'asset */}
              <div className="space-y-3">
                <label className="text-sm font-medium">Select Asset</label>
                <div className="grid grid-cols-2 gap-2">
                  {['AAPL', 'TSLA', 'MSFT', 'GOOGL'].map((symbol) => (
                    <Button
                      key={symbol}
                      variant={symbol === 'AAPL' ? 'default' : 'outline'}
                      size="sm"
                      className="justify-start"
                    >
                      {symbol}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Type d'analyse */}
              <div className="space-y-3">
                <label className="text-sm font-medium">Analysis Type</label>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="analysis">Quick</TabsTrigger>
                    <TabsTrigger value="deep">Deep</TabsTrigger>
                    <TabsTrigger value="custom">Custom</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              {/* Options */}
              <div className="space-y-3">
                <label className="text-sm font-medium">Include</label>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span className="text-sm">Technical Analysis</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span className="text-sm">Fundamental Metrics</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">Market Comparison</span>
                  </label>
                </div>
              </div>

              {/* Bouton de génération */}
              <Button 
                onClick={simulateGeneration}
                disabled={isGenerating}
                className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary"
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <Clock className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 mr-2" />
                    Generate Report
                  </>
                )}
              </Button>

              {/* Barre de progression */}
              {isGenerating && (
                <div className="space-y-2">
                  <Progress value={progress} className="w-full" />
                  <div className="text-sm text-muted-foreground text-center">
                    {progress < 30 && "Fetching market data..."}
                    {progress >= 30 && progress < 60 && "Running AI analysis..."}
                    {progress >= 60 && progress < 90 && "Generating charts..."}
                    {progress >= 90 && "Finalizing report..."}
                  </div>
                </div>
              )}

              {/* Résultat */}
              {progress === 100 && (
                <Card className="bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="font-medium text-green-900 dark:text-green-100">
                        Report Generated Successfully!
                      </span>
                    </div>
                    <p className="text-sm text-green-700 dark:text-green-300 mb-3">
                      Your comprehensive analysis is ready for download.
                    </p>
                    <Button size="sm" className="bg-green-600 hover:bg-green-700">
                      <Download className="w-4 h-4 mr-2" />
                      Download PDF
                    </Button>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>

          {/* Aperçu du rapport */}
          <Card className="demo-card bg-background/80 backdrop-blur-lg border-primary/20 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                Sample Report Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="analysis">Analysis</TabsTrigger>
                  <TabsTrigger value="charts">Charts</TabsTrigger>
                </TabsList>
                
                <TabsContent value="analysis" className="space-y-4 mt-6">
                  <div>
                    <h3 className="font-semibold text-lg mb-3">{sampleData.analysis.title}</h3>
                    
                    {/* Métriques clés */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      {sampleData.analysis.metrics.map((metric, index) => (
                        <div key={index} className="bg-muted/50 rounded-lg p-3">
                          <div className="text-sm text-muted-foreground">{metric.label}</div>
                          <div className="font-bold">{metric.value}</div>
                          <div className={`text-xs ${metric.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                            {metric.change}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Signaux d'investissement */}
                    <div className="space-y-2">
                      <h4 className="font-medium mb-2">AI Investment Signals</h4>
                      {sampleData.analysis.signals.map((signal, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-muted/30 rounded">
                          <div className="flex items-center gap-2">
                            <Badge variant={signal.type === 'buy' ? 'default' : signal.type === 'hold' ? 'secondary' : 'outline'}>
                              {signal.type.toUpperCase()}
                            </Badge>
                            <span className="text-sm">{signal.text}</span>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {signal.confidence}% confidence
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="charts" className="space-y-4 mt-6">
                  {sampleData.charts.map((chart, index) => (
                    <div key={index} className="bg-muted/30 rounded-lg p-4 border border-border/50">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{chart.name}</h4>
                        <Badge variant="outline" className="text-xs">
                          {chart.type}
                        </Badge>
                      </div>
                      <div className="h-24 bg-gradient-to-r from-primary/10 to-secondary/10 rounded flex items-center justify-center text-muted-foreground">
                        {chart.data}
                      </div>
                    </div>
                  ))}
                </TabsContent>
              </Tabs>

              {/* CTA */}
              <div className="mt-6 p-4 bg-primary/10 rounded-lg border border-primary/20">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-primary" />
                  <span className="font-medium text-primary">Try it for real!</span>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  This is just a preview. Sign up to generate actual reports with real-time data.
                </p>
                <Button className="w-full" variant="outline">
                  Start Free Trial
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};