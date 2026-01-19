import { create } from "zustand";
import type { AuthUser, pin, Category } from "@/app/types";

interface AuthStore {
  user: AuthUser | null;
  pins: pin[];
  categories: Category[];
  loading: boolean;

  setUser: (user: AuthUser | null) => void;
  setPins: (pins: pin[]) => void;
  setCategories: (cats: Category[]) => void;
  setLoading: (value: boolean) => void;
  bootstrapUser: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  pins: [],
  categories: [],
  loading: true,

  setUser: (user) => set({ user }),
  setPins: (pins) => set({ pins }),
  setCategories: (categories) => set({ categories }),
  setLoading: (loading) => set({ loading }),

  bootstrapUser: () => {
    const token = localStorage.getItem("token");
    const u = localStorage.getItem("user");
    if (token && u) {
      set({ user: JSON.parse(u), loading: false });
    } else {
      set({ user: null, loading: false });
    }
  },
}));
