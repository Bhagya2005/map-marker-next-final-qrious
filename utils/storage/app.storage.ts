import { pin, Category } from "@/app/types";
import { storageService } from "./storage.service";
import { getByUserId, saveByUserId } from "./entity.storage";
import {User} from "./user.storage";

export const getCurrentUser = (): User | null => {
  return storageService.get<User | null>("currentUser", null);
};
export const getUserPins = (userId: string): pin[] => {
  return getByUserId<pin>("pins", userId);
};

export const saveUserPins = (userId: string, userPins: pin[]) => {
  saveByUserId<pin>("pins", userId, userPins);
};

export const getUserCategories = (userId: string): Category[] => {
  return getByUserId<Category>("categories", userId);
};

export const saveUserCategories = (
  userId: string,
  userCategories: Category[]
) => {
  saveByUserId<Category>("categories", userId, userCategories);
};

