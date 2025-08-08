"use client";

import { useEffect, useState } from "react";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { BarChart, LineChart, PieChart } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const Testimonials = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setTimeout(() => {
      if (api.selectedScrollSnap() + 1 === api.scrollSnapList().length) {
        setCurrent(0);
        api.scrollTo(0);
      } else {
        api.scrollNext();
        setCurrent(current + 1);
      }
    }, 4000);
  }, [api, current]);

  const testimonials = [
    {
      icon: <BarChart className="w-8 h-8 stroke-1" />,
      title: "Game-changing insights",
      quote: "Reduced our market research time by 80% while getting more comprehensive data than ever before.",
      name: "Sarah Chen",
      role: "CFO, TechStart Inc.",
      avatar: "/avatars/sarah-chen.jpg"
    },
    {
      icon: <LineChart className="w-8 h-8 stroke-1" />,
      title: "Indispensable tool",
      quote: "The pricing trend analysis helped us optimize our SaaS pricing strategy, increasing ARR by 22% in Q2.",
      name: "Michael Rodriguez",
      role: "Head of Strategy, CloudScale",
      avatar: "/avatars/michael-rodriguez.jpg"
    },
    {
      icon: <PieChart className="w-8 h-8 stroke-1" />,
      title: "Exceptional depth",
      quote: "Finally found a platform that gives us the complete financial picture of competitors we need for fundraising.",
      name: "Emma Johansson",
      role: "Investment Director, Nordic Ventures",
      avatar: "/avatars/emma-johansson.jpg"
    }
  ];

  return (
    <div className="w-full py-10 lg:py-20 bg-muted/20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col gap-10">
          <h2 className="text-3xl md:text-5xl tracking-tighter lg:max-w-2xl font-regular text-left">
            Trusted by finance teams and investors
          </h2>
          <Carousel setApi={setApi} className="w-full">
            <CarouselContent>
              {testimonials.map((testimonial, index) => (
                <CarouselItem className="lg:basis-1/2" key={index}>
                  <div className="bg-background border rounded-lg h-full p-6 aspect-video flex justify-between flex-col">
                    {testimonial.icon}
                    <div className="flex flex-col gap-4">
                      <div className="flex flex-col">
                        <h3 className="text-xl tracking-tight font-medium">
                          {testimonial.title}
                        </h3>
                        <p className="text-muted-foreground text-base">
                          {testimonial.quote}
                        </p>
                      </div>
                      <div className="flex flex-row gap-3 items-center">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={testimonial.avatar} />
                          <AvatarFallback>
                            {testimonial.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">{testimonial.name}</span>
                          <span className="text-xs text-muted-foreground">{testimonial.role}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </div>
    </div>
  );
};
