"use client";

import { useEffect, useState } from "react";
import { pin, Category } from "@/app/types";

export function useWalkthrough(
  loaded: boolean,
  user: any,
  pins: pin[],
  categories: Category[]
) {
  const [showTour, setShowTour] = useState(true);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!loaded || !user) return;
    const seen = localStorage.getItem("hasSeenTour");
    if (pins.length === 0 && categories.length === 0 && !seen) {
      setShowTour(true);
    }
  }, [loaded, user, pins.length, categories.length]);

  const closeTour = () => {
    localStorage.setItem("hasSeenTour", "true");
    setShowTour(false);
  };

  return { showTour, closeTour, open, setOpen };
}
