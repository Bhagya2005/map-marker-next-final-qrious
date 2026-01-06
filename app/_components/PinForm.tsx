//what I Lern ? 
//

//In CSS :
//backdrop-blur-sm :
//animate-scaleIn :
//focus:outline-none:
"use client";

import { useEffect, useState } from "react";
import { PinFormProps, pin } from "@/app/types";

export default function PinForm({pin,categories,onSave,onClose}: PinFormProps) {
  const [formData, setFormData] = useState<pin>(pin);

  useEffect(() => {
    if (categories.length === 0) return;
    setFormData((prev) => ({
      ...prev,
      category: prev.category || categories[0].name,
    }));
  }, [categories]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/50 bg-black/60 backdrop-blur-sm">
      <div className="relative w-[95%] max-w-md bg-zinc-900 text-white rounded-2xl p-6 shadow-2xl animate-scaleIn">
        <h2 className="text-xl font-semibold mb-4 text-center">
          {formData.id ? "Edit Pin" : "Add Pin"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Pin Name"
            value={formData.name}
            required
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            className="w-full rounded-lg px-4 py-2 border border-white/20 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <textarea
            placeholder="Description"
            value={formData.description}
            required
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="w-full h-32 rounded-lg px-4 py-2 border border-white/20 bg-transparent resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <select
            value={formData.category}
            required
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            className="w-full rounded-lg px-4 py-2 border border-white/20 "
          >
            {categories.map((c) => (
              <option key={c.name} value={c.name}>
                {c.name} 
              </option>
            ))}
          </select>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="flex-1 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              Save
            </button>

            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 rounded-lg border border-white/20 cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>

        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-white text-lg font-bold"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
