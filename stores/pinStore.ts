"use client";

import { create } from "zustand";
import { showSuccess, showError } from "@/utils/toast";

export interface pin {
  _id: string;
  name: string;
  category: string;
  lat: number;
  lng: number;
  color?: string;
  description?: string;
  images?: string[];
  privacy?: string;
  userId?: string;
}

interface PinStore {
  pins: pin[];
  pinsPage: number;
  pinsTotalPages: number;
  pinsSearch: string;
  pinsCategory: string;
  pinForm: any;
  editingPinId: string | null;

  fetchPins: (userId?: string) => Promise<void>;
  savePin: () => Promise<void>;
  deletePin: (id: string) => Promise<void>;
}

export const usePinStore = create<PinStore>((set, get) => ({
  pins: [],
  pinsPage: 1,
  pinsTotalPages: 1,
  pinsSearch: "",
  pinsCategory: "",
  pinForm: {},
  editingPinId: null,

  fetchPins: async (userId?: string) => {
    try {
      const { pinsPage, pinsSearch, pinsCategory } = get();
      let url = `/api/pins?page=${pinsPage}&search=${pinsSearch}&category=${pinsCategory}`;
      if (userId) url += `&userId=${userId}`;
      const res = await fetch(url);
      const data = await res.json();
      const normalized = Array.isArray(data.pins)
        ? data.pins.map((p: any) => ({
            _id: p._id || p.id,
            name: p.name,
            category: p.category,
            lat: Number(p.lat),
            lng: Number(p.lng),
            color: p.color,
            description: p.description,
            userId: p.userId,
            images: p.images || [],
            privacy: p.privacy || 'public',
          }))
        : [];

      set({ pins: normalized, pinsTotalPages: data.totalPages });
    } catch {
      showError("Pins fetch failed");
    }
  },

  savePin: async () => {
    const { editingPinId, pinForm, pins } = get();
    try {
      const method = editingPinId ? "PATCH" : "POST";
      const url = editingPinId ? `/api/pins/${editingPinId}` : "/api/pins";

      const payload = {
        ...pinForm,
        lat: Number(pinForm.lat),
        lng: Number(pinForm.lng),
        images: Array.isArray(pinForm.images) ? pinForm.images : [],
        privacy: pinForm.privacy || 'public',
      };

      console.log("Saving pin with payload:", { ...payload, images: payload.images?.length || 0 });

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        let errMsg = `Request failed (${res.status})`;
        try {
          const errBody = await res.json();
          errMsg = errBody?.error || errBody?.message || errMsg;
        } catch {}
        console.error("Save pin error:", errMsg);
        showError(errMsg);
        return;
      }

      const saved = await res.json();

      if (editingPinId) {
        const updated = pins.map((p) => (p._id === saved._id ? saved : p));
        set({ pins: updated, editingPinId: null, pinForm: {} });
      } else {
        set({ pins: [saved, ...pins], pinForm: {} });
      }

      showSuccess("Pin saved");
    } catch (err) {
      console.error(err);
      showError("Failed to save pin");
    }
  },

  deletePin: async (id: string) => {
    if (!confirm("Delete pin?")) return;
    try {
      // find userId of the pin so we re-fetch correctly scoped pins after deletion
      const { pins } = get();
      const pin = pins.find((p) => p._id === id);
      const userId = pin?.userId;

      await fetch(`/api/pins/${id}`, { method: "DELETE" });
      showSuccess("Deleted");
      await get().fetchPins(userId as any);
    } catch {
      showError("Failed to delete pin");
    }
  },
}));
