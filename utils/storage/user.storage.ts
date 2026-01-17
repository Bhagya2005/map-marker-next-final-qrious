import { storageService } from "./storage.service";
import { normalizeEmail } from "@/utils/validation";
import type { UserRole } from "@/app/types";

export type User = {
  id?: string;
  username?: string;
  email: string;
  password: string;
  role?: UserRole;
};

export const getUsers = (): User[] => {
  return storageService.get<User[]>("users", []);
};

export const loginUser = (
  email: string,
  hashedPassword: string,
  role: UserRole = 'regular'
): User | null => {
  const normalizedEmail = normalizeEmail(email);
  const users = getUsers();

  const user = users.find(
    u => u.email === normalizedEmail && u.password === hashedPassword && (u.role === role || !u.role)
  );

  if (!user) return null;

  const userData = { ...user, role };
  storageService.set("currentUser", userData);
  return userData;
};

export const isUserExists = (email: string): boolean => {
  const normalizedEmail = normalizeEmail(email);
  return getUsers().some(u => u.email === normalizedEmail);
};

export const createUser = (user: User): void => {
  const users = getUsers();
  users.push({ ...user, role: user.role || 'regular' });
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
  password?: string,
  username?: string
): void => {
  const currentUser = getCurrentUser();
  if (currentUser) {
    const users = getUsers();
    const index = users.findIndex(u => u.email === currentUser.email);
    if (index !== -1) {
      if (username) users[index].username = username;
      if (password) users[index].password = password;
      storageService.set("users", users);
      
      const updatedUser = { ...currentUser };
      if (username) updatedUser.username = username;
      if (password) updatedUser.password = password;
      storageService.set("currentUser", updatedUser);
    }
  }
  
  if (email) storageService.set("userEmail", email);
  if (password) storageService.set("userPassword", password);
};