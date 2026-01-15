import { storageService } from "./storage.service";

export const getByUserId = <T extends { userId: string }>(
  key: string,
  userId: string
): T[] => {
  const items = storageService.get<T[]>(key, []);
  return items.filter(item => item.userId === userId);
};

export const saveByUserId = <T extends { userId: string }>(
  key: string,
  userId: string,
  userItems: T[]
): void => {
  const allItems = storageService.get<T[]>(key, []);
  const otherItems = allItems.filter(item => item.userId !== userId);
  storageService.set(key, [...otherItems, ...userItems]);
};
