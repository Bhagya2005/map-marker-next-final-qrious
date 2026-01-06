//what I Learn ?


//In CSS :
//inset-0
//ring-1 ring-black/10 :
//animate-scaleIn
//pointer-events-auto
//truncate
//overflow-y-auto 
// break-words

"use client";

import { pin } from "@/app/types";
import { useTheme } from "@/app/_components/theme-context";
import { PinModalProps } from "@/app/types";


export default function PinModal({ pin, onClose }: PinModalProps) {
  const { theme } = useTheme();

  if (!pin) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-end justify-end sm:items-center sm:justify-center p-4 pointer-events-none">
      <div className="absolute inset-0 bg-black/50 sm:hidden pointer-events-auto" onClick={onClose} />
      <div
        className="relative w-full max-w-[340px] sm:max-w-md max-h-[65vh] sm:max-h-[90vh] bg-zinc-900 text-white rounded-2xl shadow-2xl flex flex-col overflow-hidden ring-1 ring-white/20 animate-scaleIn pointer-events-auto"
        style={{
          position: window.innerWidth >= 640 ? "fixed" : undefined,
          bottom: window.innerWidth >= 640 ? "1rem" : undefined,
          right: window.innerWidth >= 640 ? "1rem" : undefined,
        }}
      >

        <div className="flex justify-between items-center px-4 py-3 border-b border-white/20 sticky top-0 bg-zinc-900 z-10">
          <h3 className="font-semibold text-base xs:text-sm truncate">{pin.name}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 font-bold text-lg hover:text-white transition"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3 break-words ">
          {pin.description && (
            <p className="text-sm opacity-80 whitespace-pre-wrap break-words">{pin.description}</p>
          )}

          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-xs">Category:</span>
            <span
              className="inline-block px-2 py-1 rounded text-white text-xs truncate"
              style={{ backgroundColor: pin.color }}
            >
              {pin.category}
            </span>
          </div>

          <p className="text-xs opacity-60">Latitude: {pin.lat.toFixed(5)}</p>
          <p className="text-xs opacity-60">Longitude: {pin.lng.toFixed(5)}</p>
        </div>
      </div>
{/* 
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: ${theme === "dark" ? "#27272A" : "#F3F4F6"};
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: ${theme === "dark" ? "#3B82F6" : "#2563EB"};
          border-radius: 4px;
        }
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: ${theme === "dark" ? "#3B82F6 #27272A" : "#2563EB #F3F4F6"};
        }
      `}</style> */}
    </div>
  );
}
