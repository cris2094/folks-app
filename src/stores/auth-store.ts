import { create } from "zustand";
import type { UserRole } from "@/types/database";

interface AuthState {
  userId: string | null;
  tenantId: string | null;
  role: UserRole | null;
  isLoading: boolean;
  setAuth: (userId: string, tenantId: string, role: UserRole) => void;
  clearAuth: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  userId: null,
  tenantId: null,
  role: null,
  isLoading: true,
  setAuth: (userId, tenantId, role) =>
    set({ userId, tenantId, role, isLoading: false }),
  clearAuth: () =>
    set({ userId: null, tenantId: null, role: null, isLoading: false }),
  setLoading: (isLoading) => set({ isLoading }),
}));
