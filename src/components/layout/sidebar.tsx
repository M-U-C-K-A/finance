"use client";

import { Suspense, useState } from "react";
import { useSession, signOut } from "@/lib/auth-client";
import { useIsAdmin } from "@/hooks/use-admin";
import {
  Calendar,
  Home,
  FileText,
  CreditCard,
  BarChart2,
  Settings,
  PlusCircle,
  User2,
  ChevronUp,
  Coins,
  Repeat,
  Key,
  Code,
  Shield,
  History,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import Link from "next/link";
import { SignInModal } from "@/components/auth/signInModal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "../ui/skeleton";
import { ReportGeneratorDialog } from "@/components/reports/report-generator-dialog";

const menuItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Reports",
    url: "/reports",
    icon: BarChart2,
    subItems: [
      { title: "History", url: "/reports/history", icon: History },
      { title: "Generate Report", url: "/reports/generate", icon: PlusCircle },
      { title: "Recurring Reports", url: "/reports/recurring", icon: Repeat },
    ],
  },
  {
    title: "Plan",
    url: "/plan",
    icon: Calendar,
    subItems: [
      { title: "Current Plan", url: "/plan/current" },
      { title: "Buy Credits", url: "/plan/buy-credits" },
      { title: "Upgrade", url: "/plan/upgrade" },
      { title: "Billing", url: "/plan/billing" },
    ],
  },
  {
    title: "API", 
    url: "/api",
    icon: Code,
    requiresApiAccess: true,
    subItems: [
      { title: "Documentation", url: "/api/documentation", icon: FileText },
      { title: "API Keys", url: "/api/access", icon: Key },
    ],
  },
  {
    title: "Admin",
    url: "/admin",
    icon: Shield,
    requiresAdmin: true,
    subItems: [
      { title: "Dashboard", url: "/admin/dashboard", icon: BarChart2 },
      { title: "Analytics", url: "/admin/analytics", icon: BarChart2 },
      { title: "Users", url: "/admin/users", icon: User2 },
      { title: "Credits", url: "/admin/credits", icon: Coins },
      { title: "Reports", url: "/admin/reports", icon: FileText },
      { title: "Subscriptions", url: "/admin/subscriptions", icon: CreditCard },
    ],
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  const { data: session } = useSession();
  const { isAdmin } = useIsAdmin();
  const [modalOpen, setModalOpen] = useState(false);

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  return (
    <>
      <Sidebar className="bg-white dark:bg-gray-900 border-r dark:border-gray-800">
        <SidebarContent>
          <div className="p-4 mb-2">
            <h1 className="text-xl font-bold text-primary">FinAnalytics</h1>
          </div>

          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {menuItems
                  .filter(item => {
                    if (item.requiresApiAccess && !session?.user) return false; // TODO: check real API access
                    if (item.requiresAdmin && !isAdmin) return false; // Real admin verification
                    return true;
                  })
                  .map((item) => (
                  <SidebarMenuItem key={item.title}>
                    {item.subItems ? (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <SidebarMenuButton className="w-full flex items-center gap-2">
                            <item.icon className="w-5 h-5" />
                            <span>{item.title}</span>
                            <ChevronUp className="ml-auto transform rotate-180 w-4 h-4" />
                          </SidebarMenuButton>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent side="right" align="start" className="ml-1">
                          {item.subItems.map((subItem) => (
                            <DropdownMenuItem key={subItem.title} asChild>
                              <Link href={subItem.url} className="flex items-center gap-2">
                                {subItem.icon && <subItem.icon className="w-4 h-4" />}
                                {subItem.title}
                              </Link>
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    ) : (
                      <SidebarMenuButton asChild>
                        <Link href={item.url} className="flex items-center gap-2">
                          <item.icon className="w-5 h-5" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    )}
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup className="mt-6">
            <SidebarGroupLabel>Quick Actions</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link
                      href="/reports/generate"
                      className="bg-primary text-background hover:bg-primary/90 flex items-center gap-2 px-2 py-1 rounded"
                    >
                      <PlusCircle className="w-5 h-5" />
                      Generate Report
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link
                      href="/plan/buy-credits"
                      className="bg-green-600 text-white hover:bg-green-700 flex items-center gap-2 px-2 py-1 rounded"
                    >
                      <CreditCard className="w-5 h-5" />
                      Buy Credits
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <Suspense fallback={<Skeleton className="h-12 rounded-none" />}>

          <SidebarFooter className="p-2 border-t dark:border-gray-800">
            <SidebarMenu>
              <SidebarMenuItem>
                {session ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <SidebarMenuButton className="hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-2 w-full">
                        <Avatar>
                          <AvatarImage
                            src={
                              session.user?.image ??
                              `https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${session.user?.email}`
                            }
                            alt={"user avatar"}
                          />
                          <AvatarFallback>
                            {session.user?.email
                              ? session.user.email
                                .split("@")[0]
                                .slice(0, 2)
                                .toUpperCase()
                              : "  "}
                          </AvatarFallback>
                        </Avatar>

                        <span className="truncate">{session.user?.email}</span>
                        <ChevronUp className="ml-auto transform rotate-180 w-4 h-4" />
                      </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side="top" align="end" className="min-w-[220px]">
                      <DropdownMenuItem asChild>
                        <Link href="/account" className="flex items-center gap-2">
                          <User2 className="w-4 h-4" />
                          Profile
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/billing" className="flex items-center gap-2">
                          <CreditCard className="w-4 h-4" />
                          Billing
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/dashboard/terms" className="flex items-center gap-2">
                          <FileText className="w-4 h-4" />
                          Terms of Service
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-red-600 cursor-pointer"
                        onClick={async () => {
                          await signOut();
                          window.location.reload(); // Reload page after logout
                          // Or alternatively to redirect to home page:
                          // window.location.href = "/";
                        }}
                      >
                        Sign Out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <SidebarMenuButton
                    onClick={openModal}
                    className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">
                      <User2 className="w-4 h-4" />
                    </div>
                    <span>Sign In</span>
                  </SidebarMenuButton>
                )}
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Suspense>
      </Sidebar>

      <SignInModal onClose={closeModal} open={modalOpen} />
    </>
  );
}
