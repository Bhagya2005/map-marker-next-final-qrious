"use client";
import { create } from "zustand";
import { showSuccess, showError } from "@/utils/toast";
import type { AuthUser } from "@/app/types";
import { useCurrentUserStore } from "./currentUserStore";

interface AuthStore {
  user: AuthUser | null;
  loading: boolean;
  initialized?: boolean;
  setUser: (user: AuthUser | null) => void;
  setLoading: (v: boolean) => void;
  bootstrapUser: () => void;
  login: (email: string, password: string) => Promise<void>;
  signup: (payload: any, router: any) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  loading: true,
  initialized: false,
  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),
  bootstrapUser: () => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    const parsed = token && user ? JSON.parse(user) : null;
    set({
      user: parsed,
      loading: false,
      initialized: true,
    });
    useCurrentUserStore.setState({ user: parsed, loading: false, initialized: true } as any);
  },
  login: async (email, password) => {
    if (!email || !password) return showError("Email & password required");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) return showError(data.message || "Login failed");

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      set({ user: data.user, loading: false, initialized: true });
      useCurrentUserStore.setState({ user: data.user, loading: false, initialized: true } as any);
      showSuccess("Login successful");
    } catch {
      showError("Login error");
    }
  },
  signup: async (payload, router) => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) return showError(data.message);
      showSuccess("Account created");
      router.push("/login");
    } catch {
      showError("Signup failed");
    }
  },
  logout: () => {
    localStorage.clear();
    set({ user: null, initialized: false });
    useCurrentUserStore.setState({ user: null, loading: false, initialized: false } as any);
  },
}));
