"use client";

import { useState, useEffect } from "react";
import { arrayMove, DragEndEvent } from "@dnd-kit/sortable";
import { showSuccess, showError } from "@/utils/toast";

export function useWalkthroughs() {
  const [walkthroughs, setWalkthroughs] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ title: "", description: "", videoUrl: "" });

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/walkthroughs?page=${currentPage}&search=${search}`);
      const data = await res.json();
      setWalkthroughs(data.walkthroughs || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      showError("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [currentPage, search]);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = walkthroughs.findIndex((w) => w._id === active.id);
    const newIndex = walkthroughs.findIndex((w) => w._id === over.id);

    const newArray = arrayMove(walkthroughs, oldIndex, newIndex);
    setWalkthroughs(newArray);

    const res = await fetch("/api/walkthroughs", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderedIds: newArray.map((w) => w._id) }),
    });

    if (!res.ok) showError("Order sync failed");
  };

  const handleSave = async () => {
    if (!formData.title) return showError("Title is required");
    const method = editingId ? "PATCH" : "POST";
    const url = editingId ? `/api/walkthroughs/${editingId}` : "/api/walkthroughs";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      showSuccess(editingId ? "Updated!" : "Created!");
      setShowModal(false);
      loadData();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete?")) return;
    const res = await fetch(`/api/walkthroughs/${id}`, { method: "DELETE" });
    if (res.ok) {
      showSuccess("Deleted");
      loadData();
    }
  };

  const openModal = (w?: any) => {
    if (w) {
      setEditingId(w._id);
      setFormData(w);
    } else {
      setEditingId(null);
      setFormData({ title: "", description: "", videoUrl: "" });
    }
    setShowModal(true);
  };

  return {
    walkthroughs, setWalkthroughs, loading, currentPage, setCurrentPage, totalPages,
    search, setSearch, showModal, setShowModal, formData, setFormData, editingId,
    handleDragEnd, handleSave, handleDelete, openModal
  };
}