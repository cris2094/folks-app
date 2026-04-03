"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/stores/auth-store";
import type { User } from "@supabase/supabase-js";

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const { setAuth, clearAuth, setLoading } = useAuthStore();

  useEffect(() => {
    const supabase = createClient();

    const getUser = async () => {
      setLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setUser(user);
        const tenantId =
          (user.app_metadata?.tenant_id as string) ?? null;
        const role =
          (user.app_metadata?.user_role as string) ?? "residente";
        if (tenantId) {
          setAuth(
            user.id,
            tenantId,
            role as "admin" | "residente" | "portero" | "super_admin",
          );
        }
      } else {
        clearAuth();
      }
      setLoading(false);
    };

    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (!session?.user) clearAuth();
    });

    return () => subscription.unsubscribe();
  }, [setAuth, clearAuth, setLoading]);

  return user;
}
