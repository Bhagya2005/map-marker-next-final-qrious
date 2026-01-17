"use client";

import { useState, useEffect } from "react";
import { showSuccess, showError } from "@/utils/toast";

type User = {
  id?: string;
  email: string;
  username?: string;
  password: string;
  role?: "admin" | "regular";
};

const ITEMS_PER_PAGE = 10;
type SortField = "email" | "username" | "role";
type SortOrder = "asc" | "desc";

export default function UsersManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [sortField, setSortField] = useState<SortField>("email");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    role: "regular" as const,
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    const stored = localStorage.getItem("users");
    if (stored) setUsers(JSON.parse(stored));
  };

  const openModal = (user?: User) => {
    if (user) {
      setEditingId(user.id!);
      setFormData({
        email: user.email,
        username: user.username || "",
        password: user.password,
        role: user.role || "regular",
      });
    } else {
      setEditingId(null);
      setFormData({ email: "", username: "", password: "", role: "regular" });
    }
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  const handleAddOrUpdate = () => {
    if (!formData.email || !formData.password)
      return showError("Email and password are required");

    if (editingId) {
      const updated = users.map((u) =>
        u.id === editingId ? { ...u, ...formData } : u
      );
      setUsers(updated);
      localStorage.setItem("users", JSON.stringify(updated));
      showSuccess("User updated successfully");
    } else {
      const newUser: User = {
        id: Date.now().toString(),
        ...formData,
      };
      const updated = [...users, newUser];
      setUsers(updated);
      localStorage.setItem("users", JSON.stringify(updated));
      showSuccess("User created successfully");
    }

    closeModal();
    setCurrentPage(1);
  };

  const handleDelete = (id?: string) => {
    if (!id) return;
    if (confirm("Are you sure?")) {
      const updated = users.filter((u) => u.id !== id);
      setUsers(updated);
      localStorage.setItem("users", JSON.stringify(updated));
      showSuccess("User deleted successfully");
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.username || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = !selectedRole || u.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    let aVal: any, bVal: any;
    if (sortField === "email") {
      aVal = a.email.toLowerCase();
      bVal = b.email.toLowerCase();
    } else if (sortField === "username") {
      aVal = (a.username || "").toLowerCase();
      bVal = (b.username || "").toLowerCase();
    } else {
      aVal = a.role || "regular";
      bVal = b.role || "regular";
    }
    if (typeof aVal === "string") return sortOrder === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
  });

  const totalPages = Math.ceil(sortedUsers.length / ITEMS_PER_PAGE);
  const paginatedUsers = sortedUsers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const toggleSort = (field: SortField) => {
    if (sortField === field) setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    else {
      setSortField(field);
      setSortOrder("asc");
    }
    setCurrentPage(1);
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Manage Users ({users.length})</h2>
        <button
          onClick={() => openModal()}
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
        >
          + Add User
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white/5 border border-white/10 rounded-lg p-4">
        <input
          type="text"
          placeholder="Search by email or username..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="px-4 py-2 bg-zinc-800 text-white rounded-lg border border-gray-600 focus:border-indigo-500"
        />
        <select
          value={selectedRole}
          onChange={(e) => {
            setSelectedRole(e.target.value);
            setCurrentPage(1);
          }}
          className="px-4 py-2 bg-zinc-800 text-white rounded-lg border border-gray-600"
        >
          <option value="">All Roles</option>
          <option value="regular">Regular</option>
          <option value="admin">Admin</option>
        </select>
        <button
          onClick={() => {
            setSearchTerm("");
            setSelectedRole("");
            setCurrentPage(1);
          }}
          className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
        >
          Clear Filters
        </button>
      </div>

      <div className="overflow-x-auto bg-white/5 border border-white/10 rounded-lg">
        <table className="w-full text-sm text-gray-300">
          <thead className="bg-white/10 border-b border-white/10">
            <tr>
              <th className="px-6 py-3 text-left cursor-pointer hover:bg-white/20" onClick={() => toggleSort("email")}>
                Email {sortField === "email" && (sortOrder === "asc" ? "↑" : "↓")}
              </th>
              <th className="px-6 py-3 text-left cursor-pointer hover:bg-white/20" onClick={() => toggleSort("username")}>
                Username {sortField === "username" && (sortOrder === "asc" ? "↑" : "↓")}
              </th>
              <th className="px-6 py-3 text-left cursor-pointer hover:bg-white/20" onClick={() => toggleSort("role")}>
                Role {sortField === "role" && (sortOrder === "asc" ? "↑" : "↓")}
              </th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {paginatedUsers.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-400">
                  No users found
                </td>
              </tr>
            ) : (
              paginatedUsers.map((user) => (
                <tr key={user.id} className="hover:bg-white/5">
                  <td className="px-6 py-4 font-semibold text-white">{user.email}</td>
                  <td className="px-6 py-4">{user.username || "—"}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        user.role === "admin" ? "bg-purple-500/20 text-purple-300" : "bg-blue-500/20 text-blue-300"
                      }`}
                    >
                      {user.role || "regular"}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex gap-2">
                    <button
                      onClick={() => openModal(user)}
                      className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded text-xs hover:bg-blue-500/30"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="px-3 py-1 bg-red-500/20 text-red-300 rounded text-xs hover:bg-red-500/30"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-lg p-4">
          <span className="text-gray-300">
            Page {currentPage} of {totalPages} ({sortedUsers.length} items)
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg disabled:opacity-50"
            >
              Previous
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-2 rounded-lg ${
                  currentPage === page ? "bg-indigo-600 text-white" : "bg-white/10 text-gray-300 hover:bg-white/20"
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-zinc-900 p-6 rounded-lg w-full max-w-md">
            <h3 className="text-lg font-semibold text-white mb-4">{editingId ? "Edit User" : "Create New User"}</h3>
            <div className="grid grid-cols-1 gap-4">
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="px-4 py-2 bg-zinc-800 text-white rounded-lg border border-gray-600"
                disabled={!!editingId}
              />
              <input
                type="text"
                placeholder="Username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="px-4 py-2 bg-zinc-800 text-white rounded-lg border border-gray-600"
              />
              <input
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="px-4 py-2 bg-zinc-800 text-white rounded-lg border border-gray-600"
              />
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as "admin" | "regular" })}
                className="px-4 py-2 bg-zinc-800 text-white rounded-lg border border-gray-600"
              >
                <option value="regular">Regular User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={closeModal} className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition">
                Cancel
              </button>
              <button onClick={handleAddOrUpdate} className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
                {editingId ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
