//what I learn ?
//basically all operation related in localstorage write in one place
//type declaration 

import { pin, Category } from "@/app/types";

export const getCurrentUser = () => {
  const user = localStorage.getItem("currentUser");
  return user ? JSON.parse(user) : null;
};

export const getUserPins = (userId: string): pin[] => {
  const pins: pin[] = JSON.parse(localStorage.getItem("pins") || "[]");
  return pins.filter(p => p.userId === userId);
};

export const saveUserPins = (userId: string, userPins: pin[]) => {
  const allPins: pin[] = JSON.parse(localStorage.getItem("pins") || "[]");
  const otherPins = allPins.filter(p => p.userId !== userId);

  localStorage.setItem(
    "pins",
    JSON.stringify([...otherPins, ...userPins])
  );
};

export const getUserCategories = (userId: string): Category[] => {
  const cats: Category[] =
    JSON.parse(localStorage.getItem("categories") || "[]");

  return cats.filter(c => c.userId === userId);
};

export const saveUserCategories = (
  userId: string,
  userCategories: Category[]
) => {
  const allCats: Category[] =
    JSON.parse(localStorage.getItem("categories") || "[]");

  const otherCats = allCats.filter(c => c.userId !== userId);

  localStorage.setItem(
    "categories",
    JSON.stringify([...otherCats, ...userCategories])
  );
};


