"use client";

import { useState } from "react";
import { useSession, signOut } from "@/lib/auth-client";
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
  Code,
  BookOpen,
  Zap,
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
import SignInModal from "@/components/auth/signInModal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const menuItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Reports",
    url: "/dashboard/reports",
    icon: BarChart2,
    subItems: [
      { title: "History", url: "/reports/history" },
      { title: "New Report", url: "/reports/new", icon: PlusCircle },
    ],
  },
  {
    title: "Subscribe",
    url: "/dashboard/subscriptions",
    icon: Calendar,
  },
  {
    title: "Terms of Service",
    url: "/dashboard/terms",
    icon: FileText,
  },
  {
    title: "API",
    url: "/dashboard/api",
    icon: Code,
    subItems: [
      { title: "API Access", url: "/dashboard/api/access", icon: Zap },
      { title: "Documentation", url: "/dashboard/api/documentation", icon: BookOpen },
    ],
  },
  {
    title: "Settings",
    url: "/dashboard/settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  const { data: session } = useSession();
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
                {menuItems.map((item) => (
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
            <SidebarGroupLabel>Actions Rapides</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link
                      href="/reports/new"
                      className="bg-primary text-background hover:bg-primary-dark flex items-center gap-2 px-2 py-1 rounded"
                    >
                      <PlusCircle className="w-5 h-5" />
                      Nouvelle Analyse
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link
                      href="/credits/add"
                      className="bg-green-600 text-white hover:bg-green-700 flex items-center gap-2 px-2 py-1 rounded"
                    >
                      <CreditCard className="w-5 h-5" />
                      Recharger Crédits
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="p-2 border-t dark:border-gray-800">
          <SidebarMenu>
            <SidebarMenuItem>
              {session ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuButton className="hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-2 w-full">
                      <Avatar>
                        <AvatarImage src={session.user?.image ?? "/default-avatar.png"} alt={"avatar de l'utilisateur"} />
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
                        Profil
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/billing" className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4" />
                        Facturation
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/terms" className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Conditions d'utilisation
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-red-600 cursor-pointer"
                      onClick={() => signOut()}
                    >
                      Déconnexion
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
                  <span>Se connecter</span>
                </SidebarMenuButton>
              )}
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      {modalOpen && <SignInModal onClose={closeModal} />}
    </>
  );
}
