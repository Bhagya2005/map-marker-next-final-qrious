"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { usePinStore } from "@/stores/pinStore";
import { useCategoryStore } from "@/stores/categoryStore";

export default function Logout() {
  const router = useRouter();

  const setUser = useAuthStore((state) => state.setUser);
  const pins = usePinStore((state) => state.pins);
  const deletePin = usePinStore((state) => state.deletePin);

  const categories = useCategoryStore((state) => state.categories);
  const deleteCategories = useCategoryStore((state) => state.deleteCategories);

  useEffect(() => {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);

    pins?.forEach((p) => {
      deletePin(p.id);
    });


    const categoryNames = categories?.map((c) => c.name) || [];
    if (categoryNames.length) {
      categoryNames.forEach((name) => deleteCategories(name));
    }

    router.replace("/login");
  }, [router, setUser, pins, deletePin, categories, deleteCategories]);

  return null;
}
