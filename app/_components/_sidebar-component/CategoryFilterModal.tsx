"use client";
import { CategoryFilterModalProps } from "@/app/types";
import { useState } from "react";

export default function CategoryFilterModal({
  categories = [],
  selectedCategories = [],
  setSelectedCategories,
  onClose,
}: CategoryFilterModalProps) {
  const [tempSelected, setTempSelected] = useState<string[]>(
    selectedCategories
  );
  const [search, setSearch] = useState("");

  const toggleCategory = (name: string) => {
    setTempSelected((prev) =>
      prev.includes(name)
        ? prev.filter((c) => c !== name)
        : [...prev, name]
    );
  };

  const handleApply = () => {
    setSelectedCategories(tempSelected);
    onClose();
  };

  const handleReset = () => {
    setTempSelected([]);
    setSelectedCategories([]);
    onClose();
  };

  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-[40000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-zinc-900 rounded-3xl p-6 shadow-2xl flex flex-col gap-4 overflow-x-hidden">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">
            Filter Categories
          </h2>
          <button
            onClick={onClose}
            className="text-xl font-bold text-gray-500 hover:text-white"
          >
            ✕
          </button>
        </div>

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search category..."
          className="w-full rounded-xl px-3 py-2 border bg-zinc-800 text-white"
        />

        <div className="max-h-64 overflow-y-auto flex flex-col gap-2">
          {filteredCategories.length === 0 ? (
            <p className="text-center text-gray-400 text-sm py-8">
              No category found
            </p>
          ) : (
            filteredCategories.map((c) => (
              <label
                key={c.name}
                className="flex items-start gap-3 p-2 rounded-xl cursor-pointer hover:bg-zinc-800"
              >
                <input
                  type="checkbox"
                  checked={tempSelected.includes(c.name)}
                  onChange={() => toggleCategory(c.name)}
                  className="accent-indigo-500 mt-1 shrink-0"
                />

                <span className="flex-1 text-white break-words">
                  {c.name}
                </span>

                <span
                  className="w-4 h-4 rounded-full border shrink-0 mt-1"
                  style={{ backgroundColor: c.color }}
                />
              </label>
            ))
          )}
        </div>

        <div className="flex justify-end gap-2 mt-2">
          <button
            onClick={handleReset}
            className="px-4 py-2 rounded-xl border text-gray-300"
          >
            Reset
          </button>

          <button
            disabled={tempSelected.length === 0}
            onClick={handleApply}
            className={`px-4 py-2 rounded-xl text-white transition
              ${
                tempSelected.length
                  ? "bg-indigo-600 hover:bg-indigo-500"
                  : "bg-indigo-300 cursor-not-allowed"
              }`}
          >
            Apply ({tempSelected.length})
          </button>
        </div>
      </div>
    </div>
  );
}
