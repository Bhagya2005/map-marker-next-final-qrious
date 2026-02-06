"use client";

import { FormEvent } from "react";
import { AddCategoryModalProps } from "@/app/types";

export default function AddCategoryModal({
  newCat,
  setNewCat,
  onAddCategory,
  onClose,
}: AddCategoryModalProps) {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!newCat.name.trim()) return;

    onAddCategory(newCat);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[30000] flex items-center justify-center bg-black/60">
      <form
        onSubmit={handleSubmit}
        className="bg-zinc-900 p-6 rounded-2xl space-y-4 w-full max-w-sm"
      >
        <h2 className="text-lg font-bold text-white">Add Category</h2>

        <input
          type="text"
          placeholder="Category name"
          value={newCat.name}
          onChange={(e) =>
            setNewCat({ ...newCat, name: e.target.value })
          }
          className="w-full rounded-xl px-3 py-2 bg-zinc-800 text-white"
        />

        <input
          type="color"
          value={newCat.color}
          onChange={(e) =>
            setNewCat({ ...newCat, color: e.target.value })
          }
          className="w-full h-10 rounded-xl"
        />

        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-indigo-600 w-full py-2 rounded-xl"
          >
            Add
          </button>
          <button
            type="button"
            onClick={onClose}
            className="border w-full py-2 rounded-xl"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
