"use client";

import { AddCategoryModalProps } from "@/app/types";

export default function AddCategoryModal({newCat,setNewCat,onAddCategory,onClose}: AddCategoryModalProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newCat.name.trim()) return;
    onAddCategory(newCat);
    setNewCat({ name: "", color: newCat.color });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[20000] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md bg-zinc-900 rounded-3xl p-6 shadow-2xl flex flex-col gap-4">
        <button className="absolute top-4 right-4 text-xl font-bold text-white hover:text-red-500 z-50" onClick={onClose}>
          ✕
        </button>
        <h2 className="text-xl font-bold text-white">Add Category</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="flex sm:flex-row gap-2">
          <input
            type="text"
            placeholder="Category Name"
            value={newCat.name}
            onChange={(e) => setNewCat({ ...newCat, name: e.target.value })}
            className="w-full rounded-xl px-3 py-2 bg-zinc-800 text-white border border-gray-600 shadow-sm focus:ring-2 focus:ring-indigo-400 transition"
          />
          <input
            type="color"
            value={newCat.color}
            onChange={(e) => setNewCat({ ...newCat, color: e.target.value })}
            className="w-16 h-10 rounded-lg"
          />
          </div>
          <button className="bg-indigo-600 text-white py-2 rounded-2xl cursor-pointer">
            Save
          </button>
        </form>
      </div>
    </div>
  );
}