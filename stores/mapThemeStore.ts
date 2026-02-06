"use client";

import { create } from "zustand";

interface MapThemeState {
  mapTheme: "dark" | "light";
  setMapTheme: (theme: "dark" | "light") => void;
  bootstrapTheme: () => void;
}

export const useMapThemeStore = create<MapThemeState>((set) => ({
  mapTheme: "dark",
  
  setMapTheme: (theme) => {
    localStorage.setItem("mapTheme", theme);
    set({ mapTheme: theme });
  },

  bootstrapTheme: () => {
    const saved = localStorage.getItem("mapTheme") as "dark" | "light" | null;
    set({ mapTheme: saved || "dark" });
  },
}));
