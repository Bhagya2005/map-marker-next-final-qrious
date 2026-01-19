"use client";

import { useState, useEffect } from "react";
import { showSuccess, showError } from "@/utils/toast";

export function usePins() {
  const [pins, setPins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ 
    name: "", category: "", lat: "", lng: "", color: "#3b82f6" 
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/pins?page=${page}&search=${search}&category=${category}`);
      const data = await res.json();
      setPins(data.pins || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      showError("Failed to fetch pins");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, category]);

  const openCreateModal = () => {
    setEditingId(null);
    setFormData({ name: "", category: "", lat: "", lng: "", color: "#3b82f6" });
    setShowModal(true);
  };

  const openEditModal = (pin: any) => {
    setEditingId(pin._id);
    setFormData(pin);
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingId ? `/api/pins/${editingId}` : "/api/pins";
    const method = editingId ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      showSuccess("Pin saved!");
      setShowModal(false);
      fetchData();
    } else {
      showError("Error saving pin");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    const res = await fetch(`/api/pins/${id}`, { method: "DELETE" });
    if (res.ok) {
      showSuccess("Deleted");
      fetchData();
    }
  };

  return {
    pins, loading, search, setSearch, category, setCategory,
    page, setPage, totalPages, showModal, setShowModal,
    formData, setFormData, editingId, fetchData,
    handleSave, handleDelete, openCreateModal, openEditModal
  };
}