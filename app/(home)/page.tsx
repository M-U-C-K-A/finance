//app/(home)/page.tsx LANDING PAGE - Version Premium avec GSAP
import { Metadata } from "next";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "FinAnalytics - AI-Powered Financial Analysis Platform",
  description: "Transform complex financial data into actionable insights with our AI-powered platform. Generate comprehensive reports in seconds for ETFs, indices, and markets.",
  keywords: ["financial analysis", "AI", "ETF", "stock analysis", "market reports", "investment insights"],
  openGraph: {
    title: "FinAnalytics - Decode Any Financial DNA",
    description: "AI-powered financial intelligence for smarter investment decisions",
    url: "https://finanalytics.app",
    siteName: "FinAnalytics",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FinAnalytics - AI-Powered Financial Analysis",
    description: "Transform financial data into actionable insights with AI",
  },
  viewport: "width=device-width, initial-scale=1, maximum-scale=5",
  robots: "index, follow",
};
import dynamic from "next/dynamic";
import { Header } from "@/components/home/header";
import { PremiumHero } from "@/components/home/premium-hero";
import { InteractiveDemo } from "@/components/home/interactive-demo";

// Lazy load non-critical below-the-fold components for better performance
const AnimatedStats = dynamic(() => import("@/components/home/animated-stats").then(mod => ({ default: mod.AnimatedStats })), {
  loading: () => <div className="h-48 bg-muted/20 animate-pulse" />
});

const AnimatedFeatures = dynamic(() => import("@/components/home/animated-features").then(mod => ({ default: mod.AnimatedFeatures })), {
  loading: () => <div className="h-96 bg-muted/20 animate-pulse" />
});

const Case = dynamic(() => import("@/components/home/case").then(mod => ({ default: mod.Case })), {
  loading: () => <div className="h-64 bg-muted/20 animate-pulse" />
});

const Testimonials = dynamic(() => import("@/components/home/testimonial").then(mod => ({ default: mod.Testimonials })), {
  loading: () => <div className="h-80 bg-muted/20 animate-pulse" />
});

const Pricing = dynamic(() => import("@/components/home/princing").then(mod => ({ default: mod.Pricing })), {
  loading: () => <div className="h-96 bg-muted/20 animate-pulse" />
});

const FAQ = dynamic(() => import("@/components/home/faq").then(mod => ({ default: mod.FAQ })), {
  loading: () => <div className="h-64 bg-muted/20 animate-pulse" />
});

const Contact = dynamic(() => import("@/components/home/contact").then(mod => ({ default: mod.Contact })), {
  loading: () => <div className="h-48 bg-muted/20 animate-pulse" />
});

const Footer = dynamic(() => import("@/components/home/footer").then(mod => ({ default: mod.Footer })), {
  loading: () => <div className="h-32 bg-muted/20 animate-pulse" />
});

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <PremiumHero />
        <InteractiveDemo />
        <AnimatedStats />
        <AnimatedFeatures />
        <Case />
        <Testimonials />
        <Pricing />
        <FAQ />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
