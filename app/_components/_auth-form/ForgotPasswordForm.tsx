//what I Learn ?
// validation from front-end side
// Encrypt password 
// process with Email like how to trim , lowercase and new normalizedEmail assign in new variable

//IN CSS :
//backdrop-blur-2xl 
//shadow-[0_20px_50px_rgba(0,0,0,0.5)]
//shadow-xl shadow-rose-300/20 transition-all active:scale-[0.98] 

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { hashPassword } from "@/utils/crypto";
import { showSuccess, showError } from "@/utils/toast";
import { normalizeEmail, isValidEmail } from "@/utils/validation";
import { updateUserPassword } from "@/utils/storage/user.storage";

export default function ForgotPasswordForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleReset = async () => {
    const normalizedEmail = normalizeEmail(email);

    if (!isValidEmail(normalizedEmail)) {
      return showError("Please enter a valid email");
    }

    if (newPassword.length < 6) {
      return showError("Password must be at least 6 characters");
    }

    const hashedPassword = await hashPassword(newPassword);
    const updated = updateUserPassword(normalizedEmail, hashedPassword);

    if (!updated) {
      return showError("User not found");
    }

    showSuccess("Password reset successfully");
    setTimeout(() => router.push("/login"), 1500);
  };

  return (
    <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] w-full max-w-md p-8 md:p-10 transition-all hover:border-white/20">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white text-center">Reset</h2>
        <p className="text-gray-400 text-center text-sm mt-2">
          Update your security credentials
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-xs font-semibold text-gray-400 uppercase ml-1">
            Account Email
          </label>
          <input
            className="w-full p-4 mt-1 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-rose-500/50 transition-all"
            value={email}
            placeholder="bhagya@example.com"
            onChange={e => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-400 uppercase ml-1">
            New Password
          </label>
          <input
            type="password"
            className="w-full p-4 mt-1 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-rose-500/50 transition-all"
            value={newPassword}
            placeholder="******"
            onChange={e => setNewPassword(e.target.value)}
          />
        </div>

        <button
          onClick={handleReset}
          className="w-full text-white p-4 rounded-2xl font-bold shadow-xl shadow-rose-300/20 transition-all active:scale-[0.98] mt-4"
        >
          Update Password
        </button>
      </div>

      <div className="mt-8 text-center">
        <p className="text-sm text-gray-400">
          Back to Login{" "}
          <Link
            href="/login"
            className="text-rose-400 hover:text-rose-300 font-semibold transition-colors"
          >
            Click Here
          </Link>
        </p>
      </div>
    </div>
  );
}
