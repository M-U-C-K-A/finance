"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MoveRight, BarChart, Sparkles, TrendingUp, DollarSign, PieChart, Play, Star, ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

gsap.registerPlugin(ScrollTrigger);

export const PremiumHero = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ 
        defaults: { ease: "power3.out" },
        // Performance optimization
        onComplete: () => {
          // Reduce repaints by setting will-change to auto after animations
          gsap.set([".hero-badge", ".hero-title", ".hero-subtitle", ".hero-stats", ".hero-buttons", ".hero-demo"], {
            clearProps: "will-change"
          });
        }
      });
      
      // Set will-change for better performance during animations
      gsap.set([".hero-badge", ".hero-title", ".hero-subtitle", ".hero-stats", ".hero-buttons", ".hero-demo"], {
        willChange: "transform, opacity"
      });
      
      // Animation séquentielle premium (optimized)
      tl.fromTo(".hero-badge", 
        { opacity: 0, y: 30, scale: 0.8 },
        { opacity: 1, y: 0, scale: 1, duration: 0.6, delay: 0.1 }
      )
      .fromTo(".hero-title",
        { opacity: 0, y: 40, rotationX: 15 }, // Reduced rotation for performance
        { opacity: 1, y: 0, rotationX: 0, duration: 0.8, stagger: 0.05 }, // Reduced stagger
        "-=0.3"
      )
      .fromTo(".hero-subtitle",
        { opacity: 0, y: 30 }, // Reduced movement
        { opacity: 1, y: 0, duration: 0.6 },
        "-=0.5"
      )
      .fromTo(".hero-stats",
        { opacity: 0, y: 20, scale: 0.95 }, // Reduced movement and scale
        { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.05 },
        "-=0.3"
      )
      .fromTo(".hero-buttons",
        { opacity: 0, y: 30, scale: 0.98 }, // Reduced movement and scale
        { opacity: 1, y: 0, scale: 1, duration: 0.6 },
        "-=0.2"
      )
      .fromTo(".hero-demo",
        { opacity: 0, y: 30, scale: 0.95 }, // Removed rotation for performance
        { opacity: 1, y: 0, scale: 1, duration: 0.8 },
        "-=0.4"
      )
      .fromTo(".floating-element",
        { opacity: 0, scale: 0.8 }, // Simplified animation
        { 
          opacity: 0.4, // Reduced opacity for less visual noise
          scale: 1, 
          duration: 0.8,
          stagger: 0.1, // Reduced stagger
          ease: "back.out(1.2)" // Less dramatic ease
        },
        "-=0.6"
      );

      // Optimized continuous animations - reduced frequency
      gsap.to(".floating-element", {
        y: "random(-20, 20)", // Reduced range
        x: "random(-15, 15)", // Reduced range
        rotation: "random(-10, 10)", // Reduced rotation
        duration: "random(6, 8)", // Longer duration for smoother animation
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: 0.5 // Increased stagger for better performance
      });

      // Slower gradient animation for better performance
      gsap.to(".gradient-bg", {
        backgroundPosition: "200% 50%",
        duration: 12, // Slower animation
        repeat: -1,
        ease: "none"
      });

    }, heroRef);

    return () => ctx.revert();
  }, []);

  const stats = [
    { number: "10K+", label: "Reports Generated", icon: BarChart },
    { number: "98%", label: "Accuracy Rate", icon: CheckCircle },
    { number: "500+", label: "Companies", icon: TrendingUp },
    { number: "24/7", label: "Support", icon: Star }
  ];

  return (
    <div ref={heroRef} className="relative min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10 overflow-hidden">
      {/* Background animé */}
      <div className="gradient-bg absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-secondary/20 bg-[length:200%_100%]" />
      
      {/* Particules flottantes (reduced for performance) */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="floating-element absolute text-primary/20"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
          >
            {i % 4 === 0 && <TrendingUp size={40 + Math.random() * 30} />}
            {i % 4 === 1 && <BarChart size={40 + Math.random() * 30} />}
            {i % 4 === 2 && <PieChart size={40 + Math.random() * 30} />}
            {i % 4 === 3 && <DollarSign size={40 + Math.random() * 30} />}
          </div>
        ))}
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-6xl mx-auto">
          
          {/* Badge premium */}
          <div className="hero-badge text-center mb-8">
            <Badge className="bg-gradient-to-r from-primary to-primary/80 text-white border-0 px-6 py-2 text-sm font-medium shadow-lg">
              <Sparkles className="w-4 h-4 mr-2" />
              AI-Powered Financial Intelligence
            </Badge>
          </div>

          {/* Titre principal */}
          <div className="text-center mb-12">
            <h1 className="hero-title text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
              <span className="block bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                Decode Any
              </span>
              <span className="block bg-gradient-to-r from-primary via-primary to-secondary bg-clip-text text-transparent">
                Financial DNA
              </span>
            </h1>
            
            <p className="hero-subtitle text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              Transform complex financial data into actionable insights with our AI-powered platform. 
              Generate comprehensive reports in seconds, not hours.
            </p>
          </div>

          {/* Stats rapides */}
          <div className="hero-stats grid grid-cols-2 md:grid-cols-4 gap-6 mb-12 max-w-4xl mx-auto">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <Card key={index} className="bg-background/60 backdrop-blur-lg border-primary/20 shadow-xl">
                  <CardContent className="p-4 text-center">
                    <IconComponent className="w-6 h-6 mx-auto mb-2 text-primary" />
                    <div className="text-2xl font-bold text-foreground">{stat.number}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Boutons CTA */}
          <div className="hero-buttons flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white border-0 px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 group"
            >
              Start Free Trial
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <Button 
              size="lg" 
              variant="outline" 
              className="border-2 border-primary/30 bg-background/80 backdrop-blur-lg text-foreground hover:bg-primary/10 px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group"
              onClick={() => setIsVideoPlaying(true)}
            >
              <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
              Watch Demo
            </Button>
          </div>

          {/* Demo interface mockup */}
          <div className="hero-demo max-w-5xl mx-auto">
            <Card className="bg-background/40 backdrop-blur-xl border-primary/20 shadow-2xl overflow-hidden">
              <CardContent className="p-0">
                <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-4 border-b border-primary/20">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <div className="ml-4 text-sm text-muted-foreground font-mono">
                      finanalytics.app/dashboard
                    </div>
                  </div>
                </div>
                
                <div className="relative aspect-[16/10] bg-gradient-to-br from-background to-muted/50">
                  {/* Interface mockup placeholder */}
                  <div className="absolute inset-4 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-32 h-32 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full mx-auto mb-6 flex items-center justify-center">
                        <BarChart size={64} className="text-primary" />
                      </div>
                      <h3 className="text-2xl font-bold mb-2">Interactive Dashboard Preview</h3>
                      <p className="text-muted-foreground">Real-time analytics and AI-powered insights</p>
                      <Button className="mt-4" variant="outline">
                        Explore Features
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Trust indicators */}
          <div className="text-center mt-12">
            <p className="text-sm text-muted-foreground mb-4">Trusted by financial professionals worldwide</p>
            <div className="flex items-center justify-center space-x-8 opacity-60">
              {/* Placeholder pour logos de clients */}
              <div className="w-24 h-8 bg-muted rounded-lg"></div>
              <div className="w-24 h-8 bg-muted rounded-lg"></div>
              <div className="w-24 h-8 bg-muted rounded-lg"></div>
              <div className="w-24 h-8 bg-muted rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Video modal overlay */}
      {isVideoPlaying && (
        <div 
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setIsVideoPlaying(false)}
        >
          <div className="relative max-w-4xl w-full aspect-video bg-black rounded-lg overflow-hidden">
            <button 
              onClick={() => setIsVideoPlaying(false)}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
            >
              ✕
            </button>
            {/* Placeholder pour vidéo */}
            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
              <div className="text-center text-white">
                <Play size={64} className="mx-auto mb-4" />
                <p className="text-xl">Demo Video Coming Soon</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};