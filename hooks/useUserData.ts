"use client";

import { useEffect, useState } from "react";
import {getCurrentUser,getUserPins,getUserCategories,saveUserPins,saveUserCategories} from "../utils/storage";
import { pin, Category } from "@/app/types";

export function useUserData(router: any) {
  const [user, setUser] = useState<any>(null);
  const [pins, setPins] = useState<pin[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const u = getCurrentUser();
    if (!u) {
      router.push("/login");
      return;
    }
    setUser(u);
    setPins(getUserPins(u.email));
    setCategories(getUserCategories(u.email));
    setLoaded(true);
  }, [router]);

  useEffect(() => {
    if (user) saveUserPins(user.email, pins);
  }, [pins, user]);

  useEffect(() => {
    if (user) saveUserCategories(user.email, categories);
  }, [categories, user]);

  return { user, pins, setPins, categories, setCategories, loaded };
}
