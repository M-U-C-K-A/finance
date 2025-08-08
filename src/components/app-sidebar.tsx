"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Banknote, BarChart3, CreditCard, LayoutDashboard, Settings, Sparkles } from 'lucide-react'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useUser } from "./state/user-context"

const nav = [
  { href: "/overview", icon: LayoutDashboard, label: "Vue Globale" },
  { href: "/settings", icon: Settings, label: "Settings" },
  { href: "/billing", icon: CreditCard, label: "Billing" },
]

export function AppSidebar() {
  const pathname = usePathname()
  const { plan, credits } = useUser((s) => ({
    plan: s.plan,
    credits: s.credits,
  }))

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="px-2 py-2">
        <div className="flex items-center gap-2 rounded-md px-2 py-1.5">
          <Sparkles className="h-4 w-4" />
          <span className="text-sm font-semibold group-data-[collapsible=icon]:hidden">
            FinReports
          </span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {nav.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={pathname === item.href}>
                    <Link href={item.href} aria-current={pathname === item.href ? "page" : undefined}>
                      <item.icon />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/billing">
                    <Banknote />
                    <span>{"Recharger"}</span>
                  </Link>
                </SidebarMenuButton>
                {plan === "credits" ? (
                  <SidebarMenuBadge title="Crédits disponibles">
                    {credits}
                  </SidebarMenuBadge>
                ) : null}
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="px-2">
        <div className="flex items-center justify-between gap-2 rounded-md bg-muted/40 px-2 py-1.5">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            <span className={cn("text-xs", "group-data-[collapsible=icon]:hidden")}>
              {plan === "credits" ? "Mode Crédits" : "Abonnement actif"}
            </span>
          </div>
          {plan === "credits" ? (
            <Badge className="group-data-[collapsible=icon]:hidden">{credits} cr</Badge>
          ) : null}
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
