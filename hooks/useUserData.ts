"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {getCurrentUser,getUserPins,getUserCategories,saveUserPins,saveUserCategories} from "@/utils/storage/app.storage";
import { pin, Category } from "@/app/types";
import { User } from "@/utils/storage/user.storage";

export function useUserData() {
  const [user, setUser] = useState(null);
  const [pins, setPins] = useState([]);
  const [categories, setCategories] = useState([]);

  const bootstrapUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const res = await fetch("/api/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) return;

    const data = await res.json();
    setUser(data.user);
    setPins(data.pins);
    setCategories(data.categories);
  };

  return {user,pins,categories,setUser,setPins,setCategories,bootstrapUser};
}
 