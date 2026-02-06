"use client";
import { useCategoryStore } from "@/stores/categoryStore";
import { useState } from "react";

export default function DeleteCategoryModal({ onClose }: { onClose: () => void }) {
  const { categories, deleteCategories } = useCategoryStore();

  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (name: string) => {
    setSelected((prev) =>
      prev.includes(name)
        ? prev.filter((c) => c !== name)
        : [...prev, name]
    );
  };

  const handleDelete = () => {
    if (selected.length === 0) return;
    deleteCategories(selected);
    onClose();
  };

  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-[40000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-zinc-900 rounded-3xl p-6 shadow-2xl flex flex-col gap-4">
        <h2 className="text-xl font-bold text-white">Delete Categories</h2>

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search category..."
          className="w-full rounded-xl px-3 py-2 bg-zinc-800 text-white"
        />

        <div className="max-h-64 overflow-y-auto flex flex-col gap-2">
          {filtered.length === 0 ? (
            <p className="text-center text-gray-400 text-sm py-8">
              No category available
            </p>
          ) : (
            filtered.map((c) => (
              <label
                key={c.name}
                className="flex gap-3 p-2 rounded-xl cursor-pointer hover:bg-zinc-800"
              >
                <input
                  type="checkbox"
                  checked={selected.includes(c.name)}
                  onChange={() => toggle(c.name)}
                  className="accent-red-500"
                />
                <span className="flex-1 text-white">{c.name}</span>
                <span
                  className="w-4 h-4 rounded-full border"
                  style={{ backgroundColor: c.color }}
                />
              </label>
            ))
          )}
        </div>

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 border rounded-xl">
            Cancel
          </button>
          <button
            disabled={selected.length === 0}
            onClick={handleDelete}
            className={`px-4 py-2 rounded-xl text-white ${
              selected.length
                ? "bg-red-600 hover:bg-red-500"
                : "bg-red-300 cursor-not-allowed"
            }`}
          >
            Delete ({selected.length})
          </button>
        </div>
      </div>
    </div>
  );
}
