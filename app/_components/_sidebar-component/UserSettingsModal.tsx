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
  const [defaultPrivacy, setDefaultPrivacy] = useState("public");
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
      <div className="relative w-full max-w-md bg-gradient-to-br from-zinc-800 via-zinc-900 to-black rounded-2xl p-7 shadow-2xl border border-white/10 flex flex-col gap-5">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
             Settings
          </h2>
          <button
            onClick={onClose}
            disabled={loading}
            className="text-2xl font-bold text-gray-400 hover:text-white transition"
          >
            ✕
          </button>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">
            👤 Username (optional)
          </label>
          <input
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full rounded-lg px-4 py-3 bg-zinc-800/50 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition disabled:opacity-50"
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">
             Email
          </label>
          <input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg px-4 py-3 bg-zinc-800/50 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition disabled:opacity-50"
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">
             New Password (optional)
          </label>
          <input
            type="password"
            placeholder="Leave empty to keep current"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg px-4 py-3 bg-zinc-800/50 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition disabled:opacity-50"
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">
             Default Pin Privacy
          </label>
          <select
            value={defaultPrivacy}
            onChange={(e) => setDefaultPrivacy(e.target.value)}
            className="w-full rounded-lg px-4 py-3 bg-zinc-800/50 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition disabled:opacity-50"
            disabled={loading}
          >
            <option value="public">Public - Visible to everyone</option>
            <option value="private">Private - Only me</option>
          </select>
          <p className="text-xs text-gray-400 mt-1">
            This setting controls the default privacy for new pins
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={loading}
          className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? " Saving..." : "Save Settings"}
        </button>
      </div>
    </div>
  );
}
