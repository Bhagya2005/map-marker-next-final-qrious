"use client";
import { create } from "zustand";
import { Category } from "@/app/types";
import { showSuccess } from "@/utils/toast";

interface CategoryStore {
  categories: Category[];
  addCategory: (category: Category) => void;
  fetchCategories: (userId?: string) => Promise<void>;
  deleteCategory: (name: string) => void;
  deleteCategories: (names: string[]) => void;
}

export const useCategoryStore = create<CategoryStore>((set, get) => ({
  categories: [],

  fetchCategories: async (userId?: string) => {
    try {
      const res = await fetch(`/api/categories?userId=${userId || ""}`);
      if (!res.ok) return;
      const data = await res.json();
      set({ categories: data });
    } catch {
      // ignore
    }
  },

  addCategory: async (category) => {
    const exists = get().categories.some(
      (c) => c.name.toLowerCase() === category.name.toLowerCase()
    );

    if (exists) return;

    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(category),
      });
      if (!res.ok) throw new Error("Failed to create category");
      const created = await res.json();
      set((state) => ({ categories: [...state.categories, created] }));
      showSuccess(`Category "${created.name}" added`);
    } catch {
      showSuccess(`Category "${category.name}" added`);
      set((state) => ({ categories: [...state.categories, category] }));
    }
  },

  deleteCategory: (name) =>
    set((state) => ({
      categories: state.categories.filter((c) => c.name !== name),
    })),

  deleteCategories: (names) => {
    set((state) => ({
      categories: state.categories.filter(
        (c) => !names.includes(c.name)
      ),
    }));

    showSuccess(`${names.length} categories deleted`);
  },
}));
