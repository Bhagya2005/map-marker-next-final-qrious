"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore"; 
import { showError } from "@/utils/toast";

export default function SignUpForm() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<"admin" | "regular">("regular");

  const signup = useAuthStore((s) => s.signup);

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      return showError("Passwords do not match");
    }

    signup({ username, email, password, role }, router);
  };

  return (
    <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] w-full max-w-md p-8 md:p-10 transition-all hover:border-white/20">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-white text-center">Sign Up</h2>
        <p className="text-gray-400 text-center text-sm mt-2">
          Join us for seamless navigation
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-xs font-semibold text-gray-400 uppercase ml-1">
            User Type
          </label>
          <div className="flex gap-2 mt-1">
            <button
              onClick={() => setRole("regular")}
              className={`flex-1 p-3 rounded-2xl font-semibold transition-all ${
                role === "regular"
                  ? "bg-blue-500/50 border border-blue-400 text-white"
                  : "bg-white/5 border border-white/10 text-gray-400 hover:border-white/20"
              }`}
            >
              Regular
            </button>
            <button
              onClick={() => setRole("admin")}
              className={`flex-1 p-3 rounded-2xl font-semibold transition-all ${
                role === "admin"
                  ? "bg-purple-500/50 border border-purple-400 text-white"
                  : "bg-white/5 border border-white/10 text-gray-400 hover:border-white/20"
              }`}
            >
              Admin
            </button>
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-400 uppercase ml-1">
            Username
          </label>
          <input
            className="w-full p-3.5 mt-1 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
            value={username}
            placeholder="Bhagya012"
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-400 uppercase ml-1">
            Email Address
          </label>
          <input
            className="w-full p-3.5 mt-1 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
            value={email}
            placeholder="bhagya@example.com"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-gray-400 uppercase ml-1">
              Password
            </label>
            <input
              type="password"
              className="w-full p-3.5 mt-1 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
              value={password}
              placeholder="******"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-400 uppercase ml-1">
              Confirm
            </label>
            <input
              type="password"
              className="w-full p-3.5 mt-1 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
              value={confirmPassword}
              placeholder="******"
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
        </div>

        <button
          onClick={handleSignUp}
          className="w-full text-white p-4 rounded-2xl font-bold shadow-xl shadow-green-300/20 transition-all active:scale-[0.98] mt-4 cursor-pointer"
        >
          Create Account
        </button>
      </div>

      <div className="mt-8 text-center">
        <p className="text-sm text-gray-400">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
