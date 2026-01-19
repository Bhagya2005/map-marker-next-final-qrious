"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";

export default function Logout() {
  const router = useRouter();
  const { setUser, setPins, setCategories } = useAuthStore();

  useEffect(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setPins([]);
    setCategories([]);

    router.replace("/login");
  }, [router, setUser, setPins, setCategories]);

  return null;
}
