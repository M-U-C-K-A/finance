import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const Feature = () => (
  <div className="w-full py-10 lg:py-20">
    <div className="container mx-auto">
      <div className="flex gap-4 py-10 lg:py-20 flex-col items-start">
        <div>
          <Badge>Key Features</Badge>
        </div>
        <div className="flex gap-2 flex-col">
          <h2 className="text-3xl md:text-5xl tracking-tighter lg:max-w-xl font-regular">
            Comprehensive financial intelligence
          </h2>
          <p className="text-lg max-w-xl lg:max-w-xl leading-relaxed tracking-tight text-muted-foreground">
            Get the full picture with our detailed company analysis platform.
          </p>
        </div>
        <div className="flex gap-10 pt-12 flex-col w-full">
          <div className="grid grid-cols-2 items-start lg:grid-cols-3 gap-10">
            <div className="flex flex-row gap-6 w-full items-start">
              <Check className="w-4 h-4 mt-2 text-primary" />
              <div className="flex flex-col gap-1">
                <p>360° Company Reports</p>
                <p className="text-muted-foreground text-sm">
                  Financial health, pricing trends and market positioning in one click.
                </p>
              </div>
            </div>
            <div className="flex flex-row gap-6 items-start">
              <Check className="w-4 h-4 mt-2 text-primary" />
              <div className="flex flex-col gap-1">
                <p>Real-time Data</p>
                <p className="text-muted-foreground text-sm">
                  Always up-to-date market information with automatic refreshes.
                </p>
              </div>
            </div>
            <div className="flex flex-row gap-6 items-start">
              <Check className="w-4 h-4 mt-2 text-primary" />
              <div className="flex flex-col gap-1">
                <p>Interactive Dashboards</p>
                <p className="text-muted-foreground text-sm">
                  Customizable visualizations to spot trends at a glance.
                </p>
              </div>
            </div>
            <div className="flex flex-row gap-6 w-full items-start">
              <Check className="w-4 h-4 mt-2 text-primary" />
              <div className="flex flex-col gap-1">
                <p>Competitor Benchmarking</p>
                <p className="text-muted-foreground text-sm">
                  Compare key metrics against industry peers.
                </p>
              </div>
            </div>
            <div className="flex flex-row gap-6 items-start">
              <Check className="w-4 h-4 mt-2 text-primary" />
              <div className="flex flex-col gap-1">
                <p>Export Ready</p>
                <p className="text-muted-foreground text-sm">
                  Download reports in PDF, Excel or PowerPoint formats.
                </p>
              </div>
            </div>
            <div className="flex flex-row gap-6 items-start">
              <Check className="w-4 h-4 mt-2 text-primary" />
              <div className="flex flex-col gap-1">
                <p>Flexible Pricing</p>
                <p className="text-muted-foreground text-sm">
                  Pay-per-report or subscription plans to match your needs.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
