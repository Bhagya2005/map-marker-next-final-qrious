"use client";
import { create } from "zustand";

interface TourStore {
  showTour: boolean;
  openTour: boolean;
  closeTour: () => void;
  setOpenTour: (v: boolean) => void;
}

export const useTourStore = create<TourStore>((set) => ({
  showTour: true,
  openTour: false,
  closeTour: () => {
    localStorage.setItem("hasSeenTour", "true");
    set({ showTour: false });
  },
  setOpenTour: (v) => set({ openTour: v }),
}));
