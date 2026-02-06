"use client";

import { useEffect, useState } from "react";
import { PinFormProps, pin } from "@/app/types";

export default function PinForm({
  pin,categories = [],
  onSave,onClose,
}: PinFormProps) {
  const [formData, setFormData] = useState<pin>({
    ...pin,
    category: pin.category || (categories[0]?.name || "Default"),
    images: pin.images || [],
  });

  useEffect(() => {
    if (!categories || categories.length === 0) return;
    setFormData((prev) => ({
      ...prev,
      category: prev.category || categories[0].name,
    }));
  }, [categories]);

  const toDataUrl = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });

  const handleFiles = async (files: FileList | null) => {
    if (!files) return;
    const arr = Array.from(files);
    const dataUrls = await Promise.all(arr.map((f) => toDataUrl(f)));
    setFormData((prev) => ({ ...prev, images: [...(prev.images || []), ...dataUrls] }));
  };

  const handleRemoveImage = (idx: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images?.filter((_, i) => i !== idx) || [],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/70 backdrop-blur-md p-4 font-sans">
      <div className="relative w-full max-w-md bg-[#0d0d0d] text-white rounded-[2.5rem] p-9 shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/5 animate-scaleIn">

        <div className="text-center mb-8">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-500 mb-2">Registry</p>
          <h2 className="text-lg font-black uppercase tracking-widest text-white">
            {formData.id ? "Modify Entry" : "New Location"}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            placeholder="IDENTIFIER NAME"
            value={formData.name || ""}
            required
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full rounded-2xl px-6 py-4 bg-zinc-900/50 border border-white/5 text-[11px] font-bold uppercase tracking-widest focus:outline-none focus:border-indigo-500/40 transition-all placeholder:text-zinc-700"
          />

          <textarea
            placeholder="SPECIFICATION DATA"
            value={formData.description || ""}
            required
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full h-28 rounded-2xl px-6 py-4 bg-zinc-900/50 border border-white/5 text-[11px] font-bold uppercase tracking-widest focus:outline-none focus:border-indigo-500/40 transition-all placeholder:text-zinc-700 resize-none"
          />

          <div className="relative">
            <select
              value={formData.category || ""}
              required
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full rounded-2xl px-6 py-4 bg-zinc-900/50 border border-white/5 text-[11px] font-bold uppercase tracking-widest focus:outline-none focus:border-indigo-500/40 appearance-none cursor-pointer pr-12"
            >
              {categories.map((c) => (
                <option key={c.name} value={c.name} className="bg-zinc-950 text-white">
                  {c.name.toUpperCase()}
                </option>
              ))}
            </select>
            <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
              <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>

          <div className="relative group">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => handleFiles(e.target.files)}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div className="w-full border border-dashed border-white/5 rounded-2xl py-5 text-center transition-all bg-black/30 group-hover:border-indigo-500/30">
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-600 group-hover:text-indigo-400">
                Capture Media
              </span>
            </div>
          </div>

          {formData.images && formData.images.length > 0 && (
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {formData.images.map((src, idx) => (
                <div key={idx} className="relative flex-shrink-0 w-12 h-12 rounded-xl overflow-hidden border border-white/5 group">
                  <img src={src} className="w-full h-full object-cover" />
                  <button 
                    type="button" 
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute inset-0 bg-red-600/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-[8px] font-black"
                  >
                    DEL
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-4 rounded-2xl border border-white/5 text-zinc-500 font-black text-[10px] uppercase tracking-[0.3em] hover:bg-white/5 hover:text-white transition-all cursor-pointer"
            >
              Abort
            </button>

            <button
              type="submit"
              className="flex-[1.5] py-4 rounded-2xl bg-indigo-600 text-white font-black text-[10px] uppercase tracking-[0.3em] hover:bg-indigo-500 transition-all shadow-[0_10px_30px_rgba(79,70,229,0.2)] active:scale-95"
            >
              Commit Data
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}