//what I Learn ?
//same as ForgotPasswordForm
//transition-colors

"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { hashPassword } from "@/utils/crypto";
import { showSuccess, showError } from "@/utils/toast";
import { normalizeEmail, isValidEmail } from "@/utils/validation";
import { loginUser } from "@/utils/storage/user.storage";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    const normalizedEmail = normalizeEmail(email);

    if (!isValidEmail(normalizedEmail)) {
      return showError("Invalid email address");
    }

    if (!password) {
      return showError("Password is required");
    }

    const hashedPassword = await hashPassword(password);
    const user = loginUser(normalizedEmail, hashedPassword);

    if (!user) {
      return showError("Invalid credentials");
    }

    showSuccess("Welcome back!");
    router.push("/");
  };

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
            Email Address
          </label>
          <input
            className="w-full p-4 mt-1 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
            placeholder="bhagya@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
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
            onChange={e => setPassword(e.target.value)}
          />
        </div>

        <button
          onClick={handleLogin}
          className="w-full text-white p-4 rounded-2xl font-bold shadow-xl shadow-blue-300/20 transition-all active:scale-[0.98] mt-4"
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
