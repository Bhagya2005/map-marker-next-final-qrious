"use client";

import { useState } from "react";
import { FeedbackModalProps } from "@/app/types";
import { showError, showSuccess } from "@/utils/toast";

export default function FeedbackModal({ onClose, onSubmit }: FeedbackModalProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [category, setCategory] =
    useState<"bug" | "feature" | "improvement" | "other">("other");

  const handleSubmit = () => {
    if (!title.trim()) {
      showError("Feedback title is required");
      return;
    }

    onSubmit({
      title,
      message,
      rating,
      category,
    });

    showSuccess("Feedback submitted");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[20000] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md bg-zinc-900 rounded-3xl p-6 shadow-2xl space-y-4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-xl text-gray-500 hover:text-white"
        >
          ✕
        </button>

        <h2 className="text-xl font-bold text-white">Feedback</h2>

        <input
          type="text"
          placeholder="Feedback title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-xl px-3 py-2 bg-zinc-800 text-white border border-gray-600 focus:ring-2 focus:ring-indigo-400"
        />

        <select
          value={category}
          onChange={(e) =>
            setCategory(e.target.value as typeof category)
          }
          className="w-full rounded-xl px-3 py-2 bg-zinc-800 text-white border border-gray-600"
        >
          <option value="bug">Bug Report</option>
          <option value="feature">Feature Request</option>
          <option value="improvement">Improvement</option>
          <option value="other">Other</option>
        </select>

        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => {
            const active =
              hoverRating > 0
                ? hoverRating >= star
                : rating >= star;

            return (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className={`text-3xl transition ${
                  active ? "text-yellow-400" : "text-gray-400"
                }`}
              >
                ★
              </button>
            );
          })}
        </div>

        <textarea
          placeholder="Describe your feedback (optional)"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={3}
          className="w-full rounded-xl px-3 py-2 bg-zinc-800 text-white border border-gray-600 focus:ring-2 focus:ring-indigo-400"
        />

        <button
          onClick={handleSubmit}
          className="w-full bg-indigo-600 text-white py-2 rounded-2xl hover:bg-indigo-700 transition"
        >
          Submit Feedback
        </button>
      </div>
    </div>
  );
}
