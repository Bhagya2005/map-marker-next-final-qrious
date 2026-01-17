"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getCurrentUser, logoutUser } from "@/utils/storage/user.storage";
import AdminDashboardHome from "@/app/_components/admin/AdminDashboardHome";

export default function AdminDashboard() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = getCurrentUser();
    if (!user || user.role !== 'admin') {
      router.push('/login');
    } else {
      setIsAuthorized(true);
      setLoading(false);
    }
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center ">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  const handleLogout = () => {
    logoutUser();
    router.push('/login');
  };

  return (
    <div className="flex h-screen bg-zinc-900">
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white/5 border-b border-white/10 p-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-300">Welcome Admin</span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500/20 border border-red-500/50 text-red-300 rounded-lg hover:bg-red-500/30 transition-all"
            >
              Logout
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-auto">
          <AdminDashboardHome />
        </main>
      </div>
    </div>
  );
}
