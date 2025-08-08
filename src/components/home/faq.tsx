import { Check, PhoneCall } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

export const FAQ = () => (
  <div className="w-full py-10 lg:py-20">
    <div className="container mx-auto">
      <div className="grid lg:grid-cols-2 gap-10">
        <div className="flex gap-10 flex-col">
          <div className="flex gap-4 flex-col">
            <div>
              <Badge variant="outline">FAQ</Badge>
            </div>
            <div className="flex gap-2 flex-col">
              <h4 className="text-3xl md:text-5xl tracking-tighter max-w-xl text-left font-regular">
                Financial insights made simple
              </h4>
              <p className="text-lg max-w-xl lg:max-w-lg leading-relaxed tracking-tight text-muted-foreground text-left">
                Get answers to common questions about our financial reporting platform. 
                Can't find what you need? Our team is ready to help.
              </p>
            </div>
            <div className="">
              <Button className="gap-4" variant="outline">
                Any questions? Reach out <PhoneCall className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="data-sources">
            <AccordionTrigger>
              Where does your financial data come from?
            </AccordionTrigger>
            <AccordionContent>
              We aggregate data from multiple reliable sources including SEC filings, 
              market feeds, and proprietary research. All data is verified and updated 
              regularly.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="report-frequency">
            <AccordionTrigger>
              How often are reports updated?
            </AccordionTrigger>
            <AccordionContent>
              Standard reports update monthly. Our Pro and Enterprise plans offer 
              weekly updates with real-time alerts for significant market movements.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="credit-usage">
            <AccordionTrigger>
              How are credits calculated for reports?
            </AccordionTrigger>
            <AccordionContent>
              A standard company report uses 20 credits. Additional modules like 
              competitor benchmarking or historical trends require extra credits. 
              Unused credits roll over for 12 months.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="data-export">
            <AccordionTrigger>
              Can I export the raw financial data?
            </AccordionTrigger>
            <AccordionContent>
              Yes, all plans support PDF exports. Professional and Enterprise plans 
              include CSV exports and limited API access for raw data extraction.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="trial-options">
            <AccordionTrigger>
              Do you offer free sample reports?
            </AccordionTrigger>
            <AccordionContent>
              We provide 3 sample reports when you create an account. These let you 
              evaluate our reporting depth before purchasing credits or a subscription.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="security">
            <AccordionTrigger>
              How is my data secured?
            </AccordionTrigger>
            <AccordionContent>
              We use bank-grade encryption, regular audits, and comply with global 
              financial data standards. Enterprise plans offer additional security 
              controls like SSO and private deployment options.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="subscription-change">
            <AccordionTrigger>
              Can I switch between credit packs and subscriptions?
            </AccordionTrigger>
            <AccordionContent>
              Absolutely. You can change your billing model at any time. Unused 
              credits remain available if you switch to a subscription.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="custom-reports">
            <AccordionTrigger>
              Do you create custom financial reports?
            </AccordionTrigger>
            <AccordionContent>
              Our Enterprise plan includes custom report building. For other plans, 
              we offer standard templates covering 95% of common financial analysis 
              needs.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  </div>
);
