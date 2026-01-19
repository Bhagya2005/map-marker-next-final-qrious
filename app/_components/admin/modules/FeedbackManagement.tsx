"use client";

import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, PointElement, LineElement, Tooltip, Legend } from "chart.js";
import { useFeedback } from "@/hooks/use-feedback";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, PointElement, LineElement, Tooltip, Legend);

export default function FeedbackManagement() {
  const {
    feedbacks, loading, currentPage, setCurrentPage, totalPages,
    search, setSearch, setCategory, setStatus,
    fetchFeedbacks, changeStatus, removeFeedback, ratingData
  } = useFeedback();

  return (
    <div className="p-8 space-y-10">
      <div className="grid md:grid-cols-4 gap-4 bg-zinc-900 p-4 rounded-xl border border-white/10">
        <input 
          placeholder="Search..." 
          className="bg-zinc-800 p-2 rounded border border-white/10 text-sm text-white"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && fetchFeedbacks()}
        />
        <select className="bg-zinc-800 p-2 rounded border border-white/10 text-sm text-white" onChange={(e) => setCategory(e.target.value)}>
          <option value="">All Categories</option>
          <option value="bug">Bug</option>
          <option value="feature">Feature</option>
        </select>
        <select className="bg-zinc-800 p-2 rounded border border-white/10 text-sm text-white" onChange={(e) => setStatus(e.target.value)}>
          <option value="">All Status</option>
          <option value="open">Open</option>
          <option value="resolved">Resolved</option>
        </select>
        <button onClick={fetchFeedbacks} className="bg-indigo-600 rounded font-bold text-white hover:bg-indigo-500 transition-colors">Apply Filter</button>
      </div>

      <div className="bg-zinc-900 border border-white/10 rounded-xl overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-white/5 text-zinc-400">
            <tr>
              <th className="p-4">Feedback</th>
              <th className="p-4">Category</th>
              <th className="p-4">Rating</th>
              <th className="p-4">Status</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? (
              <tr><td colSpan={5} className="p-10 text-center animate-pulse text-zinc-500">Updating list...</td></tr>
            ) : feedbacks.map((f: any) => (
              <tr key={f._id} className="hover:bg-white/5">
                <td className="p-4">
                  <div className="text-white font-bold">{f.title}</div>
                  <div className="text-xs text-zinc-500 truncate max-w-xs">{f.message}</div>
                </td>
                <td className="p-4 capitalize text-zinc-400">{f.category}</td>
                <td className="p-4 text-yellow-500">{"★".repeat(f.rating)}</td>
                <td className="p-4">
                  <select 
                    value={f.status} 
                    onChange={(e) => changeStatus(f._id, e.target.value)}
                    className="bg-zinc-800 border border-white/10 rounded text-xs p-1 text-white"
                  >
                    <option value="open">Open</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                </td>
                <td className="p-4">
                  <button onClick={() => removeFeedback(f._id)} className="text-red-500 hover:text-red-400 transition-colors">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="p-4 flex justify-between items-center bg-white/5 border-t border-white/10">
          <span className="text-xs text-zinc-500">Page {currentPage} of {totalPages}</span>
          <div className="flex gap-2">
            <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="px-3 py-1 bg-zinc-800 rounded disabled:opacity-30 text-xs text-white">Prev</button>
            <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className="px-3 py-1 bg-zinc-800 rounded disabled:opacity-30 text-xs text-white">Next</button>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-zinc-900 p-5 rounded-xl border border-white/10">
            <h4 className="text-white mb-4 text-sm font-bold">Rating Distribution</h4>
            <Bar data={ratingData} options={{ responsive: true }} />
          </div>
      </div>
    </div>
  );
}