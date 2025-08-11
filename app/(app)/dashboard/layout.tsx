"use client";
import { ReactNode } from "react";
import { useSession } from "@/lib/auth-client";
import Unauthorized from "./unauthorized";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const user = useSession();

  if (!user) {
    return <Unauthorized />;
  }

  return (
    <div className="dashboard-layout">
      {children}
    </div>
  );
}

