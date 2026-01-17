//what I lern ? 
// basic Operation for email Varification 

//IN Css :
//hover:scale-105 : Hover karne par element ka size 105% ho jata hai , Zoom-in effect deta hai
//transition : CSS changes ko smooth banata hai
//transform : Element par scale, rotate, translate jaise effects apply karne ke liye use hota hai

"use client";
import { useState } from "react";
import { UserSettingsModalProps } from '@/app/types';
import { apiService } from "@/utils/api.service";
import { showSuccess, showError } from "@/utils/toast";
import { getCurrentUser } from "@/utils/storage/user.storage";

export default function UserSettingsModal({currentEmail,onSave,onClose}: UserSettingsModalProps) {
  const [email, setEmail] = useState(currentEmail ?? "");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);

 const handleSave = async () => {
    if (!email.trim()) return;
    
    try {
      setLoading(true);
      const user = getCurrentUser();
      const token = localStorage.getItem("token");
      
      if (!token) {
        showError("Not authenticated");
        return;
      }

      const updateData: any = {};
      if (username) updateData.username = username;
      if (password) updateData.password = password;

      const response = await apiService.updateProfile(token, updateData.username, updateData.password);
      
      if (response.message && response.message.includes("successfully")) {
        showSuccess("Profile updated successfully!");
        onSave(email, password);
        onClose();
      } else {
        showError(response.message || "Failed to update profile");
      }
    } catch (error: any) {
      showError(error.message || "Error updating profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[20000] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md bg-zinc-900 rounded-3xl p-6 shadow-2xl flex flex-col gap-4">
        <button
          onClick={onClose}
          disabled={loading}
          className="absolute top-4 right-4 text-xl font-bold text-white hover:text-red-500"
        >
          ✕
        </button>
        <h2 className="text-xl font-bold text-white">User Settings</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full rounded-xl px-3 py-2 bg-zinc-800 text-white border border-gray-600 shadow-sm focus:ring-2 focus:ring-indigo-400 transition"
          disabled={loading}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-xl px-3 py-2 bg-zinc-800 text-white border border-gray-600 shadow-sm focus:ring-2 focus:ring-indigo-400 transition"
          disabled={loading}
        />
        <input
          type="password"
          placeholder="New Password (optional)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-xl px-3 py-2 bg-zinc-800 text-white border border-gray-600 shadow-sm focus:ring-2 focus:ring-indigo-400 transition"
          disabled={loading}
        />
        <button
          onClick={handleSave}
          disabled={loading}
          className="bg-indigo-600 text-white py-2 rounded-2xl shadow-lg hover:scale-105 transition transform disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
}
