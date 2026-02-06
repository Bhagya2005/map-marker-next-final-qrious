"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";

export default function LoginForm() {
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"admin" | "regular">("regular");

  const login = useAuthStore((s) => s.login);
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (user) {
      router.replace(user.role === "admin" ? "/admin/dashboard" : "/");
    }
  }, [user, router]);

  if (!mounted) return null;
  return (
    <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] w-full max-w-md p-8 md:p-10 transition-all hover:border-white/20">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white text-center">Login</h2>
        <p className="text-gray-400 text-center text-sm mt-2">
          Enter your details to continue
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-xs font-semibold text-gray-400 uppercase ml-1">
            User Type
          </label>
          <div className="flex gap-2 mt-1">
            <button
              type="button"
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
              type="button"
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
            Email Address
          </label>
          <input
            className="w-full p-4 mt-1 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
            placeholder="bhagya@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-400 uppercase ml-1">
            Password
          </label>
          <input
            type="password"
            className="w-full p-4 mt-1 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
            placeholder="******"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          type="button"
          onClick={() => login(email, password)}
          className="w-full text-white p-4 rounded-2xl font-bold shadow-xl shadow-blue-300/20 transition-all active:scale-[0.98] mt-4 cursor-pointer"
        >
          Sign In
        </button>
      </div>

      <div className="mt-8 space-y-3 text-center">
        <p className="text-sm text-gray-400">
          New user?{" "}
          <Link
            href="/sign-up"
            className="text-blue-400 hover:text-blue-300 font-semibold transition-colors"
          >
            Create Account
          </Link>
        </p>
        <p className="text-sm text-gray-400">
          Forgot your password?{" "}
          <Link
            href="/forgot-password"
            className="text-gray-100 hover:text-white font-semibold transition-colors"
          >
            Reset here
          </Link>
        </p>
      </div>
    </div>
  );
}
