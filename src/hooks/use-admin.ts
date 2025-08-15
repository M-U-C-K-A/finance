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
        // Vérifier directement le rôle utilisateur dans la DB
        const response = await fetch(`/api/user/role`);
        if (response.ok) {
          const { role } = await response.json();
          setIsAdmin(role === 'ADMIN');
        } else {
          setIsAdmin(false);
        }
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