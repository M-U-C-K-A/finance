"use client";

import { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";

export function useIsAdmin() {
  const { data: session, isPending } = useSession();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (isPending) return;
      
      if (!session?.user) {
        setIsAdmin(false);
        setIsLoading(false);
        return;
      }

      try {
        // Vérifier en appelant une API protégée admin
        const response = await fetch("/api/admin/check");
        setIsAdmin(response.status === 200);
      } catch (error) {
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminStatus();
  }, [session, isPending]);

  return { isAdmin, isLoading };
}