"use client";

import { useEffect, useState, useMemo } from "react";
import { showSuccess, showError } from "@/utils/toast";

export function useFeedback() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");

  const fetchFeedbacks = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams({
        page: String(currentPage),
        search,
        category,
        status,
      }).toString();
      
      const res = await fetch(`/api/feedback?${query}`);
      const data = await res.json();
      setFeedbacks(data.feedbacks || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      showError("Failed to sync with database");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, [currentPage, category, status]);

  const changeStatus = async (id: string, newStatus: string) => {
    const res = await fetch(`/api/feedback/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    if (res.ok) {
      showSuccess("Status Updated");
      fetchFeedbacks();
    }
  };

  const removeFeedback = async (id: string) => {
    if (!confirm("Permanent delete?")) return;
    const res = await fetch(`/api/feedback/${id}`, { method: "DELETE" });
    if (res.ok) {
      showSuccess("Deleted");
      fetchFeedbacks();
    }
  };

  const ratingData = useMemo(() => ({
    labels: ["1", "2", "3", "4", "5"],
    datasets: [{
      label: "Ratings",
      data: [1, 2, 3, 4, 5].map(r => feedbacks.filter((f: any) => f.rating === r).length),
      backgroundColor: "#facc15",
    }]
  }), [feedbacks]);

  return {
    feedbacks,
    loading,
    currentPage,
    setCurrentPage,
    totalPages,
    search,
    setSearch,
    setCategory,
    setStatus,
    fetchFeedbacks,
    changeStatus,
    removeFeedback,
    ratingData
  };
}