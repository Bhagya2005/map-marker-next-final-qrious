"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getCurrentUser, logoutUser } from "@/utils/storage/user.storage";
import Sidebar from "@/app/_components/admin/Sidebar";
import UserManagement from "@/app/_components/admin/modules/UsersManagement";
import PinManagement from "@/app/_components/admin/modules/PinManagment";
import FeedbackManagement from "@/app/_components/admin/modules/FeedbackManagement";
import WalkthroughManagement from "@/app/_components/admin/modules/WalkthroughsManagement";

type TabType = "users" | "pins" | "feedbacks" | "walkthroughs" | "categories";

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>("users");

  useEffect(() => {
    const verifyAuth = () => {
      const data = localStorage.getItem("user");
      if (data) {
        const parsed = JSON.parse(data);
        if (parsed.role === "admin") {
          setUser(parsed);
          setLoading(false);
          return true;
        } else {
          router.replace("/");
          return true;
        }
      }
      return false;
    };

    const found = verifyAuth();

    if (!found) {
      let attempts = 0;
      const interval = setInterval(() => {
        attempts++;
        if (verifyAuth() || attempts > 5) clearInterval(interval);
        if (attempts > 5 && !localStorage.getItem("user")) router.replace("/login");
      }, 300);
      return () => clearInterval(interval);
    }
  }, [router]);

  const handleLogout = () => {
    logoutUser();
    window.location.href = "/login";
  };

  if (loading) {
    return (
      <div className="h-screen bg-[#09090b] flex flex-col items-center justify-center text-white">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="animate-pulse text-zinc-400">Syncing Admin Session...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#09090b] text-zinc-100 overflow-hidden">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="flex-1 flex flex-col min-w-0">
     
        <header className="h-16 border-b border-white/10 bg-zinc-900/50 flex items-center justify-between px-8">
          <div>
            <h2 className="text-sm font-medium text-zinc-400 uppercase tracking-widest">Management</h2>
            <h1 className="text-xl font-bold capitalize">{activeTab}</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium">{user?.username}</p>
              <p className="text-[10px] text-green-500 uppercase font-bold">Administrator</p>
            </div>
            <button
              onClick={handleLogout}
              className="ml-4 px-4 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 rounded-md text-sm transition-all"
            >
              Sign Out
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div className="max-w-7xl mx-auto">
            {activeTab === "users" && <UserManagement />}
            {activeTab === "pins" && <PinManagement />}
            {activeTab === "feedbacks" && <FeedbackManagement />}
            {activeTab === "walkthroughs" && <WalkthroughManagement />}
            
            {activeTab === "categories" && (
              <div className="p-20 text-center border-2 border-dashed border-white/5 rounded-xl">
                <p className="text-zinc-500">Category management coming soon...</p>
              </div>
            )}
          </div>
        </main>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #27272a;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #3f3f46;
        }
      `}</style>
    </div>
  );
}