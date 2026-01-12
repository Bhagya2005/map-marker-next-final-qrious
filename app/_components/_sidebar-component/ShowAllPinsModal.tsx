//what I Learn ?
// filtering 
//  onChange={(e) => setFilterBy(e.target.value as "name" | "category" | "color")} => onchange me e.taarget.value ko options me se select karna 

"use client";
import { useState } from "react";
import { ShowAllPinsModalProps } from "@/app/types";

export default function ShowAllPinsModal({ pins, onClose }: ShowAllPinsModalProps) {
  const [search, setSearch] = useState("");
  const [filterBy, setFilterBy] = useState<"name" | "category" | "color">("name");

  const filteredPins = pins.filter((p) => {
    if (!search) return true;
    const term = search.toLowerCase();
    if (filterBy === "name") return p.name.toLowerCase().includes(term);
    if (filterBy === "category") return p.category.toLowerCase().includes(term);
    if (filterBy === "color") return p.color.toLowerCase().includes(term);
    return false;
  });

  const highlightText = (text: string, search: string) => {
    if (!search) return text;

    const regex = new RegExp(`(${search})`, "gi");
    const parts = text.split(regex);
    console.log(regex);
    console.log(parts);

    return parts.map((part, index) =>
      part.toLowerCase() === search.toLowerCase() ? (
        <span key={index} className="bg-yellow-300 text-black px-1 rounded">
          {part}
        </span>
      ) : (
        part
      )
    );
  };
  
  return (
    <div className="fixed inset-0 z-[40000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-auto min-h-screen text-white/50">
      <div className="w-full sm:max-w-3xl bg-zinc-900 rounded-3xl shadow-2xl p-6 flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">All Pins</h2>
          <button
            onClick={onClose}
            className="text-gray-300 font-bold text-xl hover:text-white"
          >
            ✕
          </button>
        </div>
        <div className="flex gap-2 items-center">
          <select
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value as "name" | "category" | "color")}
            className="rounded-xl px-3 py-2 border border-gray-300 bg-white text-black"
          >
            <option value="name">Name</option>
            <option value="category">Category</option>
            <option value="color">Color</option>
          </select>

          <input
            type="text"
            placeholder={`Search by ${filterBy}...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 rounded-xl px-3 py-2 border border-gray-600 text-white"
          />
        </div>
        <div className="hidden sm:block overflow-auto max-h-[60vh]  border border-gray-700 rounded-lg">
          <table className="w-full table-auto border-collapse text-sm">
            <thead>
              <tr className="sticky top-0 z-20 bg-zinc-800 ">
                <th className="border px-2 py-1 text-left">Name</th>
                <th className="border px-2 py-1 text-left">Category</th>
                <th className="border px-2 py-1 text-left">Color</th>
                <th className="border px-2 py-1 text-left">Latitude</th>
                <th className="border px-2 py-1 text-left">Longitude</th>
              </tr>
            </thead>
            <tbody>
              {filteredPins.map((p) => (
                <tr
                  key={p.id}
                  className="hover:bg-zinc-700 break-words"
                >
                  <td className="border px-2 py-1 max-w-[150px]">{filterBy === "name" ? highlightText(p.name, search) : p.name}</td>
                  <td className="border px-2 py-1 max-w-[100px]">{filterBy === "category" ? highlightText(p.category, search) : p.category}</td>
                  <td className="border px-2 py-1">
                    <span
                      className="inline-block w-4 h-4 rounded-full border"
                      style={{ backgroundColor: p.color }}
                    ></span>{" "}
                  {filterBy === "color" ? highlightText(p.color, search) : p.color}
                  </td>
                  <td className="border px-2 py-1">{p.lat.toFixed(5)}</td>
                  <td className="border px-2 py-1">{p.lng.toFixed(5)}</td>
                </tr>
              ))}
              {filteredPins.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-4 text-gray-500">
                    No pins found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="sm:hidden flex flex-col gap-3 max-h-[60vh] overflow-y-auto">
          {filteredPins.map((p) => (
            <div
              key={p.id}
              className="bg-zinc-800 p-3 rounded-2xl flex flex-col gap-1 break-words"
            >
              <p className="text-sm text-white">{filterBy === "name" ? highlightText(p.name, search) : p.name}</p>
              <p className="text-sm text-gray-300">
                Category: <span className="font-medium">{filterBy === "category" ? highlightText(p.category, search) : p.category}</span>
              </p>
              <p className="text-sm text-gray-300 flex items-center gap-1">
                Color:{" "}
                <span
                  className="inline-block w-4 h-4 rounded-full border"
                  style={{ backgroundColor: p.color }}
                ></span>{" "}
               {filterBy === "color" ? highlightText(p.color, search) : p.color}
              </p>
              <p className="text-sm text-gray-300">
                Latitude: {p.lat.toFixed(5)}
              </p>
              <p className="text-sm text-gray-300">
                Longitude: {p.lng.toFixed(5)}
              </p>
            </div>
          ))}
          {filteredPins.length === 0 && (
            <p className="text-center py-4 text-gray-500">No pins found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
