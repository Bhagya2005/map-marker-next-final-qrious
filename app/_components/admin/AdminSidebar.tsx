"use client";

import { usePathname, useRouter } from "next/navigation";

type AdminSidebarProps = {
  onLogout: () => void;
};

export default function AdminSidebar({ onLogout }: AdminSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const tabs = [
    { label: "Dashboard", route: "/admin/dashboard" },
    { label: "Manage Users", route: "/admin/users" },
    { label: "Walkthroughs", route: "/admin/walkthroughs" },
    { label: "Feedback", route: "/admin/feedback" },
  ];

  return (
    <div className="w-64  bg-white/5 border-r border-white/10 p-6 flex flex-col">
      <div className="mb-8">
        <h2 className="text-2xl font-bold">Admin Panel</h2>
      </div>

      <div className="flex-1 space-y-2">
        {tabs.map((tab) => {
          const isActive = pathname === tab.route;

          return (
            <button
              key={tab.route}
              onClick={() => router.push(tab.route)}
              className={`w-full text-left px-4 py-3 rounded-lg 
                ${
                  isActive
                    ? "bg-blue-500/30 border border-blue-400/50 text-blue-100"
                    : "hover:bg-white/5 text-gray-300"
                }
              `}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
