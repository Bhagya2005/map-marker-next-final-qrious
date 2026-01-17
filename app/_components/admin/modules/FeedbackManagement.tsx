"use client";

import { useEffect, useMemo, useState } from "react";
import { showSuccess } from "@/utils/toast";
import {getFeedbacks,updateFeedbackStatus,deleteFeedback,type Feedback,} from "@/utils/storage/feedback.storage";
import {Chart as ChartJS,CategoryScale,LinearScale,BarElement,ArcElement,PointElement,LineElement,Tooltip,Legend,} from "chart.js";
import { Bar, Doughnut, Line } from "react-chartjs-2";

ChartJS.register(CategoryScale,LinearScale,BarElement,ArcElement,PointElement,LineElement,Tooltip,Legend);

const ITEMS_PER_PAGE = 10;

type SortField = "date" | "rating" | "status";
type SortOrder = "asc" | "desc";

export default function FeedbackManagement() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  useEffect(() => {
    setFeedbacks(getFeedbacks());
  }, []);

  const reload = () => setFeedbacks(getFeedbacks());

  const changeStatus = (id: string, value: Feedback["status"]) => {
    updateFeedbackStatus(id, value);
    reload();
    showSuccess("Status updated");
  };

  const removeFeedback = (id: string) => {
    if (!confirm("Delete this feedback?")) return;
    deleteFeedback(id);
    reload();
    showSuccess("Feedback deleted");
  };

  const filtered = useMemo(() => {
    const term = search.toLowerCase();
    return feedbacks.filter((f) => {
      const title = f.title?.toLowerCase() ?? "";
      const message = f.message?.toLowerCase() ?? "";
      return (
        (title.includes(term) || message.includes(term)) &&
        (!category || f.category === category) &&
        (!status || f.status === status)
      );
    });
  }, [feedbacks, search, category, status]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      let aVal: number | string;
      let bVal: number | string;

      switch (sortField) {
        case "rating":
          aVal = a.rating;
          bVal = b.rating;
          break;
        case "status":
          aVal = a.status;
          bVal = b.status;
          break;
        default:
          aVal = new Date(a.createdAt).getTime();
          bVal = new Date(b.createdAt).getTime();
      }

      return sortOrder === "asc" ? (aVal > bVal ? 1 : -1) : aVal < bVal ? 1 : -1;
    });
  }, [filtered, sortField, sortOrder]);

  const totalPages = Math.ceil(sorted.length / ITEMS_PER_PAGE);
  const paginated = sorted.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder((o) => (o === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
    setCurrentPage(1);
  };

  const ratingData = {
    labels: ["1", "2", "3", "4", "5"],
    datasets: [
      {
        data: [1, 2, 3, 4, 5].map(
          (r) => feedbacks.filter((f) => f.rating === r).length
        ),
        backgroundColor: "#facc15",
      },
    ],
  };

  const statusData = {
    labels: ["Open", "In Progress", "Resolved", "Closed"],
    datasets: [
      {
        data: [
          feedbacks.filter((f) => f.status === "open").length,
          feedbacks.filter((f) => f.status === "in-progress").length,
          feedbacks.filter((f) => f.status === "resolved").length,
          feedbacks.filter((f) => f.status === "closed").length,
        ],
        backgroundColor: ["#ef4444", "#f59e0b", "#22c55e", "#64748b"],
      },
    ],
  };

  const timelineData = {
    labels: feedbacks.map((f) => new Date(f.createdAt).toLocaleDateString()),
    datasets: [
      {
        label: "Feedback Count",
        data: feedbacks.map((_, i) => i + 1),
        borderColor: "#6366f1",
        backgroundColor: "rgba(99,102,241,0.2)",
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="p-8 space-y-10">
      <div className="grid md:grid-cols-4 gap-4 bg-white/5 p-4 rounded-xl border border-white/10">
        <input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          placeholder="Search feedback..."
          className="px-4 py-2 bg-zinc-900 text-white rounded-lg border border-gray-700"
        />
        <select
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setCurrentPage(1);
          }}
          className="px-4 py-2 bg-zinc-900 text-white rounded-lg border border-gray-700"
        >
          <option value="">All Categories</option>
          <option value="bug">Bug</option>
          <option value="feature">Feature</option>
          <option value="improvement">Improvement</option>
          <option value="other">Other</option>
        </select>
        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setCurrentPage(1);
          }}
          className="px-4 py-2 bg-zinc-900 text-white rounded-lg border border-gray-700"
        >
          <option value="">All Status</option>
          <option value="open">Open</option>
          <option value="in-progress">In Progress</option>
          <option value="resolved">Resolved</option>
          <option value="closed">Closed</option>
        </select>
        <button
          onClick={() => {
            setSearch("");
            setCategory("");
            setStatus("");
            setCurrentPage(1);
          }}
          className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-4 py-2"
        >
          Clear Filters
        </button>
      </div>

      <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
        <table className="w-full text-sm text-gray-300">
          <thead className="bg-white/10">
            <tr>
              <th className="px-6 py-4 text-left">Title</th>
              <th className="px-6 py-4 text-left">Message</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4 cursor-pointer" onClick={() => toggleSort("rating")}>Rating</th>
              <th className="px-6 py-4 cursor-pointer" onClick={() => toggleSort("status")}>Status</th>
              <th className="px-6 py-4 cursor-pointer" onClick={() => toggleSort("date")}>Date</th>
              <th className="px-6 py-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 && (
              <tr>
                <td colSpan={7} className="py-10 text-center text-gray-400">
                  No feedback found
                </td>
              </tr>
            )}
            {paginated.map((f, i) => (
              <tr key={`${f.id}-${i}`} className="border-t border-white/5 hover:bg-white/5">
                <td className="px-6 py-4">{f.title || "—"}</td>
                <td className="px-6 py-4 max-w-xs truncate">{f.message || "—"}</td>
                <td className="px-6 py-4 capitalize">{f.category}</td>
                <td className="px-6 py-4">{f.rating}</td>
                <td className="px-6 py-4">
                  <select
                    value={f.status}
                    onChange={(e) =>
                      changeStatus(f.id, e.target.value as Feedback["status"])
                    }
                    className="bg-zinc-900 text-white rounded px-2 py-1 border border-gray-700"
                  >
                    <option value="open">Open</option>
                    <option value="in-progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                </td>
                <td className="px-6 py-4">
                  {new Date(f.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => removeFeedback(f.id)}
                    className="text-red-400 hover:text-red-500"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-6 pt-6 border-t border-white/10">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white/5 p-5 rounded-xl border border-white/10">
            <h4 className="text-white mb-4">Rating Distribution</h4>
            <Bar data={ratingData} />
          </div>

          <div className="bg-white/5 p-5 rounded-xl border border-white/10">
            <h4 className="text-white mb-4">Status Overview</h4>
            <Doughnut data={statusData} />
          </div>

          <div className="bg-white/5 p-5 rounded-xl border border-white/10">
            <h4 className="text-white mb-4">Feedback Timeline</h4>
            <Line data={timelineData} />
          </div>
        </div>
      </div>
    </div>
  );
}
