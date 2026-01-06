//What I Lern ?
//Validate Email using regex
//password validation and on success and Error use Toast

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { hashPassword } from "@/utils/crypto";
import { showSuccess, showError } from "@/utils/toast";

export default function SignUpForm() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignUp = async () => {
    const normalizedEmail = email.trim().toLowerCase();
    if (!username.trim()) return showError("Username required");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) return showError("Invalid email");
    if (password.length < 6) return showError("Password must be 6+ chars");
    if (password !== confirmPassword) return showError("Passwords do not match");

    const users = JSON.parse(localStorage.getItem("users") || "[]");
    if (users.find((u: any) => u.email === normalizedEmail)) return showError("User exists");

    const hashedPassword = await hashPassword(password);
    users.push({
      id: crypto.randomUUID(),
      username,
      email: normalizedEmail,
      password: hashedPassword
    });
    localStorage.setItem("users", JSON.stringify(users));

    showSuccess("Account created successfully!");
    setTimeout(() => router.push("/login"), 1500);
  };

  return (
    <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] w-full max-w-md p-8 md:p-10 transition-all hover:border-white/20">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-white text-center">Sign Up</h2>
        <p className="text-gray-400 text-center text-sm mt-2">Join us for seamless navigation</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-xs font-semibold text-gray-400 uppercase ml-1">Username</label>
          <input
            className="w-full p-3.5 mt-1 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
            placeholder="Bhagya01"
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-400 uppercase ml-1">Email Address</label>
          <input
            className="w-full p-3.5 mt-1 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
            placeholder="bhagya@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-gray-400 uppercase ml-1">Password</label>
            <input
              type="password"
              className="w-full p-3.5 mt-1 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
              placeholder="******"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-400 uppercase ml-1">Confirm</label>
            <input
              type="password"
              className="w-full p-3.5 mt-1 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
              placeholder="******"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
            />
          </div>
        </div>

        <button
          onClick={handleSignUp}
          className="w-full  text-white p-4 rounded-2xl font-bold shadow-xl shadow-green-300/20 transition-all active:scale-[0.98] mt-4 cursor-pointer"
        >
          Create Account
        </button>
      </div>

      <div className="mt-8 text-center">
        <p className="text-sm text-gray-400">
          Already have an account?{" "}
          <Link href="/login" className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}