import { ReactNode } from "react";
import { getAuthUser } from "@/lib/auth-helper";
import Unauthorized from "./unauthorized";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const user = await getAuthUser();

  if (!user) {
    return <Unauthorized />;
  }

  return (
    <div className="dashboard-layout">
      {children}
    </div>
  );
}
