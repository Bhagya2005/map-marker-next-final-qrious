"use client";

import { create } from "zustand";

interface User {
  email: string;
  username?: string;
}

interface CurrentUserState {
  user: User | null;
  loading: boolean;
  initialized: boolean;
  bootstrapUser: () => void;
}

export const useCurrentUserStore = create<CurrentUserState>((set) => ({
  user: null,
  loading: true,
  initialized: false,
  bootstrapUser: () => {
    const saved = localStorage.getItem("user");
    if (saved) set({ user: JSON.parse(saved) });
    set({ loading: false, initialized: true });
  },
}));
