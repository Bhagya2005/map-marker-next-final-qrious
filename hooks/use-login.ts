"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { showSuccess, showError } from "@/utils/toast";
import { useAuthStore } from "@/store/useAuthStore";
import type { UserRole } from "@/app/types";

export function useLogin() {
  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("regular");
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogin = async () => {
    if (!email || !password) return showError("Email & password required");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        showError("Server returned invalid response");
        return;
      }

      if (!res.ok || !data.user || !data.token) {
        return showError(data?.message || "Login failed");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      const store = useAuthStore.getState();
      store.setUser(data.user);
      store.setLoading(false);

      setTimeout(() => {
        router.replace(data.user.role === "admin" ? "/admin/dashboard" : "/");
        showSuccess("Login successful");
      }, 0);
    } catch (err) {
      console.error(err);
      showError("Something went wrong");
    }
  };

  return {
    mounted,
    email,
    setEmail,
    password,
    setPassword,
    role,
    setRole,
    handleLogin,
  };
}