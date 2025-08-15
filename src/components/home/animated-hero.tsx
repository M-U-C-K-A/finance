"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { MoveRight, BarChart, Sparkles, TrendingUp, DollarSign, PieChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const AnimatedHero = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const floatingElementsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    
    // Animation d'entrée séquentielle
    tl.fromTo(badgeRef.current, 
      { opacity: 0, y: 30, scale: 0.8 },
      { opacity: 1, y: 0, scale: 1, duration: 0.6 }
    )
    .fromTo(titleRef.current,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 0.8 },
      "-=0.3"
    )
    .fromTo(subtitleRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.6 },
      "-=0.4"
    )
    .fromTo(buttonsRef.current,
      { opacity: 0, y: 40, scale: 0.9 },
      { opacity: 1, y: 0, scale: 1, duration: 0.7 },
      "-=0.3"
    )
    .fromTo(footerRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5 },
      "-=0.2"
    );

    // Animation des éléments flottants
    const floatingElements = floatingElementsRef.current?.children;
    if (floatingElements) {
      Array.from(floatingElements).forEach((element, index) => {
        gsap.fromTo(element,
          { opacity: 0, scale: 0, rotation: -180 },
          { 
            opacity: 0.1, 
            scale: 1, 
            rotation: 0, 
            duration: 1,
            delay: 0.5 + index * 0.2,
            ease: "back.out(1.7)"
          }
        );
        
        // Animation de flottement continue
        gsap.to(element, {
          y: "random(-20, 20)",
          x: "random(-15, 15)",
          rotation: "random(-15, 15)",
          duration: "random(3, 5)",
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: index * 0.5
        });
      });
    }

    // Animation de pulsation pour le badge
    gsap.to(badgeRef.current, {
      scale: 1.05,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });

    // Animation du texte principal avec effet de surbrillance
    const primaryText = titleRef.current?.querySelector('.text-primary');
    if (primaryText) {
      gsap.fromTo(primaryText,
        { backgroundPosition: "-200% 0" },
        { 
          backgroundPosition: "200% 0",
          duration: 3,
          repeat: -1,
          ease: "none"
        }
      );
    }

  }, []);

  const handleButtonHover = (e: React.MouseEvent<HTMLButtonElement>) => {
    gsap.to(e.currentTarget, {
      scale: 1.05,
      duration: 0.2,
      ease: "power2.out"
    });
  };

  const handleButtonLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    gsap.to(e.currentTarget, {
      scale: 1,
      duration: 0.2,
      ease: "power2.out"
    });
  };

  return (
    <div ref={heroRef} className="w-full bg-gradient-to-br from-background via-muted/10 to-primary/5 mt-20 relative overflow-hidden">
      
      {/* Éléments flottants en arrière-plan */}
      <div ref={floatingElementsRef} className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 text-primary/10">
          <TrendingUp size={60} />
        </div>
        <div className="absolute top-40 right-20 text-primary/10">
          <BarChart size={80} />
        </div>
        <div className="absolute bottom-40 left-20 text-primary/10">
          <PieChart size={70} />
        </div>
        <div className="absolute top-60 left-1/3 text-primary/10">
          <DollarSign size={50} />
        </div>
        <div className="absolute bottom-20 right-10 text-primary/10">
          <Sparkles size={40} />
        </div>
        <div className="absolute top-80 right-1/3 text-primary/10">
          <BarChart size={55} />
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex gap-8 py-16 lg:py-24 items-center justify-center flex-col">
          
          <div ref={badgeRef}>
            <Badge variant="outline" className="bg-background/80 backdrop-blur-sm border-primary/20 shadow-lg">
              <Sparkles className="w-3 h-3 mr-2" />
              AI-POWERED INSIGHTS
            </Badge>
          </div>
          
          <div className="flex gap-4 flex-col text-center">
            <h1 
              ref={titleRef}
              className="text-4xl md:text-6xl lg:text-7xl max-w-4xl tracking-tight font-medium"
            >
              Decode Any Company's{" "}
              <span 
                className="text-primary bg-gradient-to-r from-primary via-primary to-primary bg-[length:200%_100%] bg-clip-text"
                style={{
                  backgroundImage: "linear-gradient(90deg, hsl(var(--primary)) 0%, hsl(var(--primary)) 40%, hsl(var(--primary) / 0.8) 50%, hsl(var(--primary)) 60%, hsl(var(--primary)) 100%)"
                }}
              >
                Financial DNA
              </span>
            </h1>
            
            <p 
              ref={subtitleRef}
              className="text-lg md:text-xl leading-relaxed tracking-tight text-muted-foreground max-w-3xl mx-auto"
            >
              Instant comprehensive reports with pricing trends, market evolution, and financial health metrics. 
              Get the data edge without the spreadsheet headache.
            </p>
          </div>
          
          <div ref={buttonsRef} className="flex flex-col sm:flex-row gap-3 mt-4">
            <Button 
              size="lg" 
              className="gap-3 px-8 h-12 text-md shadow-lg hover:shadow-xl transition-shadow"
              onMouseEnter={handleButtonHover}
              onMouseLeave={handleButtonLeave}
            >
              Explore Sample Report 
              <MoveRight className="w-4 h-4" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="gap-3 px-8 h-12 text-md border-2 bg-background/80 backdrop-blur-sm hover:bg-background/90"
              onMouseEnter={handleButtonHover}
              onMouseLeave={handleButtonLeave}
            >
              <BarChart className="w-4 h-4" />
              Live Demo
            </Button>
          </div>
          
          <div ref={footerRef} className="mt-6 text-sm text-muted-foreground flex items-center gap-2">
            No credit card required • Cancel anytime
          </div>
        </div>
      </div>
    </div>
  );
};