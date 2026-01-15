import { storageService } from "./storage.service";
import { normalizeEmail } from "@/utils/validation";

export type User = {
  id?: string;
  username?: string;
  email: string;
  password: string;
};

export const getUsers = (): User[] => {
  return storageService.get<User[]>("users", []);
};

export const loginUser = (
  email: string,
  hashedPassword: string
): User | null => {
  const normalizedEmail = normalizeEmail(email);
  const users = getUsers();

  const user = users.find(
    u => u.email === normalizedEmail && u.password === hashedPassword
  );

  if (!user) return null;

  storageService.set("currentUser", user);
  return user;
};

export const isUserExists = (email: string): boolean => {
  const normalizedEmail = normalizeEmail(email);
  return getUsers().some(u => u.email === normalizedEmail);
};

export const createUser = (user: User): void => {
  const users = getUsers();
  users.push(user);
  storageService.set("users", users);
};

export const updateUserPassword = (
  email: string,
  hashedPassword: string
): boolean => {
  const normalizedEmail = normalizeEmail(email);
  const users = getUsers();

  const index = users.findIndex(u => u.email === normalizedEmail);
  if (index === -1) return false;

  users[index].password = hashedPassword;
  storageService.set("users", users);
  return true;
};

export const getCurrentUser = (): User | null => {
  return storageService.get<User | null>("currentUser", null);
};

export const logoutUser = (): void => {
  storageService.remove("currentUser");
};

export const updateUserSettings = (
  email: string,
  password?: string
): void => {
  storageService.set("userEmail", email);
  if (password) {
    storageService.set("userPassword", password);
  }
};