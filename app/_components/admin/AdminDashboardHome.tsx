"use client";

import { useState, useEffect } from "react";
import { getCurrentUser } from "@/utils/storage/user.storage";

export default function AdminDashboardHome() {
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({
    totalPins: 0,
    totalUsers: 0,
    totalWalkthroughs: 0,
    totalFeedback: 0,
  });

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);

    const pins = JSON.parse(localStorage.getItem("pins") || "[]");
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const walkthroughs = JSON.parse(localStorage.getItem("walkthroughs") || "[]");
    const feedback = JSON.parse(localStorage.getItem("feedback") || "[]");

    setStats({
      totalPins: pins.length,
      totalUsers: users.length,
      totalWalkthroughs: walkthroughs.length,
      totalFeedback: feedback.length,
    });
  }, []);

  return (
    <div className="p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white/5 border border-white/10 rounded-lg p-6">
          <h3 className="text-gray-400 text-sm uppercase tracking-wider">Total Pins</h3>
          <p className="text-4xl font-bold text-blue-400 mt-2">{stats.totalPins}</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-lg p-6">
          <h3 className="text-gray-400 text-sm uppercase tracking-wider">Total Users</h3>
          <p className="text-4xl font-bold text-purple-400 mt-2">{stats.totalUsers}</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-lg p-6">
          <h3 className="text-gray-400 text-sm uppercase tracking-wider">Walkthroughs</h3>
          <p className="text-4xl font-bold text-green-400 mt-2">{stats.totalWalkthroughs}</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-lg p-6">
          <h3 className="text-gray-400 text-sm uppercase tracking-wider">Feedback</h3>
          <p className="text-4xl font-bold text-orange-400 mt-2">{stats.totalFeedback}</p>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-lg p-6">
        <h2 className="text-xl font-bold text-white mb-4">Welcome {user?.username}</h2>
        <p className="text-gray-300 mb-4">
          You have full access to manage all aspects of the Map Marker application.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300 text-sm">
          <p>Manage and create new pins</p>
          <p>Control user accounts and roles</p>
          <p>Create guided walkthroughs with videos and points</p>
          <p>Manage pin categories</p>
          <p>View and analyze user feedback</p>
          <p>Customize colors and themes</p>
        </div>
      </div>
    </div>
  );
}
