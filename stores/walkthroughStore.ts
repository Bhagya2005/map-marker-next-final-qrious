"use client";
import { create } from "zustand";
import { arrayMove } from "@dnd-kit/sortable";
import { showSuccess } from "@/utils/toast";

interface Walkthrough {
  _id?: string;
  title: string;
  description?: string;
  videoUrl?: string;
}

interface WalkthroughStore {
  walkthroughs: Walkthrough[];
  walkthroughPage: number;
  walkthroughTotalPages: number;
  walkthroughForm: Walkthrough;
  editingWalkthroughId: string | null;
  showTour: boolean;

  fetchWalkthroughs: (page?: number) => Promise<void>;
  saveWalkthrough: () => Promise<void>;
  deleteWalkthrough: (id: string) => Promise<void>;
  reorderWalkthroughs: (activeId: string, overId: string) => Promise<void>;
  setWalkthroughForm: (d: Walkthrough) => void;
  setOpenTour: (v: boolean) => void;
}

export const useWalkthroughStore = create<WalkthroughStore>((set, get) => ({
  walkthroughs: [],
  walkthroughPage: 1,
  walkthroughTotalPages: 1,
  walkthroughForm: { title: "", description: "", videoUrl: "" },
  editingWalkthroughId: null,
  showTour: false,

  fetchWalkthroughs: async (page) => {
    if (page) set({ walkthroughPage: page });
    const { walkthroughPage } = get();
    try {
      const res = await fetch(`/api/walkthroughs?page=${walkthroughPage}`);
      const data = await res.json();
      set({ walkthroughs: data.walkthroughs, walkthroughTotalPages: data.totalPages });
    } catch (err) {
      console.error("Failed to fetch walkthroughs", err);
    }
  },

  saveWalkthrough: async () => {
    const { editingWalkthroughId, walkthroughForm } = get();
    const method = editingWalkthroughId ? "PATCH" : "POST";
    const url = editingWalkthroughId ? `/api/walkthroughs/${editingWalkthroughId}` : "/api/walkthroughs";

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(walkthroughForm),
    });
    showSuccess("Saved successfully");
    get().fetchWalkthroughs();
  },

  deleteWalkthrough: async (id: string) => {
    if (!confirm("Delete walkthrough?")) return;
    await fetch(`/api/walkthroughs/${id}`, { method: "DELETE" });
    showSuccess("Deleted successfully");
    get().fetchWalkthroughs();
  },

  reorderWalkthroughs: async (activeId: string, overId: string) => {
    const items = get().walkthroughs;
    const oldIndex = items.findIndex((i) => i._id === activeId);
    const newIndex = items.findIndex((i) => i._id === overId);
    const ordered = arrayMove(items, oldIndex, newIndex);
    set({ walkthroughs: ordered });

    await fetch("/api/walkthroughs", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderedIds: ordered.map((w) => w._id) }),
    });
  },

  setWalkthroughForm: (d) => set({ walkthroughForm: d }),
  setOpenTour: (v) => set({ showTour: v }),
}));
