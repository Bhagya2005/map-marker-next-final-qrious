//what I Learn ?
//Deal with Rating like If user don't give any rating then rating 0 assign using || operator

"use client";
import { useState } from "react";
import { FeedbackModalProps } from "@/app/types";

export default function FeedbackModal({onClose,onSubmit}:FeedbackModalProps) {
  const [rating, setRating] = useState(0);
  const [description, setDescription] = useState("");
  const [hoverRating, setHoverRating] = useState(0); 

  const handleSubmit = () => {
    const finalRating = rating || 0;
    onSubmit(finalRating, description);
    onClose();
};


  return (
    <div className="fixed inset-0 z-[20000] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md bg-zinc-900 rounded-3xl p-6 shadow-2xl flex flex-col gap-4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-xl font-bold text-gray-600 hover:text-white"
        >
          ✕
        </button>
        <h2 className="text-xl font-bold text-white">Feedback</h2>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => {
            const isActive = hoverRating
              ? hoverRating >= star
              : rating >= star;

            return (
              <button
                key={star}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className={`text-3xl transition-colors ${
                  isActive ? "text-yellow-400" : "text-gray-400"
                }`}
              >
                ★
              </button>
            );
          })}
        </div>

        <textarea
          placeholder="Optional description..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full rounded-xl px-3 py-2 bg-zinc-800 text-white border border-gray-600 shadow-sm focus:ring-2 focus:ring-indigo-400 transition"
        />
        <button
          onClick={handleSubmit}
          className="bg-indigo-600 text-white py-2 rounded-2xl cursor-pointer"
        >
          Submit
        </button>
      </div>
    </div>
  );
}
