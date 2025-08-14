// components/layout/app-layout.tsx

import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { getUser } from "@/lib/auth-server";
import Unauthorized from "@/components/layout/unauthorized";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const user = await getUser()
  if (!user) {
    return  (

      <SidebarProvider>
        <div className="flex flex-1 overflow-hidden">
          <AppSidebar />
          <div className="flex-1 h-screen flex flex-col overflow-auto">
            <Header />
            <main className="flex-1">

              <Unauthorized />
            </main>
          </div>
        </div>
      </SidebarProvider>
    )
  }

  return (
    <SidebarProvider>
      <div className="flex flex-1 overflow-hidden">
        <AppSidebar />
        <div className="flex-1 h-screen flex flex-col overflow-auto">
          <Header />
          <main className="flex-1">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
