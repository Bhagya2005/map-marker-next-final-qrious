"use client";

import { useState, useEffect } from "react";
import { showSuccess, showError } from "@/utils/toast";

export function useUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    role: "regular",
  });

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/users?page=${currentPage}&search=${searchTerm}&role=${selectedRole}`
      );
      const data = await res.json();
      setUsers(data.users || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      showError("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [currentPage, selectedRole]);

  const handleAddOrUpdate = async () => {
    if (!formData.email || (!editingId && !formData.password))
      return showError("Email and password are required");

    const method = editingId ? "PATCH" : "POST";
    const url = editingId ? `/api/users/${editingId}` : "/api/users";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      showSuccess(editingId ? "User updated" : "User created");
      closeModal();
      loadUsers();
    } else {
      const err = await res.json();
      showError(err.error || "Operation failed");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
    if (res.ok) {
      showSuccess("User deleted");
      loadUsers();
    }
  };

  const openModal = (user?: any) => {
    if (user) {
      setEditingId(user._id);
      setFormData({
        email: user.email,
        username: user.username || "",
        password: "",
        role: user.role || "regular",
      });
    } else {
      setEditingId(null);
      setFormData({ email: "", username: "", password: "", role: "regular" });
    }
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  return {
    users, loading, currentPage, setCurrentPage, totalPages,
    searchTerm, setSearchTerm, selectedRole, setSelectedRole,
    showModal, editingId, formData, setFormData,
    loadUsers, handleAddOrUpdate, handleDelete, openModal, closeModal
  };
}