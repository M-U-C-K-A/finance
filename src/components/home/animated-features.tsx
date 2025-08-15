"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { BarChart3, Brain, Zap, Shield, TrendingUp, Target } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

gsap.registerPlugin(ScrollTrigger);

export const AnimatedFeatures = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<(HTMLDivElement | null)[]>([]);

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Analysis",
      description: "Advanced machine learning algorithms analyze thousands of financial data points to provide deep insights.",
      color: "text-blue-600"
    },
    {
      icon: BarChart3,
      title: "Real-Time Data",
      description: "Live market data and instant updates ensure you always have the most current financial information.",
      color: "text-green-600"
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Generate comprehensive reports in seconds, not hours. Get the analysis you need when you need it.",
      color: "text-yellow-600"
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-grade security with end-to-end encryption protects your sensitive financial data.",
      color: "text-red-600"
    },
    {
      icon: TrendingUp,
      title: "Predictive Insights",
      description: "Forecast market trends and identify opportunities before they become obvious to everyone else.",
      color: "text-purple-600"
    },
    {
      icon: Target,
      title: "Precision Accuracy",
      description: "Our models achieve 98% accuracy in financial predictions, trusted by professional analysts.",
      color: "text-indigo-600"
    }
  ];

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Animation du titre
    gsap.fromTo(titleRef.current,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: titleRef.current,
          start: "top 85%",
          toggleActions: "play none none reverse"
        }
      }
    );

    // Animation des cartes de fonctionnalités
    featuresRef.current.forEach((feature, index) => {
      if (!feature) return;

      const icon = feature.querySelector('.feature-icon');
      const content = feature.querySelector('.feature-content');

      // Animation d'entrée
      gsap.fromTo(feature,
        { opacity: 0, y: 60, rotationX: 45 },
        {
          opacity: 1,
          y: 0,
          rotationX: 0,
          duration: 0.8,
          delay: index * 0.1,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: feature,
            start: "top 85%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // Animation de l'icône au survol
      const handleMouseEnter = () => {
        gsap.to(icon, {
          scale: 1.1,
          rotation: 10,
          duration: 0.3,
          ease: "back.out(1.7)"
        });
        gsap.to(feature, {
          scale: 1.02,
          y: -5,
          duration: 0.3,
          ease: "power2.out"
        });
      };

      const handleMouseLeave = () => {
        gsap.to(icon, {
          scale: 1,
          rotation: 0,
          duration: 0.3,
          ease: "power2.out"
        });
        gsap.to(feature, {
          scale: 1,
          y: 0,
          duration: 0.3,
          ease: "power2.out"
        });
      };

      feature.addEventListener('mouseenter', handleMouseEnter);
      feature.addEventListener('mouseleave', handleMouseLeave);

      // Animation continue subtile
      gsap.to(icon, {
        y: -5,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: index * 0.2
      });

      return () => {
        feature.removeEventListener('mouseenter', handleMouseEnter);
        feature.removeEventListener('mouseleave', handleMouseLeave);
      };
    });

  }, []);

  return (
    <div ref={containerRef} className="py-20 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4">
        <div ref={titleRef} className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Powerful Features
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Everything you need to make informed financial decisions with confidence and speed.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card 
                key={index}
                ref={(el) => (featuresRef.current[index] = el)}
                className="group cursor-pointer border-2 border-transparent hover:border-primary/20 transition-all duration-300 bg-background/60 backdrop-blur-sm"
              >
                <CardContent className="p-8 text-center">
                  <div className="feature-content">
                    <div className={`feature-icon inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-primary/10 to-primary/5 mb-6 ${feature.color}`}>
                      <IconComponent size={32} />
                    </div>
                    <h3 className="text-xl font-semibold mb-4 group-hover:text-primary transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};