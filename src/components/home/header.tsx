"use client";

import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Menu, MoveRight, X } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export const Header = () => {
  const navigationItems = [
    {
      title: "Home",
      href: "/",
      description: "",
    },
    {
      title: "Solutions",
      description: "AI-powered financial intelligence for smarter decisions",
      items: [
        {
          title: "Company Reports",
          href: "/solutions/reports",
        },
        {
          title: "Market Trends",
          href: "/solutions/trends",
        },
        {
          title: "Pricing Analysis",
          href: "/solutions/pricing",
        },
        {
          title: "Custom Dashboards",
          href: "/solutions/dashboards",
        },
      ],
    },
    {
      title: "Pricing",
      href: "/pricing",
      description: "",
    },
    {
      title: "Company",
      description: "Driving financial transparency through data",
      items: [
        {
          title: "About Us",
          href: "/about",
        },
        {
          title: "API Access",
          href: "/api",
        },
        {
          title: "Contact Sales",
          href: "/contact",
        },
      ],
    },
  ];

  const [isOpen, setOpen] = useState(false);
  
  return (
    <header className="w-full z-40 fixed top-0 left-0 bg-background border-b">
      <div className="container relative mx-auto min-h-20 flex gap-4 flex-row lg:grid lg:grid-cols-3 items-center">
        <div className="justify-start items-center gap-4 lg:flex hidden flex-row">
          <NavigationMenu className="flex justify-start items-start">
            <NavigationMenuList className="flex justify-start gap-4 flex-row">
              {navigationItems.map((item) => (
                <NavigationMenuItem key={item.title}>
                  {item.href ? (
                    <Link href={item.href} legacyBehavior passHref>
                      <NavigationMenuLink>
                        <Button variant="ghost">{item.title}</Button>
                      </NavigationMenuLink>
                    </Link>
                  ) : (
                    <>
                      <NavigationMenuTrigger className="font-medium text-sm">
                        {item.title}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent className="!w-[450px] p-4">
                        <div className="flex flex-col lg:grid grid-cols-2 gap-4">
                          <div className="flex flex-col h-full justify-between">
                            <div className="flex flex-col">
                              <p className="text-base font-medium">{item.title}</p>
                              <p className="text-muted-foreground text-sm">
                                {item.description}
                              </p>
                            </div>
                            <Button size="sm" className="mt-6 w-fit">
                              Request Demo
                            </Button>
                          </div>
                          <div className="flex flex-col text-sm h-full justify-end">
                            {item.items?.map((subItem) => (
                              <Link href={subItem.href} key={subItem.title} legacyBehavior passHref>
                                <NavigationMenuLink className="flex flex-row justify-between items-center hover:bg-muted py-2 px-4 rounded">
                                  <span>{subItem.title}</span>
                                  <MoveRight className="w-4 h-4 text-muted-foreground" />
                                </NavigationMenuLink>
                              </Link>
                            ))}
                          </div>
                        </div>
                      </NavigationMenuContent>
                    </>
                  )}
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        
        <div className="flex lg:justify-center">
          <Link href="/">
            <p className="font-bold text-lg">FinInsight<span className="text-primary">AI</span></p>
          </Link>
        </div>
        
        <div className="flex justify-end w-full gap-4">
          <Button variant="ghost" className="hidden md:inline">
            API Docs
          </Button>
          <div className="border-r hidden md:inline"></div>
          <Button variant="outline">Sign in</Button>
          <Button className="bg-primary hover:bg-primary/90">Get started</Button>
        </div>
        
        {/* Mobile menu */}
        <div className="flex w-12 shrink lg:hidden items-end justify-end">
          <Button variant="ghost" onClick={() => setOpen(!isOpen)}>
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
          {isOpen && (
            <div className="absolute top-20 border-t flex flex-col w-full right-0 bg-background shadow-lg py-4 container gap-8">
              {navigationItems.map((item) => (
                <div key={item.title}>
                  <div className="flex flex-col gap-2">
                    {item.href ? (
                      <Link
                        href={item.href}
                        className="flex justify-between items-center"
                        onClick={() => setOpen(false)}
                      >
                        <span className="text-lg">{item.title}</span>
                        <MoveRight className="w-4 h-4 stroke-1 text-muted-foreground" />
                      </Link>
                    ) : (
                      <p className="text-lg font-medium">{item.title}</p>
                    )}
                    {item.items &&
                      item.items.map((subItem) => (
                        <Link
                          key={subItem.title}
                          href={subItem.href}
                          className="flex justify-between items-center pl-4 py-1"
                          onClick={() => setOpen(false)}
                        >
                          <span className="text-muted-foreground">
                            {subItem.title}
                          </span>
                          <MoveRight className="w-4 h-4 stroke-1" />
                        </Link>
                      ))}
                  </div>
                </div>
              ))}
              <div className="flex flex-col gap-2 pt-4 border-t">
                <Button className="w-full">Sign in</Button>
                <Button variant="outline" className="w-full">
                  Request Demo
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
