//what I Learn ?

//In Css :
//overflow-x-hidden :  Element ke horizontal (left–right) overflow ko hide karta hai


"use client";
import { CategoryFilterModalProps } from "@/app/types";
import { useState } from "react";

export default function CategoryFilterModal({categories,selectedCategories,setSelectedCategories,onClose}: CategoryFilterModalProps) {
  const [tempSelected, setTempSelected] = useState<string[]>(selectedCategories);
  const [search, setSearch] = useState("");

  const toggleCategory = (name: string) => {
    if (tempSelected.includes(name)) {
      setTempSelected(tempSelected.filter((c) => c !== name));
    } else {
      setTempSelected([...tempSelected, name]);
    }
  };

  const handleOk = () => {
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
    <div className="fixed inset-0 z-[30000] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-x-hidden">
      <div className="relative w-full max-w-md bg-zinc-900 rounded-3xl p-6 shadow-2xl flex flex-col gap-4 overflow-x-hidden">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">
            Filter Categories
          </h2>
          <button
            onClick={onClose}
            className="text-gray-300 font-bold text-xl hover:text-white"
          >
            ✕
          </button>
        </div>

        <input
          type="text"
          placeholder="Search categories..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl px-3 py-2 border text-white bg-zinc-800"
        />

        <div className="flex flex-col gap-2 max-h-72 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-indigo-700 scrollbar-track-zinc-800">
          {filteredCategories.map((c) => (
            <div key={c.name} className="flex items-start gap-2 p-2">
              <input
                type="checkbox"
                checked={tempSelected.includes(c.name)}
                onChange={() => toggleCategory(c.name)}
                className="accent-indigo-400 mt-1"
              />
              <span className="font-medium text-white break-words w-full">
                {c.name}
              </span>
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-2 mt-2">
          <button
            onClick={handleReset}
            className="px-4 py-2 rounded-xl border border-gray-300  text-white hover:bg-red-500/10"
          >
            Reset
          </button>

          <button
            onClick={handleOk}
            className="px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 transition"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}
