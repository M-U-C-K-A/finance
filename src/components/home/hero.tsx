import { MoveRight, BarChart, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const Hero = () => (
  <div className="w-full bg-gradient-to-b from-background to-muted/20 mt-20">
    <div className="container mx-auto px-4">
      <div className="flex gap-8 py-16 lg:py-24 items-center justify-center flex-col">
        <div>
          <Badge variant="outline">
            <Sparkles className="w-3 h-3 mr-2" />
            AI-POWERED INSIGHTS
          </Badge>
        </div>
        
        <div className="flex gap-4 flex-col text-center">
          <h1 className="text-4xl md:text-6xl lg:text-7xl max-w-4xl tracking-tight font-medium">
            Decode Any Company's <span className="text-primary">Financial DNA</span>
          </h1>
          
          <p className="text-lg md:text-xl leading-relaxed tracking-tight text-muted-foreground max-w-3xl mx-auto">
            Instant comprehensive reports with pricing trends, market evolution, and financial health metrics. 
            Get the data edge without the spreadsheet headache.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 mt-4">
          <Button size="lg" className="gap-3 px-8 h-12 text-md">
            Explore Sample Report 
            <MoveRight className="w-4 h-4" />
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="gap-3 px-8 h-12 text-md border-2"
          >
            <BarChart className="w-4 h-4" />
            Live Demo
          </Button>
        </div>
        
        <div className="mt-6 text-sm text-muted-foreground flex items-center gap-2">
          No credit card required • Cancel anytime
        </div>
      </div>
    </div>
  </div>
);
