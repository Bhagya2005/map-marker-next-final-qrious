"use client";
import { create } from "zustand";
import { showSuccess, showError } from "@/utils/toast";

interface User {
  _id?: string;
  email: string;
  username?: string;
  password?: string;
  role: string;
  createdAt?: string;
}

interface UserStore {
  users: User[];
  usersPage: number;
  usersTotalPages: number;
  usersSearch: string;
  usersRole: string;
  userForm: User;
  editingUserId: string | null;

  loadUsers: () => Promise<void>;
  saveUser: () => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  setUserForm: (d: User) => void;
}

export const useUserStore = create<UserStore>((set, get) => ({
  users: [],
  usersPage: 1,
  usersTotalPages: 1,
  usersSearch: "",
  usersRole: "",
  userForm: { email: "", username: "", password: "", role: "regular" },
  editingUserId: null,

  loadUsers: async () => {
    try {
      const { usersPage, usersSearch, usersRole } = get();
      const res = await fetch(
        `/api/users?page=${usersPage}&search=${usersSearch}&role=${usersRole}`
      );
      const data = await res.json();
      set({ users: data.users, usersTotalPages: data.totalPages });
    } catch (err) {
      showError("Failed to load users");
      console.error(err);
    }
  },

  saveUser: async () => {
    const { editingUserId, userForm } = get();
    const method = editingUserId ? "PATCH" : "POST";
    const url = editingUserId ? `/api/users/${editingUserId}` : "/api/users";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userForm),
    });

    if (res.ok) {
      showSuccess("Saved successfully");
      get().loadUsers();
    } else {
      showError("Failed to save user");
    }
  },

  deleteUser: async (id: string) => {
    if (!confirm("Delete user?")) return;
    await fetch(`/api/users/${id}`, { method: "DELETE" });
    showSuccess("Deleted successfully");
    get().loadUsers();
  },

  setUserForm: (d) => set({ userForm: d }),
}));
