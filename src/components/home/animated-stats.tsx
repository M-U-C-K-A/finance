"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const AnimatedStats = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const statsRefs = useRef<(HTMLDivElement | null)[]>([]);

  const stats = [
    { number: "10K+", label: "Reports Generated", suffix: "" },
    { number: "98", label: "Accuracy Rate", suffix: "%" },
    { number: "500", label: "Companies Analyzed", suffix: "+" },
    { number: "24", label: "Response Time", suffix: "/7" }
  ];

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Animation d'entrée avec ScrollTrigger
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "play none none reverse"
      }
    });

    // Animation des conteneurs
    tl.fromTo(statsRefs.current,
      { opacity: 0, y: 50, scale: 0.8 },
      { 
        opacity: 1, 
        y: 0, 
        scale: 1, 
        duration: 0.6,
        stagger: 0.1,
        ease: "back.out(1.7)"
      }
    );

    // Animation des nombres avec comptage
    statsRefs.current.forEach((statRef, index) => {
      if (!statRef) return;

      const numberElement = statRef.querySelector('.stat-number') as HTMLElement;
      if (!numberElement) return;

      const targetNumber = parseInt(stats[index].number.replace(/\D/g, ''));
      const suffix = stats[index].suffix;
      
      const currentNumber = { value: 0 };
      
      gsap.to(currentNumber, {
        value: targetNumber,
        duration: 2,
        delay: 0.3 + index * 0.1,
        ease: "power2.out",
        onUpdate: () => {
          const value = Math.round(currentNumber.value);
          if (stats[index].number.includes('K')) {
            numberElement.textContent = `${(value / 1000).toFixed(value >= 1000 ? 0 : 1)}K${suffix}`;
          } else {
            numberElement.textContent = `${value}${suffix}`;
          }
        }
      });
    });

    // Animation de pulsation continue
    gsap.to(statsRefs.current, {
      scale: 1.02,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      stagger: 0.2
    });

  }, []);

  return (
    <div ref={containerRef} className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Trusted by Finance Professionals
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Our AI-powered platform delivers accurate, comprehensive financial analysis 
            that professionals trust for critical investment decisions.
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              ref={(el) => (statsRefs.current[index] = el)}
              className="text-center p-6 bg-background rounded-lg shadow-md hover:shadow-lg transition-shadow border"
            >
              <div className="stat-number text-3xl md:text-4xl font-bold text-primary mb-2">
                0
              </div>
              <div className="text-sm md:text-base text-muted-foreground font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};