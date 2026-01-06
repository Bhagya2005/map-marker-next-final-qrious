import { pin, Category } from "@/app/types";

export const buildPin = (p: pin, categories: Category[], email: string) => {
  const cat = categories.find(c => c.name === p.category);
  if (!cat) return null;
  return { ...p, color: cat.color, userId: email };
};
