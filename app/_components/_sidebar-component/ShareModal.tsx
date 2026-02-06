"use client";

import { useState } from "react";
import { showSuccess } from "@/utils/toast";

interface ShareModalProps {
  userId?: string;
  onClose: () => void;
}

export default function ShareModal({ userId, onClose }: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  const shareLink = userId ? `${window.location.origin}/share/${userId}` : "";
  const iframeCode = `<iframe src="${shareLink}" width="800" height="600" frameborder="0" style="border-radius: 8px;"></iframe>`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    showSuccess("Copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[40000] flex items-center justify-center bg-black/60">
      <div className="bg-zinc-900 text-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
        <h2 className="text-2xl font-bold mb-4">Share Your Map</h2>

        <div className="mb-4">
          <label className="text-sm text-gray-300">Share Link</label>
          <div className="flex gap-2 mt-2">
            <input
              type="text"
              value={shareLink}
              readOnly
              className="flex-1 bg-zinc-800 px-3 py-2 rounded-lg text-sm border border-white/20"
            />
            <button
              onClick={() => copyToClipboard(shareLink)}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-medium transition"
            >
              {copied ? "✓" : "Copy"}
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            Share this link to show your map in read-only mode.
          </p>
        </div>

        <div className="mb-4">
          <label className="text-sm text-gray-300">Embed Code</label>
          <div className="bg-zinc-800 p-3 rounded-lg mt-2">
            <code className="text-xs text-gray-200 break-words">{iframeCode}</code>
          </div>
          <button
            onClick={() => copyToClipboard(iframeCode)}
            className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg text-sm mt-2 w-full font-medium transition"
          >
            Copy Embed Code
          </button>
          <p className="text-xs text-gray-400 mt-2">
            Paste this code into your website or blog.
          </p>
        </div>

        <button
          onClick={onClose}
          className="w-full bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg font-medium transition"
        >
          Close
        </button>
      </div>
    </div>
  );
}
