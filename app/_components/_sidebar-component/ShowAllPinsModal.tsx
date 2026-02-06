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

    return parts.map((part, index) =>
      part.toLowerCase() === search.toLowerCase() ? (
        <span key={index} className="bg-indigo-500 text-white px-1 rounded">
          {part}
        </span>
      ) : (
        part
      )
    );
  };
  
  return (
    <div className="fixed inset-0 z-[40000] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-auto min-h-screen text-zinc-300">
      <div className="w-full sm:max-w-4xl bg-[#0f1113] border border-white/10 rounded-[2rem] shadow-2xl flex flex-col overflow-hidden">

        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-[#16181a]">
          <div>
            <h2 className="text-xl font-black text-white ">
               All Pins Detail
            </h2>
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">Total Records: {filteredPins.length}</p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-zinc-800 text-zinc-400 hover:bg-red-500 hover:text-white transition-all"
          >
            ✕
          </button>
        </div>

        <div className="p-6 bg-[#0f1113] flex flex-wrap gap-4 items-center">
          <div className="flex bg-zinc-900 rounded-2xl border border-zinc-800 p-1">
            {["name", "category", "color"].map((option) => (
              <button
                key={option}
                onClick={() => setFilterBy(option as any)}
                className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  filterBy === option 
                  ? "bg-indigo-600 text-white shadow-lg" 
                  : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {option}
              </button>
            ))}
          </div>

          <div className="flex-1 relative">
            <input
              type="text"
              placeholder={`Quick search by ${filterBy}...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl px-5 py-3 text-sm focus:border-indigo-500 outline-none transition-all placeholder:text-zinc-700"
            />
          </div>
        </div>

        <div className="hidden sm:block overflow-auto max-h-[50vh] px-6 pb-6">
          <table className="w-full text-left border-separate border-spacing-y-2">
            <thead>
              <tr className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">
                <th className="px-4 py-2">Label</th>
                <th className="px-4 py-2">Category</th>
                <th className="px-4 py-2">Identity</th>
                <th className="px-4 py-2">Coordinates</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {filteredPins.map((p) => (
                <tr
                  key={p._id || p.id} // FIX: Using _id as primary key
                  className="bg-[#16181a] hover:bg-zinc-800/50 transition-colors group"
                >
                  <td className="px-4 py-4 rounded-l-2xl border-y border-l border-white/5 font-bold text-zinc-200">
                    {filterBy === "name" ? highlightText(p.name, search) : p.name}
                  </td>
                  <td className="px-4 py-4 border-y border-white/5">
                    <span className="bg-zinc-800 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                      {filterBy === "category" ? highlightText(p.category, search) : p.category}
                    </span>
                  </td>
                  <td className="px-4 py-4 border-y border-white/5">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full border border-white/10 shadow-sm" style={{ backgroundColor: p.color }} />
                      <span className="font-mono text-xs text-zinc-500 lowercase">
                        {filterBy === "color" ? highlightText(p.color, search) : p.color}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4 rounded-r-2xl border-y border-r border-white/5 text-xs font-mono text-zinc-500">
                    <span className="text-indigo-400/50">lat:</span> {p.lat.toFixed(4)} <br/>
                    <span className="text-indigo-400/50">lng:</span> {p.lng.toFixed(4)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredPins.length === 0 && (
            <div className="text-center py-20 bg-[#16181a] rounded-3xl border border-dashed border-zinc-800">
              <p className="text-xs font-black uppercase text-zinc-600 tracking-widest">No matching records found</p>
            </div>
          )}
        </div>

        <div className="sm:hidden flex flex-col gap-3 px-6 pb-6 max-h-[60vh] overflow-y-auto">
          {filteredPins.map((p) => (
            <div
              key={p._id || p.id}
              className="bg-[#16181a] border border-white/5 p-4 rounded-2xl flex flex-col gap-2"
            >
              <div className="flex justify-between">
                <p className="text-sm font-bold text-white uppercase">{p.name}</p>
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: p.color }} />
              </div>
              <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{p.category}</p>
              <div className="flex justify-between text-[10px] font-mono text-zinc-600 pt-2 border-t border-white/5">
                <span>LAT: {p.lat.toFixed(5)}</span>
                <span>LNG: {p.lng.toFixed(5)}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 bg-[#090a0c] text-center border-t border-white/5">
            <p className="text-[9px] text-zinc-700 font-bold uppercase tracking-[0.5em]">Vault Explorer Service v2.1</p>
        </div>
      </div>
    </div>
  );
}