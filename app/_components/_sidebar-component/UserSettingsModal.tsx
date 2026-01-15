//what I lern ? 
// basic Operation for email Varification 

//IN Css :
//hover:scale-105 : Hover karne par element ka size 105% ho jata hai , Zoom-in effect deta hai
//transition : CSS changes ko smooth banata hai
//transform : Element par scale, rotate, translate jaise effects apply karne ke liye use hota hai

"use client";
import { useState } from "react";
import { UserSettingsModalProps } from '@/app/types';

export default function UserSettingsModal({currentEmail,onSave,onClose}: UserSettingsModalProps) {
  const [email, setEmail] = useState(currentEmail ?? "");
  const [password, setPassword] = useState("");

 const handleSave = () => {
    if (!email.trim()) return;
    onSave(email, password);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[20000] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md bg-zinc-900 rounded-3xl p-6 shadow-2xl flex flex-col gap-4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-xl font-bold text-white hover:text-red-500"
        >
          ✕
        </button>
        <h2 className="text-xl font-bold text-white">User Settings</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-xl px-3 py-2 bg-zinc-800 text-white border border-gray-600 shadow-sm focus:ring-2 focus:ring-indigo-400 transition"
        />
        <input
          type="password"
          placeholder="New Password (optional)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-xl px-3 py-2 bg-zinc-800 text-white border border-gray-600 shadow-sm focus:ring-2 focus:ring-indigo-400 transition"
        />
        <button
          onClick={handleSave}
          className="bg-indigo-600 text-white py-2 rounded-2xl shadow-lg hover:scale-105 transition transform"
        >
          Save
        </button>
      </div>
    </div>
  );
}
