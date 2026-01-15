"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getCurrentUser,
  getUserPins,
  getUserCategories,
  saveUserPins,
  saveUserCategories
} from "@/utils/storage/app.storage";
import { pin, Category } from "@/app/types";
import { User } from "@/utils/storage/user.storage";

export function useUserData() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [pins, setPins] = useState<pin[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      router.push("/login");
      return;
    }

    setUser(currentUser);

    const userKey = currentUser.id ?? currentUser.email;

    setPins(getUserPins(userKey));
    setCategories(getUserCategories(userKey));
    setLoaded(true);
  }, [router]);

  useEffect(() => {
    if (user) {
      const userKey = user.id ?? user.email;
      saveUserPins(userKey, pins);
    }
  }, [pins, user]);

  useEffect(() => {
    if (user) {
      const userKey = user.id ?? user.email;
      saveUserCategories(userKey, categories);
    }
  }, [categories, user]);

  return {user,pins,setPins,categories,setCategories,loaded};
}
